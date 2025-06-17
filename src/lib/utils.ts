import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generates a username from a full name
 * If a suffix number is provided, it will be appended to the username
 * e.g. "John Smith" -> "JohnS" or "JohnS2" if suffix is 2
 */
export function generateUsername(fullName: string, suffix?: number): string {
  // Remove any non-alphanumeric characters and split by whitespace
  const nameParts = fullName
    .replace(/[^\w\s]/gi, '')
    .trim()
    .split(/\s+/);
  
  if (nameParts.length === 0) return '';
  
  let username = '';
  
  if (nameParts.length === 1) {
    // If there's only one part, use it as is
    username = nameParts[0];
  } else {
    // Otherwise, use first name + first letter of last name
    const firstName = nameParts[0];
    const lastInitial = nameParts[nameParts.length - 1][0];
    username = firstName + lastInitial;
  }
  
  // Add suffix if provided
  if (suffix && suffix > 1) {
    username += suffix;
  }
  
  return username;
}

/**
 * Utility function to log errors with detailed information
 * Handles Supabase errors, JavaScript errors, and unknown error types
 */
export function logError(message: string, error: unknown) {
  if (error && typeof error === 'object' && 'message' in error) {
    // Handle Supabase errors and JavaScript Error objects
    const errorObj = error as any;
    console.error(message, {
      message: errorObj.message || 'Unknown error',
      details: errorObj.details || undefined,
      hint: errorObj.hint || undefined,
      code: errorObj.code || undefined,
      name: errorObj.name || undefined,
      stack: errorObj.stack || undefined,
      ...(errorObj.error && { nestedError: errorObj.error })
    });
  } else if (typeof error === 'string') {
    console.error(message, { message: error });
  } else {
    console.error(message, { 
      message: 'Unknown error type',
      rawError: error,
      type: typeof error
    });
  }
} 