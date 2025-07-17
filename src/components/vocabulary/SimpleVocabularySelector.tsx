'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Filter, ChevronDown, Play, BookOpen, Target, Globe
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

interface VocabularyItem {
  id: number;
  theme: string;
  topic: string;
  part_of_speech: string;
  spanish: string;
  english: string;
}

interface VocabularyTheme {
  name: string;
  topics: string[];
  wordCount: number;
  icon: string;
  description: string;
}

interface SimpleVocabularySelectorProps {
  onSelectionChange: (selectedItems: VocabularyItem[]) => void;
  maxItems?: number;
  onStartGame?: () => void;
}

// =====================================================
// THEME CONFIGURATION
// =====================================================

const THEME_CONFIG: Record<string, { icon: string; description: string }> = {
  'Daily Life': { icon: '🏠', description: 'Essential daily vocabulary' },
  'Travel': { icon: '✈️', description: 'Travel and transportation' },
  'Food': { icon: '🍎', description: 'Food and dining vocabulary' },
  'Business': { icon: '💼', description: 'Professional vocabulary' },
  'Education': { icon: '📚', description: 'Academic vocabulary' },
  'Entertainment': { icon: '🎭', description: 'Entertainment vocabulary' },
  'Health': { icon: '⚕️', description: 'Health and medical terms' },
  'Technology': { icon: '💻', description: 'Technology vocabulary' },
  'Nature': { icon: '🌳', description: 'Nature vocabulary' }
};

// =====================================================
// MAIN COMPONENT
// =====================================================

export default function SimpleVocabularySelector({
  onSelectionChange,
  maxItems = 50,
  onStartGame
}: SimpleVocabularySelectorProps) {
  // State
  const [selectionType, setSelectionType] = useState<'theme' | 'topic'>('theme');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<VocabularyItem[]>([]);
  const [themes, setThemes] = useState<VocabularyTheme[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [itemCount, setItemCount] = useState(20);

  // Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  // =====================================================
  // DATA LOADING
  // =====================================================

  useEffect(() => {
    loadThemesAndTopics();
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      loadVocabularyByTheme(selectedTheme);
    } else if (selectedTopic) {
      loadVocabularyByTopic(selectedTopic);
    }
  }, [selectedTheme, selectedTopic, itemCount]);

  useEffect(() => {
    onSelectionChange(selectedItems);
  }, [selectedItems]);

  const loadThemesAndTopics = async () => {
    try {
      const { data, error } = await supabase
        .from('vocabulary')
        .select('theme, topic')
        .order('theme', { ascending: true });

      if (data) {
        const themeMap = new Map<string, Set<string>>();
        const topicSet = new Set<string>();

        data.forEach(item => {
          if (!themeMap.has(item.theme)) {
            themeMap.set(item.theme, new Set());
          }
          themeMap.get(item.theme)?.add(item.topic);
          topicSet.add(item.topic);
        });

        const themeList: VocabularyTheme[] = Array.from(themeMap.entries()).map(([theme, topicSet]) => ({
          name: theme,
          topics: Array.from(topicSet),
          wordCount: data.filter(item => item.theme === theme).length,
          icon: THEME_CONFIG[theme]?.icon || '📚',
          description: THEME_CONFIG[theme]?.description || 'Vocabulary collection'
        }));

        setThemes(themeList);
        setTopics(Array.from(topicSet));
      }
    } catch (error) {
      console.error('Error loading themes and topics:', error);
    }
  };

  const loadVocabularyByTheme = async (theme: string) => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('theme', theme)
        .order('frequency_score', { ascending: false })
        .limit(itemCount);

      if (data) {
        setSelectedItems(data);
      }
    } catch (error) {
      console.error('Error loading vocabulary by theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVocabularyByTopic = async (topic: string) => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('vocabulary')
        .select('*')
        .eq('topic', topic)
        .order('frequency_score', { ascending: false })
        .limit(itemCount);

      if (data) {
        setSelectedItems(data);
      }
    } catch (error) {
      console.error('Error loading vocabulary by topic:', error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EVENT HANDLERS
  // =====================================================

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setSelectedTopic('');
    setSelectionType('theme');
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setSelectedTheme('');
    setSelectionType('topic');
  };

  // Filter themes/topics by search term
  const filteredThemes = themes.filter(theme => 
    theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theme.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTopics = topics.filter(topic => 
    topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Vocabulary Selector</h3>
            <p className="text-sm text-gray-600">Choose your vocabulary for practice</p>
          </div>
        </div>
        
        {selectedItems.length > 0 && (
          <button
            onClick={onStartGame}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Start Game</span>
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search themes or topics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Selection Type Toggle */}
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectionType('theme')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectionType === 'theme'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Target className="h-4 w-4 inline mr-2" />
            By Theme
          </button>
          <button
            onClick={() => setSelectionType('topic')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectionType === 'topic'
                ? 'bg-blue-100 text-blue-700 border border-blue-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            By Topic
          </button>
        </div>

        {/* Word Count Slider */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of words: {itemCount}
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={itemCount}
            onChange={(e) => setItemCount(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>

      {/* Theme Selection */}
      {selectionType === 'theme' && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Choose a Theme</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredThemes.map((theme) => (
              <motion.button
                key={theme.name}
                onClick={() => handleThemeSelect(theme.name)}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedTheme === theme.name
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">{theme.icon}</span>
                  <div className="flex-1">
                    <h5 className="font-medium text-gray-800">{theme.name}</h5>
                    <p className="text-sm text-gray-600">{theme.wordCount} words</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{theme.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Topic Selection */}
      {selectionType === 'topic' && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4">Choose a Topic</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredTopics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                className={`p-3 rounded-lg border-2 transition-all text-sm ${
                  selectedTopic === topic
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Vocabulary Preview */}
      {selectedItems.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-800">
              Selected: {selectedItems.length} words
            </h4>
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            )}
          </div>
          
          <div className="text-sm text-gray-600 mb-3">
            {selectedTheme && `Theme: ${selectedTheme}`}
            {selectedTopic && `Topic: ${selectedTopic}`}
          </div>

          <div className="max-h-32 overflow-y-auto">
            <div className="grid grid-cols-2 gap-2 text-sm">
              {selectedItems.slice(0, 10).map((item) => (
                <div key={item.id} className="bg-white rounded p-2 border">
                  <span className="font-medium">{item.spanish}</span>
                  <span className="text-gray-600 ml-2">→ {item.english.split(',')[0]}</span>
                </div>
              ))}
            </div>
            {selectedItems.length > 10 && (
              <div className="text-center text-gray-500 text-sm mt-2">
                +{selectedItems.length - 10} more words...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Start Button */}
      {selectedItems.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={onStartGame}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2 mx-auto"
          >
            <Play className="h-5 w-5" />
            <span>Start Learning ({selectedItems.length} words)</span>
          </button>
        </div>
      )}
    </div>
  );
}
