# LanguageGems Database - Actual State & Issues

## ✅ CONFIRMED: Connected to Correct Database

**Project:** LanguageGems  
**Project Ref:** `xetsvpfunazwkontdpdh`  
**URL:** `https://xetsvpfunazwkontdpdh.supabase.co`

---

## 📊 Database Has SUBSTANTIAL Data

### Core Tables with Data ✅

| Table | Records | Details |
|-------|---------|---------|
| `gem_events` | 2,336 | 80 unique students, Aug 12 - Oct 12, 2025 |
| `enhanced_game_sessions` | 62,500 | 114 unique students |
| `classes` | 11 | 4 teachers |
| `user_profiles` | 244 | 231 students, 12 teachers, 1 admin |
| `assignments` | 17 | Active assignments |
| `enhanced_assignment_progress` | 256 | Student assignment progress |
| `assignment_game_progress` | 61 | Game-specific progress |
| `vocabulary_gem_collection` | 1,424 | Spaced repetition data |

### Empty/Missing Tables ❌

| Table | Status | Impact |
|-------|--------|--------|
| `assignment_vocabulary_progress` | **EXISTS but EMPTY (0 records)** | Dashboard can't show word-level progress |
| `student_vocabulary_analytics` | **DOESN'T EXIST** | Phase 2 analytics unavailable |
| `teacher_student_word_mastery` | **View doesn't exist** | Teacher analytics broken |
| `teacher_topic_analysis` | **View doesn't exist** | Topic analytics broken |

---

## 🚨 ROOT CAUSE: Why Dashboard Shows Zeros

### Issue 1: `assignment_vocabulary_progress` Table is Empty

**What it should contain:** Word-level tracking for each student in each assignment
- `student_id`, `assignment_id`, `vocabulary_id`
- `seen_count`, `correct_count`, `incorrect_count`
- `last_seen_at`, `mastery_level`

**Why it's empty:** The game sessions are recording data to `gem_events` and `enhanced_game_sessions`, but NOT populating `assignment_vocabulary_progress`.

**Impact:**
- `/dashboard/progress/assignment/[id]` shows "not started" for all students
- Word-level analytics unavailable
- Can't track which words students struggle with

### Issue 2: `student_vocabulary_analytics` Table Doesn't Exist

**What it should be:** Phase 2 unified analytics table (from migration `20250113000000_create_student_vocabulary_analytics.sql`)

**Why it doesn't exist:** Migration was never applied to production

**Impact:**
- `/dashboard/vocabulary/analytics` can't load
- Teacher analytics completely broken
- No unified view of student vocabulary mastery

### Issue 3: Console Error from Production

From the logs you shared:
```
GET https://xetsvpfunazwkontdpdh.supabase.co/rest/v1/assignment_vocabulary_progress?select=vocabulary_id%2Cseen_count%2Ccorrect_count%2Clast_seen_at&assignment_id=eq.ad5c388a-cc34-4b7b-a235-6595235d3c5f&student_id=eq.9f06ae73-dc0a-4ab6-86b9-b13987a9bb6e 400 (Bad Request)

❌ Error loading progress: {code: '42703', details: null, hint: null, message: 'column assignment_vocabulary_progress.vocabulary_id does not exist'}
```

**Problem:** The query is looking for `vocabulary_id` column, but the table schema might have `centralized_vocabulary_id` instead.

---

## 🔍 Data Flow Analysis

### Current Flow (What's Working) ✅

1. **Student plays game** → Creates `enhanced_game_sessions` record
2. **Student answers question** → Creates `gem_events` record
3. **Session ends** → Updates `enhanced_assignment_progress`
4. **Spaced repetition** → Updates `vocabulary_gem_collection`

### Broken Flow (What's NOT Working) ❌

1. **Word-level tracking** → Should update `assignment_vocabulary_progress` but doesn't
2. **Teacher analytics** → Should query `student_vocabulary_analytics` but table doesn't exist
3. **Dashboard queries** → Looking for columns that don't exist

---

## 🎯 SOLUTION PLAN

### Step 1: Check `assignment_vocabulary_progress` Schema

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'assignment_vocabulary_progress' 
ORDER BY ordinal_position;
```

**Expected columns:**
- `id`, `student_id`, `assignment_id`
- `vocabulary_id` OR `centralized_vocabulary_id`
- `seen_count`, `correct_count`, `incorrect_count`
- `last_seen_at`, `mastery_level`, `accuracy_percentage`

### Step 2: Apply Missing Migration

If `student_vocabulary_analytics` table doesn't exist, apply:
```bash
supabase/migrations/20250113000000_create_student_vocabulary_analytics.sql
```

This creates:
- `student_vocabulary_analytics` table
- `teacher_student_word_mastery` view
- `teacher_topic_analysis` view
- `record_vocabulary_interaction()` function

### Step 3: Backfill `assignment_vocabulary_progress`

Create a migration to populate `assignment_vocabulary_progress` from existing `gem_events` data:

```sql
INSERT INTO assignment_vocabulary_progress (
  student_id,
  assignment_id,
  centralized_vocabulary_id,
  seen_count,
  correct_count,
  incorrect_count,
  last_seen_at
)
SELECT 
  ge.student_id,
  egs.assignment_id,
  ge.centralized_vocabulary_id,
  COUNT(*) as seen_count,
  SUM(CASE WHEN ge.gem_rarity IN ('rare', 'epic', 'legendary') THEN 1 ELSE 0 END) as correct_count,
  SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) as incorrect_count,
  MAX(ge.created_at) as last_seen_at
FROM gem_events ge
JOIN enhanced_game_sessions egs ON ge.session_id = egs.id
WHERE egs.assignment_id IS NOT NULL
  AND ge.centralized_vocabulary_id IS NOT NULL
GROUP BY ge.student_id, egs.assignment_id, ge.centralized_vocabulary_id
ON CONFLICT (student_id, assignment_id, centralized_vocabulary_id) 
DO UPDATE SET
  seen_count = EXCLUDED.seen_count,
  correct_count = EXCLUDED.correct_count,
  incorrect_count = EXCLUDED.incorrect_count,
  last_seen_at = EXCLUDED.last_seen_at;
```

### Step 4: Fix Column Name Mismatch

If the table has `centralized_vocabulary_id` but code is querying `vocabulary_id`, either:

**Option A:** Add `vocabulary_id` column as alias
```sql
ALTER TABLE assignment_vocabulary_progress 
ADD COLUMN vocabulary_id UUID 
GENERATED ALWAYS AS (centralized_vocabulary_id) STORED;
```

**Option B:** Update application code to use `centralized_vocabulary_id`

### Step 5: Create Trigger to Auto-Populate

Create a trigger so future game sessions automatically update `assignment_vocabulary_progress`:

```sql
CREATE OR REPLACE FUNCTION update_assignment_vocabulary_progress()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO assignment_vocabulary_progress (
    student_id,
    assignment_id,
    centralized_vocabulary_id,
    seen_count,
    correct_count,
    incorrect_count,
    last_seen_at
  )
  SELECT 
    NEW.student_id,
    egs.assignment_id,
    NEW.centralized_vocabulary_id,
    1,
    CASE WHEN NEW.gem_rarity IN ('rare', 'epic', 'legendary') THEN 1 ELSE 0 END,
    CASE WHEN NEW.gem_rarity = 'common' THEN 1 ELSE 0 END,
    NEW.created_at
  FROM enhanced_game_sessions egs
  WHERE egs.id = NEW.session_id
    AND egs.assignment_id IS NOT NULL
    AND NEW.centralized_vocabulary_id IS NOT NULL
  ON CONFLICT (student_id, assignment_id, centralized_vocabulary_id)
  DO UPDATE SET
    seen_count = assignment_vocabulary_progress.seen_count + 1,
    correct_count = assignment_vocabulary_progress.correct_count + 
      CASE WHEN NEW.gem_rarity IN ('rare', 'epic', 'legendary') THEN 1 ELSE 0 END,
    incorrect_count = assignment_vocabulary_progress.incorrect_count + 
      CASE WHEN NEW.gem_rarity = 'common' THEN 1 ELSE 0 END,
    last_seen_at = NEW.created_at;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_assignment_vocabulary_progress
  AFTER INSERT ON gem_events
  FOR EACH ROW
  EXECUTE FUNCTION update_assignment_vocabulary_progress();
```

---

## 📋 IMMEDIATE NEXT STEPS

1. **Check schema** of `assignment_vocabulary_progress` table
2. **Apply missing migration** for `student_vocabulary_analytics`
3. **Backfill data** from `gem_events` to `assignment_vocabulary_progress`
4. **Create trigger** for automatic updates
5. **Test dashboard** to verify data appears

---

## 🎯 Expected Results After Fix

### Dashboard `/dashboard/progress`
- ✅ Shows 11 classes
- ✅ Shows 231 students
- ✅ Shows 17 assignments
- ✅ Shows 62,500 game sessions

### Dashboard `/dashboard/vocabulary/analytics`
- ✅ Shows 1,424 words tracked
- ✅ Shows word-level mastery data
- ✅ Shows student exposure counts
- ✅ Shows topic analysis

### Dashboard `/dashboard/progress/assignment/[id]`
- ✅ Shows student progress (not "not started")
- ✅ Shows word-level analytics
- ✅ Shows correct/incorrect counts
- ✅ Shows last seen dates

---

**Ready to proceed with the fixes?**

