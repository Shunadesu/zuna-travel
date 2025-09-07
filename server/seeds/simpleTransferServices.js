const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
require('dotenv').config();

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://zunatravel:zunatravel123@cluster0.8kqjq.mongodb.net/zunatravel?retryWrites=true&w=majority');
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Simple transfer services based on the image
const simpleTransferServices = [
  {
    title: {
      en: 'Hanoi Airport Sapa Bus',
      vi: 'Xe Bus Sapa từ Sân Bay Hanoi'
    },
    slug: 'hanoi-airport-sapa-bus',
    shortDescription: {
      en: 'Comfortable bus service from Hanoi Airport to Sapa',
      vi: 'Dịch vụ xe bus thoải mái từ Sân Bay Hanoi đến Sapa'
    },
    description: {
      en: 'Direct bus service from Noi Bai Airport to Sapa with comfortable seating, air conditioning, and professional drivers.',
      vi: 'Dịch vụ xe bus trực tiếp từ Sân Bay Nội Bài đến Sapa với ghế ngồi thoải mái, điều hòa và tài xế chuyên nghiệp.'
    },
    category: 'hanoi-sapa-train',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Airport Sapa Bus', vi: 'Xe Bus Sapa từ Sân Bay Hanoi' }
      }
    ],
    pricing: {
      adult: 12,
      child: 8,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Direct from airport',
        vi: 'Trực tiếp từ sân bay'
      },
      {
        en: 'Comfortable journey',
        vi: 'Hành trình thoải mái'
      },
      {
        en: 'Professional service',
        vi: 'Dịch vụ chuyên nghiệp'
      }
    ],
    included: [
      {
        en: 'Airport pickup',
        vi: 'Đón từ sân bay'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Air conditioning',
        vi: 'Điều hòa'
      }
    ],
    excluded: [
      {
        en: 'Meals',
        vi: 'Bữa ăn'
      },
      {
        en: 'Personal expenses',
        vi: 'Chi phí cá nhân'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.5,
      count: 1250
    },
    seo: {
      title: {
        en: 'Hanoi Airport Sapa Bus - Direct Transfer Service',
        vi: 'Xe Bus Sapa từ Sân Bay Hanoi - Dịch vụ Chuyển Tiếp Trực Tiếp'
      },
      description: {
        en: 'Book comfortable bus transfer from Hanoi Airport to Sapa. Professional service, air conditioning. From $12.',
        vi: 'Đặt xe bus thoải mái từ Sân Bay Hanoi đến Sapa. Dịch vụ chuyên nghiệp, điều hòa. Từ $12.'
      },
      keywords: ['hanoi airport sapa bus', 'sapa transfer', 'airport pickup sapa']
    }
  },
  {
    title: {
      en: 'Hanoi Sapa Sleeping Bus',
      vi: 'Xe Bus Giường Nằm Hanoi Sapa'
    },
    slug: 'hanoi-sapa-sleeping-bus',
    shortDescription: {
      en: 'Overnight sleeping bus from Hanoi to Sapa',
      vi: 'Xe bus giường nằm qua đêm từ Hanoi đến Sapa'
    },
    description: {
      en: 'Comfortable overnight sleeping bus service from Hanoi to Sapa. Save time and money with this popular option.',
      vi: 'Dịch vụ xe bus giường nằm qua đêm thoải mái từ Hanoi đến Sapa. Tiết kiệm thời gian và chi phí.'
    },
    category: 'hanoi-sapa-train',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Sapa Sleeping Bus', vi: 'Xe Bus Giường Nằm Hanoi Sapa' }
      }
    ],
    pricing: {
      adult: 12,
      child: 8,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Overnight journey',
        vi: 'Hành trình qua đêm'
      },
      {
        en: 'Reclining seats',
        vi: 'Ghế ngả'
      },
      {
        en: 'Cost effective',
        vi: 'Tiết kiệm chi phí'
      }
    ],
    included: [
      {
        en: 'Reclining seats',
        vi: 'Ghế ngả'
      },
      {
        en: 'Blankets provided',
        vi: 'Có chăn'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      }
    ],
    excluded: [
      {
        en: 'Meals',
        vi: 'Bữa ăn'
      },
      {
        en: 'Personal expenses',
        vi: 'Chi phí cá nhân'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.3,
      count: 890
    },
    seo: {
      title: {
        en: 'Hanoi Sapa Sleeping Bus - Overnight Transfer',
        vi: 'Xe Bus Giường Nằm Hanoi Sapa - Chuyển Tiếp Qua Đêm'
      },
      description: {
        en: 'Comfortable overnight sleeping bus from Hanoi to Sapa. Reclining seats, blankets. From $12.',
        vi: 'Xe bus giường nằm qua đêm thoải mái từ Hanoi đến Sapa. Ghế ngả, chăn. Từ $12.'
      },
      keywords: ['hanoi sapa sleeping bus', 'overnight bus sapa', 'sapa transfer']
    }
  },
  {
    title: {
      en: 'Hanoi Airport Transfer - Airport to Old Quarter',
      vi: 'Đưa Đón Sân Bay Hanoi - Sân Bay đến Phố Cổ'
    },
    slug: 'hanoi-airport-transfer-old-quarter',
    shortDescription: {
      en: 'Private transfer from Hanoi Airport to Old Quarter',
      vi: 'Đưa đón riêng từ Sân Bay Hanoi đến Phố Cổ'
    },
    description: {
      en: 'Convenient private transfer service from Noi Bai Airport to Hanoi Old Quarter. Professional drivers, comfortable vehicles.',
      vi: 'Dịch vụ đưa đón riêng tiện lợi từ Sân Bay Nội Bài đến Phố Cổ Hanoi. Tài xế chuyên nghiệp, xe thoải mái.'
    },
    category: 'airport-transfer',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Airport Transfer', vi: 'Đưa Đón Sân Bay Hanoi' }
      }
    ],
    pricing: {
      adult: 16,
      child: 12,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Private transfer',
        vi: 'Đưa đón riêng'
      },
      {
        en: 'Door-to-door service',
        vi: 'Dịch vụ tận nơi'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      }
    ],
    included: [
      {
        en: 'Airport pickup',
        vi: 'Đón từ sân bay'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Comfortable vehicle',
        vi: 'Xe thoải mái'
      }
    ],
    excluded: [
      {
        en: 'Meals',
        vi: 'Bữa ăn'
      },
      {
        en: 'Personal expenses',
        vi: 'Chi phí cá nhân'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.7,
      count: 650
    },
    seo: {
      title: {
        en: 'Hanoi Airport Transfer to Old Quarter - Private Service',
        vi: 'Đưa Đón Sân Bay Hanoi đến Phố Cổ - Dịch Vụ Riêng'
      },
      description: {
        en: 'Private transfer from Hanoi Airport to Old Quarter. Professional drivers, comfortable vehicles. From $16.',
        vi: 'Đưa đón riêng từ Sân Bay Hanoi đến Phố Cổ. Tài xế chuyên nghiệp, xe thoải mái. Từ $16.'
      },
      keywords: ['hanoi airport transfer', 'old quarter transfer', 'airport pickup hanoi']
    }
  },
  {
    title: {
      en: 'Hanoi to Sapa Private Car, Limousine Van',
      vi: 'Xe Riêng Hanoi Sapa, Limousine Van'
    },
    slug: 'hanoi-sapa-private-car-limousine',
    shortDescription: {
      en: 'Luxury private car and limousine van to Sapa',
      vi: 'Xe riêng sang trọng và limousine van đến Sapa'
    },
    description: {
      en: 'Premium private car and limousine van service from Hanoi to Sapa. Comfortable, spacious vehicles with professional drivers.',
      vi: 'Dịch vụ xe riêng cao cấp và limousine van từ Hanoi đến Sapa. Xe thoải mái, rộng rãi với tài xế chuyên nghiệp.'
    },
    category: 'hanoi-sapa-train',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Sapa Private Car', vi: 'Xe Riêng Hanoi Sapa' }
      }
    ],
    pricing: {
      adult: 136,
      child: 100,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Luxury vehicle',
        vi: 'Xe sang trọng'
      },
      {
        en: 'Private service',
        vi: 'Dịch vụ riêng'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      }
    ],
    included: [
      {
        en: 'Private vehicle',
        vi: 'Xe riêng'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Comfortable seating',
        vi: 'Ghế ngồi thoải mái'
      }
    ],
    excluded: [
      {
        en: 'Meals',
        vi: 'Bữa ăn'
      },
      {
        en: 'Personal expenses',
        vi: 'Chi phí cá nhân'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.8,
      count: 420
    },
    seo: {
      title: {
        en: 'Hanoi to Sapa Private Car Limousine - Luxury Transfer',
        vi: 'Xe Riêng Hanoi Sapa Limousine - Chuyển Tiếp Sang Trọng'
      },
      description: {
        en: 'Luxury private car and limousine van from Hanoi to Sapa. Professional drivers, comfortable vehicles. From $136.',
        vi: 'Xe riêng sang trọng và limousine van từ Hanoi đến Sapa. Tài xế chuyên nghiệp, xe thoải mái. Từ $136.'
      },
      keywords: ['hanoi sapa private car', 'sapa limousine', 'luxury transfer sapa']
    }
  },
  {
    title: {
      en: 'Hanoi Cat Ba Island Bus',
      vi: 'Xe Bus Hanoi Đảo Cát Bà'
    },
    slug: 'hanoi-cat-ba-island-bus',
    shortDescription: {
      en: 'Bus service from Hanoi to Cat Ba Island',
      vi: 'Dịch vụ xe bus từ Hanoi đến Đảo Cát Bà'
    },
    description: {
      en: 'Comfortable bus service from Hanoi to Cat Ba Island with ferry transfer included. Perfect for exploring the beautiful island.',
      vi: 'Dịch vụ xe bus thoải mái từ Hanoi đến Đảo Cát Bà bao gồm chuyển phà. Hoàn hảo để khám phá hòn đảo xinh đẹp.'
    },
    category: 'cat-ba-transfer',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Cat Ba Island Bus', vi: 'Xe Bus Hanoi Đảo Cát Bà' }
      }
    ],
    pricing: {
      adult: 16,
      child: 12,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Island destination',
        vi: 'Điểm đến đảo'
      },
      {
        en: 'Ferry included',
        vi: 'Bao gồm phà'
      },
      {
        en: 'Comfortable journey',
        vi: 'Hành trình thoải mái'
      }
    ],
    included: [
      {
        en: 'Bus transfer',
        vi: 'Chuyển xe bus'
      },
      {
        en: 'Ferry ticket',
        vi: 'Vé phà'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      }
    ],
    excluded: [
      {
        en: 'Meals',
        vi: 'Bữa ăn'
      },
      {
        en: 'Personal expenses',
        vi: 'Chi phí cá nhân'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.4,
      count: 380
    },
    seo: {
      title: {
        en: 'Hanoi Cat Ba Island Bus - Ferry Transfer Included',
        vi: 'Xe Bus Hanoi Đảo Cát Bà - Bao Gồm Chuyển Phà'
      },
      description: {
        en: 'Bus service from Hanoi to Cat Ba Island with ferry transfer. Comfortable journey, professional service. From $16.',
        vi: 'Dịch vụ xe bus từ Hanoi đến Đảo Cát Bà bao gồm chuyển phà. Hành trình thoải mái, dịch vụ chuyên nghiệp. Từ $16.'
      },
      keywords: ['hanoi cat ba bus', 'cat ba island transfer', 'ferry to cat ba']
    }
  },
  {
    title: {
      en: 'Hanoi Halong Bay Luxury Limousine',
      vi: 'Limousine Sang Trọng Hanoi Vịnh Hạ Long'
    },
    slug: 'hanoi-halong-bay-luxury-limousine',
    shortDescription: {
      en: 'Luxury limousine to Halong Bay with premium amenities',
      vi: 'Limousine sang trọng đến Vịnh Hạ Long với tiện nghi cao cấp'
    },
    description: {
      en: 'Premium luxury limousine service from Hanoi to Halong Bay. Features English speaking driver, LCD screen, soft drinks, travel insurance, USB charging ports, WiFi, and snacks.',
      vi: 'Dịch vụ limousine sang trọng cao cấp từ Hanoi đến Vịnh Hạ Long. Có tài xế nói tiếng Anh, màn hình LCD, nước ngọt, bảo hiểm du lịch, cổng sạc USB, WiFi và đồ ăn nhẹ.'
    },
    category: 'halong-bay-transfer',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Halong Bay Luxury Limousine', vi: 'Limousine Sang Trọng Hanoi Vịnh Hạ Long' }
      }
    ],
    pricing: {
      adult: 16,
      child: 12,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Luxury vehicle',
        vi: 'Xe sang trọng'
      },
      {
        en: 'English speaking driver',
        vi: 'Tài xế nói tiếng Anh'
      },
      {
        en: 'Premium amenities',
        vi: 'Tiện nghi cao cấp'
      }
    ],
    included: [
      {
        en: 'Luxury limousine',
        vi: 'Limousine sang trọng'
      },
      {
        en: 'English speaking driver',
        vi: 'Tài xế nói tiếng Anh'
      },
      {
        en: 'LCD screen',
        vi: 'Màn hình LCD'
      },
      {
        en: 'Soft drinks',
        vi: 'Nước ngọt'
      },
      {
        en: 'Travel insurance',
        vi: 'Bảo hiểm du lịch'
      },
      {
        en: 'USB charging ports',
        vi: 'Cổng sạc USB'
      },
      {
        en: 'Free WiFi',
        vi: 'WiFi miễn phí'
      },
      {
        en: 'Snacks',
        vi: 'Đồ ăn nhẹ'
      }
    ],
    excluded: [
      {
        en: 'Meals',
        vi: 'Bữa ăn'
      },
      {
        en: 'Personal expenses',
        vi: 'Chi phí cá nhân'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.8,
      count: 280
    },
    seo: {
      title: {
        en: 'Hanoi Halong Bay Luxury Limousine - Premium Transfer',
        vi: 'Limousine Sang Trọng Hanoi Vịnh Hạ Long - Chuyển Tiếp Cao Cấp'
      },
      description: {
        en: 'Luxury limousine from Hanoi to Halong Bay. English driver, LCD, WiFi, snacks, travel insurance. From $16.',
        vi: 'Limousine sang trọng từ Hanoi đến Vịnh Hạ Long. Tài xế tiếng Anh, LCD, WiFi, đồ ăn nhẹ, bảo hiểm du lịch. Từ $16.'
      },
      keywords: ['hanoi halong bay limousine', 'halong bay luxury transfer', 'premium halong bay']
    }
  }
];

// Function to create simple transfer services
const createSimpleTransferServices = async () => {
  try {
    console.log('🚀 Starting to create simple transfer services...');
    
    // Get all categories to map them correctly
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });
    
    console.log('📋 Available categories:', Object.keys(categoryMap));
    
    let createdCount = 0;
    let skippedCount = 0;
    
    for (const service of simpleTransferServices) {
      try {
        // Check if service already exists
        const existingService = await Product.findOne({ slug: service.slug });
        if (existingService) {
          console.log(`⚠️  Service "${service.slug}" already exists, skipping...`);
          skippedCount++;
          continue;
        }
        
        // Map category slug to ObjectId
        const categoryId = categoryMap[service.category];
        if (!categoryId) {
          console.log(`❌ Category "${service.category}" not found for service "${service.slug}"`);
          continue;
        }
        
        // Create the service
        const newService = new Product({
          ...service,
          category: categoryId
        });
        
        await newService.save();
        console.log(`✅ Created service: ${service.title.en}`);
        createdCount++;
        
      } catch (error) {
        console.error(`❌ Error creating service "${service.slug}":`, error.message);
      }
    }
    
    console.log('\n📊 Summary:');
    console.log(`✅ Created: ${createdCount} services`);
    console.log(`⚠️  Skipped: ${skippedCount} services`);
    console.log(`📝 Total processed: ${simpleTransferServices.length} services`);
    
  } catch (error) {
    console.error('❌ Error creating simple transfer services:', error);
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await createSimpleTransferServices();
    console.log('\n🎉 Simple transfer services creation completed!');
  } catch (error) {
    console.error('❌ Main execution error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createSimpleTransferServices, simpleTransferServices };
