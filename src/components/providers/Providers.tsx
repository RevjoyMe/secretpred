"use client"

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config, chains } from '@/lib/wagmi'

const { wallets } = getDefaultWallets({
  appName: 'Secret Predictions',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  chains,
})

const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          wallets={wallets}
          initialChain={chains[0]}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
