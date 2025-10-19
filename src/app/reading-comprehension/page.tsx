'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  ArrowRight,
  Filter,
  Settings,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '@/components/auth/AuthProvider';
import ReadingComprehensionAdminModal from '@/components/admin/ReadingComprehensionAdminModal';
import Link from 'next/link';

// Simple flag components
const SpanishFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" className="inline-block mr-2">
    <rect width="20" height="5" fill="#AA151B"/>
    <rect y="5" width="20" height="5" fill="#F1BF00"/>
    <rect y="10" width="20" height="5" fill="#AA151B"/>
  </svg>
);

const FrenchFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" className="inline-block mr-2">
    <rect width="6.67" height="15" fill="#002654"/>
    <rect x="6.67" width="6.67" height="15" fill="#FFFFFF"/>
    <rect x="13.33" width="6.67" height="15" fill="#ED2939"/>
  </svg>
);

const GermanFlag = () => (
  <svg width="20" height="15" viewBox="0 0 20 15" className="inline-block mr-2">
    <rect width="20" height="5" fill="#000000"/>
    <rect y="5" width="20" height="5" fill="#DD0000"/>
    <rect y="10" width="20" height="5" fill="#FFCC00"/>
  </svg>
);

// Define the Category and Subcategory interfaces based on user's provided structure
interface KSCategory {
  id: string;
  name: string; // This is the internal name like 'basics_core_language'
  displayName: string; // This is the user-friendly name
  icon: string;
  subcategories: KSSubcategory[];
}

interface KSSubcategory {
  id: string;
  name: string; // Internal name
  displayName: string; // User-friendly name
  categoryId: string;
}

interface CategoryData {
  category: string;
  subcategory: string;
  language: string;
  difficulty: string;
  curriculum_level: string;
  task_count: number;
}

// Categories are now loaded dynamically from the database via API
// See /api/reading-comprehension/categories for the current implementation


// AQA Themes and Topics structure
const AQA_THEMES_TOPICS = {
  people_lifestyle: {
    name: 'Theme 1: People and lifestyle',
    topics: [
      { id: 'identity_relationships', name: 'Identity and relationships with others' },
      { id: 'healthy_living_lifestyle', name: 'Healthy living and lifestyle' },
      { id: 'education_work', name: 'Education and work' }
    ]
  },
  popular_culture: {
    name: 'Popular culture',
    topics: [
      { id: 'free_time_activities', name: 'Free-time activities' },
      { id: 'customs_festivals', name: 'Customs, festivals, traditions and celebrations' },
      { id: 'celebrity_culture', name: 'Celebrity culture' }
    ]
  },
  communication_world: {
    name: 'Communication and the world around us',
    topics: [
      { id: 'travel_tourism', name: 'Travel and tourism, including places of interest' },
      { id: 'media_technology', name: 'Media and technology' },
      { id: 'environment_where_people_live', name: 'The environment and where people live' }
    ]
  }
};

// Edexcel Themes and Topics structure
const EDEXCEL_THEMES_TOPICS = {
  my_personal_world: {
    name: 'My personal world',
    topics: [
      { id: 'family', name: 'Family' },
      { id: 'friends_relationships', name: 'Friends and relationships' },
      { id: 'home', name: 'Home' },
      { id: 'equality', name: 'Equality' }
    ]
  },
  lifestyle_wellbeing: {
    name: 'Lifestyle and wellbeing',
    topics: [
      { id: 'physical_wellbeing', name: 'Physical wellbeing' },
      { id: 'mental_wellbeing', name: 'Mental wellbeing' },
      { id: 'healthy_living', name: 'Healthy living' },
      { id: 'food_drink', name: 'Food and drink' },
      { id: 'sports', name: 'Sports' },
      { id: 'illnesses', name: 'Illnesses' }
    ]
  },
  my_neighbourhood: {
    name: 'My neighbourhood',
    topics: [
      { id: 'home_local_area', name: 'Home and local area' },
      { id: 'places_in_town', name: 'Places in town' },
      { id: 'shopping', name: 'Shopping' },
      { id: 'natural_world', name: 'The natural world' },
      { id: 'environmental_issues', name: 'Environmental issues' }
    ]
  },
  media_technology: {
    name: 'Media and technology',
    topics: [
      { id: 'life_online', name: 'Life online - advantages and disadvantages' },
      { id: 'technology', name: 'Technology' },
      { id: 'tv_film', name: 'TV and film' },
      { id: 'music', name: 'Music' },
      { id: 'social_media', name: 'Social media' },
      { id: 'gaming', name: 'Gaming' }
    ]
  },
  studying_future: {
    name: 'Studying and my future',
    topics: [
      { id: 'school_subjects', name: 'School subjects' },
      { id: 'school_opinions', name: 'Opinions about school' },
      { id: 'school_rules', name: 'School rules' },
      { id: 'future_plans', name: 'Future plans' },
      { id: 'current_employment', name: 'Current employment' },
      { id: 'future_employment', name: 'Future employment' }
    ]
  },
  travel_tourism: {
    name: 'Travel and tourism',
    topics: [
      { id: 'holidays', name: 'Holidays' },
      { id: 'transport', name: 'Transport' },
      { id: 'accommodation', name: 'Accommodation' },
      { id: 'planning_holidays', name: 'Planning and describing a holiday' },
      { id: 'weather', name: 'Weather' },
      { id: 'tourist_attractions', name: 'Tourist attractions' }
    ]
  }
};

export default function ReadingComprehensionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<'spanish' | 'french' | 'german'>('spanish');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [selectedCurriculumLevel, setSelectedCurriculumLevel] = useState<string>(''); // New state for curriculum level
  const [selectedExamBoard, setSelectedExamBoard] = useState<string>(''); // New state for exam board
  const [selectedThemeTopic, setSelectedThemeTopic] = useState<string>(''); // New state for theme/topic
  const [searchTerm, setSearchTerm] = useState('');
  const [availableTasks, setAvailableTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState<any[]>([]);
  const [showAdminModal, setShowAdminModal] = useState(false);

  // Dynamic categories loaded from database
  const [availableCategories, setAvailableCategories] = useState<KSCategory[]>([]);
  const [availableKS4Themes, setAvailableKS4Themes] = useState<any[]>([]);

  // Check if user is admin
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  // Load categories from API with caching
  const loadCategoriesFromAPI = async () => {
    try {
      const response = await fetch('/api/reading-comprehension/categories');

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();

      if (data.success && data.categories) {
        setAvailableCategories(data.categories.ks3 || []);
        setAvailableKS4Themes(data.categories.ks4 || []);

        // Optional: Store in localStorage for offline fallback
        localStorage.setItem('reading-comprehension-categories', JSON.stringify({
          categories: data.categories,
          timestamp: Date.now()
        }));
      }
    } catch (error) {
      console.error('Error loading categories from API:', error);

      // Fallback to localStorage if API fails
      try {
        const cached = localStorage.getItem('reading-comprehension-categories');
        if (cached) {
          const { categories, timestamp } = JSON.parse(cached);
          const isStale = Date.now() - timestamp > 24 * 60 * 60 * 1000; // 24 hours

          if (!isStale) {
            setAvailableCategories(categories.ks3 || []);
            setAvailableKS4Themes(categories.ks4 || []);
            console.log('Using cached categories as fallback');
          }
        }
      } catch (cacheError) {
        console.error('Error loading cached categories:', cacheError);
      }
    }
  };

  // Helper function to format display names
  const formatDisplayName = (str: string): string => {
    return str
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Load all available tasks from database
  useEffect(() => {
    const loadAvailableTasks = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/reading-comprehension/tasks');

        if (response.ok) {
          const data = await response.json();
          if (data.tasks && data.tasks.length > 0) {
            setAvailableTasks(data.tasks);
          }
        }
      } catch (err) {
        console.error('Error loading available tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAvailableTasks();
    loadCategoriesFromAPI();
  }, []);

  // Filter tasks based on selected criteria
  useEffect(() => {
    let filtered = availableTasks.filter(task => {
      // Language filter
      if (selectedLanguage && task.language !== selectedLanguage) return false;

      // Curriculum level filter - empty string means "All Levels"
      if (selectedCurriculumLevel && selectedCurriculumLevel !== '' && task.curriculum_level !== selectedCurriculumLevel) return false;

      // Exam board filter
      if (selectedExamBoard && task.exam_board !== selectedExamBoard) return false;

      // Theme/topic filter for AQA
      if (selectedThemeTopic && task.theme_topic !== selectedThemeTopic) return false;

      // Category filter (only for non-KS4)
      if (selectedCurriculumLevel !== 'ks4' && selectedCategory && task.category !== selectedCategory) return false;

      // Subcategory filter (only for non-KS4)
      if (selectedCurriculumLevel !== 'ks4' && selectedSubcategory && task.subcategory !== selectedSubcategory) return false;

      // Difficulty filter
      if (selectedDifficulty && task.difficulty !== selectedDifficulty) return false;

      return true;
    });

    setFilteredTasks(filtered);
  }, [availableTasks, selectedLanguage, selectedCurriculumLevel, selectedExamBoard, selectedThemeTopic, selectedCategory, selectedSubcategory, selectedDifficulty]);

  // Get available categories and subcategories from content
  const getCategories = (): (KSCategory)[] => {
    // If KS3 is selected, use the dynamic categories loaded from database
    if (selectedCurriculumLevel === 'ks3') {
      return availableCategories;
    }

    // If KS4 or no level is selected, return an empty array for categories
    // as categories are only relevant for KS3 now.
    return [];
  };


  // Helper to format category names, prioritizing displayName if available (for KS3 categories)
  const formatCategoryName = (category: string, isKS3: boolean = false): string => {
    if (isKS3) {
      // Find the category in availableCategories by its ID and return its displayName
      const ks3Category = availableCategories.find(cat => cat.id === category);
      return ks3Category ? ks3Category.displayName : formatDisplayName(category);
    }
    // Fallback for non-KS3 categories (old logic, though not used for display now)
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to format subcategory names, prioritizing displayName if available (for KS3 subcategories)
  const formatSubcategoryName = (subcategory: string, categoryId: string, isKS3: boolean = false): string => {
    if (isKS3) {
      const ks3Category = availableCategories.find(cat => cat.id === categoryId);
      const ks3Subcategory = ks3Category?.subcategories.find(sub => sub.id === subcategory);
      return ks3Subcategory ? ks3Subcategory.displayName : formatDisplayName(subcategory);
    }
    // Fallback for non-KS3 subcategories (old logic, though not used for display now)
    return subcategory
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Helper to get category description (will be empty for KS3 as per new data structure)
  const getCategoryDescription = (category: string, isKS3: boolean = false): string => {
    if (isKS3) {
      // KS3 categories do not have a 'description' field in the provided data
      return '';
    }
    const descriptions: Record<string, string> = {
      'food_drink': 'Texts about food, drinks, restaurants and eating habits',
      'home_local_area': 'Descriptions of places, landmarks and urban life',
      'school_jobs_future': 'School life, daily routines and educational experiences',
      'identity_personal_life': 'Family relationships, friendships and celebrations',
      'free_time_leisure': 'Leisure activities, sports and hobbies',
      'holidays_travel_culture': 'Travel, holidays and tourist experiences',
      'nature_environment': 'Environment, nature and sustainability',
      'technology_media': 'Technology, social media and digital life',
      'basics_core_language': 'Core language elements and basic communication',
      'health_lifestyle': 'Health, lifestyle and wellbeing topics',
      'social_global_issues': 'Social issues and global problems'
    };
    return descriptions[category] || 'Reading comprehension texts';
  };

  // Helper to get subcategory description (will be empty for KS3 as per new data structure)
  const getSubcategoryDescription = (subcategory: string, isKS3: boolean = false): string => {
    if (isKS3) {
      // KS3 subcategories do not have a 'description' field in the provided data
      return '';
    }
    const descriptions: Record<string, string> = {
      'ordering_cafes_restaurants': 'Situations in cafes and restaurants, ordering food',
      'food_drink_vocabulary': 'Food and drink vocabulary and experiences',
      'meals': 'Meal times and family dining experiences',
      'places_in_town': 'Town landmarks and important places',
      'school_life': 'Daily school routines and educational experiences',
      'family_friends': 'Family relationships and celebrations',
      'daily_routine': 'Daily routines and schedules',
      'hobbies_interests': 'Hobbies and personal interests',
      'sports_outdoor': 'Outdoor sports and activities',
      'countries': 'Countries and travel destinations',
      'transport': 'Transportation and travel methods',
      'environmental_issues': 'Climate change and environmental problems'
    };
    return descriptions[subcategory] || 'Specialized texts';
  };

  // Helper to get category icon, prioritizing icon from KS3 data if available
  const getCategoryIcon = (category: string, isKS3: boolean = false): string => {
    if (isKS3) {
      const ks3Category = availableCategories.find(cat => cat.id === category);
      return ks3Category ? ks3Category.icon : 'Book'; // Fallback icon
    }
    const icons: Record<string, string> = {
      'food_drink': 'Utensils',
      'home_local_area': 'Home',
      'school_jobs_future': 'GraduationCap',
      'identity_personal_life': 'User',
      'free_time_leisure': 'Gamepad2',
      'holidays_travel_culture': 'Plane',
      'nature_environment': 'Sprout',
      'technology_media': 'Smartphone',
      'basics_core_language': 'MessageCircle',
      'health_lifestyle': 'HeartPulse',
      'clothes_shopping': 'Shirt',
      'social_global_issues': 'Globe'
    };
    return icons[category] || 'Book';
  };

  const handleStartSpecificTask = (taskId: string) => {
    const params = new URLSearchParams({
      assessmentId: taskId
    });

    router.push(`/reading-comprehension/task?${params.toString()}`);
  };

  const handleRefreshTasks = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/reading-comprehension/tasks');
      if (response.ok) {
        const data = await response.json();
        if (data.tasks && data.tasks.length > 0) {
          setAvailableTasks(data.tasks);
        }
      }
    } catch (err) {
      console.error('Error refreshing tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = getCategories();
  // No need to filter categories for display grid anymore, as it's removed.
  // The filtering for the dropdowns is handled implicitly by `getCategories`.

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Admin Button */}
        {isAdmin && (
          <button
            onClick={() => setShowAdminModal(true)}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
            title="Manage Reading Comprehension (Admin only)"
          >
            <Settings className="w-5 h-5" />
            <span>Manage Assessments</span>
          </button>
        )}

        {/* Admin Modal */}
        {isAdmin && (
          <ReadingComprehensionAdminModal
            isOpen={showAdminModal}
            onClose={() => setShowAdminModal(false)}
            onRefresh={handleRefreshTasks}
          />
        )}
        {/* Header */}
        <div className="text-center mb-8">
          {/* Back Button */}
          <div className="flex justify-start mb-4">
            <Link
              href="/assessments"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Assessments
            </Link>
          </div>

          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Reading Comprehension</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Improve your reading skills with authentic texts organized by topics and levels
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center mb-6">
            <Filter className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Content</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Language Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'spanish' | 'french' | 'german')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="spanish">
                  <SpanishFlag /> Spanish
                </option>
                <option value="french">
                  <FrenchFlag /> French
                </option>
                <option value="german">
                  <GermanFlag /> German
                </option>
              </select>
            </div>

            {/* Curriculum Level Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Curriculum Level
              </label>
              <select
                value={selectedCurriculumLevel}
                onChange={(e) => {
                  setSelectedCurriculumLevel(e.target.value);
                  setSelectedExamBoard(''); // Reset exam board when curriculum level changes
                  setSelectedThemeTopic(''); // Reset theme/topic when curriculum level changes
                  setSelectedCategory(''); // Reset category when curriculum level changes
                  setSelectedSubcategory(''); // Reset subcategory when curriculum level changes
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Levels</option>
                <option value="ks3">KS3</option>
                <option value="ks4">KS4 (GCSE)</option>
                <option value="ks5">KS5 (A-Level)</option>
              </select>
            </div>

            {/* Exam Board Filter (visible only for KS4) */}
            {selectedCurriculumLevel === 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Exam Board
                </label>
                <select
                  value={selectedExamBoard}
                  onChange={(e) => {
                    setSelectedExamBoard(e.target.value);
                    setSelectedThemeTopic(''); // Reset theme/topic when exam board changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Boards</option>
                  <option value="aqa">AQA</option>
                  <option value="edexcel">Edexcel</option>
                </select>
              </div>
            )}

            {/* AQA Themes and Topics Filter (visible only for AQA) */}
            {selectedExamBoard === 'aqa' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  AQA Theme/Topic
                </label>
                <select
                  value={selectedThemeTopic}
                  onChange={(e) => setSelectedThemeTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Themes/Topics</option>
                  {Object.entries(AQA_THEMES_TOPICS).map(([themeId, theme]) => (
                    <optgroup key={themeId} label={theme.name}>
                      {theme.topics.map(topic => (
                        <option key={topic.id} value={`${themeId}_${topic.id}`}>
                          {topic.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Edexcel Themes and Topics Filter (visible only for Edexcel) */}
            {selectedExamBoard === 'edexcel' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edexcel Theme/Topic
                </label>
                <select
                  value={selectedThemeTopic}
                  onChange={(e) => setSelectedThemeTopic(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Themes/Topics</option>
                  {Object.entries(EDEXCEL_THEMES_TOPICS).map(([themeId, theme]) => (
                    <optgroup key={themeId} label={theme.name}>
                      {theme.topics.map(topic => (
                        <option key={topic.id} value={`${themeId}:${topic.id}`}>
                          {topic.name}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            )}

            {/* Category Filter (visible only if KS4 is NOT selected) */}
            {selectedCurriculumLevel !== 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory(''); // Reset subcategory when category changes
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {formatCategoryName(category.id, selectedCurriculumLevel === 'ks3')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Subcategory Filter (visible only if KS4 is NOT selected) */}
            {selectedCurriculumLevel !== 'ks4' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  disabled={!selectedCategory}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">All subcategories</option>
                  {selectedCategory && categories
                    .find(cat => cat.id === selectedCategory)
                    ?.subcategories.map((subcategory: any) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        {formatSubcategoryName(subcategory.id, selectedCategory, selectedCurriculumLevel === 'ks3')}
                      </option>
                    ))}
                </select>
              </div>
            )}

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All difficulties</option>
                <option value="foundation">Foundation</option>
                <option value="higher">Higher</option>
              </select>
            </div>
          </div>

        </div> {/* This closing div was missing or misplaced */}

        {/* Available Tasks */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Available Reading Tasks</h2>
            <div className="text-sm text-gray-600">
              {loading ? 'Loading...' : `${filteredTasks.length} task${filteredTasks.length !== 1 ? 's' : ''} found`}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading reading comprehension tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Tasks Found</h3>
              <p className="text-gray-600 mb-4">
                No reading comprehension tasks match your current filter criteria.
              </p>
              <p className="text-sm text-gray-500">
                Try adjusting your filters to see more content.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTasks.map((task) => {
                // Helper function to format theme/topic display
                const formatThemeTopic = (themeTopic: string | undefined, examBoard: string | undefined) => {
                  if (!themeTopic) return null;

                  if (examBoard === 'aqa') {
                    // AQA format: theme_id_topic_id
                    const parts = themeTopic.split('_');
                    if (parts.length >= 2) {
                      const themeId = parts[0] + '_' + parts[1]; // e.g., people_lifestyle
                      const topicId = parts.slice(2).join('_'); // e.g., identity_relationships

                      const theme = AQA_THEMES_TOPICS[themeId as keyof typeof AQA_THEMES_TOPICS];
                      const topic = theme?.topics.find(t => t.id === topicId);

                      return {
                        theme: theme?.name || themeId,
                        topic: topic?.name || topicId
                      };
                    }
                  } else if (examBoard === 'edexcel') {
                    // Edexcel format: theme_id:topic_id
                    const [themeId, topicId] = themeTopic.split(':');

                    const theme = EDEXCEL_THEMES_TOPICS[themeId as keyof typeof EDEXCEL_THEMES_TOPICS];
                    const topic = theme?.topics.find(t => t.id === topicId);

                    return {
                      theme: theme?.name || themeId,
                      topic: topic?.name || topicId
                    };
                  }

                  return null;
                };

                const themeTopicInfo = formatThemeTopic(task.theme_topic, task.exam_board);

                return (
                  <div key={task.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
                    <div className="p-6">
                      {/* Task Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {task.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {task.language === 'spanish' ? (
                                <>
                                  <SpanishFlag />
                                  <span className="ml-1">Spanish</span>
                                </>
                              ) : task.language === 'french' ? (
                                <>
                                  <FrenchFlag />
                                  <span className="ml-1">French</span>
                                </>
                              ) : task.language === 'german' ? (
                                <>
                                  <GermanFlag />
                                  <span className="ml-1">German</span>
                                </>
                              ) : (
                                task.language
                              )}
                            </span>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {task.difficulty}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Task Details */}
                      <div className="space-y-2 mb-4">
                        {task.curriculum_level && (
                          <div className="flex items-center text-sm text-gray-600">
                            <span className="font-medium mr-2">Level:</span>
                            <span className="uppercase">{task.curriculum_level}</span>
                          </div>
                        )}

                        {/* KS3: Show Category and Subcategory */}
                        {task.curriculum_level === 'ks3' && task.category && (
                          <>
                            <div className="flex items-center text-sm text-gray-600">
                              <span className="font-medium mr-2">Category:</span>
                              <span className="capitalize">{task.category.replace(/_/g, ' ')}</span>
                            </div>
                            {task.subcategory && (
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium mr-2">Topic:</span>
                                <span className="capitalize">{task.subcategory.replace(/_/g, ' ')}</span>
                              </div>
                            )}
                          </>
                        )}

                        {/* KS4: Show Exam Board, Theme, and Topic */}
                        {task.curriculum_level === 'ks4' && (
                          <>
                            {task.exam_board && (
                              <div className="flex items-center text-sm text-gray-600">
                                <span className="font-medium mr-2">Exam Board:</span>
                                <span className="uppercase">{task.exam_board}</span>
                              </div>
                            )}
                            {themeTopicInfo && (
                              <>
                                <div className="flex items-center text-sm text-gray-600">
                                  <span className="font-medium mr-2">Theme:</span>
                                  <span>{themeTopicInfo.theme}</span>
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                  <span className="font-medium mr-2">Topic:</span>
                                  <span>{themeTopicInfo.topic}</span>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-1" />
                            <span>{task.word_count || 0} words</span>
                          </div>
                          <div className="flex items-center">
                            <span>{task.estimated_reading_time || 5} min read</span>
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium mr-2">Questions:</span>
                          <span>{task.reading_comprehension_questions?.length || 0}</span>
                        </div>
                      </div>

                    {/* Start Task Button */}
                    <button
                      onClick={() => handleStartSpecificTask(task.id)}
                      className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Start This Task
                    </button>
                  </div>
                </div>
              );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
