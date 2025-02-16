curl "https://virtual.binance.rpc.tenderly.co/b4fb02ec-e7ae-4fd3-bdaa-6f87ab1249ad" \
-X POST \
-H "Content-Type: application/json" \
-d '{
    "jsonrpc": "2.0",
    "method": "tenderly_setBalance",
    "params": [["0xf0e058a2c2c490fe4d8fecb9fd69f9b4f18a9140"], "0xDE0B6B3A7640000"]
}'
