import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  author?: string;
  featured_image_url?: string;
  publish_date: string;
}

/**
 * Send email notifications for newly published blog posts
 */
export async function POST(request: NextRequest) {
  try {
    // Verify this is an authorized request
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { posts }: { posts: BlogPost[] } = await request.json();

    if (!posts || posts.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No posts to send notifications for'
      });
    }

    const supabase = createServiceRoleClient();
    const BREVO_API_KEY = process.env.BREVO_API_KEY;

    if (!BREVO_API_KEY) {
      console.warn('Brevo API key not found, skipping email notifications');
      return NextResponse.json({
        success: false,
        error: 'Email service not configured'
      });
    }

    const senderName = process.env.BREVO_SENDER_NAME || 'LanguageGems';
    const senderEmail = process.env.BREVO_SENDER_EMAIL || 'support@languagegems.com';


    // Get active blog subscribers
    const { data: subscribers, error: subscribersError } = await supabase
      .from('blog_subscribers')
      .select('email, first_name, last_name')
      .eq('is_active', true);

    if (subscribersError) {
      console.error('Error fetching subscribers:', subscribersError);
      return NextResponse.json(
        { error: 'Failed to fetch subscribers' },
        { status: 500 }
      );
    }

    if (!subscribers || subscribers.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active subscribers to notify'
      });
    }

    const results = [];

    // Send notification for each new post
    for (const post of posts) {
      try {
        const emailResult = await sendPostNotification(post, subscribers, BREVO_API_KEY);
        results.push({
          postId: post.id,
          postTitle: post.title,
          ...emailResult
        });

        // Record the email campaign
        if (emailResult.success) {
          await supabase
            .from('blog_email_campaigns')
            .insert({
              blog_post_id: post.id,
              campaign_type: 'new_post',
              subject_line: `New Post: ${post.title}`,
              sent_to_count: subscribers.length,
              brevo_campaign_id: emailResult.campaignId
            });

          // Mark post as email sent
          await supabase
            .from('blog_posts')
            .update({
              email_sent: true,
              email_sent_at: new Date().toISOString()
            })
            .eq('id', post.id);
        }

      } catch (error) {
        console.error(`Error sending notification for post ${post.id}:`, error);
        results.push({
          postId: post.id,
          postTitle: post.title,
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Processed ${posts.length} posts`,
      results
    });

  } catch (error) {
    console.error('Email notification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function sendPostNotification(
  post: BlogPost,
  subscribers: any[],
  brevoApiKey: string
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.languagegems.com';
  const postUrl = `${baseUrl}/blog/${post.slug}`;

  // Create email content
  const subject = `New Post: ${post.title}`;
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Language Gems Blog</h1>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            ${post.featured_image_url ? `
                <img src="${post.featured_image_url}" alt="${post.title}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; margin-bottom: 20px;">
            ` : ''}

            <h2 style="color: #333; margin-bottom: 15px; font-size: 24px;">${post.title}</h2>

            ${post.excerpt ? `
                <p style="color: #666; font-size: 16px; margin-bottom: 25px;">${post.excerpt}</p>
            ` : ''}

            <div style="text-align: center; margin: 30px 0;">
                <a href="${postUrl}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block; transition: transform 0.2s;">
                    Read Full Article
                </a>
            </div>

            <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px; font-size: 14px; color: #666;">
                <p>By ${post.author || 'LanguageGems Team'} • ${new Date(post.publish_date).toLocaleDateString()}</p>
                <p style="margin-top: 20px;">
                    <a href="${baseUrl}/blog/unsubscribe?token={{params.UNSUBSCRIBE_TOKEN}}" style="color: #999; text-decoration: none;">Unsubscribe</a> |
                    <a href="${baseUrl}/blog" style="color: #667eea; text-decoration: none;">View All Posts</a>
                </p>
            </div>
        </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': brevoApiKey,
      },
      body: JSON.stringify({
        sender: {
          name: senderName,
          email: senderEmail
        },
        to: subscribers.map(sub => ({
          email: sub.email,
          name: `${sub.first_name || ''} ${sub.last_name || ''}`.trim() || sub.email
        })),
        subject,
        htmlContent,
        params: {
          UNSUBSCRIBE_TOKEN: '{{contact.UNSUBSCRIBE_TOKEN}}'
        }
      }),
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        campaignId: result.messageId,
        sentTo: subscribers.length
      };
    } else {
      const errorData = await response.json();
      throw new Error(`Brevo API error: ${errorData.message || 'Unknown error'}`);
    }

  } catch (error) {
    console.error('Error sending email via Brevo:', error);
    return {
      success: false,
      error: error.message
    };
  }
}
