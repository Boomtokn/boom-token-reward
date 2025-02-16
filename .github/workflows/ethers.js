import * as ethers from "ethers";
import { Mnemonic, Wallet } from "ethers";

const RPC_URL = "https://virtual.binance.rpc.tenderly.co/b4fb02ec-e7ae-4fd3-bdaa-6f87ab1249ad";
const EXPLORER_BASE_URL = "https://virtual.binance.rpc.tenderly.co/eb0b35bb-5a84-4581-9b14-cf040415286a";

const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = Wallet.fromPhrase(Mnemonic.fromEntropy(ethers.randomBytes(24)).phrase, provider);

(async () => {
  await provider.send("tenderly_setBalance", [
    signer.address,
    "0xDE0B6B3A7640000",
  ]);

  const tx = await signer.sendTransaction({
    to: "0xf0e058a2c2c490fe4d8fecb9fd69f9b4f18a9140",
    value: ethers.parseEther("0.01"),
  });

  console.log(`${EXPLORER_BASE_URL}/tx/${tx.hash}`);
})().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
