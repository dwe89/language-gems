# 🚨 CRITICAL: Vocabulary Tracking Gap in Assignments

## Issue Summary

**Students completing assignments with vocabulary exercises have ZERO vocabulary data recorded in analytics.**

### Current State (Jan 7, 2026)
- Class: 9UV/Sp (28 students)
- Students with vocabulary data: 15/28 (53%)  
- Students with ZERO vocabulary data: 13/28 (47%)

### Students Affected (ZERO vocabulary data)
1. Saina'A Abouelela - has assignments ✅, no vocab ❌
2. Huey Anderson - has assignments ✅, no vocab ❌
3. Bobby Cripps - has assignments ✅, no vocab ❌
4. Louix Elsden-Webb - has assignments ✅, no vocab ❌
5. Jensen Greenfield - has assignments ✅, no vocab ❌
6. Edward Harper - has assignments ✅, no vocab ❌
7. Eray Karakus - has assignments ✅, no vocab ❌
8. Tyler Logan - has assignments ✅, no vocab ❌
9. Ibrahim Lubani - has assignments ✅, no vocab ❌
10. Matiss Polewczyk-Gavrilovs - has assignments ✅, no vocab ❌
11. Jessica Szwarc - has assignments ✅, no vocab ❌
12. Charlotte Winter - has assignments ✅, no vocab ❌
13. Test student - has assignments ✅, no vocab ❌

## Root Cause Analysis

### What's Working ✅
- Free-play games (Vocab Blast, Word Towers, etc.) CORRECTLY populate `vocabulary_gem_collection`
- Game-based assignments CORRECTLY track `enhanced_assignment_progress`
- 15 students who played games have vocabulary data showing correctly

### What's Broken ❌
- **Assignment vocabulary exercises do NOT populate `vocabulary_gem_collection`**
- **Assignment vocabulary exercises do NOT populate `assignment_vocabulary_progress`** (518 records exist but NOT for students with 0 data)
- Students only doing assignments show 0% accuracy and 0 total words

## Database State

### Tables and Record Counts (9UV/Sp class)
```sql
vocabulary_gem_collection: 147 records, 15 students
assignment_vocabulary_progress: 518 records, 21 students
enhanced_assignment_progress: 55 records (tracks completion, not vocabulary)
```

### Data Verification
Students WITH vocabulary data:
- Isla Robinson: 21 gems
- Molly Pryer: 20 gems
- Jacob Fairey: 19 gems
- Polina Karastan: 19 gems
- [... 11 more students]

Students WITHOUT vocabulary data:
- Huey Anderson: 0 gems, but has 2 assignment_progress records
- Bobby Cripps: 0 gems, but has 2 assignment_progress records
- [... 11 more students]

## Expected Behavior

When a student completes an assignment with vocabulary exercises:
1. ✅ `enhanced_assignment_progress` records should be created (WORKING)
2. ❌ `vocabulary_gem_collection` should be updated for each word (BROKEN)
3. ❌ `assignment_vocabulary_progress` should track word-level progress (BROKEN)

## Code Investigation

### Services That Should Handle This

1. **`AssignmentProgressService.ts`** - Has `recordVocabularyProgress()` method
   - Path: `src/services/AssignmentProgressService.ts`
   - Should upsert to `assignment_vocabulary_progress`
   - **Status: Method exists but may not be called**

2. **`UnifiedAssignmentService.ts`** - Has `recordWordProgress()` method
   - Path: `src/services/UnifiedAssignmentService.ts`
   - Should upsert to `vocabulary_gem_collection`
   - **Status: Method exists but may not be called**

3. **Assignment Progress API** - `/api/assignments/[assignmentId]/progress`
   - Path: `src/app/api/assignments/[assignmentId]/progress/route.ts`
   - Should handle vocabulary progress from client
   - **Status: Has code for `student_vocabulary_assignment_progress` table (wrong table name?)**

### Potential Issues

1. **Games not calling vocabulary tracking methods**
   - Games may only call overall progress API
   - Word-level tracking may not be triggered

2. **API endpoint using wrong table name**
   - Code references `student_vocabulary_assignment_progress`
   - Actual table is `assignment_vocabulary_progress`

3. **Missing integration between assignment completion and gem collection**
   - Assignment progress tracked separately from vocabulary gems
   - No bridge between the two systems

## Impact

### Teacher Impact
- **Cannot see student vocabulary progress** for assignment work
- **Cannot identify struggling words** for 47% of students
- **Cannot track vocabulary mastery** accurately
- **Cannot assign targeted practice** based on weak areas

### Student Impact
- **No vocabulary analytics** despite completing work
- **No spaced repetition** for assignment vocabulary
- **No mastery tracking** for learned words
- **No personalized practice** recommendations

### System Impact
- **Analytics dashboards show incomplete data**
- **"Never logged in" false positives** (PARTIALLY FIXED)
- **Vocabulary tab shows 0% accuracy** for active students
- **Progress tracking completely broken** for assignment-only students

## Immediate Fix Required

### Priority 1: Verify Table Schema
```sql
-- Check if correct table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name IN (
  'assignment_vocabulary_progress',
  'student_vocabulary_assignment_progress'
);
```

### Priority 2: Trace API Call Flow
1. Student completes vocabulary exercise in assignment
2. Client calls `/api/assignments/[id]/progress` with vocab data
3. API should insert/update vocabulary progress
4. **VERIFY THIS CHAIN IS WORKING**

### Priority 3: Add Logging
Add console.log statements to track:
- When vocab progress is sent from client
- When API receives vocab progress
- When database insert/update happens
- Any errors during the process

## Action Plan

### Phase 1: Investigation (1-2 hours)
- [ ] Check if games call `recordVocabularyProgress` 
- [ ] Verify correct table name in database
- [ ] Add logging to assignment progress API
- [ ] Test with one student completing one assignment
- [ ] Capture network requests in browser devtools

### Phase 2: Fix (2-4 hours)
- [ ] Fix table name mismatch if exists
- [ ] Ensure games call vocabulary tracking methods
- [ ] Update API to populate both tables:
  - `assignment_vocabulary_progress` (for assignments)
  - `vocabulary_gem_collection` (for overall progress)
- [ ] Add error handling for failed inserts

### Phase 3: Testing (1-2 hours)
- [ ] Test with Huey Anderson completing an assignment
- [ ] Verify vocabulary data appears in analytics
- [ ] Check that 0% accuracy students now show real data
- [ ] Verify "Never logged in" false positives are gone

### Phase 4: Backfill (2-4 hours)
- [ ] Script to backfill vocabulary data for existing assignments
- [ ] Use `enhanced_assignment_progress` to identify completed assignments
- [ ] Calculate vocabulary progress retroactively if possible
- [ ] Update analytics to show correct historical data

## Related Issues Fixed

1. ✅ "Never logged in" false positives - FIXED in:
   - `src/app/api/teacher-analytics/class-summary/route.ts`
   - `src/services/teacherVocabularyAnalytics.ts`
   - `src/components/teacher/TeacherVocabularyAnalyticsDashboard.tsx`

2. ❌ Vocabulary tracking gap - IDENTIFIED but NOT FIXED

## Questions for Product Team

1. Should assignments populate `vocabulary_gem_collection`?
   - Or should they only track in `assignment_vocabulary_progress`?
   
2. Should assignment vocabulary use FSRS for spaced repetition?
   - Or is it only for free-play games?

3. What's the difference between:
   - `assignment_vocabulary_progress` (exists, has 518 records)
   - `student_vocabulary_assignment_progress` (referenced in code, may not exist)

4. Should we backfill data for students who already completed assignments?
   - Or only fix going forward?

## Files Modified Today

1. `src/app/api/teacher-analytics/class-summary/route.ts` - Added assignment progress check
2. `src/services/teacherVocabularyAnalytics.ts` - Added assignment activity tracking
3. `src/components/teacher/TeacherVocabularyAnalyticsDashboard.tsx` - Fixed "never logged in" filter

## Next Steps

**IMMEDIATE:** Open browser devtools and watch network requests when a student completes an assignment with vocabulary. Check:
1. Is vocabulary progress being sent in the POST body?
2. Is the API receiving it?
3. Is it being inserted into the database?
4. Are there any errors in console?

**After identifying the gap, the fix should be straightforward** - ensure the vocabulary tracking chain is complete from game → API → database.

---

**Created:** January 7, 2026  
**Status:** CRITICAL - 47% of students have zero vocabulary data  
**Priority:** P0 - Blocks teacher visibility into student learning
