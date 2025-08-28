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
        
        <div className="two-column-layout">
          {/* Main Column - Active Bets Table */}
          <div className="main-column">
            <h2 className="section-header">Active Bets</h2>
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

          {/* Sidebar Column - Account Overview & Performance */}
          <div className="sidebar-column">
            {/* Account Overview */}
            <div className="sidebar-card">
              <h3 className="section-header">Account Overview</h3>
              <div className="space-y-6">
                <div>
                  <div className="text-secondary text-sm mb-2 font-medium">Total Balance</div>
                  <div className="text-3xl font-bold text-accent">5.7407 ETH</div>
                </div>
                <div>
                  <div className="text-secondary text-sm mb-2 font-medium">Active Bets</div>
                  <div className="text-3xl font-bold text-white">3</div>
                </div>
                <div>
                  <div className="text-secondary text-sm mb-2 font-medium">Total Staked</div>
                  <div className="text-3xl font-bold text-white">1.0 ETH</div>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="sidebar-card">
              <h3 className="section-header">Performance</h3>
              <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-secondary text-center">
                  <div className="text-3xl mb-3">📈</div>
                  <div className="text-base font-medium">Performance chart coming soon</div>
                  <div className="text-xs mt-2">Detailed analytics and performance tracking will be available soon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
