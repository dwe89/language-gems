'use client';

import React, { useState, useEffect } from 'react';
import { X, Volume2, Play, Trash2, Loader2 } from 'lucide-react';
import { VocabularyUploadService, UploadedVocabularyList } from '../../services/vocabularyUploadService';
import { EnhancedVocabularyService } from '../../services/enhancedVocabularyService';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';

interface InlineVocabularyCreatorProps {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    language?: 'spanish' | 'french' | 'german';
    theme?: string;
    topic?: string;
    difficulty_level?: 'beginner' | 'intermediate' | 'advanced';
    content_type?: 'words' | 'sentences' | 'mixed';
    is_public?: boolean;
    folder_id?: string;
    items?: VocabularyPair[];
  };
  mode?: 'create' | 'edit';
}

interface VocabularyPair {
  id: string;
  learningWord: string;
  supportWord: string;
  partOfSpeech?: string;
  contextSentence?: string;
  contextTranslation?: string;
  difficultyLevel?: 'beginner' | 'intermediate' | 'advanced';
  notes?: string;
  tags?: string[];
}

export default function InlineVocabularyCreator({
  onClose,
  onSuccess,
  initialData,
  mode = 'create'
}: InlineVocabularyCreatorProps) {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [uploadService] = useState(() => new VocabularyUploadService(supabase));

  // Form state
  const [title, setTitle] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [language, setLanguage] = useState(initialData?.language || 'french');
  const [isPublic, setIsPublic] = useState(initialData?.is_public || false);
  const [vocabularyPairs, setVocabularyPairs] = useState<VocabularyPair[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [{ id: '1', learningWord: '', supportWord: '' }]
  );
  const [uploading, setUploading] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [generatingAudio, setGeneratingAudio] = useState<Set<string>>(new Set());
  const [audioCache, setAudioCache] = useState<Map<string, string>>(new Map());
  const [debounceTimers, setDebounceTimers] = useState<Map<string, NodeJS.Timeout>>(new Map());

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      debounceTimers.forEach(timer => clearTimeout(timer));
    };
  }, [debounceTimers]);

  const addVocabularyPair = () => {
    const newPair: VocabularyPair = {
      id: Date.now().toString(),
      learningWord: '',
      supportWord: ''
    };
    setVocabularyPairs([...vocabularyPairs, newPair]);
  };

  const checkExistingAudio = async (text: string, language: string): Promise<string | null> => {
    const audioKey = `${text.toLowerCase()}_${language}`;

    // Check local cache first
    if (audioCache.has(audioKey)) {
      return audioCache.get(audioKey)!;
    }

    try {
      // Map language codes for the API
      const languageMap: Record<string, string> = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
      };

      const pollyLanguage = languageMap[language] || 'es';

      // Check if audio file exists in storage
      const fileName = `${pollyLanguage}_${text.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;

      const { data: files } = await supabase.storage
        .from('audio')
        .list('audio/vocabulary', {
          search: fileName
        });

      if (files && files.length > 0) {
        const { data: publicUrlData } = supabase.storage
          .from('audio')
          .getPublicUrl(`audio/vocabulary/${files[0].name}`);

        const audioUrl = publicUrlData?.publicUrl;

        if (audioUrl) {
          setAudioCache(prev => new Map(prev).set(audioKey, audioUrl));
          console.log(`Found existing audio for "${text}":`, audioUrl);
          return audioUrl;
        }
      }

      return null;
    } catch (error) {
      console.log('Error checking existing audio:', error);
      return null;
    }
  };

  const generateAudioForWord = async (text: string, language: string, pairId?: string) => {
    const audioKey = `${text.toLowerCase()}_${language}`;

    try {
      // Add to generating set
      if (pairId) {
        setGeneratingAudio(prev => new Set(prev).add(pairId));
      }

      // First check if audio already exists
      const existingAudio = await checkExistingAudio(text, language);
      if (existingAudio) {
        console.log(`Using existing audio for "${text}"`);
        return existingAudio;
      }

      // Map language codes for the API
      const languageMap: Record<string, string> = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
      };

      const pollyLanguage = languageMap[language] || 'es';

      const response = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          word: text,
          language: pollyLanguage,
          category: 'vocabulary',
          engine: 'standard'
        }),
      });

      if (!response.ok) {
        throw new Error(`Audio generation failed: ${response.statusText}`);
      }

      const result = await response.json();

      // Cache the new audio
      setAudioCache(prev => new Map(prev).set(audioKey, result.audioUrl));

      console.log(`Audio generated for "${text}":`, result.audioUrl);
      return result.audioUrl;
    } catch (error) {
      console.log('Audio generation failed:', error);
      return null;
    } finally {
      // Remove from generating set
      if (pairId) {
        setGeneratingAudio(prev => {
          const newSet = new Set(prev);
          newSet.delete(pairId);
          return newSet;
        });
      }
    }
  };

  const debouncedAudioGeneration = (text: string, language: string, pairId: string) => {
    // Clear existing timer for this pair
    const existingTimer = debounceTimers.get(pairId);
    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    // Set new timer
    const timer = setTimeout(() => {
      if (text.trim().length > 2) {
        generateAudioForWord(text.trim(), language, pairId);
      }
      // Clean up timer
      setDebounceTimers(prev => {
        const newMap = new Map(prev);
        newMap.delete(pairId);
        return newMap;
      });
    }, 1500); // Wait 1.5 seconds after user stops typing

    setDebounceTimers(prev => new Map(prev).set(pairId, timer));
  };

  const updateVocabularyPair = async (id: string, field: 'learningWord' | 'supportWord', value: string) => {
    setVocabularyPairs(pairs =>
      pairs.map(pair =>
        pair.id === id ? { ...pair, [field]: value } : pair
      )
    );

    // For learning words, use debounced generation
    if (field === 'learningWord' && value.trim().length > 2) {
      debouncedAudioGeneration(value.trim(), language, id);
    }
  };

  const handleFieldFocus = (id: string, field: 'learningWord' | 'supportWord') => {
    // When user focuses on English field, generate audio for the learning word if it exists
    if (field === 'supportWord') {
      const pair = vocabularyPairs.find(p => p.id === id);
      if (pair && pair.learningWord.trim().length > 2) {
        // Clear any pending debounced generation
        const existingTimer = debounceTimers.get(id);
        if (existingTimer) {
          clearTimeout(existingTimer);
          setDebounceTimers(prev => {
            const newMap = new Map(prev);
            newMap.delete(id);
            return newMap;
          });
        }
        // Generate immediately
        generateAudioForWord(pair.learningWord.trim(), language, id);
      }
    }
  };

  const playAudio = (audioUrl: string) => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });
  };

  const removeVocabularyPair = (id: string) => {
    if (vocabularyPairs.length > 1) {
      setVocabularyPairs(pairs => pairs.filter(pair => pair.id !== id));
    }
  };

  const parseBulkText = () => {
    if (!bulkText.trim()) return;

    const lines = bulkText.trim().split('\n');
    const newPairs: VocabularyPair[] = [];

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return;

      // Try tab first, then comma
      let parts = trimmedLine.split('\t');
      if (parts.length === 1) {
        parts = trimmedLine.split(',');
      }

      if (parts.length >= 2) {
        newPairs.push({
          id: `bulk_${Date.now()}_${index}`,
          learningWord: parts[0].trim(),
          supportWord: parts[1].trim()
        });
      }
    });

    if (newPairs.length > 0) {
      setVocabularyPairs(newPairs);
      setBulkText('');
      setShowBulkUpload(false);

      // Generate audio for all learning words in background (with smart caching)
      newPairs.forEach(pair => {
        if (pair.learningWord.trim().length > 2) {
          // For bulk upload, generate immediately without debouncing
          generateAudioForWord(pair.learningWord.trim(), language, pair.id);
        }
      });
    }
  };

  const handleSubmit = async () => {
    if (!user) return;

    // Validate form
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }

    const validPairs = vocabularyPairs.filter(pair => 
      pair.learningWord.trim() && pair.supportWord.trim()
    );

    if (validPairs.length < 1) {
      alert('Please create at least one vocabulary pair before saving');
      return;
    }

    setUploading(true);

    try {
      if (mode === 'edit' && initialData?.id) {
        const enhancedService = new EnhancedVocabularyService(supabase);

        const updateData = {
          name: title,
          description: description || '',
          language: language as 'spanish' | 'french' | 'german',
          is_public: isPublic,
          word_count: validPairs.length
        };

        const updateItems = validPairs.map(pair => ({
          type: 'word' as const,
          term: pair.learningWord.trim(),
          translation: pair.supportWord.trim(),
          part_of_speech: pair.partOfSpeech || 'noun',
          context_sentence: pair.contextSentence,
          context_translation: pair.contextTranslation,
          difficulty_level: pair.difficultyLevel || 'intermediate',
          notes: pair.notes,
          tags: pair.tags || []
        }));

        await enhancedService.updateVocabularyList(initialData.id, updateData, updateItems);
      } else {
        // Create new vocabulary list
        const uploadData: UploadedVocabularyList = {
          name: title,
          description: description || '',
          language: language as 'spanish' | 'french' | 'german',
          difficulty_level: 'intermediate',
          content_type: 'words',
          is_public: isPublic,
          items: validPairs.map(pair => ({
            type: 'word' as const,
            term: pair.learningWord.trim(),
            translation: pair.supportWord.trim(),
            difficulty_level: 'intermediate' as const
          }))
        };

        // Upload vocabulary list (audio already generated in real-time)
        await uploadService.uploadVocabularyList(uploadData, user.id, false);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving vocabulary:', error);
      alert('Failed to save vocabulary list. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const validPairCount = vocabularyPairs.filter(pair => 
    pair.learningWord.trim() && pair.supportWord.trim()
  ).length;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200 p-8 mb-8 shadow-lg">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Build Your Vocabulary Collection</h3>
          <p className="text-gray-600">Add word pairs to create an interactive learning experience</p>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white rounded-lg transition-all"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      <div className="space-y-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Collection Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Collection Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                placeholder="e.g., Spanish Food & Cooking"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Target Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'spanish' | 'french' | 'german')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
              >
                <option value="french">🇫🇷 French</option>
                <option value="spanish">🇪🇸 Spanish</option>
                <option value="german">🇩🇪 German</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Description (Optional)
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                placeholder="Brief description of this vocabulary collection"
              />
            </div>

            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <div>
                  <span className="text-sm font-semibold text-gray-700">Make this collection public</span>
                  <p className="text-xs text-gray-500">Allow other teachers to discover and use this vocabulary collection</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900">Vocabulary Pairs</h4>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowBulkUpload(!showBulkUpload)}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                {showBulkUpload ? 'Individual Entry' : 'Bulk Upload'}
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">Progress:</span>
                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                  {validPairCount} {validPairCount === 1 ? 'pair' : 'pairs'}
                </div>
              </div>
            </div>
          </div>

          {showBulkUpload ? (
            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h5 className="font-medium text-blue-900 mb-2">Bulk Upload Instructions</h5>
                <p className="text-sm text-blue-700 mb-2">
                  Paste your vocabulary pairs below. Each line should contain one pair.
                </p>
                <p className="text-sm text-blue-600">
                  Format: <code className="bg-blue-100 px-1 rounded">spanish_word	english_translation</code> (tab-separated) or <code className="bg-blue-100 px-1 rounded">spanish_word, english_translation</code> (comma-separated)
                </p>
              </div>
              
              <textarea
                value={bulkText}
                onChange={(e) => setBulkText(e.target.value)}
                placeholder={`Example:\nhola	hello\nadios	goodbye\ngracias	thank you`}
                className="w-full h-40 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white resize-none"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={parseBulkText}
                  disabled={!bulkText.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Parse & Add Pairs
                </button>
                <button
                  onClick={() => setBulkText('')}
                  className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {vocabularyPairs.map((pair, index) => (
                <div key={pair.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">Pair #{index + 1}</span>
                    {vocabularyPairs.length > 1 && (
                      <button 
                        onClick={() => removeVocabularyPair(pair.id)}
                        className="text-gray-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove this pair"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        {language === 'french' ? '🇫🇷 French' : language === 'spanish' ? '🇪🇸 Spanish' : '🇩🇪 German'} Word
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={pair.learningWord}
                          onChange={(e) => updateVocabularyPair(pair.id, 'learningWord', e.target.value)}
                          onFocus={() => handleFieldFocus(pair.id, 'learningWord')}
                          placeholder={`Enter ${language} word`}
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        />
                        <button
                          onClick={() => {
                            const audioKey = `${pair.learningWord.toLowerCase()}_${language}`;
                            const existingAudio = audioCache.get(audioKey);

                            if (existingAudio) {
                              // Play existing audio
                              playAudio(existingAudio);
                            } else if (pair.learningWord.trim()) {
                              // Generate new audio
                              generateAudioForWord(pair.learningWord.trim(), language, pair.id);
                            }
                          }}
                          className={`px-3 py-3 text-white border rounded-r-xl transition-colors ${
                            generatingAudio.has(pair.id)
                              ? 'bg-yellow-500 border-yellow-500'
                              : 'bg-green-500 border-green-500 hover:bg-green-600'
                          }`}
                          disabled={generatingAudio.has(pair.id) || !pair.learningWord.trim()}
                          title={(() => {
                            if (generatingAudio.has(pair.id)) return 'Generating audio...';
                            if (!pair.learningWord.trim()) return 'Enter a word first';

                            const audioKey = `${pair.learningWord.toLowerCase()}_${language}`;
                            const existingAudio = audioCache.get(audioKey);
                            return existingAudio ? 'Play audio' : 'Generate audio';
                          })()}
                        >
                          {generatingAudio.has(pair.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (() => {
                            const audioKey = `${pair.learningWord.toLowerCase()}_${language}`;
                            const existingAudio = audioCache.get(audioKey);
                            return existingAudio ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            );
                          })()}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                        🇬🇧 English Translation
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={pair.supportWord}
                          onChange={(e) => updateVocabularyPair(pair.id, 'supportWord', e.target.value)}
                          onFocus={() => handleFieldFocus(pair.id, 'supportWord')}
                          placeholder="Enter English translation"
                          className="flex-1 px-4 py-3 border border-gray-200 rounded-l-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center gap-4 pt-4">
                <button
                  onClick={addVocabularyPair}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-indigo-300 text-indigo-600 hover:text-indigo-700 hover:border-indigo-400 rounded-xl font-medium transition-all hover:bg-indigo-50"
                >
                  <span className="text-lg">+</span>
                  Add Another Pair
                </button>
                <button
                  onClick={() => setShowBulkUpload(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-medium transition-all"
                >
                  <span className="text-lg">📋</span>
                  Bulk Upload
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">Ready to Create?</h4>
              <p className="text-sm text-gray-600">Your vocabulary collection will be saved and ready to use</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={uploading || !title.trim() || validPairCount < 1}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-lg hover:shadow-xl"
            >
              {uploading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Creating Collection...
                </div>
              ) : (
                'Save Collection'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
