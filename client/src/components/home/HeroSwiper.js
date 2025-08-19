import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { useTranslation } from 'react-i18next';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import './HeroSwiper.css';

const HeroSwiper = () => {
  const { t, i18n } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Check if i18n is ready
  if (!i18n.isInitialized) {
    return (
      <div className="relative h-screen overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const heroSlides = [
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: {
        en: 'Discover Vietnam',
        vi: 'Khám Phá Việt Nam'
      },
      subtitle: {
        en: 'Your Gateway to Unforgettable Adventures',
        vi: 'Cổng Thông Tin Đến Những Cuộc Phiêu Lưu Khó Quên'
      },
      description: {
        en: 'Explore the beauty of Vietnam with our carefully curated tours and reliable transfer services.',
        vi: 'Khám phá vẻ đẹp của Việt Nam với các tour du lịch được tuyển chọn kỹ lưỡng.'
      }
    },
    {
      id: 2,
      image: 'https://statics.vinpearl.com/ha-long-bay-in-vietnam-4_1689180998.jpg',
      title: {
        en: 'Ha Long Bay',
        vi: 'Vịnh Hạ Long'
      },
      subtitle: {
        en: 'Majestic Limestone Islands',
        vi: 'Những Hòn Đảo Đá Vôi Hùng Vĩ'
      },
      description: {
        en: 'Experience the breathtaking beauty of thousands of limestone karsts and isles.',
        vi: 'Trải nghiệm vẻ đẹp ngoạn mục của hàng nghìn hòn đảo đá vôi.'
      }
    },
    {
      id: 3,
      image: 'https://vcdn1-dulich.vnecdn.net/2022/04/18/dulichSaPa-1650268886-1480-1650277620.png?w=0&h=0&q=100&dpr=2&fit=crop&s=JTUw8njZ_Glkqf1itzjObg',
      title: {
        en: 'Sapa Mountains',
        vi: 'Núi Sapa'
      },
      subtitle: {
        en: 'Misty Mountain Peaks',
        vi: 'Những Đỉnh Núi Sương Mù'
      },
      description: {
        en: 'Trek through terraced rice fields and meet ethnic minority communities in the misty mountains.',
        vi: 'Đi bộ qua những ruộng bậc thang và gặp gỡ các cộng đồng dân tộc thiểu số trên núi sương mù.'
      }
    },
    {
      id: 4,
      image: 'https://statics.vinpearl.com/hoi-an-ancient-town_1648356190.jpg',
      title: {
        en: 'Hoi An Ancient Town',
        vi: 'Phố Cổ Hội An'
      },
      subtitle: {
        en: 'Timeless Beauty & Culture',
        vi: 'Vẻ Đẹp Và Văn Hóa Vượt Thời Gian'
      },
      description: {
        en: 'Walk through lantern-lit streets and discover the charm of this UNESCO World Heritage site.',
        vi: 'Đi bộ qua những con phố rực rỡ đèn lồng và khám phá sự quyến rũ của di sản UNESCO này.'
      }
    },
    {
      id: 5,
      image: 'https://bcp.cdnchinhphu.vn/334894974524682240/2022/3/6/img6993-16465660681331104827006-0-0-400-640-crop-1646566105065638540982.jpg',
      title: {
        en: 'Mekong Delta',
        vi: 'Đồng Bằng Sông Cửu Long'
      },
      subtitle: {
        en: 'Floating Markets & Life',
        vi: 'Chợ Nổi Và Cuộc Sống'
      },
      description: {
        en: 'Experience the vibrant floating markets and lush green landscapes of the Mekong Delta.',
        vi: 'Trải nghiệm những chợ nổi sôi động và cảnh quan xanh tươi của đồng bằng sông Cửu Long.'
      }
    },
    {
      id: 6,
      image: 'https://statics.vinpearl.com/pho-co-ha-noi-10_1687918089.jpg',
      title: {
        en: 'Hanoi Old Quarter',
        vi: 'Phố Cổ Hà Nội'
      },
      subtitle: {
        en: 'Historic Heart of Vietnam',
        vi: 'Trái Tim Lịch Sử Của Việt Nam'
      },
      description: {
        en: 'Explore the bustling streets, ancient temples, and rich history of Vietnam\'s capital.',
        vi: 'Khám phá những con phố nhộn nhịp, đền chùa cổ kính và lịch sử phong phú của thủ đô Việt Nam.'
      }
    },
    {
      id: 7,
      image: 'https://khaihoanphuquoc.com.vn/wp-content/uploads/2023/11/du-lich-phu-quoc-thang-10-1.jpg',
      title: {
        en: 'Phu Quoc Island',
        vi: 'Đảo Phú Quốc'
      },
      subtitle: {
        en: 'Tropical Paradise',
        vi: 'Thiên Đường Nhiệt Đới'
      },
      description: {
        en: 'Relax on pristine beaches and enjoy crystal clear waters in Vietnam\'s largest island.',
        vi: 'Thư giãn trên những bãi biển hoang sơ và tận hưởng làn nước trong vắt tại hòn đảo lớn nhất Việt Nam.'
      }
    },
    {
      id: 8,
      image: 'https://vtcpay.vn/blog/wp-content/uploads/2022/07/bai-bien-Nha-Trang-1-1.jpg',
      title: {
        en: 'Nha Trang Beaches',
        vi: 'Bãi Biển Nha Trang'
      },
      subtitle: {
        en: 'Coastal Beauty',
        vi: 'Vẻ Đẹp Ven Biển'
      },
      description: {
        en: 'Discover pristine beaches, coral reefs, and vibrant coastal culture.',
        vi: 'Khám phá những bãi biển hoang sơ, rạn san hô và văn hóa ven biển sôi động.'
      }
    }
  ];

  // Get current language with fallback
  const currentLang = i18n.language || 'en';

  return (
    <div className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        loop={true}
        onSlideChange={(swiper) => setCurrentSlide(swiper.realIndex)}
        className="h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id} className="relative">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`
              }}
            />
            
            {/* Content Overlay */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <div className="text-center text-white px-4 max-w-4xl mx-auto">
                <div className="space-y-6">
                  {/* Title */}
                  <h1 
                    className="text-5xl md:text-7xl font-bold leading-tight"
                    style={{ 
                      color: 'white',
                      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
                      zIndex: 20,
                      position: 'relative'
                    }}
                  >
                    {slide.title[currentLang] || slide.title.en || 'Discover Vietnam'}
                  </h1>
                  
                  {/* Subtitle */}
                  <h2 
                    className="text-xl md:text-2xl font-medium"
                    style={{ 
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      zIndex: 20,
                      position: 'relative'
                    }}
                  >
                    {slide.subtitle[currentLang] || slide.subtitle.en || 'Your Gateway to Unforgettable Adventures'}
                  </h2>
                  
                  {/* Description */}
                  <p 
                    className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
                    style={{ 
                      color: 'white',
                      textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
                      zIndex: 20,
                      position: 'relative'
                    }}
                  >
                    {slide.description[currentLang] || slide.description.en || 'Explore the beauty of Vietnam with our carefully curated tours and reliable transfer services.'}
                  </p>
                  
                  {/* CTA Button */}
                  <div className="pt-4" style={{ zIndex: 20, position: 'relative' }}>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      style={{ 
                        color: 'white',
                        backgroundColor: '#2563eb',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      {t('home.hero.cta') || 'Browse Tours'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
  
      </Swiper>
      
      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
        {currentSlide + 1} / {heroSlides.length}
      </div>
    </div>
  );
};

export default HeroSwiper;
