'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, TrendingUp, TrendingDown, Shield, Eye, EyeOff, Wallet, Info } from 'lucide-react'
import { Market } from '@/types/market'
import { useAccount, useBalance } from 'wagmi'
import { usePredictionMarket } from '@/hooks/usePredictionMarket'
import { formatEther, parseEther } from 'ethers'

interface BettingModalProps {
  market: Market
  selectedOutcome: 'yes' | 'no' | null
  isOpen: boolean
  onClose: () => void
}

export function BettingModal({ market, selectedOutcome, isOpen, onClose }: BettingModalProps) {
  const [betAmount, setBetAmount] = useState('')
  const [outcome, setOutcome] = useState<'yes' | 'no'>(selectedOutcome || 'yes')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPrivacyInfo, setShowPrivacyInfo] = useState(false)

  const { address, isConnected } = useAccount()
  const { data: balance } = useBalance({ address })
  const { placeBet, isLoading } = usePredictionMarket()

  useEffect(() => {
    if (selectedOutcome) {
      setOutcome(selectedOutcome)
    }
  }, [selectedOutcome])

  const yesPercentage = market.yesPool > 0 ? (market.yesPool / market.totalPool) * 100 : 50
  const noPercentage = 100 - yesPercentage

  const getCurrentOdds = () => {
    return outcome === 'yes' ? yesPercentage : noPercentage
  }

  const getPotentialPayout = () => {
    if (!betAmount) return 0
    const amount = parseFloat(betAmount)
    const odds = getCurrentOdds() / 100
    // Simplified payout calculation
    return amount / odds
  }

  const handleBetSubmit = async () => {
    if (!betAmount || !isConnected) return

    try {
      setIsSubmitting(true)
      
      await placeBet({
        marketId: market.id,
        amount: parseEther(betAmount),
        outcome: outcome === 'yes'
      })

      onClose()
      setBetAmount('')
    } catch (error) {
      console.error('Betting failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getOutcomeIcon = (type: 'yes' | 'no') => {
    return type === 'yes' ? TrendingUp : TrendingDown
  }

  const getOutcomeColor = (type: 'yes' | 'no') => {
    return type === 'yes' 
      ? 'text-success-600 bg-success-50 dark:bg-success-900/20' 
      : 'text-danger-600 bg-danger-50 dark:bg-danger-900/20'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative bg-white dark:bg-dark-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 p-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Place Private Bet
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Privacy Badge */}
              <div className="mt-4 flex items-center gap-2 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                <Shield className="w-5 h-5 text-primary-600" />
                <div>
                  <p className="text-sm font-medium text-primary-900 dark:text-primary-100">
                    Fully Private Betting
                  </p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">
                    Your position is encrypted with FHE until market resolution
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Market Question */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                  {market.question}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {market.description}
                </p>
              </div>

              {/* Outcome Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Choose Outcome
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(['yes', 'no'] as const).map((type) => {
                    const Icon = getOutcomeIcon(type)
                    const isSelected = outcome === type
                    const percentage = type === 'yes' ? yesPercentage : noPercentage
                    
                    return (
                      <button
                        key={type}
                        onClick={() => setOutcome(type)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                          isSelected
                            ? `border-${type === 'yes' ? 'success' : 'danger'}-500 ${getOutcomeColor(type)}`
                            : 'border-gray-200 dark:border-dark-600 hover:border-gray-300 dark:hover:border-dark-500'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Icon className={`w-5 h-5 ${isSelected ? '' : 'text-gray-500'}`} />
                          <span className={`font-semibold uppercase ${isSelected ? '' : 'text-gray-500'}`}>
                            {type}
                          </span>
                        </div>
                        <div className={`text-sm ${isSelected ? '' : 'text-gray-500'}`}>
                          {percentage.toFixed(1)}% chance
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Bet Amount */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Bet Amount (ETH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="10"
                    placeholder="0.00"
                    className="input-field pr-20"
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
                    ETH
                  </div>
                </div>
                
                {/* Quick Amount Buttons */}
                <div className="flex gap-2 mt-3">
                  {['0.01', '0.1', '0.5', '1'].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => setBetAmount(amount)}
                      className="px-3 py-1 text-sm bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                    >
                      {amount} ETH
                    </button>
                  ))}
                </div>

                {/* Balance Display */}
                {isConnected && balance && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Balance: {parseFloat(formatEther(balance.value)).toFixed(4)} ETH
                  </p>
                )}
              </div>

              {/* Potential Payout */}
              {betAmount && (
                <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Potential Payout</span>
                    <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {getPotentialPayout().toFixed(4)} ETH
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Potential Profit</span>
                    <span className="text-sm font-medium text-success-600">
                      +{(getPotentialPayout() - parseFloat(betAmount)).toFixed(4)} ETH
                    </span>
                  </div>
                </div>
              )}

              {/* Privacy Info */}
              <div className="mb-6">
                <button
                  onClick={() => setShowPrivacyInfo(!showPrivacyInfo)}
                  className="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Info className="w-4 h-4" />
                  How does private betting work?
                </button>
                
                <AnimatePresence>
                  {showPrivacyInfo && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl overflow-hidden"
                    >
                      <div className="space-y-2 text-sm text-primary-800 dark:text-primary-200">
                        <div className="flex items-start gap-2">
                          <EyeOff className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Your bet amount and outcome are encrypted using Zama FHE</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>No one can see your position until market resolves</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Eye className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>Only aggregate odds are visible, not individual bets</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Submit Button */}
              <div className="space-y-3">
                {!isConnected ? (
                  <button className="w-full btn-primary flex items-center justify-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Connect Wallet to Bet
                  </button>
                ) : (
                  <button
                    onClick={handleBetSubmit}
                    disabled={!betAmount || isSubmitting || isLoading}
                    className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                      outcome === 'yes' 
                        ? 'bet-button-yes' 
                        : 'bet-button-no'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {(isSubmitting || isLoading) ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Placing Bet...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Place Private Bet
                      </>
                    )}
                  </button>
                )}
                
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  By betting, you agree to our terms and understand this is encrypted gambling.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

