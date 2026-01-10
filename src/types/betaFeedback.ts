/**
 * Enhanced Beta Feedback Types
 * @version 2.0
 * @date 2026-01-10
 */

export interface BrowserInfo {
  userAgent: string;
  language: string;
  platform: string;
  viewport: {
    width: number;
    height: number;
  };
  screen: {
    width: number;
    height: number;
  };
  timezone: string;
  timestamp: string;
}

export interface BetaFeedback {
  id?: number;
  
  // Core fields (existing)
  feedback: string;
  source: string;
  user_type: 'teacher' | 'student' | 'admin';
  rating?: number;
  category: 'bug-report' | 'feature-request' | 'general' | 'improvement';
  email?: string;
  user_id?: string;
  
  // Enhanced fields (NEW)
  screenshot_url?: string;
  browser_info?: BrowserInfo;
  page_url?: string;
  user_role?: string;
  expected_result?: string;
  actual_result?: string;
  steps_to_reproduce?: string[];
  
  created_at?: string;
}

export interface FeedbackSubmitRequest {
  feedback: string;
  source?: string;
  userType?: 'teacher' | 'student' | 'admin';
  rating?: number;
  category?: string;
  email?: string;
  screenshot_url?: string;
  browser_info?: BrowserInfo;
  page_url?: string;
  user_role?: string;
  expected_result?: string;
  actual_result?: string;
  steps_to_reproduce?: string[];
}

export interface FeedbackSubmitResponse {
  success: boolean;
  message: string;
}

export interface FeedbackStatsResponse {
  totalFeedback: number;
  recentFeedback: number;
  categoryBreakdown: Record<string, number>;
  sourceBreakdown: Record<string, number>;
  averageRating: number;
  recentItems: BetaFeedback[];
}

/**
 * Helper function to create browser info object
 */
export function getBrowserInfo(): BrowserInfo {
  if (typeof window === 'undefined') {
    return {
      userAgent: 'server',
      language: 'en',
      platform: 'server',
      viewport: { width: 0, height: 0 },
      screen: { width: 0, height: 0 },
      timezone: 'UTC',
      timestamp: new Date().toISOString()
    };
  }
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  };
}

/**
 * Validate screenshot file
 */
export function validateScreenshot(file: File): { valid: boolean; error?: string } {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload an image (PNG, JPG, GIF, WebP).' };
  }
  
  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'File is too large. Maximum size is 10MB.' };
  }
  
  return { valid: true };
}

/**
 * Format feedback for display in admin panel
 */
export function formatFeedbackForDisplay(feedback: BetaFeedback): string {
  let display = `**Category:** ${feedback.category}\n`;
  display += `**Source:** ${feedback.source}\n`;
  display += `**User:** ${feedback.user_type} (${feedback.user_role || 'unknown'})\n`;
  display += `**Page:** ${feedback.page_url || 'N/A'}\n`;
  
  if (feedback.rating) {
    display += `**Rating:** ${'⭐'.repeat(feedback.rating)}\n`;
  }
  
  display += `\n**Feedback:**\n${feedback.feedback}\n`;
  
  if (feedback.category === 'bug-report') {
    if (feedback.expected_result) {
      display += `\n**Expected:** ${feedback.expected_result}`;
    }
    if (feedback.actual_result) {
      display += `\n**Actual:** ${feedback.actual_result}`;
    }
    if (feedback.steps_to_reproduce && feedback.steps_to_reproduce.length > 0) {
      display += `\n**Steps to Reproduce:**\n`;
      feedback.steps_to_reproduce.forEach((step, i) => {
        display += `${i + 1}. ${step}\n`;
      });
    }
  }
  
  if (feedback.screenshot_url) {
    display += `\n**Screenshot:** ${feedback.screenshot_url}`;
  }
  
  if (feedback.browser_info) {
    display += `\n\n**Browser Info:**\n`;
    display += `- User Agent: ${feedback.browser_info.userAgent}\n`;
    display += `- Platform: ${feedback.browser_info.platform}\n`;
    display += `- Viewport: ${feedback.browser_info.viewport.width}x${feedback.browser_info.viewport.height}\n`;
    display += `- Timezone: ${feedback.browser_info.timezone}\n`;
  }
  
  return display;
}
