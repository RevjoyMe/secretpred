'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Shield, Eye, TrendingUp, Lock, Target } from 'lucide-react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary/90">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full filter blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full filter blur-3xl" />
      </div>

      <div className="relative container-grid py-20 lg:py-32">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Lock className="w-4 h-4" />
            Powered by Zama FHE
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-4xl lg:text-6xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            The First{' '}
            <span className="bg-white text-primary px-4 py-2 rounded-2xl">
              Private
            </span>
            <br />
            Prediction Market
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-xl lg:text-2xl text-primary-foreground/90 mb-8 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Bet on future events with complete privacy. Your positions remain encrypted 
            until market resolution. No whale watching, no front-running, just fair predictions.
          </motion.p>

          {/* Feature Pills */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { icon: Eye, text: 'Hidden Positions' },
              { icon: Shield, text: 'FHE Encryption' },
              { icon: Target, text: 'Fair Markets' }
            ].map((feature, index) => (
              <div
                key={feature.text}
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm"
              >
                <feature.icon className="w-4 h-4" />
                {feature.text}
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <ConnectButton.Custom>
              {({
                account,
                chain,
                openAccountModal,
                openChainModal,
                openConnectModal,
                authenticationStatus,
                mounted,
              }) => {
                const ready = mounted && authenticationStatus !== 'loading'
                const connected =
                  ready &&
                  account &&
                  chain &&
                  (!authenticationStatus || authenticationStatus === 'authenticated')

                return (
                  <div className="flex flex-col sm:flex-row gap-4">
                    {(() => {
                      if (!connected) {
                        return (
                          <button
                            onClick={openConnectModal}
                            type="button"
                            className="btn-secondary bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 transform hover:scale-105"
                          >
                            Connect Wallet
                            <ArrowRight className="ml-2 h-5 w-5" />
                          </button>
                        )
                      }

                      if (chain.unsupported) {
                        return (
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="btn-secondary bg-red-500 text-white hover:bg-red-600 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
                          >
                            Wrong network
                          </button>
                        )
                      }

                      return (
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button
                            onClick={openChainModal}
                            type="button"
                            className="btn-secondary bg-white/20 text-white hover:bg-white/30 font-semibold px-6 py-3 rounded-xl text-lg transition-all duration-200"
                          >
                            {chain.hasIcon && (
                              <div
                                style={{
                                  background: chain.iconBackground,
                                  width: 12,
                                  height: 12,
                                  borderRadius: 999,
                                  overflow: 'hidden',
                                  marginRight: 4,
                                }}
                              >
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? 'Chain icon'}
                                    src={chain.iconUrl}
                                    style={{ width: 12, height: 12 }}
                                  />
                                )}
                              </div>
                            )}
                            {chain.name}
                          </button>

                          <button
                            onClick={openAccountModal}
                            type="button"
                            className="btn-secondary bg-white text-primary hover:bg-gray-100 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200"
                          >
                            {account.displayName}
                            {account.displayBalance ? ` (${account.displayBalance})` : ''}
                          </button>
                        </div>
                      )
                    })()}
                  </div>
                )
              }}
            </ConnectButton.Custom>

            <button className="btn-secondary bg-transparent border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200">
              Learn More
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            {[
              { label: 'Total Volume', value: '$2.4M' },
              { label: 'Active Markets', value: '47' },
              { label: 'Total Users', value: '8.2K' },
              { label: 'Privacy Score', value: '100%' }
            ].map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-primary-foreground/80">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

