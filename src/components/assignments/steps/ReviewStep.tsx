'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, Clock, Users, Gamepad2, FileCheck, Settings, Edit, BookOpen, Globe, Hash, Layers, Target } from 'lucide-react';
import { StepProps } from '../types/AssignmentTypes';
import { supabaseBrowser } from '../../auth/AuthProvider';

// Import game definitions to map IDs to objects
const AVAILABLE_GAMES = [
  { id: 'vocabulary-mining', name: 'Vocabulary Mining', estimatedTime: '10-20 min', features: ['Gem collection', 'Spaced repetition', 'Voice recognition'] },
  { id: 'memory-game', name: 'Memory Match', estimatedTime: '5-10 min', features: ['Memory training', 'Visual learning'] },
  { id: 'hangman', name: 'Hangman', estimatedTime: '3-7 min', features: ['Classic gameplay', 'Letter guessing'] },
  { id: 'word-blast', name: 'Word Blast', estimatedTime: '5-12 min', features: ['Action gameplay', 'Visual effects'] },
  { id: 'noughts-and-crosses', name: 'Tic-Tac-Toe Vocabulary', estimatedTime: '3-8 min', features: ['Strategic gameplay', 'Quick questions'] },
  { id: 'word-scramble', name: 'Word Scramble', estimatedTime: '4-8 min', features: ['Letter manipulation', 'Spelling practice'] },
  { id: 'vocab-blast', name: 'Vocab Blast', estimatedTime: '5-12 min', features: ['Themed adventures', 'Fast-paced action'] },
  { id: 'vocab-master', name: 'VocabMaster', estimatedTime: '10-20 min', features: ['Multiple modes', 'Adaptive difficulty', 'Comprehensive learning'] },
  { id: 'word-towers', name: 'Word Towers', estimatedTime: '6-12 min', features: ['Tower building', 'Translation practice', 'Strategic thinking'] },
  { id: 'case-file-translator', name: 'Case File Translator', estimatedTime: '8-15 min', features: ['Translation practice', 'Mystery theme', 'Case solving'] },
  { id: 'lava-temple-word-restore', name: 'Lava Temple: Word Restore', estimatedTime: '8-15 min', features: ['Fill-in-the-blank', 'Temple theme', 'Word restoration'] },
  { id: 'speed-builder', name: 'Speed Builder', estimatedTime: '5-10 min', features: ['Drag & drop', 'Grammar focus'] },
  { id: 'sentence-towers', name: 'Sentence Towers', estimatedTime: '6-12 min', features: ['Tower building', 'Complex grammar'] },
  { id: 'conjugation-duel', name: 'Conjugation Duel', estimatedTime: '10-20 min', features: ['Battle system', 'League progression'] },
  { id: 'sentence-builder', name: 'Sentence Builder', estimatedTime: '5-10 min', features: ['Fragment assembly', 'Grammar rules'] },
  { id: 'detective-listening', name: 'Detective Listening', estimatedTime: '8-15 min', features: ['Audio comprehension', 'Detective theme'] }
];

const humanizeGameId = (id: string) =>
  id.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const getGameById = (id: string) => AVAILABLE_GAMES.find(game => game.id === id) || { id, name: humanizeGameId(id), estimatedTime: 'N/A', features: [] };

export default function ReviewStep({
  assignmentDetails,
  gameConfig,
  assessmentConfig,
  onStepComplete,
  classes,
}: StepProps) {
  console.log('🎯 [ReviewStep] Component rendered with gameConfig:', {
    hasVocabConfig: !!gameConfig.vocabularyConfig,
    source: gameConfig.vocabularyConfig?.source,
    subcategories: gameConfig.vocabularyConfig?.subcategories,
    language: gameConfig.vocabularyConfig?.language
  });

  const [previewWords, setPreviewWords] = useState<{ term: string; translation: string; subcategory?: string; category?: string }[]>([]);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});

  const [contentDetails, setContentDetails] = useState<{
    vocabularyListName: string;
    wordCount: number;
    language: string;
    categories: string[];
    subcategories: string[];
    themes: string[];
    estimatedSessions: number;
  } | null>(null);

  const [loadingContent, setLoadingContent] = useState(true);

  // This step is always completed when reached
  useEffect(() => {
    onStepComplete('review', true);
  }, [onStepComplete]);

  // Fetch vocabulary/content details for display
  useEffect(() => {
    console.log('🔍 [ReviewStep] useEffect triggered with vocabularyConfig:', gameConfig.vocabularyConfig);

    const fetchContentDetails = async () => {
      setLoadingContent(true);
      try {
        const vocabConfig = gameConfig.vocabularyConfig;
        const details: any = {
          vocabularyListName: 'Not configured',
          wordCount: vocabConfig.wordCount || 0,
          language: vocabConfig.language || 'Not specified',
          categories: [],
          subcategories: [],
          themes: [],
          estimatedSessions: 0,
        };

        // Determine vocabulary list name based on source
        if (vocabConfig.source === 'category') {
          const categoryNames = vocabConfig.categories || (vocabConfig.category ? [vocabConfig.category] : []);
          const subcategoryNames = vocabConfig.subcategories || (vocabConfig.subcategory ? [vocabConfig.subcategory] : []);

          details.categories = categoryNames;
          details.subcategories = subcategoryNames;

          if (categoryNames.length > 0) {
            details.vocabularyListName = categoryNames.join(', ');
            if (subcategoryNames.length > 0) {
              details.vocabularyListName += ` → ${subcategoryNames.join(', ')}`;
            }
          }
        } else if (vocabConfig.source === 'theme' || vocabConfig.source === 'topic') {
          const themeNames = vocabConfig.themes || (vocabConfig.theme ? [vocabConfig.theme] : []);
          const topicName = vocabConfig.topic;

          details.themes = themeNames;

          if (themeNames.length > 0) {
            details.vocabularyListName = `KS4: ${themeNames.join(', ')}`;
            if (topicName) {
              details.vocabularyListName += ` → ${topicName}`;
            }
          }
        } else if (vocabConfig.source === 'custom' && vocabConfig.customListId) {
          // Fetch custom list details
          try {
            const { data: customList } = await supabaseBrowser
              .from('custom_vocabulary_lists')
              .select('name, language')
              .eq('id', vocabConfig.customListId)
              .single();

            if (customList) {
              details.vocabularyListName = `Custom: ${customList.name}`;
              details.language = customList.language || details.language;
            }
          } catch (error) {
            console.error('Error fetching custom list:', error);
          }
        } else if (vocabConfig.source === 'create') {

          details.vocabularyListName = 'Custom Vocabulary (Manual Entry)';
        }

        // Get word count from selected vocabulary IDs if available
        if (vocabConfig.selectedVocabularyIds && vocabConfig.selectedVocabularyIds.length > 0) {
          details.wordCount = vocabConfig.selectedVocabularyIds.length;
        }

        // Fallbacks: if subcategories/categories are present regardless of source, reflect them
        if (Array.isArray(vocabConfig.subcategories) && vocabConfig.subcategories.length > 0) {
          details.subcategories = vocabConfig.subcategories;
          if (details.vocabularyListName === 'Not configured') {
            details.vocabularyListName = `Topics: ${vocabConfig.subcategories.join(', ')}`;
          }
        }
        if (Array.isArray(vocabConfig.categories) && vocabConfig.categories.length > 0) {
          details.categories = vocabConfig.categories;
          if (details.vocabularyListName === 'Not configured') {
            details.vocabularyListName = vocabConfig.categories.join(', ');
          }
        }

        // Format language for display (support codes like 'es')
        if (details.language) {
          const languageMap: Record<string, string> = {
            es: 'Spanish', fr: 'French', de: 'German', it: 'Italian', pt: 'Portuguese',
            zh: 'Chinese', ja: 'Japanese', ar: 'Arabic', ru: 'Russian', en: 'English',
            spanish: 'Spanish', french: 'French', german: 'German'
          };
          const key = String(details.language).toLowerCase();
          details.language = languageMap[key] || details.language;
        }

        // Fetch a preview list of words for this config (up to 75)
        try {
          setPreviewLoading(true);
          const vc = vocabConfig;
          let rows: any[] = [];

          // Determine language code for filtering
          const langCode = (vc.language || 'es').toLowerCase();
          const languageCode = langCode === 'es' || langCode === 'spanish' ? 'es'
            : langCode === 'fr' || langCode === 'french' ? 'fr'
            : langCode === 'de' || langCode === 'german' ? 'de'
            : 'es';

          console.log('🔍 [ReviewStep] Fetching vocabulary preview:', {
            source: vc.source,
            subcategories: vc.subcategories,
            categories: vc.categories,
            language: langCode,
            languageCode
          });

          if (vc.source === 'custom' && vc.customListId) {
            const { data } = await supabaseBrowser
              .from('enhanced_vocabulary_lists')
              .select('enhanced_vocabulary_items ( term, translation )')
              .eq('id', vc.customListId)
              .single();
            rows = (data?.enhanced_vocabulary_items || []).map((r: any) => ({ term: r.term, translation: r.translation }));
          } else if (vc.subcategories && vc.subcategories.length > 0) {
            const { data, error } = await supabaseBrowser
              .from('centralized_vocabulary')
              .select(`word, translation, subcategory, category`)
              .in('subcategory', vc.subcategories)
              .eq('language', languageCode)
              .limit(75);

            console.log('📚 [ReviewStep] Subcategories query result:', { data, error, count: data?.length });
            rows = (data || []).map((r: any) => ({ term: r.word, translation: r.translation, subcategory: r.subcategory, category: r.category }));

            // Calculate per-topic counts (filtered by language)
            const counts: Record<string, number> = {};

            for (const subcat of vc.subcategories) {
              const { count } = await supabaseBrowser
                .from('centralized_vocabulary')
                .select('id', { count: 'exact', head: true })
                .eq('subcategory', subcat)
                .eq('language', languageCode);
              counts[subcat] = count || 0;
            }
            setTopicCounts(counts);
          } else if (vc.categories && vc.categories.length > 0) {
            const { data, error } = await supabaseBrowser
              .from('centralized_vocabulary')
              .select(`word, translation, category`)
              .in('category', vc.categories)
              .eq('language', languageCode)
              .limit(75);

            console.log('📚 [ReviewStep] Categories query result:', { data, error, count: data?.length });
            rows = (data || []).map((r: any) => ({ term: r.word, translation: r.translation, subcategory: r.category }));

            // Calculate per-category counts (filtered by language)
            const counts: Record<string, number> = {};

            for (const cat of vc.categories) {
              const { count } = await supabaseBrowser
                .from('centralized_vocabulary')
                .select('id', { count: 'exact', head: true })
                .eq('category', cat)
                .eq('language', languageCode);
              counts[cat] = count || 0;
            }
            setTopicCounts(counts);
          } else if (vc.themes && vc.themes.length > 0) {
            // KS4: fetch by themes
            const { data } = await supabaseBrowser
              .from('centralized_vocabulary')
              .select(`word, translation`)
              .in('ks4_theme', vc.themes)
              .eq('language', languageCode)
              .limit(75);
            rows = (data || []).map((r: any) => ({ term: r.word, translation: r.translation }));
          } else if ((vc as any).units && (vc as any).units.length > 0) {
            // KS4: fetch by units
            const { data } = await supabaseBrowser
              .from('centralized_vocabulary')
              .select(`word, translation`)
              .in('ks4_unit', (vc as any).units)
              .eq('language', languageCode)
              .limit(75);
            rows = (data || []).map((r: any) => ({ term: r.word, translation: r.translation }));
          }

          console.log('✅ [ReviewStep] Final rows:', { count: rows.length, sample: rows.slice(0, 3) });

          if (rows.length > 0) {
            setPreviewWords(rows);
            details.wordCount = rows.length;
            // Calculate estimated sessions (10 words per session)
            details.estimatedSessions = Math.ceil(rows.length / 10);
          } else {
            // If no rows fetched, still try to estimate from config
            const estimatedTotal = vc.wordCount || 20;
            details.wordCount = estimatedTotal;
            details.estimatedSessions = Math.ceil(estimatedTotal / 10);
          }
        } finally {
          setPreviewLoading(false);
        }

        setContentDetails(details);
      } catch (error) {
        console.error('Error fetching content details:', error);
      } finally {
        setLoadingContent(false);
      }
    };

    fetchContentDetails();
  }, [gameConfig.vocabularyConfig]);

  const selectedClasses = classes.filter(cls => assignmentDetails.selectedClasses.includes(cls.id));
  const totalStudents = selectedClasses.reduce((sum, cls) => sum + (cls.student_count || 0), 0);

  const hasGames = gameConfig.selectedGames.length > 0;
  const hasAssessments = assessmentConfig.selectedAssessments.length > 0;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    const now = new Date();

    // Check if the date is in the past or within the next hour
    const isNow = date <= now || (date.getTime() - now.getTime()) < 3600000; // 1 hour in milliseconds

    if (isNow) {
      return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Now)`;
    }

    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const getStartDate = () => {
    // If no specific start date is set, assume it launches immediately
    return assignmentDetails.dueDate ? new Date().toISOString() : '';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Launch</h2>
        <p className="text-sm text-gray-600">Review your assignment details before creating</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Assignment Details */}
        <div className="space-y-6">
          {/* Basic Details */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                Assignment Details
              </h3>
              <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-600">Title:</span>
                <p className="text-gray-900 font-medium">{assignmentDetails.title || 'Untitled Assignment'}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Description:</span>
                <p className="text-gray-900 text-sm">{assignmentDetails.description || 'No description provided'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Launch Date:
                  </span>
                  <p className="text-gray-900 text-sm font-medium text-green-600">
                    {formatDate(getStartDate())}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium text-gray-600 flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due Date:
                  </span>
                  <p className="text-gray-900 text-sm">{formatDate(assignmentDetails.dueDate)}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600 flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  Est. Time:
                </span>
                <p className="text-gray-900 text-sm">{assignmentDetails.estimatedTime} minutes</p>
              </div>
            </div>
          </div>

          {/* Classes and Students */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 text-blue-500 mr-2" />
                Classes ({selectedClasses.length})
              </h3>
            </div>

            <div className="space-y-2">
              {selectedClasses.map(cls => (
                <div key={cls.id} className="flex items-center justify-between bg-blue-50 px-3 py-2 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{cls.name}</p>
                    <p className="text-xs text-gray-600">
                      {cls.student_count > 0
                        ? `All ${cls.student_count} students`
                        : 'No students enrolled'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-blue-600">{cls.student_count || 0}</div>
                    <div className="text-xs text-gray-500">students</div>
                  </div>
                </div>
              ))}

              <div className="pt-2 border-t border-gray-200 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Total Students:</span>
                  <span className="text-xl font-bold text-blue-600">{totalStudents}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
              <Settings className="h-5 w-5 text-gray-500 mr-2" />
              Assignment Settings
            </h3>

            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600">Late submissions:</span>
                <span className={`font-medium ${assignmentDetails.allowLateSubmissions ? 'text-green-600' : 'text-red-600'}`}>
                  {assignmentDetails.allowLateSubmissions ? 'Allowed' : 'Not allowed'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600">Show results to students:</span>
                <span className={`font-medium ${assignmentDetails.showResults ? 'text-green-600' : 'text-gray-600'}`}>
                  {assignmentDetails.showResults ? 'Yes' : 'No'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600">Question order:</span>
                <span className="font-medium text-gray-900">
                  {assignmentDetails.randomizeOrder ? 'Randomized' : 'Fixed'}
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-gray-600">Max attempts:</span>
                <span className="font-medium text-gray-900">{assignmentDetails.maxAttempts}</span>
              </div>

              <div className="flex items-center justify-between py-1 pt-2 border-t border-gray-200">
                <span className="text-gray-600">Student notifications:</span>
                <span className="font-medium text-green-600">In-app + Email on launch</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Activities */}
        <div className="space-y-6">
          {/* Content Details - NEW SECTION */}
          {hasGames && contentDetails && !loadingContent && (
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-purple-600 mr-2" />
                Learning Content
              </h3>

              <div className="space-y-3">
                <div className="bg-white rounded-lg p-3">
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center mb-1">
                    <Layers className="h-3 w-3 mr-1" />
                    Vocabulary List:
                  </span>
                  <p className="text-gray-900 font-semibold text-base">
                    {contentDetails.vocabularyListName}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center mb-1">
                      <Globe className="h-3 w-3 mr-1" />
                      Language:
                    </span>
                    <p className="text-purple-700 font-bold text-sm">
                      {contentDetails.language}
                    </p>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide flex items-center mb-1">
                      <Hash className="h-3 w-3 mr-1" />
                      Pool Size:
                    </span>
                    <p className="text-purple-700 font-bold text-sm">
                      {contentDetails.wordCount} words
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
                    <span className="text-xs font-medium text-blue-600 uppercase tracking-wide flex items-center mb-1">
                      <Target className="h-3 w-3 mr-1" />
                      Sessions:
                    </span>
                    <p className="text-blue-700 font-bold text-sm">
                      ~{contentDetails.estimatedSessions} to complete
                    </p>
                  </div>
                </div>

                {/* Preview list of words */}
                {previewWords.length > 0 && (
                  <div className="bg-white rounded-lg p-4 border-2 border-purple-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm font-bold text-purple-900 flex items-center">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Vocabulary Preview ({previewWords.length} words)
                      </div>
                      {gameConfig.vocabularyConfig.pinnedVocabularyIds && gameConfig.vocabularyConfig.pinnedVocabularyIds.length > 0 && (
                        <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full font-medium">
                          {gameConfig.vocabularyConfig.pinnedVocabularyIds.length} pinned
                        </div>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-3">
                      <ul className="text-sm text-gray-800 space-y-1">
                        {previewWords.map((w, idx) => {
                          const isPinned = gameConfig.vocabularyConfig.pinnedVocabularyIds?.includes(w.term);
                          return (
                            <li key={idx} className={`py-2 px-3 rounded hover:bg-white transition-colors ${isPinned ? 'bg-amber-50 border-l-2 border-amber-400' : 'border-l-2 border-transparent'}`}>
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center">
                                    {isPinned && <span className="text-amber-500 mr-2">📌</span>}
                                    <span className="font-semibold text-gray-900">{w.term}</span>
                                    <span className="mx-2 text-gray-400">—</span>
                                    <span className="text-gray-700">{w.translation}</span>
                                  </div>
                                  {w.subcategory && (
                                    <div className="text-xs text-gray-500 mt-1 ml-6">
                                      {w.category || gameConfig.vocabularyConfig.categories?.[0] || ''}{w.category ? ' / ' : ''}{w.subcategory}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center">
                      <Target className="h-3 w-3 mr-1" />
                      Students will see ~10 words per session with Progressive Coverage rotation
                    </div>
                  </div>
                )}


                {/* Show categories/themes if available */}
                {contentDetails.categories.length > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                      Categories:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {contentDetails.categories.map((cat, idx) => (
                        <span key={idx} className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {contentDetails.subcategories.length > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">
                      Topics ({contentDetails.subcategories.length}):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {contentDetails.subcategories.map((subcat, idx) => (
                        <div key={idx} className="inline-flex items-center bg-indigo-100 text-indigo-700 text-xs px-3 py-1.5 rounded-lg border border-indigo-200">
                          <span className="font-medium">{subcat}</span>
                          {topicCounts[subcat] && (
                            <span className="ml-2 bg-indigo-200 text-indigo-800 px-1.5 py-0.5 rounded font-bold">
                              {topicCounts[subcat]}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {contentDetails.themes.length > 0 && (
                  <div className="bg-white rounded-lg p-3">
                    <span className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-1 block">
                      Themes:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {contentDetails.themes.map((theme, idx) => (
                        <span key={idx} className="inline-block bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Games */}
          {hasGames && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Gamepad2 className="h-5 w-5 text-blue-500 mr-2" />
                  Practice Games ({gameConfig.selectedGames.length})
                </h3>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>

              <div className="space-y-2">
                {gameConfig.selectedGames.map((gameId, index) => {
                  const game = getGameById(gameId);
                  return (
                    <div key={gameId} className="border border-blue-200 rounded-lg p-3 bg-blue-50">
                      <div className="flex items-start">
                        <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-0.5">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm mb-1">{game.name}</p>
                          <div className="flex items-center gap-3 text-xs text-gray-600 mb-2">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {game.estimatedTime}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {game.features.map((feature, idx) => (
                              <span key={idx} className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Assessments */}
          {hasAssessments && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FileCheck className="h-5 w-5 text-indigo-500 mr-2" />
                  Assessments ({assessmentConfig.selectedAssessments.length})
                </h3>
                <button className="text-purple-600 hover:text-purple-800 text-sm font-medium flex items-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
              </div>

              <div className="space-y-2">
                {assessmentConfig.selectedAssessments.map((assessment, index) => (
                  <div key={assessment.id} className="p-3 bg-indigo-50 rounded">
                    <div className="flex items-center mb-2">
                      <div className="w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm">{assessment.name}</p>
                        <p className="text-xs text-gray-600">{assessment.estimatedTime} • {assessment.skills?.join(', ') || 'Assessment skills'}</p>
                      </div>
                    </div>

                    <div className="ml-9 grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <span>
                        Language: <span className="font-medium text-indigo-700">
                          {assessment.instanceConfig?.language || assessmentConfig.generalLanguage}
                        </span>
                      </span>
                      <span>
                        Difficulty: <span className="font-medium text-indigo-700">
                          {assessment.instanceConfig?.difficulty || assessmentConfig.generalDifficulty}
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Instructions */}
          {assignmentDetails.instructions && (
            <div className="bg-white border border-gray-200 rounded-lg p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Instructions for Students</h3>
              <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded">{assignmentDetails.instructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Final Summary */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-5">
        <div className="flex items-center mb-3">
          <CheckCircle className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Ready to Launch</h3>
        </div>
        <p className="text-gray-700 text-sm mb-3">
          Your assignment is configured and ready to be created. It will be assigned to {totalStudents} students across {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{hasGames ? gameConfig.selectedGames.length : 0}</div>
            <div className="text-gray-600">Practice Games</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{hasAssessments ? assessmentConfig.selectedAssessments.length : 0}</div>
            <div className="text-gray-600">Assessments</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{totalStudents}</div>
            <div className="text-gray-600">Students</div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
