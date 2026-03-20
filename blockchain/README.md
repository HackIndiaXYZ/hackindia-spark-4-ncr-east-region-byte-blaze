# 🔗 InsuChain Blockchain Module

Complete blockchain implementation for parametric weather insurance using Polygon Amoy testnet.

---

## 📋 Overview

This module provides:

- **Smart Contract (Solidity)** - Insurance policy management on blockchain
- **Deployment Scripts** - Automated contract deployment to Polygon Amoy
- **Hardhat Configuration** - Ethereum development environment
- **Contract ABI** - Generated interface for frontend/backend interaction

---

## 🏗️ Architecture

### Smart Contract Functions

#### Public Functions (Farmers Can Call)

```solidity
// Buy an insurance policy
function buyPolicy(uint256 rainfallThreshold) payable
- Premium sent in wei (msg.value)
- Payout automatically set to 2x premium
- Emits: PolicyBought event

// View user's policy
function getPolicy(address farmer) view returns (Policy)
- Returns complete policy details
```

#### Owner Functions (Backend Only)

```solidity
// Trigger payout based on weather
function triggerPayout(address farmer, uint256 rainfall)
- Only callable by owner
- Rainfall must exceed threshold
- Prevents double payout
- Sends 2x premium to farmer
- Emits: PayoutTriggered event

// Deactivate policy manually
function deactivatePolicy(address farmer)
- Only callable by owner
- Used when coverage period ends
```

#### View Functions (Everyone)

```solidity
// Check if policy is active
function hasPolicyActive(address farmer) view returns (bool)

// Get contract balance
function getContractBalance() view returns (uint256)

// Get active farmers list
function getActiveFarmers() view returns (address[])

// Get contract statistics
function getStats() view returns (uint256, uint256, uint256)
- Returns: (totalPolicies, totalPayouts, balance)
```

### Events

```solidity
// When policy purchased
event PolicyBought(
  address indexed farmer,
  uint256 premium,
  uint256 payout,
  uint256 rainfallThreshold,
  uint256 timestamp
)

// When payout triggered
event PayoutTriggered(
  address indexed farmer,
  uint256 payoutAmount,
  uint256 rainfall,
  uint256 threshold,
  uint256 timestamp
)

// When policy deactivated
event PolicyDeactivated(address indexed farmer, uint256 timestamp)

// When contract receives funds
event FundsReceived(address indexed sender, uint256 amount, uint256 timestamp)
```

---

## 🔑 Key Features

### 1. **Policy Management**

- Farmers buy policies by sending MATIC
- Each farmer can have only one active policy at a time
- Premium is stored, payout calculated as 2x premium
- Rainfall threshold for automatic payout configured at purchase

### 2. **Secure Payouts**

- Only contract owner can trigger payouts
- Double payout prevention
- Automatic deactivation after payout
- Contract must have sufficient funds

### 3. **Event Tracking**

- All transactions emit events
- Frontend can listen to events
- Real-time payout notifications possible

### 4. **Access Control**

- Owner-only functions protected via `onlyOwner` modifier
- Policy-specific checks prevent invalid operations
- Address validation for all functions

### 5. **Safety Mechanisms**

- Overflow/underflow protection (Solidity 0.8.20+)
- Reentrancy protection (simple checks)
- Input validation (rainfall > 0, premium > 0)

---

## 📁 Directory Structure

```
blockchain/
├── contracts/
│   └── Insurance.sol              # Main smart contract
├── scripts/
│   └── deploy.js                  # Deployment script
├── abi/
│   └── Insurance.json             # Contract ABI (generated at compile)
├── artifacts/                     # Compiled outputs (generated)
├── cache/                         # Hardhat cache (generated)
├── hardhat.config.js              # Hardhat configuration
├── package.json                   # Dependencies
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore list
└── README.md                      # This file
```

---

## 🚀 Quick Start

### Installation

```bash
cd blockchain
npm install
```

### Configuration

```bash
cp .env.example .env

# Edit .env with:
# - PRIVATE_KEY from MetaMask
# - RPC_URL from Alchemy
```

### Compilation

```bash
npm run compile

# Outputs:
# - artifacts/ folder with compiled bytecode
# - abi/Insurance.json with contract interface
```

### Deployment

```bash
npm run deploy

# Outputs deployment info and contract address
```

### Development

```bash
# Start local Hardhat node (for testing)
npm run node

# In another terminal, deploy to local:
npm run deploy:local
```

---

## 🔧 Hardhat Configuration

The `hardhat.config.js` includes:

```javascript
// Networks
- hardhat: Local testing network (default)
- localhost: Running Hardhat node
- amoy: Polygon Amoy testnet (for staging)

// Solidity
- Version: 0.8.20
- Optimization: Enabled (200 runs)

// Environment
- Uses dotenv for configuration
- Private key from environment
- RPC URL from environment
```

---

## 📊 Contract Data Types

### Policy Struct

```javascript
{
  address farmer,           // Farmer's wallet address
  uint256 premium,          // Premium paid (in wei)
  uint256 payout,           // Maximum payout (2x premium)
  uint256 rainfallThreshold,// Rainfall threshold in mm
  bool active,              // Policy currently active
  bool payoutClaimed,       // Payout already claimed
  uint256 purchaseTimestamp // When policy was purchased
}
```

### Mappings

```javascript
mapping(address => Policy) policies     // Farmer address → Policy
mapping(address => bool) farmerExists   // Track farmer existence
address[] activeFarmers                 // List of all active farmer addresses
```

---

## 💰 Transaction Costs

Estimated gas costs on Polygon:

```
Transaction          | Gas Used  | Cost (at 50 gwei)
--------------------------------------------------
Buy Policy          | 150,000   | ~$0.0075 USD
Trigger Payout      | 100,000   | ~$0.0050 USD
View Policy         | 0         | Free (view function)
Get Stats           | 0         | Free (view function)
```

---

## 🔒 Security Considerations

### Implemented

✅ Reentrancy checks (simple)  
✅ Overflow/underflow protection  
✅ Access control (onlyOwner)  
✅ Input validation  
✅ Double payout prevention  

### For Production

⚠️ Get formal security audit  
⚠️ Additional reentrancy guards  
⚠️ Rate limiting  
⚠️ Enhanced access control  
⚠️ Pause mechanisms  

---

## 🧪 Testing

### Local Testing

```bash
# Run Hardhat test node
npm run node

# In another terminal:
npm run deploy:local

# Run tests
npm test
```

### Testet Deployment (Amoy)

```bash
npm run deploy

# Verify on: https://amoy.polygonscan.com/
```

---

## 📈 Deployment Process

1. **Compile** → Generates bytecode and ABI
2. **Prepare Account** → Get private key from MetaMask
3. **Fund Account** → Need MATIC for gas fees
4. **Deploy** → Submit contract to blockchain
5. **Verify** → Check on Polygonscan
6. **Fund Contract** → Send MATIC for payouts
7. **Integrate** → Update backend and frontend

---

## 🌐 Network Configuration

### Polygon Amoy Testnet

```
Network Name: Polygon Amoy
RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Symbol: MATIC
Block Explorer: https://amoy.polygonscan.com/
```

### Add to MetaMask

```
Property              | Value
----------------------------------------
Network Name          | Polygon Amoy
New RPC URL           | https://rpc-amoy.polygon.technology/
Chain ID              | 80002
Currency Symbol       | MATIC
Block Explorer URL    | https://amoy.polygonscan.com/
```

---

## 📚 Integration Guide

### Backend Integration

```javascript
import * as blockchainService from '../utils/blockchainService.js'

// Initialize
await blockchainService.initializeBlockchain()

// Get stats
const stats = await blockchainService.getContractStats()

// Trigger payout
const result = await blockchainService.triggerPayoutOnChain(
  farmerAddress,
  rainfallAmount
)
```

### Frontend Integration

```javascript
import web3 from '../services/web3.js'

// Initialize
await web3.initializeWeb3()

// Connect wallet
const address = await web3.connectWallet()

// Buy policy
const result = await web3.buyPolicy(50, '0.1')

// Listen for events
web3.listenForPayouts((event) => {
  console.log('Payout:', event)
})
```

---

## 🔍 Verification

### Check Deployment

```bash
# After deployment, check deployment-info.json
cat deployment-info.json

# Should show:
{
  "network": "amoy",
  "chainId": 80002,
  "contractAddress": "0x...",
  "deployerAddress": "0x...",
  "deploymentBlock": 12345678,
  "deploymentTimestamp": "2024-01-15T10:30:00.000Z"
}
```

### Check on Polygonscan

1. Go to https://amoy.polygonscan.com/
2. Search for contract address
3. Verify:
   - ✅ Contract code visible
   - ✅ Functions listed
   - ✅ Events logged
   - ✅ Transactions recorded

---

## 🐛 Troubleshooting

### Issue: Compilation fails

```bash
# Solution: Verify Solidity version
npm run compile -- --version

# Try reinstalling
rm -rf node_modules package-lock.json
npm install
npm run compile
```

### Issue: Deployment fails with error

```
Error: insufficient funds for intrinsic transaction cost
```

**Solution:**
- Get testnet MATIC from https://faucet.polygon.technology/
- Wait for confirmation
- Try deployment again

### Issue: Contract not verified on Polygonscan

```bash
# Solution: Contract might auto-verify
# Try manual verification:
# 1. Copy contract source (with comments)
# 2. Go to Polygonscan contract page
# 3. Click "Verify and Publish"
# 4. Select Solidity 0.8.20
# 5. Paste source code
```

### Issue: Gas estimation higher than expected

```bash
# Solution: Increase gas price in .env
GAS_PRICE=100  # Currently 50, try higher

# Or increase gas limit
GAS_LIMIT=6000000  # Some functions may need more
```

---

## 📞 Support Resources

- **Hardhat Docs:** https://hardhat.org/docs
- **Solidity:** https://docs.soliditylang.org/
- **Ethers.js:** https://docs.ethers.org/
- **Polygon:** https://polygon.technology/docs/
- **Polygonscan:** https://amoy.polygonscan.com/
- **MetaMask Help:** https://support.metamask.io/

---

## 📄 License

MIT - See LICENSE file

---

## ✅ Next Steps

1. Read: [Deployment Guide](../BLOCKCHAIN_DEPLOYMENT_GUIDE.md)
2. Follow: [Testing Guide](../BLOCKCHAIN_TESTING_GUIDE.md)
3. Deploy: `npm run deploy`
4. Verify: Check on Polygonscan
5. Integrate: Update backend and frontend
6. Test: Run full test suite

---

**Happy deploying! 🚀**
