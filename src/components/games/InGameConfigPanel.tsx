'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, X, Globe, BookOpen, Target, Palette, Gamepad2, Rocket, Anchor, Building2, Sun, ArrowRight, ArrowLeft, ChevronDown } from 'lucide-react';
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
  { id: 'default', name: 'Classic', icon: 'classic', accentColor: 'bg-blue-500' },
  { id: 'tokyo', name: 'Tokyo Nights', icon: 'tokyo', accentColor: 'bg-pink-600' },
  { id: 'pirate', name: 'Pirate Adventure', icon: 'pirate', accentColor: 'bg-amber-600' },
  { id: 'space', name: 'Space Explorer', icon: 'space', accentColor: 'bg-purple-600' },
  { id: 'temple', name: 'Lava Temple', icon: 'temple', accentColor: 'bg-orange-600' }
];

// Helper functions
const getCategoriesByCurriculum = (level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
  if (level === 'KS4') return KS4_CATEGORIES;
  if (level === 'KS3') return KS3_CATEGORIES;
  return [];
};

const getThemeIcon = (iconName: string) => {
  switch (iconName) {
    case 'classic': return <Gamepad2 className="h-6 w-6" />;
    case 'tokyo': return <Building2 className="h-6 w-6" />;
    case 'pirate': return <Anchor className="h-6 w-6" />;
    case 'space': return <Rocket className="h-6 w-6" />;
    case 'temple': return <Sun className="h-6 w-6" />;
    default: return null;
  }
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
  const [vocabularySource, setVocabularySource] = useState<'curriculum' | 'custom'>('curriculum');
  const [customWords, setCustomWords] = useState<string>('');

  const availableLanguages = useMemo(() => LANGUAGES.filter(lang => supportedLanguages.includes(lang.code)), [supportedLanguages]);
  const currentCategories = useMemo(() => getCategoriesByCurriculum(tempConfig.curriculumLevel), [tempConfig.curriculumLevel]);
  const currentCategory = useMemo(() => currentCategories.find(cat => cat.id === tempConfig.categoryId), [currentCategories, tempConfig.categoryId]);

  const handleLanguageChange = useCallback((languageCode: string) => {
    setTempConfig(prev => ({ ...prev, language: languageCode }));
    setActiveTab('curriculum');
  }, []);

  const handleCurriculumChange = useCallback((level: 'KS2' | 'KS3' | 'KS4' | 'KS5') => {
    setTempConfig(prev => ({
      ...prev,
      curriculumLevel: level,
      categoryId: '',
      subcategoryId: undefined
    }));
    setActiveTab('category');
  }, []);

  const handleVocabularySourceChange = useCallback((source: 'curriculum' | 'custom') => {
    setVocabularySource(source);
    // Stay on the current tab to show the appropriate UI
    // Don't auto-navigate - let user see the changes and navigate manually
  }, []);

  const handleCategoryChange = useCallback((categoryId: string) => {
    setTempConfig(prev => {
      const found = getCategoriesByCurriculum(prev.curriculumLevel).find(cat => cat.id === categoryId);
      if (found && found.subcategories && found.subcategories.length > 0) {
        return {
          ...prev,
          categoryId,
          subcategoryId: found.subcategories[0]?.id // Auto-select first subcategory
        };
      }
      return { ...prev, categoryId, subcategoryId: undefined };
    });
    setActiveTab('category');
  }, []);

  const handleSubcategoryChange = useCallback((subcategoryId: string) => {
    setTempConfig(prev => ({ ...prev, subcategoryId }));
  }, []);

  const handleThemeChange = useCallback((themeId: string) => {
    setTempTheme(themeId);
  }, []);

  const handleApplyChanges = useCallback(async () => {
    if (!tempConfig.language) return;

    // For custom vocabulary, we need different validation
    if (vocabularySource === 'custom') {
      if (!customWords.trim()) return;

      setLoading(true);
      try {
        // Parse custom words and create vocabulary items
        const words = customWords.split('\n').filter(word => word.trim());
        const customVocabulary = words.map((word, index) => ({
          id: `custom-${index}`,
          word: word.trim(),
          translation: word.trim(), // For hangman, we just need the word
          language: tempConfig.language,
          category: 'custom',
          subcategory: 'custom',
          part_of_speech: 'unknown',
          difficulty_level: 'beginner'
        }));

        // Update config to indicate custom mode
        const customConfig = {
          ...tempConfig,
          customMode: true,
          categoryId: 'custom',
          subcategoryId: 'custom'
        };

        onConfigChange(customConfig, customVocabulary, tempTheme);
        onClose();
      } catch (error) {
        console.error('❌ Error processing custom vocabulary:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Original curriculum-based logic
      if (!tempConfig.categoryId) return;
      setLoading(true);
      try {
        const vocabulary = await loadVocabulary(tempConfig);
        if (vocabulary && vocabulary.length > 0) {
          onConfigChange(tempConfig, vocabulary, tempTheme);
          onClose();
        } else {
          // TODO: Show a user-friendly error message
          console.warn('⚠️ No vocabulary found for new configuration');
        }
      } catch (error) {
        console.error('❌ Error loading new vocabulary:', error);
      } finally {
        setLoading(false);
      }
    }
  }, [tempConfig, tempTheme, vocabularySource, customWords, onConfigChange, onClose]);

  const canApply = tempConfig.language &&
    ((vocabularySource === 'curriculum' && tempConfig.categoryId) ||
     (vocabularySource === 'custom' && customWords.trim())) &&
    (JSON.stringify(tempConfig) !== JSON.stringify(currentConfig) ||
     tempTheme !== currentTheme ||
     vocabularySource === 'custom');

  const tabs = useMemo(() => {
    const baseTabs = [
      { id: 'language', name: 'Language', icon: Globe },
      { id: 'curriculum', name: 'Level', icon: BookOpen },
      { id: 'category', name: 'Topic', icon: Target },
    ];
    if (supportsThemes) {
      baseTabs.push({ id: 'theme', name: 'Theme', icon: Palette });
    }
    return baseTabs;
  }, [supportsThemes]);

  const getNextTab = useCallback((current: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === current);
    return tabs[currentIndex + 1]?.id;
  }, [tabs]);

  const getPrevTab = useCallback((current: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === current);
    return tabs[currentIndex - 1]?.id;
  }, [tabs]);

  const renderTabContent = useCallback(() => {
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
                    style={{ width: '2.2rem', height: '2.2rem', borderRadius: '0.5rem' }}
                  />
                </div>
                <div className={`font-semibold text-sm ${
                  tempConfig.language === language.code ? 'text-indigo-700' : 'text-gray-700'
                }`}>
                  {language.name}
                </div>
                {tempConfig.language === language.code && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center border-2 border-white">
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
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center border-2 border-white">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        );
      case 'category':
        return (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                <Target className="h-6 w-6 text-indigo-600 mr-2" />
                Vocabulary Source
              </h3>
              <p className="text-gray-600 text-sm">Choose your vocabulary source.</p>

              {/* Custom Vocabulary Option */}
              <div className="mb-4">
                <button
                  onClick={() => handleVocabularySourceChange('custom')}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all text-left ${
                    vocabularySource === 'custom'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <div className="h-5 w-5 flex-shrink-0 text-purple-600">✏️</div>
                  <div>
                    <div className="font-medium">Custom Vocabulary</div>
                    <div className="text-sm opacity-75">Enter your own words</div>
                  </div>
                </button>

                {/* Custom words input */}
                {vocabularySource === 'custom' && (
                  <div className="mt-3 p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <label className="block text-sm font-medium text-purple-900 mb-2">
                      Enter your words (one per line):
                    </label>
                    <textarea
                      value={customWords}
                      onChange={(e) => setCustomWords(e.target.value)}
                      className="w-full h-32 p-3 border border-purple-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="casa&#10;perro&#10;gato&#10;escuela"
                    />
                    <p className="text-xs text-purple-600 mt-2">
                      Enter one word per line. Perfect for practicing specific vocabulary!
                    </p>
                  </div>
                )}
              </div>

              {/* Curriculum Topics Option */}
              <div>
                <button
                  onClick={() => handleVocabularySourceChange('curriculum')}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all text-left mb-3 ${
                    vocabularySource === 'curriculum'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  <BookOpen className="h-5 w-5 flex-shrink-0 text-indigo-600" />
                  <div>
                    <div className="font-medium">Curriculum Topics</div>
                    <div className="text-sm opacity-75">Choose from organized vocabulary topics</div>
                  </div>
                </button>

                {/* Show curriculum categories only when curriculum is selected */}
                {vocabularySource === 'curriculum' && (
                  <div className="relative overflow-hidden max-h-48 mt-4">
                    <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-2 custom-scrollbar max-h-48">
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
                {currentCategories.length > 4 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                    <ChevronDown className="h-4 w-4 text-gray-400 animate-bounce" />
                  </div>
                )}
                <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white to-transparent" />
              </div>
                )}
              </div>
            </div>
            {vocabularySource === 'curriculum' && currentCategory?.subcategories && currentCategory.subcategories.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
                  <Target className="h-6 w-6 text-indigo-600 mr-2" />
                  Subtopic
                </h3>
                <p className="text-gray-600 text-sm">Refine your topic selection.</p>
                <div className="relative overflow-hidden max-h-40 mt-4">
                  <div className="grid grid-cols-1 gap-2 overflow-y-auto pr-2 custom-scrollbar max-h-40">
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
                  {currentCategory.subcategories.length > 3 && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <ChevronDown className="h-4 w-4 text-gray-400 animate-bounce" />
                    </div>
                  )}
                  <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white to-transparent" />
                </div>
              </div>
            )}
          </div>
        );
      case 'theme':
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center mb-2">
              <Palette className="h-6 w-6 text-pink-600 mr-2" />
              Theme
            </h3>
            <p className="text-gray-600 text-sm">Choose your visual style for the game.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleThemeChange(theme.id)}
                  className={`group relative flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    tempTheme === theme.id
                      ? 'border-transparent text-white shadow-lg'
                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700'
                  } ${theme.accentColor}`}
                >
                  <div className="text-2xl mb-2">
                    {getThemeIcon(theme.icon)}
                  </div>
                  <div className="text-sm font-semibold text-center">{theme.name}</div>
                  {tempTheme === theme.id && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border-2 border-current">
                      <div className="w-1.5 h-1.5 bg-current rounded-full"></div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  }, [activeTab, tempConfig, tempTheme, vocabularySource, customWords, availableLanguages, currentCategories, currentCategory, handleLanguageChange, handleCurriculumChange, handleCategoryChange, handleSubcategoryChange, handleThemeChange, handleVocabularySourceChange, setCustomWords]);

  const canGoNext = () => {
    switch (activeTab) {
      case 'language': return !!tempConfig.language;
      case 'curriculum': return !!tempConfig.curriculumLevel;
      case 'category':
        if (vocabularySource === 'custom') {
          return !!customWords.trim();
        }
        return !!tempConfig.categoryId && (!currentCategory?.subcategories || currentCategory.subcategories.length === 0 || !!tempConfig.subcategoryId);
      case 'theme': return true;
      default: return false;
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
                  aria-label="Close settings panel"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex bg-gray-50 border-b border-gray-100 p-2">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                const isDisabled = (tab.id === 'curriculum' && !tempConfig.language) ||
                                   (tab.id === 'category' && (!tempConfig.language || !tempConfig.curriculumLevel)) ||
                                   (tab.id === 'theme' && (!tempConfig.language || !tempConfig.curriculumLevel || !tempConfig.categoryId));
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
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

            {/* Content & Action Buttons - Updated */}
            <div className="p-6 overflow-y-auto flex-grow custom-scrollbar">
              {renderTabContent()}
            </div>
            
            {/* Footer with Navigation & Apply */}
            <div className="flex items-center justify-between p-5 border-t border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-b-3xl">
                {activeTab !== 'language' && (
                    <button
                        onClick={() => setActiveTab(getPrevTab(activeTab) as any)}
                        className="flex items-center px-4 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium text-sm"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back
                    </button>
                )}
                {activeTab === 'language' && (
                  <button
                    onClick={onClose}
                    className="px-5 py-2.5 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-200 font-medium text-sm"
                  >
                    Cancel
                  </button>
                )}
                
                {activeTab !== tabs[tabs.length - 1].id && canGoNext() && (
                    <button
                        onClick={() => setActiveTab(getNextTab(activeTab) as any)}
                        className="flex items-center px-4 py-2.5 ml-auto rounded-xl font-semibold transition-all duration-200 text-sm bg-indigo-500 text-white hover:bg-indigo-600"
                    >
                        Next
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </button>
                )}
                {activeTab === tabs[tabs.length - 1].id && (
                    <button
                        onClick={handleApplyChanges}
                        disabled={!canApply || loading}
                        className={`px-7 py-2.5 ml-auto rounded-xl font-semibold transition-all duration-200 text-sm ${
                            canApply && !loading
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        {loading ? 'Loading...' : 'Apply Changes'}
                    </button>
                )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}