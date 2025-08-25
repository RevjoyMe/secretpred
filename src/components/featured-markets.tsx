import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export function FeaturedMarkets() {
  const markets = [
    {
      id: 1,
      category: "Entertainment",
      title: "Was Kanye hacked?",
      description: "Predict whether Kanye West's recent social media activity was due to account compromise",
      yesPrice: 64.1,
      noPrice: 35.9,
      volume: "$334",
      timeLeft: "6d left",
    },
    {
      id: 2,
      category: "Politics",
      title: "Democratic Presidential Nominee 2028",
      description: "Who will be the Democratic Party's presidential nominee in 2028?",
      yesPrice: 42.3,
      noPrice: 57.7,
      volume: "$1.2K",
      timeLeft: "1200d left",
    },
    {
      id: 3,
      category: "Politics",
      title: "Presidential Election Winner 2028",
      description: "Who will win the 2028 presidential election?",
      yesPrice: 27.0,
      noPrice: 73.0,
      volume: "$11m",
      timeLeft: "1460d left",
    },
    {
      id: 4,
      category: "Geopolitics",
      title: "Russia x Ukraine ceasefire in 2025?",
      description: "Will there be a ceasefire agreement between Russia and Ukraine in 2025?",
      yesPrice: 27.0,
      noPrice: 73.0,
      volume: "$18m",
      timeLeft: "365d left",
    },
  ]

  return (
    <section className="py-16" style={{ backgroundColor: '#ffffff' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-work-sans font-bold text-3xl mb-4" style={{ color: '#164e63' }}>Featured Markets</h2>
          <p className="text-lg" style={{ color: '#6b7280' }}>
            Most popular prediction markets with high volume and active trading.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {markets.map((market) => (
            <div 
              key={market.id} 
              className="hover:shadow-lg transition-shadow rounded-lg p-6"
              style={{ 
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
              }}
            >
              <div className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <span 
                    className="text-xs px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: '#8b5cf6',
                      color: '#ffffff'
                    }}
                  >
                    {market.category}
                  </span>
                  <span className="text-sm" style={{ color: '#6b7280' }}>{market.timeLeft}</span>
                </div>
                <h3 className="font-work-sans text-xl leading-tight mb-4" style={{ color: '#164e63' }}>{market.title}</h3>
              </div>
              <div className="space-y-4">
                <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{market.description}</p>

                <div className="flex items-center justify-between p-4 rounded-lg" style={{ backgroundColor: '#f1f5f9' }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#10b981' }}>{market.yesPrice}¢</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>YES</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{market.noPrice}¢</div>
                    <div className="text-sm" style={{ color: '#6b7280' }}>NO</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: '#6b7280' }}>Volume: {market.volume}</span>
                  <button 
                    className="px-6 py-2 text-sm rounded-md text-white"
                    style={{ backgroundColor: '#164e63' }}
                  >
                    Trade
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button 
            className="px-6 py-3 text-lg rounded-lg border transition-colors"
            style={{ 
              borderColor: '#d1d5db',
              color: '#164e63',
              backgroundColor: 'transparent'
            }}
          >
            View All Markets
          </button>
        </div>
      </div>
    </section>
  )
}
