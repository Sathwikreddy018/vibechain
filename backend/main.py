import os
import secrets
from typing import Optional, List

from dotenv import load_dotenv

from fastapi import FastAPI, HTTPException, Depends, Query, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    create_engine,
    desc,
)
from sqlalchemy.orm import declarative_base, sessionmaker, Session

import requests

# ============ ENV + DB SETUP ============

load_dotenv()  # load .env from current directory

BLOCKFROST_PROJECT_ID_PREVIEW = os.getenv("BLOCKFROST_PROJECT_ID_PREVIEW")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./vibechain.db")

if not BLOCKFROST_PROJECT_ID_PREVIEW:
    raise RuntimeError("BLOCKFROST_PROJECT_ID_PREVIEW is not set in .env")

# Support both SQLite (local dev) and Oracle (XE / Docker)
if DATABASE_URL.startswith("sqlite"):
    # Local SQLite file (default)
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
    )
else:
    # Oracle XE or any other RDBMS – no SQLite-specific args
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()



# ============ DB MODELS ============


class UserReputation(Base):
    __tablename__ = "user_reputation"

    id = Column(Integer, primary_key=True, index=True)
    address = Column(String, unique=True, index=True, nullable=False)
    score = Column(Float, default=0.0)


class PaymentReceipt(Base):
    __tablename__ = "payment_receipts"

    id = Column(Integer, primary_key=True, index=True)
    tx_hash = Column(String, unique=True, index=True, nullable=False)
    payer_address = Column(String, index=True, nullable=False)
    merchant_address = Column(String, index=True, nullable=False)
    amount_lovelace = Column(Integer, nullable=False)
    nft_asset_id = Column(String, nullable=True)  # policy_id.asset_name


class InvoiceNFT(Base):
    """
    Represents an invoice that could be turned into an NFT.
    For hackathon we store it in DB and generate a stub NFT id.
    """
    __tablename__ = "invoice_nfts"

    id = Column(Integer, primary_key=True, index=True)
    invoice_id = Column(String, unique=True, index=True, nullable=False)
    merchant_address = Column(String, index=True, nullable=False)
    customer_address = Column(String, index=True, nullable=True)
    amount_lovelace = Column(Integer, nullable=False)
    description = Column(String, nullable=True)
    status = Column(String, default="pending")  # pending, paid, cancelled
    nft_asset_id = Column(String, nullable=True)  # policy_id.asset_name


class Agent(Base):
    __tablename__ = "agents"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    api_key = Column(String, unique=True, index=True, nullable=False)
    owner_address = Column(String, nullable=True)          # e.g. wallet address
    reputation_address = Column(String, nullable=True)     # address used for scoring


class AgentPayment(Base):
    __tablename__ = "agent_payments"

    id = Column(Integer, primary_key=True, index=True)
    agent_id = Column(Integer, index=True, nullable=False)
    merchant_address = Column(String, index=True, nullable=False)
    amount_lovelace = Column(Integer, nullable=False)
    tx_hash = Column(String, nullable=True)                # off-chain or on-chain hash
    receipt_nft_asset_id = Column(String, nullable=True)


Base.metadata.create_all(bind=engine)


# ============ Pydantic SCHEMAS ============


class MintReceiptRequest(BaseModel):
    tx_hash: str
    payer_address: str
    merchant_address: str
    amount_lovelace: int


class MintReceiptResponse(BaseModel):
    tx_hash: str
    nft_asset_id: Optional[str]
    reputation_score: float


class ReputationResponse(BaseModel):
    address: str
    score: float


class ReceiptOut(BaseModel):
    tx_hash: str
    payer_address: str
    merchant_address: str
    amount_lovelace: int
    nft_asset_id: Optional[str]

    class Config:
        from_attributes = True  # pydantic v2


class InvoiceCreate(BaseModel):
    invoice_id: str
    merchant_address: str
    customer_address: Optional[str] = None
    amount_lovelace: int
    description: Optional[str] = None


class InvoiceOut(BaseModel):
    invoice_id: str
    merchant_address: str
    customer_address: Optional[str]
    amount_lovelace: int
    description: Optional[str]
    status: str
    nft_asset_id: Optional[str]

    class Config:
        from_attributes = True


class LeaderboardEntry(BaseModel):
    address: str
    score: float


class AgentCreate(BaseModel):
    name: str
    owner_address: Optional[str] = None
    reputation_address: Optional[str] = None


class AgentOut(BaseModel):
    id: int
    name: str
    api_key: str
    owner_address: Optional[str]
    reputation_address: Optional[str]

    class Config:
        from_attributes = True


class AgentPayRequest(BaseModel):
    merchant_address: str
    amount_lovelace: int
    tx_hash: Optional[str] = None  # optional external hash


class AgentPayResponse(BaseModel):
    agent_id: int
    merchant_address: str
    amount_lovelace: int
    tx_hash: str
    receipt_nft_asset_id: str
    reputation_score: float


class AgentPaymentOut(BaseModel):
    id: int
    merchant_address: str
    amount_lovelace: int
    tx_hash: Optional[str]
    receipt_nft_asset_id: Optional[str]

    class Config:
        from_attributes = True


# ============ HELPERS ============


def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def verify_tx_exists_on_blockfrost(tx_hash: str) -> bool:
    """
    Minimal check: confirm tx exists on preview via Blockfrost.
    """
    url = f"https://cardano-preview.blockfrost.io/api/v0/txs/{tx_hash}"
    headers = {"project_id": BLOCKFROST_PROJECT_ID_PREVIEW}
    try:
        r = requests.get(url, headers=headers, timeout=20)
    except Exception:
        return False
    return r.status_code == 200


def update_reputation(db: Session, address: str, delta: float = 1.0) -> float:
    rep = db.query(UserReputation).filter(UserReputation.address == address).first()
    if rep is None:
        rep = UserReputation(address=address, score=0.0)
        db.add(rep)
        db.commit()
        db.refresh(rep)

    rep.score += delta
    db.add(rep)
    db.commit()
    db.refresh(rep)
    return rep.score


def fake_mint_nft_receipt(tx_hash: str) -> str:
    """
    STUB for hackathon:
    Real implementation should use PyCardano + native script or Plutus policy.
    """
    fake_policy_id = "f" * 56  # 28-byte hex string
    asset_name_hex = tx_hash[:16]
    return f"{fake_policy_id}.{asset_name_hex}"


def fake_mint_invoice_nft(invoice_id: str) -> str:
    fake_policy_id = "e" * 56
    asset_name_hex = invoice_id.encode("utf-8").hex()[:16]
    return f"{fake_policy_id}.{asset_name_hex}"


def apply_invoice_reputation(db: Session, inv: InvoiceNFT) -> None:
    """
    Simple reputation model for paid invoices:
      - Merchant +2
      - Customer +1 (if present)
    """
    update_reputation(db, inv.merchant_address, delta=2.0)
    if inv.customer_address:
        update_reputation(db, inv.customer_address, delta=1.0)


def generate_api_key() -> str:
    # simple 32-byte hex token
    return secrets.token_hex(32)


# ============ FASTAPI APP SETUP ============


app = FastAPI(title="VibeChain Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # OK for hackathon, tighten for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ BASIC HEALTH ============


@app.get("/api/health")
def health():
    return {"status": "ok"}


# ============ RECEIPTS + REPUTATION ============


@app.post("/api/mint-receipt", response_model=MintReceiptResponse)
def mint_receipt(payload: MintReceiptRequest, db: Session = Depends(get_db)):
    """
    Called after a payment:
    - Verifies tx on preview via Blockfrost
    - Creates a PaymentReceipt row
    - Fake mints an NFT receipt
    - Updates user reputation
    """
    # 1) Avoid duplicates
    existing = (
        db.query(PaymentReceipt)
        .filter(PaymentReceipt.tx_hash == payload.tx_hash)
        .first()
    )
    if existing:
        rep = (
            db.query(UserReputation)
            .filter(UserReputation.address == payload.payer_address)
            .first()
        )
        return MintReceiptResponse(
            tx_hash=existing.tx_hash,
            nft_asset_id=existing.nft_asset_id,
            reputation_score=rep.score if rep else 0.0,
        )

    # 2) On-chain existence check
    if not verify_tx_exists_on_blockfrost(payload.tx_hash):
        raise HTTPException(
            status_code=400,
            detail="Transaction not found on preview network",
        )

    # 3) Mint receipt NFT (stub)
    nft_asset_id = fake_mint_nft_receipt(payload.tx_hash)

    # 4) Save receipt
    receipt = PaymentReceipt(
        tx_hash=payload.tx_hash,
        payer_address=payload.payer_address,
        merchant_address=payload.merchant_address,
        amount_lovelace=payload.amount_lovelace,
        nft_asset_id=nft_asset_id,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    # 5) Update reputation
    new_score = update_reputation(db, payload.payer_address, delta=1.0)

    return MintReceiptResponse(
        tx_hash=payload.tx_hash,
        nft_asset_id=nft_asset_id,
        reputation_score=new_score,
    )


@app.get("/api/reputation/{address}", response_model=ReputationResponse)
def get_reputation(address: str, db: Session = Depends(get_db)):
    rep = db.query(UserReputation).filter(UserReputation.address == address).first()
    if not rep:
        return ReputationResponse(address=address, score=0.0)
    return ReputationResponse(address=rep.address, score=rep.score)


@app.get("/api/reputation/leaderboard", response_model=List[LeaderboardEntry])
def get_leaderboard(
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Top addresses by score.
    """
    rows = (
        db.query(UserReputation)
        .order_by(desc(UserReputation.score))
        .limit(limit)
        .all()
    )
    return [LeaderboardEntry(address=r.address, score=r.score) for r in rows]


@app.get("/api/receipts/by-user/{address}", response_model=List[ReceiptOut])
def list_receipts_by_user(address: str, db: Session = Depends(get_db)):
    receipts = (
        db.query(PaymentReceipt)
        .filter(PaymentReceipt.payer_address == address)
        .order_by(desc(PaymentReceipt.id))
        .all()
    )
    return receipts


@app.get("/api/receipts/by-merchant/{address}", response_model=List[ReceiptOut])
def list_receipts_by_merchant(address: str, db: Session = Depends(get_db)):
    receipts = (
        db.query(PaymentReceipt)
        .filter(PaymentReceipt.merchant_address == address)
        .order_by(desc(PaymentReceipt.id))
        .all()
    )
    return receipts


# ============ INVOICES (LAYER 2) ============


@app.post("/api/invoices", response_model=InvoiceOut)
def create_invoice(payload: InvoiceCreate, db: Session = Depends(get_db)):
    """
    Create an invoice record.
    For now:
      - store it in DB
      - generate a fake NFT id (to simulate invoice NFT)
    """
    existing = (
        db.query(InvoiceNFT)
        .filter(InvoiceNFT.invoice_id == payload.invoice_id)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="invoice_id already exists")

    nft_asset_id = fake_mint_invoice_nft(payload.invoice_id)

    inv = InvoiceNFT(
        invoice_id=payload.invoice_id,
        merchant_address=payload.merchant_address,
        customer_address=payload.customer_address,
        amount_lovelace=payload.amount_lovelace,
        description=payload.description,
        status="pending",
        nft_asset_id=nft_asset_id,
    )
    db.add(inv)
    db.commit()
    db.refresh(inv)

    return inv


@app.get("/api/invoices/{merchant_address}", response_model=List[InvoiceOut])
def list_invoices_for_merchant(merchant_address: str, db: Session = Depends(get_db)):
    invoices = (
        db.query(InvoiceNFT)
        .filter(InvoiceNFT.merchant_address == merchant_address)
        .order_by(desc(InvoiceNFT.id))
        .all()
    )
    return invoices


@app.post("/api/invoices/{invoice_id}/mark-paid", response_model=InvoiceOut)
def mark_invoice_paid(invoice_id: str, db: Session = Depends(get_db)):
    """
    Mark invoice as paid + apply reputation effects once.
    """
    inv = (
        db.query(InvoiceNFT)
        .filter(InvoiceNFT.invoice_id == invoice_id)
        .first()
    )
    if not inv:
        raise HTTPException(status_code=404, detail="Invoice not found")

    if inv.status == "paid":
        # Already paid, do not double count reputation
        return inv

    inv.status = "paid"
    db.add(inv)
    db.commit()
    db.refresh(inv)

    # Apply reputation boosts
    apply_invoice_reputation(db, inv)

    return inv


# ============ AGENT RAILS (DAGCHAIN-STYLE) ============


@app.post("/api/agents", response_model=AgentOut)
def create_agent(payload: AgentCreate, db: Session = Depends(get_db)):
    """
    Register a new AI/agent that will use VibeChain rails.
    Returns an api_key that can be used for authenticated calls later.
    """
    api_key = generate_api_key()
    agent = Agent(
        name=payload.name,
        api_key=api_key,
        owner_address=payload.owner_address,
        reputation_address=payload.reputation_address,
    )
    db.add(agent)
    db.commit()
    db.refresh(agent)
    return agent


@app.post("/api/agents/{agent_id}/pay", response_model=AgentPayResponse)
def agent_pay(
    agent_id: int,
    payload: AgentPayRequest,
    db: Session = Depends(get_db),
    x_api_key: str = Header(None, alias="X-API-Key"),
):
    """
    Simulated 'agent pays merchant' rail.
    - Validates agent + API key
    - Creates a PaymentReceipt row
    - Creates an AgentPayment row
    - Updates reputation for reputation_address or owner_address
    - Uses fake mint policy to generate NFT receipt id
    """
    if x_api_key is None:
        raise HTTPException(status_code=401, detail="X-API-Key header required")

    agent = db.query(Agent).filter(Agent.id == agent_id).first()
    if not agent:
        raise HTTPException(status_code=404, detail="Agent not found")

    if agent.api_key != x_api_key:
        raise HTTPException(status_code=403, detail="Invalid API key")

    # choose who gets reputation (link agent→address)
    rep_address = agent.reputation_address or agent.owner_address
    if not rep_address:
        # fallback identifier
        rep_address = f"agent:{agent.id}"

    # Use provided tx_hash or create a stub off-chain one
    tx_hash = payload.tx_hash or f"agent-{agent.id}-tx-{secrets.token_hex(8)}"

    # Mint fake NFT receipt id
    nft_asset_id = fake_mint_nft_receipt(tx_hash)

    # Store PaymentReceipt
    receipt = PaymentReceipt(
        tx_hash=tx_hash,
        payer_address=rep_address,
        merchant_address=payload.merchant_address,
        amount_lovelace=payload.amount_lovelace,
        nft_asset_id=nft_asset_id,
    )
    db.add(receipt)
    db.commit()
    db.refresh(receipt)

    # Store AgentPayment
    agent_payment = AgentPayment(
        agent_id=agent_id,
        merchant_address=payload.merchant_address,
        amount_lovelace=payload.amount_lovelace,
        tx_hash=tx_hash,
        receipt_nft_asset_id=nft_asset_id,
    )
    db.add(agent_payment)
    db.commit()

    # Update reputation for this agent’s reputation address
    new_score = update_reputation(db, rep_address, delta=1.0)

    return AgentPayResponse(
        agent_id=agent_id,
        merchant_address=payload.merchant_address,
        amount_lovelace=payload.amount_lovelace,
        tx_hash=tx_hash,
        receipt_nft_asset_id=nft_asset_id,
        reputation_score=new_score,
    )


@app.get("/api/agents/{agent_id}/payments", response_model=List[AgentPaymentOut])
def list_agent_payments(agent_id: int, db: Session = Depends(get_db)):
    """
    List all payments initiated by a given agent.
    Useful for dashboards and analytics (like DagChain).
    """
    rows = (
        db.query(AgentPayment)
        .filter(AgentPayment.agent_id == agent_id)
        .order_by(desc(AgentPayment.id))
        .all()
    )
    return rows
