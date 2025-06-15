import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '../../../../lib/supabase-server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json(
      { error: 'Missing Stripe signature' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    );
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    
    try {
      // Get customer email and product ID from the session
      const customerEmail = session.customer_details?.email;
      const productId = session.metadata?.productId;

      if (!customerEmail || !productId) {
        console.error('Missing customer email or product ID');
        return NextResponse.json(
          { error: 'Missing required session data' },
          { status: 400 }
        );
      }

      // Create purchase record
      const supabase = await createClient();
      const { error } = await supabase
        .from('purchases')
        .insert({
          user_email: customerEmail,
          product_id: productId,
          stripe_session_id: session.id,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        });

      if (error) {
        console.error('Error creating purchase record:', error);
        return NextResponse.json(
          { error: 'Failed to create purchase record' },
          { status: 500 }
        );
      }

      console.log('Purchase recorded successfully for:', customerEmail);
    } catch (error) {
      console.error('Error processing webhook:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
} 