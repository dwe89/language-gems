# Blog Automation Setup Guide

## Overview

This system provides automated blog scheduling and email notifications using your existing Vercel + Supabase + Brevo stack.

## Features

✅ **Automated Publishing**: Schedule blog posts for future publication  
✅ **Email Notifications**: Automatic subscriber notifications via Brevo  
✅ **Cache Management**: Instant visibility with Vercel ISR revalidation  
✅ **SEO Optimization**: Built-in SEO fields and meta management  
✅ **Subscriber Management**: Full subscription/unsubscription system  

## Environment Variables

Add these to your Vercel environment variables:

```bash
# Required for cron job security
CRON_SECRET=your-secure-random-string-here

# Brevo API (already configured)
BREVO_API_KEY=your-brevo-api-key

# Base URL for email links
NEXT_PUBLIC_BASE_URL=https://www.languagegems.com

# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Database Changes

The system has automatically added these fields to your `blog_posts` table:

- `publish_date` - When the post was/will be published
- `scheduled_for` - Future publication date/time
- `status` - 'draft', 'scheduled', 'published', 'archived'
- `email_sent` - Whether notification email was sent
- `email_sent_at` - When notification was sent
- `seo_title` - Custom SEO title
- `seo_description` - Custom SEO description
- `featured_image_url` - Featured image for social sharing
- `reading_time_minutes` - Estimated reading time

## New Tables Created

1. **blog_subscribers** - Email subscribers with preferences
2. **blog_email_campaigns** - Email campaign tracking and analytics

## API Endpoints

### Blog Management
- `POST /api/blog/schedule` - Create/schedule blog posts
- `PUT /api/blog/schedule` - Update existing posts
- `GET /api/blog/schedule` - List posts by status

### Automation (Cron Jobs)
- `POST /api/blog/publish-scheduled` - Publish scheduled posts (runs hourly)
- `POST /api/blog/send-notifications` - Send email notifications

### Subscriber Management
- `POST /api/blog/subscribe` - Subscribe to blog updates
- `DELETE /api/blog/subscribe` - Unsubscribe from updates

### Cache Management
- `POST /api/revalidate` - Revalidate specific pages

## Cron Schedule

The system runs every hour (`0 * * * *`) to:
1. Check for posts scheduled to be published
2. Publish them automatically
3. Send email notifications to subscribers
4. Revalidate blog pages for instant visibility

## Usage Examples

### 1. Schedule a Blog Post

```javascript
const response = await fetch('/api/blog/schedule', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'My Awesome Blog Post',
    slug: 'my-awesome-blog-post',
    content: '<p>This is the content...</p>',
    excerpt: 'Brief summary',
    scheduled_for: '2024-12-25T10:00:00',
    seo_title: 'Custom SEO Title',
    featured_image_url: 'https://example.com/image.jpg'
  })
});
```

### 2. Immediate Publishing

Simply omit `scheduled_for` or set it to null to save as draft.

### 3. Email Subscription

```javascript
const response = await fetch('/api/blog/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    firstName: 'John',
    lastName: 'Doe'
  })
});
```

## Admin Interface Updates

The `/admin/blog/new` page now includes:

- **Scheduling**: Date/time picker for future publication
- **SEO Fields**: Custom title, description, and featured image
- **Reading Time**: Estimated reading time in minutes
- **Enhanced Validation**: Prevents scheduling in the past

## Brevo Integration

### Email Template Features
- Professional HTML email design
- Featured image support
- Unsubscribe links
- Responsive layout
- Brand consistency

### List Management
- Automatic subscriber management
- Preference tracking
- Campaign analytics
- Bounce handling

## Testing

### 1. Test Scheduled Publishing
```bash
# Check what posts are ready to publish
curl https://your-domain.com/api/blog/publish-scheduled

# Manually trigger publishing (for testing)
curl -X POST https://your-domain.com/api/blog/publish-scheduled \
  -H "Authorization: Bearer your-cron-secret"
```

### 2. Test Email Notifications
Create a test post and check your Brevo dashboard for campaign statistics.

### 3. Test Subscription Flow
Use the blog subscription form and verify emails are added to your Brevo list.

## Monitoring

### Vercel Functions
Monitor cron job execution in your Vercel dashboard under Functions.

### Supabase
Check the `blog_email_campaigns` table for email delivery statistics.

### Brevo
Monitor email open rates, click rates, and bounces in your Brevo dashboard.

## Security

- Cron endpoints are protected with `CRON_SECRET`
- Subscriber data is protected with RLS policies
- Email unsubscribe tokens are unique and secure
- All API endpoints include proper error handling

## Troubleshooting

### Posts Not Publishing
1. Check Vercel cron job logs
2. Verify `CRON_SECRET` environment variable
3. Check post `scheduled_for` date is in the past

### Emails Not Sending
1. Verify `BREVO_API_KEY` is correct
2. Check Brevo API limits and quotas
3. Verify subscriber list ID in the code

### Cache Issues
1. Manually trigger revalidation: `/api/revalidate?path=/blog`
2. Check Vercel deployment logs
3. Verify ISR configuration

## Next Steps

1. **Set up environment variables** in Vercel
2. **Configure Brevo list ID** in `/api/blog/subscribe/route.ts`
3. **Test the system** with a scheduled post
4. **Monitor performance** and adjust as needed

## Benefits Over Alternatives

✅ **Uses Your Existing Stack** - No new services required  
✅ **Cost Effective** - Leverages free tiers of Vercel crons  
✅ **Reliable** - Built on proven infrastructure  
✅ **Scalable** - Handles thousands of subscribers  
✅ **SEO Optimized** - Instant cache invalidation  
✅ **Professional** - Branded email templates  

This system gives you enterprise-level blog automation while staying within your current technology choices and budget constraints.
