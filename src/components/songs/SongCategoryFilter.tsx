'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, 
  Target, 
  Search, 
  X, 
  ChevronDown, 
  ChevronUp,
  Filter,
  RotateCcw
} from 'lucide-react';
import { VOCABULARY_CATEGORIES } from '@/components/games/ModernCategorySelector';
import { GRAMMAR_CATEGORIES } from '@/lib/grammar-categories';
import { getCategoriesByCurriculum } from '@/components/games/KS4CategorySystem';

interface SongCategoryFilterProps {
  themeFilter: string;
  categoryFilter: string;
  subcategoryFilter: string;
  searchQuery: string;
  onThemeChange: (theme: string) => void;
  onCategoryChange: (category: string) => void;
  onSubcategoryChange: (subcategory: string) => void;
  onSearchChange: (search: string) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  resultsCount: number;
}

export default function SongCategoryFilter({
  themeFilter,
  categoryFilter,
  subcategoryFilter,
  searchQuery,
  onThemeChange,
  onCategoryChange,
  onSubcategoryChange,
  onSearchChange,
  onClearFilters,
  activeFiltersCount,
  resultsCount
}: SongCategoryFilterProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [curriculumLevel, setCurriculumLevel] = useState<'KS3' | 'KS4' | null>(null);
  const [examBoard, setExamBoard] = useState<'AQA' | 'edexcel' | null>(null);

  const getCurrentCategories = () => {
    try {
      // For KS4, use KS4-specific categories based on exam board
      if (curriculumLevel === 'KS4') {
        const ks4Categories = getCategoriesByCurriculum('KS4', examBoard || undefined);

        if (themeFilter === 'vocabulary') return ks4Categories || [];
        if (themeFilter === 'grammar') return GRAMMAR_CATEGORIES || []; // Grammar categories remain the same
        return [...(ks4Categories || []), ...(GRAMMAR_CATEGORIES || [])];
      }

      // For KS3 and other levels, use the original categories
      if (themeFilter === 'vocabulary') return VOCABULARY_CATEGORIES || [];
      if (themeFilter === 'grammar') return GRAMMAR_CATEGORIES || [];
      return [...(VOCABULARY_CATEGORIES || []), ...(GRAMMAR_CATEGORIES || [])];
    } catch (error) {
      console.warn('Error getting categories:', error);
      return [];
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (isTransitioning) return; // Prevent rapid clicks
    
    if (categoryFilter === categoryId) {
      // If clicking the same category, just toggle expansion without re-filtering
      setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
    } else {
      // Select new category and expand it
      setIsTransitioning(true);
      onCategoryChange(categoryId);
      onSubcategoryChange('all'); // Reset subcategory
      setExpandedCategory(categoryId);
      setTimeout(() => setIsTransitioning(false), 300); // Reset transition lock
    }
  };

  const handleCategoryToggle = (categoryId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (isTransitioning) return; // Prevent rapid clicks
    
    // Just toggle expansion without changing selection
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  // Auto-expand selected category only when initially selecting it
  React.useEffect(() => {
    if (categoryFilter !== 'all' && categoryFilter !== expandedCategory) {
      setExpandedCategory(categoryFilter);
    }
  }, [categoryFilter]); // Remove expandedCategory from dependencies to prevent loops

  const handleSubcategorySelect = (subcategoryId: string) => {
    onSubcategoryChange(subcategoryId);
  };

  // Custom clear filters that also resets curriculum level and exam board
  const handleClearFilters = () => {
    setCurriculumLevel(null);
    setExamBoard(null);
    onClearFilters();
  };

  // Reset curriculum level and exam board when theme changes
  React.useEffect(() => {
    if (themeFilter !== 'vocabulary') {
      setCurriculumLevel(null);
      setExamBoard(null);
    }
  }, [themeFilter]);

  const getSelectedCategoryName = () => {
    const categories = getCurrentCategories();
    const category = categories.find(cat => cat.id === categoryFilter);
    return category?.displayName || 'All Categories';
  };

  const getSelectedSubcategoryName = () => {
    if (subcategoryFilter === 'all') return '';
    const categories = getCurrentCategories();
    const category = categories.find(cat => cat.id === categoryFilter);
    const subcategory = category?.subcategories.find(sub => sub.id === subcategoryFilter);
    return subcategory?.displayName || '';
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="flex gap-2">
          {activeFiltersCount > 0 && (
            <Button variant="outline" onClick={handleClearFilters} size="sm">
              <RotateCcw className="w-4 h-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* Content Type Selection - Always Visible */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Content Type</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            className={`cursor-pointer transition-all ${
              themeFilter === 'all' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
            }`}
            onClick={() => onThemeChange('all')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-gray-100 rounded-full p-3">
                  <BookOpen className="w-6 h-6 text-gray-600" />
                </div>
              </div>
              <h4 className="font-semibold text-base">All Content</h4>
              <p className="text-sm text-gray-600 mt-1">All videos</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              themeFilter === 'vocabulary' ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:shadow-md'
            }`}
            onClick={() => onThemeChange('vocabulary')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-blue-100 rounded-full p-3">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <h4 className="font-semibold text-base">Vocabulary</h4>
              <p className="text-sm text-gray-600 mt-1">Word learning</p>
            </CardContent>
          </Card>

          <Card
            className={`cursor-pointer transition-all ${
              themeFilter === 'grammar' ? 'ring-2 ring-green-500 bg-green-50' : 'hover:shadow-md'
            }`}
            onClick={() => onThemeChange('grammar')}
          >
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="bg-green-100 rounded-full p-3">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h4 className="font-semibold text-base">Grammar</h4>
              <p className="text-sm text-gray-600 mt-1">Rules & structure</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter Status */}
      {activeFiltersCount > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3">
          <Filter className="w-4 h-4" />
          <span>{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active</span>
          <span className="text-gray-400">•</span>
          <span>{resultsCount} video{resultsCount !== 1 ? 's' : ''} found</span>
        </div>
      )}

      {/* Curriculum Level Selection - Show when vocabulary theme is selected */}
      {themeFilter === 'vocabulary' && !curriculumLevel && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Choose Curriculum Level</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* KS3 Option */}
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
              onClick={() => setCurriculumLevel('KS3')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-full p-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">KS3</h4>
                    <p className="text-sm text-gray-600 mt-1">Years 7-9 • Foundation vocabulary</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KS4 Option */}
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
              onClick={() => setCurriculumLevel('KS4')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-700 rounded-full p-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">KS4 (GCSE)</h4>
                    <p className="text-sm text-gray-600 mt-1">Years 10-11 • GCSE themes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Exam Board Selection - Show when KS4 is selected but no exam board chosen */}
      {themeFilter === 'vocabulary' && curriculumLevel === 'KS4' && !examBoard && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Choose Exam Board</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurriculumLevel(null)}
              className="flex items-center gap-2"
            >
              ← Back to Curriculum Level
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* AQA Option */}
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
              onClick={() => setExamBoard('AQA')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-full p-3">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">AQA</h4>
                    <p className="text-sm text-gray-600 mt-1">Assessment and Qualifications Alliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Edexcel Option */}
            <Card
              className="cursor-pointer transition-all hover:shadow-md hover:scale-105"
              onClick={() => setExamBoard('edexcel')}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-full p-3">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Edexcel</h4>
                    <p className="text-sm text-gray-600 mt-1">Pearson Edexcel</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Category Selection - Show when theme is selected and curriculum level is chosen (or grammar) */}
      {themeFilter !== 'all' && (curriculumLevel !== null || themeFilter === 'grammar') && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              {themeFilter === 'vocabulary'
                ? `${curriculumLevel} Vocabulary ${examBoard ? `(${examBoard})` : ''} Categories`
                : 'Grammar Categories'
              }
            </h3>
            <div className="flex items-center gap-2">
              {/* Back button for KS4 */}
              {themeFilter === 'vocabulary' && curriculumLevel === 'KS4' && examBoard && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setExamBoard(null)}
                  className="flex items-center gap-2"
                >
                  ← Back to Exam Board
                </Button>
              )}
              {/* Back button for KS3 */}
              {themeFilter === 'vocabulary' && curriculumLevel === 'KS3' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurriculumLevel(null)}
                  className="flex items-center gap-2"
                >
                  ← Back to Curriculum Level
                </Button>
              )}
              {/* Show/Hide categories button */}
              {categoryFilter !== 'all' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center gap-2"
                >
                  {showAdvancedFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  {showAdvancedFilters ? 'Minimize' : 'Show All'} Categories
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Always show categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getCurrentCategories().map((category) => {
                const Icon = category.icon;
                const isSelected = categoryFilter === category.id;
                const isExpanded = expandedCategory === category.id;

                return (
                  <div key={category.id}>
                    <Card
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-purple-500 bg-purple-50' : 'hover:shadow-md'
                      }`}
                      onClick={() => handleCategorySelect(category.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`bg-gradient-to-r ${category.color} rounded-full p-2`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">{category.displayName}</h4>
                              <p className="text-xs text-gray-600">
                                {category.subcategories.length} topics
                              </p>
                            </div>
                          </div>
                          {category.subcategories.length > 0 && (
                            <button
                              onClick={(e) => handleCategoryToggle(category.id, e)}
                              className="text-gray-400 hover:text-purple-600 transition-colors p-1"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Subcategories - Show when expanded */}
                    <AnimatePresence mode="wait">
                      {isExpanded && category.subcategories.length > 0 && (
                        <motion.div
                          key={`subcategories-${category.id}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: "easeInOut" }}
                          className="mt-3 overflow-hidden"
                        >
                          <div className="border-l-4 border-purple-200 pl-4">
                            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
                              <h5 className="font-medium text-sm text-gray-700 mb-3">
                                {category.displayName} Topics
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <button
                                  key={`all-${category.id}`}
                                  onClick={() => handleSubcategorySelect('all')}
                                  className={`text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                    subcategoryFilter === 'all'
                                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                      : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                                  }`}
                                >
                                  All {category.displayName}
                                </button>
                                {category.subcategories.map((subcategory) => (
                                  <button
                                    key={`${category.id}-${subcategory.id}`}
                                    onClick={() => handleSubcategorySelect(subcategory.id)}
                                    className={`text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                                      subcategoryFilter === subcategory.id
                                        ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                        : 'hover:bg-gray-50 text-gray-600 hover:text-gray-700'
                                    }`}
                                  >
                                    {subcategory.displayName}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}


      {/* Selected Filters Summary */}
      {(categoryFilter !== 'all' || subcategoryFilter !== 'all') && (
        <div className="flex flex-wrap gap-2">
          {categoryFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {getSelectedCategoryName()}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-600" 
                onClick={() => {
                  onCategoryChange('all');
                  onSubcategoryChange('all');
                  setExpandedCategory(null);
                }}
              />
            </Badge>
          )}
          {subcategoryFilter !== 'all' && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {getSelectedSubcategoryName()}
              <X 
                className="w-3 h-3 cursor-pointer hover:text-red-600" 
                onClick={() => onSubcategoryChange('all')}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
