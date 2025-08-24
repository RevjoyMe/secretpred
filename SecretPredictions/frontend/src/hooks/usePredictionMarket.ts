'use client'

import { useState } from 'react'
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther } from 'viem'
import { BetInput } from '@/types/market'
import toast from 'react-hot-toast'

// Contract addresses (will be updated after deployment)
const PREDICTION_MARKET_ADDRESS = '0x0000000000000000000000000000000000000000'

// Simplified ABI for the functions we need
const PREDICTION_MARKET_ABI = [
  {
    name: 'createMarket',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: 'question', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'endTime', type: 'uint256' },
      { name: 'oracle', type: 'address' }
    ],
    outputs: [{ name: 'marketId', type: 'uint256' }]
  },
  {
    name: 'placeBet',
    type: 'function',
    stateMutability: 'payable',
    inputs: [
      { name: 'marketId', type: 'uint256' },
      { name: 'encryptedAmount', type: 'bytes' },
      { name: 'encryptedOutcome', type: 'bytes' },
      { name: 'inputProof', type: 'bytes' }
    ],
    outputs: []
  },
  {
    name: 'claimPayout',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'marketId', type: 'uint256' }],
    outputs: []
  }
] as const

export function usePredictionMarket() {
  const { address, isConnected } = useAccount()
  const [isLoading, setIsLoading] = useState(false)

  const { writeContract, data: hash, error, isPending } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  const placeBet = async ({ marketId, amount, outcome }: BetInput) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setIsLoading(true)
      
      // For demo purposes, we'll use simplified encryption
      // In production, this would use actual FHE encryption
      const encryptedAmount = new TextEncoder().encode(amount.toString())
      const encryptedOutcome = new TextEncoder().encode(outcome.toString())
      const inputProof = new Uint8Array(32) // Mock proof

      await writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'placeBet',
        args: [
          BigInt(marketId),
          encryptedAmount,
          encryptedOutcome,
          inputProof
        ],
        value: amount,
      })

      toast.success('Bet placed successfully! 🎉')
    } catch (error) {
      console.error('Betting failed:', error)
      toast.error('Failed to place bet. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const createMarket = async (params: {
    question: string
    description: string
    endTime: number
    oracle: string
  }) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setIsLoading(true)
      
      await writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'createMarket',
        args: [
          params.question,
          params.description,
          BigInt(params.endTime),
          params.oracle as `0x${string}`
        ],
      })

      toast.success('Market created successfully! 🎉')
    } catch (error) {
      console.error('Market creation failed:', error)
      toast.error('Failed to create market. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const claimPayout = async (marketId: string) => {
    if (!isConnected || !address) {
      toast.error('Please connect your wallet')
      return
    }

    try {
      setIsLoading(true)
      
      await writeContract({
        address: PREDICTION_MARKET_ADDRESS,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'claimPayout',
        args: [BigInt(marketId)],
      })

      toast.success('Payout claimed successfully! 💰')
    } catch (error) {
      console.error('Payout claim failed:', error)
      toast.error('Failed to claim payout. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    placeBet,
    createMarket,
    claimPayout,
    isLoading: isLoading || isPending || isConfirming,
    isSuccess,
    error,
    hash
  }
}

