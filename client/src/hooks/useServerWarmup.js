import { useState, useEffect, useCallback } from 'react';
import apiClient from '../utils/apiUtils';

const useServerWarmup = () => {
  const [isWarmingUp, setIsWarmingUp] = useState(false);
  const [isServerReady, setIsServerReady] = useState(false);
  const [warmupError, setWarmupError] = useState(null);

  const warmupServer = useCallback(async () => {
    // Check if we already warmed up in this session
    const sessionWarmedUp = sessionStorage.getItem('server-warmed-up');
    if (sessionWarmedUp === 'true') {
      setIsServerReady(true);
      setIsWarmingUp(false);
      return;
    }

    setIsWarmingUp(true);
    setWarmupError(null);

    // Set maximum loading time to 10 seconds
    const maxLoadingTime = 10000; // 10 seconds
    const loadingTimeout = setTimeout(() => {
      console.log('⏰ Loading UI timeout after 10s, continuing warmup in background');
      setIsWarmingUp(false); // Hide loading UI
      setIsServerReady(true); // Allow app to continue
    }, maxLoadingTime);

    try {
      const startTime = Date.now();
      const response = await apiClient.get('/warmup');
      const endTime = Date.now();
      
      console.log(`🚀 Server warmup completed in ${endTime - startTime}ms`, response.data);
      
      // Clear the timeout since we got a response
      clearTimeout(loadingTimeout);
      
      // Mark as warmed up in this session
      sessionStorage.setItem('server-warmed-up', 'true');
      setIsServerReady(true);
      
      // Show success animation briefly then hide
      setTimeout(() => {
        setIsWarmingUp(false);
      }, 1000); // Show success animation for 1 second
    } catch (error) {
      console.error('❌ Server warmup failed:', error);
      
      // Clear the timeout since we got an error
      clearTimeout(loadingTimeout);
      
      setWarmupError(error.response?.data?.message || 'Failed to warm up server');
      // Still mark as ready to prevent infinite loading
      setIsServerReady(true);
      setIsWarmingUp(false);
    }
  }, []);

  // Auto warmup on mount if needed
  useEffect(() => {
    const sessionWarmedUp = sessionStorage.getItem('server-warmed-up');
    if (sessionWarmedUp !== 'true') {
      warmupServer();
    } else {
      // Already warmed up, set ready immediately
      setIsServerReady(true);
      setIsWarmingUp(false);
    }
  }, [warmupServer]);

  return {
    isWarmingUp,
    isServerReady,
    warmupError,
    warmupServer
  };
};

export default useServerWarmup;
