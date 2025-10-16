import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractStoragePath } from '@/lib/storageUtils';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Use service role key for storage operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Clean download endpoint that hides Supabase URLs
 * URL format: /download/resource/{resourceId}
 *
 * This endpoint:
 * 1. Validates user authentication via cookies
 * 2. Checks purchase/access rights
 * 3. Generates fresh short-lived signed URL
 * 4. Redirects to file (user never sees Supabase URL)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { resourceId: string } }
) {
  try {
    const { resourceId } = params;

    // Create Supabase client with cookie access for auth
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            // No-op for GET requests
          },
        },
      }
    );

    // Get authenticated user from session
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication required. Please log in.' },
        { status: 401 }
      );
    }

    // Find the product and verify purchase
    const { data: product, error: productError } = await supabaseAdmin
      .from('products')
      .select('id, name, file_path, price_cents')
      .eq('id', resourceId)
      .single();

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      );
    }

    // Check if user has purchased this product
    const { data: purchase, error: purchaseError } = await supabaseAdmin
      .from('order_items')
      .select(`
        id,
        order:orders!inner (
          id,
          user_id,
          customer_email,
          status
        )
      `)
      .eq('product_id', resourceId)
      .eq('order.user_id', user.id)
      .eq('order.status', 'completed')
      .limit(1)
      .single();

    if (purchaseError || !purchase) {
      return NextResponse.json(
        { error: 'You have not purchased this resource' },
        { status: 403 }
      );
    }

    // Get the file from storage
    const filePath = product.file_path;
    if (!filePath) {
      return NextResponse.json(
        { error: 'File not available for download' },
        { status: 404 }
      );
    }

    // Extract relative path from full URL
    const relativePath = extractStoragePath(filePath, 'products');

    // Create a short-lived signed URL (5 minutes)
    const { data: signedUrl, error: urlError } = await supabaseAdmin.storage
      .from('products')
      .createSignedUrl(relativePath, 300); // 5 minutes

    if (urlError || !signedUrl) {
      console.error('Error creating signed URL:', {
        error: urlError,
        relativePath,
        originalPath: filePath
      });
      return NextResponse.json(
        { error: 'Unable to generate download link' },
        { status: 500 }
      );
    }

    // Log the download for analytics
    console.log(`Download: User ${user.email} downloaded ${product.name} (${resourceId})`);

    // Fetch the file from the signed URL and stream it to the user
    // This way the browser URL stays as /download/resource/{id}
    const fileResponse = await fetch(signedUrl.signedUrl);

    if (!fileResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch file from storage' },
        { status: 500 }
      );
    }

    // Get the file as a blob
    const fileBlob = await fileResponse.blob();

    // Determine content type from the file path
    const contentType = filePath.endsWith('.pdf') ? 'application/pdf' :
                       filePath.endsWith('.docx') ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
                       filePath.endsWith('.doc') ? 'application/msword' :
                       'application/octet-stream';

    // Return the file with proper headers
    return new NextResponse(fileBlob, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${product.name}.pdf"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });

  } catch (error) {
    console.error('Error in download endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

