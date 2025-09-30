'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Clock, Users, Target } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { createBrowserClient } from '../../../lib/supabase-client';
import { useGlobalAudioContext } from '../../../hooks/useGlobalAudioContext';
import { createAudio, getAudioUrl } from '../../../utils/audioUtils';
import { EnhancedGameSessionService } from '../../../services/rewards/EnhancedGameSessionService';
import UniversalThemeSelector from '../UniversalThemeSelector';
// RewardEngine removed - games should handle individual vocabulary interactions

// Standard interfaces for assignment integration
export interface StandardVocabularyItem {
  id: string;          // UUID from centralized_vocabulary
  word: string;        // Spanish/target language
  translation: string; // English translation
  category: string;    // Modern category field
  subcategory: string; // Modern subcategory field
  part_of_speech: string;
  language: string;
  audio_url?: string;  // Audio URL for listening activities
  word_type?: string;  // Additional word type information
  gender?: string;     // Gender for nouns
  article?: string;    // Article for nouns
  display_word?: string; // Display version of word
  order_position?: number;
}

export interface AssignmentData {
  id: string;
  title: string;
  description: string;
  game_config: any;
  vocabulary_assignment_list_id: string;
  due_date: string;
  class_name?: string;
  vocabulary_criteria: any;
  curriculum_level?: string;
  exam_board?: string;
  tier?: string;
}

export interface GameProgress {
  assignmentId: string;
  gameId: string;
  studentId: string;
  wordsCompleted: number;
  totalWords: number;
  score: number;
  maxScore: number;
  timeSpent: number;
  accuracy: number;
  completedAt?: Date;
  sessionData: any;
}

export interface GameAssignmentWrapperProps {
  assignmentId: string;
  gameId: string;
  studentId?: string;
  onAssignmentComplete: (progress: GameProgress) => void;
  onBackToAssignments: () => void;
  onBackToMenu?: () => void;
  children: (props: {
    assignment: AssignmentData;
    vocabulary: StandardVocabularyItem[];
    sentences?: any[];
    onProgressUpdate: (progress: Partial<GameProgress>) => void;
    onGameComplete: (finalProgress: GameProgress) => void;
    gameSessionId: string | null;
    gameService?: EnhancedGameSessionService | null;
    selectedTheme?: string; // Add theme to child props
  }) => React.ReactNode;
}

// Helper function to load sentences for sentence-based games
const loadSentencesForAssignment = async (supabase: any, assignment: AssignmentData, setSentences: (sentences: any[]) => void) => {
  try {
    console.log('🔄 [SENTENCES] Loading sentences for assignment:', assignment.id);

    // Get sentence configuration from assignment
    const gameConfig = assignment.game_config;
    const sentenceConfig = gameConfig?.gameConfig?.sentenceConfig || gameConfig?.sentenceConfig;

    console.log('🔄 [SENTENCES] Assignment game config structure:', {
      hasGameConfig: !!gameConfig,
      gameConfigKeys: gameConfig ? Object.keys(gameConfig) : [],
      sentenceConfig,
      fullGameConfig: gameConfig
    });

    if (!sentenceConfig) {
      console.log('🔄 [SENTENCES] No sentence config found, skipping sentence loading');
      return;
    }

    console.log('🔄 [SENTENCES] Sentence config:', sentenceConfig);

    // Build query based on sentence configuration
    let query = supabase
      .from('sentences')
      .select('*')
      .eq('is_active', true)
      .eq('is_public', true);

    // Apply language filter
    const languageMap: { [key: string]: string } = { 'spanish': 'spanish', 'french': 'french', 'german': 'german' };
    const dbLanguage = languageMap[sentenceConfig.language || 'spanish'] || 'spanish';
    query = query.eq('source_language', dbLanguage);

    // Apply filters based on source type
    if (sentenceConfig.source === 'theme' && sentenceConfig.theme) {
      query = query.eq('category', sentenceConfig.theme);
      if (sentenceConfig.topic) {
        query = query.eq('subcategory', sentenceConfig.topic);
      }
    } else if (sentenceConfig.source === 'category' && sentenceConfig.category) {
      query = query.eq('category', sentenceConfig.category);
      if (sentenceConfig.subcategory) {
        query = query.eq('subcategory', sentenceConfig.subcategory);
      }
    } else if (sentenceConfig.source === 'topic' && sentenceConfig.topic) {
      // Handle topic-based filtering - map common topics to their categories
      const topicCategoryMap: { [key: string]: string } = {
        'colours': 'basics_core_language',
        'numbers': 'basics_core_language',
        'days': 'basics_core_language',
        'months': 'basics_core_language',
        'greetings': 'basics_core_language',
        'family': 'identity_personal_life',
        'food': 'food_drink',
        'animals': 'nature_environment',
        'sports': 'free_time_leisure',
        'school': 'school_jobs_future',
        'travel': 'holidays_travel_culture',
        'health': 'health_lifestyle',
        'technology': 'technology_media'
      };

      const category = topicCategoryMap[sentenceConfig.topic] || 'basics_core_language';
      query = query.eq('category', category).eq('subcategory', sentenceConfig.topic);
    }

    // Apply curriculum level if available
    if (sentenceConfig.curriculumLevel) {
      query = query.eq('curriculum_level', sentenceConfig.curriculumLevel);
    }

    // Limit results
    const limit = sentenceConfig.sentenceCount || 20;
    query = query.limit(limit);

    const { data: sentenceData, error: sentenceError } = await query;

    if (sentenceError) {
      console.error('🚨 [SENTENCES] Error loading sentences:', sentenceError);
      return;
    }

    console.log('✅ [SENTENCES] Loaded sentences:', sentenceData?.length || 0);
    setSentences(sentenceData || []);

  } catch (error) {
    console.error('🚨 [SENTENCES] Error in loadSentencesForAssignment:', error);
  }
};

// Custom hook for assignment vocabulary loading
export const useAssignmentVocabulary = (assignmentId: string, gameId?: string) => {
  const [assignment, setAssignment] = useState<AssignmentData | null>(null);
  const [vocabulary, setVocabulary] = useState<StandardVocabularyItem[]>([]);
  const [sentences, setSentences] = useState<any[]>([]);
  const [lastLoadTime, setLastLoadTime] = useState<string>('never');

  console.log('🔧 [HOOK] useAssignmentVocabulary called [DEBUG-v2]:', {
    assignmentId,
    gameId,
    vocabularyLength: vocabulary.length,
    lastLoadTime,
    timestamp: new Date().toISOString()
  });

  // Debug vocabulary state changes
  useEffect(() => {
    console.log('📋 [VOCABULARY STATE] Vocabulary state changed:', {
      vocabularyLength: vocabulary.length,
      assignmentId,
      gameId,
      sampleVocabulary: vocabulary.slice(0, 2),
      timestamp: new Date().toISOString()
    });
  }, [vocabulary, assignmentId, gameId]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🚨🚨🚨 [HOOK EFFECT] useEffect triggered [DEBUG-v4] 🚨🚨🚨:', {
      assignmentId,
      hasAssignmentId: !!assignmentId,
      timestamp: new Date().toISOString()
    });

    const fetchAssignmentData = async () => {
      console.log('🔄 [HOOK LOAD] Starting loadAssignmentData [DEBUG-v3]:', {
        assignmentId,
        timestamp: new Date().toISOString()
      });

      try {
        setLoading(true);
        setError(null);

        console.log('🔍 [DEBUG] Assignment loading try block started');

        console.log('🔄 [HOOK LOAD] Step 1: Creating Supabase client');
        // Use Supabase client directly instead of API route
        const supabase = createBrowserClient();
        console.log('🔄 [HOOK LOAD] Step 2: Supabase client created successfully');

        console.log('🔄 [HOOK LOAD] Step 3: About to check authentication status');
        // Check authentication status
        let session, authError;
        try {
          const authResult = await supabase.auth.getSession();
          session = authResult.data.session;
          authError = authResult.error;
          console.log('🔄 [HOOK LOAD] Step 4: Authentication check completed successfully');
        } catch (error) {
          console.error('🚨 [HOOK LOAD] Authentication check failed:', error);
          authError = error;
        }
        console.log('🔐 [AUTH] Authentication status [DEBUG-v2]:', {
          hasSession: !!session,
          userId: session?.user?.id,
          authError: authError?.message,
          timestamp: new Date().toISOString()
        });

        // Get assignment data
        console.log('📋 [ASSIGNMENT] About to query assignment data...');
        const { data: assignmentData, error: assignmentError } = await supabase
          .from('assignments')
          .select(`
            id,
            title,
            description,
            game_config,
            vocabulary_assignment_list_id,
            vocabulary_criteria,
            due_date,
            class_id,
            curriculum_level,
            exam_board,
            tier
          `)
          .eq('id', assignmentId)
          .single();

        console.log('📋 [ASSIGNMENT] Assignment query completed.');

        console.log('📋 [ASSIGNMENT] Assignment query result:', {
          assignmentId,
          found: !!assignmentData,
          error: assignmentError?.message,
          vocabularyAssignmentListId: assignmentData?.vocabulary_assignment_list_id,
          vocabularyCriteria: assignmentData?.vocabulary_criteria
        });

        if (assignmentError) {
          throw new Error(`Failed to load assignment: ${assignmentError.message}`);
        }

        if (!assignmentData) {
          throw new Error('Assignment not found');
        }

        // Get class name separately
        let className = '';
        if (assignmentData.class_id) {
          const { data: classData } = await supabase
            .from('classes')
            .select('name')
            .eq('id', assignmentData.class_id)
            .single();
          className = classData?.name || '';
        }

        // Get vocabulary data - handle both list-based and category-based assignments
        let vocabularyData: any[] = [];
        let vocabularyError: any = null;

        console.log('📋 [VOCABULARY LOAD] Starting vocabulary loading process:', {
          assignmentId,
          hasVocabularyAssignmentListId: !!assignmentData.vocabulary_assignment_list_id,
          vocabularyAssignmentListId: assignmentData.vocabulary_assignment_list_id,
          vocabularyCriteria: assignmentData.vocabulary_criteria
        });

        console.log('🔍 [DEBUG] About to check list-based approach condition:', {
          hasVocabularyAssignmentListId: !!assignmentData.vocabulary_assignment_list_id,
          vocabularyAssignmentListId: assignmentData.vocabulary_assignment_list_id,
          listBasedDisabled: true
        });

        // Try list-based approach first if vocabulary_assignment_list_id exists
        console.log('🔍 [DEBUG] Assignment vocabulary_assignment_list_id:', assignmentData.vocabulary_assignment_list_id);
        console.log('🔍 [DEBUG] Assignment game_config:', JSON.stringify(assignmentData.game_config, null, 2));

        if (assignmentData.vocabulary_assignment_list_id) {
          console.log('📋 [VOCABULARY LOAD] Using list-based approach...');
          const { data, error } = await supabase
            .from('vocabulary_assignment_items')
            .select(`
              order_position,
              centralized_vocabulary!vocabulary_assignment_items_centralized_vocabulary_id_fkey(
                id,
                word,
                translation,
                category,
                subcategory,
                part_of_speech,
                language,
                audio_url,
                word_type,
                gender,
                article,
                display_word
              )
            `)
            .eq('assignment_list_id', assignmentData.vocabulary_assignment_list_id)
            .not('centralized_vocabulary_id', 'is', null)
            .order('order_position');

          vocabularyData = data || [];
          vocabularyError = error;

          console.log('📋 [LIST-BASED] List-based approach result:', {
            dataCount: vocabularyData.length,
            error: vocabularyError?.message,
            hasAssignmentListId: !!assignmentData.vocabulary_assignment_list_id,
            rawData: data,
            vocabularyData: vocabularyData,
            assignmentId,
            gameId
          });

          // If no data from legacy system, try enhanced vocabulary lists
          if (vocabularyData.length === 0) {
            // Debug: Check authentication context
            const { data: authUser } = await supabase.auth.getUser();
            console.log('🔍 [AUTH DEBUG] Current user context:', {
              userId: authUser?.user?.id,
              email: authUser?.user?.email,
              assignmentListId: assignmentData.vocabulary_assignment_list_id
            });

            // First get the source_list_id from the vocabulary_assignment_lists table
            console.log('🔍 [QUERY DEBUG] About to query vocabulary_assignment_lists:', {
              table: 'vocabulary_assignment_lists',
              id: assignmentData.vocabulary_assignment_list_id,
              userId: authUser?.user?.id
            });

            const { data: assignmentListData, error: assignmentListError } = await supabase
              .from('vocabulary_assignment_lists')
              .select('source_list_id')
              .eq('id', assignmentData.vocabulary_assignment_list_id)
              .limit(1);

            console.log('🔍 [QUERY DEBUG] vocabulary_assignment_lists query result:', {
              data: assignmentListData,
              error: assignmentListError?.message,
              errorDetails: assignmentListError
            });

            console.log('📋 [ENHANCED-LIST] Assignment list data:', {
              assignmentListData,
              hasData: !!assignmentListData,
              dataLength: assignmentListData?.length,
              firstItem: assignmentListData?.[0],
              sourceListId: assignmentListData?.[0]?.source_list_id
            });

            if (assignmentListData?.[0]?.source_list_id) {
            // Try enhanced vocabulary approach
            console.log('📋 [ENHANCED-QUERY] About to query enhanced vocabulary items:', {
              sourceListId: assignmentListData[0].source_list_id,
              query: 'enhanced_vocabulary_items where list_id = ' + assignmentListData[0].source_list_id
            });

            // Try multiple query approaches to debug the issue
            const sourceListId = assignmentListData[0].source_list_id;
            
            console.log('📋 [ENHANCED-QUERY] Debug query details:', {
              sourceListId: sourceListId,
              sourceListIdType: typeof sourceListId,
              queryString: `list_id = ${sourceListId}`
            });

            // Test the RLS policy by checking if we can access the items
            console.log('🔍 [RLS TEST] Testing RLS policy access...');
            const { data: rlsTestData, error: rlsTestError } = await supabase
                .from('enhanced_vocabulary_items')
                .select('id, term, translation')
                .eq('list_id', sourceListId)
                .limit(5);

            console.log('🔍 [RLS TEST] RLS policy test result:', {
              hasData: !!rlsTestData,
              dataLength: rlsTestData?.length || 0,
              error: rlsTestError?.message,
              errorDetails: rlsTestError,
              sampleData: rlsTestData?.slice(0, 2)
            });

            // Test auth.uid() function directly
            console.log('🔍 [AUTH UID TEST] Testing auth.uid() function...');
            const { data: authUidData, error: authUidError } = await supabase
                .rpc('get_current_user_id');

            console.log('🔍 [AUTH UID TEST] auth.uid() test result:', {
              authUid: authUidData,
              error: authUidError?.message,
              expectedUserId: '50153b2f-0ace-4be7-b542-12f0ec348005'
            });

            // First try the basic query
            let { data: enhancedData, error: enhancedError } = await supabase
                .from('enhanced_vocabulary_items')
                .select(`
                  id,
                  term,
                  translation,
                  part_of_speech,
                  difficulty_level,
                  order_position,
                  type,
                  context_sentence,
                  context_translation,
                  audio_url,
                  image_url,
                  list_id
                `)
                .eq('list_id', sourceListId)
                .order('order_position');

            console.log('📋 [ENHANCED-QUERY] Enhanced vocabulary query result (basic):', {
              hasData: !!enhancedData,
              dataLength: enhancedData?.length || 0,
              error: enhancedError?.message,
              firstItem: enhancedData?.[0],
              sourceListId: sourceListId
            });

            // If that didn't work, try without ordering
            if (!enhancedData || enhancedData.length === 0) {
              console.log('📋 [ENHANCED-QUERY] Trying query without ORDER BY...');
              const { data: enhancedData2, error: enhancedError2 } = await supabase
                  .from('enhanced_vocabulary_items')
                  .select('*')
                  .eq('list_id', sourceListId);

              console.log('📋 [ENHANCED-QUERY] No ORDER BY result:', {
                hasData: !!enhancedData2,
                dataLength: enhancedData2?.length || 0,
                error: enhancedError2?.message,
                allData: enhancedData2
              });

              if (enhancedData2 && enhancedData2.length > 0) {
                enhancedData = enhancedData2;
                enhancedError = enhancedError2;
              }
            }              if (enhancedData && enhancedData.length > 0) {
                // Transform enhanced vocabulary items to match expected format
                vocabularyData = enhancedData.map(item => ({
                  order_position: item.order_position,
                  centralized_vocabulary: {
                    id: item.id,
                    word: item.term,
                    translation: item.translation,
                    category: null,
                    subcategory: null,
                    part_of_speech: item.part_of_speech,
                    language: 'spanish', // Default to Spanish for now
                    audio_url: item.audio_url,
                    word_type: item.type,
                    gender: null,
                    article: null,
                    display_word: item.term
                  }
                }));
                vocabularyError = null;

                console.log('📋 [ENHANCED-LIST] Enhanced list approach result:', {
                  dataCount: vocabularyData.length,
                  sourceListId: assignmentListData[0].source_list_id,
                  items: vocabularyData.map(v => v.centralized_vocabulary?.word)
                });
              } else {
                console.log('📋 [ENHANCED-LIST] Enhanced list approach failed:', {
                  error: enhancedError?.message,
                  sourceListId: assignmentListData?.[0]?.source_list_id
                });
              }
            } else {
              console.log('📋 [ENHANCED-LIST] No source_list_id found or assignment list error:', {
                assignmentListError: assignmentListError?.message,
                assignmentListId: assignmentData.vocabulary_assignment_list_id
              });
            }
          }
        }

        // If list-based approach failed or returned no data, try criteria-based approach
        // Check if this is a grammar assignment
        // Check if this specific game is a grammar game (not the entire assignment)
        const currentGameId = window.location.pathname.split('/').pop();
        const isGrammarAssignment = currentGameId === 'conjugation-duel' &&
                                   assignmentData.game_config?.gameConfig?.grammarConfig;

        console.log('🔍 [FALLBACK CHECK] Checking fallback conditions:', {
          vocabularyDataLength: vocabularyData?.length || 0,
          hasVocabularyCriteria: !!assignmentData.vocabulary_criteria,
          vocabularyCriteria: assignmentData.vocabulary_criteria,
          isGrammarAssignment
        });

        // For grammar assignments, create placeholder vocabulary to avoid errors
        if (isGrammarAssignment) {
          console.log('🎯 [GRAMMAR] This is a grammar assignment - creating placeholder vocabulary');
          vocabularyData = [{
            order_position: 1,
            centralized_vocabulary: {
              id: 'grammar-placeholder',
              word: 'grammar-verbs',
              translation: 'Grammar verbs will be loaded from grammar system',
              category: 'grammar',
              subcategory: 'verbs',
              part_of_speech: 'verb',
              language: assignmentData.game_config?.gameConfig?.grammarConfig?.language || 'spanish',
              audio_url: null,
              word_type: 'grammar',
              gender: null,
              article: null,
              display_word: 'Grammar System'
            }
          }];
        } else if ((!vocabularyData || vocabularyData.length === 0) && assignmentData.game_config?.gameConfig?.vocabularyConfig) {
          // KS4 vocabulary config assignment: fetch from centralized_vocabulary using vocabulary config
          const vocabConfig = assignmentData.game_config.gameConfig.vocabularyConfig;
          console.log('🔄 [VOCAB CONFIG] Loading vocabulary using vocabularyConfig:', vocabConfig);

          if (vocabConfig.curriculumLevel === 'KS4') {
            console.log('📚 [KS4] Loading KS4 vocabulary with config:', {
              examBoard: vocabConfig.examBoard,
              tier: vocabConfig.tier,
              subcategory: vocabConfig.subcategory,
              language: vocabConfig.language
            });

            let query = supabase
              .from('centralized_vocabulary')
              .select(`
                id,
                word,
                translation,
                category,
                subcategory,
                part_of_speech,
                language,
                audio_url,
                word_type,
                gender,
                article,
                display_word,
                exam_board_code,
                tier,
                curriculum_level,
                theme_name,
                unit_name
              `);

            // Apply KS4 filters using correct field names
            query = query.eq('curriculum_level', 'KS4');

            if (vocabConfig.language) {
              // Use language code directly (es, fr, de)
              query = query.eq('language', vocabConfig.language);
            }

            if (vocabConfig.examBoard) {
              query = query.eq('exam_board_code', vocabConfig.examBoard);
            }

            if (vocabConfig.tier) {
              // Map foundation tier to 'both' since foundation vocabulary is included in 'both'
              const dbTier = vocabConfig.tier === 'foundation' ? 'both' : vocabConfig.tier;
              query = query.eq('tier', dbTier);
            }

            // Match subcategory to unit_name (the assignment config uses subcategory but DB uses unit_name)
            if (vocabConfig.subcategory) {
              query = query.ilike('unit_name', `%${vocabConfig.subcategory}%`);
            }

            // Apply word count limit
            if (vocabConfig.wordCount) {
              query = query.limit(vocabConfig.wordCount);
            }

            const { data: ks4VocabData, error: ks4Error } = await query;

            if (ks4Error) {
              console.error('❌ [KS4] Error loading KS4 vocabulary:', ks4Error);
            } else if (ks4VocabData && ks4VocabData.length > 0) {
              console.log(`✅ [KS4] Successfully loaded ${ks4VocabData.length} KS4 vocabulary items`);
              console.log('📝 [KS4] Sample vocabulary:', ks4VocabData.slice(0, 3).map(item => ({
                word: item.word,
                translation: item.translation,
                unit_name: item.unit_name,
                theme_name: item.theme_name
              })));
              // Handle shuffling and word count
              let processedVocab = [...ks4VocabData];

              // Shuffle if requested
              if (vocabConfig.shuffleWords) {
                console.log('🔀 [KS4] Shuffling vocabulary words...');
                processedVocab = processedVocab.sort(() => Math.random() - 0.5);
              }

              // Apply word count limit after shuffling (if not using all words)
              if (!vocabConfig.useAllWords && vocabConfig.wordCount && processedVocab.length > vocabConfig.wordCount) {
                console.log(`✂️ [KS4] Limiting to ${vocabConfig.wordCount} words from ${processedVocab.length} available`);
                processedVocab = processedVocab.slice(0, vocabConfig.wordCount);
              }

              console.log(`🎯 [KS4] Final vocabulary count: ${processedVocab.length} words`);

              vocabularyData = processedVocab.map((item, index) => ({
                order_position: index + 1,
                centralized_vocabulary: item
              }));
            } else {
              console.log('⚠️ [KS4] No KS4 vocabulary found with current criteria, trying fallback...');

              // Fallback: try to get any vocabulary for the language and exam board
              const { data: fallbackVocab, error: fallbackError } = await supabase
                .from('centralized_vocabulary')
                .select(`
                  id,
                  word,
                  translation,
                  category,
                  subcategory,
                  part_of_speech,
                  language,
                  audio_url,
                  word_type,
                  gender,
                  article,
                  display_word
                `)
                .eq('curriculum_level', 'KS4')
                .eq('language', vocabConfig.language)
                .eq('exam_board_code', vocabConfig.examBoard || 'AQA')
                .limit(vocabConfig.wordCount || 10);

              if (fallbackError) {
                console.error('❌ [KS4 FALLBACK] Error loading fallback vocabulary:', fallbackError);
              } else if (fallbackVocab && fallbackVocab.length > 0) {
                console.log(`✅ [KS4 FALLBACK] Using ${fallbackVocab.length} fallback KS4 vocabulary items`);
                vocabularyData = fallbackVocab.map((item, index) => ({
                  order_position: index + 1,
                  centralized_vocabulary: item
                }));
              }
            }
          } else {
            console.log('📚 [KS3] Loading KS3 vocabulary with config:', {
              language: vocabConfig.language,
              category: vocabConfig.category,
              subcategory: vocabConfig.subcategory,
              categories: vocabConfig.categories,
              subcategories: vocabConfig.subcategories,
              wordCount: vocabConfig.wordCount
            });

            let query = supabase
              .from('centralized_vocabulary')
              .select(`
                id,
                word,
                translation,
                category,
                subcategory,
                part_of_speech,
                language,
                audio_url,
                word_type,
                gender,
                article,
                display_word
              `);

            // Apply language filter
            if (vocabConfig.language) {
              query = query.eq('language', vocabConfig.language === 'es' ? 'es' :
                                         vocabConfig.language === 'fr' ? 'fr' :
                                         vocabConfig.language === 'de' ? 'de' : 'es');
            }

            // =====================================================
            // HANDLE MULTIPLE SUBCATEGORIES (Enhanced Creator)
            // =====================================================
            if (vocabConfig.subcategories && vocabConfig.subcategories.length > 0) {
              console.log('🎯 [KS3] Applying MULTIPLE subcategory filter:', vocabConfig.subcategories);
              query = query.in('subcategory', vocabConfig.subcategories);

              // Optionally filter by categories if provided
              if (vocabConfig.categories && vocabConfig.categories.length > 0) {
                query = query.in('category', vocabConfig.categories);
              }
            }
            // =====================================================
            // HANDLE MULTIPLE CATEGORIES (Enhanced Creator)
            // =====================================================
            else if (vocabConfig.categories && vocabConfig.categories.length > 0) {
              console.log('🎯 [KS3] Applying MULTIPLE category filter:', vocabConfig.categories);
              query = query.in('category', vocabConfig.categories);
            }
            // =====================================================
            // HANDLE SINGLE CATEGORY/SUBCATEGORY (Quick Creator / Legacy)
            // =====================================================
            else {
              // Apply category filter for KS3
              if (vocabConfig.category) {
                query = query.eq('category', vocabConfig.category);
              }

              // Apply subcategory filter for KS3
              if (vocabConfig.subcategory) {
                query = query.eq('subcategory', vocabConfig.subcategory);
                console.log('🎯 [KS3] Applying SINGLE subcategory filter:', vocabConfig.subcategory);
              }
            }

            // Apply curriculum level filter
            query = query.or('curriculum_level.eq.KS3,curriculum_level.is.null');

            // Fetch ALL matching vocabulary first (no limit yet)
            const { data: allVocab, error: fetchError } = await query;

            if (fetchError) {
              console.error('❌ [KS3] Error loading KS3 vocabulary:', fetchError);
            }

            // Randomly shuffle and select the specified number of words
            let fallbackVocab = allVocab;
            if (allVocab && allVocab.length > 0 && vocabConfig.wordCount) {
              const shuffled = [...allVocab].sort(() => 0.5 - Math.random());
              fallbackVocab = shuffled.slice(0, vocabConfig.wordCount);
              console.log(`🎲 [KS3] Randomly selected ${fallbackVocab.length} words from ${allVocab.length} available`);
            }

            const fallbackError = fetchError;

            if (fallbackError) {
              console.error('❌ [KS3] Error loading KS3 vocabulary:', fallbackError);
            } else if (fallbackVocab && fallbackVocab.length > 0) {
              console.log(`✅ [KS3] Successfully loaded ${fallbackVocab.length} KS3 vocabulary items`);
              console.log('📝 [KS3] Sample vocabulary:', fallbackVocab.slice(0, 3).map(item => ({
                word: item.word,
                translation: item.translation,
                category: item.category,
                subcategory: item.subcategory
              })));
              vocabularyData = fallbackVocab.map((item, index) => ({
                order_position: index + 1,
                centralized_vocabulary: item
              }));
            } else {
              console.log('⚠️ [KS3] No vocabulary found with current subcategory, trying category-only fallback...');
              
              // Try fallback without subcategory
              let fallbackQuery = supabase
                .from('centralized_vocabulary')
                .select(`
                  id,
                  word,
                  translation,
                  category,
                  subcategory,
                  part_of_speech,
                  language,
                  audio_url,
                  word_type,
                  gender,
                  article,
                  display_word
                `)
                .eq('language', vocabConfig.language === 'es' ? 'es' : vocabConfig.language === 'fr' ? 'fr' : vocabConfig.language === 'de' ? 'de' : 'es');

              if (vocabConfig.category) {
                fallbackQuery = fallbackQuery.eq('category', vocabConfig.category);
              }

              fallbackQuery = fallbackQuery.or('curriculum_level.eq.KS3,curriculum_level.is.null')
                                         .limit(vocabConfig.wordCount || 10);

              const { data: categoryFallback, error: categoryFallbackError } = await fallbackQuery;
              
              if (categoryFallback && categoryFallback.length > 0) {
                console.log(`✅ [KS3 CATEGORY FALLBACK] Using ${categoryFallback.length} vocabulary items from category`);
                vocabularyData = categoryFallback.map((item, index) => ({
                  order_position: index + 1,
                  centralized_vocabulary: item
                }));
              } else {
                console.error('❌ [KS3 CATEGORY FALLBACK] Still no vocabulary found');
              }
            }
          }
        } else if ((!vocabularyData || vocabularyData.length === 0) && assignmentData.vocabulary_criteria) {
          // Category-based assignment: fetch from appropriate table based on source_table
          const criteria = assignmentData.vocabulary_criteria;
          console.log('🔄 [FALLBACK] List-based approach returned empty, trying criteria-based approach');
          console.log('🔍 [FALLBACK] Loading category-based vocabulary with criteria:', criteria);
          console.log('🔍 [DEBUG] Fallback conditions met:', {
            vocabularyDataLength: vocabularyData?.length || 0,
            hasVocabularyCriteria: !!assignmentData.vocabulary_criteria,
            criteriaSourceTable: criteria.source_table,
            criteriaCategory: criteria.category,
            criteriaSubcategory: criteria.subcategory
          });

          // Check if we should query sentences table instead of vocabulary
          if (criteria.source_table === 'sentences') {
            console.log('🔍 [FALLBACK] Querying sentences table based on source_table criteria');

            let sentenceQuery = supabase
              .from('sentences')
              .select(`
                id,
                source_sentence,
                english_translation,
                category,
                subcategory,
                source_language,
                difficulty_level,
                curriculum_level,
                case_context,
                detective_prompt,
                case_difficulty,
                word_count,
                complexity_score,
                created_by,
                is_active,
                is_public,
                created_at,
                updated_at
              `)
              .eq('is_active', true)
              .eq('is_public', true);

            // Apply filters based on criteria
            if (criteria.language) {
              // Map language codes for sentences table
              const languageMap: { [key: string]: string } = {
                'spanish': 'spanish',
                'es': 'spanish',
                'french': 'french',
                'fr': 'french',
                'german': 'german',
                'de': 'german'
              };
              const dbLanguage = languageMap[criteria.language] || 'spanish';
              sentenceQuery = sentenceQuery.eq('source_language', dbLanguage);
            }
            if (criteria.category) {
              sentenceQuery = sentenceQuery.eq('category', criteria.category);
            }
            if (criteria.subcategory) {
              sentenceQuery = sentenceQuery.eq('subcategory', criteria.subcategory);
            }

            // Apply sentence count limit
            if (criteria.limit || criteria.wordCount) {
              sentenceQuery = sentenceQuery.limit(criteria.limit || criteria.wordCount);
            }

            const { data: sentenceData, error: sentenceError } = await sentenceQuery;

            console.log('🔍 [FALLBACK] Sentences query result:', {
              dataCount: sentenceData?.length || 0,
              error: sentenceError?.message,
              sampleData: sentenceData?.slice(0, 2)
            });

            if (sentenceData && sentenceData.length > 0) {
              // Transform sentences to vocabulary format for compatibility
              vocabularyData = sentenceData.map((sentence: any, index: number) => ({
                order_position: index,
                centralized_vocabulary: {
                  id: sentence.id,
                  word: sentence.source_sentence,
                  translation: sentence.english_translation,
                  category: sentence.category,
                  subcategory: sentence.subcategory,
                  part_of_speech: 'sentence',
                  language: sentence.source_language,
                  audio_url: null,
                  word_type: 'sentence',
                  gender: null,
                  article: null,
                  display_word: sentence.source_sentence,
                  difficulty_level: sentence.difficulty_level,
                  example_sentence_original: sentence.source_sentence,
                  example_sentence_translation: sentence.english_translation
                }
              }));
            }
            vocabularyError = sentenceError;
          } else {
            // Default to centralized_vocabulary table
            let query = supabase
              .from('centralized_vocabulary')
              .select(`
                id,
                word,
                translation,
                category,
                subcategory,
                part_of_speech,
                language,
                audio_url,
                word_type,
                gender,
                article,
                display_word
              `);

            // Apply filters based on criteria
            if (criteria.language) {
              query = query.eq('language', criteria.language);
            }
            if (criteria.category) {
              query = query.eq('category', criteria.category);
            }
            if (criteria.subcategory) {
              query = query.eq('subcategory', criteria.subcategory);
            }

            // Apply word count limit
            if (criteria.wordCount) {
              query = query.limit(criteria.wordCount);
            }

            const { data, error } = await query;

            console.log('🔍 [FALLBACK] Criteria-based query result:', {
              dataCount: data?.length || 0,
              error: error?.message,
              sampleData: data?.slice(0, 2)
            });

            // Transform to match the list-based format
            vocabularyData = data?.map((item: any) => ({
              order_position: 1,
              centralized_vocabulary: item
            })) || [];
            vocabularyError = error;
          }
        }

        if (vocabularyError) {
          throw new Error(`Failed to load vocabulary: ${vocabularyError.message}`);
        }

        console.log(`✅ [SERVER] GameAssignmentWrapper - Final result: ${vocabularyData.length} vocabulary items for assignment ${assignmentId}`);
        console.log('🔍 [SERVER] Final vocabulary data sample:', vocabularyData.slice(0, 2));

        if (!vocabularyData || vocabularyData.length === 0) {
          console.error('❌ [SERVER] No vocabulary found after both list-based and criteria-based approaches');
          console.error('🔍 [SERVER] Assignment data:', {
            assignmentId,
            hasVocabularyAssignmentListId: !!assignmentData.vocabulary_assignment_list_id,
            hasVocabularyCriteria: !!assignmentData.vocabulary_criteria,
            vocabularyCriteria: assignmentData.vocabulary_criteria
          });
          throw new Error('No vocabulary found for this assignment');
        }

        // Transform the data
        const transformedAssignment = {
          ...assignmentData,
          class_name: className
        };

        const transformedVocabulary: StandardVocabularyItem[] = vocabularyData?.map((item: any) => ({
          id: item.centralized_vocabulary.id,
          word: item.centralized_vocabulary.word,
          translation: item.centralized_vocabulary.translation,
          category: item.centralized_vocabulary.category,
          subcategory: item.centralized_vocabulary.subcategory,
          part_of_speech: item.centralized_vocabulary.part_of_speech,
          language: item.centralized_vocabulary.language,
          audio_url: item.centralized_vocabulary.audio_url,
          word_type: item.centralized_vocabulary.word_type,
          gender: item.centralized_vocabulary.gender,
          article: item.centralized_vocabulary.article,
          display_word: item.centralized_vocabulary.display_word,
          order_position: item.order_position
        })) || [];

        console.log('📋 [VOCABULARY TRANSFORM] Vocabulary transformation result:', {
          originalVocabularyDataLength: vocabularyData?.length || 0,
          transformedVocabularyLength: transformedVocabulary.length,
          sampleOriginal: vocabularyData?.slice(0, 2),
          sampleTransformed: transformedVocabulary.slice(0, 2),
          assignmentId,
          gameId
        });

        console.log('📋 [VOCABULARY TRANSFORM] About to set vocabulary state...');
        setAssignment(transformedAssignment);
        setVocabulary(transformedVocabulary);
        setLastLoadTime(new Date().toISOString());
        console.log('📋 [VOCABULARY TRANSFORM] Vocabulary state set successfully!', {
          newVocabularyLength: transformedVocabulary.length,
          assignmentId,
          gameId
        });

        // Load sentences for sentence-based games
        const sentenceGameIds = ['sentence-towers', 'case-file-translator', 'lava-temple-word-restore', 'speed-builder'];
        console.log('🔄 [SENTENCES] Checking sentence loading condition:', {
          gameId,
          sentenceGameIds,
          shouldLoadSentences: gameId && sentenceGameIds.includes(gameId),
          hasGameId: !!gameId
        });

        if (gameId && sentenceGameIds.includes(gameId)) {
          console.log('🔄 [SENTENCES] Loading sentences for sentence-based game:', gameId);
          await loadSentencesForAssignment(supabase, transformedAssignment, setSentences);
        } else {
          console.log('🔄 [SENTENCES] Skipping sentence loading - not a sentence-based game or no gameId');
        }
      } catch (err) {
        console.error('❌ [HOOK ERROR] Error loading assignment [DEBUG-v2]:', {
          error: err,
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
          assignmentId,
          timestamp: new Date().toISOString()
        });
        setError(err instanceof Error ? err.message : 'Failed to load assignment');
      } finally {
        setLoading(false);
      }
    };

    if (assignmentId) {
      fetchAssignmentData();
    }
  }, [assignmentId]);

  return { assignment, vocabulary, sentences, loading, error };
};

// Standard assignment wrapper component
export default function GameAssignmentWrapper({
  assignmentId,
  gameId,
  studentId,
  onAssignmentComplete,
  onBackToAssignments,
  onBackToMenu,
  children
}: GameAssignmentWrapperProps) {
  console.log('🚀 [WRAPPER] GameAssignmentWrapper called [DEBUG-v2]:', {
    assignmentId,
    gameId,
    studentId,
    timestamp: new Date().toISOString()
  });

  const { user } = useAuth();
  const router = useRouter();
  const supabase = createBrowserClient();

  const { assignment, vocabulary, sentences, loading, error } = useAssignmentVocabulary(assignmentId, gameId);
  const audioManager = useGlobalAudioContext();

  // Initialize audio context but DON'T start background music
  // (individual games handle their own background music)
  useEffect(() => {
    console.log('🎵 GameAssignmentWrapper: Initializing audio context for assignment games');
    audioManager.initializeAudio().then(() => {
      console.log('🎵 GameAssignmentWrapper: Audio context initialized - games will handle their own music');
      // NOTE: Not starting background music here - individual games handle their own audio
    }).catch(error => {
      console.warn('🎵 GameAssignmentWrapper: Failed to initialize audio:', error);
    });

    // Cleanup function to stop any assignment music when component unmounts
    return () => {
      stopAssignmentBackgroundMusic();
    };
  }, [audioManager]);

  // Background music management for assignment mode
  const startAssignmentBackgroundMusic = () => {
    try {
      // Create and play background music for assignment mode using cross-subdomain audio utility
      const backgroundMusic = createAudio(getAudioUrl('/audio/themes/classic-ambient.mp3'));
      backgroundMusic.loop = true;
      backgroundMusic.volume = 0.3;

      console.log('🎵 GameAssignmentWrapper: Loading background music from:', backgroundMusic.src);

      // Store reference for cleanup
      (window as any).assignmentBackgroundMusic = backgroundMusic;

      backgroundMusic.play().catch(error => {
        console.warn('🎵 GameAssignmentWrapper: Failed to start background music:', error);
      });

      console.log('🎵 GameAssignmentWrapper: Background music started');
    } catch (error) {
      console.warn('🎵 GameAssignmentWrapper: Error creating background music:', error);
    }
  };

  const stopAssignmentBackgroundMusic = () => {
    try {
      const backgroundMusic = (window as any).assignmentBackgroundMusic;
      if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
        (window as any).assignmentBackgroundMusic = null;
        console.log('🎵 GameAssignmentWrapper: Background music stopped');
      }
    } catch (error) {
      console.warn('🎵 GameAssignmentWrapper: Error stopping background music:', error);
    }
  };

  const [gameProgress, setGameProgress] = useState<Partial<GameProgress>>({
    assignmentId,
    gameId,
    studentId: studentId || user?.id,
    wordsCompleted: 0,
    totalWords: 0,
    score: 0,
    maxScore: 0,
    timeSpent: 0,
    accuracy: 0,
    sessionData: {}
  });

  const [startTime] = useState(Date.now());
  const [gemSessionService] = useState(() => new EnhancedGameSessionService(supabase));
  const [gemSessionId, setGemSessionId] = useState<string | null>(null);

  // Theme selection state - only show for games that support themes
  const THEMED_GAMES = ['noughts-and-crosses', 'vocab-blast', 'word-blast', 'hangman'];
  const [showThemeSelector, setShowThemeSelector] = useState(THEMED_GAMES.includes(gameId));
  const [selectedTheme, setSelectedTheme] = useState('default');

  // Initialize gem session when vocabulary is loaded
  useEffect(() => {
    console.log('🔮 [WRAPPER] Gem session initialization check:', {
      vocabularyLength: vocabulary.length,
      hasStudentId: !!(studentId || user?.id),
      studentId: studentId || user?.id,
      gemSessionId,
      shouldInitialize: vocabulary.length > 0 && (studentId || user?.id) && !gemSessionId,
      vocabularySample: vocabulary.slice(0, 2),
      assignmentId,
      gameId
    });

    if (vocabulary.length > 0 && (studentId || user?.id) && !gemSessionId) {
      console.log('🔮 [WRAPPER] Conditions met - initializing gem session...');
      initializeGemSession();
    }

    // Cleanup function to remove window exposure only on unmount or gem session change
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).recordVocabularyInteraction;
        console.log('🔮 [WRAPPER] recordVocabularyInteraction removed from window (cleanup)');
      }
    };
  }, [vocabulary.length, studentId, user?.id, gemSessionId]); // 🔮 CRITICAL FIX: Must depend on vocabulary.length!

  const initializeGemSession = async () => {
    try {
      const sessionId = await gemSessionService.startGameSession({
        student_id: studentId || user?.id || '',
        assignment_id: assignmentId,
        game_type: gameId,
        session_mode: 'assignment',
        max_score_possible: 100,
        session_data: {
          vocabularyCount: vocabulary.length,
          assignmentTitle: assignment?.title
        }
      });

      setGemSessionId(sessionId);
      console.log('🔮 [WRAPPER] Gem session started for assignment:', sessionId);

      // Make vocabulary interaction recorder available to games immediately
      if (typeof window !== 'undefined') {
        (window as any).recordVocabularyInteraction = async (
          wordText: string,
          translationText: string,
          wasCorrect: boolean,
          responseTimeMs: number,
          hintUsed: boolean = false,
          streakCount: number = 1
        ) => {
          const callId = Math.random().toString(36).substr(2, 9);
          console.log(`🔮 [WRAPPER] recordVocabularyInteraction called [${callId}]:`, {
            wordText,
            wasCorrect,
            gameId,
            timestamp: new Date().toISOString()
          });
          if (gemSessionService && sessionId) {
            // Try to resolve centralized_vocabulary UUID from the assignment vocabulary list
            const normalize = (s: string) => (s || '').toString().trim().toLowerCase();
            const wt = normalize(wordText);
            const tt = normalize(translationText);
            let resolvedVocabId: string | undefined = undefined;

            // 🔍 INSTRUMENTATION: Log vocabulary ID resolution attempt
            console.log('🔍 [VOCAB ID RESOLUTION] Attempting to resolve vocabulary ID:', {
              wordText,
              translationText,
              normalizedWord: wt,
              normalizedTranslation: tt,
              vocabularyListLength: vocabulary.length,
              firstVocabItem: vocabulary[0] ? {
                id: (vocabulary[0] as any).id,
                word: (vocabulary[0] as any).word || (vocabulary[0] as any).spanish,
                translation: (vocabulary[0] as any).translation || (vocabulary[0] as any).english
              } : null
            });

            try {
              // Find exact match by word or translation
              const match = vocabulary.find((v) => {
                const vw = normalize((v as any).word || (v as any).spanish || '');
                const vt = normalize((v as any).translation || (v as any).english || '');
                return (vw && vw === wt) || (vt && vt === tt);
              });
              if (match && (match as any).id) {
                resolvedVocabId = (match as any).id;
              }

              // 🔍 INSTRUMENTATION: Log resolution result
              console.log('🔍 [VOCAB ID RESOLUTION] Resolution result:', {
                matchFound: !!match,
                resolvedVocabId,
                matchedItem: match ? {
                  id: (match as any).id,
                  word: (match as any).word || (match as any).spanish,
                  translation: (match as any).translation || (match as any).english
                } : null
              });
            } catch (e) {
              console.warn('Failed to resolve vocabulary ID from assignment list:', e);
            }

            console.log(`🔮 [WRAPPER] About to call gemSessionService.recordWordAttempt [${callId}]...`);
            const gemEvent = await gemSessionService.recordWordAttempt(sessionId, gameId, {
              vocabularyId: resolvedVocabId, // Use UUID when we can resolve it
              wordText,
              translationText,
              responseTimeMs,
              wasCorrect,
              hintUsed,
              streakCount,
              masteryLevel: 1, // Default mastery level
              maxGemRarity: 'common', // Cap at common for luck-based games like memory
              gameMode: 'assignment'
            });

            console.log(`🔮 [WRAPPER] gemSessionService.recordWordAttempt returned [${callId}]:`, {
              gemEvent,
              hasGemEvent: !!gemEvent,
              wasCorrect,
              wordText
            });

            // Show gem feedback if gem was awarded
            if (gemEvent && wasCorrect) {
              console.log(`🔮 ${gameId} earned ${gemEvent.rarity} gem (${gemEvent.xpValue} XP) for "${wordText}" [${callId}]`);
            } else if (wasCorrect) {
              console.log(`🔮 ${gameId} correct answer for "${wordText}" but no gem awarded [${callId}]`);
            } else {
              console.log(`🔮 ${gameId} incorrect answer for "${wordText}" - no gem awarded [${callId}]`);
            }

            return gemEvent;
          }
        };

        console.log('🔮 [WRAPPER] recordVocabularyInteraction function set up for assignment games');

        // Expose the function to window for games to use
        if (typeof window !== 'undefined') {
          (window as any).recordVocabularyInteraction = recordVocabularyInteraction;
          console.log('🔮 [WRAPPER] recordVocabularyInteraction exposed to window');
        }
      }
    } catch (error) {
      console.error('🔮 [WRAPPER] Failed to initialize gem session:', error);
    }
  };

  // Update progress handler
  const handleProgressUpdate = (progress: Partial<GameProgress>) => {
    setGameProgress(prev => ({
      ...prev,
      ...progress,
      timeSpent: Date.now() - startTime
    }));
  };

  // Game completion handler
  const handleGameComplete = async (finalProgress: GameProgress) => {
    console.log('🎯 [DEBUG] handleGameComplete CALLED with assignment ID:', {
      assignmentIdFromProps: assignmentId,
      assignmentIdFromProgress: finalProgress.assignmentId,
      gameId,
      studentId: studentId || user?.id,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Save final progress to database
      const progressData = {
        ...gameProgress,
        ...finalProgress,
        timeSpent: Date.now() - startTime,
        completedAt: new Date()
      };

      console.log('GameAssignmentWrapper - Game completed:', gameId, 'Progress:', finalProgress);
      console.log('GameAssignmentWrapper - Raw values:', {
        score: finalProgress.score,
        accuracy: finalProgress.accuracy,
        scoreType: typeof finalProgress.score,
        accuracyType: typeof finalProgress.accuracy
      });

      // Update individual game progress with safeguards
      const safeGameScore = Math.min(Math.max(finalProgress.score || 0, 0), 999999);
      const safeGameAccuracy = Math.min(Math.max(finalProgress.accuracy || 0, 0), 100);

      console.log('GameAssignmentWrapper - Safe values for game progress:', {
        originalScore: finalProgress.score,
        safeGameScore,
        originalAccuracy: finalProgress.accuracy,
        safeGameAccuracy
      });
      
      // Save assignment progress to database
      try {
        const { error: gameProgressError } = await supabase
          .from('assignment_game_progress')
          .upsert({
            assignment_id: assignmentId,
            student_id: studentId,
            game_id: gameId,
            status: 'completed',
            score: safeGameScore,
            max_score: finalProgress.maxScore || 100,
            accuracy: safeGameAccuracy,
            words_completed: finalProgress.wordsCompleted || 0,
            total_words: finalProgress.totalWords || vocabulary.length,
            time_spent: Math.floor((Date.now() - startTime) / 1000),
            attempts_count: 1,
            completed_at: new Date().toISOString(),
            session_data: finalProgress.sessionData || {}
          }, {
            onConflict: 'assignment_id,student_id,game_id',
            ignoreDuplicates: false
          });

        if (gameProgressError) {
          console.error('Error updating game progress:', gameProgressError);
        } else {
          console.log('Individual game progress saved successfully');

          // Integrate with gem system for assignment games
          if (gemSessionId) {
            try {
              // End the existing gem session
              await gemSessionService.endGameSession(gemSessionId, {
                student_id: studentId || user?.id || '',
                assignment_id: assignmentId,
                game_type: gameId,
                session_mode: 'assignment',
                final_score: finalProgress.score || 0,
                accuracy_percentage: finalProgress.accuracy || 0,
                completion_percentage: 100,
                words_attempted: finalProgress.totalWords || vocabulary.length,
                words_correct: finalProgress.wordsCompleted || 0,
                unique_words_practiced: finalProgress.wordsCompleted || 0,
                duration_seconds: Math.floor((Date.now() - startTime) / 1000),
                session_data: finalProgress.sessionData || {}
              });

              console.log('🔮 [WRAPPER] Gem session completed for assignment game');
            } catch (error) {
              console.error('🔮 [WRAPPER] Failed to end gem session:', error);
            }
          }
        }
      } catch (err) {
        console.error('Error updating assignment progress:', err);
      }

      // Check if all games in the assignment are completed
      const { data: allGameProgress, error: checkError } = await supabase
        .from('assignment_game_progress')
        .select('game_id, status, score, total_words, words_completed, time_spent')
        .eq('assignment_id', assignmentId)
        .eq('student_id', studentId);

      if (!checkError && allGameProgress && assignment) {
        // Get the list of games from assignment config - fix the path
        const assignmentGames = assignment.game_config?.gameConfig?.selectedGames || assignment.game_config?.selectedGames || [];
        const completedGames = allGameProgress.filter(g => g.status === 'completed').map(g => g.game_id);

        console.log('🎮 Assignment games from config:', assignmentGames);
        console.log('✅ Completed games:', completedGames);
        console.log('📊 Progress:', `${completedGames.length}/${assignmentGames.length} games completed`);

        // Check if all games are completed
        const allGamesCompleted = assignmentGames.length > 0 && assignmentGames.every((gameId: string) => completedGames.includes(gameId));

        // Calculate cumulative score and stats from all completed games
        const totalScore = allGameProgress.reduce((sum, game) => sum + (game.score || 0), 0);
        const totalWords = allGameProgress.reduce((sum, game) => sum + (game.total_words || 0), 0);
        const totalCorrect = allGameProgress.reduce((sum, game) => sum + (game.words_completed || 0), 0);
        const totalTimeSpent = allGameProgress.reduce((sum, game) => sum + (game.time_spent || 0), 0);
        const cumulativeAccuracy = totalWords > 0 ? (totalCorrect / totalWords) * 100 : 0;

        const safeScore = Math.min(Math.max(totalScore, 0), 99999.99);
        const safeAccuracy = Math.min(Math.max(cumulativeAccuracy, 0), 999.99);

        const assignmentStatus = allGamesCompleted ? 'completed' : 'in_progress';
        const completedAt = allGamesCompleted ? new Date().toISOString() : null;

        console.log(`🎯 Assignment status: ${assignmentStatus} (${completedGames.length}/${assignmentGames.length} games completed)`);

        console.log('GameAssignmentWrapper - Saving assignment progress:', {
          status: assignmentStatus,
          currentGameScore: finalProgress.score,
          cumulativeScore: totalScore,
          safeScore,
          currentGameAccuracy: finalProgress.accuracy,
          cumulativeAccuracy,
          safeAccuracy,
          totalWords,
          totalCorrect,
          totalTimeSpent,
          assignmentId,
          studentId,
          completedGames: completedGames.length,
          totalGames: assignmentGames.length
        });

        const { error: assignmentProgressError } = await supabase
          .from('enhanced_assignment_progress')
          .upsert({
            assignment_id: assignmentId,
            student_id: studentId,
            status: assignmentStatus,
            completed_at: completedAt,
            attempts_count: completedGames.length,
            total_time_spent: totalTimeSpent,
            progress_data: {
              ...finalProgress,
              completedGames: completedGames,
              totalGames: assignmentGames.length,
              cumulativeScore: totalScore,
              cumulativeAccuracy: cumulativeAccuracy
            },
            best_score: safeScore,
            best_accuracy: safeAccuracy,
            words_mastered: totalCorrect,
            session_count: completedGames.length
          }, {
            onConflict: 'assignment_id,student_id'
          });

        if (assignmentProgressError) {
          console.error('Error updating assignment progress:', assignmentProgressError);
        } else {
          if (allGamesCompleted) {
            console.log('🎉 Overall assignment marked as COMPLETE!');
          } else {
            console.log('📝 Assignment progress updated - still IN PROGRESS');
          }
        }
      }

      // Call parent completion handler
      onAssignmentComplete(progressData as GameProgress);
    } catch (err) {
      console.error('Error saving assignment progress:', err);
      // Still call completion handler even if save fails
      onAssignmentComplete(finalProgress);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-xl">Loading assignment...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-pink-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-4">Assignment Error</h1>
          <p className="text-lg mb-6">{error || 'Assignment not found'}</p>
          <div className="space-y-3">
            <button
              onClick={onBackToAssignments}
              className="w-full bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Back to Assignments
            </button>
            {onBackToMenu && (
              <button
                onClick={onBackToMenu}
                className="w-full bg-white/20 text-white px-6 py-3 rounded-lg hover:bg-white/30 transition-colors"
              >
                Back to Game Menu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Handle theme selection
  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    setShowThemeSelector(false);
  };

  // Show theme selector for themed games
  if (showThemeSelector) {
    const gameTitle = gameId === 'noughts-and-crosses' ? 'Noughts and Crosses' :
                     gameId === 'vocab-blast' ? 'Vocab Blast' :
                     gameId === 'word-blast' ? 'Word Blast' :
                     gameId === 'hangman' ? 'Hangman' : 'Game';

    return (
      <UniversalThemeSelector
        onThemeSelect={handleThemeSelect}
        gameTitle={gameTitle}
        availableThemes={['default', 'tokyo', 'pirate', 'space', 'temple']}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
      {/* Assignment Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBackToAssignments}
              className="flex items-center text-white hover:text-blue-200 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Assignments
            </button>
            
            <div className="text-center text-white">
              <h1 className="text-xl font-bold">{assignment.title}</h1>
              <p className="text-blue-200 text-sm">{assignment.description}</p>
            </div>

            <div className="flex items-center space-x-4 text-white text-sm">
              {assignment.class_name && (
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {assignment.class_name}
                </div>
              )}
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                {vocabulary.length} words
              </div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                Due: {new Date(assignment.due_date).toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Content */}
      <div className="flex-1">
        {children({
          assignment,
          vocabulary,
          sentences,
          onProgressUpdate: handleProgressUpdate,
          onGameComplete: handleGameComplete,
          gameSessionId: gemSessionId,
          gameService: gemSessionService,
          selectedTheme
        })}
      </div>
    </div>
  );
}

// Utility function for calculating standard scores
export const calculateStandardScore = (
  correct: number,
  total: number,
  timeSpent: number,
  basePointsPerWord: number = 100
): { score: number; accuracy: number; maxScore: number } => {
  const accuracy = total > 0 ? (correct / total) * 100 : 0;
  const timeBonus = Math.max(0, 1 - (timeSpent / (total * 30000))); // 30 seconds per word baseline
  const score = Math.round(correct * basePointsPerWord * (1 + timeBonus * 0.5));
  const maxScore = total * basePointsPerWord * 1.5; // Max with full time bonus

  return { score, accuracy, maxScore };
};

// Unified progress recording function
export const recordAssignmentProgress = async (
  assignmentId: string,
  gameId: string,
  studentId: string,
  progressData: GameProgress
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch('/api/assignments/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assignmentId,
        gameId,
        studentId,
        completed: !!progressData.completedAt,
        score: progressData.score,
        accuracy: progressData.accuracy,
        timeSpent: progressData.timeSpent,
        wordsCompleted: progressData.wordsCompleted || 0,
        totalWords: progressData.totalWords || 0,
        sessionData: progressData.sessionData || {},
        metadata: {
          gameType: gameId,
          attempts: 1
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to record progress');
    }

    return { success: true };
  } catch (error) {
    console.error('Error recording assignment progress:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};
