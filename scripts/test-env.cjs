const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log('SEPOLIA_RPC_URL:', process.env.SEPOLIA_RPC_URL);
console.log('SEPOLIA_PRIVATE_KEY:', process.env.SEPOLIA_PRIVATE_KEY ? 'SET' : 'NOT SET');
