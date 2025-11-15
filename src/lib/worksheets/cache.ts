// Simple caching system for worksheet generation
import { WorksheetRequest, WorksheetResponse } from './core/types';

interface CacheEntry {
  key: string;
  data: WorksheetResponse;
  timestamp: Date;
  expiresAt: Date;
}

// In-memory cache (in production, you might want to use Redis)
const worksheetCache = new Map<string, CacheEntry>();

// Cache configuration
const CACHE_DURATION_MINUTES = 60; // Cache worksheets for 1 hour
const MAX_CACHE_SIZE = 100; // Maximum number of cached worksheets

/**
 * Generate a cache key from a worksheet request
 */
export function generateCacheKey(request: WorksheetRequest): string {
  // Create a deterministic key based on request parameters
  const keyData = {
    subject: request.subject,
    topic: request.topic,
    subtopic: request.subtopic, // Include subtopic in cache key
    difficulty: request.difficulty,
    gradeLevel: request.gradeLevel,
    targetQuestionCount: request.targetQuestionCount,
    questionTypes: request.questionTypes?.sort(), // Sort for consistency
    targetLanguage: request.targetLanguage,
    customPrompt: request.customPrompt,
    customVocabulary: request.customVocabulary,
    // Include vocabulary system fields for more specific caching
    curriculumLevel: request.curriculumLevel,
    examBoard: request.examBoard,
    tier: request.tier,
    category: request.category,
    subcategory: request.subcategory
  };

  // Debug logging
  console.log(`[Cache] Generating cache key with data:`, JSON.stringify(keyData, null, 2));

  // Create a deterministic hash that works in both Node and Edge runtimes
  const keyString = JSON.stringify(keyData);
  const cacheKey = `worksheet_${stableHash(keyString)}`;

  console.log(`[Cache] Generated cache key: ${cacheKey}`);
  return cacheKey;
}

function stableHash(input: string): string {
  const FNV_PRIME = 16777619;
  const OFFSET_BASIS = 2166136261;

  let hash1 = OFFSET_BASIS;
  let hash2 = OFFSET_BASIS;

  for (let i = 0; i < input.length; i++) {
    const charCode = input.charCodeAt(i);
    hash1 ^= charCode;
    hash1 = (hash1 * FNV_PRIME) >>> 0;

    hash2 ^= charCode + i;
    hash2 = (hash2 * FNV_PRIME) >>> 0;
  }

  const combined = (hash1.toString(16).padStart(8, '0') + hash2.toString(16).padStart(8, '0')).padEnd(32, '0');
  return combined.slice(0, 32);
}

/**
 * Get a cached worksheet if it exists and is still valid
 */
export function getWorksheetCache(cacheKey: string): WorksheetResponse | null {
  const entry = worksheetCache.get(cacheKey);
  
  if (!entry) {
    return null;
  }

  // Check if cache entry has expired
  if (new Date() > entry.expiresAt) {
    worksheetCache.delete(cacheKey);
    console.log(`[Cache] Expired cache entry removed: ${cacheKey}`);
    return null;
  }

  console.log(`[Cache] Cache hit for key: ${cacheKey}`);
  return entry.data;
}

/**
 * Store a worksheet in the cache
 */
export function setWorksheetCache(cacheKey: string, worksheet: WorksheetResponse): void {
  // Check cache size and remove oldest entries if needed
  if (worksheetCache.size >= MAX_CACHE_SIZE) {
    cleanupOldestCacheEntries(10); // Remove 10 oldest entries
  }

  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_DURATION_MINUTES * 60 * 1000);

  const entry: CacheEntry = {
    key: cacheKey,
    data: worksheet,
    timestamp: now,
    expiresAt
  };

  worksheetCache.set(cacheKey, entry);
  console.log(`[Cache] Cached worksheet with key: ${cacheKey}, expires at: ${expiresAt.toISOString()}`);
}

/**
 * Remove expired cache entries
 */
export function cleanupExpiredCache(): void {
  const now = new Date();
  let removedCount = 0;

  for (const [key, entry] of worksheetCache.entries()) {
    if (now > entry.expiresAt) {
      worksheetCache.delete(key);
      removedCount++;
    }
  }

  if (removedCount > 0) {
    console.log(`[Cache] Cleaned up ${removedCount} expired cache entries`);
  }
}

/**
 * Remove the oldest cache entries
 */
function cleanupOldestCacheEntries(count: number): void {
  const entries = Array.from(worksheetCache.entries());
  
  // Sort by timestamp (oldest first)
  entries.sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime());
  
  // Remove the oldest entries
  const toRemove = entries.slice(0, count);
  toRemove.forEach(([key]) => {
    worksheetCache.delete(key);
  });

  if (toRemove.length > 0) {
    console.log(`[Cache] Removed ${toRemove.length} oldest cache entries to make space`);
  }
}

/**
 * Clear all cache entries
 */
export function clearWorksheetCache(): void {
  const size = worksheetCache.size;
  worksheetCache.clear();
  console.log(`[Cache] Cleared all cache entries (${size} entries removed)`);
}

/**
 * Get cache statistics
 */
export function getCacheStats(): {
  size: number;
  maxSize: number;
  entries: Array<{
    key: string;
    timestamp: string;
    expiresAt: string;
    worksheetTitle: string;
  }>;
} {
  const entries = Array.from(worksheetCache.values()).map(entry => ({
    key: entry.key,
    timestamp: entry.timestamp.toISOString(),
    expiresAt: entry.expiresAt.toISOString(),
    worksheetTitle: entry.data.worksheet.title
  }));

  return {
    size: worksheetCache.size,
    maxSize: MAX_CACHE_SIZE,
    entries
  };
}

/**
 * Check if a worksheet is cached
 */
export function isWorksheetCached(cacheKey: string): boolean {
  const entry = worksheetCache.get(cacheKey);
  return entry !== undefined && new Date() <= entry.expiresAt;
}

// Clean up expired cache entries every 15 minutes
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => cleanupExpiredCache(), 15 * 60 * 1000);
}
