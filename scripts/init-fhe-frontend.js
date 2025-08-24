// Example script for initializing FHE state through frontend
// This should be run in the browser, not via Node.js

import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk";
import { ethers } from "ethers";

async function initializeFHEState() {
  try {
    console.log("🔐 Initializing FHE state through Relayer SDK...");

    // Create FHE instance
    const instance = await createInstance(SepoliaConfig);
    console.log("✅ FHE instance created");

    // Get contract addresses from environment
    const bettingVaultAddress = process.env.NEXT_PUBLIC_BETTING_VAULT_ADDRESS;
    const predictionMarketAddress = process.env.NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS;

    // Connect to wallet
    if (!window.ethereum) {
      throw new Error("MetaMask not found");
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();
    
    console.log("📝 Connected wallet:", userAddress);

    // Initialize BettingVault
    console.log("📦 Initializing BettingVault...");
    const bettingVaultABI = [
      "function initializeFHEState() external",
      "function owner() external view returns (address)"
    ];
    
    const bettingVault = new ethers.Contract(bettingVaultAddress, bettingVaultABI, signer);
    
    // Check if caller is owner
    const owner = await bettingVault.owner();
    if (owner.toLowerCase() !== userAddress.toLowerCase()) {
      throw new Error("Only contract owner can initialize FHE state");
    }

    // Initialize FHE state
    const tx = await bettingVault.initializeFHEState();
    await tx.wait();
    console.log("✅ BettingVault FHE state initialized");

    // Initialize PredictionMarket (if needed)
    console.log("📦 Initializing PredictionMarket...");
    const predictionMarketABI = [
      "function initializeFHEState() external",
      "function owner() external view returns (address)"
    ];
    
    const predictionMarket = new ethers.Contract(predictionMarketAddress, predictionMarketABI, signer);
    
    // Check if caller is owner
    const pmOwner = await predictionMarket.owner();
    if (pmOwner.toLowerCase() !== userAddress.toLowerCase()) {
      throw new Error("Only contract owner can initialize FHE state");
    }

    // Initialize FHE state
    const pmTx = await predictionMarket.initializeFHEState();
    await pmTx.wait();
    console.log("✅ PredictionMarket FHE state initialized");

    console.log("🎉 FHE initialization completed successfully!");

  } catch (error) {
    console.error("❌ FHE initialization failed:", error);
    throw error;
  }
}

// Export for use in React components
export { initializeFHEState };

// Example usage in React component:
/*
import { initializeFHEState } from './scripts/init-fhe-frontend.js';

function InitializeButton() {
  const handleInitialize = async () => {
    try {
      await initializeFHEState();
      alert("FHE state initialized successfully!");
    } catch (error) {
      alert("Failed to initialize FHE state: " + error.message);
    }
  };

  return (
    <button onClick={handleInitialize}>
      Initialize FHE State
    </button>
  );
}
*/
