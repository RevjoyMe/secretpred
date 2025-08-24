# 🚀 Пошаговая инструкция для деплоя Secret Predictions на Vercel

## 📋 **Что нужно сделать:**

### 1. **Подготовка файлов**
- Скопируй **ВСЕ файлы** из папки `frontend/` 
- Загрузи их в Vercel как новый проект

### 2. **Настройка проекта в Vercel**
```
Framework Preset: Next.js
Root Directory: ./ (корень загруженных файлов)
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3. **Добавление переменных окружения**
В настройках Vercel → Environment Variables добавь:

#### **Обязательные переменные:**
```env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=твой_project_id_от_walletconnect
```

#### **Уже настроенные (добавь для ясности):**
```env
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_PREDICTION_MARKET_ADDRESS=0xF4B4B18645c810195ef7a9bF768A0242A8325D7c
NEXT_PUBLIC_ENCRYPTED_BETTING_ADDRESS=0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918
NEXT_PUBLIC_ORACLE_INTEGRATION_ADDRESS=0xc5cb86FfDae958B566E0587B513DC67003fefDa0
NEXT_PUBLIC_APP_NAME=Secret Predictions
NEXT_PUBLIC_APP_DESCRIPTION=Privacy-preserving prediction markets with Zama FHE
NEXT_PUBLIC_APP_URL=https://secret-predictions.vercel.app
```

### 4. **Получение WalletConnect Project ID**
1. Перейди на https://cloud.walletconnect.com/
2. Зарегистрируйся (бесплатно)
3. Создай новый проект:
   - Name: `Secret Predictions`
   - Description: `Privacy-preserving prediction markets`
   - URL: `https://secret-predictions.vercel.app`
4. Скопируй Project ID и добавь в переменные окружения

### 5. **Домен и настройки**
- **Domain**: `secret-predictions.vercel.app` (или кастомный)
- **Auto Deploy**: Включить
- **Branch**: main/master

## 🎯 **Что получится:**

### **Главная страница:**
- Hero секция с описанием проекта
- Статистика (общий объем, активные рынки, пользователи)
- Сетка предсказательных рынков
- Кнопка подключения кошелька

### **Функциональность:**
- ✅ Подключение MetaMask/WalletConnect
- ✅ Просмотр рынков предсказаний
- ✅ Размещение зашифрованных ставок
- ✅ Отслеживание позиций
- ✅ FHE encryption для конфиденциальности

### **Дизайн:**
- ✅ Стиль Polymarket/Kalshi
- ✅ Современный UI с анимациями
- ✅ Адаптивный дизайн
- ✅ Dark/Light темы

## 🔗 **Полезные ссылки:**

### **Контракты на Sepolia:**
- **PredictionMarket**: https://sepolia.etherscan.io/address/0xF4B4B18645c810195ef7a9bF768A0242A8325D7c
- **EncryptedBetting**: https://sepolia.etherscan.io/address/0xB9C509d0aA9ca8B083E73531Ab06Fb81B26DC918
- **OracleIntegration**: https://sepolia.etherscan.io/address/0xc5cb86FfDae958B566E0587B513DC67003fefDa0

### **Для тестирования:**
- **Sepolia Faucet**: https://sepoliafaucet.com/
- **Sepolia Etherscan**: https://sepolia.etherscan.io

## ⚠️ **Важные моменты:**

1. **WalletConnect Project ID** - обязателен для работы с мобильными кошельками
2. **Sepolia ETH** - нужен для тестирования (получи из фаусета)
3. **MetaMask** - должен быть настроен на Sepolia network
4. **FHE encryption** - работает только в современных браузерах

## 🚀 **После деплоя:**

1. **Проверь подключение кошелька**
2. **Переключись на Sepolia в MetaMask**
3. **Попробуй просмотреть рынки**
4. **Создай тестовую ставку**
5. **Проверь транзакции в Etherscan**

**🎯 Secret Predictions готов к запуску!**
