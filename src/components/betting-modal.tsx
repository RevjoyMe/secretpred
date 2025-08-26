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

export default function BettingModal({ 
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Place Your Bet</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Market Info */}
        <div className="mb-6 p-4 rounded-lg bg-white/5 border border-white/10">
          <div className="flex items-start justify-between mb-3">
            <span className="category-pill">{market.category}</span>
            <span className="text-gray-400 text-sm">Ends {market.endDate}</span>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">
            {market.title}
          </h3>
          <p className="text-gray-400 text-sm">
            {market.description}
          </p>
        </div>

        {/* Current Odds */}
        <div className="mb-6">
          <h4 className="text-white font-semibold mb-3">Current Odds</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedOutcome 
                ? 'border-primary bg-primary/10' 
                : 'border-white/20 bg-white/5'
            }`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{market.yesProbability}%</div>
                <div className="text-sm text-gray-400">YES</div>
              </div>
            </div>
            <div className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              !selectedOutcome 
                ? 'border-secondary bg-secondary/10' 
                : 'border-white/20 bg-white/5'
            }`}>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">{100 - market.yesProbability}%</div>
                <div className="text-sm text-gray-400">NO</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bet Amount */}
        <div className="mb-6">
          <label className="block text-white font-semibold mb-3">
            Bet Amount (ETH)
          </label>
          <div className="relative">
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
              className="input-field pl-10"
              placeholder="0.01"
            />
          </div>
          
          {/* Amount Slider */}
          <div className="mt-4">
            <input
              type="range"
              min="0.001"
              max="1"
              step="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>0.001 ETH</span>
              <span>1 ETH</span>
            </div>
          </div>
        </div>

        {/* Potential Winnings */}
        <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-white font-semibold">Potential Winnings</span>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-primary">
                {calculatePotentialWinnings()} ETH
              </div>
              <div className="text-sm text-gray-400">
                If {selectedOutcome ? 'YES' : 'NO'} wins
              </div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="mb-6 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div className="text-sm text-yellow-200">
              <strong>Privacy Notice:</strong> Your bet amount and outcome choice are encrypted using FHE technology. 
              No one can see your position until the market resolves.
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={onClose}
            className="btn-outline flex-1"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceBet}
            disabled={isLoading}
            className="btn-primary flex-1 flex items-center justify-center"
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

// Custom slider styles
const style = document.createElement('style');
style.textContent = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4aa, #8b5cf6);
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: linear-gradient(135deg, #00d4aa, #8b5cf6);
    cursor: pointer;
    border: none;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  }
`;
document.head.appendChild(style);
