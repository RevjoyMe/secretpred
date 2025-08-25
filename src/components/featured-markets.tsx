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
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="font-work-sans font-bold text-3xl text-foreground mb-4">Featured Markets</h2>
          <p className="text-muted-foreground text-lg">
            Most popular prediction markets with high volume and active trading.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {markets.map((market) => (
            <Card key={market.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {market.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{market.timeLeft}</span>
                </div>
                <CardTitle className="font-work-sans text-xl leading-tight">{market.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground text-sm leading-relaxed">{market.description}</p>

                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{market.yesPrice}¢</div>
                    <div className="text-sm text-muted-foreground">YES</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{market.noPrice}¢</div>
                    <div className="text-sm text-muted-foreground">NO</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Volume: {market.volume}</span>
                  <Button size="sm" className="px-6">
                    Trade
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            View All Markets
          </Button>
        </div>
      </div>
    </section>
  )
}
