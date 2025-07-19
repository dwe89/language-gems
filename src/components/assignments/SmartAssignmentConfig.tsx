'use client';

import React, { useMemo } from 'react';
import { BookOpen, FileText, Lightbulb, Upload, Plus, Eye } from 'lucide-react';

// Game type definitions
interface Game {
  id: string;
  name: string;
  type: 'vocabulary' | 'sentence' | 'mixed';
}

const GAME_TYPES: Record<string, Game> = {
  'word-match': { id: 'word-match', name: 'Word Match', type: 'vocabulary' },
  'memory-game': { id: 'memory-game', name: 'Memory Match', type: 'vocabulary' },
  'gem-collector': { id: 'gem-collector', name: 'Gem Collector', type: 'vocabulary' },
  'translation-tycoon': { id: 'translation-tycoon', name: 'Translation Tycoon', type: 'vocabulary' },
  'word-blast': { id: 'word-blast', name: 'Word Blast', type: 'vocabulary' },
  'hangman': { id: 'hangman', name: 'Hangman', type: 'vocabulary' },
  'word-guesser': { id: 'word-guesser', name: 'Word Guesser', type: 'vocabulary' },
  'word-association': { id: 'word-association', name: 'Word Association', type: 'vocabulary' },
  'word-scramble': { id: 'word-scramble', name: 'Word Scramble', type: 'vocabulary' },
  'speed-builder': { id: 'speed-builder', name: 'Speed Builder', type: 'sentence' },
  'sentence-towers': { id: 'sentence-towers', name: 'Sentence Towers', type: 'sentence' },
  'sentence-builder': { id: 'sentence-builder', name: 'Sentence Builder', type: 'sentence' },
  'conjugation-duel': { id: 'conjugation-duel', name: 'Conjugation Duel', type: 'sentence' },
};

interface VocabularyConfig {
  source: 'theme' | 'topic' | 'custom' | 'create' | '';
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

interface SmartAssignmentConfigProps {
  selectedGames: string[];
  vocabularyConfig: VocabularyConfig;
  sentenceConfig: SentenceConfig;
  onVocabularyChange: (config: VocabularyConfig) => void;
  onSentenceChange: (config: SentenceConfig) => void;
}

export default function SmartAssignmentConfig({
  selectedGames,
  vocabularyConfig,
  sentenceConfig,
  onVocabularyChange,
  onSentenceChange
}: SmartAssignmentConfigProps) {
  
  const configSections = useMemo(() => {
    const games = selectedGames.map(id => GAME_TYPES[id]).filter(Boolean);
    
    const needsVocabulary = games.some(game => game.type === 'vocabulary' || game.type === 'mixed');
    const needsSentences = games.some(game => game.type === 'sentence' || game.type === 'mixed');
    
    const vocabularyGames = games.filter(g => g.type === 'vocabulary' || g.type === 'mixed');
    const sentenceGames = games.filter(g => g.type === 'sentence' || g.type === 'mixed');
    
    return {
      needsVocabulary,
      needsSentences,
      vocabularyGames,
      sentenceGames
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
        <label className="block text-sm font-medium text-gray-700 mb-3">Content Source</label>
        <select 
          value={config.source} 
          onChange={(e) => onChange({...config, source: e.target.value as any})}
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose source...</option>
          <option value="theme">📚 Theme-based vocabulary</option>
          <option value="topic">🎯 Topic-based vocabulary</option>
          <option value="custom">📝 Custom vocabulary list</option>
          <option value="create">➕ Create new list</option>
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