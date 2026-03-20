# ⚡ InsuChain Blockchain - Quick Start Guide

Fast setup guide to get your blockchain system up and running in minutes.

---

## 🚀 5-Minute Setup

### Step 1: Install & Config Blockchain (2 min)

```bash
# Install dependencies
cd blockchain
npm install

# Create .env
cp .env.example .env

# Edit .env with your values:
# PRIVATE_KEY=your_key_from_metamask
# RPC_URL=your_alchemy_url
```

### Step 2: Deploy Contract (2 min)

```bash
# Compile and deploy
npm run deploy

# Save the contract address output!
```

### Step 3: Setup Backend (1 min)

```bash
cd backend

# Add to .env:
# CONTRACT_ADDRESS=0x[your_address]
# PRIVATE_KEY=[your_key]
# RPC_URL=[your_rpc_url]

# Start backend
npm start
```

### Step 4: Setup Frontend (0 min)

```bash
cd react

# Add to .env.local:
# VITE_CONTRACT_ADDRESS=0x[your_address]

# Start frontend
npm run dev
```

---

## 🧪 Test It

1. Open http://localhost:5173
2. Connect MetaMask
3. Buy a policy
4. Check Polygonscan: [Your TX Hash]
5. Done! ✅

---

## 📚 Full Documentation

- **Deployment Guide:** [BLOCKCHAIN_DEPLOYMENT_GUIDE.md](./BLOCKCHAIN_DEPLOYMENT_GUIDE.md)
- **Testing Guide:** [BLOCKCHAIN_TESTING_GUIDE.md](./BLOCKCHAIN_TESTING_GUIDE.md)

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| "No contract address" | Run `npm run deploy` in blockchain/ |
| "MetaMask not installed" | Download from metamask.io |
| "Wrong network" | Add Polygon Amoy in MetaMask |
| "No balance" | Get testnet MATIC from faucet.polygon.technology |
| "Transaction failed" | Check contract balance, try again |

---

## 📁 File Structure

```
blockchain/
├── contracts/
│   └── Insurance.sol          # Smart contract
├── scripts/
│   └── deploy.js              # Deployment script
├── abi/
│   └── Insurance.json         # Contract ABI (generated)
├── hardhat.config.js
├── .env.example
└── package.json

backend/
├── utils/
│   └── blockchainService.js   # Blockchain integration
├── controllers/
│   └── adminController.js     # Cron jobs
└── server.js

react/
├── src/
│   ├── services/web3.js       # Frontend web3
│   └── components/
│       ├── BlockchainPolicyBuyer.jsx
│       └── BlockchainDashboard.jsx
└── public/abi/
    └── Insurance.json
```

---

## 🎯 Key Features

✅ Buy insurance policies via MetaMask  
✅ Smart contract on Polygon Amoy  
✅ Automatic payout triggering via cron job  
✅ Dashboard with real-time updates  
✅ Event listeners for notifications  
✅ MetaMask wallet integration  
✅ Error handling & validation  

---

## 📞 Support

- **Troubleshoot:** See guides above
- **Docs:** https://docs.ethers.org/
- **Network:** https://polygon.technology/docs
- **Explorer:** https://amoy.polygonscan.com/

---

**Ready to deploy? → [Full Deployment Guide](./BLOCKCHAIN_DEPLOYMENT_GUIDE.md)**

**Want to test? → [Testing Guide](./BLOCKCHAIN_TESTING_GUIDE.md)**
