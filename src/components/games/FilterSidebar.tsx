'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowRight, ArrowLeft, Gamepad2, Rocket, Anchor, Building2, Sun, BookOpen } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { getCategoriesByCurriculum, type CurriculumLevel } from './KS4CategorySystem';
import { Category, Subcategory, CURRICULUM_LEVELS_CONFIG } from './ModernCategorySelector';

export interface SelectionState {
  language: string | null;
  curriculumLevel: CurriculumLevel | null;
  categoryId: string | null;
  subcategoryId: string | null;
  theme: string | null;
  // KS4-specific fields
  examBoard?: 'AQA' | 'edexcel' | null;
  tier?: 'foundation' | 'higher' | null;
}

interface GameSelectionSidebarProps {
  onSelectionComplete: (selection: SelectionState) => void;
  onSelectionChange: (selection: SelectionState) => void;
  selectedGame: { id: string; name: string; supportsThemes?: boolean } | null;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const EXAM_BOARDS = [
  { code: 'AQA', name: 'AQA', displayName: 'AQA' },
  { code: 'edexcel', name: 'Edexcel', displayName: 'Edexcel' }
];

const TIERS = [
  { code: 'foundation', name: 'Foundation', displayName: 'Foundation Tier', description: 'Grades 1-5' },
  { code: 'higher', name: 'Higher', displayName: 'Higher Tier', description: 'Grades 4-9' }
];

const GAME_THEMES = [
  {
    id: 'default',
    name: 'Classic',
    description: 'Clean and professional design',
    preview: 'classic',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'tokyo-nights',
    name: 'Tokyo Nights',
    description: 'Neon cyberpunk aesthetic',
    preview: 'tokyo',
    color: 'from-pink-500 to-purple-600'
  },
  {
    id: 'pirate-adventure',
    name: 'Pirate Adventure',
    description: 'Swashbuckling maritime theme',
    preview: 'pirate',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: 'space-explorer',
    name: 'Space Explorer',
    description: 'Futuristic space adventure',
    preview: 'space',
    color: 'from-indigo-500 to-blue-600'
  },
  {
    id: 'lava-temple',
    name: 'Lava Temple',
    description: 'Ancient temple with fiery elements',
    preview: 'temple',
    color: 'from-red-500 to-orange-600'
  }
];

export default function GameSelectionSidebar({
  onSelectionComplete,
  onSelectionChange,
  selectedGame,
  className = ''
}: GameSelectionSidebarProps) {
  const [selection, setSelection] = useState<SelectionState>({
    language: null,
    curriculumLevel: null,
    categoryId: null,
    subcategoryId: null,
    theme: null,
    examBoard: null,
    tier: null
  });
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Get categories based on selected curriculum level and exam board
  const currentCategories = selection.curriculumLevel
    ? getCategoriesByCurriculum(selection.curriculumLevel, selection.examBoard || undefined)
    : [];

  // Check if selection is complete
  const isSelectionComplete = selection.language &&
    selection.curriculumLevel &&
    selection.categoryId &&
    selection.subcategoryId &&
    (!selectedGame?.supportsThemes || selection.theme) &&
    // For KS4, require exam board and tier selection
    (selection.curriculumLevel !== 'KS4' || (selection.examBoard && selection.tier));

  const updateSelection = (updates: Partial<SelectionState>) => {
    const newSelection = { ...selection, ...updates };
    setSelection(newSelection);
    onSelectionChange(newSelection);
  };

  const handleLanguageSelect = (language: string) => {
    updateSelection({ language });
    setCurrentStep(2);
  };

  const handleCurriculumLevelSelect = (level: CurriculumLevel) => {
    updateSelection({
      curriculumLevel: level,
      categoryId: null,
      subcategoryId: null,
      examBoard: null,
      tier: null
    });
    setSelectedCategory(null);
    // For KS4, go to exam board selection; otherwise go to category
    setCurrentStep(level === 'KS4' ? 3 : 5);
  };

  const handleExamBoardSelect = (examBoard: 'AQA' | 'edexcel') => {
    updateSelection({
      examBoard,
      categoryId: null,
      subcategoryId: null
    });
    setSelectedCategory(null);
    setCurrentStep(4);
  };

  const handleTierSelect = (tier: 'foundation' | 'higher') => {
    updateSelection({
      tier,
      categoryId: null,
      subcategoryId: null
    });
    setSelectedCategory(null);
    setCurrentStep(5);
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    updateSelection({
      categoryId: category.id,
      subcategoryId: null
    });
    setCurrentStep(6);
  };

  const handleSubcategorySelect = (subcategory: Subcategory) => {
    updateSelection({ subcategoryId: subcategory.id });
    if (selectedGame?.supportsThemes) {
      setCurrentStep(7);
    } else {
      setCurrentStep(7);
      const finalSelection = { ...selection, subcategoryId: subcategory.id, theme: 'default' };
      setSelection(finalSelection);
      onSelectionComplete(finalSelection);
    }
  };

  const handleThemeSelect = (theme: string) => {
    const finalSelection = { ...selection, theme };
    setSelection(finalSelection);
    onSelectionComplete(finalSelection);
  };

  const handleBack = (step: number) => {
    setCurrentStep(step);
    // Reset downstream selections to ensure a fresh flow
    if (step === 1) updateSelection({ language: null, curriculumLevel: null, categoryId: null, subcategoryId: null, theme: null, examBoard: null, tier: null });
    if (step === 2) updateSelection({ curriculumLevel: null, categoryId: null, subcategoryId: null, theme: null, examBoard: null, tier: null });
    if (step === 3) updateSelection({ examBoard: null, tier: null, categoryId: null, subcategoryId: null, theme: null });
    if (step === 4) updateSelection({ tier: null, categoryId: null, subcategoryId: null, theme: null });
    if (step === 5) updateSelection({ categoryId: null, subcategoryId: null, theme: null });
    if (step === 6) updateSelection({ subcategoryId: null, theme: null });
  };

  return (
    <div className={`bg-white border-r border-gray-200 h-full overflow-y-auto ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {selectedGame ? `Setup ${selectedGame.name}` : 'Select Game Content'}
        </h2>
        <p className="text-sm text-gray-600">
          Complete all steps to start playing
        </p>
      </div>

      {/* Selection Steps */}
      <div className="p-6 space-y-8">
        {/* Step 1: Language Selection */}
        <div className={`${currentStep >= 1 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              selection.language ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
            }`}>
              {selection.language ? '✓' : '1'}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Select Language</h3>
          </div>
          {selection.language && currentStep > 1 ? (
            <button
              onClick={() => handleBack(1)}
              className="flex items-center justify-between w-full p-4 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all"
            >
              <span className="font-medium">{SUPPORTED_LANGUAGES.find(l => l.code === selection.language)?.name}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageSelect(lang.code)}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                    selection.language === lang.code
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <ReactCountryFlag 
                    countryCode={lang.code.toUpperCase()} 
                    svg 
                    style={{ width: '2rem', height: '2rem' }}
                    className="rounded-full shadow-lg"
                  />
                  <span className="font-medium">{lang.name}</span>
                  {selection.language === lang.code && <ArrowRight className="h-4 w-4 ml-auto" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Step 2: Curriculum Level Selection */}
        <div className={`${currentStep >= 2 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={() => handleBack(1)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              selection.curriculumLevel ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
            }`}>
              {selection.curriculumLevel ? '✓' : '2'}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Select Level</h3>
          </div>
          {selection.curriculumLevel && currentStep > 2 ? (
            <button
              onClick={() => handleBack(2)}
              className="flex items-center justify-between w-full p-4 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all"
            >
              <span className="font-medium">{CURRICULUM_LEVELS_CONFIG.find(l => l.code === selection.curriculumLevel)?.displayName}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {CURRICULUM_LEVELS_CONFIG.map(level => {
                const IconComponent = level.icon;
                const isSelected = selection.curriculumLevel === level.code;
                return (
                  <button
                    key={level.code}
                    onClick={() => handleCurriculumLevelSelect(level.code)}
                    className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <IconComponent className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">{level.displayName}</div>
                      <div className="text-sm text-gray-500">{level.description}</div>
                    </div>
                    {isSelected && <ArrowRight className="h-4 w-4 ml-auto" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Step 3: Exam Board Selection (KS4 only) */}
        {selection.curriculumLevel === 'KS4' && (
          <div className={`${currentStep >= 3 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <button onClick={() => handleBack(2)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selection.examBoard ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
              }`}>
                {selection.examBoard ? '✓' : '3'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Select Exam Board</h3>
            </div>
            {selection.examBoard && currentStep > 3 ? (
              <button
                onClick={() => handleBack(3)}
                className="flex items-center justify-between w-full p-4 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all"
              >
                <span className="font-medium">{EXAM_BOARDS.find(b => b.code === selection.examBoard)?.displayName}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {EXAM_BOARDS.map((examBoard) => {
                  const isSelected = selection.examBoard === examBoard.code;
                  return (
                    <button
                      key={examBoard.code}
                      onClick={() => handleExamBoardSelect(examBoard.code as 'AQA' | 'edexcel')}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{examBoard.displayName}</div>
                        <div className="text-sm text-gray-500">GCSE {examBoard.name}</div>
                      </div>
                      {isSelected && <ArrowRight className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 4: Tier Selection (KS4 only) */}
        {selection.curriculumLevel === 'KS4' && (
          <div className={`${currentStep >= 4 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <button onClick={() => handleBack(3)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selection.tier ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
              }`}>
                {selection.tier ? '✓' : '4'}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Select Tier</h3>
            </div>
            {selection.tier && currentStep > 4 ? (
              <button
                onClick={() => handleBack(4)}
                className="flex items-center justify-between w-full p-4 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all"
              >
                <span className="font-medium">{TIERS.find(t => t.code === selection.tier)?.displayName}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {TIERS.map((tier) => {
                  const isSelected = selection.tier === tier.code;
                  return (
                    <button
                      key={tier.code}
                      onClick={() => handleTierSelect(tier.code as 'foundation' | 'higher')}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-left">
                        <div className="font-medium">{tier.displayName}</div>
                        <div className="text-sm text-gray-500">{tier.description}</div>
                      </div>
                      {isSelected && <ArrowRight className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 5: Category Selection */}
        <div className={`${currentStep >= 5 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={() => handleBack(selection.curriculumLevel === 'KS4' ? 4 : 2)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              selection.categoryId ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
            }`}>
              {selection.categoryId ? '✓' : (selection.curriculumLevel === 'KS4' ? '5' : '3')}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Select Category</h3>
          </div>
          {selection.categoryId && currentStep > 5 ? (
            <button
              onClick={() => handleBack(5)}
              className="flex items-center justify-between w-full p-4 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all"
            >
              <span className="font-medium">{selectedCategory?.displayName}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            currentCategories.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {currentCategories.map((category) => {
                  const IconComponent = category.icon;
                  const isSelected = selection.categoryId === category.id;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategorySelect(category)}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="font-medium">{category.displayName}</span>
                      {isSelected && <ArrowRight className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Step 6: Subcategory Selection */}
        <div className={`${currentStep >= 6 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
          <div className="flex items-center space-x-3 mb-4">
            <button onClick={() => handleBack(5)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </button>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              selection.subcategoryId ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
            }`}>
              {selection.subcategoryId ? '✓' : (selection.curriculumLevel === 'KS4' ? '6' : '4')}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Select Subtopic</h3>
          </div>
          {selection.subcategoryId && currentStep > 6 ? (
            <button
              onClick={() => handleBack(6)}
              className="flex items-center justify-between w-full p-4 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all"
            >
              <span className="font-medium">{selectedCategory?.subcategories.find(s => s.id === selection.subcategoryId)?.displayName}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            selectedCategory && selectedCategory.subcategories.length > 0 && (
              <div className="grid grid-cols-1 gap-3">
                {selectedCategory.subcategories.map((subcategory) => {
                  const isSelected = selection.subcategoryId === subcategory.id;
                  return (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategorySelect(subcategory)}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium">{subcategory.displayName}</span>
                      {isSelected && <ArrowRight className="h-4 w-4" />}
                    </button>
                  );
                })}
              </div>
            )
          )}
        </div>

        {/* Step 7: Theme Selection (if game supports themes) */}
        {selectedGame?.supportsThemes && (
          <div className={`${currentStep >= 7 ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
            <div className="flex items-center space-x-3 mb-4">
              <button onClick={() => handleBack(6)} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <ArrowLeft className="h-5 w-5 text-gray-500" />
              </button>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                selection.theme ? 'bg-green-500 text-white' : 'bg-indigo-500 text-white'
              }`}>
                {selection.theme ? '✓' : (selection.curriculumLevel === 'KS4' ? '7' : '5')}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Select Theme</h3>
            </div>
            {selection.theme && currentStep > 7 ? (
              <button
                onClick={() => handleBack(7)}
                className="flex items-center justify-between w-full p-4 rounded-lg border border-indigo-500 bg-indigo-50 text-indigo-700 transition-all"
              >
                <span className="font-medium">{GAME_THEMES.find(t => t.id === selection.theme)?.name}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {GAME_THEMES.map((theme) => {
                  const isSelected = selection.theme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeSelect(theme.id)}
                      className={`flex items-center space-x-3 p-4 rounded-lg border transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <span className="text-2xl">
                        {theme.preview === 'classic' && <Gamepad2 className="h-6 w-6" />}
                        {theme.preview === 'tokyo' && <Building2 className="h-6 w-6" />}
                        {theme.preview === 'pirate' && <Anchor className="h-6 w-6" />}
                        {theme.preview === 'space' && <Rocket className="h-6 w-6" />}
                        {theme.preview === 'temple' && <Sun className="h-6 w-6" />}
                      </span>
                      <div className="text-left">
                        <div className="font-medium">{theme.name}</div>
                        <div className="text-sm text-gray-500">{theme.description}</div>
                      </div>
                      {isSelected && <ArrowRight className="h-4 w-4 ml-auto" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Start Game Button */}
        {isSelectionComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pt-6 border-t border-gray-200"
          >
            <button
              onClick={() => onSelectionComplete(selection)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
            >
              <Play className="h-5 w-5" />
              <span>Start Game</span>
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
