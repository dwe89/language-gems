# 🎯 Teacher Custom Vocabulary System - Master Plan

## Executive Summary

This document outlines the comprehensive architecture for allowing teachers to create, manage, and assign their **own custom vocabulary** while integrating seamlessly with the existing analytics, audio generation, and assignment systems.

---

## 📊 Current System Architecture

### Database Tables Overview

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `centralized_vocabulary` | **Global/Admin vocabulary** - Pre-curated content for all users | `word`, `translation`, `audio_url`, `category`, `subcategory`, `theme_name`, `unit_name`, `curriculum_level` |
| `enhanced_vocabulary_lists` | **Teacher-owned lists** - Collections of vocabulary | `name`, `teacher_id`, `language`, `theme`, `topic`, `is_public`, `folder_id` |
| `enhanced_vocabulary_items` | **Items within teacher lists** | `term`, `translation`, `audio_url`, `centralized_match_id`, `predicted_category`, `effective_category` |
| `vocabulary_assignment_lists` | **Snapshot for assignments** | `source_list_id`, `vocabulary_items` |
| `vocabulary_assignment_items` | **Links vocabulary to assignments** | `centralized_vocabulary_id`, `enhanced_vocabulary_item_id` |
| `vocabulary_gem_collection` | **Student progress tracking** | `centralized_vocabulary_id`, `mastery_level`, `accuracy` |

### Current Flow (ALREADY WORKING ✅)

1. **Teacher creates vocabulary** → `enhanced_vocabulary_lists` + `enhanced_vocabulary_items`
2. **Audio generation** → Checks storage first, generates via Amazon Polly if missing
3. **School sharing** → Teachers in same `school_code` can see each other's vocabulary
4. **Assignments** → Can reference `vocabulary_assignment_list_id` or `vocabulary_criteria`

---

## 🔊 Audio Generation System - VERIFIED ✅

### How It Currently Works

When a teacher types a word in `/vocabulary/new`:

```typescript
// 1. First checks if audio already exists in storage
const checkExistingAudio = async (text: string, language: string) => {
  const fileName = `${pollyLanguage}_${text.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
  const { data: files } = await supabase.storage
    .from('audio')
    .list('audio/vocabulary', { search: fileName });
  
  if (files && files.length > 0) {
    return publicUrl; // Use existing audio
  }
  return null;
};

// 2. Only generates NEW audio if not found
const generateAudioForWord = async (text: string, language: string) => {
  const existingAudio = await checkExistingAudio(text, language);
  if (existingAudio) return existingAudio; // REUSE!
  
  // Generate via API (Amazon Polly)
  const response = await fetch('/api/admin/generate-audio', { ... });
  return result.audioUrl;
};
```

### Answer to Your Question:
> "When they type 'el pollo', does it generate new audio or check database?"

**ANSWER: It checks FIRST, then generates only if missing!**

1. ✅ Checks Supabase storage for existing file (`es_el_pollo.mp3`)
2. ✅ If found → Uses cached URL
3. ✅ If not found → Generates via Amazon Polly → Stores in storage → Returns URL

---

## 🏫 School-Level Access Control - VERIFIED ✅

### Current Implementation

Teachers in the same school can access each other's vocabulary:

```typescript
// In loadSchoolData()
const { data: teacherProfiles } = await supabase
  .from('user_profiles')
  .select('user_id')
  .or(`school_code.eq.${schoolCode},school_initials.eq.${schoolCode}`)
  .in('role', ['teacher', 'admin']);

// Get all vocabulary lists from teachers in the school
for (const teacherId of teacherIds) {
  const lists = await vocabularyService.getVocabularyLists({ teacher_id: teacherId });
  allSchoolLists.push(...lists);
}
```

### Access Tabs Already Implemented:
- **"My Collections"** - Teacher's own vocabulary
- **"School Content"** - All vocabulary from teachers in same school
- **"Content Library"** - Public vocabulary (is_public = true)

---

## 🚨 GAPS TO ADDRESS

### 1. Category/Theme Organization for Custom Vocabulary

**Current State:**
- `enhanced_vocabulary_lists` has `theme` and `topic` fields
- `enhanced_vocabulary_items` has `predicted_category`, `predicted_subcategory`, `manual_category`, `manual_subcategory`
- BUT: The UI doesn't expose these fields during creation!

**Required Changes:**

```typescript
// InlineVocabularyCreator.tsx needs to add:
- Theme selector (Food & Drink, School & Education, etc.)
- Unit/Topic selector (dependent on theme)
- Option to auto-categorize per item OR set collection-wide category
```

### 2. Analytics Integration

**Current State:**
- `vocabulary_gem_collection` tracks progress using `centralized_vocabulary_id` OR `vocabulary_item_id`
- `enhanced_vocabulary_items` has `centralized_match_id` for linking to centralized vocab
- `analytics_enabled` flag exists on items

**Gap:**
- Custom vocabulary currently doesn't link to `vocabulary_gem_collection` properly
- Need to use `enhanced_vocabulary_item_id` in `vocabulary_assignment_items`

### 3. Assignment Integration

**Current State:**
- Assignments can use `vocabulary_assignment_list_id` 
- OR `vocabulary_criteria` (JSON with category, language, etc.)

**What Works:**
- Teachers CAN create assignments with custom vocabulary through the assignment creator

**Gap:**
- UI for selecting custom vocabulary in assignments is mixed with centralized vocabulary

---

## 🏗️ RECOMMENDED IMPLEMENTATION PLAN

### Phase 1: Enhanced Vocabulary Creation UI (Priority: HIGH)

**File: `src/components/vocabulary/InlineVocabularyCreator.tsx`**

Add these fields to the creation form:

```typescript
// NEW FIELDS TO ADD:
const [theme, setTheme] = useState('');
const [unit, setUnit] = useState('');
const [curriculumLevel, setCurriculumLevel] = useState<'KS2' | 'KS3' | 'KS4'>('KS3');
const [examBoard, setExamBoard] = useState('');

// Theme options (matching centralized_vocabulary)
const THEMES = [
  'Identity and relationships',
  'Healthy living and lifestyle',
  'Education and work',
  'Local area, holiday, travel',
  'International and global dimension',
  'Social issues',
  'Grammar and structures',
  // ... etc
];

// Units per theme
const UNITS_BY_THEME: Record<string, string[]> = {
  'Identity and relationships': [
    'Family and friends',
    'Describing people',
    'House and home',
    // ...
  ],
  // ...
};
```

### Phase 2: Linking to Analytics (Priority: HIGH)

**New Database Column (already exists!):**
- `enhanced_vocabulary_items.analytics_enabled` - Already there!
- `enhanced_vocabulary_items.centralized_match_id` - For linking to existing words

**Logic to Implement:**

```typescript
// When saving vocabulary, check if word exists in centralized_vocabulary
const matchCentralizedVocabulary = async (term: string, language: string) => {
  const { data } = await supabase
    .from('centralized_vocabulary')
    .select('id, audio_url')
    .eq('language', language)
    .ilike('word', term)
    .single();
  
  return data; // Returns match or null
};

// If matched:
// - Use centralized_vocabulary_id for gem tracking
// - Reuse audio_url from centralized vocabulary
// - Set centralized_match_id on the item

// If NOT matched:
// - Generate new audio
// - Track progress using enhanced_vocabulary_item_id
// - Consider adding to centralized_vocabulary pool (admin review)
```

### Phase 3: Progress Tracking for Custom Vocabulary

**Update `vocabulary_gem_collection` Usage:**

Currently tracks via:
- `vocabulary_item_id` (legacy)
- `centralized_vocabulary_id` 

**Add support for:**
- `enhanced_vocabulary_item_id` (already in `vocabulary_assignment_items`!)

**SQL Migration:**

```sql
-- Ensure vocabulary_gem_collection can track custom vocabulary
ALTER TABLE vocabulary_gem_collection
ADD COLUMN IF NOT EXISTS enhanced_vocabulary_item_id UUID
REFERENCES enhanced_vocabulary_items(id);

-- Add unique constraint
ALTER TABLE vocabulary_gem_collection
ADD CONSTRAINT unique_student_enhanced_vocab 
UNIQUE (student_id, enhanced_vocabulary_item_id) 
WHERE enhanced_vocabulary_item_id IS NOT NULL;
```

### Phase 4: Assignment Creator Enhancement

**File: `src/components/assignments/SmartAssignmentConfig.tsx`**

Add clear tabs/modes:
1. **Centralized Vocabulary** - From exam board/curriculum
2. **Custom Vocabulary** - From teacher's own lists
3. **School Vocabulary** - From school colleagues' lists

```typescript
const [vocabularySource, setVocabularySource] = useState<
  'centralized' | 'custom' | 'school'
>('centralized');

// Show appropriate selector based on source
{vocabularySource === 'centralized' && <CurriculumContentSelector ... />}
{vocabularySource === 'custom' && <CustomVocabularySelector ... />}
{vocabularySource === 'school' && <SchoolVocabularySelector ... />}
```

### Phase 5: Analytics Dashboard Enhancement

**File: `src/app/dashboard/vocabulary/analytics/page.tsx`**

Add filters for:
- **Vocabulary Source**: Centralized | Custom | All
- **Show custom vocabulary progress**
- **Compare custom vs centralized performance**

---

## 📐 Data Model Diagram

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           VOCABULARY ECOSYSTEM                                │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────────────────────┐  ┌─────────────────────────────────┐   │
│  │    CENTRALIZED VOCABULARY       │  │   ENHANCED VOCABULARY LISTS     │   │
│  │         (Admin/Global)          │  │       (Teacher-Owned)           │   │
│  ├─────────────────────────────────┤  ├─────────────────────────────────┤   │
│  │ • Pre-curated exam content      │  │ • Custom teacher collections    │   │
│  │ • AQA/Edexcel aligned           │  │ • Theme/Unit organization       │   │
│  │ • All audio pre-generated       │  │ • Folder structure              │   │
│  │ • Used by all students          │  │ • School sharing (school_code)  │   │
│  └───────────────┬─────────────────┘  └───────────────┬─────────────────┘   │
│                  │                                    │                       │
│                  │ centralized_match_id               │                       │
│                  │ (reuse audio & analytics)          │                       │
│                  ▼                                    ▼                       │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    ENHANCED VOCABULARY ITEMS                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │ • term, translation                                              │   │ │
│  │  │ • audio_url (generated or reused)                                │   │ │
│  │  │ • centralized_match_id (links to matching centralized word)      │   │ │
│  │  │ • predicted_category, manual_category                            │   │ │
│  │  │ • analytics_enabled                                              │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│                              ▼                ▼                               │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         ASSIGNMENTS TABLE                                │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │ • vocabulary_assignment_list_id (snapshot of list at creation)   │   │ │
│  │  │ • vocabulary_criteria (JSON for dynamic selection)               │   │ │
│  │  │ • vocabulary_selection_type (category/list/custom)               │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
│                              ▼                                                │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                    VOCABULARY_GEM_COLLECTION                             │ │
│  │  ┌─────────────────────────────────────────────────────────────────┐   │ │
│  │  │ • student_id                                                      │   │ │
│  │  │ • centralized_vocabulary_id  ───OR───  enhanced_vocabulary_item_id│  │ │
│  │  │ • mastery_level, accuracy, total_encounters                       │   │ │
│  │  │ • next_review_date (for spaced repetition)                        │   │ │
│  │  └─────────────────────────────────────────────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Implementation Checklist

### Phase 1: Core Vocabulary Creation (COMPLETED ✅)

- [x] **Theme/Unit selectors added to InlineVocabularyCreator** (Jan 2026)
  - Added dropdown for Theme selection (GCSE themes)
  - Added dependent dropdown for Unit/Topic selection
  - Added curriculum level selector (KS2/KS3/KS4)
  - Stores in `enhanced_vocabulary_lists.theme` and `.topic`

- [x] **Centralized vocabulary matching on save** (Jan 2026)
  - `checkCentralizedVocabulary()` function queries for matching words
  - Links via `centralized_match_id` when match found
  - Reuses `audio_url` from centralized vocabulary when available

- [x] **Database migration for gem collection** (Jan 2026)
  - Added `enhanced_vocabulary_item_id` column to `vocabulary_gem_collection`
  - Added unique constraint `unique_student_enhanced_vocab`
  - Created index for faster lookups

- [x] **Audio URL loading for custom vocabulary** (Jan 2026)
  - Fixed `useUnifiedVocabulary` hook to load `audio_url` from `enhanced_vocabulary_items`
  - Games now play audio for teacher-created vocabulary

### Phase 2: Assignment Integration (VERIFIED WORKING ✅)

The assignment system ALREADY properly supports custom vocabulary:

- [x] **"My Lists" tab in assignment creator**
  - Teachers can select from their `enhanced_vocabulary_lists`
  - `customListId` is saved in `vocabularyConfig`
  - `source` is set to `'custom'`

- [x] **Games load from custom vocabulary**
  - `useUnifiedVocabulary` hook detects `config.customListId`
  - Loads from `enhanced_vocabulary_items` table
  - Transforms to unified format for all games

### Phase 3: "Custom" Inline Entry (RESOLVED ✅)

The "Custom" paste-in option has been **REMOVED** from the assignment creator (Jan 2026):
- Teachers should now create vocabulary at `/vocabulary/new` first
- Then select it via "My Lists" in the assignment creator
- This ensures all vocabulary is properly tracked and organized

### Phase 4: Progress Tracking Updates (COMPLETED ✅)

- [x] **Updated `update_vocabulary_gem_collection_atomic` stored procedure** (Jan 2026)
  - Added new parameter `p_enhanced_vocabulary_item_id` for custom vocabulary
  - Supports three vocabulary sources: legacy, centralized, and enhanced
  - Migration file: `migrations/add_enhanced_vocabulary_tracking.sql`

- [x] **Updated `EnhancedGameSessionService`** (Jan 2026)
  - Added `enhancedVocabularyItemId` field to `WordAttempt` interface
  - `updateVocabularyDirectly()` now supports enhanced vocabulary tracking
  - When games use custom vocabulary, progress is tracked to `enhanced_vocabulary_item_id`

- [x] **Updated `useUnifiedVocabulary` hook** (Jan 2026)
  - Added `enhancedVocabularyItemId` field to `UnifiedVocabularyItem` interface
  - When loading from custom lists, sets `enhancedVocabularyItemId` to the item's ID
  - Games receive this ID and can pass it through for progress tracking

- [x] **Updated `TeacherVocabularyAnalyticsService`** (Jan 2026)
  - Queries now include `enhanced_vocabulary_item_id` column
  - `uniqueVocabIds` calculation includes enhanced vocabulary items
  - Custom vocabulary progress is now included in teacher analytics

### Medium Term (Remaining Work)

- [x] **Analytics dashboard UI updates** (Jan 2026)
  - Added filter for vocabulary source type (Centralized vs Custom)
  - Implemented backend support for source filtering
  - Updated simplified analytics dashboard to support source prop
  - Note: "Custom mastery rates separately" is handled by the filter view

- [x] **School vocabulary discovery** (Jan 2026)
  - Browse/search school colleagues' vocabulary
  - One-click duplicate to own collection
  - Usage statistics (how many teachers use this list)
  - Added "Discover Lists" section to vocabulary dashboard

- [x] **Database Migrations Applied** (Jan 2026)
  - Successfully applied `add_enhanced_vocabulary_tracking.sql` to project `xetsvpfunazwkontdpdh`
  - Successfully applied `add_usage_tracking_and_discovery.sql` (added `duplicated_from` and RLS policies)
  - Verified `update_vocabulary_gem_collection_atomic` supports enhanced vocabulary


---

## 🎓 User Experience Flow

### Teacher Creates Custom Vocabulary

```
1. Teacher navigates to /dashboard/vocabulary
2. Clicks "Save Collection"
3. Enters:
   - Collection Name: "Year 9 Food Unit"
   - Language: French 🇫🇷
   - Theme: "Healthy living and lifestyle" ← NEW
   - Unit: "Food and meals" ← NEW
   - Curriculum Level: KS3 ← NEW
4. Adds vocabulary pairs:
   - le poulet → chicken [🔊 checks storage... not found... generates]
   - le poisson → fish [🔊 checks storage... FOUND! Uses cached]
   - la salade → salad [🔊 checks centralized... MATCHED! Links & reuses]
5. Saves collection
6. Creates assignment → Selects "Custom Vocabulary" → Picks this list
7. Students play games → Progress tracked in vocabulary_gem_collection
8. Teacher views analytics → Sees student mastery of their custom words
```

---

## 🔒 Security Considerations

### Row Level Security (RLS)

Ensure these RLS policies exist:

```sql
-- Teachers can only see their own vocabulary lists
CREATE POLICY "Teachers view own lists" ON enhanced_vocabulary_lists
FOR SELECT USING (teacher_id = auth.uid());

-- Teachers can view school colleagues' lists (read-only)
CREATE POLICY "Teachers view school lists" ON enhanced_vocabulary_lists
FOR SELECT USING (
  teacher_id IN (
    SELECT user_id FROM user_profiles
    WHERE school_code = (
      SELECT school_code FROM user_profiles WHERE user_id = auth.uid()
    )
  )
);

-- Teachers can only modify their own lists
CREATE POLICY "Teachers modify own lists" ON enhanced_vocabulary_lists
FOR ALL USING (teacher_id = auth.uid());
```

---

## 📈 Success Metrics

Track these to measure feature adoption:

1. **Custom vocabulary creation rate** - Lists created per teacher per month
2. **Audio reuse rate** - % of words that reuse existing audio
3. **Assignment usage** - % of assignments using custom vocabulary
4. **Student engagement** - Completion rates for custom vs centralized vocabulary
5. **School sharing** - % of teachers using colleagues' vocabulary

---

## Questions Answered

| Question | Answer |
|----------|--------|
| Does creating vocabulary generate new audio? | Checks storage first, generates only if missing |
| Is audio linked to the database? | Yes - stored in Supabase storage, URL in `audio_url` column |
| Can teachers use their own vocab in assignments? | YES - via `vocabulary_assignment_list_id` |
| Is custom vocab tracked in analytics? | **YES** - fully implemented via `enhanced_vocabulary_item_id` |
| Do students in same school see custom vocab? | **YES** - via the new "Discover Lists" / School Discovery page |
| Should we use Theme/Unit or Category/Subcategory? | BOTH - Theme/Unit at list level, Category at item level |

---

*Last Updated: 2026-01-10 (Current Status: Fully Implemented)*
*Author: Language Gems Development Team*
