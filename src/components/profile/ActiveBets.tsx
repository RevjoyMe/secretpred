"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Clock, 
  TrendingUp, 
  TrendingDown,
  ExternalLink,
  Eye
} from "lucide-react"

interface ActiveBetsProps {
  address: string
}

interface ActiveBet {
  id: string
  marketId: number
  marketQuestion: string
  side: "yes" | "no"
  amount: number
  odds: number
  potentialPayout: number
  placedAt: Date
  endTime: Date
  timeRemaining: string
  marketVolume: number
  marketStatus: "active" | "closing" | "resolving"
}

export function ActiveBets({ address }: ActiveBetsProps) {
  // Mock data - in a real application this would be loaded from blockchain
  const activeBets: ActiveBet[] = [
    {
      id: "bet_001",
      marketId: 1,
      marketQuestion: "Will Bitcoin reach $100,000 by end of 2024?",
      side: "yes",
      amount: 0.1,
      odds: 65,
      potentialPayout: 0.154,
      placedAt: new Date("2024-01-15T10:30:00Z"),
      endTime: new Date("2024-12-31T23:59:59Z"),
      timeRemaining: "45 days",
      marketVolume: 1250000,
      marketStatus: "active"
    },
    {
      id: "bet_002",
      marketId: 2,
      marketQuestion: "Democratic Presidential Nominee 2028",
      side: "no",
      amount: 0.05,
      odds: 72,
      potentialPayout: 0.069,
      placedAt: new Date("2024-01-20T14:15:00Z"),
      endTime: new Date("2028-11-05T23:59:59Z"),
      timeRemaining: "4 years",
      marketVolume: 13000000,
      marketStatus: "active"
    },
    {
      id: "bet_003",
      marketId: 3,
      marketQuestion: "Russia x Ukraine ceasefire in 2025?",
      side: "yes",
      amount: 0.2,
      odds: 35,
      potentialPayout: 0.571,
      placedAt: new Date("2024-01-25T09:45:00Z"),
      endTime: new Date("2025-12-31T23:59:59Z"),
      timeRemaining: "1 year",
      marketVolume: 18000000,
      marketStatus: "active"
    }
  ]

  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `$${(volume / 1000000).toFixed(1)}M`
    if (volume >= 1000) return `$${(volume / 1000).toFixed(1)}K`
    return `$${volume}`
  }

  const getSideColor = (side: "yes" | "no") => {
    return side === "yes" 
      ? "bg-green-500/20 text-green-700 border-green-500/30" 
      : "bg-red-500/20 text-red-700 border-red-500/30"
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700 border-green-200"
      case "closing": return "bg-orange-100 text-orange-700 border-orange-200"
      case "resolving": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (activeBets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Active Bets
          </CardTitle>
          <CardDescription>
            You don't have any active bets at the moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            Browse Markets
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Active Bets</h2>
          <p className="text-muted-foreground">
            {activeBets.length} active bets with total value of {formatEth(activeBets.reduce((sum, bet) => sum + bet.amount, 0))}
          </p>
        </div>
        <Button variant="outline">
          <Eye className="w-4 h-4 mr-2" />
          View All Markets
        </Button>
      </div>

      <div className="grid gap-4">
        {activeBets.map((bet) => (
          <Card key={bet.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{bet.marketQuestion}</CardTitle>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Market #{bet.marketId}</span>
                    <span>•</span>
                    <span>Volume: {formatVolume(bet.marketVolume)}</span>
                    <span>•</span>
                    <span>Placed {bet.placedAt.toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getSideColor(bet.side)}>
                    {bet.side.toUpperCase()}
                  </Badge>
                  <Badge className={getStatusColor(bet.marketStatus)}>
                    {bet.marketStatus}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Your Bet</div>
                  <div className="text-lg font-semibold">{formatEth(bet.amount)}</div>
                  <div className="text-xs text-muted-foreground">
                    Odds: {formatPercentage(bet.odds)}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Potential Payout</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatEth(bet.potentialPayout)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    +{formatEth(bet.potentialPayout - bet.amount)} profit
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Time Remaining</div>
                  <div className="text-lg font-semibold text-orange-600">
                    {bet.timeRemaining}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Ends {bet.endTime.toLocaleDateString()}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Actions</div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Track
                    </Button>
                  </div>
                </div>
              </div>

              {/* Progress bar for time remaining */}
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Time Progress</span>
                  <span className="text-muted-foreground">
                    {Math.round(((Date.now() - bet.placedAt.getTime()) / (bet.endTime.getTime() - bet.placedAt.getTime())) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={((Date.now() - bet.placedAt.getTime()) / (bet.endTime.getTime() - bet.placedAt.getTime())) * 100} 
                  className="h-2"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Active Bets Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{activeBets.length}</div>
              <div className="text-sm text-muted-foreground">Total Active Bets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatEth(activeBets.reduce((sum, bet) => sum + bet.amount, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Total Wagered</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {formatEth(activeBets.reduce((sum, bet) => sum + bet.potentialPayout, 0))}
              </div>
              <div className="text-sm text-muted-foreground">Potential Payout</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
