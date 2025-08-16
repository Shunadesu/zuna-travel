import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  en: {
    translation: {
      // Navigation
             nav: {
         home: 'Home',
         tours: 'Vietnam Tours',
         transfers: 'Transfer Services',
         blog: 'Blog',
         about: 'About Us',
         contact: 'Contact',
         language: 'Language',
         bookNow: 'Book Now',
                 categories: 'Categories',
        search: 'Search'
      },
      
      // Common
      common: {
        loading: 'Loading...',
        error: 'An error occurred',
        tryAgain: 'Try Again',
        readMore: 'Read More',
        viewAll: 'View All',
        bookNow: 'Book Now',
        getQuote: 'Get Quote',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        price: 'Price',
        duration: 'Duration',
        location: 'Location',
        featured: 'Featured',
        popular: 'Popular',
        new: 'New',
        day: 'Day',
        days: 'Days',
        night: 'Night',
        nights: 'Nights',
        adult: 'Adult',
        child: 'Child',
        from: 'From',
        to: 'To',
        date: 'Date',
        time: 'Time',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        message: 'Message',
        send: 'Send',
        submit: 'Submit',
        cancel: 'Cancel',
        close: 'Close',
        save: 'Save',
        edit: 'Edit',
        delete: 'Delete',
        confirm: 'Confirm',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        yes: 'Yes',
        no: 'No',
        perPerson: 'per person',
        total: 'Total',
        passengers: 'Passengers',
        passenger: 'passenger'
      },

      // Home page
      home: {
        hero: {
          title: 'Discover Vietnam',
          subtitle: 'Your Gateway to Unforgettable Adventures',
          description: 'Explore the beauty of Vietnam with our carefully curated tours and reliable transfer services. From the bustling streets of Hanoi to the serene waters of Ha Long Bay.',
          cta: 'Browse Tours'
        },

        categories: {
          title: 'Explore by Category',
          subtitle: 'Find the perfect tour for your interests and preferences',
          explore: 'Explore More'
        },
        tourCategories: {
          title: 'Browse our famous tours',
          subtitle: 'Vietnam, with its tourist destinations likened to rare gems, has been meticulously selected and crafted by Zuna Travel to offer unforgettable travel experiences to our esteemed guests.',
          featured: 'Featured',
          days: 'Days',
          perPerson: 'per person',
          viewAll: 'Browse tours'
        },
        featuredTours: {
          title: 'Featured Tours',
          subtitle: 'Our most popular and highly-rated tours',
          featured: 'Featured',
          days: 'Days',
          perPerson: 'per person',
          viewAll: 'View All Tours'
        },
        transfers: {
          title: 'Transfer Services',
          subtitle: 'Professional and reliable transportation services',
          perTrip: 'per trip',
          viewAll: 'View All Transfers'
        },
        stats: {
          travelers: 'Happy Travelers',
          destinations: 'Destinations',
          satisfaction: 'Satisfaction Rate',
          support: 'Support'
        },
        features: {
          title: 'Why Choose Zuna Travel',
          subtitle: 'Experience the difference with our exceptional service',
          safety: {
            title: 'Safety First',
            description: 'Your safety is our priority with professional drivers and well-maintained vehicles.'
          },
          expertise: {
            title: 'Local Expertise',
            description: 'Our local guides provide authentic insights into Vietnamese culture and hidden gems.'
          },
          support: {
            title: '24/7 Support',
            description: 'Round-the-clock customer support to ensure your travel experience is seamless.'
          },
          experience: {
            title: 'Best Experience',
            description: 'Carefully curated tours designed for unforgettable memories.'
          }
        },
        testimonials: {
          title: 'What Our Travelers Say',
          subtitle: 'Real experiences from our satisfied customers'
        },
        cta: {
          title: 'Ready to Start Your Adventure?',
          subtitle: 'Book your perfect tour or transfer service today and create unforgettable memories',
          browseTours: 'Browse Tours',
          contactUs: 'Contact Us'
        },
        locations: {
          title: 'Browse tours by locations',
          subtitle: 'From the bustling streets of Hanoi to the serenity of Ha Long Bay, our meticulously crafted tours offer a glimpse into Vietnam\'s vibrant culture, breathtaking landscapes, and rich history.',
          browseButton: 'Browse locations',
          exploreMore: 'Explore more',
          haLongBay: {
            description: 'Get away from the hustle and bustle of the city life and head to Ha Long Bay, a UNESCO World Heritage Site recognized for its cultural significance.'
          },
          hanoi: {
            description: 'Hanoi, the heart of Vietnam. The city has intricately linked to a 1,000-year history of cultural and heritage.'
          },
          saPa: {
            description: 'A paradise located in a mountainous landscape, Sapa is charming for its stunning natural landscape and unique culture of ethnic minority.'
          }
        },
        // Legacy keys for backward compatibility
        heroTitle: 'Discover Vietnam',
        heroSubtitle: 'Your Gateway to Unforgettable Adventures',
        exploreTours: 'Explore Tours',
        contactUs: 'Contact Us',
        categoriesTitle: 'Explore by Category',
        categoriesSubtitle: 'Find the perfect tour for your interests',
        exploreMore: 'Explore More',
        featuredToursTitle: 'Featured Tours',
        featuredToursSubtitle: 'Our most popular and highly-rated tours',
        featured: 'Featured',
        days: 'Days',
        viewAllTours: 'View All Tours',
        whyChooseUs: 'Why Choose Zuna Travel',
        whyChooseUsSubtitle: 'Experience the difference with our exceptional service',
        expertGuides: 'Expert Local Guides',
        expertGuidesDesc: 'Our knowledgeable guides provide authentic insights into Vietnamese culture',
        bestExperience: 'Best Experience',
        bestExperienceDesc: 'Carefully curated tours designed for unforgettable memories',
        flexibleSchedule: 'Flexible Schedule',
        flexibleScheduleDesc: 'Customizable itineraries to fit your travel preferences'
      },

             // Tours page
       tours: {
         title: 'Vietnam Tours',
         subtitle: 'Explore the beauty of Vietnam with our curated tour packages',
         clearAll: 'Clear All',
         searchPlaceholder: 'Search tours...',
         categories: 'Categories',
         allCategories: 'All Categories',
         priceRange: 'Price Range',
         duration: 'Duration',
         anyDuration: 'Any Duration',
         day: 'Day',
         days: 'Days',
         showing: 'Showing',
         of: 'of',
         tours: 'tours',
         sortBy: 'Sort by',
         name: 'Name',
         priceLow: 'Price: Low to High',
         priceHigh: 'Price: High to Low',
         featured: 'Featured',
         noResults: 'No tours found',
         noResultsDesc: 'Try adjusting your search criteria or browse all tours',
         filters: 'Filters',
         details: {
           highlights: 'Highlights',
           itinerary: 'Itinerary',
           included: 'What\'s Included',
           excluded: 'What\'s Not Included',
           requirements: 'Requirements',
           cancellation: 'Cancellation Policy'
         }
       },

             // Transfer page
       transfers: {
         title: 'Transfer Services',
         subtitle: 'Professional and reliable transportation services',
         searchPlaceholder: 'Search transfers...',
         priceRange: 'Price Range',
         sortBy: 'Sort By',
         name: 'Name',
         priceLow: 'Price: Low to High',
         priceHigh: 'Price: High to Low',
         rating: 'Rating',
         noResults: 'No transfers found',
         noResultsDesc: 'Try adjusting your search criteria or filters.',
         found: 'found',
        backToTransfers: 'Back to Transfers',
        description: 'Description',
        perTrip: 'per trip',
         types: {
           airport: 'Airport Transfer',
           city: 'City Transfer',
           intercity: 'Intercity Transfer'
         }
       },

      // Blog page
      blog: {
        title: 'Travel Blog',
        subtitle: 'Stories, tips, and insights from Vietnam',
        categories: {
          all: 'All Posts',
          'travel-tips': 'Travel Tips',
          destinations: 'Destinations',
          'food-culture': 'Food & Culture',
          news: 'News',
          guides: 'Travel Guides'
        },
        readingTime: 'min read',
        author: 'By',
        published: 'Published on',
        tags: 'Tags',
        related: 'Related Posts',
        share: 'Share this post'
      },

      // Contact page
      contact: {
        title: 'Contact Us',
        subtitle: 'Get in touch with our travel experts',
        sendMessage: 'Send Message',
        name: 'Full Name',
        namePlaceholder: 'Enter your full name',
        email: 'Email Address',
        emailPlaceholder: 'Enter your email address',
        phone: 'Phone',
        phonePlaceholder: 'Enter your phone number',
        subject: 'Subject',
        subjectPlaceholder: 'Enter message subject',
        message: 'Your Message',
        messagePlaceholder: 'Enter your message content',
        contactInfo: 'Contact Information',
        address: 'Address',
        businessHours: 'Business Hours',
        followUs: 'Follow Us',
        location: 'Location',
        form: {
          title: 'Send us a message',
          send: 'Send Message',
          success: 'Message sent successfully!',
          error: 'Failed to send message. Please try again.'
        },
        info: {
          title: 'Get in Touch',
          hours: 'Business Hours'
        }
      },

      // Footer
      footer: {
        description: 'Your trusted partner for exploring the beauty of Vietnam. We provide authentic travel experiences with local expertise.',
        quickLinks: 'Quick Links',
        contactInfo: 'Contact Info',
        services: 'Our Services',
        contact: 'Contact Info',
        followUs: 'Follow Us',
        newsletter: {
          title: 'Newsletter',
          description: 'Subscribe to get updates on new tours and travel tips',
          placeholder: 'Enter your email',
          subscribe: 'Subscribe'
        },
        allRightsReserved: 'All rights reserved.',
        copyright: '© 2024 Zuna Travel. All rights reserved.',
        privacy: 'Privacy Policy',
        terms: 'Terms of Service'
      },

      // Error messages
      errors: {
        notFound: 'Page not found',
        serverError: 'Server error occurred',
        networkError: 'Network connection error',
        invalidData: 'Invalid data provided',
        unauthorized: 'Unauthorized access',
        forbidden: 'Access forbidden'
      },

      // Search Modal
      search: {
        modal: {
          title: 'Find Your Perfect Adventure',
          subtitle: 'Search for tours and transfer services across Vietnam',
          tours: 'Tours',
          transfers: 'Transfers',
          toursPlaceholder: 'Search for tours, destinations...',
          transfersPlaceholder: 'Search for transfer services...',
          button: 'Search',
          quickLinks: 'Popular Destinations'
        }
      },

      // About page
      about: {
        title: 'About Us',
        subtitle: 'Discover our story and mission',
        story: {
          title: 'Our Story',
          content: 'Founded with a passion for showcasing the beauty of Vietnam, Zuna Travel has been connecting travelers with authentic experiences since our establishment. We believe in creating meaningful journeys that go beyond typical tourism.'
        },
        mission: {
          title: 'Our Mission',
          content: 'To provide exceptional travel experiences that showcase the rich culture, stunning landscapes, and warm hospitality of Vietnam while supporting local communities and sustainable tourism practices.'
        },
        values: {
          title: 'Our Values',
          authenticity: 'Authenticity',
          sustainability: 'Sustainability',
          excellence: 'Excellence',
          community: 'Community'
        },
        team: {
          title: 'Our Team',
          subtitle: 'Meet the passionate people behind Zuna Travel'
        },
        stats: {
          title: 'Our Numbers',
          happyTravelers: 'Happy Travelers',
          destinations: 'Destinations',
          yearsExperience: 'Years Experience',
          localGuides: 'Local Guides'
        }
      }
    }
  },
  
  vi: {
    translation: {
      // Navigation
             nav: {
         home: 'Trang Chủ',
         tours: 'Tour Việt Nam',
         transfers: 'Dịch Vụ Đưa Đón',
         blog: 'Blog',
         about: 'Về Chúng Tôi',
         contact: 'Liên Hệ',
         language: 'Ngôn Ngữ',
         bookNow: 'Đặt Ngay',
                 categories: 'Danh Mục',
        search: 'Tìm Kiếm'
      },
      
      // Common
      common: {
        loading: 'Đang tải...',
        error: 'Đã xảy ra lỗi',
        tryAgain: 'Thử Lại',
        readMore: 'Đọc Thêm',
        viewAll: 'Xem Tất Cả',
        bookNow: 'Đặt Ngay',
        getQuote: 'Báo Giá',
        search: 'Tìm Kiếm',
        filter: 'Lọc',
        sort: 'Sắp Xếp',
        price: 'Giá',
        duration: 'Thời Gian',
        location: 'Địa Điểm',
        featured: 'Nổi Bật',
        popular: 'Phổ Biến',
        new: 'Mới',
        day: 'Ngày',
        days: 'Ngày',
        night: 'Đêm',
        nights: 'Đêm',
        adult: 'Người Lớn',
        child: 'Trẻ Em',
        from: 'Từ',
        to: 'Đến',
        date: 'Ngày',
        time: 'Giờ',
        name: 'Tên',
        email: 'Email',
        phone: 'Điện Thoại',
        message: 'Tin Nhắn',
        send: 'Gửi',
        submit: 'Gửi',
        cancel: 'Hủy',
        close: 'Đóng',
        save: 'Lưu',
        edit: 'Sửa',
        delete: 'Xóa',
        confirm: 'Xác Nhận',
        back: 'Quay Lại',
        next: 'Tiếp',
        previous: 'Trước',
        yes: 'Có',
        no: 'Không',
        perPerson: 'mỗi người',
        total: 'Tổng Cộng',
        passengers: 'Hành Khách',
        passenger: 'hành khách'
      },

      // Home page
      home: {
        hero: {
          title: 'Khám Phá Việt Nam',
          subtitle: 'Cổng Thông Tin Đến Những Cuộc Phiêu Lưu Khó Quên',
          description: 'Khám phá vẻ đẹp của Việt Nam với các tour du lịch được tuyển chọn kỹ lưỡng và dịch vụ đưa đón đáng tin cậy. Từ những con phố nhộn nhịp của Hà Nội đến vùng nước yên bình của Vịnh Hạ Long.',
          cta: 'Xem Tour'
        },

        categories: {
          title: 'Khám Phá Theo Danh Mục',
          subtitle: 'Tìm tour hoàn hảo cho sở thích và nhu cầu của bạn',
          explore: 'Khám Phá Thêm'
        },
        tourCategories: {
          title: 'Khám phá các tour nổi tiếng',
          subtitle: 'Việt Nam, với những điểm du lịch được ví như những viên ngọc quý, đã được Zuna Travel tuyển chọn và thiết kế cẩn thận để mang đến những trải nghiệm du lịch khó quên cho quý khách.',
          featured: 'Nổi Bật',
          days: 'Ngày',
          perPerson: 'mỗi người',
          viewAll: 'Xem tất cả tour'
        },
        featuredTours: {
          title: 'Tour Nổi Bật',
          subtitle: 'Những tour phổ biến và được đánh giá cao nhất',
          featured: 'Nổi Bật',
          days: 'Ngày',
          perPerson: 'mỗi người',
          viewAll: 'Xem Tất Cả Tour'
        },
        transfers: {
          title: 'Dịch Vụ Đưa Đón',
          subtitle: 'Dịch vụ vận chuyển chuyên nghiệp và đáng tin cậy',
          perTrip: 'mỗi chuyến',
          viewAll: 'Xem Tất Cả Dịch Vụ'
        },
        stats: {
          travelers: 'Khách Du Lịch Hài Lòng',
          destinations: 'Điểm Đến',
          satisfaction: 'Tỷ Lệ Hài Lòng',
          support: 'Hỗ Trợ'
        },
        features: {
          title: 'Tại Sao Chọn Zuna Travel',
          subtitle: 'Trải nghiệm sự khác biệt với dịch vụ xuất sắc của chúng tôi',
          safety: {
            title: 'An Toàn Hàng Đầu',
            description: 'An toàn của bạn là ưu tiên hàng đầu với tài xế chuyên nghiệp và xe được bảo dưỡng tốt.'
          },
          expertise: {
            title: 'Chuyên Môn Địa Phương',
            description: 'Hướng dẫn viên địa phương cung cấp những hiểu biết chân thực về văn hóa Việt Nam và những viên ngọc ẩn.'
          },
          support: {
            title: 'Hỗ Trợ 24/7',
            description: 'Hỗ trợ khách hàng suốt ngày đêm để đảm bảo trải nghiệm du lịch của bạn diễn ra suôn sẻ.'
          },
          experience: {
            title: 'Trải Nghiệm Tốt Nhất',
            description: 'Tour được tuyển chọn cẩn thận để tạo ra những kỷ niệm khó quên.'
          }
        },
        testimonials: {
          title: 'Khách Hàng Nói Gì Về Chúng Tôi',
          subtitle: 'Trải nghiệm thực tế từ những khách hàng hài lòng'
        },
        cta: {
          title: 'Sẵn Sàng Bắt Đầu Cuộc Phiêu Lưu?',
          subtitle: 'Đặt tour hoặc dịch vụ đưa đón hoàn hảo ngay hôm nay và tạo ra những kỷ niệm khó quên',
          browseTours: 'Xem Tour',
          contactUs: 'Liên Hệ'
        },
        locations: {
          title: 'Khám phá tour theo địa điểm',
          subtitle: 'Từ những con phố nhộn nhịp của Hà Nội đến sự yên bình của Vịnh Hạ Long, các tour được thiết kế tỉ mỉ của chúng tôi mang đến cái nhìn về văn hóa sôi động, cảnh quan tuyệt đẹp và lịch sử phong phú của Việt Nam.',
          browseButton: 'Khám phá địa điểm',
          exploreMore: 'Khám phá thêm',
          haLongBay: {
            description: 'Tránh xa sự hối hả và nhộn nhịp của cuộc sống thành phố và đến Vịnh Hạ Long, một Di sản Thế giới UNESCO được công nhận về ý nghĩa văn hóa.'
          },
          hanoi: {
            description: 'Hà Nội, trái tim của Việt Nam. Thành phố có mối liên kết phức tạp với 1,000 năm lịch sử văn hóa và di sản.'
          },
          saPa: {
            description: 'Một thiên đường nằm trong cảnh quan núi non, Sapa quyến rũ với cảnh quan thiên nhiên tuyệt đẹp và văn hóa độc đáo của các dân tộc thiểu số.'
          }
        },
        // Legacy keys for backward compatibility
        heroTitle: 'Khám Phá Việt Nam',
        heroSubtitle: 'Cổng Thông Tin Đến Những Cuộc Phiêu Lưu Khó Quên',
        exploreTours: 'Khám Phá Tour',
        contactUs: 'Liên Hệ',
        categoriesTitle: 'Khám Phá Theo Danh Mục',
        categoriesSubtitle: 'Tìm tour hoàn hảo cho sở thích của bạn',
        exploreMore: 'Khám Phá Thêm',
        featuredToursTitle: 'Tour Nổi Bật',
        featuredToursSubtitle: 'Những tour phổ biến và được đánh giá cao nhất',
        featured: 'Nổi Bật',
        days: 'Ngày',
        viewAllTours: 'Xem Tất Cả Tour',
        whyChooseUs: 'Tại Sao Chọn Zuna Travel',
        whyChooseUsSubtitle: 'Trải nghiệm sự khác biệt với dịch vụ xuất sắc của chúng tôi',
        expertGuides: 'Hướng Dẫn Viên Địa Phương',
        expertGuidesDesc: 'Hướng dẫn viên am hiểu cung cấp hiểu biết chân thực về văn hóa Việt Nam',
        bestExperience: 'Trải Nghiệm Tốt Nhất',
        bestExperienceDesc: 'Tour được tuyển chọn cẩn thận để tạo ra những kỷ niệm khó quên',
        flexibleSchedule: 'Lịch Trình Linh Hoạt',
        flexibleScheduleDesc: 'Lịch trình có thể tùy chỉnh để phù hợp với sở thích du lịch của bạn'
      },

             // Tours page
       tours: {
         title: 'Tour Việt Nam',
         subtitle: 'Khám phá vẻ đẹp Việt Nam với các gói tour được tuyển chọn',
         clearAll: 'Xóa Tất Cả',
         searchPlaceholder: 'Tìm kiếm tour...',
         categories: 'Danh Mục',
         allCategories: 'Tất Cả Danh Mục',
         priceRange: 'Khoảng Giá',
         duration: 'Thời Gian',
         anyDuration: 'Mọi Thời Gian',
         day: 'Ngày',
         days: 'Ngày',
         showing: 'Hiển thị',
         of: 'trên',
         tours: 'tour',
         sortBy: 'Sắp xếp theo',
         name: 'Tên',
         priceLow: 'Giá: Thấp đến Cao',
         priceHigh: 'Giá: Cao đến Thấp',
         featured: 'Nổi Bật',
         noResults: 'Không tìm thấy tour',
         noResultsDesc: 'Thử điều chỉnh tiêu chí tìm kiếm hoặc xem tất cả tour',
         filters: 'Bộ Lọc',
         details: {
           highlights: 'Điểm Nổi Bật',
           itinerary: 'Lịch Trình',
           included: 'Bao Gồm',
           excluded: 'Không Bao Gồm',
           requirements: 'Yêu Cầu',
           cancellation: 'Chính Sách Hủy'
         }
       },

             // Transfer page
       transfers: {
         title: 'Dịch Vụ Đưa Đón',
         subtitle: 'Dịch vụ vận chuyển chuyên nghiệp và đáng tin cậy',
         searchPlaceholder: 'Tìm kiếm dịch vụ đưa đón...',
         priceRange: 'Khoảng Giá',
         sortBy: 'Sắp Xếp Theo',
         name: 'Tên',
         priceLow: 'Giá: Thấp đến Cao',
         priceHigh: 'Giá: Cao đến Thấp',
         rating: 'Đánh Giá',
         noResults: 'Không tìm thấy dịch vụ đưa đón',
         noResultsDesc: 'Thử điều chỉnh tiêu chí tìm kiếm hoặc bộ lọc.',
         found: 'tìm thấy',
        backToTransfers: 'Quay Lại Dịch Vụ Đưa Đón',
        description: 'Mô Tả',
        perTrip: 'mỗi chuyến',
         types: {
           airport: 'Đưa Đón Sân Bay',
           city: 'Đưa Đón Trong Thành Phố',
           intercity: 'Đưa Đón Liên Tỉnh'
         }
       },

      // Blog page
      blog: {
        title: 'Blog Du Lịch',
        subtitle: 'Câu chuyện, mẹo và hiểu biết từ Việt Nam',
        categories: {
          all: 'Tất Cả Bài Viết',
          'travel-tips': 'Mẹo Du Lịch',
          destinations: 'Điểm Đến',
          'food-culture': 'Ẩm Thực & Văn Hóa',
          news: 'Tin Tức',
          guides: 'Hướng Dẫn Du Lịch'
        },
        readingTime: 'phút đọc',
        author: 'Bởi',
        published: 'Xuất bản vào',
        tags: 'Thẻ',
        related: 'Bài Viết Liên Quan',
        share: 'Chia sẻ bài viết này'
      },

      // Contact page
      contact: {
        title: 'Liên Hệ',
        subtitle: 'Liên lạc với các chuyên gia du lịch của chúng tôi',
        sendMessage: 'Gửi Tin Nhắn',
        name: 'Họ và Tên',
        namePlaceholder: 'Nhập họ và tên của bạn',
        email: 'Địa Chỉ Email',
        emailPlaceholder: 'Nhập địa chỉ email của bạn',
        phone: 'Điện Thoại',
        phonePlaceholder: 'Nhập số điện thoại của bạn',
        subject: 'Chủ Đề',
        subjectPlaceholder: 'Nhập chủ đề tin nhắn',
        message: 'Tin Nhắn Của Bạn',
        messagePlaceholder: 'Nhập nội dung tin nhắn của bạn',
        contactInfo: 'Thông Tin Liên Lạc',
        address: 'Địa Chỉ',
        businessHours: 'Giờ Làm Việc',
        followUs: 'Theo Dõi Chúng Tôi',
        location: 'Vị Trí',
        form: {
          title: 'Gửi tin nhắn cho chúng tôi',
          send: 'Gửi Tin Nhắn',
          success: 'Tin nhắn đã được gửi thành công!',
          error: 'Gửi tin nhắn thất bại. Vui lòng thử lại.'
        },
        info: {
          title: 'Thông Tin Liên Lạc',
          hours: 'Giờ Làm Việc'
        }
      },

      // Footer
      footer: {
        description: 'Đối tác đáng tin cậy để khám phá vẻ đẹp của Việt Nam. Chúng tôi cung cấp trải nghiệm du lịch chân thực với chuyên môn địa phương.',
        quickLinks: 'Liên Kết Nhanh',
        contactInfo: 'Thông Tin Liên Lạc',
        services: 'Dịch Vụ Của Chúng Tôi',
        contact: 'Thông Tin Liên Lạc',
        followUs: 'Theo Dõi Chúng Tôi',
        newsletter: {
          title: 'Bản Tin',
          description: 'Đăng ký để nhận cập nhật về các tour mới và mẹo du lịch',
          placeholder: 'Nhập email của bạn',
          subscribe: 'Đăng Ký'
        },
        allRightsReserved: 'Tất cả các quyền được bảo lưu.',
        copyright: '© 2024 Zuna Travel. Tất cả các quyền được bảo lưu.',
        privacy: 'Chính Sách Bảo Mật',
        terms: 'Điều Khoản Dịch Vụ'
      },

      // Error messages
      errors: {
        notFound: 'Không tìm thấy trang',
        serverError: 'Lỗi máy chủ xảy ra',
        networkError: 'Lỗi kết nối mạng',
        invalidData: 'Dữ liệu không hợp lệ',
        unauthorized: 'Truy cập không được phép',
        forbidden: 'Bị cấm truy cập'
      },

      // Search Modal
      search: {
        modal: {
          title: 'Tìm Cuộc Phiêu Lưu Hoàn Hảo',
          subtitle: 'Tìm kiếm tour và dịch vụ đưa đón trên khắp Việt Nam',
          tours: 'Tour',
          transfers: 'Đưa Đón',
          toursPlaceholder: 'Tìm kiếm tour, điểm đến...',
          transfersPlaceholder: 'Tìm kiếm dịch vụ đưa đón...',
          button: 'Tìm Kiếm',
          quickLinks: 'Điểm Đến Phổ Biến'
        }
      },

      // About page
      about: {
        title: 'Về Chúng Tôi',
        subtitle: 'Khám phá câu chuyện và sứ mệnh của chúng tôi',
        story: {
          title: 'Câu Chuyện Của Chúng Tôi',
          content: 'Được thành lập với niềm đam mê giới thiệu vẻ đẹp của Việt Nam, Zuna Travel đã kết nối du khách với những trải nghiệm chân thực từ khi thành lập. Chúng tôi tin vào việc tạo ra những hành trình có ý nghĩa vượt xa du lịch thông thường.'
        },
        mission: {
          title: 'Sứ Mệnh Của Chúng Tôi',
          content: 'Cung cấp những trải nghiệm du lịch xuất sắc thể hiện văn hóa phong phú, cảnh quan tuyệt đẹp và sự hiếu khách ấm áp của Việt Nam, đồng thời hỗ trợ cộng đồng địa phương và thực hành du lịch bền vững.'
        },
        values: {
          title: 'Giá Trị Của Chúng Tôi',
          authenticity: 'Chân Thực',
          sustainability: 'Bền Vững',
          excellence: 'Xuất Sắc',
          community: 'Cộng Đồng'
        },
        team: {
          title: 'Đội Ngũ Của Chúng Tôi',
          subtitle: 'Gặp gỡ những con người đam mê đằng sau Zuna Travel'
        },
        stats: {
          title: 'Con Số Của Chúng Tôi',
          happyTravelers: 'Du Khách Hài Lòng',
          destinations: 'Điểm Đến',
          yearsExperience: 'Năm Kinh Nghiệm',
          localGuides: 'Hướng Dẫn Viên Địa Phương'
        }
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    }
  });

export default i18n;
