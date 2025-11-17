type LanguageFormat = 'full' | 'iso';

type TopicMapping = {
  category: string;
  subcategory: string;
};

const LANGUAGE_MAP: Record<string, { full: 'spanish' | 'french' | 'german'; iso: 'es' | 'fr' | 'de' }> = {
  spanish: { full: 'spanish', iso: 'es' },
  es: { full: 'spanish', iso: 'es' },
  espanol: { full: 'spanish', iso: 'es' },
  castellano: { full: 'spanish', iso: 'es' },
  french: { full: 'french', iso: 'fr' },
  fr: { full: 'french', iso: 'fr' },
  francais: { full: 'french', iso: 'fr' },
  german: { full: 'german', iso: 'de' },
  de: { full: 'german', iso: 'de' },
  deutsch: { full: 'german', iso: 'de' }
};

const AQA_TOPIC_MAPPING: Record<string, TopicMapping> = {
  me_family_friends: { category: 'identity_personal_life', subcategory: 'family_friends' },
  technology: { category: 'technology_media', subcategory: 'mobile_phones_social_media' },
  free_time: { category: 'free_time_leisure', subcategory: 'hobbies_interests' },
  customs_festivals: { category: 'holidays_travel_culture', subcategory: 'festivals_celebrations' },
  home_town_region: { category: 'home_local_area', subcategory: 'places_in_town' },
  social_issues: { category: 'social_global_issues', subcategory: 'social_issues' },
  global_issues: { category: 'social_global_issues', subcategory: 'global_problems_solutions' },
  travel_tourism: { category: 'holidays_travel_culture', subcategory: 'travel_destinations_types' },
  education: { category: 'school_jobs_future', subcategory: 'school_life' },
  career_plans: { category: 'school_jobs_future', subcategory: 'future_ambitions' },
  jobs: { category: 'school_jobs_future', subcategory: 'professions_jobs' }
};

const EDEXCEL_TOPIC_MAPPING: Record<string, TopicMapping> = {
  who_am_i: { category: 'identity_personal_life', subcategory: 'personal_information' },
  daily_life: { category: 'daily_life', subcategory: 'daily_routine' },
  cultural_life: { category: 'holidays_travel_culture', subcategory: 'festivals_celebrations' },
  identity_culture: { category: 'identity_personal_life', subcategory: 'family_friends' },
  holidays: { category: 'holidays_travel_culture', subcategory: 'holiday_activities' },
  travel_transport: { category: 'holidays_travel_culture', subcategory: 'transport' },
  town_region: { category: 'home_local_area', subcategory: 'places_in_town' },
  school_life: { category: 'school_jobs_future', subcategory: 'school_life' },
  school_studies: { category: 'school_jobs_future', subcategory: 'school_subjects' },
  using_languages_beyond_classroom: { category: 'school_jobs_future', subcategory: 'future_ambitions' },
  ambitions: { category: 'school_jobs_future', subcategory: 'future_ambitions' },
  work: { category: 'school_jobs_future', subcategory: 'professions_jobs' },
  bringing_world_together: { category: 'social_global_issues', subcategory: 'global_problems_solutions' },
  environmental_issues: { category: 'nature_environment', subcategory: 'environmental_issues' }
};

function safeLookupLanguage(language?: string) {
  const key = language?.toLowerCase() ?? 'spanish';
  return LANGUAGE_MAP[key] || LANGUAGE_MAP.spanish;
}

export function normalizeAssessmentLanguage(language?: string, format: LanguageFormat = 'full'): 'spanish' | 'french' | 'german' | 'es' | 'fr' | 'de' {
  const entry = safeLookupLanguage(language);
  return format === 'iso' ? entry.iso : entry.full;
}

export function normalizeExamBoard(examBoard?: string): 'AQA' | 'Edexcel' | 'General' {
  const value = (examBoard || 'AQA').toLowerCase();
  if (value === 'edexcel') return 'Edexcel';
  if (value === 'general') return 'General';
  return 'AQA';
}

export function mapKs4TopicToCategory(topic?: string, examBoard?: string): TopicMapping | null {
  if (!topic) return null;
  const normalizedTopic = topic.toLowerCase();
  const board = normalizeExamBoard(examBoard);

  const mapping = board === 'Edexcel' ? EDEXCEL_TOPIC_MAPPING : AQA_TOPIC_MAPPING;
  return mapping[normalizedTopic] || null;
}

export function resolveReadingFilters(instanceConfig: any): { category?: string; subcategory?: string } {
  if (!instanceConfig) {
    return {};
  }

  const level = instanceConfig.level || 'KS3';
  const examBoard = instanceConfig.examBoard;

  if (level === 'KS4') {
    const mapped = mapKs4TopicToCategory(instanceConfig.topic, examBoard);
    if (mapped) {
      return mapped;
    }
  }

  // KS3 or fallback – assume provided category/subcategory already match DB schema
  return {
    category: instanceConfig.category,
    subcategory: instanceConfig.subcategory
  };
}

export function extractAssessmentInstance(gameConfig: any, assessmentType: string): any | null {
  if (!gameConfig?.assessmentConfig?.selectedAssessments) {
    return null;
  }

  return gameConfig.assessmentConfig.selectedAssessments.find(
    (assessment: any) => assessment.type === assessmentType
  ) || null;
}
