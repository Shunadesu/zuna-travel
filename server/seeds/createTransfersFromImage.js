const mongoose = require('mongoose');
const Transfer = require('../models/Transfer');
const TransferCategory = require('../models/TransferCategory');

// Transfers based on the image analysis
const transfers = [
  // Shared Transfers
  {
    title: {
      en: "Hanoi Airport Sapa Bus",
      vi: "Xe buýt Hà Nội Sân bay Sapa"
    },
    slug: "hanoi-airport-sapa-bus",
    description: {
      en: "Comfortable shared bus service from Hanoi Airport to Sapa. Perfect for budget travelers with regular departures and reliable service.",
      vi: "Dịch vụ xe buýt chung thoải mái từ Sân bay Hà Nội đến Sapa. Hoàn hảo cho du khách ngân sách với khởi hành thường xuyên và dịch vụ đáng tin cậy."
    },
    shortDescription: {
      en: "Shared bus from Hanoi Airport to Sapa",
      vi: "Xe buýt chung từ Sân bay Hà Nội đến Sapa"
    },
    from: {
      en: "Hanoi Airport",
      vi: "Sân bay Hà Nội"
    },
    to: {
      en: "Sapa",
      vi: "Sapa"
    },
    pricing: {
      adult: 12,
      child: 8,
      currency: "USD"
    },
    duration: 360, // 6 hours
    vehicleType: "bus",
    seats: 45,
    features: [
      { en: "Air conditioning", vi: "Điều hòa" },
      { en: "Regular departures", vi: "Khởi hành thường xuyên" },
      { en: "Budget-friendly", vi: "Giá rẻ" }
    ],
    amenities: [
      { en: "Comfortable seats", vi: "Ghế ngồi thoải mái" },
      { en: "Free WiFi", vi: "WiFi miễn phí" }
    ],
    included: [
      { en: "Transportation", vi: "Vận chuyển" },
      { en: "Driver", vi: "Tài xế" }
    ],
    excluded: [
      { en: "Meals", vi: "Bữa ăn" },
      { en: "Personal expenses", vi: "Chi phí cá nhân" }
    ],
    isActive: true,
    isFeatured: true,
    region: "north",
    route: "Hanoi-Sapa",
    distance: 320
  },
  {
    title: {
      en: "Hanoi Sapa Sleeping Bus",
      vi: "Xe buýt giường nằm Hà Nội Sapa"
    },
    slug: "hanoi-sapa-sleeping-bus",
    description: {
      en: "Overnight sleeping bus service from Hanoi to Sapa. Travel comfortably while you sleep and wake up refreshed in the beautiful mountain town.",
      vi: "Dịch vụ xe buýt giường nằm qua đêm từ Hà Nội đến Sapa. Di chuyển thoải mái trong khi ngủ và thức dậy tươi tỉnh ở thị trấn núi đẹp mắt."
    },
    shortDescription: {
      en: "Overnight sleeping bus to Sapa",
      vi: "Xe buýt giường nằm qua đêm đến Sapa"
    },
    from: {
      en: "Hanoi",
      vi: "Hà Nội"
    },
    to: {
      en: "Sapa",
      vi: "Sapa"
    },
    pricing: {
      adult: 12,
      child: 8,
      currency: "USD"
    },
    duration: 360,
    vehicleType: "bus",
    seats: 40,
    features: [
      { en: "Sleeping berths", vi: "Giường nằm" },
      { en: "Overnight journey", vi: "Hành trình qua đêm" },
      { en: "Arrive fresh", vi: "Đến nơi tươi tỉnh" }
    ],
    amenities: [
      { en: "Blankets", vi: "Chăn" },
      { en: "Pillows", vi: "Gối" },
      { en: "Air conditioning", vi: "Điều hòa" }
    ],
    included: [
      { en: "Transportation", vi: "Vận chuyển" },
      { en: "Sleeping berth", vi: "Giường nằm" }
    ],
    excluded: [
      { en: "Meals", vi: "Bữa ăn" },
      { en: "Personal expenses", vi: "Chi phí cá nhân" }
    ],
    isActive: true,
    isFeatured: true,
    region: "north",
    route: "Hanoi-Sapa",
    distance: 320
  },
  {
    title: {
      en: "Hanoi Cat Ba Island Bus",
      vi: "Xe buýt Hà Nội Cát Bà"
    },
    slug: "hanoi-cat-ba-bus",
    description: {
      en: "Comfortable bus service from Hanoi to Cat Ba Island. Enjoy scenic views on your way to this beautiful island destination.",
      vi: "Dịch vụ xe buýt thoải mái từ Hà Nội đến Đảo Cát Bà. Thưởng thức cảnh quan đẹp mắt trên đường đến điểm đến đảo xinh đẹp này."
    },
    shortDescription: {
      en: "Bus service to Cat Ba Island",
      vi: "Dịch vụ xe buýt đến Đảo Cát Bà"
    },
    from: {
      en: "Hanoi",
      vi: "Hà Nội"
    },
    to: {
      en: "Cat Ba Island",
      vi: "Đảo Cát Bà"
    },
    pricing: {
      adult: 16,
      child: 12,
      currency: "USD"
    },
    duration: 180,
    vehicleType: "bus",
    seats: 35,
    features: [
      { en: "Scenic route", vi: "Tuyến đường đẹp" },
      { en: "Regular departures", vi: "Khởi hành thường xuyên" },
      { en: "Island transfer", vi: "Chuyển đổi đảo" }
    ],
    amenities: [
      { en: "Air conditioning", vi: "Điều hòa" },
      { en: "Comfortable seats", vi: "Ghế ngồi thoải mái" }
    ],
    included: [
      { en: "Transportation", vi: "Vận chuyển" },
      { en: "Ferry ticket", vi: "Vé phà" }
    ],
    excluded: [
      { en: "Meals", vi: "Bữa ăn" },
      { en: "Personal expenses", vi: "Chi phí cá nhân" }
    ],
    isActive: true,
    isFeatured: false,
    region: "north",
    route: "Hanoi-CatBa",
    distance: 120
  },

  // Private Transfers
  {
    title: {
      en: "Hanoi Airport Transfer - Old Quarter",
      vi: "Chuyển đổi Sân bay Hà Nội - Phố Cổ"
    },
    slug: "hanoi-airport-old-quarter",
    description: {
      en: "Convenient private transfer from Hanoi Airport to Old Quarter. Professional driver, comfortable vehicle, and door-to-door service.",
      vi: "Chuyển đổi riêng tư thuận tiện từ Sân bay Hà Nội đến Phố Cổ. Tài xế chuyên nghiệp, xe thoải mái và dịch vụ tận nơi."
    },
    shortDescription: {
      en: "Private airport transfer to Old Quarter",
      vi: "Chuyển đổi sân bay riêng tư đến Phố Cổ"
    },
    from: {
      en: "Hanoi Airport",
      vi: "Sân bay Hà Nội"
    },
    to: {
      en: "Old Quarter",
      vi: "Phố Cổ"
    },
    pricing: {
      adult: 16,
      child: 12,
      currency: "USD"
    },
    duration: 45,
    vehicleType: "car",
    seats: 4,
    features: [
      { en: "Door-to-door service", vi: "Dịch vụ tận nơi" },
      { en: "Professional driver", vi: "Tài xế chuyên nghiệp" },
      { en: "Flight tracking", vi: "Theo dõi chuyến bay" }
    ],
    amenities: [
      { en: "Free WiFi", vi: "WiFi miễn phí" },
      { en: "Bottled water", vi: "Nước uống" },
      { en: "Air conditioning", vi: "Điều hòa" }
    ],
    included: [
      { en: "Transportation", vi: "Vận chuyển" },
      { en: "Driver", vi: "Tài xế" },
      { en: "Luggage assistance", vi: "Hỗ trợ hành lý" }
    ],
    excluded: [
      { en: "Meals", vi: "Bữa ăn" },
      { en: "Personal expenses", vi: "Chi phí cá nhân" }
    ],
    isActive: true,
    isFeatured: true,
    region: "north",
    route: "Airport-OldQuarter",
    distance: 30
  },
  {
    title: {
      en: "Hanoi to Sapa Private Car",
      vi: "Xe riêng Hà Nội Sapa"
    },
    slug: "hanoi-sapa-private-car",
    description: {
      en: "Luxurious private car transfer from Hanoi to Sapa. Comfortable journey with professional chauffeur and premium amenities.",
      vi: "Chuyển đổi xe riêng sang trọng từ Hà Nội đến Sapa. Hành trình thoải mái với tài xế chuyên nghiệp và tiện nghi cao cấp."
    },
    shortDescription: {
      en: "Private car transfer to Sapa",
      vi: "Chuyển đổi xe riêng đến Sapa"
    },
    from: {
      en: "Hanoi",
      vi: "Hà Nội"
    },
    to: {
      en: "Sapa",
      vi: "Sapa"
    },
    pricing: {
      adult: 136,
      child: 100,
      currency: "USD"
    },
    duration: 300,
    vehicleType: "limousine",
    seats: 4,
    features: [
      { en: "Luxury vehicle", vi: "Xe sang trọng" },
      { en: "Professional chauffeur", vi: "Tài xế chuyên nghiệp" },
      { en: "Flexible timing", vi: "Thời gian linh hoạt" }
    ],
    amenities: [
      { en: "Premium snacks", vi: "Đồ ăn nhẹ cao cấp" },
      { en: "Entertainment system", vi: "Hệ thống giải trí" },
      { en: "WiFi", vi: "WiFi" },
      { en: "USB charging", vi: "Sạc USB" }
    ],
    included: [
      { en: "Transportation", vi: "Vận chuyển" },
      { en: "Professional driver", vi: "Tài xế chuyên nghiệp" },
      { en: "All amenities", vi: "Tất cả tiện nghi" }
    ],
    excluded: [
      { en: "Meals", vi: "Bữa ăn" },
      { en: "Personal expenses", vi: "Chi phí cá nhân" }
    ],
    isActive: true,
    isFeatured: true,
    region: "north",
    route: "Hanoi-Sapa",
    distance: 320
  },
  {
    title: {
      en: "Hanoi Halong Bay Luxury Limousine",
      vi: "Limousine cao cấp Hà Nội Vịnh Hạ Long"
    },
    slug: "hanoi-halong-luxury-limousine",
    description: {
      en: "Premium limousine service to Halong Bay with English speaking driver, LCD LED, soft drinks, WiFi, travel insurance, USB charging, and snacks.",
      vi: "Dịch vụ limousine cao cấp đến Vịnh Hạ Long với tài xế nói tiếng Anh, LCD LED, nước ngọt, WiFi, bảo hiểm du lịch, sạc USB và đồ ăn nhẹ."
    },
    shortDescription: {
      en: "Luxury limousine to Halong Bay",
      vi: "Limousine cao cấp đến Vịnh Hạ Long"
    },
    from: {
      en: "Hanoi",
      vi: "Hà Nội"
    },
    to: {
      en: "Halong Bay",
      vi: "Vịnh Hạ Long"
    },
    pricing: {
      adult: 16,
      child: 12,
      currency: "USD"
    },
    duration: 180,
    vehicleType: "limousine",
    seats: 8,
    features: [
      { en: "English speaking driver", vi: "Tài xế nói tiếng Anh" },
      { en: "LCD LED entertainment", vi: "Giải trí LCD LED" },
      { en: "Travel insurance", vi: "Bảo hiểm du lịch" }
    ],
    amenities: [
      { en: "Soft drinks", vi: "Nước ngọt" },
      { en: "WiFi", vi: "WiFi" },
      { en: "USB charging", vi: "Sạc USB" },
      { en: "Snacks", vi: "Đồ ăn nhẹ" }
    ],
    included: [
      { en: "Transportation", vi: "Vận chuyển" },
      { en: "All amenities", vi: "Tất cả tiện nghi" },
      { en: "Travel insurance", vi: "Bảo hiểm du lịch" }
    ],
    excluded: [
      { en: "Meals", vi: "Bữa ăn" },
      { en: "Personal expenses", vi: "Chi phí cá nhân" }
    ],
    isActive: true,
    isFeatured: true,
    region: "north",
    route: "Hanoi-Halong",
    distance: 170
  }
];

async function createTransfers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/zuna-travel');
    console.log('Connected to MongoDB');

    // Get all transfer categories
    const categories = await TransferCategory.find({});
    console.log(`Found ${categories.length} transfer categories`);

    // Clear existing transfers
    await Transfer.deleteMany({});
    console.log('Cleared existing transfers');

    // Create transfers with category references
    const createdTransfers = [];
    
    for (const transferData of transfers) {
      // Find matching category based on route and service type
      let category = null;
      
      if (transferData.route === 'Hanoi-Sapa') {
        if (transferData.vehicleType === 'bus') {
          category = categories.find(cat => cat.slug === 'sapa-sleeping-bus');
        } else {
          category = categories.find(cat => cat.slug === 'hanoi-sapa-transfer');
        }
      } else if (transferData.route === 'Hanoi-Halong') {
        category = categories.find(cat => cat.slug === 'hanoi-halong-transfer');
      } else if (transferData.route === 'Airport-OldQuarter') {
        category = categories.find(cat => cat.slug === 'airport-transfer');
      } else if (transferData.route === 'Hanoi-CatBa') {
        // Create a new category for Cat Ba if it doesn't exist
        category = categories.find(cat => cat.slug === 'halong-bay-shuttle');
      }

      if (category) {
        const transfer = new Transfer({
          ...transferData,
          category: category._id
        });
        
        const savedTransfer = await transfer.save();
        createdTransfers.push(savedTransfer);
        console.log(`Created: ${savedTransfer.title.en}`);
      } else {
        console.log(`No category found for: ${transferData.title.en}`);
      }
    }

    console.log(`\nCreated ${createdTransfers.length} transfers`);
    
    // Display summary
    console.log('\n=== Transfer Summary ===');
    const serviceTypes = await Transfer.aggregate([
      { $lookup: { from: 'transfercategories', localField: 'category', foreignField: '_id', as: 'categoryInfo' } },
      { $unwind: '$categoryInfo' },
      { $group: { _id: '$categoryInfo.serviceType', count: { $sum: 1 } } }
    ]);
    
    serviceTypes.forEach(type => {
      console.log(`${type._id}: ${type.count} transfers`);
    });

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  } catch (error) {
    console.error('Error creating transfers:', error);
    process.exit(1);
  }
}

// Run the creation
createTransfers();
