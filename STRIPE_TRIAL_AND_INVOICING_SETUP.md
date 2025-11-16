# 14-Day Free Trial & Invoice-Based School Subscriptions - Setup Complete ✅

## Overview
LanguageGems uses a **No-Credit-Card-Required (NCCR) Trial** model optimized for B2B school sales. Teachers evaluate the platform during a 14-day trial, then the school receives an invoice for annual payment.

---

## Stripe Products & Prices Created

### 1. Trial Product
- **Product Name**: 14-Day Free Trial - LanguageGems for Schools
- **Product ID**: `prod_TQhgtc0KW2a7E3`
- **Price ID**: `price_1STqIZITKTyLzdk6qfQVUtuh`
- **Amount**: £0.00
- **Type**: One-time
- **Description**: Full access 14-day trial for teachers to evaluate LanguageGems before purchasing a school subscription. No credit card required.

---

### 2. Basic Plan (£399/year)
- **Product Name**: LanguageGems Basic Plan - School Subscription
- **Product ID**: `prod_TQhi9UjdIrPsMB`
- **One-Time Invoice Price ID**: `price_1STqJnITKTyLzdk6IZGyZZcX`
- **Annual Subscription Price ID**: `price_1STqIrITKTyLzdk6mVTTKpsa`
- **Amount**: £399.00/year
- **Features**:
  - Classroom-wide access for all MFL teachers
  - All students for whole-class gameplay
  - 15+ interactive games
  - Spanish, French, German content
  - Professional audio integration
  - WCAG 2.1 AA accessibility
  - ❌ No individual student logins
  - ❌ No custom vocabulary lists
  - ❌ No homework assignments

---

### 3. Standard Plan (£799/year) - MOST POPULAR
- **Product Name**: LanguageGems Standard Plan - School Subscription
- **Product ID**: `prod_TQhiiz3r13FUe7`
- **One-Time Invoice Price ID**: `price_1STqJpITKTyLzdk6grIrXT5j`
- **Annual Subscription Price ID**: `price_1STqIvITKTyLzdk64lLjeDcl`
- **Amount**: £799.00/year
- **Features**:
  - All Basic Plan features
  - Individual logins for up to 750 students
  - Homework assignments with auto-marking
  - Custom vocabulary lists
  - Advanced analytics & reports
  - AQA/Edexcel GCSE alignment
  - Spaced repetition system
  - Multi-game assignment system

---

### 4. Large School Plan (£1,199/year)
- **Product Name**: LanguageGems Large School Plan - School Subscription
- **Product ID**: `prod_TQhiFAIZyTWuEr`
- **One-Time Invoice Price ID**: `price_1STqJsITKTyLzdk6MqRqV29L`
- **Annual Subscription Price ID**: `price_1STqIyITKTyLzdk6rcAGUllx`
- **Amount**: £1,199.00/year
- **Features**:
  - All Standard Plan features
  - Unlimited student accounts
  - Priority email & chat support
  - Custom reports & analytics
  - Dedicated onboarding support
  - Strategic partnership benefits
  - Feature request priority
  - Advanced admin controls

---

## Recommended Workflow: No-Credit-Card-Required (NCCR) Trial

### Phase 1: Teacher Sign-Up (Day 1)
1. **Teacher visits** `/auth/signup-teacher` or `/schools/pricing`
2. **Teacher signs up** with their school email address
3. **System grants trial status**:
   - Set `trial_status = 'active'`
   - Set `trial_starts_at = NOW()`
   - Set `trial_ends_at = NOW() + INTERVAL '14 days'`
   - Set `subscription_type = 'trial'`
   - Grant full Standard Plan access during trial
4. **No payment details required** - teacher gets immediate access

### Phase 2: Trial Period (Days 1-14)
- Teacher has **full access** to all Standard Plan features
- System tracks:
  - Classes created
  - Assignments set
  - Student engagement
  - Feature usage
- Send reminder emails:
  - Day 7: "Halfway through your trial"
  - Day 12: "2 days remaining - ready to upgrade?"

### Phase 3: Trial Expiration (Day 15)
1. **Access is suspended** (soft lock):
   - Read-only access to existing data
   - Cannot create new assignments
   - Students cannot play games
   - Teacher sees upgrade prompt
2. **Teacher initiates conversion**:
   - Clicks "Upgrade to [Plan]" button
   - Selects plan (Basic/Standard/Large)
   - Fills out school details form
3. **System generates Stripe Invoice**:
   ```typescript
   // Create customer for the school
   const customer = await stripe.customers.create({
     email: school.finance_email || teacher.email,
     name: school.name,
     metadata: {
       school_code: school.code,
       trial_converted_by: teacher.email,
       plan: 'standard'
     }
   });

   // Create invoice
   const invoice = await stripe.invoices.create({
     customer: customer.id,
     collection_method: 'send_invoice',
     days_until_due: 30,
     auto_advance: false,
     metadata: {
       school_code: school.code,
       plan: 'standard',
       trial_ended_at: new Date().toISOString()
     }
   });

   // Add invoice item
   await stripe.invoiceItems.create({
     customer: customer.id,
     price: 'price_1STqJpITKTyLzdk6grIrXT5j', // Standard Plan
     invoice: invoice.id,
     description: 'LanguageGems Standard Plan - Annual Subscription'
   });

   // Finalize and send invoice
   await stripe.invoices.finalizeInvoice(invoice.id);
   ```

### Phase 4: Invoice Payment
1. **School receives invoice** via email
2. **Finance department processes**:
   - Via Purchase Order (PO), or
   - Via bank transfer, or
   - Via credit card (optional)
3. **Stripe webhook confirms payment** (`invoice.paid`)
4. **System activates subscription**:
   - Set `subscription_status = 'active'`
   - Set `subscription_type = 'standard'` (or basic/large)
   - Set `subscription_start_date = NOW()`
   - Set `subscription_end_date = NOW() + INTERVAL '1 year'`
   - Grant full access based on plan tier
   - Send confirmation email to teacher

---

## Database Schema Updates Needed

### Add to `user_profiles` table:
```sql
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS trial_status VARCHAR(20) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_starts_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'free',
ADD COLUMN IF NOT EXISTS subscription_expires_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Create index for trial lookups
CREATE INDEX IF NOT EXISTS idx_trial_status ON public.user_profiles(trial_status);
CREATE INDEX IF NOT EXISTS idx_trial_ends_at ON public.user_profiles(trial_ends_at);
```

### Add to `school_codes` table:
```sql
ALTER TABLE public.school_codes
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS stripe_invoice_id VARCHAR(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invoice_status VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invoice_sent_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS invoice_paid_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;
```

---

## Environment Variables Required

Add these to your `.env.local`:

```bash
# Stripe Product IDs
NEXT_PUBLIC_STRIPE_TRIAL_PRODUCT_ID=prod_TQhgtc0KW2a7E3
NEXT_PUBLIC_STRIPE_BASIC_PRODUCT_ID=prod_TQhi9UjdIrPsMB
NEXT_PUBLIC_STRIPE_STANDARD_PRODUCT_ID=prod_TQhiiz3r13FUe7
NEXT_PUBLIC_STRIPE_LARGE_PRODUCT_ID=prod_TQhiFAIZyTWuEr

# Stripe Price IDs (One-Time Invoice)
STRIPE_BASIC_PRICE_ID=price_1STqJnITKTyLzdk6IZGyZZcX
STRIPE_STANDARD_PRICE_ID=price_1STqJpITKTyLzdk6grIrXT5j
STRIPE_LARGE_PRICE_ID=price_1STqJsITKTyLzdk6MqRqV29L

# Stripe Price IDs (Annual Subscription - Optional)
STRIPE_BASIC_ANNUAL_PRICE_ID=price_1STqIrITKTyLzdk6mVTTKpsa
STRIPE_STANDARD_ANNUAL_PRICE_ID=price_1STqIvITKTyLzdk64lLjeDcl
STRIPE_LARGE_ANNUAL_PRICE_ID=price_1STqIyITKTyLzdk6rcAGUllx
```

---

## Implementation Checklist

### Backend API Routes Needed:
- [ ] `POST /api/trial/start` - Start 14-day trial for teacher
- [ ] `POST /api/trial/check-status` - Check if trial is active/expired
- [ ] `POST /api/invoices/generate` - Generate Stripe invoice for school
- [ ] `POST /api/webhooks/stripe` - Handle invoice.paid webhook
- [ ] `GET /api/trial/usage-stats` - Get trial usage data for teacher

### Frontend Pages/Components:
- [ ] Trial signup flow at `/auth/signup-teacher?trial=true`
- [ ] Trial expiration modal/page
- [ ] School details form for invoice generation
- [ ] Trial status banner (shows days remaining)
- [ ] Invoice request confirmation page

### Email Templates:
- [ ] Trial started confirmation
- [ ] Trial day 7 reminder
- [ ] Trial day 12 reminder (2 days left)
- [ ] Trial expired notification
- [ ] Invoice sent confirmation
- [ ] Payment received confirmation

### Webhooks to Configure:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Key events:
- `invoice.created`
- `invoice.finalized`
- `invoice.sent`
- `invoice.paid`
- `invoice.payment_failed`

---

## Key Advantages of This Approach

✅ **Zero Friction**: Teachers can start immediately without payment details  
✅ **B2B Aligned**: Matches school purchasing workflows (PO/invoice)  
✅ **Trust Building**: 14 days to fall in love with the platform  
✅ **Qualified Leads**: Only engaged teachers request invoices  
✅ **Transparent Pricing**: Clear annual costs, no surprises  
✅ **School-Friendly**: Finance departments get proper invoices  
✅ **Flexible Payment**: Supports PO, bank transfer, or card  

---

## Next Steps

1. **Update database schema** with trial columns
2. **Create trial signup flow** in frontend
3. **Build invoice generation API** route
4. **Set up Stripe webhooks** for invoice payments
5. **Create email templates** for trial journey
6. **Update pricing pages** to highlight 14-day trial
7. **Add trial status tracking** to admin dashboard
8. **Test complete flow** end-to-end

---

## Testing the Flow

### Test Trial Start:
```typescript
// In your browser console or API testing tool
await fetch('/api/trial/start', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'teacher@school.ac.uk',
    school_name: 'Test Secondary School'
  })
});
```

### Test Invoice Generation:
```typescript
await fetch('/api/invoices/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    plan: 'standard',
    school_code: 'TEST001',
    finance_email: 'finance@school.ac.uk'
  })
});
```

---

**Setup Complete!** Your Stripe account now has:
- ✅ Trial product (£0)
- ✅ Basic Plan (£399/year)
- ✅ Standard Plan (£799/year)
- ✅ Large Plan (£1,199/year)
- ✅ Both invoice and subscription pricing options

Ready to implement the trial workflow! 🚀
