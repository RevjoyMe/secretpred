// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title PredictionMarket
 * @dev A prediction market contract for betting on outcomes
 * TEMPORARY VERSION: No FHE for testing on regular Sepolia
 */
contract PredictionMarket is ReentrancyGuard, Ownable {
    // Events
    event MarketCreated(uint256 indexed marketId, string title, uint256 endTime);
    event BetPlaced(uint256 indexed marketId, address indexed bettor, uint256 value);
    event MarketResolved(uint256 indexed marketId, bool outcome, uint256 timestamp);
    event OracleSet(uint256 indexed marketId, address indexed oracle);

    // Structs
    struct Market {
        string title;
        uint256 endTime;
        uint256 totalPool;
        MarketState state;
        bool outcome;
        uint256 resolutionTime;
        address oracle;
    }

    struct Position {
        uint256 yesAmount;
        uint256 noAmount;
        uint256 betCount;
        bool hasPosition;
        bool hasClaimed;
    }

    struct MarketBetting {
        uint256 totalYesPool;
        uint256 totalNoPool;
        uint256 totalBetters;
        mapping(address => Position) positions;
    }

    // Enums
    enum MarketState { Active, Resolved, Cancelled }

    // Constants
    uint256 public constant MIN_BET = 0.001 ether;
    uint256 public constant MAX_BET = 10 ether;

    // State variables
    uint256 public marketCount;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => MarketBetting) public marketBets;

    // Modifiers
    modifier validMarket(uint256 marketId) {
        require(marketId > 0 && marketId <= marketCount, "Invalid market ID");
        _;
    }

    modifier marketActive(uint256 marketId) {
        require(markets[marketId].state == MarketState.Active, "Market not active");
        _;
    }

    modifier onlyOracle(uint256 marketId) {
        require(markets[marketId].oracle == msg.sender || owner() == msg.sender, "Not authorized");
        _;
    }

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Create a new prediction market
     * @param title Market title
     * @param duration Duration in seconds
     * @param oracle Oracle address for resolution
     */
    function createMarket(
        string memory title,
        uint256 duration,
        address oracle
    ) external onlyOwner {
        require(bytes(title).length > 0, "Title cannot be empty");
        require(duration > 0, "Duration must be positive");
        require(oracle != address(0), "Invalid oracle address");

        marketCount++;
        uint256 endTime = block.timestamp + duration;

        markets[marketCount] = Market({
            title: title,
            endTime: endTime,
            totalPool: 0,
            state: MarketState.Active,
            outcome: false,
            resolutionTime: 0,
            oracle: oracle
        });

        emit MarketCreated(marketCount, title, endTime);
        emit OracleSet(marketCount, oracle);
    }

    /**
     * @dev Place a bet on a market (TEMPORARY: No FHE)
     * @param marketId The market to bet on
     * @param outcome Bet outcome (true = YES, false = NO)
     */
    function placeBet(
        uint256 marketId,
        bool outcome
    ) external payable validMarket(marketId) marketActive(marketId) nonReentrant {
        require(msg.value >= MIN_BET && msg.value <= MAX_BET, "Invalid bet amount");
        require(msg.value > 0, "Must send ETH to bet");

        // Update user position
        _updatePosition(marketId, msg.sender, msg.value, outcome);

        // Update market pool
        markets[marketId].totalPool += msg.value;

        emit BetPlaced(marketId, msg.sender, msg.value);
    }

    /**
     * @dev Update user's position
     */
    function _updatePosition(
        uint256 marketId,
        address user,
        uint256 amount,
        bool outcome
    ) internal {
        MarketBetting storage marketBet = marketBets[marketId];
        Position storage position = marketBet.positions[user];

        // Check if this is user's first bet
        bool isNewBetter = !position.hasPosition;

        // Update bet count
        position.betCount++;

        // Update position amounts based on outcome
        if (outcome) {
            position.yesAmount += amount;
            marketBet.totalYesPool += amount;
        } else {
            position.noAmount += amount;
            marketBet.totalNoPool += amount;
        }
        
        position.hasPosition = true;

        // Update total betters if this is a new better
        if (isNewBetter) {
            marketBet.totalBetters++;
        }
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
     */
    function claimPayout(uint256 marketId) external validMarket(marketId) nonReentrant {
        Market storage market = markets[marketId];
        require(market.state == MarketState.Resolved, "Market not resolved");

        Position storage position = marketBets[marketId].positions[msg.sender];
        require(position.hasPosition, "No position to claim");
        require(!position.hasClaimed, "Already claimed");

        uint256 payout = 0;
        
        if (market.outcome) {
            // YES won
            if (position.yesAmount > 0) {
                payout = _calculatePayout(marketId, position.yesAmount, true);
            }
        } else {
            // NO won
            if (position.noAmount > 0) {
                payout = _calculatePayout(marketId, position.noAmount, false);
            }
        }

        require(payout > 0, "No payout available");

        // Mark as claimed
        position.hasClaimed = true;

        // Transfer payout
        (bool success, ) = msg.sender.call{value: payout}("");
        require(success, "Transfer failed");
    }

    /**
     * @dev Calculate payout for a winning position
     */
    function _calculatePayout(
        uint256 marketId,
        uint256 betAmount,
        bool outcome
    ) internal view returns (uint256) {
        MarketBetting storage marketBet = marketBets[marketId];
        uint256 totalPool = markets[marketId].totalPool;
        
        if (totalPool == 0) return 0;

        uint256 winningPool = outcome ? marketBet.totalYesPool : marketBet.totalNoPool;
        if (winningPool == 0) return 0;

        // Simple proportional payout (no fees for now)
        return (betAmount * totalPool) / winningPool;
    }

    /**
     * @dev Get market information
     */
    function getMarket(uint256 marketId) external view validMarket(marketId) returns (
        string memory title,
        uint256 endTime,
        uint256 totalPool,
        MarketState state,
        bool outcome,
        uint256 resolutionTime,
        address oracle
    ) {
        Market storage market = markets[marketId];
        return (
            market.title,
            market.endTime,
            market.totalPool,
            market.state,
            market.outcome,
            market.resolutionTime,
            market.oracle
        );
    }

    /**
     * @dev Get user position for a market
     */
    function getUserPosition(uint256 marketId, address user) external view validMarket(marketId) returns (
        uint256 yesAmount,
        uint256 noAmount,
        uint256 betCount,
        bool hasPosition,
        bool hasClaimed
    ) {
        Position storage position = marketBets[marketId].positions[user];
        return (
            position.yesAmount,
            position.noAmount,
            position.betCount,
            position.hasPosition,
            position.hasClaimed
        );
    }

    /**
     * @dev Get market betting statistics
     */
    function getMarketStats(uint256 marketId) external view validMarket(marketId) returns (
        uint256 totalYesPool,
        uint256 totalNoPool,
        uint256 totalBetters
    ) {
        MarketBetting storage marketBet = marketBets[marketId];
        return (
            marketBet.totalYesPool,
            marketBet.totalNoPool,
            marketBet.totalBetters
        );
    }

    // Emergency functions
    function emergencyWithdraw() external onlyOwner {
        (bool success, ) = owner().call{value: address(this).balance}("");
        require(success, "Transfer failed");
    }

    receive() external payable {}
}
