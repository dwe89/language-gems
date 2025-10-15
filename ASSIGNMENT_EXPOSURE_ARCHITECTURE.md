# Assignment Exposure Architecture

## 🎯 **The Problem**

**Current System:**
- 50 words × 3 encounters = 150 attempts needed
- Noughts & Crosses = ~3 questions per game
- 150 ÷ 3 = **50 games** = **100 minutes** ❌

**Required System:**
- 50 words × 1 exposure = 50 attempts needed
- Noughts & Crosses = ~3 questions per game
- 50 ÷ 3 = **17 games** = **25-30 minutes** ✅

---

## 🏗️ **The Three-Layer Architecture**

### **Layer 1: Session Deduplication (In-Memory)**

**Purpose**: UX - prevent immediate word repetition within a single game instance

**Scope**: Current game session only (e.g., one round of Noughts & Crosses)

**Storage**: Local React state

**Reset Trigger**: When student exits/restarts the game

**Implementation**:
```typescript
// In game component (e.g., TicTacToeGameThemed.tsx)
const [usedWordsThisSession, setUsedWordsThisSession] = useState<Set<string>>(new Set());

// When selecting next word:
const availableWords = vocabulary.filter(word => !usedWordsThisSession.has(word.id));

// After showing a word:
setUsedWordsThisSession(prev => new Set([...prev, currentWord.id]));

// On game restart:
setUsedWordsThisSession(new Set()); // RESET
```

---

### **Layer 2: Assignment Progress (Database, Persistent)**

**Purpose**: Track completion toward 100% exposure goal

**Scope**: Entire assignment until 100% complete

**Storage**: New database table `assignment_word_exposure`

**Metric**: `(unique words exposed / total words) × 100`

**Database Schema**:
```sql
CREATE TABLE assignment_word_exposure (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  centralized_vocabulary_id UUID NOT NULL REFERENCES centralized_vocabulary(id),
  first_exposed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  exposure_count INTEGER NOT NULL DEFAULT 1,
  last_exposed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(assignment_id, student_id, centralized_vocabulary_id)
);

CREATE INDEX idx_assignment_exposure_student ON assignment_word_exposure(student_id, assignment_id);
CREATE INDEX idx_assignment_exposure_vocab ON assignment_word_exposure(centralized_vocabulary_id);
```

**Implementation**:
```typescript
// After each game session ends:
async function recordWordExposures(
  assignmentId: string,
  studentId: string,
  exposedWordIds: string[]
) {
  // Upsert each word exposure
  for (const wordId of exposedWordIds) {
    await supabase
      .from('assignment_word_exposure')
      .upsert({
        assignment_id: assignmentId,
        student_id: studentId,
        centralized_vocabulary_id: wordId,
        exposure_count: 1, // Will increment if already exists
        last_exposed_at: new Date().toISOString()
      }, {
        onConflict: 'assignment_id,student_id,centralized_vocabulary_id',
        ignoreDuplicates: false
      });
  }
}

// Calculate assignment progress:
async function getAssignmentProgress(assignmentId: string, studentId: string) {
  // Get total words in assignment
  const { data: assignment } = await supabase
    .from('assignments')
    .select('vocabulary_assignment_list_id')
    .eq('id', assignmentId)
    .single();

  const { count: totalWords } = await supabase
    .from('vocabulary_assignment_list_items')
    .select('*', { count: 'exact', head: true })
    .eq('list_id', assignment.vocabulary_assignment_list_id);

  // Get exposed words count
  const { count: exposedWords } = await supabase
    .from('assignment_word_exposure')
    .select('*', { count: 'exact', head: true })
    .eq('assignment_id', assignmentId)
    .eq('student_id', studentId);

  return {
    totalWords,
    exposedWords,
    progress: (exposedWords / totalWords) * 100,
    isComplete: exposedWords >= totalWords
  };
}
```

---

### **Layer 3: Mastery Tracking (Database, Perpetual)**

**Purpose**: Long-term learning quality across all assignments

**Scope**: Perpetual - never resets

**Storage**: Existing `vocabulary_gem_collection` table

**Metric**: 80%+ accuracy over 3+ encounters

**Implementation**: Already exists! No changes needed.

---

## 🎮 **Game Completion vs Assignment Completion**

### **Game Completion (Internal/Ephemeral)**

Each game has its own **internal** completion logic for UX purposes:

| Game | Internal Completion Trigger |
|------|---------------------------|
| Noughts & Crosses | 3 questions answered (one full board) |
| Detective Listening | 5 audio clips completed |
| Word Towers | 10 words built successfully |
| Hangman | 5 words guessed |
| Memory Match | All pairs found (6-8 pairs) |
| Speed Builder | 10 sentences translated |
| Case File Translator | 5 sentences completed |

**What Happens on Game Completion:**
1. Show completion screen with stats
2. Award activity gems
3. Show two buttons:
   - "Play Again" → Restart the game (draws new words from unexposed pool)
   - "Back to Assignment" → Return to assignment dashboard

**Effect on Assignment Progress**: NONE. Game completion is purely UX.

---

### **Assignment Completion (External/Persistent)**

**Single Source of Truth**: `(unique words exposed / total words) × 100`

**What Happens at 100% Assignment Completion:**

1. **Assignment Status**: Marked as COMPLETE in database
2. **Game Access**: DENIED for this assignment
3. **UI Behavior**: 
   - Assignment card shows "✅ COMPLETE" badge
   - Clicking any game shows "Assignment Complete!" screen instead
   - Progress bar shows 100%
   - Mastery score displayed separately

**Example Scenario**:
- Assignment: 50 words
- Student plays 10 rounds of Noughts & Crosses (30 words exposed)
- Student plays 5 rounds of Word Towers (20 new words exposed)
- **Total: 50 unique words exposed → 100% COMPLETE**
- Student never played the final 7 rounds of Noughts & Crosses needed to "complete" that game's internal metric
- **Result**: Assignment is COMPLETE. Student cannot play more games for this assignment.

---

## 🔄 **The Outstanding Words Filter (Updated)**

The `useAssignmentVocabulary` hook needs to be updated to use **Assignment Exposure** instead of **Mastery**:

```typescript
// BEFORE (INCORRECT - uses mastery):
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

// AFTER (CORRECT - uses exposure):
const exposedWordIds = new Set(
  (exposureData || []).map(e => e.centralized_vocabulary_id)
);

const outstandingWords = vocabularyItems.filter(v => !exposedWordIds.has(v.id));
```

**Key Change**: Filter out words that have been **exposed** (seen at least once), not words that have been **mastered** (80%+ accuracy over 3+ encounters).

---

## 📊 **Data Flow**

### **When Student Starts a Game:**

1. Load assignment vocabulary (all 50 words)
2. Query `assignment_word_exposure` for this student + assignment
3. Filter out exposed words → get **unexposed words pool**
4. If unexposed pool is empty → show "Assignment Complete!" screen
5. If unexposed pool has words → start game with those words

### **During Game Session:**

1. Game randomly selects from unexposed words pool
2. Game uses **session deduplication** (Layer 1) to prevent immediate repeats
3. Student answers questions
4. `EnhancedGameSessionService` records attempts in `vocabulary_gem_collection` (Layer 3)

### **When Game Session Ends:**

1. Collect all word IDs that were shown in this session
2. Call `recordWordExposures()` to upsert into `assignment_word_exposure` (Layer 2)
3. Calculate new assignment progress
4. If progress = 100% → mark assignment as COMPLETE
5. Show game completion screen with "Play Again" or "Back to Assignment"

### **When Student Clicks "Play Again":**

1. Reset session deduplication (Layer 1) → clear `usedWordsThisSession`
2. Re-query `assignment_word_exposure` to get updated unexposed pool
3. If unexposed pool is empty → show "Assignment Complete!" screen
4. If unexposed pool has words → start new game session

---

## 🎯 **Progress Metrics**

### **Assignment Dashboard Shows:**

1. **Progress Bar**: `(exposed words / total words) × 100`
   - Example: "35/50 words encountered (70%)"

2. **Mastery Score**: `(words with 80%+ accuracy / exposed words) × 100`
   - Example: "Mastery: 25/35 words (71%)"

3. **Status Badge**:
   - "🔵 In Progress" (< 100% exposure)
   - "✅ Complete" (100% exposure)

### **Teacher Dashboard Shows:**

1. **Completion Rate**: % of students who reached 100% exposure
2. **Average Mastery**: Average mastery score across all students
3. **Struggling Words**: Words with lowest accuracy across class
4. **Time Spent**: Total time students spent on assignment

---

## 🚀 **Implementation Checklist**

### **Phase 1: Database Setup**
- [ ] Create `assignment_word_exposure` table
- [ ] Add indexes for performance
- [ ] Create RLS policies for student access

### **Phase 2: Core Service**
- [ ] Create `AssignmentExposureService` class
- [ ] Implement `recordWordExposures()` method
- [ ] Implement `getAssignmentProgress()` method
- [ ] Implement `getUnexposedWords()` method

### **Phase 3: Update useAssignmentVocabulary Hook**
- [ ] Change filter from mastery-based to exposure-based
- [ ] Add assignment progress calculation
- [ ] Add completion check

### **Phase 4: Update Game Components**
- [ ] Add session deduplication to all games
- [ ] Call `recordWordExposures()` on game end
- [ ] Check assignment completion before starting game
- [ ] Show "Assignment Complete!" screen when needed

### **Phase 5: Update UI**
- [ ] Update assignment cards to show exposure progress
- [ ] Add mastery score as separate metric
- [ ] Update teacher dashboard analytics
- [ ] Add "Assignment Complete!" screen component

### **Phase 6: Testing**
- [ ] Test 50-word assignment completes in ~17 games
- [ ] Test session deduplication prevents immediate repeats
- [ ] Test exposure persists across game restarts
- [ ] Test assignment completion blocks further games
- [ ] Test mastery tracking continues independently

---

## 📝 **Example User Journey**

**Assignment**: 50 Spanish food vocabulary words

**Session 1: Noughts & Crosses**
- Words shown: "el arroz", "las frutas", "la pizza" (3 words)
- Exposure progress: 3/50 (6%)
- Mastery: 2/3 (67%) - student got "el arroz" wrong
- Game completes → "Play Again" or "Back to Assignment"

**Session 2: Noughts & Crosses (Play Again)**
- Unexposed pool: 47 words (50 - 3 already exposed)
- Words shown: "la sopa", "el té", "la carne" (3 new words)
- Exposure progress: 6/50 (12%)
- Mastery: 5/6 (83%)

**Session 3-16: Mix of games**
- Student plays Word Towers, Detective Listening, Hangman
- Each game draws from shrinking unexposed pool
- Exposure progress: 47/50 (94%)

**Session 17: Final game**
- Unexposed pool: 3 words remaining
- Words shown: "el cerdo", "las verduras", "el croissant"
- Exposure progress: 50/50 (100%) ✅
- **Assignment COMPLETE!**

**Session 18: Student tries to play again**
- System checks: exposure = 100%
- Shows "Assignment Complete!" screen
- Cannot start new game
- Mastery score: 42/50 (84%) - shown on completion screen

---

## 🎓 **Pedagogical Benefits**

### **For Students:**
- ✅ Realistic time commitment (25-30 minutes vs 100 minutes)
- ✅ Clear progress toward completion
- ✅ Variety - can switch between games
- ✅ No pointless busywork after seeing all words

### **For Teachers:**
- ✅ Predictable assignment duration
- ✅ Guaranteed vocabulary exposure
- ✅ Separate mastery tracking for remediation
- ✅ Accurate completion data for grading

### **For LanguageGems:**
- ✅ Scalable - adding new games doesn't increase workload
- ✅ Engaging - students can choose their preferred games
- ✅ Data-rich - tracks both exposure and mastery
- ✅ Competitive - matches Quizlet/Memrise UX expectations

