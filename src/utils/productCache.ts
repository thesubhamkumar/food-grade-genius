export interface CachedProduct {
  timestamp: number; // When it was cached
  data: any; // The product data
  source: 'primary' | 'secondary' | 'tertiary' | 'community';
  trustScore: number;
}

const CACHE_PREFIX = 'food_scanner_product_';
const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Save product to cache
export function cacheProduct(barcode: string, product: any, source: 'primary' | 'secondary' | 'tertiary' | 'community', trustScore: number): void {
  try {
    const cacheItem: CachedProduct = {
      timestamp: Date.now(),
      data: product,
      source,
      trustScore
    };
    
    localStorage.setItem(CACHE_PREFIX + barcode, JSON.stringify(cacheItem));
    
    // Also save to recently scanned list (keep last 20)
    let recentScans: string[] = [];
    try {
      const storedScans = localStorage.getItem('recent_scans');
      if (storedScans) {
        recentScans = JSON.parse(storedScans);
      }
    } catch (e) {
      console.error('Error parsing recent scans', e);
    }
    
    // Add to the front of the array (most recent first)
    recentScans = [barcode, ...recentScans.filter(code => code !== barcode)].slice(0, 20);
    localStorage.setItem('recent_scans', JSON.stringify(recentScans));
    
  } catch (error) {
    console.error('Error saving to cache:', error);
  }
}

// Get product from cache
export function getCachedProduct(barcode: string): CachedProduct | null {
  try {
    const cachedItem = localStorage.getItem(CACHE_PREFIX + barcode);
    if (!cachedItem) return null;
    
    const parsedItem: CachedProduct = JSON.parse(cachedItem);
    
    // Check if cache is expired
    if (Date.now() - parsedItem.timestamp > CACHE_EXPIRY) {
      // Remove expired item
      localStorage.removeItem(CACHE_PREFIX + barcode);
      return null;
    }
    
    return parsedItem;
  } catch (error) {
    console.error('Error retrieving from cache:', error);
    return null;
  }
}

// Get all recently scanned barcodes
export function getRecentScans(): string[] {
  try {
    const storedScans = localStorage.getItem('recent_scans');
    if (storedScans) {
      return JSON.parse(storedScans);
    }
  } catch (e) {
    console.error('Error parsing recent scans', e);
  }
  return [];
}

// Clear all cached data
export function clearCache(): void {
  try {
    // Get all localStorage keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    localStorage.removeItem('recent_scans');
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}
