import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: NextRequest) {
  try {
    const { name, description, price } = await request.json();

    // Validate required fields
    if (!name || !price) {
      return NextResponse.json(
        { error: 'Name and price are required' },
        { status: 400 }
      );
    }

    // Create product in Stripe
    const product = await stripe.products.create({
      name,
      description: description || '',
      type: 'good',
    });

    let priceId = null;
    
    // Only create a Stripe price if the product isn't free
    if (price > 0) {
      const stripePrice = await stripe.prices.create({
        product: product.id,
        unit_amount: price, // price is already in pence
        currency: 'gbp',
      });
      priceId = stripePrice.id;
    }

    return NextResponse.json({
      productId: product.id,
      priceId: priceId,
    });

  } catch (error: any) {
    console.error('Stripe product creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create Stripe product' },
      { status: 500 }
    );
  }
} 