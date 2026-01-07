# 🚨 CRITICAL: LOGIN TRACKING AUDIT REPORT - COMPREHENSIVE FINDINGS

**Date**: January 7, 2026  
**Scope**: Complete audit of student login and activity tracking across all systems  
**Status**: 🔴 MULTIPLE CRITICAL ISSUES IDENTIFIED

---

## EXECUTIVE SUMMARY

Your concern about inconsistent student login tracking is **100% VALID**. The audit reveals **7 critical issues** in how the system tracks and reports student activity:

1. ❌ **Students marked as "never logged in" but ARE active** (FALSE POSITIVES)
2. ❌ **Incomplete activity tracking** - only game sessions counted, not assignments/vocab
3. ❌ **Time range inconsistencies** - different filters between views
4. ❌ **Game session filtering removes legitimate data** (memory-game, abandoned sessions)
5. ❌ **Data is 50+ days old** - students from Oct/Nov showing as "never logged in" in Jan
6. ❌ **Missing real-time session tracking** for some games
7. ❌ **Inconsistent counts** between "all classes" vs individual class views

---

## DETAILED FINDINGS

### ISSUE #1: FALSE POSITIVE "NEVER LOGGED IN" STUDENTS

**The Problem:**
- **Huey Anderson, Bobby Cripps, Louix Elsden-Webb, Jensen Greenfield** all show as "never logged in"
- BUT they have documented activity in `enhanced_assignment_progress` (Nov 19, 2025)
- Louix even has a hangman game session

**Root Cause:**
The "never logged in" calculation ONLY looks at `enhanced_game_sessions`, completely ignoring:
- ✅ `enhanced_assignment_progress` (they completed assignments!)
- ✅ `assignment_vocabulary_progress` (vocab tracking)
- ✅ `gem_events` (activity tracking)

**Impact:** High  
**Severity:** Critical - Teachers trust this data for intervention decisions

**Evidence:**
```
Student: Huey Anderson
  • Game Sessions: ❌ NO
  • Gem Events: ❌ NO
  • Vocab Progress: ❌ NO
  • Assignment Progress: ✅ YES (2 assignments, latest Nov 19)
  → Flagged as "never logged in" ❌ FALSE POSITIVE
```

---

### ISSUE #2: INCOMPLETE ACTIVITY TRACKING

**The Problem:**
The API endpoint `/api/teacher-analytics/class-summary` ONLY queries `enhanced_game_sessions` for the "never logged in" calculation.

**What's Missing:**
1. `enhanced_assignment_progress` - Students completing assignments
2. `assignment_vocabulary_progress` - Vocabulary practice activity
3. `gem_events` - XP/gamification system tracking
4. Grammar lesson tracking (`grammar_sessions` or similar)

**Current Code (class-summary/route.ts:380-386):**
```typescript
const studentsNeverLoggedIn = studentRiskScores.filter((s: any) => s.lastActive === null);
// ↑ This ONLY checks game sessions, ignores all other activity types
```

**Should Check:**
- Game sessions + vocab progress + assignment progress + grammar activity + any gem events

---

### ISSUE #3: DATA AGE PROBLEM (Critical for "Last 30 Days")

**The Problem:**
Student sessions are from October 15 - November 19, 2025.  
Today is January 7, 2026 (50+ days later).

When teachers select "Last 30 Days":
- 30 days ago = December 8, 2025
- ALL student sessions are BEFORE December 8 ❌
- Result: 0 active students found

**Timeline:**
```
Oct 15 ──── Oct 30 ──── Nov 19 ──── Dec 8 ──── Jan 7
          Sessions ↓                  ↓        ↓
                                30-day window  TODAY
                              (empty!)
```

**Impact:** Students who ARE active (in Nov) show as inactive if filtered to last 30 days

---

### ISSUE #4: GAME SESSION FILTERING REMOVES VALID DATA

**The Problem:**
The API filters out sessions before analyzing:

```typescript
const activeSessions = gameSessions?.filter((s: any) =>
  (s.accuracy_percentage > 0 || s.words_attempted > 0) &&
  s.game_type !== 'memory-game'  // ← Removes memory-game sessions
) || [];
```

**What Gets Removed:**
- 21 memory-game sessions (luck-based game)
- Sessions with 0% accuracy AND 0 words attempted (maybe legitimate quick-quits?)

**Queries Show:**
- Total sessions (unfiltered): 228
- After filtering (filtered): ~207

**Problem:** Some games might not record accuracy/words correctly, and we're losing that data

---

### ISSUE #5: MEMORY GAME EXCLUDED FROM TRACKING

**The Problem:**
Memory game sessions are explicitly filtered out:
```typescript
s.game_type !== 'memory-game'  // ← Line 287 in class-summary/route.ts
```

**Why:** Marked as "luck-based" but students still logged in to play it!

**Stats for this class:**
- Memory game sessions: 21
- Students affected: Unknown (need to check)

**Question:** If a student ONLY played memory games, they'd show as "never logged in" even though they logged in and played

---

### ISSUE #6: INCONSISTENT "NEVER LOGGED IN" COUNTS

**All Classes View:**
- Default timeRange: `'all_time'` ✅
- But could be changed to `'last_30_days'`
- If last_30_days: 209 students without sessions

**Individual Class View:**
- Default timeRange: `'all_time'` ✅
- For class 4e83f9c1-bb86-4ae6-b404-72c0014ff59d: 6 students without sessions
- If last_30_days: 28 students without sessions

**The Inconsistency:**
The user reported **45 students** in all-classes but different number in individual class.

**Most Likely Explanation:**
- All Classes: Using `current_term` (84 days) without vocab filter = 156 students
- Individual Class: Using a different calculation or different timeRange

---

### ISSUE #7: MISSING TRACKING FOR SOME GAMES

**Games That Might Have Tracking Issues:**
✅ Word Blast - records to `enhanced_game_sessions`  
✅ Hangman - records to `enhanced_game_sessions`  
✅ Memory Game - records but **filtered out** ❌  
❓ Grammar games - need verification  
❓ Reading comprehension - need verification  
❓ Other games - need verification

**Check needed:** Are all 15 games recording sessions properly?

---

## DATABASE TABLES INVOLVED

| Table | Purpose | Coverage |
|-------|---------|----------|
| `enhanced_game_sessions` | 🎮 Game play tracking | Most games |
| `gem_events` | 💎 XP/gamification | Activity tracking |
| `enhanced_assignment_progress` | ✅ Assignment completion | Assignment status |
| `assignment_vocabulary_progress` | 📚 Vocab practice | Word encounters |
| `grammar_sessions` | 📖 Grammar lessons | Grammar tracking? |
| `enhanced_game_sessions` filtered by `game_type !== 'memory-game'` | **EXCLUDES** | 21 sessions! |

---

## WHAT THE API ACTUALLY QUERIES

**File:** `/src/app/api/teacher-analytics/class-summary/route.ts`

**Current Query Chain:**
1. Get classes for teacher (or school if scope='school')
2. Get enrollments from those classes
3. Get `enhanced_game_sessions` with filters:
   - `student_id` in enrollments
   - `created_at` >= dateFilter
   - Filter out: `game_type === 'memory-game'`
   - Filter out: `accuracy_percentage === 0 AND words_attempted === 0`
4. Calculate `lastActive` from game sessions ONLY
5. Mark as "never logged in" if `lastActive === null` ❌

**Missing:**
- No checks for assignment progress activity
- No checks for vocab progress activity
- No checks for other game types

---

## RECOMMENDED FIXES (Priority Order)

### FIX #1: EXPAND "LAST ACTIVE" CALCULATION (CRITICAL)

Include ALL activity sources when determining if a student logged in:

```typescript
// Instead of ONLY checking game sessions:
let lastActiveDate: Date | null = null;

if (studentSessions.length > 0) {
  lastActiveDate = new Date(studentSessions[0].created_at);
}

// NOW CHECK ALL OTHER SOURCES TOO:
if (lastVocabActivity && (!lastActiveDate || lastVocabActivity > lastActiveDate)) {
  lastActiveDate = lastVocabActivity;
}

if (lastAssignmentActivity && (!lastActiveDate || lastAssignmentActivity > lastActiveDate)) {
  lastActiveDate = lastAssignmentActivity;
}

if (lastGrammarActivity && (!lastActiveDate || lastGrammarActivity > lastActiveDate)) {
  lastActiveDate = lastGrammarActivity;
}

// ONLY NOW mark as never logged in if all are null:
const hasNeverLoggedIn = lastActiveDate === null;
```

### FIX #2: STOP FILTERING OUT MEMORY GAMES (MEDIUM)

```typescript
// Remove this filter if memory-game is a legitimate game students play:
// s.game_type !== 'memory-game'

// Or create a separate "skill-based" vs "all games" metric
```

### FIX #3: INCLUDE VOCAB & ASSIGNMENT ACTIVITY (MEDIUM)

Add to the risk calculation:
```typescript
const totalVocabExposures = studentVocabProgress.reduce(...);  // Already doing this
const totalAssignmentItems = studentAssignmentProgress.length;

// Use these in hasAnyActivity check:
const hasAnyActivity = studentSessions.length > 0 || 
                      totalVocabExposures > 0 || 
                      totalAssignmentItems > 0;
```

### FIX #4: CLARIFY TIME RANGE DEFAULT (LOW)

Ensure both "all classes" and individual class use same timeRange default OR make it explicit in UI.

---

## VERIFICATION QUERIES

Run these SQL queries to verify the issues:

```sql
-- Students with NO game sessions but with assignment progress
SELECT DISTINCT ce.student_id, up.display_name, COUNT(eap.id) as assignment_count
FROM class_enrollments ce
JOIN user_profiles up ON ce.student_id = up.user_id
JOIN enhanced_assignment_progress eap ON ce.student_id = eap.student_id
LEFT JOIN enhanced_game_sessions egs ON ce.student_id = egs.student_id
WHERE ce.class_id = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d'
AND egs.id IS NULL
GROUP BY ce.student_id, up.display_name;

-- Session count by game type
SELECT game_type, COUNT(*) as count
FROM enhanced_game_sessions
WHERE student_id IN (SELECT student_id FROM class_enrollments WHERE class_id = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d')
GROUP BY game_type;

-- Vocab progress by student
SELECT COUNT(DISTINCT student_id) as students_with_vocab
FROM assignment_vocabulary_progress
WHERE student_id IN (SELECT student_id FROM class_enrollments WHERE class_id = '4e83f9c1-bb86-4ae6-b404-72c0014ff59d')
AND seen_count > 0;
```

---

## AUDIT DATA SUMMARY

### Specific Students Mentioned (Class 4e83f9c1-bb86-4ae6-b404-72c0014ff59d)

**Huey Anderson**
- Game sessions: ❌ 0
- Assignment progress: ✅ 2 entries (Nov 19, 2025)
- Vocab progress: ❌ 0
- Last active: Nov 19, 2025
- **Status**: FALSE POSITIVE - marked as never logged in but HAS activity

**Bobby Cripps**
- Game sessions: ❌ 0
- Assignment progress: ✅ 2 entries (Nov 19, 2025)
- Vocab progress: ❌ 0
- Last active: Nov 19, 2025
- **Status**: FALSE POSITIVE - marked as never logged in but HAS activity

**Louix Elsden-Webb**
- Game sessions: ✅ 1 (hangman, Nov 19, 2025)
- Assignment progress: ✅ 2 entries (Nov 19, 2025)
- Vocab progress: ❌ 0
- Last active: Nov 19, 2025
- **Status**: Actually HAS activity, correctly identified (but only because of game session)

**Jensen Greenfield**
- Game sessions: ❌ 0
- Assignment progress: ✅ 2 entries (Nov 19, 2025)
- Vocab progress: ❌ 0
- Last active: Nov 19, 2025
- **Status**: FALSE POSITIVE - marked as never logged in but HAS activity

### Class Summary
- Total students: 28
- With game sessions: 23
- Without game sessions: 5 (23 of these have other activity)
- **False positives**: ~3-4 students

---

## CONCLUSION

The tracking system has **good intent but incomplete implementation**. It:
- ✅ Records session data properly
- ❌ But only checks ONE type of activity for "never logged in" status
- ❌ Filters out some valid data (memory games)
- ❌ Doesn't reconcile different activity types

**Your suspicion is correct**: You CANNOT trust the "students never logged in" count until this is fixed.

**Recommendation**: Use "current_term" filter (which catches more data) and manually verify any at-risk students by checking their assignment/vocab progress before taking action.

---

## NEXT STEPS

1. Run the verification queries above
2. Apply Fix #1 (expand "last active" calculation) - this is CRITICAL
3. Test with the provided data to confirm it resolves the false positives
4. Review game tracking implementations for all 15 games
5. Consider removing the memory-game filter or making it a separate metric
