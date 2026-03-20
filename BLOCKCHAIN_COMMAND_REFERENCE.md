# ⚡ InsuChain Blockchain - Command Reference Card

One-page reference for all commands needed to run the blockchain system.

---

## 🚀 Initial Setup (Run Once)

### 1. Blockchain Module

```bash
# Navigate to blockchain folder
cd blockchain

# Install Hardhat and dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your values:
# - PRIVATE_KEY: Your MetaMask private key
# - RPC_URL: Your Alchemy RPC URL
nano .env    # or use your editor

# Compile smart contract
npm run compile

# Deploy to Polygon Amoy
npm run deploy

# ✅ Save the contract address from output
# Example: 0x1234567890123456789012345678901234567890
```

### 2. Backend Setup

```bash
cd backend

# Create .env if not exists
touch .env

# Add these values:
# CONTRACT_ADDRESS=0x[from_step_1]
# PRIVATE_KEY=[your_deployer_key]
# RPC_URL=[your_alchemy_url]
# WEATHER_API_KEY=[your_weather_api_key]
# JWT_SECRET=[your_secret_key]
# (and other existing config)

# Install/verify dependencies
npm install

# Verify blockchain service loads
npm start

# Look for:
# ✅ Connected to network: Polygon Amoy
# ✅ Blockchain service initialized
# ✅ Blockchain monitoring job scheduled

# Press Ctrl+C to stop
```

### 3. Frontend Setup

```bash
cd react

# Create/update .env.local
echo "VITE_CONTRACT_ADDRESS=0x[from_step_1]" >> .env.local

# Install/verify dependencies
npm install

# Verify Web3 loads
npm run dev

# Open http://localhost:5173 in browser
# Look for: No console errors
# Press Ctrl+C to stop
```

### 4. Fund Contract

```bash
# Using MetaMask:
# 1. Copy contract address from step 1
# 2. Open MetaMask
# 3. Click Send
# 4. Paste contract address
# 5. Enter 1-5 MATIC
# 6. Send transaction
# 7. Wait 1-2 minutes for confirmation

# Verify on Polygonscan:
# Visit: https://amoy.polygonscan.com/address/0x[contract_address]
# Check balance shows MATIC
```

---

## 🏃 Quick Run (Daily Development)

### Terminal 1: Backend

```bash
cd backend
npm start

# Expected output:
# ✅ Backend Server running on http://localhost:5000
# ✅ Blockchain service initialized
# ✅ Blockchain monitoring job scheduled
```

### Terminal 2: Frontend

```bash
cd react
npm run dev

# Expected output:
# ✅ VITE v4.x.x ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  Press q to quit
```

### Terminal 3: Test (Optional)

```bash
# Run blockchain tests
cd backend
node test-blockchain.js

# Or trigger payout manually
node trigger-payout-test.js
```

---

## 🧪 Testing Commands

### Compile & Verify Contract

```bash
cd blockchain

# Compile contract
npm run compile
# ✅ Output: "Compiled successfully"

# View contract on Polygonscan
# Go to: https://amoy.polygonscan.com/address/0x[contract]
```

### Deploy Contract

```bash
cd blockchain

# Deploy to Amoy testnet
npm run deploy
# ✅ Output: Contract deployed at 0x...

# Deploy to local node (if running)
npm run node          # Terminal 1
npm run deploy:local  # Terminal 2
```

### Test Backend Service

```bash
cd backend

# Create test file:
cat > test-blockchain.js << 'EOF'
import * as blockchainService from './utils/blockchainService.js'

async function test() {
  try {
    const initialized = await blockchainService.initializeBlockchain()
    if (!initialized) throw new Error('Init failed')
    
    const stats = await blockchainService.getContractStats()
    console.log('✅ Stats:', stats)
    
    const balance = await blockchainService.getContractBalance()
    console.log('✅ Balance:', balance)
    
    const farmers = await blockchainService.getActiveFarmersFromChain()
    console.log('✅ Farmers:', farmers.length)
  } catch(e) {
    console.error('❌', e.message)
  }
}
test()
EOF

# Run test
node test-blockchain.js
```

### Test Frontend Web3

```bash
# In browser console (F12):

import web3 from '/src/services/web3.js'

// Initialize
await web3.initializeWeb3()
console.log('✅ Web3 initialized')

// Connect wallet
const addr = await web3.connectWallet()
console.log('✅ Connected:', addr)

// Get balance
const bal = await web3.getWalletBalance()
console.log('✅ Balance:', bal)

// Get contract stats
const stats = await web3.getContractStats()
console.log('✅ Stats:', stats)
```

---

## 📊 Monitoring Commands

### Check Backend Logs in Real-Time

```bash
# Terminal running backend will show:
# 📨 GET /health
# 📨 GET /api/policies
# ⛓️  Running scheduled blockchain payout check...
# ✅ Blockchain payout check completed

# Search for specific events:
# 🔗 Triggering payout on blockchain
# 💸 Payout triggered successfully
# ⚠️  Error appears here
```

### Check Contract on Polygonscan

```bash
# View contract:
https://amoy.polygonscan.com/address/0x[YOUR_CONTRACT]

# View transaction:
https://amoy.polygonscan.com/tx/0x[TX_HASH]

# View your wallet:
https://amoy.polygonscan.com/address/0x[YOUR_WALLET]
```

### Check MetaMask Status

```bash
# In MetaMask:
✅ Network: Polygon Amoy
✅ Account: Your wallet address
✅ Balance: MATIC amount
✅ Recent transactions visible
```

---

## 🔧 Common Tasks

### Get Contract Address

```bash
# From deployment:
cd blockchain
cat deployment-info.json | grep contractAddress

# Output: "contractAddress": "0x..."
```

### Get Private Key from MetaMask

```
1. Open MetaMask
2. Click 3 dots menu
3. Account Details
4. Export Private Key
5. Enter password
6. Copy the key (WITHOUT 0x prefix)
7. Add to .env: PRIVATE_KEY=xyz...
```

### Get RPC URL from Alchemy

```
1. Go to https://www.alchemy.com/
2. Dashboard → Your App
3. View Key
4. Copy HTTPS URL
5. Add to .env: RPC_URL=https://...
```

### Add Polygon Amoy to MetaMask

```
Network Name: Polygon Amoy
RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Symbol: MATIC
Block Explorer: https://amoy.polygonscan.com/
```

### Get Testnet MATIC

```bash
# Visit faucet:
https://faucet.polygon.technology/

# Steps:
1. Select Network: Polygon Amoy
2. Paste wallet address
3. Select Token: MATIC
4. Click "Claim"
5. Wait for confirmation
6. Check MetaMask balance
```

---

## 🐛 Troubleshooting Commands

### Clear Everything and Start Fresh

```bash
# Blockchain
cd blockchain
rm -rf node_modules package-lock.json artifacts cache
npm install
npm run compile

# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd react
rm -rf node_modules package-lock.json .next
npm install
```

### Check Node Version

```bash
node --version
# Should be v16.0.0 or higher

npm --version
# Should be v7.0.0 or higher
```

### Check If Port Is In Use

```bash
# Backend (5000)
lsof -i :5000
# If in use: kill -9 [PID]

# Frontend (5173)
lsof -i :5173
# If in use: kill -9 [PID]
```

### View Blockchain Service Logs

```bash
# When backend crashes:
npm start 2>&1 | grep -i blockchain

# See all blockchain-related logs
npm start 2>&1 | grep "⛓️\|❌"
```

### Test RPC Connection

```bash
# Terminal:
curl -X POST https://polygon-amoy.g.alchemy.com/v2/YOUR_API_KEY \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":1}'

# Should return: "0x13882" (80002 in decimal)
```

---

## 📈 Performance Monitoring

### Check Gas Usage

```bash
# In deployment log, look for:
# Gas Used: 150000 (for buyPolicy)
# Gas Used: 100000 (for triggerPayout)

# Check on Polygonscan for actual gas
https://amoy.polygonscan.com/tx/[TX_HASH]
```

### Monitor Contract Balance

```bash
# Method 1: Polygonscan
https://amoy.polygonscan.com/address/0x[CONTRACT]
# Check "Balance" field

# Method 2: Backend console
# Look for: "Contract Balance: X MATIC"

# Method 3: Web3 utility
const balance = await web3.getContractBalance()
console.log(balance.balanceEther)
```

### Check Transaction Confirmation

```bash
# Visit Polygonscan:
https://amoy.polygonscan.com/tx/0x[TX_HASH]

# Look for:
- Status: Success ✓ (green)
- Block Confirmations: > 12
- Gas Used: <expected value>
```

---

## 📱 Testing Workflows

### Full Buy Policy Test

```bash
# Terminal 1
cd backend && npm start

# Terminal 2
cd react && npm run dev

# Browser:
1. Open http://localhost:5173
2. Click "Connect MetaMask"
3. Approve connection
4. Go to Blockchain Policy Buyer
5. Enter: Threshold=50, Premium=0.1
6. Click "Buy Policy"
7. Approve MetaMask transaction
8. Wait 1-2 minutes
9. See "Policy purchased successfully!"

# Verify on Polygonscan
https://amoy.polygonscan.com/tx/[TX_HASH]
```

### Full Payout Test

```bash
# After buying policy above:

# Terminal 3
cd backend
node trigger-payout-test.js

# Should trigger payout if rainfall > threshold
# Check terminal 1 for: "Payout triggered successfully!"

# Verify on Polygonscan
https://amoy.polygonscan.com/tx/[PAYOUT_TX_HASH]

# Check MetaMask: Farmer should receive MATIC
```

### Dashboard Test

```bash
# Browser:
1. Open http://localhost:5173/blockchain-dashboard
2. Verify real-time data shows
3. Click Refresh button
4. Check auto-refresh works
5. Verify Polygonscan links work
```

---

## 🚀 Deployment Checklist

```bash
# Before deploying to production:

[ ] Contract compiled successfully
     npm run compile

[ ] ABI generated
     ls blockchain/abi/Insurance.json

[ ] Contract deployed
     npm run deploy

[ ] Contract funded
     Check Polygonscan balance > 0

[ ] Backend configured
     grep -i contract backend/.env

[ ] Backend initialized
     npm start | grep "blockchain"

[ ] Frontend configured
     grep -i contract react/.env.local

[ ] Frontend loads
     npm run dev

[ ] MetaMask works
     Manual test in browser

[ ] Policy purchase works
     Manual test end-to-end

[ ] Payout tests pass
     node trigger-payout-test.js

[ ] All guides read
     BLOCKCHAIN_DEPLOYMENT_GUIDE.md

[ ] All tests completed
     BLOCKCHAIN_TESTING_GUIDE.md
```

---

## 📚 Documentation Navigation

```
Quick Help:
- Setup: BLOCKCHAIN_QUICK_START.md
- Deploy: BLOCKCHAIN_DEPLOYMENT_GUIDE.md
- Test: BLOCKCHAIN_TESTING_GUIDE.md

Technical:
- Module README: blockchain/README.md
- Implementation: BLOCKCHAIN_IMPLEMENTATION_SUMMARY.md

Code:
- Smart Contract: blockchain/contracts/Insurance.sol
- Backend: backend/utils/blockchainService.js
- Frontend: react/src/services/web3.js
- Components: react/src/components/Blockchain*.jsx
```

---

## 🎯 Success Indicators

You'll know it's working when you see:

```
✅ Backend console:
   ⛓️  Connected to network: Polygon Amoy
   ✅ Blockchain service initialized
   ✅ Blockchain monitoring job scheduled
   📋 Found X active farmers
   ✅ Payout triggered successfully!

✅ Frontend console:
   ✅ Web3 initialized
   ✅ Wallet connected
   ✅ Policy purchased successfully!

✅ Polygonscan:
   - Transaction shows "Success ✓"
   - Contract balance visible
   - Events logged
```

---

**Print this page and keep it handy! 📋✅**
