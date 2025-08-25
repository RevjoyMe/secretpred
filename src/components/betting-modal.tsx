"use client"

import { useState } from 'react'
import { usePredictionMarket } from '@/hooks/usePredictionMarket'

interface BettingModalProps {
  isOpen: boolean
  onClose: () => void
  marketId: number
  marketTitle: string
  yesPrice: number
  noPrice: number
}

export function BettingModal({ isOpen, onClose, marketId, marketTitle, yesPrice, noPrice }: BettingModalProps) {
  const { handlePlaceBet, isPlacingBet, isWaitingForBet, betSuccess, betError } = usePredictionMarket()
  const [betAmount, setBetAmount] = useState('0.01')
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleBet = async () => {
    if (!selectedOutcome) {
      setError('Please select YES or NO')
      return
    }

    if (!betAmount || parseFloat(betAmount) <= 0) {
      setError('Please enter a valid bet amount')
      return
    }

    try {
      setError(null)
      await handlePlaceBet(marketId, selectedOutcome === 'yes', betAmount)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place bet')
    }
  }

  const handleClose = () => {
    setBetAmount('0.01')
    setSelectedOutcome(null)
    setError(null)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold" style={{ color: '#164e63' }}>Place Your Bet</h3>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <h4 className="font-medium mb-2" style={{ color: '#164e63' }}>{marketTitle}</h4>
          <div className="flex justify-between text-sm" style={{ color: '#6b7280' }}>
            <span>YES: {yesPrice}¢</span>
            <span>NO: {noPrice}¢</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#164e63' }}>
            Select Outcome
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setSelectedOutcome('yes')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedOutcome === 'yes' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-300 hover:border-green-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: '#10b981' }}>YES</div>
                <div className="text-sm" style={{ color: '#6b7280' }}>{yesPrice}¢</div>
              </div>
            </button>
            <button
              onClick={() => setSelectedOutcome('no')}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedOutcome === 'no' 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-red-300'
              }`}
            >
              <div className="text-center">
                <div className="text-lg font-bold" style={{ color: '#ef4444' }}>NO</div>
                <div className="text-sm" style={{ color: '#6b7280' }}>{noPrice}¢</div>
              </div>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" style={{ color: '#164e63' }}>
            Bet Amount (ETH)
          </label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            min="0.01"
            max="10"
            step="0.01"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{ borderColor: '#d1d5db' }}
            placeholder="0.01"
          />
          <div className="text-xs mt-1" style={{ color: '#6b7280' }}>
            Min: 0.01 ETH | Max: 10 ETH
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
            {error}
          </div>
        )}

        {betError && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
            {betError.message}
          </div>
        )}

        {betSuccess && (
          <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
            Bet placed successfully! Transaction confirmed.
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            className="flex-1 px-4 py-2 border rounded-lg transition-colors"
            style={{ 
              borderColor: '#d1d5db',
              color: '#6b7280'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleBet}
            disabled={isPlacingBet || isWaitingForBet || !selectedOutcome}
            className="flex-1 px-4 py-2 rounded-lg text-white transition-colors disabled:opacity-50"
            style={{ backgroundColor: '#164e63' }}
          >
            {isPlacingBet || isWaitingForBet ? 'Placing Bet...' : 'Place Bet'}
          </button>
        </div>

        {betSuccess && (
          <div className="mt-4 text-center">
            <button
              onClick={handleClose}
              className="px-4 py-2 rounded-lg text-white"
              style={{ backgroundColor: '#10b981' }}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
