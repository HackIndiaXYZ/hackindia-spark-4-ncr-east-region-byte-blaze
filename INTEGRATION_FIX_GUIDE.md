# 🔧 Complete Integration Fix Guide

## ISSUES IDENTIFIED & FIXED

### 1. **Database Schema Issue** ❌ → ✅
**Problem:** Column `password_hash` doesn't exist in the `users` table
- The migration file creates the table with `IF NOT EXISTS`, so if the table existed without this column, the new column was never added

**Fix Applied:**
- Created `backend/db/fix-schema.js` script to add missing columns if they don't exist
- Safely adds `password_hash` and `email` columns with ALTER TABLE

---

### 2. **Authentication Middleware Issue** ❌ → ✅
**Problem:** Middleware was looking for `walletAddress` in JWT but the new unified auth uses `id`, `email`, and `role`
- Old code: `req.walletAddress = decoded.walletAddress` (incorrect for email-based auth)
- This broke all protected routes (profile, transactions, purchases)

**Fix Applied:**
- Updated `backend/middlewares/auth.js` to extract ALL fields from JWT:
  ```javascript
  req.userId = decoded.id
  req.userEmail = decoded.email
  req.userRole = decoded.role
  req.walletAddress = decoded.walletAddress (if present)
  ```

---

### 3. **Policy Controller Issue** ❌ → ✅
**Problem:** Policy controller tried to fetch from smart contract `contractManager.getAllPolicies()` which wasn't initialized
- Would always fail with 500 errors
- No fallback to database

**Fix Applied:**
- Rewritten entire policy controller to use `database.js` functions:
  - `getPolicies()` → calls `db.getAllPolicies()`
  - `getPolicy(id)` → calls `db.getPolicyById(id)`
  - `getUserPolicies()` → calls `db.getUserPolicases(userId)`
  - `purchasePolicy()` → directly creates purchase record in DB
- Removed all `contractManager` references

---

### 4. **User Controller Issue** ❌ → ✅
**Problem:** User endpoints (profile, transactions, purchases) relied on `req.walletAddress` instead of user ID
- This broke when using email-based auth (walletAddress would be undefined)
- Made multiple unnecessary queries

**Fix Applied:**
- Updated all endpoints to use `req.userId` from JWT:
  - `getUserProfile()` → Query users table by `id`
  - `getUserTransactions()` → Call `db.getUserTransactions(userId)`
  - `getUserPurchases()` → Call `db.getUserPurchases(userId)`

---

### 5. **Admin Controller Issue** ❌ → ✅
**Problem:** Admin controller also tried to use `contractManager` for policy creation
- Would fail with uninitialized contract errors

**Fix Applied:**
- Rewritten `createPolicy()` to insert directly into `policies` table
- `getDashboardStats()` now fetches all data from database

---

### 6. **Missing Database Functions** ❌ → ✅
**Problem:** No database functions to fetch policies

**Fix Applied:**
- Added to `database.js`:
  ```javascript
  export async function getAllPolicies()
  export async function getPolicyById(policyId)
  ```
- Also exported `pool` for direct queries when needed

---

## 🔧 STEP-BY-STEP FIX PROCEDURE

### Step 1: Fix Database Schema
```bash
cd backend
node db/fix-schema.js
```

Expected output:
```
🔧 Checking and fixing database schema...
✅ password_hash column already exists (or was just added)
✅ email column already exists (or was just added)

📊 Users table structure:
   - id
   - wallet_address
   - email
   - password_hash
   - role
   - created_at
   - updated_at

✨ Schema validation complete!
```

### Step 2: Run Database Migration (if not done yet)
```bash
node db/migrate.js
```

This will:
- ✅ Create all tables
- ✅ Add indexes for performance
- ✅ Seed 14 insurance policies

---

## 🚀 RUNNING THE APPLICATION

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

Expected logs:
```
🚀 InsuChain Backend Server
===========================
🌐 Server running on http://localhost:5000
✨ Ready to accept requests!
```

### Terminal 2 - Frontend
```bash
cd react
npm install
npm run dev
```

Expected logs:
```
  VITE v8.0.1  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h to show help
```

---

## 🧪 TESTING THE COMPLETE FLOW

### 1. **Test Registration (Farmer)**
```
URL: http://localhost:5173/register
Email: farmer@test.com
Password: password123
Role: Farmer
Wallet: 0x1234567890123456789012345678901234567890
Click: Register
```

**Check Backend Logs:**
```
POST /api/auth/register
✅ Should see success response
```

**Check Database:**
```sql
SELECT id, email, role, password_hash FROM users 
WHERE email = 'farmer@test.com';
-- Should return 1 row with password_hash NOT NULL
```

---

### 2. **Test Login**
```
URL: http://localhost:5173/login
Email: farmer@test.com
Password: password123
Click: Login
```

**Expected:**
- ✅ Token saved to localStorage
- ✅ Redirects to home page
- ✅ Navbar shows "Logout" button
- ✅ Can access /profile

---

### 3. **Test Admin Login**
```
Email: admin@insuchaintest.com
Password: admin123
Click: Login
```

**Expected:**
- ✅ Login succeeds (admin credentials from .env)
- ✅ Navbar shows "Dashboard" link
- ✅ Can access /dashboard

---

### 4. **Test Policy Browsing**
```
URL: http://localhost:5173/policies
```

**Check Backend:**
```
GET /api/policies
✅ Should return array of 14 policies from database
```

**Expected:**
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
      "active": true
    },
    ...
  ],
  "count": 14
}
```

---

### 5. **Test Policy Purchase**
```
As logged-in farmer:
Click: Any policy card → "Purchase Policy"
Confirm: Yes
```

**Check Backend:**
```
POST /api/policies/purchase/1
Authorization: Bearer {token}

✅ Should create purchase record in database
```

**Check Database:**
```sql
SELECT * FROM purchases WHERE user_id = 1;
-- Should show new purchase with status 'active'
```

---

### 6. **Test Profile Access**
```
URL: http://localhost:5173/profile
```

**Check Backend:**
```
GET /api/users/profile
Authorization: Bearer {token}

✅ Should return user data
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "farmer@test.com",
    "walletAddress": "0x1234567890123456789012345678901234567890",
    "role": "farmer",
    "createdAt": "2025-03-20T10:00:00.000Z"
  }
}
```

---

## 🐛 TROUBLESHOOTING

### Error: "password_hash" column doesn't exist
**Solution:** Run the fix-schema script
```bash
node backend/db/fix-schema.js
```

### Error: 401 "Access token required"
**Solution:** 
- Make sure you're logged in
- Token should be in localStorage
- Check DevTools → Application → localStorage → `token`

### Error: 404 "Policy not found"
**Solution:**
- Policies weren't seeded
- Run migration: `node backend/db/migrate.js`
- Check database: `SELECT COUNT(*) FROM policies;` should show 14

### Error: 500 "Failed to fetch policies"
**Solution:**
- Backend error in logs
- Check if policies table exists
- Check if database connection is working

### Frontend shows blank white screen
**Solution:**
- Check browser console for errors
- Clear localStorage: `localStorage.clear()`
- Hard refresh: Ctrl+Shift+R
- Check if backend is running on port 5000

---

## 📊 API ENDPOINTS (CORRECTED)

### Public Endpoints
```
GET  /api/policies              ✅ Fetch all policies from DB
GET  /api/policies/:id          ✅ Fetch policy by ID from DB
POST /api/auth/register         ✅ Email+password registration
POST /api/auth/login            ✅ Email+password login
GET  /health                    ✅ Server health check
```

### Protected Endpoints (Require JWT)
```
GET  /api/users/profile                 ✅ Get user data by ID
GET  /api/users/transactions            ✅ Get user transactions
GET  /api/users/purchases               ✅ Get user purchases
GET  /api/policies/user/mypolicies      ✅ Get user's purchased policies
GET  /api/policies/user/payout          ✅ Get payout balance
POST /api/policies/purchase/:id         ✅ Purchase a policy
```

### Admin Endpoints (Require JWT + admin role)
```
POST /api/admin/policies/create         ✅ Create new policy (DB)
GET  /api/admin/users                   ✅ Get all users
GET  /api/admin/dashboard               ✅ Get dashboard stats (DB)
```

---

## ✅ VERIFICATION CHECKLIST

Before deploying, verify:

- [ ] Backend running on http://localhost:5000
- [ ] Frontend running on http://localhost:5173
- [ ] Database migration completed
- [ ] Schema fix script run successfully
- [ ] 14 policies visible at /policies
- [ ] Can register as both farmer and admin
- [ ] Can login with email+password
- [ ] JWT tokens persist across page refresh
- [ ] Protected routes require authentication
- [ ] Admin dashboard only accessible as admin
- [ ] Policy purchase creates DB records
- [ ] Profile shows correct user data
- [ ] No 500 errors in console

---

## 📝 SUMMARY OF CHANGES

| File | Issue | Fix |
|------|-------|-----|
| `auth.js` middleware | Using walletAddress instead of userId | Extract all JWT fields (id, email, role) |
| `policyController.js` | Using contract manager | Use database functions instead |
| `userController.js` | Using walletAddress in protected routes | Use userId from JWT |
| `adminController.js` | Using contract manager | Use database queries |
| `database.js` | No policy fetch functions | Added getAllPolicies(), getPolicyById() |
| `migrate.js` | Password hash column missing | Already in schema, but can't add to existing table |
| NEW: `fix-schema.js` | Add missing columns safely | Checks and adds columns with ALTER TABLE |

---

## 🎉 Everything should work now!

If you still encounter issues:
1. Check backend console for error messages
2. Check browser console (F12) for frontend errors
3. Verify database connection with: `psql $DATABASE_URL` (Neon)
4. Check JWT token in localStorage with DevTools

Happy coding! 🚀
