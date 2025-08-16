const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Blog = require('../models/Blog');
require('dotenv').config();

// Sample data
const sampleCategories = [
  {
    name: {
      en: 'Vietnam Tours',
      vi: 'Tour Việt Nam'
    },
    slug: 'vietnam-tours',
    description: {
      en: 'Discover the beauty of Vietnam with our carefully curated tour packages',
      vi: 'Khám phá vẻ đẹp của Việt Nam với các gói tour được chúng tôi tuyển chọn kỹ lưỡng'
    },
    type: 'vietnam-tours',
    sortOrder: 1
  },
  {
    name: {
      en: 'Transfer Services',
      vi: 'Dịch Vụ Đưa Đón'
    },
    slug: 'transfer-services',
    description: {
      en: 'Reliable and comfortable transportation services for your travel needs',
      vi: 'Dịch vụ vận chuyển đáng tin cậy và thoải mái cho nhu cầu du lịch của bạn'
    },
    type: 'transfer-services',
    sortOrder: 2
  }
];

const sampleProducts = [
  {
    title: {
      en: 'Ha Long Bay 2 Days 1 Night Cruise',
      vi: 'Du Thuyền Vịnh Hạ Long 2 Ngày 1 Đêm'
    },
    slug: 'ha-long-bay-2-days-1-night-cruise',
    description: {
      en: 'Experience the magnificent beauty of Ha Long Bay with our luxury cruise. Visit amazing caves, enjoy fresh seafood, and watch the sunset over the emerald waters.',
      vi: 'Trải nghiệm vẻ đẹp tráng lệ của Vịnh Hạ Long với du thuyền cao cấp. Thăm quan các hang động tuyệt vời, thưởng thức hải sản tươi ngon và ngắm hoàng hôn trên vùng nước xanh ngọc bích.'
    },
    shortDescription: {
      en: 'Luxury cruise experience in the world-famous Ha Long Bay',
      vi: 'Trải nghiệm du thuyền sang trọng tại Vịnh Hạ Long nổi tiếng thế giới'
    },
    pricing: {
      adult: 120,
      child: 80,
      currency: 'USD'
    },
    duration: {
      days: 2,
      nights: 1
    },
    location: {
      en: 'Ha Long Bay, Quang Ninh',
      vi: 'Vịnh Hạ Long, Quảng Ninh'
    },
    highlights: [
      {
        en: 'Cruise through UNESCO World Heritage Site',
        vi: 'Du ngoạn qua Di sản Thế giới UNESCO'
      },
      {
        en: 'Visit Sung Sot Cave and Ti Top Island',
        vi: 'Thăm quan Hang Sửng Sốt và Đảo Ti Tốp'
      },
      {
        en: 'Traditional Vietnamese cuisine onboard',
        vi: 'Ẩm thực truyền thống Việt Nam trên tàu'
      }
    ],
    isFeatured: true,
    isActive: true
  },
  {
    title: {
      en: 'Airport Transfer Service - Noi Bai to Hanoi',
      vi: 'Dịch Vụ Đưa Đón Sân Bay - Nội Bài về Hà Nội'
    },
    slug: 'airport-transfer-service-noi-bai-to-hanoi',
    description: {
      en: 'Comfortable and reliable airport transfer service from Noi Bai International Airport to Hanoi city center. Professional drivers with clean, air-conditioned vehicles.',
      vi: 'Dịch vụ đưa đón sân bay thoải mái và đáng tin cậy từ sân bay quốc tế Nội Bài về trung tâm thành phố Hà Nội. Tài xế chuyên nghiệp với xe sạch sẽ, có điều hòa.'
    },
    shortDescription: {
      en: 'Reliable airport transfer service with professional drivers',
      vi: 'Dịch vụ đưa đón sân bay đáng tin cậy với tài xế chuyên nghiệp'
    },
    pricing: {
      perTrip: 25,
      currency: 'USD'
    },
    location: {
      en: 'Noi Bai Airport - Hanoi',
      vi: 'Sân bay Nội Bài - Hà Nội'
    },
    highlights: [
      {
        en: '24/7 service availability',
        vi: 'Dịch vụ 24/7'
      },
      {
        en: 'Professional English-speaking drivers',
        vi: 'Tài xế chuyên nghiệp nói tiếng Anh'
      },
      {
        en: 'Clean and comfortable vehicles',
        vi: 'Xe sạch sẽ và thoải mái'
      }
    ],
    transferService: {
      type: 'airport-transfer',
      seats: 4,
      vehicleInfo: {
        model: 'Toyota Camry',
        year: 2022,
        features: [
          { en: 'Air Conditioning', vi: 'Điều hòa không khí' },
          { en: 'WiFi Available', vi: 'Có WiFi' },
          { en: 'English Speaking Driver', vi: 'Tài xế nói tiếng Anh' }
        ],
        amenities: [
          { en: 'Bottled Water', vi: 'Nước uống' },
          { en: 'Phone Charger', vi: 'Sạc điện thoại' }
        ]
      },
      route: {
        departure: {
          en: 'Noi Bai International Airport',
          vi: 'Sân bay Quốc tế Nội Bài'
        },
        destination: {
          en: 'Hanoi City Center',
          vi: 'Trung tâm Thành phố Hà Nội'
        },
        distance: 35,
        estimatedTime: 45,
        pickupPoints: [{
          name: {
            en: 'Noi Bai Airport - Terminal 1',
            vi: 'Sân bay Nội Bài - Nhà ga T1'
          },
          address: {
            en: 'Terminal 1, Noi Bai International Airport',
            vi: 'Nhà ga T1, Sân bay Quốc tế Nội Bài'
          }
        }],
        dropoffPoints: [{
          name: {
            en: 'Hanoi Old Quarter',
            vi: 'Phố Cổ Hà Nội'
          },
          address: {
            en: 'Old Quarter, Hoan Kiem District, Hanoi',
            vi: 'Phố Cổ, Quận Hoàn Kiếm, Hà Nội'
          }
        }]
      },
      schedule: {
        frequency: 'on-demand',
        operatingHours: {
          start: '00:00',
          end: '23:59'
        },
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: true
        }
      },
      bookingPolicy: {
        advanceBooking: 2,
        cancellationDeadline: 24,
        minimumPassengers: 1,
        maximumPassengers: 4
      }
    },
    isActive: true
  },
  
  // Additional transfer services
  {
    title: {
      en: 'Luxury LIMO 9-Seat Transfer',
      vi: 'Dịch Vụ LIMO Cao Cấp 9 Chỗ'
    },
    slug: 'luxury-limo-9-seat-transfer',
    description: {
      en: 'Premium LIMO service with luxury amenities for group transfers. Perfect for business travelers and special occasions.',
      vi: 'Dịch vụ LIMO cao cấp với tiện nghi sang trọng cho đưa đón nhóm. Hoàn hảo cho du khách kinh doanh và các dịp đặc biệt.'
    },
    shortDescription: {
      en: 'Luxury LIMO service for premium comfort',
      vi: 'Dịch vụ LIMO sang trọng cho sự thoải mái cao cấp'
    },
    pricing: {
      perTrip: 182,
      currency: 'USD'
    },
    transferService: {
      type: 'luxury-limo',
      seats: 9,
      vehicleInfo: {
        model: 'Mercedes-Benz Sprinter',
        year: 2023,
        features: [
          { en: 'Leather Seats', vi: 'Ghế da' },
          { en: 'Mini Bar', vi: 'Quầy bar mini' },
          { en: 'Entertainment System', vi: 'Hệ thống giải trí' },
          { en: 'Privacy Curtains', vi: 'Rèm riêng tư' }
        ]
      },
      route: {
        departure: { en: 'Sapa', vi: 'Sa Pa' },
        destination: { en: 'Hanoi', vi: 'Hà Nội' },
        distance: 320,
        estimatedTime: 300
      },
      schedule: {
        frequency: 'daily',
        operatingHours: { start: '06:00', end: '20:00' }
      }
    },
    isActive: true
  },

  {
    title: {
      en: 'Shuttle Bus 16-Seats',
      vi: 'Xe Đưa Đón 16 Chỗ'
    },
    slug: 'shuttle-bus-16-seats',
    description: {
      en: 'Comfortable shuttle bus service for medium-sized groups. Perfect for family trips and small tour groups.',
      vi: 'Dịch vụ xe đưa đón thoải mái cho nhóm vừa. Hoàn hảo cho chuyến gia đình và nhóm tour nhỏ.'
    },
    shortDescription: {
      en: 'Comfortable shuttle service for groups',
      vi: 'Dịch vụ đưa đón thoải mái cho nhóm'
    },
    pricing: {
      perTrip: 39,
      currency: 'USD'
    },
    transferService: {
      type: 'shuttle-bus',
      seats: 16,
      vehicleInfo: {
        model: 'Ford Transit',
        year: 2022,
        features: [
          { en: 'Air Conditioning', vi: 'Điều hòa' },
          { en: 'Comfortable Seats', vi: 'Ghế thoải mái' },
          { en: 'Luggage Space', vi: 'Khoang hành lý' }
        ]
      },
      route: {
        departure: { en: 'Airport', vi: 'Sân bay' },
        destination: { en: 'City Center', vi: 'Trung tâm thành phố' },
        distance: 25,
        estimatedTime: 35
      }
    },
    isActive: true
  },

  {
    title: {
      en: 'Private Car 4-Seats',
      vi: 'Xe Riêng 4 Chỗ'
    },
    slug: 'private-car-4-seats',
    description: {
      en: 'Private car service for small groups or families. Comfortable and affordable transportation option.',
      vi: 'Dịch vụ xe riêng cho nhóm nhỏ hoặc gia đình. Lựa chọn vận chuyển thoải mái và phải chăng.'
    },
    shortDescription: {
      en: 'Private car for small groups',
      vi: 'Xe riêng cho nhóm nhỏ'
    },
    pricing: {
      perTrip: 20,
      currency: 'USD'
    },
    transferService: {
      type: 'private-car',
      seats: 4,
      vehicleInfo: {
        model: 'Toyota Vios',
        year: 2021,
        features: [
          { en: 'Air Conditioning', vi: 'Điều hòa' },
          { en: 'GPS Navigation', vi: 'Định vị GPS' }
        ]
      },
      route: {
        departure: { en: 'Airport', vi: 'Sân bay' },
        destination: { en: 'City Center', vi: 'Trung tâm thành phố' },
        distance: 25,
        estimatedTime: 30
      }
    },
    isActive: true
  }
];

const sampleBlogs = [
  {
    title: {
      en: 'Top 10 Must-Visit Destinations in Vietnam',
      vi: 'Top 10 Điểm Đến Không Thể Bỏ Qua Ở Việt Nam'
    },
    slug: 'top-10-must-visit-destinations-in-vietnam',
    content: {
      en: 'Vietnam is a country of stunning natural beauty, rich history, and vibrant culture. From the bustling streets of Ho Chi Minh City to the serene waters of Ha Long Bay, this Southeast Asian gem offers countless experiences for travelers. Here are the top 10 destinations you must visit when in Vietnam...',
      vi: 'Việt Nam là đất nước có cảnh quan thiên nhiên tuyệt đẹp, lịch sử phong phú và văn hóa sôi động. Từ những con phố nhộn nhịp của Thành phố Hồ Chí Minh đến vùng nước yên bình của Vịnh Hạ Long, viên ngọc Đông Nam Á này mang đến vô số trải nghiệm cho du khách. Dưới đây là top 10 điểm đến bạn phải ghé thăm khi đến Việt Nam...'
    },
    excerpt: {
      en: 'Discover the most beautiful and culturally rich destinations that Vietnam has to offer to travelers from around the world.',
      vi: 'Khám phá những điểm đến đẹp nhất và giàu văn hóa mà Việt Nam mang đến cho du khách từ khắp nơi trên thế giới.'
    },
    categories: ['destinations', 'travel-tips'],
    tags: [
      { en: 'Vietnam', vi: 'Việt Nam' },
      { en: 'Travel', vi: 'Du lịch' },
      { en: 'Destinations', vi: 'Điểm đến' }
    ],
    isPublished: true,
    publishedAt: new Date(),
    isFeatured: true
  },
  {
    title: {
      en: 'Vietnamese Food Guide: What to Eat and Where',
      vi: 'Hướng Dẫn Ẩm Thực Việt Nam: Ăn Gì và Ở Đâu'
    },
    slug: 'vietnamese-food-guide-what-to-eat-and-where',
    content: {
      en: 'Vietnamese cuisine is renowned worldwide for its fresh ingredients, aromatic herbs, and complex flavors. From the iconic pho to the crispy banh mi, Vietnamese food offers a symphony of tastes that reflect the country\'s rich culinary heritage. In this comprehensive guide, we\'ll explore the must-try dishes and the best places to find them...',
      vi: 'Ẩm thực Việt Nam nổi tiếng thế giới với những nguyên liệu tươi ngon, thảo mộc thơm và hương vị phức hợp. Từ tô phở nổi tiếng đến bánh mì giòn rụm, ẩm thực Việt Nam mang đến một bản giao hưởng hương vị phản ánh di sản ẩm thực phong phú của đất nước. Trong hướng dẫn toàn diện này, chúng tôi sẽ khám phá những món ăn phải thử và những nơi tốt nhất để tìm thấy chúng...'
    },
    excerpt: {
      en: 'A comprehensive guide to Vietnamese cuisine, featuring must-try dishes and recommendations on where to find the best food.',
      vi: 'Hướng dẫn toàn diện về ẩm thực Việt Nam, giới thiệu những món ăn phải thử và gợi ý về nơi tìm thấy những món ăn ngon nhất.'
    },
    categories: ['food-culture', 'travel-tips'],
    tags: [
      { en: 'Food', vi: 'Ẩm thực' },
      { en: 'Vietnamese cuisine', vi: 'Ẩm thực Việt Nam' },
      { en: 'Culture', vi: 'Văn hóa' }
    ],
    isPublished: true,
    publishedAt: new Date()
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
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

    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      email: process.env.ADMIN_EMAIL || 'admin@zunatravel.com',
      password: process.env.ADMIN_PASSWORD || 'admin123',
      name: 'Admin User',
      role: 'admin'
    });

    await adminUser.save();
    console.log('👤 Admin user created');

    // Create categories
    const categories = await Category.insertMany(sampleCategories);
    console.log(`📂 Created ${categories.length} categories`);

    // Create products with categories
    const productsWithCategories = sampleProducts.map((product, index) => {
      if (index === 0) {
        product.category = categories[0]._id; // Vietnam Tours
      } else {
        product.category = categories[1]._id; // Transfer Services
      }
      return product;
    });

    // Create products
    const products = await Product.insertMany(productsWithCategories);
    console.log(`📦 Created ${products.length} products`);

    // Assign author to blogs
    sampleBlogs.forEach(blog => {
      blog.author = adminUser._id;
    });

    // Create blogs
    const blogs = await Blog.insertMany(sampleBlogs);
    console.log(`📝 Created ${blogs.length} blog posts`);

    console.log('✅ Database seeded successfully!');
    console.log('\n📋 Login credentials:');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
}

// Run the seed function
seedDatabase();
