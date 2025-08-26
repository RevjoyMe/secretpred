'use client';

import Header from '@/components/header';

export default function Portfolio() {
  const activeBets = [
    {
      id: 1,
      market: "Bitcoin price above $100,000 by August 31, 2025?",
      bet: "Yes",
      amount: "0.5 ETH",
      potentialWin: "0.74 ETH",
      probability: "68%"
    },
    {
      id: 2,
      market: "Federal Reserve cuts rates by 25 bps in September 2025?",
      bet: "No",
      amount: "0.3 ETH",
      potentialWin: "0.11 ETH",
      probability: "27%"
    },
    {
      id: 3,
      market: "OpenAI IPO by December 31, 2025?",
      bet: "Yes",
      amount: "0.2 ETH",
      potentialWin: "0.51 ETH",
      probability: "28%"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="main-content">
        <h1 className="page-title">Portfolio</h1>
        
        {/* Balance Section */}
        <div className="mb-8 p-6 border border-border rounded">
          <h2 className="text-xl font-semibold text-foreground mb-4">Account Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <div className="text-secondary text-sm mb-1">Total Balance</div>
              <div className="text-2xl font-bold text-accent">5.7407 ETH</div>
            </div>
            <div>
              <div className="text-secondary text-sm mb-1">Active Bets</div>
              <div className="text-2xl font-bold text-foreground">3</div>
            </div>
            <div>
              <div className="text-secondary text-sm mb-1">Total Staked</div>
              <div className="text-2xl font-bold text-foreground">1.0 ETH</div>
            </div>
          </div>
        </div>

        {/* Active Bets */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-4">Active Bets</h2>
          <table className="bet-feed">
            <thead>
              <tr>
                <th>Market</th>
                <th>Your Bet</th>
                <th>Amount</th>
                <th>Potential Win</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody>
              {activeBets.map((bet) => (
                <tr key={bet.id} className="fade-in">
                  <td>
                    <div className="market-title">
                      {bet.market}
                    </div>
                  </td>
                  <td>
                    <div className={`probability ${bet.bet === 'Yes' ? 'text-accent' : 'text-destructive'}`}>
                      {bet.bet}
                    </div>
                  </td>
                  <td>
                    <div className="volume">
                      {bet.amount}
                    </div>
                  </td>
                  <td>
                    <div className="text-accent font-semibold">
                      {bet.potentialWin}
                    </div>
                  </td>
                  <td>
                    <div className="volume">
                      {bet.probability}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Performance Chart Placeholder */}
        <div className="mb-8 p-6 border border-border rounded">
          <h2 className="text-xl font-semibold text-foreground mb-4">Performance</h2>
          <div className="h-64 bg-muted rounded flex items-center justify-center">
            <div className="text-secondary text-center">
              <div className="text-2xl mb-2">📈</div>
              <div>Performance chart coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
