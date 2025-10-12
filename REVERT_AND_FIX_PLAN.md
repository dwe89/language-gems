# IMMEDIATE FIX PLAN

## Problem
The teacher dashboard is completely broken and showing all zeros despite having real data in the database.

## Root Cause
The service is querying the wrong tables/columns and the component isn't even loading.

## PROVEN DATA (from SQL queries)
For assignment `4d13f075-6d69-40e7-a8a9-9c653a292f70`:

1. **460 game sessions** from 28 students
2. **392 gem events** from 20 students
3. **Success score: 24%** (94 strong/weak gems out of 392 total)
4. **Students needing help: 4+** (with >30% failure rate)
5. **Word data EXISTS** with failure rates

## IMMEDIATE ACTION
Instead of fixing the broken service, create a MINIMAL API endpoint that uses RAW SQL queries that we KNOW work.

### Step 1: Create API endpoint `/api/teacher-analytics/assignment-simple`
```typescript
// Uses ONLY raw SQL queries
// Returns: overview, words, students
```

### Step 2: Update dashboard to call this endpoint
```typescript
// Replace TeacherAssignmentAnalyticsService
// with simple fetch() call
```

### Step 3: Test with known assignment ID
`4d13f075-6d69-40e7-a8a9-9c653a292f70`

## SQL Queries That WORK

### Overview Metrics:
```sql
SELECT 
  COUNT(DISTINCT egs.student_id) as students_with_activity,
  COUNT(*) as total_gems,
  ROUND(100.0 * SUM(CASE WHEN gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) / COUNT(*), 1) as success_score
FROM gem_events ge
JOIN enhanced_game_sessions egs ON ge.session_id = egs.id
WHERE egs.assignment_id = ?
```

### Word Difficulty:
```sql
SELECT 
  word_text,
  translation_text,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN gem_rarity = 'common' THEN 1 ELSE 0 END) as failures,
  ROUND(100.0 * SUM(CASE WHEN gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate
FROM gem_events ge
WHERE session_id IN (SELECT id FROM enhanced_game_sessions WHERE assignment_id = ?)
GROUP BY word_text, translation_text
ORDER BY failure_rate DESC
```

### Student Progress:
```sql
SELECT 
  ge.student_id,
  up.display_name,
  COUNT(*) as total_gems,
  ROUND(100.0 * SUM(CASE WHEN gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) / COUNT(*), 1) as success_score,
  ROUND(100.0 * SUM(CASE WHEN gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate
FROM gem_events ge
JOIN user_profiles up ON ge.student_id = up.user_id
WHERE session_id IN (SELECT id FROM enhanced_game_sessions WHERE assignment_id = ?)
GROUP BY ge.student_id, up.display_name
ORDER BY failure_rate DESC
```

## THIS WILL WORK
Because we're using SQL queries that we've already tested and verified return correct data.

