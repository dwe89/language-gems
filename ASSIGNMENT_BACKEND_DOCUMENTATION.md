# Assignment Backend System Documentation

## Overview

This document outlines the complete backend system for handling game assignments with vocabulary integration, progress tracking, and analytics. The system provides APIs for teachers to create assignments and for students to access their assigned games with fixed vocabulary sets.

## 🏗️ Database Architecture

### Core Tables

1. **assignments** - Main assignment records
2. **vocabulary_assignment_lists** - Custom vocabulary lists for assignments  
3. **vocabulary_assignment_items** - Individual vocabulary items in lists
4. **assignment_progress** - Student progress on assignments
5. **student_vocabulary_assignment_progress** - Word-level progress tracking
6. **assignment_game_sessions** - Individual game session records

### Key Features

- **Vocabulary Freezing**: Random selections are frozen at assignment creation
- **Individual Tracking**: Each student's progress is tracked separately
- **Session Recording**: Detailed game session data for analytics
- **Word-Level Progress**: Track mastery of individual vocabulary items

## 🔄 API Endpoints

### 1. Assignment Creation: `POST /api/assignments/create`

Handles comprehensive assignment creation with vocabulary selection.

**Request Body:**
```typescript
{
  title: string;
  description?: string;
  gameType: string;
  classId: string;
  dueDate?: string;
  timeLimit?: number;
  points?: number;
  vocabularySelection: {
    type: 'all' | 'random_subset' | 'manual';
    themeId?: string;
    topicId?: string;
    wordCount?: number;
    specificWordIds?: number[];
  };
  gameConfig?: Record<string, any>;
}
```

**Features:**
- Validates teacher ownership of class
- Creates vocabulary list based on selection type
- **Freezes random selections** - ensures all students get same words
- Creates progress records for all students in class
- Supports all three vocabulary selection methods

**Example Usage:**
```javascript
// Create assignment with random 20 words from "Food" theme
const response = await fetch('/api/assignments/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: "Spanish Food Vocabulary",
    gameType: "word_blast",
    classId: "class-123",
    vocabularySelection: {
      type: "random_subset",
      themeId: "food",
      wordCount: 20
    }
  })
});
```

### 2. Student Assignment Access: `GET /api/assignments/[assignmentId]/vocabulary`

Students use this to get their assignment data and fixed vocabulary.

**Response:**
```typescript
{
  assignment: {
    id: string;
    title: string;
    gameType: string;
    timeLimit: number;
    points: number;
    gameConfig: object;
  };
  vocabulary: VocabularyItem[];
  studentProgress: ProgressRecord | null;
}
```

**Features:**
- Verifies student access (must be in assigned class)
- Returns the **exact same vocabulary list** for all students
- Creates progress record if doesn't exist
- Includes current student progress

### 3. Progress Tracking: `POST /api/assignments/[assignmentId]/progress`

Students send progress updates as they play games.

**Request Body:**
```typescript
{
  status: 'started' | 'in_progress' | 'completed';
  score?: number;
  accuracy?: number;
  timeSpent?: number;
  gameSession?: {
    sessionData: object;
    vocabularyPracticed: number[];
    wordsCorrect: number;
    wordsAttempted: number;
  };
  vocabularyProgress?: Array<{
    vocabularyId: number;
    attempts: number;
    correctAttempts: number;
    wasCorrect: boolean;
  }>;
}
```

**Features:**
- Updates overall assignment progress
- Records detailed game session data
- Tracks word-level performance
- Calculates mastery levels automatically

### 4. Teacher Analytics: `GET /api/assignments/[assignmentId]/analytics`

Comprehensive analytics for teachers.

**Response:**
```typescript
{
  assignment: AssignmentInfo;
  overall_stats: {
    total_students: number;
    completed: number;
    in_progress: number;
    not_started: number;
    average_score: number;
    average_accuracy: number;
    average_time_spent: number;
  };
  student_progress: StudentProgress[];
  vocabulary_performance: VocabularyStats[];
  class_info: ClassInfo;
}
```

## 🎮 Game Integration Flow

### For Teachers Creating Assignments:

1. **Choose Game**: Select from available games (Memory, Word Blast, etc.)
2. **Select Vocabulary**: 
   - All words from theme/topic
   - Random subset (e.g., 20 words from "Animals")
   - Manual selection of specific words
3. **Configure Game**: Set time limits, difficulty, game-specific options
4. **Assign to Class**: System creates progress records for all students

### For Students Playing Games:

1. **Access Assignment**: GET `/api/assignments/[id]/vocabulary`
   - Receives fixed vocabulary list
   - Gets game configuration
   - Sees current progress

2. **Play Game**: Game loads with assignment vocabulary
   - All students get identical word set
   - Game respects time limits and configuration

3. **Track Progress**: POST `/api/assignments/[id]/progress`
   - Send updates during/after gameplay
   - Record individual word performance
   - Update overall assignment status

### For Teachers Monitoring:

1. **View Analytics**: GET `/api/assignments/[id]/analytics`
   - See class-wide performance
   - Identify struggling students
   - Analyze vocabulary difficulty

## 📊 Vocabulary Selection Logic

### "All Words" Selection
```typescript
// Fetches all vocabulary from specified theme or topic
const allWords = await supabase
  .from('vocabulary')
  .select('id')
  .eq('theme', themeId);
```

### "Random Subset" Selection
```typescript
// Shuffles and picks first N words - FROZEN at creation
const shuffled = allWords.sort(() => 0.5 - Math.random());
const selectedWords = shuffled.slice(0, wordCount);
// These exact words are saved to vocabulary_assignment_items
```

### "Manual Selection" 
```typescript
// Teacher picks specific word IDs
const selectedWords = specificWordIds;
// Direct mapping to vocabulary_assignment_items
```

## 🎯 Progress Tracking Features

### Assignment Level
- Overall status (not_started → started → in_progress → completed)
- Final score and accuracy
- Total time spent
- Number of attempts

### Session Level  
- Individual game sessions
- Detailed session data (JSON)
- Words practiced in each session
- Performance metrics per session

### Word Level
- Attempts per vocabulary item
- Correct/incorrect responses
- Mastery level (0-5 scale)
- Response time tracking

## 🔐 Security & Access Control

### Row Level Security (RLS)
- Teachers can only access their own assignments
- Students can only access assignments from their classes
- Progress records are protected by user ownership

### API Validation
- Authentication required for all endpoints
- Class membership verification
- Teacher ownership validation
- Input sanitization and validation

## 🚀 Example Implementation

### Creating a Word Blast Assignment

```javascript
// Teacher creates assignment
const assignment = await fetch('/api/assignments/create', {
  method: 'POST',
  body: JSON.stringify({
    title: "Space Vocabulary Challenge",
    gameType: "word_blast",
    classId: "class-abc123",
    timeLimit: 10,
    points: 100,
    vocabularySelection: {
      type: "random_subset",
      themeId: "space",
      wordCount: 15
    },
    gameConfig: {
      powerUps: true,
      survivalMode: false,
      difficulty: "medium"
    }
  })
});
```

### Student Playing the Game

```javascript
// Student loads assignment
const { assignment, vocabulary } = await fetch(
  `/api/assignments/${assignmentId}/vocabulary`
).then(r => r.json());

// Game starts with fixed vocabulary
startWordBlastGame(vocabulary, assignment.gameConfig);

// During gameplay, track progress
await fetch(`/api/assignments/${assignmentId}/progress`, {
  method: 'POST',
  body: JSON.stringify({
    status: "in_progress",
    score: 750,
    accuracy: 0.85,
    vocabularyProgress: [
      { vocabularyId: 1, attempts: 3, correctAttempts: 2, wasCorrect: true },
      { vocabularyId: 2, attempts: 1, correctAttempts: 1, wasCorrect: true }
    ]
  })
});
```

### Teacher Viewing Results

```javascript
// Get comprehensive analytics
const analytics = await fetch(
  `/api/assignments/${assignmentId}/analytics`
).then(r => r.json());

console.log(`${analytics.overall_stats.completed}/${analytics.overall_stats.total_students} completed`);
console.log(`Average score: ${analytics.overall_stats.average_score}`);
console.log(`Vocabulary performance:`, analytics.vocabulary_performance);
```

## 🎨 Frontend Integration

The backend APIs are designed to work seamlessly with the existing games:

1. **Games Page**: Uses assignment data for "Assign" buttons
2. **Game Components**: Load vocabulary from assignment API
3. **Progress Tracking**: Send updates to progress API
4. **Teacher Dashboard**: Display analytics from analytics API

This system provides the complete foundation for assignment-based vocabulary learning games with comprehensive tracking and analytics. 