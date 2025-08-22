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
    [sepolia.id]: http(),
  },
  connectors: [
    injected(),
    metaMask(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4' }),
  ],
})

export { chains }

// Contract addresses
export const PREDICTION_MARKET_ADDRESS = "0x1234567890123456789012345678901234567890"
export const ENCRYPTED_BETTING_ADDRESS = "0x2345678901234567890123456789012345678901"
export const ORACLE_INTEGRATION_ADDRESS = "0x3456789012345678901234567890123456789012"
