#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkOrder() {
  try {
    console.log('🔍 Checking for order with ID: 4d665f7b-b561-4e73-9cb0-78f71f20758a');
    
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', '4d665f7b-b561-4e73-9cb0-78f71f20758a');
    
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Order found:', JSON.stringify(data, null, 2));
    
    // Also check the user_id of the current user
    console.log('\n🔍 Checking user ID for danieletienne89@gmail.com');
    const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
    
    if (userError) {
      console.error('User error:', userError);
      return;
    }
    
    const user = userData.users.find(u => u.email === 'danieletienne89@gmail.com');
    if (user) {
      console.log('User ID:', user.id);
      
      // Check if there are any orders for this user
      console.log('\n🔍 Checking all orders for this user');
      const { data: userOrders, error: orderError } = await supabase
        .from('orders')
        .select('id, status, total_cents, customer_email, created_at')
        .eq('user_id', user.id);
      
      if (orderError) {
        console.error('User orders error:', orderError);
      } else {
        console.log('User orders:', JSON.stringify(userOrders, null, 2));
      }
    } else {
      console.log('User not found');
    }
    
  } catch (err) {
    console.error('Script error:', err);
  }
}

checkOrder();