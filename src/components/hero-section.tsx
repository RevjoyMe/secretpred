import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="py-20 lg:py-32" style={{ background: 'linear-gradient(135deg, #ffffff 0%, #ecfeff 50%, #f1f5f9 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 
            className="font-work-sans font-bold text-4xl sm:text-5xl lg:text-6xl mb-6"
            style={{ 
              background: 'linear-gradient(135deg, #164e63 0%, #8b5cf6 50%, #164e63 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Predict the Future
          </h1>
          <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto leading-relaxed" style={{ color: '#6b7280' }}>
            Join the world's most advanced prediction market platform. Make informed bets on real-world events with
            encrypted, secure transactions powered by Zama FHE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 text-lg font-semibold rounded-lg text-white shadow-lg hover:shadow-xl transition-all duration-200"
              style={{ 
                background: 'linear-gradient(135deg, #164e63 0%, #8b5cf6 100%)',
                border: 'none'
              }}
            >
              Start Predicting
            </button>
            <button 
              className="px-8 py-3 text-lg font-semibold rounded-lg border-2 transition-all duration-200"
              style={{ 
                borderColor: '#164e63',
                color: '#164e63',
                backgroundColor: 'transparent'
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
