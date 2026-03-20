# 🧪 Comprehensive Testing Guide for InsuChain Blockchain

Detailed step-by-step instructions to test every aspect of the blockchain integration.

---

## 📋 Pre-Testing Checklist

Before starting tests, ensure:

- [ ] Node.js v16+ installed
- [ ] MetaMask installed and configured
- [ ] Backend running: `npm start` in backend/
- [ ] Frontend running: `npm run dev` in react/
- [ ] Contract deployed on Polygon Amoy
- [ ] Contract funded with at least 1 MATIC
- [ ] All .env files configured correctly

---

## Part 1: Smart Contract Testing

### Test 1.1: Deploy Contract

```bash
# Navigate to blockchain folder
cd blockchain

# Install dependencies if not done
npm install

# Compile contract
npm run compile

# Expected output:
# ✓ 1 contract(s) compiled successfully
# Generated artifacts in ./artifacts

# Deploy to Amoy
npm run deploy

# Capture the contract address from output
# Save it as: CONTRACT_ADDRESS=0x...
```

**Verify:**
- ✅ Compilation successful with no errors
- ✅ Deployment outputs contract address
- ✅ deployment-info.json created

### Test 1.2: Verify Contract on Polygonscan

```
1. Go to https://amoy.polygonscan.com/
2. Paste contract address in search
3. Verify these sections exist:
   - "Contract" tab: Shows source code
   - "Read Contract": Shows available view functions
   - "Write Contract": Shows write functions (needs MetaMask)
   - "Transactions": Initially empty
```

**Verify:**
- ✅ Contract code is visible
- ✅ Functions match Insurance.sol
- ✅ Owner address is correct

### Test 1.3: Fund Contract

```bash
# Send 1-5 MATIC to contract from MetaMask
# Steps:
# 1. Open MetaMask
# 2. Copy contract address
# 3. Click Send
# 4. Paste contract address as recipient
# 5. Enter 1 MATIC
# 6. Send

# Wait for transaction confirmation (1-2 minutes)
```

**Verify on Polygonscan:**
- ✅ Transaction shows "Success"
- ✅ To address = Your contract
- ✅ Value shows 1 MATIC
- ✅ Contract balance increased

---

## Part 2: Backend Testing

### Test 2.1: Backend Service Initialization

```bash
# Start backend
cd backend
npm start

# Look for these messages in logs:
# ✅ Backend Server running on http://localhost:5000
# ✅ Connected to network: Polygon Amoy (Chain ID: 80002)
# ✅ Blockchain service initialized
# ✅ Blockchain monitoring job scheduled

# If you see errors:
# ❌ Blockchain service initialization failed
# Check:
# - CONTRACT_ADDRESS is set correctly
# - PRIVATE_KEY is valid
# - RPC_URL is accessible
```

**Verify:**
- ✅ Backend starts without errors
- ✅ All database connections work
- ✅ Blockchain service initializes
- ✅ No error messages in logs

### Test 2.2: Health Check

```bash
# Terminal: Check if backend is healthy
curl http://localhost:5000/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Verify:**
- ✅ Response shows status: "ok"
- ✅ Timestamp is current

### Test 2.3: Get Contract Stats via Backend

Create a test script `backend/test-blockchain.js`:

```javascript
import * as blockchainService from './utils/blockchainService.js';

async function testStats() {
  try {
    console.log('Initializing blockchain service...');
    const initialized = await blockchainService.initializeBlockchain();
    
    if (!initialized) {
      console.error('Failed to initialize');
      return;
    }
    
    console.log('\n📊 Fetching contract stats...');
    const stats = await blockchainService.getContractStats();
    console.log('Stats:', stats);
    
    console.log('\n💰 Fetching contract balance...');
    const balance = await blockchainService.getContractBalance();
    console.log('Balance:', balance);
    
    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testStats();
```

Run test:
```bash
node test-blockchain.js

# Expected output:
# Initializing blockchain service...
# ✅ Connected to network: Polygon Amoy
# ✅ Blockchain service initialized
# 📊 Fetching contract stats...
# Stats: { totalPoliciesSold: '0', totalPayoutsTriggered: '0', contractBalance: '1.0', ... }
# 💰 Fetching contract balance...
# Balance: { balanceEther: '1.0', balanceWei: '1000000000000000000' }
# ✅ Test completed successfully!
```

**Verify:**
- ✅ No connection errors
- ✅ Stats return valid data
- ✅ Balance shows MATIC amount

---

## Part 3: Frontend Testing

### Test 3.1: Frontend Initialization

```bash
# Start frontend
cd react
npm run dev

# Open browser console (F12)
# Navigate to http://localhost:5173
# Check console for errors

# You should see:
# - No red error messages
# - Components load successfully
# - CSS styles apply correctly
```

**Verify:**
- ✅ No console errors
- ✅ Page loads properly
- ✅ No blank screens

### Test 3.2: ABI Loading

In browser console, run:

```javascript
// Verify ABI can be loaded
fetch('/abi/Insurance.json')
  .then(r => r.json())
  .then(abi => console.log('✅ ABI loaded, functions:', abi.length))
  .catch(e => console.error('❌ ABI loading failed:', e))
```

**Expected output:**
```
✅ ABI loaded, functions: 25
```

**Verify:**
- ✅ ABI loads successfully
- ✅ Contains > 20 functions

### Test 3.3: Web3 Utility Test

In browser console:

```javascript
// Import web3 utility
import web3 from '/src/services/web3.js'

// Initialize
await web3.initializeWeb3()
console.log('✅ Web3 initialized')

// Test helper functions
console.log('✅ formatWeiToMatic(1000000000000000000):', web3.formatWeiToMatic(1000000000000000000))
// Should output: ✅ formatWeiToMatic result: 1.0
```

**Verify:**
- ✅ Web3 initializes without errors
- ✅ Helper functions work

---

## Part 4: MetaMask Integration Testing

### Test 4.1: MetaMask Connection

**Using BlockchainPolicyBuyer Component:**

1. Navigate to Blockchain Policy Buyer page
2. Click "🦊 Connect MetaMask"
3. Approve connection in popup
4. Select Polygon Amoy if prompted

**Expected display:**
```
✅ Wallet Connected

Address: 0x1234...5678
Balance: 5.234 MATIC

[Disconnect Wallet]
```

**Verify:**
- ✅ MetaMask popup appears
- ✅ Wallet address displays correctly
- ✅ Balance shows accurate amount
- ✅ Connected status indicator shows

### Test 4.2: Network Validation

In browser console after connecting:

```javascript
import web3 from '/src/services/web3.js'

// Check current network
await web3.checkNetwork()

// If on wrong network, switch:
await web3.switchToAmoyNetwork()

// Should output:
// ✅ Connected to correct network: Polygon Amoy

// OR if adding new network:
// 📝 Adding Polygon Amoy to MetaMask...
// ✅ Polygon Amoy added to MetaMask
```

**Verify:**
- ✅ Network detection works
- ✅ Can switch networks if needed
- ✅ Correct network confirms

### Test 4.3: Get Wallet Balance

In browser console:

```javascript
import web3 from '/src/services/web3.js'

const balance = await web3.getWalletBalance()
console.log('Balance:', balance)

// Should output:
// Balance: {
//   address: '0x...',
//   balanceMatic: '5.234',
//   balanceWei: '5234000000000000000'
// }
```

**Verify:**
- ✅ Balance fetching works
- ✅ Values are accurate
- ✅ Wei to MATIC conversion correct

---

## Part 5: Buy Policy Testing

### Test 5.1: Valid Policy Purchase

**Using BlockchainPolicyBuyer Component:**

1. Connect wallet
2. Fill form:
   - Rainfall Threshold: `50`
   - Premium Amount: `0.1`
3. Click "💳 Buy Policy"
4. Approve transaction in MetaMask

**Monitor:**
- Transaction hash appears immediately
- "Transaction sent" message shows
- "Waiting for confirmation..." displays
- After 1-2 minutes: "✅ Policy purchased successfully!"

**Verify on Polygonscan:**
1. Click transaction link
2. Verify:
   - ✅ To: [Contract Address]
   - ✅ Value: 0.1 MATIC
   - ✅ Function: buyPolicy
   - ✅ Status: Success ✓

### Test 5.2: View Purchased Policy

After successful purchase:

**On screen, verify:**
```
📋 Your Current Policy

Premium: 0.1 MATIC
Payout: 0.2 MATIC          (2x premium)
Rainfall Threshold: 50 mm
Status: 🟢 Active
Payout Claimed: ❌ No
```

**Via Backend:**

```javascript
import * as blockchainService from './utils/blockchainService.js'

const policy = await blockchainService.getPolicyFromChain('0x[wallet_address]')
console.log('Policy:', policy)

// Should output:
// Policy: {
//   farmer: '0x...',
//   premium: '100000000000000000',       (0.1 MATIC in wei)
//   payout: '200000000000000000',        (0.2 MATIC in wei)
//   rainfallThreshold: '50',
//   active: true,
//   payoutClaimed: false,
//   purchaseTimestamp: '1705305600'
// }
```

**Verify:**
- ✅ Policy stored on blockchain
- ✅ All values correct
- ✅ Status is active

### Test 5.3: Error Handling - Insufficient Balance

1. Switch to wallet with < 0.1 MATIC
2. Try to buy 0.1 MATIC policy
3. Should see error:
   ```
   ⚠️ Insufficient balance. You have 0.05 MATIC but need 0.1 MATIC
   ```

**Verify:**
- ✅ Error message appears
- ✅ Transaction doesn't send
- ✅ Form remains editable

### Test 5.4: Error Handling - Already Has Active Policy

1. Buy a policy with wallet A
2. Try to buy another policy immediately
3. Should see error:
   ```
   ⚠️ You already have an active policy
   ```

**Verify:**
- ✅ Error message appears
- ✅ Current policy shows in "Your Current Policy"
- ✅ Buy button disabled (or error prevents submission)

### Test 5.5: Error Handling - Transaction Rejection

1. Start buying a policy
2. Reject the transaction in MetaMask
3. Should see error:
   ```
   ⚠️ Transaction rejected by user
   ```

**Verify:**
- ✅ Error message clear
- ✅ No funds deducted
- ✅ Can retry

### Test 5.6: Error Handling - Network Switch during Transaction

1. Start buying a policy
2. Switch to Mainnet in MetaMask
3. Should see error about network mismatch

**Verify:**
- ✅ Error message appears
- ✅ Option to switch back to Amoy
- ✅ Transaction cancelled

---

## Part 6: Payout Triggering Testing

### Test 6.1: Manual Payout Test (Backend)

Create test file `backend/trigger-payout-test.js`:

```javascript
import * as blockchainService from './utils/blockchainService.js'
import { fetchWeatherData } from './utils/weatherAPI.js'

async function testPayout() {
  try {
    console.log('⛓️  Initializing blockchain service...')
    const init = await blockchainService.initializeBlockchain()
    if (!init) throw new Error('Failed to initialize')
    
    console.log('📍 Getting active farmers...')
    const farmers = await blockchainService.getActiveFarmersFromChain()
    console.log(`Found ${farmers.length} farmers:`, farmers)
    
    if (farmers.length === 0) {
      console.log('⚠️  No farmers to test with')
      return
    }
    
    const farmer = farmers[0]
    console.log(`\n🌾 Testing with farmer: ${farmer}`)
    
    const policy = await blockchainService.getPolicyFromChain(farmer)
    console.log('Current policy:', policy)
    
    // Verify conditions
    if (!policy.active) {
      console.error('❌ Policy not active')
      return
    }
    
    if (policy.payoutClaimed) {
      console.error('❌ Payout already claimed')
      return
    }
    
    // Get current weather
    const weather = await fetchWeatherData(28.6139, 77.2090)
    console.log('Current weather:', weather)
    
    // Use rainfall 10% more than threshold
    const testRainfall = Math.ceil(parseInt(policy.rainfallThreshold) * 1.1)
    console.log(`\nTesting payout with rainfall: ${testRainfall}mm`)
    console.log(`Threshold: ${policy.rainfallThreshold}mm`)
    
    // Trigger payout
    console.log('\n💸 Triggering payout...')
    const result = await blockchainService.triggerPayoutOnChain(farmer, testRainfall)
    
    if (result) {
      console.log('\n✅ PAYOUT SUCCESSFUL!')
      console.log('Result:', result)
      console.log(`📍 View on Polygonscan: https://amoy.polygonscan.com/tx/${result.transactionHash}`)
    } else {
      console.log('⚠️  Payout not triggered (threshold not met)')
    }
    
  } catch (error) {
    console.error('❌ Test Error:', error.message)
  }
}

testPayout()
```

Run test:
```bash
node trigger-payout-test.js

# Expected output example:
# ⛓️  Initializing blockchain service...
# 📍 Getting active farmers...
# Found 1 farmers: ['0x123...']
# 🌾 Testing with farmer: 0x123...
# Current policy: { active: true, rainfallThreshold: '50', ... }
# Current weather: { rainfall: 45, ... }
# Testing payout with rainfall: 55mm
# 💸 Triggering payout...
# ✅ PAYOUT SUCCESSFUL!
# 📍 View on Polygonscan: https://amoy.polygonscan.com/tx/0xabc...
```

**Verify:**
- ✅ Farmer list retrieved
- ✅ Policy conditions checked
- ✅ Payout transaction sent
- ✅ Transaction appears on Polygonscan

### Test 6.2: Verify Payout on Polygonscan

1. Copy transaction hash from test output
2. Go to Polygonscan: https://amoy.polygonscan.com/
3. Paste transaction hash
4. Verify:
   - ✅ From: [Backend Account]
   - ✅ To: [Contract Address]
   - ✅ Function: triggerPayout
   - ✅ Status: Success ✓

### Test 6.3: Verify Farmer Received MATIC

1. Check farmer wallet on Polygonscan
2. Go to: https://amoy.polygonscan.com/address/[FARMER_ADDRESS]
3. Look for incoming transaction showing payout amount
4. **Verify:**
   - ✅ Payout amount received (2x premium)
   - ✅ Transaction status: Success ✓

### Test 6.4: Verify Policy Status Changed

In backend, check policy after payout:

```javascript
import * as blockchainService from './utils/blockchainService.js'

await blockchainService.initializeBlockchain()

const policy = await blockchainService.getPolicyFromChain('0x[farmer_address]')
console.log('Policy after payout:', policy)

// Should show:
// {
//   active: false,                    // Changed from true
//   payoutClaimed: true,              // Changed from false
//   payout: '200000000000000000'      // Amount that was sent
// }
```

**Verify:**
- ✅ Policy.active = false
- ✅ Policy.payoutClaimed = true
- ✅ Cannot trigger payout again

---

## Part 7: Dashboard Testing

### Test 7.1: Open Blockchain Dashboard

1. Navigate to Blockchain Dashboard component
2. Should auto-load contract data
3. **Verify display:**
   - ✅ Total Policies Sold shows
   - ✅ Total Payouts shows
   - ✅ Contract Balance shows
   - ✅ Auto-refresh indicator shows

### Test 7.2: Manual Refresh

1. Click "🔄 Refresh" button
2. **Verify:**
   - ✅ Button shows "⏳ Refreshing..." during load
   - ✅ Data updates
   - ✅ "Last updated" timestamp changes

### Test 7.3: Auto-Refresh

1. Check "Auto-refresh (30s)" checkbox
2. Wait 30+ seconds
3. **Verify:**
   - ✅ Data refreshes automatically
   - ✅ Last updated timestamp changes
4. Uncheck box
5. **Verify:**
   - ✅ Auto-refresh stops

### Test 7.4: Event Monitoring

After triggering a payout:

1. Open Blockchain Dashboard
2. **Verify recent events list shows:**
   - ✅ Farmer address
   - ✅ Payout amount
   - ✅ Rainfall data
   - ✅ Transaction link to Polygonscan

---

## Part 8: Cron Job Testing

### Test 8.1: Verify Cron Scheduled

When backend starts, look for:

```
✅ Blockchain monitoring job scheduled (runs every hour)
```

### Test 8.2: Monitor Cron Execution (Wait 1 Hour)

**Option 1: Wait for automatic run**
1. Keep backend running
2. Wait until top of next hour
3. Look for logs:
   ```
   ⛓️  Running scheduled blockchain payout check...
   ⏰ Time: 2024-01-15T11:00:00.000Z
   📋 Found X active farmers...
   ```

**Option 2: Manually trigger (for testing)**

Modify the cron schedule for 1 minute interval:

In `backend/controllers/adminController.js`, change:
```javascript
// FROM:
cron.schedule('0 * * * *', async () => {

// TO:
cron.schedule('*/1 * * * *', async () => {  // Every 1 minute
```

**Verify in logs:**
- ✅ Runs every minute
- ✅ Fetches weather data
- ✅ Checks rainfall conditions
- ✅ Triggers payouts when conditions met

---

## Part 9: Error Scenarios

### Scenario 9.1: Contract Out of Funds

1. Deploy new contract with 0 MATIC balance
2. Buy a policy
3. Try to trigger payout
4. **Expected error:**
   ```
   ❌ Contract has insufficient funds
   ```

**Verify:**
- ✅ Transaction reverts
- ✅ No MATIC leaves farmer wallet
- ✅ Policy remains active

### Scenario 9.2: MetaMask Disconnected

1. Buy a policy successfully
2. Disconnect MetaMask
3. Try to buy another policy
4. **Expected error:**
   ```
   ❌ Wallet not connected
   ```

**Verify:**
- ✅ Error message clear
- ✅ User can reconnect
- ✅ First policy still exists

### Scenario 9.3: RPC Connection Lost

1. Disconnect internet temporarily
2. Try to fetch contract stats
3. **Expected error:**
   ```
   ❌ Cannot connect to RPC
   ```

**Verify:**
- ✅ Error handled gracefully
- ✅ Backend logs error
- ✅ Reconnects when internet returns

### Scenario 9.4: Invalid Contract Address

1. Change CONTRACT_ADDRESS to invalid value
2. Restart backend
3. Try to use blockchain features
4. **Expected error:**
   ```
   ❌ Address 0x... does not contain bytecode
   ```

**Verify:**
- ✅ Error indicates problem
- ✅ Backend indicates service not ready
- ✅ Clear error message for developer

---

## Performance Testing

### Test 10.1: Transaction Speed

```bash
# Measure time from submission to confirmation

Time to submit: ~2 seconds (MetaMask dialog)
Time to first confirmation: ~30-60 seconds
Time to final confirmation: ~1-2 minutes
```

**Verify:**
- ✅ Reasonable wait times
- ✅ No timeout issues

### Test 10.2: Dashboard Responsiveness

```bash
# Measure dashboard loading and refresh times

Initial load: < 3 seconds
Refresh: < 2 seconds
Event listener latency: < 1 second
```

**Verify:**
- ✅ Responsive interface
- ✅ No lag

### Test 10.3: Backend Event Processing

```bash
# Measure time from weather check to payout trigger

Cron trigger: Instant
Weather fetch: < 2 seconds
Policy check: < 1 second
Payout trigger: < 5 seconds
Total: < 10 seconds
```

**Verify:**
- ✅ Efficient processing
- ✅ No bottlenecks

---

## Security Testing

### Test 11.1: Private Key Security

**Verify:**
- ✅ Private key never in logs
- ✅ Private key never in frontend
- ✅ Private key stored safely in .env
- ✅ .env in .gitignore

```bash
# Check logs don't contain private key
grep -r "PRIVATE_KEY" backend/ react/

# Should return nothing

# Check .env is ignored
grep ".env" .gitignore

# Should show: .env
```

### Test 11.2: Contract Access Control

**Test 1: Only owner can trigger payouts**

```javascript
// Try from another account
await contract.triggerPayout(farmer, rainfall)

// Should error:
// ❌ Only owner can call this function
```

**Test 2: Prevent double payout**

```javascript
// Trigger payout twice
await contract.triggerPayout(farmer, rainfall)  // Success
await contract.triggerPayout(farmer, rainfall)  // Fails

// Second call should error:
// ❌ Payout already claimed
```

### Test 11.3: Contract Validation

**Test input validation:**

```javascript
// Test null address
await contract.buyPolicy(0)
// ❌ Invalid address

// Test zero threshold
await contract.buyPolicy(-50)
// ❌ Rainfall threshold must be > 0

// Test zero premium
await contract.buyPolicy(50, {value: 0})
// ❌ Premium must be > 0
```

---

## Final Verification Checklist

```
DEPLOYMENT ✅
[ ] Contract deploys successfully
[ ] Contract verified on Polygonscan
[ ] Contract funded with MATIC
[ ] deployment-info.json created

BACKEND ✅
[ ] Backend starts without errors
[ ] Blockchain service initializes
[ ] All blockchain functions accessible
[ ] Cron job scheduled
[ ] Health check endpoint works

FRONTEND ✅
[ ] Frontend loads without errors
[ ] No console errors
[ ] All components render
[ ] Styles apply correctly

METMASK ✅
[ ] Can connect wallet
[ ] Wallet address displays
[ ] Balance updates
[ ] Network switching works

BUY POLICY ✅
[ ] Can buy policy with valid inputs
[ ] Transaction appears on Polygonscan
[ ] Policy stored on contract
[ ] Policy displays on dashboard
[ ] Payout calculated correctly (2x)

PAYOUTS ✅
[ ] Backend can trigger payouts
[ ] Payout transactions confirm
[ ] Farmer receives MATIC
[ ] Policy status updates
[ ] Cannot trigger twice

EVENTS ✅
[ ] Events display on dashboard
[ ] Events update in real-time
[ ] Event links work

ERRORS ✅
[ ] Network errors handled
[ ] Balance errors handled
[ ] MetaMask errors handled
[ ] Contract errors handled

SECURITY ✅
[ ] Private key never exposed
[ ] Only owner can trigger payouts
[ ] Double payout prevented
[ ] Input validation works

PERFORMANCE ✅
[ ] Transactions confirm < 2 minutes
[ ] Dashboard responds < 3 seconds
[ ] No timeouts or freezes
```

---

**🎉 If all tests pass, you're ready for production!**
