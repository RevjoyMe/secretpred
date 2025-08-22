"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/wallet-button"
import { MarketCard } from "@/components/markets/MarketCard"

const marketsData = [
  {
    id: 1,
    question: "Was Kanye hacked?",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 7,
    totalYesBets: BigInt("10000000000000000"),
    totalNoBets: BigInt("9900000000000000000"),
    resolved: false,
    volume: "$641k",
    category: "Entertainment",
  },
  {
    id: 2,
    question: "Democratic Presidential Nominee 2028",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 1460,
    totalYesBets: BigInt("2900000000000000000"),
    totalNoBets: BigInt("7100000000000000000"),
    resolved: false,
    volume: "$13m",
    category: "Politics",
  },
  {
    id: 3,
    question: "Presidential Election Winner 2028",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 1460,
    totalYesBets: BigInt("2700000000000000000"),
    totalNoBets: BigInt("7300000000000000000"),
    resolved: false,
    volume: "$11m",
    category: "Politics",
  },
  {
    id: 4,
    question: "Russia x Ukraine ceasefire in 2025?",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 365,
    totalYesBets: BigInt("2700000000000000000"),
    totalNoBets: BigInt("7300000000000000000"),
    resolved: false,
    volume: "$18m",
    category: "Geopolitics",
  },
  {
    id: 5,
    question: "Will Putin meet with Zelenskyy in 2025?",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 365,
    totalYesBets: BigInt("2800000000000000000"),
    totalNoBets: BigInt("7200000000000000000"),
    resolved: false,
    volume: "$1m",
    category: "Geopolitics",
  },
  {
    id: 6,
    question: "Fed decision in September?",
    endTime: Math.floor(Date.now() / 1000) + 86400 * 30,
    totalYesBets: BigInt("8300000000000000000"),
    totalNoBets: BigInt("1700000000000000000"),
    resolved: false,
    volume: "$37m",
    category: "Economics",
  },
]

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">SP</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">SecretPredictions</h1>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  Back to main
                </Button>
              </Link>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8 px-4">
        <div className="container mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Prediction Markets</h2>
            <p className="text-muted-foreground">Trade on future events with transparent, decentralized prediction markets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketsData.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
