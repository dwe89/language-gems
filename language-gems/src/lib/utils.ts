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