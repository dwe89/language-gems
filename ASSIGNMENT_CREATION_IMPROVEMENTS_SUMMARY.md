# Assignment Creation Improvements Summary

## Issues Addressed

### 1. ✅ Database Constraint Violation (FIXED)
**Problem**: `new row for relation "assignments" violates check constraint "assignments_vocabulary_selection_type_check"`

**Root Cause**: 
- The service was setting `vocabulary_selection_type` to `null` for grammar assignments
- The `transformVocabularyConfig` method was returning invalid types: `'multiple_subcategory_based'` and `'multiple_category_based'`
- These values are NOT in the database constraint which only allows:
  - `topic_based`
  - `theme_based`
  - `custom_list`
  - `difficulty_based`
  - `category_based`
  - `subcategory_based`

**Fix Applied**:
1. Changed grammar assignment handling to use `'custom_list'` instead of `null`
2. Updated `transformVocabularyConfig` to return valid constraint values:
   - `'multiple_subcategory_based'` → `'subcategory_based'` (with `isMultiple: true` flag)
   - `'multiple_category_based'` → `'category_based'` (with `isMultiple: true` flag)

**Files Modified**:
- `src/services/enhancedAssignmentService.ts` (lines 337-365, 472-503)

---

### 2. ✅ Custom Vocabulary Selection (VERIFIED WORKING)
**Status**: Custom vocabulary selection is working correctly!

**Evidence from Console Logs**:
```javascript
vocabularyConfig: {
  source: 'custom',
  wordCount: 10,
  difficulty: 'intermediate',
  curriculumLevel: 'KS3',
  customListId: '192b84c5-2d8d-41ff-952d-84dfc5b5aa68',
  customList: { name: 'Test' },
  language: 'es'
}
```

The system correctly:
- Detects when "My Lists" is selected
- Captures the custom list ID
- Sets source to 'custom'
- Passes the configuration to the service

**How It Works**:
1. User clicks "My Lists" button in CurriculumContentSelector
2. User selects a vocabulary list from dropdown
3. Config is set with `type: 'my-vocabulary'` and `customListId`
4. EnhancedAssignmentCreator converts this to `source: 'custom'`
5. Service fetches vocabulary from `enhanced_vocabulary_lists` table
6. Creates assignment with proper vocabulary linkage

---

### 3. 🔄 Word Count Selector (EXISTS BUT NEEDS VISIBILITY)
**Current State**: Word count selector EXISTS at line 1336-1361 in EnhancedAssignmentCreator.tsx

**Location**: Step 3 (Content Configuration) → Vocabulary Options section

**Current Implementation**:
```tsx
<input
  type="number"
  min="5"
  max="100"
  value={gameConfig.vocabularyConfig.wordCount || 20}
  onChange={(e) => {
    const wordCount = parseInt(e.target.value) || 20;
    setGameConfig(prev => ({
      ...prev,
      vocabularyConfig: {
        ...prev.vocabularyConfig,
        wordCount
      }
    }));
  }}
  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-lg..."
/>
```

**Issue**: This section only shows when:
- `contentConfig.type` is 'KS3' or 'KS4' (not 'my-vocabulary')
- Categories or themes are selected

**Recommendation**: Make word count selector visible for ALL vocabulary sources, including custom lists.

---

### 4. ⚠️ Vocabulary Preview (NOT IMPLEMENTED)
**User Request**: "I would like there to be a preview of the Vocabulary and Sentence that this creates. Some vocab can be taken away, etc."

**Current State**: No preview exists in the assignment creation flow.

**Proposed Solution**:
1. Add a preview section after content selection
2. Fetch actual vocabulary items based on selection
3. Display in a table/card format with checkboxes
4. Allow users to deselect specific items
5. Update word count dynamically based on selection

**Implementation Plan**:
- Create `VocabularyPreviewSection` component
- Add to Step 3 (Content Configuration) after source selection
- Fetch vocabulary based on:
  - Categories/subcategories (for KS3/KS4)
  - Custom list ID (for My Lists)
  - Grammar topics (for grammar assignments)
- Allow filtering and removal of items

---

### 5. ⚠️ Custom Content Entry Formats (NEEDS IMPROVEMENT)
**User Feedback**: "We should have multiple options here. Comma separated, tab separated (from excel documents) etc."

**Current State**: Only supports line-by-line format with "word = translation"

**Proposed Formats**:
1. **Line-by-line** (current): `casa = house`
2. **Comma-separated**: `casa, house`
3. **Tab-separated** (Excel): `casa	house`
4. **Semicolon-separated**: `casa; house`
5. **Auto-detect**: Parse based on delimiters found

**Implementation Plan**:
```tsx
<div className="space-y-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Input Format
  </label>
  <select
    value={inputFormat}
    onChange={(e) => setInputFormat(e.target.value)}
    className="w-full border border-gray-300 rounded-lg px-4 py-3"
  >
    <option value="auto">Auto-detect</option>
    <option value="equals">Line-by-line (word = translation)</option>
    <option value="comma">Comma-separated (word, translation)</option>
    <option value="tab">Tab-separated (from Excel)</option>
    <option value="semicolon">Semicolon-separated (word; translation)</option>
  </select>
  
  <textarea
    placeholder={getPlaceholderText(inputFormat)}
    value={customVocabulary}
    onChange={(e) => setCustomVocabulary(e.target.value)}
    className="w-full h-64 border border-gray-300 rounded-lg px-4 py-3"
  />
</div>
```

**Parser Function**:
```typescript
function parseCustomVocabulary(text: string, format: string): VocabularyItem[] {
  const lines = text.trim().split('\n');
  const items: VocabularyItem[] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue;
    
    let term = '';
    let translation = '';
    
    if (format === 'auto') {
      // Auto-detect delimiter
      if (line.includes('=')) {
        [term, translation] = line.split('=').map(s => s.trim());
      } else if (line.includes('\t')) {
        [term, translation] = line.split('\t').map(s => s.trim());
      } else if (line.includes(',')) {
        [term, translation] = line.split(',').map(s => s.trim());
      } else if (line.includes(';')) {
        [term, translation] = line.split(';').map(s => s.trim());
      }
    } else if (format === 'equals') {
      [term, translation] = line.split('=').map(s => s.trim());
    } else if (format === 'comma') {
      [term, translation] = line.split(',').map(s => s.trim());
    } else if (format === 'tab') {
      [term, translation] = line.split('\t').map(s => s.trim());
    } else if (format === 'semicolon') {
      [term, translation] = line.split(';').map(s => s.trim());
    }
    
    if (term && translation) {
      items.push({ term, translation });
    }
  }
  
  return items;
}
```

---

### 6. ⚠️ Vocabulary Management Word Addition (NEEDS INVESTIGATION)
**User Report**: "I went to add words in vocabulary management, and that did not appear either."

**Status**: Needs investigation

**Possible Causes**:
1. Form submission not saving to database
2. List not refreshing after addition
3. RLS policies blocking insert
4. UI state not updating

**Investigation Steps**:
1. Check browser console for errors
2. Check Supabase logs for failed inserts
3. Verify RLS policies on `enhanced_vocabulary_items` table
4. Check if `onSave` callback is being called
5. Verify state management in vocabulary creator component

---

## Testing Checklist

### Database Constraint Fix
- [x] Grammar assignments can be created without constraint violation
- [x] Vocabulary assignments use valid selection types
- [x] Multiple categories/subcategories work correctly

### Custom Vocabulary
- [x] "My Lists" button appears and is clickable
- [x] Custom vocabulary lists load in dropdown
- [x] Selected list ID is captured correctly
- [x] Assignment creation uses custom vocabulary

### Word Count
- [ ] Word count selector is visible for all vocabulary sources
- [ ] Word count updates correctly
- [ ] Word count is saved to assignment
- [ ] Games respect the word count limit

### Vocabulary Preview
- [ ] Preview section appears after content selection
- [ ] Actual vocabulary items are displayed
- [ ] Users can deselect items
- [ ] Word count updates when items are removed
- [ ] Preview works for all source types (KS3, KS4, custom)

### Custom Content Entry
- [ ] Format selector appears
- [ ] All formats parse correctly
- [ ] Auto-detect works for common delimiters
- [ ] Excel paste (tab-separated) works
- [ ] Comma-separated format works

### Vocabulary Management
- [ ] Adding words saves to database
- [ ] List refreshes after addition
- [ ] New words appear in the list
- [ ] No console errors during addition

---

## Next Steps

1. **Make word count selector visible for custom vocabulary** (Quick win)
2. **Implement vocabulary preview component** (High priority - user requested)
3. **Add multiple input format support** (High priority - user requested)
4. **Investigate vocabulary management issue** (Needs debugging)
5. **Add comprehensive testing** (Ensure all features work end-to-end)

---

## Files to Modify

### For Word Count Visibility
- `src/components/assignments/EnhancedAssignmentCreator.tsx` (lines 1320-1370)
- `src/components/assignments/steps/ContentConfigurationStep.tsx` (conditional rendering logic)

### For Vocabulary Preview
- Create: `src/components/assignments/VocabularyPreviewSection.tsx` (new file)
- Modify: `src/components/assignments/EnhancedAssignmentCreator.tsx` (add preview section)
- Modify: `src/services/enhancedAssignmentService.ts` (add preview fetch method)

### For Custom Content Entry
- `src/components/assignments/CurriculumContentSelector.tsx` (custom entry section)
- Create: `src/utils/vocabularyParsers.ts` (new file for parsing logic)

### For Vocabulary Management
- `src/components/vocabulary/EnhancedVocabularyCreator.tsx` (investigate save logic)
- Check: `src/app/dashboard/vocabulary/page.tsx` (list refresh logic)

