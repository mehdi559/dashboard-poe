// Utilitaires pour optimiser les performances de l'application

// Debounce pour éviter les calculs excessifs
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle pour limiter la fréquence des appels
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Cache simple pour les calculs lourds
export class CalculationCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }

  get(key) {
    return this.cache.get(key);
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }
}

// Optimisation des calculs de filtrage
export const optimizeFiltering = (items, filters) => {
  // Indexation pour accélérer les recherches
  const indexedItems = items.reduce((acc, item, index) => {
    const key = `${item.category}-${item.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(index);
    return acc;
  }, {});

  // Application des filtres de manière optimisée
  let filtered = items;
  
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(item => 
      item.description.toLowerCase().includes(term) ||
      item.category.toLowerCase().includes(term)
    );
  }

  if (filters.category && filters.category !== 'all') {
    filtered = filtered.filter(item => item.category === filters.category);
  }

  return filtered;
};

// Optimisation des calculs de tri
export const optimizeSorting = (items, sortBy, sortOrder) => {
  return [...items].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    if (sortBy === 'date') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    } else if (sortBy === 'amount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};

// Optimisation des calculs de statistiques
export const optimizeStatistics = (expenses) => {
  const stats = {
    total: 0,
    byCategory: {},
    byDate: {},
    average: 0,
    count: expenses.length
  };

  expenses.forEach(expense => {
    stats.total += expense.amount;
    
    if (!stats.byCategory[expense.category]) {
      stats.byCategory[expense.category] = 0;
    }
    stats.byCategory[expense.category] += expense.amount;
    
    const date = expense.date;
    if (!stats.byDate[date]) {
      stats.byDate[date] = 0;
    }
    stats.byDate[date] += expense.amount;
  });

  stats.average = stats.count > 0 ? stats.total / stats.count : 0;
  
  return stats;
};

// Optimisation des calculs de pagination
export const optimizePagination = (items, page, itemsPerPage) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    items: items.slice(startIndex, endIndex),
    totalPages: Math.ceil(items.length / itemsPerPage),
    currentPage: page,
    hasNext: endIndex < items.length,
    hasPrev: page > 1
  };
};

// Hook personnalisé pour les calculs optimisés
export const useOptimizedCalculation = (calculation, dependencies, options = {}) => {
  const { cache = new CalculationCache(), debounceMs = 100 } = options;
  
  const memoizedCalculation = React.useMemo(() => {
    const cacheKey = JSON.stringify(dependencies);
    const cached = cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const result = calculation();
    cache.set(cacheKey, result);
    
    return result;
  }, dependencies);
  
  return memoizedCalculation;
};

// Optimisation des re-rendus
export const useOptimizedCallback = (callback, dependencies) => {
  return React.useCallback(callback, dependencies);
};

// Optimisation des valeurs memoizées
export const useOptimizedMemo = (calculation, dependencies) => {
  return React.useMemo(calculation, dependencies);
};

// Détection des fuites mémoire
export const useMemoryLeakDetection = () => {
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const interval = setInterval(() => {
        if (window.performance && window.performance.memory) {
          const memory = window.performance.memory;
          if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
            console.warn('Mémoire élevée détectée:', memory.usedJSHeapSize / 1024 / 1024, 'MB');
          }
        }
      }, 10000); // Vérifier toutes les 10 secondes
      
      return () => clearInterval(interval);
    }
  }, []);
};

export default {
  debounce,
  throttle,
  CalculationCache,
  optimizeFiltering,
  optimizeSorting,
  optimizeStatistics,
  optimizePagination,
  useOptimizedCalculation,
  useOptimizedCallback,
  useOptimizedMemo,
  useMemoryLeakDetection
}; 