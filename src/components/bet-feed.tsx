'use client';

import { useState } from 'react';
import Sparkline from './sparkline';

const markets = [
  // Politics / Геополитика
  {
    id: 1,
    title: "Will Donald Trump win the 2028 US Presidential Election?",
    category: "politics",
    yesProbability: 45,
    volume: "$4.2M",
    sparklineData: [42, 45, 43, 47, 44, 46, 45],
    participants: 2156
  },
  {
    id: 2,
    title: "Will Taiwan be invaded by China before 2026?",
    category: "politics",
    yesProbability: 28,
    volume: "$2.8M",
    sparklineData: [32, 30, 28, 26, 29, 27, 28],
    participants: 1892
  },
  {
    id: 3,
    title: "Will the UK rejoin the EU by 2030?",
    category: "politics",
    yesProbability: 35,
    volume: "$1.9M",
    sparklineData: [38, 35, 33, 36, 34, 35, 35],
    participants: 1247
  },
  {
    id: 4,
    title: "Will there be a federal government shutdown in the US in 2025?",
    category: "politics",
    yesProbability: 62,
    volume: "$3.1M",
    sparklineData: [58, 61, 59, 63, 60, 62, 62],
    participants: 1567
  },
  {
    id: 5,
    title: "Who will be the next Prime Minister of Canada?",
    category: "politics",
    yesProbability: 55,
    volume: "$1.2M",
    sparklineData: [52, 55, 53, 57, 54, 56, 55],
    participants: 892
  },

  // Crypto / Финансы
  {
    id: 6,
    title: "Will a spot Ethereum ETF be approved by the SEC this year?",
    category: "crypto",
    yesProbability: 78,
    volume: "$5.6M",
    sparklineData: [75, 78, 76, 80, 77, 79, 78],
    participants: 2891
  },
  {
    id: 7,
    title: "Will Bitcoin's market cap exceed $3 trillion by EOY 2025?",
    category: "crypto",
    yesProbability: 68,
    volume: "$4.8M",
    sparklineData: [65, 68, 66, 70, 67, 69, 68],
    participants: 2345
  },
  {
    id: 8,
    title: "Will Tether (USDT) depeg below $0.98 in the next 6 months?",
    category: "crypto",
    yesProbability: 22,
    volume: "$2.1M",
    sparklineData: [25, 23, 22, 20, 23, 21, 22],
    participants: 1456
  },
  {
    id: 9,
    title: "Will Solana's daily active users surpass Ethereum's in Q4 2025?",
    category: "crypto",
    yesProbability: 42,
    volume: "$1.8M",
    sparklineData: [45, 42, 40, 44, 41, 43, 42],
    participants: 1123
  },

  // Finance
  {
    id: 10,
    title: "Will the US Fed implement another interest rate hike in 2025?",
    category: "finance",
    yesProbability: 35,
    volume: "$3.4M",
    sparklineData: [38, 35, 33, 36, 34, 35, 35],
    participants: 1789
  },
  {
    id: 11,
    title: "Will the S&P 500 reach 6,000 points by end of 2025?",
    category: "finance",
    yesProbability: 58,
    volume: "$2.7M",
    sparklineData: [55, 58, 56, 60, 57, 59, 58],
    participants: 1456
  },
  {
    id: 12,
    title: "Will Tesla stock reach $300 in 2025?",
    category: "finance",
    yesProbability: 48,
    volume: "$1.9M",
    sparklineData: [45, 48, 46, 50, 47, 49, 48],
    participants: 1234
  },

  // Technology / AI
  {
    id: 13,
    title: "Will OpenAI announce GPT-5 by June 2026?",
    category: "technology",
    yesProbability: 72,
    volume: "$3.2M",
    sparklineData: [69, 72, 70, 74, 71, 73, 72],
    participants: 1678
  },
  {
    id: 14,
    title: "Will Apple launch a foldable iPhone by 2027?",
    category: "technology",
    yesProbability: 38,
    volume: "$2.4M",
    sparklineData: [42, 38, 36, 40, 37, 39, 38],
    participants: 1345
  },
  {
    id: 15,
    title: "Will Neuralink successfully implant a device in 10+ humans by EOY 2025?",
    category: "technology",
    yesProbability: 25,
    volume: "$1.6M",
    sparklineData: [28, 25, 23, 27, 24, 26, 25],
    participants: 987
  },
  {
    id: 16,
    title: "Will Threads surpass X (Twitter) in monthly active users by 2026?",
    category: "technology",
    yesProbability: 65,
    volume: "$2.8M",
    sparklineData: [62, 65, 63, 67, 64, 66, 65],
    participants: 1456
  },
  {
    id: 17,
    title: "Will a commercially available quantum computer break RSA-2048 encryption?",
    category: "technology",
    yesProbability: 18,
    volume: "$1.2M",
    sparklineData: [22, 18, 16, 20, 17, 19, 18],
    participants: 756
  },

  // Sports / Culture
  {
    id: 18,
    title: "Will 'Grand Theft Auto VI' sell over 50 million units in its first month?",
    category: "sports",
    yesProbability: 82,
    volume: "$2.9M",
    sparklineData: [79, 82, 80, 84, 81, 83, 82],
    participants: 1678
  },
  {
    id: 19,
    title: "Who will win the 2026 FIFA World Cup?",
    category: "sports",
    yesProbability: 55,
    volume: "$4.1M",
    sparklineData: [52, 55, 53, 57, 54, 56, 55],
    participants: 2345
  },
  {
    id: 20,
    title: "Will any film gross over $2 billion at the box office in 2026?",
    category: "culture",
    yesProbability: 45,
    volume: "$1.8M",
    sparklineData: [48, 45, 43, 47, 44, 46, 45],
    participants: 1123
  },
  {
    id: 21,
    title: "Will Taylor Swift's 'The Eras Tour' become the first tour to gross $2 billion?",
    category: "culture",
    yesProbability: 88,
    volume: "$3.5M",
    sparklineData: [85, 88, 86, 90, 87, 89, 88],
    participants: 1892
  },
  {
    id: 22,
    title: "Will the winner of the Best Picture Oscar in 2026 be a non-English language film?",
    category: "culture",
    yesProbability: 32,
    volume: "$1.4M",
    sparklineData: [35, 32, 30, 34, 31, 33, 32],
    participants: 856
  }
];

interface BetFeedProps {
  onBetClick: (market: any, outcome: boolean) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export default function BetFeed({ onBetClick, activeFilter, onFilterChange }: BetFeedProps) {
  const filteredMarkets = activeFilter === 'all' 
    ? markets 
    : markets.filter(market => market.category === activeFilter);

  return (
    <div className="main-content">
      <h1 className="page-title">Markets</h1>
      
      <table className="bet-feed">
        <thead>
          <tr>
            <th>Market</th>
            <th>Probability</th>
            <th>Volume</th>
            <th>Trend</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredMarkets.map((market) => (
            <tr key={market.id} className="fade-in">
              <td>
                <div className="market-title">
                  {market.title}
                </div>
              </td>
              <td>
                <div className="probability">
                  {market.yesProbability}% Yes
                </div>
              </td>
              <td>
                <div className="volume">
                  {market.volume}
                </div>
              </td>
              <td>
                <Sparkline data={market.sparklineData} />
              </td>
              <td>
                <div className="action-buttons">
                  <button
                    onClick={() => onBetClick(market, true)}
                    className="btn-bet yes"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => onBetClick(market, false)}
                    className="btn-bet no"
                  >
                    No
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
