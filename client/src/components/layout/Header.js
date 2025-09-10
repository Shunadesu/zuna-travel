import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Bars3Icon, 
  XMarkIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useSettingsStore, useCategoryStore, useAuthStore } from '../../stores';
import SearchModal from '../common/SearchModal';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const { settings, fetchSettings } = useSettingsStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    fetchSettings();
    fetchCategories();
  }, [fetchCategories]); // Remove fetchSettings from dependencies

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const openSearchModal = () => {
    setIsSearchModalOpen(true);
  };

  const closeSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.tours'), href: '/tours' },
    { name: t('nav.transfers'), href: '/transfers' },
    { name: t('nav.blog'), href: '/blog' },
    { name: t('nav.about'), href: '/about' },
    { name: t('nav.contact'), href: '/contact' },
  ];

  const activeCategories = categories?.filter(cat => cat.isActive) || [];

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'
      }`}>
        {/* Top bar with contact info */}
        {settings ? (
          <div 
            className="py-2"
            style={{
              backgroundColor: settings.topBar?.backgroundColor || '#1F2937',
              color: settings.topBar?.textColor || '#FFFFFF'
            }}
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  {settings.phone && (
                    <a 
                      href={`tel:${settings.phone}`}
                      className="flex items-center transition-colors"
                      style={{
                        color: settings.topBar?.textColor || '#FFFFFF',
                        '--tw-text-opacity': '1'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = settings.topBar?.hoverColor || '#93C5FD';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = settings.topBar?.textColor || '#FFFFFF';
                      }}
                    >
                      <PhoneIcon className="h-4 w-4 mr-1" />
                      {settings.phone}
                    </a>
                  )}
                  {settings.email && (
                    <a 
                      href={`mailto:${settings.email}`}
                      className="flex items-center transition-colors"
                      style={{
                        color: settings.topBar?.textColor || '#FFFFFF',
                        '--tw-text-opacity': '1'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.color = settings.topBar?.hoverColor || '#93C5FD';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = settings.topBar?.textColor || '#FFFFFF';
                      }}
                    >
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {settings.email}
                    </a>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center transition-colors"
                    style={{
                      color: settings.topBar?.textColor || '#FFFFFF',
                      '--tw-text-opacity': '1'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = settings.topBar?.hoverColor || '#93C5FD';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = settings.topBar?.textColor || '#FFFFFF';
                    }}
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                    {i18n.language === 'en' ? 'VI' : 'EN'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div 
            className="py-2 bg-[#1F2937] text-white"
          >
            <div className="container mx-auto px-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-4">
                  
                    {settings?.phone && (
                      <a 
                        href={`tel:${settings.phone}`}  
                        className="flex items-center transition-colors"
                        style={{
                          color: '#FFFFFF',
                          '--tw-text-opacity': '1'
                        }}
                      >
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        <span className='text-white'>{settings.phone}</span>
                      </a>
                    )}
              
                    {settings?.email && (
                      <a 
                        href={`mailto:${settings.email}`}
                        className="flex items-center transition-colors"
                      >
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        <span className='text-white'>{settings.email}</span>
                      </a>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center transition-colors text-white hover:text-blue-300"
                  >
                    <GlobeAltIcon className="h-4 w-4 mr-1" />
                    {i18n.language === 'en' ? 'VI' : 'EN'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main navigation */}
        <nav className={`transition-all duration-300 ${
          isScrolled ? 'bg-white' : 'bg-white backdrop-blur-sm'
        }`}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <div className="text-2xl font-bold" style={{ color: settings?.primaryColor || '#3B82F6' }}>
                  {settings?.companyName?.[i18n.language] || 'VN BEST Travel'}
                </div>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`font-medium transition-colors ${
                      location.pathname === item.href
                        ? 'text-blue-600'
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Categories Dropdown
                {activeCategories.length > 0 && (
                  <div className="relative group">
                    <button className="font-medium text-gray-700 hover:text-blue-600 transition-colors">
                      {t('nav.categories')}
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      {activeCategories.map((category) => (
                        <Link
                          key={category._id}
                          to={`/category/${category.slug}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          {category.name[i18n.language]}
                        </Link>
                      ))}
                    </div>
                  </div>
                )} */}
              </div>

              {/* Search and CTA Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Search Button */}
                <button
                  onClick={openSearchModal}
                  className="p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200"
                  title={t('nav.search')}
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>

                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-all duration-200">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <span className="hidden lg:block text-sm font-medium">{user?.name}</span>
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/bookings"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        My Bookings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
                
                {/* CTA Button */}
                <Link
                  to="/contact"
                  className="px-6 py-2 rounded-full font-medium transition-all duration-200"
                  style={{
                    backgroundColor: settings?.primaryColor || '#3B82F6',
                    color: 'white'
                  }}
                >
                  {t('nav.bookNow')}
                </Link>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="h-6 w-6" />
                ) : (
                  <Bars3Icon className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200">
              <div className="px-4 py-2 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      location.pathname === item.href
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
                
                {/* Mobile Search Button */}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openSearchModal();
                  }}
                  className="w-full flex items-center px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                >
                  <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                  {t('nav.search')}
                </button>
                
                {/* Mobile Categories
                {activeCategories.length > 0 && (
                  <div className="border-t border-gray-200 pt-2">
                    <div className="px-3 py-2 text-sm font-medium text-gray-500">
                      {t('nav.categories')}
                    </div>
                    {activeCategories.map((category) => (
                      <Link
                        key={category._id}
                        to={`/category/${category.slug}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      >
                        {category.name[i18n.language]}
                      </Link>
                    ))}
                  </div>
                )} */}
                
                {/* Mobile User Menu */}
                <div className="border-t border-gray-200 pt-2">
                  {isAuthenticated ? (
                    <div className="space-y-1">
                      <div className="px-3 py-2 flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                      </div>
                      <Link
                        to="/profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      >
                        My Bookings
                      </Link>
                      <button
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                      >
                        Sign Up
                      </Link>
                      <Link
                        to="/bookings"
                        onClick={() => setIsMenuOpen(false)}
                        className="block px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                      >
                        My Bookings
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={closeSearchModal} 
      />
    </>
  );
};

export default Header;
