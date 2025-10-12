import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { product_id } = await request.json();

    if (!product_id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get product details
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id, name, file_path, display_filename, price_cents, is_active')
      .eq('id', product_id)
      .eq('is_active', true)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if product is free
    if (product.price_cents > 0) {
      return NextResponse.json(
        { error: 'This product requires payment' },
        { status: 400 }
      );
    }

    // Extract storage path from file_path
    let storagePath = product.file_path;

    if (storagePath.includes('/storage/v1/object/public/products/')) {
      storagePath = storagePath.split('/storage/v1/object/public/products/')[1];
    } else if (storagePath.includes('/storage/v1/object/sign/products/')) {
      const match = storagePath.match(/\/storage\/v1\/object\/sign\/products\/([^?]+)/);
      if (match) {
        storagePath = match[1];
      }
    } else if (storagePath.startsWith('http')) {
      const urlParts = storagePath.split('/');
      storagePath = urlParts[urlParts.length - 1];
    }

    // Generate a fresh signed URL
    const { data: signedUrlData, error: urlError } = await supabase.storage
      .from('products')
      .createSignedUrl(storagePath, 3600); // 1 hour expiry

    if (urlError || !signedUrlData) {
      console.error('Error creating signed URL:', urlError);
      return NextResponse.json(
        { error: 'Failed to generate download link' },
        { status: 500 }
      );
    }

    // Log the download for analytics
    try {
      await supabase
        .from('product_downloads')
        .insert({
          product_id: product.id,
          download_type: 'free',
          ip_address: request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown'
        });
    } catch (logError) {
      console.warn('Failed to log download:', logError);
    }

    // Return the signed URL with proper filename
    return NextResponse.json({
      success: true,
      download_url: signedUrlData.signedUrl,
      product_name: product.display_filename || product.name
    });

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
