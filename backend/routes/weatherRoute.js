/**
 * Weather API Route
 * =================
 * Provides weather data + job status endpoints.
 * NEW file — added to server.js via app.use()
 * 
 * Endpoints:
 *   GET /api/weather-monitor          — current weather + analysis
 *   GET /api/weather-monitor/status   — last cron run info
 *   POST /api/weather-monitor/trigger — manually run weather check (admin)
 */

import express from 'express';
import { getWeatherData, analyzeWeatherConditions } from '../services/weatherService.js';
import * as blockchain from '../services/blockchainTriggerService.js';
import { runWeatherCheck, getLastRunInfo } from '../jobs/weatherJob.js';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.js';

const router = express.Router();

/**
 * GET /api/weather-monitor
 * Public — returns current weather data + analysis + contract stats
 */
router.get('/', async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat || process.env.DEFAULT_LATITUDE || 28.7041);
    const lon = parseFloat(req.query.lon || process.env.DEFAULT_LONGITUDE || 77.1025);

    const weather = await getWeatherData(lat, lon);
    const analysis = analyzeWeatherConditions(weather);

    // Get contract stats if available
    let contractStats = null;
    if (blockchain.isBlockchainReady()) {
      contractStats = await blockchain.getContractStats();
    }

    res.json({
      success: true,
      data: {
        weather,
        analysis,
        contractStats,
        lastJobRun: getLastRunInfo(),
      },
    });
  } catch (error) {
    console.error('Weather monitor error:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * GET /api/weather-monitor/status
 * Public — returns last job run status
 */
router.get('/status', (req, res) => {
  res.json({
    success: true,
    data: {
      ...getLastRunInfo(),
      blockchainConnected: blockchain.isBlockchainReady(),
    },
  });
});

/**
 * GET /api/weather-monitor/policy/:address
 * Public — returns a farmer's on-chain policy status
 */
router.get('/policy/:address', async (req, res) => {
  try {
    const { address } = req.params;
    if (!blockchain.isBlockchainReady()) {
      return res.status(503).json({ success: false, error: 'Blockchain not connected' });
    }

    const policy = await blockchain.getPolicy(address);
    if (!policy) return res.status(404).json({ success: false, error: 'No policy found for this address' });

    res.json({ success: true, data: policy });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/weather-monitor/trigger
 * Admin only — manually run the weather check + payout job
 */
router.post('/trigger', authenticateJWT, requireAdmin, async (req, res) => {
  try {
    console.log('🔘 Manual weather check triggered by admin');
    const results = await runWeatherCheck();
    res.json({ success: true, data: results, message: 'Weather check completed' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
