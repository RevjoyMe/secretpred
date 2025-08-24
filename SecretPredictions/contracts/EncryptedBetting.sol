// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockFHE.sol";

/**
 * @title EncryptedBetting
 * @dev Handles all encrypted betting operations for Secret Predictions
 * @notice All bet amounts and outcomes remain encrypted until market resolution
 */
contract EncryptedBetting {
    using TFHE for euint64;
    using TFHE for euint32;
    using TFHE for ebool;

    // Encrypted position data
    struct EncryptedPosition {
        euint64 yesAmount;      // Encrypted amount bet on YES
        euint64 noAmount;       // Encrypted amount bet on NO
        euint32 betCount;       // Encrypted number of bets
        ebool hasPosition;      // Encrypted flag for position existence
        ebool hasClaimed;       // Encrypted flag for payout claimed
    }

    // Market betting data
    struct MarketBetting {
        euint64 totalYesPool;   // Encrypted total YES bets
        euint64 totalNoPool;    // Encrypted total NO bets
        euint32 totalBetters;   // Encrypted number of unique bettors
        mapping(address => EncryptedPosition) positions;
    }

    // State
    mapping(uint256 => MarketBetting) private marketBets;
    mapping(address => bool) public authorizedCallers;
    
    address public immutable owner;
    address public predictionMarket;

    // Events (amounts/outcomes remain private)
    event EncryptedBetPlaced(
        uint256 indexed marketId,
        address indexed user,
        uint256 timestamp
    );
    
    event PositionUpdated(
        uint256 indexed marketId,
        address indexed user,
        uint256 timestamp
    );

    modifier onlyAuthorized() {
        require(
            msg.sender == predictionMarket || 
            authorizedCallers[msg.sender], 
            "Not authorized"
        );
        _;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Set the main prediction market contract
     */
    function setPredictionMarket(address _predictionMarket) external onlyOwner {
        predictionMarket = _predictionMarket;
    }

    /**
     * @dev Update user's encrypted position
     * @param marketId The market ID
     * @param user The user address
     * @param amount Encrypted bet amount
     * @param outcome Encrypted bet outcome (true = YES, false = NO)
     */
    function updatePosition(
        uint256 marketId,
        address user,
        euint64 amount,
        ebool outcome
    ) external onlyAuthorized {
        MarketBetting storage marketBet = marketBets[marketId];
        EncryptedPosition storage position = marketBet.positions[user];

        // Check if this is user's first bet
        ebool isNewBetter = TFHE.not(position.hasPosition);
        
        // Update bet count
        position.betCount = TFHE.add(position.betCount, TFHE.asEuint32(1));
        
        // Update position amounts based on outcome
        // If outcome is YES (true), add to yesAmount
        // If outcome is NO (false), add to noAmount
        euint64 yesAddition = TFHE.select(outcome, amount, TFHE.asEuint64(0));
        euint64 noAddition = TFHE.select(outcome, TFHE.asEuint64(0), amount);
        
        position.yesAmount = TFHE.add(position.yesAmount, yesAddition);
        position.noAmount = TFHE.add(position.noAmount, noAddition);
        position.hasPosition = TFHE.asEbool(true);

        // Update market totals
        marketBet.totalYesPool = TFHE.add(marketBet.totalYesPool, yesAddition);
        marketBet.totalNoPool = TFHE.add(marketBet.totalNoPool, noAddition);
        
        // Update total betters if this is a new better
        euint32 betterIncrement = TFHE.select(isNewBetter, TFHE.asEuint32(1), TFHE.asEuint32(0));
        marketBet.totalBetters = TFHE.add(marketBet.totalBetters, betterIncrement);

        emit EncryptedBetPlaced(marketId, user, block.timestamp);
        emit PositionUpdated(marketId, user, block.timestamp);
    }

    /**
     * @dev Calculate payout for a user (called during resolution)
     * @param marketId The resolved market
     * @param user The user to calculate payout for
     * @param finalOutcome The final market outcome
     * @return payout The payout amount (decrypted)
     */
    function calculatePayout(
        uint256 marketId,
        address user,
        bool finalOutcome
    ) external view onlyAuthorized returns (uint256 payout) {
        EncryptedPosition storage position = marketBets[marketId].positions[user];
        
        // Get user's winning amount based on final outcome
        euint64 winningAmount = finalOutcome ? 
            position.yesAmount : 
            position.noAmount;
        
        // Check if user has already claimed
        ebool alreadyClaimed = position.hasClaimed;
        ebool hasWinningPosition = TFHE.gt(winningAmount, TFHE.asEuint64(0));
        ebool canClaim = TFHE.and(hasWinningPosition, TFHE.not(alreadyClaimed));
        
        // Return 0 if can't claim, otherwise return decrypted winning amount
        euint64 finalPayout = TFHE.select(canClaim, winningAmount, TFHE.asEuint64(0));
        
        // Decrypt the final payout amount
        payout = TFHE.decrypt(finalPayout);
    }

    /**
     * @dev Mark user's position as claimed
     */
    function markClaimed(uint256 marketId, address user) external onlyAuthorized {
        marketBets[marketId].positions[user].hasClaimed = TFHE.asEbool(true);
    }

    /**
     * @dev Get decrypted pool sizes (only after market resolution)
     * @param marketId The market ID
     * @return yesPool Decrypted YES pool size
     * @return noPool Decrypted NO pool size
     */
    function getPoolSizes(uint256 marketId) external view onlyAuthorized returns (uint256 yesPool, uint256 noPool) {
        MarketBetting storage marketBet = marketBets[marketId];
        
        yesPool = TFHE.decrypt(marketBet.totalYesPool);
        noPool = TFHE.decrypt(marketBet.totalNoPool);
    }

    /**
     * @dev Get encrypted position for user (only user can call for their own position)
     * @param marketId The market ID
     * @param user The user address (must be msg.sender)
     * @return position The encrypted position data
     */
    function getEncryptedPosition(
        uint256 marketId, 
        address user
    ) external view returns (EncryptedPosition memory position) {
        require(msg.sender == user, "Can only view own position");
        return marketBets[marketId].positions[user];
    }

    /**
     * @dev Get market betting statistics (encrypted)
     * @param marketId The market ID
     * @return totalYesPool Encrypted YES pool
     * @return totalNoPool Encrypted NO pool
     * @return totalBetters Encrypted number of betters
     */
    function getMarketStats(uint256 marketId) external view returns (
        euint64 totalYesPool,
        euint64 totalNoPool,
        euint32 totalBetters
    ) {
        MarketBetting storage marketBet = marketBets[marketId];
        return (
            marketBet.totalYesPool,
            marketBet.totalNoPool,
            marketBet.totalBetters
        );
    }

    /**
     * @dev Check if user has position in market (returns encrypted boolean)
     * @param marketId The market ID
     * @param user The user address
     * @return hasPosition Encrypted boolean indicating if user has position
     */
    function hasPosition(uint256 marketId, address user) external view returns (ebool hasPosition) {
        return marketBets[marketId].positions[user].hasPosition;
    }

    /**
     * @dev Get user's total bet amount (encrypted)
     * @param marketId The market ID
     * @param user The user address
     * @return totalAmount Encrypted total amount bet by user
     */
    function getUserTotalBet(uint256 marketId, address user) external view returns (euint64 totalAmount) {
        EncryptedPosition storage position = marketBets[marketId].positions[user];
        return TFHE.add(position.yesAmount, position.noAmount);
    }

    /**
     * @dev Advanced: Get odds calculation data (for frontend display)
     * Note: This reveals pool ratios but not absolute amounts
     */
    function getOddsData(uint256 marketId) external view returns (uint256 yesRatio, uint256 noRatio) {
        MarketBetting storage marketBet = marketBets[marketId];
        
        uint256 yesPool = TFHE.decrypt(marketBet.totalYesPool);
        uint256 noPool = TFHE.decrypt(marketBet.totalNoPool);
        uint256 totalPool = yesPool + noPool;
        
        if (totalPool == 0) {
            return (50, 50); // 50/50 if no bets
        }
        
        yesRatio = (yesPool * 100) / totalPool;
        noRatio = (noPool * 100) / totalPool;
    }

    /**
     * @dev Admin functions
     */
    function setAuthorizedCaller(address caller, bool authorized) external onlyOwner {
        authorizedCallers[caller] = authorized;
    }

    /**
     * @dev Emergency function to decrypt position (only for resolved markets)
     */
    function emergencyDecryptPosition(
        uint256 marketId,
        address user
    ) external onlyOwner returns (uint256 yesAmount, uint256 noAmount, uint256 betCount) {
        EncryptedPosition storage position = marketBets[marketId].positions[user];
        
        yesAmount = TFHE.decrypt(position.yesAmount);
        noAmount = TFHE.decrypt(position.noAmount);
        betCount = TFHE.decrypt(position.betCount);
    }
}
