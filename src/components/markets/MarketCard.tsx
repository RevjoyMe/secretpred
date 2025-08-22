"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, TrendingUp } from "lucide-react"
import { BettingModal } from "@/components/betting-modal-wrapper"
import { useState } from "react"

interface Market {
  id: number
  question: string
  endTime: number
  totalYesBets: bigint
  totalNoBets: bigint
  resolved: boolean
  volume: string
  category: string
}

interface MarketCardProps {
  market: Market
}

const MarketCard = ({ market }: MarketCardProps) => {
  const [showBettingModal, setShowBettingModal] = useState(false)
  const [selectedOutcome, setSelectedOutcome] = useState<"yes" | "no">("yes")

  const totalBets = market.totalYesBets + market.totalNoBets
  const yesPercentage = totalBets > 0n ? Number((market.totalYesBets * 100n) / totalBets) : 50
  const noPercentage = 100 - yesPercentage

  const timeRemaining = market.endTime - Math.floor(Date.now() / 1000)
  const daysRemaining = Math.floor(timeRemaining / 86400)

  const handleBet = (outcome: "yes" | "no") => {
    setSelectedOutcome(outcome)
    setShowBettingModal(true)
  }

  return (
    <>
      <Card className="bg-card/50 border-border hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-semibold text-card-foreground text-base leading-tight line-clamp-2">{market.question}</h3>
            <Badge variant="secondary" className="text-xs shrink-0 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
              {market.category}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="font-medium">{market.volume}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{daysRemaining}d left</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => handleBet("yes")}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg hover:shadow-green-500/25 transition-all duration-200"
              disabled={market.resolved}
            >
              <span className="text-sm font-semibold whitespace-nowrap">YES</span>
              <span className="text-2xl font-bold">{yesPercentage}¢</span>
            </Button>
            <Button
              onClick={() => handleBet("no")}
              className="h-20 flex flex-col items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white border-0 shadow-lg hover:shadow-red-500/25 transition-all duration-200"
              disabled={market.resolved}
            >
              <span className="text-sm font-semibold whitespace-nowrap">NO</span>
              <span className="text-2xl font-bold">{noPercentage}¢</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <BettingModal
        open={showBettingModal}
        onOpenChange={setShowBettingModal}
        market={{
          id: market.id.toString(),
          title: market.question,
          description: market.question,
          yesPrice: yesPercentage,
          noPrice: noPercentage,
          volume: market.volume,
          participants: Math.floor(Math.random() * 1000) + 100,
          timeRemaining: `${daysRemaining}d`,
          category: market.category,
          status: market.resolved ? "resolved" : "active",
        }}
        side={selectedOutcome}
      />
    </>
  )
}

export { MarketCard }
export default MarketCard
