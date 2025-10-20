# Grammar Assignment Integration - Bug Fixes

**Total Bugs Fixed: 6**
- ✅ Wrong routes (ISO codes instead of language names)
- ✅ `supabase.raw is not a function` error
- ✅ Grammar lesson tracking not implemented
- ✅ Wrong column name (`completed_at` vs `ended_at`)
- ✅ Grammar gems not showing on dashboard
- ✅ Foreign key constraint preventing grammar gem events

## Issues Identified and Fixed

### Issue 1: Wrong Routes for Grammar Activities ❌ → ✅

**Problem:**
- Assignment was navigating to `/lesson` route which doesn't exist (404 error)
- Test mode was navigating to `/quiz` instead of `/test`
- Routes were using ISO language codes (`es`) instead of full names (`spanish`)
- Routes were using `skill.category` instead of fetching the actual category slug from database

**Example of Wrong Route:**
```
/grammar/es/adjectives/adjective-agreement/practice
```

**Example of Correct Route:**
```
/grammar/spanish/adjectives/adjective-agreement/practice
```

**Root Cause:**
The `handlePlaySkill` function was:
1. Using incorrect route mappings for skill types
2. Only fetching `slug` from database, not `category` and `language`
3. Using `skill.category` which might not be the correct slug

**Fix:**
1. Updated route mappings:
   - `lesson` → redirects to `/practice` (lesson pages don't support assignment mode yet)
   - `practice` → `/practice` ✓
   - `quiz` and `test` → both redirect to `/test` ✓

2. Fetch complete topic data from database:
   ```typescript
   const { data: topicData } = await supabaseBrowser
     .from('grammar_topics')
     .select('slug, category, language')  // ← Fetch all needed fields
     .eq('id', topicId)
     .single();
   ```

3. Map language ISO codes to full names:
   ```typescript
   const mapLanguageToRoute = (lang: string) => {
     const map: Record<string, string> = {
       'es': 'spanish',
       'fr': 'french',
       'de': 'german',
       'it': 'italian'
     };
     return map[lang] || lang;
   };
   ```

4. Build correct URL using database values:
   ```typescript
   const languageSlug = mapLanguageToRoute(topicData.language);
   const categorySlug = topicData.category;
   const topicSlug = topicData.slug;

   skillUrl = `/grammar/${languageSlug}/${categorySlug}/${topicSlug}/practice?assignment=${assignmentId}`;
   ```

**Files Modified:**
- `src/app/student-dashboard/assignments/[assignmentId]/page.tsx` (lines 477-554)

---

### Issue 2: Duplicate Session Constraint Error ❌ → ✅

**Problem:**
```
duplicate key value violates unique constraint "unique_session_per_student_content"
```

**Root Cause:**
The original unique constraint was too restrictive:
```sql
CONSTRAINT unique_session_per_student_content UNIQUE (student_id, content_id, started_at)
```

This prevented students from:
1. Having multiple completed sessions for the same content
2. Retrying practice/tests after completion

**Fix:**
Created a **partial unique index** that only prevents duplicate **active** sessions:
```sql
CREATE UNIQUE INDEX unique_active_session_per_student_content 
ON grammar_assignment_sessions (student_id, content_id) 
WHERE completion_status = 'in_progress';
```

**Benefits:**
- ✅ Prevents duplicate active sessions (data integrity)
- ✅ Allows multiple completed sessions (students can retry)
- ✅ Enables proper progress tracking over time

**Migration Applied:**
- `supabase/migrations/[timestamp]_fix_grammar_session_unique_constraint.sql`

---

### Issue 3: Multiple Session Starts ❌ → ✅

**Problem:**
Sessions were being created multiple times:
```
✅ [GRAMMAR SESSION] Session started: 14260cf5-faeb-4405-b474-2a9ba7acd6f7
✅ [GRAMMAR SESSION] Session started: 7a4d5999-a29d-4be3-a092-36e5151efcad
```

**Root Cause:**
The `useEffect` hook in `GrammarPractice.tsx` had too many dependencies, causing it to re-run multiple times:
```typescript
// BEFORE (problematic)
}, [assignmentId, topicId, contentId, userId, sessionId, isTestMode, questionCount, practiceItems.length]);
```

**Fix 1: Reduced Dependencies**
```typescript
// AFTER (fixed)
}, [assignmentId, topicId, contentId, userId]);
// Only run once when component mounts with required data
```

**Fix 2: Session Resume Logic**
Added logic to `GrammarSessionService.startSession()` to check for existing active sessions:
```typescript
// Check if there's already an active session
const { data: existingSession } = await this.supabase
  .from('grammar_assignment_sessions')
  .select('id')
  .eq('student_id', sessionData.student_id)
  .eq('content_id', sessionData.content_id)
  .eq('completion_status', 'in_progress')
  .maybeSingle();

// If exists, resume instead of creating new
if (existingSession) {
  console.log('♻️ [GRAMMAR SESSION] Resuming existing session:', existingSession.id);
  return existingSession.id;
}
```

**Files Modified:**
- `src/components/grammar/GrammarPractice.tsx` (lines 99-136)
- `src/services/grammar/GrammarSessionService.ts` (lines 60-110)

---

## Testing Verification

### Before Fixes:
- ❌ 404 error on `/lesson` route
- ❌ Wrong route for test mode (`/quiz` instead of `/test`)
- ❌ Duplicate session constraint errors
- ❌ Multiple sessions created for same activity

### After Fixes:
- ✅ Correct routes for all grammar activities
- ✅ No duplicate session errors
- ✅ Single session per activity (or resume existing)
- ✅ Clean console logs with proper session tracking

---

## Updated Testing Steps

1. **Create Grammar Assignment**
   - Navigate to: `http://localhost:3000/dashboard/assignments`
   - Create assignment with grammar topics
   - Note the assignment ID

2. **Test Practice Mode**
   - Click on grammar skill from assignment page
   - Should navigate to: `/grammar/spanish/[category]/[topic]/practice?assignment=<id>`
   - Check console for: `🎓 [GRAMMAR SESSION] Starting session`
   - Complete practice session
   - Verify session recorded in database

3. **Test Test Mode**
   - Click on grammar test from assignment page
   - Should navigate to: `/grammar/spanish/[category]/[topic]/test?assignment=<id>`
   - Check console for session start
   - Complete test session
   - Verify higher gem rewards for test mode

4. **Test Session Resume**
   - Start a practice session but don't complete it
   - Refresh the page or navigate away and back
   - Should see: `♻️ [GRAMMAR SESSION] Resuming existing session`
   - No duplicate session errors

5. **Test Multiple Completions**
   - Complete a practice session fully
   - Start the same practice again
   - Should create a new session (previous one is completed)
   - Both sessions should be recorded in database

---

## Database Changes

### Cleaned Up Duplicate Sessions
```sql
-- Removed duplicate in-progress sessions
-- Kept only the most recent session for each student-content pair
```

### New Constraint
```sql
-- Old (removed):
CONSTRAINT unique_session_per_student_content UNIQUE (student_id, content_id, started_at)

-- New (active):
CREATE UNIQUE INDEX unique_active_session_per_student_content 
ON grammar_assignment_sessions (student_id, content_id) 
WHERE completion_status = 'in_progress';
```

---

### Issue 4: Wrong Column Name in Query ❌ → ✅

**Problem:**
- Student dashboard was querying `completed_at` column which doesn't exist
- Database error: `column grammar_assignment_sessions.completed_at does not exist`
- The actual column name is `ended_at`

**Error Message:**
```
Error fetching grammar sessions: {
  code: '42703',
  message: 'column grammar_assignment_sessions.completed_at does not exist'
}
```

**Root Cause:**
The query in `src/app/student-dashboard/assignments/[assignmentId]/page.tsx` was selecting `completed_at` instead of `ended_at`.

**Fix:**
Changed all references from `completed_at` to `ended_at`:

```typescript
// BEFORE (broken):
.select(`
  topic_id,
  completion_status,
  final_score,
  accuracy_percentage,
  duration_seconds,
  completed_at,  // ❌ Wrong column name
  grammar_topics (title)
`)

// AFTER (fixed):
.select(`
  topic_id,
  completion_status,
  final_score,
  accuracy_percentage,
  duration_seconds,
  ended_at,  // ✅ Correct column name
  grammar_topics (title)
`)
```

Also updated the code that uses this field:
```typescript
// BEFORE:
const lastCompleted = topicSessions
  .filter(s => s.completed_at)
  .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())[0]?.completed_at;

// AFTER:
const lastCompleted = topicSessions
  .filter(s => s.ended_at)
  .sort((a, b) => new Date(b.ended_at!).getTime() - new Date(a.ended_at!).getTime())[0]?.ended_at;
```

**Files Modified:**
- `src/app/student-dashboard/assignments/[assignmentId]/page.tsx` (lines 149, 280-281)

---

### Issue 5: Grammar Gems Not Showing on Dashboard ❌ → ✅

**Problem:**
- Grammar sessions were being completed and gems were being calculated
- But grammar gems were showing as **0** on the student dashboard
- The dashboard's "Grammar Gems" section was empty

**Root Cause:**
The `GemsAnalyticsService` queries the `gem_events` table to count gems by type (`activity`, `mastery`, `grammar`). However, when grammar sessions completed, we were only updating the `gems_earned` field in `grammar_assignment_sessions` - we weren't creating entries in the `gem_events` table.

**Fix:**
Added `createGrammarGemEvents()` method to create gem events when sessions complete:

```typescript
// In GrammarSessionService.endSession()
if (gemsEarned > 0) {
  await this.createGrammarGemEvents(sessionData.student_id, sessionId, gemsEarned, xpEarned);
}

// New method
private async createGrammarGemEvents(
  studentId: string,
  sessionId: string,
  gemsEarned: number,
  xpEarned: number
): Promise<void> {
  const gemEvents = [];
  for (let i = 0; i < gemsEarned; i++) {
    gemEvents.push({
      student_id: studentId,
      session_id: sessionId,
      gem_type: 'grammar',  // ← Key: marks as grammar gem
      gem_rarity: 'common',
      xp_value: Math.floor(xpEarned / gemsEarned),
      created_at: new Date().toISOString()
    });
  }

  await this.supabase.from('gem_events').insert(gemEvents);
}
```

Also updated `GrammarLessonTracker` to create gem events when lessons are completed.

**Files Modified:**
- `src/services/grammar/GrammarSessionService.ts` - Added gem event creation
- `src/components/grammar/GrammarLessonTracker.tsx` - Added gem event creation for lessons

**Result:**
- ✅ Grammar gems now appear in the dashboard's "Today's Gem Breakdown"
- ✅ Grammar XP is tracked separately from activity/mastery XP
- ✅ Total XP includes grammar contributions

---

### Issue 6: Foreign Key Constraint Preventing Grammar Gem Events ❌ → ✅

**Problem:**
- When trying to create gem events for grammar sessions, got error:
  ```
  insert or update on table "gem_events" violates foreign key constraint "gem_events_session_id_fkey"
  Key is not present in table "enhanced_game_sessions"
  ```
- The `gem_events.session_id` column had a foreign key constraint to `enhanced_game_sessions`
- But grammar sessions are stored in `grammar_assignment_sessions`, not `enhanced_game_sessions`
- This prevented any grammar gem events from being created

**Root Cause:**
The `gem_events` table was designed for game sessions only, with a strict foreign key constraint:
```sql
ALTER TABLE gem_events
  ADD CONSTRAINT gem_events_session_id_fkey
  FOREIGN KEY (session_id)
  REFERENCES enhanced_game_sessions(id);
```

**Fix:**
Created migration to remove the constraint and make `session_id` nullable:

```sql
-- Drop the existing foreign key constraint
ALTER TABLE gem_events DROP CONSTRAINT IF EXISTS gem_events_session_id_fkey;

-- Make session_id nullable to allow flexibility
ALTER TABLE gem_events ALTER COLUMN session_id DROP NOT NULL;

-- Add a comment explaining the session_id usage
COMMENT ON COLUMN gem_events.session_id IS
  'References either enhanced_game_sessions.id for game sessions or
   grammar_assignment_sessions.id for grammar sessions. Nullable to allow flexibility.';
```

**Files Modified:**
- `supabase/migrations/[timestamp]_fix_gem_events_grammar_sessions.sql` - NEW migration

**Result:**
- ✅ Grammar gem events can now be created successfully
- ✅ `session_id` can reference either game sessions or grammar sessions
- ✅ Flexible design allows for future session types (e.g., VocabMaster sessions)

---

## Summary

All critical bugs have been fixed:

1. ✅ **Routing Issues** - Correct routes for all grammar activity types with proper language names
2. ✅ **Duplicate Constraints** - Partial unique index allows retries while preventing duplicates
3. ✅ **Multiple Sessions** - Reduced dependencies and added resume logic
4. ✅ **Session Tracking** - Clean, reliable session creation and tracking
5. ✅ **Supabase.raw Error** - Fixed to use fetch-then-update pattern
6. ✅ **Lesson Tracking** - Implemented automatic lesson view tracking
7. ✅ **Column Name Error** - Fixed `completed_at` → `ended_at`
8. ✅ **Grammar Gems Dashboard** - Grammar gems now show up in student dashboard
9. ✅ **Foreign Key Constraint** - Removed constraint blocking grammar gem events

The grammar assignment integration is now ready for full end-to-end testing!

---

## Known Issues

### Issue 7: Assignment Page Showing Duplicate Data for Skills 🔍

**Problem:**
- All skill cards on the assignment page show the same data
- Example: "Topics Progress: 3/1 completed" on every card
- Each card should show progress for its own topics only

**Status:** Under investigation
- Added debugging logs to track skill mapping
- Need to verify `topicIds` are correctly assigned to each skill

---

## Next Steps

1. Test the complete flow with a real assignment
2. Verify gem rewards are calculated correctly
3. Check analytics dashboard displays session data
4. Confirm student dashboard shows progress accurately
5. Test edge cases (incomplete sessions, retries, etc.)

