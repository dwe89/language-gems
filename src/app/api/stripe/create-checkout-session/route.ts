import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { items, customer_email } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'No items provided' },
        { status: 400 }
      );
    }

    // Verify products exist and are active
    const productIds = items.map(item => item.product_id);
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
      return NextResponse.json(
        { error: 'Some products are not available' },
        { status: 400 }
      );
    }

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

    // Create Stripe checkout session
    const sessionConfig: any = {
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cart`,
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

    const session = await stripe.checkout.sessions.create(sessionConfig);

    return NextResponse.json({ url: session.url });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 