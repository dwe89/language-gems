# Teacher Dashboard Redesign Plan

## 🎯 Problem Statement

The current dashboard is focused on **mastery** (FSRS spaced repetition metrics) but teachers need to see **exposure and activity** metrics instead.

### Current Issues:
- ❌ Shows "0 mastered" even when students have practiced
- ❌ Focused on "strong words" which are very difficult to achieve
- ❌ "Trends" tab not useful
- ❌ Queries `vocabulary_gem_collection` (FSRS table) instead of `gem_events` (actual activity)
- ❌ Doesn't show gem distribution (new, common, uncommon, rare, epic, legendary)

### What Teachers Actually Want:
- ✅ **Word Exposures** - How many times have students seen each word?
- ✅ **Gem Distribution** - How many new/common/uncommon/rare/epic/legendary gems?
- ✅ **Recent Activity** - What are students doing right now?
- ✅ **Struggling Words** - Which words are students getting wrong repeatedly?
- ✅ **Class Progress** - Overall class activity and engagement
- ✅ **Student Comparison** - Who's active vs. inactive?

---

## 📊 Available Data (What We Actually Have)

### From `gem_events` table (2,337 records):
- **303 new_discovery** gems (first time seeing word)
- **1,209 common** gems (incorrect/slow answers)
- **181 uncommon** gems (correct answers)
- **643 rare** gems (fast correct answers)
- **1 legendary** gem (perfect performance)

### From `assignment_vocabulary_progress` (562 records):
- Word-level tracking per student per assignment
- `seen_count`, `correct_count`, `incorrect_count`
- `last_seen_at` timestamps

### From `enhanced_game_sessions` (62,500 records):
- Game activity per student
- Session duration, completion status
- Gems earned per session

---

## 🎨 New Dashboard Design

### Tab 1: **Overview** (Default)

**Key Metrics Cards:**
1. **Total Word Exposures** - 2,337 (not "words mastered")
2. **Unique Words Practiced** - 351 words
3. **Active Students** - 80 students (with activity in date range)
4. **Total Game Sessions** - 62,500

**Gem Distribution Chart:**
```
New Discovery:  303  (13%)  🔵
Common:       1,209  (52%)  ⚪
Uncommon:       181  (8%)   🟢
Rare:           643  (27%)  🔷
Epic/Legendary:   1  (0%)   💎
```

**Recent Activity Feed:**
- Last 10 game sessions
- Student name, game type, words practiced, gems earned
- Timestamp

**Class Engagement:**
- Students by activity level (high/medium/low/inactive)
- Average exposures per student
- Most active students this week

---

### Tab 2: **Students** (Individual Progress)

**Student List with Sortable Columns:**
| Student | Exposures | New Words | Correct | Incorrect | Accuracy | Last Active |
|---------|-----------|-----------|---------|-----------|----------|-------------|
| Felicia Black | 45 | 12 | 30 | 15 | 67% | 2 hours ago |
| Adela Baran | 38 | 10 | 25 | 13 | 66% | 1 day ago |
| ... | ... | ... | ... | ... | ... | ... |

**Click to Expand Student:**
- Gem distribution for this student
- Words they've seen (with exposure counts)
- Words they're struggling with (low accuracy, high exposures)
- Recent activity timeline

---

### Tab 3: **Words** (Vocabulary Analysis)

**Word List with Sortable Columns:**
| Word | Translation | Exposures | Students | Correct | Incorrect | Accuracy |
|------|-------------|-----------|----------|---------|-----------|----------|
| delgada | thin (f) | 45 | 12 | 20 | 25 | 44% |
| tímido | shy | 38 | 10 | 25 | 13 | 66% |
| ... | ... | ... | ... | ... | ... | ... |

**Filters:**
- By category/topic
- By accuracy (struggling words < 50%)
- By exposure count (most/least practiced)

**Click to Expand Word:**
- Which students have seen it
- Individual student performance on this word
- Common error patterns

---

### Tab 4: **Topics** (Category Analysis)

**Topic List:**
| Topic | Words | Exposures | Students | Avg Accuracy | Status |
|-------|-------|-----------|----------|--------------|--------|
| Family | 35 | 392 | 20 | 24% | ⚠️ Needs Review |
| Numbers | 28 | 245 | 18 | 45% | 📚 In Progress |
| ... | ... | ... | ... | ... | ... |

**Click to Expand Topic:**
- Word list for this topic
- Student performance breakdown
- Recommended actions

---

### Tab 5: **Assignments** (Assignment Progress)

**Assignment List:**
| Assignment | Class | Students | Words | Exposures | Avg Accuracy | Status |
|------------|-------|----------|-------|-----------|--------------|--------|
| Y9 Family | 9R/Sp1 | 20 | 35 | 392 | 24% | Active |
| Y8 | 8A/Sp2 | 18 | 34 | 369 | 36% | Active |
| ... | ... | ... | ... | ... | ... | ... |

**Click to Expand Assignment:**
- Student progress table
- Word-level analytics
- Completion status

---

## 🔧 Technical Implementation

### New Service: `TeacherActivityAnalyticsService`

Instead of querying `vocabulary_gem_collection`, query:
1. `gem_events` - For actual activity and gem distribution
2. `assignment_vocabulary_progress` - For word-level tracking
3. `enhanced_game_sessions` - For session activity

### Key Queries:

**1. Student Activity Summary:**
```sql
SELECT 
  up.display_name as student_name,
  COUNT(DISTINCT ge.centralized_vocabulary_id) as unique_words,
  COUNT(*) as total_exposures,
  SUM(CASE WHEN ge.gem_rarity = 'new_discovery' THEN 1 ELSE 0 END) as new_words,
  SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) as correct,
  SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) as incorrect,
  ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) / COUNT(*), 1) as accuracy,
  MAX(ge.created_at) as last_active
FROM gem_events ge
JOIN user_profiles up ON up.user_id = ge.student_id
WHERE ge.student_id IN (SELECT student_id FROM class_enrollments WHERE class_id = ?)
GROUP BY ge.student_id, up.display_name
ORDER BY total_exposures DESC;
```

**2. Word Analysis:**
```sql
SELECT 
  cv.word_text,
  cv.translation_text,
  COUNT(*) as total_exposures,
  COUNT(DISTINCT ge.student_id) as students_practiced,
  SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) as correct,
  SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) as incorrect,
  ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) / COUNT(*), 1) as accuracy
FROM gem_events ge
JOIN centralized_vocabulary cv ON cv.id = ge.centralized_vocabulary_id
WHERE ge.student_id IN (SELECT student_id FROM class_enrollments WHERE class_id = ?)
GROUP BY cv.id, cv.word_text, cv.translation_text
ORDER BY total_exposures DESC;
```

**3. Gem Distribution:**
```sql
SELECT 
  gem_rarity,
  COUNT(*) as count,
  COUNT(DISTINCT student_id) as unique_students,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) as percentage
FROM gem_events
WHERE student_id IN (SELECT student_id FROM class_enrollments WHERE class_id = ?)
GROUP BY gem_rarity
ORDER BY 
  CASE gem_rarity
    WHEN 'legendary' THEN 1
    WHEN 'epic' THEN 2
    WHEN 'rare' THEN 3
    WHEN 'uncommon' THEN 4
    WHEN 'common' THEN 5
    WHEN 'new_discovery' THEN 6
  END;
```

---

## 🎯 Success Metrics

### Before Redesign:
- Shows "0 mastered" for active students
- Teachers confused about what data means
- Focused on wrong metrics (mastery vs. exposure)

### After Redesign:
- Shows actual activity (exposures, gems earned)
- Clear gem distribution (new, common, rare, etc.)
- Easy to identify struggling words/students
- Actionable insights for teachers

---

## 📋 Implementation Steps

1. ✅ Create new service `TeacherActivityAnalyticsService`
2. ✅ Build new dashboard component with 5 tabs
3. ✅ Remove "Trends" tab
4. ✅ Add gem distribution charts
5. ✅ Add word exposure metrics
6. ✅ Add student activity feed
7. ✅ Test with real data (2,337 gem events)

---

## 🚀 Next Steps

**Should I proceed with building the new dashboard?**

This will:
- Replace `TeacherVocabularyAnalyticsDashboard.tsx`
- Create new service `TeacherActivityAnalyticsService.ts`
- Show real, actionable data based on gem_events
- Remove confusing "mastery" metrics
- Add gem distribution and exposure tracking

**Ready to build?**

