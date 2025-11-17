# Trial Expiration System - Complete Documentation

## Current Implementation Status

### ✅ What's Working

1. **Database Structure**
   - `trial_status`: 'active' | 'expired' | 'converted' | 'cancelled'
   - `trial_starts_at`: Timestamp when trial begins
   - `trial_ends_at`: Timestamp when trial expires (14 days after start)
   - `subscription_status`: 'free' | 'trialing' | 'active' | 'cancelled' | 'past_due'
   - `subscription_type`: 'free' | 'standard' | 'basic' | 'large-school'

2. **Trial Inheritance for Invited Members**
   - When a teacher is invited and verifies their email, they inherit:
     - `subscription_type` from school owner
     - `subscription_status` from school owner
     - `trial_status` from school owner
     - `trial_starts_at` from school owner
     - `trial_ends_at` from school owner
   - This ensures all school members share the same trial period

3. **Client-Side Access Control**
   - `useUserAccess.ts` - Checks trial expiration before granting access
   - `AuthProvider.tsx` - Validates subscription status
   - `middleware.ts` - Server-side validation
   - **Access control properly checks school owner's trial for invited members**

4. **Automated Expiration**
   - **NEW**: Cron job at `/api/cron/expire-trials`
   - Runs daily at 2 AM UTC
   - Automatically expires trials when `trial_ends_at` passes
   - Cascades expiration to all invited members of a school owner
   - Changes `trial_status` to 'expired' and `subscription_status` to 'free'

---

## How Trial Expiration Works

### For School Owners:

1. **Trial Starts** (Day 0):
   ```sql
   trial_status = 'active'
   trial_starts_at = NOW()
   trial_ends_at = NOW() + 14 days
   subscription_status = 'trialing'
   subscription_type = 'standard' (or chosen plan)
   ```

2. **During Trial** (Days 1-14):
   - Full access to all features
   - Can invite additional teachers
   - Access validated by checking `trial_ends_at > NOW()`

3. **Trial Expires** (Day 15):
   - Cron job runs at 2 AM UTC
   - Updates owner:
     ```sql
     trial_status = 'expired'
     subscription_status = 'free'
     ```
   - Updates all invited members:
     ```sql
     trial_status = 'expired'
     subscription_status = 'free'
     ```

4. **Post-Expiration**:
   - Access is restricted (frontend checks `subscription_status === 'free'`)
   - Dashboard shows upgrade prompt
   - Teacher can request invoice to convert to paid subscription

### For Invited Members:

1. **Join During Owner's Trial**:
   - Inherit all trial fields from school owner
   - Same `trial_ends_at` as owner
   - Same `trial_status` as owner

2. **Trial Expiration**:
   - When owner's trial expires, cron job also expires all members
   - All members lose access simultaneously
   - Ensures school-wide synchronization

---

## Example Data

### Before Expiration:
```
School Owner (danjoeetienne@gmail.com):
  trial_status: 'active'
  trial_starts_at: '2025-11-15 21:23:09'
  trial_ends_at: '2025-11-29 21:23:09'
  subscription_status: 'trialing'
  subscription_type: 'standard'

Invited Member (dancox89@gmail.com):
  trial_status: 'active'
  trial_starts_at: '2025-11-15 21:23:09'  (inherited)
  trial_ends_at: '2025-11-29 21:23:09'    (inherited)
  subscription_status: 'trialing'
  subscription_type: 'standard'            (inherited)
  school_owner_id: 'a2684f3f-3360-4ae5-bb59-a8c82f9332bc'
```

### After Expiration (Nov 30, 2025):
```
School Owner (danjoeetienne@gmail.com):
  trial_status: 'expired'
  trial_starts_at: '2025-11-15 21:23:09'  (preserved for reference)
  trial_ends_at: '2025-11-29 21:23:09'    (preserved for reference)
  subscription_status: 'free'
  subscription_type: 'standard'            (preserved for upgrade)

Invited Member (dancox89@gmail.com):
  trial_status: 'expired'
  trial_starts_at: '2025-11-15 21:23:09'
  trial_ends_at: '2025-11-29 21:23:09'
  subscription_status: 'free'
  subscription_type: 'standard'
  school_owner_id: 'a2684f3f-3360-4ae5-bb59-a8c82f9332bc'
```

---

## Cron Job Details

### Endpoint:
```
GET /api/cron/expire-trials
```

### Schedule:
- **Daily at 2 AM UTC** (`0 2 * * *`)
- Configured in `vercel.json`

### Security:
- Protected by `CRON_SECRET` environment variable
- Requires `Authorization: Bearer ${CRON_SECRET}` header

### Process:
1. Query all users with `trial_status = 'active'` AND `trial_ends_at < NOW()`
2. For each expired trial:
   - Update user: `trial_status = 'expired'`, `subscription_status = 'free'`
   - If user is school owner, also update all members
3. Return summary of processed users

### Testing the Cron Job Manually:
```bash
curl -X GET https://www.languagegems.com/api/cron/expire-trials \
  -H "Authorization: Bearer ${CRON_SECRET}"
```

Expected response:
```json
{
  "success": true,
  "expired_count": 2,
  "member_updates_count": 1,
  "error_count": 0,
  "expired_users": ["owner@example.com", "another@example.com"],
  "member_updates": ["member@example.com"],
  "errors": [],
  "processed_at": "2025-11-30T02:00:00.000Z"
}
```

---

## ❌ What's Still Missing (TODO)

### 1. Email Notifications
Currently, no emails are sent. Need to implement:

#### Day 7 Reminder Email
```typescript
// Send when trial is 50% complete
Subject: "7 Days Left in Your LanguageGems Trial"
Content:
- Highlight key features used so far
- Remind about trial end date
- Link to upgrade page
```

#### Day 12 Reminder Email
```typescript
// Send 2 days before expiration
Subject: "Your LanguageGems Trial Ends in 2 Days"
Content:
- Final reminder
- Emphasize value received
- Strong CTA to convert
- Link to request invoice
```

#### Trial Expired Email
```typescript
// Send immediately after expiration
Subject: "Your LanguageGems Trial Has Ended"
Content:
- Thank you message
- Summary of trial usage
- Clear upgrade path
- Link to request invoice
- Contact information
```

### 2. Email Reminder Cron Jobs
Create additional cron jobs for proactive reminders:

**File**: `/api/cron/send-trial-reminders/route.ts`
- Run daily at 9 AM UTC
- Check for trials ending in 7 days → send Day 7 email
- Check for trials ending in 2 days → send Day 12 email

Add to `vercel.json`:
```json
{
  "path": "/api/cron/send-trial-reminders",
  "schedule": "0 9 * * *"
}
```

### 3. Upgrade/Conversion Flow
When trial expires, users need a clear path to convert:

#### For School Owners:
1. Show upgrade prompt on dashboard
2. Display "Request Invoice" button
3. Collect:
   - School name
   - Finance department email
   - Estimated student count
   - Chosen plan
4. Generate Stripe invoice via API
5. Email invoice to finance department

#### API Endpoint Needed:
```typescript
POST /api/stripe/create-invoice
Body: {
  school_code: string,
  plan: 'basic' | 'standard' | 'large-school',
  finance_email: string,
  estimated_students: number
}
```

### 4. Invoice Generation Integration
Use Stripe to create and send invoices:

```typescript
// When trial expires and teacher clicks "Upgrade"
const customer = await stripe.customers.create({
  email: financeEmail,
  name: schoolName,
  metadata: { school_code, trial_converted_by: teacherEmail }
});

const invoice = await stripe.invoices.create({
  customer: customer.id,
  collection_method: 'send_invoice',
  days_until_due: 30,
  auto_advance: false
});

await stripe.invoiceItems.create({
  customer: customer.id,
  price: PRICE_ID_FOR_PLAN,
  invoice: invoice.id
});

await stripe.invoices.finalizeInvoice(invoice.id);
```

### 5. Stripe Webhook Handler
Listen for invoice payment:

**File**: `/api/webhooks/stripe/route.ts`

```typescript
if (event.type === 'invoice.paid') {
  const invoice = event.data.object;
  const schoolCode = invoice.metadata.school_code;
  
  // Activate subscription for school
  await supabase
    .from('user_profiles')
    .update({
      subscription_status: 'active',
      subscription_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
      trial_status: 'converted'
    })
    .eq('school_code', schoolCode);
}
```

### 6. Dashboard UI Updates

#### Show Trial Status:
```tsx
{profile.trial_status === 'active' && (
  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
    <h3 className="font-semibold text-blue-900">
      🎉 Trial Active: {daysRemaining} days remaining
    </h3>
    <p className="text-sm text-blue-700 mt-1">
      Your trial ends on {formatDate(profile.trial_ends_at)}
    </p>
  </div>
)}

{profile.trial_status === 'expired' && (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <h3 className="font-semibold text-red-900">
      ⏰ Your trial has ended
    </h3>
    <p className="text-sm text-red-700 mt-1 mb-3">
      Upgrade now to restore full access for your school
    </p>
    <button className="bg-red-600 text-white px-4 py-2 rounded-lg">
      Request Invoice
    </button>
  </div>
)}
```

---

## Environment Variables Required

Add to `.env.local` and Vercel:

```bash
# Cron job security
CRON_SECRET=your-secure-random-string

# Stripe (if not already set)
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Email service (if implementing notifications)
RESEND_API_KEY=re_...
# or
SENDGRID_API_KEY=SG....
```

---

## Testing Checklist

### Manual Testing:
1. ✅ Create school owner account with trial
2. ✅ Invite another teacher
3. ✅ Verify invited teacher inherits trial data
4. ✅ Manually trigger cron job
5. ✅ Verify both users get expired after trial_ends_at passes
6. ✅ Verify access is restricted after expiration

### Automated Testing:
1. ⏳ Set up test environment with expired trial
2. ⏳ Test cron job response
3. ⏳ Test email sending (when implemented)
4. ⏳ Test invoice generation (when implemented)
5. ⏳ Test webhook handling (when implemented)

---

## Deployment Notes

### Vercel Cron Jobs:
- Cron jobs only work on **Vercel Pro plan** or higher
- Free tier doesn't support cron jobs
- Alternative: Use external service like cron-job.org to hit the endpoint

### Production Rollout:
1. Deploy code changes
2. Verify `CRON_SECRET` is set in Vercel environment variables
3. Monitor first cron job execution
4. Check logs for any errors
5. Verify database updates are correct

---

## Summary

### ✅ **Currently Working:**
- Trial data inheritance for invited members
- Automated daily cron job to expire trials
- Cascade expiration to all school members
- Frontend access control based on trial status

### ⏳ **Still Needed:**
- Email reminders (Day 7, Day 12)
- Trial expiration notification email
- Upgrade/conversion flow UI
- Stripe invoice generation API
- Stripe webhook handler
- Dashboard trial status display

### 🎯 **Next Steps:**
1. Test the cron job in production
2. Implement email reminders
3. Build upgrade flow UI
4. Integrate Stripe invoicing
5. Add dashboard trial indicators
