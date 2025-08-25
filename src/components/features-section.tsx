import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Shield } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: "Real-Time Markets",
      description: "Trade on live prediction markets with real-time odds and data",
    },
    {
      icon: Users,
      title: "Community Driven",
      description: "Join thousands of predictors in our decentralized ecosystem",
    },
    {
      icon: Shield,
      title: "Secure Betting",
      description: "Encrypted transactions with smart contract security",
    },
  ]

  return (
    <section className="py-16 bg-gradient-to-br from-muted/50 via-background to-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-card to-background">
              <CardContent className="p-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-primary mb-6 shadow-lg">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="font-work-sans font-semibold text-xl text-foreground mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-base">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
