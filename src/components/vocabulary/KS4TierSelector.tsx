import React from 'react';
import { Target, TrendingUp, ArrowLeft, BookOpen } from 'lucide-react';

export interface Tier {
  id: 'foundation' | 'higher';
  name: string;
  displayName: string;
  description: string;
  gradeRange: string;
  color: string;
  icon: React.ComponentType<any>;
  features: string[];
}

export const TIERS: Tier[] = [
  {
    id: 'foundation',
    name: 'foundation',
    displayName: 'Foundation Tier',
    description: 'Designed for students aiming for grades 1-5. Focuses on essential vocabulary and core language skills.',
    gradeRange: 'Grades 1-5',
    color: 'from-blue-600 to-blue-700',
    icon: Target,
    features: [
      'Essential vocabulary for everyday situations',
      'Core grammar and language structures',
      'Accessible content and contexts',
      'Clear progression pathway'
    ]
  },
  {
    id: 'higher',
    name: 'higher',
    displayName: 'Higher Tier',
    description: 'For students targeting grades 4-9. Includes more complex vocabulary and advanced language concepts.',
    gradeRange: 'Grades 4-9',
    color: 'from-purple-600 to-purple-700',
    icon: TrendingUp,
    features: [
      'Extended vocabulary range',
      'Complex grammatical structures',
      'Abstract and sophisticated topics',
      'Higher-level language skills'
    ]
  }
];

interface KS4TierSelectorProps {
  onTierSelect: (tier: 'foundation' | 'higher') => void;
  onBack?: () => void;
  selectedExamBoard?: 'aqa' | 'edexcel';
  selectedLanguage?: string;
  className?: string;
}

export default function KS4TierSelector({
  onTierSelect,
  onBack,
  selectedExamBoard = 'aqa',
  selectedLanguage = 'Spanish',
  className = ''
}: KS4TierSelectorProps) {
  
  const handleTierClick = (tierId: 'foundation' | 'higher') => {
    onTierSelect(tierId);
  };

  const examBoardDisplayName = selectedExamBoard.toUpperCase();

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          {onBack && (
            <button
              onClick={onBack}
              className="absolute left-4 p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 rounded-full">
            <BookOpen className="w-8 h-8" />
          </div>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your GCSE Tier
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Select your {selectedLanguage} GCSE tier for {examBoardDisplayName}. This determines the vocabulary complexity and grade boundaries.
        </p>
      </div>

      {/* Tier Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {TIERS.map((tier) => {
          const IconComponent = tier.icon;
          
          return (
            <div
              key={tier.id}
              onClick={() => handleTierClick(tier.id)}
              className="group cursor-pointer transform transition-all duration-200 hover:scale-105"
            >
              <div className="bg-white rounded-xl shadow-lg border-2 border-gray-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-200 p-6 h-full">
                {/* Icon and Title */}
                <div className="flex items-center mb-4">
                  <div className={`bg-gradient-to-r ${tier.color} text-white p-3 rounded-lg mr-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {tier.displayName}
                    </h3>
                    <p className="text-sm font-medium text-indigo-600">
                      {tier.gradeRange}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {tier.description}
                </p>

                {/* Features */}
                <div className="space-y-2 mb-6">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-start text-sm text-gray-600">
                      <div className={`w-2 h-2 ${tier.id === 'foundation' ? 'bg-blue-500' : 'bg-purple-500'} rounded-full mr-3 mt-2 flex-shrink-0`}></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-sm font-medium text-gray-500">
                    Click to select
                  </span>
                  <div className="text-indigo-600 group-hover:text-indigo-700 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Help Text */}
      <div className="text-center">
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 max-w-2xl mx-auto">
          <p className="text-sm text-indigo-800 mb-2">
            <strong>Which tier should I choose?</strong>
          </p>
          <div className="text-sm text-indigo-700 space-y-1">
            <p>• <strong>Foundation Tier:</strong> If you're aiming for grades 1-5 or want to focus on essential vocabulary</p>
            <p>• <strong>Higher Tier:</strong> If you're targeting grades 4-9 and want access to more advanced vocabulary</p>
            <p className="mt-2 text-xs text-indigo-600">
              Note: You can always switch between tiers as your confidence grows!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
