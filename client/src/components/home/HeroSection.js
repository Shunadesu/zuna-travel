import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const HeroSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 hero-gradient opacity-50"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float"></div>
      <div className="absolute top-40 right-20 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
      <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-accent-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="relative container-custom py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t('home.hero.title')}
                <span className="block text-gradient mt-2">
                  {t('home.hero.subtitle')}
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg">
                {t('home.hero.description')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/tours"
                className="btn btn-primary btn-lg group"
              >
                {t('home.hero.cta')}
                <ArrowRightIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              
              <Link
                to="/transfers"
                className="btn btn-outline btn-lg"
              >
                {t('transfers.title')}
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600">500+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600">50+</div>
                <div className="text-sm text-gray-600">Tour Packages</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary-600">5+</div>
                <div className="text-sm text-gray-600">Years Experience</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-slide-up">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Ha Long Bay - Vietnam"
                className="w-full h-96 lg:h-[500px] object-cover rounded-2xl shadow-2xl"
              />
              
              {/* Floating Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">Ha Long Bay Tour</h3>
                    <p className="text-sm text-gray-600">2 Days 1 Night</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary-600">$120</div>
                    <div className="text-xs text-gray-500">per person</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decoration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-600/20 to-secondary-600/20 rounded-2xl transform translate-x-4 translate-y-4 -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
