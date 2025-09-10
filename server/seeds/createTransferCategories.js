const mongoose = require('mongoose');
const TransferCategory = require('../models/TransferCategory');

// Transfer categories based on the image analysis
const transferCategories = [
  {
    name: {
      en: "Halong Bay Transfer",
      vi: "Chuyển đổi Vịnh Hạ Long"
    },
    slug: "halong-bay-transfer",
    description: {
      en: "Comfortable and reliable transfer services to Halong Bay, one of Vietnam's most famous natural wonders. Experience scenic routes and professional service.",
      vi: "Dịch vụ chuyển đổi thoải mái và đáng tin cậy đến Vịnh Hạ Long, một trong những kỳ quan thiên nhiên nổi tiếng nhất của Việt Nam. Trải nghiệm tuyến đường đẹp và dịch vụ chuyên nghiệp."
    },
    shortDescription: {
      en: "Professional transfer service to Halong Bay with scenic routes",
      vi: "Dịch vụ chuyển đổi chuyên nghiệp đến Vịnh Hạ Long với tuyến đường đẹp"
    },
    region: "north",
    vehicleType: "van",
    features: [
      { en: "Scenic route views", vi: "Tuyến đường đẹp" },
      { en: "Professional driver", vi: "Tài xế chuyên nghiệp" },
      { en: "Air-conditioned vehicle", vi: "Xe có điều hòa" },
      { en: "Hotel pickup", vi: "Đón tại khách sạn" }
    ],
    amenities: [
      { en: "Free WiFi", vi: "WiFi miễn phí" },
      { en: "Bottled water", vi: "Nước uống" },
      { en: "English speaking guide", vi: "Hướng dẫn viên nói tiếng Anh" }
    ],
    isFeatured: true,
    order: 1
  },
  {
    name: {
      en: "Hanoi Sapa Train",
      vi: "Tàu hỏa Hà Nội Sapa"
    },
    slug: "hanoi-sapa-train",
    description: {
      en: "Experience the iconic overnight train journey from Hanoi to Sapa. Comfortable sleeper cabins with beautiful mountain scenery along the way.",
      vi: "Trải nghiệm hành trình tàu hỏa qua đêm nổi tiếng từ Hà Nội đến Sapa. Khoang ngủ thoải mái với cảnh quan núi non đẹp mắt dọc đường."
    },
    shortDescription: {
      en: "Overnight train journey to Sapa with mountain views",
      vi: "Hành trình tàu hỏa qua đêm đến Sapa với cảnh núi non"
    },
    region: "north",
    vehicleType: "bus",
    features: [
      { en: "Sleeper cabins", vi: "Khoang ngủ" },
      { en: "Mountain scenery", vi: "Cảnh núi non" },
      { en: "Overnight journey", vi: "Hành trình qua đêm" },
      { en: "Traditional experience", vi: "Trải nghiệm truyền thống" }
    ],
    amenities: [
      { en: "Bedding provided", vi: "Có chăn gối" },
      { en: "Shared facilities", vi: "Tiện ích chung" },
      { en: "Dining car", vi: "Toa ăn" }
    ],
    isFeatured: true,
    order: 2
  },
  {
    name: {
      en: "Ha Giang Transfer",
      vi: "Chuyển đổi Hà Giang"
    },
    slug: "hagiang-transfer",
    description: {
      en: "Adventure transfer service to Ha Giang, the northernmost province of Vietnam. Experience the famous Ha Giang Loop with stunning mountain passes.",
      vi: "Dịch vụ chuyển đổi phiêu lưu đến Hà Giang, tỉnh cực bắc của Việt Nam. Trải nghiệm vòng lặp Hà Giang nổi tiếng với những đèo núi tuyệt đẹp."
    },
    shortDescription: {
      en: "Adventure transfer to Ha Giang with mountain loop experience",
      vi: "Chuyển đổi phiêu lưu đến Hà Giang với trải nghiệm vòng lặp núi"
    },
    region: "north",
    vehicleType: "car",
    features: [
      { en: "Mountain loop route", vi: "Tuyến vòng lặp núi" },
      { en: "Adventure experience", vi: "Trải nghiệm phiêu lưu" },
      { en: "Scenic mountain passes", vi: "Đèo núi đẹp" },
      { en: "Local culture", vi: "Văn hóa địa phương" }
    ],
    amenities: [
      { en: "Experienced driver", vi: "Tài xế kinh nghiệm" },
      { en: "Safety equipment", vi: "Thiết bị an toàn" },
      { en: "Photo stops", vi: "Điểm dừng chụp ảnh" }
    ],
    isFeatured: true,
    order: 3
  },
  {
    name: {
      en: "Airport Transfer",
      vi: "Chuyển đổi sân bay"
    },
    slug: "airport-transfer",
    description: {
      en: "Reliable and comfortable airport transfer services to and from major airports in Vietnam. Professional drivers and modern vehicles for your convenience.",
      vi: "Dịch vụ chuyển đổi sân bay đáng tin cậy và thoải mái đến và đi từ các sân bay lớn ở Việt Nam. Tài xế chuyên nghiệp và xe hiện đại cho sự tiện lợi của bạn."
    },
    shortDescription: {
      en: "Professional airport transfer service with modern vehicles",
      vi: "Dịch vụ chuyển đổi sân bay chuyên nghiệp với xe hiện đại"
    },
    region: "all",
    vehicleType: "car",
    features: [
      { en: "Flight tracking", vi: "Theo dõi chuyến bay" },
      { en: "Meet and greet", vi: "Đón và chào hỏi" },
      { en: "Luggage assistance", vi: "Hỗ trợ hành lý" },
      { en: "24/7 service", vi: "Dịch vụ 24/7" }
    ],
    amenities: [
      { en: "Free WiFi", vi: "WiFi miễn phí" },
      { en: "Bottled water", vi: "Nước uống" },
      { en: "Child seats available", vi: "Có ghế trẻ em" },
      { en: "English speaking driver", vi: "Tài xế nói tiếng Anh" }
    ],
    isFeatured: true,
    order: 4
  },
  {
    name: {
      en: "Sapa Transfer",
      vi: "Chuyển đổi Sapa"
    },
    slug: "sapa-transfer",
    description: {
      en: "Comfortable transfer service to Sapa, the famous hill station in northern Vietnam. Enjoy the journey through beautiful mountain landscapes.",
      vi: "Dịch vụ chuyển đổi thoải mái đến Sapa, trạm nghỉ dưỡng nổi tiếng ở miền bắc Việt Nam. Thưởng thức hành trình qua cảnh quan núi non đẹp mắt."
    },
    shortDescription: {
      en: "Comfortable transfer to Sapa hill station",
      vi: "Chuyển đổi thoải mái đến trạm nghỉ dưỡng Sapa"
    },
    region: "north",
    vehicleType: "van",
    features: [
      { en: "Mountain route", vi: "Tuyến đường núi" },
      { en: "Hill station destination", vi: "Điểm đến trạm nghỉ dưỡng" },
      { en: "Terraced rice fields", vi: "Ruộng bậc thang" },
      { en: "Ethnic culture", vi: "Văn hóa dân tộc" }
    ],
    amenities: [
      { en: "Comfortable seating", vi: "Ghế ngồi thoải mái" },
      { en: "Mountain views", vi: "Cảnh núi non" },
      { en: "Cultural insights", vi: "Hiểu biết văn hóa" }
    ],
    isFeatured: true,
    order: 5
  },
  {
    name: {
      en: "Ninh Binh Transfer",
      vi: "Chuyển đổi Ninh Bình"
    },
    slug: "ninh-binh-transfer",
    description: {
      en: "Scenic transfer service to Ninh Binh, known as 'Halong Bay on land'. Experience the beautiful karst landscape and ancient temples.",
      vi: "Dịch vụ chuyển đổi đẹp mắt đến Ninh Bình, được mệnh danh là 'Vịnh Hạ Long trên cạn'. Trải nghiệm cảnh quan karst đẹp và các ngôi chùa cổ."
    },
    shortDescription: {
      en: "Scenic transfer to Ninh Binh with karst landscape",
      vi: "Chuyển đổi đẹp mắt đến Ninh Bình với cảnh quan karst"
    },
    region: "north",
    vehicleType: "car",
    features: [
      { en: "Karst landscape", vi: "Cảnh quan karst" },
      { en: "Ancient temples", vi: "Chùa cổ" },
      { en: "Boat tours", vi: "Tour thuyền" },
      { en: "Cultural heritage", vi: "Di sản văn hóa" }
    ],
    amenities: [
      { en: "Cultural guide", vi: "Hướng dẫn văn hóa" },
      { en: "Photo opportunities", vi: "Cơ hội chụp ảnh" },
      { en: "Historical insights", vi: "Hiểu biết lịch sử" }
    ],
    isFeatured: true,
    order: 6
  },
  {
    name: {
      en: "Cat Ba Transfer",
      vi: "Chuyển đổi Cát Bà"
    },
    slug: "cat-ba-transfer",
    description: {
      en: "Transfer service to Cat Ba Island, the largest island in Halong Bay. Enjoy the journey through beautiful coastal roads and ferry crossing.",
      vi: "Dịch vụ chuyển đổi đến đảo Cát Bà, hòn đảo lớn nhất trong Vịnh Hạ Long. Thưởng thức hành trình qua những con đường ven biển đẹp và chuyến phà."
    },
    shortDescription: {
      en: "Transfer to Cat Ba Island with coastal views",
      vi: "Chuyển đổi đến đảo Cát Bà với cảnh biển"
    },
    region: "north",
    vehicleType: "van",
    features: [
      { en: "Island destination", vi: "Điểm đến đảo" },
      { en: "Ferry crossing", vi: "Chuyến phà" },
      { en: "Coastal route", vi: "Tuyến đường ven biển" },
      { en: "National park", vi: "Vườn quốc gia" }
    ],
    amenities: [
      { en: "Ferry tickets included", vi: "Bao gồm vé phà" },
      { en: "Island guide", vi: "Hướng dẫn đảo" },
      { en: "Beach access", vi: "Tiếp cận bãi biển" }
    ],
    isFeatured: true,
    order: 7
  },
  {
    name: {
      en: "All in One Transfers Package",
      vi: "Gói chuyển đổi tất cả trong một"
    },
    slug: "all-in-one-transfers-package",
    description: {
      en: "Comprehensive transfer package covering all major destinations in Vietnam. Save money and enjoy seamless travel between cities and attractions.",
      vi: "Gói chuyển đổi toàn diện bao gồm tất cả các điểm đến chính ở Việt Nam. Tiết kiệm tiền và tận hưởng du lịch liền mạch giữa các thành phố và điểm tham quan."
    },
    shortDescription: {
      en: "Comprehensive transfer package for all destinations",
      vi: "Gói chuyển đổi toàn diện cho tất cả điểm đến"
    },
    region: "all",
    vehicleType: "van",
    features: [
      { en: "Multiple destinations", vi: "Nhiều điểm đến" },
      { en: "Cost savings", vi: "Tiết kiệm chi phí" },
      { en: "Flexible schedule", vi: "Lịch trình linh hoạt" },
      { en: "Priority booking", vi: "Ưu tiên đặt chỗ" }
    ],
    amenities: [
      { en: "Dedicated coordinator", vi: "Điều phối viên chuyên dụng" },
      { en: "24/7 support", vi: "Hỗ trợ 24/7" },
      { en: "Customizable routes", vi: "Tuyến đường tùy chỉnh" },
      { en: "Group discounts", vi: "Giảm giá nhóm" }
    ],
    isFeatured: true,
    order: 8
  }
];

const createTransferCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-travel');
    console.log('Connected to MongoDB');

    // Clear existing transfer categories
    await TransferCategory.deleteMany({});
    console.log('Cleared existing transfer categories');

    // Create new transfer categories
    console.log(`Attempting to create ${transferCategories.length} transfer categories...`);
    
    const createdCategories = await TransferCategory.insertMany(transferCategories);
    console.log(`Created ${createdCategories.length} transfer categories:`);
    
    createdCategories.forEach(category => {
      console.log(`- ${category.name.en} (${category.slug})`);
    });

    console.log('Transfer categories created successfully!');
  } catch (error) {
    console.error('Error creating transfer categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
if (require.main === module) {
  createTransferCategories();
}

module.exports = createTransferCategories;
