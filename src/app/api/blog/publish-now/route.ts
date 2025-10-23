import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';
import * as Sentry from '@sentry/nextjs';

/**
 * Immediate publish & notify endpoint
 * Publishes a blog post immediately and sends email notifications
 * without waiting for the cron job
 */
export async function POST(request: NextRequest) {
  const transaction = Sentry.startTransaction({
    op: 'blog.publish-now',
    name: 'Immediate Blog Publish & Notify',
  });

  try {
    // Check authentication - only admin can publish
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'danieletienne89@gmail.com') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const serviceSupabase = createServiceRoleClient();
    const now = new Date();

    // Fetch the post
    const { data: post, error: fetchError } = await serviceSupabase
      .from('blog_posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (fetchError || !post) {
      Sentry.captureException(fetchError);
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if already published
    if (post.status === 'published' && post.is_published) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Post is already published',
          alreadyPublished: true 
        },
        { status: 400 }
      );
    }

    // Publish the post
    const { data: updatedPost, error: updateError } = await serviceSupabase
      .from('blog_posts')
      .update({
        status: 'published',
        is_published: true,
        publish_date: now.toISOString(),
        updated_at: now.toISOString()
      })
      .eq('id', postId)
      .select()
      .single();

    if (updateError) {
      Sentry.captureException(updateError);
      return NextResponse.json(
        { success: false, error: 'Failed to publish post' },
        { status: 500 }
      );
    }

    console.log(`✅ Published post immediately: ${post.title} (${post.slug})`);

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
      Sentry.captureException(revalidateError);
      // Don't fail the entire operation for revalidation errors
    }

    // Send email notifications immediately
    let emailResult = null;
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/send-notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.CRON_SECRET}`
        },
        body: JSON.stringify({
          posts: [updatedPost]
        })
      });

      if (emailResponse.ok) {
        emailResult = await emailResponse.json();
        console.log('✅ Email notifications sent successfully');
      } else {
        const errorData = await emailResponse.json();
        console.warn('Email notification failed:', errorData);
        Sentry.captureMessage('Email notification failed after immediate publish', {
          level: 'warning',
          extra: { postId, error: errorData }
        });
      }
    } catch (emailError) {
      console.error('Failed to send email notifications:', emailError);
      Sentry.captureException(emailError);
      // Don't fail the entire operation for email errors
    }

    transaction.finish();

    return NextResponse.json({
      success: true,
      message: `Post "${post.title}" published successfully!`,
      post: {
        id: updatedPost.id,
        title: updatedPost.title,
        slug: updatedPost.slug,
        status: updatedPost.status,
        publish_date: updatedPost.publish_date
      },
      emailSent: emailResult?.success || false,
      emailDetails: emailResult
    });

  } catch (error: any) {
    console.error('Error in publish-now:', error);
    Sentry.captureException(error);
    transaction.finish();

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to publish post' 
      },
      { status: 500 }
    );
  }
}

/**
 * GET endpoint to check if a post can be published immediately
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'danieletienne89@gmail.com') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const serviceSupabase = createServiceRoleClient();
    const { data: post, error } = await serviceSupabase
      .from('blog_posts')
      .select('id, title, slug, status, is_published, email_sent')
      .eq('id', postId)
      .single();

    if (error || !post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      canPublish: post.status !== 'published' || !post.is_published,
      post: {
        id: post.id,
        title: post.title,
        slug: post.slug,
        status: post.status,
        is_published: post.is_published,
        email_sent: post.email_sent
      }
    });

  } catch (error: any) {
    console.error('Error checking publish status:', error);
    return NextResponse.json(
      { error: 'Failed to check publish status' },
      { status: 500 }
    );
  }
}

