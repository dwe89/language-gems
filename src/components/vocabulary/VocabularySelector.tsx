'use client';

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Filter, 
  CheckCircle2, 
  Plus, 
  Minus,
  Search,
  Shuffle,
  Eye,
  Download,
  Upload,
  Users,
  Clock,
  Target
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

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
}

interface VocabularySelectorProps {
  onSelectionChange: (selectedItems: VocabularyItem[], listId?: string) => void;
  maxItems?: number;
  defaultSelection?: 'theme' | 'topic' | 'custom';
  showPreview?: boolean;
}

export default function VocabularySelector({ 
  onSelectionChange, 
  maxItems = 50,
  defaultSelection = 'theme',
  showPreview = true 
}: VocabularySelectorProps) {
  const [selectionType, setSelectionType] = useState<'theme' | 'topic' | 'custom' | 'existing'>(defaultSelection);
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [selectedItems, setSelectedItems] = useState<VocabularyItem[]>([]);
  const [availableItems, setAvailableItems] = useState<VocabularyItem[]>([]);
  const [themes, setThemes] = useState<VocabularyTheme[]>([]);
  const [topics, setTopics] = useState<string[]>([]);
  const [existingLists, setExistingLists] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [itemCount, setItemCount] = useState(20);
  const [difficulty, setDifficulty] = useState<string>('');
  
  const supabase = createBrowserClient();

  // Load themes and topics on component mount
  useEffect(() => {
    loadThemesAndTopics();
    loadExistingLists();
  }, []);

  // Load vocabulary items when selection criteria changes
  useEffect(() => {
    if (selectionType === 'theme' && selectedTheme) {
      loadVocabularyByTheme(selectedTheme);
    } else if (selectionType === 'topic' && selectedTopic) {
      loadVocabularyByTopic(selectedTopic);
    } else if (selectionType === 'custom') {
      loadAllVocabulary();
    }
  }, [selectionType, selectedTheme, selectedTopic, itemCount]);

  const loadThemesAndTopics = async () => {
    try {
      const { data: themeData } = await supabase
        .from('vocabulary')
        .select('theme, topic')
        .order('theme', { ascending: true });

      if (themeData) {
        const themeMap = new Map<string, Set<string>>();
        const uniqueTopics = new Set<string>();

        themeData.forEach(item => {
          if (!themeMap.has(item.theme)) {
            themeMap.set(item.theme, new Set());
          }
          themeMap.get(item.theme)?.add(item.topic);
          uniqueTopics.add(item.topic);
        });

        const themesArray: VocabularyTheme[] = Array.from(themeMap.entries()).map(([name, topics]) => ({
          name,
          topics: Array.from(topics),
          wordCount: 0 // Will be populated when needed
        }));

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
      const { data } = await supabase
        .rpc('get_vocabulary_by_criteria', {
          p_theme: theme,
          p_topic: null,
          p_difficulty: difficulty || null,
          p_limit: itemCount
        });

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
      const { data } = await supabase
        .rpc('get_vocabulary_by_criteria', {
          p_theme: null,
          p_topic: topic,
          p_difficulty: difficulty || null,
          p_limit: itemCount
        });

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

  const loadAllVocabulary = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('vocabulary')
        .select('*')
        .order('id', { ascending: true });

      if (searchTerm) {
        query = query.or(
          `spanish.ilike.%${searchTerm}%,english.ilike.%${searchTerm}%`
        );
      }

      const { data } = await query.limit(200); // Limit for performance

      if (data) {
        setAvailableItems(data);
      }
    } catch (error) {
      console.error('Error loading all vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleItemToggle = (item: VocabularyItem) => {
    const isSelected = selectedItems.some(selected => selected.id === item.id);
    let newSelection;

    if (isSelected) {
      newSelection = selectedItems.filter(selected => selected.id !== item.id);
    } else {
      if (selectedItems.length < maxItems) {
        newSelection = [...selectedItems, item];
      } else {
        return; // Max items reached
      }
    }

    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  const handleRandomSelection = () => {
    if (availableItems.length === 0) return;
    
    const shuffled = [...availableItems].sort(() => Math.random() - 0.5);
    const randomItems = shuffled.slice(0, Math.min(itemCount, maxItems));
    
    setSelectedItems(randomItems);
    onSelectionChange(randomItems);
  };

  const handleSelectAll = () => {
    const newSelection = availableItems.slice(0, maxItems);
    setSelectedItems(newSelection);
    onSelectionChange(newSelection);
  };

  const handleClearSelection = () => {
    setSelectedItems([]);
    onSelectionChange([]);
  };

  const handleExistingListSelect = (listId: string) => {
    // This would load vocabulary from an existing list
    // Implementation would fetch the vocabulary items for the selected list
    onSelectionChange([], listId);
  };

  const filteredAvailableItems = availableItems.filter(item =>
    !searchTerm || 
    item.spanish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.english.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center mb-6">
        <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-lg font-semibold text-gray-900">Select Vocabulary</h3>
        <span className="ml-auto text-sm text-gray-500">
          {selectedItems.length} / {maxItems} items selected
        </span>
      </div>

      {/* Selection Type Tabs */}
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'theme', label: 'By Theme', icon: <Target className="h-4 w-4" /> },
          { key: 'topic', label: 'By Topic', icon: <BookOpen className="h-4 w-4" /> },
          { key: 'custom', label: 'Custom Selection', icon: <Users className="h-4 w-4" /> },
          { key: 'existing', label: 'Existing Lists', icon: <Download className="h-4 w-4" /> }
        ].map(({ key, label, icon }) => (
          <button
            key={key}
            onClick={() => setSelectionType(key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors flex-1 justify-center ${
              selectionType === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {icon}
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>

      {/* Selection Controls */}
      {selectionType === 'theme' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Theme
          </label>
          <select
            value={selectedTheme}
            onChange={(e) => setSelectedTheme(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a theme...</option>
            {themes.map((theme) => (
              <option key={theme.name} value={theme.name}>
                {theme.name} ({theme.topics.length} topics)
              </option>
            ))}
          </select>
        </div>
      )}

      {selectionType === 'topic' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Topic
          </label>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose a topic...</option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectionType === 'existing' && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Existing List
          </label>
          <select
            onChange={(e) => handleExistingListSelect(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose an existing list...</option>
            {existingLists.map((list) => (
              <option key={list.id} value={list.id}>
                {list.name} ({list.word_count} words)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Additional Controls */}
      {(selectionType === 'theme' || selectionType === 'topic') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Items
            </label>
            <input
              type="number"
              value={itemCount}
              onChange={(e) => setItemCount(Math.min(maxItems, parseInt(e.target.value) || 1))}
              min="1"
              max={maxItems}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      )}

      {/* Search and Action Buttons */}
      {selectionType === 'custom' && (
        <div className="mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search vocabulary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRandomSelection}
              className="flex items-center space-x-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
            >
              <Shuffle className="h-4 w-4" />
              <span>Random {itemCount}</span>
            </button>
            <button
              onClick={handleSelectAll}
              className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Select All</span>
            </button>
            <button
              onClick={handleClearSelection}
              className="flex items-center space-x-2 px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
            >
              <Minus className="h-4 w-4" />
              <span>Clear</span>
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading vocabulary...</span>
        </div>
      )}

      {/* Vocabulary Items Display */}
      {!loading && (selectionType === 'custom' || selectedTheme || selectedTopic) && (
        <div className="space-y-4">
          {/* Selected Items Preview */}
          {showPreview && selectedItems.length > 0 && (
            <div className="bg-blue-50 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-blue-900 mb-2">Selected Vocabulary ({selectedItems.length})</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                {selectedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-white rounded px-3 py-1">
                    <span className="text-sm">
                      <strong>{item.spanish}</strong> - {item.english}
                    </span>
                    <button
                      onClick={() => handleItemToggle(item)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available Items for Custom Selection */}
          {selectionType === 'custom' && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Available Vocabulary</h4>
              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                {filteredAvailableItems.map((item) => {
                  const isSelected = selectedItems.some(selected => selected.id === item.id);
                  return (
                    <div
                      key={item.id}
                      className={`flex items-center justify-between p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleItemToggle(item)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="font-medium text-gray-900">{item.spanish}</div>
                          <div className="text-gray-600">{item.english}</div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.theme} • {item.topic} • {item.part_of_speech}
                        </div>
                      </div>
                      <div className="flex items-center">
                        {isSelected ? (
                          <CheckCircle2 className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Plus className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 