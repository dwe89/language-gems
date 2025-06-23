'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { useSupabase } from '../../../../components/supabase/SupabaseProvider';
import { VocabularyMiningService } from '../../../../services/vocabulary-mining';
import { 
  VocabularyGem, 
  GemCollection, 
  SessionType,
  GemType 
} from '../../../../types/vocabulary-mining';
import { 
  calculatePointsEarned,
  getGemInfo,
  determinePerformanceQuality 
} from '../../../../utils/vocabulary-mining';
import { 
  Pickaxe, 
  Star, 
  Clock, 
  Target, 
  Zap,
  CheckCircle,
  XCircle,
  ArrowRight,
  Home,
  RotateCcw,
  Mic,
  Volume2,
  Headphones,
  GamepadIcon,
  Brain,
  Trophy,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import GemMiningGame from '../../../../components/vocabulary-mining/GemMiningGame';

interface PracticeSession {
  sessionId: string;
  currentGem: VocabularyGem | null;
  currentIndex: number;
  totalGems: number;
  correctAnswers: number;
  startTime: Date;
  sessionGems: VocabularyGem[];
  theme?: string;
  topic?: string;
  streak: number;
  mode: 'learn' | 'review' | 'match' | 'voice';
}

interface MatchPair {
  id: string;
  term: string;
  translation: string;
  matched: boolean;
}

function VocabularyMiningPracticeContent() {
  const { user } = useAuth();
  const { supabase } = useSupabase();
  const [miningService] = useState(() => new VocabularyMiningService(supabase));
  const searchParams = useSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [responseTime, setResponseTime] = useState(0);
  const [autoAdvanceTimer, setAutoAdvanceTimer] = useState<NodeJS.Timeout | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    totalTime: 0,
    accuracy: 0,
    gemsCollected: 0,
    pointsEarned: 0
  });
  const [answerKey, setAnswerKey] = useState(0);
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [choices, setChoices] = useState<string[]>([]);
  
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [voiceMode, setVoiceMode] = useState(false);
  
  // Audio enhancement state
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [voiceGender, setVoiceGender] = useState<'male' | 'female'>('female');
  
  // Match mode state
  const [matchMode, setMatchMode] = useState(false);
  const [matchPairs, setMatchPairs] = useState<MatchPair[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null);

  // Get theme and topic from URL parameters
  const selectedTheme = searchParams?.get('theme');
  const selectedTopic = searchParams?.get('topic');
  const initialMode = searchParams?.get('mode') as 'learn' | 'review' | 'match' | 'voice' || 'learn';

  // Initialize speech recognition and cleanup
  useEffect(() => {
    if (user) {
      initializePracticeSession();
    }
    
    // Initialize speech recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserAnswer(transcript);
        setIsListening(false);
      };
      
      recognition.onerror = () => {
        setIsListening(false);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognition);
    }
    
    // Cleanup timer on unmount
    return () => {
      if (autoAdvanceTimer) {
        clearTimeout(autoAdvanceTimer);
      }
    };
  }, [user]);

  // Set question start time when new question appears
  useEffect(() => {
    if (session?.currentGem && !showResult) {
      setQuestionStartTime(new Date());
    }
  }, [session?.currentGem, showResult]);

  // Enhanced TTS with better voice selection and speed control
  useEffect(() => {
    if (session?.currentGem && audioEnabled) {
      speakText(session.currentGem.term, 'es-ES');
    }
  }, [session?.currentGem, audioEnabled, playbackSpeed, voiceGender]);

  // Adaptive question mode decision
  useEffect(() => {
    if (session?.currentGem && session.mode === 'learn') {
      const mLevel = (session.currentGem as any).masteryLevel || 0;
      const useMC = mLevel < 2 || Math.random() < 0.3;
      setIsMultipleChoice(useMC);
      if (useMC) {
        generateChoices(session.currentGem);
      }
    }
  }, [session?.currentGem, session?.mode]);

  const speakText = (text: string, lang: string = 'en-US') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Try to get a specific voice based on language and gender preference
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let preferredVoice = voices.find(voice => {
          const langMatch = voice.lang.startsWith(lang.split('-')[0]);
          const genderMatch = voiceGender === 'female' ? 
            voice.name.toLowerCase().includes('female') || 
            voice.name.toLowerCase().includes('woman') ||
            voice.name.toLowerCase().includes('zira') ||
            voice.name.toLowerCase().includes('maria') :
            voice.name.toLowerCase().includes('male') || 
            voice.name.toLowerCase().includes('man') ||
            voice.name.toLowerCase().includes('diego') ||
            voice.name.toLowerCase().includes('david');
          return langMatch && genderMatch;
        });
        
        // Fallback to any voice with the correct language
        if (!preferredVoice) {
          preferredVoice = voices.find(voice => voice.lang.startsWith(lang.split('-')[0]));
        }
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateChoices = (gem: VocabularyGem) => {
    if (!session) return;
    const translations = session.sessionGems.map(g => g.translation).filter(t => t !== gem.translation);
    const randomTranslations = translations.sort(() => 0.5 - Math.random()).slice(0, 3);
    const allOptions = [...randomTranslations, gem.translation].sort(() => 0.5 - Math.random());
    setChoices(allOptions);
  };

  const initializeMatchMode = () => {
    if (!session) return;
    
    const pairs: MatchPair[] = session.sessionGems.slice(0, 6).map(gem => ({
      id: gem.id,
      term: gem.term,
      translation: gem.translation,
      matched: false
    }));
    
    setMatchPairs(pairs);
    setMatchMode(true);
    setSession(prev => prev ? {...prev, mode: 'match'} : null);
  };

  const handleMatchSelection = (type: 'term' | 'translation', value: string) => {
    if (type === 'term') {
      setSelectedTerm(selectedTerm === value ? null : value);
    } else {
      setSelectedTranslation(selectedTranslation === value ? null : value);
    }
    
    // Check for match
    if ((type === 'term' && selectedTranslation) || (type === 'translation' && selectedTerm)) {
      const termToCheck = type === 'term' ? value : selectedTerm;
      const translationToCheck = type === 'translation' ? value : selectedTranslation;
      
      const pair = matchPairs.find(p => p.term === termToCheck && p.translation === translationToCheck);
      
      if (pair) {
        // Correct match - play success sound and update
        speakText("Correct!", 'en-US');
        setMatchPairs(prev => prev.map(p => 
          p.id === pair.id ? { ...p, matched: true } : p
        ));
        setSelectedTerm(null);
        setSelectedTranslation(null);
        setAnswerKey(prev => prev + 1);
        
        // Check if all matched
        const remainingPairs = matchPairs.filter(p => !p.matched && p.id !== pair.id);
        if (remainingPairs.length === 0) {
          setTimeout(() => {
            setMatchMode(false);
            setSession(prev => prev ? {
              ...prev, 
              correctAnswers: prev.correctAnswers + 6,
              mode: 'learn'
            } : null);
            handleNextQuestion();
          }, 1000);
        }
      } else {
        // Wrong match - reset selections with error feedback
        speakText("Try again", 'en-US');
        setTimeout(() => {
          setSelectedTerm(null);
          setSelectedTranslation(null);
        }, 500);
      }
    }
  };

  const startVoiceRecognition = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const getGemColorFromType = (gemType: GemType): string => {
    switch (gemType) {
      case 'common': return 'gray';
      case 'uncommon': return 'green';
      case 'rare': return 'blue';
      case 'epic': return 'purple';
      case 'legendary': return 'gold';
      default: return 'gray';
    }
  };

  const isAnswerCorrect = (userInput: string, correctAnswer: string): boolean => {
    const normalizeText = (text: string) => 
      text.toLowerCase()
          .trim()
          .replace(/[.,;:!?()]/g, '')
          .replace(/\s+/g, ' ');

    const userNormalized = normalizeText(userInput);
    const correctNormalized = normalizeText(correctAnswer);

    if (userNormalized === correctNormalized) {
      return true;
    }

    const acceptableAnswers = correctAnswer
      .split(',')
      .map(part => part.replace(/\([^)]*\)/g, '').trim())
      .filter(part => part.length > 0)
      .map(normalizeText);

    const moreSeparators = correctAnswer
      .split(/[,;\/|]/)
      .map(part => normalizeText(part.replace(/\([^)]*\)/g, '').trim()))
      .filter(part => part.length > 0);

    const allAcceptableAnswers = [...new Set([...acceptableAnswers, ...moreSeparators])];

    return allAcceptableAnswers.some(acceptable => {
      return acceptable === userNormalized || 
             (acceptable.includes(' ') && userNormalized.includes(acceptable)) ||
             (userNormalized.includes(' ') && acceptable.includes(userNormalized));
    });
  };

  const initializePracticeSession = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Load vocabulary words from the vocabulary table based on theme/topic
      let vocabularyQuery = supabase.from('vocabulary').select('*');
      
      if (selectedTheme) {
        vocabularyQuery = vocabularyQuery.eq('theme', selectedTheme);
      }
      
      if (selectedTopic) {
        vocabularyQuery = vocabularyQuery.eq('topic', selectedTopic);
      }
      
      // Limit to 20 words for a reasonable practice session
      vocabularyQuery = vocabularyQuery.limit(20).order('id');
      
      const { data: vocabularyWords, error: vocabError } = await vocabularyQuery;
      
      if (vocabError) {
        console.error('Error loading vocabulary:', vocabError);
        setLoading(false);
        return;
      }
      
      if (!vocabularyWords || vocabularyWords.length === 0) {
        setLoading(false);
        return;
      }
      
      // Load user's existing progress for these vocabulary items
      const { data: existingProgress } = await supabase
        .from('student_vocabulary_practice')
        .select('vocabulary_id, mastery_level, gem_level, total_attempts, correct_attempts')
        .eq('student_id', user.id)
        .in('vocabulary_id', vocabularyWords.map((w: any) => w.id));
      
      const progressMap = new Map();
      if (existingProgress) {
        existingProgress.forEach(progress => {
          progressMap.set(progress.vocabulary_id, progress);
        });
      }
      
      // Convert vocabulary words to VocabularyGem objects with actual progress
      const gemsWithProgress: Array<VocabularyGem & { masteryLevel: number; totalAttempts: number; correctAttempts: number }> = vocabularyWords.map((word: any) => {
        const progress = progressMap.get(word.id);
        const masteryLevel = progress?.mastery_level || 0;
        
        let gemType: GemType;
        if (masteryLevel >= 5) gemType = 'legendary';
        else if (masteryLevel >= 4) gemType = 'epic';
        else if (masteryLevel >= 3) gemType = 'rare';
        else if (masteryLevel >= 2) gemType = 'uncommon';
        else gemType = 'common';
        
        return {
          id: `vocab-${word.id}`,
          term: word.spanish,
          translation: word.english,
          gemType,
          gemColor: getGemColorFromType(gemType),
          frequencyScore: 50,
          curriculumTags: [],
          topicTags: [word.topic],
          themeTags: [word.theme],
          imageUrl: undefined,
          audioUrl: undefined,
          exampleSentence: '',
          exampleTranslation: '',
          notes: '',
          masteryLevel,
          totalAttempts: progress?.total_attempts || 0,
          correctAttempts: progress?.correct_attempts || 0
        };
      });
      
      // Sort gems based on spaced repetition algorithm
      gemsWithProgress.sort((a, b) => {
        const aMastery = a.masteryLevel || 0;
        const bMastery = b.masteryLevel || 0;
        
        // Prioritize due for review, then by mastery level
        if (aMastery < 4 && bMastery >= 4) return -1;
        if (bMastery < 4 && aMastery >= 4) return 1;
        return aMastery - bMastery;
      });
      
      const gems: VocabularyGem[] = gemsWithProgress;
      
      let sessionId: string;
      try {
        sessionId = await miningService.startMiningSession(user.id, 'practice' as SessionType);
      } catch (error) {
        sessionId = `practice-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      }
      
      const newSession: PracticeSession = {
        sessionId,
        currentGem: gems[0],
        currentIndex: 0,
        totalGems: gems.length,
        correctAnswers: 0,
        startTime: new Date(),
        sessionGems: gems,
        theme: selectedTheme || undefined,
        topic: selectedTopic || undefined,
        streak: 0,
        mode: initialMode
      };
      
      setSession(newSession);
      
      if (initialMode === 'match') {
        initializeMatchMode();
      }
      
      setLoading(false);
      
    } catch (error) {
      console.error('Error initializing practice session:', error);
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!session || !session.currentGem || !questionStartTime) return;
    
    const currentTime = new Date();
    const timeTaken = currentTime.getTime() - questionStartTime.getTime();
    setResponseTime(timeTaken);
    
    const correct = isAnswerCorrect(userAnswer, session.currentGem.translation);
    setIsCorrect(correct);
    setShowResult(true);
    
    // Update streak
    const newStreak = correct ? session.streak + 1 : 0;
    setSession(prev => prev ? { ...prev, streak: newStreak } : null);
    
    // Enhanced audio feedback
    if (correct) {
      speakText("Correct!", 'en-US');
    } else {
      speakText(session.currentGem.translation, 'en-US');
    }
    
    // Record practice result
    try {
      await miningService.recordPracticeResult(
        session.sessionId,
        user!.id,
        session.currentGem.id,
        correct,
        timeTaken
      );
    } catch (error) {
      const vocabularyId = parseInt(session.currentGem.id.replace('vocab-', ''));
      
      try {
        const { error: trackingError } = await supabase.rpc('track_vocabulary_practice', {
          p_student_id: user!.id,
          p_session_id: session.sessionId,
          p_vocabulary_id: vocabularyId,
          p_spanish_term: session.currentGem.term,
          p_english_translation: session.currentGem.translation,
          p_was_correct: correct,
          p_response_time: timeTaken
        });
        
        if (!trackingError) {
          console.log('Successfully tracked vocabulary practice directly');
        }
      } catch (directTrackingError) {
        console.error('Direct tracking also failed:', directTrackingError);
      }
    }
    
    if (correct) {
      setSession(prev => prev ? {
        ...prev,
        correctAnswers: prev.correctAnswers + 1
      } : null);
      
      const timer = setTimeout(() => {
        if (session && session.currentIndex + 1 < session.totalGems) {
          handleNextQuestion();
        }
      }, 1500);
      
      setAutoAdvanceTimer(timer);
    }

    setAnswerKey(prev => prev + 1);
  };

  const handleNextQuestion = () => {
    if (!session) return;
    
    if (autoAdvanceTimer) {
      clearTimeout(autoAdvanceTimer);
      setAutoAdvanceTimer(null);
    }
    
    const nextIndex = session.currentIndex + 1;
    
    if (nextIndex >= session.totalGems) {
      completeSession();
    } else {
      setSession({
        ...session,
        currentIndex: nextIndex,
        currentGem: session.sessionGems[nextIndex]
      });
      
      setUserAnswer('');
      setShowResult(false);
      setIsCorrect(false);
      setResponseTime(0);
    }
  };

  const completeSession = async () => {
    if (!session) return;
    
    try {
      const totalTime = Math.floor((new Date().getTime() - session.startTime.getTime()) / 1000);
      const accuracy = Math.round((session.correctAnswers / session.totalGems) * 100);
      const sessionScore = session.correctAnswers * 10 + (session.streak * 5);
      
      try {
        await miningService.endMiningSession(session.sessionId);
      } catch (error) {
        try {
          const { error: updateError } = await supabase
            .from('vocabulary_mining_sessions')
            .update({
              ended_at: new Date().toISOString(),
              total_words_attempted: session.totalGems,
              total_words_correct: session.correctAnswers,
              gems_collected: session.correctAnswers,
              session_score: sessionScore,
              accuracy_percentage: accuracy,
              time_spent_seconds: totalTime,
              updated_at: new Date().toISOString()
            })
            .eq('id', session.sessionId);
        } catch (manualUpdateError) {
          console.error('Manual session update failed:', manualUpdateError);
        }
      }
      
      setSessionStats({
        totalTime,
        accuracy,
        gemsCollected: session.correctAnswers,
        pointsEarned: sessionScore
      });
      
      setSessionComplete(true);
      
    } catch (error) {
      console.error('Error completing session:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult && userAnswer.trim() && !isMultipleChoice) {
      handleAnswerSubmit();
    }
  };

  // Loading and error states...
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Preparing your enhanced learning session...</p>
          {selectedTheme && selectedTopic && (
            <p className="text-indigo-200 text-sm mt-2">
              Loading vocabulary from: {selectedTheme} → {selectedTopic}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (sessionComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4">
          <div className="text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Session Complete!</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{sessionStats.accuracy}%</div>
                <div className="text-sm text-green-700">Accuracy</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{sessionStats.gemsCollected}</div>
                <div className="text-sm text-blue-700">Gems Collected</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{sessionStats.pointsEarned}</div>
                <div className="text-sm text-purple-700">Points Earned</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{Math.floor(sessionStats.totalTime / 60)}m {sessionStats.totalTime % 60}s</div>
                <div className="text-sm text-orange-700">Time Spent</div>
              </div>
            </div>

            {session && session.streak >= 5 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center">
                  <Zap className="w-6 h-6 text-yellow-500 mr-2" />
                  <span className="text-yellow-800 font-semibold">Amazing streak of {session.streak}!</span>
                </div>
              </div>
            )}
            
            <div className="flex space-x-4 justify-center">
              <Link
                href="/student-dashboard/vocabulary-mining/practice"
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Practice Again
              </Link>
              <Link
                href="/student-dashboard/vocabulary-mining"
                className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!session || !session.currentGem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md">
          <div className="text-center">
            <BookOpen className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Vocabulary Available</h2>
            <p className="text-gray-600 mb-4">
              {selectedTheme && selectedTopic 
                ? `No vocabulary found for ${selectedTheme} → ${selectedTopic}`
                : 'No vocabulary available for practice.'
              }
            </p>
            <Link
              href="/student-dashboard/vocabulary-mining"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentGem = session.currentGem;
  const gemInfo = getGemInfo(currentGem.gemType);
  const progress = Math.round(((session.currentIndex + 1) / session.totalGems) * 100);

  // Match Mode UI
  if (matchMode) {
    const unmatched = matchPairs.filter(p => !p.matched);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Brain className="w-6 h-6 text-yellow-400 mr-3" />
                <span className="text-white font-medium">Match Mode</span>
              </div>
              <div className="text-white">
                {matchPairs.filter(p => p.matched).length} / {matchPairs.length} matched
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-2xl p-8">
            <div className="mb-6">
              <GemMiningGame answerKey={answerKey} wasCorrect={true} />
            </div>
            
            <h2 className="text-2xl font-bold text-center mb-8">Match the Spanish terms with their English translations</h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-4">Spanish Terms</h3>
                {unmatched.map(pair => (
                  <button
                    key={pair.id + '-term'}
                    onClick={() => handleMatchSelection('term', pair.term)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedTerm === pair.term
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{pair.term}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          speakText(pair.term, 'es-ES');
                        }}
                        className="p-1 text-indigo-600 hover:bg-indigo-100 rounded"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-4">English Translations</h3>
                {unmatched.map(pair => (
                  <button
                    key={pair.id + '-translation'}
                    onClick={() => handleMatchSelection('translation', pair.translation)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      selectedTranslation === pair.translation
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {pair.translation}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Enhanced Header with Mode Selector */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Pickaxe className="w-6 h-6 text-yellow-400 mr-3" />
              <div>
                <span className="text-white font-medium">Vocabulary Mining - {session.mode.charAt(0).toUpperCase() + session.mode.slice(1)} Mode</span>
                {session.theme && session.topic && (
                  <div className="text-indigo-200 text-sm mt-1">
                    {session.theme} → {session.topic}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4 text-white">
              <div className="flex items-center">
                <Target className="w-4 h-4 mr-1" />
                <span className="text-sm">{session.currentIndex + 1}/{session.totalGems}</span>
              </div>
              <div className="flex items-center">
                <Star className="w-4 h-4 mr-1" />
                <span className="text-sm">{session.correctAnswers} correct</span>
              </div>
              <div className="flex items-center">
                <Zap className="w-4 h-4 mr-1" />
                <span className="text-sm">{session.streak} streak</span>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Mode and Audio Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => setSession(prev => prev ? {...prev, mode: 'learn'} : null)}
                className={`px-3 py-1 rounded text-sm ${session.mode === 'learn' ? 'bg-white text-indigo-600' : 'text-white/80'}`}
              >
                Learn
              </button>
              <button
                onClick={initializeMatchMode}
                className={`px-3 py-1 rounded text-sm ${session.mode === 'match' ? 'bg-white text-indigo-600' : 'text-white/80'}`}
              >
                Match
              </button>
              <button
                onClick={() => setVoiceMode(!voiceMode)}
                className={`px-3 py-1 rounded text-sm ${voiceMode ? 'bg-white text-indigo-600' : 'text-white/80'}`}
              >
                <Mic className="w-4 h-4 inline mr-1" />
                Voice
              </button>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className={`p-1 rounded ${audioEnabled ? 'text-white' : 'text-white/50'}`}
              >
                <Volume2 className="w-4 h-4" />
              </button>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                className="text-xs bg-white/20 text-white rounded px-2 py-1"
              >
                <option value={0.75}>0.75x</option>
                <option value={1.0}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
              </select>
              <button
                onClick={() => setVoiceGender(voiceGender === 'female' ? 'male' : 'female')}
                className="text-xs bg-white/20 text-white rounded px-2 py-1"
              >
                {voiceGender === 'female' ? '♀' : '♂'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <GemMiningGame answerKey={answerKey} wasCorrect={isCorrect} />
        </div>

        {currentGem && (
          <div className="bg-white rounded-xl shadow-2xl p-8">
            {/* Enhanced Gem Display */}
            <div className="text-center mb-8">
              <div 
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl border-4 relative"
                style={{ 
                  backgroundColor: gemInfo?.color + '20',
                  borderColor: gemInfo?.color,
                  color: gemInfo?.color
                }}
              >
                {gemInfo?.icon}
                {session.streak >= 5 && (
                  <div className="absolute -top-2 -right-2 bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    🔥
                  </div>
                )}
              </div>
              <div className="text-sm font-medium text-gray-600 mb-2">
                {gemInfo?.name} Gem
              </div>
              <div className="flex items-center justify-center space-x-4 mb-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  {currentGem.term}
                </h2>
                <button
                  onClick={() => speakText(currentGem.term, 'es-ES')}
                  className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              {currentGem.exampleSentence && (
                <p className="text-gray-600 italic">
                  "{currentGem.exampleSentence}"
                </p>
              )}
            </div>

            {/* Enhanced Answer Input */}
            {!showResult ? (
              <div className="space-y-6">
                {isMultipleChoice ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Select the correct English translation:</p>
                    {choices.map((choice) => (
                      <button
                        key={choice}
                        onClick={() => {
                          setUserAnswer(choice);
                          setTimeout(handleAnswerSubmit, 100);
                        }}
                        className="w-full bg-white border-2 border-gray-200 py-4 px-4 rounded-lg text-left hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What does this word mean in English?
                    </label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Type your answer..."
                        autoFocus
                      />
                      {voiceMode && recognition && (
                        <button
                          onClick={startVoiceRecognition}
                          disabled={isListening}
                          className={`px-4 py-3 rounded-lg font-semibold ${
                            isListening 
                              ? 'bg-red-500 text-white' 
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          <Mic className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                    {isListening && (
                      <p className="text-sm text-blue-600 mt-2">🎤 Listening... Speak now!</p>
                    )}
                  </div>
                )}

                {!isMultipleChoice && (
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={!userAnswer.trim()}
                    className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Submit Answer
                  </button>
                )}
              </div>
            ) : (
              /* Enhanced Result Display */
              <div className="space-y-6">
                <div className={`text-center p-6 rounded-lg ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-center mb-4">
                    {isCorrect ? (
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    ) : (
                      <XCircle className="w-12 h-12 text-red-500" />
                    )}
                  </div>
                  
                  <h3 className={`text-xl font-bold mb-2 ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                    {isCorrect ? (session.streak >= 3 ? 'Excellent streak!' : 'Correct!') : 'Incorrect'}
                  </h3>
                  
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <p className="text-gray-700">
                      <strong>Correct answer:</strong> {currentGem.translation}
                    </p>
                    <button
                      onClick={() => speakText(currentGem.translation, 'en-US')}
                      className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {!isCorrect && (
                    <>
                      <p className="text-gray-600 mb-2">
                        <strong>Your answer:</strong> {userAnswer}
                      </p>
                      <div className="text-sm text-gray-500 bg-gray-100 p-3 rounded">
                        <p className="mb-1"><strong>Any of these would be accepted:</strong></p>
                        <p className="text-green-600">
                          {currentGem.translation
                            .split(',')
                            .map(part => part.replace(/\([^)]*\)/g, '').trim())
                            .filter(part => part.length > 0)
                            .join(' • ')}
                        </p>
                      </div>
                    </>
                  )}

                  {isCorrect && session.streak >= 3 && (
                    <div className="flex items-center justify-center mt-2 text-yellow-600">
                      <Zap className="w-4 h-4 mr-1" />
                      <span className="text-sm font-semibold">Streak bonus: +{session.streak * 5} points!</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{(responseTime / 1000).toFixed(1)}s</span>
                  </div>
                </div>
                
                <button
                  onClick={handleNextQuestion}
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-lg flex items-center justify-center transition-colors ${
                    isCorrect 
                      ? 'bg-green-600 text-white hover:bg-green-700' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {session.currentIndex + 1 >= session.totalGems ? 'Complete Session' : 
                   isCorrect ? 'Next Gem (Auto-advancing...)' : 'Next Gem'}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Loading component for Suspense
function PracticePageLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p className="text-white">Loading enhanced practice session...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function VocabularyMiningPracticePage() {
  return (
    <Suspense fallback={<PracticePageLoading />}>
      <VocabularyMiningPracticeContent />
    </Suspense>
  );
} 