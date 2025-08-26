'use client';

import { useState } from 'react';
import { Users, DollarSign, Clock, TrendingUp } from 'lucide-react';

const markets = [
  // Politics
  {
    id: 1,
    title: "Houthi strike on Israel by August 31, 2025?",
    yesProbability: 34,
    volume: "2.1M",
    participants: 1247,
    endDate: "Aug 31, 2025",
    category: "Politics",
    description: "Will there be a Houthi attack on Israeli territory by the end of August 2025?"
  },
  {
    id: 2,
    title: "Federal Reserve cuts rates by 25 bps in September 2025?",
    yesProbability: 73,
    volume: "3.1M",
    participants: 1567,
    endDate: "Sep 30, 2025",
    category: "Economics",
    description: "Will the Fed announce a 25 basis point rate cut at the September FOMC meeting?"
  },
  {
    id: 3,
    title: "Democratic Presidential Nominee 2028",
    yesProbability: 58,
    volume: "1.8M",
    participants: 892,
    endDate: "Dec 31, 2025",
    category: "Politics",
    description: "Who will be the Democratic nominee for President in 2028?"
  },
  {
    id: 4,
    title: "Databricks IPO by December 31, 2025?",
    yesProbability: 42,
    volume: "956K",
    participants: 445,
    endDate: "Dec 31, 2025",
    category: "Finance",
    description: "Will Databricks complete its initial public offering by year-end 2025?"
  },
  {
    id: 5,
    title: "OpenAI IPO by December 31, 2025?",
    yesProbability: 28,
    volume: "1.2M",
    participants: 634,
    endDate: "Dec 31, 2025",
    category: "Technology",
    description: "Will OpenAI complete its initial public offering by year-end 2025?"
  },
  {
    id: 6,
    title: "Stripe IPO by December 31, 2025?",
    yesProbability: 58,
    volume: "1.2M",
    participants: 634,
    endDate: "Dec 31, 2025",
    category: "Finance",
    description: "Will Stripe complete its initial public offering by year-end 2025?"
  },
  // Crypto
  {
    id: 7,
    title: "Bitcoin price above $100,000 by August 31, 2025?",
    yesProbability: 68,
    volume: "2.4M",
    participants: 1247,
    endDate: "Aug 31, 2025",
    category: "Crypto",
    description: "Will Bitcoin reach or exceed $100,000 by the end of August 2025?"
  },
  {
    id: 8,
    title: "Ethereum price above $8,000 by August 31, 2025?",
    yesProbability: 45,
    volume: "1.6M",
    participants: 789,
    endDate: "Aug 31, 2025",
    category: "Crypto",
    description: "Will Ethereum reach or exceed $8,000 by the end of August 2025?"
  },
  {
    id: 9,
    title: "Bitcoin higher than Ethereum on August 26, 2025?",
    yesProbability: 72,
    volume: "892K",
    participants: 456,
    endDate: "Aug 26, 2025",
    category: "Crypto",
    description: "Will Bitcoin's price be higher than Ethereum's price on August 26, 2025?"
  },
  // Technology & Culture
  {
    id: 10,
    title: "Elon Musk tweets 50+ times August 22-29, 2025?",
    yesProbability: 81,
    volume: "456K",
    participants: 234,
    endDate: "Aug 29, 2025",
    category: "Technology",
    description: "Will Elon Musk post 50 or more tweets between August 22-29, 2025?"
  },
  {
    id: 11,
    title: "Taylor Swift releases new album in 2025?",
    yesProbability: 81,
    volume: "956K",
    participants: 445,
    endDate: "Dec 31, 2025",
    category: "Culture",
    description: "Will Taylor Swift release a new studio album in 2025?"
  },
  {
    id: 12,
    title: "New James Bond announced by end of 2025?",
    yesProbability: 35,
    volume: "678K",
    participants: 321,
    endDate: "Dec 31, 2025",
    category: "Culture",
    description: "Will a new James Bond actor be officially announced by year-end 2025?"
  }
];

interface FeaturedMarketsProps {
  onBetClick: (market: any, outcome: boolean) => void;
}

export default function FeaturedMarkets({ onBetClick }: FeaturedMarketsProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('volume');

  const filteredMarkets = selectedCategory === 'all' 
    ? markets 
    : markets.filter(market => market.category.toLowerCase() === selectedCategory);

  const sortedMarkets = [...filteredMarkets].sort((a, b) => {
    switch (sortBy) {
      case 'volume':
        return parseFloat(b.volume.replace(/[^0-9.]/g, '')) - parseFloat(a.volume.replace(/[^0-9.]/g, ''));
      case 'participants':
        return b.participants - a.participants;
      case 'probability':
        return b.yesProbability - a.yesProbability;
      default:
        return 0;
    }
  });

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Active Markets</h2>
            <p className="text-gray-400 max-w-2xl">
              Discover and bet on real-world events with complete privacy. All positions are encrypted until market resolution.
            </p>
          </div>
          
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6 lg:mt-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="all">All Categories</option>
              <option value="politics">Politics</option>
              <option value="crypto">Crypto</option>
              <option value="economics">Economics</option>
              <option value="technology">Technology</option>
              <option value="culture">Culture</option>
              <option value="finance">Finance</option>
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field max-w-xs"
            >
              <option value="volume">Sort by Volume</option>
              <option value="participants">Sort by Participants</option>
              <option value="probability">Sort by Probability</option>
            </select>
          </div>
        </div>

        {/* Markets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedMarkets.map((market) => (
            <div key={market.id} className="market-card group">
              {/* Category Badge */}
              <div className="flex items-start justify-between mb-4">
                <span className="category-pill">{market.category}</span>
                <div className="flex items-center space-x-1 text-gray-400 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{market.endDate}</span>
                </div>
              </div>

              {/* Market Title */}
              <h3 className="text-lg font-semibold text-white mb-3 line-clamp-2 group-hover:text-primary transition-colors duration-200">
                {market.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {market.description}
              </p>

              {/* Probability Bar */}
              <div className="mb-4">
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

              {/* Market Stats */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <DollarSign className="h-4 w-4" />
                    <span>${market.volume}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{market.participants.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button 
                  onClick={() => onBetClick(market, true)}
                  className="btn-primary flex-1 text-sm"
                >
                  Bet Yes
                </button>
                <button 
                  onClick={() => onBetClick(market, false)}
                  className="btn-secondary flex-1 text-sm"
                >
                  Bet No
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <button className="btn-outline px-8 py-3">
            View All Markets
          </button>
        </div>
      </div>
    </section>
  );
}
