import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSuccessfulPayment(session);
        break;
      }
      
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment succeeded:', paymentIntent.id);
        break;
      }
      
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('Payment failed:', paymentIntent.id);
        await handleFailedPayment(paymentIntent);
        break;
      }
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  try {
    const customerEmail = session.customer_details?.email || session.metadata?.customer_email;
    const productIds = JSON.parse(session.metadata?.product_ids || '[]');
    const totalCents = parseInt(session.metadata?.total_cents || '0');

    if ((!customerEmail || customerEmail === 'guest') && !session.customer_details?.email) {
      console.error('No customer email found for guest purchase');
      return;
    }

    if (!productIds.length) {
      console.error('No product IDs found in session metadata');
      return;
    }

    // Use the actual email from customer_details for guest users
    const actualEmail = session.customer_details?.email || customerEmail;
    let userId = null;

    // Try to find user by email (for registered users)
    if (actualEmail && actualEmail !== 'guest') {
      const { data: user, error: userError } = await supabase
        .from('auth.users')
        .select('id')
        .eq('email', actualEmail)
        .single();

      if (!userError && user) {
        userId = user.id;
      }
    }

    // Get line items from Stripe
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
      expand: ['data.price.product'],
    });

    // Create order
    const orderData: any = {
      stripe_session_id: session.id,
      stripe_payment_intent_id: session.payment_intent,
      status: 'completed',
      total_cents: totalCents,
      currency: session.currency || 'gbp',
      customer_email: actualEmail,
      customer_name: session.customer_details?.name,
      billing_address: session.customer_details?.address,
      metadata: {
        stripe_session_id: session.id,
        payment_method_types: session.payment_method_types,
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
      return;
    }

    // Create order items
    const orderItems = [];
    for (const lineItem of lineItems.data) {
      const productMetadata = (lineItem.price?.product as Stripe.Product)?.metadata;
      const productId = productMetadata?.product_id;

      if (productId) {
        orderItems.push({
          order_id: order.id,
          product_id: productId,
          quantity: lineItem.quantity || 1,
          price_cents: lineItem.price?.unit_amount || 0
        });
      }
    }

    if (orderItems.length > 0) {
      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) {
        console.error('Error creating order items:', orderItemsError);
      }
    }

    // Clear user's cart (only for registered users)
    if (userId) {
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', userId);
    }

    console.log(`Order ${order.id} created successfully for ${customerEmail}`);

  } catch (error) {
    console.error('Error handling successful payment:', error);
  }
}

async function handleFailedPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    const customerEmail = paymentIntent.metadata?.customer_email;
    
    if (!customerEmail) {
      console.error('No customer email in failed payment metadata');
      return;
    }

    // Get user by email
    const { data: user, error: userError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', customerEmail)
      .single();

    if (userError) {
      console.error('Error finding user for failed payment:', userError);
      return;
    }

    // Create failed order record for tracking
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        stripe_payment_intent_id: paymentIntent.id,
        status: 'failed',
        total_cents: paymentIntent.amount,
        currency: paymentIntent.currency,
        customer_email: customerEmail,
        metadata: {
          failure_reason: paymentIntent.last_payment_error?.message,
          payment_intent_id: paymentIntent.id,
        }
      });

    if (orderError) {
      console.error('Error creating failed order record:', orderError);
    }

    console.log(`Failed payment recorded for ${customerEmail}: ${paymentIntent.id}`);

  } catch (error) {
    console.error('Error handling failed payment:', error);
  }
} 