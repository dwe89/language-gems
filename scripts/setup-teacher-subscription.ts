import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16' as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const TEACHER_PRODUCT_NAME = 'INDIVIDUAL TEACHER SUBSCRIPTION';
const MONTHLY_PRICE_CENTS = 1199;

async function setup() {
  console.log('--- Setting up Individual Teacher Subscription ---');

  try {
    // 1. Create Product in Stripe
    const product = await stripe.products.create({
      name: TEACHER_PRODUCT_NAME,
      description: 'Perfect for private tutors & independent MFL teachers. Access to all language games, student tracking, and assignment tools.',
      metadata: {
        plan_type: 'teacher_individual',
      }
    });
    console.log(`✅ Created Stripe Product: ${product.id}`);

    // 2. Create Monthly Price in Stripe
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: MONTHLY_PRICE_CENTS,
      currency: 'gbp',
      recurring: {
        interval: 'month',
      },
      metadata: {
        plan_type: 'teacher_individual',
        interval: 'monthly'
      }
    });
    console.log(`✅ Created Stripe Monthly Price: ${price.id}`);

    // 3. Register in Supabase products table
    const { data: dbProduct, error: dbError } = await supabase
      .from('products')
      .insert({
        id: '92d1c97a-9eb2-4c2d-9b5a-7e10c20f37bb', // Generated UUID for the new teacher plan
        name: TEACHER_PRODUCT_NAME,
        description: 'Individual Teacher Monthly Plan',
        price_cents: MONTHLY_PRICE_CENTS,
        stripe_price_id: price.id,
        is_active: true,
        slug: 'teacher-individual-monthly'
      })
      .select()
      .single();

    if (dbError) throw dbError;
    console.log(`✅ Registered in Supabase products table: ${dbProduct.id}`);

    console.log('\n--- Setup Complete ---');
    console.log(`Product ID: ${product.id}`);
    console.log(`Price ID: ${price.id}`);
    console.log(`Supabase ID: ${dbProduct.id}`);

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setup();
