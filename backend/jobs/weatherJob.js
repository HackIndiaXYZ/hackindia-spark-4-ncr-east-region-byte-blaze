/**
 * Weather Monitoring Job
 * ======================
 * Automated cron job that:
 *  1. Fetches current weather from OpenWeatherMap
 *  2. Gets all active farmers from the smart contract
 *  3. Compares rainfall vs each farmer's policy threshold
 *  4. If rainfall < threshold → triggers payout on-chain
 *  5. Records results in database
 * 
 * Avoids double payouts by checking policy.payoutClaimed on-chain.
 * 
 * Run frequency: Every 1 hour (configured in server.js)
 */

import cron from 'node-cron';
import { getWeatherData, analyzeWeatherConditions } from '../services/weatherService.js';
import * as blockchain from '../services/blockchainTriggerService.js';
import * as db from '../models/database.js';

// Track the last run to avoid duplicate runs
let lastRunTimestamp = null;
let isRunning = false;

/**
 * Main weather check + auto-trigger payout logic
 */
export async function runWeatherCheck() {
  // Prevent overlapping runs
  if (isRunning) {
    console.log('⏸️  Weather job already running, skipping...');
    return { skipped: true };
  }

  isRunning = true;
  const runId = Date.now();

  console.log('\n══════════════════════════════════════════════');
  console.log(`🌦️  WEATHER MONITORING JOB — Run #${runId}`);
  console.log(`⏰ ${new Date().toISOString()}`);
  console.log('══════════════════════════════════════════════');

  const results = {
    runId,
    timestamp: new Date().toISOString(),
    weather: null,
    analysis: null,
    farmersChecked: 0,
    payoutsTriggered: 0,
    payoutsSkipped: 0,
    payoutsFailed: 0,
    transactions: [],
    errors: [],
  };

  try {
    // ── Step 1: Fetch Weather Data ──
    const lat = parseFloat(process.env.DEFAULT_LATITUDE || 28.7041);
    const lon = parseFloat(process.env.DEFAULT_LONGITUDE || 77.1025);

    console.log(`\n📍 Fetching weather for: ${lat}, ${lon}`);

    let weather;
    try {
      weather = await getWeatherData(lat, lon);
      results.weather = weather;
      console.log(`   📍 Location: ${weather.location}, ${weather.country}`);
      console.log(`   🌡️  Temperature: ${weather.temperature}°C (feels like ${weather.temperatureFeelsLike}°C)`);
      console.log(`   🌧️  Rainfall (1h): ${weather.rainfall} mm`);
      console.log(`   💨 Wind: ${weather.windSpeed} m/s`);
      console.log(`   ☁️  Condition: ${weather.description}`);
    } catch (weatherError) {
      console.error(`   ❌ Weather fetch failed: ${weatherError.message}`);
      results.errors.push(`Weather: ${weatherError.message}`);
      isRunning = false;
      return results;
    }

    // ── Step 2: Analyze Conditions ──
    const analysis = analyzeWeatherConditions(weather);
    results.analysis = analysis;
    console.log(`\n🔍 Analysis: [${analysis.severity.toUpperCase()}] ${analysis.reason}`);

    // ── Step 3: Check Blockchain for Active Farmers ──
    if (!blockchain.isBlockchainReady()) {
      console.log('\n⚠️  Blockchain not initialized — attempting connection...');
      const initialized = await blockchain.initBlockchain();
      if (!initialized) {
        console.log('❌ Blockchain connection failed — running DB-only auto-claims');
        // Fall back to DB-only auto-claims
        await runDatabaseOnlyClaims(weather, results);
        isRunning = false;
        lastRunTimestamp = new Date().toISOString();
        return results;
      }
    }

    // Get all active farmers from the smart contract
    console.log('\n⛓️  Fetching active farmers from smart contract...');
    const activeFarmers = await blockchain.getActiveFarmers();
    results.farmersChecked = activeFarmers.length;
    console.log(`   📋 Found ${activeFarmers.length} active farmers`);

    if (activeFarmers.length === 0) {
      console.log('   ✅ No active policies to check');
      // Still run DB-only claims for users without wallet
      await runDatabaseOnlyClaims(weather, results);
      isRunning = false;
      lastRunTimestamp = new Date().toISOString();
      return results;
    }

    // ── Step 4: Check Each Farmer's Policy ──
    for (const farmerAddress of activeFarmers) {
      try {
        const shortAddr = `${farmerAddress.slice(0, 6)}...${farmerAddress.slice(-4)}`;
        console.log(`\n   👨‍🌾 Checking farmer: ${shortAddr}`);

        // Get policy from contract
        const policy = await blockchain.getPolicy(farmerAddress);
        if (!policy) {
          console.log(`      ⏭️  No policy data, skipping`);
          results.payoutsSkipped++;
          continue;
        }

        console.log(`      📋 Threshold: ${policy.rainfallThreshold} mm`);
        console.log(`      📋 Active: ${policy.active}, Claimed: ${policy.payoutClaimed}`);

        // Skip if already claimed (AVOID DOUBLE PAYOUT)
        if (policy.payoutClaimed) {
          console.log(`      ⏭️  Payout already claimed, skipping`);
          results.payoutsSkipped++;
          continue;
        }

        // Skip if not active
        if (!policy.active) {
          console.log(`      ⏭️  Policy not active, skipping`);
          results.payoutsSkipped++;
          continue;
        }

        // ── Step 5: Compare rainfall vs threshold ──
        // Contract expects: if rainfall < threshold → trigger payout (drought condition)
        // We also trigger for storms (rainfall >= high threshold)
        const shouldTrigger =
          weather.rainfall < policy.rainfallThreshold || // Drought / low rain
          analysis.isStorm ||                             // Storm
          analysis.isExtremeTemp;                         // Extreme temperature

        if (!shouldTrigger) {
          console.log(`      ✅ Conditions normal (rain: ${weather.rainfall}mm vs threshold: ${policy.rainfallThreshold}mm)`);
          results.payoutsSkipped++;
          continue;
        }

        // ── TRIGGER PAYOUT ──
        console.log(`      🚨 TRIGGERING PAYOUT! Rain: ${weather.rainfall}mm < Threshold: ${policy.rainfallThreshold}mm`);

        const txResult = await blockchain.triggerPayout(farmerAddress, weather.rainfall);

        if (txResult.success) {
          results.payoutsTriggered++;
          results.transactions.push({
            farmer: farmerAddress,
            txHash: txResult.txHash,
            explorerUrl: txResult.explorerUrl,
            rainfall: weather.rainfall,
            threshold: policy.rainfallThreshold,
            payout: policy.payout,
          });

          // Also record in database
          try {
            await db.createTransaction(
              null, // userId — we don't have it from wallet alone
              txResult.txHash,
              'blockchain_auto_payout',
              policy.payout,
              'confirmed'
            );
          } catch (dbErr) {
            console.warn(`      ⚠️  DB record failed: ${dbErr.message}`);
          }

          console.log(`      ✅ Payout sent! TX: ${txResult.txHash}`);
          console.log(`      🔗 ${txResult.explorerUrl}`);
        } else {
          results.payoutsFailed++;
          results.errors.push(`Payout for ${shortAddr}: ${txResult.error}`);
          console.log(`      ❌ Payout failed: ${txResult.error}`);
        }
      } catch (farmerErr) {
        results.payoutsFailed++;
        results.errors.push(`Farmer ${farmerAddress}: ${farmerErr.message}`);
        console.error(`      ❌ Error: ${farmerErr.message}`);
      }
    }

    // Also run DB-only claims for users without blockchain wallets
    await runDatabaseOnlyClaims(weather, results);

  } catch (error) {
    results.errors.push(`Fatal: ${error.message}`);
    console.error(`\n❌ FATAL ERROR: ${error.message}`);
  } finally {
    isRunning = false;
    lastRunTimestamp = new Date().toISOString();
  }

  // ── Summary ──
  console.log('\n══════════════════════════════════════════════');
  console.log(`✅ Job Complete`);
  console.log(`   Farmers checked: ${results.farmersChecked}`);
  console.log(`   Payouts triggered: ${results.payoutsTriggered}`);
  console.log(`   Skipped: ${results.payoutsSkipped}`);
  console.log(`   Failed: ${results.payoutsFailed}`);
  console.log(`   Errors: ${results.errors.length}`);
  console.log('══════════════════════════════════════════════\n');

  return results;
}

/**
 * DB-only auto-claims for users who bought policies in the database
 * but may not have blockchain wallets.
 */
async function runDatabaseOnlyClaims(weather, results) {
  try {
    const activePurchases = await db.pool.query(
      `SELECT p.id, p.user_id, p.policy_id, pol.name, pol.payout, pol.rainfall_threshold, pol.temperature_min, pol.temperature_max
       FROM purchases p JOIN policies pol ON p.policy_id = pol.id
       WHERE p.status = 'active' AND p.payout_triggered = false`
    );

    for (const purchase of activePurchases.rows) {
      const isLowRain = weather.rainfall < purchase.rainfall_threshold;
      const isExtremeTemp = weather.temperature <= purchase.temperature_min || weather.temperature >= purchase.temperature_max;

      if (isLowRain || isExtremeTemp) {
        const reason = isLowRain ? 'Low Rainfall (Drought)' : 'Extreme Temperature';
        console.log(`   💰 DB Auto-claim: User ${purchase.user_id} — ${purchase.name} — ${reason}`);

        await db.updatePurchaseStatus(purchase.id, 'paid_out', purchase.payout);
        await db.createTransaction(
          purchase.user_id,
          `auto_weather_${purchase.policy_id}_${Date.now()}`,
          'weather_auto_payout',
          purchase.payout,
          'confirmed'
        );
        results.payoutsTriggered++;
      }
    }
  } catch (dbErr) {
    console.warn(`   ⚠️  DB auto-claims error: ${dbErr.message}`);
  }
}

/**
 * Get the last run status
 */
export function getLastRunInfo() {
  return { lastRun: lastRunTimestamp, isRunning };
}

/**
 * Start the hourly cron job
 */
export function startWeatherCron() {
  // Run every hour at minute 0
  cron.schedule('0 * * * *', async () => {
    console.log('\n⏰ Cron triggered: Weather monitoring job starting...');
    await runWeatherCheck();
  });

  console.log('✅ Weather auto-claim cron job scheduled (every hour)');

  // Run once after 15 seconds on startup
  setTimeout(async () => {
    console.log('\n🚀 Running initial weather check on startup...');
    await runWeatherCheck();
  }, 15000);
}
