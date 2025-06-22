'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Gem, Diamond, Sparkles, Crown, Star, Zap,
  Search, Filter, ChevronDown, ChevronRight,
  Target, BookOpen, Users, Clock, Trophy,
  Plus, Minus, Eye, Shuffle, CheckCircle2
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
  gem_type?: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  gem_color?: string;
  frequency_score?: number;
  difficulty_level?: string;
}

interface VocabularyTheme {
  name: string;
  topics: string[];
  wordCount: number;
  gemDistribution: {
    common: number;
    uncommon: number;
    rare: number;
    epic: number;
    legendary: number;
  };
  icon: string;
  color: string;
  description: string;
}

interface EnhancedVocabularySelectorProps {
  onSelectionChange: (selectedItems: VocabularyItem[], listId?: string) => void;
  maxItems?: number;
  defaultSelection?: 'theme' | 'topic' | 'custom' | 'mining';
  showPreview?: boolean;
  gameType?: string;
  assignmentMode?: boolean;
  difficulty?: string;
  onConfigChange?: (config: any) => void;
}

// =====================================================
// GEM THEME CONFIGURATION
// =====================================================

const GEM_TYPES = {
  common: {
    name: 'Common Gems',
    icon: <Gem className="h-5 w-5" />,
    color: 'from-blue-400 to-blue-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    description: 'Everyday vocabulary gems'
  },
  uncommon: {
    name: 'Uncommon Gems',
    icon: <Sparkles className="h-5 w-5" />,
    color: 'from-green-400 to-green-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    description: 'Useful vocabulary gems'
  },
  rare: {
    name: 'Rare Gems',
    icon: <Star className="h-5 w-5" />,
    color: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    description: 'Valuable vocabulary gems'
  },
  epic: {
    name: 'Epic Gems',
    icon: <Diamond className="h-5 w-5" />,
    color: 'from-pink-400 to-pink-600',
    textColor: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    description: 'Powerful vocabulary gems'
  },
  legendary: {
    name: 'Legendary Gems',
    icon: <Crown className="h-5 w-5" />,
    color: 'from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    description: 'Legendary vocabulary gems'
  }
};

const THEME_ICONS = {
  'Daily Life': { icon: '🏠', color: 'from-blue-500 to-blue-700', description: 'Essential everyday gems' },
  'Travel': { icon: '✈️', color: 'from-green-500 to-green-700', description: 'Adventure vocabulary gems' },
  'Food': { icon: '🍽️', color: 'from-yellow-500 to-yellow-700', description: 'Culinary vocabulary gems' },
  'Business': { icon: '💼', color: 'from-red-500 to-red-700', description: 'Professional vocabulary gems' },
  'Culture': { icon: '🎭', color: 'from-purple-500 to-purple-700', description: 'Cultural vocabulary gems' },
  'Education': { icon: '📚', color: 'from-indigo-500 to-indigo-700', description: 'Academic vocabulary gems' },
  'Technology': { icon: '💻', color: 'from-cyan-500 to-cyan-700', description: 'Tech vocabulary gems' },
  'Health': { icon: '🏥', color: 'from-pink-500 to-pink-700', description: 'Medical vocabulary gems' },
  'Sports': { icon: '⚽', color: 'from-orange-500 to-orange-700', description: 'Sports vocabulary gems' },
  'Nature': { icon: '🌿', color: 'from-emerald-500 to-emerald-700', description: 'Nature vocabulary gems' }
};

// =====================================================
// ENHANCED VOCABULARY SELECTOR COMPONENT
// =====================================================

export default function EnhancedVocabularySelector({
  onSelectionChange,
  maxItems = 50,
  defaultSelection = 'theme',
  showPreview = true,
  gameType = 'gem_collector',
  assignmentMode = false,
  difficulty = 'intermediate',
  onConfigChange
}: EnhancedVocabularySelectorProps) {
  // State
  const [selectionType, setSelectionType] = useState<'theme' | 'topic' | 'custom' | 'mining'>(defaultSelection);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<VocabularyItem[]>([]);
  const [availableItems, setAvailableItems] = useState<VocabularyItem[]>([]);
  const [themes, setThemes] = useState<VocabularyTheme[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [existingLists, setExistingLists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGemTypes, setSelectedGemTypes] = useState<string[]>(['common', 'uncommon', 'rare']);
  const [itemCount, setItemCount] = useState(20);
  const [showAdvanced, setShowAdvanced] = useState(false);

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
    loadExistingLists();
  }, []);

  useEffect(() => {
    if (selectedTheme) {
      loadVocabularyByTheme(selectedTheme);
    } else if (selectedTopic) {
      loadVocabularyByTopic(selectedTopic);
    }
  }, [selectedTheme, selectedTopic, difficulty, selectedGemTypes, itemCount]);

  useEffect(() => {
    onSelectionChange(selectedItems);
    if (onConfigChange) {
      onConfigChange({
        theme: selectedTheme,
        topic: selectedTopic,
        difficulty,
        gemTypes: selectedGemTypes,
        itemCount,
        selectionType
      });
    }
  }, [selectedItems, selectedTheme, selectedTopic, difficulty, selectedGemTypes, itemCount, selectionType]);

  const loadThemesAndTopics = async () => {
    try {
      const { data: themeData } = await supabase
        .from('vocabulary')
        .select('theme, topic, gem_type')
        .order('theme', { ascending: true });

      if (themeData) {
        const themeMap = new Map<string, { topics: Set<string>; gemCounts: any }>();
        const uniqueTopics = new Set<string>();

        themeData.forEach(item => {
          if (!themeMap.has(item.theme)) {
            themeMap.set(item.theme, {
              topics: new Set(),
              gemCounts: { common: 0, uncommon: 0, rare: 0, epic: 0, legendary: 0 }
            });
          }
          const themeInfo = themeMap.get(item.theme)!;
          themeInfo.topics.add(item.topic);
          if (item.gem_type) {
            themeInfo.gemCounts[item.gem_type]++;
          }
          uniqueTopics.add(item.topic);
        });

        const themesArray: VocabularyTheme[] = Array.from(themeMap.entries()).map(([name, info]) => {
          const themeConfig = THEME_ICONS[name] || { icon: '💎', color: 'from-gray-500 to-gray-700', description: 'Vocabulary gems' };
          return {
            name,
            topics: Array.from(info.topics),
            wordCount: Object.values(info.gemCounts).reduce((a, b) => a + b, 0),
            gemDistribution: info.gemCounts,
            icon: themeConfig.icon,
            color: themeConfig.color,
            description: themeConfig.description
          };
        });

        setThemes(themesArray);
        setTopics(Array.from(uniqueTopics).sort());
      }
    } catch (error) {
      console.error('Error loading themes and topics:', error);
    }
  };

  const loadExistingLists = async () => {
    try {
      const { data } = await supabase
        .from('vocabulary_assignment_lists')
        .select('*')
        .order('created_at', { ascending: false });

      setExistingLists(data || []);
    } catch (error) {
      console.error('Error loading existing lists:', error);
    }
  };

  const loadVocabularyByTheme = async (theme: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('vocabulary')
        .select('*')
        .eq('theme', theme)
        .order('frequency_score', { ascending: false });

      if (selectedGemTypes.length > 0) {
        query = query.in('gem_type', selectedGemTypes);
      }

      if (difficulty && difficulty !== 'all') {
        // Map difficulty to frequency score ranges
        const difficultyRanges = {
          beginner: [80, 100],
          intermediate: [40, 80],
          advanced: [0, 40]
        };
        const range = difficultyRanges[difficulty];
        if (range) {
          query = query.gte('frequency_score', range[0]).lte('frequency_score', range[1]);
        }
      }

      query = query.limit(itemCount);

      const { data } = await query;

      if (data) {
        setAvailableItems(data);
        setSelectedItems(data.slice(0, Math.min(itemCount, data.length)));
      }
    } catch (error) {
      console.error('Error loading vocabulary by theme:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVocabularyByTopic = async (topic: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from('vocabulary')
        .select('*')
        .eq('topic', topic)
        .order('frequency_score', { ascending: false });

      if (selectedGemTypes.length > 0) {
        query = query.in('gem_type', selectedGemTypes);
      }

      query = query.limit(itemCount);

      const { data } = await query;

      if (data) {
        setAvailableItems(data);
        setSelectedItems(data.slice(0, Math.min(itemCount, data.length)));
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

  const handleItemToggle = (item: VocabularyItem) => {
    setSelectedItems(prev => {
      const isSelected = prev.some(selected => selected.id === item.id);
      if (isSelected) {
        return prev.filter(selected => selected.id !== item.id);
      } else if (prev.length < maxItems) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const handleGemTypeToggle = (gemType: string) => {
    setSelectedGemTypes(prev => {
      const isSelected = prev.includes(gemType);
      if (isSelected) {
        return prev.filter(type => type !== gemType);
      } else {
        return [...prev, gemType];
      }
    });
  };

  const getGemIcon = (gemType: string) => {
    const gem = GEM_TYPES[gemType] || GEM_TYPES.common;
    return (
      <div className={`inline-flex items-center justify-center w-6 h-6 rounded-full bg-gradient-to-r ${gem.color}`}>
        <div className="text-white text-xs">
          {gem.icon}
        </div>
      </div>
    );
  };

  // =====================================================
  // RENDER METHODS
  // =====================================================

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
            <Diamond className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Gem Vocabulary Selector</h3>
            <p className="text-sm text-gray-600">Choose your vocabulary gems for the adventure</p>
          </div>
        </div>
        
        {assignmentMode && (
          <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
            <Trophy className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-600">Assignment Mode</span>
          </div>
        )}
      </div>

      {/* Selection Type Tabs */}
      <div className="flex mb-6 bg-white rounded-lg p-1 shadow-sm">
        {[
          { key: 'theme', label: 'Gem Mines', icon: <Target className="h-4 w-4" />, desc: 'Explore themed gem mines' },
          { key: 'topic', label: 'Gem Veins', icon: <BookOpen className="h-4 w-4" />, desc: 'Discover topic-specific veins' },
          { key: 'custom', label: 'Custom Collection', icon: <Users className="h-4 w-4" />, desc: 'Build your own collection' },
          { key: 'mining', label: 'Gem Mining', icon: <Sparkles className="h-4 w-4" />, desc: 'Advanced mining tools' }
        ].map(({ key, label, icon, desc }) => (
          <button
            key={key}
            onClick={() => setSelectionType(key as any)}
            className={`flex-1 flex flex-col items-center space-y-1 px-4 py-3 rounded-md transition-all ${
              selectionType === key
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
            <span className="text-xs opacity-80">{desc}</span>
          </button>
        ))}
      </div>

      {/* Gem Type Filters */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-800 flex items-center">
            <Gem className="h-4 w-4 mr-2 text-purple-600" />
            Gem Types
          </h4>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-purple-600 hover:text-purple-700 flex items-center"
          >
            Advanced Filters
            <ChevronDown className={`h-4 w-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(GEM_TYPES).map(([type, config]) => (
            <button
              key={type}
              onClick={() => handleGemTypeToggle(type)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedGemTypes.includes(type)
                  ? `${config.bgColor} ${config.borderColor} ${config.textColor}`
                  : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center mb-2">
                <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                  <div className="text-white">
                    {config.icon}
                  </div>
                </div>
              </div>
              <div className="text-xs font-medium">{config.name}</div>
              <div className="text-xs opacity-75">{config.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 bg-white rounded-lg p-4 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Levels</option>
                  <option value="beginner">Beginner Gems</option>
                  <option value="intermediate">Intermediate Gems</option>
                  <option value="advanced">Advanced Gems</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gem Count</label>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={itemCount}
                  onChange={(e) => setItemCount(parseInt(e.target.value))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">{itemCount} gems</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Gems</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search vocabulary gems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Selection */}
      {selectionType === 'theme' && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="h-4 w-4 mr-2 text-purple-600" />
            Choose Your Gem Mine
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {themes.map((theme) => (
              <motion.button
                key={theme.name}
                onClick={() => handleThemeSelect(theme.name)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  selectedTheme === theme.name
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${theme.color} flex items-center justify-center text-2xl`}>
                      {theme.icon}
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-800">{theme.name}</h5>
                      <p className="text-sm text-gray-600">{theme.description}</p>
                    </div>
                  </div>
                  {selectedTheme === theme.name && (
                    <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">{theme.wordCount} gems</span>
                  <div className="flex space-x-1">
                    {Object.entries(theme.gemDistribution).map(([type, count]) => (
                      count > 0 && (
                        <div key={type} className="flex items-center space-x-1">
                          {getGemIcon(type)}
                          <span className="text-xs text-gray-500">{count}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>

                <div className="mt-2">
                  <div className="text-xs text-gray-500 mb-1">Topics: {theme.topics.length}</div>
                  <div className="flex flex-wrap gap-1">
                    {theme.topics.slice(0, 3).map((topic) => (
                      <span key={topic} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {topic}
                      </span>
                    ))}
                    {theme.topics.length > 3 && (
                      <span className="text-xs text-gray-500">+{theme.topics.length - 3} more</span>
                    )}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Topic Selection */}
      {selectionType === 'topic' && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
            <BookOpen className="h-4 w-4 mr-2 text-purple-600" />
            Choose Your Gem Vein
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => handleTopicSelect(topic)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  selectedTopic === topic
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium text-sm">{topic}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Mining vocabulary gems...</p>
          </div>
        </div>
      )}

      {/* Selected Vocabulary Preview */}
      {!loading && selectedItems.length > 0 && showPreview && (
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4 border border-purple-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-purple-900 flex items-center">
              <Trophy className="h-4 w-4 mr-2" />
              Selected Gems ({selectedItems.length}/{maxItems})
            </h4>
            <button
              onClick={() => setSelectedItems([])}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {selectedItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-purple-100">
                <div className="flex items-center space-x-2">
                  {getGemIcon(item.gem_type || 'common')}
                  <span className="text-sm">
                    <strong className="text-gray-800">{item.spanish}</strong>
                    <span className="text-gray-600 ml-2">- {item.english}</span>
                  </span>
                </div>
                <button
                  onClick={() => handleItemToggle(item)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  <Minus className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Gem Distribution Summary */}
          <div className="mt-3 pt-3 border-t border-purple-200">
            <div className="flex items-center justify-between text-sm">
              <span className="text-purple-700 font-medium">Gem Collection:</span>
              <div className="flex space-x-3">
                {Object.entries(GEM_TYPES).map(([type, config]) => {
                  const count = selectedItems.filter(item => item.gem_type === type).length;
                  return count > 0 ? (
                    <div key={type} className="flex items-center space-x-1">
                      {getGemIcon(type)}
                      <span className={`text-xs font-medium ${config.textColor}`}>{count}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!loading && selectedItems.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedItems.length} gems selected for your {gameType === 'gem_collector' ? 'Gem Collector' : 'vocabulary'} adventure
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                // Shuffle selected items
                const shuffled = [...selectedItems].sort(() => Math.random() - 0.5);
                setSelectedItems(shuffled);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span>Shuffle</span>
            </button>

            <button
              onClick={() => {
                // Preview functionality
                console.log('Preview gems:', selectedItems);
              }}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>Preview</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
