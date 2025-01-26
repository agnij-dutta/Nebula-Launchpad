const { createWalletClient, createPublicClient, http, parseEther } = require('viem');
const { privateKeyToAccount } = require('viem/accounts');
const { avalancheFuji } = require('viem/chains');
require('dotenv').config();

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RESEARCH_PROJECT_ADDRESS = process.env.NEXT_PUBLIC_RESEARCH_PROJECT_ADDRESS;

const ResearchProjectABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "documentation",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "externalUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "minDonation",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxDonation",
        "type": "uint256"
      }
    ],
    "name": "createProject",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

async function main() {
  // Create wallet client
  const account = privateKeyToAccount(`0x${PRIVATE_KEY}`);
  const client = createWalletClient({
    account,
    chain: avalancheFuji,
    transport: http()
  });

  const publicClient = createPublicClient({
    chain: avalancheFuji,
    transport: http()
  });

  console.log("Creating test project with account:", account.address);
  console.log("Contract address:", RESEARCH_PROJECT_ADDRESS);

  try {
    // Create project transaction
    const { request } = await publicClient.simulateContract({
      account,
      address: RESEARCH_PROJECT_ADDRESS,
      abi: ResearchProjectABI,
      functionName: 'createProject',
      args: [
        "AI Research Project",
        "Research on advanced AI algorithms",
        "https://example.com/ai-docs",
        "https://github.com/ai-research",
        parseEther("1"),
        parseEther("1000")
      ],
      gas: BigInt(2000000)
    });

    console.log("Sending transaction...");
    const hash = await client.writeContract(request);
    console.log("Transaction hash:", hash);

    console.log("Waiting for confirmation...");
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log("Transaction confirmed in block:", receipt.blockNumber);

  } catch (error) {
    console.error("\nError creating project:");
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
