# Proficiency Level System Migration

## Overview

Migrating teacher-facing vocabulary analytics from FSRS mastery_level (0-5) to simple 3-tier Proficiency Level system.

## Rationale

**Problem**: FSRS mastery_level shows 0.0/5 for words with 100% accuracy because FSRS requires multiple spaced reviews over time. This confuses teachers who see "100% accurate but 0 mastery".

**Solution**: Use simple Proficiency Levels based on current performance:
- 🔴 **Struggling**: Accuracy < 60% OR total_encounters < 3
- 🟡 **Learning**: Accuracy 60-89% AND total_encounters >= 3  
- 🟢 **Proficient**: Accuracy >= 90% AND total_encounters >= 5

## What Changes

### Keep FSRS (No Changes)
- `vocabulary_gem_collection.mastery_level` column - Keep for VocabMaster
- `vocabulary_gem_collection.fsrs_*` columns - Keep for spaced repetition
- FSRS scheduling logic in VocabMaster - No changes needed

### Update (Teacher Analytics Only)

#### 1. Type Definitions (`src/services/teacherVocabularyAnalytics.types.ts`)
✅ **DONE** - New file created with:
- `ProficiencyLevel` type
- `calculateProficiencyLevel()` function
- Updated interfaces with `proficientWords`, `learningWords`, `strugglingWords`
- Helper functions: `getProficiencyEmoji()`, `getProficiencyLabel()`, `getProficiencyColor()`

#### 2. Service Layer (`src/services/teacherVocabularyAnalytics.ts`)
**TODO** - Update methods:

**`getDetailedWordAnalytics()`** (lines 762-794):
```typescript
// BEFORE:
const avgMastery = group.masteryLevels.reduce((sum, m) => sum + m, 0) / group.masteryLevels.length;
const studentsMastered = Array.from(group.studentData.values()).filter(s => s.mastery >= 4).length;

wordDetails.push({
  masteryLevel: Math.round(avgMastery * 10) / 10,
  studentsMastered,
  // ...
});

// AFTER:
const proficiencyLevel = calculateProficiencyLevel(accuracy, group.totalEncounters);

let studentsStruggling = 0;
let studentsLearning = 0;
let studentsProficient = 0;

Array.from(group.studentData.values()).forEach(s => {
  const studentAccuracy = s.encounters > 0 ? (s.correct / s.encounters) * 100 : 0;
  const studentProficiency = calculateProficiencyLevel(studentAccuracy, s.encounters);
  
  if (studentProficiency === 'struggling') studentsStruggling++;
  else if (studentProficiency === 'learning') studentsLearning++;
  else if (studentProficiency === 'proficient') studentsProficient++;
});

wordDetails.push({
  proficiencyLevel,
  studentsStruggling,
  studentsLearning,
  studentsProficient,
  // ...
});
```

**`getStudentWordDetails()`** (lines 866-885):
```typescript
// BEFORE:
const strongWords = gems
  .filter(g => {
    const accuracy = g.total_encounters > 0 ? g.correct_encounters / g.total_encounters : 0;
    return g.mastery_level >= 4 || (accuracy >= 0.9 && g.total_encounters >= 3);
  })
  .map(g => ({
    masteryLevel: g.mastery_level,
    // ...
  }));

// AFTER:
const strongWords = gems
  .filter(g => {
    const accuracy = g.total_encounters > 0 ? (g.correct_encounters / g.total_encounters) * 100 : 0;
    const proficiency = calculateProficiencyLevel(accuracy, g.total_encounters);
    return proficiency === 'proficient';
  })
  .map(g => {
    const accuracy = g.total_encounters > 0 ? (g.correct_encounters / g.total_encounters) * 100 : 0;
    return {
      proficiencyLevel: calculateProficiencyLevel(accuracy, g.total_encounters),
      // ...
    };
  });
```

**`getStudentVocabularyProgress()`** (lines 255-320):
```typescript
// BEFORE:
const masteredWords = gemData.filter(g => g.mastery_level >= 4).length;

// AFTER:
let proficientWords = 0;
let learningWords = 0;
let strugglingWords = 0;

gemData.forEach(g => {
  const accuracy = g.total_encounters > 0 ? (g.correct_encounters / g.total_encounters) * 100 : 0;
  const proficiency = calculateProficiencyLevel(accuracy, g.total_encounters);
  
  if (proficiency === 'proficient') proficientWords++;
  else if (proficiency === 'learning') learningWords++;
  else if (proficiency === 'struggling') strugglingWords++;
});
```

**`getClassVocabularyStats()`** (lines 350-450):
```typescript
// BEFORE:
averageMasteredWords: studentProgress.reduce((sum, s) => sum + s.masteredWords, 0) / studentProgress.length

// AFTER:
proficientWords: studentProgress.reduce((sum, s) => sum + s.proficientWords, 0),
learningWords: studentProgress.reduce((sum, s) => sum + s.learningWords, 0),
strugglingWords: studentProgress.reduce((sum, s) => sum + s.strugglingWords, 0)
```

**`getTopicAnalysis()`** (lines 500-597):
```typescript
// BEFORE:
const masteredWords = topicGems.filter(g => g.mastery_level >= 4).length;

// AFTER:
let proficientWords = 0;
let learningWords = 0;
let strugglingWords = 0;

topicGems.forEach(g => {
  const accuracy = g.total_encounters > 0 ? (g.correct_encounters / g.total_encounters) * 100 : 0;
  const proficiency = calculateProficiencyLevel(accuracy, g.total_encounters);
  
  if (proficiency === 'proficient') proficientWords++;
  else if (proficiency === 'learning') learningWords++;
  else if (proficiency === 'struggling') strugglingWords++;
});
```

#### 3. Dashboard Component (`src/components/teacher/TeacherVocabularyAnalyticsDashboard.tsx`)

**Word Analysis View** (lines 804-860):
```typescript
// BEFORE:
<th>Avg Mastery</th>
<th>Students Mastered</th>

<td>
  <div className="flex items-center">
    <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2 max-w-[60px]">
      <div style={{ width: `${(word.masteryLevel / 5) * 100}%` }} />
    </div>
    <span>{word.masteryLevel.toFixed(1)} / 5</span>
  </div>
</td>
<td>{word.studentsMastered} students</td>

// AFTER:
<th>Proficiency</th>
<th>Students by Level</th>

<td>
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
    word.proficiencyLevel === 'proficient' ? 'bg-green-100 text-green-800' :
    word.proficiencyLevel === 'learning' ? 'bg-yellow-100 text-yellow-800' :
    'bg-red-100 text-red-800'
  }`}>
    {word.proficiencyLevel === 'proficient' ? '🟢 Proficient' :
     word.proficiencyLevel === 'learning' ? '🟡 Learning' :
     '🔴 Struggling'}
  </span>
</td>
<td>
  <div className="text-xs">
    <div>🟢 {word.studentsProficient} proficient</div>
    <div>🟡 {word.studentsLearning} learning</div>
    <div>🔴 {word.studentsStruggling} struggling</div>
  </div>
</td>
```

**Class Stats Cards** (lines 200-250):
```typescript
// BEFORE:
<StatCard
  title="Words Mastered"
  value={analytics.classStats.averageMasteredWords}
  // ...
/>

// AFTER:
<div className="grid grid-cols-3 gap-4">
  <StatCard
    title="Proficient Words"
    value={analytics.classStats.proficientWords}
    icon={<CheckCircle className="h-6 w-6 text-green-600" />}
    color="green"
  />
  <StatCard
    title="Learning Words"
    value={analytics.classStats.learningWords}
    icon={<Clock className="h-6 w-6 text-yellow-600" />}
    color="yellow"
  />
  <StatCard
    title="Struggling Words"
    value={analytics.classStats.strugglingWords}
    icon={<AlertCircle className="h-6 w-6 text-red-600" />}
    color="red"
  />
</div>
```

## Implementation Order

1. ✅ Create `teacherVocabularyAnalytics.types.ts` with new types
2. ⏳ Update `teacherVocabularyAnalytics.ts` service methods
3. ⏳ Update `TeacherVocabularyAnalyticsDashboard.tsx` component
4. ⏳ Test with real data
5. ⏳ Update any other components using the old types

## Testing Checklist

- [ ] Dashboard shows proficiency levels instead of mastery levels
- [ ] Words with 100% accuracy show as "Proficient" (not 0.0/5)
- [ ] Words with < 3 encounters show as "Struggling" regardless of accuracy
- [ ] Class stats show counts of proficient/learning/struggling words
- [ ] Student progress shows proficient/learning/struggling word counts
- [ ] VocabMaster still uses FSRS for spaced repetition (unchanged)
- [ ] No TypeScript errors in dashboard or service files

