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
      .select('*')
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

    // Check if file_path is already a full URL or a storage path
    let downloadUrl = product.file_path;

    // If it's a public URL, we'll use it directly (not ideal for security)
    // TODO: Move files to private storage and use signed URLs
    if (!product.file_path.startsWith('http')) {
      // If it's a storage path, generate a signed URL
      const { data: signedUrlData, error: urlError } = await supabase.storage
        .from('products')
        .createSignedUrl(product.file_path, 3600); // 1 hour expiry

      if (urlError || !signedUrlData) {
        console.error('Error creating signed URL:', urlError);
        return NextResponse.json(
          { error: 'Failed to generate download link' },
          { status: 500 }
        );
      }

      downloadUrl = signedUrlData.signedUrl;
    }

    // Add download tracking parameter to URL
    const urlWithTracking = new URL(downloadUrl);
    urlWithTracking.searchParams.set('download', 'true');
    urlWithTracking.searchParams.set('product_id', product.id);
    downloadUrl = urlWithTracking.toString();

    // Log the download for analytics (optional)
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
      // Don't fail the request if logging fails
      console.warn('Failed to log download:', logError);
    }

    return NextResponse.json({
      success: true,
      download_url: downloadUrl,
      product_name: product.name
    });

  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
