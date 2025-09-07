const mongoose = require('mongoose');
const { seedTransferCategories } = require('./createTransferCategories');
const { seedTransferServices } = require('./transferServices');

const runTransferSeed = async () => {
  try {
    console.log('🚀 Starting complete transfer seeding process...');
    console.log('=' .repeat(60));

    // Step 1: Create transfer categories
    console.log('📁 Step 1: Creating transfer categories...');
    const categories = await seedTransferCategories();
    console.log(`✅ Created ${categories.length} transfer categories`);
    console.log('');

    // Step 2: Create transfer services
    console.log('🚗 Step 2: Creating transfer services...');
    await seedTransferServices();
    console.log('✅ Transfer services created successfully');
    console.log('');

    console.log('🎉 Complete transfer seeding process finished!');
    console.log('=' .repeat(60));
    console.log('📊 Summary:');
    console.log(`   - Categories: ${categories.length}`);
    console.log('   - Services: 8 transfer services');
    console.log('   - Ready for production use!');

  } catch (error) {
    console.error('❌ Transfer seeding failed:', error);
    throw error;
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://namp280918:zunatravel@cluster0.od0rj5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return runTransferSeed();
    })
    .then(() => {
      console.log('✅ Complete transfer seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { runTransferSeed };