# 🚀 LanguageGems Coming Soon Modal Setup Guide

## ✅ What's Been Implemented

### 1. **Beautiful Coming Soon Modal**
- **Location**: `src/components/modals/ComingSoonModal.tsx`
- **Features**: 
  - Animated modal with your exact marketing copy
  - 6 feature highlights with icons
  - Email signup form with first name, last name, and email
  - Success state with auto-close
  - Error handling
  - Responsive design

### 2. **Dual Database Integration**
- **Supabase**: Saves all signups to `beta_email_signups` table
- **Brevo**: Automatically adds contacts to your email marketing list
- **Graceful Fallback**: If Brevo fails, Supabase still saves the data

### 3. **Smart Display Logic**
- **Auto-shows**: Modal appears 2 seconds after page load
- **Once per day**: Uses localStorage to prevent spam
- **Non-logged users**: Only shows to visitors (not existing users)
- **Easy testing**: Currently set to show for everyone (see step 4 below)

### 4. **Admin Dashboard**
- **URL**: `/admin/coming-soon-signups`
- **Features**: View all signups, export to CSV, daily/weekly/monthly stats
- **Access**: Admin users only

### 5. **API Endpoints**
- **Main API**: `/api/coming-soon` - Handles form submissions
- **Test API**: `/test-brevo` - For testing Brevo integration
- **Stats API**: Built into existing beta email capture system

---

## 🔧 Setup Steps

### Step 1: Configure Brevo IP Authorization
**Issue**: Brevo is currently blocking requests due to IP restrictions.

**Solution**:
1. Go to [Brevo Security Settings](https://app.brevo.com/security/authorised_ips)
2. Add your server's IP address to the authorized list
3. For development, add your local IP address

**Alternative**: The system works fine without Brevo - all emails are saved to Supabase.

### Step 2: Configure Brevo Contact List
1. In Brevo, create a new contact list called "Coming Soon Signups"
2. Note the List ID (usually 1, 2, 3, etc.)
3. Update the list ID in `src/app/api/coming-soon/route.ts` line 25:
   ```typescript
   listIds: [1], // Change this to your list ID
   ```

### Step 3: Switch to Production Mode
In `src/app/page.tsx`, change line 97 from:
```typescript
if (true) { // TEMP: Always show for testing
```
to:
```typescript
if (!user) { // Only show to non-logged users
```

### Step 4: Customize the Modal (Optional)
Edit `src/components/modals/ComingSoonModal.tsx` to:
- Change feature descriptions
- Modify colors/styling
- Add/remove features
- Update marketing copy

---

## 📊 How to Use

### For Visitors
1. Visit your homepage
2. Modal appears after 2 seconds (if not seen today)
3. Fill out the form
4. Get confirmation message
5. Modal won't show again until tomorrow

### For Admins
1. Visit `/admin/coming-soon-signups`
2. View all signups with stats
3. Export data to CSV
4. Monitor daily/weekly/monthly growth

---

## 🎯 Marketing Copy Used

The modal uses your exact copy:

**Header**: "LanguageGems: Coming Soon!"
**Subtitle**: "The Ultimate GCSE Language Toolkit is almost here. Be the first to know when we launch!"

**Features Highlighted**:
1. AI-Powered Analytics
2. 15+ Dynamic Games  
3. Real-time Insights
4. Assessment Suite
5. Learn Through Music
6. Worksheet Generator

---

## 🔍 Testing

### Test the Modal
1. Visit `http://localhost:3000`
2. Modal should appear after 2 seconds
3. Fill out the form with a test email
4. Check success message

### Test Brevo Integration
1. Visit `http://localhost:3000/test-brevo`
2. Enter a test email
3. Check the result JSON
4. If Brevo fails, it's likely the IP authorization issue

### Check Admin Dashboard
1. Visit `http://localhost:3000/admin/coming-soon-signups`
2. View your test signups
3. Export to CSV to test functionality

---

## 📁 Files Created/Modified

### New Files:
- `src/components/modals/ComingSoonModal.tsx` - Main modal component
- `src/app/api/coming-soon/route.ts` - API endpoint
- `src/app/admin/coming-soon-signups/page.tsx` - Admin dashboard
- `src/app/test-brevo/page.tsx` - Testing page (remove before production)

### Modified Files:
- `src/app/page.tsx` - Added modal integration
- Database: Added `first_name` and `last_name` columns to `beta_email_signups`

---

## 🚀 Going Live

### Before Production:
1. ✅ Fix Brevo IP authorization
2. ✅ Set correct Brevo list ID
3. ✅ Change modal display logic to `if (!user)`
4. ✅ Remove `/test-brevo` page
5. ✅ Test on staging environment

### After Launch:
1. Monitor `/admin/coming-soon-signups` for signups
2. Export emails regularly for marketing campaigns
3. Use Brevo for email marketing to the collected list

---

## 💡 Pro Tips

1. **A/B Testing**: Create multiple versions of the modal to test conversion rates
2. **Timing**: Experiment with the 2-second delay - maybe 3-5 seconds works better
3. **Incentives**: Consider adding "Get 20% off when we launch" or similar
4. **Social Proof**: Add "Join 500+ educators already waiting" counter
5. **Exit Intent**: Add exit-intent detection to show modal when users try to leave

---

## 🛠️ Troubleshooting

**Modal not showing?**
- Check if you're logged in (it only shows to non-logged users in production)
- Clear localStorage: `localStorage.removeItem('comingSoonModalSeen')`
- Check browser console for errors

**Brevo not working?**
- Check IP authorization in Brevo settings
- Verify API key in `.env.local`
- Check server logs for detailed error messages

**Admin dashboard not accessible?**
- Ensure you're logged in as an admin user
- Check user role in database

---

Your Coming Soon modal is ready to capture leads and build anticipation for LanguageGems! 🎉
