# 🔐 Secret Predictions - Zama FHEVM Integration

Complete E2E flow for private betting using official Zama FHEVM libraries.

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Environment setup
```bash
# Copy env.example to .env.local
cp env.example .env.local

# Fill in environment variables:
# - SEPOLIA_RPC_URL (Alchemy/Infura)
# - SEPOLIA_PRIVATE_KEY (your private key)
# - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID
# - ETHERSCAN_API_KEY (for contract verification)
```

### 3. Compile contracts
```bash
npm run compile
```

### 4. Deploy to Sepolia
```bash
npm run deploy:sepolia
```

### 5. Update contract addresses
After deployment, update `NEXT_PUBLIC_BETTING_VAULT_ADDRESS` and `NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS` in `.env.local`

### 6. Start frontend
```bash
npm run dev
```

### 7. Test E2E
```bash
npm run test:e2e
```

## 📁 Project Structure

```
secret-predictions/
├── contracts/
│   ├── BettingVault.sol          # Simple FHE betting vault
│   └── PredictionMarket.sol      # Advanced prediction market
├── scripts/
│   ├── deploy.ts                 # Deployment script
│   └── test-e2e.ts              # E2E test
├── src/
│   ├── lib/
│   │   └── fhe-utils.ts         # FHE utilities
│   └── hooks/
│       └── useSecretPredictions.ts # React hook
├── hardhat.config.ts            # Hardhat configuration
├── package.json                 # Dependencies
└── env.example                  # Environment variables example
```

## 🔒 FHE Architecture

### BettingVault Contract (Simple)

```solidity
// Correct Zama imports
import { FHE, euint64, externalEuint64, ebool } from "@fhevm/solidity/lib/FHE.sol";

contract BettingVault is Ownable, ReentrancyGuard {
    euint64 private totalPot;                    // Encrypted total pool
    mapping(address => euint64) private bets;    // Encrypted user bets
    ebool private resultComputed;                // Encrypted computation flag
    
    // Place encrypted bet
    function placeBet(externalEuint64 encAmount) external nonReentrant {
        euint64 amount = FHE.asEuint64(encAmount);
        totalPot = FHE.add(totalPot, amount);
        bets[msg.sender] = FHE.add(bets[msg.sender], amount);
        
        // Permissions for future computations
        FHE.allowThis(totalPot);
        FHE.allowThis(bets[msg.sender]);
    }
    
    // Public reveal of pool
    function makePotPublic() external onlyOwner {
        FHE.makePubliclyDecryptable(totalPot);
    }
}
```

### PredictionMarket Contract (Advanced)

```solidity
// Correct Zama imports
import { FHE, euint64, euint32, ebool, externalEuint64, externalEbool } from '@fhevm/solidity/lib/FHE.sol';

contract PredictionMarket is Ownable, ReentrancyGuard {
    // Encrypted position data
    struct EncryptedPosition {
        euint64 yesAmount;      // Encrypted YES bet amount
        euint64 noAmount;       // Encrypted NO bet amount
        euint32 betCount;       // Encrypted bet count
        ebool hasPosition;      // Encrypted position flag
        ebool hasClaimed;       // Encrypted claim flag
    }
    
    // Place encrypted prediction bet
    function placeBet(
        uint256 marketId,
        externalEuint64 encryptedAmount,
        externalEbool encryptedOutcome
    ) external payable {
        euint64 amount = FHE.asEuint64(encryptedAmount);
        ebool outcome = FHE.asEbool(encryptedOutcome);
        
        // Update encrypted position
        _updatePosition(marketId, msg.sender, amount, outcome);
    }
}
```

### Frontend (fhe-utils.ts)

```typescript
import { createInstance, SepoliaConfig } from "@zama-fhe/relayer-sdk";

// Initialize FHE
export async function initFHE() {
    const instance = await createInstance(SepoliaConfig);
    const publicKey = instance.getPublicKey();
    return { instance, publicKey };
}

// Encrypt bet amount
export async function encryptBet(amount: bigint | number): Promise<string> {
    const { instance, publicKey } = await initFHE();
    return await instance.createEncryptedInput(publicKey, amount, "euint64");
}

// Encrypt outcome
export async function encryptOutcome(outcome: boolean): Promise<string> {
    const { instance, publicKey } = await initFHE();
    return await instance.createEncryptedInput(publicKey, outcome ? 1 : 0, "ebool");
}

// Public decryption
export async function publicDecryptPot(ciphertextHandle: string): Promise<number> {
    const { instance } = await initFHE();
    return await instance.publicDecrypt(ciphertextHandle);
}
```

### React Hook (useSecretPredictions.ts)

```typescript
export function useSecretPredictions(contractAddress: string) {
    // FHE state
    const [isFHEReady, setIsFHEReady] = useState(false);
    
    // Actions
    const placeBet = useCallback(async (amount: bigint | number) => {
        const encryptedBet = await encryptBet(amount);
        await submitBet(encryptedBet, contractAddress);
    }, [contractAddress]);
    
    const revealPot = useCallback(async () => {
        await publicReveal(contractAddress);
    }, [contractAddress]);
    
    return { placeBet, revealPot, isFHEReady };
}
```

## 🔄 E2E Flow

### 1. Get FHE Public Key
```typescript
const { publicKey } = await initFHE();
// Get key from Sepolia Gateway
```

### 2. Encrypt bet
```typescript
const encryptedBet = await encryptBet(100); // 100 wei
// Bet encrypted in browser
```

### 3. Submit to contract
```typescript
await contract.placeBet(encryptedBet);
// Encrypted value sent to smart contract
```

### 4. Verify privacy
```typescript
const encryptedData = await contract.getEncryptedBet(userAddress);
// Data remains encrypted, plaintext not accessible
```

### 5. Public reveal
```typescript
await contract.makePotPublic(); // Contract
const plaintext = await publicDecryptPot(encryptedData); // Frontend
// Data now publicly accessible
```

## ✅ Compliance Check

| Rule | Status | Description |
|------|--------|-------------|
| Correct imports | ✅ | `@fhevm/solidity/lib/FHE.sol` |
| FHE not in view/pure | ✅ | All operations in state-changing functions |
| FHE arithmetic | ✅ | `FHE.add`, `FHE.gt`, etc. |
| euint256 no arithmetic | ✅ | euint256 not used |
| Correct permissions | ✅ | `FHE.allowThis`, `FHE.makePubliclyDecryptable` |
| Official SDK | ✅ | `@zama-fhe/relayer-sdk` |
| Public reveal | ✅ | `makePubliclyDecryptable` + `publicDecrypt` |
| Private access | ✅ | `userDecrypt` with EIP-712 |

## 🧪 Testing

### Local testing
```bash
npm run test
```

### E2E test on Sepolia
```bash
npm run test:e2e
```

### Expected E2E test output
```
🧪 Starting E2E test for Secret Predictions...
🔑 Step 1: Getting public key from Sepolia Gateway...
✅ Public Key obtained: 0x...
🔒 Step 2: Encrypting 3 bets...
✅ Bet 1 encrypted: 0x...
✅ Bet 2 encrypted: 0x...
✅ Bet 3 encrypted: 0x...
📤 Step 3: Submitting bets to contract...
✅ Bet 1 submitted successfully!
✅ Bet 2 submitted successfully!
✅ Bet 3 submitted successfully!
🔍 Step 4: Checking that direct reading doesn't reveal plaintext...
✅ Confirmed: Direct reading shows encrypted data, not plaintext
🔓 Step 5: Making pot publicly decryptable...
✅ Pot made publicly decryptable!
🔓 Step 6: Getting plaintext through publicDecrypt...
✅ Total pot decrypted: 850 wei
✅ SUCCESS: Decrypted total matches expected sum!
```

## 🔧 Commands

```bash
# Development
npm run dev              # Start frontend
npm run build            # Build project
npm run lint             # Code linting

# Contracts
npm run compile          # Compile contracts
npm run deploy:sepolia   # Deploy to Sepolia
npm run test             # Contract tests

# E2E testing
npm run test:e2e         # Full E2E test
```

## 🚨 Important Limitations

1. **FHE operations only in state-changing functions**
   - Cannot use FHE in `view`/`pure` functions
   - View functions can only return handles

2. **Correct arithmetic**
   - Always use `FHE.add()`, `FHE.sub()`, `FHE.mul()`
   - Never use `+`, `-`, `*` directly with `euintX`

3. **euint256 limitations**
   - `euint256` only for comparisons and bitwise operations
   - Arithmetic with `euint256` not supported

4. **FHE permissions**
   - Use `FHE.allowThis()` for contract access to its own data
   - Use `FHE.makePubliclyDecryptable()` for public reveal

## 🔗 Useful Links

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Relayer SDK Guide](https://github.com/zama-ai/fhevm-react-template)
- [FHE Types Reference](https://docs.zama.ai/fhevm/developers/solidity/types)
- [Sepolia Testnet](https://sepolia.etherscan.io/)

## 🎯 Conclusion

Secret Predictions project fully complies with Zama FHEVM requirements:

✅ **Uses only official libraries**  
✅ **Correctly applies FHE types and operations**  
✅ **Complies with view/pure function limitations**  
✅ **Implements correct permission model**  
✅ **Ensures complete data privacy**  

**Ready for production use on Sepolia testnet!** 🚀

## 📚 Additional Documentation

- [Deployment Guide](DEPLOYMENT_GUIDE.md) - Detailed deployment instructions
- [Compliance Check](COMPLIANCE_CHECK.md) - FHE compliance verification
- [FHE Setup](FHE_SETUP.md) - FHE configuration details
