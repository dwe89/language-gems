# Grammar Practice Content Generation

## Overview

This script generates high-quality practice content for Spanish grammar topics using GPT-4o-mini. It replaces old placeholder content (with `exercises` format) with new content (with `questions` format) matching the quality of the adjective-agreement example.

## Status

- **Total topics needing updates**: 105
- **Format**: Multiple-choice questions with 4 options each
- **Questions per topic**: 30 (10 beginner, 10 intermediate, 10 intermediate/advanced)
- **Quality**: Based on adjective-agreement template
- **Practice modes**: Quick (10 questions), Standard (15 questions), Full (30 questions)

## Usage

### Basic Usage (Process all topics)

```bash
npx tsx scripts/generate-practice-content.ts
```

### Process Limited Number of Topics

```bash
# Process only first 10 topics
npx tsx scripts/generate-practice-content.ts --limit 10
```

### Continue from Specific Index

```bash
# Continue from topic index 25
npx tsx scripts/generate-practice-content.ts --continue 25
```

### Dry Run (Test without updating database)

```bash
npx tsx scripts/generate-practice-content.ts --dry-run --limit 5
```

### Combine Options

```bash
# Process 20 topics starting from index 50
npx tsx scripts/generate-practice-content.ts --continue 50 --limit 20
```

## Features

### ✅ Automatic Retry Logic
- Retries up to 3 times on failure
- Exponential backoff (2s, 4s, 6s)
- Helpful error messages

### ✅ Validation & Auto-Fix
- Validates all questions have required fields
- Trims whitespace from options and answers
- Auto-fixes case mismatches
- Falls back to first option if correct_answer is invalid
- **Detects duplicate options** and triggers retry
- **Enforces difficulty progression** based on question index

### ✅ Anti-Repetition Strategy
- Uses **presence_penalty** (0.6-1.5) to discourage repeated tokens
- Uses **frequency_penalty** (0.6-1.5) to punish common tokens
- **Escalating penalties** on retries (increases by 0.3 per retry)
- Enhanced prompt with explicit anti-duplication instructions
- Validates all 4 options are unique before accepting

### ✅ Progress Tracking
- Shows current progress: `[5/105]`
- Shows overall index when using `--continue`
- Displays success/error counts
- Suggests continue command if interrupted

### ✅ Rate Limiting
- 2-second delay between API calls
- Prevents hitting OpenAI rate limits

## Output Format

Each topic gets 30 practice questions in this format:

```json
{
  "id": "formation_p1",
  "type": "multiple_choice",
  "question": "Choose the correct form: El libro _____ (interesante)",
  "options": ["interesante", "interesantes", "interesanto", "interesanta"],
  "correct_answer": "interesante",
  "explanation": "Adjectives ending in -e don't change for gender. Libro is singular, so 'interesante'.",
  "difficulty": "beginner"
}
```

## Quality Standards

The AI is instructed to:

1. ✅ Create SPECIFIC questions with real Spanish sentences
2. ✅ Include clear explanations teaching the grammar rule
3. ✅ Progress from beginner (Q1-10) to intermediate (Q11-20) to advanced (Q21-30)
4. ✅ Use practical, realistic examples with varied vocabulary
5. ✅ Ensure correct_answer EXACTLY matches one option
6. ✅ Include proper Spanish accents

## Difficulty Distribution

- **Questions 1-10**: Beginner (simple, basic concepts)
- **Questions 11-20**: Intermediate (more complex)
- **Questions 21-30**: Intermediate/Advanced (challenging)

This allows for three practice modes:
- **Quick Practice**: Questions 1-10 (beginner only)
- **Standard Practice**: Questions 1-15 (beginner + some intermediate)
- **Full Mastery**: Questions 1-30 (all difficulty levels)

## Topics Being Updated

Categories with old practice format:
- **Verbs**: 50+ topics (auxiliary, conditional, future, imperfect, etc.)
- **Pronouns**: 11 topics (direct object, indirect object, reflexive, etc.)
- **Nouns**: 8 topics (gender, plurals, articles, etc.)
- **Adverbs**: 1 topic (formation)
- **Adverbial-Prepositional**: 2 topics (personal-a, por-vs-para)
- **Prepositions**: 2 topics (basic, por-para)
- **Articles**: 2 topics (definite, definite-indefinite)
- **Sounds-Spelling**: 3 topics (sound-symbol, stress-patterns, written-accents)
- **Syntax**: 2 topics (questions, word-order)
- **Word Formation**: Multiple topics

## Monitoring Progress

The script outputs:
- 🤖 When generating content for each topic
- ✅ When successfully completed
- ❌ When errors occur
- 🔄 When retrying
- ⚠️  When auto-fixing validation issues

## Example Output

```
🚀 Starting practice content generation...

📊 Found 105 topics needing practice content updates

🤖 Generating practice content for: formation (adverbs)
✅ Generated 15 practice questions
✅ Updated practice content in database
✅ [1/105] Completed: formation

🤖 Generating practice content for: personal_a (adverbial-prepositional)
⚠️  Question 3: Fixed case mismatch - "A" → "a"
✅ Generated 15 practice questions
✅ Updated practice content in database
✅ [2/105] Completed: personal_a

...

🎉 Practice content generation complete!
✅ Success: 100
❌ Errors: 5
📊 Total processed: 105/105
```

## Troubleshooting

### If the script fails partway through:

The script will show you how to continue:

```
💡 To continue from where you left off, run:
   npx tsx scripts/generate-practice-content.ts --continue 47
```

### If you get rate limit errors:

Increase the delay between API calls in the script (currently 2 seconds).

### If questions have validation errors:

The script now auto-fixes most issues:
- Trims whitespace
- Fixes case mismatches
- Uses fallback for invalid correct_answers

## Cost Estimate

- **Model**: gpt-4.1-nano
- **Tokens per topic**: ~2,000-3,000
- **Total topics**: 105
- **Estimated cost**: ~$0.50-$1.00 total

## Next Steps

After running the script:

1. ✅ Test a few practice pages to verify quality
2. ✅ Check the browser console for any errors
3. ✅ Verify Challenge buttons now appear on all pages
4. ✅ Test the practice mode gameplay

## Files Modified

- `scripts/generate-practice-content.ts` - Main generation script
- Database: `grammar_content` table - Updates `content_data` field for practice content

