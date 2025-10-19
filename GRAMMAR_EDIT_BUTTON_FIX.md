# Grammar Edit Button Fix - Issue Resolution

## Problem Summary
The "Edit Page" button on `/grammar-v2/spanish/syntax/word-order` was throwing errors when attempting to save changes.

### Errors Encountered:
1. **❌ Error: Grammar page not found** (Frontend alert)
2. **500 Internal Server Error** (API response)
3. **PGRST116: The result contains 0 rows** (Supabase error)
4. **React NotFoundError: Failed to execute 'insertBefore' on 'Node'** (DOM error)

---

## Root Cause Analysis

### Investigation Steps:
1. ✅ **Database Check**: Grammar page exists in `grammar_pages` table
   - `id`: `a8a9060a-d3b2-4095-9d1e-9b84bd630a42`
   - `language`: `spanish`
   - `category`: `syntax`
   - `topic_slug`: `word-order`

2. ✅ **User Authorization**: User is authenticated as admin
   - `user_id`: `9efcdbe9-7116-4bb7-a696-4afb0fb34e4c`
   - `email`: `danieletienne89@gmail.com`
   - `role`: `admin` (from `user_profiles` table)

3. ❌ **API Route Issue**: The route exists but was failing with RLS permissions

### The Actual Problem:
The API route at `/api/admin/grammar/update` was using the **regular server-side Supabase client** which respects Row-Level Security (RLS) policies. The RLS policy on `grammar_pages` checks:

```sql
((auth.jwt() ->> 'role'::text) = 'admin'::text)
```

However, the user's JWT token doesn't contain a `role` field in the token itself - it's stored in the `user_profiles` table instead. This caused the RLS policy to **block the update operation** even though:
- The user IS an admin (verified in code)
- The page exists in the database
- The API endpoint was correctly authenticating

---

## The Solution

### Fix Applied:
Modified `/src/app/api/admin/grammar/update/route.ts` to use the **Service Role Client** for database operations:

```typescript
// Before (BROKEN):
const { data, error } = await supabase
  .from('grammar_pages')
  .update(updates)
  .eq('language', language)
  .eq('category', category)
  .eq('topic_slug', topic_slug)
  .select();

// After (FIXED):
// Use service role client to bypass RLS for admin operations
const serviceSupabase = createServiceRoleClient();

const { data, error } = await serviceSupabase
  .from('grammar_pages')
  .update(updates)
  .eq('language', language)
  .eq('category', category)
  .eq('topic_slug', topic_slug)
  .select();
```

### Why This Works:
1. The route **still verifies** the user is an admin by checking `user_profiles.role`
2. After verification, it uses the **service role client** which bypasses RLS
3. This is secure because the admin check happens BEFORE the database operation
4. The service role client is only used after authentication/authorization succeeds

---

## Security Considerations

✅ **This is secure** because:
- User authentication is verified FIRST
- Admin role is checked in `user_profiles` table BEFORE any database operation
- Service role client is only used AFTER these checks pass
- The service role client is never exposed to the client-side

❌ **Do NOT** use service role client for:
- Client-side operations
- Unauthenticated endpoints
- Operations that don't have proper role verification

---

## Testing Checklist

To verify the fix works:

1. ✅ Navigate to `/grammar-v2/spanish/syntax/word-order`
2. ✅ Click the "Edit Page" button (floating button bottom-right)
3. ✅ Modal opens with current page data
4. ✅ Make a change (e.g., modify the title)
5. ✅ Click "Save Changes"
6. ✅ Success message appears: "✅ Page edited successfully!"
7. ✅ Page reloads showing the updated content
8. ✅ Changes are persisted in the database

---

## Alternative Solutions Considered

### Option 1: Fix the RLS Policy ❌ (Not chosen)
We could have modified the RLS policy to join with `user_profiles`:

```sql
CREATE POLICY "Only admins can modify grammar pages"
ON grammar_pages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM user_profiles
    WHERE user_profiles.user_id = auth.uid()
    AND user_profiles.role = 'admin'
  )
);
```

**Why we didn't use this:**
- Requires database migration
- Adds join overhead to every query
- Service role client is more efficient for admin operations

### Option 2: Store role in JWT ❌ (Not scalable)
Store the role in the JWT token during authentication.

**Why we didn't use this:**
- JWT tokens are immutable once issued
- Role changes wouldn't take effect until re-login
- Adds complexity to auth flow

---

## Related Files Modified

- ✅ `/src/app/api/admin/grammar/update/route.ts`

## Related Files (Context)

- `/src/components/admin/GrammarEditButton.tsx` - Floating edit button
- `/src/components/admin/SimpleGrammarEditModal.tsx` - Edit modal UI
- `/src/app/grammar-v2/[language]/[category]/[topic]/page.tsx` - Grammar page template
- `/src/utils/supabase/client.ts` - Supabase client factory (includes `createServiceRoleClient`)

---

## Date Fixed
**October 18, 2025**

## Status
✅ **RESOLVED** - Edit functionality now works correctly
