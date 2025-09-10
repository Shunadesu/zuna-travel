import React from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

const RefreshButton = ({ onRefresh, loading = false }) => {
  return (
    <button
      onClick={onRefresh}
      disabled={loading}
      className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <ArrowPathIcon 
        className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} 
      />
      Refresh
    </button>
  );
};

export default RefreshButton;





















