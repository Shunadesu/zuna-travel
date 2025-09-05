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
      return;
    }

    setIsWarmingUp(true);
    setWarmupError(null);

    try {
      const startTime = Date.now();
      const response = await apiClient.get('/warmup');
      const endTime = Date.now();
      
      console.log(`🚀 Server warmup completed in ${endTime - startTime}ms`, response.data);
      
      // Mark as warmed up in this session
      sessionStorage.setItem('server-warmed-up', 'true');
      setIsServerReady(true);
      
      // Auto-hide loader after showing success animation
      setTimeout(() => {
        setIsWarmingUp(false);
      }, 2500); // Show success animation for 2.5 seconds
    } catch (error) {
      console.error('❌ Server warmup failed:', error);
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
      setIsServerReady(true);
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
