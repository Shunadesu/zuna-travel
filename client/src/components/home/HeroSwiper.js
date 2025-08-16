import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: {
        en: 'Sapa Terraces',
        vi: 'Ruộng Bậc Thang Sapa'
      },
      subtitle: {
        en: 'Mountain Rice Terraces',
        vi: 'Ruộng Bậc Thang Trên Núi'
      },
      description: {
        en: 'Discover the stunning rice terraces carved into the mountainsides.',
        vi: 'Khám phá những ruộng bậc thang tuyệt đẹp được khắc vào sườn núi.'
      }
    },
    {
      id: 4,
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
      title: {
        en: 'Hoi An Ancient Town',
        vi: 'Phố Cổ Hội An'
      },
      subtitle: {
        en: 'UNESCO World Heritage Site',
        vi: 'Di Sản Thế Giới UNESCO'
      },
      description: {
        en: 'Step back in time in this beautifully preserved ancient trading port.',
        vi: 'Quay ngược thời gian tại cảng thương mại cổ được bảo tồn đẹp mắt.'
      }
    }
  ];

  const slideVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -50,
      transition: {
        duration: 0.5,
        ease: "easeIn"
      }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut"
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.5,
        delay: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    },
    tap: {
      scale: 0.95
    }
  };

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
          renderBullet: function (index, className) {
            return `<span class="${className} w-3 h-3 bg-white/50 hover:bg-white transition-colors duration-300"></span>`;
          },
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${slide.id}-${i18n.language}`}
                    variants={slideVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="space-y-6"
                  >
                    {/* Title */}
                    <motion.h1 
                      variants={textVariants}
                      className="text-5xl md:text-7xl font-bold leading-tight"
                    >
                      {slide.title[i18n.language]}
                    </motion.h1>
                    
                    {/* Subtitle */}
                    <motion.h2 
                      variants={textVariants}
                      className="text-xl md:text-2xl font-medium text-gray-200"
                    >
                      {slide.subtitle[i18n.language]}
                    </motion.h2>
                    
                    {/* Description */}
                    <motion.p 
                      variants={textVariants}
                      className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
                    >
                      {slide.description[i18n.language]}
                    </motion.p>
                    
                    {/* CTA Button */}
                    <motion.div
                      variants={buttonVariants}
                      className="pt-4"
                    >
                      <motion.button
                        whileHover="hover"
                        whileTap="tap"
                        variants={buttonVariants}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                      >
                        {t('home.hero.cta')}
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
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
