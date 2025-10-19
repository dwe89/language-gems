/**
 * Check if a user is an admin
 * Currently checks if email matches danieletienne89@gmail.com
 * Can be extended to check roles, permissions, etc.
 */
export function isAdmin(userEmail?: string | null): boolean {
  if (!userEmail) return false;
  return userEmail === 'danieletienne89@gmail.com';
}

/**
 * Admin email constant for consistency
 */
export const ADMIN_EMAIL = 'danieletienne89@gmail.com';

