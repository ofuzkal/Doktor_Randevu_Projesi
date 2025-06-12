// Performance optimization utilities

import React, { useCallback, useMemo, useRef, useEffect } from 'react';

// Debounce hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttle hook
export const useThrottle = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): T => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastExecRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastExecRef.current > delay) {
        lastExecRef.current = now;
        return func(...args);
      } else if (!timeoutRef.current) {
        timeoutRef.current = setTimeout(() => {
          lastExecRef.current = Date.now();
          timeoutRef.current = null;
          func(...args);
        }, delay - (now - lastExecRef.current));
      }
    }) as T,
    [func, delay]
  );
};

// Memoized selector hook
export const useMemoizedSelector = <T, R>(
  selector: (state: T) => R,
  state: T
): R => {
  return useMemo(() => selector(state), [selector, state]);
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = (
  itemCount: number,
  itemHeight: number,
  containerHeight: number,
  scrollTop: number
) => {
  return useMemo(() => {
    const visibleItemCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(startIndex + visibleItemCount, itemCount - 1);
    const offsetY = startIndex * itemHeight;

    return {
      startIndex,
      endIndex,
      offsetY,
      visibleItemCount
    };
  }, [itemCount, itemHeight, containerHeight, scrollTop]);
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
): boolean => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(elementRef.current);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
};

// Local storage with expiration
export const setLocalStorageWithExpiry = (
  key: string,
  value: any,
  ttl: number
): void => {
  const now = new Date();
  const item = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getLocalStorageWithExpiry = (key: string): any => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;

  try {
    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
};

// Image lazy loading
export const useImageLazyLoad = (src: string): {
  imageSrc: string;
  isLoaded: boolean;
  isError: boolean;
} => {
  const [imageSrc, setImageSrc] = React.useState<string>('');
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [isError, setIsError] = React.useState<boolean>(false);

  useEffect(() => {
    const img = new Image();
    
    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setIsError(false);
    };
    
    img.onerror = () => {
      setIsError(true);
      setIsLoaded(false);
    };
    
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageSrc, isLoaded, isError };
};

// Component performance monitoring
export const usePerformanceMonitor = (componentName: string) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);

  useEffect(() => {
    renderStartTime.current = performance.now();
    renderCount.current += 1;
  });

  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${componentName} render #${renderCount.current}: ${renderTime.toFixed(2)}ms`);
      
      if (renderTime > 16) { // 60fps threshold
        console.warn(`${componentName} render took longer than 16ms: ${renderTime.toFixed(2)}ms`);
      }
    }
  });
};

// Bundle analyzer helper
export const measureBundleSize = async (): Promise<void> => {
  if (process.env.NODE_ENV === 'development') {
    try {
      // Dynamic import for optional dependency
      console.log('Bundle analysis would be performed here');
      // const bundleAnalyzer = await import('webpack-bundle-analyzer');
    } catch (error) {
      console.log('webpack-bundle-analyzer not available');
    }
  }
};

// Memory usage monitoring
export const useMemoryMonitor = (): {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
} => {
  const [memoryInfo, setMemoryInfo] = React.useState({
    usedJSHeapSize: 0,
    totalJSHeapSize: 0,
    jsHeapSizeLimit: 0
  });

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};

// Preload critical resources
export const preloadResource = (href: string, as: string): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.href = href;
  link.as = as;
  document.head.appendChild(link);
};

// Code splitting helper
export const loadComponentAsync = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> => {
  return React.lazy(importFunc);
};

// Web Worker helper
export const useWebWorker = (workerScript: string) => {
  const workerRef = useRef<Worker | null>(null);
  const [isSupported, setIsSupported] = React.useState<boolean>(false);

  useEffect(() => {
    if (typeof Worker !== 'undefined') {
      setIsSupported(true);
      workerRef.current = new Worker(workerScript);
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, [workerScript]);

  const postMessage = useCallback((message: any) => {
    if (workerRef.current) {
      workerRef.current.postMessage(message);
    }
  }, []);

  const onMessage = useCallback((handler: (event: MessageEvent) => void) => {
    if (workerRef.current) {
      workerRef.current.onmessage = handler;
    }
  }, []);

  return { postMessage, onMessage, isSupported };
};

// Service Worker registration
export const registerServiceWorker = async (): Promise<void> => {
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully:', registration);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }
};

// Critical CSS inlining
export const inlineCriticalCSS = (css: string): void => {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
};

// DNS prefetch helper
export const dnsPrefetch = (domain: string): void => {
  const link = document.createElement('link');
  link.rel = 'dns-prefetch';
  link.href = domain;
  document.head.appendChild(link);
};

// React import (should be at the top, but here for compilation)
// import React from 'react'; 