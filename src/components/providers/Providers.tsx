"use client"

import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount, useConnect, useDisconnect } from 'wagmi'
import { config, chains } from '@/lib/wagmi'
import { createContext, useContext, useState } from 'react'

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

// Wallet context
const WalletContext = createContext<any>(null)

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}

function WalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const [balance, setBalance] = useState<string>('0')

  const handleConnect = async () => {
    try {
      // Try to connect with MetaMask first
      const metaMaskConnector = connectors.find(c => c.id === 'metaMask')
      if (metaMaskConnector) {
        await connect({ connector: metaMaskConnector })
      } else {
        // Fallback to first available connector
        await connect({ connector: connectors[0] })
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const value = {
    isConnected,
    address,
    balance,
    connect: handleConnect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

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
          <WalletProvider>
            {children}
          </WalletProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default Providers
