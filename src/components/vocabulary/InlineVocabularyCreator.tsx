'use client';

import React, { useState, useEffect } from 'react';
import { X, Volume2, Play, Trash2, Loader2 } from 'lucide-react';
import { VocabularyUploadService, UploadedVocabularyList } from '../../services/vocabularyUploadService';
import { EnhancedVocabularyService } from '../../services/enhancedVocabularyService';
import { useAuth } from '../auth/AuthProvider';
import { useSupabase } from '../supabase/SupabaseProvider';

interface InlineVocabularyCreatorProps {
  onClose: () => void;
  onSuccess: (listId?: string) => void;
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

  // Theme and Unit constants for organization
  const THEMES = [
    { value: '', label: 'Select a theme (optional)' },
    { value: 'My personal world', label: '👤 My personal world' },
    { value: 'People and lifestyle', label: '🏠 People and lifestyle' },
    { value: 'Popular culture', label: '🎭 Popular culture' },
    { value: 'Communication and the world around us', label: '🌍 Communication and the world around us' },
    { value: 'Studying and my future', label: '📚 Studying and my future' },
    { value: 'Travel and tourism', label: '✈️ Travel and tourism' },
    { value: 'Media and technology', label: '📱 Media and technology' },
    { value: 'Cultural', label: '🎨 Cultural items' },
    { value: 'General', label: '📝 General vocabulary' },
  ];

  const UNITS_BY_THEME: Record<string, { value: string; label: string }[]> = {
    'My personal world': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Family and friends', label: 'Family and friends' },
      { value: 'Describing people', label: 'Describing people' },
      { value: 'House and home', label: 'House and home' },
      { value: 'Daily routine', label: 'Daily routine' },
    ],
    'People and lifestyle': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Healthy living', label: 'Healthy living' },
      { value: 'Food and drink', label: 'Food and drink' },
      { value: 'Sports and hobbies', label: 'Sports and hobbies' },
      { value: 'Relationships', label: 'Relationships' },
    ],
    'Popular culture': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Free time activities', label: 'Free time activities' },
      { value: 'Music and entertainment', label: 'Music and entertainment' },
      { value: 'Celebrity culture', label: 'Celebrity culture' },
      { value: 'Customs, festivals and celebrations', label: 'Customs, festivals and celebrations' },
    ],
    'Communication and the world around us': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Environment and where people live', label: 'Environment and where people live' },
      { value: 'Media and technology', label: 'Media and technology' },
      { value: 'Travel and tourism', label: 'Travel and tourism' },
    ],
    'Studying and my future': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'School', label: 'School' },
      { value: 'Future opportunities', label: 'Future opportunities' },
      { value: 'Jobs and careers', label: 'Jobs and careers' },
    ],
    'Travel and tourism': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Accommodation', label: 'Accommodation' },
      { value: 'Tourist attractions', label: 'Tourist attractions' },
      { value: 'Directions and transport', label: 'Directions and transport' },
    ],
    'Media and technology': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Social media', label: 'Social media' },
      { value: 'Online communication', label: 'Online communication' },
      { value: 'Digital devices', label: 'Digital devices' },
    ],
    'Cultural': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Cultural items', label: 'Cultural items' },
      { value: 'Traditions', label: 'Traditions' },
    ],
    'General': [
      { value: '', label: 'Select a unit (optional)' },
      { value: 'Numbers and time', label: 'Numbers and time' },
      { value: 'Colors and shapes', label: 'Colors and shapes' },
      { value: 'Common phrases', label: 'Common phrases' },
    ],
  };

  const CURRICULUM_LEVELS = [
    { value: 'KS2', label: '🌱 KS2 (Primary)' },
    { value: 'KS3', label: '📖 KS3 (Years 7-9)' },
    { value: 'KS4', label: '📚 KS4/GCSE (Years 10-11)' },
  ];

  // Form state
  const [title, setTitle] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [language, setLanguage] = useState(initialData?.language || 'french');
  const [theme, setTheme] = useState(initialData?.theme || '');
  const [unit, setUnit] = useState(initialData?.topic || '');
  const [curriculumLevel, setCurriculumLevel] = useState<'KS2' | 'KS3' | 'KS4'>('KS3');
  const [contentType, setContentType] = useState<'words' | 'sentences' | 'mixed'>(initialData?.content_type || 'words');
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
  const [centralizedMatches, setCentralizedMatches] = useState<Map<string, { id: string; audio_url: string | null }>>(new Map());

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

  // Check if word exists in centralized_vocabulary and get its audio
  const checkCentralizedVocabulary = async (text: string, lang: string): Promise<{ id: string; audio_url: string | null } | null> => {
    const matchKey = `${text.toLowerCase()}_${lang}`;

    // Check local cache first
    if (centralizedMatches.has(matchKey)) {
      return centralizedMatches.get(matchKey)!;
    }

    try {
      const languageMap: Record<string, string> = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
      };
      const dbLanguage = languageMap[lang] || 'es';

      const { data, error } = await supabase
        .from('centralized_vocabulary')
        .select('id, audio_url')
        .eq('language', dbLanguage)
        .ilike('word', text.trim())
        .limit(1)
        .single();

      if (!error && data) {
        console.log(`✅ Found centralized match for "${text}":`, data.id);
        setCentralizedMatches(prev => new Map(prev).set(matchKey, { id: data.id, audio_url: data.audio_url }));
        return { id: data.id, audio_url: data.audio_url };
      }

      return null;
    } catch (error) {
      console.log('No centralized match for:', text);
      return null;
    }
  };

  const checkExistingAudio = async (text: string, language: string): Promise<string | null> => {
    const audioKey = `${text.toLowerCase()}_${language}`;

    // Check local cache first
    if (audioCache.has(audioKey)) {
      return audioCache.get(audioKey)!;
    }

    try {
      // First, check if the word exists in centralized_vocabulary
      const centralizedMatch = await checkCentralizedVocabulary(text, language);
      if (centralizedMatch?.audio_url) {
        setAudioCache(prev => new Map(prev).set(audioKey, centralizedMatch.audio_url!));
        console.log(`🎵 Using centralized audio for "${text}":`, centralizedMatch.audio_url);
        return centralizedMatch.audio_url;
      }

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
      // Get centralized matches for all words (for analytics linking)
      const languageMap: Record<string, string> = {
        'spanish': 'es',
        'french': 'fr',
        'german': 'de',
      };
      const dbLanguage = languageMap[language] || 'es';

      // Batch check for centralized matches
      const wordsToCheck = validPairs.map(p => p.learningWord.trim().toLowerCase());
      const { data: centralizedData } = await supabase
        .from('centralized_vocabulary')
        .select('id, word, audio_url')
        .eq('language', dbLanguage)
        .in('word', wordsToCheck);

      const centralizedMap = new Map(
        centralizedData?.map(item => [item.word.toLowerCase(), { id: item.id, audio_url: item.audio_url }]) || []
      );

      if (mode === 'edit' && initialData?.id) {
        const enhancedService = new EnhancedVocabularyService(supabase);

        const updateData = {
          name: title,
          description: description || '',
          language: language as 'spanish' | 'french' | 'german',
          theme: theme || undefined,
          topic: unit || undefined,
          is_public: isPublic,
          word_count: validPairs.length
        };

        const updateItems = validPairs.map(pair => {
          const matchKey = pair.learningWord.trim().toLowerCase();
          const match = centralizedMap.get(matchKey) || centralizedMatches.get(`${matchKey}_${language}`);
          const audioKey = `${matchKey}_${language}`;

          return {
            type: 'word' as const,
            term: pair.learningWord.trim(),
            translation: pair.supportWord.trim(),
            part_of_speech: pair.partOfSpeech || 'noun',
            context_sentence: pair.contextSentence,
            context_translation: pair.contextTranslation,
            audio_url: match?.audio_url || audioCache.get(audioKey) || undefined,
            difficulty_level: pair.difficultyLevel || 'intermediate',
            notes: pair.notes,
            tags: pair.tags || [],
            centralized_match_id: match?.id || undefined,
            analytics_enabled: true,
          };
        });

        await enhancedService.updateVocabularyList(initialData.id, updateData, updateItems);
        onSuccess(initialData.id);
      } else {
        // Create new vocabulary list with theme and topic
        const uploadData: UploadedVocabularyList = {
          name: title,
          description: description || '',
          language: language as 'spanish' | 'french' | 'german',
          theme: theme || undefined,
          topic: unit || undefined,
          difficulty_level: 'intermediate',
          content_type: contentType,
          is_public: isPublic,
          items: validPairs.map(pair => {
            const matchKey = pair.learningWord.trim().toLowerCase();
            const match = centralizedMap.get(matchKey) || centralizedMatches.get(`${matchKey}_${language}`);
            const audioKey = `${matchKey}_${language}`;
            
            // Determine item type based on content type selection
            const itemType = contentType === 'sentences' ? 'sentence' : 'word';

            return {
              type: itemType as 'word' | 'sentence',
              term: pair.learningWord.trim(),
              translation: pair.supportWord.trim(),
              audio_url: match?.audio_url || audioCache.get(audioKey) || undefined,
              difficulty_level: 'intermediate' as const,
            };
          })
        };

        // Upload vocabulary list (audio already generated in real-time)
        const newListId = await uploadService.uploadVocabularyList(uploadData, user.id, false);
        onSuccess(newListId);
      }

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

            {/* Curriculum Level Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Curriculum Level
              </label>
              <select
                value={curriculumLevel}
                onChange={(e) => setCurriculumLevel(e.target.value as 'KS2' | 'KS3' | 'KS4')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
              >
                {CURRICULUM_LEVELS.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Content Type Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Content Type
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as 'words' | 'sentences' | 'mixed')}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
              >
                <option value="words">📝 Words Only</option>
                <option value="sentences">💬 Sentences Only</option>
                <option value="mixed">🔄 Mixed (Words & Sentences)</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                {contentType === 'sentences' 
                  ? 'Perfect for sentence translation games and practice' 
                  : contentType === 'mixed'
                    ? 'Combine vocabulary words and full sentences'
                    : 'Standard vocabulary word pairs'}
              </p>
            </div>

            {/* Theme Selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Theme / Category <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                list="theme-options"
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value);
                  // We don't auto-clear unit anymore to allow flexible editing
                }}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
                placeholder="Select or type a theme..."
              />
              <datalist id="theme-options">
                {THEMES.filter(t => t.value).map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </datalist>
              <p className="text-xs text-gray-500 mt-1">Create your own theme or select from the list</p>
            </div>

            {/* Unit Selector (dependent on Theme) */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Unit / Topic <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                list="unit-options"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                disabled={!theme}
                className={`w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${theme ? 'bg-gray-50 focus:bg-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                placeholder={theme ? "Select or type a unit..." : "Select a theme first"}
              />
              <datalist id="unit-options">
                {theme && UNITS_BY_THEME[theme] && UNITS_BY_THEME[theme].filter(u => u.value).map(u => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </datalist>
              <p className="text-xs text-gray-500 mt-1">Create your own unit or select from the list</p>
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column: Input */}
              <div className="space-y-4">
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <h5 className="font-semibold text-indigo-900 mb-2 flex items-center gap-2">
                    <span className="text-xl">📋</span> Paste Vocabulary
                  </h5>
                  <p className="text-sm text-indigo-700 mb-3">
                    Copy from <strong>Excel</strong>, <strong>Google Sheets</strong>, <strong>Word</strong>, or <strong>Quizlet</strong> and paste below.
                    <br />
                    <span className="text-xs opacity-75 mt-1 block">
                      We'll automatically detect lines with words and translations.
                    </span>
                  </p>
                </div>

                <div className="relative">
                  <textarea
                    value={bulkText}
                    onChange={(e) => {
                      setBulkText(e.target.value);
                      // Auto-parse on change for preview
                      // Simple inline parsing logic for preview only
                      // real parsing happens on "Add Pairs"
                    }}
                    placeholder={contentType === 'sentences' 
                      ? `e.g.\n¿Cómo te llamas?\tWhat is your name?\nMe gusta mucho.\tI like it a lot.\n\nOr paste from Excel!`
                      : `e.g.\nhola\thello\nadios\tgoodbye\n\nOr paste straightforward from Excel!`}
                    className="w-full h-80 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white font-mono text-sm resize-none shadow-sm"
                  />
                  {bulkText && (
                    <button
                      onClick={() => setBulkText('')}
                      className="absolute top-3 right-3 text-xs bg-gray-100 hover:bg-gray-200 text-gray-500 px-2 py-1 rounded transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: Preview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between h-[88px]"> {/* Align with top box */}
                  <div>
                    <h5 className="font-semibold text-gray-900">Preview</h5>
                    <p className="text-sm text-gray-500">
                      {bulkText.trim() ? (
                        <>Found <span className="font-bold text-indigo-600">{
                          (() => {
                            const lines = bulkText.trim().split('\n');
                            return lines.filter(l => (l.includes('\t') || l.includes(',')) && l.split(/[\t,]/).length >= 2).length;
                          })()
                        }</span> valid {contentType === 'sentences' ? 'sentences' : 'pairs'}</>
                      ) : (
                        "Preview your pairs here before adding"
                      )}
                    </p>
                  </div>
                  {bulkText.trim() && (
                    <button
                      onClick={() => {
                        // Swap logic
                        const lines = bulkText.split('\n');
                        const swapped = lines.map(line => {
                          if (line.includes('\t')) {
                            const [a, b, ...rest] = line.split('\t');
                            return b && a ? `${b.trim()}\t${a.trim()}${rest.length ? '\t' + rest.join('\t') : ''}` : line;
                          }
                          if (line.includes(',')) {
                            const [a, b, ...rest] = line.split(',');
                            return b && a ? `${b.trim()}, ${a.trim()}${rest.length ? ',' + rest.join(',') : ''}` : line;
                          }
                          return line;
                        });
                        setBulkText(swapped.join('\n'));
                      }}
                      className="text-sm flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-medium px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      Swap Columns
                    </button>
                  )}
                </div>

                <div className="border border-gray-200 rounded-xl overflow-hidden bg-white h-80 flex flex-col shadow-sm">
                  {/* Table Header */}
                  <div className="grid grid-cols-2 bg-gray-50 border-b border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    <div>{contentType === 'sentences' ? 'Sentence' : 'Term'} ({language === 'french' ? 'Fr' : language === 'spanish' ? 'Es' : language === 'german' ? 'De' : 'Target'})</div>
                    <div>Translation (En)</div>
                  </div>

                  {/* Table Content */}
                  <div className="overflow-y-auto flex-1 p-0">
                    {!bulkText.trim() ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-400 p-8 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-2">
                          <span className="text-2xl opacity-50">👀</span>
                        </div>
                        <p>Pairs will appear here...</p>
                      </div>
                    ) : (
                      <div className="divide-y divide-gray-100">
                        {bulkText.trim().split('\n').map((line, idx) => {
                          const parts = line.includes('\t') ? line.split('\t') : line.includes(',') ? line.split(',') : [line];
                          const isValid = parts.length >= 2 && parts[0].trim() && parts[1].trim();

                          if (!line.trim()) return null;

                          return (
                            <div key={idx} className={`grid grid-cols-2 px-4 py-2 text-sm ${!isValid ? 'bg-red-50 text-red-600 opacity-60' : 'hover:bg-gray-50'}`}>
                              <div className="truncate pr-2 font-medium">{parts[0]?.trim() || '-'}</div>
                              <div className="truncate pl-2 text-gray-600">{parts[1]?.trim() || (isValid ? '' : '(No translation)')}</div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={parseBulkText}
                  disabled={!bulkText.trim()}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold shadow-md active:scale-[0.98]"
                >
                  Import {
                    (() => {
                      const count = bulkText.trim().split('\n').filter(l => (l.includes('\t') || l.includes(',')) && l.split(/[\t,]/).length >= 2).length;
                      const label = contentType === 'sentences' ? 'Sentences' : 'Pairs';
                      return count > 0 ? `${count} ${label}` : label;
                    })()
                  }
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {vocabularyPairs.map((pair, index) => (
                <div key={pair.id} className="bg-gray-50 rounded-xl p-4 border border-gray-200 hover:border-indigo-300 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-600">{contentType === 'sentences' ? 'Sentence' : 'Pair'} #{index + 1}</span>
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
                        {language === 'french' ? '🇫🇷 French' : language === 'spanish' ? '🇪🇸 Spanish' : '🇩🇪 German'} {contentType === 'sentences' ? 'Sentence' : 'Word'}
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={pair.learningWord}
                          onChange={(e) => updateVocabularyPair(pair.id, 'learningWord', e.target.value)}
                          onFocus={() => handleFieldFocus(pair.id, 'learningWord')}
                          placeholder={contentType === 'sentences' ? `Enter ${language} sentence` : `Enter ${language} word`}
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
                          className={`px-3 py-3 text-white border rounded-r-xl transition-colors ${generatingAudio.has(pair.id)
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
