import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initializeWeatherMonitoring } from './controllers/adminController.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== REQUEST LOGGER ====================

app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ==================== ERROR HANDLING ====================

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

// ==================== SERVER STARTUP ====================

app.listen(PORT, () => {
  console.log(`
🚀 InsuChain Backend Server
===========================
🌐 Server running on http://localhost:${PORT}
🧠 Environment: ${process.env.NODE_ENV || 'development'}
📦 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}
⛓️  Contract Address: ${process.env.CONTRACT_ADDRESS}
📡 RPC URL: ${process.env.RPC_URL}

API Endpoints:
- POST   /api/auth/login
- POST   /api/auth/verify
- GET    /api/policies
- GET    /api/policies/:id
- GET    /api/policies/user/mypolicies
- GET    /api/policies/user/payout
- POST   /api/users/register
- GET    /api/users/profile
- GET    /api/users/transactions
- GET    /api/users/purchases
- POST   /api/admin/policies/create (JWT)
- GET    /api/admin/users (JWT)
- GET    /api/admin/dashboard (JWT)
- POST   /api/admin/payouts/trigger (JWT)

✨ Ready to accept requests!
==========================
  `);

  // Initialize weather monitoring scheduled task
  // initializeWeatherMonitoring();
});

export default app;
