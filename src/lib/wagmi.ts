import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { http } from 'wagmi'
import { injected, metaMask, walletConnect } from 'wagmi/connectors'

const chains = [
  sepolia,
] as const

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Secret Predictions',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  chains,
  transports: {
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://eth-sepolia.g.alchemy.com/v2/zgE0eizPW4otRHOQiyndZ'),
  },
  connectors: [
    metaMask({
      shimDisconnect: true,
      UNSTABLE_shimOnConnectSelectAccount: true,
    }),
    injected({
      shimDisconnect: true,
    }),
    walletConnect({ 
      projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
      showQrModal: true,
    }),
  ],
  ssr: false,
  queryClient: {
    defaultOptions: {
      queries: {
        retry: 3,
        refetchOnWindowFocus: true,
        staleTime: 30 * 1000, // 30 seconds
        gcTime: 5 * 60 * 1000, // 5 minutes
      },
    },
  },
})

export { chains }

// Contract addresses
export const BETTING_VAULT_ADDRESS = "0xA604F88bCbbf8648C22d10143FDc1aA543e3bd61"
export const PREDICTION_MARKET_ADDRESS = "0x59f8ec1970835BEF65b1aad19dD98902b7eCe47D"
