// FHE Configuration for Secret Predictions
export const FHE_CONFIG = {
  // Sepolia testnet configuration
  chainId: 11155111,
  
  // Default public key (should be replaced with actual FHE public key)
  publicKey: process.env.NEXT_PUBLIC_FHE_PUBLIC_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000',
  
  // Contract addresses (update these after deployment)
  predictionMarketAddress: process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS || '0x0000000000000000000000000000000000000000',
  
  // FHE precision settings
  amountPrecision: 64, // 64-bit for amounts
  booleanPrecision: 1,  // 1-bit for boolean values
  
  // Gas settings for FHE operations
  gasLimit: 5000000, // 5M gas limit for FHE operations
  
  // Relayer settings
  relayerUrl: process.env.NEXT_PUBLIC_RELAYER_URL || 'https://relayer.zama.ai',
  
  // Debug mode
  debug: process.env.NODE_ENV === 'development',
}

// FHE utility functions
export const FHE_UTILS = {
  // Format encrypted amount for display (shows as "***" for privacy)
  formatEncryptedAmount: (encryptedValue: string): string => {
    return '***'
  },
  
  // Check if FHE is supported in current environment
  isSupported: (): boolean => {
    return typeof window !== 'undefined' && 'ethereum' in window
  },
  
  // Validate FHE configuration
  validateConfig: (): boolean => {
    return FHE_CONFIG.publicKey !== '0x0000000000000000000000000000000000000000000000000000000000000000'
  }
}

// Error messages for FHE operations
export const FHE_ERRORS = {
  NOT_INITIALIZED: 'FHE encryption not initialized',
  INVALID_PUBLIC_KEY: 'Invalid FHE public key',
  ENCRYPTION_FAILED: 'Failed to encrypt data',
  DECRYPTION_FAILED: 'Failed to decrypt data',
  INVALID_PRECISION: 'Invalid precision for FHE operation',
  RELAYER_ERROR: 'Relayer operation failed',
}
