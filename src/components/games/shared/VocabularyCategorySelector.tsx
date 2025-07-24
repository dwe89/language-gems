'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, X, Check, Globe, BookOpen, Users, Briefcase, Home, Heart, Gamepad2, School, Car, Utensils, Palette, Music, Zap, Target, Brain, Clock, MapPin, Plane, ShoppingBag, Smartphone, Tv, Dumbbell, TreePine, Sun, Droplets, Wind, Mountain, Flower, Bug, Fish, Cat, Bird, Apple, Carrot, Cake, Coffee, Shirt, Glasses, Watch, Key, Book, Pen, Calculator, Scissors, Hammer, Ball, Guitar, Camera, Phone, Computer, Car as CarIcon, Bike, Train, Plane as PlaneIcon, Home as HomeIcon, Building, Church, Hospital, School as SchoolIcon, Store, Restaurant, Hotel, Bank, Library, Park, Beach, Forest, River, Lake, Star, Moon, Sun as SunIcon, Cloud, Rainbow, Snowflake, Leaf, Tree, Rose, Tulip, Sunflower, Butterfly, Bee, Spider, Ant, Ladybug, Snail, Frog, Turtle, Rabbit, Squirrel, Fox, Wolf, Bear, Lion, Tiger, Elephant, Giraffe, Zebra, Monkey, Panda, Koala, Kangaroo, Penguin, Owl, Eagle, Parrot, Swan, Duck, Chicken, Cow, Pig, Sheep, Horse, Dog, Cat as CatIcon, Mouse, Hamster, Fish as FishIcon, Shark, Whale, Dolphin, Octopus, Crab, Lobster, Shrimp } from 'lucide-react';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  subcategories?: Subcategory[];
}

interface Subcategory {
  id: string;
  name: string;
}

interface VocabularyCategorySelectorProps {
  selectedLanguage: string;
  selectedCategory: string;
  selectedSubcategory: string;
  onLanguageChange: (language: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  showLanguageSelector?: boolean;
  className?: string;
}

const AVAILABLE_LANGUAGES = [
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'basics_core_language': <BookOpen className="h-5 w-5" />,
  'family_relationships': <Users className="h-5 w-5" />,
  'school_jobs_future': <School className="h-5 w-5" />,
  'free_time_leisure': <Gamepad2 className="h-5 w-5" />,
  'home_local_area_environment': <Home className="h-5 w-5" />,
  'health_body_lifestyle': <Heart className="h-5 w-5" />,
  'technology_media': <Smartphone className="h-5 w-5" />,
  'travel_transport': <Plane className="h-5 w-5" />,
  'food_drink': <Utensils className="h-5 w-5" />,
  'shopping_services': <ShoppingBag className="h-5 w-5" />,
  'weather_nature': <TreePine className="h-5 w-5" />,
  'animals': <Cat className="h-5 w-5" />,
  'colors': <Palette className="h-5 w-5" />,
  'numbers': <Calculator className="h-5 w-5" />,
  'time_dates': <Clock className="h-5 w-5" />,
  'places_locations': <MapPin className="h-5 w-5" />,
  'clothing_accessories': <Shirt className="h-5 w-5" />,
  'sports_activities': <Dumbbell className="h-5 w-5" />,
  'music_arts': <Music className="h-5 w-5" />,
  'business_work': <Briefcase className="h-5 w-5" />,
};

export default function VocabularyCategorySelector({
  selectedLanguage,
  selectedCategory,
  selectedSubcategory,
  onLanguageChange,
  onCategoryChange,
  onSubcategoryChange,
  showLanguageSelector = true,
  className = ""
}: VocabularyCategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSubcategoryDropdown, setShowSubcategoryDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  // Load categories when language changes
  useEffect(() => {
    if (selectedLanguage) {
      loadCategories();
    }
  }, [selectedLanguage]);

  // Load subcategories when category changes
  useEffect(() => {
    if (selectedCategory) {
      loadSubcategories();
    } else {
      setSubcategories([]);
      onSubcategoryChange('');
    }
  }, [selectedCategory]);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('category')
        .eq('language', selectedLanguage)
        .not('category', 'is', null);

      if (error) throw error;

      const uniqueCategories = [...new Set(data.map(item => item.category))]
        .filter(Boolean)
        .sort()
        .map(categoryId => ({
          id: categoryId,
          name: formatCategoryName(categoryId),
          icon: CATEGORY_ICONS[categoryId] || <BookOpen className="h-5 w-5" />
        }));

      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSubcategories = async () => {
    try {
      const { data, error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('subcategory')
        .eq('language', selectedLanguage)
        .eq('category', selectedCategory)
        .not('subcategory', 'is', null);

      if (error) throw error;

      const uniqueSubcategories = [...new Set(data.map(item => item.subcategory))]
        .filter(Boolean)
        .sort()
        .map(subcategoryId => ({
          id: subcategoryId,
          name: formatCategoryName(subcategoryId)
        }));

      setSubcategories(uniqueSubcategories);
    } catch (error) {
      console.error('Error loading subcategories:', error);
    }
  };

  const formatCategoryName = (categoryId: string): string => {
    return categoryId
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getLanguageName = (code: string) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === code)?.name || code;
  };

  const getLanguageFlag = (code: string) => {
    return AVAILABLE_LANGUAGES.find(lang => lang.code === code)?.flag || '🌐';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Language Selector */}
      {showLanguageSelector && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Language
          </label>
          <button
            onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="text-lg">{getLanguageFlag(selectedLanguage)}</span>
              <span>{getLanguageName(selectedLanguage)}</span>
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${showLanguageDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showLanguageDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
              {AVAILABLE_LANGUAGES.map((language) => (
                <button
                  key={language.code}
                  onClick={() => {
                    onLanguageChange(language.code);
                    setShowLanguageDropdown(false);
                  }}
                  className="w-full flex items-center space-x-2 px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors"
                >
                  <span className="text-lg">{language.flag}</span>
                  <span>{language.name}</span>
                  {selectedLanguage === language.code && <Check className="h-4 w-4 text-blue-500 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Category Selector */}
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <button
          onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
          disabled={loading}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-50"
        >
          <div className="flex items-center space-x-2">
            {selectedCategory ? (
              <>
                {CATEGORY_ICONS[selectedCategory] || <BookOpen className="h-5 w-5" />}
                <span>{formatCategoryName(selectedCategory)}</span>
              </>
            ) : (
              <span className="text-gray-500">Select a category</span>
            )}
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
        </button>

        {showCategoryDropdown && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
            <button
              onClick={() => {
                onCategoryChange('');
                setShowCategoryDropdown(false);
              }}
              className="w-full flex items-center space-x-3 px-4 py-4 hover:bg-blue-50 first:rounded-t-lg transition-colors border-b border-gray-100"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-medium text-gray-900">All Categories</div>
                <div className="text-sm text-gray-500">Browse all vocabulary</div>
              </div>
              {!selectedCategory && <Check className="h-5 w-5 text-blue-500" />}
            </button>

            <div className="grid grid-cols-1 gap-1 p-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    onCategoryChange(category.id);
                    setShowCategoryDropdown(false);
                  }}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left ${
                    selectedCategory === category.id
                      ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                      : 'hover:bg-gray-50 border-2 border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedCategory === category.id
                      ? 'bg-blue-100'
                      : 'bg-gray-100'
                  }`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{category.name}</div>
                    <div className="text-sm text-gray-500">
                      {category.id.split('_').join(' ')}
                    </div>
                  </div>
                  {selectedCategory === category.id && (
                    <Check className="h-5 w-5 text-blue-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Subcategory Selector */}
      {subcategories.length > 0 && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subcategory
          </label>
          <button
            onClick={() => setShowSubcategoryDropdown(!showSubcategoryDropdown)}
            className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <div className="flex items-center space-x-2">
              {selectedSubcategory ? (
                <span>{formatCategoryName(selectedSubcategory)}</span>
              ) : (
                <span className="text-gray-500">Select a subcategory (optional)</span>
              )}
            </div>
            <ChevronDown className={`h-4 w-4 transition-transform ${showSubcategoryDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showSubcategoryDropdown && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              <button
                onClick={() => {
                  onSubcategoryChange('');
                  setShowSubcategoryDropdown(false);
                }}
                className="w-full flex items-center space-x-3 px-4 py-4 hover:bg-blue-50 first:rounded-t-lg transition-colors border-b border-gray-100"
              >
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-gray-900">All Subcategories</div>
                </div>
                {!selectedSubcategory && <Check className="h-4 w-4 text-blue-500" />}
              </button>

              <div className="grid grid-cols-1 gap-1 p-2">
                {subcategories.map((subcategory) => (
                  <button
                    key={subcategory.id}
                    onClick={() => {
                      onSubcategoryChange(subcategory.id);
                      setShowSubcategoryDropdown(false);
                    }}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all text-left ${
                      selectedSubcategory === subcategory.id
                        ? 'bg-blue-50 border-2 border-blue-200 shadow-sm'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      selectedSubcategory === subcategory.id
                        ? 'bg-blue-100'
                        : 'bg-gray-100'
                    }`}>
                      <span className="text-sm font-medium">
                        {subcategory.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{subcategory.name}</div>
                    </div>
                    {selectedSubcategory === subcategory.id && (
                      <Check className="h-4 w-4 text-blue-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Clear Selection */}
      {(selectedCategory || selectedSubcategory) && (
        <button
          onClick={() => {
            onCategoryChange('');
            onSubcategoryChange('');
          }}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm transition-colors"
        >
          <X className="h-4 w-4" />
          <span>Clear selection</span>
        </button>
      )}
    </div>
  );
}
