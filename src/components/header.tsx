"use client"

import { useState } from 'react'
import { useWallet } from '@/components/providers/Providers'

export function Header() {
  const { isConnected, address, connect, disconnect } = useWallet()
  const [showWalletModal, setShowWalletModal] = useState(false)

  const handleWalletClick = () => {
    if (isConnected) {
      disconnect()
    } else {
      setShowWalletModal(true)
    }
  }

  const handleConnect = async () => {
    try {
      await connect()
      setShowWalletModal(false)
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  return (
    <>
      <header className="border-b" style={{ 
        borderColor: '#d1d5db',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)'
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <div 
                className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm text-white"
                style={{ backgroundColor: '#164e63' }}
              >
                SP
              </div>
              <span className="font-work-sans font-bold text-xl" style={{ color: '#164e63' }}>SecretPredictions</span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#6b7280' }}>
                Markets
              </a>
              <a href="#" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#6b7280' }}>
                Portfolio
              </a>
              <a href="#" className="text-sm font-medium transition-colors hover:opacity-80" style={{ color: '#6b7280' }}>
                Learn
              </a>
            </nav>

            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm" style={{ color: '#6b7280' }}>
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: '#10b981' }}></div>
                <span>Live on Sepolia Testnet</span>
              </div>
              <button 
                onClick={handleWalletClick}
                className="px-3 py-1 text-sm rounded-md border transition-colors hover:opacity-80"
                style={{ 
                  borderColor: '#d1d5db',
                  color: '#164e63',
                  backgroundColor: 'transparent'
                }}
              >
                {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : 'Connect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Simple Wallet Modal */}
      {showWalletModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowWalletModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#164e63' }}>Connect Wallet</h3>
            <p className="text-sm mb-6" style={{ color: '#6b7280' }}>
              Choose your preferred wallet to connect to SecretPredictions
            </p>
            
            <div className="space-y-3">
              <button
                onClick={handleConnect}
                className="w-full p-4 text-left rounded-lg border transition-colors hover:bg-gray-50"
                style={{ 
                  borderColor: '#d1d5db',
                  color: '#164e63'
                }}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">🦊</span>
                  <div>
                    <div className="font-medium">MetaMask</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>Connect using browser wallet</div>
                  </div>
                </div>
              </button>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-xs" style={{ color: '#6b7280' }}>
                By connecting a wallet, you agree to our Terms of Service and Privacy Policy
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
