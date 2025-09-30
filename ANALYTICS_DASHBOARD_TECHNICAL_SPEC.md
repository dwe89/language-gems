# 🔧 Teacher Intelligence Dashboard - Technical Specification

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌────────────────┐  ┌────────────────┐  ┌──────────────┐  │
│  │ Class Summary  │  │ Student Drill  │  │ Assignment   │  │
│  │ Dashboard      │  │ Down           │  │ Analysis     │  │
│  └────────┬───────┘  └────────┬───────┘  └──────┬───────┘  │
│           │                   │                   │          │
│           └───────────────────┴───────────────────┘          │
│                               │                              │
├───────────────────────────────┼──────────────────────────────┤
│                         API Layer                            │
│           ┌───────────────────┴───────────────────┐          │
│           │  /api/teacher-analytics                │          │
│           │  - getClassSummary(teacherId, classId) │          │
│           │  - getStudentProfile(studentId)        │          │
│           │  - getAssignmentAnalysis(assignmentId) │          │
│           └───────────────────┬───────────────────┘          │
├───────────────────────────────┼──────────────────────────────┤
│                      Service Layer                           │
│           ┌───────────────────┴───────────────────┐          │
│           │  TeacherAnalyticsService               │          │
│           │  - Aggregates data from multiple tables│          │
│           │  - Calculates risk scores              │          │
│           │  - Generates insights (rule-based)     │          │
│           └───────────────────┬───────────────────┘          │
├───────────────────────────────┼──────────────────────────────┤
│                      Database (Supabase)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ user_profiles│  │ game_sessions│  │ assignments  │      │
│  │ enrollments  │  │ vocab_progress│  │ responses    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
src/
├── app/
│   └── dashboard/
│       └── progress/
│           ├── page.tsx                    # Main landing page (Class Summary)
│           ├── student/
│           │   └── [studentId]/
│           │       └── page.tsx            # Student Drill-Down
│           └── assignment/
│               └── [assignmentId]/
│                   └── page.tsx            # Assignment Analysis
│
├── components/
│   └── dashboard/
│       ├── ClassSummaryDashboard.tsx       # Tier 1 component
│       ├── StudentDrillDown.tsx            # Tier 2 component
│       ├── AssignmentAnalysis.tsx          # Tier 3 component
│       └── shared/
│           ├── RiskCard.tsx
│           ├── MetricCard.tsx
│           ├── ProgressBar.tsx
│           ├── WeaknessBanner.tsx
│           ├── AssignmentStatusRow.tsx
│           ├── TrendLineChart.tsx
│           └── DistractorAnalysis.tsx
│
├── services/
│   ├── teacherAnalyticsService.ts          # Main analytics service
│   ├── riskCalculationService.ts           # Risk score algorithms
│   └── exportService.ts                    # CSV/Google Sheets export
│
└── types/
    └── analytics.ts                        # TypeScript interfaces
```

---

## API Endpoints

### 1. Get Class Summary
```typescript
GET /api/teacher-analytics/class-summary?teacherId={id}&classId={id}

Response:
{
  topMetrics: {
    averageScore: number;
    assignmentsOverdue: number;
    currentStreak: number;
    trendPercentage: number;
  };
  urgentInterventions: Array<{
    studentId: string;
    studentName: string;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
    riskScore: number;
    averageScore: number;
    lastActive: Date;
    riskFactors: string[];
  }>;
  topClassWeakness: {
    skillName: string;
    studentsAffected: number;
    totalStudents: number;
    failureRate: number;
    commonError: string;
  } | null;
  recentAssignments: Array<{
    assignmentId: string;
    assignmentName: string;
    averageScore: number;
    efficacy: 'high' | 'medium' | 'low';
    status: 'complete' | 'in-progress' | 'overdue';
  }>;
}
```

### 2. Get Student Profile
```typescript
GET /api/teacher-analytics/student-profile?studentId={id}

Response:
{
  studentInfo: {
    studentId: string;
    studentName: string;
    className: string;
    lastActive: Date;
  };
  performanceTrend: Array<{
    week: string;
    score: number;
  }>;
  classAverage: number;
  trendDirection: 'up' | 'down' | 'stable';
  trendPercentage: number;
  vocabularyMastery: Array<{
    category: string;
    percentage: number;
    current: number;
    total: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  }>;
  weakSkills: {
    grammar: Array<{
      skillName: string;
      errorCount: number;
      examples: string[];
    }>;
    vocabulary: Array<{
      word: string;
      translation: string;
      correctCount: number;
      totalAttempts: number;
    }>;
  };
  engagementLog: {
    timeOnTask: number; // seconds
    loginFrequency: number; // count
    gamesPlayed: number; // count
    dailyActivity: Array<{
      day: string;
      active: boolean;
    }>;
  };
}
```

### 3. Get Assignment Analysis
```typescript
GET /api/teacher-analytics/assignment-analysis?assignmentId={id}

Response:
{
  assignmentInfo: {
    assignmentId: string;
    assignmentName: string;
    completedCount: number;
    totalStudents: number;
    averageScore: number;
    efficacy: 'high' | 'medium' | 'low';
  };
  questionBreakdown: Array<{
    questionId: string;
    questionPreview: string;
    accuracy: number;
    riskLevel: 'critical' | 'high' | 'medium' | 'low';
  }>;
  distractorAnalysis: Array<{
    questionId: string;
    questionText: string;
    correctAnswer: string;
    distractors: Array<{
      answer: string;
      percentage: number;
      isCorrect: boolean;
    }>;
    insight: string;
  }>;
  timeDistribution: {
    median: number;
    min: number;
    max: number;
    buckets: Array<{
      range: string; // "5-10 min"
      count: number;
    }>;
  };
}
```

---

## Service Layer Implementation

### TeacherAnalyticsService.ts

```typescript
import { createClient } from '@supabase/supabase-js';

export class TeacherAnalyticsService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
  }

  /**
   * Get Class Summary data with optimized batch queries
   */
  async getClassSummary(teacherId: string, classId?: string) {
    console.time('⏱️ getClassSummary');

    // 1. Get all students for this teacher/class
    const studentsQuery = this.supabase
      .from('user_profiles')
      .select('user_id, display_name, email')
      .eq('teacher_id', teacherId)
      .eq('role', 'student');

    if (classId) {
      // Filter by class if provided
      const { data: enrollments } = await this.supabase
        .from('class_enrollments')
        .select('student_id')
        .eq('class_id', classId)
        .eq('status', 'active');

      const studentIds = enrollments?.map(e => e.student_id) || [];
      studentsQuery.in('user_id', studentIds);
    }

    const { data: students } = await studentsQuery;
    if (!students || students.length === 0) {
      return this.getEmptyClassSummary();
    }

    const studentIds = students.map(s => s.user_id);

    // 2. Batch load all data in parallel
    const [
      assignmentProgressResult,
      gameSessionsResult,
      assignmentsResult,
      assignmentResponsesResult
    ] = await Promise.all([
      // Assignment progress
      this.supabase
        .from('assignment_progress')
        .select('student_id, assignment_id, score, completed_at, time_spent_seconds')
        .in('student_id', studentIds),

      // Game sessions (last 30 days)
      this.supabase
        .from('enhanced_game_sessions')
        .select('student_id, accuracy_percentage, created_at, duration_seconds')
        .in('student_id', studentIds)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),

      // Assignments
      this.supabase
        .from('assignments')
        .select('id, title, due_date, class_id')
        .eq('teacher_id', teacherId),

      // Assignment responses (for question-level analysis)
      this.supabase
        .from('assignment_responses')
        .select('student_id, question_id, is_correct, assignment_questions(skill_area)')
        .in('student_id', studentIds)
    ]);

    // 3. Calculate metrics
    const topMetrics = this.calculateTopMetrics(
      assignmentProgressResult.data || [],
      gameSessionsResult.data || [],
      assignmentsResult.data || []
    );

    const urgentInterventions = this.calculateUrgentInterventions(
      students,
      assignmentProgressResult.data || [],
      gameSessionsResult.data || []
    );

    const topClassWeakness = this.calculateTopClassWeakness(
      assignmentResponsesResult.data || []
    );

    const recentAssignments = this.calculateRecentAssignments(
      assignmentsResult.data || [],
      assignmentProgressResult.data || []
    );

    console.timeEnd('⏱️ getClassSummary');

    return {
      topMetrics,
      urgentInterventions,
      topClassWeakness,
      recentAssignments
    };
  }

  /**
   * Calculate top-level metrics
   */
  private calculateTopMetrics(
    assignmentProgress: any[],
    gameSessions: any[],
    assignments: any[]
  ) {
    // Average score
    const completedAssignments = assignmentProgress.filter(ap => ap.score !== null);
    const averageScore = completedAssignments.length > 0
      ? Math.round(completedAssignments.reduce((sum, ap) => sum + ap.score, 0) / completedAssignments.length)
      : 0;

    // Assignments overdue
    const now = new Date();
    const overdueAssignments = assignments.filter(a => {
      const dueDate = new Date(a.due_date);
      return dueDate < now;
    });
    const assignmentsOverdue = overdueAssignments.length;

    // Current streak (consecutive days with activity)
    const currentStreak = this.calculateStreak(gameSessions);

    // Trend (compare last 7 days to previous 7 days)
    const trendPercentage = this.calculateTrend(assignmentProgress);

    return {
      averageScore,
      assignmentsOverdue,
      currentStreak,
      trendPercentage
    };
  }

  /**
   * Calculate risk scores and identify urgent interventions
   */
  private calculateUrgentInterventions(
    students: any[],
    assignmentProgress: any[],
    gameSessions: any[]
  ) {
    const studentRisks = students.map(student => {
      const studentId = student.user_id;

      // Get student's data
      const studentAssignments = assignmentProgress.filter(ap => ap.student_id === studentId);
      const studentSessions = gameSessions.filter(gs => gs.student_id === studentId);

      // Calculate risk factors
      const riskFactors: string[] = [];
      let riskScore = 0;

      // 1. Low accuracy
      const avgAccuracy = studentSessions.length > 0
        ? studentSessions.reduce((sum, s) => sum + (s.accuracy_percentage || 0), 0) / studentSessions.length
        : 0;
      if (avgAccuracy < 60) {
        riskFactors.push('Low accuracy rate');
        riskScore += 0.3;
      }

      // 2. Low engagement
      if (studentSessions.length < 5) {
        riskFactors.push('Low engagement');
        riskScore += 0.3;
      }

      // 3. Inactivity
      const lastActive = studentSessions.length > 0
        ? new Date(Math.max(...studentSessions.map(s => new Date(s.created_at).getTime())))
        : new Date(0);
      const daysSinceActive = Math.floor((Date.now() - lastActive.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceActive > 7) {
        riskFactors.push(`${daysSinceActive} days inactive`);
        riskScore += 0.2;
      }

      // 4. Declining performance
      const recentScores = studentAssignments
        .filter(ap => ap.score !== null)
        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
        .slice(0, 5)
        .map(ap => ap.score);

      if (recentScores.length >= 3) {
        const recentAvg = recentScores.slice(0, 2).reduce((sum, s) => sum + s, 0) / 2;
        const olderAvg = recentScores.slice(-2).reduce((sum, s) => sum + s, 0) / 2;
        if (recentAvg < olderAvg - 10) {
          riskFactors.push('Declining performance');
          riskScore += 0.2;
        }
      }

      // Calculate average score
      const averageScore = studentAssignments.length > 0
        ? Math.round(studentAssignments.reduce((sum, ap) => sum + (ap.score || 0), 0) / studentAssignments.length)
        : 0;

      // Determine risk level
      let riskLevel: 'critical' | 'high' | 'medium' | 'low';
      if (riskScore >= 0.8) riskLevel = 'critical';
      else if (riskScore >= 0.6) riskLevel = 'high';
      else if (riskScore >= 0.4) riskLevel = 'medium';
      else riskLevel = 'low';

      return {
        studentId,
        studentName: student.display_name || student.email,
        riskLevel,
        riskScore,
        averageScore,
        lastActive,
        riskFactors
      };
    });

    // Return top 5 at-risk students
    return studentRisks
      .filter(s => s.riskScore >= 0.6)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5);
  }

  // ... Additional helper methods
}
```

---

## Database Queries (Optimized)

### Key Optimization Strategies

1. **Batch Loading**: Use `.in()` to load data for multiple students at once
2. **Parallel Queries**: Use `Promise.all()` to run independent queries simultaneously
3. **Selective Fields**: Only select fields you need (avoid `SELECT *`)
4. **Date Filtering**: Limit queries to relevant time periods (last 30 days)
5. **Indexes**: Add indexes on frequently queried columns

### Required Database Indexes

```sql
-- Performance indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_assignment_progress_student_score 
  ON assignment_progress(student_id, score, completed_at DESC);

CREATE INDEX IF NOT EXISTS idx_game_sessions_student_date 
  ON enhanced_game_sessions(student_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_assignment_responses_question_correct 
  ON assignment_responses(question_id, is_correct);

CREATE INDEX IF NOT EXISTS idx_word_performance_student_word 
  ON word_performance_logs(student_id, word_id, is_correct);

CREATE INDEX IF NOT EXISTS idx_vocab_progress_student_category 
  ON student_vocabulary_progress(student_id, vocabulary_item_id);
```

---

## Performance Targets

| Operation | Target | Current | Status |
|-----------|--------|---------|--------|
| Class Summary Load | <500ms | 6000ms+ | ❌ Needs optimization |
| Student Profile Load | <300ms | N/A | 🟡 To be implemented |
| Assignment Analysis | <400ms | N/A | 🟡 To be implemented |
| Export to CSV | <1000ms | N/A | 🟡 To be implemented |

---

## Error Handling

```typescript
try {
  const data = await teacherAnalyticsService.getClassSummary(teacherId, classId);
  return NextResponse.json({ success: true, data });
} catch (error) {
  console.error('Error loading class summary:', error);
  
  // Return graceful fallback
  return NextResponse.json({
    success: false,
    error: 'Failed to load analytics data',
    fallback: {
      topMetrics: { averageScore: 0, assignmentsOverdue: 0, currentStreak: 0, trendPercentage: 0 },
      urgentInterventions: [],
      topClassWeakness: null,
      recentAssignments: []
    }
  }, { status: 500 });
}
```

---

## Testing Strategy

### Unit Tests
- Risk score calculation
- Trend calculation
- Weakness detection algorithms
- Data aggregation functions

### Integration Tests
- API endpoint responses
- Database query performance
- Data consistency checks

### E2E Tests
- Full dashboard load
- Student drill-down navigation
- Assignment analysis workflow
- Export functionality

---

**END OF TECHNICAL SPECIFICATION**

