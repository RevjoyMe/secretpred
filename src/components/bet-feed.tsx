'use client';

import Sparkline from './sparkline';

const markets = [
  {
    id: 1,
    title: "Houthi strike on Israel by August 31, 2025?",
    yesProbability: 34,
    volume: "$2.1M",
    sparklineData: [45, 52, 38, 42, 34, 41, 34],
    participants: 1247
  },
  {
    id: 2,
    title: "Federal Reserve cuts rates by 25 bps in September 2025?",
    yesProbability: 73,
    volume: "$3.1M",
    sparklineData: [68, 71, 69, 72, 75, 73, 73],
    participants: 1567
  },
  {
    id: 3,
    title: "Democratic Presidential Nominee 2028",
    yesProbability: 58,
    volume: "$1.8M",
    sparklineData: [52, 55, 58, 56, 59, 57, 58],
    participants: 892
  },
  {
    id: 4,
    title: "Databricks IPO by December 31, 2025?",
    yesProbability: 42,
    volume: "$956K",
    sparklineData: [38, 45, 42, 40, 44, 43, 42],
    participants: 445
  },
  {
    id: 5,
    title: "OpenAI IPO by December 31, 2025?",
    yesProbability: 28,
    volume: "$1.2M",
    sparklineData: [35, 32, 30, 28, 26, 29, 28],
    participants: 634
  },
  {
    id: 6,
    title: "Stripe IPO by December 31, 2025?",
    yesProbability: 58,
    volume: "$1.2M",
    sparklineData: [52, 55, 58, 56, 59, 57, 58],
    participants: 634
  },
  {
    id: 7,
    title: "Bitcoin price above $100,000 by August 31, 2025?",
    yesProbability: 68,
    volume: "$2.4M",
    sparklineData: [62, 65, 68, 66, 69, 67, 68],
    participants: 1247
  },
  {
    id: 8,
    title: "Ethereum price above $8,000 by August 31, 2025?",
    yesProbability: 45,
    volume: "$1.6M",
    sparklineData: [42, 45, 43, 46, 44, 45, 45],
    participants: 789
  },
  {
    id: 9,
    title: "Bitcoin higher than Ethereum on August 26, 2025?",
    yesProbability: 72,
    volume: "$892K",
    sparklineData: [68, 71, 69, 72, 75, 73, 72],
    participants: 456
  },
  {
    id: 10,
    title: "Elon Musk tweets 50+ times August 22-29, 2025?",
    yesProbability: 81,
    volume: "$456K",
    sparklineData: [78, 81, 79, 82, 80, 81, 81],
    participants: 234
  },
  {
    id: 11,
    title: "Taylor Swift releases new album in 2025?",
    yesProbability: 81,
    volume: "$956K",
    sparklineData: [78, 81, 79, 82, 80, 81, 81],
    participants: 445
  },
  {
    id: 12,
    title: "New James Bond announced by end of 2025?",
    yesProbability: 35,
    volume: "$678K",
    sparklineData: [32, 35, 33, 36, 34, 35, 35],
    participants: 321
  }
];

interface BetFeedProps {
  onBetClick: (market: any, outcome: boolean) => void;
}

export default function BetFeed({ onBetClick }: BetFeedProps) {
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
          {markets.map((market) => (
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
