export interface Market {
  id: string
  question: string
  description?: string
  endTime: string
  resolutionTime?: string
  state: 'active' | 'locked' | 'resolved' | 'cancelled'
  outcome?: boolean
  oracle: string
  totalPool: number
  yesPool: number
  noPool: number
  creationTime: string
  creator: string
  fee?: number
  category?: string
  totalBetters?: number
  liquidity?: number
}

export interface Position {
  marketId: string
  user: string
  yesAmount: string // encrypted amount
  noAmount: string // encrypted amount
  betCount: number
  hasPosition: boolean
  hasClaimed?: boolean
}

export interface BetInput {
  marketId: string
  amount: bigint
  outcome: boolean
}

export interface MarketStats {
  totalVolume: number
  activeMarkets: number
  totalUsers: number
  averagePool: number
}

export interface OracleData {
  type: 'manual' | 'chainlink' | 'api' | 'consensus'
  dataFeed?: string
  apiEndpoint?: string
  threshold?: number
  isActive: boolean
  lastUpdate: string
}

export interface ResolutionData {
  marketId: string
  outcome: boolean
  timestamp: string
  evidence: string
  resolver: string
  isDisputed: boolean
  disputeDeadline?: string
}

export type MarketFilter = 'trending' | 'crypto' | 'politics' | 'sports' | 'business' | 'all'

export interface CreateMarketParams {
  question: string
  description: string
  endTime: number
  oracle: string
  category?: string
}

