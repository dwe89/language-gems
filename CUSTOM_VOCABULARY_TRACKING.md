# Custom Vocabulary Tracking Flow

## Overview

Custom vocabulary created by teachers through the `enhanced_vocabulary_lists` system is fully tracked and analyzed in the dashboard, just like centralized vocabulary. This document explains how the tracking works.

## Database Tables

### 1. `enhanced_vocabulary_lists`
- Stores teacher-created vocabulary collections
- Fields: `id`, `name`, `description`, `teacher_id`, `language`, `theme`, `topic`, `difficulty_level`, `content_type`, `is_public`, `word_count`

### 2. `enhanced_vocabulary_items`
- Stores individual vocabulary items within a list
- Fields: `id`, `list_id`, `type`, `term`, `translation`, `part_of_speech`, `context_sentence`, `audio_url`, etc.
- **Important**: Items can optionally link to `centralized_vocabulary` via `centralized_vocabulary_id` field

### 3. `vocabulary_gem_collection`
- Tracks student progress on vocabulary words
- Works with BOTH centralized vocabulary AND custom vocabulary
- Fields: `student_id`, `vocabulary_item_id`, `centralized_vocabulary_id`, `total_encounters`, `correct_encounters`, `mastery_level`, etc.

## Tracking Flow

### Step 1: Assignment Creation

When a teacher creates an assignment with custom vocabulary:

```typescript
// In enhancedAssignmentService.ts
if (vocabularyConfig.source === 'custom' && vocabularyConfig.customListId) {
  const { data: customList } = await supabase
    .from('enhanced_vocabulary_lists')
    .select(`
      id,
      name,
      enhanced_vocabulary_items (
        id,
        term,
        translation,
        centralized_vocabulary_id
      )
    `)
    .eq('id', vocabularyConfig.customListId)
    .single();
  
  // Store the custom list ID in assignment metadata
  vocabularyListId = customList.id;
}
```

### Step 2: Game Session Recording

When a student plays a game with custom vocabulary:

```typescript
// In EnhancedGameSessionService.ts
async recordWordAttempt(sessionId, gameType, attempt) {
  // Record the attempt with vocabulary_id
  const gemEvent = {
    vocabularyId: attempt.vocabularyId, // This is the enhanced_vocabulary_items.id
    wordText: attempt.wordText,
    translationText: attempt.translationText,
    wasCorrect: attempt.wasCorrect,
    responseTimeMs: attempt.responseTimeMs
  };
  
  // Store in vocabulary_gem_collection
  await this.updateGemCollection(sessionId, studentId, gemEvent);
}
```

### Step 3: Gem Collection Update

The `vocabulary_gem_collection` table tracks progress:

```typescript
// In vocabulary-mining.ts or EnhancedGameSessionService.ts
await supabase.rpc('update_vocabulary_gem_collection', {
  p_student_id: studentId,
  p_vocabulary_item_id: vocabularyId, // Can be from enhanced_vocabulary_items
  p_centralized_vocabulary_id: centralizedId, // Optional link to centralized vocab
  p_was_correct: wasCorrect,
  p_response_time_ms: responseTime,
  p_hint_used: hintUsed,
  p_streak_count: streakCount
});
```

### Step 4: Dashboard Analytics

The dashboard queries `vocabulary_gem_collection` to show:

1. **Vocabulary Strengths** - Words with high accuracy (≥90%) and multiple encounters (≥5)
2. **Vocabulary Weaknesses** - Words with low accuracy (<60%) or few encounters (<3)
3. **Words Consistently Correct** - Words with 100% accuracy over multiple encounters
4. **Words Consistently Wrong** - Words with 0% accuracy over multiple encounters
5. **Exposure Count** - Total encounters per word
6. **Time Taken** - Average response time per word

```typescript
// Example query for vocabulary analytics
const { data: gemCollection } = await supabase
  .from('vocabulary_gem_collection')
  .select(`
    *,
    enhanced_vocabulary_items!vocabulary_item_id (
      term,
      translation,
      list_id
    )
  `)
  .eq('student_id', studentId);

// Calculate metrics
const strengths = gemCollection.filter(item => 
  item.total_encounters >= 5 && 
  (item.correct_encounters / item.total_encounters) >= 0.9
);

const weaknesses = gemCollection.filter(item =>
  item.total_encounters >= 3 &&
  (item.correct_encounters / item.total_encounters) < 0.6
);
```

## What CAN Be Tracked

✅ **Vocabulary Strengths** - Words mastered by the student
✅ **Vocabulary Weaknesses** - Words the student struggles with
✅ **Words Consistently Correct** - Perfect accuracy words
✅ **Words Consistently Wrong** - Zero accuracy words
✅ **Exposure Count** - How many times each word was encountered
✅ **Time Taken** - Average response time per word
✅ **Accuracy Percentage** - Overall accuracy per word
✅ **Mastery Level** - FSRS-based mastery tracking
✅ **Streak Tracking** - Current and best streaks
✅ **Spaced Repetition** - Next review dates

## What CANNOT Be Tracked

❌ **Topic-based Analytics** - Custom vocabulary doesn't have standardized topics
❌ **Category-based Analytics** - Custom vocabulary doesn't have standardized categories
❌ **Curriculum-level Comparisons** - Custom vocabulary isn't tied to KS3/KS4 standards

## Workarounds for Missing Features

### 1. Topic Tracking
Teachers can use the `theme` and `topic` fields in `enhanced_vocabulary_lists` to organize custom vocabulary:

```typescript
const customList = {
  name: "Spanish Food Vocabulary",
  theme: "Food & Drink",
  topic: "Restaurant Vocabulary",
  // ... other fields
};
```

Then filter analytics by theme/topic:

```typescript
const foodVocabProgress = gemCollection.filter(item =>
  item.enhanced_vocabulary_items?.list_id === customListId
);
```

### 2. Linking to Centralized Vocabulary
When creating custom vocabulary, the system can attempt to link items to centralized vocabulary:

```typescript
// In enhanced_vocabulary_items
{
  term: "hola",
  translation: "hello",
  centralized_vocabulary_id: "uuid-of-centralized-hola" // Optional link
}
```

This allows custom vocabulary to benefit from centralized vocabulary analytics.

## Best Practices

1. **Use Descriptive Names** - Give custom lists clear, descriptive names
2. **Add Themes/Topics** - Use the theme and topic fields for organization
3. **Link When Possible** - Link custom items to centralized vocabulary when available
4. **Set Difficulty Levels** - Assign appropriate difficulty levels to items
5. **Include Context** - Add context sentences for better learning

## Summary

Custom vocabulary from `enhanced_vocabulary_lists` is **fully tracked** through the same `vocabulary_gem_collection` system as centralized vocabulary. The main difference is that custom vocabulary doesn't have standardized categories/topics, but teachers can use the `theme` and `topic` fields for organization. All word-level analytics (accuracy, exposure, mastery, etc.) work identically for both custom and centralized vocabulary.

