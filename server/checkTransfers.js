const mongoose = require('mongoose');
require('dotenv').config();

async function checkTransfers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const Product = require('./models/Product');
    const Category = require('./models/Category');

    // Check transfer categories
    const transferCategories = await Category.find({ type: 'transfer-services' });
    console.log(`\n📊 Transfer categories found: ${transferCategories.length}`);
    transferCategories.forEach(cat => {
      console.log(`- ${cat.name.vi} (${cat.slug})`);
    });

    // Check transfer products
    const products = await Product.find({ 
      category: { $in: transferCategories.map(cat => cat._id) } 
    });
    console.log(`\n📊 Transfer products found: ${products.length}`);
    products.forEach(p => {
      console.log(`- ${p.title.vi} (${p.slug})`);
    });

    // Check all products count
    const allProducts = await Product.countDocuments();
    console.log(`\n📊 Total products in database: ${allProducts}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTransfers();
