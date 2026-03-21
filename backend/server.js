import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import policyRoutes from './routes/policyRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { initializeWeatherMonitoring, initializeBlockchainMonitoring } from './controllers/adminController.js';
import { fetchWeatherData } from './utils/weatherAPI.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ==================== MIDDLEWARE ====================
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== REQUEST LOGGER ====================
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ==================== ROUTES ====================

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Weather proxy (public — keeps API key on server)
app.get('/api/weather', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ success: false, error: 'lat and lon required' });
    const data = await fetchWeatherData(parseFloat(lat), parseFloat(lon));
    res.json({ success: true, data });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch weather' });
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// ==================== ERROR HANDLING ====================
app.use((req, res) => res.status(404).json({ success: false, error: 'Route not found' }));
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.message);
  res.status(500).json({ success: false, error: err.message });
});

// ==================== SERVER STARTUP ====================
if (!process.env.JWT_SECRET) {
  console.error('❌ Missing JWT_SECRET'); process.exit(1);
}

app.listen(PORT, () => {
  console.log(`
🚀 InsuChain Backend Server
===========================
🌐 http://localhost:${PORT}
⛓️  Contract: ${process.env.CONTRACT_ADDRESS}
📡 RPC: ${process.env.RPC_URL}
✨ Ready!
==========================`);

  // Initialize monitoring
  initializeBlockchainMonitoring();
  initializeWeatherMonitoring();
});

export default app;
