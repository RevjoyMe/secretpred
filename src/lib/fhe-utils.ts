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
    // ВРЕМЕННО: Для тестирования на обычном Sepolia используем заглушки
    // TODO: Включить обратно когда FHE Sepolia будет доступен
    console.log('⚠️ FHE temporarily disabled for testing on regular Sepolia')
    
    // Заглушки для тестирования
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
    
    /* РЕАЛЬНЫЙ FHE КОД (закомментирован для тестирования):
    // Динамический импорт SDK
    const { createInstance, SepoliaConfig } = await import('@zama-fhe/relayer-sdk')
    
    // Создаем инстанс SDK и инициализируем
    const instance = await createInstance(SepoliaConfig)
    await instance.initSDK() // Браузерные бандлеры требуют инициализации
    
    // Создаем зашифрованный input
    const input = await instance.createEncryptedInput(contractAddress, userAddress)
    
    // Используем parseEther для точности (возвращает bigint)
    const wei = parseEther(amount)
    
    // Проверяем, что сумма не превышает uint64
    if (wei > maxUint64) {
      throw new Error('Amount too large for euint64 (max ~18.4467 ETH)')
    }
    
    // Добавляем данные в правильном порядке (amount, затем outcome)
    input.add64(wei)  // Используем parseEther вместо BigInt(parseFloat(amount) * 1e18)
    input.addBool(outcome)
    
    // Шифруем данные
    const encryptedData = await input.encrypt()
    
    const result = {
      encryptedAmount: encryptedData.handles[0],
      encryptedOutcome: encryptedData.handles[1],
      attestationProof: encryptedData.inputProof
    }
    
    // Диагностика - проверяем длины (обрезаем для читаемости)
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
