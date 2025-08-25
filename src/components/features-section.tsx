import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Users, Shield } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: "📈",
      title: "Real-Time Markets",
      description: "Trade on live prediction markets with real-time odds and data",
    },
    {
      icon: "👥",
      title: "Community Driven",
      description: "Join thousands of predictors in our decentralized ecosystem",
    },
    {
      icon: "🔒",
      title: "Secure Betting",
      description: "Encrypted transactions with smart contract security",
    },
  ]

  return (
    <section className="py-16" style={{ background: 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 50%, #ecfeff 100%)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-8 text-center rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ 
                background: 'linear-gradient(135deg, #ecfeff 0%, #ffffff 100%)',
                border: '1px solid #d1d5db'
              }}
            >
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 shadow-lg text-2xl"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(22, 78, 99, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                  color: '#164e63'
                }}
              >
                {feature.icon}
              </div>
              <h3 className="font-work-sans font-semibold text-xl mb-4" style={{ color: '#164e63' }}>{feature.title}</h3>
              <p className="leading-relaxed text-base" style={{ color: '#6b7280' }}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
