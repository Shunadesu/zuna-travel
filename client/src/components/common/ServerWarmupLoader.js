import React, { useState, useEffect } from 'react';
import { 
  CloudIcon, 
  BoltIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

const ServerWarmupLoader = ({ isWarmingUp, isServerReady, warmupError, onRetry }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const steps = [
    "Đang kết nối...",
    "Khởi động server...",
    "Tải dữ liệu...",
    "Hoàn tất!"
  ];

  // Progress animation
  useEffect(() => {
    if (isWarmingUp) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 15;
        });
      }, 200);

      return () => clearInterval(interval);
    } else if (isServerReady && !warmupError && !isWarmingUp) {
      setProgress(100);
      setShowSuccess(true);
    }
  }, [isWarmingUp, isServerReady, warmupError]);

  // Step animation
  useEffect(() => {
    if (isWarmingUp) {
      const stepInterval = setInterval(() => {
        setCurrentStep(prev => (prev + 1) % steps.length);
      }, 1500);

      return () => clearInterval(stepInterval);
    }
  }, [isWarmingUp]);

  // Auto-hide success animation after delay
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 1500); // Show success for 1.5 seconds
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Don't show anything when everything is done
  if (!isWarmingUp && isServerReady && !warmupError && !showSuccess) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-50 flex items-center justify-center">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-200 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="text-center max-w-lg mx-auto px-6 relative z-10">
        {/* Main Icon with advanced animations */}
        <div className="mb-8 relative">
          {isWarmingUp && (
            <div className="relative">
              {/* Outer rotating ring */}
              <div className="absolute inset-0 w-24 h-24 mx-auto border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
              
              {/* Inner pulsing cloud */}
              <div className="relative w-20 h-20 mx-auto">
                <CloudIcon className="h-20 w-20 text-blue-500 animate-pulse" />
                
                {/* Lightning bolt */}
                <BoltIcon className="h-8 w-8 text-yellow-400 absolute top-2 right-2 animate-bounce" />
                
                {/* Sparkles around cloud */}
                <SparklesIcon className="h-4 w-4 text-yellow-300 absolute -top-1 -left-1 animate-ping" />
                <SparklesIcon className="h-3 w-3 text-yellow-300 absolute -bottom-1 -right-1 animate-ping" style={{ animationDelay: '0.5s' }} />
                <SparklesIcon className="h-3 w-3 text-yellow-300 absolute top-1/2 -left-2 animate-ping" style={{ animationDelay: '1s' }} />
              </div>
            </div>
          )}
          
          {showSuccess && (
            <div className="relative">
              <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto animate-bounce" />
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-green-200 rounded-full animate-ping"></div>
            </div>
          )}
          
          {warmupError && (
            <div className="relative">
              <ExclamationTriangleIcon className="h-20 w-20 text-red-500 mx-auto animate-pulse" />
              <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-red-200 rounded-full animate-ping"></div>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isWarmingUp && (
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500 ease-out relative"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mt-2">
              {Math.round(Math.min(progress, 100))}%
            </div>
          </div>
        )}

        {/* Dynamic Title with typing effect */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          {isWarmingUp && (
            <span className="animate-pulse">
              {steps[currentStep]}
            </span>
          )}
          {showSuccess && (
            <span className="animate-bounce">
              🎉 Server đã sẵn sàng!
            </span>
          )}
          {warmupError && (
            <span className="animate-pulse text-red-600">
              ⚠️ Lỗi khởi động server
            </span>
          )}
        </h2>

        {/* Description with fade effect */}
        <div className="mb-8">
          {isWarmingUp && (
            <div className="space-y-2">
              <p className="text-gray-600 text-lg animate-fade-in">
                🚀 Đang đánh thức server từ chế độ ngủ...
              </p>
              <p className="text-gray-500 text-sm">
                ⏱️ Thời gian dự kiến: 2-5 giây
              </p>
            </div>
          )}
          
          {showSuccess && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-green-600 text-lg font-medium">
                ✨ Chào mừng bạn đến với Zuna Travel!
              </p>
              <p className="text-gray-500 text-sm">
                🎯 Trải nghiệm du lịch tuyệt vời đang chờ bạn
              </p>
            </div>
          )}
          
          {warmupError && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-red-600 text-lg">
                ❌ Không thể kết nối đến server
              </p>
              <p className="text-gray-500 text-sm">
                🔄 Vui lòng kiểm tra kết nối và thử lại
              </p>
            </div>
          )}
        </div>

        {/* Advanced loading animation */}
        {isWarmingUp && (
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-bounce"
                  style={{ 
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Retry button with enhanced styling */}
        {warmupError && onRetry && (
          <button
            onClick={onRetry}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            🔄 Thử lại
          </button>
        )}

        {/* Success countdown */}
        {showSuccess && (
          <div className="text-sm text-gray-500 animate-fade-in">
            <div className="flex items-center justify-center space-x-2">
              <RocketLaunchIcon className="h-4 w-4 animate-bounce" />
              <span>Đang chuyển hướng...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerWarmupLoader;
