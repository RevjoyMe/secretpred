"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { WalletButton } from "@/components/wallet-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Activity, Database, Shield } from "lucide-react"

const oraclesData = [
  {
    id: 1,
    name: "Bitcoin Price Feed",
    status: "active",
    source: "Chainlink",
    type: "PRICE",
    value: "$67,500",
    confidence: 98,
    lastUpdate: "8/22/2025, 8:52:49 PM",
  },
  {
    id: 2,
    name: "Ethereum Price Feed",
    status: "active",
    source: "Band Protocol",
    type: "PRICE",
    value: "$3,200",
    confidence: 96,
    lastUpdate: "8/22/2025, 8:54:49 PM",
  },
  {
    id: 3,
    name: "DeFi TVL Tracker",
    status: "active",
    source: "DeFiLlama API",
    type: "EVENT",
    value: "185000000000",
    confidence: 94,
    lastUpdate: "8/22/2025, 8:42:49 PM",
  },
  {
    id: 4,
    name: "Super Bowl Results",
    status: "inactive",
    source: "ESPN API",
    type: "SPORTS",
    value: "Chiefs Won",
    confidence: 100,
    lastUpdate: "8/20/2025, 8:57:49 PM",
  },
  {
    id: 5,
    name: "AI Development Tracker",
    status: "active",
    source: "Custom Oracle",
    type: "EVENT",
    value: "No AGI Yet",
    confidence: 87,
    lastUpdate: "8/22/2025, 8:27:49 PM",
  },
  {
    id: 6,
    name: "Election Results Feed",
    status: "active",
    source: "AP News API",
    type: "EVENT",
    value: "Pending",
    confidence: 92,
    lastUpdate: "8/22/2025, 7:57:49 PM",
  },
]

export default function OraclesPage() {
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Oracle Network</h2>
            <p className="text-muted-foreground">Real-time data feeds powering our prediction markets with transparent, verifiable information</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">of 6 total</p>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">Active Oracles</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold">93.4%</p>
                    <p className="text-sm text-muted-foreground">across all feeds</p>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">Avg Confidence</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Database className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold">6</p>
                    <p className="text-sm text-muted-foreground">unique providers</p>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">Data Sources</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <div>
                    <p className="text-2xl font-bold">99.2%</p>
                    <p className="text-sm text-muted-foreground">uptime</p>
                  </div>
                </div>
                <p className="text-sm font-medium mt-2">Network Health</p>
              </CardContent>
            </Card>
          </div>

          {/* Oracles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oraclesData.map((oracle) => (
              <Card key={oracle.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{oracle.name}</CardTitle>
                    <Badge 
                      variant={oracle.status === "active" ? "default" : "secondary"}
                      className={oracle.status === "active" ? "bg-green-500" : "bg-gray-500"}
                    >
                      {oracle.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Source: {oracle.source}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{oracle.type}</span>
                    <span className="font-semibold">{oracle.value}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Confidence</span>
                    <span className="font-semibold text-emerald-400">{oracle.confidence}%</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Last update: {oracle.lastUpdate}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Oracle Network Information */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-foreground mb-6">Oracle Network Information</h3>
            <p className="text-muted-foreground mb-6">Understanding our decentralized oracle infrastructure</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-semibold mb-4">Supported Data Types</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Price Feeds</li>
                  <li>• Event Data</li>
                  <li>• Sports Results</li>
                  <li>• Weather Data</li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Oracle Providers</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Chainlink: Price Feeds</li>
                  <li>• Band Protocol: Cross-chain Data</li>
                  <li>• Custom APIs: Event Tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
