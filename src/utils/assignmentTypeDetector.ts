/**
 * Assignment Type Detector
 * 
 * Utility to detect which assessment types are present in an assignment
 * based on content_type, game_type, and other metadata.
 */

import { AssessmentType } from '@/types/assessmentTypes';

export interface AssignmentMetadata {
  game_type?: string;
  content_type?: string;
  game_config?: any;
  worksheet_data?: any;
  assessment_config?: any;
}

/**
 * Detects which assessment types are present in an assignment
 */
export function detectAssessmentTypes(assignment: AssignmentMetadata): AssessmentType[] {
  const types: AssessmentType[] = [];

  const gameType = assignment.game_type?.toLowerCase();
  const contentType = assignment.content_type?.toLowerCase();

  // Check game_config.assessmentConfig.selectedAssessments array for specific types
  if (assignment.game_config?.assessmentConfig?.selectedAssessments) {
    const selectedAssessments = assignment.game_config.assessmentConfig.selectedAssessments;
    for (const assessment of selectedAssessments) {
      const assessmentType = assessment.type?.toLowerCase();
      if (assessmentType === 'reading-comprehension') {
        types.push('reading-comprehension');
      } else if (assessmentType === 'aqa-reading' || assessmentType === 'gcse-reading' || assessmentType === 'reading') {
        types.push('aqa-reading');
      } else if (assessmentType === 'aqa-listening' || assessmentType === 'gcse-listening' || assessmentType === 'listening') {
        types.push('aqa-listening');
      } else if (assessmentType === 'aqa-dictation' || assessmentType === 'gcse-dictation' || assessmentType === 'dictation') {
        types.push('aqa-dictation');
      } else if (assessmentType === 'aqa-writing' || assessmentType === 'gcse-writing' || assessmentType === 'writing') {
        types.push('aqa-writing');
      } else if (assessmentType === 'four-skills') {
        types.push('four-skills');
      } else if (assessmentType === 'exam-style') {
        types.push('exam-style');
      }
    }
  }

  // Reading Comprehension
  if (contentType === 'reading-comprehension' || 
      gameType === 'reading-comprehension' ||
      assignment.worksheet_data?.type === 'reading-comprehension') {
    if (!types.includes('reading-comprehension')) {
      types.push('reading-comprehension');
    }
  }

  // AQA Reading
  if (contentType === 'aqa-reading' ||
      gameType === 'aqa-reading' ||
      assignment.assessment_config?.type === 'aqa-reading') {
    if (!types.includes('aqa-reading')) {
      types.push('aqa-reading');
    }
  }

  // AQA Listening
  if (contentType === 'aqa-listening' ||
      gameType === 'aqa-listening' ||
      assignment.assessment_config?.type === 'aqa-listening') {
    if (!types.includes('aqa-listening')) {
      types.push('aqa-listening');
    }
  }

  // AQA Dictation
  if (contentType === 'aqa-dictation' ||
      gameType === 'aqa-dictation' ||
      assignment.assessment_config?.type === 'aqa-dictation') {
    if (!types.includes('aqa-dictation')) {
      types.push('aqa-dictation');
    }
  }

  // AQA Writing
  if (contentType === 'aqa-writing' ||
      gameType === 'aqa-writing' ||
      assignment.assessment_config?.type === 'aqa-writing') {
    if (!types.includes('aqa-writing')) {
      types.push('aqa-writing');
    }
  }

  // Four Skills Assessment
  if (contentType === 'four-skills' ||
      gameType === 'four-skills' ||
      assignment.assessment_config?.type === 'four-skills') {
    if (!types.includes('four-skills')) {
      types.push('four-skills');
    }
  }

  // Exam Style Assessment
  if (contentType === 'exam-style' ||
      gameType === 'exam-style' ||
      assignment.assessment_config?.type === 'exam-style') {
    if (!types.includes('exam-style')) {
      types.push('exam-style');
    }
  }

  // Vocabulary Games
  if (gameType === 'vocabulary' ||
      gameType === 'vocab' ||
      gameType === 'mixed-mode' || // mixed-mode includes vocabulary
      assignment.game_config?.vocabularyConfig) {
    if (!types.includes('vocabulary-game')) {
      types.push('vocabulary-game');
    }
  }

  // Grammar/Skills Practice
  if (gameType === 'skills' ||
      gameType === 'grammar' ||
      gameType === 'mixed-mode' || // mixed-mode includes grammar
      assignment.game_config?.skillsConfig) {
    if (!types.includes('grammar-practice')) {
      types.push('grammar-practice');
    }
  }

  // Generic assessment type (fallback)
  if (gameType === 'assessment' && types.length === 0) {
    // Default to reading comprehension if no specific type detected
    types.push('reading-comprehension');
  }

  return types;
}

/**
 * Checks if an assignment contains any assessments that support detailed breakdown
 */
export function supportsDetailedBreakdown(assessmentTypes: AssessmentType[]): boolean {
  const detailedTypes: AssessmentType[] = [
    'reading-comprehension',
    'aqa-reading',
    'aqa-listening',
    'aqa-writing',
    'aqa-dictation',
    'four-skills',
    'exam-style'
  ];
  
  return assessmentTypes.some(type => detailedTypes.includes(type));
}

/**
 * Checks if an assignment contains any assessments that support teacher overrides
 */
export function supportsTeacherOverride(assessmentTypes: AssessmentType[]): boolean {
  const overrideableTypes: AssessmentType[] = [
    'reading-comprehension',
    'aqa-reading',
    'aqa-listening',
    'aqa-writing',
    'four-skills',
    'exam-style'
  ];
  
  return assessmentTypes.some(type => overrideableTypes.includes(type));
}

/**
 * Gets a human-readable display name for an assessment type
 */
export function getAssessmentTypeDisplayName(type: AssessmentType): string {
  const displayNames: Record<AssessmentType, string> = {
    'reading-comprehension': 'Reading Comprehension',
    'aqa-reading': 'AQA Reading',
    'aqa-listening': 'AQA Listening',
    'aqa-writing': 'AQA Writing',
    'aqa-dictation': 'AQA Dictation',
    'four-skills': 'Four Skills Assessment',
    'exam-style': 'Exam Style Assessment',
    'vocabulary-game': 'Vocabulary Game',
    'grammar-practice': 'Grammar Practice'
  };
  
  return displayNames[type] || type;
}
