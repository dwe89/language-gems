# Grammar Worksheet Debugging Plan

## Issues Found

1. **Vocabulary in Grammar Prompts**: Grammar worksheet generation is incorrectly fetching vocabulary words from the database
2. **Missing Exercises in PDF**: Generated grammar worksheets appear empty in PDF despite API returning valid JSON with exercises
3. **UI Issues**: 
   - Subject dropdown shows blank instead of "Select a language"
   - Grammar Level field exists but variable `level` is undefined (causing runtime error)
   - Worksheet Details and Grammar Topics should be merged into one card

## Changes Made

### 1. Fixed Vocabulary Fetching (`templateHandler.ts`)
- Added check to skip vocabulary fetching for `grammar_exercises` template
- Grammar worksheets should use grammar-focused prompts, not vocabulary lists

### 2. Added Comprehensive Logging
- **HTML Generator** (`grammar-exercises.ts`): Logs worksheet data structure, content extraction, exercises array
- **Save Route** (`generate/route.ts`): Logs rawContent being saved to database
- **HTML Route** (`generate-html/route.ts`): Logs content structure when reading from database

### 3. Fixed UI Issues (`grammar-exercises/page.tsx`)
- Set default `subject` to `'spanish'` instead of empty string
- Added `placeholder="Select a language"` to Subject dropdown
- Removed Grammar Level field entirely (user doesn't need it)
- Merged "Worksheet Details" and "Grammar Topics" into single "Worksheet Configuration" card

## Next Steps

1. Generate a test worksheet via dev server
2. Check terminal logs for:
   - Whether vocabulary is still being fetched (should NOT be)
   - What `rawContent` structure is being saved
   - What structure is being read when generating HTML
   - Whether exercises array is present and populated
3. If exercises are in rawContent but not rendering, check HTML generator logic
4. If exercises aren't in database, check templateHandler conversion logic

## Expected Log Flow

```
[TemplateHandler] Template ID: grammar_exercises
[TemplateHandler] Checking if Languages is a language subject: true
[TemplateHandler] Skipping vocabulary fetch for grammar_exercises ✓

[Database] Including rawContent for grammar_exercises template
[Database] rawContent keys: ['title', 'instructions', 'grammar_topic', 'explanation', 'examples', 'exercises', 'answerKey']
[Database] rawContent.exercises length: 4
[Database] First exercise: {...conjugation exercise...}

[HTML API] Using grammar exercises HTML generator
[HTML API] worksheet.content.rawContent.exercises: true, 4
[GRAMMAR GENERATOR] Final exercises array length: 4
[GRAMMAR GENERATOR] First exercise: {...conjugation exercise...}
```
