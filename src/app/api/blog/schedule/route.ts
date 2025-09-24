import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    
    const {
      title,
      slug,
      content,
      excerpt,
      author = 'LanguageGems Team',
      tags = [],
      scheduled_for,
      seo_title,
      seo_description,
      featured_image_url,
      reading_time_minutes = 5
    } = body;

    // Validate required fields
    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: 'Title, slug, and content are required' },
        { status: 400 }
      );
    }

    // Validate scheduled_for is in the future
    if (scheduled_for && new Date(scheduled_for) <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled date must be in the future' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const { data: existingPost } = await supabase
      .from('blog_posts')
      .select('id')
      .eq('slug', slug)
      .single();

    if (existingPost) {
      return NextResponse.json(
        { error: 'A post with this slug already exists' },
        { status: 409 }
      );
    }

    // Determine status based on scheduled_for
    const status = scheduled_for ? 'scheduled' : 'draft';
    const publish_date = scheduled_for ? new Date(scheduled_for) : null;

    // Insert the blog post
    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        content,
        excerpt,
        author,
        tags,
        scheduled_for: scheduled_for ? new Date(scheduled_for) : null,
        status,
        publish_date,
        seo_title: seo_title || title,
        seo_description: seo_description || excerpt,
        featured_image_url,
        reading_time_minutes,
        is_published: false, // Keep for backward compatibility
        email_sent: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to create blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
      message: status === 'scheduled' 
        ? `Post scheduled for ${new Date(scheduled_for).toLocaleString()}`
        : 'Post saved as draft'
    });

  } catch (error) {
    console.error('Blog scheduling error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';

    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });

    if (status !== 'all') {
      query = query.eq('status', status);
    }

    const { data: posts, error } = await query;

    if (error) {
      console.error('Error fetching blog posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch blog posts' },
        { status: 500 }
      );
    }

    return NextResponse.json({ posts });

  } catch (error) {
    console.error('Blog fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createServiceRoleClient();
    const body = await request.json();
    
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // If updating scheduled_for, validate it's in the future
    if (updateData.scheduled_for && new Date(updateData.scheduled_for) <= new Date()) {
      return NextResponse.json(
        { error: 'Scheduled date must be in the future' },
        { status: 400 }
      );
    }

    // Update status based on scheduled_for
    if (updateData.scheduled_for) {
      updateData.status = 'scheduled';
      updateData.publish_date = new Date(updateData.scheduled_for);
    }

    const { data: post, error } = await supabase
      .from('blog_posts')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating blog post:', error);
      return NextResponse.json(
        { error: 'Failed to update blog post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      post,
      message: 'Post updated successfully'
    });

  } catch (error) {
    console.error('Blog update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
