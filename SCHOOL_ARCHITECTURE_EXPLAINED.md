# School Architecture - Current State & Issues

## 🔍 **Current Database Schema**

### **school_codes** Table (Central School Registry)
```sql
id                      UUID PRIMARY KEY
code                    VARCHAR (e.g., "FCC", "LGDEMO") - UNIQUE school identifier
school_name             TEXT (e.g., "FCC School")
school_initials         VARCHAR (e.g., "FCC") - Short display name
subscription_status     TEXT (free/active/cancelled/past_due)
subscription_plan       TEXT (standard/large/mat)
stripe_subscription_id  TEXT
is_active               BOOLEAN
```

**Purpose**: Central registry of all schools with subscription info.

---

### **user_profiles** Table (User Information)
```sql
user_id                 UUID PRIMARY KEY
email                   TEXT
display_name            TEXT
role                    TEXT (teacher/student/admin/learner)
school_initials         VARCHAR - LEGACY FIELD ⚠️
school_code             TEXT - References school_codes.code
is_school_owner         BOOLEAN
school_owner_id         UUID - References owner's user_id
```

**Key Fields**:
- **`school_initials`**: LEGACY field from old system (still used by 179 FCC users)
- **`school_code`**: NEW field - references `school_codes.code`
- **`is_school_owner`**: True if user owns the school
- **`school_owner_id`**: Points to the school owner's user_id

---

### **school_memberships** Table (School Team Members)
```sql
id                      UUID PRIMARY KEY
school_code             TEXT - References school_codes.code
school_name             TEXT
owner_user_id           UUID - School owner
member_user_id          UUID - Team member
role                    TEXT (owner/member)
status                  TEXT (active/inactive)
joined_at               TIMESTAMPTZ
```

**Purpose**: Tracks which teachers belong to which schools.

---

### **classes** Table (Teacher Classes)
```sql
id                      UUID PRIMARY KEY
name                    VARCHAR (e.g., "9R/Sp1")
teacher_id              UUID - References user_profiles.user_id
level                   VARCHAR (beginner/intermediate/advanced/KS4)
year_group              TEXT (e.g., "9", "Year 10")
organization_id         UUID
```

**⚠️ ISSUE**: Classes table has NO school_code or school_initials field!
- Classes are only linked to individual teachers via `teacher_id`
- No way to query "all classes in FCC school"
- Teachers in same school CANNOT see each other's classes

---

## 📊 **Your Current Situation (danieletienne89@gmail.com)**

**Before Fix**:
```
school_initials: "FCC"     ✅ (Correct - your actual school)
school_code: "LGDEMO"      ❌ (Wrong - demo school I created)
is_school_owner: true      ✅ (For LGDEMO, not FCC)
```

**After Fix**:
```
school_initials: "FCC"     ✅ (Correct)
school_code: "FCC"         ✅ (Now correct!)
is_school_owner: true      ✅ (For FCC)
```

**FCC School**:
- **179 total users** (178 students + 1 teacher/admin - you)
- All have `school_initials = "FCC"`
- Most have `school_code = NULL` (legacy users)
- Now has proper `school_codes` entry

---

## 🎯 **Key Questions Answered**

### Q1: "What's the difference between school_id, school_code, and school_name?"

**`school_codes.id`** (UUID):
- Internal database primary key
- Example: `d72a6f70-dfea-4832-976e-3d80b4128340`
- NOT used for joins or references
- Just a technical ID

**`school_codes.code`** (VARCHAR):
- **The actual school identifier** used throughout the system
- Example: `"FCC"`, `"LGDEMO"`, `"MOOBRELLS"`
- Used in `user_profiles.school_code`
- Used in `school_memberships.school_code`
- **This is the main field for linking schools**

**`school_codes.school_name`** (TEXT):
- Full human-readable school name
- Example: `"FCC School"`, `"Language Gems Demo School"`
- Used for display purposes only

**`school_codes.school_initials`** (VARCHAR):
- Short display name
- Example: `"FCC"`, `"LGDEMO"`, `"LH"`
- Used for display in UI
- Often same as `code` but can be different

**Summary**:
- **`code`** = Primary identifier (like a username)
- **`school_name`** = Full name (like display name)
- **`school_initials`** = Short name (like nickname)
- **`id`** = Database UUID (internal only)

---

### Q2: "Can teachers within the same school see the classes of another teacher on the dashboard?"

**Current Answer**: ❌ **NO - NOT IMPLEMENTED**

**Why Not**:
1. `classes` table has NO `school_code` field
2. Classes only linked to individual `teacher_id`
3. No way to query "all classes in my school"
4. Dashboard only shows classes WHERE `teacher_id = current_user.id`

**What's Needed**:
1. Add `school_code` field to `classes` table
2. Populate it when teachers create classes
3. Update dashboard queries to show:
   - **My Classes** (teacher_id = me)
   - **School Classes** (school_code = my_school)
4. Add permissions/visibility controls

---

### Q3: "How are teachers connected at the moment?"

**Current Connection Methods**:

**Method 1: Legacy `school_initials`** (Old System)
- Teachers have `user_profiles.school_initials = "FCC"`
- Students have `user_profiles.school_initials = "FCC"`
- NO formal school structure
- NO school_codes entry
- NO school_memberships
- **179 FCC users use this method**

**Method 2: New `school_code` System** (New System)
- Teachers have `user_profiles.school_code = "FCC"`
- School exists in `school_codes` table
- Teachers listed in `school_memberships`
- Proper owner/member roles
- Subscription tracking
- **You now use this method for FCC**

**The Problem**:
- **Mixed system**: Some users use legacy, some use new
- **No migration**: Old FCC users still have `school_code = NULL`
- **Classes not linked**: Classes table doesn't reference schools

---

## 🚧 **What Needs to Be Done**

### 1. **Migrate Legacy Users to New System**

All 179 FCC users need:
```sql
UPDATE user_profiles
SET school_code = 'FCC'
WHERE school_initials = 'FCC' AND school_code IS NULL;
```

### 2. **Add School Code to Classes Table**

```sql
ALTER TABLE classes
ADD COLUMN school_code TEXT REFERENCES school_codes(code);

-- Populate existing classes with school code from teacher's profile
UPDATE classes c
SET school_code = up.school_code
FROM user_profiles up
WHERE c.teacher_id = up.user_id
AND up.school_code IS NOT NULL;
```

### 3. **Enable School-Wide Class Visibility**

Update dashboard queries to show:
- **My Classes**: `WHERE teacher_id = current_user.id`
- **School Classes**: `WHERE school_code = current_user.school_code`

Add UI toggle:
- [ ] My Classes Only
- [ ] All School Classes

### 4. **Deprecate `school_initials` Field**

Eventually remove `user_profiles.school_initials` and use only `school_code`.

---

## 📋 **Migration Plan for FCC**

### Step 1: Update All FCC Users
```sql
-- Set school_code for all FCC users
UPDATE user_profiles
SET school_code = 'FCC'
WHERE school_initials = 'FCC' AND school_code IS NULL;
```

### Step 2: Add School Code to Classes
```sql
-- Add column
ALTER TABLE classes ADD COLUMN school_code TEXT;

-- Populate from teacher profiles
UPDATE classes c
SET school_code = up.school_code
FROM user_profiles up
WHERE c.teacher_id = up.user_id;
```

### Step 3: Create School Memberships
```sql
-- Add all FCC teachers to school_memberships
INSERT INTO school_memberships (school_code, school_name, owner_user_id, member_user_id, role, status)
SELECT 
  'FCC',
  'FCC School',
  '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c', -- Your user_id (owner)
  user_id,
  CASE WHEN user_id = '9efcdbe9-7116-4bb7-a696-4afb0fb34e4c' THEN 'owner' ELSE 'member' END,
  'active'
FROM user_profiles
WHERE school_code = 'FCC' AND role = 'teacher'
ON CONFLICT DO NOTHING;
```

---

## 🎯 **Summary**

**Current State**:
- ✅ FCC school created in `school_codes`
- ✅ Your profile updated to use FCC
- ✅ School membership created for you
- ❌ 178 other FCC users still on legacy system
- ❌ Classes not linked to schools
- ❌ Teachers can't see each other's classes

**Next Steps**:
1. Migrate all FCC users to new school_code system
2. Add school_code to classes table
3. Implement school-wide class visibility
4. Update dashboard to show school classes

**Your Question**: "Can teachers within the same school see the classes of another teacher?"
**Answer**: Not yet - needs implementation of steps above.

