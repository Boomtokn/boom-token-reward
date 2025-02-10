
import os
import json
from web3 import Web3
import requests

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Constants
API_KEY = os.getenv('API_KEY')
PRIVATE_KEY = os.getenv('PRIVATE_KEY')
WALLET_ADDRESS = os.getenv('WALLET_ADDRESS')
BSC_NODE = f"https://services.tokenview.io/vipapi/nodeservice/bsc?apikey={API_KEY}"
BOOM_TOKEN = "0xcd6a51559254030ca30c2fb2cbdf5c492e8caf9c"
WBNB_TOKEN = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"
LP_CONTRACT = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c"

# Web3 connection
web3 = Web3(Web3.HTTPProvider(BSC_NODE))
if not web3.isConnected():
    raise ConnectionError("Failed to connect to Binance Smart Chain node.")

wallet_address = Web3.toChecksumAddress(WALLET_ADDRESS)

# Helper Functions
def get_liquidity():
    """
    Fetch current liquidity information using PancakeSwap or TokenView APIs.
    """
    url = f"https://api.dexscreener.com/latest/dex/pairs/bsc/{BOOM_TOKEN}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        liquidity = data.get("pair", {}).get("liquidity", {}).get("usd", 0)
        return float(liquidity)
    return 0

def add_liquidity(amount_token, amount_wbnb):
    """
    Add liquidity to the pool.
    """
    nonce = web3.eth.get_transaction_count(wallet_address)
    transaction = {
        'nonce': nonce,
        'gas': 3000000,
        'gasPrice': web3.toWei('5', 'gwei')
    }
    signed_txn = web3.eth.account.sign_transaction(transaction, private_key=PRIVATE_KEY)
    tx_hash = web3.eth.send_raw_transaction(signed_txn.rawTransaction)
    return web3.toHex(tx_hash)

def notify_user(message):
    """
    Send a notification (print to console or extend for email/Telegram).
    """
    print(f"NOTIFICATION: {message}")

# Main Bot Logic
def main():
    try:
        liquidity = get_liquidity()
        notify_user(f"Current liquidity: ${liquidity:.2f}")

        # Threshold for adding liquidity (example: $2,500)
        threshold = 2500
        if liquidity < threshold:
            notify_user("Liquidity is below threshold. Adding liquidity...")
            tx_hash = add_liquidity(amount_token=100, amount_wbnb=0.1)  # Example values
            notify_user(f"Liquidity added. Transaction hash: {tx_hash}")
        else:
            notify_user("Liquidity is above the threshold. No action needed.")

    except Exception as e:
        notify_user(f"An error occurred: {str(e)}")

if __name__ == "__main__":
    main()
