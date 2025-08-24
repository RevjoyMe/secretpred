'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MarketCard } from './MarketCard'
import { Market } from '@/types/market'
import { Loader2, TrendingUp, Search, Clock, Users, DollarSign } from 'lucide-react'

interface MarketGridProps {
  section?: string
}

export function MarketGrid({ section = 'trending' }: MarketGridProps) {
  const [markets, setMarkets] = useState<Market[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data - replace with actual API call
  const mockMarkets: Market[] = [
    {
      id: '1',
      question: 'Will Bitcoin reach $120,000 by end of 2024?',
      description: 'Bitcoin price prediction based on major exchanges average price',
      endTime: '2024-12-31T23:59:59Z',
      state: 'active',
      totalPool: 125000,
      yesPool: 75000,
      noPool: 50000,
      category: 'crypto',
      totalBetters: 156,
      liquidity: 200000,
      creator: '0x123...',
      oracle: '0x456...',
      creationTime: '2024-08-01T00:00:00Z'
    },
    {
      id: '2',
      question: 'Will Trump win the 2024 Presidential Election?',
      description: 'Based on official election results from all 50 states',
      endTime: '2024-11-05T23:59:59Z',
      state: 'active',
      totalPool: 2500000,
      yesPool: 1400000,
      noPool: 1100000,
      category: 'politics',
      totalBetters: 1247,
      liquidity: 3200000,
      creator: '0x789...',
      oracle: '0xabc...',
      creationTime: '2024-07-15T00:00:00Z'
    },
    {
      id: '3',
      question: 'Will Ethereum reach $5,000 in 2024?',
      description: 'ETH price prediction for 2024 based on Coinbase and Binance average',
      endTime: '2024-12-31T23:59:59Z',
      state: 'active',
      totalPool: 89000,
      yesPool: 62300,
      noPool: 26700,
      category: 'crypto',
      totalBetters: 98,
      liquidity: 150000,
      creator: '0xdef...',
      oracle: '0x789...',
      creationTime: '2024-08-10T00:00:00Z'
    },
    {
      id: '4',
      question: 'Will Lakers make the NBA Playoffs 2024-25?',
      description: 'Based on official NBA standings at end of regular season',
      endTime: '2025-04-15T23:59:59Z',
      state: 'active',
      totalPool: 67000,
      yesPool: 40200,
      noPool: 26800,
      category: 'sports',
      totalBetters: 89,
      liquidity: 95000,
      creator: '0x456...',
      oracle: '0xdef...',
      creationTime: '2024-08-20T00:00:00Z'
    },
    {
      id: '5',
      question: 'Will Apple stock reach $300 by end of 2024?',
      description: 'AAPL stock price prediction based on market closing price',
      endTime: '2024-12-31T23:59:59Z',
      state: 'active',
      totalPool: 156000,
      yesPool: 93600,
      noPool: 62400,
      category: 'business',
      totalBetters: 203,
      liquidity: 220000,
      creator: '0xabc...',
      oracle: '0x123...',
      creationTime: '2024-08-05T00:00:00Z'
    },
    {
      id: '6',
      question: 'Will SpaceX successfully land on Mars in 2024?',
      description: 'Based on official SpaceX mission success criteria',
      endTime: '2024-12-31T23:59:59Z',
      state: 'active',
      totalPool: 45000,
      yesPool: 13500,
      noPool: 31500,
      category: 'technology',
      totalBetters: 67,
      liquidity: 60000,
      creator: '0xdef...',
      oracle: '0x456...',
      creationTime: '2024-08-15T00:00:00Z'
    }
  ]

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setMarkets(mockMarkets)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const filteredMarkets = markets.filter(market => {
    const matchesSearch = market.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (section === 'trending') {
      return matchesSearch && market.totalBetters > 100
    } else if (section === 'ending') {
      const endDate = new Date(market.endTime)
      const now = new Date()
      const daysUntilEnd = (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      return matchesSearch && daysUntilEnd <= 30
    }
    
    return matchesSearch
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-muted-foreground">Loading markets...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search markets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
        />
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Volume</span>
          </div>
          <p className="text-2xl font-bold mt-1">$2.8M</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Active Users</span>
          </div>
          <p className="text-2xl font-bold mt-1">1,856</p>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <span className="text-sm text-muted-foreground">Markets Ending Soon</span>
          </div>
          <p className="text-2xl font-bold mt-1">12</p>
        </div>
      </div>

      {/* Markets Grid */}
      {filteredMarkets.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {searchQuery ? 'No markets found matching your search.' : 'No markets available.'}
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary hover:underline"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMarkets.map((market, index) => (
            <motion.div
              key={market.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MarketCard market={market} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {filteredMarkets.length > 0 && (
        <div className="text-center pt-8">
          <button className="btn-primary">
            View All Markets
          </button>
        </div>
      )}
    </div>
  )
}

