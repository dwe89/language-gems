'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { GameConfig } from './LavaTempleWordRestoreGame';
import { EnhancedGameService } from '../../../../services/enhancedGameService';
import { createAudio } from '@/utils/audioUtils';
import { EnhancedGameSessionService } from '../../../../services/rewards/EnhancedGameSessionService';
import { useDictationGame } from '../../../../hooks/useSentenceGame';
import { Settings, VolumeX, Volume2, Castle, AlertTriangle, ArrowLeft } from 'lucide-react';
import InGameConfigPanel from '../../../../components/games/InGameConfigPanel';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface WordRestoreSentence {
  id: string;
  complete_sentence: string;
  sentence_with_gaps: string;
  missing_words: string[];
  gap_positions: number[];
  temple_context: string;
  restoration_prompt: string;
  temple_difficulty: number;
}

interface WordOption {
  id: string;
  sentence_id: string;
  gap_index: number;
  option_text: string;
  is_correct: boolean;
  explanation?: string;
}

interface TempleRestorationProps {
  gameConfig: GameConfig;
  onRestorationComplete: (results: any) => void;
  onBackToMenu: () => void;
  gameSessionId?: string | null;
  gameService?: EnhancedGameService | null;
  onOpenSettings?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
}

export default function TempleRestoration({
  gameConfig,
  onRestorationComplete,
  onBackToMenu,
  gameSessionId,
  gameService,
  onOpenSettings,
  isMuted = false,
  onToggleMute
}: TempleRestorationProps) {
  // Initialize sentence game service for vocabulary tracking
  const sentenceGame = useDictationGame(
    gameSessionId || `lava-temple-${Date.now()}`,
    gameConfig.language
  );

  console.log(`🎯 TempleRestoration: sentenceGame initialized:`, {
    processSentence: typeof sentenceGame.processSentence,
    sessionId: gameSessionId || `lava-temple-${Date.now()}`,
    language: gameConfig.language
  });

  const [sentences, setSentences] = useState<any[]>([]);
  const [currentSentence, setCurrentSentence] = useState<any>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [wordOptions, setWordOptions] = useState<{ [gapIndex: number]: WordOption[] }>({});
  const [selectedWords, setSelectedWords] = useState<{ [gapIndex: number]: string }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameStartTime] = useState(Date.now());
  const [gapFillStartTime, setGapFillStartTime] = useState<number>(0);
  const [contextCluesUsed, setContextCluesUsed] = useState(0);

  // Audio refs
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
  const templePowerRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio
  useEffect(() => {
    if (typeof window !== 'undefined') {
      backgroundMusicRef.current = createAudio('/audio/themes/lava-temple-ambient.mp3');
      correctSoundRef.current = createAudio('/audio/sfx/correct-answer.mp3');
      incorrectSoundRef.current = createAudio('/audio/sfx/wrong-answer.mp3');
      templePowerRef.current = createAudio('/audio/sfx/temple-power.mp3');

      // Setup background music
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.loop = true;
        backgroundMusicRef.current.volume = 0.3;
      }
    }

    return () => {
      // Cleanup audio
      [backgroundMusicRef, correctSoundRef, incorrectSoundRef, templePowerRef].forEach(ref => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);

  // Start background music on first user interaction
  const ensureBackgroundMusic = async () => {
    if (backgroundMusicRef.current && backgroundMusicRef.current.paused) {
      try {
        await backgroundMusicRef.current.play();
      } catch (error) {
        console.log('Background music autoplay prevented:', error);
      }
    }
  };

  // Load sentences and options
  useEffect(() => {
    const loadSentences = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('Loading sentences for:', gameConfig);

        // Use language directly since database stores full language names
        const dbLanguage = gameConfig.language;

        // Load sentences from the generic sentences table
        let query = supabase
          .from('sentences')
          .select('*')
          .eq('source_language', dbLanguage)
          .eq('difficulty_level', gameConfig.difficulty)
          .eq('curriculum_level', 'KS3')
          .eq('is_active', true)
          .eq('is_public', true);

        // Map assignment categories to sentence table categories
        const categoryMapping: Record<string, string> = {
          'food': 'basics_core_language',
          'family': 'basics_core_language',
          'school': 'basics_core_language',
          'hobbies': 'basics_core_language',
          'assignment': 'basics_core_language' // Default for assignments
        };

        // Use mapped category or default to basics_core_language
        const mappedCategory = gameConfig.category ?
          (categoryMapping[gameConfig.category] || 'basics_core_language') :
          'basics_core_language';

        query = query.eq('category', mappedCategory);

        // For subcategory, if it's 'assignment' or not found, don't filter by subcategory
        // This allows broader sentence selection for assignments
        if (gameConfig.subcategory && gameConfig.subcategory !== 'assignment') {
          query = query.eq('subcategory', gameConfig.subcategory);
        }

        const { data: sentenceData, error: sentenceError } = await query.limit(10);

        if (sentenceError) {
          throw sentenceError;
        }

        if (!sentenceData || sentenceData.length === 0) {
          throw new Error('No sentences found for this configuration.');
        }

        console.log(`Found ${sentenceData.length} sentences`);
        setSentences(sentenceData);

        // Generate gaps and options for the first sentence
        await generateGapsAndOptions(sentenceData[0]);

      } catch (err) {
        console.error('Error loading sentences:', err);
        setError(err instanceof Error ? err.message : 'Failed to load sentences');
      } finally {
        setLoading(false);
      }
    };

    loadSentences();
  }, [gameConfig]);

  // Set gap fill start time when sentence changes
  useEffect(() => {
    if (currentSentence && !showFeedback) {
      setGapFillStartTime(Date.now());
    }
  }, [currentSentenceIndex, currentSentence, showFeedback]);

  // Generate gaps and options dynamically from sentence content
  const generateGapsAndOptions = async (sentence: any) => {
    try {
      const words = sentence.source_sentence.split(' ');
      const numGaps = Math.min(3, Math.max(1, Math.floor(words.length / 4))); // 1-3 gaps based on length

      // Select strategic words to remove (avoid articles, prepositions, etc.)
      const strategicWords = words.filter((word, index) => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/, '');
        // Skip very short words and common articles/prepositions
        const skipWords = ['el', 'la', 'los', 'las', 'un', 'una', 'de', 'en', 'a', 'y', 'o', 'con', 'por', 'para',
                          'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'avec', 'pour', 'par',
                          'der', 'die', 'das', 'ein', 'eine', 'und', 'oder', 'mit', 'für', 'von', 'zu', 'in'];
        return cleanWord.length > 2 && !skipWords.includes(cleanWord);
      });

      // Randomly select gaps from strategic words
      const selectedIndices: number[] = [];
      const gapWords: string[] = [];

      for (let i = 0; i < numGaps && strategicWords.length > 0; i++) {
        const randomWord = strategicWords[Math.floor(Math.random() * strategicWords.length)];
        const wordIndex = words.findIndex((w, idx) =>
          w === randomWord && !selectedIndices.includes(idx)
        );

        if (wordIndex !== -1) {
          selectedIndices.push(wordIndex);
          gapWords.push(randomWord.replace(/[.,!?;:]/, '')); // Clean punctuation
        }
      }

      // Generate distractors for each gap word
      const generateDistractors = (correctWord: string, language: string): string[] => {
        // This is a simplified distractor generation - in a real app you'd want more sophisticated logic
        const commonDistracters: { [key: string]: string[] } = {
          'es': ['casa', 'gato', 'perro', 'agua', 'comida', 'tiempo', 'persona', 'lugar', 'cosa', 'día'],
          'fr': ['maison', 'chat', 'chien', 'eau', 'nourriture', 'temps', 'personne', 'lieu', 'chose', 'jour'],
          'de': ['Haus', 'Katze', 'Hund', 'Wasser', 'Essen', 'Zeit', 'Person', 'Ort', 'Sache', 'Tag']
        };

        const distractors = commonDistracters[language] || commonDistracters['es'];
        return distractors
          .filter(word => word !== correctWord.toLowerCase())
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      };

      // Create options for each gap
      const groupedOptions: { [gapIndex: number]: WordOption[] } = {};

      selectedIndices.forEach((wordIndex, gapIndex) => {
        const correctWord = gapWords[gapIndex];
        const distractors = generateDistractors(correctWord, sentence.source_language);

        const options: WordOption[] = [
          {
            id: `${sentence.id}-${gapIndex}-correct`,
            sentence_id: sentence.id,
            gap_index: gapIndex,
            option_text: correctWord,
            is_correct: true,
            explanation: `Correct word for gap ${gapIndex + 1}`
          },
          ...distractors.map((distractor, idx) => ({
            id: `${sentence.id}-${gapIndex}-${idx}`,
            sentence_id: sentence.id,
            gap_index: gapIndex,
            option_text: distractor,
            is_correct: false,
            explanation: `Incorrect option for gap ${gapIndex + 1}`
          }))
        ];

        // Shuffle options
        groupedOptions[gapIndex] = options.sort(() => Math.random() - 0.5);
      });

      setWordOptions(groupedOptions);
      setSelectedWords({}); // Reset selections

      // Store gap information for rendering
      setCurrentSentence({
        ...sentence,
        gapIndices: selectedIndices,
        gapWords: gapWords
      });

    } catch (err) {
      console.error('Error generating gaps and options:', err);
      setError('Failed to generate word options');
    }
  };

  // Handle word selection
  const handleWordSelect = async (gapIndex: number, word: string) => {
    await ensureBackgroundMusic();
    
    setSelectedWords(prev => ({
      ...prev,
      [gapIndex]: word
    }));
  };

  // Check if all gaps are filled
  const areAllGapsFilled = () => {
    if (!currentSentence || !currentSentence.gapIndices) return false;
    const gapCount = currentSentence.gapIndices.length;
    return Object.keys(selectedWords).length === gapCount;
  };

  // Submit restoration attempt
  const handleSubmitRestoration = async () => {
    if (!areAllGapsFilled()) return;

    if (!currentSentence) return;
    let correct = true;
    const responseTime = gapFillStartTime > 0 ? Date.now() - gapFillStartTime : 0;

    // Check each selected word against the correct options and log performance
    for (let gapIndex = 0; gapIndex < currentSentence.gapIndices.length; gapIndex++) {
      const selectedWord = selectedWords[gapIndex];
      const correctOption = wordOptions[gapIndex]?.find(option => option.is_correct);
      const isGapCorrect = selectedWord && correctOption && selectedWord === correctOption.option_text;

      if (!isGapCorrect) {
        correct = false;
      }

      // Record word practice with FSRS system for each gap
      if (correctOption?.option_text) {
        try {
          // Don't use random UUID - this causes foreign key violations!
          // Instead, try to find the actual vocabulary ID from the database
          // For now, use null to avoid foreign key errors
          const wordData = {
            id: null, // Will be handled by the service
            word: correctOption.option_text,
            translation: correctOption.option_text, // In fill-in-blank, word and translation are the same
            language: gameConfig.language === 'spanish' ? 'es' : gameConfig.language === 'french' ? 'fr' : 'de'
          };

          // Calculate confidence based on fill-in-blank accuracy and context
          const baseConfidence = isGapCorrect ? 0.8 : 0.2; // High confidence for fill-in-blank when correct
          const contextBonus = currentSentence.temple_context ? 0.1 : 0; // Bonus for context clues
          const confidence = Math.min(0.95, baseConfidence + contextBonus);

          // Record practice with FSRS using EnhancedGameSessionService
          if (gameSessionId) {
            const sessionService = new EnhancedGameSessionService();
            const gemEvent = await sessionService.recordWordAttempt(gameSessionId, 'lava-temple-word-restore', {
              vocabularyId: wordData.id,
              wordText: wordData.word,
              translationText: wordData.translation,
              responseTimeMs: responseTime * 1000,
              wasCorrect: isGapCorrect,
              hintUsed: currentSentence.temple_context ? true : false,
              streakCount: correctAnswers,
              masteryLevel: isGapCorrect ? 2 : 0,
              maxGemRarity: 'rare', // Fill-in-blank is skill-based
              gameMode: 'fill_in_blank',
              difficultyLevel: gameConfig.difficulty || 'intermediate'
            });

            if (gemEvent) {
              console.log(`✅ Lava Temple gem awarded for gap ${gapIndex} (${correctOption.option_text}): ${gemEvent.rarity} (${gemEvent.xpValue} XP)`);
            }
          }
        } catch (error) {
          console.error('Error recording FSRS practice for gap:', error);
        }
      }

      // Process sentence with new vocabulary tracking system
      if (isGapCorrect && currentSentence) {
        try {
          // Use multiple fallbacks for sentence text to avoid undefined
          const sentenceText = currentSentence.complete_sentence ||
                              currentSentence.source_sentence ||
                              currentSentence.sentence ||
                              'Unknown sentence';

          // Only process if we have a valid sentence
          if (sentenceText && sentenceText !== 'Unknown sentence') {
            console.log(`TempleRestoration: About to call sentenceGame.processSentence with "${sentenceText}"`);

            // Process sentence in background (non-blocking)
            setTimeout(async () => {
              try {
                const result = await sentenceGame.processSentence(
                  sentenceText,
                  true, // Gap fill success counts as correct sentence understanding
                  responseTime,
                  currentSentence.temple_context ? true : false, // Context clues count as hints
                  currentSentence.id
                );
                console.log(`TempleRestoration: Got result from processSentence:`, result);

                if (result) {
                  console.log(`Lava Temple: Processed sentence "${sentenceText}"`);
                  console.log(`Vocabulary matches: ${result.vocabularyMatches?.length || 0}`);
                  console.log(`Gems awarded: ${result.totalGems || result.gemsAwarded || 0}`);
                  console.log(`XP earned: ${result.totalXP || result.xpEarned || 0}`);
                  console.log(`Coverage: ${result.coveragePercentage || 0}%`);

                  // Log individual vocabulary matches with safe array check
                  if (result.gemsAwarded && Array.isArray(result.gemsAwarded)) {
                    result.gemsAwarded.forEach((gem, index) => {
                      console.log(`  ${index + 1}. "${gem.word}" → ${gem.gemRarity} gem (+${gem.xpAwarded} XP)`);
                    });
                  } else if (result.vocabularyMatches && Array.isArray(result.vocabularyMatches)) {
                    result.vocabularyMatches.forEach((match, index) => {
                      console.log(`  ${index + 1}. "${match.word}" → vocabulary match`);
                    });
                  }
                } else {
                  console.log('Lava Temple: No sentence processing result returned');
                }
              } catch (sentenceError) {
                console.error('Error calling sentenceGame.processSentence:', sentenceError);
              }
            }, 0);
          }
        } catch (error) {
          console.error('Error processing sentence with vocabulary tracking:', error);
        }
      }

      // Log word-level performance for each gap if game service is available (legacy system)
      if (gameService && gameSessionId) {
        try {
          await gameService.logWordPerformance({
            session_id: gameSessionId,
            word_text: correctOption?.option_text || '',
            translation_text: correctOption?.option_text || '',
            language_pair: 'english_spanish', // Default for temple restoration
            attempt_number: 1, // Each gap is attempted once per submission
            response_time_ms: responseTime,
            was_correct: isGapCorrect,
            difficulty_level: gameConfig.difficulty || 'intermediate',
            hint_used: currentSentence.temple_context ? true : false,
            streak_count: correctAnswers,
            previous_attempts: 0,
            mastery_level: isGapCorrect ? 2 : 0,
            error_type: isGapCorrect ? undefined : 'fill_in_blank_error',
            grammar_concept: 'fill_in_blank_skills',
            error_details: isGapCorrect ? undefined : {
              selectedWord: selectedWord,
              correctWord: correctOption?.option_text,
              gapIndex: gapIndex,
              sentenceContext: currentSentence.source_sentence,
              templeContext: currentSentence.temple_context,
              difficulty: gameConfig.difficulty
            }
          });
        } catch (error) {
          console.error('Failed to log gap fill performance:', error);
        }
      }
    }

    setTotalAttempts(prev => prev + 1);
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      setCorrectAnswers(prev => prev + 1);
      // Base score on difficulty level
      const difficultyMultiplier = gameConfig.difficulty === 'advanced' ? 15 :
                                   gameConfig.difficulty === 'intermediate' ? 12 : 10;
      setScore(prev => prev + difficultyMultiplier);
      
      // Play success sound
      if (correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play().catch(console.log);
      }
      
      // Play temple power sound for extra effect
      if (templePowerRef.current) {
        setTimeout(() => {
          templePowerRef.current!.currentTime = 0;
          templePowerRef.current!.play().catch(console.log);
        }, 500);
      }
    } else {
      // Play incorrect sound
      if (incorrectSoundRef.current) {
        incorrectSoundRef.current.currentTime = 0;
        incorrectSoundRef.current.play().catch(console.log);
      }
    }

    // Auto-advance after feedback
    setTimeout(() => {
      setShowFeedback(false);
      
      if (currentSentenceIndex < sentences.length - 1) {
        // Move to next sentence
        const nextIndex = currentSentenceIndex + 1;
        setCurrentSentenceIndex(nextIndex);
        generateGapsAndOptions(sentences[nextIndex]);
      } else {
        // Game complete
        const gameEndTime = Date.now();
        const results = {
          score,
          correctAnswers,
          totalAttempts,
          accuracy: totalAttempts > 0 ? (correctAnswers / totalAttempts) * 100 : 0,
          duration: Math.floor((gameEndTime - gameStartTime) / 1000),
          tabletsRestored: correctAnswers,
          language: gameConfig.language,
          difficulty: gameConfig.difficulty
        };
        
        onRestorationComplete(results);
      }
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Castle className="h-16 w-16" />
          </motion.div>
          <p className="text-xl text-orange-200">Loading ancient tablets...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center bg-black/50 p-8 rounded-xl border border-red-500/50">
          <div className="text-4xl mb-4 flex justify-center">
            <AlertTriangle className="h-16 w-16 text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-red-400 mb-4">Temple Access Denied</h3>
          <p className="text-red-200 mb-6">{error}</p>
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Return to Surface
          </button>
        </div>
      </div>
    );
  }

  if (!currentSentence) return null;

  return (
    <div className="min-h-screen p-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="text-white">
            <h2 className="text-2xl font-bold text-yellow-400">Temple Restoration</h2>
            <p className="text-orange-200">
              Tablet {currentSentenceIndex + 1} of {sentences.length}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right text-white">
              <div className="text-lg">Score: <span className="text-yellow-400 font-bold">{score}</span></div>
              <div className="text-sm text-orange-200">
                Restored: {correctAnswers}/{totalAttempts}
              </div>
            </div>

            {/* Game Controls */}
            <div className="flex items-center gap-2">
              {/* Mute Button */}
              {onToggleMute && (
                <button
                  onClick={onToggleMute}
                  className="bg-black/40 backdrop-blur-sm text-orange-400 p-2 rounded-lg hover:bg-black/60 transition-colors"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
              )}

              {/* Game Settings Button */}
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  className="bg-black/40 backdrop-blur-sm text-orange-400 px-3 py-2 rounded-lg hover:bg-black/60 transition-colors flex items-center gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Game Settings
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Temple Context */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 rounded-xl p-6 mb-8 border border-orange-600/30"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">📜</span>
            <h3 className="text-lg font-bold text-yellow-400">Archaeological Discovery</h3>
          </div>
          <p className="text-orange-200 mb-2">
            Ancient inscriptions discovered in the volcanic temple ruins. Some words have been eroded by time and lava flows.
          </p>
          <p className="text-yellow-300 font-medium">
            Study the context and restore the missing words to unlock the temple's secrets.
          </p>
        </motion.div>

        {/* Main Tablet */}
        <div className="flex justify-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-stone-600 to-stone-800 rounded-2xl p-8 border-4 border-stone-700 shadow-2xl max-w-4xl w-full"
            style={{
              backgroundImage: 'radial-gradient(circle at 30% 20%, rgba(139, 69, 19, 0.3), transparent), radial-gradient(circle at 70% 80%, rgba(160, 82, 45, 0.2), transparent)',
            }}
          >
            {/* Sentence with gaps */}
            <div className="text-center mb-8">
              <div className="text-2xl md:text-3xl font-bold text-yellow-100 leading-relaxed">
                {currentSentence.source_sentence.split(' ').map((word, index) => {
                  // Check if this word index should be a gap
                  const gapIndex = currentSentence.gapIndices?.indexOf(index);
                  if (gapIndex !== -1 && gapIndex !== undefined) {
                    const selectedWord = selectedWords[gapIndex];

                    return (
                      <span key={index} className="inline-block mx-1">
                        <span className={`inline-block min-w-[120px] px-4 py-2 rounded-lg border-2 border-dashed ${
                          selectedWord
                            ? 'border-yellow-400 bg-yellow-400/20 text-yellow-300'
                            : 'border-orange-400 bg-orange-400/10 text-orange-300'
                        }`}>
                          {selectedWord || '___'}
                        </span>
                      </span>
                    );
                  }
                  return <span key={index} className="mx-1">{word}</span>;
                })}
              </div>
            </div>

            {/* Word Options */}
            <div className="space-y-6">
              {Object.entries(wordOptions).map(([gapIndexStr, options]) => {
                const gapIndex = parseInt(gapIndexStr);
                return (
                  <div key={gapIndex} className="text-center">
                    <h4 className="text-lg font-bold text-yellow-400 mb-4">
                      Select word for gap {gapIndex + 1}:
                    </h4>
                    <div className="flex flex-wrap justify-center gap-3">
                      {options.map((option) => (
                        <motion.button
                          key={option.id}
                          onClick={() => handleWordSelect(gapIndex, option.option_text)}
                          className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                            selectedWords[gapIndex] === option.option_text
                              ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/50'
                              : 'bg-orange-600/80 text-white hover:bg-orange-500 border border-orange-400'
                          }`}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {option.option_text}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="text-center mt-8">
              <motion.button
                onClick={handleSubmitRestoration}
                disabled={!areAllGapsFilled()}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                  areAllGapsFilled()
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400 shadow-lg'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={areAllGapsFilled() ? { scale: 1.05 } : {}}
                whileTap={areAllGapsFilled() ? { scale: 0.95 } : {}}
              >
                <Castle className="h-5 w-5 mr-2" />
                Restore Inscription
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={onBackToMenu}
            className="px-6 py-3 bg-black/50 text-orange-200 border border-orange-600/50 hover:bg-orange-600/20 hover:border-orange-400 rounded-xl transition-all duration-300"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Exit Temple
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className={`bg-gradient-to-b p-8 rounded-2xl border-4 text-center max-w-md mx-4 ${
                isCorrect 
                  ? 'from-green-800 to-green-900 border-green-500' 
                  : 'from-red-800 to-red-900 border-red-500'
              }`}
            >
              <div className="text-6xl mb-4">
                {isCorrect ? '✨' : '💥'}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {isCorrect ? 'Inscription Restored!' : 'Restoration Failed'}
              </h3>
              <p className="text-lg text-white/90 mb-4">
                {isCorrect 
                  ? 'The ancient text glows with renewed power!' 
                  : 'The tablet remains incomplete. Study the context more carefully.'}
              </p>
              {isCorrect && (
                <div className="text-yellow-400 font-bold">
                  +{gameConfig.difficulty === 'advanced' ? 15 :
                    gameConfig.difficulty === 'intermediate' ? 12 : 10} points
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
