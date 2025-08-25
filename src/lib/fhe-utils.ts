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
    
    // Используем parseEther для точности (возвращает bigint)
    const amountInWei = parseEther(amount)
    
    // Проверяем, что сумма не превышает uint64
    if (amountInWei > BigInt(2n ** 64n - 1n)) {
      throw new Error('Amount too large for uint64')
    }
    
    // Добавляем данные в правильном порядке
    input.add64(amountInWei)  // Используем parseEther вместо BigInt(parseFloat(amount) * 1e18)
    input.addBool(outcome)
    
    // Шифруем данные
    const encryptedData = await input.encrypt()
    
    const result = {
      encryptedAmount: encryptedData.handles[0],
      encryptedOutcome: encryptedData.handles[1],
      attestationProof: encryptedData.inputProof
    }
    
    // Диагностика - проверяем длины
    console.log('FHE Data lengths:', {
      amountLen: result.encryptedAmount.length,
      outcomeLen: result.encryptedOutcome.length,
      proofLen: result.attestationProof.length,
      amountInWei: amountInWei.toString()
    })
    
    return result
  } catch (error) {
    console.error('Error creating encrypted bet data:', error)
    throw error
  }
}
