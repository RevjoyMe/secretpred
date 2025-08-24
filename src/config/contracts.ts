export const CONTRACTS = {
  BETTING_VAULT: "0xA604F88bCbbf8648C22d10143FDc1aA543e3bd61",
  PREDICTION_MARKET: "0x59f8ec1970835BEF65b1aad19dD98902b7eCe47D",
} as const

export const SEPOLIA_CHAIN_ID = 11155111

export const PREDICTION_MARKET_ABI = [
  {
    inputs: [
      { name: "question", type: "string" },
      { name: "endTime", type: "uint256" },
    ],
    name: "createMarket",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "marketId", type: "uint256" },
      { name: "outcome", type: "bool" },
    ],
    name: "placeBet",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "getMarkets",
    outputs: [
      {
        components: [
          { name: "id", type: "uint256" },
          { name: "question", type: "string" },
          { name: "endTime", type: "uint256" },
          { name: "totalYesBets", type: "uint256" },
          { name: "totalNoBets", type: "uint256" },
          { name: "resolved", type: "bool" },
        ],
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "marketId", type: "uint256" }],
    name: "claimPayout",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
