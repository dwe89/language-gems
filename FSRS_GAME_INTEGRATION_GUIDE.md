# FSRS Game Integration Guide for LanguageGems

## 🎯 **Overview**

This guide provides developers with specific instructions for integrating the FSRS (Free Spaced Repetition Scheduler) system into LanguageGems games. The integration is designed to be invisible to students while providing powerful memory optimization.

## 🏗️ **Integration Pattern**

### **Step 1: Import the Unified Hook**

```typescript
import { useUnifiedSpacedRepetition } from '../../../../hooks/useUnifiedSpacedRepetition';
```

### **Step 2: Initialize in Component**

```typescript
export const YourGameComponent: React.FC<GameProps> = ({ ... }) => {
  // Initialize FSRS spaced repetition system
  const { recordWordPractice, algorithm } = useUnifiedSpacedRepetition('your-game-name');

  // ... rest of your component
};
```

### **Step 3: Record Word Practice**

```typescript
const handleWordInteraction = async (
  word: VocabularyWord,
  correct: boolean,
  responseTime: number,
  confidence?: number
) => {
  // Only record for real users (not demo or assignment mode)
  if (!isDemo && !isAssignmentMode) {
    try {
      const wordData = {
        id: word.id || `${word.word}-${word.translation}`,
        word: word.word,
        translation: word.translation,
        language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
      };

      // Record practice with FSRS
      const fsrsResult = await recordWordPractice(
        wordData,
        correct,
        responseTime * 1000, // Convert to milliseconds
        confidence || (correct ? 0.7 : 0.3) // Default confidence
      );

      if (fsrsResult) {
        console.log(`FSRS recorded for ${word.word}:`, {
          algorithm: fsrsResult.algorithm,
          points: fsrsResult.points,
          nextReview: fsrsResult.nextReviewDate,
          interval: fsrsResult.interval,
          masteryLevel: fsrsResult.masteryLevel
        });
      }
    } catch (error) {
      console.error('Error recording FSRS practice:', error);
    }
  }
};
```

## 🎮 **Game-Specific Integration Examples**

### **Memory Game Pattern**

```typescript
// For successful matches
const handleSuccessfulMatch = async (firstCard, secondCard, responseTime) => {
  // Record FSRS practice for both words in the matched pair
  const wordData = {
    id: firstCard.vocabularyId || `${firstCard.word}-${firstCard.translation}`,
    word: firstCard.word,
    translation: firstCard.translation,
    language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
  };

  await recordWordPractice(
    wordData,
    true, // Always correct for matched pairs
    responseTime * 1000,
    0.7 // Moderate confidence for memory games (luck-based)
  );
};

// For failed matches
const handleFailedMatch = async (firstCard, secondCard, responseTime) => {
  const wordData = {
    id: firstCard.vocabularyId || `${firstCard.word}-${firstCard.translation}`,
    word: firstCard.word,
    translation: firstCard.translation,
    language: language === 'spanish' ? 'es' : language === 'french' ? 'fr' : 'en'
  };

  await recordWordPractice(
    wordData,
    false, // Incorrect match
    responseTime * 1000,
    0.3 // Lower confidence for failed matches
  );
};
```

### **Word Completion Game Pattern**

```typescript
// For correct answers
const handleCorrectAnswer = async (word, solveTime, isPerfect) => {
  // Calculate confidence based on solve time and accuracy
  const maxTime = 30; // Maximum expected time
  const timeConfidence = Math.max(0.1, 1 - (solveTime / maxTime));
  const difficultyConfidence = isPerfect ? 0.9 : 0.7;
  const confidence = (timeConfidence + difficultyConfidence) / 2;

  await recordWordPractice(
    wordData,
    true,
    solveTime * 1000,
    confidence
  );
};

// For incorrect answers
const handleIncorrectAnswer = async (word, attemptTime) => {
  await recordWordPractice(
    wordData,
    false,
    attemptTime * 1000,
    0.2 // Low confidence for incorrect answers
  );
};
```

### **Listening/Speaking Game Pattern**

```typescript
// For audio-based games
const handleAudioResponse = async (word, correct, responseTime, userConfidence) => {
  // Use user confidence if available, otherwise estimate
  const confidence = userConfidence || (correct ? 0.6 : 0.2);

  await recordWordPractice(
    wordData,
    correct,
    responseTime * 1000,
    confidence
  );
};
```

## 📊 **Confidence Scoring Guidelines**

### **Confidence Levels by Game Type**

| Game Type | Correct Answer | Incorrect Answer | Notes |
|-----------|---------------|------------------|-------|
| **Memory Games** | 0.7 | 0.3 | Luck-based, moderate confidence |
| **Word Scramble** | 0.8 | 0.2 | Skill-based, higher confidence |
| **Listening Games** | 0.6 | 0.2 | Audio quality affects confidence |
| **Speed Games** | 0.9 | 0.1 | Time pressure, clear success/failure |
| **Multiple Choice** | 0.5 | 0.2 | Guessing possible, lower confidence |

### **Dynamic Confidence Calculation**

```typescript
const calculateConfidence = (
  correct: boolean,
  responseTime: number,
  gameType: string,
  maxExpectedTime: number = 10000
): number => {
  if (!correct) {
    return gameType === 'multiple-choice' ? 0.2 : 0.3;
  }

  // Base confidence by game type
  const baseConfidence = {
    'memory-game': 0.7,
    'word-scramble': 0.8,
    'listening-game': 0.6,
    'speed-game': 0.9,
    'multiple-choice': 0.5
  }[gameType] || 0.7;

  // Adjust based on response time
  const timeBonus = Math.max(0, 1 - (responseTime / maxExpectedTime)) * 0.2;

  return Math.min(0.95, baseConfidence + timeBonus);
};
```

## 🔧 **Testing Recommendations**

### **Unit Tests**

```typescript
// Test FSRS integration
describe('FSRS Integration', () => {
  it('should record correct answers with appropriate confidence', async () => {
    const { recordWordPractice } = useUnifiedSpacedRepetition('test-game');

    const result = await recordWordPractice(
      { id: 'test-word', word: 'hola', translation: 'hello' },
      true,
      2000,
      0.8
    );

    expect(result.success).toBe(true);
    expect(result.algorithm).toBe('fsrs');
    expect(result.confidence).toBeGreaterThan(0.5);
  });

  it('should handle incorrect answers appropriately', async () => {
    const { recordWordPractice } = useUnifiedSpacedRepetition('test-game');

    const result = await recordWordPractice(
      { id: 'test-word', word: 'hola', translation: 'hello' },
      false,
      5000,
      0.2
    );

    expect(result.success).toBe(true);
    expect(result.confidence).toBeLessThan(0.5);
  });
});
```

### **Integration Tests**

```typescript
// Test game-specific integration
describe('Memory Game FSRS Integration', () => {
  it('should record matches correctly', async () => {
    const game = render(<MemoryGame />);

    // Simulate successful match
    await game.simulateMatch('hola', 'hello', 3000);

    // Verify FSRS recording
    expect(mockRecordWordPractice).toHaveBeenCalledWith(
      expect.objectContaining({ word: 'hola' }),
      true,
      3000,
      0.7
    );
  });
});
```

## 🚀 **Deployment Checklist**

### **Before Integration**
- [ ] Verify `useUnifiedSpacedRepetition` hook is available
- [ ] Confirm FSRS database fields are migrated
- [ ] Test with demo mode disabled
- [ ] Validate word data structure

### **During Integration**
- [ ] Add FSRS import and initialization
- [ ] Implement word practice recording for correct answers
- [ ] Implement word practice recording for incorrect answers
- [ ] Add appropriate confidence scoring
- [ ] Test with real vocabulary data

### **After Integration**
- [ ] Verify FSRS data is being recorded in database
- [ ] Check console logs for FSRS feedback
- [ ] Test algorithm selection (FSRS vs SM-2)
- [ ] Validate memory state updates
- [ ] Monitor performance impact

## 📈 **Performance Considerations**

### **Async Handling**

```typescript
// Don't block game flow for FSRS recording
const handleWordPractice = async (word, correct, responseTime) => {
  // Continue game immediately
  updateGameState();
  showFeedback();

  // Record FSRS in background
  recordWordPractice(word, correct, responseTime).catch(error => {
    console.error('FSRS recording failed:', error);
    // Don't interrupt game flow
  });
};
```

### **Error Handling**

```typescript
// Graceful degradation
const safeRecordWordPractice = async (word, correct, responseTime) => {
  try {
    return await recordWordPractice(word, correct, responseTime);
  } catch (error) {
    console.error('FSRS recording failed:', error);
    // Game continues normally even if FSRS fails
    return null;
  }
};
```

## 🎯 **Priority Integration Order**

### **High Priority (Complete First)**
1. **Vocab Blast** - Already partially integrated, high impact
2. **Detective Listening** - Assessment-style game
3. **Vocab Master** - Featured prominently on games page

### **Medium Priority**
4. **Pirate Ship Games** (3 games) - Popular game series
5. **Word Towers** - Typing mode with double points
6. **Lava Temple: Word Restore** - Fill-in-the-blank mechanics

### **Lower Priority**
7. **Remaining 11 games** - Systematic rollout using established pattern

## 📝 **Documentation Requirements**

For each integrated game, document:
- [ ] FSRS integration points (where `recordWordPractice` is called)
- [ ] Confidence scoring logic
- [ ] Game-specific considerations
- [ ] Testing approach
- [ ] Performance impact

## 🔍 **Monitoring and Analytics**

### **FSRS Integration Metrics**
- Number of words recorded per game session
- Algorithm selection ratio (FSRS vs SM-2)
- Average confidence scores by game type
- Memory state progression over time
- Error rates in FSRS recording

### **Success Indicators**
- ✅ FSRS data appears in vocabulary_gem_collection table
- ✅ Memory states (difficulty, stability, retrievability) update correctly
- ✅ Students show improved retention rates
- ✅ Teachers receive meaningful FSRS insights
- ✅ No performance degradation in game experience

---

**Remember**: FSRS integration should be completely invisible to students. They continue playing games normally while the system optimizes their learning in the background.