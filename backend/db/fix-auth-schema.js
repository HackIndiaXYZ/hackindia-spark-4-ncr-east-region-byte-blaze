import pool from './connection.js';

(async () => {
  const client = await pool.connect();
  try {
    console.log('\n🔧 Fixing authentication database schema...\n');

    // Step 1: Check if email UNIQUE constraint exists
    const constraints = await client.query(`
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name = 'users' AND constraint_type = 'UNIQUE' AND constraint_name LIKE '%email%'
    `);

    if (constraints.rows.length === 0) {
      console.log('❌ Email UNIQUE constraint missing');
      console.log('   ➕ Adding UNIQUE constraint on email column...');
      
      try {
        await client.query(`
          ALTER TABLE users
          ADD CONSTRAINT users_email_key UNIQUE (email)
        `);
        console.log('   ✅ Email UNIQUE constraint added');
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log('   ℹ️  Constraint already exists');
        } else {
          throw err;
        }
      }
    } else {
      console.log('✅ Email UNIQUE constraint exists');
    }

    // Step 2: Verify password_hash column exists
    const pwColumns = await client.query(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'password_hash'
    `);

    if (pwColumns.rows.length === 0) {
      console.log('❌ password_hash column missing');
      console.log('   ➕ Adding password_hash column...');
      
      await client.query(`
        ALTER TABLE users
        ADD COLUMN password_hash VARCHAR(255)
      `);
      console.log('   ✅ password_hash column added');
    } else {
      console.log('✅ password_hash column exists');
    }

    // Step 3: Verify the full schema
    console.log('\n📊 Final users table schema:');
    const finalColumns = await client.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);

    finalColumns.rows.forEach(row => {
      const nullable = row.is_nullable === 'YES' ? '(nullable)' : '(NOT NULL)';
      console.log(`   ✓ ${row.column_name}: ${row.data_type} ${nullable}`);
    });

    console.log('\n📋 Final users table constraints:');
    const finalConstraints = await client.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'users'
    `);

    finalConstraints.rows.forEach(row => {
      console.log(`   ✓ ${row.constraint_name} (${row.constraint_type})`);
    });

    console.log('\n✨ Database schema is now ready for authentication!\n');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  } finally {
    client.release();
  }
})();
