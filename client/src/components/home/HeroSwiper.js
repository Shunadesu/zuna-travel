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
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
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
    }
  ];

  // Get current language with fallback
  const currentLang = i18n.language || 'en';

  return (
    <div className="relative h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
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
        
        {/* Custom Navigation Buttons */}
        <div className="swiper-button-prev !text-white !w-12 !h-12 !bg-black/20 hover:!bg-black/40 rounded-full transition-all duration-300">
          <ChevronLeftIcon className="w-6 h-6" />
        </div>
        <div className="swiper-button-next !text-white !w-12 !h-12 !bg-black/20 hover:!bg-black/40 rounded-full transition-all duration-300">
          <ChevronRightIcon className="w-6 h-6" />
        </div>
      </Swiper>
      
      {/* Slide Counter */}
      <div className="absolute bottom-8 right-8 z-20 bg-black/30 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm">
        {currentSlide + 1} / {heroSlides.length}
      </div>
    </div>
  );
};

export default HeroSwiper;
