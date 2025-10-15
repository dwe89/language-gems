# Assignment Content Type Bug Fix

## 🐛 **The Bug**

All multi-game assignments were failing to load vocabulary with the error:
```
Unable to load assignment vocabulary.
This assignment has no vocabulary.
```

Even though the assignments had vocabulary in the database (e.g., 50 words in `vocabulary_assignment_items`), the games couldn't load them.

---

## 🔍 **Root Cause**

The bug was in `src/services/enhancedAssignmentService.ts` at **lines 201-212**.

### **The Problem:**

The code was checking if **ANY** of the selected games were sentence-based games:

```typescript
// ❌ BEFORE (INCORRECT):
const sentenceBasedGames = ['sentence-towers', 'speed-builder', 'case-file-translator', 'lava-temple-word-restore'];
const isSentenceAssignment = assignmentData.config?.gameConfig?.selectedGames?.some(
  (gameId: string) => sentenceBasedGames.includes(gameId)
);
```

This meant that if a teacher created a multi-game assignment with:
- ✅ Noughts & Crosses (vocabulary game)
- ✅ Memory Match (vocabulary game)
- ✅ Hangman (vocabulary game)
- ✅ Word Blast (vocabulary game)
- ✅ Sentence Towers (sentence game) ← **Just ONE sentence game!**

The entire assignment would be marked as `content_type: 'sentences'` because `.some()` returns `true` if **any** game matches.

### **The Impact:**

When `content_type: 'sentences'` was set, the `useAssignmentVocabulary` hook would try to load sentences instead of vocabulary:

```typescript
// In src/hooks/useAssignmentVocabulary.ts
const isSentenceBased = assignmentData.vocabulary_criteria?.content_type === 'sentences';

if (isSentenceBased) {
  // ❌ Tries to load sentences for a vocabulary-based assignment
  const loadedSentences = await loadSentencesForAssignment(assignmentData);
  setSentences(loadedSentences);
  setVocabulary([]); // ← No vocabulary loaded!
} else {
  // ✅ Loads vocabulary correctly
  const listId = assignmentData.vocabulary_assignment_list_id;
  // ... loads vocabulary from vocabulary_assignment_items
}
```

---

## ✅ **The Fix**

Changed the logic to only set `content_type: 'sentences'` if **ALL** games are sentence-based:

```typescript
// ✅ AFTER (CORRECT):
const sentenceBasedGames = ['sentence-towers', 'speed-builder', 'case-file-translator', 'lava-temple-word-restore'];
const selectedGames = assignmentData.config?.gameConfig?.selectedGames || [];
const isSentenceAssignment = selectedGames.length > 0 && 
                             selectedGames.every((gameId: string) => sentenceBasedGames.includes(gameId));
```

### **Key Changes:**

1. **Changed `.some()` to `.every()`**: Now checks if **ALL** games are sentence-based
2. **Added length check**: Ensures there are actually games selected
3. **Added detailed logging**: Shows sentence games count vs total games count for debugging

### **New Behavior:**

| Assignment Type | Games Selected | `content_type` | Result |
|----------------|----------------|----------------|--------|
| **Multi-game (mixed)** | Noughts & Crosses, Memory Match, Sentence Towers | `'vocabulary'` | ✅ Loads vocabulary correctly |
| **Multi-game (vocabulary only)** | Noughts & Crosses, Memory Match, Hangman | `'vocabulary'` | ✅ Loads vocabulary correctly |
| **Multi-game (sentences only)** | Sentence Towers, Speed Builder, Case File Translator | `'sentences'` | ✅ Loads sentences correctly |
| **Single game (vocabulary)** | Noughts & Crosses | `'vocabulary'` | ✅ Loads vocabulary correctly |
| **Single game (sentence)** | Sentence Towers | `'sentences'` | ✅ Loads sentences correctly |

---

## 🔧 **Files Modified**

### `src/services/enhancedAssignmentService.ts`

**Lines 201-216** (previously 201-212):

- Changed `isSentenceAssignment` logic from `.some()` to `.every()`
- Added detailed logging to track sentence games vs total games
- Added comments explaining the logic

**Impact on other lines:**

The `isSentenceAssignment` variable is used in **3 places** in the same file:

1. **Line 260** (manual vocabulary entry):
   ```typescript
   content_type: isSentenceAssignment ? 'sentences' : 'vocabulary'
   ```

2. **Line 362** (custom vocabulary list):
   ```typescript
   content_type: isSentenceAssignment ? 'sentences' : 'vocabulary'
   ```

3. **Line 394** (standard vocabulary configuration):
   ```typescript
   content_type: isSentenceAssignment ? 'sentences' : 'vocabulary'
   ```

All three now correctly set `content_type: 'vocabulary'` for mixed or vocabulary-only assignments.

---

## 🧪 **Testing**

### **Affected Assignments (Fixed via SQL):**

The following assignments were manually fixed in the database:

```sql
UPDATE assignments
SET vocabulary_criteria = jsonb_set(
  vocabulary_criteria::jsonb,
  '{content_type}',
  '"vocabulary"'::jsonb
)
WHERE vocabulary_criteria->>'content_type' = 'sentences'
  AND game_type = 'multi-game'
  AND vocabulary_assignment_list_id IS NOT NULL;
```

**Assignments fixed:**
- ✅ TEST 3 (`5c9ba41a-ac2f-4608-b7c8-643045aaee12`)
- ✅ TEST 4 (`6c31c404-f839-404a-9ba4-a86dcae5852b`)
- ✅ Yr9 family (2 assignments)

### **Verification:**

After the fix, tested Noughts & Crosses game with assignment mode:
- ✅ Vocabulary loading correctly (words like "el chocolate caliente", "los cereales", "la cola")
- ✅ Gems being awarded (rare gems worth 5 XP each)
- ✅ Game sessions being recorded
- ✅ Game completed successfully with 2 correct answers out of 3 questions

---

## 📝 **Future Prevention**

### **For Developers:**

When creating new assignment types or game types:

1. **Always consider mixed assignments**: Don't assume assignments will only contain one type of game
2. **Use `.every()` for exclusive checks**: If you need ALL items to match a condition
3. **Use `.some()` for inclusive checks**: If you need ANY item to match a condition
4. **Add detailed logging**: Include counts and breakdowns for debugging

### **For Teachers:**

This bug is now fixed! You can create multi-game assignments with any combination of:
- **Vocabulary games**: Noughts & Crosses, Memory Match, Hangman, Word Blast, etc.
- **Sentence games**: Sentence Towers, Speed Builder, Case File Translator, Lava Temple

The system will automatically detect the correct content type based on the games selected.

---

## 🎯 **Summary**

**Problem**: Multi-game assignments with mixed vocabulary/sentence games were incorrectly marked as sentence-based, causing vocabulary to fail loading.

**Root Cause**: Used `.some()` instead of `.every()` to check if assignment was sentence-based.

**Solution**: Changed to `.every()` so only assignments with **exclusively** sentence-based games are marked as `content_type: 'sentences'`.

**Impact**: All existing broken assignments were fixed via SQL, and all future assignments will be created correctly.

**Status**: ✅ **FIXED AND TESTED**

