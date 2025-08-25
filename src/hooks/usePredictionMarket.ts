"use client"

import { useState, useEffect } from 'react'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { parseEther, formatEther } from 'viem'
import { PREDICTION_MARKET_ADDRESS } from '@/lib/wagmi'

// Правильный ABI для FHE контракта с externalEuint64 и externalEbool
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
      }
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      }
    ],
    "name": "getMarket",
    "outputs": [
      {
        "internalType": "string",
        "name": "question",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "endTime",
        "type": "uint256"
      },
      {
        "internalType": "enum PredictionMarket.MarketState",
        "name": "state",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "outcome",
        "type": "bool"
      },
      {
        "internalType": "uint256",
        "name": "totalPool",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "marketId",
        "type": "uint256"
      }
    ],
    "name": "claimPayout",
    "outputs": [],
    "stateMutability": "nonpayable",
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

  // Функция для размещения ставки с правильной FHE логикой
  const handlePlaceBet = async (marketId: number, outcome: boolean, amount: string) => {
    if (!isConnected || !address) {
      throw new Error('Please connect your wallet first')
    }

    if (!amount || parseFloat(amount) <= 0) {
      throw new Error('Please enter a valid bet amount')
    }

    try {
      console.log('Placing bet with FHE:', { marketId, outcome, amount })
      
      // Временная версия без SDK для тестирования
      // В реальном приложении здесь был бы код:
      /*
      const { createInstance, SepoliaConfig } = await import('@zama-fhe/relayer-sdk')
      const instance = await createInstance(SepoliaConfig)
      const input = await instance.createEncryptedInput(PREDICTION_MARKET_ADDRESS, address)
      input.add64(BigInt(parseFloat(amount) * 1e18))
      input.addBool(outcome)
      const encryptedData = await input.encrypt()
      */
      
      // Временные placeholder данные для тестирования
      const encryptedAmount = ('0x' + '0'.repeat(64)) as `0x${string}`
      const encryptedOutcome = ('0x' + '0'.repeat(64)) as `0x${string}`
      const attestationProof = ('0x' + '0'.repeat(128)) as `0x${string}`
      
      console.log('Using placeholder encrypted data for testing')
      
      // Вызываем контракт с placeholder данными
      await writeContract({
        address: PREDICTION_MARKET_ADDRESS as `0x${string}`,
        abi: PREDICTION_MARKET_ABI,
        functionName: 'placeBet',
        args: [
          BigInt(marketId), 
          encryptedAmount,    // placeholder для encryptedAmount
          attestationProof   // placeholder для attestation proof
        ],
        value: parseEther(amount),
      })
    } catch (error) {
      console.error('Error placing bet:', error)
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
