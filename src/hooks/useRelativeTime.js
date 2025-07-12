import { useState, useEffect } from 'react'
import { formatRelativeTime } from '../utils/helpers'

const useRelativeTime = (createdAt, updateInterval = 60000) => {
  const [relativeTime, setRelativeTime] = useState('');
  
  useEffect(() => {
    // Initial calculation
    const updateTime = () => {
      setRelativeTime(formatRelativeTime(createdAt));
    };
    
    updateTime();
    
    // Set up interval for updates
    const interval = setInterval(updateTime, updateInterval);
    
    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [createdAt, updateInterval]);
  
  return relativeTime;
};

export default useRelativeTime;