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
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* БЛОК 1: Шапка (1 ряд, 2 элемента) */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Place Your Bet</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white rounded flex items-center justify-center"
          >
            <X className="h-5 w-5 text-black" />
          </button>
        </div>

        {/* БЛОК 2: Заголовок Ставки (1 ряд) */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-white">
            Who will be the next Prime Minister of Canada?
          </h3>
        </div>

        {/* БЛОК 3: Шансы (1 ряд, 2 КОЛОНКИ) */}
        <div className="mb-8">
          <div className="flex">
            <div className="flex-1 text-center">
              <div className="text-4xl font-bold text-white mb-2">55%</div>
              <div className="text-sm text-gray-400">YES</div>
            </div>
            <div className="flex-1 text-center">
              <div className="text-4xl font-bold text-white mb-2">45%</div>
              <div className="text-sm text-gray-400">NO</div>
            </div>
          </div>
        </div>

        {/* БЛОК 4: Потенциальный Выигрыш (1 ряд, 2 элемента) */}
        <div className="mb-8 flex items-center justify-between">
          <span className="text-gray-400">Potential Winnings</span>
          <span className="text-2xl font-bold text-[#00F5FF]">0.0082 ETH</span>
        </div>

        {/* БЛОК 5: Ввод Суммы (несколько рядов) */}
        <div className="mb-8">
          {/* Ряд 1: Текст "Bet Amount (ETH)" */}
          <div className="mb-4">
            <label className="block text-white font-semibold text-lg">
              Bet Amount (ETH)
            </label>
          </div>
          
          {/* Ряд 2: Поле для ввода "0.01" */}
          <div className="mb-6">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              min="0.001"
              max="100"
              step="0.001"
              className="w-full p-4 bg-transparent border border-gray-600 rounded-lg text-white text-lg focus:border-[#00F5FF] focus:outline-none transition-colors duration-200"
              placeholder="0.01"
            />
          </div>
          
          {/* Ряд 3: Слайдер */}
          <div>
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
        </div>

        {/* БЛОК 6: Уведомление (1 ряд) */}
        <div className="mb-8 flex items-start space-x-3">
          <div className="w-5 h-5 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="h-3 w-3 text-gray-300" />
          </div>
          <div className="text-sm text-gray-400 leading-relaxed">
            Your bet amount and outcome choice are encrypted using FHE technology. 
            No one can see your position until the market resolves.
          </div>
        </div>

        {/* БЛОК 7: Кнопки (1 ряд, 2 элемента) */}
        <div className="flex space-x-4">
          <button
            onClick={onClose}
            className="flex-1 h-14 bg-transparent border border-gray-600 text-gray-400 rounded-lg font-semibold text-lg hover:border-gray-500 hover:text-gray-300 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceBet}
            disabled={isLoading}
            className="flex-1 h-14 bg-[#00F5FF] text-black rounded-lg font-bold text-lg hover:bg-[#00E6F2] transition-colors duration-200"
          >
            {isLoading ? 'Processing...' : 'Bet YES'}
          </button>
        </div>
      </div>
    </div>
  );
}

export { BettingModal };
export default BettingModal;
