// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, externalEuint64, ebool } from "@fhevm/solidity/lib/FHE.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title BettingVault
 * @dev Privacy-preserving betting vault using Zama FHEVM
 * @notice All bet amounts remain encrypted until public reveal
 */
contract BettingVault is Ownable, ReentrancyGuard {
    // Encrypted state variables
    euint64 private totalPot;
    mapping(address => euint64) private bets;
    ebool private resultComputed;
    euint32 private totalBettors; // Changed to euint32 for FHE operations
    
    // Betting session management
    uint256 public sessionId;
    uint256 public sessionEndTime;
    bool public sessionActive;
    
    // Events
    event BetPlaced(address indexed user, uint256 amount, uint256 timestamp);
    event PotRevealed(uint256 totalAmount, uint256 totalBettors, uint256 timestamp);
    event SessionStarted(uint256 sessionId, uint256 endTime);
    event SessionEnded(uint256 sessionId, uint256 timestamp);
    
    constructor() Ownable(msg.sender) {
        // Only initialize non-FHE variables
        sessionId = 1;
        sessionActive = false;
    }
    
    /**
     * @dev Initialize FHE state and permissions - call this after deployment
     */
    function initializeFHEState() external onlyOwner {
        // Initialize encrypted state variables
        totalPot = FHE.asEuint64(0);
        resultComputed = FHE.asEbool(false);
        totalBettors = FHE.asEuint32(0);
        
        // Allow contract to access its own data for future computations
        FHE.allowThis(totalPot);
        FHE.allowThis(resultComputed);
        FHE.allowThis(totalBettors);
    }
    
    /**
     * @dev Start a new betting session
     * @param duration Duration of the session in seconds
     */
    function startSession(uint256 duration) external onlyOwner {
        require(!sessionActive, "Session already active");
        require(duration > 0, "Duration must be positive");
        
        sessionActive = true;
        sessionEndTime = block.timestamp + duration;
        sessionId++;
        
        // Reset encrypted state for new session
        totalPot = FHE.asEuint64(0);
        resultComputed = FHE.asEbool(false);
        totalBettors = FHE.asEuint32(0);
        
        emit SessionStarted(sessionId, sessionEndTime);
    }
    
    /**
     * @dev End the current betting session
     */
    function endSession() external onlyOwner {
        require(sessionActive, "No active session");
        require(block.timestamp >= sessionEndTime, "Session not ended yet");
        
        sessionActive = false;
        emit SessionEnded(sessionId, block.timestamp);
    }
    
    /**
     * @dev Place an encrypted bet
     * @param encAmount External encrypted amount from frontend
     */
    function placeBet(externalEuint64 encAmount) external nonReentrant {
        require(sessionActive, "No active session");
        require(block.timestamp < sessionEndTime, "Session ended");
        
        // Convert external encrypted input to internal euint64
        euint64 amount = FHE.fromExternal(encAmount, "");
        
        // Get previous bet for this user
        euint64 prevBet = bets[msg.sender];
        
        // Add new bet to previous (FHE addition)
        euint64 newTotalBet = FHE.add(prevBet, amount);
        bets[msg.sender] = newTotalBet;
        
        // Add to total pot (FHE addition)
        totalPot = FHE.add(totalPot, amount);
        
        // Increment total bettors if this is a new bettor using FHE operations
        ebool isNewBettor = FHE.eq(prevBet, FHE.asEuint64(0));
        euint32 increment = FHE.select(isNewBettor, FHE.asEuint32(1), FHE.asEuint32(0));
        totalBettors = FHE.add(totalBettors, increment);
        
        // Allow contract to access updated data for future computations
        FHE.allowThis(bets[msg.sender]);
        FHE.allowThis(totalPot);
        FHE.allowThis(totalBettors);
        
        emit BetPlaced(msg.sender, 0, block.timestamp); // Amount is 0 for privacy
    }
    
    /**
     * @dev Compute any required encrypted calculation
     * Note: This function demonstrates encrypted computation without FHE in view/pure
     */
    function computeResult() external onlyOwner {
        require(!sessionActive, "Session still active");
        
        // Example: Check if total pot is greater than some threshold
        euint64 threshold = FHE.asEuint64(1000); // 1000 wei threshold
        ebool isAboveThreshold = FHE.gt(totalPot, threshold);
        
        // Store the result (using the computed value)
        resultComputed = isAboveThreshold;
        
        // Allow contract to access the computed result
        FHE.allowThis(resultComputed);
    }
    
    /**
     * @dev Make total pot publicly decryptable
     * After this call, frontend can use publicDecrypt to get the plaintext
     */
    function makePotPublic() external onlyOwner {
        require(!sessionActive, "Session still active");
        
        // Make total pot publicly decryptable
        FHE.makePubliclyDecryptable(totalPot);
        
        emit PotRevealed(0, 0, block.timestamp); // Amount will be 0 until decrypted
    }
    
    /**
     * @dev Make total bettors publicly decryptable
     */
    function makeBettorsPublic() external onlyOwner {
        require(!sessionActive, "Session still active");
        
        // Make total bettors publicly decryptable
        FHE.makePubliclyDecryptable(totalBettors);
    }
    
    /**
     * @dev Get encrypted bet for a specific user
     * @param user Address of the user
     * @return Encrypted bet amount (only returns handle, no FHE operations)
     */
    function getEncryptedBet(address user) external view returns (euint64) {
        return bets[user]; // Only return handle, no FHE operations
    }
    
    /**
     * @dev Get encrypted total pot
     * @return Encrypted total pot amount (only returns handle, no FHE operations)
     */
    function getTotalPotEncrypted() external view returns (euint64) {
        return totalPot; // Only return handle, no FHE operations
    }
    
    /**
     * @dev Get encrypted total bettors
     * @return Encrypted total bettors (only returns handle, no FHE operations)
     */
    function getTotalBettorsEncrypted() external view returns (euint32) {
        return totalBettors; // Only return handle, no FHE operations
    }
    
    /**
     * @dev Get computed result status
     * @return Encrypted result computed flag (only returns handle, no FHE operations)
     */
    function getResultComputed() external view returns (ebool) {
        return resultComputed; // Only return handle, no FHE operations
    }
    
    /**
     * @dev Get session information
     */
    function getSessionInfo() external view returns (
        uint256 _sessionId,
        uint256 _sessionEndTime,
        bool _sessionActive
    ) {
        return (sessionId, sessionEndTime, sessionActive);
    }
    
    /**
     * @dev Emergency function to pause betting
     */
    function emergencyPause() external onlyOwner {
        sessionActive = false;
        emit SessionEnded(sessionId, block.timestamp);
    }
    
    /**
     * @dev Withdraw any ETH sent to contract (emergency only)
     */
    function withdrawETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "ETH withdrawal failed");
    }
    
    receive() external payable {}
}

/*
 * FHE.allow / FHE.allowThis / FHE.allowTransient Usage Explanation:
 * 
 * 1. FHE.allowThis(data) - Allows the contract itself to access encrypted data
 *    for future computations. Used when the contract needs to perform operations
 *    on its own encrypted state variables.
 * 
 * 2. FHE.allow(data, target) - Allows a specific target contract to access
 *    encrypted data. Used for cross-contract encrypted data sharing.
 * 
 * 3. FHE.allowTransient(data) - Allows temporary access for a single operation.
 *    The permission is automatically revoked after the operation completes.
 * 
 * In this contract:
 * - We use FHE.allowThis() after updating totalPot, bets[msg.sender], and totalBettors
 *   because the contract needs to access these values for future computations
 *   (like computeResult() function).
 * 
 * - We don't use FHE.allow() because we're not sharing data with other contracts.
 * 
 * - We don't use FHE.allowTransient() because we need persistent access to
 *   the encrypted data for multiple operations.
 */
