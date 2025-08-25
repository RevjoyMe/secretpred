import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { http } from 'wagmi'

const chains = [
  sepolia, // Используем обычный Sepolia для тестирования
] as const

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Secret Predictions',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  chains,
  transports: {
    [sepolia.id]: http('https://eth-sepolia.g.alchemy.com/v2/demo'),
  },
  ssr: false,
})

export { chains }

// Contract addresses - Sepolia addresses
export const BETTING_VAULT_ADDRESS = "0x0e5BA52c58e710eA19D8aDcdCAB41d4886b40dF6"
export const PREDICTION_MARKET_ADDRESS = "0xd15579d5Aae0763186Fa22E74ddd88d64d4e8A6b"
