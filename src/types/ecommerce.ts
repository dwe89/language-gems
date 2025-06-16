// eCommerce Types for Language Gems

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price_cents: number;
  file_path: string | null;
  stripe_product_id: string | null;
  stripe_price_id: string | null;
  tags: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  stripe_session_id: string | null;
  stripe_payment_intent_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  total_cents: number;
  currency: string;
  customer_email: string;
  customer_name: string | null;
  billing_address: any | null; // JSON object
  metadata: any | null; // JSON object
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price_cents: number;
  quantity: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_customer_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  plan_name: string;
  plan_price_cents: number;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product?: Product; // Joined product data
}

// For local cart management (before user authentication)
export interface LocalCartItem {
  product: Product;
  quantity: number;
}

// Form types for admin
export interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  price_cents: number;
  tags: string;
  is_active: boolean;
  file?: File | null;
  create_stripe_product?: boolean;
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & { product?: Product })[];
}

// Stripe types
export interface StripeLineItem {
  price_data: {
    currency: string;
    product_data: {
      name: string;
      description?: string;
    };
    unit_amount: number;
  };
  quantity: number;
}

export interface CheckoutSessionData {
  items: LocalCartItem[];
  user_id?: string;
  customer_email?: string;
}

// User subscription helper type
export interface UserAccess {
  hasActiveSubscription: boolean;
  hasAccessToDashboard: boolean;
  purchasedProducts: string[]; // Array of product IDs
}

// Admin guard type
export interface AdminUser {
  id: string;
  email: string;
  isAdmin: boolean;
} 