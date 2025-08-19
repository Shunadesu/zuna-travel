const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Transfer services data based on the image
const transferServices = [
  {
    title: {
      en: 'Halong Bay Transfer',
      vi: 'Đưa Đón Vịnh Hạ Long'
    },
    slug: 'halong-bay-transfer',
    description: {
      en: 'Professional transfer service to Halong Bay from Hanoi. Comfortable vehicles with experienced drivers.',
      vi: 'Dịch vụ đưa đón chuyên nghiệp từ Hà Nội đến Vịnh Hạ Long. Xe thoải mái với tài xế giàu kinh nghiệm.'
    },
    content: {
      en: 'Experience seamless travel to Halong Bay with our premium transfer service. We offer comfortable vehicles, professional drivers, and flexible scheduling to ensure your journey is as enjoyable as your destination.',
      vi: 'Trải nghiệm hành trình mượt mà đến Vịnh Hạ Long với dịch vụ đưa đón cao cấp của chúng tôi. Chúng tôi cung cấp xe thoải mái, tài xế chuyên nghiệp và lịch trình linh hoạt để đảm bảo hành trình của bạn thú vị như điểm đến.'
    },
    category: 'private-car',
    pricing: {
      adult: 45,
      child: 35,
      infant: 0
    },
    duration: {
      days: 1,
      hours: 4
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'Halong Bay Transfer'
      }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: {
      en: 'Hanoi Sapa Train',
      vi: 'Tàu Hà Nội Sapa'
    },
    slug: 'hanoi-sapa-train',
    description: {
      en: 'Comfortable train journey from Hanoi to Sapa. Overnight sleeper train with modern amenities.',
      vi: 'Hành trình tàu thoải mái từ Hà Nội đến Sapa. Tàu ngủ đêm với tiện nghi hiện đại.'
    },
    content: {
      en: 'Travel in comfort from Hanoi to Sapa aboard our modern sleeper train. Enjoy the scenic journey through the Vietnamese countryside while resting in comfortable berths.',
      vi: 'Du lịch thoải mái từ Hà Nội đến Sapa trên tàu ngủ hiện đại của chúng tôi. Tận hưởng hành trình đẹp mắt qua vùng nông thôn Việt Nam trong khi nghỉ ngơi trên giường nằm thoải mái.'
    },
    category: 'sleeping-bus',
    pricing: {
      adult: 35,
      child: 25,
      infant: 0
    },
    duration: {
      days: 1,
      hours: 8
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'Hanoi Sapa Train'
      }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: {
      en: 'Ha Giang Transfer',
      vi: 'Đưa Đón Hà Giang'
    },
    slug: 'ha-giang-transfer',
    description: {
      en: 'Adventure transfer to Ha Giang province. Experience the stunning mountain landscapes.',
      vi: 'Đưa đón khám phá đến tỉnh Hà Giang. Trải nghiệm cảnh quan núi non tuyệt đẹp.'
    },
    content: {
      en: 'Embark on an adventure to Ha Giang with our specialized transfer service. Navigate through stunning mountain passes and experience the raw beauty of northern Vietnam.',
      vi: 'Bắt đầu cuộc phiêu lưu đến Hà Giang với dịch vụ đưa đón chuyên biệt của chúng tôi. Đi qua những đèo núi tuyệt đẹp và trải nghiệm vẻ đẹp hoang dã của miền Bắc Việt Nam.'
    },
    category: 'private-car',
    pricing: {
      adult: 55,
      child: 40,
      infant: 0
    },
    duration: {
      days: 1,
      hours: 6
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'Ha Giang Transfer'
      }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: {
      en: 'Airport Transfer',
      vi: 'Đưa Đón Sân Bay'
    },
    slug: 'airport-transfer',
    description: {
      en: 'Reliable airport transfer service. Meet and greet service with professional drivers.',
      vi: 'Dịch vụ đưa đón sân bay đáng tin cậy. Dịch vụ đón tiếp với tài xế chuyên nghiệp.'
    },
    content: {
      en: 'Start and end your journey with our reliable airport transfer service. Professional drivers, clean vehicles, and meet-and-greet service ensure a stress-free travel experience.',
      vi: 'Bắt đầu và kết thúc hành trình với dịch vụ đưa đón sân bay đáng tin cậy của chúng tôi. Tài xế chuyên nghiệp, xe sạch sẽ và dịch vụ đón tiếp đảm bảo trải nghiệm du lịch không căng thẳng.'
    },
    category: 'shuttle-bus',
    pricing: {
      adult: 25,
      child: 15,
      infant: 0
    },
    duration: {
      days: 1,
      hours: 1
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'Airport Transfer'
      }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: {
      en: 'Sapa Transfer',
      vi: 'Đưa Đón Sapa'
    },
    slug: 'sapa-transfer',
    description: {
      en: 'Direct transfer to Sapa from Hanoi. Comfortable journey to the mountain town.',
      vi: 'Đưa đón trực tiếp từ Hà Nội đến Sapa. Hành trình thoải mái đến thị trấn miền núi.'
    },
    content: {
      en: 'Travel directly to Sapa with our comfortable transfer service. Enjoy the scenic mountain views as you journey to this popular hill station.',
      vi: 'Du lịch trực tiếp đến Sapa với dịch vụ đưa đón thoải mái của chúng tôi. Tận hưởng cảnh quan núi non đẹp mắt khi hành trình đến trạm nghỉ dưỡng nổi tiếng này.'
    },
    category: 'shuttle-bus',
    pricing: {
      adult: 30,
      child: 20,
      infant: 0
    },
    duration: {
      days: 1,
      hours: 5
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'Sapa Transfer'
      }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: {
      en: 'Ninh Binh Transfer',
      vi: 'Đưa Đón Ninh Bình'
    },
    slug: 'ninh-binh-transfer',
    description: {
      en: 'Explore Ninh Binh with our transfer service. Visit ancient temples and limestone mountains.',
      vi: 'Khám phá Ninh Bình với dịch vụ đưa đón của chúng tôi. Thăm chùa cổ và núi đá vôi.'
    },
    content: {
      en: 'Discover the beauty of Ninh Binh with our transfer service. Visit ancient temples, explore limestone mountains, and experience the peaceful countryside of northern Vietnam.',
      vi: 'Khám phá vẻ đẹp của Ninh Bình với dịch vụ đưa đón của chúng tôi. Thăm chùa cổ, khám phá núi đá vôi và trải nghiệm vùng nông thôn yên bình của miền Bắc Việt Nam.'
    },
    category: 'private-car',
    pricing: {
      adult: 40,
      child: 30,
      infant: 0
    },
    duration: {
      days: 1,
      hours: 3
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'Ninh Binh Transfer'
      }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: {
      en: 'Cat Ba Transfer',
      vi: 'Đưa Đón Cát Bà'
    },
    slug: 'cat-ba-transfer',
    description: {
      en: 'Island transfer to Cat Ba. Combine ferry and road transport for island adventure.',
      vi: 'Đưa đón đảo Cát Bà. Kết hợp phà và vận chuyển đường bộ cho cuộc phiêu lưu đảo.'
    },
    content: {
      en: 'Embark on an island adventure with our Cat Ba transfer service. Combine ferry and road transport to reach this beautiful island in the Gulf of Tonkin.',
      vi: 'Bắt đầu cuộc phiêu lưu đảo với dịch vụ đưa đón Cát Bà của chúng tôi. Kết hợp phà và vận chuyển đường bộ để đến hòn đảo xinh đẹp này ở Vịnh Bắc Bộ.'
    },
    category: 'shuttle-bus',
    pricing: {
      adult: 50,
      child: 35,
      infant: 0
    },
    duration: {
      days: 1,
      hours: 4
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'Cat Ba Transfer'
      }
    ],
    isActive: true,
    isFeatured: true
  },
  {
    title: {
      en: 'All in One Transfers Package',
      vi: 'Gói Đưa Đón Tất Trong Một'
    },
    slug: 'all-in-one-transfers-package',
    description: {
      en: 'Complete transfer package for your Vietnam adventure. Multiple destinations in one convenient package.',
      vi: 'Gói đưa đón hoàn chỉnh cho cuộc phiêu lưu Việt Nam của bạn. Nhiều điểm đến trong một gói tiện lợi.'
    },
    content: {
      en: 'Experience the ultimate convenience with our All-in-One Transfers Package. Visit multiple destinations across Vietnam with seamless transportation arrangements and professional service throughout your journey.',
      vi: 'Trải nghiệm sự tiện lợi tối đa với Gói Đưa Đón Tất Trong Một của chúng tôi. Thăm nhiều điểm đến trên khắp Việt Nam với sự sắp xếp vận chuyển mượt mà và dịch vụ chuyên nghiệp trong suốt hành trình.'
    },
    category: 'luxury-limo',
    pricing: {
      adult: 200,
      child: 150,
      infant: 0
    },
    duration: {
      days: 7,
      hours: 0
    },
    images: [
      {
        url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
        alt: 'All in One Transfers Package'
      }
    ],
    isActive: true,
    isFeatured: true
  }
];

const seedTransferServices = async () => {
  try {
    console.log('🌍 Starting transfer services seeding...');

    // Get transfer services category
    const transferCategory = await Category.findOne({ type: 'transfer-services' });
    if (!transferCategory) {
      console.error('❌ Transfer services category not found. Please run category seeding first.');
      return;
    }

    // Clear existing transfer services
    await Product.deleteMany({ 'category.type': 'transfer-services' });
    console.log('🗑️  Cleared existing transfer services');

    // Create transfer services
    const createdServices = [];
    for (const service of transferServices) {
      // Get the specific category by slug
      const category = await Category.findOne({ slug: service.category });
      console.log(`🔍 Looking for category: ${service.category}`);
      if (!category) {
        console.warn(`⚠️  Category ${service.category} not found, skipping ${service.slug}`);
        // List all available categories for debugging
        const allCategories = await Category.find({ type: 'transfer-services' });
        console.log('Available categories:', allCategories.map(c => c.slug));
        continue;
      }
      console.log(`✅ Found category: ${category.name.en} (${category.slug})`);

      const transferService = new Product({
        ...service,
        category: category._id,
        type: 'transfer-services'
      });

      await transferService.save();
      createdServices.push(transferService);
      console.log(`✅ Created: ${service.title.en}`);
    }

    console.log(`🎉 Successfully created ${createdServices.length} transfer services`);
    console.log('📋 Transfer Services Summary:');
    createdServices.forEach(service => {
      console.log(`   - ${service.title.en} (${service.slug}) - $${service.pricing.adult}`);
    });

  } catch (error) {
    console.error('❌ Error seeding transfer services:', error);
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  require('dotenv').config();
  
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-travel')
    .then(() => {
      console.log('🔗 Connected to MongoDB');
      return seedTransferServices();
    })
    .then(() => {
      console.log('✅ Transfer services seeding completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedTransferServices, transferServices };
