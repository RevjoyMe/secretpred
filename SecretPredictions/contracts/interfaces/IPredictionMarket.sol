// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "../MockFHE.sol";

/**
 * @title IPredictionMarket
 * @dev Interface for the main PredictionMarket contract
 */
interface IPredictionMarket {
    // Structs
    struct Market {
        uint256 id;
        string question;
        string description;
        uint256 endTime;
        uint256 resolutionTime;
        uint8 state; // MarketState enum as uint8
        bool outcome;
        address oracle;
        uint256 totalPool;
        uint256 yesPool;
        uint256 noPool;
        uint256 creationTime;
        address creator;
        uint256 fee;
    }

    struct Position {
        euint64 encryptedYesAmount;
        euint64 encryptedNoAmount;
        euint32 encryptedBetCount;
        ebool hasPosition;
    }

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

    // Functions
    function createMarket(
        string calldata question,
        string calldata description,
        uint256 endTime,
        address oracle
    ) external returns (uint256 marketId);

    function placeBet(
        uint256 marketId,
        einput encryptedAmount,
        einput encryptedOutcome,
        bytes calldata inputProof
    ) external payable;

    function resolveMarket(
        uint256 marketId,
        bool outcome
    ) external;

    function claimPayout(uint256 marketId) external;

    function getMarket(uint256 marketId) external view returns (Market memory);
    
    function getPosition(uint256 marketId) external view returns (Position memory);
}
