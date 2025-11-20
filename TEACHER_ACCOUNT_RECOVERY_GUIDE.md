# Teacher Account Recovery Guide

## Problem: Teacher Account Shows "Learner" View Instead of "Teacher Dashboard"

This happens when the `handle_new_user` database trigger fails to properly create the user profile during signup, leaving the account in an inconsistent state.

---

## **Critical Tables and Their Relationships**

### **1. `auth.users` (Supabase Auth)**
- **Purpose**: Core authentication data maintained by Supabase Auth system
- **Critical Column**: `raw_user_meta_data` (JSONB)
  - Contains: `role`, `name`, `email`, `plan`, `user_type`
  - **This is what the app reads FIRST during login**

### **2. `public.user_profiles` (Application Data)**
- **Purpose**: Extended user profile data for application logic
- **Critical Columns**:
  - `user_id` (UUID) - Links to `auth.users.id`
  - `email` (TEXT)
  - `role` (TEXT) - Should be `'teacher'`, `'student'`, `'learner'`, or `'admin'`
  - `subscription_type` (VARCHAR) - Should be `'standard'`, `'large'`, `'large_school'`, `'free'`, or `'premium'`
  - `subscription_status` (TEXT) - Should be `'active'`, `'cancelled'`, `'expired'`, etc.
  - `school_code` (TEXT) - Links to `school_codes.code`
  - `school_owner_id` (UUID) - Links to the admin/owner's `user_id`
  - `is_school_owner` (BOOLEAN) - `true` for school admins, `false` for teachers

### **3. `public.school_memberships`**
- **Purpose**: Tracks which users belong to which schools
- **Critical Columns**:
  - `school_code` (TEXT)
  - `member_user_id` (UUID)
  - `owner_user_id` (UUID)
  - `role` (TEXT) - `'owner'` or `'member'`
  - `status` (TEXT) - Should be `'active'`

### **4. `public.pending_teacher_invitations`**
- **Purpose**: Tracks pending and accepted teacher invitations
- **Critical Columns**:
  - `teacher_email` (TEXT)
  - `school_code` (TEXT)
  - `status` (TEXT) - Should be updated to `'accepted'` after signup

### **5. `auth.sessions`**
- **Purpose**: Stores active user sessions
- **CRITICAL**: Old sessions cache the metadata from when they were created
- **Solution**: Delete all sessions to force re-login with fresh data

---

## **Step-by-Step Recovery Process**

### **Step 1: Verify the Problem**

```sql
-- Check auth metadata (what the app reads during login)
SELECT id, email, raw_user_meta_data 
FROM auth.users 
WHERE email = 'teacher@example.com';

-- Check user profile
SELECT user_id, email, role, subscription_type, subscription_status, 
       school_code, school_owner_id, is_school_owner
FROM user_profiles 
WHERE email = 'teacher@example.com';

-- Check school membership
SELECT * 
FROM school_memberships 
WHERE member_user_id = 'USER_UUID_HERE';
```

---

### **Step 2: Fix `auth.users.raw_user_meta_data`**

**CRITICAL**: The app reads the `role` from `auth.users.raw_user_meta_data` FIRST. If this is wrong, nothing else matters.

```sql
-- Update the auth metadata to mark user as teacher
UPDATE auth.users 
SET raw_user_meta_data = jsonb_set(
  raw_user_meta_data, 
  '{role}', 
  '"teacher"'
)
WHERE email = 'teacher@example.com';

-- Optional: Also update plan and user_type for consistency
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data 
  || '{"role":"teacher","plan":"standard","user_type":"b2b"}'::jsonb
WHERE email = 'teacher@example.com';
```

---

### **Step 3: Create/Fix `user_profiles` Entry**

```sql
-- If profile doesn't exist, create it
INSERT INTO user_profiles (
  user_id, 
  email, 
  role, 
  display_name, 
  subscription_type, 
  subscription_status,
  school_code,
  school_owner_id,
  is_school_owner
) VALUES (
  'USER_UUID_HERE',
  'teacher@example.com',
  'teacher',
  'Teacher Name',
  'standard',  -- Match the school's subscription plan
  'active',
  'FCC',  -- School code
  'SCHOOL_OWNER_UUID_HERE',  -- Admin's user_id
  false
)
ON CONFLICT (user_id) DO UPDATE SET
  role = EXCLUDED.role,
  subscription_type = EXCLUDED.subscription_type,
  subscription_status = EXCLUDED.subscription_status,
  school_code = EXCLUDED.school_code,
  school_owner_id = EXCLUDED.school_owner_id;
```

**IMPORTANT**: The `subscription_type` MUST be one of:
- `'standard'` - For Standard Plan (£799/year) - **Most common**
- `'large'` or `'large_school'` - For Large School Plan (£1199/year)
- `'free'` - Will be treated as demo user (NO ACCESS)
- `'premium'` - Not recognized by the app, will fall back to `'teacher_basic'`

---

### **Step 4: Create/Fix `school_memberships` Entry**

```sql
-- Create school membership if it doesn't exist
INSERT INTO school_memberships (
  school_code,
  school_name,
  owner_user_id,
  member_user_id,
  role,
  status,
  invited_at,
  joined_at
) VALUES (
  'FCC',
  'Felpham Community College',
  'SCHOOL_OWNER_UUID_HERE',
  'TEACHER_UUID_HERE',
  'member',
  'active',
  NOW(),
  NOW()
)
ON CONFLICT DO NOTHING;
```

---

### **Step 5: Update `pending_teacher_invitations`**

```sql
-- Mark invitation as accepted
UPDATE pending_teacher_invitations
SET status = 'accepted',
    updated_at = NOW()
WHERE teacher_email = 'teacher@example.com'
  AND school_code = 'FCC';
```

---

### **Step 6: Force Session Refresh (CRITICAL)**

Even if you fix everything above, the user's browser will still have the old cached session with incorrect metadata.

```sql
-- Delete all active sessions to force fresh login
DELETE FROM auth.sessions 
WHERE user_id = 'USER_UUID_HERE';
```

**Tell the user to:**
1. Refresh the page (they'll be logged out)
2. Log in again with their credentials
3. They should now see the Teacher Dashboard

---

## **Access Control Logic in the App**

The app determines user access based on `subscription_type` in `user_profiles`:

- `'standard'` → `teacher_standard` → ✅ Full access (assignments, analytics, custom vocab)
- `'large'` or `'large_school'` → `teacher_large` → ✅ Full access + priority support
- `'free'` → `demo` → ❌ No teacher features
- `'premium'` → Falls back to `'teacher_basic'` → ⚠️ Limited access (no assignments, no analytics)

**Source**: `src/hooks/useUserAccess.ts` lines 95-120

---

## **Common Pitfalls**

### ❌ **Wrong**: Setting `subscription_type = 'premium'`
The app doesn't recognize `'premium'` for teachers and falls back to `'teacher_basic'`, which has restricted access.

### ✅ **Correct**: Setting `subscription_type = 'standard'`
This matches the school's plan and grants full teacher features.

---

### ❌ **Wrong**: Only updating `user_profiles` and `school_memberships`
The app reads `auth.users.raw_user_meta_data.role` FIRST. If this says `'learner'`, the user will see the learner view.

### ✅ **Correct**: Update ALL THREE:
1. `auth.users.raw_user_meta_data`
2. `user_profiles`
3. `auth.sessions` (delete them)

---

## **Quick Copy-Paste Template**

Replace these placeholders:
- `TEACHER_EMAIL` - The teacher's email
- `TEACHER_UUID` - The teacher's `user_id`
- `TEACHER_NAME` - The teacher's display name
- `SCHOOL_CODE` - The school code (e.g., `'FCC'`)
- `SCHOOL_NAME` - Full school name
- `SCHOOL_OWNER_UUID` - The admin/owner's `user_id`

```sql
-- 1. Fix auth metadata
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data 
  || '{"role":"teacher","plan":"standard","user_type":"b2b"}'::jsonb
WHERE email = 'TEACHER_EMAIL';

-- 2. Create/update user profile
INSERT INTO user_profiles (
  user_id, email, role, display_name, 
  subscription_type, subscription_status,
  school_code, school_owner_id, is_school_owner
) VALUES (
  'TEACHER_UUID', 'TEACHER_EMAIL', 'teacher', 'TEACHER_NAME',
  'standard', 'active', 'SCHOOL_CODE', 'SCHOOL_OWNER_UUID', false
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'teacher',
  subscription_type = 'standard',
  subscription_status = 'active',
  school_code = 'SCHOOL_CODE',
  school_owner_id = 'SCHOOL_OWNER_UUID';

-- 3. Create school membership
INSERT INTO school_memberships (
  school_code, school_name, owner_user_id, member_user_id,
  role, status, invited_at, joined_at
) VALUES (
  'SCHOOL_CODE', 'SCHOOL_NAME', 'SCHOOL_OWNER_UUID', 'TEACHER_UUID',
  'member', 'active', NOW(), NOW()
)
ON CONFLICT DO NOTHING;

-- 4. Mark invitation as accepted
UPDATE pending_teacher_invitations
SET status = 'accepted', updated_at = NOW()
WHERE teacher_email = 'TEACHER_EMAIL' AND school_code = 'SCHOOL_CODE';

-- 5. Force session refresh
DELETE FROM auth.sessions WHERE user_id = 'TEACHER_UUID';
```

---

## **Prevention**

To prevent this issue in the future, check the `handle_new_user` trigger:

```sql
SELECT pg_get_functiondef('handle_new_user'::regproc);
```

Ensure it's creating profiles correctly and logging errors properly. The current trigger silently fails and returns success even when profile creation fails.

---

## **Summary Checklist**

- [ ] Update `auth.users.raw_user_meta_data` → Set `role: "teacher"`
- [ ] Create/update `user_profiles` → Set `role: "teacher"`, `subscription_type: "standard"`
- [ ] Create `school_memberships` entry → Link to school and owner
- [ ] Update `pending_teacher_invitations` → Mark as `accepted`
- [ ] **Delete `auth.sessions`** → Force fresh login
- [ ] Tell user to refresh page and log in again
