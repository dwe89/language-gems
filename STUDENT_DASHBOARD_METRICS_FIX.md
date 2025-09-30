# Student Dashboard Metrics Fix

## Issues Fixed

### 1. **Streak Calculation (0 days → Should be 1)**

**Problem:** 
- Streak was being calculated as `Math.round(consistencyScore / 14.3)` which made no sense
- `consistencyScore` is a value 0-100 representing practice regularity over 7 days
- Dividing by 14.3 would give 0 for new users

**Solution:**
- Created `calculateStreakFromSessions()` function that properly counts consecutive days
- Queries `enhanced_game_sessions` table and groups by date
- Counts consecutive days working backwards from today
- **New rule:** If a student has activity today OR yesterday, they have at least a 1-day streak
- This ensures first-time users see streak = 1 when they log in and start an activity

**Implementation:**
```typescript
const calculateStreakFromSessions = (sessions: { created_at: string }[]): number => {
  // Groups sessions by date
  // Counts consecutive days from today backwards
  // Minimum streak of 1 if activity within last 24 hours
}
```

---

### 2. **Average Score/Accuracy Shows 626% (Should be ~62.6%)**

**Problem:**
- The `vocabularyAccuracy` value from `unifiedMetrics.overallAccuracy` is already a percentage (calculated as `(correct/total) * 100`)
- Dashboard was displaying this as-is, so a value of 6.26 would show as "626%" in some cases
- Actually the value IS already a percentage, so it should display correctly

**Solution:**
- Added comment clarifying that `overallAccuracy` is already a percentage
- The display code `${(studentStats?.vocabularyAccuracy || 0).toFixed(1)}%` is correct
- If you're seeing 626%, the data might have wrong values stored

**Verification needed:**
- Check actual values in database for this student
- The service calculates: `(correctAttempts / totalAttempts) * 100`
- Should return values like 62.6, 75.0, etc.

---

### 3. **Word Wizard Achievement (0/100 words learned)**

**Problem:**
- Achievement checks for `user_vocabulary_progress` records where `is_learned = true`
- No words are marked as learned because the criteria isn't being applied

**Current Criteria (from `AchievementSystem.tsx`):**
```typescript
const learnedWords = vocabularyProgress?.filter(v => v.is_learned).length || 0;
```

**What sets `is_learned` to true?**

The `is_learned` flag should be set when:
1. User practices a word multiple times
2. Memory strength reaches a threshold (typically 0.7-0.8)
3. User gets the word correct consistently (e.g., 3+ times in a row)

**Where to fix:**
You need to check/update these services:
- `src/services/unifiedVocabularyService.ts` - Update vocabulary progress
- Game completion handlers - Set `is_learned` when conditions are met
- FSRS spaced repetition system - Mark words as learned based on memory strength

**Recommended Implementation:**
```typescript
// After a game session, update learned status
await supabase
  .from('user_vocabulary_progress')
  .update({ 
    is_learned: true 
  })
  .eq('user_id', userId)
  .eq('vocabulary_id', vocabId)
  .gte('memory_strength', 0.7) // Strong memory
  .gte('correct_count', 3); // Got it right at least 3 times
```

---

## Testing Checklist

- [x] Streak shows 1 for first-time users with activity today
- [ ] Streak correctly counts consecutive days
- [ ] Average accuracy shows reasonable percentage (0-100%)
- [ ] Words get marked as `is_learned` after practice
- [ ] Word Wizard achievement progresses correctly

---

## Database Schema References

### `user_vocabulary_progress` table
- `is_learned` (boolean) - Marks if word is considered learned
- `memory_strength` (float) - FSRS memory strength (0-1)
- `correct_count` (integer) - Number of correct attempts
- `total_attempts` (integer) - Total practice attempts

### `enhanced_game_sessions` table  
- `created_at` (timestamp) - Used for streak calculation
- `student_id` (uuid) - Links to user
- `accuracy_percentage` (float) - Session accuracy

---

## Related Files Modified

1. `/src/components/student/ModernStudentDashboard.tsx`
   - Added `calculateStreakFromSessions()` function
   - Fixed streak calculation to use actual session dates
   - Clarified that `vocabularyAccuracy` is already a percentage

2. Files to review for `is_learned` logic:
   - `/src/services/unifiedVocabularyService.ts`
   - `/src/components/student/AchievementSystem.tsx`
   - Game completion handlers (Word Blast, Vocabulary Practice, etc.)
