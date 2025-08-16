const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const createAdminDetailed = async () => {
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
      console.log('ID:', existingAdmin._id);
      console.log('Created at:', existingAdmin.createdAt);
      return;
    }

    // Create admin user with detailed information
    const adminData = {
      name: 'Zuna Travel Admin',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
      emailVerified: true,
      phone: '+84 123 456 789',
      avatar: {
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        publicId: 'admin-avatar'
      },
      preferences: {
        language: 'en',
        currency: 'USD',
        notifications: {
          email: true,
          sms: false
        }
      },
      addresses: [
        {
          type: 'work',
          address: '123 Travel Street',
          city: 'Ho Chi Minh City',
          country: 'Vietnam',
          postalCode: '70000',
          isDefault: true
        }
      ]
    };

    const admin = await User.create(adminData);
    
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123');
    console.log('👤 Role:', admin.role);
    console.log('📝 Name:', admin.name);
    console.log('🆔 ID:', admin._id);
    console.log('📱 Phone:', admin.phone);
    console.log('✅ Active:', admin.isActive);
    console.log('✅ Email Verified:', admin.emailVerified);
    console.log('📅 Created at:', admin.createdAt);

    console.log('\n🎉 Admin login credentials:');
    console.log('Email: admin@gmail.com');
    console.log('Password: admin123');
    console.log('\n🔗 You can now login to the admin panel!');

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
createAdminDetailed();
