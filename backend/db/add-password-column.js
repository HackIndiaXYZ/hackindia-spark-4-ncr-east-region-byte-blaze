import pool from './connection.js';

async function addPasswordHashColumn() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Checking users table schema...');

    // Check if password_hash column exists
    const result = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'password_hash'
      );
    `);

    const columnExists = result.rows[0].exists;

    if (columnExists) {
      console.log('✅ password_hash column already exists');
      return;
    }

    console.log('📝 Adding password_hash column...');
    await client.query(`
      ALTER TABLE users 
      ADD COLUMN password_hash VARCHAR(255)
    `);
    
    console.log('✅ password_hash column added successfully');

    // Verify it was added
    const checkResult = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    console.log('\n📊 Users table columns:');
    checkResult.rows.forEach(row => {
      console.log(`   ✓ ${row.column_name} (${row.data_type})`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

addPasswordHashColumn()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
