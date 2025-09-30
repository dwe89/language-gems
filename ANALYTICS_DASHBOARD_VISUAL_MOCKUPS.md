# 📐 Teacher Intelligence Dashboard - Visual Mockups

## Color Palette

```css
/* Risk Levels */
--risk-critical: #DC2626;    /* Red - Urgent attention */
--risk-high: #F59E0B;        /* Orange - Warning */
--risk-medium: #FCD34D;      /* Yellow - Caution */
--risk-low: #10B981;         /* Green - Good */

/* UI Elements */
--primary: #3B82F6;          /* Blue - Actions */
--secondary: #6B7280;        /* Gray - Secondary text */
--background: #F9FAFB;       /* Light gray - Page background */
--card: #FFFFFF;             /* White - Card background */
--border: #E5E7EB;           /* Light gray - Borders */

/* Text */
--text-primary: #111827;     /* Dark gray - Headings */
--text-secondary: #6B7280;   /* Medium gray - Body text */
--text-muted: #9CA3AF;       /* Light gray - Captions */
```

---

## Typography Scale

```css
/* Headings */
h1: 32px, font-weight: 700  /* Page title */
h2: 24px, font-weight: 600  /* Section headers */
h3: 18px, font-weight: 600  /* Card titles */
h4: 16px, font-weight: 500  /* Subsection headers */

/* Body */
body: 14px, font-weight: 400
small: 12px, font-weight: 400
caption: 11px, font-weight: 400

/* Numbers */
metric-large: 48px, font-weight: 700  /* Hero metrics */
metric-medium: 32px, font-weight: 600 /* Card metrics */
metric-small: 20px, font-weight: 500  /* Inline metrics */
```

---

## Component Library

### 1. Risk Card Component
```
┌─────────────────────────────────────────────────┐
│ 🔴 Sophie Martin                                │
│ ─────────────────────────────────────────────── │
│ Average Score: 45% | Last Active: 12 days ago  │
│                                                  │
│ Risk Factors:                                   │
│ • Low engagement (0 sessions this week)         │
│ • Declining performance (-18% this month)       │
│ • Low accuracy on past tense verbs              │
│                                                  │
│ [View Profile]  [Send Message]                  │
└─────────────────────────────────────────────────┘

Props:
- studentName: string
- riskLevel: 'critical' | 'high' | 'medium' | 'low'
- averageScore: number
- lastActive: Date
- riskFactors: string[]
- onViewProfile: () => void
- onSendMessage: () => void
```

### 2. Metric Card Component
```
┌──────────────────┐
│  📊             │
│                  │
│      78%        │  ← Large number (48px)
│   ↑ +2%         │  ← Trend indicator
│                  │
│  Average Score   │  ← Label (14px)
└──────────────────┘

Props:
- icon: ReactNode
- value: string | number
- trend: 'up' | 'down' | 'stable'
- trendValue: string
- label: string
- color: 'red' | 'orange' | 'yellow' | 'green' | 'blue'
```

### 3. Progress Bar Component
```
Food & Drink      ████████░░  85% (42/50 words)
                  ↑ Filled    ↑ Empty

Props:
- label: string
- percentage: number
- current: number
- total: number
- color: 'red' | 'orange' | 'yellow' | 'green'
- showWarning: boolean
```

### 4. Weakness Banner Component
```
┌─────────────────────────────────────────────────┐
│  📊 TOP CLASS WEAKNESS                          │
│  ───────────────────────────────────────────────│
│                                                  │
│  French: Adjective Agreement                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│  18/30 students struggling (60% failure rate)   │
│  Most common error: Gender agreement            │
│                                                  │
│  [View Details]  [Create Review Lesson]         │
└─────────────────────────────────────────────────┘

Props:
- skillName: string
- studentsAffected: number
- totalStudents: number
- failureRate: number
- commonError: string
- onViewDetails: () => void
- onCreateLesson: () => void
```

### 5. Assignment Status Row Component
```
✅ Unit 3 Vocab Quiz      | 82% avg | High efficacy
⚠️  Past Tense Test       | 68% avg | Low efficacy
✅ Food Vocabulary        | 85% avg | High efficacy

Props:
- assignmentName: string
- averageScore: number
- efficacy: 'high' | 'medium' | 'low'
- status: 'complete' | 'in-progress' | 'overdue'
- onClick: () => void
```

### 6. Trend Line Chart Component
```
     %
 100 │
  80 │ ─ ─ ─ ─ ─ ─ ─ ─ ─ (Class Average)
  60 │     ●
  40 │         ●     ●
  20 │                 ●
   0 └─────────────────────────────────────
      Week 1  Week 2  Week 3  Week 4

Props:
- data: { week: string, score: number }[]
- classAverage: number
- trendDirection: 'up' | 'down' | 'stable'
- trendPercentage: number
```

### 7. Distractor Analysis Component
```
┌─────────────────────────────────────────────────┐
│  Question: "Je ___ au cinéma hier soir"         │
│  Correct Answer: suis allé                      │
│                                                  │
│  Student Responses:                             │
│  ████████████████░░░░  80% chose "allais"       │
│  ████░░░░░░░░░░░░░░░░  15% chose "suis allé" ✅ │
│  █░░░░░░░░░░░░░░░░░░░   5% chose "vais"        │
│                                                  │
│  💡 Insight: Students confusing passé composé   │
│     with imperfect tense.                       │
└─────────────────────────────────────────────────┘

Props:
- question: string
- correctAnswer: string
- distractors: { answer: string, percentage: number, isCorrect: boolean }[]
- insight: string
```

---

## Page Layouts

### Class Summary Layout (Desktop)
```
┌─────────────────────────────────────────────────────────────┐
│  Header (80px height)                                        │
│  🎓 Class Summary - [Dropdown: Year 10 French]              │
│  Last updated: 2 minutes ago              [Refresh Button]  │
├─────────────────────────────────────────────────────────────┤
│  Hero Metrics (120px height)                                │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐           │
│  │ Metric │  │ Metric │  │ Metric │  │ Metric │           │
│  └────────┘  └────────┘  └────────┘  └────────┘           │
├─────────────────────────────────────────────────────────────┤
│  Main Content (Scrollable)                                  │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ⚠️ URGENT INTERVENTIONS (5 Students)              │   │
│  │  [Risk Cards - Stacked vertically]                  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📊 TOP CLASS WEAKNESS                              │   │
│  │  [Weakness Banner]                                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📈 RECENT ASSIGNMENTS                              │   │
│  │  [Assignment Status Rows]                            │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  [Export to Google Sheets]  [View All Students]            │
└─────────────────────────────────────────────────────────────┘
```

### Class Summary Layout (Mobile)
```
┌─────────────────────┐
│  Header             │
│  🎓 Class Summary   │
│  [Dropdown]         │
├─────────────────────┤
│  Metrics (Stacked)  │
│  ┌─────────────┐    │
│  │   Metric    │    │
│  └─────────────┘    │
│  ┌─────────────┐    │
│  │   Metric    │    │
│  └─────────────┘    │
├─────────────────────┤
│  Content            │
│  (Scrollable)       │
│                     │
│  [Risk Cards]       │
│  [Weakness Banner]  │
│  [Assignments]      │
│                     │
│  [Export]           │
│  [View All]         │
└─────────────────────┘
```

### Student Drill-Down Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Class Summary                                     │
│                                                               │
│  👤 Sophie Martin                                            │
│  Year 10 French | Last active: 12 days ago                  │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📈 PERFORMANCE TREND                               │    │
│  │  [Trend Line Chart - Full Width]                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🗂️ VOCABULARY MASTERY MAP                         │    │
│  │  [Progress Bars - Stacked]                          │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ⚠️ WEAK SKILLS & WORDS                            │    │
│  │  [Filterable List]                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📊 ENGAGEMENT LOG                                  │    │
│  │  [7-Day Activity Bar Chart]                         │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  [Export Report]  [Send Email]                              │
└─────────────────────────────────────────────────────────────┘
```

### Assignment Analysis Layout
```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Class Summary                                     │
│                                                               │
│  📝 Unit 3: Past Tense Verbs Test                           │
│  Completed: 28/30 students | Avg Score: 68%                 │
│  ⚠️ LOW EFFICACY - Review recommended                        │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📊 QUESTION-BY-QUESTION BREAKDOWN                  │    │
│  │  [Sortable Table]                                    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🔍 DISTRACTOR ANALYSIS - Question 7                │    │
│  │  [Distractor Analysis Component]                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ⏱️ TIME SPENT DISTRIBUTION                         │    │
│  │  [Histogram Chart]                                   │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
│  [Export Analysis]  [Retire Questions]                      │
└─────────────────────────────────────────────────────────────┘
```

---

## Interaction States

### Button States
```
Default:    [View Profile]
Hover:      [View Profile]  ← Slightly darker, cursor pointer
Active:     [View Profile]  ← Pressed effect
Disabled:   [View Profile]  ← Grayed out, no cursor
Loading:    [⏳ Loading...]  ← Spinner icon
```

### Card States
```
Default:    White background, subtle shadow
Hover:      Slightly elevated shadow, cursor pointer (if clickable)
Selected:   Blue border, highlighted background
Loading:    Skeleton loader animation
Error:      Red border, error message
```

### Data Loading States
```
Initial Load:
┌─────────────────────────────────────┐
│  ⏳ Loading class data...           │
│  [Spinner Animation]                │
└─────────────────────────────────────┘

Skeleton Loader:
┌─────────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────────┘

Error State:
┌─────────────────────────────────────┐
│  ❌ Failed to load data             │
│  [Retry Button]                     │
└─────────────────────────────────────┘
```

---

## Responsive Breakpoints

```css
/* Mobile */
@media (max-width: 640px) {
  - Single column layout
  - Stacked metric cards
  - Simplified charts
  - Hamburger menu
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  - Two column layout
  - Side-by-side metric cards (2x2 grid)
  - Full-width charts
}

/* Desktop */
@media (min-width: 1025px) {
  - Three column layout (where applicable)
  - Four metric cards in a row
  - Side-by-side charts
  - Expanded tables
}
```

---

## Animation Guidelines

### Page Transitions
- Fade in: 200ms ease-in-out
- Slide in: 300ms ease-out
- No animations on initial load (performance)

### Card Animations
- Hover elevation: 150ms ease-out
- Expand/collapse: 250ms ease-in-out
- Stagger children: 50ms delay between items

### Data Updates
- Number count-up: 500ms ease-out
- Chart transitions: 400ms ease-in-out
- Progress bar fill: 600ms ease-out

### Loading States
- Skeleton shimmer: 1500ms infinite loop
- Spinner rotation: 1000ms infinite loop
- Pulse effect: 2000ms infinite loop

---

## Accessibility Requirements

### Keyboard Navigation
- Tab order: Top to bottom, left to right
- Focus indicators: 2px blue outline
- Skip links: "Skip to main content"
- Escape key: Close modals/dropdowns

### Screen Reader Support
- ARIA labels on all interactive elements
- ARIA live regions for dynamic updates
- Semantic HTML (header, nav, main, section)
- Alt text for all icons and charts

### Color Contrast
- Text on white: Minimum 4.5:1 ratio
- Large text: Minimum 3:1 ratio
- Interactive elements: Minimum 3:1 ratio
- Focus indicators: Minimum 3:1 ratio

### Font Sizes
- Minimum body text: 14px
- Minimum caption text: 12px
- Line height: 1.5 for body text
- Letter spacing: Normal (no tight spacing)

---

**END OF VISUAL MOCKUPS**

