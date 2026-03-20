# Frontend-Backend Integration Testing Checklist

## Pre-Integration Setup ✅

- [ ] Backend started with `npm start`
- [ ] Frontend started with `npm run dev`
- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Backend logs show "Ready to accept requests"
- [ ] No CORS errors in browser console
- [ ] Environment variables configured correctly (.env file exists)

## API Connectivity Tests ✅

### 1. Health Check
- [ ] GET `/health` returns 200 status
- [ ] Response includes `status: "ok"` and `timestamp`
```javascript
// Frontend test code
fetch('http://localhost:5000/health')
  .then(r => r.json())
  .then(data => console.log(data))
```

### 2. GET Policies Endpoint
- [ ] GET `/api/policies` returns 200 without authentication
- [ ] Response has `success: true` and `data` array
- [ ] Each policy has required fields: id, name, premium, payout, rainfall_threshold
```javascript
fetch('http://localhost:5000/api/policies')
  .then(r => r.json())
  .then(data => console.log(data))
```

## Authentication Tests ✅

### 1. User Registration (Farmer)
- [ ] POST `/api/auth/register` with valid farmer data returns 201
- [ ] Response includes JWT token
- [ ] Token can be decoded to verify user data
- [ ] Password strength validation works:
  - [ ] Weak passwords rejected
  - [ ] Strong passwords accepted (uppercase, lowercase, number)
- [ ] Email validation works:
  - [ ] Invalid emails rejected
  - [ ] Valid emails accepted
- [ ] Email duplicates rejected (409 conflict)

```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'farmer@test.com',
    password: 'SecurePass123',
    role: 'farmer',
    walletAddress: '0x742d35Cc6634C0532925a3b844Bc2e7282c0cD3d'
  })
});
const data = await response.json();
console.log('Token:', data.data.token);
```

### 2. User Login (Farmer)
- [ ] POST `/api/auth/login` with valid credentials returns 200
- [ ] Response includes JWT token
- [ ] Invalid credentials return 401
- [ ] Email/password validation works
- [ ] Correct user data returned in token

```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'farmer@test.com',
    password: 'SecurePass123'
  })
});
const data = await response.json();
localStorage.setItem('token', data.data.token);
```

### 3. Token Usage in Protected Routes
- [ ] Requests without token return 401 "Access token required"
- [ ] Requests with invalid token return 403 "Invalid or expired token"
- [ ] Requests with valid token work correctly

```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

## User Routes Tests ✅

### 1. Get User Profile
- [ ] GET `/api/users/profile` with valid token returns user data
- [ ] Returns correct user ID, email, role, wallet address
- [ ] Without token returns 401

### 2. Get User Transactions
- [ ] GET `/api/users/transactions` returns user's transaction history
- [ ] Without token returns 401
- [ ] Returns array of transactions with tx_hash, tx_type, amount, status

### 3. Get User Purchases
- [ ] GET `/api/users/purchases` returns user's policy purchases
- [ ] Without token returns 401
- [ ] Returns array of purchases with purchase details

## Policy Routes Tests ✅

### 1. Get All Policies
- [ ] GET `/api/policies` returns all active policies
- [ ] Each policy has correct structure
- [ ] Premium and payout are correctly formatted numbers

### 2. Get Single Policy
- [ ] GET `/api/policies/:id` returns correct policy
- [ ] Invalid ID returns 404
- [ ] Returns all policy details

### 3. Get User Policies
- [ ] GET `/api/policies/user/mypolicies` returns only user's purchases
- [ ] Without token returns 401
- [ ] Returns array of user's purchased policies

### 4. Get Payout Balance
- [ ] GET `/api/policies/user/payout` returns user's total payout balance
- [ ] Without token returns 401
- [ ] Returns `totalPayoutWei` and `totalPayoutETH`
- [ ] Balances are correctly calculated numbers

### 5. Purchase Policy
- [ ] POST `/api/policies/:id/purchase` creates purchase record
- [ ] Without token returns 401
- [ ] Returns purchase ID and status
- [ ] DB record created successfully
- [ ] Frontend can track purchase status

```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/policies/1/purchase', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
const data = await response.json();
console.log('Purchase ID:', data.data.purchaseId);
```

## Admin Routes Tests ✅ (Requires Admin Token)

### 1. Admin Registration
- [ ] POST `/api/auth/register` with role: 'admin' works (if allowed)
- [ ] Or admin created via database
- [ ] Admin token has role: 'admin' in JWT

### 2. Admin Access Control
- [ ] GET `/api/admin/users` without admin token returns 403
- [ ] GET `/api/admin/users` with farmer token returns 403
- [ ] GET `/api/admin/users` with admin token returns 200 and users list

### 3. Admin Dashboard
- [ ] GET `/api/admin/dashboard` with admin token returns statistics
- [ ] Includes total policies, users, farmers, admins, policies sold
- [ ] All numbers are valid and positive

### 4. Create Policy (Admin)
- [ ] POST `/api/admin/policies/create` creates new policy
- [ ] Requires admin token
- [ ] Valid policy data accepted
- [ ] Policy appears in GET `/api/policies`

```javascript
const token = adminToken;
const response = await fetch('http://localhost:5000/api/admin/policies/create', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'New Policy',
    premium: '50000000000000000',
    payout: '500000000000000000',
    rainfallThreshold: 100,
    temperatureMin: -10,
    temperatureMax: 40
  })
});
```

### 5. Trigger Payout
- [ ] POST `/api/admin/payouts/trigger` accepts valid request
- [ ] Returns payout status

## Blockchain Integration Tests ✅

### 1. Blockchain Initialization
- [ ] Backend logs show blockchain initialization
- [ ] If blockchain env vars set: "Blockchain service initialized"
- [ ] If not set: Warning shown but server still starts
- [ ] No crashes or hard failures

### 2. Contract Connection (If Configured)
- [ ] Blockchain logs show network connection
- [ ] Correct network shown (Polygon Amoy)
- [ ] Contract address logged
- [ ] Signer address logged

### 3. Policy Purchase with Blockchain
- [ ] Purchase creates DB record (always)
- [ ] If blockchain configured:
  - [ ] Response includes `txHash`
  - [ ] Status shows "pending_confirmation"
  - [ ] Transaction record created
- [ ] If blockchain not configured:
  - [ ] Response includes `blockchainWarning`
  - [ ] Status shows "created"
  - [ ] DB record still created successfully

## Frontend Display Tests ✅

### 1. Auth Pages
- [ ] Login form displays correctly
- [ ] Registration form displays correctly
- [ ] Form validation shows error messages for invalid input
- [ ] Success redirects to appropriate page
- [ ] Token stored in localStorage after login

### 2. Dashboard/Home
- [ ] Loads policies from backend
- [ ] Displays list of available policies
- [ ] Shows correct policy information
- [ ] Can navigate to policy details

### 3. Profile Page
- [ ] Displays logged-in user's information
- [ ] Shows user's purchases (if any)
- [ ] Shows payout balance (if any)
- [ ] Displays user's transactions (if any)

### 4. Purchase Flow
- [ ] User can select policy to purchase
- [ ] Purchase button sends correct request
- [ ] Loading state shown during purchase
- [ ] Success message displayed
- [ ] Purchase appears in user's purchases list

### 5. Admin Dashboard (Admin Users)
- [ ] Displays dashboard statistics
- [ ] Shows list of users
- [ ] Can create new policy
- [ ] Admin-only features hidden from farmers

## Error Handling Tests ✅

### 1. Network Errors
- [ ] Backend down: Frontend shows appropriate error
- [ ] CORS errors: Clearly displayed
- [ ] Connection timeouts: Graceful handling

### 2. Validation Errors
- [ ] Invalid email: Error shown
- [ ] Weak password: Detailed requirements shown
- [ ] Missing fields: Specific field errors shown
- [ ] Invalid inputs: Clear error messages

### 3. Authorization Errors
- [ ] Expired token: Redirects to login
- [ ] Missing token: Redirects to login
- [ ] Insufficient permissions: Error message shown

### 4. Server Errors
- [ ] 500 errors: User-friendly message shown
- [ ] Not found (404): Appropriate message shown
- [ ] Conflict (409): Duplicate email message shown

## Performance Tests ✅

### 1. Load Times
- [ ] Policies load quickly (< 1 second)
- [ ] User profile loads quickly
- [ ] Admin dashboard loads in reasonable time
- [ ] No unnecessary API calls

### 2. Response Times
- [ ] Login response: < 500ms
- [ ] Policy fetch: < 500ms
- [ ] Purchase: < 1000ms
- [ ] Admin dashboard: < 1000ms

### 3. Network Tab
- [ ] Check browser DevTools Network tab
- [ ] Verify only necessary requests made
- [ ] Check request/response sizes
- [ ] No failed requests (404, 500, etc.)

## Data Consistency Tests ✅

### 1. Data Synchronization
- [ ] After purchase, policy appears in user's purchases
- [ ] Payout balance updates after purchase
- [ ] Transaction history includes all transactions
- [ ] Admin dashboard numbers match actual data

### 2. User Session
- [ ] Token persists after page refresh
- [ ] User stays logged in across navigation
- [ ] Logout clears token and redirects
- [ ] Login from different tab works

## Integration Scenarios ✅

### Scenario 1: New User Registration → Purchase Policy
1. [ ] User registers on frontend
2. [ ] Taken to login page
3. [ ] User logs in
4. [ ] Redirected to dashboard
5. [ ] User views policies
6. [ ] User clicks purchase
7. [ ] Purchase successful
8. [ ] Policy appears in "My Policies"
9. [ ] Payout balance shows 0 (no payouts yet)

### Scenario 2: Admin Creates Policy → Farmer Purchases → Check Stats
1. [ ] Admin logs in
2. [ ] Admin creates new policy
3. [ ] Policy appears in public list
4. [ ] Farmer logs in
5. [ ] Farmer sees new policy
6. [ ] Farmer purchases policy
7. [ ] Admin checks dashboard
8. [ ] Stats show updated policy sold count

### Scenario 3: Blockchain Integration (If Enabled)
1. [ ] User purchases policy
2. [ ] Response includes transaction hash
3. [ ] Status shows "pending_confirmation"
4. [ ] Transaction appears in transaction history
5. [ ] Transaction status tracked

## Documentation Tests ✅

- [ ] Backend setup guide is followed successfully
- [ ] Environment variables are correctly documented
- [ ] API endpoints are correctly documented
- [ ] Error codes and messages are documented
- [ ] Frontend developers can integrate based on docs

## Final Sign-Off ✅

### Backend
- [ ] All endpoints functioning
- [ ] Database connections stable
- [ ] Blockchain service (if enabled) working
- [ ] Error handling appropriate
- [ ] Logs show correct information
- [ ] No console errors or warnings

### Frontend
- [ ] All pages displaying correctly
- [ ] All API calls working
- [ ] Authentication flow complete
- [ ] User data persisting
- [ ] No console errors
- [ ] UI is responsive

### Integration
- [ ] Frontend successfully communicates with backend
- [ ] All features working end-to-end
- [ ] Error messages clear and helpful
- [ ] Performance acceptable
- [ ] Ready for production testing

---

**Integration Test Completed:** [ ] Date: _______
**Tested By:** _______
**Issues Found:** _______
**Resolution:** _______

Use this checklist for quality assurance before deploying to production!
