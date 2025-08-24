"use client"

import { useAccount } from 'wagmi'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle, 
  XCircle, 
  DollarSign, 
  Trophy,
  Wallet,
  Activity,
  Target
} from "lucide-react"
import { ActiveBets } from "@/components/profile/ActiveBets"
import { BetHistory } from "@/components/profile/BetHistory"
import { ClaimableRewards } from "@/components/profile/ClaimableRewards"
import { ProfileStats } from "@/components/profile/ProfileStats"

export default function ProfilePage() {
  const { isConnected, address } = useAccount()
  const [activeTab, setActiveTab] = useState("overview")

  if (!isConnected || !address) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="w-5 h-5" />
              Connect Wallet
            </CardTitle>
            <CardDescription>
              Please connect your wallet to view your profile and betting history.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" disabled>
              Connect Wallet to Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Profile</h1>
              <p className="text-muted-foreground">
                {address.slice(0, 6)}...{address.slice(-4)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Connected
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Active Bets
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="rewards" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Rewards
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <ProfileStats address={address} />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>
                    Your latest betting activity and performance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div>
                          <p className="font-medium text-sm">Won bet on "Bitcoin $100k"</p>
                          <p className="text-xs text-gray-600">2 hours ago</p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700">+0.5 ETH</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">Placed bet on "Election 2024"</p>
                          <p className="text-xs text-gray-600">1 day ago</p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700">0.1 ETH</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-red-600" />
                        <div>
                          <p className="font-medium text-sm">Lost bet on "Fed Rate"</p>
                          <p className="text-xs text-gray-600">3 days ago</p>
                        </div>
                      </div>
                      <Badge className="bg-red-100 text-red-700">-0.2 ETH</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-blue-500" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common actions for your betting account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Trophy className="w-4 h-4 mr-2" />
                    Claim All Rewards
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Active Markets
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Activity className="w-4 h-4 mr-2" />
                    Export Bet History
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Active Bets Tab */}
          <TabsContent value="active">
            <ActiveBets address={address} />
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <BetHistory address={address} />
          </TabsContent>

          {/* Rewards Tab */}
          <TabsContent value="rewards">
            <ClaimableRewards address={address} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
