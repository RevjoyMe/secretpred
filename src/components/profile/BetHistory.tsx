"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Filter,
  Download,
  ExternalLink,
  TrendingUp
} from "lucide-react"
import { useState } from "react"

interface BetHistoryProps {
  address: string
}

interface BetHistoryItem {
  id: string
  marketId: number
  marketQuestion: string
  side: "yes" | "no"
  amount: number
  odds: number
  payout: number | null
  result: "won" | "lost" | "pending"
  placedAt: Date
  resolvedAt: Date | null
  txHash: string
  marketVolume: number
}

export function BetHistory({ address }: BetHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<"all" | "won" | "lost" | "pending">("all")

  // Mock data - в реальном приложении это будет загружаться из блокчейна
  const betHistory: BetHistoryItem[] = [
    {
      id: "bet_001",
      marketId: 1,
      marketQuestion: "Will Bitcoin reach $100,000 by end of 2024?",
      side: "yes",
      amount: 0.1,
      odds: 65,
      payout: 0.154,
      result: "won",
      placedAt: new Date("2024-01-15T10:30:00Z"),
      resolvedAt: new Date("2024-01-20T15:45:00Z"),
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      marketVolume: 1250000
    },
    {
      id: "bet_002",
      marketId: 2,
      marketQuestion: "Fed Rate Decision March 2024",
      side: "no",
      amount: 0.05,
      odds: 72,
      payout: null,
      result: "lost",
      placedAt: new Date("2024-01-10T14:15:00Z"),
      resolvedAt: new Date("2024-01-15T12:30:00Z"),
      txHash: "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
      marketVolume: 850000
    },
    {
      id: "bet_003",
      marketId: 3,
      marketQuestion: "Election 2024 Winner",
      side: "yes",
      amount: 0.2,
      odds: 35,
      payout: null,
      result: "pending",
      placedAt: new Date("2024-01-25T09:45:00Z"),
      resolvedAt: null,
      txHash: "0x7890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123456",
      marketVolume: 18000000
    },
    {
      id: "bet_004",
      marketId: 4,
      marketQuestion: "Tesla Stock Price End of Q1 2024",
      side: "no",
      amount: 0.15,
      odds: 58,
      payout: 0.259,
      result: "won",
      placedAt: new Date("2024-01-05T11:20:00Z"),
      resolvedAt: new Date("2024-01-10T16:15:00Z"),
      txHash: "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
      marketVolume: 950000
    },
    {
      id: "bet_005",
      marketId: 5,
      marketQuestion: "COVID-19 Restrictions Lifted by June 2024",
      side: "yes",
      amount: 0.08,
      odds: 45,
      payout: null,
      result: "lost",
      placedAt: new Date("2024-01-12T13:30:00Z"),
      resolvedAt: new Date("2024-01-18T10:45:00Z"),
      txHash: "0xdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abc",
      marketVolume: 1200000
    }
  ]

  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`
    return `$${volume}`
  }

  const getResultColor = (result: string) => {
    switch (result) {
      case "won": return "bg-green-100 text-green-700 border-green-200"
      case "lost": return "bg-red-100 text-red-700 border-red-200"
      case "pending": return "bg-orange-100 text-orange-700 border-orange-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getSideColor = (side: "yes" | "no") => {
    return side === "yes" 
      ? "bg-green-500/20 text-green-700 border-green-500/30" 
      : "bg-red-500/20 text-red-700 border-red-500/30"
  }

  const getResultIcon = (result: string) => {
    switch (result) {
      case "won": return <CheckCircle className="w-4 h-4 text-green-600" />
      case "lost": return <XCircle className="w-4 h-4 text-red-600" />
      case "pending": return <Clock className="w-4 h-4 text-orange-600" />
      default: return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  // Filter bets based on search and filter
  const filteredBets = betHistory.filter(bet => {
    const matchesSearch = bet.marketQuestion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bet.marketId.toString().includes(searchTerm)
    const matchesFilter = filter === "all" || bet.result === filter
    return matchesSearch && matchesFilter
  })

  const stats = {
    total: betHistory.length,
    won: betHistory.filter(bet => bet.result === "won").length,
    lost: betHistory.filter(bet => bet.result === "lost").length,
    pending: betHistory.filter(bet => bet.result === "pending").length,
    totalWagered: betHistory.reduce((sum, bet) => sum + bet.amount, 0),
    totalWon: betHistory.filter(bet => bet.result === "won").reduce((sum, bet) => sum + (bet.payout || 0), 0),
    totalLost: betHistory.filter(bet => bet.result === "lost").reduce((sum, bet) => sum + bet.amount, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Bet History</h2>
          <p className="text-muted-foreground">
            {stats.total} total bets • {formatEth(stats.totalWagered)} wagered
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Bets</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Won</p>
                <p className="text-2xl font-bold text-green-600">{stats.won}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lost</p>
                <p className="text-2xl font-bold text-red-600">{stats.lost}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net P&L</p>
                <p className={`text-2xl font-bold ${stats.totalWon - stats.totalLost >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.totalWon - stats.totalLost >= 0 ? '+' : ''}{formatEth(stats.totalWon - stats.totalLost)}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search bets by question or market ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("all")}
              >
                All ({stats.total})
              </Button>
              <Button
                variant={filter === "won" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("won")}
              >
                Won ({stats.won})
              </Button>
              <Button
                variant={filter === "lost" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("lost")}
              >
                Lost ({stats.lost})
              </Button>
              <Button
                variant={filter === "pending" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("pending")}
              >
                Pending ({stats.pending})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bet History List */}
      <div className="space-y-4">
        {filteredBets.map((bet) => (
          <Card key={bet.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{bet.marketQuestion}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Market #{bet.marketId}</span>
                    <span>•</span>
                    <span>Volume: {formatVolume(bet.marketVolume)}</span>
                    <span>•</span>
                    <span>Placed {bet.placedAt.toLocaleDateString()}</span>
                    {bet.resolvedAt && (
                      <>
                        <span>•</span>
                        <span>Resolved {bet.resolvedAt.toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSideColor(bet.side)}>
                    {bet.side.toUpperCase()}
                  </Badge>
                  <Badge className={getResultColor(bet.result)}>
                    {getResultIcon(bet.result)}
                    <span className="ml-1">{bet.result.toUpperCase()}</span>
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Bet Amount</p>
                  <p className="font-semibold">{formatEth(bet.amount)}</p>
                  <p className="text-xs text-muted-foreground">Odds: {formatPercentage(bet.odds)}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Payout</p>
                  <p className={`font-semibold ${bet.payout ? 'text-green-600' : 'text-gray-500'}`}>
                    {bet.payout ? formatEth(bet.payout) : 'N/A'}
                  </p>
                  {bet.payout && (
                    <p className="text-xs text-green-600">
                      +{formatEth(bet.payout - bet.amount)} profit
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Transaction</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {bet.txHash.slice(0, 10)}...{bet.txHash.slice(-8)}
                  </p>
                  <Button size="sm" variant="link" className="p-0 h-auto text-xs">
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View on Explorer
                  </Button>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Actions</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View Market
                    </Button>
                    {bet.result === "won" && bet.payout && (
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Claim
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBets.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No bets found matching your criteria.</p>
            <Button className="mt-4" onClick={() => { setSearchTerm(""); setFilter("all"); }}>
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
