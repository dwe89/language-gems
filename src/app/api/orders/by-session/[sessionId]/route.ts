import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const { sessionId } = params;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log('Fetching order for session:', sessionId);

    // Get order by Stripe session ID
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          *,
          product:products (
            id,
            name,
            description,
            file_path,
            thumbnail_url,
            resource_type,
            slug
          )
        )
      `)
      .eq('stripe_session_id', sessionId)
      .single();

    if (orderError) {
      console.error('Error fetching order:', orderError);

      if (orderError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to fetch order details' },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Log successful order retrieval
    console.log(`Order ${order.id} retrieved for session ${sessionId}`);

    return NextResponse.json({
      success: true,
      order
    });

  } catch (error) {
    console.error('Error in order lookup:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 