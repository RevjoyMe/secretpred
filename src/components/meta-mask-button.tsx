"use client"

import { useState, useEffect } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { sepolia } from 'wagmi/chains'

export function MetaMaskButton() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAccount()
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()

  const connectMetaMask = async () => {
    setIsConnecting(true)
    setError(null)
    
    try {
      // Check if MetaMask is installed
      if (typeof window !== 'undefined' && window.ethereum) {
        // Request connection to MetaMask
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        if (accounts && accounts.length > 0) {
          // Switch to Sepolia if needed
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // Sepolia chainId
            })
          } catch (switchError: any) {
            // If network is not added, add it
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'Sepolia Ether',
                    symbol: 'SEP',
                    decimals: 18
                  },
                  rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }]
              })
            }
          }
          
          // Connect through wagmi
          const metaMaskConnector = connectors.find(c => c.id === 'metaMask')
          if (metaMaskConnector) {
            connect({ connector: metaMaskConnector })
          }
        }
      } else {
        setError('MetaMask is not installed! Please install MetaMask and try again.')
      }
    } catch (err: any) {
      setError(err.message || 'Error connecting to MetaMask')
    } finally {
      setIsConnecting(false)
    }
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </div>
        <button
          onClick={() => disconnect()}
          className="bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={connectMetaMask}
        disabled={isConnecting}
        className="bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-medium px-6 py-3 rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
      >
        <img 
          src="https://cdn.rainbow.me/metamask.svg" 
          alt="MetaMask" 
          className="w-5 h-5"
        />
        {isConnecting ? 'Connecting...' : 'Connect MetaMask'}
      </button>
      
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">
          {error}
        </div>
      )}
    </div>
  )
}
