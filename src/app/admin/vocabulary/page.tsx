'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Upload, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Volume2,
  Edit,
  Trash2,
  FileText,
  Database,
  CheckCircle,
  XCircle,
  RefreshCw,
  Globe,
  Grid3X3
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import VocabularyUploadForm from '../../../components/admin/VocabularyUploadForm';
import VocabularyEditor from '../../../components/admin/VocabularyEditor';
import CategorySelector from '../../../components/games/CategorySelector';

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  category: string;
  subcategory?: string;
  part_of_speech?: string;
  curriculum_level?: string;
  example_sentence?: string;
  example_translation?: string;
  gender?: string;
  has_audio: boolean;
  audio_url?: string;
  created_at: string;
  updated_at: string;
  article?: string;
  base_word?: string;
  display_word?: string;
}

interface VocabularyStats {
  total: number;
  byLanguage: Record<string, number>;
  byCategory: Record<string, number>;
  bySubcategory: Record<string, number>;
  withAudio: number;
  missingAudio: number;
}

export default function VocabularyManagementPage() {
  const { user, isAdmin, userRole } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<VocabularyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'upload' | 'edit' | 'category'>('list');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Category selector states
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [categoryVocabulary, setCategoryVocabulary] = useState<any[]>([]);
  const [loadingCategoryData, setLoadingCategoryData] = useState(false);
  const [categoryTotalCount, setCategoryTotalCount] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');
  const [audioFilter, setAudioFilter] = useState('all');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [error, setError] = useState<string>('');
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    key: 'word' | 'translation' | 'language' | 'category' | 'audio' | 'subcategory';
    direction: 'asc' | 'desc';
  } | null>(null);

  // Multi-select state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    // For development: Load vocabulary data even without authentication
    // In production, this should be protected by authentication
    if (true) { // Temporarily bypass auth check for development
      loadVocabulary();
      calculateStats();
    }
  }, []);

  useEffect(() => {
    // Only filter if we have any filters applied, otherwise show all vocabulary
    const hasFilters = searchTerm || languageFilter !== 'all' || categoryFilter !== 'all' || subcategoryFilter !== 'all' || audioFilter !== 'all' || sortConfig;
    
    if (hasFilters) {
      filterVocabulary();
    } else if (vocabulary.length > 0) {
      setFilteredVocabulary(vocabulary);
    }
    
    // Clear selected items when filters change
    setSelectedItems([]);
  }, [searchTerm, languageFilter, categoryFilter, subcategoryFilter, audioFilter, sortConfig, vocabulary]);

  // Reset subcategory filter when category changes
  useEffect(() => {
    if (categoryFilter !== 'all' && subcategoryFilter !== 'all') {
      // Check if the current subcategory exists in the selected category
      const subcategoryExistsInCategory = vocabulary.some(item => 
        item.category === categoryFilter && item.subcategory === subcategoryFilter
      );
      
      if (!subcategoryExistsInCategory) {
        setSubcategoryFilter('all');
      }
    }
  }, [categoryFilter, vocabulary, subcategoryFilter]);

  // Load more data when page changes
  const loadMoreData = () => {
    // This function is no longer needed since we're loading all data
  };

  const loadVocabulary = async () => {
    try {
      setLoading(true);
      
      // First, get total count for stats
      const { count } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('id', { count: 'exact', head: true });
      
      setTotalItems(count || 0);

      // Load ALL vocabulary items - remove any limits
      const { data, error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('*')
        .order('id', { ascending: true });

      if (error) {
        console.error('Error loading vocabulary:', error);
        setError('Failed to load vocabulary');
        return;
      }

      if (data) {
        console.log(`Loaded ${data.length} vocabulary items from database`);
        
        // Process the data to ensure has_audio is correctly set
        const processedData = data.map(item => ({
          ...item,
          has_audio: !!item.audio_url
        }));

        setVocabulary(processedData);
        setFilteredVocabulary(processedData);
      }
    } catch (error) {
      console.error('Error in loadVocabulary:', error);
      setError('Failed to load vocabulary');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = async () => {
    try {
      // Get overall statistics from database for accuracy
      const { data: allData, error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('language, category, subcategory, audio_url');

      if (error || !allData) {
        console.error('Error calculating stats:', error);
        return;
      }

      const stats: VocabularyStats = {
        total: allData.length,
        byLanguage: {},
        byCategory: {},
        bySubcategory: {},
        withAudio: 0,
        missingAudio: 0
      };

      allData.forEach(item => {
        // Language stats
        stats.byLanguage[item.language] = (stats.byLanguage[item.language] || 0) + 1;

        // Category stats
        stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;

        // Subcategory stats
        if (item.subcategory) {
          stats.bySubcategory[item.subcategory] = (stats.bySubcategory[item.subcategory] || 0) + 1;
        }

        // Audio stats - check audio_url existence only
        const hasAudio = !!item.audio_url;
        if (hasAudio) {
          stats.withAudio++;
        } else {
          stats.missingAudio++;
        }
      });

      setStats(stats);
    } catch (error) {
      console.error('Error calculating stats:', error);
    }
  };

  const filterVocabulary = async () => {
    try {
      setLoading(true);
      
      // Build query with filters
      let query = supabaseBrowser
        .from('centralized_vocabulary')
        .select('*');

      // Apply filters to the database query
      if (searchTerm) {
        query = query.or(
          `word.ilike.%${searchTerm}%,display_word.ilike.%${searchTerm}%,base_word.ilike.%${searchTerm}%,translation.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`
        );
      }

      if (languageFilter !== 'all') {
        query = query.eq('language', languageFilter);
      }

      if (categoryFilter !== 'all') {
        query = query.eq('category', categoryFilter);
      }

      if (subcategoryFilter !== 'all') {
        query = query.eq('subcategory', subcategoryFilter);
      }

      // For audio filter, we'll filter after getting results since it's computed
      query = query.order('id', { ascending: true });

      const { data, error } = await query;

      if (error) {
        console.error('Error filtering vocabulary:', error);
        return;
      }

      let filtered = data || [];

      // Process the data to ensure has_audio is correctly set and apply audio filter
      filtered = filtered.map(item => ({
        ...item,
        has_audio: !!item.audio_url
      }));

      // Apply audio filter after processing
      if (audioFilter === 'with_audio') {
        filtered = filtered.filter(item => item.has_audio);
      } else if (audioFilter === 'missing_audio') {
        filtered = filtered.filter(item => !item.has_audio);
      }

      // Apply sorting if configured
      if (sortConfig && sortConfig.direction) {
        filtered.sort((a, b) => {
          let aValue: any;
          let bValue: any;

          switch (sortConfig.key) {
            case 'word':
              // Sort by display_word or word, prioritizing alphabetical order
              aValue = (a.display_word || a.word || '').toLowerCase();
              bValue = (b.display_word || b.word || '').toLowerCase();
              break;
            case 'translation':
              aValue = (a.translation || '').toLowerCase();
              bValue = (b.translation || '').toLowerCase();
              break;
            case 'language':
              aValue = (a.language || '').toLowerCase();
              bValue = (b.language || '').toLowerCase();
              break;
            case 'category':
              aValue = (a.category || '').toLowerCase();
              bValue = (b.category || '').toLowerCase();
              break;
            case 'subcategory':
              aValue = (a.subcategory || '').toLowerCase();
              bValue = (b.subcategory || '').toLowerCase();
              break;
            case 'audio':
              // Sort by audio availability: with audio first, then missing audio
              aValue = a.has_audio ? 1 : 0;
              bValue = b.has_audio ? 1 : 0;
              break;
            default:
              return 0;
          }

          if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }

      setFilteredVocabulary(filtered);
    } catch (error) {
      console.error('Error filtering vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sort request
  const handleSort = (key: 'word' | 'translation' | 'language' | 'category' | 'audio' | 'subcategory') => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  // Get sort indicator icon
  const getSortIcon = (columnKey: 'word' | 'translation' | 'language' | 'category' | 'audio' | 'subcategory') => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <span className="text-slate-300 ml-1">⬍</span>;
    }
    
    return (
      <span className="text-indigo-600 ml-1">
        {sortConfig.direction === 'asc' ? '↑' : '↓'}
      </span>
    );
  };

  const generateMissingAudio = async () => {
    const missingAudioItems = vocabulary.filter(item => !item.has_audio);
    
    if (missingAudioItems.length === 0) {
      alert('All vocabulary items already have audio!');
      return;
    }

    setIsGeneratingAudio(true);
    setAudioProgress(0);

    try {
      let completed = 0;
      for (const item of missingAudioItems) {
        await generateAudioForItem(item);
        completed++;
        setAudioProgress((completed / missingAudioItems.length) * 100);
      }
      
      // Reload vocabulary to get updated audio URLs
      await loadVocabulary();
      alert(`Generated audio for ${completed} vocabulary items!`);
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Error generating audio. Please try again.');
    } finally {
      setIsGeneratingAudio(false);
      setAudioProgress(0);
    }
  };

  const generateAudioForItem = async (item: VocabularyItem) => {
    try {
      const response = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: item.word,
          language: item.language,
          vocabularyId: item.id,
          category: item.category || 'general',
          base_word: item.base_word
        }),
      });

      if (!response.ok) throw new Error('Failed to generate audio');
      
      const result = await response.json();
      console.log('Audio generation result:', result); // Debug log
      
      if (!result.success) {
        throw new Error('Audio generation failed: ' + (result.message || 'Unknown error'));
      }
      
      console.log(`Successfully generated audio for ${item.word}`);

    } catch (error) {
      console.error(`Error generating audio for ${item.word}:`, error);
      throw error;
    }
  };

  // Load vocabulary by category/subcategory (unlimited)
  const loadVocabularyByCategory = async (categoryId: string, subcategoryId: string | null) => {
    setLoadingCategoryData(true);
    try {
      let query = supabaseBrowser
        .from('centralized_vocabulary')
        .select('*')
        .eq('category', categoryId)
        .order('word');

      // Apply language filter if one is set
      if (languageFilter !== 'all') {
        query = query.eq('language', languageFilter);
      }

      if (subcategoryId) {
        query = query.eq('subcategory', subcategoryId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Process the data to ensure has_audio is correctly set
      const processedData = (data || []).map(item => ({
        ...item,
        has_audio: !!item.audio_url
      }));

      setCategoryVocabulary(processedData);
      setSelectedCategory(categoryId);
      setSelectedSubcategory(subcategoryId);

      // Also get the total count for the entire category for display purposes
      if (subcategoryId) {
        let totalCountQuery = supabaseBrowser
          .from('centralized_vocabulary')
          .select('*', { count: 'exact', head: true })
          .eq('category', categoryId);

        // Apply same language filter for total count
        if (languageFilter !== 'all') {
          totalCountQuery = totalCountQuery.eq('language', languageFilter);
        }

        const { count: totalCategoryCount } = await totalCountQuery;
        setCategoryTotalCount(totalCategoryCount || 0);
      } else {
        setCategoryTotalCount(processedData.length);
      }
    } catch (error) {
      console.error('Error loading category vocabulary:', error);
      alert('Failed to load category vocabulary');
    } finally {
      setLoadingCategoryData(false);
    }
  };

  // Handle category selection
  const handleCategorySelect = (categoryId: string, subcategoryId: string | null) => {
    loadVocabularyByCategory(categoryId, subcategoryId);
    setCurrentView('category');
  };

  const deleteVocabularyItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vocabulary item?')) return;
    
    try {
      const { error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadVocabulary();
    } catch (error) {
      console.error('Error deleting vocabulary item:', error);
      alert('Error deleting vocabulary item');
    }
  };

  // Multi-select functions
  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === filteredVocabulary.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredVocabulary.map(item => item.id));
    }
  };

  const deleteSelectedItems = async () => {
    if (selectedItems.length === 0) return;
    
    const itemCount = selectedItems.length;
    if (!confirm(`Are you sure you want to delete ${itemCount} vocabulary item${itemCount > 1 ? 's' : ''}?`)) return;
    
    try {
      setIsDeleting(true);
      
      const { error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .delete()
        .in('id', selectedItems);

      if (error) throw error;

      setSelectedItems([]);
      await loadVocabulary();
      alert(`Successfully deleted ${itemCount} vocabulary item${itemCount > 1 ? 's' : ''}`);
    } catch (error) {
      console.error('Error deleting vocabulary items:', error);
      alert('Error deleting vocabulary items');
    } finally {
      setIsDeleting(false);
    }
  };

  const getLanguageFlag = (language: string) => {
    const flags: Record<string, string> = {
      'fr': '🇫🇷',
      'es': '🇪🇸',
      'de': '🇩🇪',
      'it': '🇮🇹',
      'pt': '🇵🇹'
    };
    return flags[language] || '🌍';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-6">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-2 text-lg">Loading vocabulary...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Vocabulary Management</h1>
          <p className="text-slate-600">Manage your centralized vocabulary database and audio files</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Words</p>
                  <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
                </div>
                <Database className="w-8 h-8 text-blue-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">With Audio</p>
                  <p className="text-3xl font-bold text-green-600">{stats.withAudio}</p>
                </div>
                <Volume2 className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Missing Audio</p>
                  <p className="text-3xl font-bold text-red-600">{stats.missingAudio}</p>
                </div>
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Languages</p>
                  <p className="text-3xl font-bold text-purple-600">{Object.keys(stats.byLanguage).length}</p>
                </div>
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 mb-6">
          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setCurrentView('list')}
              className={`px-6 py-3 font-medium text-sm ${
                currentView === 'list'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Database className="w-4 h-4 inline mr-2" />
              Vocabulary List
            </button>
            <button
              onClick={() => setCurrentView('category')}
              className={`px-6 py-3 font-medium text-sm ${
                currentView === 'category'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid3X3 className="w-4 h-4 inline mr-2" />
              Browse by Category
            </button>
            <button
              onClick={() => setCurrentView('upload')}
              className={`px-6 py-3 font-medium text-sm ${
                currentView === 'upload'
                  ? 'text-indigo-600 border-b-2 border-indigo-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4 inline mr-2" />
              Upload Vocabulary
            </button>
          </div>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {currentView === 'list' && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >

              {/* Filters and Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search vocabulary..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <select
                      value={languageFilter}
                      onChange={(e) => setLanguageFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="all">All Languages</option>
                      {vocabulary.length > 0 && (() => {
                        const languages: Record<string, number> = {};
                        vocabulary.forEach(item => {
                          languages[item.language] = (languages[item.language] || 0) + 1;
                        });
                        return Object.keys(languages).map(lang => (
                          <option key={lang} value={lang}>
                            {getLanguageFlag(lang)} {lang.toUpperCase()} ({languages[lang]})
                          </option>
                        ));
                      })()}
                    </select>

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="all">All Categories</option>
                      {vocabulary.length > 0 && (() => {
                        const categories: Record<string, number> = {};
                        vocabulary.forEach(item => {
                          categories[item.category] = (categories[item.category] || 0) + 1;
                        });
                        return Object.keys(categories).sort().map(category => (
                          <option key={category} value={category}>
                            {category} ({categories[category]})
                          </option>
                        ));
                      })()}
                    </select>

                    <select
                      value={subcategoryFilter}
                      onChange={(e) => setSubcategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="all">All Subcategories</option>
                      {vocabulary.length > 0 && (() => {
                        const subcategories: Record<string, number> = {};
                        vocabulary.forEach(item => {
                          // Only include subcategories that belong to the selected category
                          if (item.subcategory && (categoryFilter === 'all' || item.category === categoryFilter)) {
                            subcategories[item.subcategory] = (subcategories[item.subcategory] || 0) + 1;
                          }
                        });
                        return Object.keys(subcategories).sort().map(subcategory => (
                          <option key={subcategory} value={subcategory}>
                            {subcategory} ({subcategories[subcategory]})
                          </option>
                        ));
                      })()}
                    </select>

                    <select
                      value={audioFilter}
                      onChange={(e) => setAudioFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="all">All Audio Status</option>
                      <option value="with_audio">With Audio</option>
                      <option value="missing_audio">Missing Audio</option>
                    </select>
                  </div>

                  <button
                    onClick={generateMissingAudio}
                    disabled={isGeneratingAudio || !stats || stats.missingAudio === 0}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isGeneratingAudio ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Generating... {Math.round(audioProgress)}%
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Generate Missing Audio
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Vocabulary Table */}
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {/* Results Counter */}
                <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="text-sm text-slate-600">
                    {searchTerm || languageFilter !== 'all' || categoryFilter !== 'all' || subcategoryFilter !== 'all' || audioFilter !== 'all' || sortConfig ? (
                      <>Showing {filteredVocabulary.length} filtered results from {totalItems} total items</>
                    ) : (
                      <>Showing all {totalItems} vocabulary items</>
                    )}
                  </div>
                  {(searchTerm || languageFilter !== 'all' || categoryFilter !== 'all' || subcategoryFilter !== 'all' || audioFilter !== 'all' || sortConfig) && (
                    <button
                      onClick={() => {
                        setSearchTerm('');
                        setLanguageFilter('all');
                        setCategoryFilter('all');
                        setSubcategoryFilter('all');
                        setAudioFilter('all');
                        setSortConfig(null);
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                    >
                      Clear filters & sorting
                    </button>
                  )}
                </div>
                
                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                  <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-blue-900">
                        {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selected
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={deleteSelectedItems}
                          disabled={isDeleting}
                          className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {isDeleting ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-3 h-3" />
                              Delete Selected
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedItems([])}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Clear selection
                    </button>
                  </div>
                )}
                
                <div className="overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-full">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-12">
                            <input
                              type="checkbox"
                              checked={selectedItems.length === filteredVocabulary.length && filteredVocabulary.length > 0}
                              onChange={selectAllItems}
                              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                            />
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-0">
                            <button 
                              onClick={() => handleSort('word')}
                              className="flex items-center gap-1 hover:text-slate-700 text-left"
                              title="Sort by word (includes both display word and base word)"
                            >
                              Word {getSortIcon('word')}
                            </button>
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-20">
                            <span className="text-slate-500" title="Base word used for pronunciation and audio">
                              Base Word
                            </span>
                          </th>
                          <th className="px-3 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider min-w-0">
                            <button 
                              onClick={() => handleSort('translation')}
                              className="flex items-center gap-1 hover:text-slate-700"
                            >
                              Translation {getSortIcon('translation')}
                            </button>
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-16">
                            <button 
                              onClick={() => handleSort('language')}
                              className="flex items-center gap-1 hover:text-slate-700"
                            >
                              Lang {getSortIcon('language')}
                            </button>
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-36">
                            <button 
                              onClick={() => handleSort('category')}
                              className="flex items-center gap-1 hover:text-slate-700"
                            >
                              Category {getSortIcon('category')}
                            </button>
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-32">
                            <button 
                              onClick={() => handleSort('subcategory')}
                              className="flex items-center gap-1 hover:text-slate-700"
                            >
                              Subcategory {getSortIcon('subcategory')}
                            </button>
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-16">
                            <button 
                              onClick={() => handleSort('audio')}
                              className="flex items-center gap-1 hover:text-slate-700"
                              title="Sort by audio availability - words with audio first, then missing audio"
                            >
                              Audio {getSortIcon('audio')}
                            </button>
                          </th>
                          <th className="px-2 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider w-20">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-slate-200">
                        {filteredVocabulary.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="px-3 py-2">
                              <input
                                type="checkbox"
                                checked={selectedItems.includes(item.id)}
                                onChange={() => toggleItemSelection(item.id)}
                                className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                              />
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-sm font-medium text-slate-900 truncate" title={item.display_word || item.word}>
                                {item.display_word || item.word}
                              </div>
                              {item.article && item.base_word && item.article !== item.base_word && (
                                <div className="text-xs text-slate-500 mt-1 flex gap-1 flex-wrap">
                                  <span className="bg-blue-50 text-blue-600 px-1 rounded text-xs">
                                    {item.article}
                                  </span>
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-2">
                              <div className="text-sm text-slate-700 truncate" title={item.base_word || item.word}>
                                {item.base_word || item.word}
                              </div>
                            </td>
                            <td className="px-3 py-2">
                              <div className="text-sm text-slate-900 truncate" title={item.translation}>
                                {item.translation}
                              </div>
                            </td>
                            <td className="px-2 py-2 text-center">
                              <span className="text-lg" title={item.language.toUpperCase()}>
                                {getLanguageFlag(item.language)}
                              </span>
                            </td>
                            <td className="px-2 py-2">
                              <span className="inline-block px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full truncate max-w-32" title={item.category}>
                                {item.category}
                              </span>
                            </td>
                            <td className="px-2 py-2">
                              {item.subcategory ? (
                                <span className="inline-block px-2 py-1 text-xs font-medium bg-purple-50 text-purple-700 rounded-full truncate max-w-28" title={item.subcategory}>
                                  {item.subcategory}
                                </span>
                              ) : (
                                <span className="text-xs text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-2 py-2 text-center">
                              {item.has_audio ? (
                                <div className="flex items-center justify-center gap-1">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                  <button
                                    onClick={() => {
                                      const audio = new Audio(item.audio_url);
                                      audio.play();
                                    }}
                                    className="text-indigo-600 hover:text-indigo-800"
                                    title="Play audio"
                                  >
                                    <Volume2 className="w-3 h-3" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center">
                                  <XCircle className="w-4 h-4 text-red-600" />
                                  <button
                                    onClick={async () => {
                                      try {
                                        await generateAudioForItem(item);
                                        await loadVocabulary();
                                        alert(`Audio generated for ${item.word}!`);
                                      } catch (error) {
                                        alert(`Failed to generate audio for ${item.word}`);
                                      }
                                    }}
                                    className="text-blue-600 hover:text-blue-800 text-xs ml-1"
                                    title="Generate audio"
                                  >
                                    Gen
                                  </button>
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-2">
                              <div className="flex items-center gap-1 justify-center">
                                <button
                                  onClick={() => {
                                    setSelectedItem(item);
                                    setCurrentView('edit');
                                  }}
                                  className="text-indigo-600 hover:text-indigo-900 p-1"
                                  title="Edit"
                                >
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button
                                  onClick={() => deleteVocabularyItem(item.id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>                {filteredVocabulary.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No vocabulary items found</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VocabularyUploadForm onUploadComplete={loadVocabulary} />
            </motion.div>
          )}

          {currentView === 'category' && (
            <motion.div
              key="category"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="space-y-6">
                {/* Category Selector */}
                <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Select Category & Subcategory</h3>
                  <p className="text-slate-600 mb-6">Choose a category and optionally a subcategory to view all related vocabulary without pagination limits.</p>
                  <CategorySelector
                    onCategorySelect={handleCategorySelect}
                    selectedLanguage="all"
                  />
                </div>

                {/* Selected Category Info */}
                {selectedCategory && (
                  <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900">
                          {selectedCategory}
                          {selectedSubcategory && (
                            <span className="text-slate-600"> {'>'} {selectedSubcategory}</span>
                          )}
                          {languageFilter !== 'all' && (
                            <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                              {languageFilter.toUpperCase()} only
                            </span>
                          )}
                        </h3>
                        <p className="text-slate-600">
                          {loadingCategoryData ? 'Loading...' :
                            selectedSubcategory ?
                              `${categoryVocabulary.length} items in subcategory (${categoryTotalCount} total in category${languageFilter !== 'all' ? ` for ${languageFilter.toUpperCase()}` : ' across all languages'})` :
                              `${categoryVocabulary.length} vocabulary items${languageFilter !== 'all' ? ` in ${languageFilter.toUpperCase()}` : ' across all languages'}`
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setSelectedSubcategory(null);
                          setCategoryVocabulary([]);
                          setCategoryTotalCount(0);
                        }}
                        className="text-slate-600 hover:text-slate-900"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    </div>

                    {loadingCategoryData ? (
                      <div className="flex items-center justify-center py-8">
                        <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                        <span className="ml-2 text-lg">Loading vocabulary...</span>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Word</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Translation</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Language</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Subcategory</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Audio</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-slate-200">
                            {categoryVocabulary.map((item) => (
                              <tr key={item.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="font-medium text-slate-900">
                                    {item.display_word || item.word}
                                  </div>
                                  {item.article && item.base_word && (
                                    <div className="text-xs text-slate-500">
                                      <span className="text-blue-600">{item.article}</span> + <span className="text-green-600">{item.base_word}</span>
                                    </div>
                                  )}
                                  {item.phonetic && (
                                    <div className="text-sm text-slate-500">[{item.phonetic}]</div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-slate-900">{item.translation}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="text-lg">{getLanguageFlag(item.language)}</span>
                                  <span className="ml-2 text-sm font-medium text-slate-900">{item.language.toUpperCase()}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-800 rounded-full">
                                    {item.subcategory}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  {item.has_audio ? (
                                    <div className="flex items-center">
                                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                      <button
                                        onClick={() => {
                                          const audio = new Audio(item.audio_url);
                                          audio.play();
                                        }}
                                        className="text-indigo-600 hover:text-indigo-800"
                                        title="Play audio"
                                      >
                                        <Volume2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center">
                                      <XCircle className="w-5 h-5 text-red-600 mr-2" />
                                      <button
                                        onClick={async () => {
                                          try {
                                            await generateAudioForItem(item);
                                            // Refresh category data after audio generation
                                            await loadVocabularyByCategory(selectedCategory!, selectedSubcategory);
                                            alert(`Audio generated for ${item.word}!`);
                                          } catch (error) {
                                            alert(`Failed to generate audio for ${item.word}`);
                                          }
                                        }}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                        title="Generate audio"
                                      >
                                        Generate
                                      </button>
                                    </div>
                                  )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => {
                                        setSelectedItem(item);
                                        setCurrentView('edit');
                                      }}
                                      className="text-indigo-600 hover:text-indigo-900"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteVocabularyItem(item.id)}
                                      className="text-red-600 hover:text-red-900"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        
                        {categoryVocabulary.length === 0 && !loadingCategoryData && selectedCategory && (
                          <div className="text-center py-8">
                            <Database className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500">No vocabulary items found for this category</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {currentView === 'edit' && selectedItem && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <VocabularyEditor
                vocabulary={selectedItem}
                onSave={loadVocabulary}
                onCancel={() => {
                  setCurrentView('list');
                  setSelectedItem(null);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
