import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { avalancheFuji } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { ChakraProvider } from '@chakra-ui/react';
import Navigation from '../components/Navigation';
import { theme } from '../theme';
import '../styles/globals.css';
import '../styles/components.css';
import { Toaster } from 'react-hot-toast';
import { useState, useEffect } from 'react';

const { chains, publicClient } = configureChains(
  [avalancheFuji],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'Nebula',
  projectId: 'YOUR_PROJECT_ID',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
});

function App({ Component, pageProps }: any) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <ChakraProvider theme={theme}>
          <Navigation />
          {mounted && <Component {...pageProps} />}
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#1A1D2C',
                color: '#fff',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              },
            }}
          />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
