'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import { AssessmentCategory } from '@/services/teacherAssignmentAnalytics';

interface AssessmentFilterProps {
  availableTypes: AssessmentCategory[];
  selectedTypes: Set<AssessmentCategory>;
  onToggleType: (type: AssessmentCategory) => void;
  onClearAll: () => void;
}

const ASSESSMENT_TYPE_LABELS: Partial<Record<AssessmentCategory, string>> = {
  'reading-comprehension': 'Reading Comprehension',
  'gcse-reading': 'GCSE Reading',
  'gcse-listening': 'GCSE Listening',
  'gcse-writing': 'GCSE Writing',
  'gcse-dictation': 'GCSE Dictation',
  'edexcel-listening': 'Edexcel Listening',
};

const ASSESSMENT_TYPE_COLORS: Record<string, string> = {
  'reading-comprehension': 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  'gcse-reading': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  'gcse-listening': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  'gcse-writing': 'bg-green-100 text-green-700 hover:bg-green-200',
  'gcse-dictation': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  'edexcel-listening': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  'aqa-reading': 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  'aqa-listening': 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  'aqa-dictation': 'bg-orange-100 text-orange-700 hover:bg-orange-200',
  'aqa-writing': 'bg-green-100 text-green-700 hover:bg-green-200',
  'four-skills': 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
  'exam-style': 'bg-red-100 text-red-700 hover:bg-red-200',
  'vocabulary-game': 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200',
  'grammar-practice': 'bg-pink-100 text-pink-700 hover:bg-pink-200',
};

export function AssessmentFilter({ 
  availableTypes, 
  selectedTypes, 
  onToggleType, 
  onClearAll 
}: AssessmentFilterProps) {
  if (availableTypes.length === 0) {
    return null;
  }

  const allSelected = selectedTypes.size === 0 || selectedTypes.size === availableTypes.length;
  const someSelected = selectedTypes.size > 0 && selectedTypes.size < availableTypes.length;

  return (
    <div className="bg-white rounded-lg border p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by Assessment Type</span>
          {someSelected && (
            <Badge variant="secondary" className="ml-2">
              {selectedTypes.size} selected
            </Badge>
          )}
        </div>
        {someSelected && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Clear filters
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {availableTypes.map((type) => {
          const isSelected = selectedTypes.size === 0 || selectedTypes.has(type);
          const colorClass = ASSESSMENT_TYPE_COLORS[type] || 'bg-gray-100 text-gray-700 hover:bg-gray-200';

          return (
            <button
              key={type}
              onClick={() => onToggleType(type)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all
                ${isSelected ? colorClass : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}
                border-2 ${isSelected ? 'border-current' : 'border-transparent'}
              `}
            >
              {ASSESSMENT_TYPE_LABELS[type] || type}
            </button>
          );
        })}
      </div>

      {someSelected && (
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          Showing results for selected assessment types only
        </div>
      )}
    </div>
  );
}
