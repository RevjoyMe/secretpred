# 🔐 FHE Setup Guide for Secret Predictions

## 🚀 **Zama FHEVM Integration**

Этот проект использует официальные библиотеки Zama для полной приватности ставок.

## 📦 **Установленные зависимости**

### ✅ **Официальные Zama пакеты:**
```json
{
  "@zama-fhe/relayer-sdk": "^0.1.2",
  "@fhevm/solidity": "^0.1.0"
}
```

### ❌ **Удаленные устаревшие пакеты:**
- `@fhenixprotocol/contracts`
- `@fhevm-js/relayer`
- `MockFHE.sol`

## 🔧 **Настройка окружения**

### 1. **Переменные окружения**
Создайте файл `.env.local`:
```bash
# Zama FHE Configuration
NEXT_PUBLIC_FHE_PUBLIC_KEY=your_fhe_public_key_here

# Wallet Connect
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_wallet_connect_project_id

# RPC URLs
NEXT_PUBLIC_SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your_alchemy_key

# App Configuration
NEXT_PUBLIC_APP_NAME=Secret Predictions
```

### 2. **Получение FHE Public Key**
```bash
# Для тестирования используйте:
NEXT_PUBLIC_FHE_PUBLIC_KEY=0x0000000000000000000000000000000000000000000000000000000000000000

# Для продакшена получите реальный ключ от Zama
```

## 🏗️ **Архитектура FHE**

### **Смарт-контракт (PredictionMarket.sol)**
```solidity
// ✅ Правильные импорты Zama
import { FHE, euint64, euint32, ebool, externalEuint64, externalEbool } from '@fhevm/solidity/lib/FHE.sol';

// ✅ Правильные типы данных
struct EncryptedPosition {
    euint64 yesAmount;      // 64-bit encrypted amount
    euint64 noAmount;       // 64-bit encrypted amount  
    euint32 betCount;       // 32-bit encrypted counter
    ebool hasPosition;      // Encrypted boolean flag
    ebool hasClaimed;       // Encrypted boolean flag
}
```

### **Фронтенд (usePredictionMarket.ts)**
```typescript
// ✅ Официальный Zama SDK
import { createInstance, createEncryptedInput, userDecrypt, publicDecrypt } from '@zama-fhe/relayer-sdk'

// ✅ Инициализация FHE
const instance = await createInstance({
  chainId: 11155111, // Sepolia
  publicKey: process.env.NEXT_PUBLIC_FHE_PUBLIC_KEY
})

// ✅ Создание зашифрованных данных
const encryptedAmount = await createEncryptedInput(instance, amount.toString(), 64)
const encryptedOutcome = await createEncryptedInput(instance, outcome.toString(), 1)
```

## 🔒 **Принципы приватности**

### **1. Полная анонимность ставок**
- ✅ Суммы ставок зашифрованы (`euint64`)
- ✅ Исходы ставок зашифрованы (`ebool`)
- ✅ Количество ставок зашифровано (`euint32`)

### **2. Защита от фронт-раннинга**
- ✅ Невозможно увидеть позиции до разрешения рынка
- ✅ Защита от манипуляций китами

### **3. Приватные выплаты**
- ✅ Расчеты выплат происходят в зашифрованном пространстве
- ✅ Анонимные требования выплат

## 🚨 **Важные ограничения**

### **1. Типы данных**
```solidity
// ❌ НЕ используйте euint256 для арифметики
// ✅ Используйте euint64/euint32 для арифметики
// ✅ Используйте euint256 только для сравнений и битовых операций
```

### **2. Функции**
```solidity
// ❌ FHE операции НЕЛЬЗЯ вызывать в view/pure функциях
// ✅ FHE операции только в state-changing функциях
```

### **3. Декрипция**
```solidity
// ❌ Нельзя декриптировать в смарт-контракте
// ✅ Декрипция только через gateway/relayer
```

## 🧪 **Тестирование**

### **1. Локальное тестирование**
```bash
npm run dev
# Проверьте консоль на наличие FHE инициализации
```

### **2. Проверка FHE статуса**
```typescript
// В компонентах проверяйте fheReady
const { fheReady } = usePlaceBet(...)

if (!fheReady) {
  return <div>Initializing FHE encryption...</div>
}
```

## 🔄 **Миграция с MockFHE**

### **Было (MockFHE):**
```solidity
import "./MockFHE.sol";
type euint64 is uint256;
```

### **Стало (Zama FHE):**
```solidity
import { FHE, euint64 } from '@fhevm/solidity/lib/FHE.sol';
// euint64 уже определен в библиотеке
```

## 📚 **Документация**

- [Zama FHEVM Documentation](https://docs.zama.ai/fhevm)
- [Relayer SDK Guide](https://github.com/zama-ai/fhevm-react-template)
- [FHE Types Reference](https://docs.zama.ai/fhevm/developers/solidity/types)

## 🆘 **Устранение неполадок**

### **Ошибка: "FHE not initialized"**
```bash
# Проверьте переменные окружения
echo $NEXT_PUBLIC_FHE_PUBLIC_KEY

# Проверьте подключение к сети
# Должна быть Sepolia testnet
```

### **Ошибка: "Invalid FHE public key"**
```bash
# Убедитесь, что ключ не нулевой
# Для тестирования используйте placeholder ключ
```

### **Ошибка: "Relayer operation failed"**
```bash
# Проверьте подключение к интернету
# Проверьте URL релейера в конфигурации
```

## 🎯 **Следующие шаги**

1. ✅ Получить реальный FHE public key от Zama
2. ✅ Развернуть контракты на Sepolia testnet
3. ✅ Настроить релейер для продакшена
4. ✅ Протестировать полный цикл ставок
5. ✅ Аудит безопасности FHE операций
