# Gems-First Integration Guide for Language Gems Games

## 🎯 Overview

This guide documents the standard pattern for integrating games with the unified gems-first vocabulary tracking system, based on VocabMaster's reference implementation.

## 🔑 Core Principles

### 1. **Single Source of Truth**
- All XP comes from gems (10 XP per gem)
- No separate XP calculation systems
- Vocabulary tracking through `vocabulary_gem_collection` table

### 2. **Individual Vocabulary Interactions**
- Record EVERY vocabulary interaction during gameplay
- Use `recordWordAttempt()` for each word/translation pair
- Track real performance data (response time, accuracy, hints)

### 3. **Anti-Grinding Protection**
- Mastery level caps maximum gem rarity
- `maxGemRarity` field prevents farming easy words for legendary gems
- RewardEngine enforces rarity limits based on word mastery

## 📋 Implementation Checklist

### ✅ **Required Components**

1. **EnhancedGameSessionService Integration**
   - Use `recordWordAttempt()` for vocabulary interactions
   - Log to `word_performance_logs` table
   - Update `vocabulary_gem_collection` for spaced repetition

2. **RewardEngine Integration**
   - Use `RewardEngine.calculateGemRarity()` for consistent gem calculation
   - Apply performance context (speed, streak, hints, mode)
   - Respect mastery-level caps

3. **Vocabulary Sourcing**
   - Use `centralized_vocabulary` table
   - Support assignment-provided vocabulary
   - Handle multiple languages (es, fr, de)

4. **Score Reporting**
   - Report gem-based scores (correctWords × 10 XP)
   - No custom scoring formulas
   - Consistent assignment progress updates

## 🔧 Implementation Pattern

### **Step 1: Session Management**

```typescript
// Initialize game session
const sessionService = new EnhancedGameSessionService();
const sessionId = await sessionService.startGameSession({
  student_id: userId,
  assignment_id: assignmentId || undefined,
  game_type: 'your-game-name',
  session_mode: assignmentId ? 'assignment' : 'free_play',
  max_score_possible: vocabularyCount * 10, // 10 XP per word
  session_data: {
    // Game-specific settings
  }
});
```

### **Step 2: Vocabulary Interaction Recording**

```typescript
// For each vocabulary interaction during gameplay
const handleVocabularyInteraction = async (
  word: string,
  translation: string,
  userAnswer: string,
  isCorrect: boolean,
  responseTime: number,
  hintUsed: boolean = false
) => {
  // Record the attempt
  const gemEvent = await sessionService.recordWordAttempt(sessionId, 'your-game-name', {
    vocabularyId: vocabularyItem.id, // UUID from centralized_vocabulary
    wordText: word,
    translationText: translation,
    responseTimeMs: responseTime,
    wasCorrect: isCorrect,
    hintUsed,
    streakCount: currentStreak,
    masteryLevel: vocabularyItem.masteryLevel || 1,
    maxGemRarity: vocabularyItem.maxGemRarity || 'rare',
    gameMode: currentGameMode
  });

  // Update UI with gem feedback
  if (gemEvent && isCorrect) {
    showGemCollection(gemEvent.rarity, gemEvent.xpValue);
  }
};
```

### **Step 3: Score Calculation**

```typescript
// Calculate final score (gems-first approach)
const calculateFinalScore = (correctAnswers: number, totalWords: number) => {
  const score = correctAnswers * 10; // 10 XP per correct word
  const accuracy = totalWords > 0 ? (correctAnswers / totalWords) * 100 : 0;
  const maxScore = totalWords * 10;
  
  return { score, accuracy, maxScore };
};
```

### **Step 4: Assignment Integration**

```typescript
// Report to assignment wrapper
if (assignmentMode) {
  const { score, accuracy, maxScore } = calculateFinalScore(correctAnswers, totalWords);
  
  assignmentMode.onGameComplete({
    assignmentId: assignmentMode.assignment.id,
    gameId: 'your-game-name',
    studentId: '', // Will be set by wrapper
    wordsCompleted: correctAnswers,
    totalWords,
    score,
    maxScore,
    accuracy,
    timeSpent: 0, // Will be calculated by wrapper
    completedAt: new Date(),
    sessionData: {
      // Game-specific completion data
    }
  });
}
```

## 🚫 What NOT to Do

### ❌ **Avoid These Anti-Patterns**

1. **Custom XP Calculations**
   ```typescript
   // DON'T DO THIS
   const baseXP = correctAnswers * 12;
   const accuracyBonus = Math.round(accuracy * 0.3);
   const speedBonus = responseTime < 5000 ? 20 : 0;
   const totalXP = baseXP + accuracyBonus + speedBonus;
   ```

2. **Separate Scoring Systems**
   ```typescript
   // DON'T DO THIS
   const { score, accuracy, maxScore } = calculateStandardScore(
     correctAnswers,
     totalWords,
     timeSpent,
     120 // Custom base points per word
   );
   ```

3. **Fake Gem Events**
   ```typescript
   // DON'T DO THIS
   await supabase.from('gem_events').insert({
     word_text: "Assignment Game Completion", // Not a real word!
     response_time_ms: 2000, // Fake response time
     streak_count: 1 // Fake streak
   });
   ```

4. **Hardcoded Vocabulary**
   ```typescript
   // DON'T DO THIS
   const vocabulary = [
     { spanish: "gato", english: "cat" },
     { spanish: "perro", english: "dog" }
   ];
   ```

## 🎮 Game-Specific Considerations

### **Multiple Choice Games**
- Record attempt when answer is selected
- Track response time from question display to selection
- Consider partial credit for close answers

### **Typing Games**
- Record attempt when user submits answer
- Track keystroke accuracy and typing speed
- Handle typos vs conceptual errors differently

### **Listening Games**
- Record attempt when audio comprehension is tested
- Track replay count as hint usage
- Consider audio quality in difficulty assessment

### **Timed Games**
- Record attempt when time expires or answer given
- Use actual response time, not game timer
- Handle timeout scenarios appropriately

## 📊 Expected Results

After proper integration:

✅ **Correct XP Display**: 10 words = 100 XP (not 1080+ points)
✅ **Vocabulary Tracking**: Individual words recorded in `vocabulary_gem_collection`
✅ **Spaced Repetition**: FSRS algorithm updates word scheduling
✅ **Anti-Grinding**: Mastery level caps prevent XP farming
✅ **Assignment Accuracy**: Cumulative scores are mathematically correct
✅ **Analytics Consistency**: Dashboard shows unified progress data

## 🔍 Testing Checklist

- [ ] Game shows correct XP (10 per correct word)
- [ ] `vocabulary_gem_collection` table updates with real words
- [ ] `word_performance_logs` records individual attempts
- [ ] `gem_events` contains actual vocabulary interactions
- [ ] Assignment cumulative scores are accurate
- [ ] Anti-grinding protection prevents legendary gems on easy words
- [ ] Console shows no conflicting XP calculations
- [ ] Dashboard analytics reflect game progress correctly

## 🚀 Migration Strategy

1. **Audit Current System** - Identify conflicting scoring logic
2. **Implement Recording** - Add `recordWordAttempt()` calls
3. **Remove Conflicts** - Delete custom XP calculations
4. **Test Integration** - Verify gems-first scoring works
5. **Update Analytics** - Ensure dashboards show correct data

This pattern ensures all games contribute consistently to the unified vocabulary learning experience!
