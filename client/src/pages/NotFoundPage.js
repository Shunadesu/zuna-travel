import React from 'react';
import { Link } from 'react-router-dom';
import { 
  HomeIcon,
  ArrowLeftIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <ExclamationTriangleIcon className="w-24 h-24 text-yellow-500 mx-auto" />
        </div>

        {/* Error Number */}
        <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>

        {/* Error Message */}
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Sorry, the page you're looking for doesn't exist or has been moved. 
          Please check the URL or navigate back to our homepage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go to Homepage
          </Link>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Quick Links */}
        <div className="mt-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Pages</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/tours"
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
            >
              <div className="font-medium">Tours</div>
              <div className="text-sm text-gray-500">Explore our tours</div>
            </Link>
            <Link
              to="/transfers"
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
            >
              <div className="font-medium">Transfers</div>
              <div className="text-sm text-gray-500">Transportation services</div>
            </Link>
            <Link
              to="/blog"
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
            >
              <div className="font-medium">Blog</div>
              <div className="text-sm text-gray-500">Travel tips & stories</div>
            </Link>
            <Link
              to="/contact"
              className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow text-gray-700 hover:text-blue-600"
            >
              <div className="font-medium">Contact</div>
              <div className="text-sm text-gray-500">Get in touch</div>
            </Link>
          </div>
        </div>

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            Can't find what you're looking for?{' '}
            <Link to="/contact" className="font-medium underline hover:text-blue-600">
              Contact our support team
            </Link>{' '}
            and we'll be happy to help!
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;





















