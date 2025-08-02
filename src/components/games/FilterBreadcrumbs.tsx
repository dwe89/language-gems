'use client';

import React from 'react';
import { ChevronRight, X } from 'lucide-react';
import { FilterState } from './FilterSidebar';
import { getCategoriesByCurriculum } from './KS4CategorySystem';
import { CURRICULUM_LEVELS_CONFIG } from './ModernCategorySelector';

interface FilterBreadcrumbsProps {
  filters: FilterState;
  gameCount: number;
  onClearFilter: (filterType: 'curriculumLevel' | 'categoryId' | 'subcategoryId') => void;
  className?: string;
}

export default function FilterBreadcrumbs({ 
  filters, 
  gameCount, 
  onClearFilter, 
  className = '' 
}: FilterBreadcrumbsProps) {
  const hasActiveFilters = filters.curriculumLevel || filters.categoryId || filters.subcategoryId;

  if (!hasActiveFilters) {
    return null;
  }

  // Get display names for the filters
  const curriculumLevelName = filters.curriculumLevel 
    ? CURRICULUM_LEVELS_CONFIG.find(level => level.code === filters.curriculumLevel)?.displayName
    : null;

  const categoryName = filters.categoryId && filters.curriculumLevel
    ? getCategoriesByCurriculum(filters.curriculumLevel)
        .find(cat => cat.id === filters.categoryId)?.displayName
    : null;

  const subcategoryName = filters.subcategoryId && filters.categoryId && filters.curriculumLevel
    ? getCategoriesByCurriculum(filters.curriculumLevel)
        .find(cat => cat.id === filters.categoryId)
        ?.subcategories.find(sub => sub.id === filters.subcategoryId)?.displayName
    : null;

  return (
    <div className={`bg-indigo-50 border border-indigo-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-indigo-700 font-medium">Filtered by:</span>
          
          {/* Curriculum Level */}
          {curriculumLevelName && (
            <>
              <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-indigo-200">
                <span className="text-indigo-900 font-medium">{curriculumLevelName}</span>
                <button
                  onClick={() => onClearFilter('curriculumLevel')}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {categoryName && <ChevronRight className="h-4 w-4 text-indigo-400" />}
            </>
          )}

          {/* Category */}
          {categoryName && (
            <>
              <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-indigo-200">
                <span className="text-indigo-900 font-medium">{categoryName}</span>
                <button
                  onClick={() => onClearFilter('categoryId')}
                  className="text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
              {subcategoryName && <ChevronRight className="h-4 w-4 text-indigo-400" />}
            </>
          )}

          {/* Subcategory */}
          {subcategoryName && (
            <div className="flex items-center space-x-1 bg-white px-2 py-1 rounded border border-indigo-200">
              <span className="text-indigo-900 font-medium">{subcategoryName}</span>
              <button
                onClick={() => onClearFilter('subcategoryId')}
                className="text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>

        {/* Game Count */}
        <div className="text-sm text-indigo-700">
          <span className="font-medium">{gameCount}</span> 
          <span className="ml-1">{gameCount === 1 ? 'game' : 'games'} found</span>
        </div>
      </div>
    </div>
  );
}
