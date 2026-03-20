# InsuChain - Complete Setup & Testing Guide

## 🎉 Project Overview

InsuChain is a decentralized weather-based crop insurance platform built with:
- **Backend:** Node.js + Express + PostgreSQL + Smart Contracts
- **Frontend:** React + Vite + React Router + Axios
- **Authentication:** JWT with localStorage persistence
- **Blockchain:** Web3 integration with smart contracts

---

## 📋 Prerequisites

Before starting, ensure you have:
- Node.js v16+ and npm
- PostgreSQL 12+ (or use Neon for cloud DB)
- A modern web browser
- Git

---

## 🚀 Quick Start (Complete)

### 1. **Backend Setup**

#### Clone/Navigate to Backend
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

#### Create .env File
```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_2YhzpeSPmn1X@ep-royal-thunder-amri5u5a-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production

# Admin Credentials
ADMIN_EMAIL=admin@insuchaintest.com
ADMIN_PASSWORD=admin123

# Weather API
WEATHER_API_KEY=your_openweathermap_api_key

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

#### Run Database Migration
```bash
node db/migrate.js
```

**Output should show:**
```
🚀 Starting database migration...
✅ Users table created
✅ Policies table created
✅ Purchases table created
✅ Transactions table created
✅ Weather logs table created
✅ Admin credentials table created
✅ Indexes created
✨ Migration completed successfully!
✅ Policies seeded successfully
```

#### Start Backend Server
```bash
# Development mode with hot reload
npm run dev

# Or standard mode
npm start
```

**Expected Output:**
```
📨 GET /health
✅ Server running on http://localhost:5000
```

---

### 2. **Frontend Setup**

#### Navigate to React folder
```bash
cd react
```

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm run dev
```

**Expected Output:**
```
  VITE v8.0.1  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## 🧪 Testing All Features in Postman

### Import Postman Collection
1. Open Postman
2. Create new collection: "InsuChain"
3. Set **Collection Variables:**
   - `base_url`: `http://localhost:5000/api`
   - `admin_token`: (fill after login)
   - `farmer_token`: (fill after login)
   - `farmer_email`: (fill after registration)

---

## 🔐 Authentication Flow

### 1️⃣ **Admin Registration & Login**

#### POST `/auth/register` - Register as Admin
```json
{
  "email": "admin@insuchaintest.com",
  "password": "admin123",
  "role": "admin",
  "walletAddress": null
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "email": "admin@insuchaintest.com",
      "role": "admin",
      "walletAddress": null
    }
  }
}
```

#### POST `/auth/login` - Admin Login
```json
{
  "email": "admin@insuchaintest.com",
  "password": "admin123"
}
```

✅ **Save the token** to `admin_token` variable

---

### 2️⃣ **Farmer Registration & Login**

#### POST `/auth/register` - Register as Farmer
```json
{
  "email": "farmer1@example.com",
  "password": "password123",
  "role": "farmer",
  "walletAddress": "0x1234567890123456789012345678901234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 2,
      "email": "farmer1@example.com",
      "role": "farmer",
      "walletAddress": "0x1234567890123456789012345678901234567890"
    }
  }
}
```

#### POST `/auth/login` - Farmer Login
```json
{
  "email": "farmer1@example.com",
  "password": "password123"
}
```

✅ **Save the token** to `farmer_token` variable

---

## 🛣️ Full User Journey - Step by Step

### **FARMER JOURNEY**

#### 1. Register
- Navigate to `http://localhost:5173/register`
- Fill: Email, Password, Role (Farmer), Wallet Address (optional)
- Click "Register"
- Token saved automatically ✅

#### 2. View Available Policies
- Navigate to `/policies`
- See all 14+ available insurance policies
- Each shows: Premium, Payout, Rainfall Threshold, Temperature Range

#### 3. Purchase a Policy
- Click "Purchase Policy" on any policy card
- Confirm the transaction
- Policy added to your account

#### 4. View Profile & Purchases
- Navigate to `/profile`
- See your personal information
- View all purchased policies ✅
- View transaction history ✅

---

### **ADMIN JOURNEY**

#### 1. Login
- Navigate to `http://localhost:5173/login`
- Email: `admin@insuchaintest.com`
- Password: `admin123`
- Click "Login"

#### 2. Access Dashboard
- Navigate to `/dashboard`
- See all statistics:
  - Total Policies Available
  - Total Policies Sold
  - Total Users (Farmers + Admins)
  - Total Payouts

#### 3. Create New Policy
- Click "Create Policy" button
- Fill in policy details:
  - Name: "Hailstorm Premium Coverage"
  - Premium: 0.8 ETH
  - Payout: 8.0 ETH
  - Rainfall Threshold: 75
  - Temperature Range: -15°C to 35°C
- Click "Create Policy"

#### 4. View All Policies
- See all created policies in grid view
- Each shows all details

#### 5. View All Users
- See users table with:
  - User ID
  - Email
  - Role
  - Wallet Address
  - Join Date

---

## 📊 API Endpoints Reference

### Authentication
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/auth/register` | ❌ | Register user |
| POST | `/auth/login` | ❌ | Login user |
| POST | `/auth/verify` | ✅ | Verify JWT token |

### Policies
| Method | Endpoint | Auth | User | Purpose |
|--------|----------|------|------|---------|
| GET | `/policies` | ❌ | All | Get all policies |
| GET | `/policies/:id` | ❌ | All | Get specific policy |
| GET | `/policies/user/mypolicies` | ✅ | Farmer | Get farmer's policies |
| GET | `/policies/user/payout` | ✅ | Farmer | Get payout balance |
| POST | `/policies/purchase/:id` | ✅ | Farmer | Purchase a policy |

### User
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/users/register` | ❌ | Register user |
| GET | `/users/profile` | ✅ | Get user profile |
| GET | `/users/transactions` | ✅ | Get transactions |
| GET | `/users/purchases` | ✅ | Get purchases |

### Admin
| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/admin/policies/create` | ✅ | Create policy |
| GET | `/admin/users` | ✅ | Get all users |
| GET | `/admin/dashboard` | ✅ | Get dashboard stats |
| POST | `/admin/payouts/trigger` | ✅ | Trigger payout |

---

## 🌐 Frontend Routes

| Route | Type | Purpose |
|-------|------|---------|
| `/` | Public | Home page |
| `/login` | Public | Login page |
| `/register` | Public | Registration page |
| `/policies` | Public | Browse policies |
| `/profile` | Protected | User profile (Farmer) / Admin dashboard link |
| `/dashboard` | Protected | Admin dashboard (Create, view policies) |
| `/faq` | Public | FAQ page |
| `/how-it-works` | Public | System workflow |
| `/contact` | Public | Contact form |

---

## 🛡️ JWT Token Persistence

✅ **Automatic Token Handling:**
- Token saved to `localStorage` after login
- Token automatically included in all API requests
- Token removed on logout
- User can refresh page and stay logged in
- Invalid token triggers automatic logout

---

## 🧪 Sample Test Data

### Test Admin
```
Email: admin@insuchaintest.com
Password: admin123
```

### Test Farmer
```
Email: farmer@test.com
Password: farmer123
Wallet: 0xabcd1234567890abcd1234567890abcd12345678
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port 5000 is free
netstat -ano | findstr :5000

# Kill process if needed
taskkill /PID <PID> /F
```

### Database connection error
```bash
# Verify DATABASE_URL in .env
# Test connection:
psql "your_database_url"
```

### Frontend can't reach backend
```bash
# Ensure backend is running on http://localhost:5000
# Check FRONTEND_URL in backend .env matches frontend URL
# Clear browser cache if needed
```

### CORS error
```bash
# Ensure FRONTEND_URL is set correctly in .env
# Should be: http://localhost:5173 (for development)
```

---

## 📱 Mobile Responsive

✅ All pages are fully responsive:
- Mobile phones (320px)
- Tablets (768px)
- Desktops (1200px+)

---

## 🔒 Security Features

✅ **Implemented:**
- JWT authentication
- Password hashing (bcryptjs)
- CORS protection
- Protected routes
- Token expiration
- Input validation

---

## 📈 Performance

✅ **Optimizations:**
- Lazy loading of components
- Optimized database queries
- Caching with localStorage
- Minimal bundle size
- Fast API responses

---

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)
```bash
git push heroku main
heroku logs -t
```

### Frontend Deployment (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

---

## 📚 Documentation

- **Backend Routes:** See backend/routes/
- **Frontend Components:** See react/src/components/
- **API Docs:** Use Postman collection
- **Database Schema:** See backend/db/migrate.js

---

## ✅ Feature Checklist

- ✅ User authentication (Admin + Farmer)
- ✅ Email + password login for both roles
- ✅ JWT token persistence
- ✅ 14+ seeded insurance policies
- ✅ Browse all policies
- ✅ Purchase policies
- ✅ Farmer dashboard (profile, purchases, transactions)
- ✅ Admin dashboard (CRUD operations, user management)
- ✅ FAQ section with 14 questions
- ✅ "How It Works" workflow page
- ✅ Contact form
- ✅ Logout functionality
- ✅ Protected routes
- ✅ Responsive design
- ✅ Loading states
- ✅ Error handling

---

## 🎯 Next Steps

1. ✅ Start backend server
2. ✅ Start frontend dev server
3. ✅ Test authentication flow
4. ✅ Browse and purchase policies
5. ✅ Test admin dashboard
6. ✅ Explore all pages
7. ✅ Run full end-to-end testing

---

## 💡 Tips

- Always have both frontend and backend running
- Check browser console for errors
- Check backend console for API errors
- Use Postman to test API endpoints directly
- Clear localStorage if you experience auth issues
- Token expires after 7 days for farmers, 24h for admins

---

## 📞 Support

For issues or questions:
1. Check the FAQ page in the app
2. Review API documentation
3. Check console errors
4. Review backend logs
5. Contact via /contact page

---

**Happy Testing! 🎉**
