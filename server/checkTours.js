const mongoose = require('mongoose');
require('dotenv').config();

async function checkTours() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const Product = require('./models/Product');
    const Category = require('./models/Category');
    
    // Check categories
    const vietnamToursCategories = await Category.find({ type: 'vietnam-tours' });
    console.log('📁 Vietnam Tours Categories:', vietnamToursCategories.length);
    vietnamToursCategories.forEach(cat => {
      console.log(`  - ${cat.name.vi} (${cat.slug})`);
    });
    
    // Check products
    const products = await Product.find({ category: { $in: vietnamToursCategories.map(cat => cat._id) } }).populate('category', 'name slug type');
    console.log('🎯 Vietnam Tours Products:', products.length);
    products.forEach(p => {
      console.log(`  - ${p.title.vi} (${p.category?.type || 'NO TYPE'})`);
    });
    
    // Check all products
    const allProducts = await Product.find({}).populate('category', 'name slug type');
    console.log('📦 All Products:', allProducts.length);
    allProducts.forEach(p => {
      console.log(`  - ${p.title.vi} (${p.category?.type || 'NO TYPE'})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkTours();
