import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase-server';

/**
 * API endpoint for on-demand revalidation of grammar pages
 * This allows instant updates when content is edited from the admin UI
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
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Get the page to revalidate from request body
    const body = await request.json();
    const { language, category, topic_slug } = body;

    if (!language || !category || !topic_slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: language, category, topic_slug' },
        { status: 400 }
      );
    }

    // Revalidate the specific page path
    const pagePath = `/grammar-v2/${language}/${category}/${topic_slug}`;
    revalidatePath(pagePath);

    // Also revalidate the old path (once we switch over)
    const oldPath = `/grammar/${language}/${category}/${topic_slug}`;
    revalidatePath(oldPath);

    // Revalidate the category page
    revalidatePath(`/grammar/${language}/${category}`);
    revalidatePath(`/grammar/${language}`);

    return NextResponse.json({
      success: true,
      message: `Revalidated grammar page: ${language}/${category}/${topic_slug}`,
      paths: [pagePath, oldPath]
    });

  } catch (error) {
    console.error('Error revalidating grammar page:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

