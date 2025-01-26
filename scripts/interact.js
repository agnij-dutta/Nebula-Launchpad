const hre = require("hardhat");

async function main() {
  const [signer] = await ethers.getSigners();
  console.log("Interacting with contracts using account:", signer.address);

  // Get the deployed token contract
  const DSCIToken = await hre.ethers.getContractFactory("DSCIToken");
  const dsciToken = await DSCIToken.attach("0x5501773156a002B85b33C58c74e0Fc79FF97680f");

  // Get token information
  const name = await dsciToken.name();
  const symbol = await dsciToken.symbol();
  const totalSupply = await dsciToken.totalSupply();
  const balance = await dsciToken.balanceOf(signer.address);

  console.log("Token Information:");
  console.log("Name:", name);
  console.log("Symbol:", symbol);
  console.log("Total Supply:", ethers.utils.formatEther(totalSupply));
  console.log("Your Balance:", ethers.utils.formatEther(balance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
