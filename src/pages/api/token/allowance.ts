import type { NextApiRequest, NextApiResponse } from 'next';
import { createPublicClient, http } from 'viem';
import { avalancheFuji } from 'viem/chains';
import { NBL_TOKEN_ADDRESS, NBL_TOKEN_ABI } from '@/config/contracts';

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

  const { owner, spender } = req.query;

  if (!owner || !spender) {
    return res.status(400).json({ message: 'Missing owner or spender address' });
  }

  try {
    // Get token allowance from the contract
    const allowance = await client.readContract({
      address: NBL_TOKEN_ADDRESS,
      abi: NBL_TOKEN_ABI,
      functionName: 'allowance',
      args: [owner as `0x${string}`, spender as `0x${string}`],
    });

    res.status(200).json({ allowance: allowance.toString() });
  } catch (error) {
    console.error('Failed to fetch allowance:', error);
    res.status(500).json({ message: 'Failed to fetch token allowance' });
  }
}
