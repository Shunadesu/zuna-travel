import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  MagnifyingGlassIcon,
  GlobeAltIcon,
  TruckIcon,
  XMarkIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const SearchModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('tours');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchPath = searchType === 'tours' ? '/tours' : '/transfers';
      const queryParams = new URLSearchParams({ search: searchQuery.trim() });
      window.location.href = `${searchPath}?${queryParams.toString()}`;
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: -50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -50,
      transition: {
        duration: 0.2
      }
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delay: 0.2,
        duration: 0.3
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          
          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t('search.modal.title')}
                </h2>
                <p className="text-gray-600 mt-1">
                  {t('search.modal.subtitle')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                onKeyDown={handleKeyDown}
              >
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="p-6 space-y-6">
              {/* Search Type Toggle */}
              <motion.div 
                className="flex bg-gray-100 rounded-xl p-1"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <button
                  type="button"
                  onClick={() => setSearchType('tours')}
                  className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    searchType === 'tours'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <GlobeAltIcon className="w-4 h-4 inline mr-2" />
                  {t('search.modal.tours')}
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('transfers')}
                  className={`flex-1 px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    searchType === 'transfers'
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TruckIcon className="w-4 h-4 inline mr-2" />
                  {t('search.modal.transfers')}
                </button>
              </motion.div>
              
              {/* Search Input */}
              <motion.div 
                className="relative"
                variants={inputVariants}
                initial="hidden"
                animate="visible"
              >
                <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchType === 'tours' ? t('search.modal.toursPlaceholder') : t('search.modal.transfersPlaceholder')}
                  className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  autoFocus
                  onKeyDown={handleKeyDown}
                />
              </motion.div>
              
              {/* Search Button */}
              <motion.button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 rounded-xl text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                variants={buttonVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                whileTap="tap"
                disabled={!searchQuery.trim()}
              >
                <MagnifyingGlassIcon className="h-5 w-5 mr-2" />
                {t('search.modal.button')}
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </motion.button>
            </form>

            {/* Quick Links */}
            <div className="px-6 pb-6">
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  {t('search.modal.quickLinks')}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {['Hanoi', 'Ho Chi Minh City', 'Ha Long Bay', 'Hoi An', 'Sapa', 'Nha Trang'].map((destination) => (
                    <button
                      key={destination}
                      onClick={() => {
                        setSearchQuery(destination);
                        setSearchType('tours');
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
                    >
                      {destination}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
