const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Settings = require('../models/Settings');
require('dotenv').config();

async function quickSeed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Blog.deleteMany({});
    await Settings.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    const adminUser = new User({
      email: 'admin@zunatravel.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
      isActive: true
    });

    await adminUser.save();
    console.log('👤 Admin user created');

    // Create basic categories
    const categories = await Category.insertMany([
      {
        name: { en: 'Vietnam Tours', vi: 'Tour Việt Nam' },
        slug: 'vietnam-tours',
        description: { en: 'Discover Vietnam', vi: 'Khám phá Việt Nam' },
        type: 'vietnam-tours',
        sortOrder: 1,
        isActive: true
      },
      {
        name: { en: 'Transfer Services', vi: 'Dịch Vụ Đưa Đón' },
        slug: 'transfer-services',
        description: { en: 'Reliable transfers', vi: 'Đưa đón đáng tin cậy' },
        type: 'transfer-services',
        sortOrder: 2,
        isActive: true
      }
    ]);

    console.log(`📂 Created ${categories.length} categories`);

    // Create basic products
    const products = await Product.insertMany([
      {
        title: { en: 'Hanoi City Tour', vi: 'Tour Hà Nội' },
        slug: 'hanoi-city-tour',
        description: { en: 'Explore Hanoi', vi: 'Khám phá Hà Nội' },
        shortDescription: { en: 'Hanoi discovery', vi: 'Khám phá Hà Nội' },
        category: categories[0]._id,
        pricing: { adult: 45, child: 25, currency: 'USD' },
        duration: { days: 1, nights: 0 },
        location: { en: 'Hanoi', vi: 'Hà Nội' },
        highlights: [
          { en: 'Old Quarter', vi: 'Phố Cổ' },
          { en: 'Temple of Literature', vi: 'Văn Miếu' }
        ],
        isActive: true,
        isFeatured: true
      },
      {
        title: { en: 'Airport Transfer', vi: 'Đưa Đón Sân Bay' },
        slug: 'airport-transfer',
        description: { en: 'Reliable airport transfer', vi: 'Đưa đón sân bay đáng tin cậy' },
        shortDescription: { en: 'Professional transfer', vi: 'Đưa đón chuyên nghiệp' },
        category: categories[1]._id,
        pricing: { perTrip: 25, currency: 'USD' },
        location: { en: 'Airport - City', vi: 'Sân bay - Thành phố' },
        transferService: {
          type: 'airport-transfer',
          seats: 4,
          vehicleInfo: {
            model: 'Toyota Camry',
            year: 2022,
            features: [
              { en: 'Air Conditioning', vi: 'Điều hòa' },
              { en: 'WiFi', vi: 'WiFi' }
            ]
          }
        },
        isActive: true,
        isFeatured: true
      }
    ]);

    console.log(`📦 Created ${products.length} products`);

    // Create basic blog
    const blog = await Blog.create({
      title: { en: 'Welcome to Vietnam', vi: 'Chào mừng đến Việt Nam' },
      slug: 'welcome-to-vietnam',
      content: {
        en: 'Vietnam is a beautiful country with rich culture and history...',
        vi: 'Việt Nam là đất nước đẹp với văn hóa và lịch sử phong phú...'
      },
      excerpt: {
        en: 'Discover Vietnam',
        vi: 'Khám phá Việt Nam'
      },
      categories: ['destinations'],
      tags: [
        { en: 'Vietnam', vi: 'Việt Nam' },
        { en: 'Travel', vi: 'Du lịch' }
      ],
      author: adminUser._id,
      isPublished: true,
      publishedAt: new Date(),
      isFeatured: true
    });

    console.log('📝 Created blog post');

    // Create basic settings
    const settings = await Settings.create({
      siteInfo: {
        name: { en: 'VnBestTravel', vi: 'VnBestTravel' },
        description: {
          en: 'Your trusted partner for Vietnam travel',
          vi: 'Đối tác đáng tin cậy cho du lịch Việt Nam'
        }
      },
      contact: {
        email: 'info@zunatravel.com',
        phone: '+84 123 456 789',
        address: {
          en: '123 Travel Street, Hanoi',
          vi: '123 Đường Du Lịch, Hà Nội'
        }
      },
      booking: {
        currency: 'USD',
        paymentMethods: ['credit_card', 'bank_transfer']
      }
    });

    console.log('⚙️  Settings created');

    console.log('\n✅ Quick seed completed successfully!');
    console.log('\n📋 Login credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: admin123`);

  } catch (error) {
    console.error('❌ Quick seed failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

quickSeed();
