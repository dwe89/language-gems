/**
 * Utility functions for consistent price formatting across the application
 */

/**
 * Formats price in cents to display format
 * Handles null, undefined, and NaN values gracefully
 * 
 * @param priceCents - Price in cents (can be null/undefined)
 * @param currency - Currency symbol (default: '£')
 * @returns Formatted price string
 */
export function formatPrice(priceCents: number | null | undefined, currency: string = '£'): string {
  // Handle null, undefined, or NaN values
  if (priceCents === null || priceCents === undefined || isNaN(priceCents)) {
    return 'FREE';
  }
  
  // Handle zero price
  if (priceCents === 0) {
    return 'FREE';
  }
  
  // Format positive prices
  return `${currency}${(priceCents / 100).toFixed(2)}`;
}

/**
 * Formats price for display in different contexts
 */
export function formatPriceWithContext(priceCents: number | null | undefined, context: 'cart' | 'product' | 'order' = 'product'): string {
  const basePrice = formatPrice(priceCents);
  
  if (basePrice === 'FREE') {
    switch (context) {
      case 'cart':
        return 'FREE';
      case 'product':
        return 'FREE';
      case 'order':
        return 'FREE';
      default:
        return 'FREE';
    }
  }
  
  return basePrice;
}

/**
 * Validates if a price value is valid
 */
export function isValidPrice(priceCents: any): boolean {
  return typeof priceCents === 'number' && !isNaN(priceCents) && priceCents >= 0;
}

/**
 * Converts price from pounds to cents
 */
export function poundsToCents(pounds: number): number {
  return Math.round(pounds * 100);
}

/**
 * Converts price from cents to pounds
 */
export function centsToPounds(cents: number): number {
  return cents / 100;
}
