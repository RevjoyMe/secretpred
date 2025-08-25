"use client"

import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturesSection } from "@/components/features-section"
import { FeaturedMarkets } from "@/components/featured-markets"

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <FeaturedMarkets />
      </main>
    </div>
  )
}
