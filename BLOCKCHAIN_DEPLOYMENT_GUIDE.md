# 🚀 Complete Deployment & Setup Guide for InsuChain Blockchain

This guide walks you through setting up and deploying the complete InsuChain blockchain system.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Blockchain Module Setup](#blockchain-module-setup)
3. [Smart Contract Deployment](#smart-contract-deployment)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Testing Guide](#testing-guide)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Node.js v16+ installed
- npm or yarn package manager
- Git
- A text editor (VS Code recommended)

### Accounts & Services
- **MetaMask wallet** (browser extension)
  - Download: https://metamask.io/download/
  - Create a new wallet or import existing

- **Alchemy account** (for RPC endpoint)
  - Sign up: https://www.alchemy.com/
  - Create new app on Polygon Amoy testnet
  - Get RPC URL

- **Polygon Amoy testnet MATIC tokens** (for testing)
  - Faucet: https://faucet.polygon.technology/
  - Enter your wallet address, select Polygon Amoy, claim tokens

---

## Blockchain Module Setup

### Step 1: Install Dependencies

Navigate to the blockchain folder and install packages:

```bash
cd blockchain
npm install
```

This installs:
- `hardhat` - Ethereum development framework
- `ethers` - Blockchain library
- `dotenv` - Environment variable management

### Step 2: Create Environment File

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Edit `.env` file:**

```env
# Get from MetaMask: Settings → Account Details → Export Private Key
PRIVATE_KEY=your_private_key_here_without_0x

# Get from Alchemy Dashboard → Your App → API Key
RPC_URL=https://polygon-amoy.g.alchemy.com/v2/your-api-key

# Optional gas settings
GAS_PRICE=50
GAS_LIMIT=5000000
```

⚠️ **IMPORTANT: Never commit `.env` file with real values!**

### Step 3: Compile Smart Contract

```bash
npm run compile
```

This should output:
```
✓ Compiled successfully
Generated artifacts in ./artifacts
```

### Step 4: Deploy Smart Contract to Amoy Testnet

```bash
npm run deploy
```

**Expected output:**
```
🚀 Starting contract deployment...

📝 Deploying with account: 0x...
💰 Account balance: 123456789... wei

📦 Compiling contracts...
✅ Compilation complete

🔨 Deploying Insurance contract...
✅ Insurance contract deployed at: 0x...

📊 Deployment Details:
   Network: amoy
   Chain ID: 80002
   Deployer: 0x...
   Contract Address: 0x...
   Block Number: 12345678

💾 Deployment info saved to: deployment-info.json

🔍 Verifying contract...
   Owner: 0x...
   Initial Balance: 0 wei

✅ ✅ ✅ Deployment completed successfully! ✅ ✅ ✅

🌐 View on Polygonscan:
   https://amoy.polygonscan.com/address/0x...

⚡ Next steps:
   1. Copy the contract address
   2. Fund the contract with tokens (for payouts)
   3. Update your backend with the contract address
   4. Update your frontend with the contract address
```

**Save the contract address** - you'll need it for backend and frontend!

### Step 5: Fund the Smart Contract

The contract needs MATIC tokens to payout to farmers.

1. Go to https://amoy.polygonscan.com/address/[YOUR_CONTRACT_ADDRESS]
2. Click "Contract" tab
3. Use the `receive()` function or send MATIC directly to the contract address

Send MATIC from your MetaMask wallet:
```bash
# Using ethers CLI (if installed globally)
# Or manually using MetaMask
# Send 1-5 MATIC to your contract address
```

---

## Smart Contract Configuration

### Step 6: Update Backend with Contract Address

In `backend/.env`, add:

```env
CONTRACT_ADDRESS=0x[your_deployed_contract_address]
PRIVATE_KEY=your_private_key_for_payout_triggering
RPC_URL=https://polygon-amoy.g.alchemy.com/v2/your-api-key
```

### Step 7: Copy Contract ABI to Frontend

After deployment, the ABI is automatically generated. Copy it to frontend:

```bash
# The ABI is created at: blockchain/artifacts/contracts/Insurance.sol/Insurance.json

# Create abi directory in frontend
mkdir -p react/public/abi

# Copy ABI file
cp blockchain/abi/Insurance.json react/public/abi/
```

---

## Backend Configuration  

### Step 8: Update Backend Environment

In `backend/.env`, add blockchain configuration:

```env
# Blockchain
CONTRACT_ADDRESS=0x[YOUR_CONTRACT_ADDRESS]
PRIVATE_KEY=[YOUR_DEPLOYER_PRIVATE_KEY]
RPC_URL=https://polygon-amoy.g.alchemy.com/v2/[ALCHEMY_API_KEY]

# Other existing configs
WEATHER_API_KEY=[YOUR_WEATHER_API_KEY]
JWT_SECRET=[YOUR_JWT_SECRET]
DB_HOST=[YOUR_DB_HOST]
# ... etc
```

### Step 9: Test Backend Blockchain Service

```bash
cd backend
npm start
```

Watch for output indicating blockchain service initialized:
```
⛓️  Initializing blockchain service...
✅ Connected to network: Polygon Amoy (Chain ID: 80002)
✅ Blockchain service initialized
   Contract Address: 0x...
   Signer Address: 0x...
✅ Blockchain monitoring job scheduled (runs every hour)
```

---

## Frontend Configuration

### Step 10: Create Frontend Environment File

In `react/.env.local`, add:

```env
VITE_CONTRACT_ADDRESS=0x[YOUR_CONTRACT_ADDRESS]
```

### Step 11: Install Ethers in Frontend

Ethers should already be installed, but verify:

```bash
cd react
npm list ethers
```

If not installed:
```bash
npm install ethers
```

### Step 12: Verify Frontend Blockchain Components

Check that these files exist:
- `react/src/services/web3.js` ✅
- `react/src/components/BlockchainPolicyBuyer.jsx` ✅
- `react/src/components/BlockchainDashboard.jsx` ✅
- `react/public/abi/Insurance.json` ✅

### Step 13: Test Frontend

Start the frontend development server:

```bash
npm run dev
```

Navigate to http://localhost:5173 and check:
- MetaMask connection works
- No errors in browser console
- Blockchain components load correctly

---

## Testing Guide

### Complete End-to-End Testing

#### Phase 1: Initial Setup Testing

**1. Verify Contract Deployment**

```bash
# Check contract on Polygonscan
# Go to: https://amoy.polygonscan.com/address/0x[YOUR_ADDRESS]
# Verify:
# - Contract code is visible
# - Owner address is correct
# - Read Contract tab shows functions
```

**2. Verify Contract Funding**

```bash
# Check contract balance
# Go to contract on Polygonscan
# Verify balance shows MATIC tokens
```

**3. Test Backend Service Initialization**

```bash
# Terminal 1: Start backend
cd backend
npm start

# Look for messages:
# ✅ Connected to network: Polygon Amoy
# ✅ Blockchain service initialized
# ✅ Blockchain monitoring job scheduled
```

**4. Test Frontend Initialization**

```bash
# Terminal 2: Start frontend
cd react
npm run dev

# Open http://localhost:5173
# Open browser console (F12)
# No errors should appear
```

---

#### Phase 2: MetaMask Integration Testing

**Test 1: Connect MetaMask**

1. Open frontend at http://localhost:5173
2. Navigate to Blockchain Policy Buyer page
3. Click "🦊 Connect MetaMask"
4. Approve connection in MetaMask popup
5. Select Polygon Amoy network (if prompted)
6. **Verify:**
   - ✅ Wallet address displays
   - ✅ MATIC balance shows correctly
   - ✅ No error messages

**Test 2: Verify Network**

1. In MetaMask, switch to Ethereum Mainnet
2. Try to interact with blockchain feature
3. **Verify:**
   - ✅ Error message: "Wrong network"
   - ✅ Option to switch networks appears
4. Click switch network
5. **Verify:**
   - ✅ Successfully switches to Polygon Amoy

**Test 3: Check Wallet Balance**

1. Connected to MetaMask with Amoy network
2. **Verify on screen:**
   - ✅ Wallet address shows correctly
   - ✅ Balance updates from blockchain
   - ✅ Balance in card matches MetaMask

---

#### Phase 3: Buy Policy Testing

**Test 4: Buy Policy via Frontend**

1. Ensure MetaMask is connected
2. Fill in form:
   - Rainfall Threshold: `50`
   - Premium Amount: `0.1`
3. Click "💳 Buy Policy"
4. Approve transaction in MetaMask
5. **Verify:**
   - ✅ Transaction hash appears
   - ✅ "Transaction sent" message shows
   - ✅ Waiting for confirmation message
   - ✅ Transaction confirmed after 1-2 minutes

**Expected transaction details:**
- Amount: 0.1 MATIC
- Gas: ~500,000 units
- Network: Polygon Amoy

**Test 5: Verify Policy on Blockchain**

1. After purchase confirmation
2. **Verify on screen:**
   - ✅ "Your Current Policy" section appears
   - ✅ Shows: Premium, Payout, Threshold, Status
   - ✅ Status shows "🟢 Active"
   - ✅ Payout Claimed shows "❌ No"

3. Go to Polygonscan transaction:
   - Click transaction hash link
   - **Verify:**
     - ✅ Transaction confirmed
     - ✅ To address = Contract address
     - ✅ Value = 0.1 MATIC
     - ✅ Status = "Success ✓"

---

#### Phase 4: Payout Triggering Testing

**Test 6: Backend Cron Job Testing (Manual Trigger)**

For testing without waiting 1 hour, manually test the payout logic:

```bash
# In backend, create a test file: test-payout.js

import * as blockchainService from './utils/blockchainService.js';
import { fetchWeatherData } from './utils/weatherAPI.js';

async function testPayout() {
  try {
    await blockchainService.initializeBlockchain();
    
    const farmers = await blockchainService.getActiveFarmersFromChain();
    console.log('Active farmers:', farmers);
    
    if (farmers.length === 0) {
      console.log('No active farmers to test with');
      return;
    }
    
    const farmer = farmers[0];
    const policy = await blockchainService.getPolicyFromChain(farmer);
    console.log('Farmer policy:', policy);
    
    // Mock high rainfall
    const mockRainfall = parseInt(policy.rainfallThreshold) + 10;
    
    console.log(`Triggering payout with rainfall: ${mockRainfall}mm`);
    const result = await blockchainService.triggerPayoutOnChain(farmer, mockRainfall);
    
    if (result) {
      console.log('Payout triggered successfully!', result);
    }
  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testPayout();
```

Run it:
```bash
node test-payout.js
```

**Verify output:**
- ✅ Active farmers list shows
- ✅ Policy details display
- ✅ Transaction hash generated
- ✅ Block confirmation shows

**Test 7: Wait for Automatic Cron Job (Optional)**

If you want to wait for the automatic cron:

1. Keep backend running for 1 hour
2. Ensure contract has sufficient balance
3. Monitor backend logs for:
   ```
   ⛓️  Running scheduled blockchain payout check...
   📋 Found X active farmers on blockchain
   ✅ Payout triggered successfully!
   ```

---

#### Phase 5: Dashboard Testing

**Test 8: Blockchain Dashboard Display**

1. Navigate to Blockchain Dashboard
2. **Verify displays:**
   - ✅ Total Policies Sold
   - ✅ Total Payouts
   - ✅ Contract Balance
   - ✅ Your Policy (if connected)
   - ✅ Recent Payout Events list
   - ✅ Auto-refresh status
   - ✅ Last updated timestamp

**Test 9: Event Listener Testing**

After triggering a payout:

1. Keep Dashboard open
2. Another user (different wallet) buys a policy
3. **Verify:**
   - ✅ New event appears in Recent Events
   - ✅ Shows: Farmer address, Payout amount, Rainfall
   - ✅ Polygonscan link works
   - ✅ Auto-refresh updates data

---

#### Phase 6: Error Handling Testing

**Test 10: Network Error Handling**

1. Turn off internet connection
2. Try to buy policy
3. **Verify:**
   - ✅ Error message appears
   - ✅ User can retry
   - ✅ No crashes

**Test 11: MetaMask Not Installed**

1. Disable MetaMask extension
2. Try to connect wallet
3. **Verify:**
   - ✅ Error: "MetaMask is not installed"
   - ✅ Clear instruction to install appears

**Test 12: Insufficient Balance**

1. Use wallet with < 0.1 MATIC
2. Try to buy 0.1 MATIC policy
3. **Verify:**
   - ✅ Error: "Insufficient balance"
   - ✅ Shows required vs available MATIC

**Test 13: Transaction Rejection**

1. Start to buy policy
2. Reject transaction in MetaMask
3. **Verify:**
   - ✅ Error message appears
   - ✅ Can retry purchase
   - ✅ Form state preserved

**Test 14: Already Has Active Policy**

1. Buy a policy
2. Try to buy another while first is active
3. **Verify:**
   - ✅ Transaction rejected by contract
   - ✅ Error message: "Already have active policy"
   - ✅ Frontend handles gracefully

---

### Testing Checklist

Use this checklist to verify everything works:

```
✅ = Test Passed

DEPLOYMENT
[ ] ✅ Contract deploys successfully
[ ] ✅ Contract funded with MATIC
[ ] ✅ Contract visible on Polygonscan
[ ] ✅ Backend initializes blockchain service
[ ] ✅ Frontend loads without errors

METMASK
[ ] ✅ Can connect wallet
[ ] ✅ Network switch works
[ ] ✅ Wallet address displays
[ ] ✅ Balance shows correctly

BUY POLICY
[ ] ✅ Can buy policy with valid inputs
[ ] ✅ Transaction shows on Polygonscan
[ ] ✅ Policy status shows "Active"
[ ] ✅ Payout amount = Premium * 2

DASHBOARD
[ ] ✅ Stats display correctly
[ ] ✅ User policy shows if connected
[ ] ✅ Events display
[ ] ✅ Auto-refresh works

PAYOUTS (Manual Test)
[ ] ✅ Backend can trigger payout
[ ] ✅ Payout transaction confirmed
[ ] ✅ Farmer receives MATIC
[ ] ✅ Policy status changes to "Inactive"

ERROR HANDLING
[ ] ✅ Network errors handled
[ ] ✅ MetaMask errors handled
[ ] ✅ Balance errors handled
[ ] ✅ Transaction rejection handled

SECURITY
[ ] ✅ Private key never logged
[ ] ✅ Contract address public
[ ] ✅ Only owner can trigger payouts
[ ] ✅ Double payout prevented
```

---

## Troubleshooting

### Common Issues & Solutions

#### Issue: "Contract address not configured"

**Solution:**
1. Deploy contract: `npm run deploy` in blockchain/
2. Copy address from output
3. Add to `backend/.env` and `react/.env.local`
4. Restart both services

#### Issue: "MetaMask is not installed"

**Solution:**
1. Install MetaMask: https://metamask.io/
2. Create/import wallet
3. Add Polygon Amoy network
4. Refresh browser

#### Issue: "Wrong network"

**Solution:**
1. In MetaMask, add Polygon Amoy:
   - Network: Polygon Amoy
   - RPC: https://rpc-amoy.polygon.technology/
   - Chain ID: 80002
   - Currency: MATIC

#### Issue: "Insufficient balance"

**Solution:**
1. Get testnet MATIC: https://faucet.polygon.technology/
2. Claim tokens to your wallet
3. Wait for confirmation

#### Issue: Contract has no funds (can't payout)

**Solution:**
1. Send MATIC to contract address
2. Or use `withdrawFunds()` function (owner only)

#### Issue: "Transaction rejected by contract"

**Solution:**
- Verify rainfall exceeds threshold
- Verify payout not already claimed
- Verify contract has sufficient balance
- Check on Polygonscan for revert reason

#### Issue: Backend cron not running

**Solution:**
```bash
# Check backend is running
ps aux | grep node

# Check logs for errors
# Look for "Blockchain monitoring job scheduled"

# Restart backend
npm start
```

#### Issue: ABI file not found

**Solution:**
```bash
# Compile contract to generate ABI
cd blockchain
npm run compile

# Copy to frontend
cp blockchain/abi/Insurance.json react/public/abi/
```

#### Issue: "Cannot connect to RPC"

**Solution:**
1. Verify RPC URL in .env
2. Check Alchemy app is active
3. Try public RPC: https://rpc-amoy.polygon.technology/
4. Check internet connection

---

## Production Deployment

### Before Going Live

1. **Security Audit:**
   - Have contract reviewed by security experts
   - Run formal verification tools
   - Test extensively on testnet

2. **Environment Setup:**
   - Use strong passwords
   - Store private keys securely (hardware wallet)
   - Never expose .env files
   - Use HTTPS everywhere

3. **Monitoring:**
   - Set up error logging
   - Monitor contract balance
   - Set up alerts for failed payouts
   - Log all transactions

4. **Documentation:**
   - Create user guide for farmers
   - Document API endpoints
   - Create admin manual

5. **Legal/Compliance:**
   - Ensure insurance compliance
   - Review terms of service
   - Insurance company approval

---

## Support & Resources

- **Hardhat Docs:** https://hardhat.org/docs
- **Ethers.js Docs:** https://docs.ethers.org/
- **Polygon Docs:** https://polygon.technology/docs
- **Polygonscan:** https://amoy.polygonscan.com/
- **MetaMask Support:** https://support.metamask.io/

---

**✅ You're all set! Happy deploying! 🚀**
