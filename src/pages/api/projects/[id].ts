import type { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { RESEARCH_PROJECT_ADDRESS, RESEARCH_PROJECT_ABI } from '@/config/contracts';

const client = createPublicClient({
  chain: avalancheFuji,
  transport: http(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { id } = req.query;
  const projectId = Number(id);

  try {
    // Get project details from the contract
    const projectDetails = await client.readContract({
      address: RESEARCH_PROJECT_ADDRESS,
      abi: RESEARCH_PROJECT_ABI,
      functionName: 'getProjectDetails',
      args: [BigInt(projectId)],
    }) as any[];

    // Format the response
    const project = {
      id: projectId,
      researcher: projectDetails[0],
      title: projectDetails[1],
      description: projectDetails[2],
      documentation: projectDetails[3],
      externalUrl: projectDetails[4],
      minDonation: projectDetails[5],
      maxDonation: projectDetails[6],
      totalFunds: projectDetails[7],
      isActive: projectDetails[8],
    };

    res.status(200).json(project);
  } catch (error) {
    console.error('Failed to fetch project:', error);
    res.status(500).json({ message: 'Failed to fetch project details' });
  }
}
