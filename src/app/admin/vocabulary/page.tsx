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
  Globe
} from 'lucide-react';
import { useAuth, supabaseBrowser } from '../../../components/auth/AuthProvider';
import VocabularyUploadForm from '../../../components/admin/VocabularyUploadForm';
import VocabularyEditor from '../../../components/admin/VocabularyEditor';

interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  language: string;
  category: string;
  subcategory?: string;
  part_of_speech?: string;
  difficulty_level?: string;
  curriculum_level?: string;
  tags?: string[];
  frequency_rank?: number;
  example_sentence?: string;
  example_translation?: string;
  phonetic?: string;
  gender?: string;
  irregular_forms?: string;
  synonyms?: string;
  antonyms?: string;
  audio_url?: string;
  has_audio: boolean;
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
  withAudio: number;
  missingAudio: number;
}

export default function VocabularyManagementPage() {
  const { user } = useAuth();
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState<VocabularyItem[]>([]);
  const [stats, setStats] = useState<VocabularyStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'list' | 'upload' | 'edit'>('list');
  const [selectedItem, setSelectedItem] = useState<VocabularyItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [languageFilter, setLanguageFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [audioFilter, setAudioFilter] = useState('all');
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);

  useEffect(() => {
    loadVocabulary();
  }, []);

  useEffect(() => {
    filterVocabulary();
  }, [vocabulary, searchTerm, languageFilter, categoryFilter, audioFilter]);

  const loadVocabulary = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabaseBrowser
        .from('centralized_vocabulary')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const vocabularyWithAudio = data.map(item => ({
        ...item,
        has_audio: !!item.audio_url,
        tags: item.tags || []
      }));

      setVocabulary(vocabularyWithAudio);
      calculateStats(vocabularyWithAudio);
    } catch (error) {
      console.error('Error loading vocabulary:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data: VocabularyItem[]) => {
    const stats: VocabularyStats = {
      total: data.length,
      byLanguage: {},
      byCategory: {},
      withAudio: 0,
      missingAudio: 0
    };

    data.forEach(item => {
      // Language stats
      stats.byLanguage[item.language] = (stats.byLanguage[item.language] || 0) + 1;
      
      // Category stats
      stats.byCategory[item.category] = (stats.byCategory[item.category] || 0) + 1;
      
      // Audio stats
      if (item.has_audio) {
        stats.withAudio++;
      } else {
        stats.missingAudio++;
      }
    });

    setStats(stats);
  };

  const filterVocabulary = () => {
    let filtered = vocabulary;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.display_word && item.display_word.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.base_word && item.base_word.toLowerCase().includes(searchTerm.toLowerCase())) ||
        item.translation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(item => item.language === languageFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === categoryFilter);
    }

    // Audio filter
    if (audioFilter === 'with_audio') {
      filtered = filtered.filter(item => item.has_audio);
    } else if (audioFilter === 'missing_audio') {
      filtered = filtered.filter(item => !item.has_audio);
    }

    setFilteredVocabulary(filtered);
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
                      {stats && Object.keys(stats.byLanguage).map(lang => (
                        <option key={lang} value={lang}>
                          {getLanguageFlag(lang)} {lang.toUpperCase()} ({stats.byLanguage[lang]})
                        </option>
                      ))}
                    </select>

                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    >
                      <option value="all">All Categories</option>
                      {stats && Object.keys(stats.byCategory).map(category => (
                        <option key={category} value={category}>
                          {category} ({stats.byCategory[category]})
                        </option>
                      ))}
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
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Word</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Translation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Language</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Audio</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {filteredVocabulary.map((item) => (
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
                              {item.category}
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
                                      await loadVocabulary(); // Refresh the data
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
                </div>
                
                {filteredVocabulary.length === 0 && (
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
