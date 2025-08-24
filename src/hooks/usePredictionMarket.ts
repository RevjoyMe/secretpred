"use client"

import { useContractWrite, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/wagmi'
import { useState } from 'react'

// ABI для функции placeBet
const PREDICTION_MARKET_ABI = [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "encryptedAmount",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "encryptedOutcome",
        "type": "bytes"
      },
      {
        "internalType": "bytes",
        "name": "inputProof",
        "type": "bytes"
      }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
] as const

export function usePlaceBet(marketId: number, betAmount: string, side: "yes" | "no") {
  const { isConnected } = useAccount()
  const [manualError, setManualError] = useState<string | null>(null)

  console.log('[HOOK] usePlaceBet called with:', { marketId, betAmount, side, isConnected })

  // Для демонстрации используем простые зашифрованные данные
  // В реальном приложении здесь была бы настоящая FHE шифрация
  const mockEncryptedAmount = "0x" + "00".repeat(32) // Заглушка для зашифрованной суммы
  const mockEncryptedOutcome = "0x" + "00".repeat(32) // Заглушка для зашифрованного исхода
  const mockInputProof = "0x" + "00".repeat(32) // Заглушка для доказательства

  console.log('[HOOK] Contract address:', PREDICTION_MARKET_ADDRESS)
  console.log('[HOOK] Parsed bet amount:', parseEther(betAmount || "0").toString())

  const { data, write, isLoading: isWriteLoading, error: writeError, reset } = useContractWrite({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'placeBet',
    args: [
      BigInt(marketId),
      mockEncryptedAmount as `0x${string}`,
      mockEncryptedOutcome as `0x${string}`,
      mockInputProof as `0x${string}`
    ],
    value: parseEther(betAmount || "0"),
  })

  console.log('[HOOK] useContractWrite result:', { 
    data, 
    write: !!write, 
    isWriteLoading, 
    writeError: writeError?.message 
  })

  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({
    hash: data?.hash,
  })

  console.log('[HOOK] useWaitForTransactionReceipt result:', { 
    isConfirming, 
    isSuccess, 
    confirmError: confirmError?.message,
    hash: data?.hash 
  })

  const placeBet = async () => {
    console.log('[PLACEBET] Function called')
    
    // Проверяем, что мы на клиенте и есть window.ethereum
    if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
      console.error('[PLACEBET] Window or ethereum not available')
      setManualError("Wallet not available in this environment")
      return
    }

    if (!isConnected) {
      console.error('[PLACEBET] Wallet not connected')
      setManualError("Please connect your wallet first")
      return
    }

    if (!write) {
      console.error('[PLACEBET] Write function not available')
      setManualError("Contract write function not available")
      return
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      console.error('[PLACEBET] Invalid bet amount:', betAmount)
      setManualError("Please enter a valid bet amount")
      return
    }

    try {
      setManualError(null)
      console.log(`[PLACEBET] Attempting to place bet:`, {
        marketId,
        betAmount,
        side,
        value: parseEther(betAmount).toString()
      })

      // Вызываем write функцию
      write()
      
      console.log('[PLACEBET] Write function called successfully')
    } catch (error) {
      console.error('[PLACEBET] Error calling write:', error)
      setManualError(`Failed to initiate transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Сбрасываем ошибки при изменении параметров
  const resetErrors = () => {
    console.log('[HOOK] Resetting errors')
    setManualError(null)
    reset()
  }

  return {
    placeBet,
    resetErrors,
    isLoading: isWriteLoading || isConfirming,
    isSuccess,
    error: manualError || writeError || confirmError,
    hash: data?.hash,
  }
}
