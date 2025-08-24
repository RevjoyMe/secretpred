# 🚀 Deployment Guide - Secret Predictions

## Prerequisites

1. **Node.js 22.10.0+** (required for Hardhat)
2. **Sepolia ETH** in your wallet
3. **Alchemy/Infura API key** for Sepolia RPC
4. **Etherscan API key** for contract verification

## Setup Steps

### 1. Environment Configuration

Create `.env.local` file in the project root:

```bash
# Sepolia Network Configuration
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
SEPOLIA_PRIVATE_KEY=your_private_key_here

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# App Configuration
NEXT_PUBLIC_APP_NAME=Secret Predictions

# Contract Addresses (will be filled after deployment)
NEXT_PUBLIC_BETTING_VAULT_ADDRESS=0xA604F88bCbbf8648C22d10143FDc1aA543e3bd61
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x59f8ec1970835BEF65b1aad19dD98902b7eCe47D

# FHE Configuration (will be obtained from Sepolia Gateway)
NEXT_PUBLIC_FHE_PUBLIC_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

# Etherscan API Key (for contract verification)
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Compile Contracts

```bash
npm run compile
```

### 4. Deploy to Sepolia

```bash
npm run deploy:sepolia
```

## Expected Deployment Output

```
🚀 Deploying Secret Predictions contracts to Sepolia...

📝 Deploying contracts with account: 0x...
💰 Account balance: 1000000000000000000

📦 Deploying BettingVault...
✅ BettingVault deployed to: 0x...

📦 Deploying PredictionMarket...
✅ PredictionMarket deployed to: 0x...

⏳ Waiting for confirmations...
🎉 Deployment completed successfully!

📋 Contract Addresses:
BettingVault: 0x...
PredictionMarket: 0x...

🔗 Sepolia Etherscan:
BettingVault: https://sepolia.etherscan.io/address/0x...
PredictionMarket: https://sepolia.etherscan.io/address/0x...

🔍 Verifying contracts on Etherscan...
✅ BettingVault verified on Etherscan!
✅ PredictionMarket verified on Etherscan!

📝 Next steps:
1. Update .env.local with contract addresses:
   NEXT_PUBLIC_BETTING_VAULT_ADDRESS=0x...
   NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0x59f8ec1970835BEF65b1aad19dD98902b7eCe47D
2. Test the contracts with: npm run test:e2e
3. Start the frontend with: npm run dev
4. Start a betting session with: startSession(duration)
```

## Post-Deployment Steps

### 1. Update Environment Variables

After successful deployment, update your `.env.local` with the actual contract addresses.

### 2. Test E2E Flow

```bash
npm run test:e2e
```

### 3. Start Frontend

```bash
npm run dev
```

### 4. Initialize Betting Session

Call `startSession(duration)` on the BettingVault contract to begin accepting bets.

## Contract Functions

### BettingVault

- `startSession(uint256 duration)` - Start a new betting session
- `placeBet(externalEuint64 encAmount)` - Place encrypted bet
- `endSession()` - End current session
- `makePotPublic()` - Make total pot publicly decryptable
- `computeResult()` - Compute encrypted results
- `getSessionInfo()` - Get session information

### PredictionMarket

- `createMarket(string question, string description, uint256 endTime, address oracle, uint256 fee)` - Create new market
- `placeBet(uint256 marketId, externalEuint64 encryptedAmount, externalEbool encryptedOutcome)` - Place prediction bet
- `resolveMarket(uint256 marketId, bool outcome)` - Resolve market
- `claimPayout(uint256 marketId)` - Claim winnings

## Troubleshooting

### Node.js Version Issues

If you encounter Node.js version warnings:

1. Upgrade to Node.js 22.10.0+:
   ```bash
   nvm install 22.10.0
   nvm use 22.10.0
   ```

2. Or use Docker:
   ```bash
   docker run -it --rm -v $(pwd):/app -w /app node:22.10.0 npm run deploy:sepolia
   ```

### Compilation Issues

1. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

2. Check Solidity version compatibility:
   - Contracts use Solidity 0.8.20+
   - Ensure Hardhat supports this version

### Deployment Issues

1. Verify Sepolia RPC URL is correct
2. Ensure private key has sufficient Sepolia ETH
3. Check network connectivity

## Security Notes

- Never commit `.env.local` to version control
- Use environment-specific private keys
- Verify contracts on Etherscan after deployment
- Test thoroughly on Sepolia before mainnet

## Support

For issues with:
- **Zama FHEVM**: Check [official documentation](https://docs.zama.ai/fhevm)
- **Hardhat**: Check [Hardhat docs](https://hardhat.org/docs)
- **Sepolia**: Check [Sepolia faucet](https://sepoliafaucet.com/)
