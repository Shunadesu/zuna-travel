const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const testAdminLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Find admin user
    const admin = await User.findOne({ email: 'admin@gmail.com' });
    
    if (!admin) {
      console.log('❌ Admin user not found');
      return;
    }

    console.log('✅ Admin user found:');
    console.log('Email:', admin.email);
    console.log('Name:', admin.name);
    console.log('Role:', admin.role);
    console.log('Is Active:', admin.isActive);
    console.log('Password (hashed):', admin.password.substring(0, 20) + '...');

    // Test password comparison
    const testPassword = 'admin123';
    const isPasswordValid = await admin.comparePassword(testPassword);
    
    console.log('\n🔐 Testing password comparison:');
    console.log('Test password:', testPassword);
    console.log('Password valid:', isPasswordValid);

    if (isPasswordValid) {
      console.log('✅ Password is correct!');
    } else {
      console.log('❌ Password is incorrect!');
      
      // Try to create a new admin with the same password
      console.log('\n🔄 Trying to create a new admin with the same password...');
      
      const newAdminData = {
        name: 'Test Admin',
        email: 'testadmin@gmail.com',
        password: 'admin123',
        role: 'admin',
        isActive: true,
        emailVerified: true
      };

      const newAdmin = await User.create(newAdminData);
      console.log('✅ New test admin created:', newAdmin.email);
      
      const newAdminPasswordValid = await newAdmin.comparePassword('admin123');
      console.log('New admin password valid:', newAdminPasswordValid);
    }

  } catch (error) {
    console.error('❌ Error testing admin login:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run the script
testAdminLogin();
