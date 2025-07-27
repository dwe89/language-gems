import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const keyStage = searchParams.get('keyStage');
    const topicSlug = searchParams.get('topicSlug');

    // Create a server-side Supabase client
    const supabase = await createClient();

    // Build query based on provided parameters
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (language) {
      query = query.eq('language', language);
    }

    if (keyStage) {
      query = query.eq('key_stage', keyStage);
    }

    if (topicSlug) {
      query = query.eq('topic_slug', topicSlug);
    }

    // Order by created date, newest first
    query = query.order('created_at', { ascending: false });

    const { data: products, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch products' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      products: products || [],
      count: products?.length || 0
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}