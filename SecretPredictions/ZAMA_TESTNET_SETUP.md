# 🔮 Zama FHEVM on Sepolia Testnet Setup Guide

## 📡 **Network Configuration**

> **Important:** Zama FHEVM runs on **Sepolia Testnet**, not a separate network!

### **Sepolia Testnet (with FHEVM support):**

1. **MetaMask already has Sepolia** → Switch to Sepolia Testnet

2. **Sepolia Network Details:**
   ```
   Network Name: Sepolia test network
   RPC URL: https://sepolia.infura.io/v3/YOUR_INFURA_KEY
   Chain ID: 11155111
   Currency Symbol: ETH
   Block Explorer: https://sepolia.etherscan.io
   ```

3. **FHEVM works automatically** on Sepolia with compatible contracts

## 💰 **Getting Test Tokens (Sepolia ETH)**

### **Method 1: Sepolia Faucets**
- **Alchemy Faucet:** https://sepoliafaucet.com/
- **Infura Faucet:** https://www.infura.io/faucet/sepolia
- **Chainlink Faucet:** https://faucets.chain.link/sepolia
- **Request:** 0.1-0.5 ETH for contract deployment

### **Method 2: Zama Community**
- Discord: https://discord.gg/zama
- Ask in #dev-support if faucets don't work
- Mention you're working on bounty project

### **Method 3: Social Faucets**
- Some faucets require Twitter verification
- Post about your Zama project development

## 🚀 **Deployment Commands**

### **1. Setup Environment**
```bash
cd Dev\ Programm/SecretPredictions/hardhat

# Create .env file with your private key and Sepolia RPC
echo "PRIVATE_KEY=your_private_key_without_0x" > .env
echo "SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY" >> .env
```

### **2. Deploy to Sepolia with FHEVM**
```bash
# Clean and compile for Sepolia network
npx hardhat clean
npx hardhat compile --network sepolia

# Deploy all contracts to Sepolia
npm run deploy

# Or use hardhat directly
npx hardhat run scripts/deploy.ts --network sepolia
```

### **3. Verify Deployment**
```bash
# Check deployment on Sepolia explorer
open https://sepolia.etherscan.io
```

## 📋 **Pre-Deployment Checklist**

- [ ] MetaMask configured with Sepolia testnet
- [ ] Wallet has 0.1+ Sepolia ETH tokens
- [ ] Private key added to .env file
- [ ] Infura API key configured
- [ ] Contracts compiled successfully
- [ ] Network configuration correct

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Insufficient funds"**
   - Need more Sepolia ETH from faucet
   - Check balance on https://sepolia.etherscan.io

2. **"Invalid nonce"**
   - Reset MetaMask account
   - Clear transaction history

3. **"Network error"**
   - Verify Infura RPC URL is correct
   - Check Sepolia network status

### **Gas Estimation:**
- Contract deployment: ~0.01-0.05 ETH per contract
- Configuration: ~0.001 ETH per transaction
- Total needed: ~0.1-0.2 ETH for full deployment

## 💡 **Tips for Success**

1. **Join Zama Community** first - easier to get help
2. **Explain your project** when requesting tokens
3. **Test with small amounts** first
4. **Keep deployment logs** for bounty submission

---

**Ready to deploy Secret Predictions on Sepolia with FHEVM! 🚀**
