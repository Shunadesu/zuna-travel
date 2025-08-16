const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gmail.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log('Email:', existingAdmin.email);
      console.log('Role:', existingAdmin.role);
      console.log('Name:', existingAdmin.name);
      return;
    }

    // Create admin user
    const adminData = {
      name: 'Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      phone: '+84 123 456 789'
    };

    const admin = await User.create(adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Name:', admin.name);
    console.log('ID:', admin._id);

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    if (error.code === 11000) {
      console.log('⚠️  Admin user already exists (duplicate key error)');
    }
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the script
createAdmin();
