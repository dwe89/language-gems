'use client';

import React, { useMemo } from 'react';
import { BookOpen, FileText, Lightbulb, Upload, Plus, Eye } from 'lucide-react';
import ModernCategorySelector from '../games/ModernCategorySelector';

// Game type definitions
interface Game {
  id: string;
  name: string;
  type: 'vocabulary' | 'sentence' | 'grammar' | 'mixed';
}

const GAME_TYPES: Record<string, Game> = {
  // Vocabulary Games
  'vocabulary-mining': { id: 'vocabulary-mining', name: 'Vocabulary Mining', type: 'vocabulary' },
  'memory-game': { id: 'memory-game', name: 'Memory Match', type: 'vocabulary' },
  'hangman': { id: 'hangman', name: 'Hangman', type: 'vocabulary' },
  'word-guesser': { id: 'word-guesser', name: 'Word Guesser', type: 'vocabulary' },
  'word-blast': { id: 'word-blast', name: 'Word Blast', type: 'vocabulary' },
  'noughts-and-crosses': { id: 'noughts-and-crosses', name: 'Tic-Tac-Toe Vocabulary', type: 'vocabulary' },

  'word-scramble': { id: 'word-scramble', name: 'Word Scramble', type: 'vocabulary' },
  'vocab-blast': { id: 'vocab-blast', name: 'Vocab Blast', type: 'vocabulary' },
  'detective-listening': { id: 'detective-listening', name: 'Detective Listening', type: 'vocabulary' },

  // Sentence Games
  'speed-builder': { id: 'speed-builder', name: 'Speed Builder', type: 'sentence' },
  'sentence-towers': { id: 'sentence-towers', name: 'Word Towers', type: 'sentence' },
  'sentence-builder': { id: 'sentence-builder', name: 'Sentence Builder', type: 'sentence' },

  // Grammar Games
  'conjugation-duel': { id: 'conjugation-duel', name: 'Conjugation Duel', type: 'grammar' },
  'verb-quest': { id: 'verb-quest', name: 'Verb Quest', type: 'grammar' },
};

interface VocabularyConfig {
  source: 'category' | 'theme' | 'topic' | 'custom' | 'create' | '';
  language?: string;
  categories?: string[]; // Changed to support multiple categories
  subcategories?: string[]; // Changed to support multiple subcategories
  category?: string; // Keep for backward compatibility
  subcategory?: string; // Keep for backward compatibility
  theme?: string;
  topic?: string;
  customListId?: string;
  customList?: any;
  wordCount?: number;
  difficulty?: string;
}

interface SentenceConfig {
  source: 'theme' | 'topic' | 'custom' | 'create' | '';
  theme?: string;
  topic?: string;
  customSetId?: string;
  customSet?: any;
  sentenceCount?: number;
  difficulty?: string;
  grammarFocus?: string;
}

interface GrammarConfig {
  language: 'spanish' | 'french' | 'german';
  verbTypes: ('regular' | 'irregular' | 'stem-changing')[];
  tenses: ('present' | 'preterite' | 'imperfect' | 'future' | 'conditional' | 'subjunctive')[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  verbCount?: number;
  focusAreas?: ('conjugation' | 'recognition' | 'translation')[];
}

interface SmartAssignmentConfigProps {
  selectedGames: string[];
  vocabularyConfig: VocabularyConfig;
  sentenceConfig: SentenceConfig;
  grammarConfig: GrammarConfig;
  onVocabularyChange: (config: VocabularyConfig) => void;
  onSentenceChange: (config: SentenceConfig) => void;
  onGrammarChange: (config: GrammarConfig) => void;
}

export default function SmartAssignmentConfig({
  selectedGames,
  vocabularyConfig,
  sentenceConfig,
  grammarConfig,
  onVocabularyChange,
  onSentenceChange,
  onGrammarChange
}: SmartAssignmentConfigProps) {
  
  const configSections = useMemo(() => {
    const games = selectedGames.map(id => GAME_TYPES[id]).filter(Boolean);

    const needsVocabulary = games.some(game => game.type === 'vocabulary' || game.type === 'mixed');
    const needsSentences = games.some(game => game.type === 'sentence' || game.type === 'mixed');
    const needsGrammar = games.some(game => game.type === 'grammar' || game.type === 'mixed');

    const vocabularyGames = games.filter(g => g.type === 'vocabulary' || g.type === 'mixed');
    const sentenceGames = games.filter(g => g.type === 'sentence' || g.type === 'mixed');
    const grammarGames = games.filter(g => g.type === 'grammar' || g.type === 'mixed');

    return {
      needsVocabulary,
      needsSentences,
      needsGrammar,
      vocabularyGames,
      sentenceGames,
      grammarGames
    };
  }, [selectedGames]);

  if (selectedGames.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium mb-2">Select games to configure content</p>
        <p className="text-sm">Choose games above to see smart configuration options</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Vocabulary Section */}
      {configSections.needsVocabulary && (
        <div className="border rounded-xl p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Vocabulary Configuration
              </h3>
              <p className="text-sm text-gray-600">
                Used by: {configSections.vocabularyGames.map(g => g.name).join(', ')}
              </p>
            </div>
          </div>

          <VocabularyConfigSection 
            config={vocabularyConfig}
            onChange={onVocabularyChange}
          />
        </div>
      )}

      {/* Sentence Section */}
      {configSections.needsSentences && (
        <div className="border rounded-xl p-6 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sentence Configuration
              </h3>
              <p className="text-sm text-gray-600">
                Used by: {configSections.sentenceGames.map(g => g.name).join(', ')}
              </p>
            </div>
          </div>

          <SentenceConfigSection 
            config={sentenceConfig}
            onChange={onSentenceChange}
          />
        </div>
      )}

      {/* Grammar Section */}
      {configSections.needsGrammar && (
        <div className="border rounded-xl p-6 bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Grammar Configuration
              </h3>
              <p className="text-sm text-gray-600">
                Used by: {configSections.grammarGames.map(g => g.name).join(', ')}
              </p>
            </div>
          </div>

          <GrammarConfigSection
            config={grammarConfig}
            onChange={onGrammarChange}
          />
        </div>
      )}

      {/* Unified Section for Mixed Games */}
      {configSections.needsVocabulary && configSections.needsSentences && (
        <div className="border rounded-xl p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Lightbulb className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">
                Smart Configuration Active
              </p>
              <p className="text-xs text-gray-600">
                Both vocabulary and sentence content will be sourced from the same theme/topic for consistency
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Vocabulary Configuration Component
function VocabularyConfigSection({ config, onChange }: { 
  config: VocabularyConfig; 
  onChange: (config: VocabularyConfig) => void; 
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Language</label>
        <select
          value={config.language || 'es'}
          onChange={(e) => onChange({...config, language: e.target.value})}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Content Source</label>
        <select
          value={config.source}
          onChange={(e) => onChange({...config, source: e.target.value as any})}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose source...</option>
          <option value="category">🗂️ Category-based vocabulary</option>
          <option value="theme">📚 Theme-based vocabulary</option>
          <option value="topic">🎯 Topic-based vocabulary</option>
          <option value="custom">📝 Custom vocabulary list</option>
          <option value="create">➕ Create new list</option>
        </select>
      </div>

      {config.source === 'category' && (
        <MultiCategorySelector
          language={config.language || 'es'}
          selectedCategories={config.categories || []}
          selectedSubcategories={config.subcategories || []}
          onChange={(categories, subcategories) => {
            onChange({
              ...config,
              categories,
              subcategories,
              // Keep single values for backward compatibility
              category: categories[0] || '',
              subcategory: subcategories[0] || ''
            });
          }}
        />
      )}

      {config.source === 'theme' && (
        <ThemeSelector
          value={config.theme || ''}
          onChange={(theme) => onChange({...config, theme})}
        />
      )}

      {config.source === 'topic' && (
        <TopicSelector
          value={config.topic || ''}
          onChange={(topic) => onChange({...config, topic})}
        />
      )}

      {config.source === 'custom' && (
        <CustomVocabularySelector 
          value={config.customListId || ''} 
          onChange={(customListId) => onChange({...config, customListId})}
        />
      )}

      {config.source === 'create' && (
        <InlineVocabularyCreator 
          onSave={(newList) => onChange({...config, source: 'custom', customList: newList})}
        />
      )}

      {/* Word Count and Difficulty */}
      {config.source && config.source !== 'create' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Words</label>
            <input
              type="number"
              min="5"
              max="50"
              value={config.wordCount || 10}
              onChange={(e) => onChange({...config, wordCount: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <select
              value={config.difficulty || 'intermediate'}
              onChange={(e) => onChange({...config, difficulty: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Sentence Configuration Component  
function SentenceConfigSection({ config, onChange }: { 
  config: SentenceConfig; 
  onChange: (config: SentenceConfig) => void; 
}) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">Content Source</label>
        <select 
          value={config.source} 
          onChange={(e) => onChange({...config, source: e.target.value as any})}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="">Choose source...</option>
          <option value="theme">📚 Theme-based sentences</option>
          <option value="topic">🎯 Topic-based sentences</option>
          <option value="custom">📝 Custom sentence set</option>
          <option value="create">➕ Create new sentence set</option>
        </select>
      </div>

      {config.source === 'theme' && (
        <ThemeSelector 
          value={config.theme || ''} 
          onChange={(theme) => onChange({...config, theme})}
        />
      )}

      {config.source === 'topic' && (
        <TopicSelector 
          value={config.topic || ''} 
          onChange={(topic) => onChange({...config, topic})}
        />
      )}

      {config.source === 'custom' && (
        <CustomSentenceSelector 
          value={config.customSetId || ''} 
          onChange={(customSetId) => onChange({...config, customSetId})}
        />
      )}

      {config.source === 'create' && (
        <InlineSentenceCreator 
          onSave={(newSet) => onChange({...config, source: 'custom', customSet: newSet})}
        />
      )}

      {/* Sentence Count, Difficulty, and Grammar Focus */}
      {config.source && config.source !== 'create' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Number of Sentences</label>
            <input
              type="number"
              min="5"
              max="30"
              value={config.sentenceCount || 10}
              onChange={(e) => onChange({...config, sentenceCount: parseInt(e.target.value)})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
            <select
              value={config.difficulty || 'intermediate'}
              onChange={(e) => onChange({...config, difficulty: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Grammar Focus</label>
            <select
              value={config.grammarFocus || ''}
              onChange={(e) => onChange({...config, grammarFocus: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">All Grammar</option>
              <option value="present-tense">Present Tense</option>
              <option value="ser-estar">Ser vs Estar</option>
              <option value="adjective-agreement">Adjective Agreement</option>
              <option value="gustar-verb">Gustar Verb</option>
              <option value="reflexive-verbs">Reflexive Verbs</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}

// Supporting Components
function ThemeSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const themes = [
    'Communication and the world around us',
    'People and lifestyle', 
    'Popular culture',
    'Business and work',
    'Education and learning'
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Theme</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Choose theme...</option>
        {themes.map(theme => (
          <option key={theme} value={theme}>{theme}</option>
        ))}
      </select>
    </div>
  );
}

function TopicSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const topics = [
    'Identity and relationships',
    'Education and work',
    'Free time activities',
    'Healthy living and lifestyle',
    'Environment and where people live',
    'Customs, festivals and celebrations',
    'Weather and seasons',
    'Family and friends',
    'Food and drink',
    'Travel and transport'
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Select Topic</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
      >
        <option value="">Choose topic...</option>
        {topics.map(topic => (
          <option key={topic} value={topic}>{topic}</option>
        ))}
      </select>
    </div>
  );
}

function CustomVocabularySelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Vocabulary List</label>
      <div className="space-y-3">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select custom list...</option>
          <option value="sample-1">Sample Vocabulary List 1</option>
          <option value="sample-2">Sample Vocabulary List 2</option>
        </select>
        <button
          type="button"
          className="flex items-center text-sm text-indigo-600 hover:text-indigo-700"
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload new vocabulary list
        </button>
      </div>
    </div>
  );
}

function CustomSentenceSelector({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Custom Sentence Set</label>
      <div className="space-y-3">
        <select 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          <option value="">Select custom sentence set...</option>
          <option value="sample-1">Sample Sentence Set 1</option>
          <option value="sample-2">Sample Sentence Set 2</option>
        </select>
        <button
          type="button"
          className="flex items-center text-sm text-green-600 hover:text-green-700"
        >
          <Upload className="h-4 w-4 mr-1" />
          Upload new sentence set
        </button>
      </div>
    </div>
  );
}

function InlineVocabularyCreator({ onSave }: { onSave: (list: any) => void }) {
  return (
    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
      <h4 className="font-medium text-gray-900 mb-3">Create Vocabulary List</h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="List name..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Enter vocabulary words (one per line)..."
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSave({})}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
          >
            Save List
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

function InlineSentenceCreator({ onSave }: { onSave: (set: any) => void }) {
  return (
    <div className="border border-green-200 rounded-lg p-4 bg-green-50">
      <h4 className="font-medium text-gray-900 mb-3">Create Sentence Set</h4>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Sentence set name..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <textarea
          placeholder="Enter sentences (one per line)..."
          rows={6}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onSave({})}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700"
          >
            Save Set
          </button>
          <button
            type="button"
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// Multi-Category Selector Component
function MultiCategorySelector({
  language,
  selectedCategories,
  selectedSubcategories,
  onChange
}: {
  language: string;
  selectedCategories: string[];
  selectedSubcategories: string[];
  onChange: (categories: string[], subcategories: string[]) => void;
}) {
  const [availableCategories, setAvailableCategories] = React.useState<{[key: string]: string[]}>({});
  const [loading, setLoading] = React.useState(true);

  // Load categories and subcategories from database
  React.useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        // This would need to be implemented to fetch from the database
        // For now, using static data
        const mockCategories = {
          'basics_core_language': ['greetings_introductions', 'numbers_1_30', 'colours', 'days', 'months'],
          'family_relationships': ['family_members', 'relationships', 'descriptions'],
          'school_education': ['subjects', 'classroom', 'school_life', 'stationery'],
          'food_drink': ['meals', 'fruits', 'vegetables', 'drinks'],
          'home_daily_life': ['house', 'furniture', 'daily_routines', 'chores']
        };
        setAvailableCategories(mockCategories);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, [language]);

  const toggleCategory = (categoryId: string) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];

    // Remove subcategories that belong to deselected categories
    const newSubcategories = selectedSubcategories.filter(subId => {
      return newCategories.some(catId => availableCategories[catId]?.includes(subId));
    });

    onChange(newCategories, newSubcategories);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    const newSubcategories = selectedSubcategories.includes(subcategoryId)
      ? selectedSubcategories.filter(id => id !== subcategoryId)
      : [...selectedSubcategories, subcategoryId];

    onChange(selectedCategories, newSubcategories);
  };

  if (loading) {
    return <div className="text-center py-4">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Selected Categories & Subcategories</h4>
        {(selectedCategories.length > 0 || selectedSubcategories.length > 0) ? (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            {selectedCategories.map(categoryId => (
              <span key={categoryId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                📁 {categoryId.replace(/_/g, ' ')}
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
            {selectedSubcategories.map(subcategoryId => (
              <span key={subcategoryId} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                📄 {subcategoryId.replace(/_/g, ' ')}
                <button
                  onClick={() => toggleSubcategory(subcategoryId)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-sm mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            No categories or subcategories selected. Choose from the options below.
          </div>
        )}
      </div>

      <div>
        <h4 className="font-medium text-gray-900 mb-3">Available Categories</h4>
        <div className="space-y-4">
          {Object.entries(availableCategories).map(([categoryId, subcategories]) => (
            <div key={categoryId} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(categoryId)}
                    onChange={() => toggleCategory(categoryId)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 font-medium text-gray-900">
                    📁 {categoryId.replace(/_/g, ' ')}
                  </span>
                </label>
                <span className="text-sm text-gray-500">
                  {subcategories.length} subcategories
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 ml-6">
                {subcategories.map(subcategoryId => (
                  <label key={subcategoryId} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedSubcategories.includes(subcategoryId)}
                      onChange={() => toggleSubcategory(subcategoryId)}
                      className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      📄 {subcategoryId.replace(/_/g, ' ')}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Grammar Configuration Section Component
interface GrammarConfigSectionProps {
  config: GrammarConfig;
  onChange: (config: GrammarConfig) => void;
}

function GrammarConfigSection({ config, onChange }: GrammarConfigSectionProps) {
  const languages = [
    { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
    { id: 'french', name: 'French', flag: '🇫🇷' },
    { id: 'german', name: 'German', flag: '🇩🇪' }
  ];

  const verbTypes = [
    { id: 'regular', name: 'Regular Verbs', description: 'Follow standard conjugation patterns' },
    { id: 'irregular', name: 'Irregular Verbs', description: 'Have unique conjugation patterns' },
    { id: 'stem-changing', name: 'Stem-Changing Verbs', description: 'Change stem vowels in certain forms' }
  ];

  const tenses = [
    { id: 'present', name: 'Present Tense', difficulty: 'beginner' },
    { id: 'preterite', name: 'Preterite (Past)', difficulty: 'intermediate' },
    { id: 'imperfect', name: 'Imperfect (Past)', difficulty: 'intermediate' },
    { id: 'future', name: 'Future Tense', difficulty: 'intermediate' },
    { id: 'conditional', name: 'Conditional', difficulty: 'advanced' },
    { id: 'subjunctive', name: 'Subjunctive', difficulty: 'advanced' }
  ];

  const difficulties = [
    { id: 'beginner', name: 'Beginner', description: 'Basic conjugations, common verbs' },
    { id: 'intermediate', name: 'Intermediate', description: 'Multiple tenses, irregular verbs' },
    { id: 'advanced', name: 'Advanced', description: 'Complex tenses, subjunctive mood' }
  ];

  const focusAreas = [
    { id: 'conjugation', name: 'Conjugation Practice', description: 'Practice conjugating verbs' },
    { id: 'recognition', name: 'Form Recognition', description: 'Identify verb forms and tenses' },
    { id: 'translation', name: 'Translation', description: 'Translate between languages' }
  ];

  const updateConfig = (updates: Partial<GrammarConfig>) => {
    onChange({ ...config, ...updates });
  };

  const toggleArrayItem = <T,>(array: T[], item: T): T[] => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Language
        </label>
        <div className="grid grid-cols-3 gap-3">
          {languages.map(lang => (
            <button
              key={lang.id}
              onClick={() => updateConfig({ language: lang.id as any })}
              className={`p-3 rounded-lg border-2 transition-all ${
                config.language === lang.id
                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-1">{lang.flag}</div>
              <div className="text-sm font-medium">{lang.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Verb Types */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Verb Types
        </label>
        <div className="space-y-2">
          {verbTypes.map(type => (
            <label key={type.id} className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={config.verbTypes.includes(type.id as any)}
                onChange={() => updateConfig({
                  verbTypes: toggleArrayItem(config.verbTypes, type.id as any)
                })}
                className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <div className="font-medium text-gray-900">{type.name}</div>
                <div className="text-sm text-gray-500">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Tenses */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Tenses
        </label>
        <div className="grid grid-cols-2 gap-3">
          {tenses.map(tense => (
            <label key={tense.id} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
              <input
                type="checkbox"
                checked={config.tenses.includes(tense.id as any)}
                onChange={() => updateConfig({
                  tenses: toggleArrayItem(config.tenses, tense.id as any)
                })}
                className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div className="flex-1">
                <div className="font-medium text-gray-900">{tense.name}</div>
                <div className={`text-xs px-2 py-1 rounded-full inline-block mt-1 ${
                  tense.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                  tense.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {tense.difficulty}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Difficulty Level
        </label>
        <div className="space-y-2">
          {difficulties.map(diff => (
            <label key={diff.id} className="flex items-start space-x-3">
              <input
                type="radio"
                name="difficulty"
                value={diff.id}
                checked={config.difficulty === diff.id}
                onChange={() => updateConfig({ difficulty: diff.id as any })}
                className="mt-1 border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <div>
                <div className="font-medium text-gray-900">{diff.name}</div>
                <div className="text-sm text-gray-500">{diff.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Verbs
          </label>
          <input
            type="number"
            min="5"
            max="50"
            value={config.verbCount || 10}
            onChange={(e) => updateConfig({ verbCount: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500"
          />
        </div>
      </div>
    </div>
  );
}

