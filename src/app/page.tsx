"use client"

import { Button } from "@/components/ui/button"
import { MetaMaskButton } from "@/components/meta-mask-button"
import Link from "next/link"
import { Hero } from "@/components/layout/Hero"
import { StatsCard } from "@/components/ui/StatsCard"
import { MarketCard } from "@/components/markets/MarketCard"

export default function HomePage() {
  const featuredMarkets = [
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#f5f5f0] to-[#e8e6e1]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">SP</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">SecretPredictions</h1>
            </Link>
            <div className="flex items-center space-x-6">
              <nav className="hidden md:flex space-x-6">
                <Link href="/markets" className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">
                  Markets
                </Link>
                <Link href="/oracles" className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">
                  Oracles
                </Link>
                <Link href="/profile" className="text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100 font-medium">
                  Profile
                </Link>
              </nav>
              <MetaMaskButton />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <Hero />

      {/* Featured Markets */}
      <section id="featured-markets" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Featured Markets</h2>
              <p className="text-xl text-gray-600 leading-relaxed">Most popular prediction markets with high volume and active trading</p>
            </div>
            <Link href="/markets">
              <Button
                variant="outline"
                className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 bg-white px-8 py-3 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
              >
                View All Markets
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredMarkets.map((market) => (
              <MarketCard key={market.id} market={market} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCard title="Total Volume" value="$200M+" description="Total trading volume" />
            <StatsCard title="Active Markets" value="150+" description="Currently active markets" />
            <StatsCard title="Daily Traders" value="5,000+" description="Active daily traders" />
            <StatsCard title="Accuracy Rate" value="94.2%" description="Prediction accuracy" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600 text-lg">© 2024 SecretPredictions. Powered by blockchain technology and Zama FHE.</p>
        </div>
      </footer>
    </div>
  )
}
