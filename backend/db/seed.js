import { seedPolicies } from '../models/database.js';

console.log('🌱 Starting DB seeding process...');

seedPolicies()
  .then(() => {
    console.log('✨ Seeding completed successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  });
