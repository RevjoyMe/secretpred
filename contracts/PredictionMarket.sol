// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint64, euint32, ebool, externalEuint64, externalEbool } from '@fhevm/solidity/lib/FHE.sol';
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title PredictionMarket
 * @dev Privacy-preserving prediction market using Zama FHEVM
 * @notice All betting amounts and outcomes remain encrypted until market resolution
 */
contract PredictionMarket is Ownable, ReentrancyGuard {
    // Market states
    enum MarketState {
        Active,      // Market is open for betting
        Locked,      // Market is locked, waiting for resolution
        Resolved,    // Market is resolved, payouts available
        Cancelled    // Market was cancelled
    }

    // Market structure
    struct Market {
        uint256 id;
        string question;
        string description;
        uint256 endTime;
        uint256 resolutionTime;
        MarketState state;
        bool outcome;  // true = YES, false = NO
        address oracle;
        uint256 totalPool;
        uint256 creationTime;
        address creator;
        uint256 fee;  // Fee in basis points (100 = 1%)
    }

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

    // State variables
    mapping(uint256 => Market) public markets;
    mapping(uint256 => MarketBetting) private marketBets;
    mapping(address => bool) public authorizedOracles;
    
    uint256 public nextMarketId = 1;
    uint256 public constant MARKET_FEE = 300; // 3% platform fee
    uint256 public constant MIN_BET = 1e16; // 0.01 ETH minimum
    uint256 public constant MAX_BET = 10e18; // 10 ETH maximum

    // Events
    event MarketCreated(
        uint256 indexed marketId,
        string question,
        uint256 endTime,
        address indexed creator
    );
    
    event BetPlaced(
        uint256 indexed marketId,
        address indexed user,
        uint256 timestamp
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        uint256 timestamp
    );
    
    event PayoutClaimed(
        uint256 indexed marketId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );

    modifier onlyOracle(uint256 marketId) {
        require(
            msg.sender == markets[marketId].oracle || 
            authorizedOracles[msg.sender], 
            "Not authorized oracle"
        );
        _;
    }

    modifier validMarket(uint256 marketId) {
        require(marketId > 0 && marketId < nextMarketId, "Invalid market");
        _;
    }

    modifier marketActive(uint256 marketId) {
        require(markets[marketId].state == MarketState.Active, "Market not active");
        require(block.timestamp < markets[marketId].endTime, "Market ended");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new prediction market
     */
    function createMarket(
        string memory question,
        string memory description,
        uint256 endTime,
        address oracle,
        uint256 fee
    ) external returns (uint256 marketId) {
        require(endTime > block.timestamp, "End time must be in future");
        require(oracle != address(0), "Invalid oracle address");
        require(fee <= 1000, "Fee too high"); // Max 10%

        marketId = nextMarketId++;

        markets[marketId] = Market({
            id: marketId,
            question: question,
            description: description,
            endTime: endTime,
            resolutionTime: 0,
            state: MarketState.Active,
            outcome: false,
            oracle: oracle,
            totalPool: 0,
            creationTime: block.timestamp,
            creator: msg.sender,
            fee: fee
        });

        emit MarketCreated(marketId, question, endTime, msg.sender);
    }

    /**
     * @dev Place an encrypted bet on a market
     * @param marketId The market to bet on
     * @param encryptedAmount Encrypted bet amount
     * @param encryptedOutcome Encrypted outcome (true = YES, false = NO)
     */
    function placeBet(
        uint256 marketId,
        externalEuint64 encryptedAmount,
        externalEbool encryptedOutcome
    ) external payable validMarket(marketId) marketActive(marketId) nonReentrant {
        require(msg.value >= MIN_BET && msg.value <= MAX_BET, "Invalid bet amount");

        // Convert external encrypted inputs to internal types
        euint64 amount = FHE.fromExternal(encryptedAmount, "");
        ebool outcome = FHE.fromExternal(encryptedOutcome, "");

        // Note: In a real FHE implementation, validation would be handled differently
        // For now, we proceed assuming the amounts match

        // Update user position
        _updatePosition(marketId, msg.sender, amount, outcome);

        // Update market pool
        markets[marketId].totalPool += msg.value;

        emit BetPlaced(marketId, msg.sender, block.timestamp);
    }

    /**
     * @dev Update user's encrypted position
     */
    function _updatePosition(
        uint256 marketId,
        address user,
        euint64 amount,
        ebool outcome
    ) internal {
        MarketBetting storage marketBet = marketBets[marketId];
        EncryptedPosition storage position = marketBet.positions[user];

        // Check if this is user's first bet
        ebool isNewBetter = FHE.not(position.hasPosition);

        // Update bet count
        position.betCount = FHE.add(position.betCount, FHE.asEuint32(1));

        // Update position amounts based on outcome
        euint64 yesAddition = FHE.select(outcome, amount, FHE.asEuint64(0));
        euint64 noAddition = FHE.select(outcome, FHE.asEuint64(0), amount);

        position.yesAmount = FHE.add(position.yesAmount, yesAddition);
        position.noAmount = FHE.add(position.noAmount, noAddition);
        position.hasPosition = FHE.asEbool(true);

        // Update market totals
        marketBet.totalYesPool = FHE.add(marketBet.totalYesPool, yesAddition);
        marketBet.totalNoPool = FHE.add(marketBet.totalNoPool, noAddition);

        // Update total betters if this is a new better
        euint32 betterIncrement = FHE.select(isNewBetter, FHE.asEuint32(1), FHE.asEuint32(0));
        marketBet.totalBetters = FHE.add(marketBet.totalBetters, betterIncrement);
    }

    /**
     * @dev Resolve a market with the final outcome
     */
    function resolveMarket(
        uint256 marketId,
        bool outcome
    ) external validMarket(marketId) onlyOracle(marketId) {
        Market storage market = markets[marketId];
        require(market.state == MarketState.Active, "Market not active");
        require(block.timestamp >= market.endTime, "Market still active");

        market.state = MarketState.Resolved;
        market.outcome = outcome;
        market.resolutionTime = block.timestamp;

        emit MarketResolved(marketId, outcome, block.timestamp);
    }

    /**
     * @dev Claim payout for winning positions
     * Note: This is a simplified version. In a real FHE implementation,
     * payout calculation would need to be done using FHE operations
     */
    function claimPayout(uint256 marketId) external validMarket(marketId) nonReentrant {
        Market storage market = markets[marketId];
        require(market.state == MarketState.Resolved, "Market not resolved");

        EncryptedPosition storage position = marketBets[marketId].positions[msg.sender];
        
        // Note: In a real FHE implementation, these checks would be done differently
        // For now, we'll use a simplified approach where users can claim if they have a position
        
        // Calculate payout based on final outcome using FHE operations
        // Note: In a real FHE implementation, fee calculation and payout would be done differently
        // For now, we'll use a placeholder approach
        
        // Mark as claimed
        position.hasClaimed = FHE.asEbool(true);

        // For demonstration, we'll transfer a small amount
        uint256 demoPayout = 1e16; // 0.01 ETH demo payout
        (bool success, ) = payable(msg.sender).call{value: demoPayout}("");
        require(success, "Payout transfer failed");

        emit PayoutClaimed(marketId, msg.sender, demoPayout, block.timestamp);
    }

    /**
     * @dev Get market information
     */
    function getMarket(uint256 marketId) external view validMarket(marketId) returns (
        string memory question,
        string memory description,
        uint256 endTime,
        MarketState state,
        bool outcome,
        uint256 totalPool,
        address creator
    ) {
        Market storage market = markets[marketId];
        return (
            market.question,
            market.description,
            market.endTime,
            market.state,
            market.outcome,
            market.totalPool,
            market.creator
        );
    }

    /**
     * @dev Get encrypted position for a user
     */
    function getEncryptedPosition(uint256 marketId, address user) external view validMarket(marketId) returns (
        euint64 yesAmount,
        euint64 noAmount,
        euint32 betCount,
        ebool hasPosition,
        ebool hasClaimed
    ) {
        EncryptedPosition storage position = marketBets[marketId].positions[user];
        return (
            position.yesAmount,
            position.noAmount,
            position.betCount,
            position.hasPosition,
            position.hasClaimed
        );
    }

    /**
     * @dev Get encrypted market totals
     */
    function getEncryptedMarketTotals(uint256 marketId) external view validMarket(marketId) returns (
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
     * @dev Make market totals publicly decryptable
     */
    function makeMarketTotalsPublic(uint256 marketId) external validMarket(marketId) onlyOracle(marketId) {
        MarketBetting storage marketBet = marketBets[marketId];
        FHE.makePubliclyDecryptable(marketBet.totalYesPool);
        FHE.makePubliclyDecryptable(marketBet.totalNoPool);
        FHE.makePubliclyDecryptable(marketBet.totalBetters);
    }

    /**
     * @dev Add authorized oracle
     */
    function addOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = true;
    }

    /**
     * @dev Remove authorized oracle
     */
    function removeOracle(address oracle) external onlyOwner {
        authorizedOracles[oracle] = false;
    }

    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        (bool success, ) = payable(owner()).call{value: address(this).balance}("");
        require(success, "Fee withdrawal failed");
    }

    // Emergency functions
    function emergencyPause(uint256 marketId) external onlyOwner validMarket(marketId) {
        markets[marketId].state = MarketState.Cancelled;
    }

    receive() external payable {}
}
