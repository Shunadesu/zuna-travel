const { seedTransferServices } = require('./transferServices');

console.log('🚀 Starting Transfer Services Seeding...');
console.log('=====================================');

seedTransferServices()
  .then(() => {
    console.log('✅ Transfer services seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Transfer services seeding failed:', error);
    process.exit(1);
  });
