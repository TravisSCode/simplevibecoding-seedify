'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme
} from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider, createConfig } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { http } from 'viem';

// QueryClient для React Query
const queryClient = new QueryClient();

// Конфигурация кошельков
const { connectors } = getDefaultWallets({
  appName: 'AI NFT Storyteller',
  projectId: 'DEMO_PROJECT_ID_FOR_SEEDIFY', // Для демо
});

// Конфигурация wagmi
const config = createConfig({
  connectors,
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(),
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider 
          theme={darkTheme({
            accentColor: '#8b5cf6',
            accentColorForeground: 'white',
            borderRadius: 'large',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

