"use client"

"use client"

import { useContractWrite, useWaitForTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/wagmi'

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
  // Проверяем, что мы на клиенте
  if (typeof window === 'undefined') {
    return {
      placeBet: () => {},
      isLoading: false,
      isSuccess: false,
      error: null,
      hash: undefined,
    }
  }

  // Для демонстрации используем простые зашифрованные данные
  // В реальном приложении здесь была бы настоящая FHE шифрация
  const mockEncryptedAmount = "0x" + "00".repeat(32) // Заглушка для зашифрованной суммы
  const mockEncryptedOutcome = "0x" + "00".repeat(32) // Заглушка для зашифрованного исхода
  const mockInputProof = "0x" + "00".repeat(32) // Заглушка для доказательства

  const { data, write, isLoading: isWriteLoading, error: writeError } = useContractWrite({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'placeBet',
    args: [
      BigInt(marketId),
      mockEncryptedAmount as `0x${string}`,
      mockEncryptedOutcome as `0x${string}`,
      mockInputProof as `0x${string}`
    ],
    value: parseEther(betAmount),
  })

  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransaction({
    hash: data?.hash,
  })

  const placeBet = () => {
    if (write) {
      write()
    }
  }

  return {
    placeBet,
    isLoading: isWriteLoading || isConfirming,
    isSuccess,
    error: writeError || confirmError,
    hash: data?.hash,
  }
}
