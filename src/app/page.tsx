"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { FeaturedMarkets } from "@/components/featured-markets"
import { BettingModal } from "@/components/betting-modal"

export default function HomePage() {
  const [showBettingModal, setShowBettingModal] = useState(false)
  const [selectedMarket, setSelectedMarket] = useState<any>(null)
  const [selectedOutcome, setSelectedOutcome] = useState<'yes' | 'no' | null>(null)

  const handleOpenBettingModal = (market: any, outcome: 'yes' | 'no') => {
    setSelectedMarket(market)
    setSelectedOutcome(outcome)
    setShowBettingModal(true)
  }

  const handleCloseBettingModal = () => {
    setShowBettingModal(false)
    setSelectedMarket(null)
    setSelectedOutcome(null)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedMarkets onBetClick={handleOpenBettingModal} />
      </main>

      {/* Global Betting Modal */}
      {showBettingModal && selectedMarket && (
        <BettingModal
          isOpen={showBettingModal}
          onClose={handleCloseBettingModal}
          marketId={selectedMarket.id}
          marketTitle={selectedMarket.title}
          yesPrice={selectedMarket.yesPrice}
          noPrice={selectedMarket.noPrice}
          preSelectedOutcome={selectedOutcome}
        />
      )}
    </div>
  )
}
