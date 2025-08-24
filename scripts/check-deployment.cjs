const { ethers } = require('hardhat');
require('dotenv').config();

async function main() {
  console.log("🔍 Checking deployment status...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deployer account:", deployer.address);
  
  // Check balance
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.utils.formatEther(balance), "ETH");

  // Get transaction count (nonce)
  const nonce = await ethers.provider.getTransactionCount(deployer.address);
  console.log("🔢 Transaction count (nonce):", nonce);

  // Get recent transactions
  console.log("\n📋 Recent transactions:");
  try {
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log("Current block:", blockNumber);
    
    // Check last 10 blocks for transactions from this address
    for (let i = 0; i < 10; i++) {
      const block = await ethers.provider.getBlock(blockNumber - i);
      if (block && block.transactions) {
        for (const txHash of block.transactions) {
          const tx = await ethers.provider.getTransaction(txHash);
          if (tx && tx.from.toLowerCase() === deployer.address.toLowerCase()) {
            console.log(`Block ${block.number}: ${txHash}`);
            console.log(`  To: ${tx.to || 'Contract Creation'}`);
            console.log(`  Value: ${ethers.utils.formatEther(tx.value)} ETH`);
            console.log(`  Gas: ${tx.gasLimit.toString()}`);
            
            // Check if it's a contract creation
            if (!tx.to) {
              const receipt = await ethers.provider.getTransactionReceipt(txHash);
              if (receipt && receipt.contractAddress) {
                console.log(`  Contract created: ${receipt.contractAddress}`);
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.log("Error getting transactions:", error.message);
  }

  // Check if we have any deployment artifacts
  console.log("\n📦 Checking for deployment artifacts...");
  try {
    const fs = require('fs');
    const path = require('path');
    
    // Check if artifacts exist
    const artifactsDir = path.join(__dirname, '../artifacts/contracts');
    if (fs.existsSync(artifactsDir)) {
      console.log("✅ Contract artifacts found");
      
      // List contract artifacts
      const contracts = fs.readdirSync(artifactsDir);
      console.log("Available contracts:", contracts);
    } else {
      console.log("❌ No artifacts found");
    }
  } catch (error) {
    console.log("Error checking artifacts:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Check failed:", error);
    process.exit(1);
  });
