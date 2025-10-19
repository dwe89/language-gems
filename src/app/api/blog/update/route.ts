import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import { createServiceRoleClient } from '@/utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'danieletienne89@gmail.com') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId, updates } = body;

    if (!postId || !updates) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createServiceRoleClient();

    // Update blog post
    const { data, error } = await serviceSupabase
      .from('blog_posts')
      .update(updates)
      .eq('id', postId)
      .select();

    if (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to update blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      data
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

