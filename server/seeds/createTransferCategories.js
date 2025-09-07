const mongoose = require('mongoose');
const Category = require('../models/Category');

// Transfer service categories based on the Quick Guide from the image
const transferCategories = [
  {
    name: {
      en: 'Halong Bay Transfer',
      vi: 'Đưa Đón Vịnh Hạ Long'
    },
    slug: 'halong-bay-transfer',
    description: {
      en: 'Professional transfer service to Halong Bay from Hanoi. Comfortable vehicles with experienced drivers.',
      vi: 'Dịch vụ đưa đón chuyên nghiệp từ Hà Nội đến Vịnh Hạ Long. Xe thoải mái với tài xế giàu kinh nghiệm.'
    },
    type: 'transfer-services',
    vehicleType: 'Private car',
    region: 'north',
    location: {
      en: 'Halong Bay, Quang Ninh',
      vi: 'Vịnh Hạ Long, Quảng Ninh'
    },
    seats: 4,
    sortOrder: 1,
    isActive: true,
    seo: {
      title: {
        en: 'Halong Bay Transfer Service | VnBestTravel',
        vi: 'Dịch Vụ Đưa Đón Vịnh Hạ Long | VnBestTravel'
      },
      description: {
        en: 'Book your Halong Bay transfer with VnBestTravel. Professional service, comfortable vehicles, experienced drivers.',
        vi: 'Đặt dịch vụ đưa đón Vịnh Hạ Long với VnBestTravel. Dịch vụ chuyên nghiệp, xe thoải mái, tài xế giàu kinh nghiệm.'
      },
      keywords: ['halong bay transfer', 'hanoi to halong bay', 'halong bay transportation', 'đưa đón vịnh hạ long']
    }
  },
  {
    name: {
      en: 'Hanoi Sapa Train',
      vi: 'Tàu Hà Nội Sapa'
    },
    slug: 'hanoi-sapa-train',
    description: {
      en: 'Comfortable train journey from Hanoi to Sapa. Overnight sleeper train with modern amenities.',
      vi: 'Hành trình tàu thoải mái từ Hà Nội đến Sapa. Tàu ngủ đêm với tiện nghi hiện đại.'
    },
    type: 'transfer-services',
    vehicleType: 'Sleeping Bus',
    region: 'north',
    location: {
      en: 'Sapa, Lao Cai',
      vi: 'Sapa, Lào Cai'
    },
    seats: 40,
    sortOrder: 2,
    isActive: true,
    seo: {
      title: {
        en: 'Hanoi to Sapa Train Service | VnBestTravel',
        vi: 'Dịch Vụ Tàu Hà Nội Sapa | VnBestTravel'
      },
      description: {
        en: 'Travel from Hanoi to Sapa by train. Comfortable sleeper train with modern amenities and scenic views.',
        vi: 'Du lịch từ Hà Nội đến Sapa bằng tàu. Tàu ngủ thoải mái với tiện nghi hiện đại và cảnh đẹp.'
      },
      keywords: ['hanoi sapa train', 'sapa train service', 'hanoi to sapa', 'tàu hà nội sapa']
    }
  },
  {
    name: {
      en: 'Ha Giang Transfer',
      vi: 'Đưa Đón Hà Giang'
    },
    slug: 'ha-giang-transfer',
    description: {
      en: 'Adventure transfer to Ha Giang province. Experience the stunning mountain landscapes.',
      vi: 'Đưa đón khám phá đến tỉnh Hà Giang. Trải nghiệm cảnh quan núi non tuyệt đẹp.'
    },
    type: 'transfer-services',
    vehicleType: 'Private car',
    region: 'north',
    location: {
      en: 'Ha Giang Province',
      vi: 'Tỉnh Hà Giang'
    },
    seats: 4,
    sortOrder: 3,
    isActive: true,
    seo: {
      title: {
        en: 'Ha Giang Transfer Service | VnBestTravel',
        vi: 'Dịch Vụ Đưa Đón Hà Giang | VnBestTravel'
      },
      description: {
        en: 'Adventure transfer to Ha Giang. Experience stunning mountain landscapes and ethnic culture.',
        vi: 'Đưa đón khám phá đến Hà Giang. Trải nghiệm cảnh quan núi non tuyệt đẹp và văn hóa dân tộc.'
      },
      keywords: ['ha giang transfer', 'ha giang transportation', 'ha giang loop', 'đưa đón hà giang']
    }
  },
  {
    name: {
      en: 'Airport Transfer',
      vi: 'Đưa Đón Sân Bay'
    },
    slug: 'airport-transfer',
    description: {
      en: 'Reliable airport transfer service. Meet and greet service with professional drivers.',
      vi: 'Dịch vụ đưa đón sân bay đáng tin cậy. Dịch vụ đón tiếp với tài xế chuyên nghiệp.'
    },
    type: 'transfer-services',
    vehicleType: 'Airport Transfer',
    region: 'all',
    location: {
      en: 'All Airports in Vietnam',
      vi: 'Tất Cả Sân Bay Việt Nam'
    },
    seats: 4,
    sortOrder: 4,
    isActive: true,
    seo: {
      title: {
        en: 'Airport Transfer Service Vietnam | VnBestTravel',
        vi: 'Dịch Vụ Đưa Đón Sân Bay Việt Nam | VnBestTravel'
      },
      description: {
        en: 'Professional airport transfer service in Vietnam. Meet and greet, reliable transportation.',
        vi: 'Dịch vụ đưa đón sân bay chuyên nghiệp tại Việt Nam. Đón tiếp, vận chuyển đáng tin cậy.'
      },
      keywords: ['airport transfer vietnam', 'vietnam airport pickup', 'đưa đón sân bay', 'airport transportation']
    }
  },
  {
    name: {
      en: 'Sapa Transfer',
      vi: 'Đưa Đón Sapa'
    },
    slug: 'sapa-transfer',
    description: {
      en: 'Direct transfer to Sapa from Hanoi. Comfortable journey to the mountain town.',
      vi: 'Đưa đón trực tiếp từ Hà Nội đến Sapa. Hành trình thoải mái đến thị trấn miền núi.'
    },
    type: 'transfer-services',
    vehicleType: 'Shuttle Bus',
    region: 'north',
    location: {
      en: 'Sapa, Lao Cai',
      vi: 'Sapa, Lào Cai'
    },
    seats: 16,
    sortOrder: 5,
    isActive: true,
    seo: {
      title: {
        en: 'Sapa Transfer Service | VnBestTravel',
        vi: 'Dịch Vụ Đưa Đón Sapa | VnBestTravel'
      },
      description: {
        en: 'Direct transfer to Sapa from Hanoi. Comfortable shuttle bus service to the mountain town.',
        vi: 'Đưa đón trực tiếp từ Hà Nội đến Sapa. Dịch vụ xe buýt thoải mái đến thị trấn miền núi.'
      },
      keywords: ['sapa transfer', 'hanoi to sapa bus', 'sapa transportation', 'đưa đón sapa']
    }
  },
  {
    name: {
      en: 'Ninh Binh Transfer',
      vi: 'Đưa Đón Ninh Bình'
    },
    slug: 'ninh-binh-transfer',
    description: {
      en: 'Explore Ninh Binh with our transfer service. Visit ancient temples and limestone mountains.',
      vi: 'Khám phá Ninh Bình với dịch vụ đưa đón của chúng tôi. Thăm chùa cổ và núi đá vôi.'
    },
    type: 'transfer-services',
    vehicleType: 'Private car',
    region: 'north',
    location: {
      en: 'Ninh Binh Province',
      vi: 'Tỉnh Ninh Bình'
    },
    seats: 4,
    sortOrder: 6,
    isActive: true,
    seo: {
      title: {
        en: 'Ninh Binh Transfer Service | VnBestTravel',
        vi: 'Dịch Vụ Đưa Đón Ninh Bình | VnBestTravel'
      },
      description: {
        en: 'Transfer service to Ninh Binh. Visit ancient temples, limestone mountains, and scenic landscapes.',
        vi: 'Dịch vụ đưa đón đến Ninh Bình. Thăm chùa cổ, núi đá vôi và cảnh quan đẹp.'
      },
      keywords: ['ninh binh transfer', 'ninh binh transportation', 'trang an transfer', 'đưa đón ninh bình']
    }
  },
  {
    name: {
      en: 'Cat Ba Transfer',
      vi: 'Đưa Đón Cát Bà'
    },
    slug: 'cat-ba-transfer',
    description: {
      en: 'Island transfer to Cat Ba. Combine ferry and road transport for island adventure.',
      vi: 'Đưa đón đảo Cát Bà. Kết hợp phà và vận chuyển đường bộ cho cuộc phiêu lưu đảo.'
    },
    type: 'transfer-services',
    vehicleType: 'Shuttle Bus',
    region: 'north',
    location: {
      en: 'Cat Ba Island, Hai Phong',
      vi: 'Đảo Cát Bà, Hải Phòng'
    },
    seats: 16,
    sortOrder: 7,
    isActive: true,
    seo: {
      title: {
        en: 'Cat Ba Island Transfer Service | VnBestTravel',
        vi: 'Dịch Vụ Đưa Đón Đảo Cát Bà | VnBestTravel'
      },
      description: {
        en: 'Transfer service to Cat Ba Island. Combine ferry and road transport for island adventure.',
        vi: 'Dịch vụ đưa đón đến Đảo Cát Bà. Kết hợp phà và vận chuyển đường bộ cho cuộc phiêu lưu đảo.'
      },
      keywords: ['cat ba transfer', 'cat ba island transportation', 'cat ba ferry', 'đưa đón cát bà']
    }
  },
  {
    name: {
      en: 'All in One Transfers Package',
      vi: 'Gói Đưa Đón Tất Trong Một'
    },
    slug: 'all-in-one-transfers-package',
    description: {
      en: 'Complete transfer package for your Vietnam adventure. Multiple destinations in one convenient package.',
      vi: 'Gói đưa đón hoàn chỉnh cho cuộc phiêu lưu Việt Nam của bạn. Nhiều điểm đến trong một gói tiện lợi.'
    },
    type: 'transfer-services',
    vehicleType: 'Luxury LIMO',
    region: 'all',
    location: {
      en: 'All Vietnam Destinations',
      vi: 'Tất Cả Điểm Đến Việt Nam'
    },
    seats: 4,
    sortOrder: 8,
    isActive: true,
    seo: {
      title: {
        en: 'All in One Vietnam Transfer Package | VnBestTravel',
        vi: 'Gói Đưa Đón Tất Trong Một Việt Nam | VnBestTravel'
      },
      description: {
        en: 'Complete transfer package for Vietnam. Visit multiple destinations with luxury transportation.',
        vi: 'Gói đưa đón hoàn chỉnh cho Việt Nam. Thăm nhiều điểm đến với vận chuyển sang trọng.'
      },
      keywords: ['vietnam transfer package', 'all in one transfer', 'vietnam transportation package', 'gói đưa đón việt nam']
    }
  }
];

const seedTransferCategories = async () => {
  try {
    console.log('🚗 Starting transfer categories seeding...');

    // Clear existing transfer service categories
    await Category.deleteMany({ type: 'transfer-services' });
    console.log('🗑️  Cleared existing transfer service categories');

    // Create transfer categories
    const createdCategories = [];
    for (const categoryData of transferCategories) {
      const category = new Category(categoryData);
      await category.save();
      createdCategories.push(category);
      console.log(`✅ Created: ${categoryData.name.en} (${categoryData.slug})`);
    }

    console.log(`🎉 Successfully created ${createdCategories.length} transfer categories`);
    console.log('📋 Transfer Categories Summary:');
    createdCategories.forEach(category => {
      console.log(`   - ${category.name.en} (${category.slug}) - ${category.vehicleType} - ${category.seats} seats`);
    });

    return createdCategories;

  } catch (error) {
    console.error('❌ Error seeding transfer categories:', error);
    throw error;
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://namp280918:zunatravel@cluster0.od0rj5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return seedTransferCategories();
    })
    .then(() => {
      console.log('✅ Transfer categories seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTransferCategories, transferCategories };
