"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, Users, DollarSign } from "lucide-react"

const Hero = () => {
  return (
    <section className="relative py-24 px-4 text-center bg-gradient-to-b from-background via-background to-card/20">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2 mb-6">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm font-medium">Live on Sepolia Testnet</span>
          </div>
        </div>
        
        <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent leading-tight">
          Predict the Future
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
          Join the world's most advanced prediction market platform. Make informed bets on real-world events with
          encrypted, secure transactions powered by Zama FHE.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
          <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-emerald-500/25 transition-all duration-200">
            Start Predicting
          </Button>
          <Button size="lg" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 px-8 py-4 text-lg font-semibold">
            Learn More
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <TrendingUp className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Real-Time Markets</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Trade on live prediction markets with real-time odds and data
            </p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Community Driven</h3>
            <p className="text-muted-foreground text-center leading-relaxed">
              Join thousands of predictors in our decentralized ecosystem
            </p>
          </div>

          <div className="flex flex-col items-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-200">
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold mb-3 text-foreground">Secure Betting</h3>
            <p className="text-muted-foreground text-center leading-relaxed">Encrypted transactions with smart contract security</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero }
export default Hero
