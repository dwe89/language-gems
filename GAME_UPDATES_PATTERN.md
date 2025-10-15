# Game Updates Pattern for Exposure-Based System

## 🎯 **Standard Pattern for All Games**

Every game needs these 5 changes:

### **1. Import the Service**
```typescript
import { assignmentExposureService } from '../../../../services/assignments/AssignmentExposureService';
```

### **2. Add `assignmentId` to Props Interface**
```typescript
interface GameProps {
  // ... existing props
  assignmentId?: string | null; // For exposure tracking
  userId?: string;
}
```

### **3. Add Layer 1 State (Session Deduplication)**
```typescript
// LAYER 1: Session Deduplication - Track word IDs used in THIS game session
const [usedWordsThisSession, setUsedWordsThisSession] = useState<Set<string>>(new Set());
```

### **4. Update Word Selection Logic**
```typescript
// Filter out words already used in this session
const availableWords = vocabulary.filter(word => {
  const wordId = (word as any).id || word.id;
  return wordId && !usedWordsThisSession.has(wordId);
});

// If all words used, reset the session filter
const wordsToUse = availableWords.length > 0 ? availableWords : vocabulary;

// Select random word
const selectedWord = wordsToUse[Math.floor(Math.random() * wordsToUse.length)];

// Mark as used
if (selectedWord.id) {
  setUsedWordsThisSession(prev => new Set([...prev, selectedWord.id]));
  console.log('🎯 [SESSION DEDUP] Word marked as used:', {
    word: selectedWord.word,
    id: selectedWord.id,
    totalUsedThisSession: usedWordsThisSession.size + 1
  });
}
```

### **5. Record Exposures on Game End**
```typescript
// When game ends (in cleanup, unmount, or explicit end function)
useEffect(() => {
  return () => {
    // LAYER 2: Record word exposures for assignment progress
    if (isAssignmentMode && assignmentId && userId) {
      const exposedWordIds = Array.from(usedWordsThisSession);
      if (exposedWordIds.length > 0) {
        console.log('📝 [LAYER 2] Recording word exposures:', {
          assignmentId,
          studentId: userId,
          wordCount: exposedWordIds.length
        });
        
        assignmentExposureService.recordWordExposures(
          assignmentId,
          userId,
          exposedWordIds
        ).then(result => {
          if (result.success) {
            console.log('✅ [LAYER 2] Exposures recorded successfully');
          } else {
            console.error('❌ [LAYER 2] Failed to record exposures:', result.error);
          }
        });
      }
    }
  };
}, [isAssignmentMode, assignmentId, userId, usedWordsThisSession]);
```

---

## 📋 **Games to Update**

### ✅ **COMPLETED:**
1. **Noughts & Crosses** - Full implementation with Layer 1 & 2

### 🔄 **IN PROGRESS:**
2. **Hangman** - Layer 1 added, need to add Layer 2 exposure recording

### ⏳ **PENDING:**
3. **Memory Match** (`src/app/games/memory-game/`)
4. **Word Blast** (`src/app/games/word-blast/`)
5. **Detective Listening** (`src/app/games/detective-listening/`)
6. **Speed Builder** (`src/app/games/speed-builder/`)
7. **Case File Translator** (`src/app/games/case-file-translator/`)
8. **Sentence Towers** (`src/app/games/sentence-towers/`)
9. **Lava Temple Word Restore** (`src/app/games/lava-temple-word-restore/`)

---

## 🎮 **Game-Specific Notes**

### **Hangman**
- Already has `usedWords` state (tracks word strings)
- Need to replace with `usedWordsThisSession` (tracks word IDs)
- `getRandomWordNoRepeats()` function updated to return `{ word, id }`
- Need to add Layer 2 exposure recording on component unmount

### **Memory Match**
- Card-based game - track pairs matched
- Record exposure when card pair is successfully matched
- Session deduplication prevents same pair appearing twice

### **Word Blast**
- Falling words game
- Record exposure when word is successfully clicked/matched
- High-frequency game - may expose many words quickly

### **Detective Listening**
- Audio-based game
- Record exposure when audio is played and answered
- May need special handling for audio playback

### **Sentence-based Games** (Speed Builder, Case File Translator, Sentence Towers, Lava Temple)
- These use sentences, not individual vocabulary
- May need different exposure tracking logic
- Check if they use `content_type: 'sentences'`

---

## 🚨 **Common Pitfalls to Avoid**

1. **Don't use word strings** - Always use word IDs for tracking
2. **Don't forget cleanup** - Record exposures on unmount/navigation
3. **Check for assignment mode** - Only record if `isAssignmentMode && assignmentId && userId`
4. **Handle custom words** - Create temporary IDs for custom vocabulary
5. **Reset on new game** - Session deduplication resets when starting new game
6. **Don't block UI** - Use `.then()` for async exposure recording, don't await

---

## ✅ **Testing Checklist for Each Game**

After updating each game:

- [ ] Import added
- [ ] Props interface updated
- [ ] Layer 1 state added
- [ ] Word selection filters by session
- [ ] Words marked as used when shown
- [ ] Layer 2 recording on cleanup
- [ ] Console logs show session dedup working
- [ ] Console logs show exposure recording
- [ ] Database records created
- [ ] Progress increases correctly
- [ ] No TypeScript errors
- [ ] No runtime errors

---

## 🎯 **Next Steps**

1. Finish Hangman (add Layer 2)
2. Update Memory Match
3. Update Word Blast
4. Update Detective Listening
5. Update sentence-based games
6. Test all games
7. Update wrappers to pass `assignmentId` prop

