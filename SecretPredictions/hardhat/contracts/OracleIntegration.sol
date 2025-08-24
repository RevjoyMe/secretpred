// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./MockFHE.sol";

/**
 * @title OracleIntegration
 * @dev Handles oracle data feeds and market resolution for Secret Predictions
 * @notice Integrates with Chainlink and other oracle providers
 */
contract OracleIntegration {
    using TFHE for euint64;
    using TFHE for ebool;

    // Oracle types
    enum OracleType {
        Manual,      // Manual resolution by trusted oracle
        Chainlink,   // Chainlink price feeds
        API,         // External API data
        Consensus    // Multiple oracle consensus
    }

    // Oracle data structure
    struct OracleData {
        OracleType oracleType;
        address dataFeed;        // Chainlink feed address or API endpoint
        string apiEndpoint;      // API URL for external data
        uint256 threshold;       // Threshold value for binary outcomes
        bool isActive;
        uint256 lastUpdate;
        address[] consensusOracles; // For consensus type
    }

    // Resolution data
    struct ResolutionData {
        uint256 marketId;
        bool outcome;
        uint256 timestamp;
        string evidence;         // IPFS hash or proof
        address resolver;
        bool isDisputed;
        uint256 disputeDeadline;
    }

    // State variables
    mapping(uint256 => OracleData) public marketOracles;
    mapping(uint256 => ResolutionData) public resolutions;
    mapping(address => bool) public authorizedOracles;
    mapping(uint256 => mapping(address => bool)) public disputeVotes;
    mapping(uint256 => uint256) public disputeVoteCount;
    
    address public immutable owner;
    address public predictionMarket;
    uint256 public constant DISPUTE_PERIOD = 24 hours;
    uint256 public constant MIN_DISPUTE_STAKE = 0.1 ether;

    // Events
    event OracleConfigured(
        uint256 indexed marketId,
        OracleType oracleType,
        address indexed dataFeed
    );
    
    event MarketResolved(
        uint256 indexed marketId,
        bool outcome,
        address indexed resolver,
        string evidence
    );
    
    event DisputeRaised(
        uint256 indexed marketId,
        address indexed disputer,
        uint256 stake
    );
    
    event DisputeResolved(
        uint256 indexed marketId,
        bool finalOutcome,
        uint256 disputeVotes
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyAuthorizedOracle() {
        require(authorizedOracles[msg.sender], "Not authorized oracle");
        _;
    }

    modifier onlyPredictionMarket() {
        require(msg.sender == predictionMarket, "Not prediction market");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Set the prediction market contract address
     */
    function setPredictionMarket(address _predictionMarket) external onlyOwner {
        predictionMarket = _predictionMarket;
    }

    /**
     * @dev Configure oracle for a market
     * @param marketId The market ID
     * @param oracleType Type of oracle (Manual, Chainlink, API, Consensus)
     * @param dataFeed Address of data feed (for Chainlink)
     * @param apiEndpoint API endpoint URL (for API type)
     * @param threshold Threshold value for binary outcome
     * @param consensusOracles Array of oracle addresses (for Consensus type)
     */
    function configureOracle(
        uint256 marketId,
        OracleType oracleType,
        address dataFeed,
        string calldata apiEndpoint,
        uint256 threshold,
        address[] calldata consensusOracles
    ) external onlyOwner {
        OracleData storage oracle = marketOracles[marketId];
        
        oracle.oracleType = oracleType;
        oracle.dataFeed = dataFeed;
        oracle.apiEndpoint = apiEndpoint;
        oracle.threshold = threshold;
        oracle.isActive = true;
        oracle.lastUpdate = block.timestamp;
        
        // Set consensus oracles if provided
        if (oracleType == OracleType.Consensus) {
            require(consensusOracles.length >= 3, "Need at least 3 consensus oracles");
            oracle.consensusOracles = consensusOracles;
        }

        emit OracleConfigured(marketId, oracleType, dataFeed);
    }

    /**
     * @dev Resolve market manually (for Manual oracle type)
     * @param marketId The market to resolve
     * @param outcome The resolution outcome
     * @param evidence IPFS hash or proof of resolution
     */
    function resolveMarketManual(
        uint256 marketId,
        bool outcome,
        string calldata evidence
    ) external onlyAuthorizedOracle {
        OracleData storage oracle = marketOracles[marketId];
        require(oracle.oracleType == OracleType.Manual, "Not manual oracle");
        require(oracle.isActive, "Oracle not active");

        _resolveMarket(marketId, outcome, evidence, msg.sender);
    }

    /**
     * @dev Resolve market using Chainlink price feed
     * @param marketId The market to resolve
     */
    function resolveMarketChainlink(uint256 marketId) external {
        OracleData storage oracle = marketOracles[marketId];
        require(oracle.oracleType == OracleType.Chainlink, "Not Chainlink oracle");
        require(oracle.isActive, "Oracle not active");
        require(oracle.dataFeed != address(0), "No data feed configured");

        // Get price from Chainlink feed
        (, int256 price,,,) = AggregatorV3Interface(oracle.dataFeed).latestRoundData();
        require(price > 0, "Invalid price data");

        // Determine outcome based on threshold
        bool outcome = uint256(price) >= oracle.threshold;
        
        string memory evidence = string(abi.encodePacked(
            "Chainlink price: ", 
            uint2str(uint256(price)),
            ", threshold: ",
            uint2str(oracle.threshold)
        ));

        _resolveMarket(marketId, outcome, evidence, msg.sender);
    }

    /**
     * @dev Submit consensus vote (for Consensus oracle type)
     * @param marketId The market to vote on
     * @param outcome The voted outcome
     * @param evidence Supporting evidence
     */
    function submitConsensusVote(
        uint256 marketId,
        bool outcome,
        string calldata evidence
    ) external {
        OracleData storage oracle = marketOracles[marketId];
        require(oracle.oracleType == OracleType.Consensus, "Not consensus oracle");
        require(_isConsensusOracle(marketId, msg.sender), "Not consensus oracle");

        // Store vote (simplified - in production would need more sophisticated consensus)
        disputeVotes[marketId][msg.sender] = outcome;
        disputeVoteCount[marketId]++;

        // Check if we have enough votes for consensus
        if (disputeVoteCount[marketId] >= (oracle.consensusOracles.length * 2) / 3) {
            bool consensusOutcome = _calculateConsensus(marketId);
            _resolveMarket(marketId, consensusOutcome, evidence, address(this));
        }
    }

    /**
     * @dev Raise a dispute against market resolution
     * @param marketId The disputed market
     */
    function raiseDispute(uint256 marketId) external payable {
        require(msg.value >= MIN_DISPUTE_STAKE, "Insufficient dispute stake");
        
        ResolutionData storage resolution = resolutions[marketId];
        require(resolution.timestamp > 0, "Market not resolved");
        require(!resolution.isDisputed, "Already disputed");
        require(
            block.timestamp <= resolution.timestamp + DISPUTE_PERIOD,
            "Dispute period ended"
        );

        resolution.isDisputed = true;
        resolution.disputeDeadline = block.timestamp + DISPUTE_PERIOD;

        emit DisputeRaised(marketId, msg.sender, msg.value);
    }

    /**
     * @dev Resolve dispute (admin function)
     * @param marketId The disputed market
     * @param finalOutcome The final resolution
     */
    function resolveDispute(
        uint256 marketId,
        bool finalOutcome
    ) external onlyOwner {
        ResolutionData storage resolution = resolutions[marketId];
        require(resolution.isDisputed, "No active dispute");
        require(block.timestamp >= resolution.disputeDeadline, "Dispute period not ended");

        resolution.outcome = finalOutcome;
        resolution.isDisputed = false;

        emit DisputeResolved(marketId, finalOutcome, disputeVoteCount[marketId]);
    }

    /**
     * @dev Internal function to resolve market
     */
    function _resolveMarket(
        uint256 marketId,
        bool outcome,
        string memory evidence,
        address resolver
    ) private {
        ResolutionData storage resolution = resolutions[marketId];
        require(resolution.timestamp == 0, "Already resolved");

        resolution.marketId = marketId;
        resolution.outcome = outcome;
        resolution.timestamp = block.timestamp;
        resolution.evidence = evidence;
        resolution.resolver = resolver;
        resolution.isDisputed = false;
        resolution.disputeDeadline = block.timestamp + DISPUTE_PERIOD;

        // Mark oracle as used
        marketOracles[marketId].lastUpdate = block.timestamp;

        emit MarketResolved(marketId, outcome, resolver, evidence);
    }

    /**
     * @dev Check if address is consensus oracle for market
     */
    function _isConsensusOracle(uint256 marketId, address oracle) private view returns (bool) {
        address[] memory consensusOracles = marketOracles[marketId].consensusOracles;
        for (uint i = 0; i < consensusOracles.length; i++) {
            if (consensusOracles[i] == oracle) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Calculate consensus outcome
     */
    function _calculateConsensus(uint256 marketId) private view returns (bool) {
        address[] memory consensusOracles = marketOracles[marketId].consensusOracles;
        uint256 yesVotes = 0;
        
        for (uint i = 0; i < consensusOracles.length; i++) {
            if (disputeVotes[marketId][consensusOracles[i]]) {
                yesVotes++;
            }
        }
        
        return yesVotes > consensusOracles.length / 2;
    }

    /**
     * @dev Get market resolution data
     */
    function getResolution(uint256 marketId) external view returns (ResolutionData memory) {
        return resolutions[marketId];
    }

    /**
     * @dev Get oracle configuration
     */
    function getOracleConfig(uint256 marketId) external view returns (OracleData memory) {
        return marketOracles[marketId];
    }

    /**
     * @dev Admin functions
     */
    function setAuthorizedOracle(address oracle, bool authorized) external onlyOwner {
        authorizedOracles[oracle] = authorized;
    }

    function emergencyResolve(
        uint256 marketId,
        bool outcome,
        string calldata reason
    ) external onlyOwner {
        _resolveMarket(marketId, outcome, reason, msg.sender);
    }

    /**
     * @dev Utility function to convert uint to string
     */
    function uint2str(uint256 _i) internal pure returns (string memory str) {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 length;
        while (j != 0) {
            length++;
            j /= 10;
        }
        bytes memory bstr = new bytes(length);
        uint256 k = length;
        j = _i;
        while (j != 0) {
            bstr[--k] = bytes1(uint8(48 + j % 10));
            j /= 10;
        }
        str = string(bstr);
    }
}

// Simplified Chainlink interface
interface AggregatorV3Interface {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}
