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

// All tour categories data based on the image
const allTourCategoriesData = [
  {
    name: {
      en: "Cao Bang",
      vi: "Cao Bằng"
    },
    slug: "cao-bang",
    description: {
      en: "Discover the pristine beauty of Cao Bang province, home to the magnificent Ban Gioc Waterfall and stunning karst landscapes. Experience the rich culture of ethnic minorities and explore untouched natural wonders.",
      vi: "Khám phá vẻ đẹp hoang sơ của tỉnh Cao Bằng, nơi có thác Bản Giốc hùng vĩ và cảnh quan karst tuyệt đẹp. Trải nghiệm văn hóa phong phú của các dân tộc thiểu số và khám phá những kỳ quan thiên nhiên hoang sơ."
    },
    shortDescription: {
      en: "Pristine waterfalls and ethnic culture in northern Vietnam",
      vi: "Thác nước hoang sơ và văn hóa dân tộc ở miền Bắc Việt Nam"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ban Gioc Waterfall",
        caption: "Ban Gioc Waterfall - Natural Wonder"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Cao Bang karst landscape",
        caption: "Karst landscapes of Cao Bang"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Ethnic villages Cao Bang",
        caption: "Traditional ethnic minority villages"
      }
    ],
    location: {
      en: "Cao Bang Province, Vietnam",
      vi: "Tỉnh Cao Bằng, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 5,
    metaTitle: {
      en: "Cao Bang Tours - Ban Gioc Waterfall & Ethnic Culture",
      vi: "Tour Cao Bằng - Thác Bản Giốc & Văn Hóa Dân Tộc"
    },
    metaDescription: {
      en: "Explore Cao Bang's natural wonders including Ban Gioc Waterfall. Discover ethnic minority culture and pristine landscapes in northern Vietnam.",
      vi: "Khám phá kỳ quan thiên nhiên Cao Bằng bao gồm thác Bản Giốc. Tìm hiểu văn hóa dân tộc thiểu số và cảnh quan hoang sơ ở miền Bắc Việt Nam."
    },
    tags: ["waterfall", "ethnic-culture", "nature", "adventure", "karst"]
  },
  {
    name: {
      en: "Hoa Binh",
      vi: "Hòa Bình"
    },
    slug: "hoa-binh",
    description: {
      en: "Experience the cultural richness of Hoa Binh province, known for its ethnic minority communities and traditional villages. Discover the peaceful countryside and learn about local traditions.",
      vi: "Trải nghiệm sự phong phú văn hóa của tỉnh Hòa Bình, nổi tiếng với các cộng đồng dân tộc thiểu số và làng bản truyền thống. Khám phá vùng nông thôn yên bình và tìm hiểu truyền thống địa phương."
    },
    shortDescription: {
      en: "Ethnic culture and peaceful countryside",
      vi: "Văn hóa dân tộc và vùng nông thôn yên bình"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Hoa Binh countryside",
        caption: "Peaceful countryside of Hoa Binh"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Ethnic villages Hoa Binh",
        caption: "Traditional ethnic villages"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Hoa Binh culture",
        caption: "Rich cultural heritage"
      }
    ],
    location: {
      en: "Hoa Binh Province, Vietnam",
      vi: "Tỉnh Hòa Bình, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 6,
    metaTitle: {
      en: "Hoa Binh Tours - Ethnic Culture & Countryside",
      vi: "Tour Hòa Bình - Văn Hóa Dân Tộc & Nông Thôn"
    },
    metaDescription: {
      en: "Discover Hoa Binh's ethnic minority culture and peaceful countryside. Experience traditional villages and local customs in northern Vietnam.",
      vi: "Khám phá văn hóa dân tộc thiểu số và vùng nông thôn yên bình của Hòa Bình. Trải nghiệm làng bản truyền thống và phong tục địa phương ở miền Bắc Việt Nam."
    },
    tags: ["ethnic-culture", "countryside", "traditional", "cultural", "villages"]
  },
  {
    name: {
      en: "Ha Giang",
      vi: "Hà Giang"
    },
    slug: "ha-giang",
    description: {
      en: "Embark on an epic motorbike adventure through Ha Giang's dramatic mountain landscapes. Experience the famous Ma Pi Leng Pass, Nho Que River, and discover the unique culture of ethnic minorities in Vietnam's northernmost province.",
      vi: "Bắt đầu cuộc phiêu lưu xe máy hoành tráng qua cảnh quan núi non hùng vĩ của Hà Giang. Trải nghiệm đèo Mã Pí Lèng nổi tiếng, sông Nho Quế và khám phá văn hóa độc đáo của các dân tộc thiểu số ở tỉnh cực Bắc Việt Nam."
    },
    shortDescription: {
      en: "Epic motorbike adventure through dramatic mountain landscapes",
      vi: "Cuộc phiêu lưu xe máy hoành tráng qua cảnh quan núi non hùng vĩ"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ha Giang mountain pass",
        caption: "Ma Pi Leng Pass - Epic Mountain Road"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Nho Que River",
        caption: "Nho Que River - Emerald Waters"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Ha Giang ethnic culture",
        caption: "Ethnic minority culture"
      }
    ],
    location: {
      en: "Ha Giang Province, Vietnam",
      vi: "Tỉnh Hà Giang, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 7,
    metaTitle: {
      en: "Ha Giang Motorbike Tours - Epic Mountain Adventure",
      vi: "Tour Xe Máy Hà Giang - Phiêu Lưu Núi Non Hoành Tráng"
    },
    metaDescription: {
      en: "Experience epic motorbike adventures in Ha Giang. Discover Ma Pi Leng Pass, Nho Que River, and ethnic minority culture in Vietnam's northernmost province.",
      vi: "Trải nghiệm cuộc phiêu lưu xe máy hoành tráng ở Hà Giang. Khám phá đèo Mã Pí Lèng, sông Nho Quế và văn hóa dân tộc thiểu số ở tỉnh cực Bắc Việt Nam."
    },
    tags: ["motorbike", "adventure", "mountains", "ethnic-culture", "epic"]
  },
  {
    name: {
      en: "Hanoi",
      vi: "Hà Nội"
    },
    slug: "hanoi",
    description: {
      en: "Explore Vietnam's capital city, Hanoi, where ancient traditions meet modern life. Discover the Old Quarter's narrow streets, visit historic temples, and experience the vibrant street food culture.",
      vi: "Khám phá thủ đô Hà Nội của Việt Nam, nơi truyền thống cổ xưa gặp gỡ cuộc sống hiện đại. Khám phá những con phố hẹp của Phố Cổ, thăm các ngôi đền lịch sử và trải nghiệm văn hóa ẩm thực đường phố sôi động."
    },
    shortDescription: {
      en: "Ancient capital with rich history and vibrant street culture",
      vi: "Thủ đô cổ kính với lịch sử phong phú và văn hóa đường phố sôi động"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Hanoi Old Quarter",
        caption: "Hanoi Old Quarter - Historic Streets"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Temple of Literature",
        caption: "Temple of Literature - Ancient Architecture"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Hanoi street food",
        caption: "Vibrant Street Food Culture"
      }
    ],
    location: {
      en: "Hanoi, Vietnam",
      vi: "Hà Nội, Việt Nam"
    },
    region: "north",
    isActive: true,
    isFeatured: true,
    featuredOrder: 8,
    metaTitle: {
      en: "Hanoi City Tours - Ancient Capital & Street Culture",
      vi: "Tour Thành Phố Hà Nội - Thủ Đô Cổ Kính & Văn Hóa Đường Phố"
    },
    metaDescription: {
      en: "Discover Hanoi's rich history and vibrant culture. Explore the Old Quarter, visit historic temples, and experience authentic Vietnamese street food.",
      vi: "Khám phá lịch sử phong phú và văn hóa sôi động của Hà Nội. Tham quan Phố Cổ, thăm các ngôi đền lịch sử và trải nghiệm ẩm thực đường phố Việt Nam chính thống."
    },
    tags: ["city", "history", "culture", "street-food", "temples"]
  },
  {
    name: {
      en: "Hoi An",
      vi: "Hội An"
    },
    slug: "hoi-an",
    description: {
      en: "Step back in time in Hoi An Ancient Town, a UNESCO World Heritage site. Wander through lantern-lit streets, explore traditional architecture, and experience the charming blend of Vietnamese, Chinese, and Japanese influences.",
      vi: "Bước ngược thời gian ở Phố Cổ Hội An, một di sản thế giới UNESCO. Dạo bộ qua những con phố rực rỡ đèn lồng, khám phá kiến trúc truyền thống và trải nghiệm sự pha trộn quyến rũ giữa ảnh hưởng Việt Nam, Trung Quốc và Nhật Bản."
    },
    shortDescription: {
      en: "UNESCO World Heritage ancient town with lantern-lit streets",
      vi: "Phố cổ di sản thế giới UNESCO với những con phố rực rỡ đèn lồng"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Hoi An lanterns",
        caption: "Hoi An Ancient Town - Lantern Streets"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Hoi An architecture",
        caption: "Traditional Architecture"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Hoi An river",
        caption: "Charming River Views"
      }
    ],
    location: {
      en: "Quang Nam Province, Vietnam",
      vi: "Tỉnh Quảng Nam, Việt Nam"
    },
    region: "central",
    isActive: true,
    isFeatured: true,
    featuredOrder: 9,
    metaTitle: {
      en: "Hoi An Tours - UNESCO Ancient Town & Lantern Streets",
      vi: "Tour Hội An - Phố Cổ UNESCO & Đường Phố Đèn Lồng"
    },
    metaDescription: {
      en: "Explore Hoi An Ancient Town, a UNESCO World Heritage site. Discover lantern-lit streets, traditional architecture, and cultural heritage in central Vietnam.",
      vi: "Khám phá Phố Cổ Hội An, di sản thế giới UNESCO. Tìm hiểu những con phố đèn lồng, kiến trúc truyền thống và di sản văn hóa ở miền Trung Việt Nam."
    },
    tags: ["unesco", "ancient-town", "lanterns", "architecture", "cultural"]
  },
  {
    name: {
      en: "Da Nang",
      vi: "Đà Nẵng"
    },
    slug: "da-nang",
    description: {
      en: "Experience the perfect blend of urban sophistication and natural beauty in Da Nang. From the stunning Marble Mountains to pristine beaches, discover Vietnam's most livable city with modern attractions and cultural heritage.",
      vi: "Trải nghiệm sự kết hợp hoàn hảo giữa sự tinh tế đô thị và vẻ đẹp thiên nhiên ở Đà Nẵng. Từ núi Ngũ Hành Sơn hùng vĩ đến những bãi biển hoang sơ, khám phá thành phố đáng sống nhất Việt Nam với các điểm tham quan hiện đại và di sản văn hóa."
    },
    shortDescription: {
      en: "Modern coastal city with Marble Mountains and pristine beaches",
      vi: "Thành phố biển hiện đại với núi Ngũ Hành Sơn và bãi biển hoang sơ"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Da Nang beach",
        caption: "Pristine Beaches of Da Nang"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Marble Mountains",
        caption: "Marble Mountains - Natural Wonder"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Da Nang city",
        caption: "Modern City Skyline"
      }
    ],
    location: {
      en: "Da Nang, Vietnam",
      vi: "Đà Nẵng, Việt Nam"
    },
    region: "central",
    isActive: true,
    isFeatured: true,
    featuredOrder: 10,
    metaTitle: {
      en: "Da Nang Tours - Coastal City & Marble Mountains",
      vi: "Tour Đà Nẵng - Thành Phố Biển & Núi Ngũ Hành Sơn"
    },
    metaDescription: {
      en: "Discover Da Nang's perfect blend of urban sophistication and natural beauty. Explore Marble Mountains, pristine beaches, and modern attractions.",
      vi: "Khám phá sự kết hợp hoàn hảo giữa sự tinh tế đô thị và vẻ đẹp thiên nhiên của Đà Nẵng. Tham quan núi Ngũ Hành Sơn, bãi biển hoang sơ và các điểm tham quan hiện đại."
    },
    tags: ["coastal", "mountains", "beaches", "modern", "urban"]
  },
  {
    name: {
      en: "Ho Chi Minh City",
      vi: "Thành Phố Hồ Chí Minh"
    },
    slug: "ho-chi-minh-city",
    description: {
      en: "Immerse yourself in the vibrant energy of Ho Chi Minh City, Vietnam's largest metropolis. From historic landmarks like the Notre-Dame Cathedral to bustling markets and modern skyscrapers, experience the dynamic spirit of southern Vietnam.",
      vi: "Đắm mình trong năng lượng sôi động của Thành phố Hồ Chí Minh, đô thị lớn nhất Việt Nam. Từ các địa danh lịch sử như Nhà thờ Đức Bà đến các chợ sầm uất và tòa nhà chọc trời hiện đại, trải nghiệm tinh thần năng động của miền Nam Việt Nam."
    },
    shortDescription: {
      en: "Vibrant metropolis with historic landmarks and modern skyscrapers",
      vi: "Đô thị sôi động với các địa danh lịch sử và tòa nhà chọc trời hiện đại"
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ho Chi Minh City skyline",
        caption: "Modern Skyline of Ho Chi Minh City"
      },
      {
        url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop",
        alt: "Notre-Dame Cathedral",
        caption: "Notre-Dame Cathedral - Historic Landmark"
      },
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Ben Thanh Market",
        caption: "Ben Thanh Market - Bustling Commerce"
      }
    ],
    location: {
      en: "Ho Chi Minh City, Vietnam",
      vi: "Thành phố Hồ Chí Minh, Việt Nam"
    },
    region: "south",
    isActive: true,
    isFeatured: true,
    featuredOrder: 11,
    metaTitle: {
      en: "Ho Chi Minh City Tours - Vibrant Metropolis & Historic Landmarks",
      vi: "Tour Thành Phố Hồ Chí Minh - Đô Thị Sôi Động & Địa Danh Lịch Sử"
    },
    metaDescription: {
      en: "Explore Ho Chi Minh City's vibrant energy and rich history. Discover historic landmarks, bustling markets, and modern attractions in Vietnam's largest city.",
      vi: "Khám phá năng lượng sôi động và lịch sử phong phú của Thành phố Hồ Chí Minh. Tìm hiểu các địa danh lịch sử, chợ sầm uất và điểm tham quan hiện đại ở thành phố lớn nhất Việt Nam."
    },
    tags: ["metropolis", "history", "markets", "modern", "urban"]
  }
];

// Create all tour categories
const createAllTourCategories = async () => {
  try {
    console.log('Starting to create all tour categories...');
    
    // Clear existing tour categories
    await TourCategory.deleteMany({});
    console.log('Cleared existing tour categories');
    
    // Create new tour categories
    const createdCategories = await TourCategory.insertMany(allTourCategoriesData);
    console.log(`Successfully created ${createdCategories.length} tour categories:`);
    
    createdCategories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name.en} (${category.name.vi}) - ${category.slug}`);
    });
    
    console.log('\nAll tour categories created successfully!');
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
    await createAllTourCategories();
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

module.exports = { createAllTourCategories, allTourCategoriesData };
