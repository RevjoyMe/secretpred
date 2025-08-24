import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import {
  initFHE,
  encryptBet,
  submitBet,
  userSideDecrypt,
  publicReveal,
  getMyEncryptedBet,
  getTotalPotEncrypted,
  publicDecryptPot
} from '@/lib/fhe-utils';

interface UseSecretPredictionsReturn {
  // State
  isFHEReady: boolean;
  isLoading: boolean;
  error: string | null;
  
  // User data
  myEncryptedBet: string | null;
  totalPotEncrypted: string | null;
  totalPotDecrypted: number | null;
  
  // Actions
  placeBet: (amount: bigint | number) => Promise<void>;
  revealPot: () => Promise<void>;
  getMyEncryptedBet: () => Promise<void>;
  getTotalPotEncrypted: () => Promise<void>;
  publicDecryptPot: () => Promise<void>;
  
  // Utility
  resetError: () => void;
}

export function useSecretPredictions(contractAddress: string): UseSecretPredictionsReturn {
  const { address, isConnected } = useAccount();
  
  // State
  const [isFHEReady, setIsFHEReady] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Data
  const [myEncryptedBet, setMyEncryptedBet] = useState<string | null>(null);
  const [totalPotEncrypted, setTotalPotEncrypted] = useState<string | null>(null);
  const [totalPotDecrypted, setTotalPotDecrypted] = useState<number | null>(null);
  
  // Initialize FHE
  useEffect(() => {
    const initializeFHE = async () => {
      if (!isConnected) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        await initFHE();
        setIsFHEReady(true);
        
        console.log("✅ FHE ready for Secret Predictions");
      } catch (err) {
        console.error("❌ FHE initialization failed:", err);
        setError(err instanceof Error ? err.message : "FHE initialization failed");
        setIsFHEReady(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeFHE();
  }, [isConnected]);
  
  // Place bet
  const placeBet = useCallback(async (amount: bigint | number) => {
    if (!isConnected || !isFHEReady) {
      setError("Wallet not connected or FHE not ready");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🎲 Placing bet:", amount.toString());
      
      // 1. Encrypt the bet amount
      const encryptedBet = await encryptBet(amount);
      
      // 2. Submit to contract
      await submitBet(encryptedBet, contractAddress);
      
      // 3. Refresh user's encrypted bet
      await getMyEncryptedBet();
      
      console.log("✅ Bet placed successfully!");
    } catch (err) {
      console.error("❌ Bet placement failed:", err);
      setError(err instanceof Error ? err.message : "Failed to place bet");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, isFHEReady, contractAddress]);
  
  // Reveal pot (make it publicly decryptable)
  const revealPot = useCallback(async () => {
    if (!isConnected || !isFHEReady) {
      setError("Wallet not connected or FHE not ready");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔓 Revealing pot...");
      
      await publicReveal(contractAddress);
      
      console.log("✅ Pot revealed successfully!");
    } catch (err) {
      console.error("❌ Pot reveal failed:", err);
      setError(err instanceof Error ? err.message : "Failed to reveal pot");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, isFHEReady, contractAddress]);
  
  // Get user's encrypted bet
  const getMyEncryptedBet = useCallback(async () => {
    if (!isConnected || !address) {
      setError("Wallet not connected");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("📖 Getting user's encrypted bet...");
      
      const encryptedBet = await getMyEncryptedBet(address, contractAddress);
      setMyEncryptedBet(encryptedBet);
      
      console.log("✅ User's encrypted bet retrieved");
    } catch (err) {
      console.error("❌ Failed to get user's encrypted bet:", err);
      setError(err instanceof Error ? err.message : "Failed to get encrypted bet");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, contractAddress]);
  
  // Get total pot encrypted
  const getTotalPotEncrypted = useCallback(async () => {
    if (!isConnected) {
      setError("Wallet not connected");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("📖 Getting total pot encrypted...");
      
      const encryptedPot = await getTotalPotEncrypted(contractAddress);
      setTotalPotEncrypted(encryptedPot);
      
      console.log("✅ Total pot encrypted retrieved");
    } catch (err) {
      console.error("❌ Failed to get total pot encrypted:", err);
      setError(err instanceof Error ? err.message : "Failed to get total pot");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, contractAddress]);
  
  // Public decrypt pot
  const publicDecryptPot = useCallback(async () => {
    if (!isConnected || !isFHEReady || !totalPotEncrypted) {
      setError("Wallet not connected, FHE not ready, or no encrypted pot available");
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      console.log("🔓 Publicly decrypting pot...");
      
      const decryptedValue = await publicDecryptPot(totalPotEncrypted);
      setTotalPotDecrypted(decryptedValue);
      
      console.log("✅ Pot publicly decrypted:", decryptedValue);
    } catch (err) {
      console.error("❌ Public decryption failed:", err);
      setError(err instanceof Error ? err.message : "Failed to decrypt pot");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, isFHEReady, totalPotEncrypted]);
  
  // Reset error
  const resetError = useCallback(() => {
    setError(null);
  }, []);
  
  // Auto-refresh data when connected
  useEffect(() => {
    if (isConnected && isFHEReady) {
      getMyEncryptedBet();
      getTotalPotEncrypted();
    }
  }, [isConnected, isFHEReady, getMyEncryptedBet, getTotalPotEncrypted]);
  
  return {
    // State
    isFHEReady,
    isLoading,
    error,
    
    // User data
    myEncryptedBet,
    totalPotEncrypted,
    totalPotDecrypted,
    
    // Actions
    placeBet,
    revealPot,
    getMyEncryptedBet,
    getTotalPotEncrypted,
    publicDecryptPot,
    
    // Utility
    resetError,
  };
}
