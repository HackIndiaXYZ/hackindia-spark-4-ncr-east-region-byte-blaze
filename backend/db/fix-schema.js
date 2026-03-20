import pool from './connection.js';

/**
 * Fix existing database schema issues
 * Adds missing columns if they don't exist
 */
async function fixSchema() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Checking and fixing database schema...');

    // Check if password_hash column exists in users table
    const checkColumn = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'password_hash'
    `);

    if (checkColumn.rows.length === 0) {
      console.log('📝 Adding password_hash column to users table...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN password_hash VARCHAR(255)
      `);
      console.log('✅ password_hash column added');
    } else {
      console.log('✅ password_hash column already exists');
    }

    // Check if email column exists in users table
    const checkEmail = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'email'
    `);

    if (checkEmail.rows.length === 0) {
      console.log('📝 Adding email column to users table...');
      await client.query(`
        ALTER TABLE users 
        ADD COLUMN email VARCHAR(255) UNIQUE
      `);
      console.log('✅ email column added');
    } else {
      console.log('✅ email column already exists');
    }

    // Verify all required columns exist
    const columns = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Users table structure:');
    columns.rows.forEach(row => {
      console.log(`   - ${row.column_name}`);
    });

    console.log('\n✨ Schema validation complete!');
  } catch (error) {
    console.error('❌ Schema fix failed:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

fixSchema().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
