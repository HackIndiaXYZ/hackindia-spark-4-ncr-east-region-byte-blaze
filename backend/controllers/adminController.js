import * as db from '../models/database.js';
import { fetchWeatherData, storeWeatherData } from '../utils/weatherAPI.js';
import cron from 'node-cron';

export async function createPolicy(req, res) {
  try {
    const { name, premium, payout, rainfallThreshold, temperatureMin, temperatureMax } = req.body;

    if (!name || premium === undefined || payout === undefined || rainfallThreshold === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, premium, payout, rainfallThreshold',
      });
    }

    // Create policy in database
    const result = await db.pool.query(
      `INSERT INTO policies (name, premium, payout, rainfall_threshold, temperature_min, temperature_max, active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING id, name, premium, payout, rainfall_threshold, temperature_min, temperature_max, created_at`,
      [
        name,
        BigInt(premium).toString(),
        BigInt(payout).toString(),
        rainfallThreshold,
        temperatureMin || -50,
        temperatureMax || 50,
      ]
    );

    const policy = result.rows[0];

    res.status(201).json({
      success: true,
      data: {
        id: policy.id,
        name: policy.name,
        premium: policy.premium,
        payout: policy.payout,
        rainfallThreshold: policy.rainfall_threshold,
        temperatureMin: policy.temperature_min,
        temperatureMax: policy.temperature_max,
        createdAt: policy.created_at,
      },
      message: 'Policy created successfully',
    });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to create policy',
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
    // Get total policies from database
    const totalPoliciesResult = await db.pool.query(
      'SELECT COUNT(*) as count FROM policies WHERE active = true'
    );
    const totalPolicies = totalPoliciesResult.rows[0].count;

    // Get all users from DB
    const users = await db.getAllUsers(10000, 0);

    // Count farmers vs admins
    const farmerCount = users.filter(u => u.role === 'farmer').length;
    const adminCount = users.filter(u => u.role === 'admin').length;

    // Get all purchases and stats
    let totalPoliciesSold = 0;
    let totalPayouts = 0;

    for (const user of users) {
      const purchases = await db.getUserPurchases(user.id);
      totalPoliciesSold += purchases.length;
      totalPayouts += purchases.reduce((sum, p) => sum + (BigInt(p.payout_amount || 0)), BigInt(0));
    }

    res.json({
      success: true,
      data: {
        totalPoliciesAvailable: totalPolicies,
        totalPoliciesSold,
        totalUsers: users.length,
        farmerCount,
        adminCount,
        totalPayouts: totalPayouts.toString(),
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
    const { userId, policyId, rainfall, temperature } = req.body;

    if (!userId || !policyId) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: userId, policyId',
      });
    }

    // Get the purchase record
    const purchaseResult = await db.pool.query(
      'SELECT * FROM purchases WHERE user_id = $1 AND policy_id = $2',
      [userId, policyId]
    );

    if (purchaseResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Purchase not found',
      });
    }

    const purchase = purchaseResult.rows[0];

    // Get the policy
    const policy = await db.getPolicyById(policyId);
    if (!policy) {
      return res.status(404).json({
        success: false,
        error: 'Policy not found',
      });
    }

    // Check if payout conditions are met
    // (This is a simplified example - in production would be more complex)
    const payoutTriggered = 
      (rainfall && rainfall >= policy.rainfall_threshold) ||
      (temperature && (temperature <= policy.temperature_min || temperature >= policy.temperature_max));

    if (!payoutTriggered) {
      return res.json({
        success: true,
        data: {
          payoutTriggered: false,
          message: 'Weather conditions do not meet payout thresholds',
        },
      });
    }

    // Update purchase status to triggered payout
    await db.updatePurchaseStatus(purchase.id, 'paid_out', policy.payout);

    // Create transaction record
    await db.createTransaction(
      userId,
      `payout_${policyId}_${Date.now()}`,
      'payout',
      policy.payout,
      'confirmed'
    );

    res.json({
      success: true,
      data: {
        purchaseId: purchase.id,
        policyId,
        payoutAmount: policy.payout,
        status: 'paid_out',
        message: 'Payout triggered successfully',
      },
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
