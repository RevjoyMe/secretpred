'use client';

import { useState, useEffect } from 'react';
import { X, Info } from 'lucide-react';

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
      <div className="modal-content p-8" onClick={(e) => e.stopPropagation()}>
        {/* [1. БЛОК: ШАПКА] */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">Place Your Bet</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>
        
        {/* Разделитель под шапкой */}
        <hr className="border-gray-600 mb-8" />

        {/* [2. БЛОК: ЗАГОЛОВОК СТАВКИ] */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-white leading-relaxed">
            Who will be the next Prime Minister of Canada?
          </h3>
        </div>

        {/* [3. БЛОК: ШАНСЫ "CURRENT ODDS"] */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold text-white mb-6">Current Odds</h4>
          
          {/* Ряд для YES */}
          <div className="flex items-center mb-4">
            <span className="text-gray-400 font-medium">YES</span>
            <div className="flex-1 mx-4 border-t border-dashed border-gray-600"></div>
            <span className="text-3xl font-bold text-white">55%</span>
          </div>
          
          {/* Ряд для NO */}
          <div className="flex items-center">
            <span className="text-gray-400 font-medium">NO</span>
            <div className="flex-1 mx-4 border-t border-dashed border-gray-600"></div>
            <span className="text-3xl font-bold text-white">45%</span>
          </div>
        </div>

        {/* [4. БЛОК: ВВОД СУММЫ] */}
        <hr className="border-gray-600 mb-8" />
        
        <div className="mb-8">
          <label className="block text-white font-semibold text-lg mb-4">
            Bet Amount (ETH)
          </label>
          
          <input
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            min="0.001"
            max="100"
            step="0.001"
            className="w-full p-4 bg-transparent border-2 border-gray-600 rounded-lg text-white text-lg focus:border-[#00F5FF] focus:outline-none transition-colors duration-200 mb-6"
            placeholder="0.01"
          />
          
          <input
            type="range"
            min="0.001"
            max="1"
            step="0.001"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* [5. БЛОК: РЕЗУЛЬТАТ "POTENTIAL WINNINGS"] */}
        <hr className="border-gray-600 mb-8" />
        
        <div className="flex items-center justify-between mb-12">
          <span className="text-gray-400 font-medium text-lg">Potential Winnings</span>
          <span className="text-4xl font-bold text-[#00F5FF]">0.0082 ETH</span>
        </div>

        {/* [6. БЛОК: КНОПКИ ДЕЙСТВИЙ] */}
        <div className="space-y-4">
          <button
            onClick={handlePlaceBet}
            disabled={isLoading}
            className="w-full h-16 bg-[#00F5FF] text-black rounded-lg font-bold text-xl hover:bg-[#00E6F2] transition-colors duration-200"
          >
            {isLoading ? 'Processing...' : 'Bet YES'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full h-16 bg-transparent border-2 border-gray-600 text-gray-400 rounded-lg font-semibold text-xl hover:border-gray-500 hover:text-gray-300 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export { BettingModal };
export default BettingModal;
