'use client';

import { useState, useEffect } from 'react';
import { X, DollarSign, TrendingUp, AlertCircle } from 'lucide-react';

interface BettingModalProps {
  isOpen: boolean;
  onClose: () => void;
  market: any;
  selectedOutcome: boolean;
  onPlaceBet: (amount: string, outcome: boolean) => void;
}

function BettingModal({ 
  isOpen, 
  onClose, 
  market, 
  selectedOutcome, 
  onPlaceBet 
}: BettingModalProps) {
  const [amount, setAmount] = useState('0.01');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setAmount('0.01');
    }
  }, [isOpen]);

  // Add custom slider styles on client side
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--yes-color);
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: var(--yes-color);
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, []);

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    if (numValue >= 0.001 && numValue <= 100) {
      setAmount(value);
    }
  };

  const calculatePotentialWinnings = () => {
    const betAmount = parseFloat(amount);
    const probability = selectedOutcome ? market.yesProbability : (100 - market.yesProbability);
    const payoutRatio = 100 / probability;
    return (betAmount * payoutRatio - betAmount).toFixed(4);
  };

  const handlePlaceBet = async () => {
    if (!amount || parseFloat(amount) < 0.001) {
      alert('Please enter a valid amount (minimum 0.001 ETH)');
      return;
    }

    setIsLoading(true);
    try {
      await onPlaceBet(amount, selectedOutcome);
      onClose();
    } catch (error) {
      console.error('Bet placement failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Place Your Bet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Market Info - Left-aligned text */}
        <div className="mb-8 p-6 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start justify-between mb-4">
            <span className="category-pill">{market.category}</span>
            <span className="text-gray-400 text-sm">Ends {market.endDate}</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3 leading-relaxed text-left">
            {market.title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed text-left">
            {market.description}
          </p>
        </div>

        {/* Current Odds - Left-aligned labels */}
        <div className="mb-8">
          <h4 className="text-white font-semibold mb-4 text-lg text-left">Current Odds</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-6 rounded-lg border-2 transition-all duration-200 ${
              selectedOutcome 
                ? 'border-[#00F5FF] bg-[#00F5FF]/10' 
                : 'border-white/20 bg-white/5'
            }`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#00F5FF] mb-2">{market.yesProbability}%</div>
                <div className="text-sm text-gray-400 font-medium">YES</div>
              </div>
            </div>
            <div className={`p-6 rounded-lg border-2 transition-all duration-200 ${
              !selectedOutcome 
                ? 'border-[#6A0DAD] bg-[#6A0DAD]/10' 
                : 'border-white/20 bg-white/5'
            }`}>
              <div className="text-center">
                <div className="text-3xl font-bold text-[#6A0DAD] mb-2">{100 - market.yesProbability}%</div>
                <div className="text-sm text-gray-400 font-medium">NO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bet Amount - Left-aligned label */}
        <div className="mb-8">
          <label className="block text-white font-semibold mb-4 text-lg text-left">
            Bet Amount (ETH)
          </label>
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min="0.001"
              max="100"
              step="0.001"
              className="input-field pl-10 text-lg"
              placeholder="0.01"
            />
          </div>
          
          {/* Amount Slider */}
          <div className="mt-6">
            <input
              type="range"
              min="0.001"
              max="1"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-3">
              <span>0.001 ETH</span>
              <span>1 ETH</span>
            </div>
          </div>
        </div>

        {/* Potential Winnings - Left-aligned */}
        <div className="mb-8 p-6 rounded-lg bg-gradient-to-r from-[#00F5FF]/10 to-[#6A0DAD]/10 border border-[#00F5FF]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-6 w-6 text-[#00F5FF]" />
              <span className="text-white font-semibold text-lg">Potential Winnings</span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00F5FF] mb-1">
                {calculatePotentialWinnings()} ETH
              </div>
              <div className="text-sm text-gray-400 font-medium">
                If {selectedOutcome ? 'YES' : 'NO'} wins
              </div>
            </div>
          </div>
        </div>

        {/* Warning - Left-aligned */}
        <div className="mb-8 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-yellow-200 leading-relaxed text-left">
              <strong>Privacy Notice:</strong> Your bet amount and outcome choice are encrypted using FHE technology. 
              No one can see your position until the market resolves.
            </div>
          </div>
        </div>

        {/* Action Buttons - Enhanced styling */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="btn-outline"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceBet}
            disabled={isLoading}
            className="btn-primary flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Processing...
              </>
            ) : (
              `Bet ${selectedOutcome ? 'YES' : 'NO'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export { BettingModal };
export default BettingModal;
