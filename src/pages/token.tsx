import { useEffect, useState } from 'react';
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from 'wagmi';
import { formatUnits } from 'viem';
import Layout from '@/components/Layout';
import { NBL_TOKEN_ADDRESS, NBL_TOKEN_ABI } from '@/config/contracts';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const TokenPage = () => {
  const [mounted, setMounted] = useState(false);
  const [stakeAmount, setStakeAmount] = useState('');
  const { address } = useAccount();

  const { data: tokenBalance } = useContractRead({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { data: totalSupply } = useContractRead({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'totalSupply',
    watch: true,
  });

  const { data: stakedBalance } = useContractRead({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address],
    watch: true,
  });

  const { write: stake, data: stakeData } = useContractWrite({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'stake',
  });

  const { write: unstake, data: unstakeData } = useContractWrite({
    address: NBL_TOKEN_ADDRESS,
    abi: NBL_TOKEN_ABI,
    functionName: 'unstake',
  });

  const { isLoading: isStaking } = useWaitForTransaction({
    hash: stakeData?.hash,
  });

  const { isLoading: isUnstaking } = useWaitForTransaction({
    hash: unstakeData?.hash,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleStake = async () => {
    if (!stakeAmount) {
      toast.error('Please enter an amount to stake');
      return;
    }

    try {
      await stake?.({
        args: [BigInt(parseFloat(stakeAmount) * 1e18)],
      });
      toast.success('Staking initiated...');
      setStakeAmount('');
    } catch (error: any) {
      toast.error(error.message || 'Error staking tokens');
    }
  };

  const handleUnstake = async () => {
    try {
      await unstake?.();
      toast.success('Unstaking initiated...');
    } catch (error: any) {
      toast.error(error.message || 'Error unstaking tokens');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient mb-2">NBL Token</h1>
            <p className="text-text-secondary">Stake and manage your NBL tokens</p>
          </div>

          <div className="glass-panel">
            <h2 className="text-xl font-bold text-white mb-6">Token Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-secondary mb-1">Your Balance</p>
                <p className="text-2xl font-bold text-white">
                  {tokenBalance ? formatUnits(tokenBalance, 18) : '0'} NBL
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Total Supply</p>
                <p className="text-2xl font-bold text-white">
                  {totalSupply ? formatUnits(totalSupply, 18) : '0'} NBL
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">Staked Balance</p>
                <p className="text-2xl font-bold text-white">
                  {stakedBalance ? formatUnits(stakedBalance, 18) : '0'} NBL
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h2 className="text-xl font-bold text-white mb-6">Stake Tokens</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  Amount to Stake
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    className="input-field flex-1"
                    placeholder="0.0"
                    step="0.01"
                    min="0"
                  />
                  <button
                    className="gradient-button"
                    onClick={handleStake}
                    disabled={isStaking}
                  >
                    {isStaking ? 'Staking...' : 'Stake'}
                  </button>
                </div>
              </div>

              <div>
                <button
                  className="outline-button w-full"
                  onClick={handleUnstake}
                  disabled={isUnstaking}
                >
                  {isUnstaking ? 'Unstaking...' : 'Unstake All'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(TokenPage), {
  ssr: false
});
