const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
const Settings = require('../models/Settings');
require('dotenv').config();

// Sample Categories
const categoriesData = [
  {
    name: { en: 'Hanoi', vi: 'Hà Nội' },
    slug: 'hanoi',
    description: { en: 'Explore Hanoi\'s rich culture', vi: 'Khám phá văn hóa Hà Nội' },
    type: 'vietnam-tours',
    location: { en: 'Hanoi, Vietnam', vi: 'Hà Nội, Việt Nam' },
    sortOrder: 1,
    isActive: true
  },
  {
    name: { en: 'Ha Long Bay', vi: 'Vịnh Hạ Long' },
    slug: 'ha-long-bay',
    description: { en: 'UNESCO World Heritage site', vi: 'Di sản thế giới UNESCO' },
    type: 'vietnam-tours',
    location: { en: 'Quang Ninh Province', vi: 'Tỉnh Quảng Ninh' },
    sortOrder: 2,
    isActive: true
  },
  {
    name: { en: 'Sapa', vi: 'Sa Pa' },
    slug: 'sapa',
    description: { en: 'Mountainous region with ethnic villages', vi: 'Vùng núi với làng dân tộc' },
    type: 'vietnam-tours',
    location: { en: 'Lao Cai Province', vi: 'Tỉnh Lào Cai' },
    sortOrder: 3,
    isActive: true
  },
  {
    name: { en: 'Airport Transfers', vi: 'Đưa Đón Sân Bay' },
    slug: 'airport-transfers',
    description: { en: 'Reliable airport transfer services', vi: 'Dịch vụ đưa đón sân bay' },
    type: 'transfer-services',
    location: { en: 'Vietnam', vi: 'Việt Nam' },
    sortOrder: 1,
    isActive: true
  }
];

// Sample Products
const productsData = [
  {
    title: { en: 'Hanoi City Discovery Tour', vi: 'Tour Khám Phá Hà Nội' },
    slug: 'hanoi-city-discovery-tour',
    description: { en: 'Explore Hanoi\'s historic heart', vi: 'Khám phá trung tâm lịch sử Hà Nội' },
    shortDescription: { en: 'Discover Hanoi\'s culture', vi: 'Khám phá văn hóa Hà Nội' },
    category: 'hanoi',
    pricing: { adult: 45, child: 25, currency: 'USD' },
    duration: { days: 1, nights: 0 },
    location: { en: 'Hanoi, Vietnam', vi: 'Hà Nội, Việt Nam' },
    highlights: [
      { en: 'Hoan Kiem Lake', vi: 'Hồ Hoàn Kiếm' },
      { en: 'Temple of Literature', vi: 'Văn Miếu' },
      { en: 'Old Quarter', vi: 'Phố Cổ' }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: { en: 'Ha Long Bay Cruise', vi: 'Du Thuyền Vịnh Hạ Long' },
    slug: 'ha-long-bay-cruise',
    description: { en: 'Overnight cruise in Ha Long Bay', vi: 'Du thuyền qua đêm Vịnh Hạ Long' },
    shortDescription: { en: 'UNESCO World Heritage cruise', vi: 'Du thuyền Di sản Thế giới' },
    category: 'ha-long-bay',
    pricing: { adult: 120, child: 80, currency: 'USD' },
    duration: { days: 2, nights: 1 },
    location: { en: 'Ha Long Bay', vi: 'Vịnh Hạ Long' },
    highlights: [
      { en: 'Overnight cruise', vi: 'Du thuyền qua đêm' },
      { en: 'Kayaking', vi: 'Chèo thuyền kayak' },
      { en: 'Cave exploration', vi: 'Khám phá hang động' }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: { en: 'Airport Transfer - Noi Bai', vi: 'Đưa Đón Sân Bay Nội Bài' },
    slug: 'airport-transfer-noi-bai',
    description: { en: 'Reliable airport transfer service', vi: 'Dịch vụ đưa đón sân bay' },
    shortDescription: { en: 'Professional airport transfer', vi: 'Đưa đón sân bay chuyên nghiệp' },
    category: 'airport-transfers',
    pricing: { perTrip: 25, currency: 'USD' },
    location: { en: 'Noi Bai Airport - Hanoi', vi: 'Sân bay Nội Bài - Hà Nội' },
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
];

// Sample Blogs
const blogsData = [
  {
    title: { en: 'Top 10 Vietnam Destinations', vi: 'Top 10 Điểm Đến Việt Nam' },
    slug: 'top-10-vietnam-destinations',
    content: {
      en: 'Vietnam offers amazing destinations from Ha Long Bay to Ho Chi Minh City...',
      vi: 'Việt Nam mang đến những điểm đến tuyệt vời từ Vịnh Hạ Long đến TP.HCM...'
    },
    excerpt: {
      en: 'Discover Vietnam\'s best destinations',
      vi: 'Khám phá những điểm đến tốt nhất Việt Nam'
    },
    categories: ['destinations', 'travel-tips'],
    tags: [
      { en: 'Vietnam', vi: 'Việt Nam' },
      { en: 'Travel', vi: 'Du lịch' }
    ],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: true
  },
  {
    title: { en: 'Vietnamese Food Guide', vi: 'Hướng Dẫn Ẩm Thực Việt Nam' },
    slug: 'vietnamese-food-guide',
    content: {
      en: 'Vietnamese cuisine is famous for pho, banh mi, and fresh spring rolls...',
      vi: 'Ẩm thực Việt Nam nổi tiếng với phở, bánh mì và gỏi cuốn...'
    },
    excerpt: {
      en: 'Guide to Vietnamese cuisine',
      vi: 'Hướng dẫn ẩm thực Việt Nam'
    },
    categories: ['food-culture'],
    tags: [
      { en: 'Food', vi: 'Ẩm thực' },
      { en: 'Vietnamese cuisine', vi: 'Ẩm thực Việt Nam' }
    ],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: false
  }
];

// Sample Settings
const settingsData = {
  siteInfo: {
    name: { en: 'Zuna Travel', vi: 'Zuna Travel' },
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
};

async function seedDatabase() {
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

    // Create categories
    const categories = await Category.insertMany(categoriesData);
    console.log(`📂 Created ${categories.length} categories`);

    // Create category mapping
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Create products with category references
    const productsWithCategories = productsData.map(product => ({
      ...product,
      category: categoryMap[product.category]
    }));

    const products = await Product.insertMany(productsWithCategories);
    console.log(`📦 Created ${products.length} products`);

    // Create blogs with author
    const blogsWithAuthor = blogsData.map(blog => ({
      ...blog,
      author: adminUser._id
    }));

    const blogs = await Blog.insertMany(blogsWithAuthor);
    console.log(`📝 Created ${blogs.length} blog posts`);

    // Create settings
    const settings = new Settings(settingsData);
    await settings.save();
    console.log('⚙️  Settings created');

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: admin123`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

seedDatabase();
