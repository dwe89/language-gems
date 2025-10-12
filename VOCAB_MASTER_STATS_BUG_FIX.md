# Vocab Master Stats Bug Fix

## Issue
When viewing the Vocab Master page for **French KS5 (A-level)**, the dashboard incorrectly showed **25 words mastered** even though:
- No French KS5 vocabulary exists in the database (confirmed: 0 rows)
- User has never practiced French A-level vocabulary

## Root Cause
In `src/app/vocab-master/components/UnifiedVocabMasterLauncher.tsx`, the `loadUserStats` function was fetching gem collection data **without filtering by language or curriculum level**:

```typescript
// ❌ BEFORE: Fetched ALL gems regardless of language/level
const { data: gemCollectionData, error: gemError } = await supabase
  .from('vocabulary_gem_collection')
  .select('*')
  .eq('student_id', user.id);
```

This caused the function to count **all mastered words from any language/level** (e.g., Spanish KS3 gems) and display them for French KS5.

## Fix Applied
Updated the query to join with `centralized_vocabulary` and filter by the selected language and curriculum level:

```typescript
// ✅ AFTER: Only fetch gems for selected language/level
let gemQuery = supabase
  .from('vocabulary_gem_collection')
  .select(`
    *,
    centralized_vocabulary!inner(
      language,
      curriculum_level
    )
  `)
  .eq('student_id', user.id)
  .eq('centralized_vocabulary.language', dbLanguage);

// Add curriculum level filter if available
if (selectedLevel) {
  gemQuery = gemQuery.eq('centralized_vocabulary.curriculum_level', selectedLevel);
}

const { data: gemCollectionData, error: gemError } = await gemQuery;
```

## Impact
- **French KS5**: Will now correctly show 0 words mastered (no vocabulary exists)
- **Spanish KS3**: Will continue to show accurate stats based on actual progress
- **All other language/level combinations**: Stats are now properly isolated and won't bleed across filters

## Testing Verification
- Database confirmed: 0 French KS5 vocabulary entries
- Database confirmed: 0 French KS5 mastered gems
- Fix ensures gem collection query respects language and curriculum level filters
- No TypeScript errors after applying fix

## Files Changed
- `src/app/vocab-master/components/UnifiedVocabMasterLauncher.tsx` (lines 518-540)

## Date Fixed
October 12, 2025
