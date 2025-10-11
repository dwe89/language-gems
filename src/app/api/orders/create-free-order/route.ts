import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('Free order creation request received');
    
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

    // Verify all products are free
    const nonFreeProducts = products.filter(p => p.price_cents > 0);
    if (nonFreeProducts.length > 0) {
      console.log('Non-free products found:', nonFreeProducts.map(p => p.name));
      return NextResponse.json(
        { error: 'This endpoint only handles free products' },
        { status: 400 }
      );
    }

    console.log('Products validated successfully');

    // Calculate total (should be 0 for free products)
    const totalCents = items.reduce((total, item) => {
      const product = products.find(p => p.id === item.product_id);
      return total + (product.price_cents * item.quantity);
    }, 0);

    let userId = null;

    // Try to find user by email (for registered users)
    if (customer_email && customer_email !== 'guest') {
      // First try to get user ID from user_profiles table
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', customer_email)
        .single();

      if (!profileError && profile) {
        userId = profile.user_id;
      } else {
        // Fallback to auth.users query (though this might not work with RLS)
        const { data: user, error: userError } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', customer_email)
          .single();

        if (!userError && user) {
          userId = user.id;
        }
      }
      
      console.log(`User lookup for ${customer_email}: ${userId ? 'found' : 'not found'}`);
    }

    // Create order
    const orderData: any = {
      stripe_session_id: null,
      stripe_payment_intent_id: null,
      status: 'completed',
      total_cents: totalCents,
      currency: 'gbp',
      customer_email: customer_email || 'guest',
      customer_name: null,
      billing_address: null,
      metadata: {
        is_free_order: true,
        is_guest_purchase: !userId,
      }
    };

    // Only set user_id if we have a registered user
    if (userId) {
      orderData.user_id = userId;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Create order items
    const orderItems = items.map(item => {
      const product = products.find(p => p.id === item.product_id);
      
      return {
        order_id: order.id,
        product_id: product.id,
        product_name: product.name,
        product_price_cents: product.price_cents,
        quantity: item.quantity,
      };
    });

    const { error: orderItemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (orderItemsError) {
      console.error('Error creating order items:', orderItemsError);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Clear user's cart (only for registered users)
    if (userId) {
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', userId);
    }

    console.log(`Free order ${order.id} created successfully for ${customer_email}`);

    // Send order confirmation email with download links
    await sendOrderConfirmationEmail(order, orderItems, customer_email || 'guest');

    return NextResponse.json({
      order_id: order.id,
      status: 'completed',
      message: 'Free order created successfully'
    });

  } catch (error: any) {
    console.error('Error creating free order:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

async function sendOrderConfirmationEmail(order: any, orderItems: any[], customerEmail: string) {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.languagegems.com';

    if (!BREVO_API_KEY) {
      console.error('BREVO_API_KEY not configured');
      return;
    }

    // Get product details for each order item
    const { data: products } = await supabase
      .from('products')
      .select('id, name, file_path')
      .in('id', orderItems.map(item => item.product_id));

    if (!products || products.length === 0) {
      console.error('No products found for order items');
      return;
    }

    // Format total price
    const totalFormatted = order.total_cents === 0 ? 'FREE' : `£${(order.total_cents / 100).toFixed(2)}`;

    // Format order date
    const orderDate = new Date(order.created_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Send email for first product (for now - can be enhanced to send multiple products in one email later)
    const firstProduct = products[0];
    const downloadUrl = `${BASE_URL}/api/orders/${order.id}/download/${firstProduct.id}`;

    // Send email via Brevo
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        templateId: 15, // Order confirmation template
        to: [{ email: customerEmail, name: order.customer_name || customerEmail }],
        params: {
          customer_name: order.customer_name || '',
          customer_email: customerEmail,
          order_id: order.id,
          order_date: orderDate,
          total: totalFormatted,
          product_name: firstProduct.name,
          download_url: downloadUrl,
          account_url: `${BASE_URL}/account/orders`
        }
      }),
    });

    if (response.ok) {
      console.log(`✅ Order confirmation email sent to ${customerEmail} for order ${order.id}`);
    } else {
      const errorData = await response.json();
      console.error('❌ Failed to send order confirmation email:', errorData);
    }

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    // Don't throw - email failure shouldn't break the order process
  }
}