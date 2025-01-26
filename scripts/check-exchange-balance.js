const hre = require("hardhat");

async function main() {
  const NBL_TOKEN = "0x5501773156a002B85b33C58c74e0Fc79FF97680f";
  const EXCHANGE_ADDRESS = "0x18436587a6FAa7A5D01dB7d44504952324FA8030";

  // Get token contract
  const token = await hre.ethers.getContractAt("DSCIToken", NBL_TOKEN);
  
  // Check exchange balance
  const balance = await token.balanceOf(EXCHANGE_ADDRESS);
  console.log("Exchange NBL balance:", hre.ethers.utils.formatEther(balance));

  // Transfer some tokens if needed
  if (balance.eq(0)) {
    console.log("\nTransferring tokens to exchange...");
    const amount = hre.ethers.utils.parseEther("1000000"); // 1M tokens
    const tx = await token.transfer(EXCHANGE_ADDRESS, amount);
    await tx.wait();
    console.log("Transferred", hre.ethers.utils.formatEther(amount), "NBL to exchange");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
