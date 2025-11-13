/**
 * Cache Manager
 * Intelligent caching for API responses and assets
 */

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.cacheConfig = {
      notes: { ttl: 5 * 60 * 1000, maxSize: 100 }, // 5 minutes
      archive: { ttl: 10 * 60 * 1000, maxSize: 50 }, // 10 minutes
      search: { ttl: 2 * 60 * 1000, maxSize: 30 }, // 2 minutes
    };
  }

  set(key, value, category = 'notes') {
    const config = this.cacheConfig[category];
    const entry = {
      value,
      timestamp: Date.now(),
      category,
    };

    this.memoryCache.set(key, entry);
    this.cleanup(category, config.maxSize);
  }

  get(key, category = 'notes') {
    const entry = this.memoryCache.get(key);
    
    if (!entry) return null;
    
    const config = this.cacheConfig[category];
    const age = Date.now() - entry.timestamp;
    
    if (age > config.ttl) {
      this.memoryCache.delete(key);
      return null;
    }
    
    return entry.value;
  }

  cleanup(category, maxSize) {
    const entries = Array.from(this.memoryCache.entries())
      .filter(([, entry]) => entry.category === category)
      .sort((a, b) => a[1].timestamp - b[1].timestamp);

    if (entries.length > maxSize) {
      const toRemove = entries.slice(0, entries.length - maxSize);
      toRemove.forEach(([key]) => this.memoryCache.delete(key));
    }
  }

  clear(category = null) {
    if (category) {
      const toDelete = [];
      this.memoryCache.forEach((entry, key) => {
        if (entry.category === category) {
          toDelete.push(key);
        }
      });
      toDelete.forEach((key) => this.memoryCache.delete(key));
    } else {
      this.memoryCache.clear();
    }
  }

  getStats() {
    const stats = {};
    
    this.memoryCache.forEach((entry) => {
      if (!stats[entry.category]) {
        stats[entry.category] = 0;
      }
      stats[entry.category] += 1;
    });

    return {
      total: this.memoryCache.size,
      byCategory: stats,
    };
  }
}

export default new CacheManager();
