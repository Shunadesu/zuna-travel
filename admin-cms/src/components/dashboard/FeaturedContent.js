import React from 'react';
import { Link } from 'react-router-dom';
import { CubeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const FeaturedContent = ({ title, items, type, emptyMessage }) => {
  const getIcon = () => {
    return type === 'product' ? CubeIcon : DocumentTextIcon;
  };

  const getLink = (item) => {
    if (type === 'product') {
      return `/admin/products/${item._id}/edit`;
    } else if (type === 'blog') {
      return `/admin/blogs/${item._id}/edit`;
    }
    return '#';
  };

  const getTitle = (item) => {
    return item.title?.en || item.title || item.name?.en || item.name;
  };

  const getSubtitle = (item) => {
    if (type === 'product') {
      return `$${item.pricing?.adult || 0}`;
    } else if (type === 'blog') {
      return item.author?.name || 'Unknown Author';
    }
    return '';
  };

  const getImage = (item) => {
    if (type === 'product') {
      return item.images && item.images.length > 0 ? item.images[0].url : null;
    } else if (type === 'blog') {
      return item.featuredImage;
    }
    return null;
  };

  const Icon = getIcon();

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {items.length > 0 ? (
          items.map((item) => (
            <Link
              key={item._id}
              to={getLink(item)}
              className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-md transition-colors duration-150"
            >
              <div className="flex-shrink-0 h-10 w-10">
                {getImage(item) ? (
                  <img
                    className="h-10 w-10 rounded object-cover"
                    src={getImage(item)}
                    alt={getTitle(item)}
                  />
                ) : (
                  <div className="h-10 w-10 rounded bg-gray-200 flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getTitle(item)}
                </p>
                <p className="text-sm text-gray-500">
                  {getSubtitle(item)}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-gray-500">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedContent;













