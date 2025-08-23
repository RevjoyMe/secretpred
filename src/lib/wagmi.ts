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
    [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL || 'https://rpc.sepolia.org'),
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
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  },
})

export { chains }

// Contract addresses
export const PREDICTION_MARKET_ADDRESS = "0xF4B4B18645c810195ef7a9bF768A0242A8325D7c"
export const ENCRYPTED_BETTING_ADDRESS = "0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918"
export const ORACLE_INTEGRATION_ADDRESS = "0xc5cb86FfDae958B566E0587B513DC67003fefDa0"
