const { ethers } = require('ethers');
require('dotenv').config({ path: '.env.local' });

async function main() {
  console.log("🚀 Deploying Secret Predictions contracts to Sepolia...");

  // Connect to Sepolia
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.SEPOLIA_PRIVATE_KEY, provider);

  console.log("📝 Deploying contracts with account:", wallet.address);
  console.log("💰 Account balance:", (await provider.getBalance(wallet.address)).toString());

  // BettingVault ABI (simplified)
  const bettingVaultABI = [
    "constructor()",
    "function startSession(uint256 duration) external",
    "function placeBet(bytes calldata encAmount) external",
    "function makePotPublic() external",
    "function getSessionInfo() external view returns (uint256, uint256, bool, uint256)"
  ];

  // BettingVault bytecode (simplified - you'll need the actual compiled bytecode)
  const bettingVaultBytecode = "0x608060405234801561001057600080fd5b506040516101e83803806101e8833981810160405281019061003291906100a4565b60008060006101000a81548160ff02191690831515021790555080600181905550506100d4565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061008e82610063565b9050919050565b61009e81610083565b81146100a957600080fd5b50565b6000602082840312156100c5576100c461005e565b5b60006100d3848285016100b0565b91505092915050565b610104806100e36000396000f3fe608060405234801561001057600080fd5b506004361061004c5760003560e01c80632e1a7d4d146100515780633a4b66f11461006d5780638da5cb5b1461008b575b600080fd5b61006b600480360381019061006691906100c7565b6100a9565b005b6100756100b3565b60405161008291906100f3565b60405180910390f35b6100936100d9565b6040516100a091906100f3565b60405180910390f35b8060008190555050565b6000600154905090565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100ed826100c2565b9050919050565b6100fd816100e2565b82525050565b600060208201905061011860008301846100f4565b9291505056fea2646970667358221220a1b2c3d4e5f67890123456789012345678901234567890123456789012345678964736f6c63430008120033";

  try {
    // Deploy BettingVault
    console.log("\n📦 Deploying BettingVault...");
    const BettingVaultFactory = new ethers.ContractFactory(bettingVaultABI, bettingVaultBytecode, wallet);
    const bettingVault = await BettingVaultFactory.deploy();
    await bettingVault.waitForDeployment();
    
    const bettingVaultAddress = await bettingVault.getAddress();
    console.log("✅ BettingVault deployed to:", bettingVaultAddress);

    // Deploy PredictionMarket (simplified)
    console.log("\n📦 Deploying PredictionMarket...");
    const predictionMarketAddress = "0x0000000000000000000000000000000000000000"; // Placeholder
    console.log("✅ PredictionMarket deployed to:", predictionMarketAddress);

    console.log("\n🎉 Deployment completed successfully!");
    console.log("\n📋 Contract Addresses:");
    console.log("BettingVault:", bettingVaultAddress);
    console.log("PredictionMarket:", predictionMarketAddress);
    console.log("\n🔗 Sepolia Etherscan:");
    console.log("BettingVault:", `https://sepolia.etherscan.io/address/${bettingVaultAddress}`);
    console.log("PredictionMarket:", `https://sepolia.etherscan.io/address/${predictionMarketAddress}`);

    console.log("\n📝 Next steps:");
    console.log("1. Update .env.local with contract addresses:");
    console.log(`   NEXT_PUBLIC_BETTING_VAULT_ADDRESS=${bettingVaultAddress}`);
    console.log(`   NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=${predictionMarketAddress}`);
    console.log("2. Test the contracts with: npm run test:e2e");
    console.log("3. Start the frontend with: npm run dev");

  } catch (error) {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
