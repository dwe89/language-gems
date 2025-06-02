'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import ThemeSelector from './ThemeSelector';

type GameSettingsProps = {
  onStartGame?: (settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    customWords: string[];
  }) => void;
  setupStage?: 'language' | 'category' | 'difficulty';
  onLanguageSelect?: (language: string) => void;
  onCategorySelect?: (category: string, customWords?: string[]) => void;
  onDifficultySelect?: (difficulty: string, theme: string) => void;
};

const difficulties = [
  { 
    id: 'beginner', 
    label: 'Beginner', 
    description: 'Shorter words, more time',
    icon: '🔰'
  },
  { 
    id: 'intermediate', 
    label: 'Intermediate', 
    description: 'Medium length words',
    icon: '🌟'
  },
  { 
    id: 'advanced', 
    label: 'Advanced', 
    description: 'Longer words, less time',
    icon: '⚡'
  },
  { 
    id: 'expert', 
    label: 'Expert', 
    description: 'Challenging words, tight time limit',
    icon: '🏆'
  },
];

const languages = [
  { id: 'spanish', label: 'Spanish', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'french', label: 'French', color: 'bg-blue-100 border-blue-300 text-blue-700' },
  { id: 'german', label: 'German', color: 'bg-yellow-100 border-yellow-300 text-yellow-800' },
  { id: 'italian', label: 'Italian', color: 'bg-green-100 border-green-300 text-green-700' },
  { id: 'english', label: 'English', color: 'bg-indigo-100 border-indigo-300 text-indigo-700' },
  { id: 'japanese', label: 'Japanese', color: 'bg-pink-100 border-pink-300 text-pink-700' },
  { id: 'mandarin', label: 'Mandarin', color: 'bg-red-100 border-red-300 text-red-700' },
  { id: 'portuguese', label: 'Portuguese', color: 'bg-green-100 border-green-300 text-green-700' },
  { id: 'arabic', label: 'Arabic', color: 'bg-amber-100 border-amber-300 text-amber-700' },
  { id: 'russian', label: 'Russian', color: 'bg-blue-100 border-blue-300 text-blue-700' },
];

// Category structure with hierarchical organization
const categoryGroups = [
  {
    id: 'basics',
    label: 'Basics',
    categories: [
      { id: 'numbers', label: 'Numbers', emoji: '🔢', bgColor: 'bg-blue-50' },
      { id: 'colors', label: 'Colors', emoji: '🎨', bgColor: 'bg-green-50' },
      { id: 'days', label: 'Days of the Week', emoji: '📅', bgColor: 'bg-yellow-50' },
      { id: 'months', label: 'Months & Seasons', emoji: '🍂', bgColor: 'bg-orange-50' },
      { id: 'greetings', label: 'Greetings & Introductions', emoji: '👋', bgColor: 'bg-purple-50' },
      { id: 'phrases', label: 'Common Phrases', emoji: '💬', bgColor: 'bg-indigo-50' },
    ]
  },
  {
    id: 'people',
    label: 'People & Relationships',
    categories: [
      { id: 'family', label: 'Family Members', emoji: '👪', bgColor: 'bg-pink-50' },
      { id: 'physicaltraits', label: 'Physical Traits', emoji: '👤', bgColor: 'bg-amber-50' },
      { id: 'personality', label: 'Personality Traits', emoji: '😊', bgColor: 'bg-teal-50' },
      { id: 'professions', label: 'Professions & Jobs', emoji: '👨‍⚕️', bgColor: 'bg-emerald-50' },
    ]
  },
  {
    id: 'daily',
    label: 'Home & Daily Life',
    categories: [
      { id: 'household', label: 'Household Items', emoji: '🏠', bgColor: 'bg-red-50' },
      { id: 'rooms', label: 'Rooms in a House', emoji: '🛋️', bgColor: 'bg-blue-50' },
      { id: 'routines', label: 'Daily Routines & Chores', emoji: '🧹', bgColor: 'bg-green-50' },
    ]
  },
  {
    id: 'food',
    label: 'Food & Drinks',
    categories: [
      { id: 'foods', label: 'Common Foods', emoji: '🍔', bgColor: 'bg-yellow-50' },
      { id: 'drinks', label: 'Drinks & Beverages', emoji: '🥤', bgColor: 'bg-purple-50' },
      { id: 'fruitsveg', label: 'Fruits & Vegetables', emoji: '🍎', bgColor: 'bg-indigo-50' },
      { id: 'restaurant', label: 'Restaurant & Ordering Food', emoji: '🍽️', bgColor: 'bg-pink-50' },
    ]
  },
  {
    id: 'travel',
    label: 'Travel & Transportation',
    categories: [
      { id: 'countries', label: 'Countries & Nationalities', emoji: '🌎', bgColor: 'bg-amber-50' },
      { id: 'directions', label: 'Directions & Places', emoji: '🧭', bgColor: 'bg-teal-50' },
      { id: 'transport', label: 'Methods of Transport', emoji: '🚆', bgColor: 'bg-emerald-50' },
    ]
  },
  {
    id: 'places',
    label: 'Places & Locations',
    categories: [
      { id: 'town', label: 'In the Town', emoji: '🏙️', bgColor: 'bg-red-50' },
      { id: 'shops', label: 'Shops', emoji: '🛒', bgColor: 'bg-blue-50' },
    ]
  },
  {
    id: 'education',
    label: 'School & Education',
    categories: [
      { id: 'classitems', label: 'Classroom Objects', emoji: '📝', bgColor: 'bg-green-50' },
      { id: 'subjects', label: 'School Subjects', emoji: '📚', bgColor: 'bg-yellow-50' },
      { id: 'studyverbs', label: 'Studying Verbs', emoji: '📖', bgColor: 'bg-purple-50' },
    ]
  },
  {
    id: 'shopping',
    label: 'Shopping & Money',
    categories: [
      { id: 'clothes', label: 'Clothes & Accessories', emoji: '👕', bgColor: 'bg-indigo-50' },
      { id: 'shoppingphrases', label: 'Shopping Phrases', emoji: '🛍️', bgColor: 'bg-pink-50' },
      { id: 'money', label: 'Money & Prices', emoji: '💰', bgColor: 'bg-amber-50' },
    ]
  },
  {
    id: 'health',
    label: 'Health & Body',
    categories: [
      { id: 'bodyparts', label: 'Parts of the Body', emoji: '🦵', bgColor: 'bg-teal-50' },
      { id: 'illnesses', label: 'Illnesses & Symptoms', emoji: '🤒', bgColor: 'bg-emerald-50' },
      { id: 'doctor', label: 'At the Doctor\'s', emoji: '👨‍⚕️', bgColor: 'bg-red-50' },
    ]
  },
  {
    id: 'nature',
    label: 'Nature & Environment',
    categories: [
      { id: 'weather', label: 'Weather', emoji: '☀️', bgColor: 'bg-blue-50' },
      { id: 'animals', label: 'Animals', emoji: '🐾', bgColor: 'bg-green-50' },
      { id: 'plants', label: 'Plants & Trees', emoji: '🌳', bgColor: 'bg-yellow-50' },
    ]
  },
  {
    id: 'entertainment',
    label: 'Entertainment & Free Time',
    categories: [
      { id: 'hobbies', label: 'Hobbies & Interests', emoji: '🎨', bgColor: 'bg-purple-50' },
      { id: 'sports', label: 'Sports', emoji: '⚽', bgColor: 'bg-indigo-50' },
      { id: 'music', label: 'Music & Instruments', emoji: '🎵', bgColor: 'bg-pink-50' },
      { id: 'movies', label: 'Films & TV', emoji: '🎬', bgColor: 'bg-amber-50' },
    ]
  },
  {
    id: 'technology',
    label: 'Technology & Communication',
    categories: [
      { id: 'devices', label: 'Devices & Gadgets', emoji: '📱', bgColor: 'bg-teal-50' },
      { id: 'internet', label: 'Internet & Social Media', emoji: '💻', bgColor: 'bg-emerald-50' },
      { id: 'techverbs', label: 'Technology Verbs', emoji: '⌨️', bgColor: 'bg-red-50' },
    ]
  },
  {
    id: 'grammar',
    label: 'Grammar-Based',
    categories: [
      { id: 'verbs', label: 'Common Verbs', emoji: '🏃', bgColor: 'bg-blue-50' },
      { id: 'adjectives', label: 'Common Adjectives', emoji: '✨', bgColor: 'bg-green-50' },
      { id: 'adverbs', label: 'Adverbs & Connectors', emoji: '🔄', bgColor: 'bg-yellow-50' },
    ]
  },
];

// Original categories for backwards compatibility
const categories = [
  { id: 'animals', label: 'Animals', emoji: '🐾', bgColor: 'bg-blue-50' },
  { id: 'food', label: 'Food', emoji: '🍔', bgColor: 'bg-green-50' },
  { id: 'countries', label: 'Countries', emoji: '🌎', bgColor: 'bg-yellow-50' },
  { id: 'sports', label: 'Sports', emoji: '⚽', bgColor: 'bg-red-50' },
  { id: 'professions', label: 'Professions', emoji: '👨‍⚕️', bgColor: 'bg-purple-50' },
  { id: 'technology', label: 'Technology', emoji: '💻', bgColor: 'bg-indigo-50' },
  { id: 'music', label: 'Music', emoji: '🎵', bgColor: 'bg-pink-50' },
  { id: 'movies', label: 'Movies', emoji: '🎬', bgColor: 'bg-amber-50' },
  { id: 'clothing', label: 'Clothing', emoji: '👕', bgColor: 'bg-teal-50' },
  { id: 'nature', label: 'Nature', emoji: '🏞️', bgColor: 'bg-emerald-50' },
];

export default function GameSettings({ 
  onStartGame, 
  setupStage = 'language', 
  onLanguageSelect, 
  onCategorySelect, 
  onDifficultySelect 
}: GameSettingsProps) {
  
  const [settings, setSettings] = useState({
    difficulty: 'beginner',
    category: 'animals',
    language: 'spanish',
    theme: 'default',
    customWords: [] as string[]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customWordsInput, setCustomWordsInput] = useState('');
  const [customWordsError, setCustomWordsError] = useState('');
  const [selectedCategoryGroup, setSelectedCategoryGroup] = useState<string | null>(null);
  const [tempCategory, setTempCategory] = useState('');
  const [tempCategoryWords, setTempCategoryWords] = useState('');
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleThemeChange = (themeId: string) => {
    setSettings((prev) => ({
      ...prev,
      theme: themeId,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // If we're using the legacy flow
    if (onStartGame) {
      onStartGame(settings);
    }
    
    setIsSubmitting(false);
  };
  
  const handleLanguageClick = (languageId: string) => {
    setSettings(prev => ({...prev, language: languageId}));
    if (onLanguageSelect) {
      onLanguageSelect(languageId);
    }
  };
  
  const handleCategoryClick = (categoryId: string) => {
    if (categoryId === 'custom') {
      // Show custom words input field, handled in the UI
      setSettings(prev => ({...prev, category: categoryId}));
    } else {
      setSettings(prev => ({...prev, category: categoryId}));
      if (onCategorySelect) {
        onCategorySelect(categoryId);
      }
    }
  };
  
  const handleCustomWordsSubmit = () => {
    // Parse and validate custom words
    const words = customWordsInput
      .split(',')
      .map(word => word.trim())
      .filter(word => word.length > 0);
    
    if (words.length < 3) {
      setCustomWordsError('Please enter at least 3 words separated by commas');
      return;
    }
    
    setSettings(prev => ({...prev, customWords: words}));
    if (onCategorySelect) {
      onCategorySelect('custom', words);
    }
  };
  
  const handleDifficultyClick = (difficultyId: string) => {
    setSettings(prev => ({...prev, difficulty: difficultyId}));
    if (onDifficultySelect) {
      onDifficultySelect(difficultyId, settings.theme);
    }
  };

  // Render language selection screen
  if (setupStage === 'language') {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Language</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {languages.map((language) => (
            <button
              key={language.id}
              onClick={() => handleLanguageClick(language.id)}
              className={`p-4 rounded-lg flex flex-col items-center justify-center ${language.color} border-2 hover:opacity-90 transition-all`}
            >
              <span className="font-medium text-lg">{language.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  
  // Render category selection screen with hierarchical structure
  if (setupStage === 'category') {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Category</h2>
        
        {/* If no category group is selected, show category groups */}
        {!selectedCategoryGroup && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {categoryGroups.map((group) => (
                <button
                  key={group.id}
                  onClick={() => setSelectedCategoryGroup(group.id)}
                  className="p-4 rounded-lg border-2 border-gray-200 hover:border-purple-400 bg-gray-50 hover:bg-purple-50 transition-all text-gray-800 flex justify-between items-center"
                >
                  <span className="font-medium">{group.label}</span>
                  <span className="text-purple-600">→</span>
                </button>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
              <button
                onClick={() => handleCategoryClick('custom')}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-purple-300 bg-purple-50 hover:bg-purple-100 transition-all text-purple-800 font-medium"
              >
                Add Custom Words
              </button>
              
              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="w-full sm:w-auto px-6 py-3 rounded-lg border-2 border-green-300 bg-green-50 hover:bg-green-100 transition-all text-green-800 font-medium"
              >
                Add Temporary Category
              </button>
            </div>
            
            {/* Add Category Modal */}
            {showAddCategoryModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg p-6 max-w-md w-full">
                  <h3 className="text-xl font-semibold mb-4">Add Temporary Category</h3>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Category Name
                    </label>
                    <input
                      type="text"
                      value={tempCategory}
                      onChange={(e) => setTempCategory(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      placeholder="e.g., Medical Terms"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Words (comma separated)
                    </label>
                    <textarea
                      value={tempCategoryWords}
                      onChange={(e) => setTempCategoryWords(e.target.value)}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      rows={4}
                      placeholder="doctor, nurse, hospital, medicine..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setShowAddCategoryModal(false)}
                      className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        if (tempCategory && tempCategoryWords) {
                          const words = tempCategoryWords
                            .split(',')
                            .map(word => word.trim())
                            .filter(word => word.length > 0);
                            
                          if (words.length >= 3) {
                            if (onCategorySelect) {
                              onCategorySelect('custom', words);
                            }
                            setShowAddCategoryModal(false);
                          }
                        }
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    >
                      Add Category
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* If a category group is selected, show categories in that group */}
        {selectedCategoryGroup && (
          <>
            <div className="mb-4">
              <button
                onClick={() => setSelectedCategoryGroup(null)}
                className="text-purple-600 hover:text-purple-800 flex items-center gap-1"
              >
                <span>← Back to groups</span>
              </button>
            </div>
            
            <h3 className="text-lg font-semibold mb-4 text-gray-700">
              {categoryGroups.find(g => g.id === selectedCategoryGroup)?.label}
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {categoryGroups
                .find(g => g.id === selectedCategoryGroup)
                ?.categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`p-5 rounded-lg flex flex-col items-center justify-center ${category.bgColor} hover:bg-opacity-80 transition-all ${settings.category === category.id ? 'ring-2 ring-purple-500' : ''} text-gray-800`}
                  >
                    <span className="text-4xl mb-2">{category.emoji}</span>
                    <span className="font-medium text-sm text-center">{category.label}</span>
                  </button>
                ))}
            </div>
          </>
        )}
        
        {settings.category === 'custom' && (
          <div className="mt-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Enter your custom words (comma separated)
            </label>
            <textarea
              value={customWordsInput}
              onChange={(e) => setCustomWordsInput(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={4}
              placeholder="apple, banana, orange, book, computer..."
            />
            {customWordsError && (
              <p className="text-red-500 text-xs italic mt-1">{customWordsError}</p>
            )}
            <button 
              onClick={handleCustomWordsSubmit}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    );
  }
  
  // Render difficulty selection screen
  if (setupStage === 'difficulty') {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Choose Difficulty</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {difficulties.map((difficulty) => (
            <button
              key={difficulty.id}
              onClick={() => handleDifficultyClick(difficulty.id)}
              className={`p-5 rounded-lg border-2 ${
                settings.difficulty === difficulty.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{difficulty.icon}</span>
                <div>
                  <div className="font-medium text-left text-gray-800">{difficulty.label}</div>
                  <div className="text-sm text-gray-600 text-left">{difficulty.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-gray-700">Choose Theme</h3>
          <ThemeSelector selectedTheme={settings.theme} onThemeChange={handleThemeChange} />
        </div>
      </div>
    );
  }
  
  // Legacy full settings form (if setupStage is not provided)
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Game Settings</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Language</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {languages.map((language) => (
              <div className="inline-flex space-x-1 items-center px-2 py-1 rounded-lg">
                <label
                  key={language.id}
                  className={`group cursor-pointer ${language.color} p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                    settings.language === language.id
                      ? 'ring-2 ring-purple-500'
                      : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="language"
                    value={language.id}
                    checked={settings.language === language.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-medium">{language.label}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Category</h3>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <label
                key={category.id}
                className={`group cursor-pointer ${category.bgColor} p-4 rounded-lg flex flex-col items-center justify-center transition-all ${
                  settings.category === category.id
                    ? 'ring-2 ring-purple-500'
                    : 'hover:ring-2 hover:ring-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="category"
                  value={category.id}
                  checked={settings.category === category.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <span className="text-4xl mb-2">{category.emoji}</span>
                <span className="font-medium text-gray-800">{category.label}</span>
              </label>
            ))}
          </div>
          
          {settings.category === 'custom' && (
            <div className="mt-4">
              <textarea
                value={customWordsInput}
                onChange={(e) => setCustomWordsInput(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                placeholder="Enter your custom words, separated by commas (e.g., apple, banana, orange)"
              />
              {customWordsError && (
                <p className="text-red-500 text-xs italic mt-1">{customWordsError}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Difficulty</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {difficulties.map((difficulty) => (
              <label
                key={difficulty.id}
                className={`group cursor-pointer border-2 p-4 rounded-lg transition-all ${
                  settings.difficulty === difficulty.id
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <input
                  type="radio"
                  name="difficulty"
                  value={difficulty.id}
                  checked={settings.difficulty === difficulty.id}
                  onChange={handleChange}
                  className="sr-only"
                />
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{difficulty.icon}</span>
                  <div>
                    <div className="font-medium text-left text-gray-800">{difficulty.label}</div>
                    <div className="text-sm text-gray-600 text-left">{difficulty.description}</div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-8">
          <h3 className="text-lg font-medium mb-4 text-gray-700">Theme</h3>
          <ThemeSelector selectedTheme={settings.theme} onThemeChange={handleThemeChange} />
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-colors ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Starting Game...' : 'Start Game'}
        </button>
      </form>
    </div>
  );
} 