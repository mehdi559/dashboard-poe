import React, { memo, useCallback, useMemo } from 'react';

// Hook pour optimiser les calculs lourds
export const useOptimizedCalculation = (calculation, dependencies, options = {}) => {
  const { debounceMs = 100, maxCacheSize = 50 } = options;
  
  const [cache, setCache] = React.useState(new Map());
  const [lastCalculation, setLastCalculation] = React.useState(null);
  
  const memoizedCalculation = useMemo(() => {
    // Vérifier le cache
    const cacheKey = JSON.stringify(dependencies);
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    
    // Effectuer le calcul
    const result = calculation();
    
    // Mettre en cache
    if (cache.size >= maxCacheSize) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    cache.set(cacheKey, result);
    
    return result;
  }, dependencies);
  
  return memoizedCalculation;
};

// Composant pour éviter les re-rendus inutiles
export const OptimizedComponent = memo(({ children, ...props }) => {
  return React.cloneElement(children, props);
});

// Hook pour la virtualisation des listes longues
export const useVirtualization = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
      style: {
        position: 'absolute',
        top: (startIndex + index) * itemHeight,
        height: itemHeight,
        width: '100%'
      }
    }));
  }, [items, scrollTop, itemHeight, containerHeight]);
  
  const totalHeight = items.length * itemHeight;
  
  return {
    visibleItems,
    totalHeight,
    onScroll: useCallback((e) => {
      setScrollTop(e.target.scrollTop);
    }, [])
  };
};

// Composant pour la lazy loading
export const LazyComponent = memo(({ 
  children, 
  fallback = null, 
  threshold = 0.1,
  rootMargin = '50px'
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef();
  
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );
    
    if (ref.current) {
      observer.observe(ref.current);
    }
    
    return () => observer.disconnect();
  }, [threshold, rootMargin]);
  
  return (
    <div ref={ref}>
      {isVisible ? children : fallback}
    </div>
  );
});

// Hook pour optimiser les animations
export const useOptimizedAnimation = (duration = 300) => {
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  const startAnimation = useCallback(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);
  
  return { isAnimating, startAnimation };
};

// Composant pour la gestion des états de chargement
export const LoadingBoundary = memo(({ 
  isLoading, 
  children, 
  fallback = null,
  delay = 200 
}) => {
  const [showLoading, setShowLoading] = React.useState(false);
  
  React.useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => setShowLoading(true), delay);
      return () => clearTimeout(timer);
    } else {
      setShowLoading(false);
    }
  }, [isLoading, delay]);
  
  if (showLoading) {
    return fallback;
  }
  
  return children;
});

export default {
  useOptimizedCalculation,
  OptimizedComponent,
  useVirtualization,
  LazyComponent,
  useOptimizedAnimation,
  LoadingBoundary
}; 