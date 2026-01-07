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

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');

  let event: Stripe.Event;

  // In development, we might not have proper webhook setup
  if (process.env.NODE_ENV === 'development' && (!endpointSecret || endpointSecret === 'whsec_dev_placeholder')) {
    console.log('⚠️ Development mode: Skipping webhook signature verification');
    try {
      event = JSON.parse(body);
    } catch (err) {
      console.error('Failed to parse webhook body:', err);
      return NextResponse.json(
        { error: 'Invalid JSON' },
        { status: 400 }
      );
    }
  } else {
    // Production: Verify webhook signature
    if (!sig || !endpointSecret) {
      console.error('Missing webhook signature or secret');
      return NextResponse.json(
        { error: 'Missing signature or secret' },
        { status: 400 }
      );
    }

    try {
      event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Filter by source - only process LanguageGems events
        // Both LanguageGems and SecondaryMFL share the same Stripe account
        const source = session.metadata?.source;
        if (source !== 'language-gems') {
          console.log(`⏭️ Ignoring event from source: ${source || 'unknown'} (not language-gems)`);
          return NextResponse.json({ received: true, skipped: true });
        }

        console.log('✅ Processing LanguageGems checkout.session.completed');
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
    // NOTE: We query user_profiles because auth.users is not directly queryable
    if (actualEmail && actualEmail !== 'guest') {
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('user_id')
        .eq('email', actualEmail)
        .single();

      if (!profileError && profile) {
        userId = profile.user_id;
        console.log('Found user by email in user_profiles:', userId);
      } else {
        console.log('Could not find user by email in user_profiles:', actualEmail, profileError?.message);
      }
    }

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

    // Create order items using product IDs from session metadata
    const orderItems = [];

    // Get product details from Supabase
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, price_cents, resource_type, slug')
      .in('id', productIds);

    if (productsError) {
      console.error('Error fetching products:', productsError);
    } else if (products && products.length > 0) {
      // Create order items for each product in the session
      for (const product of products) {
        orderItems.push({
          order_id: order.id,
          product_id: product.id,
          product_name: product.name,
          product_price_cents: product.price_cents,
          quantity: 1 // For digital products, quantity is always 1
        });
      }

      // Insert order items
      if (orderItems.length > 0) {
        const { error: orderItemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (orderItemsError) {
          console.error('Error creating order items:', orderItemsError);
        } else {
          console.log(`Created ${orderItems.length} order items for order ${order.id}`);
        }
      }
    }

    // Clear user's cart (only for registered users)
    if (userId) {
      await supabase
        .from('user_carts')
        .delete()
        .eq('user_id', userId);

      // Check if this is a Subscription purchase (Pro or Student)
      const isProPlan = productIds.includes('prod_TZhA4ZGf1OfnX9');
      // We need to fetch the products to check their slugs/types if not hardcoded IDs
      // But we already fetched products above for order items. 
      // Let's refine the logic to check if ANY product is a subscription type from the DB result 'products'

      const subscriptionProduct = products?.find((p: any) =>
        p.resource_type === 'Subscription' ||
        productIds.includes('prod_TZhA4ZGf1OfnX9') || // Legacy check
        p.slug === 'student-subscription-monthly' ||
        p.slug === 'student-subscription-yearly'
      );

      if (subscriptionProduct) {
        console.log(`Upgrading user ${userId} to subscription: ${subscriptionProduct.name}`);

        const isTrial = session.subscription && session.amount_total === 0; // Simple check for trial start

        // Calculate trial end date (7 days from now)
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        // Update user profile
        const { error: profileError } = await supabase
          .from('user_profiles')
          .update({
            subscription_type: 'premium',
            subscription_status: isTrial ? 'trialing' : 'active',
            trial_ends_at: isTrial ? trialEndDate.toISOString() : null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (profileError) {
          console.error('Error updating user profile:', profileError);
        } else {
          console.log(`✅ User ${userId} upgraded to premium (status: ${isTrial ? 'trialing' : 'active'})`);
        }

        // Create subscription record
        const startDate = new Date();
        const endDate = new Date();
        // Default to 1 month if no period in session (though webhooks usually have this)
        // For real subs, listen to customer.subscription.created/updated, but for checkout.session.completed:
        endDate.setMonth(endDate.getMonth() + 1);

        const { error: subError } = await supabase
          .from('subscriptions')
          .insert({
            user_id: userId,
            stripe_subscription_id: session.subscription as string || session.id,
            stripe_customer_id: session.customer as string,
            status: isTrial ? 'trialing' : 'active',
            plan_name: subscriptionProduct.name,
            plan_price_cents: subscriptionProduct.price_cents,
            current_period_start: startDate.toISOString(),
            current_period_end: endDate.toISOString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (subError) {
          console.error('Error creating subscription record:', subError);
        } else {
          console.log(`Subscription record created for user ${userId}`);
        }
      }
    }

    console.log(`Order ${order.id} created successfully for ${customerEmail}`);

    // Send appropriate email
    const subscriptionProduct = products?.find((p: any) => p.resource_type === 'Subscription');

    if (actualEmail) {
      if (subscriptionProduct) {
        // Send Welcome Email for Subscriptions
        await sendWelcomeEmail(actualEmail, subscriptionProduct.name);
      } else {
        // Send Standard Order Confirmation for One-time Buys
        await sendOrderConfirmationEmail(order, orderItems, actualEmail);
      }
    }

  } catch (error) {
    console.error('Error handling successful payment:', error);
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

    // Create download links for ALL products
    const productList = products.map(product => ({
      name: product.name,
      download_url: `${BASE_URL}/api/orders/${order.id}/download/${product.id}`
    }));

    // Format products for email template
    const productsHtml = productList.map(p =>
      `<li style="margin-bottom: 15px;">
        <strong>${p.name}</strong><br/>
        <a href="${p.download_url}" style="color: #4F46E5; text-decoration: none;">Download Now</a>
      </li>`
    ).join('');

    // Send email via Brevo with ALL products
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
          product_count: products.length,
          products_html: productsHtml,
          // Legacy fields for backward compatibility with old template
          product_name: products[0].name,
          download_url: productList[0].download_url,
          account_url: `${BASE_URL}/account/orders`
        }
      }),
    });

    if (response.ok) {
      console.log(`✅ Order confirmation email sent to ${customerEmail} for order ${order.id} with ${products.length} product(s)`);
    } else {
      const errorData = await response.json();
      console.error('❌ Failed to send order confirmation email:', errorData);
    }

  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    // Don't throw - email failure shouldn't break the order process
  }
}

async function sendWelcomeEmail(customerEmail: string, planName: string) {
  try {
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    if (!BREVO_API_KEY) return;

    // Use a Welcome Template (Create one in Brevo or use a generic one)
    // For now, sending a simple transactional email
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: { name: "LanguageGems Team", email: "support@languagegems.com" },
        to: [{ email: customerEmail }],
        subject: "Welcome to LanguageGems Premium! 💎",
        htmlContent: `
          <h1>Welcome aboard!</h1>
          <p>You have successfully subscribed to the <strong>${planName}</strong>.</p>
          <p>Your subscription is now active. You can access all premium features immediately by logging into your dashboard.</p>
          <p><a href="https://www.languagegems.com/dashboard">Go to Dashboard</a></p>
          <br/>
          <p>Happy Learning,<br/>The LanguageGems Team</p>
        `
      }),
    });

    if (response.ok) {
      console.log(`✅ Welcome email sent to ${customerEmail}`);
    } else {
      console.error(`❌ Failed to send welcome email`);
    }
  } catch (e) {
    console.error('Error sending welcome email', e);
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