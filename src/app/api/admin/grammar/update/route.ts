import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * API endpoint for updating grammar page content
 * This is called from the admin editing UI
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();

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
      .eq('id', user.id)
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

    // Update the grammar page in the database
    const { data, error } = await supabase
      .from('grammar_pages')
      .update(updates)
      .eq('language', language)
      .eq('category', category)
      .eq('topic_slug', topic_slug)
      .select()
      .single();

    if (error) {
      console.error('Error updating grammar page:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
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

