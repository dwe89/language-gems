# Unified Vocabulary Assignment System Implementation Guide

## 🎯 Overview

This guide provides step-by-step instructions for implementing the unified vocabulary assignment system across all Language Gems games. The system standardizes how games handle vocabulary assignments while maintaining game-specific customization.

## 🏗️ Architecture Components

### 1. Core Interfaces (`src/interfaces/UnifiedAssignmentInterface.ts`)
- **UnifiedAssignment**: Main assignment structure
- **VocabularyItem**: Standardized vocabulary format
- **GameProgressData**: Progress tracking structure
- **GameAssignmentInterface**: Interface all games must implement

### 2. Assignment Service (`src/services/UnifiedAssignmentService.ts`)
- Handles vocabulary loading from various sources
- Manages assignment progress tracking
- Integrates with gem progression system
- Provides analytics and reporting

### 3. Base Game Component (`src/components/games/BaseGameAssignment.tsx`)
- Abstract base class for game implementations
- Standardized progress tracking
- Session management
- React hook for assignment loading

### 4. KS4 Curriculum Support (`src/components/games/KS4CategorySystem.tsx`)
- Extended category system for GCSE level
- 8 main categories with 50+ subcategories
- Advanced vocabulary topics

## 📋 Implementation Steps for Each Game

### Step 1: Create Assignment Wrapper Component

```typescript
// Example: src/app/games/[game-name]/components/[GameName]AssignmentWrapper.tsx

import { BaseGameAssignment, useGameAssignment } from '../../../../components/games/BaseGameAssignment';
import { UnifiedAssignment, GameProgressData } from '../../../../interfaces/UnifiedAssignmentInterface';

class [GameName]AssignmentImpl extends BaseGameAssignment {
  validateAssignment(assignment: UnifiedAssignment): boolean {
    return assignment.gameType === '[game-type]';
  }

  calculateMaxScore(): number {
    // Game-specific max score calculation
    return this.vocabulary.length * 100;
  }
}

export default function [GameName]AssignmentWrapper({ assignmentId, onComplete }) {
  const { assignment, vocabulary, loading, error } = useGameAssignment(assignmentId);
  
  // Implementation details...
}
```

### Step 2: Update Game Settings to Support KS4

```typescript
// Add curriculum level support to game settings
interface GameSettingsProps {
  curriculumLevel?: 'KS3' | 'KS4';
  // ... other props
}

// Use in ModernCategorySelector
<ModernCategorySelector
  curriculumLevel={curriculumLevel}
  onCategorySelect={handleCategorySelect}
  // ... other props
/>
```

### Step 3: Integrate Progress Tracking

```typescript
// In game components, record word-level progress
const handleWordComplete = (word: string, isCorrect: boolean, responseTime: number) => {
  gameImplementation.recordWordProgress(
    vocabularyItem.id,
    vocabularyItem.word,
    vocabularyItem.translation,
    isCorrect,
    1, // attempts
    responseTime,
    hintsUsed
  );
};
```

### Step 4: Update Game Routes

```typescript
// Add assignment route to each game
// src/app/games/[game-name]/assignment/[assignmentId]/page.tsx

export default function GameAssignmentPage({ params }: { params: { assignmentId: string } }) {
  return (
    <GameAssignmentWrapper
      assignmentId={params.assignmentId}
      onAssignmentComplete={handleComplete}
      onBackToAssignments={() => router.push('/student-dashboard/assignments')}
    />
  );
}
```

## 🎮 Game-Specific Implementation Details

### Memory Game
- **Max Score**: `cardPairs * 100 * difficultyMultiplier`
- **Progress Tracking**: Track matches, attempts, time per pair
- **Special Config**: `cardPairs`, `flipTime`, `shuffleCards`

### Hangman
- **Max Score**: `wordCount * 100 * (7 - maxWrongGuesses) * 0.2`
- **Progress Tracking**: Track guesses, hints used, completion time
- **Special Config**: `maxWrongGuesses`, `showWordLength`, `hintsAllowed`

### Word Scramble
- **Max Score**: `wordCount * 50 * difficultyMultiplier`
- **Progress Tracking**: Track unscrambling time, hints used
- **Special Config**: `shuffleCount`, `showHints`, `timeLimit`

### Vocab Blast
- **Max Score**: `wordCount * 75 * accuracyBonus`
- **Progress Tracking**: Track reaction time, combo streaks
- **Special Config**: `objectSpeed`, `spawnRate`, `gameTime`

### Word Guesser
- **Max Score**: `wordCount * 80 * (7 - maxGuesses) * 0.15`
- **Progress Tracking**: Track guess efficiency, pattern recognition
- **Special Config**: `maxGuesses`, `wordLength`, `showHints`

### Sentence Towers
- **Max Score**: `sentenceCount * 150 * (typingMode ? 2 : 1)`
- **Progress Tracking**: Track construction time, accuracy
- **Special Config**: `typingMode`, `doublePoints`, `timeLimit`

## 📊 Database Integration

### Required Tables (Already Exist)
- `assignments` - Assignment metadata
- `assignment_progress` - Student progress tracking
- `vocabulary_assignment_lists` - Custom vocabulary lists
- `vocabulary_gem_collection` - Gem progression
- `student_vocabulary_practice` - Detailed word practice

### New Columns Added
- `assignments.vocabulary_criteria` - Game-specific configuration
- `assignments.vocabulary_count` - Word count limit
- Support for KS4 curriculum level in vocabulary tables

## 🔧 Teacher Dashboard Integration

### Enhanced Assignment Creator
```typescript
// Updated assignment creation workflow
const createAssignment = async (assignmentData) => {
  const assignment = await assignmentService.createEnhancedAssignment(teacherId, {
    title: "Spanish Food Vocabulary",
    gameType: "memory-game",
    vocabularyConfig: {
      source: "category",
      categoryId: "food_drink",
      subcategoryId: "meals",
      curriculumLevel: "KS4",
      wordCount: 20
    },
    gameConfig: {
      timeLimit: 300,
      hintsAllowed: true,
      gameSettings: {
        cardPairs: 10,
        flipTime: 1000
      }
    }
  });
};
```

### Assignment Analytics
- Real-time progress tracking
- Word-level performance analysis
- Class-wide completion rates
- Individual student insights

## 🎯 Student Experience

### Assignment Dashboard
- Unified assignment list across all games
- Progress indicators and due dates
- Direct game launch with assignment context
- Completion certificates and achievements

### In-Game Experience
- Assignment progress header
- Real-time score and accuracy tracking
- Seamless vocabulary delivery
- Automatic progress saving

## ✅ Testing Checklist

### For Each Game Implementation:
- [ ] Assignment wrapper component created
- [ ] KS3/KS4 curriculum support added
- [ ] Progress tracking implemented
- [ ] Assignment routes configured
- [ ] Game-specific scoring implemented
- [ ] Error handling for missing assignments
- [ ] Integration with gem progression
- [ ] Teacher analytics working
- [ ] Student dashboard integration

### System-Wide Testing:
- [ ] Cross-game assignment creation
- [ ] Vocabulary delivery consistency
- [ ] Progress tracking accuracy
- [ ] Database performance
- [ ] Error recovery mechanisms
- [ ] Mobile responsiveness
- [ ] Accessibility compliance

## 🚀 Deployment Strategy

### Phase 1: Core Infrastructure
1. Deploy unified interfaces and services
2. Update database schema
3. Add KS4 curriculum support

### Phase 2: Game Integration
1. Update Memory Game and Hangman (highest priority)
2. Update Word Scramble and Vocab Blast
3. Update remaining games

### Phase 3: Enhancement
1. Advanced analytics
2. Cross-game assignments
3. Performance optimizations

## 📈 Success Metrics

- **Consistency**: 100% of games use unified assignment system
- **Coverage**: Both KS3 and KS4 curriculum supported
- **Adoption**: Teachers actively creating assignments
- **Engagement**: Students completing assignments regularly
- **Performance**: Sub-2-second assignment loading times

---

*This implementation guide ensures consistent, high-quality vocabulary assignment functionality across all Language Gems games while maintaining the unique characteristics that make each game engaging.*
