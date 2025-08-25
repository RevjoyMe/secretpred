"use client"

import { MarketCard } from "./MarketCard"

// Mock data for markets
const mockMarkets = [
  {
    id: 1,
    question: "Was Kanye hacked?",
    endTime: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days from now
    totalYesBets: 1000000000000000000n, // 1 ETH
    totalNoBets: 2000000000000000000n, // 2 ETH
    resolved: false,
    volume: "$641k",
    category: "Entertainment"
  },
  {
    id: 2,
    question: "Democratic Presidential Nominee 2028",
    endTime: Math.floor(Date.now() / 1000) + 1460 * 24 * 60 * 60, // 1460 days from now
    totalYesBets: 5000000000000000000n, // 5 ETH
    totalNoBets: 12000000000000000000n, // 12 ETH
    resolved: false,
    volume: "$13m",
    category: "Politics"
  },
  {
    id: 3,
    question: "Presidential Election Winner 2028",
    endTime: Math.floor(Date.now() / 1000) + 1460 * 24 * 60 * 60, // 1460 days from now
    totalYesBets: 4000000000000000000n, // 4 ETH
    totalNoBets: 11000000000000000000n, // 11 ETH
    resolved: false,
    volume: "$11m",
    category: "Politics"
  },
  {
    id: 4,
    question: "Russia x Ukraine ceasefire in 2025?",
    endTime: Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60, // 365 days from now
    totalYesBets: 6000000000000000000n, // 6 ETH
    totalNoBets: 16000000000000000000n, // 16 ETH
    resolved: false,
    volume: "$18m",
    category: "Geopolitics"
  }
]

export function MarketsList() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Markets</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Most popular prediction markets with high volume and active trading.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mockMarkets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors font-medium">
            View All Markets
          </button>
        </div>
      </div>
    </section>
  )
}
