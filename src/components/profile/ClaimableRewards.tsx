"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Trophy, 
  CheckCircle, 
  DollarSign,
  ExternalLink,
  Zap,
  Gift,
  Star,
  Info
} from "lucide-react"
import { useState } from "react"

interface ClaimableRewardsProps {
  address: string
}

interface ClaimableReward {
  id: string
  marketId: number
  marketQuestion: string
  type: "bet_payout" | "bonus" | "referral" | "achievement"
  amount: number
  description: string
  claimableAt: Date
  expiresAt: Date | null
  txHash?: string
  status: "claimable" | "claimed" | "expired"
}

export function ClaimableRewards({ address }: ClaimableRewardsProps) {
  const [isClaiming, setIsClaiming] = useState<string | null>(null)

  // Mock data - в реальном приложении это будет загружаться из блокчейна
  const claimableRewards: ClaimableReward[] = [
    {
      id: "reward_001",
      marketId: 1,
      marketQuestion: "Will Bitcoin reach $100,000 by end of 2024?",
      type: "bet_payout",
      amount: 0.154,
      description: "Winning payout from your YES bet",
      claimableAt: new Date("2024-01-20T15:45:00Z"),
      expiresAt: new Date("2024-12-31T23:59:59Z"),
      txHash: "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
      status: "claimable"
    },
    {
      id: "reward_002",
      marketId: 4,
      marketQuestion: "Tesla Stock Price End of Q1 2024",
      type: "bet_payout",
      amount: 0.259,
      description: "Winning payout from your NO bet",
      claimableAt: new Date("2024-01-10T16:15:00Z"),
      expiresAt: new Date("2024-12-31T23:59:59Z"),
      txHash: "0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123",
      status: "claimable"
    },
    {
      id: "reward_003",
      marketId: 0,
      marketQuestion: "",
      type: "bonus",
      amount: 0.05,
      description: "Welcome bonus for new user",
      claimableAt: new Date("2024-01-01T00:00:00Z"),
      expiresAt: new Date("2024-06-30T23:59:59Z"),
      status: "claimable"
    },
    {
      id: "reward_004",
      marketId: 0,
      marketQuestion: "",
      type: "referral",
      amount: 0.02,
      description: "Referral bonus for inviting a friend",
      claimableAt: new Date("2024-01-15T12:00:00Z"),
      expiresAt: new Date("2024-12-31T23:59:59Z"),
      status: "claimable"
    },
    {
      id: "reward_005",
      marketId: 0,
      marketQuestion: "",
      type: "achievement",
      amount: 0.01,
      description: "Achievement: First 10 bets placed",
      claimableAt: new Date("2024-01-18T10:30:00Z"),
      expiresAt: new Date("2024-12-31T23:59:59Z"),
      status: "claimable"
    }
  ]

  const formatEth = (amount: number) => `${amount.toFixed(3)} ETH`

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case "bet_payout": return <Trophy className="w-5 h-5 text-green-600" />
      case "bonus": return <Gift className="w-5 h-5 text-blue-600" />
      case "referral": return <Star className="w-5 h-5 text-purple-600" />
      case "achievement": return <CheckCircle className="w-5 h-5 text-yellow-600" />
      default: return <DollarSign className="w-5 h-5 text-gray-600" />
    }
  }

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case "bet_payout": return "bg-green-100 text-green-700 border-green-200"
      case "bonus": return "bg-blue-100 text-blue-700 border-blue-200"
      case "referral": return "bg-purple-100 text-purple-700 border-purple-200"
      case "achievement": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getRewardTypeLabel = (type: string) => {
    switch (type) {
      case "bet_payout": return "Bet Payout"
      case "bonus": return "Bonus"
      case "referral": return "Referral"
      case "achievement": return "Achievement"
      default: return "Reward"
    }
  }

  const handleClaimReward = async (rewardId: string) => {
    setIsClaiming(rewardId)
    try {
      // Simulate claim transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      console.log(`Claiming reward ${rewardId}`)
      // В реальном приложении здесь будет вызов смарт-контракта
    } catch (error) {
      console.error("Failed to claim reward:", error)
    } finally {
      setIsClaiming(null)
    }
  }

  const handleClaimAll = async () => {
    setIsClaiming("all")
    try {
      // Simulate batch claim transaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      console.log("Claiming all rewards")
      // В реальном приложении здесь будет вызов смарт-контракта
    } catch (error) {
      console.error("Failed to claim all rewards:", error)
    } finally {
      setIsClaiming(null)
    }
  }

  const totalClaimable = claimableRewards.reduce((sum, reward) => sum + reward.amount, 0)
  const claimableCount = claimableRewards.filter(reward => reward.status === "claimable").length

  if (claimableRewards.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Claimable Rewards
          </CardTitle>
          <CardDescription>
            You don't have any claimable rewards at the moment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full">
            Start Betting to Earn Rewards
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Claimable Rewards</h2>
          <p className="text-muted-foreground">
            {claimableCount} rewards available • {formatEth(totalClaimable)} total
          </p>
        </div>
        <Button 
          onClick={handleClaimAll}
          disabled={isClaiming === "all" || claimableCount === 0}
          className="bg-green-600 hover:bg-green-700"
        >
          {isClaiming === "all" ? (
            <>
              <Zap className="w-4 h-4 mr-2 animate-spin" />
              Claiming All...
            </>
          ) : (
            <>
              <Trophy className="w-4 h-4 mr-2" />
              Claim All ({claimableCount})
            </>
          )}
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Claimable</p>
                <p className="text-2xl font-bold text-green-600">{formatEth(totalClaimable)}</p>
              </div>
              <Trophy className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bet Payouts</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatEth(claimableRewards.filter(r => r.type === "bet_payout").reduce((sum, r) => sum + r.amount, 0))}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Bonuses</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatEth(claimableRewards.filter(r => r.type !== "bet_payout").reduce((sum, r) => sum + r.amount, 0))}
                </p>
              </div>
              <Gift className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available</p>
                <p className="text-2xl font-bold text-orange-600">{claimableCount}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards List */}
      <div className="space-y-4">
        {claimableRewards.map((reward) => (
          <Card key={reward.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="mt-1">
                    {getRewardTypeIcon(reward.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">
                        {reward.marketQuestion || reward.description}
                      </h3>
                      <Badge className={getRewardTypeColor(reward.type)}>
                        {getRewardTypeLabel(reward.type)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {reward.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Available since {reward.claimableAt.toLocaleDateString()}</span>
                      {reward.expiresAt && (
                        <>
                          <span>•</span>
                          <span>Expires {reward.expiresAt.toLocaleDateString()}</span>
                        </>
                      )}
                      {reward.txHash && (
                        <>
                          <span>•</span>
                          <span>TX: {reward.txHash.slice(0, 10)}...{reward.txHash.slice(-8)}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {formatEth(reward.amount)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Ready to claim
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      onClick={() => handleClaimReward(reward.id)}
                      disabled={isClaiming === reward.id || isClaiming === "all"}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isClaiming === reward.id ? (
                        <>
                          <Zap className="w-3 h-3 mr-1 animate-spin" />
                          Claiming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Claim
                        </>
                      )}
                    </Button>
                    {reward.txHash && (
                      <Button size="sm" variant="outline">
                        <ExternalLink className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Info className="w-5 h-5" />
            How Rewards Work
          </CardTitle>
        </CardHeader>
        <CardContent className="text-blue-700">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">Bet Payouts</h4>
              <p>Automatically claimable when you win a bet. Payouts are calculated based on your bet amount and the final odds.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Bonuses & Achievements</h4>
              <p>Earn bonuses for referrals, achievements, and special events. These rewards have expiration dates.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
