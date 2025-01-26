import { useEffect, useState } from 'react';
import { useAccount, useContractRead } from 'wagmi';
import { formatEther } from 'viem';
import { NBL_TOKEN_ADDRESS, NBL_TOKEN_ABI } from '@/config/contracts';

const TokenBalance = () => {
  const [mounted, setMounted] = useState(false);
  const { address, isConnected } = useAccount();

  const { data: balance } = useContractRead({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    enabled: Boolean(address),
    watch: true,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isConnected) return null;

  const formattedBalance = balance ? Number(formatEther(balance)).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }) : '0';

  return (
    <div className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-primary-purple/10">
      <span className="text-sm font-medium text-text-secondary">NBL Balance:</span>
      <span className="text-sm font-bold text-white">
        {formattedBalance} NBL
      </span>
    </div>
  );
};

export default TokenBalance;
