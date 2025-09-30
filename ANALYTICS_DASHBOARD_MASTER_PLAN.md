# 📊 LanguageGems Analytics Dashboard - Master Plan

## Executive Summary

**Goal**: Transform `/dashboard/progress` from a cluttered, slow, multi-tab interface into a **tiered, actionable intelligence system** that answers specific teacher questions at each level.

**Key Decision**: **NO OpenAI API** - Current "AI insights" are 95% rule-based calculations (risk scores, thresholds, pattern detection). The only AI call is for generating text descriptions, which we can replace with template strings. This will:
- Eliminate API costs
- Remove 6+ second load times
- Maintain all analytical value
- Rename from "AI-Powered Analytics" to **"Teacher Intelligence Dashboard"** or **"Smart Analytics Dashboard"**

---

## 🎯 Three-Tier Dashboard Structure

### **TIER 1: Class Summary (Landing Page)**
**Purpose**: 60-second health check to identify urgent needs  
**URL**: `/dashboard/progress` (default view)

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  🎓 Class Summary - [Class Name Dropdown]                   │
│  Last updated: 2 minutes ago                    [Refresh]   │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │ Avg Score   │  │ Overdue     │  │ Streak      │         │
│  │    78%      │  │    3        │  │  5 days     │         │
│  │   ↑ +2%     │  │   ⚠️        │  │   🔥        │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
│                                                               │
│  ⚠️ URGENT INTERVENTIONS (5 Students)                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ 🔴 Sophie Martin - 45% avg, 12 days inactive          │  │
│  │    Risk: Low engagement, declining performance        │  │
│  │    [View Profile] [Send Message]                      │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ 🟠 James Chen - 62% avg, struggling with verbs        │  │
│  │    Risk: Low accuracy on past tense                   │  │
│  │    [View Profile] [Assign Practice]                   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  📊 TOP CLASS WEAKNESS                                       │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  French: Adjective Agreement                          │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  18/30 students struggling (60% failure rate)         │  │
│  │  Most common error: Gender agreement                  │  │
│  │  [View Details] [Create Review Lesson]               │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  📈 RECENT ASSIGNMENTS (Traffic Light Status)                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ✅ Unit 3 Vocab Quiz      | 82% avg | High efficacy │    │
│  │ ⚠️  Past Tense Test       | 68% avg | Low efficacy  │    │
│  │ ✅ Food Vocabulary        | 85% avg | High efficacy │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  [Export to Google Sheets] [View All Students]              │
└─────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- **Top Metrics**: 
  - Average class score (from `assignment_progress` table)
  - Assignments overdue count (from `assignments` + `assignment_progress`)
  - Current class streak (from `enhanced_game_sessions` consecutive days)
  
- **Urgent Interventions** (Top 5 at-risk students):
  - Risk score calculation: `(low_accuracy * 0.3) + (low_engagement * 0.3) + (declining_trend * 0.2) + (inactivity * 0.2)`
  - Threshold: Risk score > 0.6
  - Sort by: Risk score DESC
  - Data from: `user_profiles`, `enhanced_game_sessions`, `assignment_progress`

- **Top Class Weakness**:
  - Aggregate all recent assignment questions
  - Group by skill/topic (from `assignment_questions.skill_area`)
  - Calculate failure rate per skill
  - Show skill with highest failure rate (>50%)
  - Data from: `assignment_questions`, `assignment_responses`

- **Recent Assignments**:
  - Last 5 assignments
  - Efficacy = (post-test avg - pre-test avg) OR (class avg vs expected difficulty)
  - Traffic light: Green (>75%), Yellow (60-75%), Red (<60%)
  - Data from: `assignments`, `assignment_progress`

---

### **TIER 2: Student Drill-Down**
**Purpose**: Personalized feedback and differentiated instruction  
**URL**: `/dashboard/progress/student/[studentId]`  
**Entry**: Click student name from Class Summary or Student List

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Class Summary                                     │
│                                                               │
│  👤 Sophie Martin                                            │
│  Year 10 French | Last active: 12 days ago                  │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📈 PERFORMANCE TREND (Last 30 Days)                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │     %                                                  │  │
│  │ 100 │                                                  │  │
│  │  80 │ ─ ─ ─ ─ ─ ─ ─ ─ ─ (Class Average)              │  │
│  │  60 │     ●                                            │  │
│  │  40 │         ●     ●                                  │  │
│  │  20 │                 ●                                │  │
│  │   0 └─────────────────────────────────────────────    │  │
│  │      Week 1  Week 2  Week 3  Week 4                   │  │
│  └───────────────────────────────────────────────────────┘  │
│  ⚠️ Trending DOWN - 18% decline over last month             │
│                                                               │
│  🗂️ VOCABULARY MASTERY MAP                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Food & Drink      ████████░░  85% (42/50 words)      │  │
│  │  School Life       ██████░░░░  60% (18/30 words)      │  │
│  │  Travel & Places   ███░░░░░░░  40% (12/30 words) ⚠️   │  │
│  │  Family & Friends  ████████░░  80% (24/30 words)      │  │
│  │  Hobbies & Sports  ██░░░░░░░░  25% (8/32 words) 🔴    │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Assign Custom Vocab List: Travel & Places]                │
│                                                               │
│  ⚠️ WEAK SKILLS & WORDS (Auto-Updated)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Grammar: Past Tense Verbs (9/12 errors)              │  │
│  │  • aller (went) - 5 errors                            │  │
│  │  • faire (did) - 3 errors                             │  │
│  │  • être (was) - 1 error                               │  │
│  │                                                         │  │
│  │  Vocabulary: Top 10 Weakest Words                     │  │
│  │  1. bibliothèque (library) - 0/5 correct              │  │
│  │  2. piscine (pool) - 1/4 correct                      │  │
│  │  3. gare (station) - 1/3 correct                      │  │
│  └───────────────────────────────────────────────────────┘  │
│  [Print Flashcard List] [Assign Targeted Practice]          │
│                                                               │
│  📊 ENGAGEMENT LOG (Last 7 Days)                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Time on Task: 0 minutes                              │  │
│  │  Login Frequency: 0 logins                            │  │
│  │  Games Played: 0 sessions                             │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  Mon Tue Wed Thu Fri Sat Sun                          │  │
│  │   ░   ░   ░   ░   ░   ░   ░                           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ⚠️ Zero activity - Consider reaching out                   │
│                                                               │
│  [Export Student Report] [Send Encouragement Email]         │
└─────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- **Performance Trend**:
  - Weekly average scores from `assignment_progress`
  - Class average baseline from all students
  - Trend calculation: Linear regression over last 4 weeks
  
- **Vocabulary Mastery Map**:
  - Group vocabulary by category (from `vocabulary_items.category`)
  - Calculate mastery: `words_correct / words_attempted` per category
  - Data from: `student_vocabulary_progress`, `vocabulary_items`
  - Threshold: <50% = Red, 50-70% = Yellow, >70% = Green

- **Weak Skills & Words**:
  - Top 10 words with lowest accuracy (from `word_performance_logs`)
  - Group by part of speech or skill area
  - Show error count and accuracy percentage
  - Auto-update daily

- **Engagement Log**:
  - Time on task: Sum of `duration_seconds` from `enhanced_game_sessions`
  - Login frequency: Count distinct days from `enhanced_game_sessions.created_at`
  - Games played: Count of sessions
  - Visual bar chart for 7-day activity

---

### **TIER 3: Assignment Analysis**
**Purpose**: Content quality review and question optimization  
**URL**: `/dashboard/progress/assignment/[assignmentId]`  
**Entry**: Click assignment name from Class Summary or Assignments List

#### Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Class Summary                                     │
│                                                               │
│  📝 Unit 3: Past Tense Verbs Test                           │
│  Completed: 28/30 students | Avg Score: 68%                 │
│  ⚠️ LOW EFFICACY - Review recommended                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  📊 QUESTION-BY-QUESTION BREAKDOWN                           │
│  [Sort by: Accuracy ↓] [Filter: <50% accuracy]              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ Q# │ Question Preview          │ Accuracy │ Action    │  │
│  ├────┼──────────────────────────┼──────────┼───────────┤  │
│  │ 7  │ "Je ___ au cinéma"       │   32%    │ [Review]  │  │
│  │    │ (aller - past tense)     │   🔴     │           │  │
│  │ 12 │ "Nous ___ nos devoirs"   │   45%    │ [Review]  │  │
│  │    │ (faire - past tense)     │   🟠     │           │  │
│  │ 3  │ "Il ___ content"         │   78%    │ [View]    │  │
│  │    │ (être - past tense)      │   ✅     │           │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  🔍 DISTRACTOR ANALYSIS - Question 7                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Question: "Je ___ au cinéma hier soir"               │  │
│  │  Correct Answer: suis allé                            │  │
│  │                                                         │  │
│  │  Student Responses:                                    │  │
│  │  ████████████████░░░░  80% chose "allais" (imperfect) │  │
│  │  ████░░░░░░░░░░░░░░░░  15% chose "suis allé" ✅       │  │
│  │  █░░░░░░░░░░░░░░░░░░░   5% chose "vais" (present)    │  │
│  │                                                         │  │
│  │  💡 Insight: Students confusing passé composé with    │  │
│  │     imperfect tense. Common misconception detected.   │  │
│  │                                                         │  │
│  │  [Create Review Lesson] [Flag Question for Revision]  │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  ⏱️ TIME SPENT DISTRIBUTION                                  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Students                                              │  │
│  │   12 │         ████████                                │  │
│  │   10 │       ██████████████                            │  │
│  │    8 │     ████████████████████                        │  │
│  │    6 │   ██████████████████████████                    │  │
│  │    4 │ ████████████████████████████████                │  │
│  │    2 │████████████████████████████████████             │  │
│  │    0 └─────────────────────────────────────────────    │  │
│  │       5   10   15   20   25   30   35  (minutes)      │  │
│  │                                                         │  │
│  │  Median: 18 minutes | Range: 8-35 minutes             │  │
│  │  ⚠️ Wide distribution - some students rushing          │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                               │
│  [Export Question Analysis] [Retire Low-Quality Questions]  │
└─────────────────────────────────────────────────────────────┘
```

#### Data Requirements
- **Question-by-Question Breakdown**:
  - All questions from `assignment_questions`
  - Accuracy per question: `COUNT(correct) / COUNT(total)` from `assignment_responses`
  - Sort by accuracy ASC (worst first)
  - Color code: Red (<50%), Yellow (50-70%), Green (>70%)

- **Distractor Analysis** (Multiple Choice Only):
  - For each question, count responses per option
  - Calculate percentage choosing each distractor
  - Identify most popular wrong answer
  - Generate insight: "X% chose [wrong answer], suggesting [misconception]"
  - Data from: `assignment_responses.selected_option`

- **Time Spent Distribution**:
  - Get `time_spent_seconds` from `assignment_progress`
  - Create histogram with 5-minute buckets
  - Calculate median, min, max
  - Flag if range > 20 minutes (indicates rushing or struggling)

---

## 🗄️ Database Schema Requirements

### New Tables Needed
None! All data exists in current schema.

### Key Tables Used
1. **`user_profiles`** - Student info, teacher relationships
2. **`enhanced_game_sessions`** - Activity, XP, accuracy, duration
3. **`assignment_progress`** - Assignment completion, scores, time spent
4. **`assignments`** - Assignment metadata
5. **`assignment_questions`** - Question content, skill areas
6. **`assignment_responses`** - Student answers, correctness
7. **`student_vocabulary_progress`** - Vocabulary mastery tracking
8. **`vocabulary_items`** - Vocabulary words and categories
9. **`word_performance_logs`** - Individual word accuracy
10. **`class_enrollments`** - Student-class relationships

### Indexes to Add (Performance)
```sql
CREATE INDEX idx_assignment_responses_question_accuracy 
  ON assignment_responses(question_id, is_correct);

CREATE INDEX idx_word_performance_student_accuracy 
  ON word_performance_logs(student_id, word_id, is_correct);

CREATE INDEX idx_game_sessions_student_date 
  ON enhanced_game_sessions(student_id, created_at DESC);
```

---

## 🎨 UI/UX Design Principles

### Visual Hierarchy
1. **Critical alerts** (red/orange cards) at top
2. **Key metrics** (large numbers) in hero section
3. **Detailed data** (tables/charts) below fold
4. **Actions** (buttons) always visible and contextual

### Color System
- 🔴 **Red**: Urgent (risk score >0.8, accuracy <50%)
- 🟠 **Orange**: Warning (risk score 0.6-0.8, accuracy 50-70%)
- 🟡 **Yellow**: Caution (needs attention)
- 🟢 **Green**: Good (accuracy >70%, on track)
- 🔵 **Blue**: Neutral/informational

### Interaction Patterns
- **Click student name** → Student Drill-Down
- **Click assignment name** → Assignment Analysis
- **Click "View Details"** → Expand in-place (no redirect)
- **Export buttons** → Download CSV/Google Sheets
- **Refresh** → Manual data reload (with timestamp)

---

## ⚡ Performance Optimization

### Current Problems
- 6+ seconds load time
- N+1 query problem (76 sequential queries for 38 students)
- Unnecessary OpenAI API calls

### Solutions Implemented
✅ Batch queries with `.in()` and `Promise.all()`  
✅ Lookup maps for O(1) data access  
✅ Remove OpenAI API calls (replace with rule-based logic)  

### Target Performance
- **Class Summary**: <500ms load time
- **Student Drill-Down**: <300ms load time
- **Assignment Analysis**: <400ms load time

---

## 🚫 What We're REMOVING

1. **"AI Insights" Tab** - Replace with rule-based "Smart Insights"
2. **Gamification Tab** - Move XP/gems to student profiles (not teacher-facing)
3. **4-Tab Navigation** - Replace with single landing page + drill-downs
4. **OpenAI API Integration** - Remove entirely (cost + latency)
5. **Positive Insights** - Remove "celebration" notifications (not actionable)

---

## ✅ What We're KEEPING

1. **Student Performance Table** - Move to "View All Students" link
2. **Risk Score Calculation** - Keep algorithm, remove AI text generation
3. **Real-Time Data** - Keep live queries to Supabase
4. **Export Functionality** - Keep CSV/Google Sheets export
5. **Class Filtering** - Keep class dropdown selector

---

## 📋 Implementation Checklist

### Phase 1: Data Layer (Week 1)
- [ ] Create `teacherAnalyticsService.ts` with optimized queries
- [ ] Implement Class Summary data aggregation
- [ ] Implement Student Drill-Down data aggregation
- [ ] Implement Assignment Analysis data aggregation
- [ ] Add database indexes for performance
- [ ] Test query performance (<500ms target)

### Phase 2: UI Components (Week 2)
- [ ] Create `ClassSummaryDashboard.tsx` component
- [ ] Create `StudentDrillDown.tsx` component
- [ ] Create `AssignmentAnalysis.tsx` component
- [ ] Create reusable chart components (trend line, bar chart, histogram)
- [ ] Create risk indicator components (red/orange/green cards)
- [ ] Implement responsive layouts (mobile + desktop)

### Phase 3: Integration (Week 3)
- [ ] Update `/dashboard/progress/page.tsx` to use new structure
- [ ] Create dynamic routes for student/assignment drill-downs
- [ ] Implement export functionality (CSV + Google Sheets)
- [ ] Add loading states and error handling
- [ ] Test with real teacher data (30+ students)

### Phase 4: Polish (Week 4)
- [ ] Add animations (Framer Motion)
- [ ] Implement auto-refresh (every 5 minutes)
- [ ] Add keyboard shortcuts
- [ ] Create onboarding tour for new teachers
- [ ] Write documentation
- [ ] Performance testing and optimization

---

## 🎯 Success Metrics

1. **Load Time**: <500ms for Class Summary (vs 6+ seconds currently)
2. **Teacher Satisfaction**: "I can identify at-risk students in 60 seconds"
3. **Actionability**: Every insight has a clear next action
4. **Data Accuracy**: 100% match with raw database queries
5. **Cost Reduction**: $0 OpenAI API costs (vs current usage)

---

## 🔮 Future Enhancements (Post-MVP)

1. **Vocabulary Mastery Heatmap** - Visual grid of word categories
2. **Predictive Alerts** - "Sophie likely to miss next assignment"
3. **Automated Interventions** - Auto-assign practice based on weak areas
4. **Parent Portal** - Share student drill-down with parents
5. **Comparative Analytics** - Compare class to school/national averages
6. **Grammar Breakdown** - Similar to vocabulary mastery map
7. **Question Bank Quality Score** - Flag low-quality questions automatically

---

## 📝 Naming Convention

**Old Name**: "AI-Powered Analytics Dashboard"  
**New Name**: **"Teacher Intelligence Dashboard"** or **"Smart Analytics Dashboard"**

**Rationale**: "Intelligence" implies smart, data-driven insights without the AI hype. "Smart" is accurate since we're using sophisticated algorithms, just not LLMs.

---

**END OF MASTER PLAN**

