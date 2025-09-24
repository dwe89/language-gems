import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * Cron job endpoint to publish scheduled blog posts
 * This will be called by Vercel Cron every hour to check for posts ready to publish
 */
export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron request (optional security measure)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServiceRoleClient();
    const now = new Date();

    // Find all scheduled posts that should be published now
    const { data: scheduledPosts, error: fetchError } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('status', 'scheduled')
      .lte('scheduled_for', now.toISOString());

    if (fetchError) {
      console.error('Error fetching scheduled posts:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch scheduled posts' },
        { status: 500 }
      );
    }

    if (!scheduledPosts || scheduledPosts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts ready to publish',
        published: []
      });
    }

    const publishedPosts = [];
    const errors = [];

    // Publish each scheduled post
    for (const post of scheduledPosts) {
      try {
        const { data: updatedPost, error: updateError } = await supabase
          .from('blog_posts')
          .update({
            status: 'published',
            is_published: true, // For backward compatibility
            publish_date: now.toISOString(),
            updated_at: now.toISOString()
          })
          .eq('id', post.id)
          .select()
          .single();

        if (updateError) {
          console.error(`Error publishing post ${post.id}:`, updateError);
          errors.push({ postId: post.id, error: updateError.message });
          continue;
        }

        publishedPosts.push(updatedPost);

        // Trigger revalidation for the blog page and individual post
        try {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/revalidate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              paths: ['/blog', `/blog/${post.slug}`]
            })
          });
        } catch (revalidateError) {
          console.warn('Failed to revalidate pages:', revalidateError);
          // Don't fail the entire operation for revalidation errors
        }

        console.log(`✅ Published post: ${post.title} (${post.slug})`);

      } catch (error) {
        console.error(`Error processing post ${post.id}:`, error);
        errors.push({ postId: post.id, error: error.message });
      }
    }

    // Send email notifications for newly published posts (if enabled)
    if (publishedPosts.length > 0) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/send-notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.CRON_SECRET}`
          },
          body: JSON.stringify({
            posts: publishedPosts
          })
        });
      } catch (emailError) {
        console.warn('Failed to send email notifications:', emailError);
        // Don't fail the entire operation for email errors
      }
    }

    return NextResponse.json({
      success: true,
      message: `Published ${publishedPosts.length} posts`,
      published: publishedPosts.map(p => ({ id: p.id, title: p.title, slug: p.slug })),
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Cron job error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Manual trigger endpoint for testing
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const now = new Date();

    // Get scheduled posts for preview
    const { data: scheduledPosts, error } = await supabase
      .from('blog_posts')
      .select('id, title, slug, scheduled_for, status')
      .eq('status', 'scheduled')
      .order('scheduled_for', { ascending: true });

    if (error) {
      console.error('Error fetching scheduled posts:', error);
      return NextResponse.json(
        { error: 'Failed to fetch scheduled posts' },
        { status: 500 }
      );
    }

    const readyToPublish = scheduledPosts?.filter(post => 
      new Date(post.scheduled_for) <= now
    ) || [];

    return NextResponse.json({
      success: true,
      currentTime: now.toISOString(),
      totalScheduled: scheduledPosts?.length || 0,
      readyToPublish: readyToPublish.length,
      scheduledPosts: scheduledPosts?.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        scheduledFor: post.scheduled_for,
        isReady: new Date(post.scheduled_for) <= now
      }))
    });

  } catch (error) {
    console.error('Preview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
