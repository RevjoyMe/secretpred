// FHE utilities using Zama Relayer SDK
import { parseEther } from 'viem'

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
    // Динамический импорт SDK
    const { createInstance, SepoliaConfig } = await import('@zama-fhe/relayer-sdk')
    
    // Создаем инстанс SDK
    const instance = await createInstance(SepoliaConfig)
    
    // Создаем зашифрованный input
    const input = await instance.createEncryptedInput(contractAddress, userAddress)
    
    // Добавляем данные в правильном порядке
    input.add64(BigInt(parseFloat(amount) * 1e18)) // Convert to wei
    input.addBool(outcome)
    
    // Шифруем данные
    const encryptedData = await input.encrypt()
    
    return {
      encryptedAmount: encryptedData.handles[0],
      encryptedOutcome: encryptedData.handles[1],
      attestationProof: encryptedData.inputProof
    }
  } catch (error) {
    console.error('Error creating encrypted bet data:', error)
    throw error
  }
}
