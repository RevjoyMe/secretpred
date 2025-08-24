import pkg from 'hardhat';
const { ethers, hre } = pkg;

async function main() {
  console.log("🚀 Deploying Secret Predictions contracts to Sepolia...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  console.log("💰 Account balance:", (await deployer.getBalance()).toString());

  // Deploy BettingVault
  console.log("\n📦 Deploying BettingVault...");
  const BettingVault = await ethers.getContractFactory("BettingVault");
  const bettingVault = await BettingVault.deploy();
  await bettingVault.deployed();
  console.log("✅ BettingVault deployed to:", bettingVault.address);

  // Deploy PredictionMarket
  console.log("\n📦 Deploying PredictionMarket...");
  const PredictionMarket = await ethers.getContractFactory("PredictionMarket");
  const predictionMarket = await PredictionMarket.deploy();
  await predictionMarket.deployed();
  console.log("✅ PredictionMarket deployed to:", predictionMarket.address);

  // Wait for confirmations
  console.log("\n⏳ Waiting for confirmations...");
  await bettingVault.deployTransaction.wait(5);
  await predictionMarket.deployTransaction.wait(5);

  console.log("🎉 Deployment completed successfully!");
  console.log("\n📋 Contract Addresses:");
  console.log("BettingVault:", bettingVault.address);
  console.log("PredictionMarket:", predictionMarket.address);
  console.log("\n🔗 Sepolia Etherscan:");
  console.log("BettingVault:", `https://sepolia.etherscan.io/address/${bettingVault.address}`);
  console.log("PredictionMarket:", `https://sepolia.etherscan.io/address/${predictionMarket.address}`);

  // Verify contracts on Etherscan
  console.log("\n🔍 Verifying contracts on Etherscan...");
  try {
    await hre.run("verify:verify", {
      address: bettingVault.address,
      constructorArguments: [],
    });
    console.log("✅ BettingVault verified on Etherscan!");
  } catch (error) {
    console.log("⚠️ BettingVault verification failed:", error);
  }

  try {
    await hre.run("verify:verify", {
      address: predictionMarket.address,
      constructorArguments: [],
    });
    console.log("✅ PredictionMarket verified on Etherscan!");
  } catch (error) {
    console.log("⚠️ PredictionMarket verification failed:", error);
  }

  // Save deployment info
  const deploymentInfo = {
    network: "sepolia",
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      bettingVault: {
        name: "BettingVault",
        address: bettingVault.address,
        blockNumber: await bettingVault.deployTransaction.blockNumber,
      },
      predictionMarket: {
        name: "PredictionMarket",
        address: predictionMarket.address,
        blockNumber: await predictionMarket.deployTransaction.blockNumber,
      },
    },
  };

  console.log("\n📄 Deployment info:", JSON.stringify(deploymentInfo, null, 2));

  // Instructions for next steps
  console.log("\n📝 Next steps:");
  console.log("1. Update .env.local with contract addresses:");
  console.log(`   NEXT_PUBLIC_BETTING_VAULT_ADDRESS=${bettingVault.address}`);
  console.log(`   NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=${predictionMarket.address}`);
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
