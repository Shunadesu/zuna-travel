const mongoose = require('mongoose');
const Tour = require('../models/Tour');
const TourCategory = require('../models/TourCategory');

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Try local MongoDB first, then fallback to Atlas
    const localUri = 'mongodb://localhost:27017/zuna-travel';
    const atlasUri = process.env.MONGODB_URI || 'mongodb+srv://zunatravel:zunatravel123@cluster0.8kqjq.mongodb.net/zunatravel?retryWrites=true&w=majority';
    
    try {
      await mongoose.connect(localUri);
      console.log('MongoDB connected (local)');
    } catch (localError) {
      console.log('Local MongoDB not available, trying Atlas...');
      await mongoose.connect(atlasUri);
      console.log('MongoDB connected (Atlas)');
    }
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Please make sure MongoDB is running locally or check your internet connection for Atlas');
    process.exit(1);
  }
};

// Sample tours data based on the images
const toursData = [
  // Cat Ba Tours (2 tours)
  {
    title: {
      en: "Cat Ba National Park Trekking",
      vi: "Trekking Vườn Quốc Gia Cát Bà"
    },
    slug: "cat-ba-national-park-trekking",
    description: {
      en: "Experience the breathtaking beauty of Cat Ba National Park with our guided trekking tour. Explore dense forests, limestone karsts, and enjoy panoramic views of the surrounding landscape.",
      vi: "Trải nghiệm vẻ đẹp ngoạn mục của Vườn Quốc Gia Cát Bà với tour trekking có hướng dẫn. Khám phá rừng rậm, núi đá vôi và tận hưởng tầm nhìn toàn cảnh của cảnh quan xung quanh."
    },
    content: {
      en: `
        <h2>Cat Ba National Park Trekking Adventure</h2>
        <p>Join us for an unforgettable trekking experience through Cat Ba National Park, one of Vietnam's most beautiful natural reserves.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Entrance fees to Cat Ba National Park</li>
          <li>Lunch at local restaurant</li>
          <li>Transportation from Cat Ba town</li>
          <li>Safety equipment</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>8:00 AM:</strong> Pick up from your hotel in Cat Ba town</p>
        <p><strong>8:30 AM:</strong> Arrive at Cat Ba National Park entrance</p>
        <p><strong>9:00 AM:</strong> Start trekking through the forest</p>
        <p><strong>12:00 PM:</strong> Lunch break at scenic viewpoint</p>
        <p><strong>1:00 PM:</strong> Continue trekking to highest peak</p>
        <p><strong>3:00 PM:</strong> Return to park entrance</p>
        <p><strong>4:00 PM:</strong> Return to Cat Ba town</p>
        
        <h3>What to Bring:</h3>
        <ul>
          <li>Comfortable hiking shoes</li>
          <li>Sun hat and sunscreen</li>
          <li>Water bottle</li>
          <li>Camera for amazing photos</li>
        </ul>
      `,
      vi: `
        <h2>Cuộc Phiêu Lưu Trekking Vườn Quốc Gia Cát Bà</h2>
        <p>Tham gia cùng chúng tôi để có trải nghiệm trekking khó quên qua Vườn Quốc Gia Cát Bà, một trong những khu bảo tồn thiên nhiên đẹp nhất Việt Nam.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Phí vào cửa Vườn Quốc Gia Cát Bà</li>
          <li>Bữa trưa tại nhà hàng địa phương</li>
          <li>Phương tiện di chuyển từ thị trấn Cát Bà</li>
          <li>Thiết bị an toàn</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>8:00:</strong> Đón khách tại khách sạn ở thị trấn Cát Bà</p>
        <p><strong>8:30:</strong> Đến cổng vào Vườn Quốc Gia Cát Bà</p>
        <p><strong>9:00:</strong> Bắt đầu trekking qua rừng</p>
        <p><strong>12:00:</strong> Nghỉ trưa tại điểm ngắm cảnh</p>
        <p><strong>13:00:</strong> Tiếp tục trekking lên đỉnh cao nhất</p>
        <p><strong>15:00:</strong> Trở về cổng công viên</p>
        <p><strong>16:00:</strong> Trở về thị trấn Cát Bà</p>
        
        <h3>Mang theo:</h3>
        <ul>
          <li>Giày đi bộ thoải mái</li>
          <li>Mũ và kem chống nắng</li>
          <li>Chai nước</li>
          <li>Máy ảnh để chụp ảnh tuyệt đẹp</li>
        </ul>
      `
    },
    shortDescription: {
      en: "Experience the breathtaking beauty of Cat Ba National Park with our guided trekking tour.",
      vi: "Trải nghiệm vẻ đẹp ngoạn mục của Vườn Quốc Gia Cát Bà với tour trekking có hướng dẫn."
    },
    region: "Northern Vietnam",
    location: {
      en: "Cat Ba Island, Hai Phong",
      vi: "Đảo Cát Bà, Hải Phòng"
    },
    duration: {
      days: 1,
      hours: 8
    },
    pricing: {
      adult: 29,
      child: 20,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
        alt: "Cat Ba National Park Trekking",
        isPrimary: true
      }
    ],
    tourType: "Private Tour",
    difficulty: "moderate",
    maxGroupSize: 8,
    minGroupSize: 2,
    isActive: true,
    isFeatured: true,
    tags: ["trekking", "nature", "national-park", "cat-ba"],
    highlights: [
      { en: "Professional guide", vi: "Hướng dẫn viên chuyên nghiệp" },
      { en: "National Park entrance", vi: "Phí vào cửa Vườn Quốc Gia" },
      { en: "Scenic viewpoints", vi: "Điểm ngắm cảnh đẹp" },
      { en: "Local lunch included", vi: "Bao gồm bữa trưa địa phương" }
    ]
  },
  {
    title: {
      en: "A Day Exploring Cat Ba Island on Cruise",
      vi: "Một Ngày Khám Phá Đảo Cát Bà Trên Du Thuyền"
    },
    slug: "cat-ba-island-cruise-exploration",
    description: {
      en: "Discover the stunning beauty of Cat Ba Island and its surrounding waters on a comfortable cruise. Visit hidden lagoons, limestone caves, and enjoy swimming in crystal clear waters.",
      vi: "Khám phá vẻ đẹp tuyệt vời của Đảo Cát Bà và vùng nước xung quanh trên du thuyền thoải mái. Tham quan các đầm phá ẩn, hang động đá vôi và tận hưởng bơi lội trong làn nước trong vắt."
    },
    content: {
      en: `
        <h2>Cat Ba Island Cruise Adventure</h2>
        <p>Embark on a memorable journey through the pristine waters around Cat Ba Island, discovering hidden gems and natural wonders.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Modern cruise boat with safety equipment</li>
          <li>Professional English-speaking guide</li>
          <li>Fresh seafood lunch on board</li>
          <li>Snorkeling equipment</li>
          <li>Kayaking equipment</li>
          <li>Entrance fees to attractions</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>8:00 AM:</strong> Departure from Cat Ba pier</p>
        <p><strong>9:30 AM:</strong> Arrive at first lagoon for swimming</p>
        <p><strong>11:00 AM:</strong> Visit limestone cave</p>
        <p><strong>12:30 PM:</strong> Lunch on board</p>
        <p><strong>2:00 PM:</strong> Kayaking in hidden lagoon</p>
        <p><strong>3:30 PM:</strong> Snorkeling session</p>
        <p><strong>5:00 PM:</strong> Return to Cat Ba pier</p>
        
        <h3>What to Bring:</h3>
        <ul>
          <li>Swimwear and towel</li>
          <li>Sun hat and sunscreen</li>
          <li>Waterproof camera</li>
          <li>Extra clothes</li>
        </ul>
      `,
      vi: `
        <h2>Cuộc Phiêu Lưu Du Thuyền Đảo Cát Bà</h2>
        <p>Bắt đầu hành trình đáng nhớ qua vùng nước nguyên sơ quanh Đảo Cát Bà, khám phá những viên ngọc ẩn và kỳ quan thiên nhiên.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Du thuyền hiện đại với thiết bị an toàn</li>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Bữa trưa hải sản tươi trên tàu</li>
          <li>Thiết bị lặn ống thở</li>
          <li>Thiết bị chèo thuyền kayak</li>
          <li>Phí vào cửa các điểm tham quan</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>8:00:</strong> Khởi hành từ cảng Cát Bà</p>
        <p><strong>9:30:</strong> Đến đầm phá đầu tiên để bơi</p>
        <p><strong>11:00:</strong> Tham quan hang động đá vôi</p>
        <p><strong>12:30:</strong> Bữa trưa trên tàu</p>
        <p><strong>14:00:</strong> Chèo kayak trong đầm phá ẩn</p>
        <p><strong>15:30:</strong> Phiên lặn ống thở</p>
        <p><strong>17:00:</strong> Trở về cảng Cát Bà</p>
        
        <h3>Mang theo:</h3>
        <ul>
          <li>Đồ bơi và khăn tắm</li>
          <li>Mũ và kem chống nắng</li>
          <li>Máy ảnh chống nước</li>
          <li>Quần áo thay</li>
        </ul>
      `
    },
    shortDescription: {
      en: "Discover the stunning beauty of Cat Ba Island and its surrounding waters on a comfortable cruise.",
      vi: "Khám phá vẻ đẹp tuyệt vời của Đảo Cát Bà và vùng nước xung quanh trên du thuyền thoải mái."
    },
    region: "Northern Vietnam",
    location: {
      en: "Cat Ba Island, Hai Phong",
      vi: "Đảo Cát Bà, Hải Phòng"
    },
    duration: {
      days: 1,
      hours: 9
    },
    pricing: {
      adult: 32,
      child: 25,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&h=600&fit=crop",
        alt: "Cat Ba Island Cruise",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "easy",
    maxGroupSize: 20,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["cruise", "island", "swimming", "kayaking", "cat-ba"],
    highlights: [
      { en: "Modern cruise boat", vi: "Du thuyền hiện đại" },
      { en: "Fresh seafood lunch", vi: "Bữa trưa hải sản tươi" },
      { en: "Kayaking and snorkeling", vi: "Chèo kayak và lặn ống thở" },
      { en: "Hidden lagoons", vi: "Đầm phá ẩn" }
    ]
  },

  // Ninh Binh Tours (5 tours)
  {
    title: {
      en: "Full Day Ninh Binh Tour - Hoa Lu, Trang An, Mua Cave",
      vi: "Tour Ninh Bình Trọn Ngày - Hoa Lư, Tràng An, Hang Múa"
    },
    slug: "ninh-binh-full-day-hoa-lu-trang-an-mua-cave",
    description: {
      en: "Experience the best of Ninh Binh in one day with visits to the ancient capital Hoa Lu, the stunning Trang An boat ride, and the spectacular Mua Cave viewpoint.",
      vi: "Trải nghiệm những điều tốt nhất của Ninh Bình trong một ngày với tham quan cố đô Hoa Lư, chuyến đi thuyền Tràng An tuyệt đẹp và điểm ngắm cảnh Hang Múa ngoạn mục."
    },
    content: {
      en: `
        <h2>Full Day Ninh Binh Adventure</h2>
        <p>Discover the cultural and natural wonders of Ninh Binh province in this comprehensive day tour.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Air-conditioned vehicle</li>
          <li>Boat ride in Trang An</li>
          <li>Entrance fees to all attractions</li>
          <li>Lunch at local restaurant</li>
          <li>Bicycle rental for temple exploration</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>7:30 AM:</strong> Pick up from Hanoi Old Quarter</p>
        <p><strong>9:30 AM:</strong> Arrive at Hoa Lu Ancient Capital</p>
        <p><strong>11:00 AM:</strong> Visit Dinh and Le temples</p>
        <p><strong>12:00 PM:</strong> Lunch at local restaurant</p>
        <p><strong>1:30 PM:</strong> Trang An boat ride (2 hours)</p>
        <p><strong>4:00 PM:</strong> Climb Mua Cave for panoramic views</p>
        <p><strong>5:30 PM:</strong> Return to Hanoi</p>
        <p><strong>7:30 PM:</strong> Arrive back in Hanoi</p>
      `,
      vi: `
        <h2>Cuộc Phiêu Lưu Ninh Bình Trọn Ngày</h2>
        <p>Khám phá những kỳ quan văn hóa và thiên nhiên của tỉnh Ninh Bình trong tour trọn ngày toàn diện này.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Xe có điều hòa</li>
          <li>Đi thuyền ở Tràng An</li>
          <li>Phí vào cửa tất cả điểm tham quan</li>
          <li>Bữa trưa tại nhà hàng địa phương</li>
          <li>Thuê xe đạp để khám phá đền</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>7:30:</strong> Đón khách từ Phố Cổ Hà Nội</p>
        <p><strong>9:30:</strong> Đến Cố Đô Hoa Lư</p>
        <p><strong>11:00:</strong> Tham quan đền Đinh và Lê</p>
        <p><strong>12:00:</strong> Bữa trưa tại nhà hàng địa phương</p>
        <p><strong>13:30:</strong> Đi thuyền Tràng An (2 giờ)</p>
        <p><strong>16:00:</strong> Leo Hang Múa để ngắm toàn cảnh</p>
        <p><strong>17:30:</strong> Trở về Hà Nội</p>
        <p><strong>19:30:</strong> Về đến Hà Nội</p>
      `
    },
    shortDescription: {
      en: "Experience the best of Ninh Binh in one day with visits to ancient capital, boat ride, and cave exploration.",
      vi: "Trải nghiệm những điều tốt nhất của Ninh Bình trong một ngày với tham quan cố đô, đi thuyền và khám phá hang động."
    },
    region: "Northern Vietnam",
    location: {
      en: "Ninh Binh Province",
      vi: "Tỉnh Ninh Bình"
    },
    duration: {
      days: 1,
      hours: 12
    },
    pricing: {
      adult: 48,
      child: 35,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ninh Binh Hoa Lu Trang An Mua Cave",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "moderate",
    maxGroupSize: 16,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["ninh-binh", "hoa-lu", "trang-an", "mua-cave", "boat-ride"],
    highlights: [
      { en: "Ancient capital Hoa Lu", vi: "Cố đô Hoa Lư" },
      { en: "Trang An boat ride", vi: "Đi thuyền Tràng An" },
      { en: "Mua Cave viewpoint", vi: "Điểm ngắm cảnh Hang Múa" },
      { en: "Cultural experience", vi: "Trải nghiệm văn hóa" }
    ]
  },
  {
    title: {
      en: "Full Day Ninh Binh Tour - Hoa Lu, Tam Coc, Mua Cave",
      vi: "Tour Ninh Bình Trọn Ngày - Hoa Lư, Tam Cốc, Hang Múa"
    },
    slug: "ninh-binh-full-day-hoa-lu-tam-coc-mua-cave",
    description: {
      en: "Explore the beautiful Ninh Binh with visits to Hoa Lu ancient capital, Tam Coc boat ride through rice fields, and Mua Cave for stunning views.",
      vi: "Khám phá Ninh Bình xinh đẹp với tham quan cố đô Hoa Lư, đi thuyền Tam Cốc qua ruộng lúa và Hang Múa để ngắm cảnh tuyệt đẹp."
    },
    content: {
      en: `
        <h2>Ninh Binh Cultural & Natural Tour</h2>
        <p>Immerse yourself in the rich history and stunning landscapes of Ninh Binh province.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Air-conditioned vehicle</li>
          <li>Tam Coc boat ride</li>
          <li>Entrance fees to all attractions</li>
          <li>Lunch at local restaurant</li>
          <li>Bicycle rental</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>7:30 AM:</strong> Pick up from Hanoi</p>
        <p><strong>9:30 AM:</strong> Visit Hoa Lu Ancient Capital</p>
        <p><strong>11:00 AM:</strong> Explore Dinh and Le temples</p>
        <p><strong>12:00 PM:</strong> Lunch at local restaurant</p>
        <p><strong>1:30 PM:</strong> Tam Coc boat ride (1.5 hours)</p>
        <p><strong>3:30 PM:</strong> Climb Mua Cave (500 steps)</p>
        <p><strong>5:00 PM:</strong> Return to Hanoi</p>
        <p><strong>7:00 PM:</strong> Arrive back in Hanoi</p>
      `,
      vi: `
        <h2>Tour Văn Hóa & Thiên Nhiên Ninh Bình</h2>
        <p>Đắm mình trong lịch sử phong phú và cảnh quan tuyệt đẹp của tỉnh Ninh Bình.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Xe có điều hòa</li>
          <li>Đi thuyền Tam Cốc</li>
          <li>Phí vào cửa tất cả điểm tham quan</li>
          <li>Bữa trưa tại nhà hàng địa phương</li>
          <li>Thuê xe đạp</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>7:30:</strong> Đón khách từ Hà Nội</p>
        <p><strong>9:30:</strong> Tham quan Cố Đô Hoa Lư</p>
        <p><strong>11:00:</strong> Khám phá đền Đinh và Lê</p>
        <p><strong>12:00:</strong> Bữa trưa tại nhà hàng địa phương</p>
        <p><strong>13:30:</strong> Đi thuyền Tam Cốc (1.5 giờ)</p>
        <p><strong>15:30:</strong> Leo Hang Múa (500 bậc thang)</p>
        <p><strong>17:00:</strong> Trở về Hà Nội</p>
        <p><strong>19:00:</strong> Về đến Hà Nội</p>
      `
    },
    shortDescription: {
      en: "Explore the beautiful Ninh Binh with visits to ancient capital, boat ride through rice fields, and cave exploration.",
      vi: "Khám phá Ninh Bình xinh đẹp với tham quan cố đô, đi thuyền qua ruộng lúa và khám phá hang động."
    },
    region: "Northern Vietnam",
    location: {
      en: "Ninh Binh Province",
      vi: "Tỉnh Ninh Bình"
    },
    duration: {
      days: 1,
      hours: 11
    },
    pricing: {
      adult: 48,
      child: 35,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ninh Binh Hoa Lu Tam Coc Mua Cave",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "moderate",
    maxGroupSize: 16,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["ninh-binh", "hoa-lu", "tam-coc", "mua-cave", "rice-fields"],
    highlights: [
      { en: "Ancient capital Hoa Lu", vi: "Cố đô Hoa Lư" },
      { en: "Tam Coc boat ride", vi: "Đi thuyền Tam Cốc" },
      { en: "Rice field landscapes", vi: "Cảnh quan ruộng lúa" },
      { en: "Mua Cave viewpoint", vi: "Điểm ngắm cảnh Hang Múa" }
    ]
  },
  {
    title: {
      en: "Full Day Ninh Binh Tour - Bai Dinh, Trang An, Mua Cave",
      vi: "Tour Ninh Bình Trọn Ngày - Bái Đính, Tràng An, Hang Múa"
    },
    slug: "ninh-binh-full-day-bai-dinh-trang-an-mua-cave",
    description: {
      en: "Visit the largest Buddhist complex in Vietnam at Bai Dinh, enjoy a scenic boat ride in Trang An, and climb Mua Cave for breathtaking views.",
      vi: "Tham quan quần thể Phật giáo lớn nhất Việt Nam tại Bái Đính, tận hưởng chuyến đi thuyền ngắm cảnh ở Tràng An và leo Hang Múa để ngắm cảnh ngoạn mục."
    },
    content: {
      en: `
        <h2>Ninh Binh Spiritual & Scenic Tour</h2>
        <p>Combine spiritual exploration with natural beauty in this comprehensive Ninh Binh tour.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Air-conditioned vehicle</li>
          <li>Electric car at Bai Dinh</li>
          <li>Trang An boat ride</li>
          <li>Entrance fees to all attractions</li>
          <li>Lunch at local restaurant</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>7:30 AM:</strong> Pick up from Hanoi</p>
        <p><strong>9:00 AM:</strong> Visit Bai Dinh Pagoda complex</p>
        <p><strong>11:30 AM:</strong> Lunch at local restaurant</p>
        <p><strong>1:00 PM:</strong> Trang An boat ride (2 hours)</p>
        <p><strong>3:30 PM:</strong> Climb Mua Cave for views</p>
        <p><strong>5:00 PM:</strong> Return to Hanoi</p>
        <p><strong>7:00 PM:</strong> Arrive back in Hanoi</p>
      `,
      vi: `
        <h2>Tour Tâm Linh & Cảnh Quan Ninh Bình</h2>
        <p>Kết hợp khám phá tâm linh với vẻ đẹp thiên nhiên trong tour Ninh Bình toàn diện này.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Xe có điều hòa</li>
          <li>Xe điện tại Bái Đính</li>
          <li>Đi thuyền Tràng An</li>
          <li>Phí vào cửa tất cả điểm tham quan</li>
          <li>Bữa trưa tại nhà hàng địa phương</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>7:30:</strong> Đón khách từ Hà Nội</p>
        <p><strong>9:00:</strong> Tham quan quần thể chùa Bái Đính</p>
        <p><strong>11:30:</strong> Bữa trưa tại nhà hàng địa phương</p>
        <p><strong>13:00:</strong> Đi thuyền Tràng An (2 giờ)</p>
        <p><strong>15:30:</strong> Leo Hang Múa để ngắm cảnh</p>
        <p><strong>17:00:</strong> Trở về Hà Nội</p>
        <p><strong>19:00:</strong> Về đến Hà Nội</p>
      `
    },
    shortDescription: {
      en: "Visit the largest Buddhist complex in Vietnam, enjoy scenic boat ride, and climb for breathtaking views.",
      vi: "Tham quan quần thể Phật giáo lớn nhất Việt Nam, tận hưởng chuyến đi thuyền ngắm cảnh và leo để ngắm cảnh ngoạn mục."
    },
    region: "Northern Vietnam",
    location: {
      en: "Ninh Binh Province",
      vi: "Tỉnh Ninh Bình"
    },
    duration: {
      days: 1,
      hours: 11
    },
    pricing: {
      adult: 48,
      child: 35,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ninh Binh Bai Dinh Trang An Mua Cave",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "moderate",
    maxGroupSize: 16,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["ninh-binh", "bai-dinh", "trang-an", "mua-cave", "buddhist"],
    highlights: [
      { en: "Bai Dinh Pagoda complex", vi: "Quần thể chùa Bái Đính" },
      { en: "Trang An boat ride", vi: "Đi thuyền Tràng An" },
      { en: "Mua Cave viewpoint", vi: "Điểm ngắm cảnh Hang Múa" },
      { en: "Spiritual experience", vi: "Trải nghiệm tâm linh" }
    ]
  },
  {
    title: {
      en: "Full Day Ninh Binh Tour - Bai Dinh, Trang An",
      vi: "Tour Ninh Bình Trọn Ngày - Bái Đính, Tràng An"
    },
    slug: "ninh-binh-full-day-bai-dinh-trang-an",
    description: {
      en: "Explore the magnificent Bai Dinh Pagoda complex and enjoy a peaceful boat ride through the stunning Trang An landscape.",
      vi: "Khám phá quần thể chùa Bái Đính tráng lệ và tận hưởng chuyến đi thuyền yên bình qua cảnh quan Tràng An tuyệt đẹp."
    },
    content: {
      en: `
        <h2>Ninh Binh Cultural & Natural Beauty</h2>
        <p>Discover the spiritual and natural wonders of Ninh Binh in this relaxing day tour.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Air-conditioned vehicle</li>
          <li>Electric car at Bai Dinh</li>
          <li>Trang An boat ride</li>
          <li>Entrance fees to all attractions</li>
          <li>Lunch at local restaurant</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>7:30 AM:</strong> Pick up from Hanoi</p>
        <p><strong>9:00 AM:</strong> Visit Bai Dinh Pagoda complex</p>
        <p><strong>12:00 PM:</strong> Lunch at local restaurant</p>
        <p><strong>1:30 PM:</strong> Trang An boat ride (2.5 hours)</p>
        <p><strong>4:30 PM:</strong> Return to Hanoi</p>
        <p><strong>6:30 PM:</strong> Arrive back in Hanoi</p>
      `,
      vi: `
        <h2>Văn Hóa & Vẻ Đẹp Thiên Nhiên Ninh Bình</h2>
        <p>Khám phá những kỳ quan tâm linh và thiên nhiên của Ninh Bình trong tour ngày thư giãn này.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Xe có điều hòa</li>
          <li>Xe điện tại Bái Đính</li>
          <li>Đi thuyền Tràng An</li>
          <li>Phí vào cửa tất cả điểm tham quan</li>
          <li>Bữa trưa tại nhà hàng địa phương</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>7:30:</strong> Đón khách từ Hà Nội</p>
        <p><strong>9:00:</strong> Tham quan quần thể chùa Bái Đính</p>
        <p><strong>12:00:</strong> Bữa trưa tại nhà hàng địa phương</p>
        <p><strong>13:30:</strong> Đi thuyền Tràng An (2.5 giờ)</p>
        <p><strong>16:30:</strong> Trở về Hà Nội</p>
        <p><strong>18:30:</strong> Về đến Hà Nội</p>
      `
    },
    shortDescription: {
      en: "Explore the magnificent Bai Dinh Pagoda complex and enjoy a peaceful boat ride through stunning landscape.",
      vi: "Khám phá quần thể chùa Bái Đính tráng lệ và tận hưởng chuyến đi thuyền yên bình qua cảnh quan tuyệt đẹp."
    },
    region: "Northern Vietnam",
    location: {
      en: "Ninh Binh Province",
      vi: "Tỉnh Ninh Bình"
    },
    duration: {
      days: 1,
      hours: 11
    },
    pricing: {
      adult: 48,
      child: 35,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ninh Binh Bai Dinh Trang An",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "easy",
    maxGroupSize: 16,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["ninh-binh", "bai-dinh", "trang-an", "buddhist", "boat-ride"],
    highlights: [
      { en: "Bai Dinh Pagoda complex", vi: "Quần thể chùa Bái Đính" },
      { en: "Trang An boat ride", vi: "Đi thuyền Tràng An" },
      { en: "Peaceful experience", vi: "Trải nghiệm yên bình" },
      { en: "Cultural immersion", vi: "Đắm mình văn hóa" }
    ]
  },
  {
    title: {
      en: "Full Day Ninh Binh Tour - Hoa Lu, Tam Coc",
      vi: "Tour Ninh Bình Trọn Ngày - Hoa Lư, Tam Cốc"
    },
    slug: "ninh-binh-full-day-hoa-lu-tam-coc",
    description: {
      en: "Discover the ancient capital of Hoa Lu and enjoy a scenic boat ride through the beautiful Tam Coc rice fields and limestone karsts.",
      vi: "Khám phá cố đô Hoa Lư và tận hưởng chuyến đi thuyền ngắm cảnh qua những ruộng lúa Tam Cốc xinh đẹp và núi đá vôi."
    },
    content: {
      en: `
        <h2>Ninh Binh Historical & Scenic Tour</h2>
        <p>Step back in time and explore the ancient capital while enjoying the natural beauty of Tam Coc.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Air-conditioned vehicle</li>
          <li>Tam Coc boat ride</li>
          <li>Entrance fees to all attractions</li>
          <li>Lunch at local restaurant</li>
          <li>Bicycle rental for temple exploration</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>7:30 AM:</strong> Pick up from Hanoi</p>
        <p><strong>9:30 AM:</strong> Visit Hoa Lu Ancient Capital</p>
        <p><strong>11:00 AM:</strong> Explore Dinh and Le temples</p>
        <p><strong>12:00 PM:</strong> Lunch at local restaurant</p>
        <p><strong>1:30 PM:</strong> Tam Coc boat ride (1.5 hours)</p>
        <p><strong>3:30 PM:</strong> Free time for photography</p>
        <p><strong>4:30 PM:</strong> Return to Hanoi</p>
        <p><strong>6:30 PM:</strong> Arrive back in Hanoi</p>
      `,
      vi: `
        <h2>Tour Lịch Sử & Cảnh Quan Ninh Bình</h2>
        <p>Quay ngược thời gian và khám phá cố đô trong khi tận hưởng vẻ đẹp thiên nhiên của Tam Cốc.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Xe có điều hòa</li>
          <li>Đi thuyền Tam Cốc</li>
          <li>Phí vào cửa tất cả điểm tham quan</li>
          <li>Bữa trưa tại nhà hàng địa phương</li>
          <li>Thuê xe đạp để khám phá đền</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>7:30:</strong> Đón khách từ Hà Nội</p>
        <p><strong>9:30:</strong> Tham quan Cố Đô Hoa Lư</p>
        <p><strong>11:00:</strong> Khám phá đền Đinh và Lê</p>
        <p><strong>12:00:</strong> Bữa trưa tại nhà hàng địa phương</p>
        <p><strong>13:30:</strong> Đi thuyền Tam Cốc (1.5 giờ)</p>
        <p><strong>15:30:</strong> Thời gian tự do chụp ảnh</p>
        <p><strong>16:30:</strong> Trở về Hà Nội</p>
        <p><strong>18:30:</strong> Về đến Hà Nội</p>
      `
    },
    shortDescription: {
      en: "Discover the ancient capital of Hoa Lu and enjoy a scenic boat ride through beautiful rice fields and limestone karsts.",
      vi: "Khám phá cố đô Hoa Lư và tận hưởng chuyến đi thuyền ngắm cảnh qua những ruộng lúa xinh đẹp và núi đá vôi."
    },
    region: "Northern Vietnam",
    location: {
      en: "Ninh Binh Province",
      vi: "Tỉnh Ninh Bình"
    },
    duration: {
      days: 1,
      hours: 11
    },
    pricing: {
      adult: 35,
      child: 25,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Ninh Binh Hoa Lu Tam Coc",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "easy",
    maxGroupSize: 16,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["ninh-binh", "hoa-lu", "tam-coc", "rice-fields", "historical"],
    highlights: [
      { en: "Ancient capital Hoa Lu", vi: "Ancient capital Hoa Lu" },
      { en: "Tam Coc boat ride", vi: "Tam Coc boat ride" },
      { en: "Rice field landscapes", vi: "Rice field landscapes" },
      { en: "Historical exploration", vi: "Khám phá lịch sử" }
    ]
  },

  // Sapa Tours (4 tours)
  {
    title: {
      en: "Sapa Strawberry Harvest Tour & Cultural Exploration (Half Day)",
      vi: "Tour Thu Hoạch Dâu Tây Sapa & Khám Phá Văn Hóa (Nửa Ngày)"
    },
    slug: "sapa-strawberry-harvest-cultural-exploration",
    description: {
      en: "Experience the unique strawberry harvest season in Sapa and immerse yourself in the rich cultural heritage of the local ethnic communities.",
      vi: "Trải nghiệm mùa thu hoạch dâu tây độc đáo ở Sapa và đắm mình trong di sản văn hóa phong phú của các cộng đồng dân tộc địa phương."
    },
    content: {
      en: `
        <h2>Sapa Strawberry Harvest & Cultural Tour</h2>
        <p>Join us for a unique half-day experience combining strawberry picking with cultural exploration in the beautiful Sapa region.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Transportation from Sapa town</li>
          <li>Strawberry picking experience</li>
          <li>Cultural village visit</li>
          <li>Traditional lunch with local family</li>
          <li>Entrance fees</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>8:00 AM:</strong> Pick up from Sapa town</p>
        <p><strong>8:30 AM:</strong> Visit strawberry farm</p>
        <p><strong>10:00 AM:</strong> Strawberry picking session</p>
        <p><strong>11:00 AM:</strong> Visit ethnic minority village</p>
        <p><strong>12:00 PM:</strong> Traditional lunch</p>
        <p><strong>1:00 PM:</strong> Cultural performance</p>
        <p><strong>2:00 PM:</strong> Return to Sapa town</p>
      `,
      vi: `
        <h2>Tour Thu Hoạch Dâu Tây & Văn Hóa Sapa</h2>
        <p>Tham gia cùng chúng tôi để có trải nghiệm nửa ngày độc đáo kết hợp hái dâu tây với khám phá văn hóa ở vùng Sapa xinh đẹp.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Phương tiện di chuyển từ thị trấn Sapa</li>
          <li>Trải nghiệm hái dâu tây</li>
          <li>Tham quan làng văn hóa</li>
          <li>Bữa trưa truyền thống với gia đình địa phương</li>
          <li>Phí vào cửa</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>8:00:</strong> Đón khách từ thị trấn Sapa</p>
        <p><strong>8:30:</strong> Tham quan trang trại dâu tây</p>
        <p><strong>10:00:</strong> Phiên hái dâu tây</p>
        <p><strong>11:00:</strong> Tham quan làng dân tộc thiểu số</p>
        <p><strong>12:00:</strong> Bữa trưa truyền thống</p>
        <p><strong>13:00:</strong> Biểu diễn văn hóa</p>
        <p><strong>14:00:</strong> Trở về thị trấn Sapa</p>
      `
    },
    shortDescription: {
      en: "Experience the unique strawberry harvest season in Sapa and immerse yourself in the rich cultural heritage.",
      vi: "Trải nghiệm mùa thu hoạch dâu tây độc đáo ở Sapa và đắm mình trong di sản văn hóa phong phú."
    },
    region: "Northern Vietnam",
    location: {
      en: "Sapa, Lao Cai",
      vi: "Sapa, Lào Cai"
    },
    duration: {
      days: 1,
      hours: 6
    },
    pricing: {
      adult: 45,
      child: 30,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
        alt: "Sapa Strawberry Harvest Tour",
        isPrimary: true
      }
    ],
    tourType: "Private Tour",
    difficulty: "easy",
    maxGroupSize: 8,
    minGroupSize: 2,
    isActive: true,
    isFeatured: true,
    tags: ["sapa", "strawberry", "cultural", "harvest", "ethnic"],
    highlights: [
      { en: "Strawberry picking", vi: "Hái dâu tây" },
      { en: "Cultural village visit", vi: "Tham quan làng văn hóa" },
      { en: "Traditional lunch", vi: "Bữa trưa truyền thống" },
      { en: "Ethnic minority experience", vi: "Trải nghiệm dân tộc thiểu số" }
    ]
  },
  {
    title: {
      en: "8-Hour Day Tour in Sapa",
      vi: "Tour Ngày 8 Giờ ở Sapa"
    },
    slug: "sapa-8-hour-day-tour",
    description: {
      en: "Discover the breathtaking beauty of Sapa with our comprehensive 8-hour day tour, including terraced rice fields, ethnic villages, and stunning mountain views.",
      vi: "Khám phá vẻ đẹp ngoạn mục của Sapa với tour ngày 8 giờ toàn diện, bao gồm ruộng bậc thang, làng dân tộc và tầm nhìn núi tuyệt đẹp."
    },
    content: {
      en: `
        <h2>Sapa 8-Hour Day Adventure</h2>
        <p>Experience the best of Sapa in one comprehensive day tour covering the most beautiful spots and cultural experiences.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Air-conditioned vehicle</li>
          <li>Entrance fees to all attractions</li>
          <li>Lunch at local restaurant</li>
          <li>Water and snacks</li>
          <li>Hotel pickup and drop-off</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>7:00 AM:</strong> Pick up from hotel</p>
        <p><strong>8:00 AM:</strong> Visit Cat Cat Village</p>
        <p><strong>10:00 AM:</strong> Explore terraced rice fields</p>
        <p><strong>12:00 PM:</strong> Lunch at local restaurant</p>
        <p><strong>1:30 PM:</strong> Visit Silver Waterfall</p>
        <p><strong>3:00 PM:</strong> Explore Love Waterfall</p>
        <p><strong>4:30 PM:</strong> Visit ethnic minority village</p>
        <p><strong>6:00 PM:</strong> Return to hotel</p>
      `,
      vi: `
        <h2>Cuộc Phiêu Lưu Sapa 8 Giờ</h2>
        <p>Trải nghiệm những điều tốt nhất của Sapa trong một tour ngày toàn diện bao gồm những điểm đẹp nhất và trải nghiệm văn hóa.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Xe có điều hòa</li>
          <li>Phí vào cửa tất cả điểm tham quan</li>
          <li>Bữa trưa tại nhà hàng địa phương</li>
          <li>Nước và đồ ăn nhẹ</li>
          <li>Đón và trả khách tại khách sạn</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>7:00:</strong> Đón khách tại khách sạn</p>
        <p><strong>8:00:</strong> Tham quan Làng Cát Cát</p>
        <p><strong>10:00:</strong> Khám phá ruộng bậc thang</p>
        <p><strong>12:00:</strong> Bữa trưa tại nhà hàng địa phương</p>
        <p><strong>13:30:</strong> Tham quan Thác Bạc</p>
        <p><strong>15:00:</strong> Khám phá Thác Tình Yêu</p>
        <p><strong>16:30:</strong> Tham quan làng dân tộc thiểu số</p>
        <p><strong>18:00:</strong> Trở về khách sạn</p>
      `
    },
    shortDescription: {
      en: "Discover the breathtaking beauty of Sapa with our comprehensive 8-hour day tour including terraced rice fields and ethnic villages.",
      vi: "Khám phá vẻ đẹp ngoạn mục của Sapa với tour ngày 8 giờ toàn diện bao gồm ruộng bậc thang và làng dân tộc."
    },
    region: "Northern Vietnam",
    location: {
      en: "Sapa, Lao Cai",
      vi: "Sapa, Lào Cai"
    },
    duration: {
      days: 1,
      hours: 8
    },
    pricing: {
      adult: 45,
      child: 30,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Sapa 8 Hour Day Tour",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "moderate",
    maxGroupSize: 16,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["sapa", "day-tour", "terraced-fields", "waterfalls", "ethnic-villages"],
    highlights: [
      { en: "Cat Cat Village", vi: "Làng Cát Cát" },
      { en: "Terraced rice fields", vi: "Ruộng bậc thang" },
      { en: "Silver Waterfall", vi: "Thác Bạc" },
      { en: "Love Waterfall", vi: "Thác Tình Yêu" }
    ]
  },
  {
    title: {
      en: "2 Days 1 Night in Sapa: Y Linh Ho - Lao Chai - Ta Van",
      vi: "2 Ngày 1 Đêm ở Sapa: Y Linh Ho - Lao Chai - Ta Van"
    },
    slug: "sapa-2d1n-y-linh-ho-lao-chai-ta-van",
    description: {
      en: "Immerse yourself in the authentic Sapa experience with a 2-day trekking adventure through Y Linh Ho, Lao Chai, and Ta Van villages, staying overnight with local families.",
      vi: "Đắm mình trong trải nghiệm Sapa chân thực với cuộc phiêu lưu trekking 2 ngày qua các làng Y Linh Ho, Lao Chai và Ta Van, nghỉ đêm với các gia đình địa phương."
    },
    content: {
      en: `
        <h2>Sapa 2D1N Trekking Adventure</h2>
        <p>Experience authentic Sapa culture with this immersive 2-day trekking tour through ethnic minority villages.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Overnight homestay accommodation</li>
          <li>All meals (2 lunches, 1 dinner, 1 breakfast)</li>
          <li>Transportation from Hanoi to Sapa</li>
          <li>Entrance fees</li>
          <li>Trekking equipment</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>Day 1:</strong></p>
        <p>6:00 AM - Depart from Hanoi</p>
        <p>12:00 PM - Arrive in Sapa, lunch</p>
        <p>1:30 PM - Start trekking to Y Linh Ho</p>
        <p>4:00 PM - Arrive at homestay in Lao Chai</p>
        <p>6:00 PM - Dinner with local family</p>
        
        <p><strong>Day 2:</strong></p>
        <p>7:00 AM - Breakfast</p>
        <p>8:00 AM - Trek to Ta Van village</p>
        <p>12:00 PM - Lunch in Ta Van</p>
        <p>2:00 PM - Return to Sapa town</p>
        <p>4:00 PM - Depart for Hanoi</p>
        <p>10:00 PM - Arrive in Hanoi</p>
      `,
      vi: `
        <h2>Cuộc Phiêu Lưu Trekking Sapa 2N1Đ</h2>
        <p>Trải nghiệm văn hóa Sapa chân thực với tour trekking 2 ngày đắm mình qua các làng dân tộc thiểu số.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Chỗ ở homestay qua đêm</li>
          <li>Tất cả bữa ăn (2 bữa trưa, 1 bữa tối, 1 bữa sáng)</li>
          <li>Phương tiện từ Hà Nội đến Sapa</li>
          <li>Phí vào cửa</li>
          <li>Thiết bị trekking</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>Ngày 1:</strong></p>
        <p>6:00 - Khởi hành từ Hà Nội</p>
        <p>12:00 - Đến Sapa, bữa trưa</p>
        <p>13:30 - Bắt đầu trekking đến Y Linh Ho</p>
        <p>16:00 - Đến homestay ở Lao Chai</p>
        <p>18:00 - Bữa tối với gia đình địa phương</p>
        
        <p><strong>Ngày 2:</strong></p>
        <p>7:00 - Bữa sáng</p>
        <p>8:00 - Trek đến làng Ta Van</p>
        <p>12:00 - Bữa trưa ở Ta Van</p>
        <p>14:00 - Trở về thị trấn Sapa</p>
        <p>16:00 - Khởi hành về Hà Nội</p>
        <p>22:00 - Về đến Hà Nội</p>
      `
    },
    shortDescription: {
      en: "Immerse yourself in the authentic Sapa experience with a 2-day trekking adventure through ethnic minority villages.",
      vi: "Đắm mình trong trải nghiệm Sapa chân thực với cuộc phiêu lưu trekking 2 ngày qua các làng dân tộc thiểu số."
    },
    region: "Northern Vietnam",
    location: {
      en: "Sapa, Lao Cai",
      vi: "Sapa, Lào Cai"
    },
    duration: {
      days: 2,
      hours: 0
    },
    pricing: {
      adult: 68,
      child: 45,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Sapa 2D1N Trekking",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "moderate",
    maxGroupSize: 12,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["sapa", "trekking", "homestay", "ethnic-villages", "2d1n"],
    highlights: [
      { en: "Y Linh Ho village", vi: "Làng Y Linh Ho" },
      { en: "Lao Chai homestay", vi: "Homestay Lao Chai" },
      { en: "Ta Van village", vi: "Làng Ta Van" },
      { en: "Authentic cultural experience", vi: "Trải nghiệm văn hóa chân thực" }
    ]
  },
  {
    title: {
      en: "2 Days 1 Night in Sapa - Fansipan",
      vi: "2 Ngày 1 Đêm ở Sapa - Fansipan"
    },
    slug: "sapa-2d1n-fansipan",
    description: {
      en: "Conquer the highest peak in Indochina with our 2-day Fansipan trekking adventure, including overnight camping and breathtaking sunrise views.",
      vi: "Chinh phục đỉnh cao nhất Đông Dương với cuộc phiêu lưu trekking Fansipan 2 ngày, bao gồm cắm trại qua đêm và tầm nhìn bình minh ngoạn mục."
    },
    content: {
      en: `
        <h2>Fansipan 2D1N Trekking Challenge</h2>
        <p>Challenge yourself to reach the roof of Indochina with this challenging but rewarding 2-day trekking adventure.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional mountain guide</li>
          <li>Camping equipment (tent, sleeping bag)</li>
          <li>All meals (2 lunches, 1 dinner, 1 breakfast)</li>
          <li>Transportation from Sapa</li>
          <li>Entrance fees and permits</li>
          <li>Safety equipment</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>Day 1:</strong></p>
        <p>7:00 AM - Pick up from Sapa</p>
        <p>8:00 AM - Start trekking from Tram Ton Pass</p>
        <p>12:00 PM - Lunch on the trail</p>
        <p>4:00 PM - Arrive at campsite (2,800m)</p>
        <p>6:00 PM - Dinner and rest</p>
        
        <p><strong>Day 2:</strong></p>
        <p>5:00 AM - Early breakfast</p>
        <p>5:30 AM - Summit attempt</p>
        <p>7:00 AM - Reach Fansipan peak (3,143m)</p>
        <p>8:00 AM - Descend to campsite</p>
        <p>10:00 AM - Continue descent</p>
        <p>2:00 PM - Return to Sapa</p>
      `,
      vi: `
        <h2>Thử Thách Trekking Fansipan 2N1Đ</h2>
        <p>Thử thách bản thân để chạm tới nóc nhà Đông Dương với cuộc phiêu lưu trekking 2 ngày đầy thử thách nhưng bổ ích này.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên núi chuyên nghiệp</li>
          <li>Thiết bị cắm trại (lều, túi ngủ)</li>
          <li>Tất cả bữa ăn (2 bữa trưa, 1 bữa tối, 1 bữa sáng)</li>
          <li>Phương tiện từ Sapa</li>
          <li>Phí vào cửa và giấy phép</li>
          <li>Thiết bị an toàn</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>Ngày 1:</strong></p>
        <p>7:00 - Đón khách từ Sapa</p>
        <p>8:00 - Bắt đầu trekking từ Đèo Trạm Tôn</p>
        <p>12:00 - Bữa trưa trên đường mòn</p>
        <p>16:00 - Đến điểm cắm trại (2,800m)</p>
        <p>18:00 - Bữa tối và nghỉ ngơi</p>
        
        <p><strong>Ngày 2:</strong></p>
        <p>5:00 - Bữa sáng sớm</p>
        <p>5:30 - Thử chinh phục đỉnh</p>
        <p>7:00 - Đến đỉnh Fansipan (3,143m)</p>
        <p>8:00 - Xuống điểm cắm trại</p>
        <p>10:00 - Tiếp tục xuống</p>
        <p>14:00 - Trở về Sapa</p>
      `
    },
    shortDescription: {
      en: "Conquer the highest peak in Indochina with our 2-day Fansipan trekking adventure including overnight camping.",
      vi: "Chinh phục đỉnh cao nhất Đông Dương với cuộc phiêu lưu trekking Fansipan 2 ngày bao gồm cắm trại qua đêm."
    },
    region: "Northern Vietnam",
    location: {
      en: "Sapa, Lao Cai",
      vi: "Sapa, Lào Cai"
    },
    duration: {
      days: 2,
      hours: 0
    },
    pricing: {
      adult: 118,
      child: 80,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Sapa Fansipan Trekking",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "challenging",
    maxGroupSize: 8,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["sapa", "fansipan", "trekking", "camping", "mountain"],
    highlights: [
      { en: "Fansipan peak (3,143m)", vi: "Đỉnh Fansipan (3,143m)" },
      { en: "Overnight camping", vi: "Cắm trại qua đêm" },
      { en: "Sunrise views", vi: "Tầm nhìn bình minh" },
      { en: "Mountain challenge", vi: "Thử thách núi" }
    ]
  },
  {
    title: {
      en: "4-Hour Day Tour in Sapa",
      vi: "Tour Ngày 4 Giờ ở Sapa"
    },
    slug: "sapa-4-hour-day-tour",
    description: {
      en: "Perfect for those with limited time, this 4-hour Sapa tour covers the essential highlights including Cat Cat Village and Silver Waterfall.",
      vi: "Hoàn hảo cho những ai có thời gian hạn chế, tour Sapa 4 giờ này bao gồm những điểm nổi bật thiết yếu như Làng Cát Cát và Thác Bạc."
    },
    content: {
      en: `
        <h2>Sapa 4-Hour Essential Tour</h2>
        <p>Make the most of your time in Sapa with this efficient 4-hour tour covering the must-see attractions.</p>
        
        <h3>What's Included:</h3>
        <ul>
          <li>Professional English-speaking guide</li>
          <li>Air-conditioned vehicle</li>
          <li>Entrance fees</li>
          <li>Water and snacks</li>
          <li>Hotel pickup and drop-off</li>
        </ul>
        
        <h3>Itinerary:</h3>
        <p><strong>8:00 AM:</strong> Pick up from hotel</p>
        <p><strong>8:30 AM:</strong> Visit Cat Cat Village</p>
        <p><strong>10:30 AM:</strong> Explore Silver Waterfall</p>
        <p><strong>11:30 AM:</strong> Visit Love Waterfall</p>
        <p><strong>12:00 PM:</strong> Return to hotel</p>
      `,
      vi: `
        <h2>Tour Thiết Yếu Sapa 4 Giờ</h2>
        <p>Tận dụng tối đa thời gian ở Sapa với tour 4 giờ hiệu quả này bao gồm các điểm tham quan không thể bỏ qua.</p>
        
        <h3>Bao gồm:</h3>
        <ul>
          <li>Hướng dẫn viên chuyên nghiệp nói tiếng Anh</li>
          <li>Xe có điều hòa</li>
          <li>Phí vào cửa</li>
          <li>Nước và đồ ăn nhẹ</li>
          <li>Đón và trả khách tại khách sạn</li>
        </ul>
        
        <h3>Lịch trình:</h3>
        <p><strong>8:00:</strong> Đón khách tại khách sạn</p>
        <p><strong>8:30:</strong> Tham quan Làng Cát Cát</p>
        <p><strong>10:30:</strong> Khám phá Thác Bạc</p>
        <p><strong>11:30:</strong> Tham quan Thác Tình Yêu</p>
        <p><strong>12:00:</strong> Trở về khách sạn</p>
      `
    },
    shortDescription: {
      en: "Perfect for those with limited time, this 4-hour Sapa tour covers the essential highlights including Cat Cat Village and Silver Waterfall.",
      vi: "Hoàn hảo cho những ai có thời gian hạn chế, tour Sapa 4 giờ này bao gồm những điểm nổi bật thiết yếu như Làng Cát Cát và Thác Bạc."
    },
    region: "Northern Vietnam",
    location: {
      en: "Sapa, Lao Cai",
      vi: "Sapa, Lào Cai"
    },
    duration: {
      days: 1,
      hours: 4
    },
    pricing: {
      adult: 78,
      child: 55,
      perTrip: null
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
        alt: "Sapa 4 Hour Day Tour",
        isPrimary: true
      }
    ],
    tourType: "Sharing Tour",
    difficulty: "easy",
    maxGroupSize: 16,
    minGroupSize: 4,
    isActive: true,
    isFeatured: true,
    tags: ["sapa", "short-tour", "cat-cat-village", "waterfalls", "essential"],
    highlights: [
      { en: "Cat Cat Village", vi: "Làng Cát Cát" },
      { en: "Silver Waterfall", vi: "Thác Bạc" },
      { en: "Love Waterfall", vi: "Thác Tình Yêu" },
      { en: "Efficient itinerary", vi: "Lịch trình hiệu quả" }
    ]
  }
];

// Function to find category by name
const findCategoryByName = async (name) => {
  try {
    const category = await TourCategory.findOne({
      $or: [
        { 'name.en': { $regex: name, $options: 'i' } },
        { 'name.vi': { $regex: name, $options: 'i' } }
      ]
    });
    return category;
  } catch (error) {
    console.error('Error finding category:', error);
    return null;
  }
};

// Function to create tours
const createTours = async () => {
  try {
    await connectDB();

    // Find categories
    const catBaCategory = await findCategoryByName('Cat Ba');
    const ninhBinhCategory = await findCategoryByName('Ninh Binh');
    const sapaCategory = await findCategoryByName('Sapa');

    console.log('Available categories:');
    const allCategories = await TourCategory.find({});
    allCategories.forEach(cat => {
      console.log(`- ${cat.name.en} (${cat.name.vi})`);
    });

    if (!catBaCategory) {
      console.error('Cat Ba category not found');
      return;
    }

    if (!ninhBinhCategory) {
      console.error('Ninh Binh category not found');
      return;
    }

    if (!sapaCategory) {
      console.error('Sapa category not found');
      return;
    }

    console.log('Found categories:');
    console.log('- Cat Ba:', catBaCategory.name.en);
    console.log('- Ninh Binh:', ninhBinhCategory.name.en);
    console.log('- Sapa:', sapaCategory.name.en);

    // Create tours
    for (let i = 0; i < toursData.length; i++) {
      const tourData = toursData[i];
      
      // Assign category based on tour type
      if (i < 2) {
        // First 2 tours are Cat Ba tours
        tourData.category = catBaCategory._id;
      } else if (i < 7) {
        // Next 5 tours are Ninh Binh tours
        tourData.category = ninhBinhCategory._id;
      } else {
        // Remaining tours are Sapa tours
        tourData.category = sapaCategory._id;
      }

      // Check if tour already exists
      const existingTour = await Tour.findOne({ slug: tourData.slug });
      if (existingTour) {
        console.log(`Tour "${tourData.title.en}" already exists, skipping...`);
        continue;
      }

      // Create new tour
      const tour = new Tour(tourData);
      await tour.save();
      console.log(`✅ Created tour: ${tourData.title.en}`);
    }

    console.log('\n🎉 All tours created successfully!');
    console.log(`📊 Created ${toursData.length} tours:`);
    console.log(`   - 2 Cat Ba tours`);
    console.log(`   - 5 Ninh Binh tours`);
    console.log(`   - 4 Sapa tours`);

  } catch (error) {
    console.error('Error creating tours:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
createTours();
