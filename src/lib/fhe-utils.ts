import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk";
import { ethers } from "ethers";

// FHE Instance cache
let fheInstance: any = null;
let publicKey: string | null = null;

/**
 * Initialize FHE instance with Sepolia configuration
 */
export async function initFHE() {
  if (fheInstance && publicKey) {
    return { instance: fheInstance, publicKey };
  }

  try {
    console.log("🔐 Initializing FHE with Sepolia config...");
    const instance = await createInstance(SepoliaConfig);
    const pk = instance.getPublicKey();
    
    fheInstance = instance;
    publicKey = pk;
    
    console.log("✅ FHE initialized successfully");
    console.log("🔑 Public Key:", pk);
    
    return { instance: fheInstance, publicKey: pk };
  } catch (error) {
    console.error("❌ FHE initialization failed:", error);
    throw new Error("Failed to initialize FHE encryption");
  }
}

/**
 * Encrypt bet amount for FHE operations
 */
export async function encryptBet(amount: bigint | number): Promise<string> {
  try {
    const { instance, publicKey } = await initFHE();
    
    console.log("🔒 Encrypting bet amount:", amount.toString());
    const encryptedInput = await instance.createEncryptedInput(publicKey, amount, "euint64");
    
    console.log("✅ Bet encrypted successfully");
    return encryptedInput;
  } catch (error) {
    console.error("❌ Bet encryption failed:", error);
    throw new Error("Failed to encrypt bet amount");
  }
}

/**
 * Encrypt boolean outcome for FHE operations
 */
export async function encryptOutcome(outcome: boolean): Promise<string> {
  try {
    const { instance, publicKey } = await initFHE();
    
    console.log("🔒 Encrypting outcome:", outcome.toString());
    const encryptedInput = await instance.createEncryptedInput(publicKey, outcome ? 1 : 0, "ebool");
    
    console.log("✅ Outcome encrypted successfully");
    return encryptedInput;
  } catch (error) {
    console.error("❌ Outcome encryption failed:", error);
    throw new Error("Failed to encrypt outcome");
  }
}

/**
 * Submit encrypted bet to BettingVault contract
 */
export async function submitBet(encryptedInput: string, contractAddress: string) {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not available");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Contract ABI for placeBet function
    const abi = [
      "function placeBet(externalEuint64 encAmount) external"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    console.log("📤 Submitting encrypted bet to BettingVault...");
    const tx = await contract.placeBet(encryptedInput);
    
    console.log("⏳ Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Bet submitted successfully!");
    console.log("📋 Transaction hash:", receipt.transactionHash);
    
    return receipt;
  } catch (error) {
    console.error("❌ Bet submission failed:", error);
    throw new Error("Failed to submit bet to contract");
  }
}

/**
 * Submit encrypted bet to PredictionMarket contract
 */
export async function submitPredictionBet(
  marketId: number,
  encryptedAmount: string,
  encryptedOutcome: string,
  contractAddress: string,
  value: string
) {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not available");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Contract ABI for placeBet function
    const abi = [
      "function placeBet(uint256 marketId, externalEuint64 encryptedAmount, externalEbool encryptedOutcome) external payable"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    console.log("📤 Submitting encrypted prediction bet...");
    const tx = await contract.placeBet(marketId, encryptedAmount, encryptedOutcome, {
      value: ethers.utils.parseEther(value)
    });
    
    console.log("⏳ Waiting for transaction confirmation...");
    const receipt = await tx.wait();
    
    console.log("✅ Prediction bet submitted successfully!");
    console.log("📋 Transaction hash:", receipt.transactionHash);
    
    return receipt;
  } catch (error) {
    console.error("❌ Prediction bet submission failed:", error);
    throw new Error("Failed to submit prediction bet to contract");
  }
}

/**
 * User-side decryption with EIP-712 signature
 */
export async function userSideDecrypt(ciphertextHandle: string): Promise<number> {
  try {
    const { instance } = await initFHE();
    
    console.log("🔓 Decrypting user data...");
    const decryptedValue = await instance.userDecrypt(ciphertextHandle);
    
    console.log("✅ User data decrypted:", decryptedValue);
    return decryptedValue;
  } catch (error) {
    console.error("❌ User decryption failed:", error);
    throw new Error("Failed to decrypt user data");
  }
}

/**
 * Public reveal and decryption for BettingVault
 */
export async function publicReveal(contractAddress: string): Promise<number> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not available");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    
    // Contract ABI for makePotPublic function
    const abi = [
      "function makePotPublic() external"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, signer);
    
    console.log("🔓 Making pot publicly decryptable...");
    const tx = await contract.makePotPublic();
    await tx.wait();
    
    console.log("✅ Pot made publicly decryptable!");
    
    // Now we can use publicDecrypt (this would be called after the contract event)
    // For demonstration, we'll return a placeholder
    return 0; // In real implementation, you'd call publicDecrypt here
  } catch (error) {
    console.error("❌ Public reveal failed:", error);
    throw new Error("Failed to make pot publicly decryptable");
  }
}

/**
 * Get encrypted bet from BettingVault contract
 */
export async function getMyEncryptedBet(userAddress: string, contractAddress: string): Promise<string> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not available");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Contract ABI for getEncryptedBet function
    const abi = [
      "function getEncryptedBet(address user) external view returns (euint64)"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    console.log("📖 Getting encrypted bet for user:", userAddress);
    const encryptedBet = await contract.getEncryptedBet(userAddress);
    
    console.log("✅ Encrypted bet retrieved");
    return encryptedBet;
  } catch (error) {
    console.error("❌ Failed to get encrypted bet:", error);
    throw new Error("Failed to get encrypted bet");
  }
}

/**
 * Get encrypted total pot from BettingVault contract
 */
export async function getTotalPotEncrypted(contractAddress: string): Promise<string> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not available");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Contract ABI for getTotalPotEncrypted function
    const abi = [
      "function getTotalPotEncrypted() external view returns (euint64)"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    console.log("📖 Getting encrypted total pot...");
    const encryptedPot = await contract.getTotalPotEncrypted();
    
    console.log("✅ Encrypted total pot retrieved");
    return encryptedPot;
  } catch (error) {
    console.error("❌ Failed to get encrypted total pot:", error);
    throw new Error("Failed to get encrypted total pot");
  }
}

/**
 * Get session information from BettingVault
 */
export async function getSessionInfo(contractAddress: string): Promise<any> {
  try {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not available");
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    
    // Contract ABI for getSessionInfo function
    const abi = [
      "function getSessionInfo() external view returns (uint256, uint256, bool, uint256)"
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    console.log("📖 Getting session info...");
    const sessionInfo = await contract.getSessionInfo();
    
    console.log("✅ Session info retrieved");
    return {
      sessionId: sessionInfo[0].toString(),
      sessionEndTime: sessionInfo[1].toString(),
      sessionActive: sessionInfo[2],
      totalBettors: sessionInfo[3].toString()
    };
  } catch (error) {
    console.error("❌ Failed to get session info:", error);
    throw new Error("Failed to get session info");
  }
}

/**
 * Public decrypt pot after it's been made publicly decryptable
 */
export async function publicDecryptPot(ciphertextHandle: string): Promise<number> {
  try {
    const { instance } = await initFHE();
    
    console.log("🔓 Publicly decrypting pot...");
    const decryptedValue = await instance.publicDecrypt(ciphertextHandle);
    
    console.log("✅ Pot publicly decrypted:", decryptedValue);
    return decryptedValue;
  } catch (error) {
    console.error("❌ Public decryption failed:", error);
    throw new Error("Failed to publicly decrypt pot");
  }
}
