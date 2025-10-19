# 🎯 Dynamic Assessments System - Complete Implementation Plan

## Executive Summary

This document outlines the comprehensive plan to make the entire assessments section dynamic with admin edit functionality, mirroring the successful grammar system implementation.

---

## 📊 Current State Analysis

### ✅ What's Already Dynamic

1. **Reading Comprehension** (`/reading-comprehension`)
   - ✅ **Database-driven**: Uses `reading_comprehension_tasks` table
   - ✅ **Dynamic routing**: `/reading-comprehension/task?assessmentId={id}`
   - ✅ **API endpoints**: GET/POST at `/api/reading-comprehension/tasks`
   - ✅ **Filtering system**: Language, curriculum level, exam board, category, subcategory, difficulty
   - ✅ **Questions stored**: Separate `reading_comprehension_questions` table with JSONB

2. **AQA Reading** (`/aqa-reading-test`)
   - ✅ **Database-driven**: Uses `aqa_reading_assessments` and `aqa_reading_questions` tables
   - ✅ **Dynamic routing**: `/aqa-reading-test/{language}/{tier}`
   - ✅ **Structured data**: Questions stored with JSONB `question_data` field

3. **AQA Listening** (`/aqa-listening-test`)
   - ✅ **Database-driven**: Uses `aqa_listening_assessments` table
   - ✅ **API endpoints**: Available at `/api/aqa-listening/assessments`

4. **Dictation** (`/dictation`)
   - ✅ **Database-driven**: Uses `aqa_dictation_assessments` and `aqa_dictation_questions` tables
   - ✅ **API endpoints**: Available at `/api/dictation/assessments` and `/api/dictation/questions`

### ❌ What Needs Work

1. **No Admin Edit Interface** - None of the assessment types have admin edit buttons or modals
2. **No Unified Index Page** - `/assessments` page is static, not pulling from database
3. **Inconsistent URL Structure** - Mix of query params (`?assessmentId=`) and path params (`/{language}/{tier}`)
4. **No JSON Import/Export** - Can't bulk create/edit assessments like grammar system
5. **Missing Translation Assessment** - Needs to be created from scratch

---

## 🎯 Recommended URL Structure

### Option A: Query Parameter Based (RECOMMENDED) ✅

**Pros:**
- ✅ Already implemented for reading comprehension
- ✅ Flexible filtering without complex routing
- ✅ Easy to add new filter parameters
- ✅ Works well with dynamic content generation
- ✅ Simpler API structure

**Cons:**
- ❌ Less SEO-friendly (but assessments are behind auth anyway)
- ❌ URLs are longer

**Structure:**
```
/reading-comprehension/task?assessmentId={uuid}
/exam-style-assessment/task?assessmentId={uuid}
/dictation/task?assessmentId={uuid}
/translation/task?assessmentId={uuid}
```

**For filtering/selection pages:**
```
/reading-comprehension?language=spanish&curriculum=ks3&category=food_drink&difficulty=foundation
```

### Option B: Path Parameter Based

**Pros:**
- ✅ SEO-friendly URLs
- ✅ More "RESTful"
- ✅ Cleaner looking URLs

**Cons:**
- ❌ Requires complex dynamic routing with many optional segments
- ❌ Harder to maintain with multiple filter combinations
- ❌ Would require major refactoring of existing system

**Structure:**
```
/reading-comprehension/spanish/ks3/food-drink/foundation/{task-slug}
```

### 🏆 DECISION: Use Option A (Query Parameters)

**Rationale:**
1. Reading comprehension already uses this successfully
2. Assessments are authenticated content (SEO not critical)
3. Easier to implement admin functionality
4. More flexible for future filter additions
5. Consistent with existing implementation

---

## 📋 Database Schema Analysis

### Current Tables

| Table Name | Purpose | Has Questions Table | Status |
|------------|---------|---------------------|--------|
| `reading_comprehension_tasks` | Reading passages | `reading_comprehension_questions` | ✅ Active |
| `aqa_reading_assessments` | AQA reading tests | `aqa_reading_questions` | ✅ Active |
| `aqa_listening_assessments` | AQA listening tests | `aqa_listening_questions` (implied) | ✅ Active |
| `aqa_dictation_assessments` | Dictation tests | `aqa_dictation_questions` | ✅ Active |
| `edexcel_listening_assessments` | Edexcel listening | (separate table) | ⚠️ Exists |

### Required Fields for Admin System

Based on grammar system success, each assessment table needs:

```sql
-- Core identification
id UUID PRIMARY KEY
title TEXT NOT NULL
description TEXT

-- Filtering/categorization
language TEXT NOT NULL  -- 'spanish', 'french', 'german'
curriculum_level TEXT   -- 'ks3', 'ks4', 'ks5'
exam_board TEXT        -- 'aqa', 'edexcel', null for general
category TEXT          -- For KS3: 'food_drink', 'home_local_area', etc.
subcategory TEXT       -- For KS3: specific topics
difficulty TEXT        -- 'foundation', 'higher'
theme_topic TEXT       -- For KS4: AQA themes/topics

-- Content
content TEXT           -- Main passage/text
questions JSONB        -- Or separate questions table

-- Metadata
time_limit INTEGER     -- in minutes
passing_score INTEGER  -- percentage
word_count INTEGER
estimated_time INTEGER

-- Admin
created_by UUID
is_active BOOLEAN DEFAULT true
created_at TIMESTAMP
updated_at TIMESTAMP
```

### ✅ Reading Comprehension Tasks Schema (Current)

```sql
reading_comprehension_tasks:
  ✅ id, title, language, curriculum_level, exam_board
  ✅ theme_topic, category, subcategory, difficulty
  ✅ content, word_count, estimated_reading_time
  ✅ created_by, created_at, updated_at
  
reading_comprehension_questions:
  ✅ id, task_id, question_number, question, type
  ✅ options (JSONB), correct_answer, points, explanation
```

**Status**: ✅ **PERFECT** - Already has all required fields!

---

## 🛠️ Implementation Plan

### Phase 1: Reading Comprehension Admin Interface (PRIORITY 1)

**Goal**: Add admin edit functionality to `/reading-comprehension` page

**Tasks**:
1. ✅ Add admin check (email === 'danieletienne89@gmail.com')
2. ✅ Add "Manage Assessments" button (bottom-right, blue gradient)
3. ✅ Create `ReadingComprehensionEditModal.tsx` component
4. ✅ Create API endpoints:
   - `POST /api/admin/reading-comprehension/create`
   - `PUT /api/admin/reading-comprehension/update`
   - `DELETE /api/admin/reading-comprehension/delete`
5. ✅ Add JSON import/export functionality
6. ✅ Add individual assessment edit/delete buttons in task cards

**Modal Features**:
- Filter dropdowns (same as main page):
  - Language (Spanish/French/German)
  - Curriculum Level (All/KS3/KS4/KS5)
  - Category (if KS3)
  - Subcategory (if KS3)
  - Difficulty (Foundation/Higher)
- List of existing assessments with edit/delete buttons
- "Create New Assessment" button
- JSON import/export buttons

**Edit Form Fields**:
```typescript
{
  title: string
  language: 'spanish' | 'french' | 'german'
  curriculum_level: 'ks3' | 'ks4' | 'ks5'
  exam_board?: 'aqa' | 'edexcel'
  category?: string  // For KS3
  subcategory?: string  // For KS3
  theme_topic?: string  // For KS4
  difficulty: 'foundation' | 'higher'
  content: string  // Markdown editor
  word_count: number  // Auto-calculated
  estimated_reading_time: number  // Auto-calculated
  questions: Array<{
    question: string
    type: 'multiple-choice' | 'true-false' | 'short-answer' | 'matching' | 'gap-fill'
    options?: string[]
    correct_answer: string | string[]
    points: number
    explanation?: string
  }>
}
```

**Estimated Time**: 4-6 hours

---

### Phase 2: Create Translation Assessment System (PRIORITY 2)

**Goal**: Build new translation assessment type from scratch

**Database Schema**:
```sql
CREATE TABLE translation_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  language TEXT NOT NULL,
  curriculum_level TEXT,
  category TEXT,
  subcategory TEXT,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('foundation', 'higher')),
  time_limit INTEGER DEFAULT 30,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE translation_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES translation_assessments(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL,
  source_text TEXT NOT NULL,  -- Text to translate
  target_text TEXT NOT NULL,  -- Correct translation
  direction TEXT NOT NULL CHECK (direction IN ('to_english', 'from_english')),
  context TEXT,  -- Optional context
  points INTEGER DEFAULT 1,
  hints JSONB,  -- Optional hints
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(assessment_id, question_number)
);
```

**Routes to Create**:
- `/translation/page.tsx` - Selection page with filters
- `/translation/task/page.tsx` - Assessment engine
- `/api/translation/assessments/route.ts` - GET/POST endpoints
- `/api/translation/questions/route.ts` - GET endpoint
- `/api/admin/translation/create/route.ts` - Admin create
- `/api/admin/translation/update/route.ts` - Admin update
- `/api/admin/translation/delete/route.ts` - Admin delete

**Components to Create**:
- `TranslationEngine.tsx` - Main assessment component
- `TranslationEditModal.tsx` - Admin modal

**Estimated Time**: 6-8 hours

---

### Phase 3: Exam-Style Assessment (PRIORITY 3)

**Current Status**: Likely uses AQA/Edexcel tables

**Tasks**:
1. Analyze current `/exam-style-assessment` implementation
2. Determine if it's a wrapper for AQA/Edexcel or separate
3. Add admin interface similar to reading comprehension
4. Ensure consistent filtering

**Estimated Time**: 3-4 hours

---

### Phase 4: Unified Assessments Index (PRIORITY 4)

**Goal**: Make `/assessments` page dynamic

**Current**: Static cards with hardcoded links

**New Approach**:
```typescript
// Fetch assessment counts from database
const assessmentCounts = {
  'reading-comprehension': await getCount('reading_comprehension_tasks'),
  'exam-style': await getCount('aqa_reading_assessments'),
  'dictation': await getCount('aqa_dictation_assessments'),
  'translation': await getCount('translation_assessments'),
}

// Display cards with real counts
```

**Admin Features**:
- "Manage All Assessments" button
- Quick stats dashboard
- Links to individual assessment admin pages

**Estimated Time**: 2-3 hours

---

## 🎨 Admin UI Components

### 1. Assessment Edit Modal (Reusable)

Based on `GrammarPageEditModal.tsx`:

```typescript
interface AssessmentEditModalProps {
  isOpen: boolean
  onClose: () => void
  assessmentType: 'reading' | 'translation' | 'dictation' | 'exam-style'
  assessmentId?: string  // undefined for new
  onSave: () => void
}
```

**Features**:
- Tabbed interface: "Details" | "Content" | "Questions" | "Preview"
- Markdown editor for content
- Dynamic question builder
- JSON import/export
- Save/Cancel buttons

### 2. Assessment List View

```typescript
<div className="space-y-4">
  {assessments.map(assessment => (
    <div key={assessment.id} className="border rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3>{assessment.title}</h3>
          <div className="flex gap-2 mt-2">
            <Badge>{assessment.language}</Badge>
            <Badge>{assessment.difficulty}</Badge>
            <Badge>{assessment.curriculum_level}</Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleEdit(assessment.id)}>Edit</Button>
          <Button onClick={() => handleDelete(assessment.id)} variant="destructive">Delete</Button>
        </div>
      </div>
    </div>
  ))}
</div>
```

---

## 📊 JSON Import/Export Format

### Reading Comprehension Example

```json
{
  "title": "La Comida Española",
  "language": "spanish",
  "curriculum_level": "ks3",
  "category": "food_drink",
  "subcategory": "meals",
  "difficulty": "foundation",
  "content": "En España, la comida es muy importante...",
  "word_count": 250,
  "estimated_reading_time": 5,
  "questions": [
    {
      "question": "¿Qué es importante en España?",
      "type": "multiple-choice",
      "options": ["La comida", "El deporte", "La música", "El cine"],
      "correct_answer": "La comida",
      "points": 1,
      "explanation": "The text states 'la comida es muy importante'"
    }
  ]
}
```

### Translation Example

```json
{
  "title": "Basic Phrases Translation",
  "language": "spanish",
  "curriculum_level": "ks3",
  "difficulty": "foundation",
  "time_limit": 20,
  "questions": [
    {
      "source_text": "Hello, how are you?",
      "target_text": "Hola, ¿cómo estás?",
      "direction": "from_english",
      "points": 2,
      "hints": ["Remember the inverted question mark", "Use informal 'tú' form"]
    }
  ]
}
```

---

## ✅ Success Criteria

### Must Have
- ✅ Admin can create/edit/delete all assessment types
- ✅ All assessments use consistent filtering (Language, Curriculum, Category, Subcategory, Difficulty)
- ✅ JSON import/export works for bulk operations
- ✅ Existing assessments continue to work without breaking
- ✅ Admin interface matches grammar system UX

### Nice to Have
- ⭐ Bulk operations (delete multiple, duplicate)
- ⭐ Assessment preview before publishing
- ⭐ Version history
- ⭐ Assessment analytics (completion rates, average scores)

---

## 🚀 Recommended Implementation Order

1. **Reading Comprehension Admin** (4-6 hours) - Highest value, already has perfect schema
2. **Translation System** (6-8 hours) - New feature, high demand
3. **Exam-Style Assessment Admin** (3-4 hours) - Leverage existing AQA tables
4. **Dictation Admin** (2-3 hours) - Simple, already has tables
5. **Unified Index Page** (2-3 hours) - Polish and consistency

**Total Estimated Time**: 17-24 hours

---

## 🎯 Next Steps

1. ✅ **Approve this plan** - Confirm URL structure and approach
2. ✅ **Start with Reading Comprehension** - Implement admin interface
3. ✅ **Test thoroughly** - Ensure no breaking changes
4. ✅ **Iterate** - Move to next assessment type

---

## 📝 Notes

- All assessments should support the same filter structure for consistency
- Use service role client for admin operations to bypass RLS
- Maintain backward compatibility with existing assessment URLs
- Consider adding `is_active` flag to soft-delete assessments
- Store all complex data in JSONB for flexibility

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-18  
**Status**: ✅ Ready for Implementation

