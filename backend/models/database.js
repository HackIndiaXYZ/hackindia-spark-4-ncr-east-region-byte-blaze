import pool from '../db/connection.js';

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
