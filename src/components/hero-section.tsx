'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, TrendingUp, Users, DollarSign } from 'lucide-react';

const featuredMarkets = [
  {
    id: 1,
    title: "Will Bitcoin reach $100,000 by December 2025?",
    yesProbability: 68,
    volume: "2.4M",
    participants: 1247,
    endDate: "Dec 31, 2025",
    category: "Crypto"
  },
  {
    id: 2,
    title: "Will OpenAI launch GPT-6 by year-end 2025?",
    yesProbability: 42,
    volume: "1.8M",
    participants: 892,
    endDate: "Dec 31, 2025",
    category: "Technology"
  },
  {
    id: 3,
    title: "Will the Fed cut rates by 25bps in September?",
    yesProbability: 73,
    volume: "3.1M",
    participants: 1567,
    endDate: "Sep 30, 2025",
    category: "Economics"
  },
  {
    id: 4,
    title: "Will Stripe IPO by December 31, 2025?",
    yesProbability: 58,
    volume: "1.2M",
    participants: 634,
    endDate: "Dec 31, 2025",
    category: "Finance"
  },
  {
    id: 5,
    title: "Will Taylor Swift release a new album in 2025?",
    yesProbability: 81,
    volume: "956K",
    participants: 445,
    endDate: "Dec 31, 2025",
    category: "Culture"
  }
];

const stats = [
  { label: "Total Volume", value: "$12.4M", icon: DollarSign },
  { label: "Active Markets", value: "1,247", icon: TrendingUp },
  { label: "Participants", value: "45.2K", icon: Users }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMarkets.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMarkets.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMarkets.length) % featuredMarkets.length);
  };

  return (
    <section className="relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            <span className="gradient-text">Privacy-Preserving</span>
            <br />
            <span className="text-white">Prediction Markets</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Bet on real-world events with complete privacy. Your positions and amounts remain encrypted until market resolution.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary text-lg px-8 py-4">
              Start Betting
            </button>
            <button className="btn-outline text-lg px-8 py-4">
              Learn More
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="stats-card">
              <div className="flex items-center justify-center mb-3">
                <stat.icon className="h-8 w-8 text-primary" />
              </div>
              <div className="stats-number mb-2">{stat.value}</div>
              <div className="text-gray-400 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Markets Slider */}
        <div className="hero-slider">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">Featured Markets</h2>
            <div className="flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
              transform: `translateX(-${currentSlide * 100}%)`
            }}>
              {featuredMarkets.map((market) => (
                <div key={market.id} className="w-full flex-shrink-0 px-4">
                  <div className="market-card max-w-2xl mx-auto">
                    <div className="flex items-start justify-between mb-4">
                      <span className="category-pill active">{market.category}</span>
                      <span className="text-gray-400 text-sm">Ends {market.endDate}</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-white mb-4 line-clamp-2">
                      {market.title}
                    </h3>
                    
                    <div className="mb-6">
                      <div className="flex justify-between text-sm text-gray-400 mb-2">
                        <span>Yes: {market.yesProbability}%</span>
                        <span>No: {100 - market.yesProbability}%</span>
                      </div>
                      <div className="probability-bar">
                        <div 
                          className="probability-fill probability-yes"
                          style={{ width: `${market.yesProbability}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>${market.volume}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4" />
                          <span>{market.participants}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button className="btn-primary flex-1">
                        Bet Yes
                      </button>
                      <button className="btn-secondary flex-1">
                        Bet No
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center space-x-2 mt-8">
            {featuredMarkets.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentSlide 
                    ? 'bg-primary' 
                    : 'bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
