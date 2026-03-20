import pool from './connection.js';

/**
 * Create all necessary tables for InsuChain
 */
async function migrate() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Starting database migration...');

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        wallet_address VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(20) DEFAULT 'farmer', -- 'farmer' or 'admin'
        email VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Policies table
    await client.query(`
      CREATE TABLE IF NOT EXISTS policies (
        id SERIAL PRIMARY KEY,
        contract_policy_id VARCHAR(255) UNIQUE,
        name VARCHAR(255) NOT NULL,
        premium BIGINT NOT NULL,
        payout BIGINT NOT NULL,
        rainfall_threshold BIGINT NOT NULL,
        temperature_min INTEGER NOT NULL,
        temperature_max INTEGER NOT NULL,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Policies table created');

    // Purchases table (policy purchases)
    await client.query(`
      CREATE TABLE IF NOT EXISTS purchases (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        policy_id INTEGER NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
        contract_tx_hash VARCHAR(255),
        status VARCHAR(50) DEFAULT 'active', -- 'active', 'paid_out', 'expired', 'cancelled'
        payout_triggered BOOLEAN DEFAULT false,
        payout_amount BIGINT DEFAULT 0,
        purchase_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        payout_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Purchases table created');

    // Transactions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        tx_hash VARCHAR(255) UNIQUE,
        tx_type VARCHAR(50), -- 'policy_purchase', 'payout', 'withdrawal'
        amount BIGINT,
        status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'confirmed', 'failed'
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Transactions table created');

    // Weather logs table (for tracking weather data)
    await client.query(`
      CREATE TABLE IF NOT EXISTS weather_logs (
        id SERIAL PRIMARY KEY,
        location VARCHAR(255),
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        rainfall DECIMAL(10, 2),
        temperature DECIMAL(10, 2),
        temperature_min DECIMAL(10, 2),
        temperature_max DECIMAL(10, 2),
        recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Weather logs table created');

    // Admin credentials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_credentials (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Admin credentials table created');

    // Create indexes for better query performance
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
      CREATE INDEX IF NOT EXISTS idx_purchases_user ON purchases(user_id);
      CREATE INDEX IF NOT EXISTS idx_purchases_policy ON purchases(policy_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
      CREATE INDEX IF NOT EXISTS idx_transactions_hash ON transactions(tx_hash);
    `);
    console.log('✅ Indexes created');

    console.log('✨ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Run migration
migrate().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
