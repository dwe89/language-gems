// Generation limits system for LanguageGems (free version)
// This module handles rate limiting for worksheet generation

export interface GenerationLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  message: string;
  resetTime?: Date;
}

export interface UserGenerationData {
  userId: string;
  count: number;
  lastReset: Date;
  type: 'worksheet' | 'assessment' | 'other';
}

// In-memory storage for generation tracking (in production, use database)
const generationTracker = new Map<string, UserGenerationData>();

// Configuration - generous limits for free users
const LIMITS = {
  worksheet: {
    guest: 5, // 5 worksheets per day for guests
    registered: 20, // 20 worksheets per day for registered users
    premium: -1 // Unlimited for premium users
  },
  assessment: {
    guest: 3,
    registered: 10,
    premium: -1
  }
};

/**
 * Get the daily limit for a user type and generation type
 */
function getDailyLimit(userType: 'guest' | 'registered' | 'premium', generationType: keyof typeof LIMITS): number {
  return LIMITS[generationType][userType];
}

/**
 * Get or create generation data for a user
 */
function getGenerationData(userId: string, type: keyof typeof LIMITS): UserGenerationData {
  const key = `${userId}_${type}`;
  let data = generationTracker.get(key);
  
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  if (!data || data.lastReset < today) {
    // Create new or reset for new day
    data = {
      userId,
      count: 0,
      lastReset: today,
      type
    };
    generationTracker.set(key, data);
  }
  
  return data;
}

/**
 * Check and enforce generation limits
 */
export async function enforceGenerationLimits(
  userId: string, 
  type: keyof typeof LIMITS,
  userType: 'guest' | 'registered' | 'premium' = 'registered'
): Promise<GenerationLimitResult> {
  try {
    const limit = getDailyLimit(userType, type);
    
    // Premium users have unlimited access
    if (limit === -1) {
      return {
        allowed: true,
        remaining: -1,
        limit: -1,
        message: 'Unlimited access'
      };
    }
    
    const data = getGenerationData(userId, type);
    const remaining = Math.max(0, limit - data.count);
    
    if (data.count >= limit) {
      const tomorrow = new Date(data.lastReset);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      return {
        allowed: false,
        remaining: 0,
        limit,
        message: `Daily limit of ${limit} ${type} generations reached. Limit resets tomorrow.`,
        resetTime: tomorrow
      };
    }
    
    return {
      allowed: true,
      remaining,
      limit,
      message: `${remaining} ${type} generations remaining today`
    };
  } catch (error) {
    console.error('[GenerationLimits] Error checking limits:', error);
    // On error, allow the operation but log it
    return {
      allowed: true,
      remaining: 0,
      limit: 0,
      message: 'Unable to check limits, allowing operation'
    };
  }
}

/**
 * Record a generation usage
 */
export async function recordGenerationUsage(
  userId: string, 
  type: keyof typeof LIMITS
): Promise<void> {
  try {
    const data = getGenerationData(userId, type);
    data.count += 1;
    
    const key = `${userId}_${type}`;
    generationTracker.set(key, data);
    
    console.log(`[GenerationLimits] Recorded ${type} usage for ${userId.substring(0, 8)}... (${data.count} used)`);
  } catch (error) {
    console.error('[GenerationLimits] Error recording usage:', error);
  }
}

/**
 * Get generation statistics for a user
 */
export async function getUserGenerationStats(userId: string): Promise<{
  worksheet: { used: number; limit: number; remaining: number };
  assessment: { used: number; limit: number; remaining: number };
}> {
  const worksheetData = getGenerationData(userId, 'worksheet');
  const assessmentData = getGenerationData(userId, 'assessment');
  
  // Assume registered user limits for stats
  const worksheetLimit = getDailyLimit('registered', 'worksheet');
  const assessmentLimit = getDailyLimit('registered', 'assessment');
  
  return {
    worksheet: {
      used: worksheetData.count,
      limit: worksheetLimit,
      remaining: Math.max(0, worksheetLimit - worksheetData.count)
    },
    assessment: {
      used: assessmentData.count,
      limit: assessmentLimit,
      remaining: Math.max(0, assessmentLimit - assessmentData.count)
    }
  };
}

/**
 * Clean up old generation data
 */
export function cleanupOldGenerationData(): void {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let cleanedCount = 0;
  
  for (const [key, data] of generationTracker.entries()) {
    if (data.lastReset < sevenDaysAgo) {
      generationTracker.delete(key);
      cleanedCount++;
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`[GenerationLimits] Cleaned up ${cleanedCount} old generation records`);
  }
}

/**
 * Get all generation statistics (for admin)
 */
export function getAllGenerationStats(): {
  totalUsers: number;
  totalGenerations: number;
  byType: Record<string, number>;
  activeToday: number;
} {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const allData = Array.from(generationTracker.values());
  const todayData = allData.filter(d => d.lastReset >= today);
  
  const byType: Record<string, number> = {};
  let totalGenerations = 0;
  
  allData.forEach(data => {
    byType[data.type] = (byType[data.type] || 0) + data.count;
    totalGenerations += data.count;
  });
  
  return {
    totalUsers: new Set(allData.map(d => d.userId)).size,
    totalGenerations,
    byType,
    activeToday: new Set(todayData.map(d => d.userId)).size
  };
}

// Clean up old data every 24 hours
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => cleanupOldGenerationData(), 24 * 60 * 60 * 1000);
}
