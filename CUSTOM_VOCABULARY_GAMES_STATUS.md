# Custom Vocabulary Support in Games - Status Summary

## Overview

This document tracks the implementation status of custom vocabulary (`enhanced_vocabulary_items`) support across all Language Gems games. Custom vocabulary allows teachers to create their own word lists and sentences for student practice.

## The Problem

Games were experiencing **409 Conflict FK violations** when tracking custom vocabulary. The root cause:
- Games passed vocabulary IDs to `recordWordAttempt()` assuming all IDs came from `centralized_vocabulary`
- Custom vocabulary IDs from `enhanced_vocabulary_items` were being inserted into the wrong FK column
- This caused foreign key constraint violations

## The Solution

Added `isCustomVocabulary` flag throughout the vocabulary data flow:
1. `useUnifiedVocabulary.ts` - Added `isCustomVocabulary?: boolean` to `UnifiedVocabularyItem`
2. Each game's vocabulary interface updated to include `isCustomVocabulary`
3. All vocabulary mappings preserve the flag
4. `recordWordAttempt()` / `recordSentenceAttempt()` calls conditionally route to:
   - `vocabularyId` for standard vocabulary
   - `enhancedVocabularyItemId` for custom vocabulary

---

## Word Games Status ✅ COMPLETE

All word games have been updated with custom vocabulary support:

| Game | File | recordWordAttempt Calls | Status |
|------|------|------------------------|--------|
| **Vocab Blast** | `vocab-blast/components/VocabBlastGame.tsx` | 2 calls | ✅ Updated |
| **Hangman** | `hangman/components/HangmanGame.tsx` | 2 calls | ✅ Updated |
| **Hangman Wrapper** | `hangman/components/HangmanGameWrapper.tsx` | 1 call | ✅ Updated |
| **Word Towers** | `word-towers/page.tsx` | 2 calls | ✅ Updated |
| **Memory Game** | `memory-game/components/MemoryGameMain.tsx` | 1 call | ✅ Updated |
| **Noughts and Crosses** | `noughts-and-crosses/components/TicTacToeGameThemed.tsx` | 2 calls | ✅ Updated |
| **Word Scramble** | `word-scramble/components/ImprovedWordScrambleGame.tsx` | 2 calls | ✅ Updated |
| **Detective Listening** | `detective-listening/components/DetectiveRoom.tsx` | 1 call | ✅ Updated |
| **Speed Builder** | `speed-builder/components/GemSpeedBuilder.tsx` | 1 call | ✅ Updated |

### Pattern Used

```typescript
// Updated recordWordAttempt call:
await sessionService.recordWordAttempt(gameSessionId, 'game-name', {
  vocabularyId: item.isCustomVocabulary ? undefined : item.id,
  enhancedVocabularyItemId: item.isCustomVocabulary ? item.id : undefined,
  wordText: item.word,
  translationText: item.translation,
  // ... other fields
});
```

---

## Sentence Games Status

### Sentence Towers ✅ COMPLETE

| File | Calls | Status |
|------|-------|--------|
| `sentence-towers/page.tsx` | 2 `recordSentenceAttempt` calls | ✅ Updated |

Uses the same pattern but with `enhancedSentenceId` instead of `enhancedVocabularyItemId`.

### Lava Temple & Case File Translator ⚠️ DIFFERENT PATTERN

These games use **sentence parsing** rather than direct vocabulary ID tracking:

| Game | Tracking Method | Custom Vocab Support |
|------|-----------------|---------------------|
| **Lava Temple** | `sentenceGame.processSentence()` → `MWEVocabularyTrackingService` | ❌ Not Supported |
| **Case File Translator** | `sentenceGame.processSentence()` → `MWEVocabularyTrackingService` | ❌ Not Supported |

**How it works:**
1. Games call `processSentence(sentenceText, isCorrect, responseTime, ...)`
2. `SentenceGameService` calls `MWEVocabularyTrackingService.parseSentenceWithLemmatization()`
3. The service queries `centralized_vocabulary` to find vocabulary matches in the sentence text
4. Found vocabulary is tracked via `recordWordAttempt()` with matched vocabulary IDs

**The Issue:**
- `MWEVocabularyTrackingService` only queries `centralized_vocabulary`
- Custom vocabulary from `enhanced_vocabulary_items` is not searched
- Custom sentences will not track any vocabulary matches

---

## Service Updates ✅ COMPLETE

| Service | Update | Status |
|---------|--------|--------|
| `EnhancedGameSessionService.ts` | `recordWordAttempt` supports `enhancedVocabularyItemId` | ✅ Updated |
| `EnhancedGameSessionService.ts` | `recordSentenceAttempt` supports `enhancedSentenceId` | ✅ Updated |

---

## Remaining Work

### 1. Update MWEVocabularyTrackingService (For Sentence Games)

To support custom vocabulary in Lava Temple and Case File Translator:

**File:** `src/services/MWEVocabularyTrackingService.ts`

**Required Changes:**
```typescript
// In parseSentenceWithLemmatization(), also query enhanced_vocabulary_items:

// Query 1: Standard vocabulary (existing)
const { data: standardVocab } = await this.supabase
  .from('centralized_vocabulary')
  .select('id, word, translation, ...')
  .eq('language', language);

// Query 2: Custom vocabulary (NEW)
const { data: customVocab } = await this.supabase
  .from('enhanced_vocabulary_items')
  .select('id, word, translation, ...')
  .eq('type', 'word');

// Merge results, marking custom vocabulary:
const allVocabulary = [
  ...(standardVocab || []).map(v => ({ ...v, isCustomVocabulary: false })),
  ...(customVocab || []).map(v => ({ ...v, isCustomVocabulary: true }))
];
```

**Then update the result type:**
```typescript
export interface MWEVocabularyMatch {
  id: string;
  word: string;
  translation: string;
  isCustomVocabulary?: boolean; // NEW
  // ... existing fields
}
```

### 2. Custom Sentence Creation UI

Teachers need a way to create custom sentences (not just words).

**Current State:**
- `EnhancedVocabularyList` supports `content_type: 'words' | 'sentences' | 'mixed'`
- `EnhancedVocabularyItem` supports `type: 'word' | 'sentence' | 'phrase'`
- UI in `/dashboard/vocabulary/create/page.tsx` only supports word creation

**Required Changes:**

1. **Update Create Page:** Add sentence type selector
2. **Add Sentence Fields:**
   - Source sentence (e.g., Spanish)
   - Translation sentence (e.g., English)
   - Optional: Gap positions, missing words, context hints
3. **Validation:** Ensure sentences are well-formed
4. **Storage:** Save with `type: 'sentence'` in `enhanced_vocabulary_items`

### 3. Custom Sentences in Sentence Games

For Sentence Towers, Lava Temple, and Case File Translator to use custom sentences:

1. **Load custom sentences:** Update game data loading to query `enhanced_vocabulary_items` where `type = 'sentence'`
2. **Format for games:** Transform custom sentences to match game's expected format
3. **Track with ID:** Pass `isCustomVocabulary: true` and use the sentence ID for tracking

---

## Testing Checklist

### Word Games (Custom Vocabulary)
- [ ] Create a custom vocabulary list with 5+ words
- [ ] Play Vocab Blast with custom list → Verify no 409 errors
- [ ] Play Hangman with custom list → Verify no 409 errors  
- [ ] Play Word Towers with custom list → Verify no 409 errors
- [ ] Play Memory Game with custom list → Verify no 409 errors
- [ ] Play Noughts and Crosses with custom list → Verify no 409 errors
- [ ] Play Word Scramble with custom list → Verify no 409 errors
- [ ] Play Detective Listening with custom list → Verify no 409 errors
- [ ] Verify progress appears in word_performance_logs with correct FK

### Sentence Games (When Implemented)
- [ ] Create custom sentences with gaps
- [ ] Play Sentence Towers with custom sentences → Verify no errors
- [ ] Play Lava Temple with custom sentences → Verify vocabulary tracking
- [ ] Play Case File Translator with custom sentences → Verify vocabulary tracking

---

## Files Modified (This Session)

1. `src/hooks/useUnifiedVocabulary.ts` - Added `isCustomVocabulary` to interface
2. `src/app/activities/word-towers/page.tsx` - Full update
3. `src/app/activities/memory-game/data/gameConstants.ts` - Card interface
4. `src/app/activities/memory-game/components/MemoryGameMain.tsx` - Mappings + tracking
5. `src/app/activities/noughts-and-crosses/components/TicTacToeGameThemed.tsx` - Full update
6. `src/app/activities/word-scramble/components/ImprovedWordScrambleGame.tsx` - Full update
7. `src/app/activities/detective-listening/types.ts` - Evidence interface
8. `src/app/activities/detective-listening/components/DetectiveRoom.tsx` - Full update
9. `src/app/activities/speed-builder/components/GemSpeedBuilder.tsx` - Full update
10. `src/services/rewards/EnhancedGameSessionService.ts` - recordSentenceAttempt update
11. `src/app/activities/sentence-towers/page.tsx` - Full update

---

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| Word Games | ✅ Complete | All 9 games updated with isCustomVocabulary pattern |
| Sentence Towers | ✅ Complete | Uses recordSentenceAttempt with enhancedSentenceId |
| Lava Temple | ⚠️ Partial | Uses sentence parsing - needs MWEService update |
| Case File Translator | ⚠️ Partial | Uses sentence parsing - needs MWEService update |
| Custom Sentence UI | ❌ Not Started | Teachers cannot create custom sentences yet |

**Priority Next Steps:**
1. Test word games with custom vocabulary to verify fix
2. Implement custom sentence creation UI
3. Update MWEVocabularyTrackingService for sentence games
