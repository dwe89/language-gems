# Blog Workflow Enhancements - Complete Guide

## 🚀 Overview

Your blog publishing system has been enhanced with **immediate publish & notify** functionality and **Sentry monitoring** for maximum reliability and speed.

---

## ✨ New Features

### 1. **Publish & Notify Now** Button

A new "Publish & Notify Now" button has been added to both admin interfaces that allows you to:
- ✅ Publish a blog post immediately (bypassing the cron job)
- ✅ Send email notifications to all subscribers instantly
- ✅ See real-time feedback on email delivery status

#### Where to Find It:
- **Main Admin Page**: `/admin/blog` - Green send icon (📤) next to each unpublished post
- **Blog Admin Modal**: Floating admin button on blog pages - Same green send icon

#### How It Works:
1. Click the green **Send** icon next to any draft or scheduled post
2. Confirm the action in the popup dialog
3. The system will:
   - Immediately publish the post (status → `published`)
   - Send emails to all active subscribers via Brevo
   - Show you a success message with email count
   - Refresh the post list to show updated status

#### Visual Indicators:
- **Green Send Icon** (📤): Available for unpublished posts
- **Loading Spinner**: Shows while publishing is in progress
- **Green Checkmark** (✓): Appears after emails have been sent successfully

---

### 2. **Email Sent Status Indicators**

The admin UI now shows clear visual feedback about email delivery:

| Icon | Meaning | Tooltip |
|------|---------|---------|
| ✅ Green Checkmark | Emails sent successfully | Shows timestamp of when emails were sent |
| 📤 Green Send Icon | Ready to publish & notify | Click to publish immediately |
| ⏳ Loading Spinner | Publishing in progress | Please wait... |

---

### 3. **Sentry Cron Monitoring**

The scheduled blog publishing cron job is now monitored by Sentry for reliability:

#### What's Monitored:
- **Cron Job Execution**: Every run of `/api/blog/publish-scheduled`
- **Success/Failure Status**: Automatic tracking of job outcomes
- **Error Details**: Full exception tracking if something goes wrong

#### Monitor Details:
- **Monitor Slug**: `blog-publish-scheduled`
- **Schedule**: Every day at 9:00 AM UTC (configured in `vercel.json`)
- **Check-in Statuses**:
  - `in_progress`: Job started
  - `ok`: Job completed successfully
  - `error`: Job failed (with exception details)

#### How to View Monitoring:
1. Go to [Sentry Dashboard](https://sentry.io/organizations/language-gems/crons/)
2. Look for monitor: `blog-publish-scheduled`
3. View execution history, success rate, and error logs

---

## 🔄 Complete Workflow

### Workflow A: Scheduled Publishing (Automated)

```
1. Create blog post in /admin/blog/new
   ↓
2. Set scheduled_for date/time
   ↓
3. Save post (status: 'scheduled', email_sent: false)
   ↓
4. Wait for cron job (runs daily at 9:00 AM UTC)
   ↓
5. Cron job publishes post (status: 'published')
   ↓
6. Cron job triggers /api/blog/send-notifications
   ↓
7. Emails sent to all active subscribers
   ↓
8. Post marked as email_sent: true
   ↓
9. Sentry records successful execution ✅
```

### Workflow B: Immediate Publishing (Manual)

```
1. Create blog post in /admin/blog/new
   ↓
2. Save as draft (status: 'draft')
   ↓
3. Go to /admin/blog
   ↓
4. Click green "Send" icon (📤)
   ↓
5. Confirm action
   ↓
6. POST /api/blog/publish-now
   ↓
7. Post published immediately (status: 'published')
   ↓
8. Emails sent to all subscribers
   ↓
9. Success message shows email count
   ↓
10. Green checkmark (✓) appears in UI
```

---

## 📊 Database Tables Involved

### `blog_posts`
Key fields for workflow:
- `status`: 'draft' | 'scheduled' | 'published'
- `is_published`: boolean (legacy, kept for compatibility)
- `email_sent`: boolean - tracks if notification emails were sent
- `email_sent_at`: timestamp - when emails were sent
- `scheduled_for`: timestamp - when to auto-publish (if scheduled)
- `publish_date`: timestamp - actual publication date

### `blog_subscribers`
- `email`: subscriber email
- `first_name`, `last_name`: subscriber name
- `is_active`: boolean - only active subscribers receive emails

### `blog_email_campaigns`
Tracks each email campaign:
- `blog_post_id`: reference to blog post
- `campaign_type`: 'new_post'
- `subject_line`: email subject
- `sent_to_count`: number of recipients
- `brevo_campaign_id`: Brevo message ID

---

## 🔧 API Endpoints

### `/api/blog/publish-now` (NEW)
**Purpose**: Immediately publish a post and send notifications

**Method**: POST

**Auth**: Admin only (danieletienne89@gmail.com)

**Request Body**:
```json
{
  "postId": "uuid-of-blog-post"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Post \"Your Title\" published successfully!",
  "post": {
    "id": "uuid",
    "title": "Your Title",
    "slug": "your-slug",
    "status": "published",
    "publish_date": "2025-01-22T10:00:00Z"
  },
  "emailSent": true,
  "emailDetails": {
    "success": true,
    "results": [
      {
        "postId": "uuid",
        "postTitle": "Your Title",
        "sentTo": 150
      }
    ]
  }
}
```

### `/api/blog/publish-scheduled`
**Purpose**: Cron job to publish scheduled posts

**Method**: POST

**Auth**: Bearer token (CRON_SECRET)

**Monitoring**: Sentry Cron Monitor (`blog-publish-scheduled`)

**Schedule**: Daily at 9:00 AM UTC

---

## 🎯 Best Practices

### When to Use "Publish & Notify Now":
✅ Breaking news or time-sensitive content
✅ Immediate announcements
✅ Testing email delivery
✅ Correcting a missed scheduled publish

### When to Use Scheduled Publishing:
✅ Regular blog posts with planned release dates
✅ Content calendar management
✅ Posts written in advance
✅ Consistent publishing schedule

---

## 🚨 Monitoring & Alerts

### Sentry Alerts (Recommended Setup):

1. **Cron Job Failures**:
   - Alert if `blog-publish-scheduled` fails
   - Notification: Email + Slack

2. **Email Delivery Issues**:
   - Alert if email notifications fail
   - Check Brevo API errors in Sentry

3. **Performance Monitoring**:
   - Track publish-now endpoint response times
   - Alert if > 10 seconds

### How to Set Up Alerts:
1. Go to Sentry → Alerts → Create Alert Rule
2. Select "Cron Monitor" or "Error"
3. Configure conditions and notification channels

---

## 🔍 Troubleshooting

### Issue: "Publish & Notify Now" button not appearing
**Solution**: Check that post status is not already 'published'

### Issue: Emails not being sent
**Possible Causes**:
1. BREVO_API_KEY not configured
2. No active subscribers in database
3. Brevo API rate limits
4. Check Sentry for error logs

### Issue: Cron job not running
**Check**:
1. Vercel cron configuration in `vercel.json`
2. CRON_SECRET environment variable
3. Sentry monitor for execution history

---

## 📝 Environment Variables Required

```bash
# Brevo Email Service
BREVO_API_KEY=your-brevo-api-key
BREVO_SENDER_NAME=LanguageGems
BREVO_SENDER_EMAIL=blog@languagegems.com
BREVO_BLOG_LIST_ID=2

# Cron Job Security
CRON_SECRET=your-secret-token

# Application
NEXT_PUBLIC_BASE_URL=https://www.languagegems.com

# Sentry (already configured)
SENTRY_DSN=https://...
```

---

## 🎉 Summary

Your blog workflow is now:
- ⚡ **Faster**: Publish immediately when needed
- 🔒 **More Reliable**: Sentry monitoring catches failures
- 👁️ **More Transparent**: Clear visual indicators for email status
- 🎯 **More Flexible**: Choose between scheduled or immediate publishing

**Next Steps**:
1. Test the "Publish & Notify Now" button with a draft post
2. Check Sentry dashboard to verify monitoring is active
3. Set up Sentry alerts for cron job failures
4. Document your preferred publishing workflow for your team

