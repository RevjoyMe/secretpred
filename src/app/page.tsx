'use client';

import { useState } from 'react';
import Header from '@/components/header';
import BetFeed from '@/components/bet-feed';
import BettingModal from '@/components/betting-modal';
import { usePredictionMarket } from '@/hooks/usePredictionMarket';

export default function Home() {
  const [showBettingModal, setShowBettingModal] = useState(false);
  const [selectedMarket, setSelectedMarket] = useState<any>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<boolean>(true);
  
  const { handlePlaceBet: placeBet, isPlacingBet } = usePredictionMarket();

  const handleOpenBettingModal = (market: any, outcome: boolean) => {
    setSelectedMarket(market);
    setSelectedOutcome(outcome);
    setShowBettingModal(true);
  };

  const handleCloseBettingModal = () => {
    setShowBettingModal(false);
    setSelectedMarket(null);
  };

  const handlePlaceBet = async (amount: string, outcome: boolean) => {
    if (!selectedMarket) return;
    
    try {
      await placeBet(selectedMarket.id, outcome, amount);
      console.log('Bet placed successfully!');
    } catch (error) {
      console.error('Failed to place bet:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <BetFeed onBetClick={handleOpenBettingModal} />
      </main>

      {/* Betting Modal */}
      {showBettingModal && selectedMarket && (
        <BettingModal
          isOpen={showBettingModal}
          onClose={handleCloseBettingModal}
          market={selectedMarket}
          selectedOutcome={selectedOutcome}
          onPlaceBet={handlePlaceBet}
        />
      )}
    </div>
  );
}
