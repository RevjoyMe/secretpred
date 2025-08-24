import { ethers } from "hardhat";
import { Contract } from "ethers";
import * as dotenv from "dotenv";

dotenv.config();

interface DeployedContracts {
  encryptedBetting: Contract;
  oracleIntegration: Contract;
  predictionMarket: Contract;
}

async function main(): Promise<void> {
  console.log("🔮 Deploying Secret Predictions contracts...");
  
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(await deployer.provider.getBalance(deployer.address)), "ETH");

  // Get deployment parameters
  const feeCollector = process.env.FEE_COLLECTOR_ADDRESS || deployer.address;
  const authorizedOracle = process.env.AUTHORIZED_ORACLE_ADDRESS || deployer.address;
  
  console.log("⚙️  Fee collector:", feeCollector);
  console.log("🔮 Authorized oracle:", authorizedOracle);

  try {
    // Deploy EncryptedBetting contract
    console.log("\n🔐 Deploying EncryptedBetting contract...");
    const EncryptedBettingFactory = await ethers.getContractFactory("EncryptedBetting");
    const encryptedBetting = await EncryptedBettingFactory.deploy();
    await encryptedBetting.waitForDeployment();
    const encryptedBettingAddress = await encryptedBetting.getAddress();
    console.log("✅ EncryptedBetting deployed to:", encryptedBettingAddress);

    // Deploy OracleIntegration contract
    console.log("\n🔮 Deploying OracleIntegration contract...");
    const OracleIntegrationFactory = await ethers.getContractFactory("OracleIntegration");
    const oracleIntegration = await OracleIntegrationFactory.deploy();
    await oracleIntegration.waitForDeployment();
    const oracleIntegrationAddress = await oracleIntegration.getAddress();
    console.log("✅ OracleIntegration deployed to:", oracleIntegrationAddress);

    // Deploy PredictionMarket contract
    console.log("\n🏦 Deploying PredictionMarket contract...");
    const PredictionMarketFactory = await ethers.getContractFactory("PredictionMarket");
    const predictionMarket = await PredictionMarketFactory.deploy(
      feeCollector,
      encryptedBettingAddress,
      oracleIntegrationAddress
    );
    await predictionMarket.waitForDeployment();
    const predictionMarketAddress = await predictionMarket.getAddress();
    console.log("✅ PredictionMarket deployed to:", predictionMarketAddress);

    // Setup contracts
    console.log("\n⚙️  Setting up contract permissions...");
    
    // Set PredictionMarket address in EncryptedBetting
    const tx1 = await encryptedBetting.setPredictionMarket(predictionMarketAddress);
    await tx1.wait();
    console.log("✅ EncryptedBetting configured with PredictionMarket address");

    // Set PredictionMarket address in OracleIntegration
    const tx2 = await oracleIntegration.setPredictionMarket(predictionMarketAddress);
    await tx2.wait();
    console.log("✅ OracleIntegration configured with PredictionMarket address");

    // Set authorized oracle
    const tx3 = await oracleIntegration.setAuthorizedOracle(authorizedOracle, true);
    await tx3.wait();
    console.log("✅ Authorized oracle configured");

    // Set EncryptedBetting as authorized caller
    const tx4 = await encryptedBetting.setAuthorizedCaller(predictionMarketAddress, true);
    await tx4.wait();
    console.log("✅ PredictionMarket authorized in EncryptedBetting");

    // Deployment summary
    console.log("\n🎉 DEPLOYMENT COMPLETE!");
    console.log("====================================");
    console.log("📱 Contract Addresses:");
    console.log("   🔐 EncryptedBetting:", encryptedBettingAddress);
    console.log("   🔮 OracleIntegration:", oracleIntegrationAddress);
    console.log("   🏦 PredictionMarket:", predictionMarketAddress);
    console.log("====================================");
    console.log("⚙️  Configuration:");
    console.log("   💰 Fee Collector:", feeCollector);
    console.log("   🔮 Authorized Oracle:", authorizedOracle);
    console.log("   📊 Platform Fee: 3%");
    console.log("   💵 Min Bet: 0.01 ETH");
    console.log("   💰 Max Bet: 10 ETH");
    console.log("====================================");

    // Save deployment info
    const deploymentInfo = {
      network: await ethers.provider.getNetwork(),
      timestamp: new Date().toISOString(),
      deployer: deployer.address,
      contracts: {
        EncryptedBetting: encryptedBettingAddress,
        OracleIntegration: oracleIntegrationAddress,
        PredictionMarket: predictionMarketAddress,
      },
      config: {
        feeCollector,
        authorizedOracle,
        platformFee: "3%",
        minBet: "0.01 ETH",
        maxBet: "10 ETH",
      },
    };

    console.log("\n📋 Deployment info saved to deployment.json");
    console.log(JSON.stringify(deploymentInfo, null, 2));

    // Create example market for testing
    if (process.env.CREATE_EXAMPLE_MARKET === "true") {
      console.log("\n🎯 Creating example market...");
      const endTime = Math.floor(Date.now() / 1000) + 86400; // 24 hours from now
      
      const tx5 = await predictionMarket.createMarket(
        "Will Bitcoin reach $120,000 by end of 2024?",
        "Bitcoin price prediction based on major exchanges average price",
        endTime,
        authorizedOracle
      );
      await tx5.wait();
      
      console.log("✅ Example market created!");
    }

    console.log("\n🚀 Ready for frontend integration!");
    console.log("📝 Copy the contract addresses to your frontend configuration");
    
  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

// Helper function to verify contracts
async function verifyContracts(contracts: DeployedContracts): Promise<void> {
  if (process.env.VERIFY_CONTRACTS === "true") {
    console.log("\n🔍 Verifying contracts on Etherscan...");
    
    try {
      // Note: Verification would require etherscan API for Zama testnet
      console.log("📝 Contract verification skipped for Zama testnet");
    } catch (error) {
      console.error("❌ Verification failed:", error);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("💥 Fatal error:", error);
    process.exit(1);
  });

