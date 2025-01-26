const hre = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const dsciTokenAddress = "0x5501773156a002B85b33C58c74e0Fc79FF97680f";
  
  // Deploy DeSciAgentNetwork
  const DeSciAgentNetwork = await hre.ethers.getContractFactory("DeSciAgentNetwork");
  const desciAgentNetwork = await DeSciAgentNetwork.deploy(dsciTokenAddress);
  await desciAgentNetwork.deployed();
  console.log("DeSciAgentNetwork deployed to:", desciAgentNetwork.address);

  // Deploy DSCIExchange
  const DSCIExchange = await hre.ethers.getContractFactory("DSCIExchange");
  const dsciExchange = await DSCIExchange.deploy(dsciTokenAddress);
  await dsciExchange.deployed();
  console.log("DSCIExchange deployed to:", dsciExchange.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
