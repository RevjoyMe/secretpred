"use client"

import { useContractWrite, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/wagmi'
import { useState, useEffect } from 'react'
import { createInstance, createEncryptedInput, userDecrypt, publicDecrypt } from '@zama-fhe/relayer-sdk'

// ABI для функции placeBet с правильными FHE типами
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
  const { isConnected, address } = useAccount()
  const [manualError, setManualError] = useState<string | null>(null)
  const [fheInstance, setFheInstance] = useState<any>(null)

  console.log('[HOOK] usePlaceBet called with:', { marketId, betAmount, side, isConnected })

  // Инициализация FHE instance
  useEffect(() => {
    const initFHE = async () => {
      try {
        if (typeof window !== 'undefined' && window.ethereum) {
          const instance = await createInstance({
            chainId: 11155111, // Sepolia
            publicKey: process.env.NEXT_PUBLIC_FHE_PUBLIC_KEY || '0x0000000000000000000000000000000000000000000000000000000000000000'
          })
          setFheInstance(instance)
          console.log('[FHE] Instance created successfully')
        }
      } catch (error) {
        console.error('[FHE] Failed to create instance:', error)
        setManualError('Failed to initialize FHE encryption')
      }
    }

    if (isConnected && !fheInstance) {
      initFHE()
    }
  }, [isConnected, fheInstance])

  const { data, write, isLoading: isWriteLoading, error: writeError, reset } = useContractWrite({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'placeBet',
    args: [
      BigInt(marketId),
      "0x" + "00".repeat(32), // Placeholder - will be replaced with real encrypted data
      "0x" + "00".repeat(32), // Placeholder - will be replaced with real encrypted data
      "0x" + "00".repeat(32)  // Placeholder - will be replaced with real proof
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

    if (!fheInstance) {
      console.error('[PLACEBET] FHE not initialized')
      setManualError("FHE encryption not ready")
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

      // Создаем зашифрованные данные с помощью Zama SDK
      const amountInWei = parseEther(betAmount)
      const outcome = side === "yes" ? true : false

      // Создаем зашифрованные входные данные
      const encryptedAmount = await createEncryptedInput(fheInstance, amountInWei.toString(), 64)
      const encryptedOutcome = await createEncryptedInput(fheInstance, outcome.toString(), 1) // boolean as 1 bit

      console.log('[FHE] Encrypted data created:', {
        amount: encryptedAmount,
        outcome: encryptedOutcome
      })

      // Вызываем write функцию с реальными зашифрованными данными
      write({
        args: [
          BigInt(marketId),
          encryptedAmount,
          encryptedOutcome,
          "0x" + "00".repeat(32) // Proof placeholder - в реальном приложении нужен валидный proof
        ]
      })
      
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
    fheReady: !!fheInstance,
  }
}
