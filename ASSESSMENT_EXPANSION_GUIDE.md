# AQA Reading Assessment Expansion Guide

## Current Structure ✅

The system is now set up with a scalable structure that supports multiple assessments per language and tier.

### URL Structure
- `/aqa-reading-test/{language}/{tier}` - Current implementation
- `/aqa-reading-test/{language}/{tier}/{paper}` - Future expansion ready

### Database Structure
```sql
aqa_reading_assessments (
  id UUID PRIMARY KEY,
  level TEXT (foundation/higher),
  language TEXT (es/fr/de),
  identifier TEXT (paper-1, paper-2, etc.),
  -- other fields...
  UNIQUE(level, language, identifier)
)
```

## Adding Multiple Papers

### 1. Update Population Script
In `scripts/populate-aqa-assessments.ts`, modify the papers array:

```typescript
const papers = [
  { identifier: 'paper-1', suffix: 'Paper 1' },
  { identifier: 'paper-2', suffix: 'Paper 2' },
  { identifier: 'paper-3', suffix: 'Paper 3' }
];
```

### 2. Create Paper-Specific Questions
Add different question sets for each paper:

```typescript
const spanishFoundationPaper1Questions = [...];
const spanishFoundationPaper2Questions = [...];
const spanishFoundationPaper3Questions = [...];

const languages = [
  { 
    code: 'es', 
    name: 'Spanish', 
    papers: {
      'paper-1': spanishFoundationPaper1Questions,
      'paper-2': spanishFoundationPaper2Questions,
      'paper-3': spanishFoundationPaper3Questions
    }
  }
];
```

### 3. Create Dynamic Paper Routes
Create `/aqa-reading-test/{language}/{tier}/[paper]/page.tsx`:

```typescript
'use client';

import { useParams } from 'next/navigation';

export default function AQAReadingPaperPage() {
  const params = useParams();
  const language = params.language as string;
  const tier = params.tier as string;
  const paper = params.paper as string;

  return (
    <AQAReadingAssessment
      language={language}
      difficulty={tier}
      identifier={paper}
      // ... other props
    />
  );
}
```

### 4. Update Assessment Selection Page
Add paper selection UI:

```typescript
// List available papers for a language/tier
const papers = await assessmentService.getAssessmentsByLevel(tier, language);

return (
  <div>
    {papers.map(paper => (
      <Link 
        key={paper.identifier}
        href={`/aqa-reading-test/${language}/${tier}/${paper.identifier}`}
      >
        {paper.title}
      </Link>
    ))}
  </div>
);
```

## Current Implementation Status

### ✅ Working Features
- **3 Languages**: Spanish, French, German
- **2 Tiers**: Foundation (45 min), Higher (60 min)
- **Database Integration**: Full Supabase integration
- **Scalable Structure**: Ready for multiple papers
- **Clean URLs**: `/aqa-reading-test/{language}/{tier}`
- **Redirects**: Old URLs redirect to new structure

### ✅ Database Schema
- **Unique Constraints**: Prevents duplicate assessments
- **Identifier Field**: Supports multiple papers per tier/language
- **Proper Indexing**: Optimized for performance
- **RLS Policies**: Secure access control

### ✅ Service Layer
- `getAssessmentByLevel(level, language, identifier)` - Get specific paper
- `getAssessmentsByLevel(level, language)` - List all papers for tier/language
- Proper error handling and validation

## Example URLs

### Current (Working)
- `/aqa-reading-test/spanish/foundation`
- `/aqa-reading-test/french/higher`
- `/aqa-reading-test/german/foundation`

### Future Expansion
- `/aqa-reading-test/spanish/foundation/paper-1`
- `/aqa-reading-test/spanish/foundation/paper-2`
- `/aqa-reading-test/french/higher/paper-1`
- `/aqa-reading-test/german/foundation/paper-3`

## Adding New Languages

### 1. Add Language Questions
Create question sets in the population script:

```typescript
const italianFoundationQuestions = [
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Questions 1-4: Hobbies and interests',
    // Italian content...
  }
];
```

### 2. Update Languages Array
```typescript
const languages = [
  { code: 'es', name: 'Spanish', questions: spanishFoundationQuestions },
  { code: 'fr', name: 'French', questions: frenchFoundationQuestions },
  { code: 'de', name: 'German', questions: germanFoundationQuestions },
  { code: 'it', name: 'Italian', questions: italianFoundationQuestions }
];
```

### 3. Create Language Route
Create `/aqa-reading-test/italian/[tier]/page.tsx` following the existing pattern.

### 4. Update Exam Assessment Page
Add Italian section to the main assessment selection page.

## Technical Notes

- **Component Props**: `identifier` prop is already implemented
- **Database Ready**: Schema supports unlimited papers and languages
- **Service Methods**: Both single and multiple assessment queries available
- **Error Handling**: Comprehensive validation and error handling
- **Performance**: Proper indexing and efficient queries

The system is fully prepared for expansion and can easily accommodate multiple papers per tier and additional languages.
