const mongoose = require('mongoose');
const TourCategory = require('../models/TourCategory');
require('dotenv').config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://zunatravel:zunatravel123@cluster0.8kqjq.mongodb.net/zunatravel?retryWrites=true&w=majority');
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Tour categories data
const tourCategoriesData = [
  {
    name: {
      en: "Cat Ba Island",
      vi: "Đảo Cát Bà"
    },
    slug: "cat-ba-island",
    description: {
      en: "Discover the pristine beauty of Cat Ba Island, the largest island in Halong Bay. Experience stunning limestone karsts, crystal-clear waters, and diverse marine life in this UNESCO World Heritage site.",
      vi: "Khám phá vẻ đẹp hoang sơ của đảo Cát Bà, hòn đảo lớn nhất trong vịnh Hạ Long. Trải nghiệm những dãy núi đá vôi hùng vĩ, làn nước trong xanh và hệ sinh thái biển đa dạng tại di sản thế giới UNESCO này."
    },
    shortDescription: {
      en: "Pristine island paradise with limestone karsts and crystal waters",
      vi: "Thiên đường đảo hoang sơ với núi đá vôi và làn nước trong xanh"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Cat Ba Island landscape",
        caption: "Cat Ba Island - UNESCO World Heritage"
      },
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Cat Ba Island beach",
        caption: "Beautiful beaches of Cat Ba"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Cat Ba Island limestone karsts",
        caption: "Limestone karsts and emerald waters"
      }
    ],
    location: {
      en: "Hai Phong, Vietnam",
      vi: "Hải Phòng, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 1,
    metaTitle: {
      en: "Cat Ba Island Tours - UNESCO World Heritage Site",
      vi: "Tour Đảo Cát Bà - Di Sản Thế Giới UNESCO"
    },
    metaDescription: {
      en: "Explore Cat Ba Island with our guided tours. Discover limestone karsts, pristine beaches, and rich biodiversity in this UNESCO World Heritage site.",
      vi: "Khám phá đảo Cát Bà với các tour có hướng dẫn. Trải nghiệm núi đá vôi, bãi biển hoang sơ và đa dạng sinh học tại di sản thế giới UNESCO."
    },
    tags: ["island", "unesco", "nature", "adventure", "beach"]
  },
  {
    name: {
      en: "Ninh Binh",
      vi: "Ninh Bình"
    },
    slug: "ninh-binh",
    description: {
      en: "Experience the 'Halong Bay on Land' in Ninh Binh. Cruise through stunning limestone karsts, explore ancient temples, and discover the natural beauty of Vietnam's first capital region.",
      vi: "Trải nghiệm 'Vịnh Hạ Long trên cạn' tại Ninh Bình. Du thuyền qua những dãy núi đá vôi hùng vĩ, khám phá các ngôi chùa cổ và tìm hiểu vẻ đẹp thiên nhiên của vùng đất cố đô đầu tiên của Việt Nam."
    },
    shortDescription: {
      en: "Halong Bay on land with ancient temples and limestone karsts",
      vi: "Vịnh Hạ Long trên cạn với chùa chiền cổ kính và núi đá vôi"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ninh Binh Trang An",
        caption: "Trang An - UNESCO World Heritage"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Ninh Binh boat ride",
        caption: "Scenic boat ride through limestone karsts"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Ninh Binh temples",
        caption: "Ancient temples and pagodas"
      }
    ],
    location: {
      en: "Ninh Binh Province, Vietnam",
      vi: "Tỉnh Ninh Bình, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 2,
    metaTitle: {
      en: "Ninh Binh Tours - Halong Bay on Land",
      vi: "Tour Ninh Bình - Vịnh Hạ Long Trên Cạn"
    },
    metaDescription: {
      en: "Discover Ninh Binh's natural wonders with our guided tours. Cruise through limestone karsts, visit ancient temples, and explore Vietnam's cultural heritage.",
      vi: "Khám phá kỳ quan thiên nhiên Ninh Bình với các tour có hướng dẫn. Du thuyền qua núi đá vôi, thăm chùa chiền cổ kính và tìm hiểu di sản văn hóa Việt Nam."
    },
    tags: ["unesco", "temples", "nature", "cultural", "boat-ride"]
  },
  {
    name: {
      en: "Sapa",
      vi: "Sa Pa"
    },
    slug: "sapa",
    description: {
      en: "Trek through the misty mountains of Sapa and discover the rich culture of ethnic minority groups. Experience terraced rice fields, traditional villages, and breathtaking mountain landscapes in Vietnam's northern highlands.",
      vi: "Đi bộ qua những ngọn núi sương mù của Sa Pa và khám phá văn hóa phong phú của các dân tộc thiểu số. Trải nghiệm ruộng bậc thang, làng bản truyền thống và cảnh quan núi non hùng vĩ ở vùng cao phía Bắc Việt Nam."
    },
    shortDescription: {
      en: "Misty mountains, terraced rice fields, and ethnic culture",
      vi: "Núi non sương mù, ruộng bậc thang và văn hóa dân tộc"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Sapa terraced rice fields",
        caption: "Terraced rice fields of Sapa"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Sapa mountain landscape",
        caption: "Misty mountain landscapes"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Sapa ethnic villages",
        caption: "Traditional ethnic minority villages"
      }
    ],
    location: {
      en: "Lao Cai Province, Vietnam",
      vi: "Tỉnh Lào Cai, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 3,
    metaTitle: {
      en: "Sapa Tours - Mountain Trekking & Ethnic Culture",
      vi: "Tour Sa Pa - Đi Bộ Núi & Văn Hóa Dân Tộc"
    },
    metaDescription: {
      en: "Explore Sapa's stunning landscapes with our trekking tours. Experience terraced rice fields, ethnic minority culture, and mountain adventures in Vietnam's northern highlands.",
      vi: "Khám phá cảnh quan tuyệt đẹp của Sa Pa với các tour đi bộ. Trải nghiệm ruộng bậc thang, văn hóa dân tộc thiểu số và phiêu lưu núi non ở vùng cao phía Bắc Việt Nam."
    },
    tags: ["trekking", "mountains", "ethnic-culture", "rice-terraces", "adventure"]
  },
  {
    name: {
      en: "Halong Bay",
      vi: "Vịnh Hạ Long"
    },
    slug: "halong-bay",
    description: {
      en: "Cruise through the iconic limestone karsts of Halong Bay, a UNESCO World Heritage site. Experience the mystical beauty of thousands of limestone islands rising from emerald waters in this natural wonder of Vietnam.",
      vi: "Du thuyền qua những dãy núi đá vôi biểu tượng của vịnh Hạ Long, một di sản thế giới UNESCO. Trải nghiệm vẻ đẹp huyền bí của hàng nghìn hòn đảo đá vôi mọc lên từ làn nước ngọc lục bảo trong kỳ quan thiên nhiên này của Việt Nam."
    },
    shortDescription: {
      en: "Iconic limestone karsts and emerald waters",
      vi: "Núi đá vôi biểu tượng và làn nước ngọc lục bảo"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Halong Bay limestone karsts",
        caption: "Iconic limestone karsts of Halong Bay"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Halong Bay cruise",
        caption: "Luxury cruise through Halong Bay"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Halong Bay sunset",
        caption: "Breathtaking sunset over Halong Bay"
      }
    ],
    location: {
      en: "Quang Ninh Province, Vietnam",
      vi: "Tỉnh Quảng Ninh, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 4,
    metaTitle: {
      en: "Halong Bay Tours - UNESCO World Heritage Cruise",
      vi: "Tour Vịnh Hạ Long - Du Thuyền Di Sản Thế Giới UNESCO"
    },
    metaDescription: {
      en: "Experience the magic of Halong Bay with our luxury cruise tours. Discover limestone karsts, hidden caves, and pristine beaches in this UNESCO World Heritage site.",
      vi: "Trải nghiệm sự kỳ diệu của vịnh Hạ Long với các tour du thuyền sang trọng. Khám phá núi đá vôi, hang động bí ẩn và bãi biển hoang sơ tại di sản thế giới UNESCO này."
    },
    tags: ["unesco", "cruise", "limestone-karsts", "luxury", "nature"]
  }
];

// Create tour categories
const createTourCategories = async () => {
  try {
    console.log('Starting to create tour categories...');
    
    // Clear existing tour categories
    await TourCategory.deleteMany({});
    console.log('Cleared existing tour categories');
    
    // Create new tour categories
    const createdCategories = await TourCategory.insertMany(tourCategoriesData);
    console.log(`Successfully created ${createdCategories.length} tour categories:`);
    
    createdCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name.en} (${category.name.vi}) - ${category.slug}`);
    });
    
    console.log('\nTour categories created successfully!');
    return createdCategories;
  } catch (error) {
    console.error('Error creating tour categories:', error);
    throw error;
  }
};

// Main execution
const main = async () => {
  try {
    await connectDB();
    await createTourCategories();
    console.log('\nScript completed successfully!');
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run the script
if (require.main === module) {
  main();
}

module.exports = { createTourCategories, tourCategoriesData };
