// KS4 (GCSE) Category System for Language Gems
// This extends the KS3 system with more advanced vocabulary and topics

import { Category } from './ModernCategorySelector';
import {
  Globe,
  GraduationCap,
  Palette,
  Rocket,
  Book,
  Sparkles,
  Lightbulb,
  Mic,
  Shirt
} from 'lucide-react';

// AQA Categories with proper theme -> unit mapping
export const AQA_VOCABULARY_CATEGORIES: Category[] = [
  {
    id: 'aqa_general',
    name: 'aqa_general',
    displayName: 'General',
    icon: Book,
    color: 'from-blue-600 to-indigo-700',
    subcategories: [
      { id: 'General', name: 'General', displayName: 'General', categoryId: 'aqa_general' }
    ]
  },
  {
    id: 'aqa_communication',
    name: 'aqa_communication',
    displayName: 'Communication and the World Around Us',
    icon: Globe,
    color: 'from-green-600 to-emerald-700',
    subcategories: [
      { id: 'Environment and where people live', name: 'Environment and where people live', displayName: 'Environment and Where People Live', categoryId: 'aqa_communication' },
      { id: 'Media and technology', name: 'Media and technology', displayName: 'Media and Technology', categoryId: 'aqa_communication' },
      { id: 'Travel and tourism', name: 'Travel and tourism', displayName: 'Travel and Tourism', categoryId: 'aqa_communication' }
    ]
  },
  {
    id: 'aqa_people_lifestyle',
    name: 'aqa_people_lifestyle',
    displayName: 'People and Lifestyle',
    icon: Mic,
    color: 'from-purple-600 to-indigo-700',
    subcategories: [
      { id: 'Education and work', name: 'Education and work', displayName: 'Education and Work', categoryId: 'aqa_people_lifestyle' },
      { id: 'Healthy living and lifestyle', name: 'Healthy living and lifestyle', displayName: 'Healthy Living and Lifestyle', categoryId: 'aqa_people_lifestyle' },
      { id: 'Identity and relationships', name: 'Identity and relationships', displayName: 'Identity and Relationships', categoryId: 'aqa_people_lifestyle' }
    ]
  },
  {
    id: 'aqa_popular_culture',
    name: 'aqa_popular_culture',
    displayName: 'Popular Culture',
    icon: Sparkles,
    color: 'from-pink-600 to-rose-700',
    subcategories: [
      { id: 'Celebrity culture', name: 'Celebrity culture', displayName: 'Celebrity Culture', categoryId: 'aqa_popular_culture' },
      { id: 'Customs, festivals and celebrations', name: 'Customs, festivals and celebrations', displayName: 'Customs, Festivals and Celebrations', categoryId: 'aqa_popular_culture' },
      { id: 'Free time activities', name: 'Free time activities', displayName: 'Free Time Activities', categoryId: 'aqa_popular_culture' }
    ]
  },
  {
    id: 'aqa_cultural_items',
    name: 'aqa_cultural_items',
    displayName: 'Cultural Items',
    icon: Palette,
    color: 'from-orange-600 to-red-700',
    subcategories: [
      { id: 'Cultural items', name: 'Cultural items', displayName: 'Cultural Items', categoryId: 'aqa_cultural_items' }
    ]
  }
];

// Edexcel Categories with proper theme -> unit mapping
export const EDEXCEL_VOCABULARY_CATEGORIES: Category[] = [
  {
    id: 'edexcel_general',
    name: 'edexcel_general',
    displayName: 'General',
    icon: Book,
    color: 'from-blue-600 to-indigo-700',
    subcategories: [
      { id: 'General and grammatical', name: 'General and grammatical', displayName: 'General and Grammatical', categoryId: 'edexcel_general' }
    ]
  },
  {
    id: 'edexcel_personal_world',
    name: 'edexcel_personal_world',
    displayName: 'My Personal World',
    icon: Mic,
    color: 'from-purple-600 to-indigo-700',
    subcategories: [
      { id: 'Equality', name: 'Equality', displayName: 'Equality', categoryId: 'edexcel_personal_world' },
      { id: 'Family', name: 'Family', displayName: 'Family', categoryId: 'edexcel_personal_world' },
      { id: 'Friends', name: 'Friends', displayName: 'Friends', categoryId: 'edexcel_personal_world' },
      { id: 'Friendship', name: 'Friendship', displayName: 'Friendship', categoryId: 'edexcel_personal_world' },
      { id: 'Friendships', name: 'Friendships', displayName: 'Friendships', categoryId: 'edexcel_personal_world' },
      { id: 'Relationships', name: 'Relationships', displayName: 'Relationships', categoryId: 'edexcel_personal_world' }
    ]
  },
  {
    id: 'edexcel_neighborhood',
    name: 'edexcel_neighborhood',
    displayName: 'My Neighborhood',
    icon: Globe,
    color: 'from-green-600 to-emerald-700',
    subcategories: [
      { id: 'Environmental issues', name: 'Environmental issues', displayName: 'Environmental Issues', categoryId: 'edexcel_neighborhood' },
      { id: 'Food and drink', name: 'Food and drink', displayName: 'Food and Drink', categoryId: 'edexcel_neighborhood' },
      { id: 'Mental wellbeing', name: 'Mental wellbeing', displayName: 'Mental Wellbeing', categoryId: 'edexcel_neighborhood' },
      { id: 'Physical wellbeing', name: 'Physical wellbeing', displayName: 'Physical Wellbeing', categoryId: 'edexcel_neighborhood' },
      { id: 'Places in town', name: 'Places in town', displayName: 'Places in Town', categoryId: 'edexcel_neighborhood' },
      { id: 'Shopping', name: 'Shopping', displayName: 'Shopping', categoryId: 'edexcel_neighborhood' },
      { id: 'Sports', name: 'Sports', displayName: 'Sports', categoryId: 'edexcel_neighborhood' },
      { id: 'The natural world', name: 'The natural world', displayName: 'The Natural World', categoryId: 'edexcel_neighborhood' },
      { id: 'Transport', name: 'Transport', displayName: 'Transport', categoryId: 'edexcel_neighborhood' }
    ]
  },
  {
    id: 'edexcel_studying_future',
    name: 'edexcel_studying_future',
    displayName: 'Studying and My Future',
    icon: GraduationCap,
    color: 'from-indigo-600 to-purple-700',
    subcategories: [
      { id: 'Future opportunities', name: 'Future opportunities', displayName: 'Future Opportunities', categoryId: 'edexcel_studying_future' },
      { id: 'School', name: 'School', displayName: 'School', categoryId: 'edexcel_studying_future' }
    ]
  },
  {
    id: 'edexcel_travel_tourism',
    name: 'edexcel_travel_tourism',
    displayName: 'Travel and Tourism',
    icon: Rocket,
    color: 'from-orange-600 to-red-700',
    subcategories: [
      { id: 'Accommodation', name: 'Accommodation', displayName: 'Accommodation', categoryId: 'edexcel_travel_tourism' },
      { id: 'Tourist attractions', name: 'Tourist attractions', displayName: 'Tourist Attractions', categoryId: 'edexcel_travel_tourism' }
    ]
  },
  {
    id: 'edexcel_media_technology',
    name: 'edexcel_media_technology',
    displayName: 'Media and Technology',
    icon: Lightbulb,
    color: 'from-cyan-600 to-blue-700',
    subcategories: [
      { id: 'Music', name: 'Music', displayName: 'Music', categoryId: 'edexcel_media_technology' },
      { id: 'Social media and gaming', name: 'Social media and gaming', displayName: 'Social Media and Gaming', categoryId: 'edexcel_media_technology' },
      { id: 'TV and film', name: 'TV and film', displayName: 'TV and Film', categoryId: 'edexcel_media_technology' }
    ]
  },
  {
    id: 'edexcel_cultural',
    name: 'edexcel_cultural',
    displayName: 'Cultural',
    icon: Palette,
    color: 'from-pink-600 to-rose-700',
    subcategories: [
      { id: 'Cultural and geographical', name: 'Cultural and geographical', displayName: 'Cultural and Geographical', categoryId: 'edexcel_cultural' }
    ]
  }
];

// Combined for backward compatibility (will be deprecated)
export const KS4_VOCABULARY_CATEGORIES: Category[] = [...AQA_VOCABULARY_CATEGORIES, ...EDEXCEL_VOCABULARY_CATEGORIES];

// Curriculum level type
export type CurriculumLevel = 'KS3' | 'KS4';

// Get categories by curriculum level and exam board
export function getCategoriesByCurriculum(level: CurriculumLevel, examBoard?: 'AQA' | 'edexcel'): Category[] {
  if (level === 'KS4') {
    if (examBoard === 'AQA') {
      return AQA_VOCABULARY_CATEGORIES;
    } else if (examBoard === 'edexcel') {
      return EDEXCEL_VOCABULARY_CATEGORIES;
    }
    // If no exam board specified, return combined (for backward compatibility)
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