"use client"

import { Hero } from "@/components/layout/Hero"
import { MarketsList } from "@/components/markets/MarketsList"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#f5f5f0] to-[#e8e6e1]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">SP</h1>
              <a href="#" className="text-lg font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
                SecretPredictions
              </a>
            </div>
            <nav className="flex items-center space-x-6">
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors">Markets</a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors">Oracles</a>
              <a href="#" className="text-gray-700 hover:text-emerald-600 transition-colors">Profile</a>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">0x07b2...7851</span>
                <button className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
                  Disconnect
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Live indicator */}
      <div className="bg-emerald-50 border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-700 font-medium">Live on Sepolia Testnet</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main>
        <Hero />
        <MarketsList />
      </main>
    </div>
  )
}
