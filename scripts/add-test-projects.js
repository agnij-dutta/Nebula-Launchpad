const hre = require("hardhat");

const testProjects = [
  {
    title: "Quantum Computing Research in Drug Discovery",
    description: "Using quantum computing algorithms to accelerate drug discovery by simulating molecular interactions and protein folding with unprecedented accuracy.",
    documentation: "https://example.com/quantum-drug-discovery",
    externalUrl: "https://github.com/example/quantum-drug-discovery",
    minDonation: "100",  // 100 NBL
    maxDonation: "10000" // 10,000 NBL
  },
  {
    title: "AI-Powered Climate Change Mitigation",
    description: "Developing machine learning models to optimize renewable energy distribution and predict extreme weather events for better disaster preparedness.",
    documentation: "https://example.com/ai-climate",
    externalUrl: "https://github.com/example/ai-climate",
    minDonation: "50",   // 50 NBL
    maxDonation: "5000"  // 5,000 NBL
  },
  {
    title: "Neural Interface for Paralysis Treatment",
    description: "Creating a brain-computer interface to help paralyzed individuals regain motor function through neural signal processing and robotic assistance.",
    documentation: "https://example.com/neural-interface",
    externalUrl: "https://github.com/example/neural-interface",
    minDonation: "200",  // 200 NBL
    maxDonation: "20000" // 20,000 NBL
  },
  {
    title: "Sustainable Ocean Cleanup Technology",
    description: "Engineering autonomous drones for efficient ocean plastic cleanup, powered by renewable energy and guided by AI for optimal collection routes.",
    documentation: "https://example.com/ocean-cleanup",
    externalUrl: "https://github.com/example/ocean-cleanup",
    minDonation: "75",   // 75 NBL
    maxDonation: "7500"  // 7,500 NBL
  },
  {
    title: "CRISPR Gene Therapy for Rare Diseases",
    description: "Developing targeted gene therapy treatments for rare genetic disorders using CRISPR-Cas9 technology with improved precision and reduced off-target effects.",
    documentation: "https://example.com/crispr-therapy",
    externalUrl: "https://github.com/example/crispr-therapy",
    minDonation: "150",  // 150 NBL
    maxDonation: "15000" // 15,000 NBL
  }
];

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Adding test projects with account:", deployer.address);

  const ResearchProject = await hre.ethers.getContractFactory("ResearchProject");
  const researchProject = await ResearchProject.attach(process.env.NEXT_PUBLIC_RESEARCH_PROJECT_ADDRESS);

  // Fixed gas limit that should be enough for project creation
  const fixedGasLimit = 1000000; // Increased gas limit

  console.log("\nCreating test projects...");
  for (const project of testProjects) {
    try {
      const minDonationWei = hre.ethers.utils.parseEther(project.minDonation);
      const maxDonationWei = hre.ethers.utils.parseEther(project.maxDonation);

      console.log(`Creating project: ${project.title}`);
      console.log(`Min donation: ${minDonationWei.toString()} wei`);
      console.log(`Max donation: ${maxDonationWei.toString()} wei`);
      console.log(`Using fixed gas limit: ${fixedGasLimit}`);

      const tx = await researchProject.createProject(
        project.title,
        project.description,
        project.documentation,
        project.externalUrl,
        minDonationWei,
        maxDonationWei,
        {
          gasLimit: fixedGasLimit
        }
      );

      console.log("Waiting for transaction...");
      await tx.wait();
      console.log(`Created project: ${project.title}`);
    } catch (error) {
      console.error(`Failed to create project: ${project.title}`, error.message);
      if (error.data) {
        console.error("Error data:", error.data);
      }
    }
  }

  console.log("\nAll test projects have been created!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
