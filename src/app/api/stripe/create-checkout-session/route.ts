import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Validate environment variables
const validateEnvVars = () => {
  const required = [
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_SUPABASE_URL', 
    'SUPABASE_SERVICE_ROLE_KEY'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

try {
  validateEnvVars();
} catch (error) {
  console.error('Environment validation failed:', error);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout session request received');
    
    // Log environment variable status (without exposing values)
    console.log('Environment check:', {
      hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'undefined'
    });

    const { items, customer_email } = await request.json();
    console.log('Request data:', { itemCount: items?.length, hasEmail: !!customer_email });

    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items provided');
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Verify products exist and are active
    const productIds = items.map(item => item.product_id);
    console.log('Fetching products:', productIds);
    
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds)
      .eq('is_active', true);

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json(
        { error: 'Failed to validate products' },
        { status: 500 }
      );
    }

    if (!products || products.length !== productIds.length) {
      console.log('Product validation failed:', { 
        requested: productIds.length, 
        found: products?.length || 0 
      });
      return NextResponse.json(
        { error: 'Some products are not available' },
        { status: 400 }
      );
    }

    console.log('Products validated successfully');

    // Create Stripe line items
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
      const product = products.find(p => p.id === item.product_id);
      
      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: product.name,
            description: product.description || undefined,
            metadata: {
              product_id: product.id,
            },
          },
          unit_amount: product.price_cents,
        },
        quantity: item.quantity,
      };
    });

    // Calculate total for metadata
    const totalCents = items.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      return total + (product.price_cents * item.quantity);
    }, 0);

    // Get base URL - fallback to request origin if env var not set
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
                    `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    
    console.log('Using base URL:', baseUrl);

    // Create Stripe checkout session
    const sessionConfig: any = {
      line_items: lineItems,
      mode: 'payment',
      success_url: `${baseUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart`,
      metadata: {
        customer_email: customer_email || 'guest',
        product_ids: JSON.stringify(productIds),
        total_cents: totalCents.toString(),
      },
      payment_intent_data: {
        metadata: {
          customer_email: customer_email || 'guest',
          product_ids: JSON.stringify(productIds),
        },
      },
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    };

    // Only set customer_email if provided (for registered users)
    if (customer_email) {
      sessionConfig.customer_email = customer_email;
    }

    console.log('Creating Stripe session...');
    const session = await stripe.checkout.sessions.create(sessionConfig);
    console.log('Stripe session created successfully:', session.id);

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    // More detailed error information
    const errorDetails: Record<string, any> = {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error?.constructor?.name || 'Unknown',
    };
    
    if (error && typeof error === 'object' && 'code' in error) {
      errorDetails.code = (error as any).code;
    }
    
    if (error && typeof error === 'object' && 'type' in error) {
      errorDetails.stripeType = (error as any).type;
    }
    
    console.error('Detailed error:', errorDetails);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? errorDetails : undefined
      },
      { status: 500 }
    );
  }
} 