# 🚀 Vercel Deployment Guide - Secret Predictions

## ✅ **Ready for Vercel Deployment**

**Secret Predictions** полностью настроен для деплоя на Vercel с Sepolia сетью и задеплоенными контрактами.

## 📋 **Deployment Steps**

### 1. **Upload to Vercel**
- Загрузи **ВСЕ файлы** из папки `frontend/` в Vercel
- Framework Preset: **Next.js**
- Root Directory: `./` (корень загруженных файлов)
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

### 2. **Environment Variables**
В настройках Vercel добавь следующие переменные:

```env
# Wallet Connect (обязательно)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=твой_project_id_от_walletconnect

# Sepolia Network (уже настроено)
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CHAIN_ID=11155111

# Contract Addresses (наши задеплоенные контракты)
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0xF4B4B18645c810195ef7a9bF768A0242A8325D7c
NEXT_PUBLIC_ENCRYPTED_BETTING_ADDRESS=0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918
NEXT_PUBLIC_ORACLE_INTEGRATION_ADDRESS=0xc5cb86FfDae958B566E0587B513DC67003fefDa0

# App Configuration
NEXT_PUBLIC_APP_NAME=Secret Predictions
NEXT_PUBLIC_APP_DESCRIPTION=Privacy-preserving prediction markets with Zama FHE
NEXT_PUBLIC_APP_URL=https://secret-predictions.vercel.app
```

### 3. **Domain Settings**
- **Domain**: `secret-predictions.vercel.app` (или кастомный)
- **Auto Deploy**: Включить
- **Branch**: main/master

## 🔧 **Technical Configuration**

### **Next.js Config** ✅
- WASM support для FHEVM
- CORS headers для Web3
- Environment variables настроены
- Output: standalone

### **Web3 Integration** ✅
- RainbowKit + Wagmi
- Sepolia network (Chain ID: 11155111)
- WalletConnect Project ID
- Contract addresses готовы

### **Styling** ✅
- Tailwind CSS
- Framer Motion animations
- Polymarket/Kalshi inspired design
- Dark/Light theme support

## 🎯 **Features Ready**

### **Frontend Components**
- ✅ Hero section с описанием
- ✅ Market grid с карточками
- ✅ Wallet connection (RainbowKit)
- ✅ Betting modal для ставок
- ✅ Stats display
- ✅ Responsive design

### **Smart Contract Integration**
- ✅ Sepolia network подключение
- ✅ Contract addresses настроены
- ✅ FHE encryption ready
- ✅ Oracle integration

### **User Experience**
- ✅ Connect wallet кнопка
- ✅ Browse markets
- ✅ Place encrypted bets
- ✅ View positions
- ✅ Track performance

## 🔗 **Useful Links**

### **Contract Addresses (Sepolia)**
- **PredictionMarket**: [0xF4B4B18645c810195ef7a9bF768A0242A8325D7c](https://sepolia.etherscan.io/address/0xF4B4B18645c810195ef7a9bF768A0242A8325D7c)
- **EncryptedBetting**: [0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918](https://sepolia.etherscan.io/address/0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918)
- **OracleIntegration**: [0xc5cb86FfDae958B566E0587B513DC67003fefDa0](https://sepolia.etherscan.io/address/0xc5cb86FfDae958B566E0587B513DC67003fefDa0)

### **Network Info**
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Etherscan**: https://sepolia.etherscan.io
- **Zama FHEVM Docs**: https://docs.zama.ai/fhevm

## 🚀 **Post-Deployment**

После успешного деплоя:

1. **Test Wallet Connection**
   - Подключи MetaMask
   - Переключись на Sepolia network
   - Убедись что кошелек подключен

2. **Test Market Interaction**
   - Просмотри доступные рынки
   - Попробуй создать ставку
   - Проверь FHE encryption

3. **Verify Contract Integration**
   - Проверь что адреса контрактов правильные
   - Убедись что транзакции проходят
   - Проверь в Sepolia Etherscan

## ⚠️ **Important Notes**

- **WalletConnect Project ID** нужен для работы с мобильными кошельками
- **Sepolia ETH** нужен для тестирования (получи из фаусета)
- **FHE encryption** работает только в браузерах с WASM support
- **Contract addresses** уже задеплоены и готовы к использованию

**🎯 Secret Predictions готов к запуску на Vercel!**
