import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;

    console.log('[FREE DOWNLOAD] Processing download request for order:', orderId);

    // 1. Validate the order exists and is a free order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, customer_email, status, total_cents, metadata')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('[FREE DOWNLOAD] Order not found:', orderError);
      return NextResponse.json(
        { error: 'Invalid download link' },
        { status: 404 }
      );
    }

    // Verify it's a free order
    if (order.total_cents !== 0) {
      console.error('[FREE DOWNLOAD] Not a free order:', order.total_cents);
      return NextResponse.json(
        { error: 'This download link is only valid for free resources' },
        { status: 403 }
      );
    }

    // Verify order is completed
    if (order.status !== 'completed') {
      console.error('[FREE DOWNLOAD] Order not completed:', order.status);
      return NextResponse.json(
        { error: 'Order not completed' },
        { status: 400 }
      );
    }

    // 2. Get the order items and product details
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('product_id, product_name')
      .eq('order_id', orderId);

    if (itemsError || !orderItems || orderItems.length === 0) {
      console.error('[FREE DOWNLOAD] No order items found:', itemsError);
      return NextResponse.json(
        { error: 'No products found for this order' },
        { status: 404 }
      );
    }

    // Get the first product (for now - can be enhanced for multiple products)
    const firstItem = orderItems[0];

    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, file_path')
      .eq('id', firstItem.product_id)
      .single();

    if (productError || !product || !product.file_path) {
      console.error('[FREE DOWNLOAD] Product or file path not found:', productError);
      return NextResponse.json(
        { error: 'Product file not available' },
        { status: 404 }
      );
    }

    // 3. Extract the storage path from the file_path
    let storagePath = product.file_path;
    
    // If it's a full URL, extract the path
    if (storagePath.includes('/storage/v1/object/public/products/')) {
      storagePath = storagePath.split('/storage/v1/object/public/products/')[1];
    } else if (storagePath.includes('/storage/v1/object/sign/products/')) {
      // Extract from signed URL
      const match = storagePath.match(/\/storage\/v1\/object\/sign\/products\/([^?]+)/);
      if (match) {
        storagePath = match[1];
      }
    } else if (storagePath.startsWith('http')) {
      // Try to extract filename from any URL
      const urlParts = storagePath.split('/');
      storagePath = urlParts[urlParts.length - 1];
    }

    console.log('[FREE DOWNLOAD] Storage path:', storagePath);

    // 4. Generate a fresh signed URL (valid for 1 hour)
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('products')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (urlError || !signedUrlData) {
      console.error('[FREE DOWNLOAD] Error creating signed URL:', urlError);
      
      // Fallback: try to get public URL
      const { data: publicUrlData } = supabase.storage
        .from('products')
        .getPublicUrl(storagePath);
      
      if (publicUrlData?.publicUrl) {
        console.log('[FREE DOWNLOAD] Using public URL as fallback');
        return NextResponse.redirect(publicUrlData.publicUrl);
      }
      
      return NextResponse.json(
        { error: 'Unable to generate download link' },
        { status: 500 }
      );
    }

    // 5. Log the download for analytics
    try {
      await supabase
        .from('free_resource_downloads')
        .insert({
          order_id: orderId,
          product_id: product.id,
          customer_email: order.customer_email,
          downloaded_at: new Date().toISOString()
        });
    } catch (logError) {
      // Non-critical error, just log it
      console.warn('[FREE DOWNLOAD] Failed to log download:', logError);
    }

    console.log('[FREE DOWNLOAD] Redirecting to signed URL');

    // 6. Redirect to the fresh signed URL
    return NextResponse.redirect(signedUrlData.signedUrl);

  } catch (error: any) {
    console.error('[FREE DOWNLOAD] Unexpected error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

