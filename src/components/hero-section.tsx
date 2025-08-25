import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-work-sans font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6">
            Predict the Future
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the world's most advanced prediction market platform. Make informed bets on real-world events with
            encrypted, secure transactions powered by Zama FHE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3">
              Start Predicting
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
