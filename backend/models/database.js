import pool from '../db/connection.js';

export { pool };

/**
 * Create a new user in database
 */
export async function createUser(walletAddress, role = 'farmer', email = null) {
  try {
    const result = await pool.query(
      `INSERT INTO users (wallet_address, role, email)
       VALUES (LOWER($1), $2, $3)
       ON CONFLICT (wallet_address) DO UPDATE
       SET updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [walletAddress, role, email]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user:', error.message);
    throw error;
  }
}

/**
 * Get user by wallet address
 */
export async function getUserByWallet(walletAddress) {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE wallet_address = LOWER($1)`,
      [walletAddress]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user:', error.message);
    throw error;
  }
}

/**
 * Get all users
 */
export async function getAllUsers(limit = 100, offset = 0) {
  try {
    const result = await pool.query(
      `SELECT id, wallet_address, role, email, created_at FROM users
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    throw error;
  }
}

/**
 * Update user role
 */
export async function updateUserRole(walletAddress, role) {
  try {
    const result = await pool.query(
      `UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP
       WHERE wallet_address = LOWER($2)
       RETURNING *`,
      [role, walletAddress]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user role:', error.message);
    throw error;
  }
}

/**
 * Create admin credentials
 */
export async function createAdminCredentials(userId, passwordHash) {
  try {
    const result = await pool.query(
      `INSERT INTO admin_credentials (user_id, password_hash)
       VALUES ($1, $2)
       RETURNING id`,
      [userId, passwordHash]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating admin credentials:', error.message);
    throw error;
  }
}

/**
 * Get admin credentials by user ID
 */
export async function getAdminCredentials(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM admin_credentials WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching admin credentials:', error.message);
    throw error;
  }
}

/**
 * Create a policy purchase
 */
export async function createPurchase(userId, policyId, txHash) {
  try {
    const result = await pool.query(
      `INSERT INTO purchases (user_id, policy_id, contract_tx_hash)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [userId, policyId, txHash]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating purchase:', error.message);
    throw error;
  }
}

/**
 * Get user's purchases
 */
export async function getUserPurchases(userId) {
  try {
    const result = await pool.query(
      `SELECT p.*, pol.name, pol.premium, pol.payout 
       FROM purchases p
       JOIN policies pol ON p.policy_id = pol.id
       WHERE p.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching user purchases:', error.message);
    throw error;
  }
}

/**
 * Update purchase status
 */
export async function updatePurchaseStatus(purchaseId, status, payoutAmount = 0) {
  try {
    const result = await pool.query(
      `UPDATE purchases 
       SET status = $1, payout_triggered = true, payout_amount = $2, payout_date = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, payoutAmount, purchaseId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating purchase:', error.message);
    throw error;
  }
}

/**
 * Create a transaction record
 */
export async function createTransaction(userId, txHash, txType, amount, status = 'pending') {
  try {
    const result = await pool.query(
      `INSERT INTO transactions (user_id, tx_hash, tx_type, amount, status)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, txHash, txType, amount, status]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating transaction:', error.message);
    throw error;
  }
}

/**
 * Get transaction by hash
 */
export async function getTransactionByHash(txHash) {
  try {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE tx_hash = $1`,
      [txHash]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching transaction:', error.message);
    throw error;
  }
}

/**
 * Get user's transactions
 */
export async function getUserTransactions(userId) {
  try {
    const result = await pool.query(
      `SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching user transactions:', error.message);
    throw error;
  }
}

/**
 * Create user with email and password
 */
export async function createUserWithPassword(email, passwordHash, role = 'farmer', walletAddress = null) {
  try {
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, role, wallet_address)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (email) DO UPDATE
       SET updated_at = CURRENT_TIMESTAMP
       RETURNING id, email, role, wallet_address, created_at`,
      [email, passwordHash, role, walletAddress ? walletAddress.toLowerCase() : null]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error creating user with password:', error.message);
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email) {
  try {
    const result = await pool.query(
      `SELECT * FROM users WHERE email = LOWER($1)`,
      [email]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by email:', error.message);
    throw error;
  }
}

/**
 * Update user wallet address
 */
export async function updateUserWallet(userId, walletAddress) {
  try {
    const result = await pool.query(
      `UPDATE users SET wallet_address = LOWER($1), updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [walletAddress, userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error updating user wallet:', error.message);
    throw error;
  }
}

/**
 * Seed policies data
 */
export async function seedPolicies() {
  try {
    const policies = [
      { name: 'Rainfall Insurance Basic', premium: 50000000000000000, payout: 500000000000000000, rainfall_threshold: 100, temp_min: -10, temp_max: 40 },
      { name: 'Severe Rainfall Protection', premium: 75000000000000000, payout: 750000000000000000, rainfall_threshold: 80, temp_min: -10, temp_max: 40 },
      { name: 'Extreme Weather Coverage', premium: 100000000000000000, payout: 1000000000000000000, rainfall_threshold: 50, temp_min: -20, temp_max: 50 },
      { name: 'Monsoon Shield', premium: 60000000000000000, payout: 600000000000000000, rainfall_threshold: 120, temp_min: -5, temp_max: 45 },
      { name: 'Frost Protection Plan', premium: 55000000000000000, payout: 550000000000000000, rainfall_threshold: 150, temp_min: -30, temp_max: 10 },
      { name: 'Heat Wave Insurance', premium: 65000000000000000, payout: 650000000000000000, rainfall_threshold: 180, temp_min: 30, temp_max: 50 },
      { name: 'Comprehensive Farm Shield', premium: 120000000000000000, payout: 1200000000000000000, rainfall_threshold: 40, temp_min: -25, temp_max: 55 },
      { name: 'Drought Mitigation Plan', premium: 70000000000000000, payout: 700000000000000000, rainfall_threshold: 200, temp_min: 20, temp_max: 60 },
      { name: 'Hailstorm Coverage', premium: 80000000000000000, payout: 800000000000000000, rainfall_threshold: 90, temp_min: -15, temp_max: 35 },
      { name: 'Flood Protection Premium', premium: 90000000000000000, payout: 900000000000000000, rainfall_threshold: 60, temp_min: -10, temp_max: 45 },
      { name: 'Seasonal Weather Guard', premium: 85000000000000000, payout: 850000000000000000, rainfall_threshold: 110, temp_min: -20, temp_max: 48 },
      { name: 'Year-Round Farmer\'s Plan', premium: 110000000000000000, payout: 1100000000000000000, rainfall_threshold: 75, temp_min: -25, temp_max: 50 },
      { name: 'Premium Plus Coverage', premium: 130000000000000000, payout: 1300000000000000000, rainfall_threshold: 45, temp_min: -30, temp_max: 55 },
      { name: 'Elite Protection Package', premium: 150000000000000000, payout: 1500000000000000000, rainfall_threshold: 30, temp_min: -35, temp_max: 60 },
    ];

    for (const policy of policies) {
      await pool.query(
        `INSERT INTO policies (name, premium, payout, rainfall_threshold, temperature_min, temperature_max, active)
         VALUES ($1, $2, $3, $4, $5, $6, true)
         ON CONFLICT DO NOTHING`,
        [policy.name, policy.premium, policy.payout, policy.rainfall_threshold, policy.temp_min, policy.temp_max]
      );
    }
    
    console.log('✅ Policies seeded successfully');
    return true;
  } catch (error) {
    console.error('Error seeding policies:', error.message);
    throw error;
  }
}

/**
 * Get all policies from database
 */
export async function getAllPolicies() {
  try {
    const result = await pool.query(
      `SELECT id, name, premium, payout, rainfall_threshold, temperature_min, temperature_max, active, created_at
       FROM policies
       WHERE active = true
       ORDER BY created_at DESC`
    );
    return result.rows;
  } catch (error) {
    console.error('Error fetching policies:', error.message);
    throw error;
  }
}

/**
 * Get a specific policy by ID from database
 */
export async function getPolicyById(policyId) {
  try {
    const result = await pool.query(
      `SELECT id, name, premium, payout, rainfall_threshold, temperature_min, temperature_max, active, created_at
       FROM policies
       WHERE id = $1`,
      [policyId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching policy:', error.message);
    throw error;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
  try {
    const result = await pool.query(
      `SELECT id, email, wallet_address, role, created_at, updated_at FROM users WHERE id = $1`,
      [userId]
    );
    return result.rows[0] || null;
  } catch (error) {
    console.error('Error fetching user by ID:', error.message);
    throw error;
  }
}

/**
 * Get total payout balance for a user (sum of all successful payouts)
 */
export async function getUserPayoutBalance(userId) {
  try {
    const result = await pool.query(
      `SELECT COALESCE(SUM(payout_amount), 0) as total_payout 
       FROM purchases 
       WHERE user_id = $1 AND status = 'approved' AND payout_amount > 0`,
      [userId]
    );
    return result.rows[0]?.total_payout || 0;
  } catch (error) {
    console.error('Error fetching user payout balance:', error.message);
    throw error;
  }
}
