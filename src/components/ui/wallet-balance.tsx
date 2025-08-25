"use client"

import { useAccount, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useEffect, useState } from 'react'

interface WalletBalanceProps {
  className?: string
}

export function WalletBalance({ className = "" }: WalletBalanceProps) {
  const { isConnected, address } = useAccount()
  const [retryCount, setRetryCount] = useState(0)
  
  const { data: balance, isLoading: balanceLoading, error: balanceError, refetch } = useBalance({
    address,
    chainId: sepolia.id,
    watch: true,
    enabled: !!address && isConnected,
    query: {
      retry: 5,
      retryDelay: 2000,
      staleTime: 10 * 1000, // 10 seconds
    },
  })

  // Debug logging
  useEffect(() => {
    console.log('[WalletBalance Debug]', {
      isConnected,
      address,
      balanceLoading,
      balanceError,
      balance: balance ? {
        formatted: balance.formatted,
        symbol: balance.symbol,
        decimals: balance.decimals,
        value: balance.value.toString(),
      } : null,
      retryCount
    })
  }, [isConnected, address, balanceLoading, balanceError, balance, retryCount])

  // Automatic retry on error
  useEffect(() => {
    if (balanceError && retryCount < 3) {
      console.log(`[WalletBalance] Retrying balance fetch (${retryCount + 1}/3)`)
      const timer = setTimeout(() => {
        setRetryCount(prev => prev + 1)
        refetch()
      }, 2000 * (retryCount + 1)) // Increase delay with each retry
      
      return () => clearTimeout(timer)
    }
  }, [balanceError, retryCount, refetch])

  if (!isConnected) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        Wallet not connected
      </div>
    )
  }

  if (balanceLoading) {
    return (
      <div className={`flex items-center gap-2 text-sm ${className}`}>
        <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
        <span>Loading balance...</span>
      </div>
    )
  }

  if (balanceError) {
    return (
      <div className={`text-sm text-red-500 ${className}`}>
        Error loading balance
        {retryCount < 3 && (
          <span className="text-xs text-gray-400 ml-2">
            (Retrying... {retryCount + 1}/3)
          </span>
        )}
      </div>
    )
  }

  if (!balance) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        No balance data
      </div>
    )
  }

  return (
    <div className={`text-sm font-medium ${className}`}>
      {balance.formatted} {balance.symbol}
    </div>
  )
}
