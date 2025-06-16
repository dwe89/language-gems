-- eCommerce Database Schema for Language Gems
-- Products table for digital educational resources
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL, -- Price in pence (e.g., 1500 = £15.00)
  file_path TEXT, -- Path to the PDF/digital file in Supabase storage
  stripe_price_id TEXT, -- Stripe price ID for checkout
  tags TEXT[], -- Array of tags for categorization
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  thumbnail_url TEXT -- URL to the thumbnail image
);

-- Orders table for tracking purchases
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_session_id TEXT UNIQUE, -- Stripe checkout session ID
  stripe_payment_intent_id TEXT, -- Stripe payment intent ID
  status TEXT NOT NULL DEFAULT 'pending', -- pending, completed, failed, refunded
  total_cents INTEGER NOT NULL, -- Total amount in pence
  currency TEXT NOT NULL DEFAULT 'gbp',
  customer_email TEXT NOT NULL,
  customer_name TEXT,
  billing_address JSONB, -- Store billing address as JSON
  metadata JSONB, -- Additional order metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table for storing individual products in each order
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
  product_name TEXT NOT NULL, -- Store name at time of purchase
  product_price_cents INTEGER NOT NULL, -- Store price at time of purchase
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions table for premium access
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status TEXT NOT NULL, -- active, canceled, past_due, etc.
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  plan_name TEXT NOT NULL,
  plan_price_cents INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, stripe_subscription_id)
);

-- User carts table for persistent cart storage (optional)
CREATE TABLE IF NOT EXISTS public.user_carts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, product_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS products_slug_idx ON public.products (slug);
CREATE INDEX IF NOT EXISTS products_is_active_idx ON public.products (is_active);
CREATE INDEX IF NOT EXISTS products_created_at_idx ON public.products (created_at DESC);

CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders (user_id);
CREATE INDEX IF NOT EXISTS orders_status_idx ON public.orders (status);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);

CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items (order_id);
CREATE INDEX IF NOT EXISTS order_items_product_id_idx ON public.order_items (product_id);

CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS subscriptions_status_idx ON public.subscriptions (status);
CREATE INDEX IF NOT EXISTS subscriptions_stripe_subscription_id_idx ON public.subscriptions (stripe_subscription_id);

CREATE INDEX IF NOT EXISTS user_carts_user_id_idx ON public.user_carts (user_id);

-- Create triggers for updating timestamps
CREATE TRIGGER update_products_modtime
    BEFORE UPDATE ON public.products
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_orders_modtime
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_subscriptions_modtime
    BEFORE UPDATE ON public.subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_user_carts_modtime
    BEFORE UPDATE ON public.user_carts
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

-- Helper function to check if user has active subscription
CREATE OR REPLACE FUNCTION public.user_has_active_subscription(user_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  subscription_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO subscription_count
  FROM public.subscriptions
  WHERE user_id = user_id_param 
    AND status = 'active'
    AND current_period_end > NOW();
  
  RETURN subscription_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if user has purchased a product
CREATE OR REPLACE FUNCTION public.user_has_purchased_product(user_id_param UUID, product_id_param UUID)
RETURNS BOOLEAN AS $$
DECLARE
  purchase_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO purchase_count
  FROM public.order_items oi
  JOIN public.orders o ON oi.order_id = o.id
  WHERE o.user_id = user_id_param 
    AND oi.product_id = product_id_param
    AND o.status = 'completed';
  
  RETURN purchase_count > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 