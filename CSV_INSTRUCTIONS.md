# Spanish Grammar Content CSV Instructions

## Overview
This CSV file contains all Spanish grammar topics that need practice and quiz content. You need to fill out **30 practice exercises** and **20 quiz questions** for each topic.

## CSV Structure

### Columns Explained:
- **topic_id**: Don't change this - it's the database ID
- **slug**: Don't change this - it's the URL identifier  
- **title**: Don't change this - it's the topic name
- **category**: Don't change this - it's the grammar category
- **practice_status/quiz_status**: Don't change this - shows what's missing
- **content_type**: Either "practice" or "quiz"
- **exercise_type**: Type of exercise (see types below)
- **exercise_instructions**: Instructions for the student
- **prompt_sentence**: The exercise sentence (for practice only)
- **prompt_answer**: The correct answer (for practice only)
- **prompt_explanation**: Why this answer is correct (for practice only)
- **prompt_options**: Multiple choice options separated by | (for practice only)
- **question_text**: The quiz question (for quiz only)
- **question_correct_answer**: The correct answer (for quiz only)
- **question_options**: Multiple choice options separated by | (for quiz only)
- **question_explanation**: Why this answer is correct (for quiz only)
- **question_difficulty**: beginner, intermediate, or advanced (for quiz only)

## Exercise Types for Practice:
1. **fill_blank**: Fill in the blank exercises
2. **multiple_choice**: Choose from 4 options
3. **conjugation**: Verb conjugation exercises
4. **transformation**: Transform one form to another
5. **substitution**: Replace words with pronouns/other forms
6. **translation**: Translate sentences

## Content Requirements:

### For Practice Content (30 exercises per topic):
- Create 30 rows with content_type = "practice"
- Mix different exercise types (don't use just one type)
- Use authentic Spanish examples
- Provide clear explanations
- For multiple choice, separate options with | (pipe symbol)

### For Quiz Content (20 questions per topic):
- Create 20 rows with content_type = "quiz"
- All quiz questions are multiple choice
- Mix difficulty levels: 30% beginner, 50% intermediate, 20% advanced
- Separate options with | (pipe symbol)
- Provide clear explanations

## Example Rows:

### Practice Example:
```csv
topic_id,slug,title,category,practice_status,quiz_status,content_type,exercise_type,exercise_instructions,prompt_sentence,prompt_answer,prompt_explanation,prompt_options,question_text,question_correct_answer,question_options,question_explanation,question_difficulty
5ba47579-a2c9-4b04-b021-3e2fc2f0b145,adjective-agreement,Adjective Agreement,adjectives,MISSING,MISSING,practice,fill_blank,Make the adjectives agree with the nouns,La casa _____ (blanco),blanca,Feminine singular: blanco → blanca,,,,,,
```

### Quiz Example:
```csv
topic_id,slug,title,category,practice_status,quiz_status,content_type,exercise_type,exercise_instructions,prompt_sentence,prompt_answer,prompt_explanation,prompt_options,question_text,question_correct_answer,question_options,question_explanation,question_difficulty
5ba47579-a2c9-4b04-b021-3e2fc2f0b145,adjective-agreement,Adjective Agreement,adjectives,MISSING,MISSING,quiz,,,,,,,How should "rojo" agree with "casas"?,rojas,rojo|roja|rojos|rojas,Casas is feminine plural so the adjective becomes "rojas",beginner
```

## Topics That Need Content:

### Missing Practice AND Quiz (16 topics):
1. **adjective-agreement** - Adjective Agreement
2. **adjective-position** - Adjective Position  
3. **definite** - Definite Articles (nouns)
4. **gender-plurals** - Gender and Plurals
5. **plural-formation** - Plural Formation
6. **por-para** - Por vs Para (prepositions)
7. **object-pronouns** - Object Pronouns
8. **possessive-pronouns** - Possessive Pronouns
9. **reflexive-pronouns** - Reflexive Pronouns
10. **questions** - Forming Questions
11. **word-order** - Word Order
12. **present-irregular** - Present Tense - Irregular Verbs
13. **present-regular** - Present Tense - Regular Verbs
14. **preterite-tense** - Preterite Tense
15. **ser-estar** - Ser vs Estar
16. **subjunctive-mood** - Subjunctive Mood

### Missing Practice Only (4 topics):
1. **adjective-adverb** - Adjective Adverb (word-formation)
2. **adjective-noun** - Adjective Noun (word-formation)
3. **augmentative-suffixes** - Augmentative Suffixes
4. **diminutive-suffixes** - Diminutive Suffixes

## How to Fill Out:

1. **Open the CSV file** in Excel, Google Sheets, or any spreadsheet program
2. **For each topic**, create the required number of rows:
   - 30 rows for practice content
   - 20 rows for quiz content (if missing)
3. **Copy the topic information** (topic_id, slug, title, category, etc.) to each row
4. **Fill in the content columns** with authentic Spanish grammar exercises
5. **Save as CSV** when complete

## Quality Guidelines:

- **Use real Spanish**: No placeholder text like "This demonstrates..."
- **Vary difficulty**: Mix easy and challenging exercises
- **Authentic examples**: Use natural Spanish sentences
- **Clear explanations**: Explain why answers are correct
- **Proper grammar**: Double-check all Spanish content
- **Logical progression**: Start with easier concepts, build complexity

## Import Process:
Once you complete the CSV, I'll create an import script to load all the content into the database automatically.

## Need Help?
If you have questions about specific grammar topics or need examples, let me know and I can provide more detailed guidance for particular areas.
