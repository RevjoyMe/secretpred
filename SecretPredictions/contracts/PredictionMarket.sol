// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockFHE.sol";
import "./interfaces/IPredictionMarket.sol";
import "./EncryptedBetting.sol";
import "./OracleIntegration.sol";

/**
 * @title PredictionMarket
 * @dev Main contract for Secret Predictions - Privacy-preserving prediction market
 * @notice Inspired by Polymarket & Kalshi but with full FHE privacy
 */
contract PredictionMarket is IPredictionMarket {
    using TFHE for euint64;
    using TFHE for euint32;
    using TFHE for ebool;

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
        uint256 yesPool;
        uint256 noPool;
        uint256 creationTime;
        address creator;
        uint256 fee;  // Fee in basis points (100 = 1%)
    }

    // User position structure (encrypted)
    struct Position {
        euint64 encryptedYesAmount;   // Amount bet on YES
        euint64 encryptedNoAmount;    // Amount bet on NO
        euint32 encryptedBetCount;    // Number of bets placed
        ebool hasPosition;            // Whether user has any position
    }

    // State variables
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => Position)) private userPositions;
    mapping(address => bool) public authorizedOracles;
    
    uint256 public nextMarketId = 1;
    uint256 public constant MARKET_FEE = 300; // 3% platform fee
    uint256 public constant MIN_BET = 1e16; // 0.01 ETH minimum
    uint256 public constant MAX_BET = 10e18; // 10 ETH maximum
    
    address public immutable owner;
    address public feeCollector;
    
    EncryptedBetting public immutable encryptedBetting;
    OracleIntegration public immutable oracleIntegration;

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
        bool outcome,
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
        uint256 amount
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

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

    constructor(
        address _feeCollector,
        address _encryptedBetting,
        address _oracleIntegration
    ) {
        owner = msg.sender;
        feeCollector = _feeCollector;
        encryptedBetting = EncryptedBetting(_encryptedBetting);
        oracleIntegration = OracleIntegration(_oracleIntegration);
    }

    /**
     * @dev Create a new prediction market
     * @param question The question being predicted
     * @param description Detailed description of the market
     * @param endTime When betting closes
     * @param oracle Address that will resolve the market
     */
    function createMarket(
        string calldata question,
        string calldata description,
        uint256 endTime,
        address oracle
    ) external returns (uint256 marketId) {
        require(endTime > block.timestamp + 1 hours, "End time too soon");
        require(bytes(question).length > 0, "Question required");
        require(oracle != address(0), "Oracle required");

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
            yesPool: 0,
            noPool: 0,
            creationTime: block.timestamp,
            creator: msg.sender,
            fee: MARKET_FEE
        });

        emit MarketCreated(marketId, question, endTime, msg.sender);
    }

    /**
     * @dev Place an encrypted bet on a market
     * @param marketId The market to bet on
     * @param encryptedAmount Encrypted bet amount
     * @param encryptedOutcome Encrypted outcome (true = YES, false = NO)
     * @param inputProof Proof for encrypted inputs
     */
    function placeBet(
        uint256 marketId,
        einput encryptedAmount,
        einput encryptedOutcome,
        bytes calldata inputProof
    ) external payable validMarket(marketId) marketActive(marketId) {
        require(msg.value >= MIN_BET && msg.value <= MAX_BET, "Invalid bet amount");
        
        // Convert encrypted inputs
        euint64 amount = TFHE.asEuint64(encryptedAmount, inputProof);
        ebool outcome = TFHE.asBool(encryptedOutcome, inputProof);
        
        // Verify encrypted amount matches msg.value
        ebool validAmount = TFHE.eq(amount, TFHE.asEuint64(msg.value));
        require(TFHE.decrypt(validAmount), "Amount mismatch");
        
        // Update user position through encrypted betting contract
        encryptedBetting.updatePosition(marketId, msg.sender, amount, outcome);
        
        // Update market pools
        Market storage market = markets[marketId];
        market.totalPool += msg.value;
        
        // Note: We can't update yesPool/noPool directly due to encryption
        // These will be calculated during resolution
        
        emit BetPlaced(marketId, msg.sender, false, block.timestamp); // outcome hidden
    }

    /**
     * @dev Resolve a market with the final outcome
     * @param marketId The market to resolve
     * @param outcome The final outcome (true = YES, false = NO)
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
        
        // Calculate final pool distributions
        _calculatePoolDistribution(marketId);
        
        emit MarketResolved(marketId, outcome, block.timestamp);
    }

    /**
     * @dev Claim payout for winning positions
     * @param marketId The resolved market
     */
    function claimPayout(uint256 marketId) external validMarket(marketId) {
        Market storage market = markets[marketId];
        require(market.state == MarketState.Resolved, "Market not resolved");
        
        uint256 payout = encryptedBetting.calculatePayout(
            marketId, 
            msg.sender, 
            market.outcome
        );
        
        require(payout > 0, "No payout available");
        
        // Mark as claimed to prevent double-claiming
        encryptedBetting.markClaimed(marketId, msg.sender);
        
        // Transfer payout
        (bool success, ) = payable(msg.sender).call{value: payout}("");
        require(success, "Payout transfer failed");
        
        emit PayoutClaimed(marketId, msg.sender, payout);
    }

    /**
     * @dev Get market information
     */
    function getMarket(uint256 marketId) external view validMarket(marketId) returns (Market memory) {
        return markets[marketId];
    }

    /**
     * @dev Get user's encrypted position (only callable by position owner)
     */
    function getPosition(uint256 marketId) external view validMarket(marketId) returns (Position memory) {
        return userPositions[marketId][msg.sender];
    }

    /**
     * @dev Calculate pool distribution after resolution
     */
    function _calculatePoolDistribution(uint256 marketId) private {
        Market storage market = markets[marketId];
        
        // Get actual pool sizes from encrypted betting contract
        (uint256 actualYesPool, uint256 actualNoPool) = encryptedBetting.getPoolSizes(marketId);
        
        market.yesPool = actualYesPool;
        market.noPool = actualNoPool;
        
        // Collect platform fee
        uint256 fee = (market.totalPool * market.fee) / 10000;
        (bool success, ) = payable(feeCollector).call{value: fee}("");
        require(success, "Fee transfer failed");
    }

    /**
     * @dev Admin functions
     */
    function setAuthorizedOracle(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
    }

    function setFeeCollector(address _feeCollector) external onlyOwner {
        feeCollector = _feeCollector;
    }

    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Withdrawal failed");
    }

    // Receive function for betting deposits
    receive() external payable {}
}
