'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, TrendingUp, TrendingDown, Users, DollarSign, Eye, EyeOff, Calendar } from 'lucide-react'
import { Market } from '@/types/market'
import { formatDistanceToNow } from 'date-fns'
import { BettingModal } from './BettingModal'

interface MarketCardProps {
  market: Market
}

export function MarketCard({ market }: MarketCardProps) {
  const [showBettingModal, setShowBettingModal] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no' | null>(null)

  const yesPercentage = market.yesPool > 0 ? (market.yesPool / market.totalPool) * 100 : 50
  const noPercentage = 100 - yesPercentage

  const handleBetClick = (outcome: 'yes' | 'no') => {
    setSelectedOutcome(outcome)
    setShowBettingModal(true)
  }

  const getMarketStatusBadge = () => {
    const now = new Date()
    const endTime = new Date(market.endTime)
    
    if (market.state === 'resolved') {
      return <span className="badge-closed">Resolved</span>
    } else if (market.state === 'locked') {
      return <span className="badge-closed">Locked</span>
    } else if (endTime > now) {
      return <span className="badge-active">Active</span>
    }
    return <span className="badge-closed">Ended</span>
  }

  const getTimeRemaining = () => {
    const endTime = new Date(market.endTime)
    const now = new Date()
    
    if (endTime > now) {
      return `Ends ${formatDistanceToNow(endTime, { addSuffix: true })}`
    }
    return `Ended ${formatDistanceToNow(endTime, { addSuffix: true })}`
  }

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    } else if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount.toLocaleString()}`
  }

  return (
    <>
      <motion.div
        className="market-card group cursor-pointer"
        whileHover={{ y: -2 }}
        onClick={() => setShowBettingModal(true)}
      >
        {/* Card Header */}
        <div className="p-6 pb-4">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              {getMarketStatusBadge()}
              <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-full">
                <Eye className="w-3 h-3" />
                FHE Encrypted
              </span>
            </div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {getTimeRemaining()}
            </div>
          </div>

          <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {market.question}
          </h3>

          {market.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {market.description}
            </p>
          )}

          {/* Market Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(market.totalPool)}
              </div>
              <div className="text-xs text-muted-foreground">Total Pool</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {market.totalBetters}
              </div>
              <div className="text-xs text-muted-foreground">Bettors</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-foreground">
                {formatCurrency(market.liquidity)}
              </div>
              <div className="text-xs text-muted-foreground">Liquidity</div>
            </div>
          </div>
        </div>

        {/* Odds Display */}
        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-foreground">
              Current Odds
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <EyeOff className="w-3 h-3" />
              Positions Hidden
            </span>
          </div>

          {/* Odds Bar */}
          <div className="relative h-8 bg-muted rounded-lg overflow-hidden mb-4">
            <div 
              className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
              style={{ width: `${yesPercentage}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-3">
              <span className="text-sm font-semibold text-white drop-shadow">
                YES {yesPercentage.toFixed(1)}%
              </span>
              <span className="text-sm font-semibold text-white drop-shadow">
                NO {noPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {/* Betting Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleBetClick('yes')
              }}
              className="bet-button-yes w-full"
            >
              Bet YES
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleBetClick('no')
              }}
              className="bet-button-no w-full"
            >
              Bet NO
            </button>
          </div>
        </div>

        {/* Card Footer */}
        <div className="px-6 py-3 bg-muted/30 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Category: {market.category}</span>
            <span>Oracle: {market.oracle}</span>
          </div>
        </div>
      </motion.div>

      {/* Betting Modal */}
      {showBettingModal && (
        <BettingModal
          market={market}
          selectedOutcome={selectedOutcome}
          onClose={() => {
            setShowBettingModal(false)
            setSelectedOutcome(null)
          }}
        />
      )}
    </>
  )
}

