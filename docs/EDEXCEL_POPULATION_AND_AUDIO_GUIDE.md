# Edexcel Listening Assessment Population and Audio Generation Guide

## Overview

This guide explains how to populate Edexcel listening assessments and generate audio files using Gemini TTS. The system handles crossover questions efficiently to avoid duplicate audio generation.

## 📋 Prerequisites

### Environment Setup
Ensure you have the following environment variables in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
GOOGLE_AI_API_KEY=your_gemini_api_key
```

### Database Schema
The Edexcel listening tables must be created first:
- `edexcel_listening_assessments`
- `edexcel_listening_questions`
- `edexcel_listening_results`

## 🏗️ Part 1: Populating Assessments

### Script Location
```
scripts/populate-edexcel-listening-assessments.ts
```

### Assessment Structure Created

The script creates assessments for:
- **Languages**: Spanish (es), French (fr), German (de)
- **Tiers**: Foundation (45 min, 12 questions), Higher (60 min, 10 questions)
- **Total**: 6 assessments (3 languages × 2 tiers)

### Question Types Supported
- **Multiple Choice**: 3-4 responses, 1 mark each
- **Multiple Response**: Choose 3 correct answers from 6 options
- **Word Cloud**: 3-5 gap-fill responses from word bank
- **Open Response A**: Structured speaker format with gaps
- **Open Response B**: Table format with likes/dislikes
- **Open Response C**: Free-form questions in English
- **Multi-part**: Combined question types (Q8, Q9, Q11)
- **Dictation**: 6 sentences
  - Foundation: Q4-Q6 complete sentences
  - Higher: Q1-Q2 fill-in-gap, Q3-Q6 complete sentences

### Question Distribution

#### Foundation Tier (12 questions)
- **Q1-Q6**: Foundation-only questions
  - Q1: Multiple Choice (3 marks - 3 responses)
  - Q2: Multiple Response (3 marks - choose 3 answers)
  - Q3: Word Cloud (3 marks)
  - Q4: Multiple Response (3 marks - choose 3 answers)
  - Q5: Multiple Choice (4 marks - 4 responses)
  - Q6: Open Response A (4 marks)
- **Q7-Q10**: Crossover questions (shared with Higher Q1-Q4)
  - Q7: Multiple Choice (3 marks - 3 responses) → Higher Q1
  - Q8: Word Cloud (5 marks - 5 responses) → Higher Q2
  - Q9: Multiple Response (4 marks - choose 3 answers) → Higher Q3
  - Q10: Multiple Choice (4 marks - 4 responses) → Higher Q4
- **Q11**: Foundation-only Open Response C (4 marks - parts A & B)
- **Q12**: Foundation Dictation (10 marks - sentences 4-6 complete)

#### Higher Tier (10 questions)
- **Q1-Q4**: Crossover questions (from Foundation Q7-Q10) - 15 marks
  - Q1: Multiple Choice (3 marks - 3 responses)
  - Q2: Word Cloud (5 marks - 5 responses)
  - Q3: Multiple Response (3 marks - choose 3 answers)
  - Q4: Multiple Choice (4 marks - 4 responses)
- **Q5-Q7**: Higher-only questions - 12 marks
  - Q5: Open Response A (3 marks)
  - Q6: Word Cloud (3 marks)
  - Q7: Open Response B (6 marks - table format with 3 people)
- **Q8**: Two-part Multiple Choice (6 marks total)
  - Q8(a): 3 multiple choice questions (3 marks)
  - Q8(b): 3 multiple choice questions (3 marks)
- **Q9**: Two-part question (7 marks total)
  - Q9(a): Multiple Choice (3 marks)
  - Q9(b): Open Response C (4 marks)
- **Q10**: Higher Dictation (10 marks)
  - Q1-Q2: Fill-in-the-gap (1 mark each)
  - Q3-Q6: Complete sentences (2 marks each)

### Running the Population Script

#### Basic Usage
```bash
# Navigate to project root
cd /path/to/language-gems-recovered

# Run the population script
npx tsx scripts/populate-edexcel-listening-assessments.ts
```

#### What It Does
1. **Clears existing data** from Edexcel listening tables
2. **Creates 6 assessments** (3 languages × 2 tiers)
3. **Inserts questions** with proper crossover handling
4. **Sets up question data** with proper JSONB structure
5. **Configures TTS settings** for each question

#### Expected Output
```
🎧 Starting Edexcel Listening Assessment population...

🧹 Clearing existing Edexcel listening assessment data...
✅ Cleared existing data

📚 Creating Spanish foundation listening assessment...
✅ Created Spanish foundation assessment: 896d4ca9-29fc-4139-8466-47513bb531f9
✅ Inserted 12 questions for Spanish foundation

📚 Creating Spanish higher listening assessment...
✅ Created Spanish higher assessment: 17ad99e5-8859-4795-9797-cca1e00b395d
✅ Inserted 10 questions for Spanish higher

📚 Creating French foundation listening assessment...
✅ Created French foundation assessment: 00862f91-9b4f-470e-9ee5-c13439bddd8f
✅ Inserted 12 questions for French foundation

📚 Creating French higher listening assessment...
✅ Created French higher assessment: 3baca842-e36d-40a8-9a5e-8bdc3d5d9a5d
✅ Inserted 10 questions for French higher

📚 Creating German foundation listening assessment...
✅ Created German foundation assessment: 8b6c726b-7032-42cd-bf66-d8651004b2bd
✅ Inserted 12 questions for German foundation

📚 Creating German higher listening assessment...
✅ Created German higher assessment: 712ddbf6-90e4-4112-8d97-828436406273
✅ Inserted 10 questions for German higher

🎉 Edexcel Listening Assessment population completed successfully!

📊 Summary:
- Languages: 3 (Spanish, French, German)
- Tiers: 2 (foundation, higher)
- Total assessments created: 6
- Foundation questions per assessment: 12 (50 marks total)
- Higher questions per assessment: 10 (50 marks total)
- Crossover questions: 4 (Foundation Q7-Q10 = Higher Q1-Q4)
- Total unique questions: 28
```

### ⚠️ **Current Language Content Status**
**Note**: Currently, all three languages use Spanish question content as a base template. The database structure and crossover logic are fully implemented, but French and German assessments will have Spanish audio text. This is intentional for initial testing and can be enhanced with proper translations.

## 🎵 Part 2: Generating Audio

### Script Location
```
scripts/generate-edexcel-listening-audio.ts
```

### Crossover Question Handling

The audio generation system intelligently handles crossover questions:

#### Crossover Questions (Foundation Q7-Q10 = Higher Q1-Q4)
- **Q7 (Foundation) = Q1 (Higher)**: Multiple Choice about environment
- **Q8 (Foundation) = Q2 (Higher)**: Word Cloud about Valencia
- **Q9 (Foundation) = Q3 (Higher)**: Multiple Response about school subjects
- **Q10 (Foundation) = Q4 (Higher)**: Multiple Choice about future plans

#### Audio Sharing Strategy
1. **Detects crossover questions** by comparing `audio_text` content
2. **Generates audio once** for each crossover group
3. **Applies same audio URL** to all questions in the group
4. **Avoids duplicate generation** and storage costs

### Running Audio Generation

#### Dry Run (Recommended First)
```bash
# See what would be generated without actually generating
npx tsx scripts/generate-edexcel-listening-audio.ts --dry-run

# Dry run for specific language
npx tsx scripts/generate-edexcel-listening-audio.ts --language=es --dry-run

# Dry run for specific level
npx tsx scripts/generate-edexcel-listening-audio.ts --language=es --level=foundation --dry-run
```

#### Full Generation
```bash
# Generate all audio for Spanish
npx tsx scripts/generate-edexcel-listening-audio.ts --language=es

# Generate only foundation audio
npx tsx scripts/generate-edexcel-listening-audio.ts --language=es --level=foundation

# Generate only higher audio
npx tsx scripts/generate-edexcel-listening-audio.ts --language=es --level=higher

# Generate with question limit (for testing)
npx tsx scripts/generate-edexcel-listening-audio.ts --language=es --max=5
```

#### All Languages
```bash
# Generate for all languages (run separately to manage rate limits)
npx tsx scripts/generate-edexcel-listening-audio.ts --language=es
npx tsx scripts/generate-edexcel-listening-audio.ts --language=fr  
npx tsx scripts/generate-edexcel-listening-audio.ts --language=de
```

### Audio Generation Process

#### 1. Question Analysis
```
📊 Question Analysis:
- Crossover question groups: 4
- Single questions: 20
- Total audio files to generate: 24
```

#### 2. Crossover Processing
```
🔄 Processing crossover question: "Carlos and Ana are discussing environmental issues"
   Instances: foundation Q7, higher Q1
   🎵 Generating new audio...
   🎭 Multi-speaker: true
   ✅ Updated foundation Q7
   ✅ Updated higher Q1
   🎉 Crossover group completed: [audio_url]
```

#### 3. Single Question Processing
```
🎵 Processing foundation Q1: "Maria is talking about her morning routine"
   🎭 Multi-speaker: false
   ✅ Generated and saved: [audio_url]
```

### TTS Configuration

#### Voice Selection
- **Spanish**: Aoede, Puck, Kore, Rasalgethi (rotated)
- **French**: Same voice set with French pronunciation
- **German**: Same voice set with German pronunciation

#### Multi-Speaker Questions
Questions with `tts_config.multiSpeaker: true` use:
- **2 speakers maximum** (Gemini Flash limitation)
- **Configured speaker names** and voice assignments
- **Automatic fallback** to single-speaker if >2 speakers

#### Audio Settings
- **Pace**: Slow (for language learners)
- **Style**: Natural and clear
- **Tone**: Neutral
- **Format**: WAV files uploaded to Supabase storage

### Rate Limiting

The script includes automatic rate limiting:
- **2-second delay** between questions
- **Flash model** used for better rate limits
- **Error handling** with retry logic
- **Progress tracking** with detailed logging

## 🔧 Troubleshooting

### Common Issues

#### 1. Environment Variables Missing
```
❌ Missing required environment variables
```
**Solution**: Check `.env.local` has all required variables

#### 2. Database Connection Issues
```
❌ Error fetching questions: [supabase error]
```
**Solution**: Verify Supabase URL and service role key

#### 3. Gemini API Rate Limits
```
❌ Error processing question: Rate limit exceeded
```
**Solution**: 
- Use `--max=5` to limit questions
- Increase delays between requests
- Use Flash model (default)

#### 4. Audio Upload Failures
```
❌ Error uploading to Supabase storage
```
**Solution**: Check Supabase storage bucket permissions

### Verification Steps

#### 1. Check Population Success
```sql
SELECT 
    a.language, 
    a.level, 
    COUNT(q.id) as question_count
FROM edexcel_listening_assessments a
LEFT JOIN edexcel_listening_questions q ON a.id = q.assessment_id
GROUP BY a.language, a.level
ORDER BY a.language, a.level;
```

Expected result: 6 rows with question counts (Foundation: 12, Higher: 10)

#### 2. Check Audio Generation
```sql
SELECT 
    a.language,
    a.level,
    q.question_number,
    q.title,
    CASE WHEN q.audio_url IS NOT NULL THEN 'Generated' ELSE 'Missing' END as audio_status
FROM edexcel_listening_questions q
JOIN edexcel_listening_assessments a ON q.assessment_id = a.id
WHERE a.language = 'es'
ORDER BY a.level, q.question_number;
```

#### 3. Verify Crossover Questions
```sql
-- Check that crossover questions have the same audio_url
SELECT 
    q.audio_text,
    a.level,
    q.question_number,
    q.audio_url
FROM edexcel_listening_questions q
JOIN edexcel_listening_assessments a ON q.assessment_id = a.id
WHERE a.language = 'es'
    AND q.audio_text IN (
        SELECT audio_text 
        FROM edexcel_listening_questions 
        GROUP BY audio_text 
        HAVING COUNT(*) > 1
    )
ORDER BY q.audio_text, a.level, q.question_number;
```

## 📊 Expected Results

### After Population
- **6 assessments** created
- **66 total questions** inserted (36 Foundation + 30 Higher)
- **28 unique questions** (accounting for crossovers)

### After Audio Generation
- **24 audio files** generated per language
- **4 crossover audio files** shared between tiers
- **20 unique audio files** for tier-specific questions
- **All questions** have `audio_url` populated

## 🌍 Enhancing Language Support

### Current State
- ✅ **Database structure**: Complete for all 3 languages
- ✅ **Crossover logic**: Properly implemented
- ⚠️ **Content**: French and German use Spanish text (needs translation)

### Adding Proper French and German Content

#### Option 1: Manual Translation (Recommended)
1. **Edit the populate script** (`scripts/populate-edexcel-listening-assessments.ts`)
2. **Expand the `spanishQuestions` object** to include `frenchQuestions` and `germanQuestions`
3. **Translate audio_text fields** for each question
4. **Update the population logic** to use language-specific questions

#### Option 2: Automated Translation
1. **Add translation service** (Google Translate API, DeepL, etc.)
2. **Create translation function** in the populate script
3. **Automatically translate** Spanish content to French and German
4. **Review and refine** automated translations

### Example Translation Structure
```typescript
const languageQuestions = {
  es: { /* Spanish questions */ },
  fr: { /* French questions */ },
  de: { /* German questions */ }
};

// Then use: languageQuestions[lang.code]
```

## 🚀 Next Steps

1. **✅ Run population script** - COMPLETED
2. **Generate audio** starting with Spanish
3. **Test assessments** in the application
4. **Add proper French/German translations** (optional)
5. **Monitor storage usage** in Supabase
6. **Add more paper variants** (paper-2, paper-3, etc.)

## 📝 Notes

- **Crossover questions save storage** by reusing audio files
- **Rate limiting prevents** API quota exhaustion  
- **Dry run mode** helps plan generation without costs
- **Error handling** ensures partial failures don't stop entire process
- **Detailed logging** helps track progress and debug issues
