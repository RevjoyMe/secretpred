'use client';

import Header from '@/components/header';

export default function Analytics() {
  const marketStats = [
    {
      category: "Politics",
      totalMarkets: 45,
      totalVolume: "$12.4M",
      avgProbability: "52%",
      trend: "↗️"
    },
    {
      category: "Crypto",
      totalMarkets: 67,
      totalVolume: "$28.7M",
      avgProbability: "48%",
      trend: "↘️"
    },
    {
      category: "Technology",
      totalMarkets: 34,
      totalVolume: "$8.9M",
      avgProbability: "61%",
      trend: "↗️"
    },
    {
      category: "Economics",
      totalMarkets: 23,
      totalVolume: "$15.2M",
      avgProbability: "44%",
      trend: "→"
    },
    {
      category: "Culture",
      totalMarkets: 28,
      totalVolume: "$4.1M",
      avgProbability: "73%",
      trend: "↗️"
    }
  ];

  const topMarkets = [
    {
      title: "Bitcoin price above $100,000 by August 31, 2025?",
      volume: "$2.4M",
      participants: 1247,
      probability: "68%"
    },
    {
      title: "Federal Reserve cuts rates by 25 bps in September 2025?",
      volume: "$3.1M",
      participants: 1567,
      probability: "73%"
    },
    {
      title: "OpenAI IPO by December 31, 2025?",
      volume: "$1.2M",
      participants: 634,
      probability: "28%"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="main-content">
        <h1 className="page-title">Analytics</h1>
        
        <div className="two-column-layout">
          {/* Main Column - Tables */}
          <div className="main-column">
            {/* Market Categories */}
            <div className="mb-12">
              <h2 className="section-header">Market Categories</h2>
              <table className="bet-feed">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Markets</th>
                    <th>Volume</th>
                    <th>Avg Probability</th>
                    <th>Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {marketStats.map((stat) => (
                    <tr key={stat.category} className="fade-in">
                      <td>
                        <div className="market-title">
                          {stat.category}
                        </div>
                      </td>
                      <td>
                        <div className="volume">
                          {stat.totalMarkets}
                        </div>
                      </td>
                      <td>
                        <div className="text-accent font-semibold">
                          {stat.totalVolume}
                        </div>
                      </td>
                      <td>
                        <div className="probability">
                          {stat.avgProbability}
                        </div>
                      </td>
                      <td>
                        <div className="text-2xl">
                          {stat.trend}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Top Markets */}
            <div>
              <h2 className="section-header">Top Markets by Volume</h2>
              <table className="bet-feed">
                <thead>
                  <tr>
                    <th>Market</th>
                    <th>Volume</th>
                    <th>Participants</th>
                    <th>Probability</th>
                  </tr>
                </thead>
                <tbody>
                  {topMarkets.map((market, index) => (
                    <tr key={index} className="fade-in">
                      <td>
                        <div className="market-title">
                          {market.title}
                        </div>
                      </td>
                      <td>
                        <div className="text-accent font-semibold">
                          {market.volume}
                        </div>
                      </td>
                      <td>
                        <div className="volume">
                          {market.participants.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="probability">
                          {market.probability}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sidebar Column - Overview, Insights & Charts */}
          <div className="sidebar-column">
            {/* Platform Stats */}
            <div className="sidebar-card">
              <h3 className="section-header">Platform Overview</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-secondary text-sm mb-2 font-medium">Total Markets</div>
                  <div className="text-3xl font-bold text-white">197</div>
                </div>
                <div>
                  <div className="text-secondary text-sm mb-2 font-medium">Total Volume</div>
                  <div className="text-3xl font-bold text-accent">$69.3M</div>
                </div>
                <div>
                  <div className="text-secondary text-sm mb-2 font-medium">Active Users</div>
                  <div className="text-3xl font-bold text-white">45.2K</div>
                </div>
                <div>
                  <div className="text-secondary text-sm mb-2 font-medium">Avg Probability</div>
                  <div className="text-3xl font-bold text-white">55.6%</div>
                </div>
              </div>
            </div>

            {/* Volume Chart */}
            <div className="sidebar-card">
              <h3 className="section-header">Volume Over Time</h3>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-secondary text-center">
                  <div className="text-3xl mb-3">📈</div>
                  <div className="text-base font-medium">Volume chart coming soon</div>
                  <div className="text-xs mt-2">Historical volume tracking will be available soon</div>
                </div>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="sidebar-card">
              <h3 className="section-header">Category Distribution</h3>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-secondary text-center">
                  <div className="text-3xl mb-3">🥧</div>
                  <div className="text-base font-medium">Pie chart coming soon</div>
                  <div className="text-xs mt-2">Category distribution analysis will be available soon</div>
                </div>
              </div>
            </div>

            {/* Market Insights */}
            <div className="sidebar-card">
              <h3 className="section-header">Market Insights</h3>
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-lg border border-border/50">
                  <div className="text-accent font-semibold mb-2 text-base">🔥 Trending</div>
                  <div className="text-secondary text-sm leading-relaxed">Crypto markets showing increased volatility with 23% higher volume this week.</div>
                </div>
                <div className="p-4 bg-muted rounded-lg border border-border/50">
                  <div className="text-accent font-semibold mb-2 text-base">📊 High Confidence</div>
                  <div className="text-secondary text-sm leading-relaxed">Technology markets have the highest average probability at 61%, indicating strong consensus.</div>
                </div>
                <div className="p-4 bg-muted rounded-lg border border-border/50">
                  <div className="text-accent font-semibold mb-2 text-base">🎯 Opportunity</div>
                  <div className="text-secondary text-sm leading-relaxed">Politics category shows the most balanced probabilities, offering good risk/reward ratios.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
