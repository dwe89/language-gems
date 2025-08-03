'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Search, X, CheckCircle } from 'lucide-react';
import { supabaseBrowser } from '../auth/AuthProvider';

// Configuration for reading comprehension allowed categories
const READING_COMPREHENSION_CATEGORIES = {
  'identity_personal_life': ['family_friends', 'physical_personality_descriptions', 'feelings_emotions', 'personal_information', 'pets', 'relationships'],
  'school_jobs_future': ['school_subjects', 'school_rules', 'classroom_objects', 'professions_jobs', 'future_ambitions', 'qualities_for_jobs', 'qualities_skills', 'school_life'],
  'home_local_area': ['house_rooms_furniture', 'household_items_chores', 'furniture', 'places_in_town', 'directions', 'household_items', 'house_rooms', 'chores'],
  'nature_environment': ['insects_bugs', 'plants', 'environmental_issues', 'farm_animals', 'landscapes_features', 'sea_animals', 'wild_animals'],
  'daily_life': ['daily_routine', 'free_time_leisure', 'hobbies_interests', 'sports'],
  'clothes_shopping': ['clothes_accessories'],
  'food_drink': ['food_drink_vocabulary', 'meals', 'ordering_cafes_restaurants'],
  'health_lifestyle': ['at_the_doctors', 'healthy_living', 'parts_of_body'],
  'holidays_travel_culture': ['countries', 'accommodation', 'festivals_celebrations', 'holiday_activities', 'nationalities', 'transport', 'travel_destinations_types', 'weather_seasons'],
  'social_global_issues': ['current_affairs_world_events', 'global_problems_solutions', 'human_rights', 'social_issues'],
  'technology_media': ['film', 'internet_digital_devices', 'mobile_phones_social_media', 'online_safety', 'music', 'tv']
};

interface Category {
  id: string;
  name: string;
  displayName: string;
  subcategories: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
  displayName: string;
  categoryId: string;
}

interface DatabaseCategorySelectorProps {
  language?: string;
  curriculumLevel?: 'KS3' | 'KS4';
  selectedCategories: string[];
  selectedSubcategories: string[];
  onChange: (categories: string[], subcategories: string[]) => void;
  maxSelections?: number;
  showSearch?: boolean;
  filterForReadingComprehension?: boolean;
}

export default function DatabaseCategorySelector({
  language = 'es',
  curriculumLevel,
  selectedCategories,
  selectedSubcategories,
  onChange,
  maxSelections = 10,
  showSearch = true,
  filterForReadingComprehension = false
}: DatabaseCategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Load categories and subcategories from database
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        // Build query with curriculum level filter if provided
        let query = supabaseBrowser
          .from('centralized_vocabulary')
          .select('category, subcategory')
          .eq('language', language)
          .not('category', 'is', null)
          .not('subcategory', 'is', null);

        // Add curriculum level filter if specified
        if (curriculumLevel) {
          query = query.eq('curriculum_level', curriculumLevel);
        }

        const { data, error: queryError } = await query;

        if (queryError) {
          throw queryError;
        }

        // Group subcategories by category
        const categoryMap = new Map<string, Set<string>>();
        
        data?.forEach(item => {
          if (!categoryMap.has(item.category)) {
            categoryMap.set(item.category, new Set());
          }
          categoryMap.get(item.category)?.add(item.subcategory);
        });

        // Convert to category structure
        const categoriesData: Category[] = Array.from(categoryMap.entries()).map(([categoryId, subcategorySet]) => ({
          id: categoryId,
          name: categoryId,
          displayName: categoryId.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          subcategories: Array.from(subcategorySet).map(subcategoryId => ({
            id: subcategoryId,
            name: subcategoryId,
            displayName: subcategoryId.replace(/_/g, l => l.toUpperCase()),
            categoryId
          }))
        }));

        // Sort categories and subcategories
        categoriesData.sort((a, b) => a.displayName.localeCompare(b.displayName));
        categoriesData.forEach(category => {
          category.subcategories.sort((a, b) => a.displayName.localeCompare(b.displayName));
        });

        // Filter for reading comprehension if requested
        let finalCategories = categoriesData;
        if (filterForReadingComprehension) {
          finalCategories = categoriesData.filter(category => {
            const allowedSubcategories = READING_COMPREHENSION_CATEGORIES[category.id as keyof typeof READING_COMPREHENSION_CATEGORIES];
            if (!allowedSubcategories) return false;
            
            // Filter subcategories to only include allowed ones
            const filteredSubcategories = category.subcategories.filter(sub => 
              allowedSubcategories.includes(sub.id)
            );
            
            // Only include category if it has allowed subcategories
            if (filteredSubcategories.length === 0) return false;
            
            // Update the category with filtered subcategories
            category.subcategories = filteredSubcategories;
            return true;
          });
        }

        setCategories(finalCategories);
      } catch (err) {
        console.error('Error loading categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [language, curriculumLevel, filterForReadingComprehension]);

  // Filter categories based on search
  const filteredCategories = categories.filter(category =>
    category.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.subcategories.some(sub => 
      sub.displayName.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    // Remove subcategories that belong to deselected categories
    const newSubcategories = selectedSubcategories.filter(subId => {
      const category = categories.find(cat => cat.subcategories.some(sub => sub.id === subId));
      return category && newCategories.includes(category.id);
    });

    onChange(newCategories, newSubcategories);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    const newSubcategories = selectedSubcategories.includes(subcategoryId)
      ? selectedSubcategories.filter(id => id !== subcategoryId)
      : [...selectedSubcategories, subcategoryId];

    onChange(selectedCategories, newSubcategories);
  };

  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-3 text-gray-600">Loading categories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      {showSearch && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search categories or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      )}

      {/* Selected Items Display */}
      {(selectedCategories.length > 0 || selectedSubcategories.length > 0) && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Selected Categories & Topics</h4>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(categoryId => {
              const category = categories.find(c => c.id === categoryId);
              return (
                <span key={categoryId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  📁 {category?.displayName || categoryId}
                  <button
                    onClick={() => toggleCategory(categoryId)}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
            {selectedSubcategories.map(subcategoryId => {
              const subcategory = categories
                .flatMap(c => c.subcategories)
                .find(s => s.id === subcategoryId);
              return (
                <span key={subcategoryId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  📄 {subcategory?.displayName || subcategoryId}
                  <button
                    onClick={() => toggleSubcategory(subcategoryId)}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="space-y-3">
        {filteredCategories.map((category) => (
          <div key={category.id} className="border border-gray-200 rounded-lg">
            <div className="p-4">
              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="ml-3 font-medium text-gray-900">
                    📁 {category.displayName}
                  </span>
                </label>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {category.subcategories.length} topics
                  </span>
                  <button
                    onClick={() => toggleCategoryExpansion(category.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedCategories.has(category.id) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {expandedCategories.has(category.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {category.subcategories.map(subcategory => (
                        <label key={subcategory.id} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            checked={selectedSubcategories.includes(subcategory.id)}
                            onChange={() => toggleSubcategory(subcategory.id)}
                            className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                          />
                          <span className="ml-2 text-sm text-gray-700">
                            📄 {subcategory.displayName}
                          </span>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No categories found matching "{searchTerm}"</p>
        </div>
      )}
    </div>
  );
}
