const { ethers } = require('hardhat');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log("🚀 Deploying Secret Predictions contracts to Sepolia...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Get balance using provider
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy BettingVault
  console.log("\n📦 Deploying BettingVault...");
  const BettingVault = await ethers.getContractFactory("BettingVault");
  const bettingVault = await BettingVault.deploy();
  await bettingVault.waitForDeployment();
  const bettingVaultAddress = await bettingVault.getAddress();
  console.log("✅ BettingVault deployed to:", bettingVaultAddress);

  // Deploy PredictionMarket
  console.log("\n📦 Deploying PredictionMarket...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy();
  await predictionMarket.waitForDeployment();
  const predictionMarketAddress = await predictionMarket.getAddress();
  console.log("✅ PredictionMarket deployed to:", predictionMarketAddress);

  // Wait for confirmations
  console.log("\n⏳ Waiting for confirmations...");
  await bettingVault.deploymentTransaction().wait(5);
  await predictionMarket.deploymentTransaction().wait(5);

  console.log("🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("BettingVault:", bettingVaultAddress);
  console.log("PredictionMarket:", predictionMarketAddress);
  console.log("\n🔗 Sepolia Etherscan:");
  console.log("BettingVault:", `https://sepolia.etherscan.io/address/${bettingVaultAddress}`);
  console.log("PredictionMarket:", `https://sepolia.etherscan.io/address/${predictionMarketAddress}`);

  // Verify contracts on Etherscan
  console.log("\n🔍 Verifying contracts on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: bettingVaultAddress,
      constructorArguments: [],
    });
    console.log("✅ BettingVault verified on Etherscan!");
  } catch (error) {
    console.log("⚠️ BettingVault verification failed:", error.message);
  }

  try {
    await hre.run("verify:verify", {
      address: predictionMarketAddress,
      constructorArguments: [],
    });
    console.log("✅ PredictionMarket verified on Etherscan!");
  } catch (error) {
    console.log("⚠️ PredictionMarket verification failed:", error.message);
  }

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
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
  console.log("2. Test the contracts with: npm run test:e2e");
  console.log("3. Start the frontend with: npm run dev");
  console.log("4. Start a betting session with: startSession(duration)");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
