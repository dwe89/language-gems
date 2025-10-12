# Teacher Dashboard Specification - Actionable Insights

## 🎯 Core Philosophy

**Teachers don't want raw data - they want actionable insights that inform instruction and intervention.**

### Key Questions Teachers Need Answered:
1. **Who needs help?** (Intervention Flag)
2. **What specifically is causing the trouble?** (Word Difficulty Ranking)
3. **Are my students doing the work?** (Completion Rate)
4. **Did the assignment land?** (Class Success Score)

---

## 📊 Dashboard Structure

### Tab 1: **Assignment Overview** (Default View)

**Purpose:** Quick pulse check on class engagement and overall success

#### Key Metrics (Top Cards):

| Metric | Calculation | Why Teachers Care |
|--------|-------------|-------------------|
| **Completion Rate** | `(students_completed / total_students) × 100%` | Are my students doing the work? |
| **Average Time Spent** | `AVG(session_duration)` vs expected time | Was this too easy or too hard? |
| **Class Success Score** | `(strong_retrieval + weak_retrieval) / total_attempts × 100%` | Did the assignment land? |
| **Students Needing Help** | Count of students with intervention flags | Who is stuck right now? |

#### Completion Status Table:

| Student | Status | Time Spent | Success Score | Flag |
|---------|--------|------------|---------------|------|
| C. Kim | ✅ Complete | 20m | 98% | - |
| D. Garcia | ⚠️ In Progress | 55m | 65% | 🚨 High failure rate |
| E. Chen | ❌ Not Started | - | - | - |

**Intervention Flags:**
- 🚨 **High Failure Rate** (>30% incorrect)
- ⏰ **Unusually Long Time** (>2× expected)
- 🛑 **Stopped Mid-Way** (started but not completed)

**Export to Sheets** button

---

### Tab 2: **Word Mastery** (The Core Insight)

**Purpose:** See curriculum gaps, not just student grades

#### A. Vocabulary Difficulty Ranking (Class Aggregate)

Ranks all words in the assignment from easiest to hardest based on class performance.

| Rank | Word | Translation | Failure Rate | Strong Retrieval | Weak Retrieval | Actionable Insight |
|------|------|-------------|--------------|------------------|----------------|-------------------|
| 1 | madre | mother | 4% | 430 | 45 | ✅ No issue. Move on. |
| 5 | primo/a | cousin | 12% | 350 | 80 | 📚 Moderate difficulty. Quick review. |
| 10 | suegros | in-laws | 32% | 110 | 180 | 🛑 Major Class Problem. Requires full lesson. |
| 12 | presentar | to introduce | 38% | 95 | 200 | 🛑 Major Class Problem. Note: VERB form struggling. |

**Calculations:**
- **Failure Rate** = `incorrect_count / (correct_count + incorrect_count) × 100%`
- **Strong Retrieval** = Count of `rare`, `epic`, `legendary` gems (FSRS: high stability, low difficulty)
- **Weak Retrieval** = Count of `uncommon`, `common` gems (FSRS: low stability, moderate difficulty)

**Color Coding:**
- 🟢 Green (0-15% failure): No issue
- 🟡 Yellow (15-25% failure): Monitor
- 🟠 Orange (25-35% failure): Review needed
- 🔴 Red (>35% failure): Major problem

**Export to Sheets** button

#### B. Student Word Struggles (Drill-Down)

Click on a struggling word (e.g., "suegros") to see which students contributed to its high failure rate.

| Student | Exposures | Correct | Incorrect | Failure Rate | Last Attempt | Recommended Intervention |
|---------|-----------|---------|-----------|--------------|--------------|-------------------------|
| A. Patel | 15 | 3 | 12 | 80% | 2 hours ago | Small group work on compound nouns |
| B. Singh | 10 | 3 | 7 | 70% | 1 day ago | Individual re-assignment of "suegros" only |
| C. Kim | 8 | 7 | 1 | 13% | 3 hours ago | No intervention needed |

**Export to Sheets** button

---

### Tab 3: **Student Roster** (Individual Focus)

**Purpose:** Focus on a single student for conferencing or grading

| Student | Progress | Time | Success Score | Weak Retrieval % | Failure Rate | Key Struggle Words |
|---------|----------|------|---------------|------------------|--------------|-------------------|
| C. Kim | 100% | 20m | 98% | 10% | 2% | None |
| D. Garcia | 65% | 55m | 65% | 25% | 35% | suegros, presentar, sobrina |
| E. Chen | 90% | 30m | 88% | 50% | 10% | madre (low confidence), primo |

**Calculations:**
- **Progress %** = `(words_attempted / total_words) × 100%`
- **Success Score** = `(strong_retrieval + weak_retrieval) / total_attempts × 100%`
- **Weak Retrieval %** = `weak_retrieval / total_attempts × 100%`
- **Failure Rate** = `incorrect / total_attempts × 100%`

**Click to Expand Student:**
- Detailed word-by-word breakdown
- FSRS progression chart (new → common → uncommon → rare → epic → legendary)
- Recent activity timeline
- Recommended interventions

**Export to Sheets** button

---

## 🔧 Technical Implementation

### Data Sources:

1. **`gem_events` table** - For FSRS gem distribution
2. **`assignment_vocabulary_progress` table** - For word-level tracking
3. **`enhanced_game_sessions` table** - For time spent and completion status
4. **`enhanced_assignment_progress` table** - For overall assignment progress

### Key SQL Queries:

#### 1. Assignment Overview Metrics:

```sql
-- Completion Rate
SELECT 
  COUNT(DISTINCT CASE WHEN status = 'completed' THEN student_id END) as completed,
  COUNT(DISTINCT student_id) as total,
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN status = 'completed' THEN student_id END) / COUNT(DISTINCT student_id), 1) as completion_rate
FROM enhanced_assignment_progress
WHERE assignment_id = ?;

-- Average Time Spent
SELECT 
  AVG(total_time_spent_seconds) / 60 as avg_minutes
FROM enhanced_assignment_progress
WHERE assignment_id = ? AND status = 'completed';

-- Class Success Score (Strong + Weak Retrieval / Total Attempts)
SELECT 
  ROUND(100.0 * 
    SUM(CASE WHEN gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) / 
    COUNT(*), 1) as success_score
FROM gem_events ge
JOIN enhanced_game_sessions egs ON ge.session_id = egs.id
WHERE egs.assignment_id = ?;
```

#### 2. Word Difficulty Ranking:

```sql
SELECT 
  cv.word_text,
  cv.translation_text,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) as failures,
  SUM(CASE WHEN ge.gem_rarity IN ('rare', 'epic', 'legendary') THEN 1 ELSE 0 END) as strong_retrieval,
  SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'common') THEN 1 ELSE 0 END) as weak_retrieval,
  ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate,
  CASE 
    WHEN ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) > 35 THEN '🛑 Major Class Problem. Requires full lesson.'
    WHEN ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) > 25 THEN '⚠️ Review needed. Plan intervention.'
    WHEN ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) > 15 THEN '📚 Moderate difficulty. Quick review.'
    ELSE '✅ No issue. Move on.'
  END as actionable_insight
FROM gem_events ge
JOIN centralized_vocabulary cv ON cv.id = ge.centralized_vocabulary_id
JOIN enhanced_game_sessions egs ON ge.session_id = egs.id
WHERE egs.assignment_id = ?
GROUP BY cv.id, cv.word_text, cv.translation_text
ORDER BY failure_rate DESC;
```

#### 3. Student Word Struggles (Drill-Down):

```sql
SELECT 
  up.display_name as student_name,
  COUNT(*) as exposures,
  SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) as correct,
  SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) as incorrect,
  ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate,
  MAX(ge.created_at) as last_attempt,
  CASE 
    WHEN ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) > 60 THEN 'Individual re-assignment of this word only'
    WHEN ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) > 40 THEN 'Small group work on this concept'
    ELSE 'Monitor progress'
  END as recommended_intervention
FROM gem_events ge
JOIN user_profiles up ON up.user_id = ge.student_id
JOIN enhanced_game_sessions egs ON ge.session_id = egs.id
WHERE egs.assignment_id = ? 
  AND ge.centralized_vocabulary_id = ?
GROUP BY ge.student_id, up.display_name
ORDER BY failure_rate DESC;
```

#### 4. Student Roster:

```sql
SELECT 
  up.display_name as student_name,
  eap.progress_percentage,
  eap.total_time_spent_seconds / 60 as time_minutes,
  ROUND(100.0 * 
    SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) / 
    COUNT(*), 1) as success_score,
  ROUND(100.0 * 
    SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'common') THEN 1 ELSE 0 END) / 
    COUNT(*), 1) as weak_retrieval_pct,
  ROUND(100.0 * 
    SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / 
    COUNT(*), 1) as failure_rate,
  STRING_AGG(
    DISTINCT CASE 
      WHEN avp.incorrect_count > avp.correct_count THEN cv.word_text 
    END, ', '
  ) as key_struggle_words
FROM enhanced_assignment_progress eap
JOIN user_profiles up ON up.user_id = eap.student_id
LEFT JOIN gem_events ge ON ge.student_id = eap.student_id
LEFT JOIN enhanced_game_sessions egs ON egs.id = ge.session_id AND egs.assignment_id = eap.assignment_id
LEFT JOIN assignment_vocabulary_progress avp ON avp.student_id = eap.student_id AND avp.assignment_id = eap.assignment_id
LEFT JOIN centralized_vocabulary cv ON cv.id = avp.vocab_id
WHERE eap.assignment_id = ?
GROUP BY eap.student_id, up.display_name, eap.progress_percentage, eap.total_time_spent_seconds
ORDER BY failure_rate DESC;
```

---

## 🎨 UI/UX Design

### Color Coding:
- 🟢 **Green** (0-15% failure): No intervention needed
- 🟡 **Yellow** (15-25% failure): Monitor
- 🟠 **Orange** (25-35% failure): Review needed
- 🔴 **Red** (>35% failure): Immediate intervention required

### Icons:
- ✅ Complete
- ⚠️ In Progress
- ❌ Not Started
- 🚨 High Failure Rate
- ⏰ Unusually Long Time
- 🛑 Stopped Mid-Way
- 📚 Review Needed
- 🎯 Target Word

### Export Functionality:
Every table has an "Export to Sheets" button that exports to CSV/Excel format for teacher record-keeping.

---

## 📋 Implementation Checklist

- [ ] Create `TeacherAssignmentAnalyticsService.ts`
- [ ] Build Assignment Overview tab with 4 key metrics
- [ ] Build Word Mastery tab with difficulty ranking
- [ ] Build Student Word Struggles drill-down
- [ ] Build Student Roster tab
- [ ] Add intervention flag logic
- [ ] Add color coding based on failure rates
- [ ] Add export to CSV functionality
- [ ] Remove "Trends" tab
- [ ] Test with real assignment data

---

## 🎯 Success Metrics

### Before:
- Shows "0 mastered" for active students
- Focused on FSRS mastery (too hard to achieve)
- No actionable insights
- Teachers confused about what to do

### After:
- Shows failure rates and struggle words
- Focused on intervention and instruction
- Clear actionable insights ("Requires full lesson")
- Teachers know exactly who needs help and why

---

**Ready to build this?**

