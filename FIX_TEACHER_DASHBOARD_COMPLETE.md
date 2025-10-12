# Complete Fix for Teacher Dashboard Issues

## 🎯 ROOT CAUSE IDENTIFIED

The teacher dashboard is showing zeros because of **TWO main issues**:

### Issue 1: Column Name Mismatch ❌
- **Table has:** `vocab_id`
- **Code queries:** `vocabulary_id`
- **Error:** `column assignment_vocabulary_progress.vocabulary_id does not exist`

### Issue 2: Empty Table ❌
- **Table:** `assignment_vocabulary_progress` has 0 records
- **Reason:** No trigger/function to populate it from `gem_events`
- **Impact:** Dashboard shows "not started" for all students

---

## 🔧 COMPLETE FIX (3 Steps)

### Step 1: Add Column Alias (Immediate Fix)

Run this SQL to add `vocabulary_id` as an alias for `vocab_id`:

```sql
-- Add vocabulary_id column as alias for vocab_id
ALTER TABLE assignment_vocabulary_progress 
ADD COLUMN vocabulary_id UUID;

-- Copy existing data (if any)
UPDATE assignment_vocabulary_progress 
SET vocabulary_id = vocab_id;

-- Make it auto-update
CREATE OR REPLACE FUNCTION sync_vocabulary_id()
RETURNS TRIGGER AS $$
BEGIN
  NEW.vocabulary_id := NEW.vocab_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_sync_vocabulary_id
  BEFORE INSERT OR UPDATE ON assignment_vocabulary_progress
  FOR EACH ROW
  EXECUTE FUNCTION sync_vocabulary_id();
```

### Step 2: Backfill Data from Existing Game Sessions

Populate `assignment_vocabulary_progress` from the 2,336 `gem_events` records:

```sql
-- Backfill assignment_vocabulary_progress from gem_events
INSERT INTO assignment_vocabulary_progress (
  student_id,
  assignment_id,
  vocab_id,
  vocabulary_id,
  seen_count,
  correct_count,
  incorrect_count,
  last_seen_at,
  created_at,
  updated_at
)
SELECT 
  ge.student_id,
  egs.assignment_id,
  ge.centralized_vocabulary_id as vocab_id,
  ge.centralized_vocabulary_id as vocabulary_id,
  COUNT(*) as seen_count,
  SUM(CASE 
    WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 
    ELSE 0 
  END) as correct_count,
  SUM(CASE 
    WHEN ge.gem_rarity = 'common' THEN 1 
    ELSE 0 
  END) as incorrect_count,
  MAX(ge.created_at) as last_seen_at,
  MIN(ge.created_at) as created_at,
  MAX(ge.created_at) as updated_at
FROM gem_events ge
JOIN enhanced_game_sessions egs ON ge.session_id = egs.id
WHERE egs.assignment_id IS NOT NULL
  AND ge.centralized_vocabulary_id IS NOT NULL
GROUP BY ge.student_id, egs.assignment_id, ge.centralized_vocabulary_id
ON CONFLICT (student_id, assignment_id, vocab_id) 
DO UPDATE SET
  seen_count = EXCLUDED.seen_count,
  correct_count = EXCLUDED.correct_count,
  incorrect_count = EXCLUDED.incorrect_count,
  last_seen_at = EXCLUDED.last_seen_at,
  updated_at = EXCLUDED.updated_at,
  vocabulary_id = EXCLUDED.vocabulary_id;
```

### Step 3: Create Trigger for Future Updates

Automatically populate `assignment_vocabulary_progress` when new `gem_events` are created:

```sql
-- Function to update assignment_vocabulary_progress from gem_events
CREATE OR REPLACE FUNCTION update_assignment_vocabulary_progress_from_gem()
RETURNS TRIGGER AS $$
DECLARE
  v_assignment_id UUID;
BEGIN
  -- Get assignment_id from the session
  SELECT assignment_id INTO v_assignment_id
  FROM enhanced_game_sessions
  WHERE id = NEW.session_id;
  
  -- Only proceed if this is an assignment session and has vocabulary
  IF v_assignment_id IS NOT NULL AND NEW.centralized_vocabulary_id IS NOT NULL THEN
    -- Insert or update the progress record
    INSERT INTO assignment_vocabulary_progress (
      student_id,
      assignment_id,
      vocab_id,
      vocabulary_id,
      seen_count,
      correct_count,
      incorrect_count,
      last_seen_at,
      created_at,
      updated_at
    ) VALUES (
      NEW.student_id,
      v_assignment_id,
      NEW.centralized_vocabulary_id,
      NEW.centralized_vocabulary_id,
      1,
      CASE WHEN NEW.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END,
      CASE WHEN NEW.gem_rarity = 'common' THEN 1 ELSE 0 END,
      NEW.created_at,
      NEW.created_at,
      NEW.created_at
    )
    ON CONFLICT (student_id, assignment_id, vocab_id)
    DO UPDATE SET
      seen_count = assignment_vocabulary_progress.seen_count + 1,
      correct_count = assignment_vocabulary_progress.correct_count + 
        CASE WHEN NEW.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END,
      incorrect_count = assignment_vocabulary_progress.incorrect_count + 
        CASE WHEN NEW.gem_rarity = 'common' THEN 1 ELSE 0 END,
      last_seen_at = NEW.created_at,
      updated_at = NEW.created_at,
      vocabulary_id = NEW.centralized_vocabulary_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS trigger_update_assignment_vocabulary_progress ON gem_events;
CREATE TRIGGER trigger_update_assignment_vocabulary_progress
  AFTER INSERT ON gem_events
  FOR EACH ROW
  EXECUTE FUNCTION update_assignment_vocabulary_progress_from_gem();
```

---

## 📊 Expected Results After Fix

### Before Fix:
```sql
SELECT COUNT(*) FROM assignment_vocabulary_progress;
-- Result: 0
```

### After Fix:
```sql
SELECT COUNT(*) FROM assignment_vocabulary_progress;
-- Result: ~500-1000 (based on 2,336 gem_events across different words)

SELECT 
  COUNT(DISTINCT student_id) as students,
  COUNT(DISTINCT assignment_id) as assignments,
  COUNT(DISTINCT vocab_id) as unique_words,
  SUM(seen_count) as total_exposures
FROM assignment_vocabulary_progress;
-- Result: 
-- students: ~80
-- assignments: ~10-15
-- unique_words: ~200-400
-- total_exposures: 2,336
```

---

## 🧪 Testing the Fix

### Test 1: Verify Column Exists
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'assignment_vocabulary_progress' 
  AND column_name IN ('vocab_id', 'vocabulary_id');
-- Should return both columns
```

### Test 2: Verify Data Populated
```sql
SELECT 
  a.name as assignment_name,
  COUNT(DISTINCT avp.student_id) as students_with_progress,
  COUNT(DISTINCT avp.vocab_id) as unique_words,
  SUM(avp.seen_count) as total_exposures
FROM assignment_vocabulary_progress avp
JOIN assignments a ON a.id = avp.assignment_id
GROUP BY a.id, a.name
ORDER BY total_exposures DESC;
```

### Test 3: Verify Trigger Works
```sql
-- This should happen automatically when a student plays a game
-- Check recent updates:
SELECT 
  student_id,
  assignment_id,
  vocab_id,
  seen_count,
  correct_count,
  incorrect_count,
  last_seen_at
FROM assignment_vocabulary_progress
ORDER BY updated_at DESC
LIMIT 10;
```

### Test 4: Test Dashboard Query
```sql
-- This is what the dashboard is trying to query:
SELECT 
  vocabulary_id,
  seen_count,
  correct_count,
  last_seen_at
FROM assignment_vocabulary_progress
WHERE assignment_id = 'ad5c388a-cc34-4b7b-a235-6595235d3c5f'
  AND student_id = '9f06ae73-dc0a-4ab6-86b9-b13987a9bb6e'
LIMIT 10;
-- Should return data without errors
```

---

## 🎯 Dashboard Pages That Will Be Fixed

### `/dashboard/progress`
- ✅ Will show actual student counts
- ✅ Will show assignment progress
- ✅ Will show game session counts

### `/dashboard/progress/assignment/[id]`
- ✅ Will show student progress (not "not started")
- ✅ Will show word-level analytics
- ✅ Will show correct/incorrect counts
- ✅ Will show last seen dates

### `/dashboard/vocabulary/analytics`
- ✅ Will show vocabulary exposure data
- ✅ Will show word mastery levels
- ✅ Will show student performance

---

## 🚀 How to Apply the Fix

### Option 1: Run SQL Directly in Supabase Dashboard

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste Step 1 SQL → Run
3. Copy and paste Step 2 SQL → Run
4. Copy and paste Step 3 SQL → Run
5. Refresh your teacher dashboard

### Option 2: Create Migration File

```bash
# Create new migration
supabase migration new fix_assignment_vocabulary_progress

# Add the SQL from Steps 1-3 to the migration file
# Then apply:
supabase db push
```

---

## ⚠️ Important Notes

1. **Gem Rarity Logic:**
   - `common` = incorrect answer (2 XP)
   - `uncommon` = correct answer (3 XP)
   - `rare` = fast correct answer (5 XP)
   - `epic` = streak bonus (10 XP)
   - `legendary` = perfect game (20 XP)

2. **Backfill Performance:**
   - Processing 2,336 gem_events should take < 1 second
   - No downtime required
   - Safe to run on production

3. **Future-Proof:**
   - Trigger ensures all future game sessions auto-populate
   - Both `vocab_id` and `vocabulary_id` columns maintained
   - No code changes required

---

## 📞 Next Steps

1. **Apply the fix** (run the 3 SQL scripts)
2. **Verify data** (run the test queries)
3. **Test dashboard** (refresh and check pages)
4. **Monitor** (check for any errors in next 24 hours)

**Ready to apply the fix?**

