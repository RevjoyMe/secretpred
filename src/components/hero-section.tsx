import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32 bg-gradient-to-br from-background via-card to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-work-sans font-bold text-4xl sm:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Predict the Future
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join the world's most advanced prediction market platform. Make informed bets on real-world events with
            encrypted, secure transactions powered by Zama FHE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="px-8 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              Start Predicting
            </Button>
            <Button variant="outline" size="lg" className="px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200">
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
