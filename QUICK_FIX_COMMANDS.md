# Quick Fix: Update Dashboard to Show Proficiency Levels

## Problem
Dashboard shows "0.0/5 mastery" for words with 100% accuracy because FSRS mastery requires multiple spaced reviews over time.

## Solution
Use simple Proficiency Levels: 🔴 Struggling, 🟡 Learning, 🟢 Proficient

## Quick Fix (Manual SQL Query)

Since the file editing isn't working, here's a **temporary workaround** to see the correct data immediately:

### Create a Database View

Run this SQL in Supabase SQL Editor:

```sql
CREATE OR REPLACE VIEW teacher_vocabulary_proficiency AS
WITH word_stats AS (
  SELECT 
    cv.id as vocabulary_id,
    cv.word,
    cv.translation,
    cv.category,
    cv.subcategory,
    cv.language,
    SUM(vgc.total_encounters) as total_encounters,
    SUM(vgc.correct_encounters) as correct_encounters,
    ROUND((SUM(vgc.correct_encounters)::numeric / NULLIF(SUM(vgc.total_encounters), 0)) * 100, 1) as accuracy,
    COUNT(DISTINCT vgc.student_id) as total_students
  FROM vocabulary_gem_collection vgc
  JOIN centralized_vocabulary cv ON cv.id = vgc.centralized_vocabulary_id
  GROUP BY cv.id, cv.word, cv.translation, cv.category, cv.subcategory, cv.language
  HAVING SUM(vgc.total_encounters) > 0
),
student_proficiency AS (
  SELECT 
    vgc.centralized_vocabulary_id as vocabulary_id,
    vgc.student_id,
    vgc.total_encounters,
    vgc.correct_encounters,
    ROUND((vgc.correct_encounters::numeric / NULLIF(vgc.total_encounters, 0)) * 100, 1) as accuracy,
    CASE 
      WHEN (vgc.correct_encounters::numeric / NULLIF(vgc.total_encounters, 0)) * 100 < 60 
           OR vgc.total_encounters < 3 THEN 'struggling'
      WHEN (vgc.correct_encounters::numeric / NULLIF(vgc.total_encounters, 0)) * 100 >= 90 
           AND vgc.total_encounters >= 5 THEN 'proficient'
      ELSE 'learning'
    END as proficiency_level
  FROM vocabulary_gem_collection vgc
)
SELECT 
  ws.vocabulary_id,
  ws.word,
  ws.translation,
  ws.category,
  ws.subcategory,
  ws.language,
  ws.total_encounters,
  ws.correct_encounters,
  ws.accuracy,
  CASE 
    WHEN ws.accuracy < 60 OR ws.total_encounters < 3 THEN 'struggling'
    WHEN ws.accuracy >= 90 AND ws.total_encounters >= 5 THEN 'proficient'
    ELSE 'learning'
  END as proficiency_level,
  ws.total_students,
  COUNT(CASE WHEN sp.proficiency_level = 'struggling' THEN 1 END) as students_struggling,
  COUNT(CASE WHEN sp.proficiency_level = 'learning' THEN 1 END) as students_learning,
  COUNT(CASE WHEN sp.proficiency_level = 'proficient' THEN 1 END) as students_proficient
FROM word_stats ws
LEFT JOIN student_proficiency sp ON sp.vocabulary_id = ws.vocabulary_id
GROUP BY 
  ws.vocabulary_id, ws.word, ws.translation, ws.category, ws.subcategory, 
  ws.language, ws.total_encounters, ws.correct_encounters, ws.accuracy;
```

### Query the View

Now you can query this view to see the correct proficiency data:

```sql
-- Most Challenging Words (Struggling)
SELECT word, translation, accuracy, proficiency_level, students_struggling
FROM teacher_vocabulary_proficiency
WHERE proficiency_level = 'struggling'
ORDER BY accuracy ASC, total_encounters DESC
LIMIT 20;

-- Proficient Words
SELECT word, translation, accuracy, proficiency_level, students_proficient
FROM teacher_vocabulary_proficiency
WHERE proficiency_level = 'proficient'
ORDER BY total_encounters DESC, accuracy DESC
LIMIT 20;

-- Summary Stats
SELECT 
  proficiency_level,
  COUNT(*) as word_count,
  ROUND(AVG(accuracy), 1) as avg_accuracy,
  SUM(total_encounters) as total_encounters
FROM teacher_vocabulary_proficiency
GROUP BY proficiency_level
ORDER BY 
  CASE proficiency_level
    WHEN 'struggling' THEN 1
    WHEN 'learning' THEN 2
    WHEN 'proficient' THEN 3
  END;
```

## Next Steps

1. Create the view above in Supabase
2. Update the API route to query this view instead of calculating in TypeScript
3. Update the dashboard component to display proficiency levels

This will give you immediate results while we work on the full TypeScript migration.

