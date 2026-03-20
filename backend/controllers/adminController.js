import { contractManager } from '../utils/contractManager.js';
import * as db from '../models/database.js';
import { fetchWeatherData, storeWeatherData } from '../utils/weatherAPI.js';
import cron from 'node-cron';

export async function createPolicy(req, res) {
  try {
    const { name, premium, payout, rainfallThreshold, temperatureMin, temperatureMax } = req.body;

    if (!name || !premium || !payout || !rainfallThreshold) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    const tx = await contractManager.contract.createPolicy(
      name,
      premium,
      payout,
      rainfallThreshold,
      temperatureMin || -50,
      temperatureMax || 50
    );

    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
      },
      message: 'Policy created successfully',
    });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create policy',
    });
  }
}

/**
 * View all users
 */
export async function getAllUsers(req, res) {
  try {
    const { limit = 100, offset = 0 } = req.query;
    const users = await db.getAllUsers(parseInt(limit), parseInt(offset));

    res.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
    });
  }
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(req, res) {
  try {
    // Get total policies
    const totalPolicies = await contractManager.contract.getTotalPolicies();

    // Get all users from DB
    const users = await db.getAllUsers(10000, 0);

    // Count farmers vs admins
    const farmerCount = users.filter(u => u.role === 'farmer').length;
    const adminCount = users.filter(u => u.role === 'admin').length;

    // Get all purchases
    let totalPoliciesSold = 0;
    let totalPayouts = 0;

    for (const user of users) {
      const purchases = await db.getUserPurchases(user.id);
      totalPoliciesSold += purchases.length;
      totalPayouts += purchases.reduce((sum, p) => sum + (p.payout_amount || 0), 0);
    }

    res.json({
      success: true,
      data: {
        totalPoliciesAvailable: totalPolicies.toString(),
        totalPoliciesSold,
        totalUsers: users.length,
        farmerCount,
        adminCount,
        totalPayouts,
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics',
    });
  }
}

/**
 * Trigger payout for a user based on weather
 */
export async function triggerPayoutByWeather(req, res) {
  try {
    const { farmerAddress, policyId, latitude, longitude } = req.body;

    if (!farmerAddress || !policyId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
      });
    }

    // Fetch weather data
    const weatherData = await fetchWeatherData(latitude, longitude);
    
    // Store weather data
    await storeWeatherData('Unknown', latitude, longitude, weatherData);

    // Call smart contract to trigger payout
    const tx = await contractManager.triggerPayout(
      farmerAddress,
      policyId,
      Math.floor(weatherData.rainfall || 0),
      Math.floor(weatherData.temperature || 0)
    );

    const receipt = await tx.wait();

    res.json({
      success: true,
      data: {
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        weatherData,
      },
      message: 'Payout triggered successfully',
    });
  } catch (error) {
    console.error('Error triggering payout:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to trigger payout',
    });
  }
}

/**
 * Initialize weather monitoring (scheduled task)
 */
export async function initializeWeatherMonitoring() {
  // Run weather check every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('🌦️  Running scheduled weather check...');
      // Add logic to fetch weather for registered locations
      // and trigger payouts if conditions are met
    } catch (error) {
      console.error('Error in weather monitoring:', error);
    }
  });
}
