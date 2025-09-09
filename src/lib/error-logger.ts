// Error logging system for LanguageGems
// This module handles error logging for admin dashboard and debugging

export interface ErrorLogEntry {
  id: string;
  type: 'worksheet_generation' | 'api_error' | 'user_error' | 'system_error';
  message: string;
  userId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

// In-memory error storage (in production, you'd want to use a database)
const errorLogs: ErrorLogEntry[] = [];

/**
 * Generate a unique ID for error logs
 */
function generateErrorId(): string {
  return `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log an error entry
 */
function logError(
  type: ErrorLogEntry['type'],
  message: string,
  userId?: string,
  metadata?: Record<string, any>,
  severity: ErrorLogEntry['severity'] = 'medium'
): void {
  const errorEntry: ErrorLogEntry = {
    id: generateErrorId(),
    type,
    message,
    userId,
    metadata,
    timestamp: new Date().toISOString(),
    severity
  };

  errorLogs.push(errorEntry);
  
  // Keep only the last 1000 errors to prevent memory issues
  if (errorLogs.length > 1000) {
    errorLogs.splice(0, errorLogs.length - 1000);
  }

  // Log to console for immediate debugging
  console.error(`[ErrorLogger] ${type.toUpperCase()}: ${message}`, {
    userId,
    metadata,
    severity
  });
}

/**
 * Error Logger class with specific methods for different error types
 */
export class ErrorLogger {
  /**
   * Log worksheet generation errors
   */
  static worksheetGeneration(
    message: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    logError('worksheet_generation', message, userId, metadata, 'high');
  }

  /**
   * Log API errors
   */
  static apiError(
    message: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    logError('api_error', message, userId, metadata, 'medium');
  }

  /**
   * Log user errors (validation, input issues, etc.)
   */
  static userError(
    message: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    logError('user_error', message, userId, metadata, 'low');
  }

  /**
   * Log system errors (critical issues)
   */
  static systemError(
    message: string,
    userId?: string,
    metadata?: Record<string, any>
  ): void {
    logError('system_error', message, userId, metadata, 'critical');
  }

  /**
   * Get all error logs
   */
  static getAllErrors(): ErrorLogEntry[] {
    return [...errorLogs].reverse(); // Most recent first
  }

  /**
   * Get errors by type
   */
  static getErrorsByType(type: ErrorLogEntry['type']): ErrorLogEntry[] {
    return errorLogs.filter(error => error.type === type).reverse();
  }

  /**
   * Get errors by severity
   */
  static getErrorsBySeverity(severity: ErrorLogEntry['severity']): ErrorLogEntry[] {
    return errorLogs.filter(error => error.severity === severity).reverse();
  }

  /**
   * Get errors for a specific user
   */
  static getErrorsForUser(userId: string): ErrorLogEntry[] {
    return errorLogs.filter(error => error.userId === userId).reverse();
  }

  /**
   * Get recent errors (last N hours)
   */
  static getRecentErrors(hours: number = 24): ErrorLogEntry[] {
    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);
    return errorLogs
      .filter(error => new Date(error.timestamp) > cutoffTime)
      .reverse();
  }

  /**
   * Clear old errors (keep only last N days)
   */
  static clearOldErrors(days: number = 30): void {
    const cutoffTime = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const initialLength = errorLogs.length;
    
    for (let i = errorLogs.length - 1; i >= 0; i--) {
      if (new Date(errorLogs[i].timestamp) < cutoffTime) {
        errorLogs.splice(i, 1);
      }
    }
    
    const removedCount = initialLength - errorLogs.length;
    if (removedCount > 0) {
      console.log(`[ErrorLogger] Cleaned up ${removedCount} old error logs`);
    }
  }

  /**
   * Get error statistics
   */
  static getErrorStats(): {
    total: number;
    byType: Record<string, number>;
    bySeverity: Record<string, number>;
    last24Hours: number;
  } {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const stats = {
      total: errorLogs.length,
      byType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      last24Hours: 0
    };

    errorLogs.forEach(error => {
      // Count by type
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      
      // Count by severity
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
      
      // Count recent errors
      if (new Date(error.timestamp) > last24Hours) {
        stats.last24Hours++;
      }
    });

    return stats;
  }
}

// Clean up old errors every 6 hours
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => ErrorLogger.clearOldErrors(), 6 * 60 * 60 * 1000);
}
