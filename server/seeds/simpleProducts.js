const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-travel', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const vietnamToursProducts = [
  {
    title: {
      en: 'Hanoi City Discovery Tour',
      vi: 'Tour Khám Phá Hà Nội'
    },
    slug: 'hanoi-city-discovery-tour',
    description: {
      en: 'Explore the historic heart of Vietnam with visits to Hoan Kiem Lake, Temple of Literature, and Old Quarter',
      vi: 'Khám phá trung tâm lịch sử của Việt Nam với thăm Hồ Hoàn Kiếm, Văn Miếu và Phố Cổ'
    },
    category: 'hanoi',
    pricing: {
      adult: 45,
      child: 25,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Hoan Kiem Lake and Ngoc Son Temple', vi: 'Hồ Hoàn Kiếm và Đền Ngọc Sơn' },
      { en: 'Temple of Literature', vi: 'Văn Miếu Quốc Tử Giám' },
      { en: 'Old Quarter walking tour', vi: 'Tham quan Phố Cổ' }
    ],
    included: [
      { en: 'Professional English-speaking guide', vi: 'Hướng dẫn viên nói tiếng Anh chuyên nghiệp' },
      { en: 'All entrance fees', vi: 'Tất cả phí vào cửa' },
      { en: 'Lunch at local restaurant', vi: 'Bữa trưa tại nhà hàng địa phương' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for guide and driver', vi: 'Tiền boa cho hướng dẫn viên và tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Hanoi Old Quarter', vi: 'Phố Cổ Hà Nội' }
      }
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    title: {
      en: 'Ha Long Bay Cruise Adventure',
      vi: 'Du Thuyền Vịnh Hạ Long'
    },
    slug: 'ha-long-bay-cruise-adventure',
    description: {
      en: 'Experience the stunning beauty of Ha Long Bay with an overnight cruise on a traditional junk boat',
      vi: 'Trải nghiệm vẻ đẹp tuyệt vời của Vịnh Hạ Long với chuyến du thuyền qua đêm trên thuyền gỗ truyền thống'
    },
    category: 'ha-long-bay',
    pricing: {
      adult: 120,
      child: 80,
      currency: 'USD'
    },
    duration: {
      days: 2,
      nights: 1
    },
    highlights: [
      { en: 'Overnight cruise on traditional junk boat', vi: 'Du thuyền qua đêm trên thuyền gỗ truyền thống' },
      { en: 'Kayaking in hidden lagoons', vi: 'Chèo thuyền kayak trong vịnh ẩn' },
      { en: 'Cave exploration', vi: 'Khám phá hang động' }
    ],
    included: [
      { en: 'Overnight cruise accommodation', vi: 'Chỗ ở trên thuyền qua đêm' },
      { en: 'All meals on board', vi: 'Tất cả bữa ăn trên thuyền' },
      { en: 'Kayaking equipment', vi: 'Thiết bị chèo thuyền kayak' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for crew', vi: 'Tiền boa cho thủy thủ đoàn' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Ha Long Bay Cruise', vi: 'Du thuyền Vịnh Hạ Long' }
      }
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    title: {
      en: 'Sapa Trekking Adventure',
      vi: 'Trekking Sa Pa'
    },
    slug: 'sapa-trekking-adventure',
    description: {
      en: 'Trek through the beautiful mountains of Sapa and visit ethnic minority villages',
      vi: 'Trek qua những ngọn núi đẹp của Sa Pa và thăm các làng dân tộc thiểu số'
    },
    category: 'sapa',
    pricing: {
      adult: 85,
      child: 60,
      currency: 'USD'
    },
    duration: {
      days: 3,
      nights: 2
    },
    highlights: [
      { en: 'Trekking through rice terraces', vi: 'Trek qua ruộng bậc thang' },
      { en: 'Visit ethnic minority villages', vi: 'Thăm các làng dân tộc thiểu số' },
      { en: 'Homestay experience', vi: 'Trải nghiệm homestay' }
    ],
    included: [
      { en: 'Professional trekking guide', vi: 'Hướng dẫn viên trekking chuyên nghiệp' },
      { en: 'Homestay accommodation', vi: 'Chỗ ở homestay' },
      { en: 'All meals during trek', vi: 'Tất cả bữa ăn trong quá trình trek' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for guide and porter', vi: 'Tiền boa cho hướng dẫn viên và porter' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Sapa Rice Terraces', vi: 'Ruộng bậc thang Sa Pa' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  },
  {
    title: {
      en: 'Hue Imperial City Tour',
      vi: 'Tour Cố Đô Huế'
    },
    slug: 'hue-imperial-city-tour',
    description: {
      en: 'Discover the ancient imperial capital with visits to the Citadel and royal tombs',
      vi: 'Khám phá cố đô với thăm Đại Nội và các lăng tẩm hoàng gia'
    },
    category: 'hue',
    pricing: {
      adult: 55,
      child: 35,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Imperial Citadel', vi: 'Đại Nội' },
      { en: 'Thien Mu Pagoda', vi: 'Chùa Thiên Mụ' },
      { en: 'Royal tombs', vi: 'Lăng tẩm hoàng gia' }
    ],
    included: [
      { en: 'Professional English-speaking guide', vi: 'Hướng dẫn viên nói tiếng Anh chuyên nghiệp' },
      { en: 'All entrance fees', vi: 'Tất cả phí vào cửa' },
      { en: 'Lunch at royal restaurant', vi: 'Bữa trưa tại nhà hàng hoàng gia' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for guide and driver', vi: 'Tiền boa cho hướng dẫn viên và tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Hue Imperial City', vi: 'Cố Đô Huế' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  },
  {
    title: {
      en: 'Hoi An Ancient Town & Countryside',
      vi: 'Phố Cổ Hội An & Nông Thôn'
    },
    slug: 'hoi-an-ancient-town-countryside',
    description: {
      en: 'Explore the charming ancient town and experience rural life in the countryside',
      vi: 'Khám phá phố cổ quyến rũ và trải nghiệm cuộc sống nông thôn'
    },
    category: 'hoi-an',
    pricing: {
      adult: 65,
      child: 40,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Ancient town walking tour', vi: 'Tham quan phố cổ' },
      { en: 'Japanese Covered Bridge', vi: 'Chùa Cầu' },
      { en: 'Countryside cycling', vi: 'Đạp xe nông thôn' }
    ],
    included: [
      { en: 'Professional English-speaking guide', vi: 'Hướng dẫn viên nói tiếng Anh chuyên nghiệp' },
      { en: 'Bicycle rental', vi: 'Thuê xe đạp' },
      { en: 'Cooking class', vi: 'Lớp học nấu ăn' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for guide', vi: 'Tiền boa cho hướng dẫn viên' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Hoi An Ancient Town', vi: 'Phố Cổ Hội An' }
      }
    ],
    isActive: true,
    isFeatured: true,
    sortOrder: 1
  },
  {
    title: {
      en: 'Ho Chi Minh City Discovery',
      vi: 'Khám Phá TP. Hồ Chí Minh'
    },
    slug: 'ho-chi-minh-city-discovery',
    description: {
      en: 'Discover the vibrant culture and history of Vietnam\'s largest city',
      vi: 'Khám phá văn hóa và lịch sử sôi động của thành phố lớn nhất Việt Nam'
    },
    category: 'ho-chi-minh-city',
    pricing: {
      adult: 50,
      child: 30,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Cu Chi Tunnels', vi: 'Địa đạo Củ Chi' },
      { en: 'War Remnants Museum', vi: 'Bảo tàng Chứng tích Chiến tranh' },
      { en: 'Notre Dame Cathedral', vi: 'Nhà thờ Đức Bà' }
    ],
    included: [
      { en: 'Professional English-speaking guide', vi: 'Hướng dẫn viên nói tiếng Anh chuyên nghiệp' },
      { en: 'All entrance fees', vi: 'Tất cả phí vào cửa' },
      { en: 'Lunch at local restaurant', vi: 'Bữa trưa tại nhà hàng địa phương' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for guide and driver', vi: 'Tiền boa cho hướng dẫn viên và tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Ho Chi Minh City', vi: 'TP. Hồ Chí Minh' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  },
  {
    title: {
      en: 'Mekong Delta River Life',
      vi: 'Cuộc Sống Sông Nước ĐBSCL'
    },
    slug: 'mekong-delta-river-life',
    description: {
      en: 'Experience the unique river life and floating markets of the Mekong Delta',
      vi: 'Trải nghiệm cuộc sống sông nước độc đáo và chợ nổi của đồng bằng sông Cửu Long'
    },
    category: 'mekong-delta',
    pricing: {
      adult: 75,
      child: 50,
      currency: 'USD'
    },
    duration: {
      days: 2,
      nights: 1
    },
    highlights: [
      { en: 'Floating market visit', vi: 'Thăm chợ nổi' },
      { en: 'River boat cruise', vi: 'Du thuyền sông' },
      { en: 'Local village homestay', vi: 'Homestay làng địa phương' }
    ],
    included: [
      { en: 'Professional English-speaking guide', vi: 'Hướng dẫn viên nói tiếng Anh chuyên nghiệp' },
      { en: 'Homestay accommodation', vi: 'Chỗ ở homestay' },
      { en: 'All meals', vi: 'Tất cả bữa ăn' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for guide and boat operators', vi: 'Tiền boa cho hướng dẫn viên và người lái thuyền' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Mekong Delta', vi: 'Đồng Bằng Sông Cửu Long' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  }
];

const transferServicesProducts = [
  {
    title: {
      en: 'Sapa - Hanoi or Hanoi - Sapa (01-way)',
      vi: 'Sapa - Hà Nội hoặc Hà Nội - Sapa (01 chiều)'
    },
    slug: 'sapa-hanoi-transfer',
    description: {
      en: 'Comfortable transfer service between Sapa and Hanoi with professional drivers',
      vi: 'Dịch vụ đưa đón thoải mái giữa Sapa và Hà Nội với tài xế chuyên nghiệp'
    },
    category: 'luxury-limo',
    pricing: {
      adult: 182,
      child: 91,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Meet and greet service', vi: 'Dịch vụ đón tiếp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' }
    ],
    included: [
      { en: 'Airport pickup/drop-off', vi: 'Đưa đón sân bay' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Airport Transfer', vi: 'Đưa đón sân bay' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  },
  {
    title: {
      en: 'Noi Bai - Old quarter',
      vi: 'Nội Bài - Phố Cổ'
    },
    slug: 'noi-bai-old-quarter-transfer',
    description: {
      en: 'Direct transfer from Noi Bai Airport to Hanoi Old Quarter',
      vi: 'Đưa đón trực tiếp từ Sân bay Nội Bài đến Phố Cổ Hà Nội'
    },
    category: 'private-car',
    pricing: {
      adult: 16,
      child: 8,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Meet and greet service', vi: 'Dịch vụ đón tiếp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' }
    ],
    included: [
      { en: 'Airport pickup/drop-off', vi: 'Đưa đón sân bay' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Airport Transfer', vi: 'Đưa đón sân bay' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 2
  },
  {
    title: {
      en: 'Airport - City Center',
      vi: 'Sân bay - Trung tâm thành phố'
    },
    slug: 'airport-city-center-transfer',
    description: {
      en: 'Reliable transfer service from airport to city center',
      vi: 'Dịch vụ đưa đón đáng tin cậy từ sân bay đến trung tâm thành phố'
    },
    category: 'shuttle-bus',
    pricing: {
      adult: 39,
      child: 20,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Regular shuttle service', vi: 'Dịch vụ xe đưa đón thường xuyên' },
      { en: 'Air-conditioned bus', vi: 'Xe buýt có điều hòa' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' }
    ],
    included: [
      { en: 'Airport pickup/drop-off', vi: 'Đưa đón sân bay' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Airport Transfer', vi: 'Đưa đón sân bay' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 3
  },
  {
    title: {
      en: 'Airport - City Center',
      vi: 'Sân bay - Trung tâm thành phố'
    },
    slug: 'airport-city-center-private-transfer',
    description: {
      en: 'Private transfer service from airport to city center',
      vi: 'Dịch vụ đưa đón riêng từ sân bay đến trung tâm thành phố'
    },
    category: 'private-car',
    pricing: {
      adult: 20,
      child: 10,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Private car service', vi: 'Dịch vụ xe riêng' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' }
    ],
    included: [
      { en: 'Airport pickup/drop-off', vi: 'Đưa đón sân bay' },
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Airport Transfer', vi: 'Đưa đón sân bay' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 4
  },
  {
    title: {
      en: 'Airport - City Center',
      vi: 'Sân bay - Trung tâm thành phố'
    },
    slug: 'airport-city-center-limo-transfer',
    description: {
      en: 'Luxury transfer service from airport to city center',
      vi: 'Dịch vụ đưa đón cao cấp từ sân bay đến trung tâm thành phố'
    },
    category: 'private-limo',
    pricing: {
      adult: 25,
      child: 12,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Luxury limousine service', vi: 'Dịch vụ limousine cao cấp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Professional chauffeur', vi: 'Tài xế chuyên nghiệp' }
    ],
    included: [
      { en: 'Airport pickup/drop-off', vi: 'Đưa đón sân bay' },
      { en: 'Professional chauffeur', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Luxury vehicle', vi: 'Xe cao cấp' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Airport Transfer', vi: 'Đưa đón sân bay' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 5
  },
  {
    title: {
      en: 'Noi Bai - Old quarter',
      vi: 'Nội Bài - Phố Cổ'
    },
    slug: 'noi-bai-old-quarter-limo-transfer',
    description: {
      en: 'Luxury transfer from Noi Bai Airport to Hanoi Old Quarter',
      vi: 'Đưa đón cao cấp từ Sân bay Nội Bài đến Phố Cổ Hà Nội'
    },
    category: 'luxury-limo',
    pricing: {
      adult: 65,
      child: 32,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Luxury limousine service', vi: 'Dịch vụ limousine cao cấp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Professional chauffeur', vi: 'Tài xế chuyên nghiệp' }
    ],
    included: [
      { en: 'Airport pickup/drop-off', vi: 'Đưa đón sân bay' },
      { en: 'Professional chauffeur', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Luxury vehicle', vi: 'Xe cao cấp' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Airport Transfer', vi: 'Đưa đón sân bay' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 6
  },
  {
    title: {
      en: 'Hanoi City Transfer Service',
      vi: 'Dịch Vụ Đưa Đón Hà Nội'
    },
    slug: 'hanoi-city-transfer-service',
    description: {
      en: 'Professional city transfer service in Hanoi for business and leisure travelers',
      vi: 'Dịch vụ đưa đón trong thành phố Hà Nội chuyên nghiệp cho khách du lịch công vụ và giải trí'
    },
    category: 'private-car',
    pricing: {
      adult: 15,
      child: 10,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Flexible scheduling', vi: 'Lịch trình linh hoạt' }
    ],
    included: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Hotel pickup/drop-off', vi: 'Đưa đón khách sạn' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'City Transfer', vi: 'Đưa đón trong thành phố' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  },
  {
    title: {
      en: 'Ho Chi Minh City Transfer Service',
      vi: 'Dịch Vụ Đưa Đón TP. Hồ Chí Minh'
    },
    slug: 'ho-chi-minh-city-transfer-service',
    description: {
      en: 'Reliable city transfer service in Ho Chi Minh City for all your transportation needs',
      vi: 'Dịch vụ đưa đón trong thành phố Hồ Chí Minh đáng tin cậy cho mọi nhu cầu di chuyển'
    },
    category: 'private-car',
    pricing: {
      adult: 12,
      child: 8,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Flexible scheduling', vi: 'Lịch trình linh hoạt' }
    ],
    included: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Hotel pickup/drop-off', vi: 'Đưa đón khách sạn' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'City Transfer', vi: 'Đưa đón trong thành phố' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 2
  },
  {
    title: {
      en: 'Hanoi to Ha Long Bay Transfer',
      vi: 'Đưa Đón Hà Nội - Hạ Long'
    },
    slug: 'hanoi-to-ha-long-bay-transfer',
    description: {
      en: 'Comfortable transfer service from Hanoi to Ha Long Bay for your cruise adventure',
      vi: 'Dịch vụ đưa đón thoải mái từ Hà Nội đến Hạ Long cho chuyến du thuyền của bạn'
    },
    category: 'shuttle-bus',
    pricing: {
      adult: 35,
      child: 25,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Scenic route', vi: 'Tuyến đường đẹp' }
    ],
    included: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Hotel pickup/drop-off', vi: 'Đưa đón khách sạn' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Inter-city Transfer', vi: 'Đưa đón liên tỉnh' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 1
  },
  {
    title: {
      en: 'Ho Chi Minh to Mekong Delta Transfer',
      vi: 'Đưa Đón TP.HCM - ĐBSCL'
    },
    slug: 'ho-chi-minh-to-mekong-delta-transfer',
    description: {
      en: 'Convenient transfer service from Ho Chi Minh City to Mekong Delta destinations',
      vi: 'Dịch vụ đưa đón thuận tiện từ TP. Hồ Chí Minh đến các điểm đến ĐBSCL'
    },
    category: 'shuttle-bus',
    pricing: {
      adult: 30,
      child: 20,
      currency: 'USD'
    },
    duration: {
      days: 1,
      nights: 0
    },
    highlights: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Scenic countryside route', vi: 'Tuyến đường nông thôn đẹp' }
    ],
    included: [
      { en: 'Professional driver', vi: 'Tài xế chuyên nghiệp' },
      { en: 'Air-conditioned vehicle', vi: 'Xe có điều hòa' },
      { en: 'Hotel pickup/drop-off', vi: 'Đưa đón khách sạn' }
    ],
    excluded: [
      { en: 'Personal expenses', vi: 'Chi phí cá nhân' },
      { en: 'Tips for driver', vi: 'Tiền boa cho tài xế' }
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        alt: { en: 'Inter-city Transfer', vi: 'Đưa đón liên tỉnh' }
      }
    ],
    isActive: true,
    isFeatured: false,
    sortOrder: 2
  }
];

const seedSimpleProducts = async () => {
  try {
    console.log('🌱 Seeding simple products...');

    // Get all categories to map slugs to IDs
    const categories = await Category.find({});
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat._id;
    });

    // Clear existing products
    await Product.deleteMany({});

    // Create Vietnam Tours products
    for (const productData of vietnamToursProducts) {
      const categoryId = categoryMap[productData.category];
      if (!categoryId) {
        console.log(`⚠️ Category not found for slug: ${productData.category}`);
        continue;
      }

      const product = new Product({
        ...productData,
        category: categoryId
      });
      await product.save();
      console.log(`✅ Created Vietnam Tours product: ${product.title.en}`);
    }

    // Create Transfer Services products
    for (const productData of transferServicesProducts) {
      const categoryId = categoryMap[productData.category];
      if (!categoryId) {
        console.log(`⚠️ Category not found for slug: ${productData.category}`);
        continue;
      }

      const product = new Product({
        ...productData,
        category: categoryId
      });
      await product.save();
      console.log(`✅ Created Transfer Services product: ${product.title.en}`);
    }

    console.log('🎉 Simple products seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding simple products:', error);
  }
};

module.exports = seedSimpleProducts;

// Run the seed function if this file is executed directly
if (require.main === module) {
  seedSimpleProducts()
    .then(() => {
      console.log('Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed failed:', error);
      process.exit(1);
    });
}
