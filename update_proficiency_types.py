#!/usr/bin/env python3
"""
Update teacherVocabularyAnalytics.ts to use Proficiency Level system
"""

import re

# Read the file
with open('src/services/teacherVocabularyAnalytics.ts', 'r') as f:
    content = f.read()

# Add type definition and helper function at the top
new_header = """import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Simple 3-tier proficiency system for teacher-facing analytics
 * 🔴 Struggling: Accuracy < 60% OR total_encounters < 3
 * 🟡 Learning: Accuracy 60-89% AND total_encounters >= 3
 * 🟢 Proficient: Accuracy >= 90% AND total_encounters >= 5
 */
export type ProficiencyLevel = 'struggling' | 'learning' | 'proficient';

/**
 * Calculate proficiency level based on accuracy and exposure
 */
export function calculateProficiencyLevel(
  accuracy: number,
  totalEncounters: number
): ProficiencyLevel {
  if (accuracy < 60 || totalEncounters < 3) {
    return 'struggling';
  }
  if (accuracy >= 90 && totalEncounters >= 5) {
    return 'proficient';
  }
  return 'learning';
}

"""

# Replace the import line
content = re.sub(r"^import.*SupabaseClient.*$", new_header.strip(), content, flags=re.MULTILINE)

# Update StudentVocabularyProgress interface
content = re.sub(
    r'(export interface StudentVocabularyProgress \{[^}]+)masteredWords: number;',
    r'\1proficientWords: number;\n  learningWords: number;',
    content
)
content = re.sub(
    r'(export interface StudentVocabularyProgress \{[^}]+)memoryStrength: number;\n  ',
    r'\1',
    content
)
content = re.sub(
    r'(export interface StudentVocabularyProgress \{[^}]+)wordsReadyForReview: number;\n  ',
    r'\1',
    content
)

# Update ClassVocabularyStats interface
content = re.sub(
    r'averageMasteredWords: number;',
    'proficientWords: number;\n  learningWords: number;',
    content
)
content = re.sub(
    r'classAverageMemoryStrength: number;\n  ',
    '',
    content
)

# Update TopicAnalysis interface
content = re.sub(
    r'(export interface TopicAnalysis \{[^}]+)masteredWords: number;',
    r'\1proficientWords: number;\n  learningWords: number;',
    content
)

# Update VocabularyTrend interface
content = re.sub(
    r'(export interface VocabularyTrend \{[^}]+)masteredWords: number;',
    r'\1proficientWords: number;\n  learningWords: number;\n  strugglingWords: number;',
    content
)

# Update WordDetail interface
content = re.sub(
    r'masteryLevel: number;',
    'proficiencyLevel: ProficiencyLevel;',
    content
)
content = re.sub(
    r'studentsMastered: number;',
    'studentsProficient: number;\n  studentsLearning: number;',
    content
)

# Write the updated content
with open('src/services/teacherVocabularyAnalytics.ts', 'w') as f:
    f.write(content)

print("✅ Types updated successfully!")
print("📝 Updated interfaces:")
print("  - StudentVocabularyProgress: masteredWords → proficientWords + learningWords")
print("  - ClassVocabularyStats: averageMasteredWords → proficientWords + learningWords")
print("  - TopicAnalysis: masteredWords → proficientWords + learningWords")
print("  - VocabularyTrend: masteredWords → proficientWords + learningWords + strugglingWords")
print("  - WordDetail: masteryLevel → proficiencyLevel")
print("  - WordDetail: studentsMastered → studentsProficient + studentsLearning")

