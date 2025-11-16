# 14-Day Free Trial Implementation - Complete Guide

## ✅ What's Been Set Up

### 1. Stripe Configuration
- **Trial Product Created**: `prod_TQhgtc0KW2a7E3` (£0.00)
- **School Subscription Products Created**:
  - Basic Plan: `prod_TQhi9UjdIrPsMB` (£399/year)
  - Standard Plan: `prod_TQhiiz3r13FUe7` (£799/year)  
  - Large School Plan: `prod_TQhiFAIZyTWuEr` (£1,199/year)
- **Invoice Price IDs**: One-time invoice prices for B2B sales
- **Subscription Price IDs**: Optional recurring prices

### 2. Frontend Pages Created
✅ `/src/app/schools/contact/page.tsx` - Contact page wrapper
✅ `/src/app/schools/contact/SchoolsContactClient.tsx` - Trial signup form

**Features**:
- Plan selection (pre-filled from URL parameter)
- School details collection
- Teacher information
- Finance email for invoicing
- Student count estimation
- Beautiful UI with plan summary sidebar
- Honeypot bot protection
- Success confirmation page

### 3. Backend API Routes Created
✅ `/src/app/api/schools/trial-signup/route.ts` - Handles trial signups
✅ `/src/app/api/schools/generate-invoice/route.ts` - Generates Stripe invoices

### 4. Database Migration
✅ `/migrations/add_trial_columns.sql` - Adds trial & invoice columns

---

## 🚀 Implementation Steps

### Step 1: Run Database Migration

```bash
# Copy the contents of migrations/add_trial_columns.sql
# Paste into Supabase SQL Editor and run it
```

This adds:
- Trial tracking columns to `user_profiles`
- Invoice tracking columns to `school_codes`  
- Necessary indexes for performance

### Step 2: Update Environment Variables

Add these to your `.env.local`:

```bash
# Stripe Product IDs (already created)
NEXT_PUBLIC_STRIPE_TRIAL_PRODUCT_ID=prod_TQhgtc0KW2a7E3
NEXT_PUBLIC_STRIPE_BASIC_PRODUCT_ID=prod_TQhi9UjdIrPsMB
NEXT_PUBLIC_STRIPE_STANDARD_PRODUCT_ID=prod_TQhiiz3r13FUe7
NEXT_PUBLIC_STRIPE_LARGE_PRODUCT_ID=prod_TQhiFAIZyTWuEr

# Stripe Price IDs for Invoices (one-time payments)
STRIPE_BASIC_PRICE_ID=price_1STqJnITKTyLzdk6IZGyZZcX
STRIPE_STANDARD_PRICE_ID=price_1STqJpITKTyLzdk6grIrXT5j
STRIPE_LARGE_PRICE_ID=price_1STqJsITKTyLzdk6MqRqV29L

# Stripe Secret Key (you should already have this)
STRIPE_SECRET_KEY=sk_live_...

# Supabase Service Role Key (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=...
```

### Step 3: Update Database Type Definitions

Since we added new columns, you need to regenerate your TypeScript types:

```bash
# Generate types from Supabase
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/database.types.ts
```

Or manually add the types to `src/lib/database.types.ts` in the `user_profiles` and `school_codes` interfaces.

### Step 4: Test the Trial Signup Flow

1. **Visit the trial signup page**:
   ```
   http://localhost:3000/schools/contact?plan=standard
   ```

2. **Fill out the form** with test school details

3. **Submit** - should see success message

4. **Check database** - verify user profile was created with trial status

### Step 5: Set Up Stripe Webhooks

To handle invoice payments automatically, configure webhooks:

```bash
# For local testing
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# For production, add webhook endpoint in Stripe Dashboard:
# URL: https://yourdomain.com/api/webhooks/stripe
# Events: invoice.paid, invoice.payment_failed
```

---

## 📋 Complete User Journey

### Day 1: Trial Signup
1. Teacher visits `/schools/contact?plan=standard`
2. Fills out school details (no payment required)
3. Clicks "Start Free 14-Day Trial"
4. System creates:
   - User account (if doesn't exist)
   - School record
   - Sets `trial_status = 'active'`
   - Sets `trial_ends_at = NOW() + 14 days`
5. Teacher receives welcome email (TODO: implement)
6. Teacher gets full access to Standard Plan features

### Days 2-13: Active Trial
- Teacher explores platform
- Creates classes, assignments
- Students use the system
- System tracks usage

### Day 12: Reminder Email
- Send email: "2 days left in your trial"
- Include "Upgrade Now" button
- Highlight value received during trial

### Day 14: Trial Expiring Soon
- Send email: "Your trial ends tomorrow"
- Show what will be lost
- Easy upgrade path

### Day 15: Trial Expired
1. System sets `trial_status = 'expired'`
2. Access becomes read-only:
   - Can view data
   - Cannot create assignments
   - Students cannot play games
3. Dashboard shows upgrade prompt
4. Teacher clicks "Upgrade to [Plan]"
5. System generates Stripe invoice
6. Invoice sent to finance email

### Invoice Payment
1. Finance department receives invoice
2. Pays via:
   - Purchase Order (PO)
   - Bank transfer
   - Credit card (Stripe checkout link)
3. Stripe webhook fires `invoice.paid`
4. System activates subscription:
   - Sets `subscription_status = 'active'`
   - Sets `subscription_expires_at = NOW() + 1 year`
   - Restores full access
5. Teacher receives confirmation email

---

## 🔗 URL Structure

Your pricing page links are already set up correctly:

```
/schools/contact?plan=basic        → £399/year plan
/schools/contact?plan=standard     → £799/year plan  
/schools/contact?plan=large-school → £1,199/year plan
/schools/contact?plan=mat          → Custom pricing
```

The form pre-fills with the selected plan from the URL parameter.

---

## ⚠️ Known Issues to Fix

1. **TypeScript Errors**: After running the migration, regenerate database types
2. **Email Service**: Need to implement trial welcome/reminder emails
3. **Webhook Handler**: Create `/api/webhooks/stripe/route.ts` to handle payments
4. **Admin Dashboard**: Add trial management view for monitoring
5. **Trial Expiry Cron**: Set up daily job to check for expired trials

---

## 🛠️ Next Development Tasks

### High Priority
- [ ] Regenerate database types after migration
- [ ] Create webhook handler for `invoice.paid`
- [ ] Implement trial welcome email
- [ ] Add trial status banner to teacher dashboard
- [ ] Create trial expiry check cron job

### Medium Priority
- [ ] Build invoice request page (post-trial)
- [ ] Add trial usage analytics
- [ ] Create admin trial management dashboard
- [ ] Implement reminder emails (day 7, 12, 14)
- [ ] Add trial extension capability

### Low Priority
- [ ] A/B test trial length (14 vs 30 days)
- [ ] Add trial cancellation flow
- [ ] Create trial success metrics dashboard
- [ ] Implement auto-upgrade for card payments

---

## 📊 Key Metrics to Track

Monitor these in your analytics:

- **Trial Signups**: How many teachers start trials
- **Trial Completion Rate**: % who use platform during trial
- **Trial-to-Paid Conversion**: % who upgrade after trial
- **Average Time to Conversion**: Days from trial end to payment
- **Invoice Payment Rate**: % of invoices that get paid
- **Average Invoice Payment Time**: Days from invoice to payment

---

## 💡 Pro Tips

### Increase Trial Conversions
1. **Onboarding Email Series**: Send helpful tips during trial
2. **Personal Check-in**: Call on day 7 to see how it's going
3. **Show Usage Stats**: Display "You've created X assignments" 
4. **Social Proof**: Share success stories from other schools
5. **Make Upgrade Easy**: Pre-fill invoice with their details

### Reduce Invoice Payment Time
1. **Send Invoice on Day 13**: Don't wait for trial to end
2. **Multiple Payment Options**: PO, bank transfer, card
3. **Follow-up Sequence**: Email finance team if unpaid
4. **Offer Extension**: "Need more time? We can extend"

### Prevent Trial Abuse
- ✅ One trial per email (implemented)
- ✅ Honeypot bot detection (implemented)
- ✅ School email validation
- [ ] IP address tracking
- [ ] Require phone verification

---

## 📧 Email Templates Needed

### 1. Trial Welcome Email
```
Subject: Welcome to LanguageGems! Your 14-Day Trial Starts Now

Hi [Teacher Name],

Welcome to LanguageGems! Your trial is now active.

Login here: https://languagegems.com/auth/login
Email: [teacher_email]

Your trial includes:
✓ All Standard Plan features
✓ Up to 750 student logins
✓ Homework assignments
✓ Full analytics

Get started:
1. Create your first class
2. Add vocabulary lists
3. Assign homework
4. Track student progress

Questions? Reply to this email.

Best,
The LanguageGems Team
```

### 2. Day 7 Reminder
```
Subject: You're Halfway Through Your Trial!

Hi [Teacher Name],

You're 7 days into your LanguageGems trial.

Your stats so far:
- [X] classes created
- [X] assignments set
- [X] students active

Need help? Book a quick call: [calendly_link]

Trial ends: [trial_end_date]

Cheers,
Team LanguageGems
```

### 3. Day 12 Reminder
```
Subject: 2 Days Left in Your Trial

Hi [Teacher Name],

Your trial ends in 2 days ([trial_end_date]).

Want to continue? Let your Head of Department know!

We'll send an invoice to: [finance_email]
Plan: Standard (£799/year)

Questions? Reply or call us.

Best,
LanguageGems
```

### 4. Trial Expired
```
Subject: Your LanguageGems Trial Has Ended

Hi [Teacher Name],

Your 14-day trial has ended. Thanks for trying LanguageGems!

To continue using the platform:
1. Click here to request an invoice: [invoice_link]
2. We'll send it to your finance team
3. Once paid, access is restored immediately

Your data is safe - we'll keep it for 30 days.

Questions? Reply to this email.

Best,
Team LanguageGems
```

---

## 🎉 You're Ready!

All Stripe products are configured. Pages are built. APIs are ready.

**To go live**:
1. Run the database migration
2. Add environment variables
3. Regenerate TypeScript types
4. Test the complete flow
5. Set up webhooks
6. Deploy to production

Good luck with your trial launch! 🚀
