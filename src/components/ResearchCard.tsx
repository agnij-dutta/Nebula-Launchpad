import { useState } from 'react';
import { useAccount, useContractWrite, useContractRead } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { RESEARCH_PROJECT_ADDRESS, RESEARCH_PROJECT_ABI, NBL_TOKEN_ABI, NBL_TOKEN_ADDRESS } from '@/config/contracts';

interface ResearchCardProps {
  projectId: number;
  researcher: string;
  title: string;
  description: string;
  documentation: string;
  externalUrl: string;
  minDonation: bigint;
  maxDonation: bigint;
  totalFunds: bigint;
  isActive: boolean;
  onDonationSuccess?: () => void;
}

export default function ResearchCard({
  projectId,
  researcher,
  title,
  description,
  documentation,
  externalUrl,
  minDonation,
  maxDonation,
  totalFunds,
  isActive,
  onDonationSuccess
}: ResearchCardProps) {
  const { address } = useAccount();
  const [donationAmount, setDonationAmount] = useState('');
  const [error, setError] = useState('');

  // Get token approval status
  const { data: allowance } = useContractRead({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'allowance',
    args: [address, RESEARCH_PROJECT_ADDRESS],
    watch: true,
  });

  // Approve token spending
  const { write: approveTokens } = useContractWrite({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'approve',
  });

  // Donate to project
  const { write: donate } = useContractWrite({
    address: RESEARCH_PROJECT_ADDRESS,
    abi: RESEARCH_PROJECT_ABI,
    functionName: 'donate',
    onSuccess: () => {
      setDonationAmount('');
      onDonationSuccess?.();
    },
  });

  const handleDonate = async () => {
    try {
      setError('');
      if (!donationAmount) return;

      const amount = parseEther(donationAmount);
      
      // Validate donation amount
      if (amount < minDonation) {
        setError(`Minimum donation is ${formatEther(minDonation)} NBL`);
        return;
      }
      if (amount > maxDonation) {
        setError(`Maximum donation is ${formatEther(maxDonation)} NBL`);
        return;
      }

      // Check if we need to approve tokens first
      if (!allowance || allowance < amount) {
        approveTokens({ args: [RESEARCH_PROJECT_ADDRESS, amount] });
        return;
      }

      // Donate
      donate({ args: [BigInt(projectId), amount] });
    } catch (err) {
      setError('Failed to process donation');
      console.error(err);
    }
  };

  return (
    <div className="bg-background/50 border border-border rounded-lg p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-xl font-bold text-white">{title}</h3>
        <p className="text-text-secondary">{description}</p>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-text-secondary">
        <a href={documentation} target="_blank" rel="noopener noreferrer" className="hover:text-primary-purple">
          📄 Documentation
        </a>
        <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="hover:text-primary-purple">
          🔗 External Link
        </a>
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div>
          <span className="text-text-secondary">Min Donation:</span>{' '}
          <span className="text-white">{formatEther(minDonation)} NBL</span>
        </div>
        <div>
          <span className="text-text-secondary">Max Donation:</span>{' '}
          <span className="text-white">{formatEther(maxDonation)} NBL</span>
        </div>
        <div>
          <span className="text-text-secondary">Total Funds:</span>{' '}
          <span className="text-white">{formatEther(totalFunds)} NBL</span>
        </div>
      </div>

      {isActive && address && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              placeholder="Amount in NBL"
              className="flex-1 bg-background border border-border rounded px-3 py-2 text-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary-purple"
            />
            <button
              onClick={handleDonate}
              className="px-4 py-2 bg-primary-purple text-white rounded hover:bg-primary-purple/80 transition-colors"
            >
              Donate
            </button>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
      )}

      {!isActive && (
        <div className="text-text-secondary">
          This project is no longer accepting donations
        </div>
      )}
    </div>
  );
}
