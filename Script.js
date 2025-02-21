const boomTokenAddress = "0xcd6a51559254030ca30c2fb2cbdf5c492e8caf9c"; // BOOM Token on BSC
const rewardContractAddress = "0xf0e058a2c2c490fe4d8fecb9fd69f9b4f18a9140"; // ClaimRefund Contract

let web3;
let userAccount;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      userAccount = accounts[0];
      document.getElementById("userAddress").innerText = `Connected: ${userAccount}`;
      document.getElementById("rewardsSection").style.display = "block";
      fetchRewardBalance();
    } catch (error) {
      console.error("User denied wallet connection", error);
    }
  } else {
    alert("Please install MetaMask or a Web3 wallet.");
  }
}

async function fetchRewardBalance() {
  if (!web3 || !userAccount) return;
  
  const tokenContract = new web3.eth.Contract([
    { constant: true, inputs: [{ name: "owner", type: "address" }], name: "balanceOf", outputs: [{ name: "", type: "uint256" }], type: "function" }
  ], boomTokenAddress);

  try {
    const balance = await tokenContract.methods.balanceOf(userAccount).call();
    document.getElementById("rewardAmount").innerText = `Your BOOM Rewards: ${web3.utils.fromWei(balance, "ether")} BOOM`;
  } catch (error) {
    console.error("Error fetching balance", error);
    document.getElementById("rewardAmount").innerText = "Error fetching rewards.";
  }
}

async function claimRewards() {
  if (!web3 || !userAccount) return alert("Connect your wallet first!");

  const rewardContract = new web3.eth.Contract([
    { name: "claim", type: "function", stateMutability: "nonpayable", inputs: [] }
  ], rewardContractAddress);

  try {
    await rewardContract.methods.claim().send({ from: userAccount });
    alert("Rewards claimed successfully!");
    fetchRewardBalance();
  } catch (error) {
    console.error("Claim failed", error);
    alert("Failed to claim rewards.");
  }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("claimRewards").addEventListener("click", claimRewards);

document.getElementById("toggleTheme").addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});
