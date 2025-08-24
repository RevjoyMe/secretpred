const hre = require("hardhat");
require('dotenv').config();

async function main() {
  console.log("🚀 Deploying Secret Predictions contracts to FHE Sepolia...");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");

  try {
    // Deploy BettingVault with gas limit
    console.log("\n📦 Deploying BettingVault...");
    const BettingVault = await hre.ethers.getContractFactory("BettingVault");
    const bettingVault = await BettingVault.deploy({ 
      gasLimit: 8_000_000 
    });
    console.log("⏳ Waiting for BettingVault deployment...");
    await bettingVault.waitForDeployment();
    const bettingVaultAddress = await bettingVault.getAddress();
    console.log("✅ BettingVault deployed to:", bettingVaultAddress);

    // Deploy PredictionMarket with gas limit
    console.log("\n📦 Deploying PredictionMarket...");
    const PredictionMarket = await hre.ethers.getContractFactory("PredictionMarket");
    const predictionMarket = await PredictionMarket.deploy({ 
      gasLimit: 8_000_000 
    });
    console.log("⏳ Waiting for PredictionMarket deployment...");
    await predictionMarket.waitForDeployment();
    const predictionMarketAddress = await predictionMarket.getAddress();
    console.log("✅ PredictionMarket deployed to:", predictionMarketAddress);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("BettingVault:", bettingVaultAddress);
    console.log("PredictionMarket:", predictionMarketAddress);
    console.log("\n🔗 FHE Sepolia Explorer:");
    console.log("BettingVault:", `https://sepolia.zama.ai/address/${bettingVaultAddress}`);
    console.log("PredictionMarket:", `https://sepolia.zama.ai/address/${predictionMarketAddress}`);

    // Save deployment info
    const deploymentInfo = {
      network: "fhe-sepolia",
      deployer: deployer.address,
      timestamp: new Date().toISOString(),
      contracts: {
        bettingVault: {
          name: "BettingVault",
          address: bettingVaultAddress,
        },
        predictionMarket: {
          name: "PredictionMarket",
          address: predictionMarketAddress,
        },
      },
    };

    console.log("\n📄 Deployment info:", JSON.stringify(deploymentInfo, null, 2));

    // Instructions for next steps
    console.log("\n📝 Next steps:");
    console.log("1. Update .env.local with contract addresses:");
    console.log(`   NEXT_PUBLIC_BETTING_VAULT_ADDRESS=${bettingVaultAddress}`);
    console.log(`   NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=${predictionMarketAddress}`);
    console.log("\n2. Initialize FHE state through frontend using Relayer SDK:");
    console.log("   import { createInstance, SepoliaConfig } from '@zama-fhe/relayer-sdk';");
    console.log("   const instance = await createInstance(SepoliaConfig);");
    console.log("   // Call initializeFHEState() through the frontend");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
