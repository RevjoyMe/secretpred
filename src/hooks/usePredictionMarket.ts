"use client"

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/wagmi'
import { createEncryptedBetData } from '@/lib/fhe-utils'

// Правильный ABI для FHE контракта с externalEuint64 и externalEbool
const PREDICTION_MARKET_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "internalType": "bool", "name": "outcome", "type": "bool" }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" }
    ],
    "name": "claimPayout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" }
    ],
    "name": "getMarket",
    "outputs": [
      { "internalType": "string", "name": "title", "type": "string" },
      { "internalType": "uint256", "name": "endTime", "type": "uint256" },
      { "internalType": "uint256", "name": "totalPool", "type": "uint256" },
      { "internalType": "enum PredictionMarket.MarketState", "name": "state", "type": "uint8" },
      { "internalType": "bool", "name": "outcome", "type": "bool" },
      { "internalType": "uint256", "name": "resolutionTime", "type": "uint256" },
      { "internalType": "address", "name": "oracle", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" },
      { "internalType": "address", "name": "user", "type": "address" }
    ],
    "name": "getUserPosition",
    "outputs": [
      { "internalType": "uint256", "name": "yesAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "noAmount", "type": "uint256" },
      { "internalType": "uint256", "name": "betCount", "type": "uint256" },
      { "internalType": "bool", "name": "hasPosition", "type": "bool" },
      { "internalType": "bool", "name": "hasClaimed", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "marketId", "type": "uint256" }
    ],
    "name": "getMarketStats",
    "outputs": [
      { "internalType": "uint256", "name": "totalYesPool", "type": "uint256" },
      { "internalType": "uint256", "name": "totalNoPool", "type": "uint256" },
      { "internalType": "uint256", "name": "totalBetters", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

export interface MarketData {
  id: number
  question: string
  description: string
  endTime: bigint
  state: number
  outcome: boolean
  totalPool: bigint
  creator: string
}

export function usePredictionMarket() {
  const { address, isConnected } = useAccount()
  const [selectedMarket, setSelectedMarket] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState<string>('0.01')
  const [betOutcome, setBetOutcome] = useState<boolean | null>(null)

  // Чтение данных рынка
  const { data: marketData, refetch: refetchMarket } = useReadContract({
    address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
    abi: PREDICTION_MARKET_ABI,
    functionName: 'getMarket',
    args: selectedMarket ? [BigInt(selectedMarket)] : undefined,
    query: {
      enabled: !!selectedMarket,
    },
  })

  // Функция для размещения ставки
  const { 
    data: betData, 
    writeContract, 
    isPending: isPlacingBet,
    error: betError 
  } = useWriteContract()

  // Ожидание транзакции
  const { isLoading: isWaitingForBet, isSuccess: betSuccess } = useWaitForTransactionReceipt({
    hash: betData,
  })

  // Функция для размещения ставки (TEMPORARY: No FHE)
  const handlePlaceBet = async (marketId: number, outcome: boolean, amount: string) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet first')
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid bet amount')
    }

    try {
      console.log('Placing bet (temporary no FHE):', { marketId, outcome, amount })
      
      // ВРЕМЕННО: Прямой вызов без FHE для тестирования
      await writeContract({
        address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'placeBet',
        args: [
          BigInt(marketId), 
          outcome  // Просто boolean вместо зашифрованных данных
        ],
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('placeBet failed:', error)
      
      // Расширенная диагностика ошибок
      if (error && typeof error === 'object' && 'data' in error) {
        try {
          // Попытка декодировать ошибку контракта
          const { decodeErrorResult } = await import('viem')
          const decodedError = decodeErrorResult({ 
            abi: PREDICTION_MARKET_ABI, 
            data: (error as any).data 
          })
          console.error('Decoded contract error:', decodedError)
        } catch (decodeError) {
          console.error('Failed to decode error:', decodeError)
        }
      }
      
      throw error
    }
  }

  // Функция для получения данных рынка
  const getMarketData = async (marketId: number): Promise<MarketData | null> => {
    try {
      // В реальном приложении здесь был бы вызов контракта
      // Для демонстрации возвращаем моковые данные
      return {
        id: marketId,
        question: "Demo Market Question",
        description: "This is a demo market for testing",
        endTime: BigInt(Math.floor(Date.now() / 1000) + 86400), // 24 hours from now
        state: 0, // Active
        outcome: false,
        totalPool: parseEther('0.1'),
        creator: '0x0000000000000000000000000000000000000000'
      }
    } catch (error) {
      console.error('Error fetching market data:', error)
      return null
    }
  }

  // Эффект для обновления данных после успешной ставки
  useEffect(() => {
    if (betSuccess && selectedMarket) {
      refetchMarket()
      setBetAmount('0.01')
      setBetOutcome(null)
    }
  }, [betSuccess, selectedMarket, refetchMarket])

  return {
    // Состояние
    selectedMarket,
    betAmount,
    betOutcome,
    isConnected,
    address,
    
    // Данные
    marketData,
    
    // Функции
    setSelectedMarket,
    setBetAmount,
    setBetOutcome,
    handlePlaceBet,
    getMarketData,
    
    // Статус транзакций
    isPlacingBet,
    isWaitingForBet,
    betSuccess,
    betError,
  }
}
