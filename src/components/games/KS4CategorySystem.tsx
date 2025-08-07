// KS4 (GCSE) Category System for Language Gems
// This extends the KS3 system with more advanced vocabulary and topics

import { Category, Subcategory } from './ModernCategorySelector';
import {
  Globe,
  Heart,
  GraduationCap,
  Palette,
  Syringe, // Changed from Hospital to Syringe (Lucide does not have 'Hospital')
  Rocket,
  Leaf,
  Globe2,
  Book,
  Sparkles,
  Lightbulb,
  Droplets,
  Scale,
  Mic,
  Activity
} from 'lucide-react';

export const KS4_VOCABULARY_CATEGORIES: Category[] = [
  {
    id: 'identity_culture_ks4',
    name: 'identity_culture_ks4',
    displayName: 'Identity & Culture (GCSE)', // Added missing displayName
    icon: Mic,
    color: 'from-purple-600 to-indigo-700',
    subcategories: [
      { id: 'personal_identity_values', name: 'personal_identity_values', displayName: 'Personal Identity & Values', categoryId: 'identity_culture_ks4' },
      { id: 'cultural_identity', name: 'cultural_identity', displayName: 'Cultural Identity', categoryId: 'identity_culture_ks4' },
      { id: 'multiculturalism', name: 'multiculturalism', displayName: 'Multiculturalism', categoryId: 'identity_culture_ks4' },
      { id: 'traditions_customs', name: 'traditions_customs', displayName: 'Traditions & Customs', categoryId: 'identity_culture_ks4' },
      { id: 'language_identity', name: 'language_identity', displayName: 'Language & Identity', categoryId: 'identity_culture_ks4' },
      { id: 'generational_differences', name: 'generational_differences', displayName: 'Generational Differences', categoryId: 'identity_culture_ks4' },
      { id: 'regional_variations', name: 'regional_variations', displayName: 'Regional Variations', categoryId: 'identity_culture_ks4' }
    ]
  },
  {
    id: 'relationships_choices_ks4',
    name: 'relationships_choices_ks4',
    displayName: 'Relationships & Choices (GCSE)', // Added missing displayName
    icon: Sparkles,
    color: 'from-pink-600 to-rose-700',
    subcategories: [
      { id: 'family_relationships_advanced', name: 'family_relationships_advanced', displayName: 'Family Relationships (Advanced)', categoryId: 'relationships_choices_ks4' },
      { id: 'friendship_peer_pressure', name: 'friendship_peer_pressure', displayName: 'Friendship & Peer Pressure', categoryId: 'relationships_choices_ks4' },
      { id: 'romantic_relationships', name: 'romantic_relationships', displayName: 'Romantic Relationships', categoryId: 'relationships_choices_ks4' },
      { id: 'marriage_partnerships', name: 'marriage_partnerships', displayName: 'Marriage & Partnerships', categoryId: 'relationships_choices_ks4' },
      { id: 'conflict_resolution', name: 'conflict_resolution', displayName: 'Conflict Resolution', categoryId: 'relationships_choices_ks4' },
      { id: 'social_networks', name: 'social_networks', displayName: 'Social Networks', categoryId: 'relationships_choices_ks4' },
      { id: 'life_choices_decisions', name: 'life_choices_decisions', displayName: 'Life Choices & Decisions', categoryId: 'relationships_choices_ks4' }
    ]
  },
  {
    id: 'education_employment_ks4',
    name: 'education_employment_ks4',
    displayName: 'Education & Employment (GCSE)',
    icon: Book,
    color: 'from-blue-600 to-cyan-700',
    subcategories: [
      { id: 'education_systems', name: 'education_systems', displayName: 'Education Systems', categoryId: 'education_employment_ks4' },
      { id: 'academic_subjects_advanced', name: 'academic_subjects_advanced', displayName: 'Academic Subjects (Advanced)', categoryId: 'education_employment_ks4' },
      { id: 'higher_education', name: 'higher_education', displayName: 'Higher Education', categoryId: 'education_employment_ks4' },
      { id: 'career_planning', name: 'career_planning', displayName: 'Career Planning', categoryId: 'education_employment_ks4' },
      { id: 'job_applications', name: 'job_applications', displayName: 'Job Applications', categoryId: 'education_employment_ks4' },
      { id: 'workplace_skills', name: 'workplace_skills', displayName: 'Workplace Skills', categoryId: 'education_employment_ks4' },
      { id: 'unemployment_economy', name: 'unemployment_economy', displayName: 'Unemployment & Economy', categoryId: 'education_employment_ks4' },
      { id: 'entrepreneurship', name: 'entrepreneurship', displayName: 'Entrepreneurship', categoryId: 'education_employment_ks4' }
    ]
  },
  {
    id: 'leisure_lifestyle_ks4',
    name: 'leisure_lifestyle_ks4',
    displayName: 'Leisure & Lifestyle (GCSE)',
    icon: Palette,
    color: 'from-green-600 to-teal-700',
    subcategories: [
      { id: 'arts_culture', name: 'arts_culture', displayName: 'Arts & Culture', categoryId: 'leisure_lifestyle_ks4' },
      { id: 'literature_reading', name: 'literature_reading', displayName: 'Literature & Reading', categoryId: 'leisure_lifestyle_ks4' },
      { id: 'cinema_theatre', name: 'cinema_theatre', displayName: 'Cinema & Theatre', categoryId: 'leisure_lifestyle_ks4' },
      { id: 'music_performance', name: 'music_performance', displayName: 'Music & Performance', categoryId: 'leisure_lifestyle_ks4' },
      { id: 'sports_fitness', name: 'sports_fitness', displayName: 'Sports & Fitness', categoryId: 'leisure_lifestyle_ks4' },
      { id: 'fashion_trends', name: 'fashion_trends', displayName: 'Fashion & Trends', categoryId: 'leisure_lifestyle_ks4' },
      { id: 'youth_culture', name: 'youth_culture', displayName: 'Youth Culture', categoryId: 'leisure_lifestyle_ks4' },
      { id: 'digital_entertainment', name: 'digital_entertainment', displayName: 'Digital Entertainment', categoryId: 'leisure_lifestyle_ks4' }
    ]
  },
  {
    id: 'health_wellbeing_ks4',
    name: 'health_wellbeing_ks4',
    displayName: 'Health & Wellbeing (GCSE)',
    icon: Activity,
    color: 'from-red-600 to-pink-700',
    subcategories: [
      { id: 'mental_health', name: 'mental_health', displayName: 'Mental Health', categoryId: 'health_wellbeing_ks4' },
      { id: 'physical_fitness', name: 'physical_fitness', displayName: 'Physical Fitness', categoryId: 'health_wellbeing_ks4' },
      { id: 'nutrition_diet', name: 'nutrition_diet', displayName: 'Nutrition & Diet', categoryId: 'health_wellbeing_ks4' },
      { id: 'healthcare_systems', name: 'healthcare_systems', displayName: 'Healthcare Systems', categoryId: 'health_wellbeing_ks4' },
      { id: 'addiction_substance_abuse', name: 'addiction_substance_abuse', displayName: 'Addiction & Substance Abuse', categoryId: 'health_wellbeing_ks4' },
      { id: 'stress_management', name: 'stress_management', displayName: 'Stress Management', categoryId: 'health_wellbeing_ks4' },
      { id: 'public_health', name: 'public_health', displayName: 'Public Health', categoryId: 'health_wellbeing_ks4' }
    ]
  },
  {
    id: 'technology_future_ks4',
    name: 'technology_future_ks4',
    displayName: 'Technology & Future (GCSE)',
    icon: Lightbulb,
    color: 'from-indigo-600 to-purple-700',
    subcategories: [
      { id: 'digital_revolution', name: 'digital_revolution', displayName: 'Digital Revolution', categoryId: 'technology_future_ks4' },
      { id: 'artificial_intelligence', name: 'artificial_intelligence', displayName: 'Artificial Intelligence', categoryId: 'technology_future_ks4' },
      { id: 'social_media_impact', name: 'social_media_impact', displayName: 'Social Media Impact', categoryId: 'technology_future_ks4' },
      { id: 'cybersecurity_privacy', name: 'cybersecurity_privacy', displayName: 'Cybersecurity & Privacy', categoryId: 'technology_future_ks4' },
      { id: 'future_careers', name: 'future_careers', displayName: 'Future Careers', categoryId: 'technology_future_ks4' },
      { id: 'innovation_research', name: 'innovation_research', displayName: 'Innovation & Research', categoryId: 'technology_future_ks4' },
      { id: 'digital_citizenship', name: 'digital_citizenship', displayName: 'Digital Citizenship', categoryId: 'technology_future_ks4' }
    ]
  },
  {
    id: 'environment_sustainability_ks4',
    name: 'environment_sustainability_ks4',
    displayName: 'Environment & Sustainability (GCSE)',
    icon: Droplets,
    color: 'from-green-700 to-emerald-800',
    subcategories: [
      { id: 'climate_change', name: 'climate_change', displayName: 'Climate Change', categoryId: 'environment_sustainability_ks4' },
      { id: 'renewable_energy', name: 'renewable_energy', displayName: 'Renewable Energy', categoryId: 'environment_sustainability_ks4' },
      { id: 'conservation_biodiversity', name: 'conservation_biodiversity', displayName: 'Conservation & Biodiversity', categoryId: 'environment_sustainability_ks4' },
      { id: 'pollution_solutions', name: 'pollution_solutions', displayName: 'Pollution & Solutions', categoryId: 'environment_sustainability_ks4' },
      { id: 'sustainable_living', name: 'sustainable_living', displayName: 'Sustainable Living', categoryId: 'environment_sustainability_ks4' },
      { id: 'environmental_activism', name: 'environmental_activism', displayName: 'Environmental Activism', categoryId: 'environment_sustainability_ks4' },
      { id: 'green_technology', name: 'green_technology', displayName: 'Green Technology', categoryId: 'environment_sustainability_ks4' }
    ]
  },
  {
    id: 'global_issues_ks4',
    name: 'global_issues_ks4',
    displayName: 'Global Issues (GCSE)',
    icon: Scale,
    color: 'from-slate-700 to-gray-800',
    subcategories: [
      { id: 'poverty_inequality', name: 'poverty_inequality', displayName: 'Poverty & Inequality', categoryId: 'global_issues_ks4' },
      { id: 'human_rights_advanced', name: 'human_rights_advanced', displayName: 'Human Rights (Advanced)', categoryId: 'global_issues_ks4' },
      { id: 'migration_refugees', name: 'migration_refugees', displayName: 'Migration & Refugees', categoryId: 'global_issues_ks4' },
      { id: 'international_relations', name: 'international_relations', displayName: 'International Relations', categoryId: 'global_issues_ks4' },
      { id: 'conflict_peace', name: 'conflict_peace', displayName: 'Conflict & Peace', categoryId: 'global_issues_ks4' },
      { id: 'globalization', name: 'globalization', displayName: 'Globalization', categoryId: 'global_issues_ks4' },
      { id: 'international_cooperation', name: 'international_cooperation', displayName: 'International Cooperation', categoryId: 'global_issues_ks4' }
    ]
  }
];

// Curriculum level type
export type CurriculumLevel = 'KS3' | 'KS4';

// Combined categories function
export function getCategoriesByCurriculum(level: CurriculumLevel): Category[] {
  if (level === 'KS4') {
    return KS4_VOCABULARY_CATEGORIES;
  }
  // Import KS3 categories from ModernCategorySelector
  const { VOCABULARY_CATEGORIES } = require('./ModernCategorySelector');
  return VOCABULARY_CATEGORIES;
}

// Get all categories (both KS3 and KS4)
export function getAllCategories(): { ks3: Category[], ks4: Category[] } {
  const { VOCABULARY_CATEGORIES } = require('./ModernCategorySelector');
  return {
    ks3: VOCABULARY_CATEGORIES,
    ks4: KS4_VOCABULARY_CATEGORIES
  };
}