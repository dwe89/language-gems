'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Star,
  ArrowRight,
  Filter,
  Search
} from 'lucide-react';
import { readingComprehensionContent } from '../../data/reading-comprehension-content';

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: SubcategoryInfo[];
}

interface SubcategoryInfo {
  id: string;
  name: string;
  description: string;
  textCount: number;
  difficulty: string[];
}

export default function ReadingComprehensionPage() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState<'spanish' | 'french' | 'german'>('spanish');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');

  // Get available categories and subcategories from content
  const getCategories = (): CategoryInfo[] => {
    const languageKey = selectedLanguage;
    const texts = readingComprehensionContent.texts[languageKey] || [];
    
    const categoryMap = new Map<string, CategoryInfo>();
    
    texts.forEach(text => {
      if (!categoryMap.has(text.category)) {
        categoryMap.set(text.category, {
          id: text.category,
          name: formatCategoryName(text.category),
          description: getCategoryDescription(text.category),
          icon: getCategoryIcon(text.category),
          subcategories: []
        });
      }
      
      const category = categoryMap.get(text.category)!;
      const existingSubcategory = category.subcategories.find(sub => sub.id === text.subcategory);
      
      if (!existingSubcategory) {
        category.subcategories.push({
          id: text.subcategory,
          name: formatCategoryName(text.subcategory),
          description: getSubcategoryDescription(text.subcategory),
          textCount: texts.filter(t => t.category === text.category && t.subcategory === text.subcategory).length,
          difficulty: [...new Set(texts
            .filter(t => t.category === text.category && t.subcategory === text.subcategory)
            .map(t => t.difficulty))]
        });
      }
    });
    
    return Array.from(categoryMap.values());
  };

  const formatCategoryName = (category: string): string => {
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getCategoryDescription = (category: string): string => {
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

  const getSubcategoryDescription = (subcategory: string): string => {
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

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      'food_drink': '🍽️',
      'home_local_area': '🏛️',
      'school_jobs_future': '🎓',
      'identity_personal_life': '👨‍👩‍👧‍👦',
      'free_time_leisure': '⚽',
      'holidays_travel_culture': '✈️',
      'nature_environment': '🌱',
      'technology_media': '💻',
      'basics_core_language': '📝',
      'health_lifestyle': '💪',
      'social_global_issues': '🌍'
    };
    return icons[category] || '📚';
  };

  const getDifficultyColor = (difficulty: string): string => {
    const colors: Record<string, string> = {
      'foundation': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'higher': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  const handleStartTask = () => {
    const params = new URLSearchParams({
      language: selectedLanguage,
      ...(selectedCategory && { category: selectedCategory }),
      ...(selectedSubcategory && { subcategory: selectedSubcategory }),
      ...(selectedDifficulty && { difficulty: selectedDifficulty })
    });
    
    router.push(`/reading-comprehension/task?${params.toString()}`);
  };

  const categories = getCategories();
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-blue-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Reading Comprehension</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Improve your reading skills with authentic texts organized by topics and levels
          </p>
        </div>

        {/* Language and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as 'spanish' | 'french' | 'german')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
                <option value="german">German</option>
              </select>
            </div>

            {/* Category Filter */}
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
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Subcategory Filter */}
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
                  ?.subcategories.map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
              </select>
            </div>

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
                <option value="intermediate">Intermediate</option>
                <option value="higher">Higher</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="mt-6 text-center">
            <button
              onClick={handleStartTask}
              className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Target className="h-5 w-5 mr-2" />
              Start Reading Task
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map(category => (
            <div key={category.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <span className="text-3xl mr-3">{category.icon}</span>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{category.name}</h3>
                    <p className="text-sm text-gray-600">{category.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {category.subcategories.map(subcategory => (
                    <div key={subcategory.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{subcategory.name}</h4>
                        <span className="text-sm text-gray-500">{subcategory.textCount} texts</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{subcategory.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {subcategory.difficulty.map(diff => (
                          <span
                            key={diff}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(diff)}`}
                          >
                            {diff === 'foundation' ? 'Foundation' : diff === 'intermediate' ? 'Intermediate' : 'Higher'}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    setSelectedCategory(category.id);
                    handleStartTask();
                  }}
                  className="w-full mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors font-medium"
                >
                  Practice {category.name}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No categories found</h3>
            <p className="text-gray-500">Try different search terms or filters.</p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {readingComprehensionContent.texts[selectedLanguage]?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Available Texts</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {categories.length}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Subcategories</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {readingComprehensionContent.questions[selectedLanguage]?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Questions</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
