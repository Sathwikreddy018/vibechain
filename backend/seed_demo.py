from main import (
    Base,
    engine,
    SessionLocal,
    UserReputation,
    PaymentReceipt,
    InvoiceNFT,
    Agent,
    AgentPayment,
)


def reset_and_seed():
    print("Dropping existing tables...")
    Base.metadata.drop_all(bind=engine)
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Demo addresses (fake but Cardano-like)
        payer1 = "addr_test1_demo_payer1xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        payer2 = "addr_test1_demo_payer2xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
        merchant1 = "addr_test1_demo_merchant1xxxxxxxxxxxxxxxxxxxxxx"

        # Seed reputations
        rep1 = UserReputation(address=payer1, score=3.0)
        rep2 = UserReputation(address=payer2, score=1.0)
        repm = UserReputation(address=merchant1, score=5.0)

        db.add_all([rep1, rep2, repm])
        db.commit()

        # Seed payment receipts
        r1 = PaymentReceipt(
            tx_hash="tx_demo_hash_1",
            payer_address=payer1,
            merchant_address=merchant1,
            amount_lovelace=500_000,
            nft_asset_id="f" * 56 + ".1111aaaa1111aaaa",
        )
        r2 = PaymentReceipt(
            tx_hash="tx_demo_hash_2",
            payer_address=payer1,
            merchant_address=merchant1,
            amount_lovelace=800_000,
            nft_asset_id="f" * 56 + ".2222bbbb2222bbbb",
        )
        r3 = PaymentReceipt(
            tx_hash="tx_demo_hash_3",
            payer_address=payer2,
            merchant_address=merchant1,
            amount_lovelace=250_000,
            nft_asset_id="f" * 56 + ".3333cccc3333cccc",
        )

        db.add_all([r1, r2, r3])
        db.commit()

        # Seed invoices
        inv1 = InvoiceNFT(
            invoice_id="INV-001",
            merchant_address=merchant1,
            customer_address=payer1,
            amount_lovelace=1_000_000,
            description="Monthly SaaS subscription",
            status="pending",
            nft_asset_id="e" * 56 + ".aaaabbbbccccdddd",
        )
        inv2 = InvoiceNFT(
            invoice_id="INV-002",
            merchant_address=merchant1,
            customer_address=payer2,
            amount_lovelace=750_000,
            description="Consulting service",
            status="paid",
            nft_asset_id="e" * 56 + ".eeeeffff00001111",
        )

        db.add_all([inv1, inv2])
        db.commit()

        # Seed agent + agent payment
        agent = Agent(
            name="CoffeeBot",
            api_key="demo-api-key-coffeebot",
            owner_address=payer1,
            reputation_address=payer1,
        )
        db.add(agent)
        db.commit()
        db.refresh(agent)

        ap1 = AgentPayment(
            agent_id=agent.id,
            merchant_address=merchant1,
            amount_lovelace=400_000,
            tx_hash="agent-demo-tx-1",
            receipt_nft_asset_id="f" * 56 + ".deadbeefdeadbeef",
        )
        db.add(ap1)
        db.commit()

        print("Seeding complete.")
        print("Sample data:")
        print(f"  Payer1:     {payer1}")
        print(f"  Payer2:     {payer2}")
        print(f"  Merchant1:  {merchant1}")
        print(f"  Agent name: {agent.name}, id={agent.id}, api_key={agent.api_key}")
        print("  Invoices:   INV-001 (pending), INV-002 (paid)")

    finally:
        db.close()


if __name__ == "__main__":
    reset_and_seed()
