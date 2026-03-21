import * as db from '../models/database.js';
import { fetchWeatherData } from '../utils/weatherAPI.js';
import cron from 'node-cron';

/**
 * Create a new policy (admin only)
 */
export async function createPolicy(req, res) {
  try {
    const { name, premium, payout, rainfallThreshold, temperatureMin, temperatureMax } = req.body;
    if (!name || premium === undefined || payout === undefined) {
      return res.status(400).json({ success: false, error: 'name, premium, payout are required' });
    }

    const result = await db.pool.query(
      `INSERT INTO policies (name, premium, payout, rainfall_threshold, temperature_min, temperature_max, active)
       VALUES ($1, $2, $3, $4, $5, $6, true)
       RETURNING *`,
      [name, premium, payout, rainfallThreshold || 100, temperatureMin || -10, temperatureMax || 50]
    );

    res.status(201).json({ success: true, data: result.rows[0], message: 'Policy created' });
  } catch (error) {
    console.error('Error creating policy:', error);
    res.status(500).json({ success: false, error: 'Failed to create policy' });
  }
}

/**
 * Update a policy (admin only)
 */
export async function updatePolicy(req, res) {
  try {
    const { id } = req.params;
    const { name, premium, payout, rainfallThreshold, temperatureMin, temperatureMax, active } = req.body;

    const result = await db.pool.query(
      `UPDATE policies SET name = COALESCE($1, name), premium = COALESCE($2, premium), payout = COALESCE($3, payout),
       rainfall_threshold = COALESCE($4, rainfall_threshold), temperature_min = COALESCE($5, temperature_min),
       temperature_max = COALESCE($6, temperature_max), active = COALESCE($7, active)
       WHERE id = $8 RETURNING *`,
      [name, premium, payout, rainfallThreshold, temperatureMin, temperatureMax, active, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Policy not found' });
    res.json({ success: true, data: result.rows[0], message: 'Policy updated' });
  } catch (error) {
    console.error('Error updating policy:', error);
    res.status(500).json({ success: false, error: 'Failed to update policy' });
  }
}

/**
 * Delete a policy (admin only)
 */
export async function deletePolicy(req, res) {
  try {
    const { id } = req.params;
    const result = await db.pool.query('DELETE FROM policies WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) return res.status(404).json({ success: false, error: 'Policy not found' });
    res.json({ success: true, message: 'Policy deleted' });
  } catch (error) {
    console.error('Error deleting policy:', error);
    res.status(500).json({ success: false, error: 'Failed to delete policy' });
  }
}

/**
 * Get ALL purchases with user+policy info (admin view)
 */
export async function getAllPurchases(req, res) {
  try {
    const result = await db.pool.query(
      `SELECT p.id, p.user_id, p.policy_id, p.status, p.payout_triggered, p.payout_amount, p.created_at,
              u.email as user_email, u.role as user_role,
              pol.name as policy_name, pol.premium, pol.payout
       FROM purchases p
       JOIN users u ON p.user_id = u.id
       JOIN policies pol ON p.policy_id = pol.id
       ORDER BY p.created_at DESC`
    );
    res.json({ success: true, data: result.rows, count: result.rows.length });
  } catch (error) {
    console.error('Error fetching purchases:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch purchases' });
  }
}

/**
 * View all users
 */
export async function getAllUsers(req, res) {
  try {
    const users = await db.getAllUsers(parseInt(req.query.limit || 100), parseInt(req.query.offset || 0));
    res.json({ success: true, data: users, count: users.length });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
}

/**
 * Dashboard stats
 */
export async function getDashboardStats(req, res) {
  try {
    const policiesRes = await db.pool.query('SELECT COUNT(*) as count FROM policies WHERE active = true');
    const usersRes = await db.pool.query('SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE role = \'farmer\') as farmers, COUNT(*) FILTER (WHERE role = \'admin\') as admins FROM users');
    const purchasesRes = await db.pool.query('SELECT COUNT(*) as sold, COALESCE(SUM(payout_amount), 0) as total_payouts FROM purchases');

    res.json({
      success: true,
      data: {
        totalPoliciesAvailable: Number(policiesRes.rows[0].count),
        totalPoliciesSold: Number(purchasesRes.rows[0].sold),
        totalUsers: Number(usersRes.rows[0].total),
        farmerCount: Number(usersRes.rows[0].farmers),
        adminCount: Number(usersRes.rows[0].admins),
        totalPayouts: Number(purchasesRes.rows[0].total_payouts),
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
}

/**
 * Manual payout trigger by weather
 */
export async function triggerPayoutByWeather(req, res) {
  try {
    const { userId, policyId, rainfall, temperature } = req.body;
    if (!userId || !policyId) return res.status(400).json({ success: false, error: 'userId and policyId required' });

    const purchaseResult = await db.pool.query(
      'SELECT * FROM purchases WHERE user_id = $1 AND policy_id = $2', [userId, policyId]
    );
    if (purchaseResult.rows.length === 0) return res.status(404).json({ success: false, error: 'Purchase not found' });

    const purchase = purchaseResult.rows[0];
    const policy = await db.getPolicyById(policyId);
    if (!policy) return res.status(404).json({ success: false, error: 'Policy not found' });

    const payoutTriggered =
      (rainfall && rainfall >= policy.rainfall_threshold) ||
      (temperature && (temperature <= policy.temperature_min || temperature >= policy.temperature_max));

    if (!payoutTriggered) {
      return res.json({ success: true, data: { payoutTriggered: false, message: 'Conditions not met' } });
    }

    await db.updatePurchaseStatus(purchase.id, 'paid_out', policy.payout);
    await db.createTransaction(userId, `payout_${policyId}_${Date.now()}`, 'payout', policy.payout, 'confirmed');

    res.json({ success: true, data: { payoutTriggered: true, payoutAmount: policy.payout, message: 'Payout triggered!' } });
  } catch (error) {
    console.error('Error triggering payout:', error);
    res.status(500).json({ success: false, error: 'Failed to trigger payout' });
  }
}

/**
 * Auto-claim: check weather for all active purchases and trigger payouts
 */
async function autoClaimByWeather() {
  try {
    console.log('🌦️  Running auto-claim weather check...');
    const lat = process.env.DEFAULT_LATITUDE || 28.7041;
    const lon = process.env.DEFAULT_LONGITUDE || 77.1025;

    let weather;
    try {
      weather = await fetchWeatherData(lat, lon);
      console.log(`   📍 ${weather.location}: ${weather.temperature}°C, Rain: ${weather.rainfall}mm, ${weather.description}`);
    } catch (e) {
      console.warn('⚠️  Weather API call failed:', e.message);
      return;
    }

    // Get all active purchases
    const activePurchases = await db.pool.query(
      `SELECT p.id, p.user_id, p.policy_id, pol.name, pol.payout, pol.rainfall_threshold, pol.temperature_min, pol.temperature_max
       FROM purchases p JOIN policies pol ON p.policy_id = pol.id
       WHERE p.status = 'active' AND p.payout_triggered = false`
    );

    let triggered = 0;
    for (const purchase of activePurchases.rows) {
      const isStorm = weather.rainfall >= purchase.rainfall_threshold;
      const isDrought = weather.rainfall === 0 && weather.temperature >= 42;
      const isExtreme = weather.temperature <= purchase.temperature_min || weather.temperature >= purchase.temperature_max;

      if (isStorm || isDrought || isExtreme) {
        const reason = isStorm ? 'Heavy Rainfall/Storm' : isDrought ? 'Drought' : 'Extreme Temperature';
        console.log(`   💰 Auto-claim: User ${purchase.user_id} — ${purchase.name} — ${reason}`);

        await db.updatePurchaseStatus(purchase.id, 'paid_out', purchase.payout);
        await db.createTransaction(purchase.user_id, `auto_${purchase.policy_id}_${Date.now()}`, 'auto_payout', purchase.payout, 'confirmed');
        triggered++;
      }
    }
    console.log(`   ✅ Auto-claim complete: ${triggered} payouts triggered out of ${activePurchases.rows.length} active policies`);
  } catch (error) {
    console.error('❌ Auto-claim error:', error.message);
  }
}

/**
 * Initialize weather monitoring cron (every hour)
 */
export function initializeWeatherMonitoring() {
  cron.schedule('0 * * * *', autoClaimByWeather);
  console.log('✅ Weather auto-claim monitoring scheduled (runs every hour)');
  // Run once on startup after 10 seconds
  setTimeout(autoClaimByWeather, 10000);
}

/**
 * Blockchain monitoring stub
 */
export function initializeBlockchainMonitoring() {
  console.log('✅ Blockchain monitoring initialized (stub)');
}
