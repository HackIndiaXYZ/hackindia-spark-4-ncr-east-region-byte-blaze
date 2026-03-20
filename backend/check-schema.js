import pool from './db/connection.js';

(async () => {
  try {
    // Check email constraint
    const constraints = await pool.query(`
      SELECT constraint_name, constraint_type
      FROM information_schema.table_constraints
      WHERE table_name = 'users'
    `);
    console.log('\n📋 User table constraints:');
    constraints.rows.forEach(row => console.log(`  - ${row.constraint_name} (${row.constraint_type})`));

    // Check columns
    const columns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log('\n📊 User table columns:');
    columns.rows.forEach(row => console.log(`  - ${row.column_name}: ${row.data_type} ${row.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`));

    console.log('\n✅ Schema check complete\n');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
})();
