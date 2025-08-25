"use client"

import { useContractWrite, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { parseEther } from 'viem'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/wagmi'
import { useState, useEffect } from 'react'

// ABI for placeBet function with correct FHE types
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

  console.log('[HOOK] usePlaceBet called with:', { marketId, betAmount, side, isConnected })

  const { data, writeContract, isPending, error: writeError, reset } = useContractWrite()

  console.log('[HOOK] useContractWrite result:', { 
    data, 
    writeContract: !!writeContract, 
    isPending, 
    writeError: writeError?.message 
  })

  const { isLoading: isConfirming, isSuccess, error: confirmError } = useWaitForTransactionReceipt({
    hash: data,
  })

  console.log('[HOOK] useWaitForTransactionReceipt result:', { 
    isConfirming, 
    isSuccess, 
    confirmError: confirmError?.message,
    hash: data 
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

    if (!writeContract) {
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

      // For now, use placeholder encrypted data
      // In a real implementation, this would use the Zama FHE SDK
      const encryptedAmount = ("0x" + "00".repeat(32)) as `0x${string}`
      const encryptedOutcome = ("0x" + "00".repeat(32)) as `0x${string}`
      const inputProof = ("0x" + "00".repeat(32)) as `0x${string}`

      // Call write function with placeholder encrypted data
      writeContract({
        address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'placeBet',
        args: [
          BigInt(marketId),
          encryptedAmount,
          encryptedOutcome,
          inputProof
        ],
        value: parseEther(betAmount)
      })
      
      console.log('[PLACEBET] Write function called successfully')
    } catch (error) {
      console.error('[PLACEBET] Error calling write:', error)
      setManualError(`Failed to initiate transaction: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Reset errors when parameters change
  const resetErrors = () => {
    console.log('[HOOK] Resetting errors')
    setManualError(null)
    reset()
  }

  return {
    placeBet,
    resetErrors,
    isLoading: isPending || isConfirming,
    isSuccess,
    error: manualError || writeError || confirmError,
    hash: data,
    fheReady: true, // Simplified for now
  }
}
