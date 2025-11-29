import os
from typing import Optional

from dotenv import load_dotenv
from pycardano import (
    BlockFrostChainContext,
    PaymentSigningKey,
    PaymentVerificationKey,
    Address,
    TransactionBuilder,
    TransactionOutput,
    Network,
    ScriptPubKey,
    NativeScript,
    MultiAsset,
    Asset,
)

load_dotenv()

BLOCKFROST_PROJECT_ID_PREVIEW = os.getenv("BLOCKFROST_PROJECT_ID_PREVIEW")
ENABLE_REAL_MINT = os.getenv("ENABLE_REAL_MINT", "false").lower() == "true"
BACKEND_SKEY_HEX = os.getenv("BACKEND_SKEY_HEX")
BACKEND_ADDRESS = os.getenv("BACKEND_ADDRESS")


class RealNftMinter:
    """
    Minimal PyCardano-based NFT minter skeleton.
    For hackathon:
      - assumes a single backend wallet
      - mints a 1-of-1 NFT for a given tx_hash or invoice_id
    """

    def __init__(self):
        if not ENABLE_REAL_MINT:
            raise RuntimeError("Real minting is disabled (ENABLE_REAL_MINT=false)")

        if not BLOCKFROST_PROJECT_ID_PREVIEW:
            raise RuntimeError("BLOCKFROST_PROJECT_ID_PREVIEW missing")

        if not BACKEND_SKEY_HEX or not BACKEND_ADDRESS:
            raise RuntimeError("BACKEND_SKEY_HEX/BACKEND_ADDRESS missing for minter")

        self.context = BlockFrostChainContext(
            project_id=BLOCKFROST_PROJECT_ID_PREVIEW,
            base_url="https://cardano-preview.blockfrost.io/api/v0",
            network=Network.TESTNET,  # preview is treated as testnet in PyCardano
        )

        self.skey = PaymentSigningKey.from_hex(BACKEND_SKEY_HEX)
        # derive verification key
        self.vkey = PaymentVerificationKey.from_signing_key(self.skey)
        self.address = Address.from_primitive(BACKEND_ADDRESS)

        # very simple policy: backend pubkey script
        self.policy = ScriptPubKey(self.vkey.hash())
        self.policy_id = self.policy.hash().hex()

    def mint_receipt_nft(self, asset_name: str) -> str:
        """
        Asset name: typically derived from tx_hash or invoice_id.
        Returns: "<policy_id>.<asset_name_hex>"
        """
        asset_name_bytes = asset_name.encode("utf-8")
        asset_name_hex = asset_name_bytes.hex()

        builder = TransactionBuilder(self.context)
        builder.add_input_address(self.address)

        ma = MultiAsset.from_primitive(
            {
                bytes.fromhex(self.policy_id): {
                    asset_name_bytes: 1,  # mint exactly 1
                }
            }
        )

        builder.mint = ma
        builder.native_scripts = [self.policy]

        # send NFT back to backend address (could be customer/merchant instead)
        builder.add_output(TransactionOutput(self.address, ma=ma))

        tx = builder.build_and_sign(
            signing_keys=[self.skey],
            change_address=self.address,
        )

        tx_hash = self.context.submit_tx(tx)

        # For simplicity we ignore tx_hash here, but you can store it.
        return f"{self.policy_id}.{asset_name_hex}"


def try_mint_receipt_nft(asset_name: str) -> Optional[str]:
    """
    Helper used from main.py:
      - If real minting disabled or misconfigured, returns None
      - If enabled and succeeds, returns real asset id
    """
    if not ENABLE_REAL_MINT:
        return None

    try:
        minter = RealNftMinter()
        return minter.mint_receipt_nft(asset_name)
    except Exception as e:
        # in hackathon, log and fall back
        print("[RealNftMinter] Error:", e)
        return None
