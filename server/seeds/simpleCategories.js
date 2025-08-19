const mongoose = require('mongoose');
const Category = require('../models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const vietnamToursCategories = [
  {
    name: {
      en: 'Hanoi',
      vi: 'Hà Nội'
    },
    slug: 'hanoi',
    description: {
      en: 'Explore the historic capital of Vietnam with its rich culture and delicious street food',
      vi: 'Khám phá thủ đô lịch sử của Việt Nam với văn hóa phong phú và ẩm thực đường phố ngon'
    },
    type: 'vietnam-tours',
    location: {
      en: 'Hanoi, Vietnam',
      vi: 'Hà Nội, Việt Nam'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Hanoi Old Quarter', vi: 'Phố Cổ Hà Nội' }
      }
    ],
    sortOrder: 1,
    isActive: true
  },
  {
    name: {
      en: 'Ha Long Bay',
      vi: 'Vịnh Hạ Long'
    },
    slug: 'ha-long-bay',
    description: {
      en: 'UNESCO World Heritage site with thousands of limestone islands',
      vi: 'Di sản thế giới UNESCO với hàng nghìn hòn đảo đá vôi'
    },
    type: 'vietnam-tours',
    location: {
      en: 'Quang Ninh Province, Vietnam',
      vi: 'Tỉnh Quảng Ninh, Việt Nam'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Ha Long Bay', vi: 'Vịnh Hạ Long' }
      }
    ],
    sortOrder: 2,
    isActive: true
  },
  {
    name: {
      en: 'Sapa',
      vi: 'Sa Pa'
    },
    slug: 'sapa',
    description: {
      en: 'Mountainous region with ethnic minority villages and trekking trails',
      vi: 'Vùng núi với các làng dân tộc thiểu số và đường mòn trekking'
    },
    type: 'vietnam-tours',
    location: {
      en: 'Lao Cai Province, Vietnam',
      vi: 'Tỉnh Lào Cai, Việt Nam'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Sapa Rice Terraces', vi: 'Ruộng bậc thang Sa Pa' }
      }
    ],
    sortOrder: 3,
    isActive: true
  },
  {
    name: {
      en: 'Hue',
      vi: 'Huế'
    },
    slug: 'hue',
    description: {
      en: 'Former imperial capital with ancient citadel and royal tombs',
      vi: 'Cố đô với thành cổ và lăng tẩm hoàng gia'
    },
    type: 'vietnam-tours',
    location: {
      en: 'Thua Thien Hue Province, Vietnam',
      vi: 'Tỉnh Thừa Thiên Huế, Việt Nam'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Hue Imperial City', vi: 'Cố Đô Huế' }
      }
    ],
    sortOrder: 4,
    isActive: true
  },
  {
    name: {
      en: 'Hoi An',
      vi: 'Hội An'
    },
    slug: 'hoi-an',
    description: {
      en: 'Ancient trading port with lantern-lit streets and tailors',
      vi: 'Cảng thương mại cổ với phố đèn lồng và thợ may'
    },
    type: 'vietnam-tours',
    location: {
      en: 'Quang Nam Province, Vietnam',
      vi: 'Tỉnh Quảng Nam, Việt Nam'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Hoi An Ancient Town', vi: 'Phố Cổ Hội An' }
      }
    ],
    sortOrder: 5,
    isActive: true
  },
  {
    name: {
      en: 'Ho Chi Minh City',
      vi: 'Thành phố Hồ Chí Minh'
    },
    slug: 'ho-chi-minh-city',
    description: {
      en: 'Vietnam\'s largest city with vibrant culture and history',
      vi: 'Thành phố lớn nhất Việt Nam với văn hóa và lịch sử sôi động'
    },
    type: 'vietnam-tours',
    location: {
      en: 'Ho Chi Minh City, Vietnam',
      vi: 'Thành phố Hồ Chí Minh, Việt Nam'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Ho Chi Minh City', vi: 'TP. Hồ Chí Minh' }
      }
    ],
    sortOrder: 6,
    isActive: true
  },
  {
    name: {
      en: 'Mekong Delta',
      vi: 'Đồng Bằng Sông Cửu Long'
    },
    slug: 'mekong-delta',
    description: {
      en: 'River life and floating markets of the Mekong Delta',
      vi: 'Cuộc sống sông nước và chợ nổi của đồng bằng sông Cửu Long'
    },
    type: 'vietnam-tours',
    location: {
      en: 'Mekong Delta, Vietnam',
      vi: 'Đồng bằng sông Cửu Long, Việt Nam'
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Mekong Delta', vi: 'Đồng Bằng Sông Cửu Long' }
      }
    ],
    sortOrder: 7,
    isActive: true
  }
];

const transferServicesCategories = [
  {
    name: {
      en: 'Luxury LIMO',
      vi: 'LIMO cao cấp'
    },
    slug: 'luxury-limo',
    description: {
      en: 'Premium luxury limousine service with professional chauffeurs',
      vi: 'Dịch vụ limousine cao cấp với tài xế chuyên nghiệp'
    },
    type: 'transfer-services',
    location: {
      en: 'All Locations, Vietnam',
      vi: 'Tất cả địa điểm, Việt Nam'
    },
    vehicleType: 'Luxury LIMO',
    seats: 9,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Luxury LIMO', vi: 'LIMO cao cấp' }
      }
    ],
    sortOrder: 1,
    isActive: true
  },
  {
    name: {
      en: 'Sharing Bus',
      vi: 'Xe buýt chia sẻ'
    },
    slug: 'sharing-bus',
    description: {
      en: 'Cost-effective shared bus service for group travel',
      vi: 'Dịch vụ xe buýt chia sẻ tiết kiệm cho nhóm du lịch'
    },
    type: 'transfer-services',
    location: {
      en: 'All Locations, Vietnam',
      vi: 'Tất cả địa điểm, Việt Nam'
    },
    vehicleType: 'Sharing Bus',
    seats: 45,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Sharing Bus', vi: 'Xe buýt chia sẻ' }
      }
    ],
    sortOrder: 2,
    isActive: true
  },
  {
    name: {
      en: 'Private Car',
      vi: 'Xe ô tô riêng'
    },
    slug: 'private-car',
    description: {
      en: 'Private car service for exclusive and comfortable travel',
      vi: 'Dịch vụ xe ô tô riêng cho chuyến đi độc quyền và thoải mái'
    },
    type: 'transfer-services',
    location: {
      en: 'All Locations, Vietnam',
      vi: 'Tất cả địa điểm, Việt Nam'
    },
    vehicleType: 'Private car',
    seats: 4,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Private Car', vi: 'Xe ô tô riêng' }
      }
    ],
    sortOrder: 3,
    isActive: true
  },
  {
    name: {
      en: 'Shuttle Bus',
      vi: 'Xe đưa đón'
    },
    slug: 'shuttle-bus',
    description: {
      en: 'Regular shuttle bus service for airport and hotel transfers',
      vi: 'Dịch vụ xe đưa đón thường xuyên cho sân bay và khách sạn'
    },
    type: 'transfer-services',
    location: {
      en: 'All Locations, Vietnam',
      vi: 'Tất cả địa điểm, Việt Nam'
    },
    vehicleType: 'Shuttle Bus',
    seats: 16,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Shuttle Bus', vi: 'Xe đưa đón' }
      }
    ],
    sortOrder: 4,
    isActive: true
  },
  {
    name: {
      en: 'Private LIMO',
      vi: 'LIMO riêng'
    },
    slug: 'private-limo',
    description: {
      en: 'Private limousine service for luxury travel experience',
      vi: 'Dịch vụ limousine riêng cho trải nghiệm du lịch sang trọng'
    },
    type: 'transfer-services',
    location: {
      en: 'All Locations, Vietnam',
      vi: 'Tất cả địa điểm, Việt Nam'
    },
    vehicleType: 'Private car/Private LIMO',
    seats: 7,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Private LIMO', vi: 'LIMO riêng' }
      }
    ],
    sortOrder: 5,
    isActive: true
  },
  {
    name: {
      en: 'Sleeping Bus',
      vi: 'Xe giường nằm'
    },
    slug: 'sleeping-bus',
    description: {
      en: 'Comfortable sleeping bus for long-distance overnight travel',
      vi: 'Xe giường nằm thoải mái cho chuyến đi đường dài qua đêm'
    },
    type: 'transfer-services',
    location: {
      en: 'All Locations, Vietnam',
      vi: 'Tất cả địa điểm, Việt Nam'
    },
    vehicleType: 'Sleeping Bus',
    seats: 45,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Sleeping Bus', vi: 'Xe giường nằm' }
      }
    ],
    sortOrder: 6,
    isActive: true
  },
  {
    name: {
      en: 'Airport Transfer',
      vi: 'Đưa đón sân bay'
    },
    slug: 'airport-transfer',
    description: {
      en: 'Professional airport transfer service with meet and greet',
      vi: 'Dịch vụ đưa đón sân bay chuyên nghiệp với đón tiếp'
    },
    type: 'transfer-services',
    location: {
      en: 'All Airports, Vietnam',
      vi: 'Tất cả sân bay, Việt Nam'
    },
    vehicleType: 'Airport Transfer',
    seats: 7,
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Airport Transfer', vi: 'Đưa đón sân bay' }
      }
    ],
    sortOrder: 7,
    isActive: true
  }
];

const seedSimpleCategories = async () => {
  try {
    console.log('🌱 Seeding simple categories...');

    // Clear existing categories
    await Category.deleteMany({});

    // Create Vietnam Tours categories
    for (const categoryData of vietnamToursCategories) {
      const category = new Category(categoryData);
      await category.save();
      console.log(`✅ Created Vietnam Tours category: ${category.name.en}`);
    }

    // Create Transfer Services categories
    for (const categoryData of transferServicesCategories) {
      const category = new Category(categoryData);
      await category.save();
      console.log(`✅ Created Transfer Services category: ${category.name.en}`);
    }

    console.log('🎉 Simple categories seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding simple categories:', error);
  }
};

module.exports = seedSimpleCategories;

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedSimpleCategories()
    .then(() => {
      console.log('Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
