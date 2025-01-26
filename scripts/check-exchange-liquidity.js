const hre = require("hardhat");

async function main() {
  const NBL_TOKEN_ADDRESS = "0x5501773156a002B85b33C58c74e0Fc79FF97680f";
  const EXCHANGE_ADDRESS = "0x192E107c9E1adAbf7d01624AFa158d10203F8DAB";

  // Get the token contract
  const token = await hre.ethers.getContractAt("DSCIToken", NBL_TOKEN_ADDRESS);

  // Check exchange balance
  const exchangeBalance = await token.balanceOf(EXCHANGE_ADDRESS);
  console.log("\nExchange Liquidity:");
  console.log("NBL Balance:", hre.ethers.utils.formatEther(exchangeBalance), "NBL");

  // If balance is low, we'll transfer more tokens
  if (exchangeBalance.lt(hre.ethers.utils.parseEther("100000"))) {
    console.log("\nLiquidity is low. Adding more tokens...");
    const liquidityAmount = hre.ethers.utils.parseEther("1000000"); // 1M tokens
    await token.transfer(EXCHANGE_ADDRESS, liquidityAmount);
    console.log("Transferred", hre.ethers.utils.formatEther(liquidityAmount), "NBL to exchange");
    
    // Verify new balance
    const newBalance = await token.balanceOf(EXCHANGE_ADDRESS);
    console.log("New exchange balance:", hre.ethers.utils.formatEther(newBalance), "NBL");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
