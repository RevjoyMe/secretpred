import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'

// Zama FHEVM runs on Sepolia testnet with FHE capabilities
const chains = [
  sepolia,
  // Add other chains as needed for testing
] as const

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Secret Predictions',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  chains,
  ssr: true, // For Next.js SSR
})

export { chains }
