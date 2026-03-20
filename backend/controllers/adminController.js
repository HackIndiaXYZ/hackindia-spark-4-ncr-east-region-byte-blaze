import * as db from '../models/database.js';
import { fetchWeatherData, storeWeatherData } from '../utils/weatherAPI.js';
import cron from 'node-cron';
import * as blockchainService from '../utils/blockchainService.js';

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

/**
 * Initialize blockchain payout monitoring (scheduled task)
 * Runs every hour to check weather data and trigger payouts on blockchain
 */
export async function initializeBlockchainMonitoring() {
  // Run blockchain payout check every hour
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('\n⛓️  Running scheduled blockchain payout check...');
      console.log('⏰ Time:', new Date().toISOString());

      // Initialize blockchain service if not already done
      const isInitialized = await blockchainService.initializeBlockchain();
      if (!isInitialized) {
        console.warn('⚠️  Blockchain service not initialized, skipping this cycle');
        return;
      }

      // Get all active farmers from blockchain
      const activeFarmers = await blockchainService.getActiveFarmersFromChain();
      console.log(`📋 Found ${activeFarmers.length} active farmers on blockchain\n`);

      if (activeFarmers.length === 0) {
        console.log('✅ No active policies to check');
        return;
      }

      // Get contract stats
      const stats = await blockchainService.getContractStats();
      console.log('📊 Contract Statistics:');
      console.log(`   Total Policies: ${stats.totalPoliciesSold}`);
      console.log(`   Total Payouts: ${stats.totalPayoutsTriggered}`);
      console.log(`   Contract Balance: ${stats.contractBalance} MATIC\n`);

      // Check weather for each farmer and trigger payouts
      let payoutsTriggered = 0;
      let payoutsFailed = 0;

      for (const farmerAddress of activeFarmers) {
        try {
          // Get farmer's policy from blockchain
          const policy = await blockchainService.getPolicyFromChain(farmerAddress);
          
          // Skip if already claimed
          if (policy.payoutClaimed) {
            console.log(`⏭️  Farmer ${farmerAddress.slice(0, 6)}... already claimed payout`);
            continue;
          }

          // Get latest weather data
          // In a real scenario, you would fetch the user's location from database
          // For now, using a default location - update this based on your actual setup
          const latestWeather = await fetchWeatherData(28.6139, 77.2090); // Delhi coordinates as example
          
          console.log(`\n🌡️  Latest Weather Data:`);
          console.log(`   Location: ${latestWeather.location}`);
          console.log(`   Rainfall: ${latestWeather.rainfall} mm`);
          console.log(`   Threshold: ${policy.rainfallThreshold} mm`);

          // Check if rainfall exceeds threshold
          if (latestWeather.rainfall >= policy.rainfallThreshold) {
            console.log(`✅ Rainfall threshold met! Triggering payout...`);
            
            try {
              const result = await blockchainService.triggerPayoutOnChain(
                farmerAddress,
                latestWeather.rainfall
              );
              
              if (result) {
                payoutsTriggered++;
                console.log(`✅ Payout triggered successfully!`);
              }
            } catch (error) {
              payoutsFailed++;
              console.error(`❌ Failed to trigger payout: ${error.message}`);
            }
          } else {
            console.log(`⚠️  Rainfall below threshold, no payout triggered`);
          }
        } catch (error) {
          payoutsFailed++;
          console.error(`❌ Error processing farmer ${farmerAddress}: ${error.message}`);
        }
      }

      console.log(`\n✅ Blockchain payout check completed`);
      console.log(`   Payouts Triggered: ${payoutsTriggered}`);
      console.log(`   Failed: ${payoutsFailed}`);
      console.log(`   Total Checked: ${activeFarmers.length}\n`);

    } catch (error) {
      console.error('❌ Error in blockchain monitoring:', error.message);
    }
  });

  console.log('✅ Blockchain monitoring job scheduled (runs every hour)');
}
