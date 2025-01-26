const hre = require("hardhat");

async function main() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying Exchange with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Deploy Exchange
    console.log("\nDeploying Exchange...");
    const DSCIExchange = await hre.ethers.getContractFactory("DSCIExchange");
    const exchange = await DSCIExchange.deploy("0x5501773156a002B85b33C58c74e0Fc79FF97680f"); // Use existing NBL token
    await exchange.deployed();
    console.log("Exchange deployed to:", exchange.address);

    // Update environment variables
    console.log("\nUpdate your .env file with these values:");
    console.log(`NEXT_PUBLIC_EXCHANGE_ADDRESS="${exchange.address}"`);

  } catch (error) {
    console.error("\nDeployment failed with error:");
    console.error(error);
    if (error.message) console.error("Error message:", error.message);
    if (error.code) console.error("Error code:", error.code);
    if (error.transaction) console.error("Failed transaction:", error.transaction);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
