const mongoose = require('mongoose');
const Blog = require('../models/Blog');
const User = require('../models/User');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding blogs');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedBlogs = async () => {
  try {
    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('Cleared existing blogs');

    // Get admin user for author
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found. Please create an admin user first.');
      return;
    }

    const blogs = [
      {
        title: {
          en: 'Top 10 Must-Visit Destinations in Vietnam',
          vi: '10 Điểm Đến Không Thể Bỏ Qua Ở Việt Nam'
        },
        content: {
          en: 'Vietnam is a country of breathtaking natural beauty with a unique heritage and travel-friendly culture. From the terraced rice fields in the north to the fascinating bustle of the Mekong Delta in the south, Vietnam offers an incredible diversity of experiences.',
          vi: 'Việt Nam là một đất nước có vẻ đẹp thiên nhiên ngoạn mục với di sản độc đáo và văn hóa thân thiện với du lịch. Từ những ruộng bậc thang ở miền Bắc đến sự nhộn nhịp hấp dẫn của Đồng bằng sông Cửu Long ở miền Nam, Việt Nam mang đến sự đa dạng trải nghiệm đáng kinh ngạc.'
        },
        excerpt: {
          en: 'Discover the most beautiful and culturally rich destinations that Vietnam has to offer, from the mountains of Sapa to the beaches of Phu Quoc.',
          vi: 'Khám phá những điểm đến đẹp nhất và giàu văn hóa nhất mà Việt Nam có thể mang lại, từ núi Sapa đến biển Phú Quốc.'
        },
        categories: ['destinations', 'travel-tips'],
        tags: [
          { en: 'Vietnam', vi: 'Việt Nam' },
          { en: 'Travel', vi: 'Du Lịch' },
          { en: 'Destinations', vi: 'Điểm Đến' }
        ],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date(),
        readingTime: 8,
        author: adminUser._id,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
          publicId: 'blog-vietnam-destinations',
          alt: {
            en: 'Vietnam landscape',
            vi: 'Cảnh quan Việt Nam'
          }
        }
      },
      {
        title: {
          en: 'Vietnamese Street Food: A Culinary Adventure',
          vi: 'Ẩm Thực Đường Phố Việt Nam: Cuộc Phiêu Lưu Ẩm Thực'
        },
        content: {
          en: 'Vietnamese street food is not just about eating; it\'s about experiencing the culture, the people, and the way of life. From the famous pho to the lesser-known banh mi, every dish tells a story.',
          vi: 'Ẩm thực đường phố Việt Nam không chỉ là ăn uống; đó là về việc trải nghiệm văn hóa, con người và cách sống. Từ phở nổi tiếng đến bánh mì ít được biết đến, mỗi món ăn đều kể một câu chuyện.'
        },
        excerpt: {
          en: 'Explore the vibrant world of Vietnamese street food and discover the stories behind the most popular dishes.',
          vi: 'Khám phá thế giới sôi động của ẩm thực đường phố Việt Nam và khám phá những câu chuyện đằng sau những món ăn phổ biến nhất.'
        },
        categories: ['food-culture'],
        tags: [
          { en: 'Street Food', vi: 'Ẩm Thực Đường Phố' },
          { en: 'Vietnamese Cuisine', vi: 'Ẩm Thực Việt Nam' },
          { en: 'Food Culture', vi: 'Văn Hóa Ẩm Thực' }
        ],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 86400000), // 1 day ago
        readingTime: 6,
        author: adminUser._id,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop',
          publicId: 'blog-vietnamese-street-food',
          alt: {
            en: 'Vietnamese street food',
            vi: 'Ẩm thực đường phố Việt Nam'
          }
        }
      },
      {
        title: {
          en: 'Complete Guide to Ha Long Bay Cruise',
          vi: 'Hướng Dẫn Hoàn Chỉnh Về Du Thuyền Vịnh Hạ Long'
        },
        content: {
          en: 'Ha Long Bay, a UNESCO World Heritage Site, is one of Vietnam\'s most spectacular natural wonders. This guide will help you plan the perfect cruise experience.',
          vi: 'Vịnh Hạ Long, một Di sản Thế giới UNESCO, là một trong những kỳ quan thiên nhiên ngoạn mục nhất của Việt Nam. Hướng dẫn này sẽ giúp bạn lên kế hoạch cho trải nghiệm du thuyền hoàn hảo.'
        },
        excerpt: {
          en: 'Everything you need to know about planning and enjoying a cruise in the stunning Ha Long Bay.',
          vi: 'Tất cả những gì bạn cần biết về việc lên kế hoạch và tận hưởng chuyến du thuyền ở Vịnh Hạ Long tuyệt đẹp.'
        },
        categories: ['destinations', 'guides'],
        tags: [
          { en: 'Ha Long Bay', vi: 'Vịnh Hạ Long' },
          { en: 'Cruise', vi: 'Du Thuyền' },
          { en: 'UNESCO', vi: 'UNESCO' }
        ],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 172800000), // 2 days ago
        readingTime: 10,
        author: adminUser._id,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
          publicId: 'blog-ha-long-bay-cruise',
          alt: {
            en: 'Ha Long Bay cruise',
            vi: 'Du thuyền Vịnh Hạ Long'
          }
        }
      },
      {
        title: {
          en: 'Best Time to Visit Vietnam: Weather and Seasons',
          vi: 'Thời Điểm Tốt Nhất Để Thăm Việt Nam: Thời Tiết Và Mùa'
        },
        content: {
          en: 'Vietnam\'s climate varies significantly from north to south, making it important to choose the right time to visit different regions. This guide will help you plan your trip according to the weather.',
          vi: 'Khí hậu Việt Nam thay đổi đáng kể từ Bắc vào Nam, khiến việc chọn thời điểm thích hợp để thăm các vùng khác nhau trở nên quan trọng. Hướng dẫn này sẽ giúp bạn lên kế hoạch chuyến đi theo thời tiết.'
        },
        excerpt: {
          en: 'Learn about Vietnam\'s weather patterns and find the best time to visit each region for optimal travel experience.',
          vi: 'Tìm hiểu về các mô hình thời tiết của Việt Nam và tìm thời điểm tốt nhất để thăm mỗi vùng để có trải nghiệm du lịch tối ưu.'
        },
        categories: ['travel-tips', 'guides'],
        tags: [
          { en: 'Weather', vi: 'Thời Tiết' },
          { en: 'Best Time', vi: 'Thời Điểm Tốt Nhất' },
          { en: 'Travel Planning', vi: 'Lập Kế Hoạch Du Lịch' }
        ],
        isPublished: true,
        isFeatured: false,
        publishedAt: new Date(Date.now() - 259200000), // 3 days ago
        readingTime: 7,
        author: adminUser._id,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
          publicId: 'blog-vietnam-weather',
          alt: {
            en: 'Vietnam weather',
            vi: 'Thời tiết Việt Nam'
          }
        }
      },
      {
        title: {
          en: 'Sapa Trekking: A Journey Through the Mountains',
          vi: 'Trekking Sapa: Hành Trình Qua Núi'
        },
        content: {
          en: 'Sapa, located in the northern mountains of Vietnam, offers some of the most beautiful trekking experiences in Southeast Asia. Discover the ethnic minority villages and stunning rice terraces.',
          vi: 'Sapa, nằm ở vùng núi phía Bắc Việt Nam, mang đến một số trải nghiệm trekking đẹp nhất ở Đông Nam Á. Khám phá các làng dân tộc thiểu số và ruộng bậc thang tuyệt đẹp.'
        },
        excerpt: {
          en: 'Experience the beauty of Sapa through trekking adventures and cultural encounters with local ethnic communities.',
          vi: 'Trải nghiệm vẻ đẹp của Sapa thông qua các cuộc phiêu lưu trekking và gặp gỡ văn hóa với các cộng đồng dân tộc địa phương.'
        },
        categories: ['destinations', 'travel-tips'],
        tags: [
          { en: 'Sapa', vi: 'Sapa' },
          { en: 'Trekking', vi: 'Trekking' },
          { en: 'Mountains', vi: 'Núi' }
        ],
        isPublished: true,
        isFeatured: true,
        publishedAt: new Date(Date.now() - 345600000), // 4 days ago
        readingTime: 9,
        author: adminUser._id,
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=800&h=600&fit=crop',
          publicId: 'blog-sapa-trekking',
          alt: {
            en: 'Sapa trekking',
            vi: 'Trekking Sapa'
          }
        }
      }
    ];

    // Generate slugs for each blog
    const blogsWithSlugs = blogs.map(blog => {
      const slug = blog.title.en
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      return {
        ...blog,
        slug
      };
    });

    // Insert blogs
    const insertedBlogs = await Blog.insertMany(blogsWithSlugs);
    console.log(`Seeded ${insertedBlogs.length} blogs successfully`);

    // Populate author information
    const populatedBlogs = await Blog.find({})
      .populate('author', 'name email avatar');

    console.log('Blog seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding blogs:', error);
    process.exit(1);
  }
};

// Run the seeding
connectDB().then(() => {
  seedBlogs();
});
