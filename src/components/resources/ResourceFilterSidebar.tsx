'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Filter as FilterIcon } from 'lucide-react';

export interface FilterState {
  language: string;
  keyStage: string;
  examBoard: string;
  category: string;      // KS3 category
  subcategory: string;   // KS3 subcategory (within category)
  theme: string;         // KS4 theme
  topic: string;         // KS4 topic (within theme)
  resourceType: string;
  skill: string;
  priceRange: 'all' | 'free' | 'paid';
  search: string;
}

interface ResourceFilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
  className?: string;
  isMobile?: boolean;
  onClose?: () => void;
}

const LANGUAGES = [
  { value: '', label: 'All Languages' },
  { value: 'spanish', label: 'Spanish' },
  { value: 'french', label: 'French' },
  { value: 'german', label: 'German' }
];

const KEY_STAGES = [
  { value: '', label: 'All Levels' },
  { value: 'ks3', label: 'KS3 (Years 7-9)' },
  { value: 'ks4', label: 'KS4 (GCSE)' },
  { value: 'ks5', label: 'KS5 (A-Level)' }
];

const RESOURCE_TYPES = [
  { value: '', label: 'All Types' },
  { value: 'exam-practice', label: 'Exam Practice Materials' },
  { value: 'assessment-tools', label: 'Assessment Tools' },
  { value: 'booklets-guides', label: 'Booklets & Guides' },
  { value: 'worksheets', label: 'Worksheets' },
  { value: 'knowledge-organisers', label: 'Knowledge Organisers' },
  { value: 'lesson-resources', label: 'Lesson Resources' },
  { value: 'audio-video', label: 'Audio/Video Resources' },
  { value: 'interactive', label: 'Interactive Resources' }
];

const SKILLS = [
  { value: '', label: 'All Skills' },
  { value: 'reading', label: 'Reading' },
  { value: 'writing', label: 'Writing' },
  { value: 'listening', label: 'Listening' },
  { value: 'speaking', label: 'Speaking' }
];

const EXAM_BOARDS = [
  { value: '', label: 'All Exam Boards' },
  { value: 'aqa', label: 'AQA' },
  { value: 'edexcel', label: 'Edexcel' }
];

// KS3 Categories with Subcategories (from centralized_vocabulary database)
const KS3_CATEGORIES = [
  {
    value: 'basics_core_language',
    label: 'Basics & Core Language',
    subcategories: [
      { value: 'greetings_introductions', label: 'Greetings & Introductions' },
      { value: 'common_phrases', label: 'Common Phrases' },
      { value: 'opinions', label: 'Opinions' },
      { value: 'numbers_1_30', label: 'Numbers 1-30' },
      { value: 'numbers_40_100', label: 'Numbers 40-100' },
      { value: 'colours', label: 'Colours' },
      { value: 'days', label: 'Days' },
      { value: 'months', label: 'Months' }
    ]
  },
  {
    value: 'identity_personal_life',
    label: 'Identity & Personal Life',
    subcategories: [
      { value: 'personal_information', label: 'Personal Information' },
      { value: 'family_friends', label: 'Family & Friends' },
      { value: 'physical_personality_descriptions', label: 'Physical & Personality Descriptions' },
      { value: 'pets', label: 'Pets' },
      { value: 'feelings_emotions', label: 'Feelings & Emotions' },
      { value: 'relationships', label: 'Relationships' }
    ]
  },
  {
    value: 'home_local_area',
    label: 'Home & Local Area',
    subcategories: [
      { value: 'house_rooms_furniture', label: 'House, Rooms & Furniture' },
      { value: 'household_items_chores', label: 'Household Items & Chores' },
      { value: 'types_housing', label: 'Types of Housing' },
      { value: 'local_area_places_town', label: 'Local Area & Places in Town' },
      { value: 'shops_services', label: 'Shops & Services' },
      { value: 'directions', label: 'Directions' }
    ]
  },
  {
    value: 'school_jobs_future',
    label: 'School, Jobs & Future Plans',
    subcategories: [
      { value: 'school_subjects', label: 'School Subjects' },
      { value: 'school_life', label: 'School Life' },
      { value: 'school_rules', label: 'School Rules' },
      { value: 'classroom_objects', label: 'Classroom Objects' },
      { value: 'professions_jobs', label: 'Professions & Jobs' },
      { value: 'future_ambitions', label: 'Future Ambitions' },
      { value: 'qualities_skills', label: 'Qualities & Skills' }
    ]
  },
  {
    value: 'free_time_leisure',
    label: 'Free Time & Leisure',
    subcategories: [
      { value: 'hobbies_interests', label: 'Hobbies & Interests' },
      { value: 'sports_outdoor', label: 'Sports & Outdoor Activities' },
      { value: 'music_instruments', label: 'Music & Instruments' },
      { value: 'tv_films', label: 'TV & Films' },
      { value: 'reading_books', label: 'Reading & Books' }
    ]
  },
  {
    value: 'food_drink',
    label: 'Food & Drink',
    subcategories: [
      { value: 'food_drink_vocabulary', label: 'Food & Drink Vocabulary' },
      { value: 'meals', label: 'Meals' },
      { value: 'ordering_cafes_restaurants', label: 'Ordering in Cafes & Restaurants' },
      { value: 'cooking', label: 'Cooking' }
    ]
  },
  {
    value: 'clothes_shopping',
    label: 'Clothes & Shopping',
    subcategories: [
      { value: 'clothes_accessories', label: 'Clothes & Accessories' },
      { value: 'shopping_phrases_prices', label: 'Shopping Phrases & Prices' }
    ]
  },
  {
    value: 'technology_media',
    label: 'Technology & Media',
    subcategories: [
      { value: 'technology_devices', label: 'Technology & Devices' },
      { value: 'social_media', label: 'Social Media' },
      { value: 'internet', label: 'Internet' }
    ]
  },
  {
    value: 'health_lifestyle',
    label: 'Health & Lifestyle',
    subcategories: [
      { value: 'body_parts', label: 'Body Parts' },
      { value: 'health_illness', label: 'Health & Illness' },
      { value: 'healthy_living', label: 'Healthy Living' },
      { value: 'daily_routine', label: 'Daily Routine' }
    ]
  },
  {
    value: 'holidays_travel_culture',
    label: 'Holidays, Travel & Culture',
    subcategories: [
      { value: 'countries', label: 'Countries' },
      { value: 'transport', label: 'Transport' },
      { value: 'holidays_tourism', label: 'Holidays & Tourism' },
      { value: 'weather_seasons', label: 'Weather & Seasons' },
      { value: 'festivals_celebrations', label: 'Festivals & Celebrations' }
    ]
  },
  {
    value: 'nature_environment',
    label: 'Nature & Environment',
    subcategories: [
      { value: 'environmental_issues', label: 'Environmental Issues' },
      { value: 'wild_animals', label: 'Wild Animals' },
      { value: 'farm_animals', label: 'Farm Animals' },
      { value: 'sea_animals', label: 'Sea Animals' },
      { value: 'insects_bugs', label: 'Insects & Bugs' },
      { value: 'plants', label: 'Plants' },
      { value: 'landscapes_features', label: 'Landscapes & Features' }
    ]
  },
  {
    value: 'social_global_issues',
    label: 'Social & Global Issues',
    subcategories: [
      { value: 'poverty_inequality', label: 'Poverty & Inequality' },
      { value: 'charity_volunteering', label: 'Charity & Volunteering' },
      { value: 'global_problems', label: 'Global Problems' }
    ]
  }
];

// AQA Themes and Topics
const AQA_THEMES = [
  {
    value: 'people_lifestyle',
    label: 'Theme 1: People and lifestyle',
    topics: [
      { value: 'identity_relationships', label: 'Identity and relationships with others' },
      { value: 'healthy_living_lifestyle', label: 'Healthy living and lifestyle' },
      { value: 'education_work', label: 'Education and work' }
    ]
  },
  {
    value: 'popular_culture',
    label: 'Theme 2: Popular culture',
    topics: [
      { value: 'free_time_activities', label: 'Free-time activities' },
      { value: 'customs_festivals', label: 'Customs, festivals, traditions and celebrations' },
      { value: 'celebrity_culture', label: 'Celebrity culture' }
    ]
  },
  {
    value: 'communication_world',
    label: 'Theme 3: Communication and the world around us',
    topics: [
      { value: 'travel_tourism', label: 'Travel and tourism, including places of interest' },
      { value: 'media_technology', label: 'Media and technology' },
      { value: 'environment', label: 'The environment and where people live' }
    ]
  }
];

// Edexcel Themes and Topics
const EDEXCEL_THEMES = [
  {
    value: 'my_personal_world',
    label: 'My personal world',
    topics: [
      { value: 'family', label: 'Family' },
      { value: 'friends_relationships', label: 'Friends and relationships' },
      { value: 'home', label: 'Home' },
      { value: 'equality', label: 'Equality' }
    ]
  },
  {
    value: 'lifestyle_wellbeing',
    label: 'Lifestyle and wellbeing',
    topics: [
      { value: 'physical_wellbeing', label: 'Physical wellbeing' },
      { value: 'mental_wellbeing', label: 'Mental wellbeing' },
      { value: 'healthy_living', label: 'Healthy living' },
      { value: 'food_drink', label: 'Food and drink' },
      { value: 'sports', label: 'Sports' },
      { value: 'illnesses', label: 'Illnesses' }
    ]
  },
  {
    value: 'education_employment',
    label: 'Education and employment',
    topics: [
      { value: 'school_life', label: 'School life' },
      { value: 'school_studies', label: 'School studies' },
      { value: 'post_16_education', label: 'Post-16 education' },
      { value: 'career_plans', label: 'Career plans' }
    ]
  },
  {
    value: 'leisure_entertainment',
    label: 'Leisure and entertainment',
    topics: [
      { value: 'free_time', label: 'Free time' },
      { value: 'festivals_celebrations', label: 'Festivals and celebrations' },
      { value: 'reading', label: 'Reading' }
    ]
  },
  {
    value: 'travel_tourism',
    label: 'Travel and tourism',
    topics: [
      { value: 'holidays', label: 'Holidays' },
      { value: 'accommodation', label: 'Accommodation' },
      { value: 'transport', label: 'Transport' },
      { value: 'visitor_information', label: 'Visitor information' }
    ]
  },
  {
    value: 'media_technology',
    label: 'Media and technology',
    topics: [
      { value: 'new_technology', label: 'New technology' },
      { value: 'social_media', label: 'Social media' }
    ]
  },
  {
    value: 'environment_social_issues',
    label: 'The environment and social issues',
    topics: [
      { value: 'environmental_issues', label: 'Environmental issues' },
      { value: 'social_issues', label: 'Social issues' }
    ]
  }
];

const PRICE_RANGES = [
  { value: 'all', label: 'All Resources' },
  { value: 'free', label: 'Free Only' },
  { value: 'paid', label: 'Premium Only' }
];

export default function ResourceFilterSidebar({
  filters,
  onFilterChange,
  onClearFilters,
  className = '',
  isMobile = false,
  onClose
}: ResourceFilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState({
    language: true,
    level: true,
    examBoard: true,
    category: true,
    theme: true,
    topic: false,
    type: true,
    skill: false,
    price: true
  });

  // Progressive disclosure logic
  const showKS3Category = filters.keyStage === 'ks3';
  const showKS3Subcategory = showKS3Category && filters.category !== '';
  const showExamBoard = filters.keyStage === 'ks4';
  const showKS4Theme = filters.keyStage === 'ks4' && filters.examBoard !== '';
  const showKS4Topic = showKS4Theme && filters.theme !== '';
  const showSkillFocus = filters.resourceType === 'exam-practice';

  // Get available subcategories based on selected KS3 category
  const availableSubcategories = KS3_CATEGORIES.find(c => c.value === filters.category)?.subcategories || [];

  // Get available themes based on exam board
  const availableThemes = filters.examBoard === 'aqa' ? AQA_THEMES :
                         filters.examBoard === 'edexcel' ? EDEXCEL_THEMES :
                         [];

  // Get available topics based on selected theme
  const availableTopics = availableThemes.find(t => t.value === filters.theme)?.topics || [];

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'search') return false;
    if (key === 'priceRange') return value !== 'all';
    return value !== '';
  });

  const FilterSection = ({ 
    title, 
    section, 
    children 
  }: { 
    title: string; 
    section: keyof typeof expandedSections; 
    children: React.ReactNode;
  }) => (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={() => toggleSection(section)}
        className="w-full flex items-center justify-between py-4 px-1 hover:bg-slate-50 transition-colors"
      >
        <span className="font-semibold text-slate-900">{title}</span>
        {expandedSections[section] ? (
          <ChevronUp className="h-4 w-4 text-slate-500" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-500" />
        )}
      </button>
      {expandedSections[section] && (
        <div className="pb-4 px-1 space-y-2">
          {children}
        </div>
      )}
    </div>
  );

  const RadioOption = ({ 
    checked, 
    onChange, 
    label 
  }: { 
    checked: boolean; 
    onChange: () => void; 
    label: string;
  }) => (
    <label className="flex items-center space-x-3 cursor-pointer group">
      <div className="relative">
        <input
          type="radio"
          checked={checked}
          onChange={onChange}
          className="sr-only"
        />
        <div className={`w-4 h-4 rounded-full border-2 transition-all ${
          checked 
            ? 'border-indigo-600 bg-indigo-600' 
            : 'border-slate-300 group-hover:border-indigo-400'
        }`}>
          {checked && (
            <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          )}
        </div>
      </div>
      <span className={`text-sm ${checked ? 'text-slate-900 font-medium' : 'text-slate-600'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div className={`bg-white rounded-xl shadow-sm ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FilterIcon className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-bold text-slate-900">Filters</h2>
          </div>
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="h-5 w-5 text-slate-500" />
            </button>
          )}
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="mt-3 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Filter Sections */}
      <div className="p-4">
        {/* Language */}
        <FilterSection title="Language" section="language">
          {LANGUAGES.map(lang => (
            <RadioOption
              key={lang.value}
              checked={filters.language === lang.value}
              onChange={() => updateFilter('language', lang.value)}
              label={lang.label}
            />
          ))}
        </FilterSection>

        {/* Level */}
        <FilterSection title="Level" section="level">
          {KEY_STAGES.map(stage => (
            <RadioOption
              key={stage.value}
              checked={filters.keyStage === stage.value}
              onChange={() => updateFilter('keyStage', stage.value)}
              label={stage.label}
            />
          ))}
        </FilterSection>

        {/* KS3 Category - Only show for KS3 */}
        {showKS3Category && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(e) => {
                // Update category and reset subcategory in one call
                onFilterChange({
                  ...filters,
                  category: e.target.value,
                  subcategory: ''
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {KS3_CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* KS3 Subcategory - Only show when category is selected */}
        {showKS3Subcategory && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subcategory
            </label>
            <select
              value={filters.subcategory}
              onChange={(e) => updateFilter('subcategory', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Subcategories</option>
              {availableSubcategories.map(sub => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Exam Board - Only show for KS4 */}
        {showExamBoard && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Exam Board
            </label>
            <select
              value={filters.examBoard}
              onChange={(e) => {
                // Update exam board and reset theme/topic in one call
                onFilterChange({
                  ...filters,
                  examBoard: e.target.value,
                  theme: '',
                  topic: ''
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {EXAM_BOARDS.map(board => (
                <option key={board.value} value={board.value}>
                  {board.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* KS4 Theme - Only show when exam board is selected */}
        {showKS4Theme && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={filters.theme}
              onChange={(e) => {
                // Update theme and reset topic in one call
                onFilterChange({
                  ...filters,
                  theme: e.target.value,
                  topic: ''
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Themes</option>
              {availableThemes.map(theme => (
                <option key={theme.value} value={theme.value}>
                  {theme.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* KS4 Topic - Only show when theme is selected */}
        {showKS4Topic && (
          <div className="border-b border-gray-200 pb-4 mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Topic
            </label>
            <select
              value={filters.topic}
              onChange={(e) => updateFilter('topic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Topics</option>
              {availableTopics.map(topic => (
                <option key={topic.value} value={topic.value}>
                  {topic.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Resource Type */}
        <FilterSection title="Resource Type" section="type">
          {RESOURCE_TYPES.map(type => (
            <RadioOption
              key={type.value}
              checked={filters.resourceType === type.value}
              onChange={() => updateFilter('resourceType', type.value)}
              label={type.label}
            />
          ))}
        </FilterSection>

        {/* Skill Focus - Only show for Exam Practice */}
        {showSkillFocus && (
          <FilterSection title="Skill Focus" section="skill">
            {SKILLS.map(skill => (
              <RadioOption
                key={skill.value}
                checked={filters.skill === skill.value}
                onChange={() => updateFilter('skill', skill.value)}
                label={skill.label}
              />
            ))}
          </FilterSection>
        )}

        {/* Price */}
        <FilterSection title="Price" section="price">
          {PRICE_RANGES.map(range => (
            <RadioOption
              key={range.value}
              checked={filters.priceRange === range.value}
              onChange={() => updateFilter('priceRange', range.value as FilterState['priceRange'])}
              label={range.label}
            />
          ))}
        </FilterSection>


      </div>
    </div>
  );
}

