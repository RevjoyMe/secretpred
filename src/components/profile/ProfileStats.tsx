"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target,
  Trophy,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react"

interface ProfileStatsProps {
  address: string
}

export function ProfileStats({ address }: ProfileStatsProps) {
  // Mock data - в реальном приложении это будет загружаться из блокчейна
  const stats = {
    totalBets: 24,
    activeBets: 3,
    wonBets: 15,
    lostBets: 6,
    pendingBets: 3,
    totalWagered: 2.45,
    totalWon: 3.2,
    totalLost: 1.8,
    netPnL: 1.4,
    winRate: 62.5,
    claimableRewards: 0.85
  }

  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`
  const formatPercentage = (value: number) => `${value.toFixed(1)}%`

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total P&L</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              +{formatEth(stats.netPnL)}
            </div>
            <p className="text-xs text-muted-foreground">
              +{formatPercentage((stats.netPnL / stats.totalWagered) * 100)} from wagered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPercentage(stats.winRate)}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.wonBets} wins out of {stats.totalBets} bets
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Bets</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {stats.activeBets}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatEth(stats.totalWagered)} total wagered
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claimable</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatEth(stats.claimableRewards)}
            </div>
            <p className="text-xs text-muted-foreground">
              Ready to claim
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Betting Summary</CardTitle>
            <CardDescription>Your overall betting performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Bets</span>
              <span className="font-medium">{stats.totalBets}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Won</span>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-medium text-green-600">{stats.wonBets}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Lost</span>
              <div className="flex items-center gap-2">
                <XCircle className="w-4 h-4 text-red-500" />
                <span className="font-medium text-red-600">{stats.lostBets}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Pending</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-orange-500" />
                <span className="font-medium text-orange-600">{stats.pendingBets}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financial Summary</CardTitle>
            <CardDescription>Your betting financials</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Wagered</span>
              <span className="font-medium">{formatEth(stats.totalWagered)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Won</span>
              <span className="font-medium text-green-600">+{formatEth(stats.totalWon)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Lost</span>
              <span className="font-medium text-red-600">-{formatEth(stats.totalLost)}</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm font-medium">Net P&L</span>
              <span className={`font-bold ${stats.netPnL >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.netPnL >= 0 ? '+' : ''}{formatEth(stats.netPnL)}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Performance</CardTitle>
            <CardDescription>Your betting metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Win Rate</span>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                {formatPercentage(stats.winRate)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">ROI</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                +{formatPercentage((stats.netPnL / stats.totalWagered) * 100)}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Avg Bet Size</span>
              <span className="font-medium">{formatEth(stats.totalWagered / stats.totalBets)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Claimable</span>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                {formatEth(stats.claimableRewards)}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
