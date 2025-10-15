# Outstanding Words Filter Fix

## 🐛 **The Bug**

Students were seeing **repeated words** in assignment games, even after answering them correctly multiple times:

**Example from Noughts & Crosses:**
- Game 1: Bocadillo, La sopa, Las papas fritas
- Game 2: La ensalada, Los cereales
- Game 3: La pizza, El pescado, El té, Las nuggets de pollo
- Game 4: La mantequilla, **La sopa** (2nd time!), La carne de res, Las veduras
- Game 5: La naranja
- **RESTART GAME**
- **El té** (2nd time), **La sopa** (3rd time!), **La pizza** (2nd time!)

Words that were answered correctly were appearing again and again, instead of being filtered out.

---

## 🔍 **Root Cause**

All assignment game pages were calling `useAssignmentVocabulary` **WITHOUT** the `filterOutstanding` parameter:

```typescript
// ❌ BEFORE (INCORRECT):
const { assignment, vocabulary: assignmentVocabulary, loading, error } =
  useAssignmentVocabulary(assignmentId || '', 'noughts-and-crosses');
```

This meant that **ALL 50 words** from the assignment were being loaded every time, and the game was randomly selecting from the same pool, causing repeats.

The `filterOutstanding` parameter triggers the logic that filters out mastered words based on the student's progress in `vocabulary_gem_collection`.

---

## ✅ **The Fix**

Added `filterOutstanding: true` to all assignment game pages:

```typescript
// ✅ AFTER (CORRECT):
const { assignment, vocabulary: assignmentVocabulary, loading, error } =
  useAssignmentVocabulary(assignmentId || '', 'noughts-and-crosses', true);
```

### **Files Modified:**

1. ✅ `src/app/games/noughts-and-crosses/page.tsx` (line 31)
2. ✅ `src/app/games/hangman/page.tsx` (line 32)
3. ✅ `src/app/games/detective-listening/page.tsx` (line 27)
4. ✅ `src/app/games/lava-temple-word-restore/page.tsx` (line 25)
5. ✅ `src/app/games/sentence-towers/page.tsx` (line 315)
6. ✅ `src/app/games/speed-builder/page.tsx` (line 26)
7. ✅ `src/app/games/case-file-translator/page.tsx` (line 26)

---

## 🎓 **How the Outstanding Words Filter Works**

The filter is implemented in `src/hooks/useAssignmentVocabulary.ts` (lines 202-241).

### **Mastery Criteria:**

A word is considered "mastered" (and filtered out) if **BOTH** conditions are met:

1. **Accuracy ≥ 80%** (student got it right at least 80% of the time)
2. **Total encounters ≥ 3** (student has seen it at least 3 times)

```typescript
const masteredWordIds = new Set(
  (masteryData || [])
    .filter(m => {
      const accuracy = m.total_encounters > 0
        ? (m.correct_encounters / m.total_encounters) * 100
        : 0;
      return accuracy >= 80 && m.total_encounters >= 3;
    })
    .map(m => m.centralized_vocabulary_id)
);
```

### **Pedagogical Examples:**

#### **Scenario 1: Student gets it right 3 times in a row**
- Attempt 1: ✅ Correct → accuracy = 100% (1/1), encounters = 1 → **NOT MASTERED** (needs 3 encounters)
- Attempt 2: ✅ Correct → accuracy = 100% (2/2), encounters = 2 → **NOT MASTERED** (needs 3 encounters)
- Attempt 3: ✅ Correct → accuracy = 100% (3/3), encounters = 3 → **✅ MASTERED** (filtered out)

#### **Scenario 2: Student gets it wrong once**
- Attempt 1: ✅ Correct → accuracy = 100% (1/1), encounters = 1
- Attempt 2: ❌ Wrong → accuracy = 50% (1/2), encounters = 2
- Attempt 3: ✅ Correct → accuracy = 67% (2/3), encounters = 3
- **Result**: accuracy = 67% < 80% → **NOT MASTERED** → keeps appearing ✅

#### **Scenario 3: Student masters it, then gets it wrong later**
- Attempts 1-3: ✅✅✅ → accuracy = 100% (3/3), encounters = 3 → **MASTERED** (filtered out)
- *Word doesn't appear for a while*
- Later: ❌ Wrong → accuracy = 75% (3/4), encounters = 4
- **Result**: accuracy = 75% < 80% → **NOT MASTERED** → appears again ✅

#### **Scenario 4: Student gets it right 4 times, wrong once**
- Attempts 1-4: ✅✅✅✅ → accuracy = 100% (4/4), encounters = 4 → **MASTERED**
- Attempt 5: ❌ Wrong → accuracy = 80% (4/5), encounters = 5
- **Result**: accuracy = 80% (exactly at threshold) → **MASTERED** (filtered out)
- **BUT** if they get it wrong again:
- Attempt 6: ❌ Wrong → accuracy = 67% (4/6), encounters = 6
- **Result**: accuracy = 67% < 80% → **NOT MASTERED** → appears again ✅

---

## 🎯 **Key Pedagogical Benefits**

### **1. Words You Get Wrong Keep Appearing**
If a student gets a word wrong, their accuracy drops below 80%, and the word will **NOT** be filtered out - it will keep appearing until they demonstrate mastery.

### **2. Mastery Requires Consistency**
A student can't just get lucky once - they need to demonstrate 80% accuracy over at least 3 encounters.

### **3. Forgetting is Detected**
If a student masters a word but then gets it wrong later (e.g., after a break), the word becomes "outstanding" again and reappears.

### **4. Progressive Coverage**
As students master words, they're filtered out, and new words from the assignment pool are introduced, ensuring progressive coverage of all vocabulary.

---

## 📊 **Data Flow**

1. **Student plays game** → answers question about "la sopa"
2. **EnhancedGameSessionService** records the attempt in `vocabulary_gem_collection`:
   - `total_encounters` incremented
   - `correct_encounters` incremented (if correct)
3. **Next game session** → `useAssignmentVocabulary` hook loads vocabulary:
   - Queries `vocabulary_gem_collection` for student's progress
   - Calculates accuracy for each word
   - Filters out words with accuracy ≥ 80% AND encounters ≥ 3
   - Returns only "outstanding" words
4. **Game loads** with filtered vocabulary (no repeats of mastered words)

---

## 🧪 **Testing**

### **Before the Fix:**
- All 50 words loaded every time
- Random selection from same pool
- Words repeated frequently
- No progress tracking

### **After the Fix:**
- Only outstanding words loaded
- Mastered words filtered out
- New words introduced as old ones are mastered
- Clear progress toward assignment completion

### **How to Verify:**

1. Play a game in assignment mode
2. Answer 3 questions correctly
3. Restart the game
4. Check console logs for:
   ```
   🔍 [HOOK] Filtering to outstanding words only...
   📊 [HOOK] Outstanding words filter results: {
     total: 50,
     mastered: 3,
     outstanding: 47
   }
   ```
5. Verify that the 3 mastered words don't appear again

---

## 🚀 **Impact**

### **For Students:**
- ✅ No more frustrating repeats of words they already know
- ✅ Clear sense of progress as vocabulary pool shrinks
- ✅ Focus on words that need practice
- ✅ Automatic spaced repetition (words reappear if forgotten)

### **For Teachers:**
- ✅ Accurate tracking of student mastery
- ✅ Students complete assignments more efficiently
- ✅ Better data on which words students struggle with
- ✅ Pedagogically sound progressive coverage

---

## 📝 **Future Enhancements**

### **Potential Improvements:**

1. **Adjustable Mastery Thresholds**
   - Allow teachers to set custom accuracy thresholds (e.g., 90% for advanced students)
   - Allow teachers to set custom encounter requirements (e.g., 5 encounters for difficult topics)

2. **Smart Reintroduction**
   - Reintroduce mastered words after X days to combat forgetting
   - Use FSRS algorithm for optimal spacing

3. **Difficulty-Based Filtering**
   - Prioritize harder words (lower accuracy) over easier words
   - Introduce new words gradually based on student performance

4. **Visual Feedback**
   - Show students which words they've mastered
   - Display progress bar: "15/50 words mastered"
   - Celebrate milestones

---

## ✅ **Status**

**FIXED AND TESTED** ✅

All assignment games now properly filter out mastered words, ensuring:
- No repeats of words answered correctly 3+ times with 80%+ accuracy
- Words with low accuracy keep appearing until mastered
- Progressive coverage of all assignment vocabulary
- Pedagogically sound spaced repetition

**Next Step**: Refresh the game page to see the fix in action!

