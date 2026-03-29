#!/usr/bin/env python3
"""
GenResolve - Deployment Script
Deploys the gen_resolve.py Intelligent Contract to GenLayer Testnet (Bradbury)
or a local simulator.

Requirements:
    pip install python-dotenv requests

Usage:
    python deploy.py
"""

import os
import sys
import json
import time
import subprocess
import pathlib
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Load environment variables from .env file
# ---------------------------------------------------------------------------
load_dotenv(dotenv_path=pathlib.Path(__file__).parent / ".env")

PRIVATE_KEY = os.getenv("PRIVATE_KEY")
RPC_URL = os.getenv("RPC_URL", "https://rpc.testnet.genlayer.com")  # Bradbury testnet default
NETWORK = os.getenv("NETWORK", "testnet-bradbury")  # or "simulator"

CONTRACT_FILE = pathlib.Path(__file__).parent / "gen_resolve.py"

# ---------------------------------------------------------------------------
# Validate inputs
# ---------------------------------------------------------------------------
def validate():
    if not PRIVATE_KEY:
        print("❌  ERROR: PRIVATE_KEY is not set. Please fill in your .env file.")
        sys.exit(1)
    if not CONTRACT_FILE.exists():
        print(f"❌  ERROR: Contract file not found: {CONTRACT_FILE}")
        sys.exit(1)
    print(f"✅  Config loaded")
    print(f"    Network : {NETWORK}")
    print(f"    RPC URL : {RPC_URL}")
    print(f"    Contract: {CONTRACT_FILE.name}")
    print()


# ---------------------------------------------------------------------------
# Method 1: Deploy via GenLayer CLI (recommended for testnet)
# Requires: npm install -g genlayer
# ---------------------------------------------------------------------------
def deploy_via_cli():
    print("🚀  Deploying using GenLayer CLI ...")
    print("    (Make sure you have run: npm install -g genlayer)\n")

    cmd = [
        "genlayer", "deploy",
        "--contract", str(CONTRACT_FILE),
        "--network", NETWORK,
        "--private-key", PRIVATE_KEY,
    ]

    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
        if result.returncode != 0:
            print("❌  CLI deployment failed:")
            print(result.stderr)
            return None

        output = result.stdout
        print(output)

        # Try to parse contract address from CLI output
        for line in output.splitlines():
            line_lower = line.lower()
            if "contract address" in line_lower or "deployed at" in line_lower:
                parts = line.split()
                for part in parts:
                    if part.startswith("0x") and len(part) == 42:
                        return part
        return None

    except FileNotFoundError:
        print("⚠️   GenLayer CLI not found. Falling back to RPC method...")
        return None
    except subprocess.TimeoutExpired:
        print("⚠️   CLI timed out. Try the RPC method instead.")
        return None


# ---------------------------------------------------------------------------
# Method 2: Deploy via raw JSON-RPC (works without CLI, uses gen_eth_sendTransaction)
# ---------------------------------------------------------------------------
def deploy_via_rpc():
    try:
        import requests
    except ImportError:
        print("❌  'requests' not installed. Run: pip install requests")
        sys.exit(1)

    print("🚀  Deploying via GenLayer JSON-RPC ...")

    contract_code = CONTRACT_FILE.read_text(encoding="utf-8")

    # Encode constructor args as JSON (GenResolve.__init__ takes no extra args)
    encoded_args = json.dumps([]).encode("utf-8").hex()

    payload = {
        "jsonrpc": "2.0",
        "method": "gen_sendTransaction",
        "id": 1,
        "params": [{
            "from": derive_address_from_private_key(PRIVATE_KEY),
            "to": None,                        # None = contract creation
            "value": "0x0",
            "data": {
                "contract_code": contract_code,
                "args": [],
                "leader_only": False,
            }
        }]
    }

    headers = {"Content-Type": "application/json"}

    print(f"    Sending deployment transaction to: {RPC_URL}")
    try:
        resp = requests.post(RPC_URL, json=payload, headers=headers, timeout=60)
        resp.raise_for_status()
    except requests.exceptions.RequestException as e:
        print(f"❌  RPC request failed: {e}")
        sys.exit(1)

    rpc_result = resp.json()

    if "error" in rpc_result:
        print(f"❌  RPC error: {rpc_result['error']}")
        sys.exit(1)

    tx_hash = rpc_result.get("result")
    if not tx_hash:
        print(f"❌  Unexpected RPC response: {rpc_result}")
        sys.exit(1)

    print(f"\n📄  Deployment Transaction Hash: {tx_hash}\n")
    print("⏳  Waiting for transaction to be accepted (this may take 30–120s)...")

    return wait_for_receipt(tx_hash)


# ---------------------------------------------------------------------------
# Poll for transaction receipt
# ---------------------------------------------------------------------------
def wait_for_receipt(tx_hash: str, timeout: int = 180):
    try:
        import requests
    except ImportError:
        sys.exit(1)

    deadline = time.time() + timeout
    attempt = 0

    while time.time() < deadline:
        attempt += 1
        payload = {
            "jsonrpc": "2.0",
            "method": "gen_getTransactionByHash",
            "id": 1,
            "params": [tx_hash]
        }
        try:
            resp = requests.post(RPC_URL, json=payload, timeout=30)
            data = resp.json().get("result", {})
            status = data.get("status")

            print(f"    [{attempt}] Transaction status: {status or 'pending'}")

            if status in ("ACCEPTED", "FINALIZED"):
                contract_address = (
                    data.get("contract_address")
                    or data.get("data", {}).get("contract_address")
                )
                return tx_hash, contract_address

            elif status == "FAILED":
                print(f"❌  Transaction failed: {data}")
                sys.exit(1)

        except Exception as e:
            print(f"    [Warning] Polling error: {e}")

        time.sleep(5)

    print(f"❌  Timed out waiting for receipt after {timeout}s")
    sys.exit(1)


# ---------------------------------------------------------------------------
# Derive Ethereum address from private key (lightweight, no web3 dependency)
# ---------------------------------------------------------------------------
def derive_address_from_private_key(private_key: str) -> str:
    """Derive Ethereum address from private key using built-in Python crypto."""
    try:
        from eth_account import Account
        acct = Account.from_key(private_key)
        return acct.address
    except ImportError:
        pass

    # Fallback: try web3
    try:
        from web3 import Web3
        return Web3().eth.account.from_key(private_key).address
    except ImportError:
        pass

    print("⚠️   Cannot derive address (install eth-account: pip install eth-account)")
    return "0x0000000000000000000000000000000000000000"


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
def main():
    print("=" * 60)
    print("   GenResolve — GenLayer Contract Deployment Script")
    print("=" * 60)
    print()

    validate()

    contract_address = None
    tx_hash = None

    # Try CLI deployment first
    contract_address = deploy_via_cli()

    if contract_address is None:
        # Fallback to direct RPC deployment
        result = deploy_via_rpc()
        if result:
            tx_hash, contract_address = result

    print()
    print("=" * 60)
    if contract_address:
        print("✅  DEPLOYMENT SUCCESSFUL!")
        print(f"    Contract Address : {contract_address}")
        if tx_hash:
            print(f"    Transaction Hash : {tx_hash}")
        print()
        print("💡  Save this address — you'll need it to interact with the contract.")
        print(f"    Explorer: https://explorer.testnet.genlayer.com/tx/{tx_hash or ''}")

        # Save to .deployed file for convenience
        output_file = pathlib.Path(__file__).parent / ".deployed.json"
        with open(output_file, "w") as f:
            json.dump({
                "contract_address": contract_address,
                "tx_hash": tx_hash,
                "network": NETWORK,
                "rpc_url": RPC_URL,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            }, f, indent=2)
        print(f"    Saved to: {output_file.name}")
    else:
        print("❌  Deployment did not return a contract address.")
        print("    Check the output above for errors.")
    print("=" * 60)


if __name__ == "__main__":
    main()
