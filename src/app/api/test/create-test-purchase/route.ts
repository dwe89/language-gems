import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Test endpoint only available in development' },
        { status: 403 }
      );
    }

    const { email, productIds } = await request.json();

    if (!email || !productIds || !Array.isArray(productIds)) {
      return NextResponse.json(
        { error: 'Email and productIds array are required' },
        { status: 400 }
      );
    }

    // Get the products to verify they exist
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('*')
      .in('id', productIds);

    if (productsError || !products || products.length === 0) {
      return NextResponse.json(
        { error: 'Products not found' },
        { status: 404 }
      );
    }

    // Calculate total
    const totalCents = products.reduce((total, product) => total + product.price_cents, 0);

    // Create a test order
    const testSessionId = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        stripe_session_id: testSessionId,
        stripe_payment_intent_id: `pi_test_${Date.now()}`,
        status: 'completed',
        total_cents: totalCents,
        currency: 'gbp',
        customer_email: email,
        customer_name: 'Test Customer',
        metadata: {
          is_test_purchase: true,
          created_by: 'test-endpoint'
        }
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating test order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create test order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = products.map(product => ({
      order_id: order.id,
      product_id: product.id,
      quantity: 1,
      price_cents: product.price_cents
    }));

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating test order items:', orderItemsError);
      return NextResponse.json(
        { error: 'Failed to create test order items' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      testSessionId,
      orderId: order.id,
      successUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/checkout/success?session_id=${testSessionId}`,
      message: 'Test purchase created successfully'
    });

  } catch (error) {
    console.error('Error creating test purchase:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 