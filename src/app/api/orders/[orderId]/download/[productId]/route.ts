import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string; productId: string } }
) {
  try {
    const { orderId, productId } = params;

    // Verify the order exists and includes this product
    const { data: orderItem, error: orderError } = await supabase
      .from('order_items')
      .select(`
        *,
        order:orders!inner (
          id,
          user_id,
          customer_email,
          status
        ),
        product:products!inner (
          id,
          name,
          file_path
        )
      `)
      .eq('order_id', orderId)
      .eq('product_id', productId)
      .single();

    if (orderError || !orderItem) {
      console.error('Order item not found:', orderError);
      return NextResponse.json(
        { error: 'Purchase not found or invalid' },
        { status: 404 }
      );
    }

    // Check if order is completed
    if (orderItem.order.status !== 'completed') {
      return NextResponse.json(
        { error: 'Order is not completed' },
        { status: 403 }
      );
    }

    // Get the file from Supabase Storage
    const filePath = orderItem.product.file_path;
    if (!filePath) {
      return NextResponse.json(
        { error: 'File not available for download' },
        { status: 404 }
      );
    }

    // Create a signed URL for download (valid for 1 hour)
    const { data: signedUrl, error: urlError } = await supabase.storage
      .from('products')
      .createSignedUrl(filePath, 3600); // 1 hour expiry

    if (urlError || !signedUrl) {
      console.error('Error creating signed URL:', urlError);
      return NextResponse.json(
        { error: 'Unable to generate download link' },
        { status: 500 }
      );
    }

    // Log the download
    console.log(`Download initiated for order ${orderId}, product ${productId}`);

    return NextResponse.json({
      success: true,
      downloadUrl: signedUrl.signedUrl,
      productName: orderItem.product.name,
      expiresIn: 3600 // seconds
    });

  } catch (error) {
    console.error('Error in download endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 