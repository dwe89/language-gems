/**
 * Send order confirmation emails for completed orders that may have missed them
 * Usage: node scripts/send-missing-order-emails.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.languagegems.com';

async function sendOrderConfirmationEmail(order, orderItems, customerEmail) {
  try {
    if (!BREVO_API_KEY) {
      console.error('❌ BREVO_API_KEY not configured');
      return false;
    }

    // Get product details for each order item
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id, name, file_path')
      .in('id', orderItems.map(item => item.product_id));

    if (productsError || !products || products.length === 0) {
      console.error('❌ No products found for order items:', productsError);
      return false;
    }

    // Format total price
    const totalFormatted = order.total_cents === 0 ? 'FREE' : `£${(order.total_cents / 100).toFixed(2)}`;

    // Format order date
    const orderDate = new Date(order.created_at).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    // Send email for first product
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
      return true;
    } else {
      const errorData = await response.json();
      console.error('❌ Failed to send order confirmation email:', errorData);
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending email:', error);
    return false;
  }
}

async function sendMissingOrderEmails() {
  console.log('🔍 Finding completed orders from today...\n');

  // Get today's completed orders
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .gte('created_at', new Date().toISOString().split('T')[0]) // Today's date
    .eq('status', 'completed')
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('❌ Error fetching orders:', ordersError);
    return;
  }

  if (!orders || orders.length === 0) {
    console.log('ℹ️  No completed orders found for today.');
    return;
  }

  console.log(`📧 Found ${orders.length} order(s) from today. Sending confirmation emails...\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const order of orders) {
    console.log(`\n📦 Processing Order: ${order.id}`);
    console.log(`   Customer: ${order.customer_name || 'N/A'} (${order.customer_email})`);
    console.log(`   Total: £${(order.total_cents / 100).toFixed(2)}`);
    console.log(`   Created: ${new Date(order.created_at).toLocaleString()}`);

    // Get order items
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', order.id);

    if (itemsError || !orderItems || orderItems.length === 0) {
      console.log(`   ⚠️  No order items found - skipping`);
      failureCount++;
      continue;
    }

    console.log(`   📄 Items: ${orderItems.map(i => i.product_name).join(', ')}`);

    // Send email
    const success = await sendOrderConfirmationEmail(order, orderItems, order.customer_email);
    
    if (success) {
      successCount++;
      // Wait a bit between emails to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    } else {
      failureCount++;
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary:');
  console.log(`   ✅ Successfully sent: ${successCount}`);
  console.log(`   ❌ Failed: ${failureCount}`);
  console.log('='.repeat(60));
}

// Run the script
sendMissingOrderEmails()
  .then(() => {
    console.log('\n✨ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });
