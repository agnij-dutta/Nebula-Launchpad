const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  const ResearchProject = await hre.ethers.getContractFactory("ResearchProject");
  const researchProject = await ResearchProject.attach(process.env.NEXT_PUBLIC_RESEARCH_PROJECT_ADDRESS);

  try {
    // Get current project count
    const projectCount = await researchProject._projectIds();
    console.log("Current project count:", projectCount.toString());

    // Create a minimal test project
    console.log("\nCreating test project...");
    const tx = await researchProject.createProject(
      "Test",
      "Test",
      "https://example.com",
      "https://example.com",
      hre.ethers.utils.parseEther("1"),
      hre.ethers.utils.parseEther("10"),
      { gasLimit: 2000000 }
    );

    console.log("Transaction hash:", tx.hash);
    await tx.wait();
    console.log("Transaction confirmed");

    // Verify project was created
    const newProjectCount = await researchProject._projectIds();
    console.log("New project count:", newProjectCount.toString());

  } catch (error) {
    console.error("\nError:", error);
    if (error.data) {
      console.error("Error data:", error.data);
    }
    if (error.transaction) {
      console.error("Transaction:", error.transaction);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
