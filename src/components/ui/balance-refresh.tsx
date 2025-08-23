"use client"

import { useAccount, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { RefreshCw } from 'lucide-react'

interface BalanceRefreshProps {
  className?: string
}

export function BalanceRefresh({ className = "" }: BalanceRefreshProps) {
  const { isConnected, address } = useAccount()
  const { data: balance, isLoading, error, refetch } = useBalance({
    address,
    chainId: sepolia.id,
    watch: true,
    enabled: !!address && isConnected,
  })

  const handleRefresh = () => {
    console.log('[BalanceRefresh] Manually refreshing balance...')
    refetch()
  }

  if (!isConnected) {
    return null
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Balance:</span>
      <span className="text-sm font-medium">
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            Loading...
          </span>
        ) : error ? (
          <span className="text-red-500">Error</span>
        ) : balance ? (
          `${balance.formatted} ${balance.symbol}`
        ) : (
          <span className="text-gray-500">No data</span>
        )}
      </span>
      <button
        onClick={handleRefresh}
        disabled={isLoading}
        className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
        title="Refresh balance"
      >
        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
      </button>
    </div>
  )
}
