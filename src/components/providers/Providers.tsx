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

// Create custom MetaMask wallet with correct structure
const metaMaskWallet = {
  id: 'metaMask',
  name: 'MetaMask',
  iconUrl: 'https://cdn.rainbow.me/metamask.svg',
  iconBackground: '#F6851B',
  downloadUrls: {
    chrome: 'https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/',
    safari: 'https://apps.apple.com/app/metamask/id1438144202',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/metamask/ejbalbakoplchlghecdalmeeeajnimhm',
  },
  // Force show as installed
  installed: true,
  // Add function to check installation
  getWalletClient: async () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      return window.ethereum
    }
    return null
  }
}

// Force add MetaMask first in the list
const walletsWithMetaMask = [
  metaMaskWallet,
  ...wallets.filter(wallet => wallet.id !== 'metaMask'), // Remove duplicates
]

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          chains={chains}
          wallets={walletsWithMetaMask}
          initialChain={chains[0]}
          showRecentTransactions={false}
          locale="en-US"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
