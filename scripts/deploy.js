const hre = require("hardhat");

async function main() {
  try {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());

    // Deploy DSCI Token (which will display as NBL)
    console.log("\nDeploying NBL Token...");
    const DSCIToken = await hre.ethers.getContractFactory("DSCIToken");
    const dummyAddress = "0x000000000000000000000000000000000000dEaD";
    const token = await DSCIToken.deploy(
      dummyAddress, // platformRewardsWallet
      dummyAddress, // developmentWallet
      dummyAddress, // ecosystemGrowthWallet
      dummyAddress, // communityWallet
      dummyAddress  // emergencyReserveWallet
    );
    await token.deployed();
    console.log("NBL Token deployed to:", token.address);

    // Deploy Exchange
    console.log("\nDeploying Exchange...");
    const DSCIExchange = await hre.ethers.getContractFactory("DSCIExchange");
    const exchange = await DSCIExchange.deploy(token.address);
    await exchange.deployed();
    console.log("Exchange deployed to:", exchange.address);

    // Deploy User Profile
    console.log("\nDeploying User Profile...");
    const UserProfile = await hre.ethers.getContractFactory("UserProfile");
    const userProfile = await UserProfile.deploy();
    await userProfile.deployed();
    console.log("User Profile deployed to:", userProfile.address);

    // Deploy Research Project
    console.log("\nDeploying Research Project...");
    const ResearchProject = await hre.ethers.getContractFactory("ResearchProject");
    const researchProject = await ResearchProject.deploy(token.address);
    await researchProject.deployed();
    console.log("Research Project deployed to:", researchProject.address);

    // Transfer tokens for testing
    console.log("\nSetting up initial token distribution...");
    
    // Transfer to exchange for liquidity
    const liquidityAmount = hre.ethers.utils.parseEther("1000000"); // 1M tokens
    const liquidityTx = await token.transfer(exchange.address, liquidityAmount);
    await liquidityTx.wait();
    console.log("Transferred liquidity to exchange:", hre.ethers.utils.formatEther(liquidityAmount), "NBL");

    // Transfer some tokens to the deployer for testing
    const testAmount = hre.ethers.utils.parseEther("100000"); // 100K tokens
    const testTx = await token.transfer(deployer.address, testAmount);
    await testTx.wait();
    console.log("Transferred test tokens to deployer:", hre.ethers.utils.formatEther(testAmount), "NBL");

    // Verify contracts
    if (process.env.SNOWTRACE_API_KEY) {
      console.log("\nWaiting for block confirmations...");
      await token.deployTransaction.wait(6);
      await exchange.deployTransaction.wait(6);
      await userProfile.deployTransaction.wait(6);
      await researchProject.deployTransaction.wait(6);

      console.log("Verifying NBL Token...");
      await hre.run("verify:verify", {
        address: token.address,
        constructorArguments: [
          dummyAddress,
          dummyAddress,
          dummyAddress,
          dummyAddress,
          dummyAddress
        ],
      });

      console.log("Verifying Exchange...");
      await hre.run("verify:verify", {
        address: exchange.address,
        constructorArguments: [token.address],
      });

      console.log("Verifying User Profile...");
      await hre.run("verify:verify", {
        address: userProfile.address,
        constructorArguments: [],
      });

      console.log("Verifying Research Project...");
      await hre.run("verify:verify", {
        address: researchProject.address,
        constructorArguments: [token.address],
      });
    }

    // Update environment variables
    console.log("\nUpdate your .env file with these values:");
    console.log(`NEXT_PUBLIC_NBL_TOKEN_ADDRESS="${token.address}"`);
    console.log(`NEXT_PUBLIC_EXCHANGE_ADDRESS="${exchange.address}"`);
    console.log(`NEXT_PUBLIC_RESEARCH_PROJECT_ADDRESS="${researchProject.address}"`);
    console.log(`NEXT_PUBLIC_USER_PROFILE_ADDRESS="${userProfile.address}"`);

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
