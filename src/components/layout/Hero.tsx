"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Users, DollarSign } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 text-center bg-gradient-to-b from-transparent via-white/30 to-white/50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3 mb-8">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-600 text-sm font-semibold">Live on Sepolia Testnet</span>
          </div>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 bg-gradient-to-r from-emerald-600 via-cyan-600 to-emerald-500 bg-clip-text text-transparent leading-tight">
          Predict the Future
        </h1>
        <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
          Join the world's most advanced prediction market platform. Make informed bets on real-world events with
          encrypted, secure transactions powered by Zama FHE.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 rounded-xl"
            onClick={() => {
              document.getElementById('featured-markets')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Start Predicting
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-10 py-4 text-lg font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-24">
          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <TrendingUp className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Real-Time Markets</h3>
            <p className="text-gray-600 text-center leading-relaxed max-w-sm">
              Trade on live prediction markets with real-time odds and data
            </p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <Users className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Community Driven</h3>
            <p className="text-gray-600 text-center leading-relaxed max-w-sm">
              Join thousands of predictors in our decentralized ecosystem
            </p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-200 shadow-lg">
              <DollarSign className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-900">Secure Betting</h3>
            <p className="text-gray-600 text-center leading-relaxed max-w-sm">
              Encrypted transactions with smart contract security
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
export default Hero
