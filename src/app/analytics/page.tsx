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
        
        {/* Platform Stats - Enhanced styling */}
        <div className="mb-8 p-8 border border-border rounded-lg bg-white/5">
          <h2 className="text-xl font-semibold text-white mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

        {/* Market Categories - Enhanced styling */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Market Categories</h2>
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

        {/* Top Markets - Enhanced styling */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Top Markets by Volume</h2>
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

        {/* Charts Placeholder - Enhanced styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-8 border border-border rounded-lg bg-white/5">
            <h2 className="text-xl font-semibold text-white mb-6">Volume Over Time</h2>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-secondary text-center">
                <div className="text-4xl mb-4">📈</div>
                <div className="text-lg font-medium">Volume chart coming soon</div>
                <div className="text-sm mt-2">Historical volume tracking will be available soon</div>
              </div>
            </div>
          </div>
          
          <div className="p-8 border border-border rounded-lg bg-white/5">
            <h2 className="text-xl font-semibold text-white mb-6">Category Distribution</h2>
            <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
              <div className="text-secondary text-center">
                <div className="text-4xl mb-4">🥧</div>
                <div className="text-lg font-medium">Pie chart coming soon</div>
                <div className="text-sm mt-2">Category distribution analysis will be available soon</div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights - Enhanced styling */}
        <div className="mb-8 p-8 border border-border rounded-lg bg-white/5">
          <h2 className="text-xl font-semibold text-white mb-6">Market Insights</h2>
          <div className="space-y-6">
            <div className="p-6 bg-muted rounded-lg border border-border/50">
              <div className="text-accent font-semibold mb-3 text-lg">🔥 Trending</div>
              <div className="text-secondary leading-relaxed">Crypto markets showing increased volatility with 23% higher volume this week.</div>
            </div>
            <div className="p-6 bg-muted rounded-lg border border-border/50">
              <div className="text-accent font-semibold mb-3 text-lg">📊 High Confidence</div>
              <div className="text-secondary leading-relaxed">Technology markets have the highest average probability at 61%, indicating strong consensus.</div>
            </div>
            <div className="p-6 bg-muted rounded-lg border border-border/50">
              <div className="text-accent font-semibold mb-3 text-lg">🎯 Opportunity</div>
              <div className="text-secondary leading-relaxed">Politics category shows the most balanced probabilities, offering good risk/reward ratios.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
