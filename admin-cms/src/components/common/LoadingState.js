import React from 'react';

const LoadingState = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className={`animate-spin rounded-full border-b-2 border-blue-600 ${sizeClasses[size]} mx-auto mb-4`}></div>
        <p className="text-gray-500">{text}</p>
      </div>
    </div>
  );
};

export default LoadingState;

