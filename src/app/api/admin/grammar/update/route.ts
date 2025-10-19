import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase-server';
import { createServiceRoleClient } from '@/utils/supabase/client';

/**
 * API endpoint for updating grammar page content
 * This is called from the admin editing UI
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated and is an admin
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Get the update data from request body
    const body = await request.json();
    const { language, category, topic_slug, updates } = body;

    if (!language || !category || !topic_slug || !updates) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS for admin operations
    const serviceSupabase = createServiceRoleClient();

    // Update the grammar page in the database
    const { data, error } = await serviceSupabase
      .from('grammar_pages')
      .update(updates as any)
      .eq('language', language)
      .eq('category', category)
      .eq('topic_slug', topic_slug)
      .select();

    if (error) {
      console.error('Error updating grammar page:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Grammar page not found' },
        { status: 404 }
      );
    }

    // Revalidate the page immediately
    const pagePath = `/grammar-v2/${language}/${category}/${topic_slug}`;
    revalidatePath(pagePath);
    
    const oldPath = `/grammar/${language}/${category}/${topic_slug}`;
    revalidatePath(oldPath);

    return NextResponse.json({
      success: true,
      message: 'Grammar page updated successfully',
      data
    });

  } catch (error) {
    console.error('Error in update endpoint:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

