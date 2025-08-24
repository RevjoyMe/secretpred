"use client"

import { useAccount, useNetwork, useSwitchNetwork } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle } from 'lucide-react'

interface NetworkStatusProps {
  className?: string
}

export function NetworkStatus({ className = "" }: NetworkStatusProps) {
  const { isConnected, address } = useAccount()
  const { chain } = useNetwork()
  const { switchNetwork, isPending: isSwitching } = useSwitchNetwork()
  const [showSwitchPrompt, setShowSwitchPrompt] = useState(false)

  useEffect(() => {
    if (isConnected && chain && chain.id !== sepolia.id) {
      setShowSwitchPrompt(true)
    } else {
      setShowSwitchPrompt(false)
    }
  }, [isConnected, chain])

  if (!isConnected) {
    return null
  }

  if (showSwitchPrompt) {
    return (
      <div className={`flex items-center gap-2 text-sm text-orange-600 ${className}`}>
        <AlertTriangle className="w-4 h-4" />
        <span>Wrong network</span>
        <button
          onClick={() => switchNetwork?.(sepolia.id)}
          disabled={isSwitching}
          className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
        >
          {isSwitching ? 'Switching...' : 'Switch to Sepolia'}
        </button>
      </div>
    )
  }

  if (chain?.id === sepolia.id) {
    return (
      <div className={`flex items-center gap-2 text-sm text-green-600 ${className}`}>
        <CheckCircle className="w-4 h-4" />
        <span>Connected to Sepolia</span>
      </div>
    )
  }

  return (
    <div className={`text-sm text-gray-500 ${className}`}>
      Checking network...
    </div>
  )
}
