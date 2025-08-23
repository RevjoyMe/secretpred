"use client"

import { useState, useEffect } from "react"
import { useAccount } from 'wagmi'

interface SimpleMarket {
  id: string | number
  title: string
  description: string
  yesPrice: number
  noPrice: number
  status: string
}

interface SimpleBettingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  market: SimpleMarket | null
  side: "yes" | "no" | null
}

export default function SimpleBettingModal({ open, onOpenChange, market, side }: SimpleBettingModalProps) {
  const { isConnected, address } = useAccount()
  const [betAmount, setBetAmount] = useState("")
  const [error, setError] = useState("")

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setBetAmount("")
      setError("")
    }
  }, [open])

  if (!market || !side) return null

  const currentPrice = side === "yes" ? market.yesPrice : market.noPrice
  const betAmountNum = Number.parseFloat(betAmount) || 0

  const handlePlaceBet = () => {
    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (betAmountNum <= 0) {
      setError("Please enter a valid bet amount")
      return
    }

    console.log(`[SimpleBettingModal] Placing ${side} bet of ${betAmount} ETH on market ${market.id}`)
    setError("Bet placement functionality coming soon!")
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Place Bet</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Market:</p>
                <p className="font-medium">{market.title}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-2">Betting on:</p>
                <p className="font-medium text-blue-600">{side.toUpperCase()} - {currentPrice}%</p>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Bet Amount (ETH):</label>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0.01"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>

              {isConnected ? (
                <div className="text-sm text-gray-600">
                  Wallet: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
              ) : (
                <div className="text-sm text-red-600">
                  Wallet not connected
                </div>
              )}

              {error && (
                <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePlaceBet}
                  disabled={!isConnected || betAmountNum <= 0}
                  className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                >
                  Place Bet
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
