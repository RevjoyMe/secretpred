'use client';

import Header from '@/components/header';

export default function History() {
  const betHistory = [
    {
      id: 1,
      market: "Will Bitcoin reach $50,000 in 2024?",
      bet: "Yes",
      amount: "0.1 ETH",
      outcome: "Won",
      profit: "+0.15 ETH",
      date: "2024-12-31",
      probability: "75%"
    },
    {
      id: 2,
      market: "Will Ethereum 2.0 launch in 2024?",
      bet: "No",
      amount: "0.2 ETH",
      outcome: "Lost",
      profit: "-0.2 ETH",
      date: "2024-06-15",
      probability: "60%"
    },
    {
      id: 3,
      market: "Will Tesla stock reach $300 in 2024?",
      bet: "Yes",
      amount: "0.15 ETH",
      outcome: "Won",
      profit: "+0.22 ETH",
      date: "2024-09-20",
      probability: "45%"
    },
    {
      id: 4,
      market: "Will Apple release a new iPhone in 2024?",
      bet: "Yes",
      amount: "0.05 ETH",
      outcome: "Won",
      profit: "+0.03 ETH",
      date: "2024-10-15",
      probability: "90%"
    },
    {
      id: 5,
      market: "Will SpaceX land on Mars in 2024?",
      bet: "No",
      amount: "0.1 ETH",
      outcome: "Won",
      profit: "+0.08 ETH",
      date: "2024-12-01",
      probability: "25%"
    }
  ];

  const totalWon = betHistory.filter(bet => bet.outcome === "Won").length;
  const totalBets = betHistory.length;
  const winRate = ((totalWon / totalBets) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="main-content">
        <h1 className="page-title">Betting History</h1>
        
        {/* Stats Overview - Enhanced styling */}
        <div className="mb-12 p-8 border border-border rounded-lg bg-white/5">
          <h2 className="section-header">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-secondary text-sm mb-2 font-medium">Total Bets</div>
              <div className="text-3xl font-bold text-white">{totalBets}</div>
            </div>
            <div>
              <div className="text-secondary text-sm mb-2 font-medium">Win Rate</div>
              <div className="text-3xl font-bold text-accent">{winRate}%</div>
            </div>
            <div>
              <div className="text-secondary text-sm mb-2 font-medium">Wins</div>
              <div className="text-3xl font-bold text-accent">{totalWon}</div>
            </div>
            <div>
              <div className="text-secondary text-sm mb-2 font-medium">Losses</div>
              <div className="text-3xl font-bold text-destructive">{totalBets - totalWon}</div>
            </div>
          </div>
        </div>

        {/* Bet History Table - Enhanced styling */}
        <div className="mb-12">
          <h2 className="section-header">Recent Bets</h2>
          <table className="bet-feed">
            <thead>
              <tr>
                <th>Market</th>
                <th>Your Bet</th>
                <th>Amount</th>
                <th>Outcome</th>
                <th>Profit/Loss</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {betHistory.map((bet) => (
                <tr key={bet.id} className="fade-in">
                  <td>
                    <div className="market-title">
                      {bet.market}
                    </div>
                  </td>
                  <td>
                    <div className={`probability ${bet.bet === 'Yes' ? 'text-accent' : 'text-[#6A0DAD]'}`}>
                      {bet.bet}
                    </div>
                  </td>
                  <td>
                    <div className="volume">
                      {bet.amount}
                    </div>
                  </td>
                  <td>
                    <div className={`font-semibold ${bet.outcome === 'Won' ? 'text-accent' : 'text-destructive'}`}>
                      {bet.outcome}
                    </div>
                  </td>
                  <td>
                    <div className={`font-semibold ${bet.profit.startsWith('+') ? 'text-accent' : 'text-destructive'}`}>
                      {bet.profit}
                    </div>
                  </td>
                  <td>
                    <div className="volume">
                      {bet.date}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Chart Placeholder - Enhanced styling */}
        <div className="mb-12 p-8 border border-border rounded-lg bg-white/5">
          <h2 className="section-header">Performance Over Time</h2>
          <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-secondary text-center">
              <div className="text-4xl mb-4">📊</div>
              <div className="text-lg font-medium">Performance chart coming soon</div>
              <div className="text-sm mt-2">Historical performance tracking and analytics will be available soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
