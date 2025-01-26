import { toast } from 'react-hot-toast';

export const AVALANCHE_FUJI_PARAMS = {
  chainId: '0xA869', // 43113 in hex
  chainName: 'Avalanche Fuji Testnet',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18
  },
  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://testnet.snowtrace.io/']
};

export const addAvalancheFujiNetwork = async () => {
  if (!window.ethereum) {
    toast.error('Please install MetaMask to use this feature');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_addEthereumChain',
      params: [AVALANCHE_FUJI_PARAMS]
    });
    
    // Switch to the network after adding it
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: AVALANCHE_FUJI_PARAMS.chainId }]
    });

    toast.success('Successfully connected to Avalanche Fuji Testnet');
    return true;
  } catch (error: any) {
    if (error.code === 4001) {
      toast.error('Please approve the network switch in MetaMask');
    } else {
      toast.error('Failed to add Avalanche Fuji network');
      console.error('Add network error:', error);
    }
    return false;
  }
};

export const switchToAvalancheFuji = async () => {
  if (!window.ethereum) {
    toast.error('Please install MetaMask to use this feature');
    return false;
  }

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: AVALANCHE_FUJI_PARAMS.chainId }]
    });
    return true;
  } catch (error: any) {
    if (error.code === 4902) {
      // Network not added yet, add it
      return addAvalancheFujiNetwork();
    } else if (error.code === 4001) {
      toast.error('Please approve the network switch in MetaMask');
    } else {
      toast.error('Failed to switch network');
      console.error('Switch network error:', error);
    }
    return false;
  }
};
