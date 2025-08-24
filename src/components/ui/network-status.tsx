"use client"

import { useAccount, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useEffect, useState } from 'react'
import { Alert, AlertDescription } from './alert'
import { AlertTriangle, CheckCircle, Wifi, WifiOff } from 'lucide-react'

export function NetworkStatus() {
  const { isConnected, address, chainId } = useAccount()
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  
  const { data: balance, isLoading: balanceLoading, error: balanceError } = useBalance({
    address,
    chainId: sepolia.id,
    enabled: !!address && isConnected,
  })

  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Проверяем подключение к RPC
        const response = await fetch('https://eth-sepolia.g.alchemy.com/v2/zgE0eizPW4otRHOQiyndZ', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        })

        if (response.ok) {
          setConnectionStatus('connected')
        } else {
          setConnectionStatus('error')
        }
      } catch (error) {
        console.error('Network connection error:', error)
        setConnectionStatus('error')
      }
    }

    if (isConnected) {
      checkConnection()
    }
  }, [isConnected])

  if (!isConnected) {
    return null
  }

  const isCorrectNetwork = chainId === sepolia.id

  return (
    <div className="space-y-2">
      {/* Network Status */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Network:</span>
        <div className="flex items-center gap-1">
          {isCorrectNetwork ? (
            <CheckCircle className="w-4 h-4 text-green-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
                     <span className={isCorrectNetwork ? 'text-green-600' : 'text-red-600'}>
             {isCorrectNetwork ? 'Sepolia Testnet' : `Wrong Network (Chain ID: ${chainId || 'Unknown'})`}
           </span>
        </div>
      </div>

      {/* RPC Connection Status */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">RPC Status:</span>
        <div className="flex items-center gap-1">
          {connectionStatus === 'checking' && (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-gray-500">Checking...</span>
            </>
          )}
          {connectionStatus === 'connected' && (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-green-600">Connected</span>
            </>
          )}
          {connectionStatus === 'error' && (
            <>
              <WifiOff className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Connection Error</span>
            </>
          )}
        </div>
      </div>

      {/* Balance Status */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600">Balance:</span>
        <div className="flex items-center gap-1">
          {balanceLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-gray-500">Loading...</span>
            </>
          ) : balanceError ? (
            <>
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">Error loading balance</span>
            </>
          ) : balance ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">{balance.formatted} {balance.symbol}</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <span className="text-yellow-600">No balance data</span>
            </>
          )}
        </div>
      </div>

             {/* Debug Info */}
       <div className="text-xs text-gray-500 space-y-1">
         <div>Chain ID: {chainId || 'Unknown'}</div>
         <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Not connected'}</div>
         <div>RPC URL: https://eth-sepolia.g.alchemy.com/v2/zgE0eizPW4otRHOQiyndZ</div>
       </div>

      {/* Error Alerts */}
      {!isCorrectNetwork && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
                   <AlertDescription>
           Please switch to Sepolia Testnet in your wallet. Current Chain ID: {chainId || 'Unknown'}
         </AlertDescription>
        </Alert>
      )}

      {connectionStatus === 'error' && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            Cannot connect to Sepolia RPC. Please check your internet connection or try again later.
          </AlertDescription>
        </Alert>
      )}

      {balanceError && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Error loading balance: {balanceError.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
