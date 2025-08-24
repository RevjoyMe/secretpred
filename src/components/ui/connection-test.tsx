"use client"

import { useAccount, useBalance } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useState, useEffect } from 'react'

export function ConnectionTest() {
  const { isConnected, address } = useAccount()
  const [testResult, setTestResult] = useState<string>('Testing...')
  
  const { data: balance, isLoading, error } = useBalance({
    address,
    chainId: sepolia.id,
    enabled: !!address && isConnected,
  })

  useEffect(() => {
    const testConnection = async () => {
      try {
        const response = await fetch('https://eth-sepolia.g.alchemy.com/v2/zgE0eizPW4otRHOQiyndZ', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_blockNumber',
            params: [],
            id: 1,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          setTestResult(`✅ RPC Connected! Block: ${parseInt(data.result, 16)}`)
        } else {
          setTestResult('❌ RPC Error')
        }
      } catch (error) {
        setTestResult('❌ Network Error')
      }
    }

    if (isConnected) {
      testConnection()
    }
  }, [isConnected])

  if (!isConnected) {
    return <div className="text-sm text-gray-500">Wallet not connected</div>
  }

  return (
    <div className="space-y-2 text-sm">
      <div>Status: {testResult}</div>
      <div>Address: {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'None'}</div>
      <div>Balance: {isLoading ? 'Loading...' : error ? 'Error' : balance ? `${balance.formatted} ${balance.symbol}` : 'No data'}</div>
    </div>
  )
}
