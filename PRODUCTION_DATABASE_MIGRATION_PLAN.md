# Production Database Migration Plan

## 🚨 CRITICAL DISCOVERY

Your **local development database** has all the required tables and data, but your **production database** (`xetsvpfunazwkontdpdh.supabase.co`) is missing most of the core application tables.

---

## 📊 Current State

### Production Database HAS:
- ✅ `profiles`, `users` (43 users: 39 teachers, 2 dept heads, 1 admin, 0 students)
- ✅ `question_bank`, `worksheets`, `worksheet_*` tables
- ✅ `resource_*` tables (downloads, views, ratings)
- ✅ `beta_*` tables (testers, feedback, requests)
- ✅ `student_vocabulary_analytics` (empty - 0 records)
- ✅ Basic infrastructure tables

### Production Database MISSING:
- ❌ `classes` - Class management
- ❌ `class_enrollments` - Student-class relationships
- ❌ `assignments` - Assignment definitions
- ❌ `assignment_progress` - Student assignment progress
- ❌ `assignment_game_progress` - Per-game progress
- ❌ `enhanced_game_sessions` - Game session tracking
- ❌ `game_sessions` - Legacy game sessions
- ❌ `gem_events` - Gem reward tracking
- ❌ `user_profiles` - Extended user information
- ❌ `vocabulary_gem_collection` - Spaced repetition progress
- ❌ `user_vocabulary_progress` - VocabMaster progress
- ❌ `word_performance_logs` - Word-level performance
- ❌ `centralized_vocabulary` - Main vocabulary source
- ❌ `grammar_*` tables - Grammar practice system
- ❌ And many more...

### Local Development Database HAS:
- ✅ ALL tables including classes, assignments, game sessions, gem events
- ✅ Student data (student ID: `9f06ae73-dc0a-4ab6-86b9-b13987a9bb6e`)
- ✅ Game session data (session ID: `7921b3ba-b95d-4158-8e91-335ea1f5bdc1`)
- ✅ Gem events (successfully inserting data)
- ✅ All migrations applied

---

## 🎯 Why This Happened

Looking at the migration history, the production database has **237 migrations applied**, but many critical migrations are missing the actual table creation. This suggests:

1. **Migrations were applied but tables weren't created** - Possible migration failures
2. **Tables were created then dropped** - The `database_comprehensive_cleanup.sql` script may have been run
3. **Different migration order** - Some migrations may have failed due to dependencies

---

## 🚀 RECOMMENDED SOLUTION

### Option 1: Apply Missing Migrations to Production ✅ RECOMMENDED

**Pros:**
- Gets production fully functional
- Preserves existing production data (teachers, worksheets, resources)
- Enables all features (classes, assignments, games, analytics)

**Cons:**
- No historical student data (starts fresh)
- Requires careful migration order
- Need to test thoroughly

**Steps:**

1. **Backup Production Database**
   ```bash
   # Use Supabase dashboard to create a backup
   ```

2. **Identify Critical Missing Migrations**
   - `20250324190000_add_assignments_tables.sql` - Assignment system
   - `20250619000000_enhanced_game_system.sql` - Game tracking
   - `20250810000000_gems_first_reward_system.sql` - Gem events
   - `20250601080814_teacher_student_account_system.sql` - Classes & enrollments
   - `20250720032605_create_centralized_vocabulary_system.sql` - Vocabulary
   - `20250816000000_create_grammar_gems_system.sql` - Grammar system

3. **Apply Migrations in Order**
   ```bash
   # Use Supabase CLI or dashboard SQL editor
   supabase db push
   ```

4. **Verify Tables Created**
   ```sql
   SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
   AND tablename IN ('classes', 'assignments', 'gem_events', 'enhanced_game_sessions')
   ORDER BY tablename;
   ```

5. **Create Demo Data**
   - Create 2-3 demo classes
   - Create 10-15 demo students
   - Create sample assignments
   - Generate sample game sessions

---

### Option 2: Copy Local Database to Production ⚠️ RISKY

**Pros:**
- Fastest solution
- Includes all existing local data

**Cons:**
- **WILL OVERWRITE ALL PRODUCTION DATA**
- Loses production teachers, worksheets, resources
- Very risky - could break production

**NOT RECOMMENDED** - Too risky, would lose valuable production data.

---

### Option 3: Hybrid Approach - Selective Table Migration

**Pros:**
- Preserves production data
- Adds missing tables
- Can migrate specific local data if needed

**Cons:**
- Complex to execute
- Requires careful data mapping
- Time-consuming

**Steps:**

1. **Export table schemas from local database**
   ```bash
   pg_dump -h localhost -U postgres -s -t classes -t assignments -t gem_events > missing_tables.sql
   ```

2. **Apply schemas to production**
   ```sql
   -- Run missing_tables.sql in production
   ```

3. **Optionally migrate specific data**
   ```bash
   # Export specific student/class data from local
   pg_dump -h localhost -U postgres -a -t classes -t class_enrollments > class_data.sql
   ```

---

## 📋 IMMEDIATE ACTION PLAN

### Step 1: Confirm Current State (5 min)

Run these queries in **production** database:

```sql
-- Check if any game/assignment tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public' 
AND (tablename LIKE '%game%' OR tablename LIKE '%assignment%' OR tablename LIKE '%class%')
ORDER BY tablename;

-- Check migration history
SELECT version, name FROM supabase_migrations.schema_migrations 
WHERE name LIKE '%game%' OR name LIKE '%assignment%' OR name LIKE '%class%'
ORDER BY version DESC;
```

### Step 2: Backup Production (10 min)

1. Go to Supabase Dashboard → Database → Backups
2. Create manual backup
3. Download backup file
4. Store safely

### Step 3: Apply Critical Migrations (30-60 min)

**Priority 1: Core Infrastructure**
```sql
-- 1. Teacher/Student Account System
-- Run: 20250601080814_teacher_student_account_system.sql

-- 2. Assignment System
-- Run: 20250324190000_add_assignments_tables.sql

-- 3. Centralized Vocabulary
-- Run: 20250720032605_create_centralized_vocabulary_system.sql
```

**Priority 2: Game & Tracking**
```sql
-- 4. Enhanced Game System
-- Run: 20250619000000_enhanced_game_system.sql

-- 5. Gem Events System
-- Run: 20250810000000_gems_first_reward_system.sql

-- 6. Assignment Progress
-- Run: 20250110000000_consolidate_assignment_progress.sql
```

**Priority 3: Analytics**
```sql
-- 7. Grammar System
-- Run: 20250816000000_create_grammar_gems_system.sql

-- 8. Competition System
-- Run: 20250125100000_create_competition_system.sql
```

### Step 4: Verify Tables Created (10 min)

```sql
-- Check all critical tables exist
SELECT tablename, pg_size_pretty(pg_total_relation_size('public.'||tablename)) as size 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
  'classes', 'class_enrollments', 'assignments', 'assignment_progress',
  'enhanced_game_sessions', 'gem_events', 'user_profiles',
  'centralized_vocabulary', 'vocabulary_gem_collection'
)
ORDER BY tablename;
```

### Step 5: Create Demo Data (30 min)

```sql
-- Create demo teacher
INSERT INTO user_profiles (id, role, full_name, school_code)
VALUES ('demo-teacher-id', 'teacher', 'Demo Teacher', 'DEMO001');

-- Create demo class
INSERT INTO classes (id, name, teacher_id, language, year_group)
VALUES ('demo-class-id', 'Demo Class 7A', 'demo-teacher-id', 'es', 7);

-- Create demo students
INSERT INTO user_profiles (id, role, full_name, school_code)
VALUES 
  ('demo-student-1', 'student', 'Demo Student 1', 'DEMO001'),
  ('demo-student-2', 'student', 'Demo Student 2', 'DEMO001');

-- Enroll students
INSERT INTO class_enrollments (class_id, student_id)
VALUES 
  ('demo-class-id', 'demo-student-1'),
  ('demo-class-id', 'demo-student-2');
```

### Step 6: Test Dashboard (15 min)

1. Visit `/dashboard/classes`
2. Check class appears
3. Visit `/dashboard/progress`
4. Verify no errors
5. Test assignment creation
6. Test student game play

---

## ⚠️ CRITICAL WARNINGS

1. **DO NOT run `database_comprehensive_cleanup.sql`** - It will delete all tables
2. **DO NOT copy local database to production** - Will overwrite production data
3. **ALWAYS backup before running migrations**
4. **Test migrations on a staging database first** if possible

---

## 🔍 How to Check Which Database You're Using

### In Browser Console:
```javascript
// Check Supabase URL
console.log(window.__supabaseClient?.supabaseUrl);
// Should show: https://xetsvpfunazwkontdpdh.supabase.co
```

### In .env.local:
```bash
NEXT_PUBLIC_SUPABASE_URL=https://xetsvpfunazwkontdpdh.supabase.co
```

### In Supabase CLI:
```bash
supabase status
# Shows local vs remote connection
```

---

## 📞 DECISION NEEDED

**Question for you:**

1. **Do you want to apply all missing migrations to production?**
   - This will enable all features but start with empty student data
   - Existing teacher accounts and worksheets will be preserved

2. **Do you have any production student data that needs to be preserved?**
   - If yes, we need to identify where it's stored
   - If no, we can proceed with fresh migrations

3. **Is the local database data important?**
   - If yes, we can selectively migrate specific classes/students
   - If no, we can ignore it and start fresh in production

**Recommended Answer:** Apply all missing migrations to production, preserve existing teacher/worksheet data, start fresh with student data.

---

## 🎯 NEXT STEPS

Once you confirm the approach, I will:

1. Generate the exact SQL commands to run
2. Create a migration checklist
3. Provide verification queries
4. Help test the dashboard after migration

**Ready to proceed?**

