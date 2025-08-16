import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CategoryTabs = ({ categories, selectedCategory, onCategorySelect }) => {
  const { t, i18n } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  // Filter main categories (level 0)
  const mainCategories = categories.filter(cat => cat.level === 0);

  if (mainCategories.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      {/* Main Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {mainCategories.map((category, index) => (
          <button
            key={category._id}
            onClick={() => setActiveTab(index)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeTab === index
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.name[i18n.language]}
          </button>
        ))}
      </div>

      {/* Subcategories for Active Tab */}
      {mainCategories[activeTab]?.subcategories && mainCategories[activeTab].subcategories.length > 0 && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {mainCategories[activeTab].subcategories.map((subcat) => (
              <button
                key={subcat._id}
                onClick={() => onCategorySelect(subcat.slug)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                  selectedCategory === subcat.slug
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {subcat.name[i18n.language]}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Description */}
      {mainCategories[activeTab]?.description && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-gray-600 text-sm">
            {mainCategories[activeTab].description[i18n.language]}
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;
