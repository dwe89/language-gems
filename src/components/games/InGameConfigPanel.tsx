'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Globe, BookOpen, Target, Palette } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import { UnifiedSelectionConfig, loadVocabulary } from '../../hooks/useUnifiedVocabulary';

// Import category data
import { VOCABULARY_CATEGORIES as KS3_CATEGORIES } from './ModernCategorySelector';
import { KS4_VOCABULARY_CATEGORIES as KS4_CATEGORIES } from './KS4CategorySystem';

interface InGameConfigPanelProps {
  currentConfig: UnifiedSelectionConfig;
  onConfigChange: (newConfig: UnifiedSelectionConfig, vocabulary: any[], theme?: string) => void;
  supportedLanguages?: string[];
  supportsThemes?: boolean;
  currentTheme?: string;
  isOpen: boolean;
  onClose: () => void;
}

// Language options with country codes for flags
const LANGUAGES = [
  { code: 'es', name: 'Spanish', countryCode: 'ES' },
  { code: 'fr', name: 'French', countryCode: 'FR' },
  { code: 'de', name: 'German', countryCode: 'DE' }
];

// Curriculum levels
const CURRICULUM_LEVELS = [
  { code: 'KS2' as const, name: 'KS2', displayName: 'Key Stage 2', description: 'Ages 7-11' },
  { code: 'KS3' as const, name: 'KS3', displayName: 'Key Stage 3', description: 'Ages 11-14' },
  { code: 'KS4' as const, name: 'KS4', displayName: 'Key Stage 4 (GCSE)', description: 'Ages 14-16' },
  { code: 'KS5' as const, name: 'KS5', displayName: 'Key Stage 5 (A-Level)', description: 'Ages 16-18' }
];

// Theme options
const THEME_OPTIONS = [
  { id: 'default', name: 'Classic', icon: '🎮', accentColor: 'bg-blue-500' },
  { id: 'tokyo', name: 'Tokyo Nights', icon: '🏙️', accentColor: 'bg-pink-600' },
  { id: 'pirate', name: 'Pirate Adventure', icon: '🏴‍☠️', accentColor: 'bg-amber-600' },
  { id: 'space', name: 'Space Explorer', icon: '🚀', accentColor: 'bg-purple-600' },
  { id: 'temple', name: 'Lava Temple', icon: '🌋', accentColor: 'bg-orange-600' }
];

// Get categories based on curriculum level
const getCategoriesByCurriculum = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
  if (level === 'KS4') return KS4_CATEGORIES;
  if (level === 'KS3') return KS3_CATEGORIES;
  return [];
};

export default function InGameConfigPanel({
  currentConfig,
  onConfigChange,
  supportedLanguages = ['es', 'fr', 'de'],
  supportsThemes = false,
  currentTheme = 'default',
  isOpen,
  onClose
}: InGameConfigPanelProps) {
  const [tempConfig, setTempConfig] = useState<UnifiedSelectionConfig>(currentConfig);
  const [tempTheme, setTempTheme] = useState<string>(currentTheme);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'language' | 'curriculum' | 'category' | 'theme'>(
    'language'
  );

  const availableLanguages = LANGUAGES.filter(lang => supportedLanguages.includes(lang.code));
  const currentCategories = getCategoriesByCurriculum(tempConfig.curriculumLevel);
  // Safely find currentCategory, it can be undefined
  const currentCategory = currentCategories.find(cat => cat.id === tempConfig.categoryId);

  const handleLanguageChange = (languageCode: string) => {
    setTempConfig(prev => ({ ...prev, language: languageCode }));
    setActiveTab('curriculum');
  };

  const handleCurriculumChange = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
    setTempConfig(prev => ({
      ...prev,
      curriculumLevel: level,
      categoryId: '',
      subcategoryId: undefined
    }));
    setActiveTab('category');
  };

  const handleCategoryChange = (categoryId: string) => {
    setTempConfig(prev => ({
      ...prev,
      categoryId,
      subcategoryId: undefined
    }));
    // Use optional chaining here
    if (currentCategories.find(cat => cat.id === categoryId)?.subcategories.length > 0) {
      setActiveTab('category');
    } else if (supportsThemes) {
      setActiveTab('theme');
    }
  };

  const handleSubcategoryChange = (subcategoryId: string) => {
    setTempConfig(prev => ({ ...prev, subcategoryId }));
    if (supportsThemes) {
      setActiveTab('theme');
    }
  };

  const handleThemeChange = (themeId: string) => {
    setTempTheme(themeId);
  };

  const handleApplyChanges = async () => {
    if (!tempConfig.language || !tempConfig.categoryId) return;

    setLoading(true);
    try {
      console.log('🔄 Loading new vocabulary for config:', tempConfig);
      const vocabulary = await loadVocabulary(tempConfig);

      if (vocabulary && vocabulary.length > 0) {
        console.log('✅ New vocabulary loaded, applying changes...');
        onConfigChange(tempConfig, vocabulary, tempTheme);
        onClose();
      } else {
        console.warn('⚠️ No vocabulary found for new configuration');
      }
    } catch (error) {
      console.error('❌ Error loading new vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const canApply = tempConfig.language && tempConfig.categoryId &&
    (JSON.stringify(tempConfig) !== JSON.stringify(currentConfig) || tempTheme !== currentTheme);

  const tabs = [
    { id: 'language', name: 'Language', icon: Globe },
    { id: 'curriculum', name: 'Level', icon: BookOpen },
    { id: 'category', name: 'Topic', icon: Target },
  ];

  if (supportsThemes) {
    tabs.push({ id: 'theme', name: 'Theme', icon: Palette });
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'language':
        return (
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {availableLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageChange(language.code)}
                className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                  tempConfig.language === language.code
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg shadow-indigo-200/50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="mb-2">
                  <ReactCountryFlag
                    countryCode={language.countryCode}
                    svg
                    style={{
                      width: '2.2rem',
                      height: '2.2rem',
                      borderRadius: '0.5rem'
                    }}
                  />
                </div>
                <div className={`font-semibold text-sm ${
                  tempConfig.language === language.code ? 'text-indigo-700' : 'text-gray-700'
                }`}>
                  {language.name}
                </div>
                {tempConfig.language === language.code && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        );
      case 'curriculum':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CURRICULUM_LEVELS.map((level) => (
              <button
                key={level.code}
                onClick={() => handleCurriculumChange(level.code)}
                className={`group relative flex flex-col items-start p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 text-left ${
                  tempConfig.curriculumLevel === level.code
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 shadow-lg shadow-purple-200/50'
                    : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                }`}
              >
                <div className={`font-bold text-base mb-0.5 ${
                  tempConfig.curriculumLevel === level.code ? 'text-purple-700' : 'text-gray-900'
                }`}>
                  {level.displayName}
                </div>
                <div className={`text-xs ${
                  tempConfig.curriculumLevel === level.code ? 'text-purple-600' : 'text-gray-600'
                }`}>
                  {level.description}
                </div>
                {tempConfig.curriculumLevel === level.code && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        );
      case 'category':
        return (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                <Target className="h-6 w-6 text-indigo-600 mr-2" />
                Category
              </h3>
              <p className="text-gray-600 text-sm">Select a main topic for your vocabulary.</p>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
              {currentCategories.length > 0 ? (
                currentCategories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => handleCategoryChange(category.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all text-left ${
                        tempConfig.categoryId === category.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{category.displayName}</span>
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 text-sm">No categories available for this curriculum level.</p>
              )}
            </div>
            {/* Safely check currentCategory and its subcategories before rendering */}
            {currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                  <Target className="h-6 w-6 text-indigo-600 mr-2" />
                  Subtopic
                </h3>
                <p className="text-gray-600 text-sm">Refine your topic selection.</p>
                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar mt-4">
                  {currentCategory.subcategories.map((subcategory) => (
                    <button
                      key={subcategory.id}
                      onClick={() => handleSubcategoryChange(subcategory.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all text-left ${
                        tempConfig.subcategoryId === subcategory.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="text-indigo-400">●</span>
                      <span className="font-medium">{subcategory.displayName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        );
      case 'theme':
        return (
          <>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                <Palette className="h-6 w-6 text-pink-600 mr-2" />
                Theme
              </h3>
              <p className="text-gray-600 text-sm">Choose your visual style for the game.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    tempTheme === theme.id
                      ? `${theme.accentColor} border-white text-white shadow-lg shadow-${theme.accentColor.split('-')[1]}-200/50`
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="text-2xl mb-2">{theme.icon}</div>
                  <div className="text-sm font-semibold text-center">{theme.name}</div>
                  {tempTheme === theme.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 p-5 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-sm">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Game Settings</h2>
                    <p className="text-white/80 text-sm">Customize your learning experience</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 bg-white/20 hover:bg-white/30 rounded-xl transition-colors backdrop-blur-sm"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex bg-gray-50 border-b border-gray-100 p-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                // Updated isDisabled logic to safely check currentCategory
                const isDisabled = (tab.id === 'category' && (!tempConfig.language || !tempConfig.curriculumLevel)) ||
                                   (tab.id === 'theme' && (!tempConfig.language || !tempConfig.curriculumLevel || !tempConfig.categoryId || (currentCategory && currentCategory.subcategories && currentCategory.subcategories.length > 0 && !tempConfig.subcategoryId)));
                return (
                  <button
                    key={tab.id}
                    // Type assertion added here to resolve TypeScript error
                    onClick={() => setActiveTab(tab.id as 'language' | 'curriculum' | 'category' | 'theme')}
                    disabled={isDisabled}
                    className={`flex-1 flex items-center justify-center py-2 px-1 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none
                      ${activeTab === tab.id
                        ? 'bg-white text-indigo-700 shadow-sm'
                        : isDisabled
                          ? 'text-gray-400 cursor-not-allowed'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-indigo-600'
                      }`}
                  >
                    <TabIcon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </div>

            {/* Content - Tabbed */}
            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
              {renderTabContent()}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-b-3xl">
              <button
                onClick={onClose}
                className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyChanges}
                disabled={!canApply || loading}
                className={`px-7 py-2.5 rounded-xl font-semibold transition-all duration-200 text-sm ${
                  canApply && !loading
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loading ? 'Loading...' : 'Apply Changes'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}