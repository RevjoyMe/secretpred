'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, Eye, Zap, ArrowRight, Users, DollarSign, Lock, Target, BarChart3 } from 'lucide-react'
import { MarketGrid } from '@/components/markets/MarketGrid'
import { StatsCard } from '@/components/ui/StatsCard'
import { FeatureCard } from '@/components/ui/FeatureCard'
import { Hero } from '@/components/layout/Hero'
import { useAccount } from 'wagmi'

export default function HomePage() {
  const { isConnected } = useAccount()
  const [activeSection, setActiveSection] = useState('trending')

  const stats = [
    {
      label: 'Total Volume',
      value: '$2.4M',
      change: '+12.5%',
      icon: DollarSign,
      trend: 'up'
    },
    {
      label: 'Active Markets',
      value: '47',
      change: '+3',
      icon: TrendingUp,
      trend: 'up'
    },
    {
      label: 'Total Users',
      value: '8.2K',
      change: '+156',
      icon: Users,
      trend: 'up'
    },
    {
      label: 'Privacy Score',
      value: '100%',
      change: 'FHE',
      icon: Shield,
      trend: 'neutral'
    }
  ]

  const features = [
    {
      icon: Lock,
      title: 'Complete Privacy',
      description: 'All bets and positions encrypted with Zama FHE until market resolution',
      color: 'primary'
    },
    {
      icon: Eye,
      title: 'No Front-Running',
      description: 'Impossible to see positions or manipulate markets before close',
      color: 'success'
    },
    {
      icon: Zap,
      title: 'Instant Settlement',
      description: 'Automated payouts through smart contracts and oracles',
      color: 'accent'
    },
    {
      icon: Target,
      title: 'Prediction Markets',
      description: 'Bet on real-world events with encrypted amounts and outcomes',
      color: 'warning'
    },
    {
      icon: BarChart3,
      title: 'Market Analytics',
      description: 'Advanced charts and insights while maintaining privacy',
      color: 'info'
    },
    {
      icon: Shield,
      title: 'FHE Security',
      description: 'Built on Zama FHEVM for maximum privacy and security',
      color: 'secondary'
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <Hero />

      {/* Stats Section */}
      <section className="py-12 bg-card border-y border-border">
        <div className="container-grid">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <StatsCard {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-grid">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl lg:text-4xl font-bold mb-4 gradient-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Why Secret Predictions?
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              The first truly private prediction market platform built on Zama FHE technology
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <FeatureCard {...feature} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Markets Section */}
      <section className="py-16">
        <div className="container-grid">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Active Markets
              </h2>
              <p className="text-lg text-muted-foreground">
                Bet on real-world events with complete privacy
              </p>
            </div>
            
            <div className="flex space-x-2 mt-4 lg:mt-0">
              <button
                onClick={() => setActiveSection('trending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === 'trending' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Trending
              </button>
              <button
                onClick={() => setActiveSection('ending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeSection === 'ending' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                Ending Soon
              </button>
            </div>
          </div>

          <MarketGrid section={activeSection} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-grid text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Ready to Start Betting Privately?
            </h2>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Join thousands of users who are already betting on real-world events with complete privacy
            </p>
            <button className="btn-secondary bg-white text-primary hover:bg-gray-100">
              Connect Wallet
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

