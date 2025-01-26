const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the existing NBL token address from the environment
  const nblTokenAddress = process.env.NEXT_PUBLIC_NBL_TOKEN_ADDRESS;
  if (!nblTokenAddress) {
    throw new Error("NBL token address not found in environment variables");
  }

  // Deploy ResearchProject contract
  const ResearchProject = await hre.ethers.getContractFactory("ResearchProject");
  const researchProject = await ResearchProject.deploy(nblTokenAddress);
  await researchProject.deployed();
  console.log("ResearchProject deployed to:", researchProject.address);

  // Deploy UserProfile contract
  const UserProfile = await hre.ethers.getContractFactory("UserProfile");
  const userProfile = await UserProfile.deploy();
  await userProfile.deployed();
  console.log("UserProfile deployed to:", userProfile.address);

  // Verify contracts on Snowtrace
  if (process.env.SNOWTRACE_API_KEY) {
    console.log("Waiting for block confirmations...");
    await researchProject.deployTransaction.wait(6);
    await userProfile.deployTransaction.wait(6);

    console.log("Verifying ResearchProject contract...");
    await hre.run("verify:verify", {
      address: researchProject.address,
      constructorArguments: [nblTokenAddress],
    });

    console.log("Verifying UserProfile contract...");
    await hre.run("verify:verify", {
      address: userProfile.address,
      constructorArguments: [],
    });
  }

  // Update environment variables
  console.log("\nUpdate your .env file with these values:");
  console.log(`NEXT_PUBLIC_RESEARCH_PROJECT_ADDRESS="${researchProject.address}"`);
  console.log(`NEXT_PUBLIC_USER_PROFILE_ADDRESS="${userProfile.address}"`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
