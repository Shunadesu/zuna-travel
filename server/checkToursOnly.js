const mongoose = require('mongoose');
require('dotenv').config();

async function checkToursOnly() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const Product = require('./models/Product');
    
    // Check all products with populated category
    const products = await Product.find({}).populate('category', 'name slug type');
    console.log('📦 All Products:', products.length);
    
    // Filter only tours (vietnam-tours)
    const tours = products.filter(p => p.category?.type === 'vietnam-tours');
    console.log('🎯 Tours (vietnam-tours):', tours.length);
    tours.forEach(t => {
      console.log(`  - ${t.title.vi} (${t.category?.name?.vi})`);
    });
    
    // Filter only transfers (transfer-services)
    const transfers = products.filter(p => p.category?.type === 'transfer-services');
    console.log('🚗 Transfers (transfer-services):', transfers.length);
    transfers.forEach(t => {
      console.log(`  - ${t.title.vi} (${t.category?.name?.vi})`);
    });
    
    // Check products with no type
    const noType = products.filter(p => !p.category?.type);
    console.log('❓ Products with no type:', noType.length);
    noType.forEach(t => {
      console.log(`  - ${t.title.vi} (category: ${t.category ? 'exists but no type' : 'null'})`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkToursOnly();
