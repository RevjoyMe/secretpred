// FHE utilities using Zama Relayer SDK
import { parseEther, maxUint64 } from 'viem'

export interface EncryptedBetData {
  encryptedAmount: `0x${string}`
  encryptedOutcome: `0x${string}`
  attestationProof: `0x${string}`
}

export async function createEncryptedBetData(
  contractAddress: `0x${string}`,
  userAddress: `0x${string}`,
  amount: string,
  outcome: boolean
): Promise<EncryptedBetData> {
  try {
    // TEMPORARY: Using mock data for testing on regular Sepolia
    // TODO: Re-enable when FHE Sepolia becomes available
    console.log('⚠️ FHE temporarily disabled for testing on regular Sepolia')
    
    // Mock data for testing
    const mockEncryptedAmount = `0x${'00'.repeat(32)}` as `0x${string}`
    const mockEncryptedOutcome = `0x${'00'.repeat(32)}` as `0x${string}`
    const mockAttestationProof = `0x${'00'.repeat(32)}` as `0x${string}`
    
    console.log('Mock FHE data for testing:', {
      amount,
      outcome,
      amountPreview: mockEncryptedAmount.slice(0, 10) + '...',
      outcomePreview: mockEncryptedOutcome.slice(0, 10) + '...',
      proofPreview: mockAttestationProof.slice(0, 10) + '...'
    })
    
    return {
      encryptedAmount: mockEncryptedAmount,
      encryptedOutcome: mockEncryptedOutcome,
      attestationProof: mockAttestationProof
    }
    
    /* REAL FHE CODE (commented for testing):
    // Dynamic SDK import
    const { createInstance, SepoliaConfig } = await import('@zama-fhe/relayer-sdk')
    
    // Create SDK instance and initialize
    const instance = await createInstance(SepoliaConfig)
    await instance.initSDK() // Browser bundlers require initialization
    
    // Create encrypted input
    const input = await instance.createEncryptedInput(contractAddress, userAddress)
    
    // Use parseEther for precision (returns bigint)
    const wei = parseEther(amount)
    
    // Check that amount doesn't exceed uint64
    if (wei > maxUint64) {
      throw new Error('Amount too large for euint64 (max ~18.4467 ETH)')
    }
    
    // Add data in correct order (amount, then outcome)
    input.add64(wei)  // Use parseEther instead of BigInt(parseFloat(amount) * 1e18)
    input.addBool(outcome)
    
    // Encrypt data
    const encryptedData = await input.encrypt()
    
    const result = {
      encryptedAmount: encryptedData.handles[0],
      encryptedOutcome: encryptedData.handles[1],
      attestationProof: encryptedData.inputProof
    }
    
    // Diagnostics - check lengths (truncate for readability)
    console.log('FHE Data lengths:', {
      amountLen: result.encryptedAmount.length,
      outcomeLen: result.encryptedOutcome.length,
      proofLen: result.attestationProof.length,
      amountInWei: wei.toString(),
      amountPreview: result.encryptedAmount.slice(0, 10) + '...',
      outcomePreview: result.encryptedOutcome.slice(0, 10) + '...',
      proofPreview: result.attestationProof.slice(0, 10) + '...'
    })
    
    return result
    */
  } catch (error) {
    console.error('Error creating encrypted bet data:', error)
    throw error
  }
}
