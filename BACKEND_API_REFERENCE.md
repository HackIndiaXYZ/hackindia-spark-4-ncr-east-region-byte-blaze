# Backend API Quick Reference Guide

## Base URL
```
http://localhost:5000
```

## Authentication
All protected endpoints require bearer token in Authorization header:
```
Authorization: Bearer <JWT_TOKEN>
```

## Status Codes
| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate email) |
| 500 | Server Error |

---

## PUBLIC ENDPOINTS (No Auth Required)

### 1. Health Check
```
GET /health
```
**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 2. Get All Policies
```
GET /api/policies
```
**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Rainfall Insurance Basic",
      "premium": "50000000000000000",
      "payout": "500000000000000000",
      "rainfall_threshold": 100,
      "temperature_min": -10,
      "temperature_max": 40,
      "active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 14
}
```

---

### 3. Get Single Policy
```
GET /api/policies/:policyId
```
**Parameters:**
- `policyId` (path) - Policy ID (required)

**Response:** Same as above, single policy

---

### 4. Register User
```
POST /api/auth/register
```
**Body:**
```json
{
  "email": "farmer@example.com",
  "password": "SecurePass123",
  "role": "farmer",
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d"
}
```

**Validation:**
- Email: Valid email format required
- Password: Min 6 chars, must have uppercase, lowercase, number
- Role: "farmer" or "admin"
- Wallet: Valid Ethereum address format (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "farmer@example.com",
      "role": "farmer",
      "walletAddress": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d"
    }
  },
  "message": "Registration successful"
}
```

---

### 5. Login
```
POST /api/auth/login
```
**Body:**
```json
{
  "email": "farmer@example.com",
  "password": "SecurePass123"
}
```

**Validation:**
- Email: Valid email format required
- Password: Required, non-empty

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "email": "farmer@example.com",
      "role": "farmer",
      "walletAddress": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d"
    }
  },
  "message": "Login successful"
}
```

---

## PROTECTED ENDPOINTS (Auth Required)

### 1. Get User Profile
```
GET /api/users/profile
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "farmer@example.com",
    "wallet_address": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d",
    "role": "farmer",
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 2. Get User Transactions
```
GET /api/users/transactions
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "tx_hash": "0x123abc...",
      "tx_type": "policy_purchase",
      "amount": "50000000000000000",
      "status": "pending",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 3. Get User Purchases
```
GET /api/users/purchases
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "policy_id": 1,
      "status": "active",
      "premium": "50000000000000000",
      "payout": "500000000000000000",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### 4. Get User's Policies (Purchases)
```
GET /api/policies/user/mypolicies
Headers: Authorization: Bearer <token>
```

**Response:** Array of user's purchased policies

---

### 5. Get Payout Balance
```
GET /api/policies/user/payout
Headers: Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": 1,
    "totalPayoutWei": "0",
    "totalPayoutETH": "0"
  }
}
```

---

### 6. Purchase Policy
```
POST /api/policies/:policyId/purchase
Headers: Authorization: Bearer <token>
Content-Type: application/json
```

**Parameters:**
- `policyId` (path) - Policy ID to purchase

**Body (optional):**
```json
{
  "walletAddress": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "purchaseId": 1,
    "policyId": 1,
    "userId": 1,
    "status": "pending_confirmation",
    "txHash": "0x123abc...",
    "premium": "50000000000000000",
    "payout": "500000000000000000",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Policy purchased successfully"
}
```

---

## ADMIN ENDPOINTS (Admin Auth Required)

### 1. Get All Users
```
GET /api/admin/users
Headers: Authorization: Bearer <admin_token>
Query Parameters:
  - limit: 100 (default)
  - offset: 0 (default)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "wallet_address": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d",
      "role": "farmer",
      "email": "farmer@example.com",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

---

### 2. Get Admin Dashboard
```
GET /api/admin/dashboard
Headers: Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "totalPolicies": 14,
    "totalUsers": 5,
    "totalFarmers": 4,
    "totalAdmins": 1,
    "totalPoliciesSold": 10,
    "totalPayoutsTriggered": 2
  }
}
```

---

### 3. Create Policy
```
POST /api/admin/policies/create
Headers: Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "New Weather Insurance",
  "premium": "50000000000000000",
  "payout": "500000000000000000",
  "rainfallThreshold": 100,
  "temperatureMin": -10,
  "temperatureMax": 40
}
```

**Validation:**
- All fields required
- premium, payout, rainfallThreshold must be positive numbers
- temperatureMin must be < temperatureMax

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 15,
    "name": "New Weather Insurance",
    "premium": "50000000000000000",
    "payout": "500000000000000000",
    "rainfallThreshold": 100,
    "temperatureMin": -10,
    "temperatureMax": 40,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Policy created successfully"
}
```

---

### 4. Trigger Payout
```
POST /api/admin/payouts/trigger
Headers: Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Body:**
```json
{
  "userId": 1,
  "policyId": 1,
  "rainfall": 120,
  "temperature": 25
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "purchaseId": 1,
    "policyId": 1,
    "payoutAmount": "500000000000000000",
    "status": "paid_out",
    "message": "Payout triggered successfully"
  }
}
```

---

## EXAMPLES

### Example 1: Register & Login Flow

```bash
# 1. Register new farmer
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@farm.com",
    "password": "MyPassword123",
    "role": "farmer",
    "walletAddress": "0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d"
  }'

# Save the token from response
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# 2. Login with credentials
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@farm.com",
    "password": "MyPassword123"
  }'

# 3. Get user profile
curl http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

### Example 2: Purchase Policy Flow

```bash
# 1. Get available policies
curl http://localhost:5000/api/policies

# 2. Purchase policy 1
curl -X POST http://localhost:5000/api/policies/1/purchase \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json"

# 3. Check user's purchases
curl http://localhost:5000/api/policies/user/mypolicies \
  -H "Authorization: Bearer $TOKEN"

# 4. Check payout balance
curl http://localhost:5000/api/policies/user/payout \
  -H "Authorization: Bearer $TOKEN"
```

### Example 3: Admin Operations

```bash
# 1. Create new policy
curl -X POST http://localhost:5000/api/admin/policies/create \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Premium Weather Guard",
    "premium": "100000000000000000",
    "payout": "1000000000000000000",
    "rainfallThreshold": 80,
    "temperatureMin": -15,
    "temperatureMax": 45
  }'

# 2. View all users
curl http://localhost:5000/api/admin/users \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# 3. View dashboard
curl http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer $ADMIN_TOKEN"
```

---

## Error Examples

### Validation Error (400)
```json
{
  "success": false,
  "errors": [
    "Valid email is required",
    "Password must be at least 6 characters with uppercase, lowercase, and numbers"
  ]
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "error": "Access token required"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "error": "Admin access required"
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": "Policy not found"
}
```

### Conflict (409)
```json
{
  "success": false,
  "error": "Email already registered"
}
```

---

## Important Notes

1. **Timestamps**: All timestamps are in ISO 8601 format (UTC)
2. **Bigints**: Premium and payout amounts are in Wei (smallest MATIC unit)
   - 1 MATIC = 10^18 Wei
   - To convert: Wei ÷ 10^18 = MATIC
3. **Tokens**: JWT tokens expire after 7 days for farmers, 24 hours for admins
4. **Wallet Addresses**: Must be valid Ethereum addresses (0x prefix + 40 hex chars)
5. **Password Policy**: Min 6 chars, requires uppercase, lowercase, and number

---

## Rate Limiting

Currently no rate limiting implemented. Consider adding for production.

## Pagination

Supported on:
- `GET /api/admin/users` - `limit` and `offset` query parameters

---

For more details, see [BACKEND_SETUP_GUIDE.md](./BACKEND_SETUP_GUIDE.md)
