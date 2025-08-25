import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { sepolia } from 'wagmi/chains'
import { http } from 'wagmi'

// FHE Sepolia chain configuration
const fheSepolia = {
  ...sepolia,
  id: 11155420, // FHE Sepolia chain ID
  name: 'FHE Sepolia',
  network: 'fhe-sepolia',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.fhe-sepolia.zama.ai'],
    },
    public: {
      http: ['https://rpc.fhe-sepolia.zama.ai'],
    },
  },
  blockExplorers: {
    default: {
      name: 'FHE Sepolia Explorer',
      url: 'https://explorer.fhe-sepolia.zama.ai',
    },
  },
} as const

const chains = [
  fheSepolia,
] as const

export const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'Secret Predictions',
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4',
  chains,
  transports: {
    [fheSepolia.id]: http('https://rpc.fhe-sepolia.zama.ai'),
  },
  ssr: false,
})

export { chains }

// Contract addresses - FHE Sepolia addresses
export const BETTING_VAULT_ADDRESS = "0xA604F88bCbbf8648C22d10143FDc1aA543e3bd61"
export const PREDICTION_MARKET_ADDRESS = "0x59f8ec1970835BEF65b1aad19dD98902b7eCe47D"
