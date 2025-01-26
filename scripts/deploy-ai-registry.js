const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const dsciTokenAddress = "0x5501773156a002B85b33C58c74e0Fc79FF97680f";
  
  const AIModelRegistry = await hre.ethers.getContractFactory("AIModelRegistry");
  const aiModelRegistry = await AIModelRegistry.deploy(dsciTokenAddress);

  await aiModelRegistry.deployed();

  console.log("AIModelRegistry deployed to:", aiModelRegistry.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
