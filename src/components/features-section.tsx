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
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary mb-4">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="font-work-sans font-semibold text-lg text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
