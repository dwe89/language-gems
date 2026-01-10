# 🎯 GRAMMAR SKILLS ASSIGNMENT MASTER PLAN
## Complete Guide to Grammar Task Assignments within the Skills Tab

**Created:** 2026-01-09
**Last Updated:** 2026-01-09
**Status:** ✅ PHASE 2 COMPLETE - READY FOR TESTING
**Priority:** HIGH

---

## 📋 Executive Summary

This document provides a comprehensive analysis of the Grammar Skills assignment system within Language Gems, covering:
1. How teachers set grammar skill assignments
2. The complete student learning journey (Read → Practice → Test)
3. Current implementation status and gaps
4. Integration with student/teacher dashboards
5. Recommendations for improvements

---

## 🏗️ CURRENT ARCHITECTURE OVERVIEW

### Database Tables Involved

| Table | Purpose | Status |
|-------|---------|--------|
| `grammar_topics` | Master list of grammar topics (by language/category) | ✅ Exists |
| `grammar_content` | Content for each topic (lessons, practice questions) | ✅ Exists |
| `grammar_questions` | Individual practice/test questions | ✅ Exists |
| `grammar_assignment_sessions` | **PRIMARY** - Tracks student grammar sessions | ✅ Exists |
| `enhanced_assignment_progress` | Overall assignment progress (inc. grammar fields) | ✅ Exists |
| `assignments` | Main assignment table with `game_config.skillsConfig` | ✅ Exists |

### Key Services

| Service | Location | Purpose |
|---------|----------|---------|
| `GrammarSessionService` | `src/services/grammar/GrammarSessionService.ts` | Session tracking, gems, XP |
| `GrammarAnalyticsService` | `src/services/analytics/GrammarAnalyticsService.ts` | Analytics for grammar |
| `TeacherGrammarAnalytics` | `src/services/teacherGrammarAnalytics.ts` | Teacher-facing analytics |
| `TeacherAssignmentAnalyticsService` | `src/services/teacherAssignmentAnalytics.ts` | Unified assignment analytics |

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `GrammarLesson` | `src/components/grammar/GrammarLesson.tsx` | Lesson viewing component |
| `GrammarPractice` | `src/components/grammar/GrammarPractice.tsx` | Practice mode (10-30 questions) |
| `GrammarQuizPage` | `src/components/grammar/GrammarQuizPage.tsx` | Test mode wrapper |
| `GrammarLessonTracker` | `src/components/grammar/GrammarLessonTracker.tsx` | Invisible tracker for lesson views |

---

## 📚 PART 1: TEACHER ASSIGNMENT CREATION FLOW

### 1.1 Current Implementation ✅

**Location:** `src/components/assignments/EnhancedAssignmentCreator.tsx`

**Configuration Type:** `SkillsConfig` (from `AssignmentTypes.ts`)

```typescript
interface SkillsConfig {
  generalLanguage?: string;
  generalTimeLimit?: number;
  generalMaxAttempts?: number;
  generalShowHints?: boolean;
  generalRandomizeQuestions?: boolean;
  selectedSkills: Array<{
    id: string;
    type: string;              // 'lesson', 'practice', 'quiz', 'test', 'combined'
    name: string;
    estimatedTime: string;
    skills: string[];
    instanceConfig?: {
      language?: string;
      category?: string;
      topicIds?: string[];      // Selected grammar topic UUIDs
      contentTypes?: ('lesson' | 'quiz' | 'practice')[];
      timeLimit?: number;
      maxAttempts?: number;
      showHints?: boolean;
      randomizeQuestions?: boolean;
      tier?: 'foundation' | 'higher';
      examBoard?: 'AQA' | 'Edexcel';
    };
  }>;
}
```

**Storage in `assignments.game_config`:**
```json
{
  "skillsConfig": {
    "selectedSkills": [
      {
        "id": "skill-1234",
        "type": "combined",
        "name": "Adjective Agreement",
        "instanceConfig": {
          "language": "spanish",
          "category": "adjectives",
          "topicIds": ["uuid-of-topic-1", "uuid-of-topic-2"],
          "contentTypes": ["lesson", "practice", "quiz"]
        }
      }
    ]
  }
}
```

### 1.2 Assignment Creation Steps

1. **Step 1: Basic Details** - Title, description, due date
2. **Step 2: Activity Selection** - Teacher selects "Skills" tab
3. **Step 3: Skill Configuration**
   - Select language (Spanish/French/German)
   - Browse grammar categories (Verbs, Nouns, Adjectives, etc.)
   - Select specific topics within categories
   - Choose content types (Lesson, Practice, Quiz/Test)
4. **Step 4: Review & Create**

### 1.3 Skill Types Explained

| Type | Description | Tracked By |
|------|-------------|------------|
| `lesson` | Read-only grammar explanation pages | `GrammarLessonTracker` |
| `practice` | Interactive practice (10-30 questions) | `GrammarPractice` + `GrammarSessionService` |
| `quiz`/`test` | Timed assessment with lives | `GrammarPractice` (isTestMode=true) |
| `combined` | All three: lesson → practice → test | All components |

### 1.4 Current Gaps in Teacher Flow

| Gap | Description | Priority |
|-----|-------------|----------|
| 🟡 No preview | Teachers can't preview grammar content before assigning | MEDIUM |
| 🟡 Limited topic selection UI | Category browsing is basic | LOW |
| 🟢 Working well | Topic selection stores proper `topicIds` | ✅ |

---

## 📖 PART 2: STUDENT LEARNING JOURNEY

### 2.1 The Three-Step Learning Process

```
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT GRAMMAR JOURNEY                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   STEP 1: READ LESSON                                           │
│   ┌─────────────────────────────────────────┐                   │
│   │ • View grammar explanation              │                   │
│   │ • See examples with translations        │                   │
│   │ • Read conjugation tables               │                   │
│   │ • Complete in-lesson mini-exercises     │                   │
│   │ • 30+ seconds = "completed"             │                   │
│   │ → Gems: 1-10 (based on time spent)      │                   │
│   └─────────────────────────────────────────┘                   │
│                          ↓                                       │
│   STEP 2: DO PRACTICE                                           │
│   ┌─────────────────────────────────────────┐                   │
│   │ • 10/15/30 questions (quick/std/mastery)│                   │
│   │ • Question types: fill_blank, conjugation│                   │
│   │   word_order, translation, multiple_choice│                  │
│   │ • Unlimited lives                        │                   │
│   │ • Hints available                        │                   │
│   │ → Gems: 2-5 per correct answer          │                   │
│   └─────────────────────────────────────────┘                   │
│                          ↓                                       │
│   STEP 3: DO TEST                                               │
│   ┌─────────────────────────────────────────┐                   │
│   │ • 20 questions (from quiz bank)         │                   │
│   │ • 3 LIVES (game over if all lost)       │                   │
│   │ • Higher stakes, higher rewards         │                   │
│   │ → Gems: 5-10 per correct answer         │                   │
│   │ → GCSE grade estimation (optional)      │                   │
│   └─────────────────────────────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 2.2 URLs and Routing

**Base URL Pattern:** `/grammar/{language}/{category}/{topic}`

| Content Type | URL | Example |
|--------------|-----|---------|
| Lesson | `/grammar/spanish/adjectives/adjective-agreement` | Read lesson |
| Practice | `/grammar/spanish/adjectives/adjective-agreement/practice` | 10-30 questions |
| Test | `/grammar/spanish/adjectives/adjective-agreement/test` | Timed test |

**Assignment Mode Parameter:** `?assignment={id}&mode=assignment`

**Example Full URL:**
```
/grammar/spanish/adjectives/adjective-agreement/practice?assignment=abc123&mode=assignment
```

### 2.3 Session Tracking Implementation ✅

**Table:** `grammar_assignment_sessions`

| Column | Type | Purpose |
|--------|------|---------|
| `student_id` | uuid | Student who did the session |
| `assignment_id` | uuid | FK to assignments table |
| `topic_id` | uuid | FK to grammar_topics |
| `content_id` | uuid | FK to grammar_content |
| `session_type` | text | 'lesson' | 'practice' | 'test' |
| `session_mode` | text | 'assignment' | 'free_play' |
| `practice_mode` | text | 'quick' | 'standard' | 'mastery' |
| `completion_status` | text | 'in_progress' | 'completed' | 'abandoned' |
| `questions_attempted` | int | Number of questions tried |
| `questions_correct` | int | Number correct |
| `accuracy_percentage` | numeric | Score percentage |
| `duration_seconds` | int | Time spent |
| `gems_earned` | int | Gems rewarded |
| `xp_earned` | int | XP rewarded |
| `session_data` | jsonb | Raw question attempt data |

### 2.4 Component Flow Diagram

```
Student clicks skill activity on Assignment Detail Page
                    │
                    ▼
        ┌───────────────────────┐
        │ handlePlaySkill()     │
        │ (page.tsx L727-808)   │
        └───────────────────────┘
                    │
        Fetch topic slug from DB
                    │
                    ▼
        ┌───────────────────────┐
        │ Navigate to grammar   │
        │ page with assignment  │
        │ query params          │
        └───────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐     ┌───────────────────────┐
│ Lesson Page   │     │ Practice/Test Page    │
│ (GrammarLesson│     │ (GrammarPractice.tsx) │
│ + LessonTracker)    │                       │
└───────────────┘     └───────────────────────┘
        │                       │
        ▼                       ▼
┌───────────────┐     ┌───────────────────────┐
│ GrammarLesson │     │ GrammarSessionService │
│ Tracker       │     │ .startSession()       │
│ .trackLesson()│     │ .recordAttempt()      │
└───────────────┘     │ .endSession()         │
        │             └───────────────────────┘
        └───────────────┬──────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────────┐
        │ grammar_assignment_sessions TABLE │
        │ enhanced_assignment_progress TABLE│
        │ gem_events TABLE                  │
        └───────────────────────────────────┘
```

---

## 📊 PART 3: CURRENT IMPLEMENTATION STATUS

### 3.1 What's Working ✅

| Feature | Status | Evidence |
|---------|--------|----------|
| Teacher can create Skills assignments | ✅ Working | `EnhancedAssignmentCreator.tsx` |
| Skills config stored in `game_config.skillsConfig` | ✅ Working | DB query verified |
| Student sees grammar skills on assignment detail | ✅ Working | `page.tsx` L344-405 |
| Navigation to grammar pages with assignment params | ✅ Working | `handlePlaySkill()` L727-808 |
| Lesson tracking (>30 sec = complete) | ✅ Working | `GrammarLessonTracker.tsx` |
| Practice session tracking | ✅ Working | `GrammarSessionService.ts` |
| Test session tracking | ✅ Working | `GrammarSessionService.ts` (isTestMode) |
| Gems/XP calculation | ✅ Working | Different rates for practice vs test |
| Session data stored | ✅ Working | 35+ sessions in DB |
| Assignment progress updated | ✅ Working | `updateAssignmentProgress()` |

### 3.2 What Needs Improvement 🟡

| Issue | Current State | Recommended Fix | Priority |
|-------|---------------|-----------------|----------|
| **Completion Logic** | Requires 1 session per topic | Should enforce lesson → practice → test order | HIGH |
| **Progress Display** | Shows sessions/topics only | Should show step progress per topic | HIGH |
| **Dashboard Integration** | Basic analytics | Need per-topic mastery indicators | MEDIUM |
| **Teacher Analytics** | Grammar analytics exists but basic | Enhance with assignment-specific view | MEDIUM |
| **Content Type Enforcement** | All types accessible | Should lock test until practice done | MEDIUM |
| **Offline Support** | No offline mode | Low priority for MVP | LOW |

### 3.3 What's Missing 🔴

| Feature | Impact | Complexity |
|---------|--------|------------|
| **Wrapper Component** for enforced order | High - Core UX improvement | MEDIUM |
| **Per-topic progress tracking** (lesson ✓, practice ✓, test ✓) | High - Clear visual progress | MEDIUM |
| **Prerequisite enforcement** | Medium - Prevents skipping | LOW |
| **Teacher preview of grammar content** | Medium - Teacher confidence | LOW |

---

## 🔧 PART 4: DO WE NEED A WRAPPER?

### 4.1 Current Situation (No Wrapper)

Currently, when a student clicks on a grammar skill in their assignment:
1. They're navigated directly to the grammar page (lesson/practice/test)
2. Each component tracks its own session
3. There's no enforcement of "read first, then practice, then test"
4. Progress shows as "X/Y topics completed" but not "which steps done"

### 4.2 Recommended: Grammar Assignment Wrapper

**YES, we need a wrapper component** for better UX and tracking.

**Proposed Component:** `GrammarSkillWrapper.tsx`

```typescript
interface GrammarSkillWrapperProps {
  assignmentId: string;
  topicId: string;
  contentTypes: ('lesson' | 'practice' | 'quiz')[];
  language: string;
  category: string;
  topicSlug: string;
}

// This wrapper would:
// 1. Show progress for all required steps (lesson → practice → test)
// 2. Enforce order (can't do test before practice)
// 3. Provide unified completion tracking
// 4. Handle navigation between steps
// 5. Show topic-level achievement on completion
```

### 4.3 Wrapper Benefits

| Benefit | Description |
|---------|-------------|
| **Enforced Learning Path** | Can't skip to test without reading/practicing |
| **Clear Progress** | Visual indicators: ✅ Lesson → ✅ Practice → 🔒 Test |
| **Better Analytics** | Know exactly where students drop off |
| **Gamification** | Topic completion celebrations, bonus gems |
| **Reduced Confusion** | Students know exactly what to do next |

### 4.4 Implementation Approach

**Option A: New Wrapper Page (Recommended)**
- Create `/grammar/assignment/{assignmentId}/topic/{topicId}/page.tsx`
- This page becomes the hub for all three activities
- Renders appropriate sub-component based on step

**Option B: Enhance Existing Components**
- Add enforcement logic to each page
- Check previous step completion before allowing access
- Less UX-friendly but faster to implement

---

## 📈 PART 5: DASHBOARD INTEGRATION

### 5.1 Student Dashboard Integration ✅

**Location:** `/student-dashboard/assignments/[assignmentId]/page.tsx`

**Current Implementation (L344-405):**
```typescript
// Skills are extracted from assignment config
const selectedSkills = assignmentData.game_config?.skillsConfig?.selectedSkills || [];

// Grammar sessions fetched from DB
const grammarSessionsData = await supabase
  .from('grammar_assignment_sessions')
  .select(`topic_id, completion_status, final_score, accuracy_percentage, 
           duration_seconds, ended_at, grammar_topics(title)`)
  .eq('assignment_id', assignmentId)
  .eq('student_id', user.id);

// Skills mapped with progress
skills = selectedSkills.map((skill) => {
  const topicSessions = grammarSessionsData?.filter(s => 
    skill.instanceConfig?.topicIds?.includes(s.topic_id)
  );
  // Calculate aggregate stats...
  return {
    id: skill.id,
    name: skill.name,
    completed: isCompleted,
    sessionsCompleted: uniqueTopicsCompleted,
    totalTopics: topicIds.length,
    // ...
  };
});
```

**What Student Sees:**
- Skill card with name
- Progress: "2/3 topics completed"
- Average accuracy/score
- Time spent

**What's Missing:**
- Per-topic step breakdown (lesson ✓, practice ✓, test ?)
- Visual progress bars per topic
- Clear "next step" indicator

### 5.2 Student Grammar Analytics Page ✅

**Location:** `/student-dashboard/grammar/analytics/page.tsx`

- Shows overall grammar performance
- Topic-level mastery (🔴🟡🟢)
- Historical performance trends

### 5.3 Teacher Dashboard Integration ✅

**Assignment Analytics:**
- Location: `/dashboard/progress/assignment/[assignmentId]`
- Uses `TeacherAssignmentAnalyticsService`
- Includes grammar sessions in results

**Grammar-Specific Analytics:**
- Location: `/dashboard/grammar/analytics`
- Component: `TeacherGrammarAnalyticsDashboard`
- Shows class-wide grammar performance

**Current Status:** Teacher can see grammar progress on assignment analytics page, but specific grammar insights are limited.

---

## 📋 PART 6: IMPLEMENTATION PHASES

### Phase 1: Enhanced Progress Tracking (Week 1) 🔴 HIGH PRIORITY

**Goal:** Track lesson/practice/test completion separately per topic

**Tasks:**
1. [ ] Add `step_completed` field to track which steps done
2. [ ] Modify `GrammarLessonTracker` to mark 'lesson' step complete
3. [ ] Modify `GrammarSessionService` to mark 'practice'/'test' steps
4. [ ] Update student assignment detail page to show per-step progress

**Database Changes:**
```sql
-- Add step tracking to grammar_assignment_sessions or create new table
CREATE TABLE IF NOT EXISTS grammar_topic_step_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID REFERENCES assignments(id),
  student_id UUID NOT NULL,
  topic_id UUID REFERENCES grammar_topics(id),
  lesson_completed BOOLEAN DEFAULT FALSE,
  lesson_completed_at TIMESTAMPTZ,
  practice_completed BOOLEAN DEFAULT FALSE,
  practice_completed_at TIMESTAMPTZ,
  practice_best_score INTEGER,
  test_completed BOOLEAN DEFAULT FALSE,
  test_completed_at TIMESTAMPTZ,
  test_best_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(assignment_id, student_id, topic_id)
);
```

### Phase 2: Grammar Skill Wrapper (Week 2) 🟡 MEDIUM PRIORITY

**Goal:** Create unified wrapper for grammar skill assignment activities

**Tasks:**
1. [ ] Create `GrammarSkillWrapper.tsx` component
2. [ ] Implement step navigation with locking
3. [ ] Add visual progress indicators
4. [ ] Create completion celebration
5. [ ] Update `handlePlaySkill()` to use wrapper

**New Route:** `/grammar/assignment/[assignmentId]/topic/[topicId]/page.tsx`

### Phase 3: Teacher Analytics Enhancement (Week 3)

**Goal:** Better visibility into grammar assignment performance

**Tasks:**
1. [x] Add per-topic breakdown on assignment analytics
2. [x] Show which step students are stuck on
3. [x] Identify common mistakes
4. [x] Generate AI insights for grammar topics

### Phase 4: Polish & Testing (Week 4)

**Tasks:**
1. [ ] End-to-end testing of full flow
2. [ ] Mobile responsiveness
3. [ ] Performance optimization
4. [ ] Documentation updates

---

## 🔗 PART 7: KEY FILES REFERENCE

### Assignment Creation
- `src/components/assignments/EnhancedAssignmentCreator.tsx`
- `src/components/assignments/steps/ActivitiesSelectionStep.tsx`
- `src/components/assignments/steps/ContentConfigurationStep.tsx`
- `src/components/assignments/types/AssignmentTypes.ts`

### Grammar Components
- `src/components/grammar/GrammarLesson.tsx`
- `src/components/grammar/GrammarPractice.tsx`
- `src/components/grammar/GrammarQuizPage.tsx`
- `src/components/grammar/GrammarLessonTracker.tsx`

### Services
- `src/services/grammar/GrammarSessionService.ts`
- `src/services/analytics/GrammarAnalyticsService.ts`
- `src/services/teacherGrammarAnalytics.ts`
- `src/services/teacherAssignmentAnalytics.ts`

### Student Pages
- `src/app/student-dashboard/assignments/[assignmentId]/page.tsx`
- `src/app/grammar/[language]/[category]/[topic]/page.tsx`
- `src/app/grammar/[language]/[category]/[topic]/practice/page.tsx`
- `src/app/grammar/[language]/[category]/[topic]/test/page.tsx`

### Teacher Pages
- `src/app/dashboard/assignments/page.tsx`
- `src/app/dashboard/progress/assignment/[assignmentId]/page.tsx`
- `src/components/teacher/TeacherGrammarAnalyticsDashboard.tsx`

### Database
- `supabase/migrations/20250120000000_create_grammar_assignment_sessions.sql`

---

## ✅ PART 8: QUICK START CHECKLIST

### For Immediate Testing
- [x] Assignment creation stores `skillsConfig` correctly
- [x] Student can see skills on assignment detail page
- [x] Navigation to grammar pages includes assignment params
- [x] Sessions are being recorded in `grammar_assignment_sessions`
- [x] Gems/XP are being awarded
- [x] Progress updates in `enhanced_assignment_progress`

### For Phase 1 Implementation
- [x] Create step progress tracking table
- [x] Update session tracking to mark steps
- [x] Enhance student UI to show per-step progress
- [x] Test full flow: lesson → practice → test

### For Phase 2 Implementation
- [x] Design wrapper component UI
- [x] Implement step locking logic
- [x] Create completion animations
- [x] Update routing to use wrapper

---

## 📊 SUMMARY

**Current State:** Grammar skill assignments are **FULLY IMPLEMENTED (Phase 3)** with:
- ✅ Teacher can create assignments
- ✅ Student can complete activities
- ✅ Sessions are tracked
- ✅ Gems/XP awarded
- ✅ Progress visible on dashboards
- ✅ Deep analytics with AI Insights

**Key Improvements Needed:**
(All Core Features Implemented)

**Recommendation:** Proceed with Phase 4 (Polish & Testing) to ensure a bug-free launch, focusing on verify the logic on mobile devices and edge cases.

---

*This plan was created based on analysis of the existing codebase and database schema. All features described as "working" have been verified through code review and database queries.*
