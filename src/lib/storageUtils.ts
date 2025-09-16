/**
 * Utility functions for Supabase Storage operations
 */

/**
 * Extracts the relative path from a full Supabase Storage public URL
 * 
 * @param fullUrl - Full public URL from Supabase Storage
 * @param bucketName - Name of the storage bucket (default: 'products')
 * @returns Relative path within the bucket
 */
export function extractStoragePath(fullUrl: string, bucketName: string = 'products'): string {
  if (!fullUrl) {
    throw new Error('File URL is required');
  }

  // Handle different URL formats
  const publicUrlPattern = `/storage/v1/object/public/${bucketName}/`;
  
  if (fullUrl.includes(publicUrlPattern)) {
    return fullUrl.split(publicUrlPattern)[1];
  }
  
  // If it's already a relative path, return as-is
  if (!fullUrl.startsWith('http')) {
    return fullUrl;
  }
  
  // Fallback: try to extract filename from URL
  const urlParts = fullUrl.split('/');
  const filename = urlParts[urlParts.length - 1];
  
  // Log warning for unexpected format
  console.warn('Unexpected storage URL format:', fullUrl);
  console.warn('Falling back to filename:', filename);
  
  return filename;
}

/**
 * Validates if a storage path is valid
 */
export function isValidStoragePath(path: string): boolean {
  if (!path || typeof path !== 'string') {
    return false;
  }
  
  // Should not start with http (should be relative)
  if (path.startsWith('http')) {
    return false;
  }
  
  // Should have some content
  return path.trim().length > 0;
}

/**
 * Creates a full public URL from a relative storage path
 */
export function createPublicUrl(relativePath: string, bucketName: string = 'products'): string {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not configured');
  }
  
  return `${baseUrl}/storage/v1/object/public/${bucketName}/${relativePath}`;
}

/**
 * Logs storage operation details for debugging
 */
export function logStorageOperation(operation: string, details: Record<string, any>): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[STORAGE ${operation.toUpperCase()}]`, details);
  }
}
