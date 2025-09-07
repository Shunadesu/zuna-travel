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
  },
  {
    title: {
      en: 'Hanoi Sapa Limousine Van',
      vi: 'Limousine Van Hanoi Sapa'
    },
    slug: 'hanoi-sapa-limousine-van',
    shortDescription: {
      en: 'Luxury limousine van to Sapa',
      vi: 'Limousine van sang trọng đến Sapa'
    },
    description: {
      en: 'Premium limousine van service from Hanoi to Sapa. Spacious, comfortable vehicle with leather seats, professional driver, and luxury amenities.',
      vi: 'Dịch vụ limousine van cao cấp từ Hanoi đến Sapa. Xe rộng rãi, thoải mái với ghế da, tài xế chuyên nghiệp và tiện nghi sang trọng.'
    },
    category: 'hanoi-sapa-train',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Sapa Limousine Van', vi: 'Limousine Van Hanoi Sapa' }
      }
    ],
    pricing: {
      adult: 20,
      child: 15,
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
        en: 'Leather seats',
        vi: 'Ghế da'
      },
      {
        en: 'Professional service',
        vi: 'Dịch vụ chuyên nghiệp'
      }
    ],
    included: [
      {
        en: 'Limousine van',
        vi: 'Limousine van'
      },
      {
        en: 'Leather seats',
        vi: 'Ghế da'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Air conditioning',
        vi: 'Điều hòa'
      },
      {
        en: 'Free WiFi',
        vi: 'WiFi miễn phí'
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
      count: 320
    },
    seo: {
      title: {
        en: 'Hanoi Sapa Limousine Van - Luxury Transfer Service',
        vi: 'Limousine Van Hanoi Sapa - Dịch Vụ Chuyển Tiếp Sang Trọng'
      },
      description: {
        en: 'Luxury limousine van from Hanoi to Sapa. Leather seats, professional driver, premium service. From $20.',
        vi: 'Limousine van sang trọng từ Hanoi đến Sapa. Ghế da, tài xế chuyên nghiệp, dịch vụ cao cấp. Từ $20.'
      },
      keywords: ['hanoi sapa limousine', 'sapa luxury van', 'limousine transfer sapa']
    }
  },
  {
    title: {
      en: 'Hanoi Cat Ba Limousine Van',
      vi: 'Limousine Van Hanoi Cát Bà'
    },
    slug: 'hanoi-cat-ba-limousine-van',
    shortDescription: {
      en: 'Luxury limousine van to Cat Ba Island',
      vi: 'Limousine van sang trọng đến Đảo Cát Bà'
    },
    description: {
      en: 'Premium limousine van service from Hanoi to Cat Ba Island. Spacious, comfortable vehicle with professional driver and ferry transfer included.',
      vi: 'Dịch vụ limousine van cao cấp từ Hanoi đến Đảo Cát Bà. Xe rộng rãi, thoải mái với tài xế chuyên nghiệp và bao gồm chuyển phà.'
    },
    category: 'cat-ba-transfer',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Cat Ba Limousine Van', vi: 'Limousine Van Hanoi Cát Bà' }
      }
    ],
    pricing: {
      adult: 19,
      child: 15,
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
        en: 'Ferry included',
        vi: 'Bao gồm phà'
      },
      {
        en: 'Professional service',
        vi: 'Dịch vụ chuyên nghiệp'
      }
    ],
    included: [
      {
        en: 'Limousine van',
        vi: 'Limousine van'
      },
      {
        en: 'Ferry ticket',
        vi: 'Vé phà'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Air conditioning',
        vi: 'Điều hòa'
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
      average: 4.6,
      count: 280
    },
    seo: {
      title: {
        en: 'Hanoi Cat Ba Limousine Van - Luxury Island Transfer',
        vi: 'Limousine Van Hanoi Cát Bà - Chuyển Tiếp Đảo Sang Trọng'
      },
      description: {
        en: 'Luxury limousine van from Hanoi to Cat Ba Island with ferry transfer. Premium service, comfortable journey. From $19.',
        vi: 'Limousine van sang trọng từ Hanoi đến Đảo Cát Bà bao gồm chuyển phà. Dịch vụ cao cấp, hành trình thoải mái. Từ $19.'
      },
      keywords: ['hanoi cat ba limousine', 'cat ba luxury transfer', 'limousine van cat ba']
    }
  },
  {
    title: {
      en: 'Hanoi Sapa Express Sleeping Bus',
      vi: 'Xe Bus Giường Nằm Express Hanoi Sapa'
    },
    slug: 'hanoi-sapa-express-sleeping-bus',
    shortDescription: {
      en: 'Express sleeping bus to Sapa',
      vi: 'Xe bus giường nằm express đến Sapa'
    },
    description: {
      en: 'Express sleeping bus service from Hanoi to Sapa. Fast, comfortable journey with reclining seats and professional drivers.',
      vi: 'Dịch vụ xe bus giường nằm express từ Hanoi đến Sapa. Hành trình nhanh, thoải mái với ghế ngả và tài xế chuyên nghiệp.'
    },
    category: 'hanoi-sapa-train',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Sapa Express Sleeping Bus', vi: 'Xe Bus Giường Nằm Express Hanoi Sapa' }
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
        en: 'Express service',
        vi: 'Dịch vụ express'
      },
      {
        en: 'Reclining seats',
        vi: 'Ghế ngả'
      },
      {
        en: 'Fast journey',
        vi: 'Hành trình nhanh'
      }
    ],
    included: [
      {
        en: 'Express service',
        vi: 'Dịch vụ express'
      },
      {
        en: 'Reclining seats',
        vi: 'Ghế ngả'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Air conditioning',
        vi: 'Điều hòa'
      },
      {
        en: 'Blankets provided',
        vi: 'Có chăn'
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
      count: 450
    },
    seo: {
      title: {
        en: 'Hanoi Sapa Express Sleeping Bus - Fast Transfer',
        vi: 'Xe Bus Giường Nằm Express Hanoi Sapa - Chuyển Tiếp Nhanh'
      },
      description: {
        en: 'Express sleeping bus from Hanoi to Sapa. Fast journey, reclining seats, professional service. From $12.',
        vi: 'Xe bus giường nằm express từ Hanoi đến Sapa. Hành trình nhanh, ghế ngả, dịch vụ chuyên nghiệp. Từ $12.'
      },
      keywords: ['hanoi sapa express bus', 'express sleeping bus', 'fast sapa transfer']
    }
  },
  {
    title: {
      en: 'Hanoi Ninh Binh Private Car',
      vi: 'Xe Riêng Hanoi Ninh Bình'
    },
    slug: 'hanoi-ninh-binh-private-car',
    shortDescription: {
      en: 'Private car transfer to Ninh Binh',
      vi: 'Đưa đón xe riêng đến Ninh Bình'
    },
    description: {
      en: 'Comfortable private car service from Hanoi to Ninh Binh. Perfect for exploring the beautiful landscapes and ancient temples.',
      vi: 'Dịch vụ xe riêng thoải mái từ Hanoi đến Ninh Bình. Hoàn hảo để khám phá cảnh quan đẹp và đền chùa cổ.'
    },
    category: 'ninh-binh-transfer',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Ninh Binh Private Car', vi: 'Xe Riêng Hanoi Ninh Bình' }
      }
    ],
    pricing: {
      adult: 25,
      child: 18,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Private service',
        vi: 'Dịch vụ riêng'
      },
      {
        en: 'Comfortable journey',
        vi: 'Hành trình thoải mái'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      }
    ],
    included: [
      {
        en: 'Private car',
        vi: 'Xe riêng'
      },
      {
        en: 'Professional driver',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Comfortable seating',
        vi: 'Ghế ngồi thoải mái'
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
      count: 180
    },
    seo: {
      title: {
        en: 'Hanoi Ninh Binh Private Car - Comfortable Transfer',
        vi: 'Xe Riêng Hanoi Ninh Bình - Chuyển Tiếp Thoải Mái'
      },
      description: {
        en: 'Private car from Hanoi to Ninh Binh. Comfortable journey, professional driver. From $25.',
        vi: 'Xe riêng từ Hanoi đến Ninh Bình. Hành trình thoải mái, tài xế chuyên nghiệp. Từ $25.'
      },
      keywords: ['hanoi ninh binh private car', 'ninh binh transfer', 'private car ninh binh']
    }
  },
  {
    title: {
      en: 'Hanoi Ha Giang Motorbike Tour Transfer',
      vi: 'Đưa Đón Tour Xe Máy Hanoi Hà Giang'
    },
    slug: 'hanoi-ha-giang-motorbike-tour-transfer',
    shortDescription: {
      en: 'Motorbike tour transfer to Ha Giang',
      vi: 'Đưa đón tour xe máy đến Hà Giang'
    },
    description: {
      en: 'Adventure motorbike tour transfer from Hanoi to Ha Giang. Experience the stunning mountain roads and ethnic minority villages.',
      vi: 'Đưa đón tour xe máy mạo hiểm từ Hanoi đến Hà Giang. Trải nghiệm những con đường núi tuyệt đẹp và làng dân tộc thiểu số.'
    },
    category: 'ha-giang-transfer',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'Hanoi Ha Giang Motorbike Tour', vi: 'Tour Xe Máy Hanoi Hà Giang' }
      }
    ],
    pricing: {
      adult: 35,
      child: 25,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 1
    },
    highlights: [
      {
        en: 'Adventure tour',
        vi: 'Tour mạo hiểm'
      },
      {
        en: 'Mountain roads',
        vi: 'Đường núi'
      },
      {
        en: 'Ethnic villages',
        vi: 'Làng dân tộc'
      }
    ],
    included: [
      {
        en: 'Motorbike rental',
        vi: 'Thuê xe máy'
      },
      {
        en: 'Professional guide',
        vi: 'Hướng dẫn viên chuyên nghiệp'
      },
      {
        en: 'Safety equipment',
        vi: 'Thiết bị an toàn'
      },
      {
        en: 'Fuel',
        vi: 'Xăng'
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
      },
      {
        en: 'Accommodation',
        vi: 'Chỗ ở'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.6,
      count: 120
    },
    seo: {
      title: {
        en: 'Hanoi Ha Giang Motorbike Tour Transfer - Adventure Experience',
        vi: 'Đưa Đón Tour Xe Máy Hanoi Hà Giang - Trải Nghiệm Mạo Hiểm'
      },
      description: {
        en: 'Motorbike tour transfer from Hanoi to Ha Giang. Adventure experience, mountain roads, ethnic villages. From $35.',
        vi: 'Đưa đón tour xe máy từ Hanoi đến Hà Giang. Trải nghiệm mạo hiểm, đường núi, làng dân tộc. Từ $35.'
      },
      keywords: ['hanoi ha giang motorbike', 'ha giang tour transfer', 'motorbike tour ha giang']
    }
  },
  {
    title: {
      en: 'All-in-One Transfers Package',
      vi: 'Gói Đưa Đón Tất Cả Trong Một'
    },
    slug: 'all-in-one-transfers-package',
    shortDescription: {
      en: 'Complete transfer package for all destinations',
      vi: 'Gói đưa đón hoàn chỉnh cho tất cả điểm đến'
    },
    description: {
      en: 'Comprehensive transfer package covering all major destinations from Hanoi. Includes Sapa, Halong Bay, Ninh Binh, Cat Ba, and Ha Giang transfers.',
      vi: 'Gói đưa đón toàn diện bao gồm tất cả điểm đến chính từ Hanoi. Bao gồm Sapa, Vịnh Hạ Long, Ninh Bình, Cát Bà và Hà Giang.'
    },
    category: 'all-in-one-transfers-package',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=600&fit=crop',
        alt: { en: 'All-in-One Transfers Package', vi: 'Gói Đưa Đón Tất Cả Trong Một' }
      }
    ],
    pricing: {
      adult: 150,
      child: 100,
      infant: 0,
      currency: 'USD'
    },
    duration: {
      days: 7
    },
    highlights: [
      {
        en: 'Complete package',
        vi: 'Gói hoàn chỉnh'
      },
      {
        en: 'All destinations',
        vi: 'Tất cả điểm đến'
      },
      {
        en: 'Best value',
        vi: 'Giá trị tốt nhất'
      }
    ],
    included: [
      {
        en: 'All transfer services',
        vi: 'Tất cả dịch vụ đưa đón'
      },
      {
        en: 'Professional drivers',
        vi: 'Tài xế chuyên nghiệp'
      },
      {
        en: 'Comfortable vehicles',
        vi: 'Xe thoải mái'
      },
      {
        en: '24/7 support',
        vi: 'Hỗ trợ 24/7'
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
      },
      {
        en: 'Accommodation',
        vi: 'Chỗ ở'
      }
    ],
    isActive: true,
    isFeatured: true,
    rating: {
      average: 4.7,
      count: 95
    },
    seo: {
      title: {
        en: 'All-in-One Transfers Package - Complete Transfer Solution',
        vi: 'Gói Đưa Đón Tất Cả Trong Một - Giải Pháp Đưa Đón Hoàn Chỉnh'
      },
      description: {
        en: 'Complete transfer package for all destinations from Hanoi. Best value, professional service, 24/7 support. From $150.',
        vi: 'Gói đưa đón hoàn chỉnh cho tất cả điểm đến từ Hanoi. Giá trị tốt nhất, dịch vụ chuyên nghiệp, hỗ trợ 24/7. Từ $150.'
      },
      keywords: ['all in one transfers', 'complete transfer package', 'hanoi transfer package']
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
