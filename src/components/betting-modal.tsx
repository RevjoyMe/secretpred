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

  const handleAmountChange = (value: string) => {
    const numValue = parseFloat(value);
    // Allow empty string for clearing input, but validate on submission
    if (value === '' || (numValue >= 0.001 && numValue <= 100)) {
      setAmount(value);
    }
  };

  const calculatePotentialWinnings = () => {
    if (!market || !amount) return '0.0000';
    const betAmount = parseFloat(amount);
    if (isNaN(betAmount)) return '0.0000';
    const probability = selectedOutcome ? market.yesProbability : (100 - market.yesProbability);
    if (!probability) return '0.0000';
    const payoutRatio = 100 / probability;
    return (betAmount * payoutRatio - betAmount).toFixed(4);
  };

  const handlePlaceBet = async () => {
    if (!amount || parseFloat(amount) < 0.001) {
      // Replace alert with a more modern notification system if available
      console.error('Please enter a valid amount (minimum 0.001 ETH)');
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

  const outcomeText = selectedOutcome ? 'YES' : 'NO';
  const yesOdds = market?.yesProbability || 55;
  const noOdds = 100 - yesOdds;


  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-[#1a1a2e] rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 m-4 relative border border-gray-700 text-white animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* --- Кнопка закрытия в верхнем правом углу --- */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors z-10 text-white"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* --- [1. БЛОК: ШАПКА] --- */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold">Place Your Bet</h2>
        </div>
        
        <hr className="border-gray-700 mb-6" />

        {/* --- [2. БЛОК: ЗАГОЛОВОК СТАВКИ] --- */}
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold leading-relaxed text-gray-300">
            {market?.question || "Who will be the next Prime Minister of Canada?"}
          </h3>
        </div>

        {/* --- [3. БЛОК: ШАНСЫ "CURRENT ODDS"] --- */}
        <div className="mb-6 p-4 bg-black bg-opacity-30 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-400 mb-3 text-center uppercase tracking-wider">Current Odds</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-gray-300">YES</span>
              <div className="flex-1 mx-4 border-t border-dashed border-gray-600"></div>
              <span className="font-bold text-green-400">{yesOdds}%</span>
            </div>
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium text-gray-300">NO</span>
              <div className="flex-1 mx-4 border-t border-dashed border-gray-600"></div>
              <span className="font-bold text-red-400">{noOdds}%</span>
            </div>
          </div>
        </div>

        {/* --- [4. БЛОК: ВВОД СУММЫ] --- */}
        <div className="mb-6">
          <label className="block font-semibold text-gray-300 text-sm mb-2" htmlFor="bet-amount">
            Bet Amount (ETH)
          </label>
          <input
            id="bet-amount"
            type="number"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            min="0.001"
            max="100"
            step="0.001"
            className="w-full p-3 bg-transparent border-2 border-gray-600 rounded-lg focus:border-cyan-400 focus:outline-none transition-colors duration-200 text-lg"
            placeholder="0.01"
          />
        </div>

        {/* --- Информация о шифровании --- */}
        <div className="flex items-start space-x-3 p-3 mb-6 bg-gray-800/50 rounded-lg border border-gray-700">
          <Info className="h-5 w-5 text-cyan-400 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-gray-400 leading-relaxed">
            Your bet amount and outcome choice are encrypted. No one can see your position until the market resolves.
          </p>
        </div>

        {/* --- [5. БЛОК: РЕЗУЛЬТАТ "POTENTIAL WINNINGS"] --- */}
        <div className="flex items-center justify-between mb-8 p-4 bg-black bg-opacity-30 rounded-lg">
          <span className="text-gray-400 font-medium">Potential Winnings</span>
          <span className="text-2xl font-bold text-cyan-400">{calculatePotentialWinnings()} ETH</span>
        </div>

        {/* --- [6. БЛОК: КНОПКИ ДЕЙСТВИЙ] --- */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onClose}
            className="w-full md:w-auto flex-1 md:flex-none px-10 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-transform transform hover:scale-105 duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceBet}
            disabled={isLoading}
            className="w-full md:w-auto flex-1 md:flex-none px-10 py-4 bg-green-500 text-white rounded-lg font-bold text-lg hover:bg-green-600 transition-transform transform hover:scale-105 duration-200"
          >
            {isLoading ? 'Processing...' : `Bet ${outcomeText}`}
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple fade-in animation
// You should add this to your global CSS file
const styles = `
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}


export { BettingModal };
export default BettingModal;
