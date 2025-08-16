const Category = require('../models/Category');

const categoriesData = [
  // Main Categories (Level 0)
  {
    name: {
      en: 'Northern Vietnam',
      vi: 'Miền Bắc Việt Nam'
    },
    slug: 'northern-vietnam',
    description: {
      en: 'Explore the stunning landscapes and rich culture of Northern Vietnam',
      vi: 'Khám phá cảnh quan tuyệt đẹp và văn hóa phong phú của miền Bắc Việt Nam'
    },
    type: 'vietnam-tours',
    level: 0,
    region: 'north',
    sortOrder: 1,
    isActive: true
  },
  {
    name: {
      en: 'Central Vietnam',
      vi: 'Miền Trung Việt Nam'
    },
    slug: 'central-vietnam',
    description: {
      en: 'Discover the historical sites and beautiful beaches of Central Vietnam',
      vi: 'Khám phá các di tích lịch sử và bãi biển đẹp của miền Trung Việt Nam'
    },
    type: 'vietnam-tours',
    level: 0,
    region: 'central',
    sortOrder: 2,
    isActive: true
  },
  {
    name: {
      en: 'Southern Vietnam',
      vi: 'Miền Nam Việt Nam'
    },
    slug: 'southern-vietnam',
    description: {
      en: 'Experience the vibrant cities and Mekong Delta of Southern Vietnam',
      vi: 'Trải nghiệm các thành phố sôi động và đồng bằng sông Cửu Long của miền Nam Việt Nam'
    },
    type: 'vietnam-tours',
    level: 0,
    region: 'south',
    sortOrder: 3,
    isActive: true
  },
  {
    name: {
      en: 'Adventure Tours',
      vi: 'Tour Phiêu Lưu'
    },
    slug: 'adventure-tours',
    description: {
      en: 'Thrilling adventure tours for adrenaline seekers',
      vi: 'Tour phiêu lưu thú vị cho những người thích mạo hiểm'
    },
    type: 'vietnam-tours',
    level: 0,
    region: 'all',
    sortOrder: 4,
    isActive: true
  }
];

const subcategoriesData = [
  // Northern Vietnam Subcategories
  {
    name: {
      en: 'Hanoi',
      vi: 'Hà Nội'
    },
    slug: 'hanoi',
    description: {
      en: 'The historic capital of Vietnam with rich culture and delicious street food',
      vi: 'Thủ đô lịch sử của Việt Nam với văn hóa phong phú và ẩm thực đường phố ngon'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'north',
    location: {
      en: 'Hanoi, Vietnam',
      vi: 'Hà Nội, Việt Nam'
    },
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
    level: 1,
    region: 'north',
    location: {
      en: 'Quang Ninh Province, Vietnam',
      vi: 'Tỉnh Quảng Ninh, Việt Nam'
    },
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
    level: 1,
    region: 'north',
    location: {
      en: 'Lao Cai Province, Vietnam',
      vi: 'Tỉnh Lào Cai, Việt Nam'
    },
    sortOrder: 3,
    isActive: true
  },
  {
    name: {
      en: 'Ninh Binh',
      vi: 'Ninh Bình'
    },
    slug: 'ninh-binh',
    description: {
      en: 'Land of limestone mountains and ancient temples',
      vi: 'Vùng đất núi đá vôi và đền chùa cổ'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'north',
    location: {
      en: 'Ninh Binh Province, Vietnam',
      vi: 'Tỉnh Ninh Bình, Việt Nam'
    },
    sortOrder: 4,
    isActive: true
  },
  {
    name: {
      en: 'Cat Ba Island',
      vi: 'Đảo Cát Bà'
    },
    slug: 'cat-ba-island',
    description: {
      en: 'Beautiful island with national park and pristine beaches',
      vi: 'Hòn đảo đẹp với vườn quốc gia và bãi biển hoang sơ'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'north',
    location: {
      en: 'Cat Ba Island, Vietnam',
      vi: 'Đảo Cát Bà, Việt Nam'
    },
    sortOrder: 5,
    isActive: true
  },

  // Central Vietnam Subcategories
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
    level: 1,
    region: 'central',
    location: {
      en: 'Thua Thien Hue Province, Vietnam',
      vi: 'Tỉnh Thừa Thiên Huế, Việt Nam'
    },
    sortOrder: 1,
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
    level: 1,
    region: 'central',
    location: {
      en: 'Quang Nam Province, Vietnam',
      vi: 'Tỉnh Quảng Nam, Việt Nam'
    },
    sortOrder: 2,
    isActive: true
  },
  {
    name: {
      en: 'Da Nang',
      vi: 'Đà Nẵng'
    },
    slug: 'da-nang',
    description: {
      en: 'Modern coastal city with beautiful beaches and bridges',
      vi: 'Thành phố biển hiện đại với bãi biển và cầu đẹp'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'central',
    location: {
      en: 'Da Nang City, Vietnam',
      vi: 'Thành phố Đà Nẵng, Việt Nam'
    },
    sortOrder: 3,
    isActive: true
  },

  // Southern Vietnam Subcategories
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
    level: 1,
    region: 'south',
    location: {
      en: 'Ho Chi Minh City, Vietnam',
      vi: 'Thành phố Hồ Chí Minh, Việt Nam'
    },
    sortOrder: 1,
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
    level: 1,
    region: 'south',
    location: {
      en: 'Mekong Delta, Vietnam',
      vi: 'Đồng bằng sông Cửu Long, Việt Nam'
    },
    sortOrder: 2,
    isActive: true
  },
  {
    name: {
      en: 'Phu Quoc',
      vi: 'Phú Quốc'
    },
    slug: 'phu-quoc',
    description: {
      en: 'Tropical island paradise with white sand beaches',
      vi: 'Thiên đường đảo nhiệt đới với bãi biển cát trắng'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'south',
    location: {
      en: 'Phu Quoc Island, Vietnam',
      vi: 'Đảo Phú Quốc, Việt Nam'
    },
    sortOrder: 3,
    isActive: true
  },

  // Adventure Tours Subcategories
  {
    name: {
      en: 'Trekking & Hiking',
      vi: 'Trekking & Leo Núi'
    },
    slug: 'trekking-hiking',
    description: {
      en: 'Mountain trekking and hiking adventures',
      vi: 'Cuộc phiêu lưu trekking và leo núi'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'all',
    sortOrder: 1,
    isActive: true
  },
  {
    name: {
      en: 'Water Sports',
      vi: 'Thể Thao Dưới Nước'
    },
    slug: 'water-sports',
    description: {
      en: 'Diving, snorkeling, and water activities',
      vi: 'Lặn, bơi lội và các hoạt động dưới nước'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'all',
    sortOrder: 2,
    isActive: true
  },
  {
    name: {
      en: 'Cycling Tours',
      vi: 'Tour Đạp Xe'
    },
    slug: 'cycling-tours',
    description: {
      en: 'Cycling adventures through Vietnam\'s countryside',
      vi: 'Cuộc phiêu lưu đạp xe qua vùng nông thôn Việt Nam'
    },
    type: 'vietnam-tours',
    level: 1,
    region: 'all',
    sortOrder: 3,
    isActive: true
  }
];

const seedCategoriesWithSubcategories = async () => {
  try {
    console.log('🌱 Seeding categories with subcategories...');

    // Clear existing categories
    await Category.deleteMany({});

    // Create main categories first
    const mainCategories = [];
    for (const categoryData of categoriesData) {
      const category = new Category(categoryData);
      await category.save();
      mainCategories.push(category);
      console.log(`✅ Created main category: ${category.name.en}`);
    }

    // Create subcategories and link them to parents
    for (const subcatData of subcategoriesData) {
      let parentCategory;
      
      // Find the appropriate parent based on region or type
      if (subcatData.region === 'north') {
        parentCategory = mainCategories.find(cat => cat.slug === 'northern-vietnam');
      } else if (subcatData.region === 'central') {
        parentCategory = mainCategories.find(cat => cat.slug === 'central-vietnam');
      } else if (subcatData.region === 'south') {
        parentCategory = mainCategories.find(cat => cat.slug === 'southern-vietnam');
      } else if (subcatData.region === 'all') {
        parentCategory = mainCategories.find(cat => cat.slug === 'adventure-tours');
      }

      if (parentCategory) {
        const subcategory = new Category({
          ...subcatData,
          parent: parentCategory._id
        });
        await subcategory.save();

        // Update parent's subcategories array
        await Category.findByIdAndUpdate(
          parentCategory._id,
          { $push: { subcategories: subcategory._id } }
        );

        console.log(`✅ Created subcategory: ${subcategory.name.en} under ${parentCategory.name.en}`);
      }
    }

    console.log('🎉 Categories with subcategories seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
  }
};

module.exports = seedCategoriesWithSubcategories;
