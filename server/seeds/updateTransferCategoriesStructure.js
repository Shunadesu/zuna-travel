const mongoose = require('mongoose');
const TransferCategory = require('../models/TransferCategory');

// New organized transfer categories
const newTransferCategories = [
  // Private Transfers
  {
    name: {
      en: "Airport Transfer",
      vi: "Chuyển đổi sân bay"
    },
    slug: "airport-transfer",
    description: {
      en: "Professional airport transfer services with comfortable vehicles and experienced drivers. Available 24/7 for all major airports in Vietnam.",
      vi: "Dịch vụ chuyển đổi sân bay chuyên nghiệp với xe thoải mái và tài xế có kinh nghiệm. Có sẵn 24/7 cho tất cả các sân bay lớn tại Việt Nam."
    },
    shortDescription: {
      en: "24/7 airport transfer service with professional drivers",
      vi: "Dịch vụ chuyển đổi sân bay 24/7 với tài xế chuyên nghiệp"
    },
    region: "all",
    serviceType: "private",
    vehicleType: "car",
    capacity: { min: 1, max: 4, default: 2 },
    route: {
      from: { en: "Airport", vi: "Sân bay" },
      to: { en: "City Center", vi: "Trung tâm thành phố" },
      distance: 30,
      duration: 45
    },
    pricing: {
      basePrice: 25,
      currency: "USD",
      pricePerKm: 0.8,
      pricePerHour: 15
    },
    features: [
      { en: "24/7 availability", vi: "Có sẵn 24/7" },
      { en: "Flight tracking", vi: "Theo dõi chuyến bay" },
      { en: "Meet & greet", vi: "Đón và chào hỏi" },
      { en: "Luggage assistance", vi: "Hỗ trợ hành lý" }
    ],
    amenities: [
      { en: "Free WiFi", vi: "WiFi miễn phí" },
      { en: "Bottled water", vi: "Nước uống" },
      { en: "Air conditioning", vi: "Điều hòa" }
    ],
    isFeatured: true,
    order: 1
  },
  {
    name: {
      en: "Hanoi to Halong Bay Transfer",
      vi: "Chuyển đổi Hà Nội - Vịnh Hạ Long"
    },
    slug: "hanoi-halong-transfer",
    description: {
      en: "Comfortable private transfer from Hanoi to Halong Bay. Enjoy scenic countryside views and professional service for your journey to one of Vietnam's most beautiful destinations.",
      vi: "Chuyển đổi riêng tư thoải mái từ Hà Nội đến Vịnh Hạ Long. Thưởng thức cảnh quan nông thôn đẹp mắt và dịch vụ chuyên nghiệp cho hành trình đến một trong những điểm đến đẹp nhất của Việt Nam."
    },
    shortDescription: {
      en: "Private transfer to Halong Bay with scenic countryside views",
      vi: "Chuyển đổi riêng tư đến Vịnh Hạ Long với cảnh quan nông thôn đẹp mắt"
    },
    region: "north",
    serviceType: "private",
    vehicleType: "van",
    capacity: { min: 1, max: 16, default: 8 },
    route: {
      from: { en: "Hanoi", vi: "Hà Nội" },
      to: { en: "Halong Bay", vi: "Vịnh Hạ Long" },
      distance: 170,
      duration: 180
    },
    pricing: {
      basePrice: 80,
      currency: "USD",
      pricePerKm: 0.4,
      pricePerHour: 20
    },
    features: [
      { en: "Scenic route", vi: "Tuyến đường đẹp" },
      { en: "Professional driver", vi: "Tài xế chuyên nghiệp" },
      { en: "Hotel pickup", vi: "Đón tại khách sạn" },
      { en: "Flexible timing", vi: "Thời gian linh hoạt" }
    ],
    amenities: [
      { en: "Free WiFi", vi: "WiFi miễn phí" },
      { en: "Bottled water", vi: "Nước uống" },
      { en: "English speaking guide", vi: "Hướng dẫn viên nói tiếng Anh" }
    ],
    isFeatured: true,
    order: 2
  },
  {
    name: {
      en: "Hanoi to Sapa Transfer",
      vi: "Chuyển đổi Hà Nội - Sapa"
    },
    slug: "hanoi-sapa-transfer",
    description: {
      en: "Comfortable private transfer from Hanoi to Sapa. Experience the beautiful mountain scenery and enjoy a relaxing journey to the famous hill station.",
      vi: "Chuyển đổi riêng tư thoải mái từ Hà Nội đến Sapa. Trải nghiệm cảnh quan núi non đẹp mắt và thưởng thức hành trình thư giãn đến trạm nghỉ dưỡng nổi tiếng."
    },
    shortDescription: {
      en: "Private transfer to Sapa with mountain scenery",
      vi: "Chuyển đổi riêng tư đến Sapa với cảnh quan núi non"
    },
    region: "north",
    serviceType: "private",
    vehicleType: "van",
    capacity: { min: 1, max: 16, default: 8 },
    route: {
      from: { en: "Hanoi", vi: "Hà Nội" },
      to: { en: "Sapa", vi: "Sapa" },
      distance: 320,
      duration: 300
    },
    pricing: {
      basePrice: 120,
      currency: "USD",
      pricePerKm: 0.35,
      pricePerHour: 25
    },
    features: [
      { en: "Mountain views", vi: "Cảnh quan núi non" },
      { en: "Comfortable seating", vi: "Ghế ngồi thoải mái" },
      { en: "Rest stops", vi: "Điểm dừng nghỉ" },
      { en: "Hotel pickup", vi: "Đón tại khách sạn" }
    ],
    amenities: [
      { en: "Free WiFi", vi: "WiFi miễn phí" },
      { en: "Bottled water", vi: "Nước uống" },
      { en: "Blankets", vi: "Chăn" }
    ],
    isFeatured: true,
    order: 3
  },

  // Shared Transfers
  {
    name: {
      en: "Halong Bay Shuttle Bus",
      vi: "Xe buýt đưa đón Vịnh Hạ Long"
    },
    slug: "halong-bay-shuttle",
    description: {
      en: "Affordable shared shuttle bus service to Halong Bay. Perfect for budget travelers who want to experience the beauty of Halong Bay without breaking the bank.",
      vi: "Dịch vụ xe buýt đưa đón chung giá rẻ đến Vịnh Hạ Long. Hoàn hảo cho du khách ngân sách muốn trải nghiệm vẻ đẹp của Vịnh Hạ Long mà không tốn kém."
    },
    shortDescription: {
      en: "Budget-friendly shared shuttle to Halong Bay",
      vi: "Xe đưa đón chung giá rẻ đến Vịnh Hạ Long"
    },
    region: "north",
    serviceType: "shared",
    vehicleType: "bus",
    capacity: { min: 20, max: 45, default: 35 },
    route: {
      from: { en: "Hanoi", vi: "Hà Nội" },
      to: { en: "Halong Bay", vi: "Vịnh Hạ Long" },
      distance: 170,
      duration: 180
    },
    pricing: {
      basePrice: 15,
      currency: "USD",
      pricePerKm: 0.08,
      pricePerHour: 5
    },
    features: [
      { en: "Budget-friendly", vi: "Giá rẻ" },
      { en: "Regular departures", vi: "Khởi hành thường xuyên" },
      { en: "Hotel pickup", vi: "Đón tại khách sạn" },
      { en: "Drop-off at pier", vi: "Thả tại bến tàu" }
    ],
    amenities: [
      { en: "Air conditioning", vi: "Điều hòa" },
      { en: "Comfortable seats", vi: "Ghế ngồi thoải mái" }
    ],
    isFeatured: false,
    order: 4
  },
  {
    name: {
      en: "Sapa Sleeping Bus",
      vi: "Xe buýt giường nằm Sapa"
    },
    slug: "sapa-sleeping-bus",
    description: {
      en: "Overnight sleeping bus service to Sapa. Travel comfortably while you sleep and wake up in the beautiful mountain town of Sapa.",
      vi: "Dịch vụ xe buýt giường nằm qua đêm đến Sapa. Di chuyển thoải mái trong khi ngủ và thức dậy ở thị trấn núi đẹp mắt của Sapa."
    },
    shortDescription: {
      en: "Overnight sleeping bus to Sapa",
      vi: "Xe buýt giường nằm qua đêm đến Sapa"
    },
    region: "north",
    serviceType: "shared",
    vehicleType: "bus",
    capacity: { min: 30, max: 40, default: 40 },
    route: {
      from: { en: "Hanoi", vi: "Hà Nội" },
      to: { en: "Sapa", vi: "Sapa" },
      distance: 320,
      duration: 360
    },
    pricing: {
      basePrice: 20,
      currency: "USD",
      pricePerKm: 0.06,
      pricePerHour: 3
    },
    features: [
      { en: "Sleeping berths", vi: "Giường nằm" },
      { en: "Overnight journey", vi: "Hành trình qua đêm" },
      { en: "Arrive fresh", vi: "Đến nơi tươi tỉnh" },
      { en: "Budget option", vi: "Lựa chọn giá rẻ" }
    ],
    amenities: [
      { en: "Blankets", vi: "Chăn" },
      { en: "Pillows", vi: "Gối" },
      { en: "Air conditioning", vi: "Điều hòa" }
    ],
    isFeatured: false,
    order: 5
  },

  // Train Services
  {
    name: {
      en: "Hanoi to Sapa Train",
      vi: "Tàu hỏa Hà Nội - Sapa"
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
    serviceType: "train",
    vehicleType: "train",
    capacity: { min: 1, max: 4, default: 2 },
    route: {
      from: { en: "Hanoi", vi: "Hà Nội" },
      to: { en: "Lao Cai", vi: "Lào Cai" },
      distance: 300,
      duration: 480
    },
    pricing: {
      basePrice: 35,
      currency: "USD",
      pricePerKm: 0.12,
      pricePerHour: 2
    },
    features: [
      { en: "Sleeper cabins", vi: "Khoang ngủ" },
      { en: "Scenic journey", vi: "Hành trình đẹp mắt" },
      { en: "Traditional experience", vi: "Trải nghiệm truyền thống" },
      { en: "Comfortable berths", vi: "Giường nằm thoải mái" }
    ],
    amenities: [
      { en: "Bedding", vi: "Đồ giường" },
      { en: "Reading lights", vi: "Đèn đọc sách" },
      { en: "Window views", vi: "Cửa sổ ngắm cảnh" }
    ],
    isFeatured: true,
    order: 6
  },

  // Special Transfers
  {
    name: {
      en: "Luxury Limousine Service",
      vi: "Dịch vụ Limousine cao cấp"
    },
    slug: "luxury-limousine",
    description: {
      en: "Premium limousine service for special occasions and VIP transfers. Experience luxury and comfort with our high-end vehicles and professional chauffeurs.",
      vi: "Dịch vụ limousine cao cấp cho các dịp đặc biệt và chuyển đổi VIP. Trải nghiệm sang trọng và thoải mái với xe cao cấp và tài xế chuyên nghiệp."
    },
    shortDescription: {
      en: "Premium limousine service for VIP transfers",
      vi: "Dịch vụ limousine cao cấp cho chuyển đổi VIP"
    },
    region: "all",
    serviceType: "special",
    vehicleType: "limousine",
    capacity: { min: 1, max: 8, default: 4 },
    route: {
      from: { en: "Any Location", vi: "Bất kỳ địa điểm nào" },
      to: { en: "Any Destination", vi: "Bất kỳ điểm đến nào" },
      distance: 0,
      duration: 0
    },
    pricing: {
      basePrice: 150,
      currency: "USD",
      pricePerKm: 1.5,
      pricePerHour: 50
    },
    features: [
      { en: "Luxury vehicle", vi: "Xe sang trọng" },
      { en: "Professional chauffeur", vi: "Tài xế chuyên nghiệp" },
      { en: "VIP service", vi: "Dịch vụ VIP" },
      { en: "Flexible routes", vi: "Tuyến đường linh hoạt" }
    ],
    amenities: [
      { en: "Champagne service", vi: "Dịch vụ champagne" },
      { en: "Premium snacks", vi: "Đồ ăn nhẹ cao cấp" },
      { en: "Entertainment system", vi: "Hệ thống giải trí" },
      { en: "WiFi", vi: "WiFi" }
    ],
    isFeatured: true,
    order: 7
  }
];

async function updateTransferCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://namp280918:zunatravel@cluster0.od0rj5u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Connected to MongoDB');

    // Clear existing transfer categories
    await TransferCategory.deleteMany({});
    console.log('Cleared existing transfer categories');

    // Insert new transfer categories
    const createdCategories = await TransferCategory.insertMany(newTransferCategories);
    console.log(`Created ${createdCategories.length} new transfer categories`);

    // Display summary
    console.log('\n=== Transfer Categories Summary ===');
    const serviceTypes = await TransferCategory.aggregate([
      { $group: { _id: '$serviceType', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    
    serviceTypes.forEach(type => {
      console.log(`${type._id}: ${type.count} categories`);
    });

    console.log('\n=== All Categories ===');
    const allCategories = await TransferCategory.find({}).sort({ order: 1 });
    allCategories.forEach(cat => {
      console.log(`- ${cat.name.en} (${cat.serviceType}/${cat.vehicleType})`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error updating transfer categories:', error);
    process.exit(1);
  }
}

// Run the update
updateTransferCategories();
