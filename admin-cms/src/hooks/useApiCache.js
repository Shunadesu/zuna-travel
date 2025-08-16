import { useEffect, useRef } from 'react';

export const useApiCache = (fetchFunction, dependencies = [], cacheTime = 5 * 60 * 1000) => {
  const lastFetchRef = useRef(0);
  const cacheExpiryRef = useRef(cacheTime);

  useEffect(() => {
    const now = Date.now();
    const shouldFetch = now - lastFetchRef.current > cacheExpiryRef.current;
    
    if (shouldFetch) {
      fetchFunction();
      lastFetchRef.current = now;
    }
  }, dependencies);

  const refresh = () => {
    lastFetchRef.current = 0; // Force refresh
    fetchFunction();
  };

  return { refresh };
};

