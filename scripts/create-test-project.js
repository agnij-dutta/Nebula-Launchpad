const hre = require("hardhat");
const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Creating test project with account:", deployer.address);

  const ResearchProject = await hre.ethers.getContractFactory("ResearchProject");
  const researchProject = await ResearchProject.attach(process.env.NEXT_PUBLIC_RESEARCH_PROJECT_ADDRESS);

  try {
    console.log("\nCreating test project...");
    console.log("Contract address:", process.env.NEXT_PUBLIC_RESEARCH_PROJECT_ADDRESS);

    const tx = await researchProject.createProject(
      "Quantum Computing Research",
      "Research on quantum algorithms for optimization problems",
      "https://example.com/quantum-docs",
      "https://github.com/quantum-research",
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1000"),
      {
        gasLimit: 2000000
      }
    );

    console.log("Transaction hash:", tx.hash);
    console.log("Waiting for transaction confirmation...");
    
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);

    // Get the project count to verify
    const projectCount = await researchProject.getProjectCount();
    console.log("\nCurrent project count:", projectCount.toString());

  } catch (error) {
    console.error("\nError creating project:");
    console.error("Error message:", error.message);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    if (error.transaction) {
      console.error("Transaction:", error.transaction);
    }
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
