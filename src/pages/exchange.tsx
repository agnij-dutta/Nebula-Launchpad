import { useEffect, useState } from 'react';
import { useAccount, useBalance, useContractWrite, useWaitForTransaction } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import Layout from '@/components/Layout';
import { NBL_TOKEN_ADDRESS, EXCHANGE_ADDRESS, EXCHANGE_ABI } from '@/config/contracts';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import toast from 'react-hot-toast';
import dynamic from 'next/dynamic';

const ExchangePage = () => {
  const [mounted, setMounted] = useState(false);
  const [avaxAmount, setAvaxAmount] = useState('');
  const { address, isConnected } = useAccount();

  const { data: avaxBalance } = useBalance({
    address,
    watch: true,
  });

  const { data: tokenBalance } = useBalance({
    address,
    token: NBL_TOKEN_ADDRESS,
    watch: true,
  });

  // Use the exchange contract for buying tokens
  const { write: buyTokens, data: buyData } = useContractWrite({
    address: EXCHANGE_ADDRESS,
    abi: EXCHANGE_ABI,
    functionName: 'buyTokens',
  });

  const { isLoading: isBuying, isSuccess } = useWaitForTransaction({
    hash: buyData?.hash,
    onSuccess: () => {
      toast.success('Purchase successful!');
      setAvaxAmount('');
    },
    onError: (error) => {
      console.error('Transaction error:', error);
      toast.error('Transaction failed. Please try again.');
    }
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const handleBuy = async () => {
    if (!avaxAmount || parseFloat(avaxAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      console.log('Buying tokens with', avaxAmount, 'AVAX');
      await buyTokens?.({
        value: parseEther(avaxAmount),
      });
      toast.success('Transaction submitted...');
    } catch (error: any) {
      console.error('Buy error:', error);
      toast.error(error?.shortMessage || 'Failed to buy tokens. Please try again.');
    }
  };

  const getExpectedTokens = (amount: string) => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    // 1 AVAX = 100 NBL (same as contract)
    const tokenAmount = parseFloat(amount) * 100;
    return tokenAmount.toString();
  };

  if (!isConnected) {
    return (
      <Layout>
        <div className="min-h-screen py-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gradient mb-8">Exchange</h1>
            <div className="glass-panel p-8">
              <p className="text-text-secondary mb-4">Connect your wallet to buy NBL tokens</p>
              <ConnectButton />
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gradient mb-2">Exchange</h1>
            <p className="text-text-secondary">Buy NBL tokens with AVAX</p>
          </div>

          <div className="glass-panel">
            <h2 className="text-xl font-bold text-white mb-6">Token Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-text-secondary mb-1">AVAX Balance</p>
                <p className="text-2xl font-bold text-white">
                  {avaxBalance ? formatEther(avaxBalance.value) : '0'} AVAX
                </p>
              </div>
              <div>
                <p className="text-text-secondary mb-1">NBL Balance</p>
                <p className="text-2xl font-bold text-white">
                  {tokenBalance ? formatEther(tokenBalance.value) : '0'} NBL
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel">
            <h2 className="text-xl font-bold text-white mb-6">Buy Tokens</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  AVAX Amount
                </label>
                <div className="flex space-x-4">
                  <input
                    type="number"
                    value={avaxAmount}
                    onChange={(e) => setAvaxAmount(e.target.value)}
                    className="input-field flex-1"
                    placeholder="0.0"
                    step="0.01"
                    min="0"
                  />
                  <button
                    className="gradient-button"
                    onClick={handleBuy}
                    disabled={isBuying || !avaxAmount || parseFloat(avaxAmount) <= 0}
                  >
                    {isBuying ? 'Buying...' : 'Buy NBL'}
                  </button>
                </div>
                {avaxAmount && parseFloat(avaxAmount) > 0 && (
                  <p className="text-sm text-text-secondary mt-2">
                    You will receive: {getExpectedTokens(avaxAmount)} NBL
                  </p>
                )}
              </div>
              <div className="text-sm text-text-secondary">
                <p>Exchange Rate: 1 AVAX = 100 NBL</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default dynamic(() => Promise.resolve(ExchangePage), {
  ssr: false
});
