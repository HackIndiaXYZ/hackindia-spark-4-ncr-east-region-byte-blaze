# Backend Setup & Troubleshooting Guide

## Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create .env File
Copy `.env.example` to `.env` and fill in required values:
```bash
cp .env.example .env
```

**MINIMUM REQUIRED** (Backend will fail to start without these):
```
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_super_secret_key_change_in_production
```

**Optional but Recommended** (Blockchain features):
```
PRIVATE_KEY=your_wallet_private_key
RPC_URL=https://rpc-amoy.polygon.technology/
CONTRACT_ADDRESS=0xYourDeployedContractAddress
WEATHER_API_KEY=your_openweathermap_key
```

### 3. Start Backend Server
```bash
npm start
```

Expected output if everything is working:
```
✅ Database connection established
⛓️  Initializing blockchain service...
✅ Connected to network: Polygon Amoy (Chain ID: 80002)
✅ Blockchain service initialized successfully
🚀 InsuChain Backend Server running on http://localhost:5000
✨ Ready to accept requests!
```

### 4. Test Server with Frontend
Start frontend in another terminal:
```bash
cd react
npm run dev
```

## Environment Variables Explained

### Server Configuration
| Variable | Required | Default | Example |
|----------|----------|---------|---------|
| `PORT` | No | 5000 | 5000 |
| `NODE_ENV` | No | development | development, production |
| `FRONTEND_URL` | No | http://localhost:5173 | http://localhost:3000 |

### Database Configuration
| Variable | Required | Type | Example |
|----------|----------|------|---------|
| `DATABASE_URL` | ✅ Yes | String | postgresql://user:pass@host:5432/db |
| OR `DB_USER` | * | String | neondb_owner |
| OR `DB_PASSWORD` | * | String | your_password |
| OR `DB_HOST` | * | String | ep-...amazonaws.com |
| OR `DB_PORT` | No | Number | 5432 |
| OR `DB_NAME` | * | String | neondb |

*Required if not using DATABASE_URL

### Authentication
| Variable | Required | Purpose |
|----------|----------|---------|
| `JWT_SECRET` | ✅ Yes | Sign JWT tokens (must be long & random) |
| `ADMIN_EMAIL` | No | Admin login email |
| `ADMIN_PASSWORD` | No | Admin login password |

### Blockchain (Polygon Amoy Testnet)
| Variable | Required | Purpose |
|----------|----------|---------|
| `PRIVATE_KEY` | No* | Wallet private key for transactions |
| `RPC_URL` | No* | Polygon RPC endpoint |
| `CONTRACT_ADDRESS` | No* | Deployed contract address |

*Required for blockchain features (policy purchases, payouts)

### Weather & Features
| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `WEATHER_API_KEY` | No | - | OpenWeatherMap API key |
| `ENABLE_BLOCKCHAIN_MONITORING` | No | true | Enable payout monitoring |
| `ENABLE_WEATHER_MONITORING` | No | false | Enable auto payouts |

## Common Issues & Solutions

### ❌ Error: Could not find DATABASE_URL
**Problem**: Database environment variable not set
**Solution**: Set `DATABASE_URL` in `.env` file
```bash
DATABASE_URL=postgresql://user:password@host:port/database
```

### ❌ Error: Database connection failed
**Problem**: Database credentials incorrect or database unreachable
**Solution**: 
1. Verify credentials are correct
2. Check if database host is reachable
3. Check if database exists
4. Check firewall/network settings

Test connection:
```bash
# Install psql if needed: brew install postgresql (Mac) or apt install postgresql (Linux)
psql postgresql://user:password@host:port/database
```

### ❌ Error: Missing required environment variables: JWT_SECRET
**Problem**: `JWT_SECRET` not set in `.env`
**Solution**: 
```bash
# Generate a random secret (example):
echo $(openssl rand -base64 32)
# Add to .env:
JWT_SECRET=your_generated_secret
```

### ⚠️ Warning: Missing blockchain environment variables
**Problem**: Blockchain won't initialize (optional feature)
**Solution**: 
- This is OK if you don't need blockchain features yet
- Set variables if you want full functionality:
```
PRIVATE_KEY=your_private_key_without_0x
RPC_URL=https://rpc-amoy.polygon.technology/
CONTRACT_ADDRESS=0x...
```

### ❌ Error: Contract ABI not found
**Problem**: Blockchain service can't find contract ABI file
**Solution**: 
1. Generate contracts: Run hardhat in blockchain folder
```bash
cd blockchain
npx hardhat compile
```
2. Verify ABI exists at `blockchain/abi/Insurance.json`

### ❌ Port 5000 already in use
**Problem**: Another service using port 5000
**Solution**: 
```bash
# Option 1: Use different port
PORT=5001 npm start

# Option 2: Kill process on port 5000 (Linux/Mac)
lsof -ti:5000 | xargs kill -9

# Option 2: Kill process on port 5000 (Windows PowerShell)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process
```

### ❌ Error: Unexpected error on idle client
**Problem**: Connection pool error
**Solution**: 
1. Check database is running
2. Try restarting server
3. Check if max connections exceeded (increase connection limit)

### ⚠️ Blockchain service initialization failed
**Problem**: Blockchain features not available
**Solution**:
1. Optional if not using blockchain features
2. If needed, ensure all blockchain env vars are set:
   - `PRIVATE_KEY`
   - `RPC_URL`
   - `CONTRACT_ADDRESS`
3. Check contract ABI exists
4. Check wallet has MATIC on Polygon Amoy testnet

## Testing the Backend

### Test 1: Health Check
```bash
curl http://localhost:5000/health
```
Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test 2: Get All Policies
```bash
curl http://localhost:5000/api/policies
```

### Test 3: Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123",
    "role": "farmer",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d"
  }'
```

### Test 4: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123"
  }'
```

## Database Tables (Reference)

The backend expects these tables (auto-managed by application):
- `users` - User accounts
- `policies` - Insurance policies
- `purchases` - Policy purchases
- `transactions` - Blockchain transactions
- `admin_credentials` - Admin login credentials

Connection string format:
```
postgresql://[user[:password]@][host][:port][/dbname]
```

## Debugging Tips

### 1. Enable Verbose Logging
Check console output for detailed logs:
```
📨 POST /api/auth/login
✅ Database connection established
⛓️  Initializing blockchain service...
```

### 2. Check Logs for Errors
Server logs all operations:
- Request logs with method and path
- Database errors
- Blockchain initialization
- Authentication attempts

### 3. Test with Postman
Use Postman to test API endpoints more easily:
1. Download Postman
2. Create requests for each endpoint
3. Add Bearer token to Authorization header for protected routes

### 4. Monitor SQL Queries
Add detailed DB logging:
```javascript
// In database.js, before queries:
console.log('Executing query:', sqlString);
```

## Performance Tips

1. **Database Connection Pool**
   - Connection pool auto-managed
   - Check `pg` package settings if needed

2. **Blockchain Monitoring**
   - Optional scheduled task (runs hourly)
   - Can be disabled with `ENABLE_BLOCKCHAIN_MONITORING=false`

3. **Memory Usage**
   - Monitor for large data fetches
   - Implement pagination for large result sets

## Next Steps

1. ✅ Backend running locally
2. → Take the [API endpoints documentation](./BLOCKCHAIN_API_REFERENCE.md) (if available)
3. → Connect frontend
4. → Test full integration
5. → Deploy to production

## Production Deployment

When deploying to production:

1. **Environment Variables**
   - Use secure .env management (AWS Secrets Manager, etc.)
   - Never commit `.env` to version control
   - Rotate JWT_SECRET regularly

2. **Security**
   - Set `NODE_ENV=production`
   - Use HTTPS only
   - Limit CORS origin to production frontend URL
   - Rate limit API endpoints

3. **Database**
   - Use production database server
   - Enable SSL connections
   - Set up automated backups
   - Monitor connection pool

4. **Blockchain**
   - Use mainnet contract address
   - Use secure private key management (AWS KMS, etc.)
   - Test on testnet thoroughly first

5. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Track performance metrics
   - Monitor blockchain transactions

---

**Need Help?**
- Check the logs in console
- Review error messages carefully
- Look for the specific error code or message
- Verify all environment variables are set correctly
