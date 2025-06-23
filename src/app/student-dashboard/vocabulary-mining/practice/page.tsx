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
  mode: 'learn' | 'review' | 'match' | 'voice' | 'speed';
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
  
  // Evolution animation state
  const [evolutionData, setEvolutionData] = useState<{
    from: { color: string; icon: string; name: string };
    to: { color: string; icon: string; name: string };
  } | null>(null);
  
  // Voice recognition state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any | null>(null);
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
  const [shuffledTerms, setShuffledTerms] = useState<string[]>([]);
  const [shuffledTranslations, setShuffledTranslations] = useState<string[]>([]);

  // Speed mode timer state
  const SPEED_TIME_LIMIT = 6; // seconds allowed per question in speed mode
  const [timeLeft, setTimeLeft] = useState<number>(SPEED_TIME_LIMIT);

  // Get theme and topic from URL parameters
  const selectedTheme = searchParams?.get('theme');
  const selectedTopic = searchParams?.get('topic');
  const initialMode = searchParams?.get('mode') as 'learn' | 'review' | 'match' | 'voice' | 'speed' || 'learn';

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
      // Auto-play pronunciation when new question appears
      speakText(session.currentGem.term, 'es-ES');
    }
  }, [session?.currentGem, audioEnabled, playbackSpeed, voiceGender]);

  // Adaptive question mode decision with enhanced logic
  useEffect(() => {
    if (session?.currentGem && (session.mode === 'learn' || session.mode === 'speed')) {
      const mLevel = (session.currentGem as any).masteryLevel || 0;
      // More intelligent adaptive switching - like Memrise's adaptive algorithm
      const useMC = session.mode === 'speed' || // Always use MC for speed mode
                   mLevel < 2 || 
                   (mLevel < 3 && Math.random() < 0.4) ||
                   (session.streak === 0 && Math.random() < 0.6) || // Help struggling students
                   (session.correctAnswers < session.currentIndex * 0.6); // If accuracy is low
      setIsMultipleChoice(useMC);
      if (useMC) {
        generateChoices(session.currentGem);
      }
    }
  }, [session?.currentGem, session?.mode, session?.streak, session?.correctAnswers, session?.currentIndex]);

  // Countdown timer for Speed mode
  useEffect(() => {
    if (!session || session.mode !== 'speed' || showResult) return;

    // Reset timer whenever a new gem appears
    setTimeLeft(SPEED_TIME_LIMIT);

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // Time expired – treat as incorrect answer
          handleAnswerSubmit('');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [session?.currentGem, session?.mode, showResult]);

  const speakText = (text: string, lang: string = 'en-US') => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = playbackSpeed;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      
      // Enhanced voice selection for better quality Spanish voices
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        let preferredVoice = null;
        
        if (lang.startsWith('es')) {
          // Priority order for high-quality Spanish voices
          const spanishVoicePreferences = [
            // Microsoft Natural voices (highest quality)
            'Microsoft Elvira Online (Natural) - Spanish (Spain)',
            'Microsoft Alvaro Online (Natural) - Spanish (Spain)', 
            'Microsoft Paloma Online (Natural) - Spanish (Spain)',
            // High-quality system voices
            'Monica', 'Paulina', 'Marisol', 'Jorge', 'Carlos',
            // Fallback to any Spanish voice with good indicators
            (voice: any) => voice.lang.includes('es-ES') && !voice.name.toLowerCase().includes('google'),
            (voice: any) => voice.lang.includes('es') && voice.name.toLowerCase().includes('enhanced'),
            (voice: any) => voice.lang.includes('es') && voice.name.toLowerCase().includes('premium'),
            // Generic Spanish fallbacks
            (voice: any) => voice.lang.includes('es-ES'),
            (voice: any) => voice.lang.includes('es')
          ];

          for (const preference of spanishVoicePreferences) {
            if (typeof preference === 'string') {
              preferredVoice = voices.find(voice => voice.name === preference);
            } else {
              preferredVoice = voices.find(preference);
            }
            if (preferredVoice) break;
          }
        } else {
          // For English, prefer high-quality voices
          const englishVoicePreferences = [
            'Microsoft Zira Desktop - English (United States)',
            'Microsoft David Desktop - English (United States)',
            'Samantha', 'Alex', 'Victoria', 'Daniel',
            (voice: any) => voice.lang.includes('en-US') && voice.name.toLowerCase().includes('enhanced'),
            (voice: any) => voice.lang.includes('en-US') && voice.default,
            (voice: any) => voice.lang.includes('en-US')
          ];

          for (const preference of englishVoicePreferences) {
            if (typeof preference === 'string') {
              preferredVoice = voices.find(voice => voice.name === preference);
            } else {
              preferredVoice = voices.find(preference);
            }
            if (preferredVoice) break;
          }
        }
        
        if (preferredVoice) {
          utterance.voice = preferredVoice;
        }
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const generateChoices = (gem: VocabularyGem) => {
    // Enhanced choice generation with better distractors from the same session
    const otherGems = session?.sessionGems?.filter(g => g.id !== gem.id) || [];
    
    if (otherGems.length < 3) {
      // If we don't have enough gems in session, fetch random vocabulary from database
      // For now, fallback to other gems or generate reasonable distractors
      const fallbackDistractors = [
        'happy', 'sad', 'big', 'small', 'good', 'bad', 'hot', 'cold', 'new', 'old',
        'rich', 'poor', 'fast', 'slow', 'easy', 'hard', 'clean', 'dirty', 'loud', 'quiet',
        'young', 'old', 'tall', 'short', 'beautiful', 'ugly', 'smart', 'stupid', 'funny', 'serious'
      ];
      
      // Filter out the correct answer and pick 3 random distractors
      const availableDistractors = fallbackDistractors.filter(d => 
        d.toLowerCase() !== gem.translation.toLowerCase()
      );
      const selectedDistractors = availableDistractors
        .sort(() => Math.random() - 0.5)
        .slice(0, 3);
      
      // Always ensure the correct answer is included
      const allChoices = [gem.translation, ...selectedDistractors].sort(() => Math.random() - 0.5);
      setChoices(allChoices);
      return;
    }
    
    // Get 3 different translations from other gems in this session
    const shuffled = [...otherGems].sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3).map(g => g.translation);
    
    // Always start with the correct answer
    const uniqueChoices = [gem.translation];
    
    // Add unique distractors
    for (const distractor of distractors) {
      if (!uniqueChoices.includes(distractor) && uniqueChoices.length < 4) {
        uniqueChoices.push(distractor);
      }
    }
    
    // If we still don't have 4 choices, add fallback distractors
    if (uniqueChoices.length < 4) {
      const fallbackDistractors = ['happy', 'sad', 'big', 'small', 'good', 'bad'];
      for (const fallback of fallbackDistractors) {
        if (!uniqueChoices.includes(fallback) && uniqueChoices.length < 4) {
          uniqueChoices.push(fallback);
        }
      }
    }
    
    // Shuffle the final choices
    const allChoices = uniqueChoices.slice(0, 4).sort(() => Math.random() - 0.5);
    setChoices(allChoices);
  };

  const initializeMatchMode = () => {
    if (!session) return;
    
    const pairs: MatchPair[] = session.sessionGems.slice(0, 6).map(gem => ({
      id: gem.id,
      term: gem.term,
      translation: gem.translation,
      matched: false
    }));
    
    // Shuffle the terms and translations once when match mode starts
    const terms = pairs.map(p => p.term).sort(() => Math.random() - 0.5);
    const translations = pairs.map(p => p.translation).sort(() => Math.random() - 0.5);
    
    setMatchPairs(pairs);
    setShuffledTerms(terms);
    setShuffledTranslations(translations);
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

  const getGemInfo = (gemType: GemType) => {
    switch (gemType) {
      case 'common': return { color: '#8B8B8B', icon: '💎', name: 'Common' };
      case 'uncommon': return { color: '#4CAF50', icon: '🟢', name: 'Uncommon' };
      case 'rare': return { color: '#2196F3', icon: '🔵', name: 'Rare' };
      case 'epic': return { color: '#9C27B0', icon: '🟣', name: 'Epic' };
      case 'legendary': return { color: '#FF9800', icon: '⭐', name: 'Legendary' };
      default: return { color: '#8B8B8B', icon: '💎', name: 'Common' };
    }
  };

  const getGemTypeFromMastery = (mastery: number): GemType => {
    if (mastery >= 5) return 'legendary';
    if (mastery >= 4) return 'epic';
    if (mastery >= 3) return 'rare';
    if (mastery >= 2) return 'uncommon';
    return 'common';
  };

  const checkForEvolution = (currentMastery: number, newMastery: number) => {
    const oldType = getGemTypeFromMastery(currentMastery);
    const newType = getGemTypeFromMastery(newMastery);

    if (oldType !== newType) {
      return {
        from: getGemInfo(oldType),
        to: getGemInfo(newType)
      };
    }
    return null;
  };

  const isAnswerCorrect = (userInput: string, correctAnswer: string): boolean => {
    // Simple normalization - just remove extra spaces and make lowercase
    const normalizeText = (text: string) => 
      text.toLowerCase().trim().replace(/\s+/g, ' ');

    const userNormalized = normalizeText(userInput);
    const correctNormalized = normalizeText(correctAnswer);

    // Direct match first
    if (userNormalized === correctNormalized) {
      return true;
    }

    // Handle comma-separated alternatives (like "action, act")
    const alternatives = correctAnswer
      .split(',')
      .map(alt => normalizeText(alt.trim()))
      .filter(alt => alt.length > 0);

    return alternatives.some(alternative => userNormalized === alternative);
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

  const handleAnswerSubmit = async (providedAnswer?: string) => {
    if (!session || !session.currentGem || !questionStartTime) return;
    
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - questionStartTime.getTime()) / 1000;
    setResponseTime(timeTaken);
    
    let userInput = (providedAnswer || userAnswer).trim();
    const correctAnswer = session.currentGem.translation;
    const correct = isAnswerCorrect(userInput, correctAnswer);
    
    setIsCorrect(correct);
    setShowResult(true);
    
    // Enhanced answer key for visual feedback
    setAnswerKey(prev => prev + 1);
    
    // Enhanced feedback with immediate audio response
    if (correct) {
      // Check for gem evolution and update gem immediately
      const currentMastery = (session.currentGem as any).masteryLevel || 0;
      const newMastery = currentMastery + (timeTaken < 3 ? 2 : 1); // Faster answers = more mastery gain
      
      const evolution = checkForEvolution(currentMastery, newMastery);
      if (evolution) {
        // Update the gem type immediately in the session
        const updatedGem = {
          ...session.currentGem,
          gemType: getGemTypeFromMastery(newMastery),
          gemColor: getGemColorFromType(getGemTypeFromMastery(newMastery))
        };
        
        // Update session with evolved gem
        setSession(prev => prev ? {
          ...prev,
          currentGem: updatedGem,
          sessionGems: prev.sessionGems.map(gem => 
            gem.id === updatedGem.id ? updatedGem : gem
          )
        } : null);
        
        // Store evolution data for showing "Evolution!" text
        setEvolutionData(evolution);
        setTimeout(() => setEvolutionData(null), 2000);
      }

      // Play success sound and speak encouragement
      if (audioEnabled) {
        // Positive audio feedback
        const encouragements = ['¡Excelente!', '¡Muy bien!', '¡Perfecto!', '¡Genial!'];
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        setTimeout(() => speakText(randomEncouragement, 'es-ES'), 300);
      }
    } else {
      // Play error sound and provide correct pronunciation
      if (audioEnabled) {
        setTimeout(() => {
          speakText(`La respuesta correcta es: ${correctAnswer}`, 'es-ES');
        }, 300);
      }
    }

    // Update session state with enhanced tracking
    const updatedSession = {
      ...session,
      correctAnswers: correct ? session.correctAnswers + 1 : session.correctAnswers,
      streak: correct ? session.streak + 1 : 0
    };
    
    setSession(updatedSession);

    // Enhanced auto-advance with variable timing based on performance
    const autoAdvanceDelay = correct ? 1500 : 3000; // Longer delay for incorrect answers
    const timer = setTimeout(() => {
      handleNextQuestion();
    }, autoAdvanceDelay);
    
    setAutoAdvanceTimer(timer);

    // Save progress to database
    try {
      await miningService.recordPracticeResult(
        session.sessionId,
        user!.id,
        session.currentGem.id,
        correct,
        timeTaken
      );
    } catch (error) {
      console.warn('Practice result not saved (this is normal for demo mode):', error);
      // Continue without blocking the user experience
    }
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
            {/* Temporarily hidden gem visual effect */}
            {false && (
              <div className="mb-6">
                <GemMiningGame answerKey={answerKey} wasCorrect={true} />
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-center mb-8">Match the Spanish terms with their English translations</h2>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-4">Spanish Terms</h3>
                {(shuffledTerms.length > 0 ? shuffledTerms : unmatched.map(p => p.term))
                  .filter(term => unmatched.some(p => p.term === term)) // Only show unmatched terms
                  .map(term => {
                    const pair = unmatched.find(p => p.term === term)!;
                    return (
                      <div
                        key={pair.id + '-term'}
                        onClick={() => handleMatchSelection('term', pair.term)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-colors cursor-pointer ${
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
                      </div>
                    );
                  })}
              </div>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-700 mb-4">English Translations</h3>
                {(shuffledTranslations.length > 0 ? shuffledTranslations : unmatched.map(p => p.translation))
                  .filter(translation => unmatched.some(p => p.translation === translation)) // Only show unmatched translations
                  .map(translation => {
                    const pair = unmatched.find(p => p.translation === translation)!;
                    return (
                      <div
                        key={pair.id + '-translation'}
                        onClick={() => handleMatchSelection('translation', pair.translation)}
                        className={`w-full p-4 rounded-lg border-2 text-left transition-colors cursor-pointer ${
                          selectedTranslation === pair.translation
                            ? 'border-green-500 bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {pair.translation}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative">

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
              <button
                onClick={() => setSession(prev => prev ? {...prev, mode: 'speed'} : null)}
                className={`px-3 py-1 rounded text-sm ${session.mode === 'speed' ? 'bg-white text-indigo-600' : 'text-white/80'}`}
              >
                Speed
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
        {/* Temporarily hidden gem visual effect */}
        {false && (
          <div className="mb-6">
            <GemMiningGame answerKey={answerKey} wasCorrect={isCorrect} />
          </div>
        )}

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
                {session.mode === 'speed' && (
                  <div className="flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5 mr-2 text-red-500" />
                    <span className="text-lg font-bold text-red-500">
                      {timeLeft}
                    </span>
                  </div>
                )}

                {isMultipleChoice ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Select the correct English translation:</p>
                    {choices.map((choice) => (
                      <button
                        key={choice}
                        onClick={() => {
                          setUserAnswer(choice);
                          setTimeout(() => handleAnswerSubmit(choice), 100);
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
                    onClick={() => handleAnswerSubmit()}
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
                  
                  {/* Evolution notification */}
                  {isCorrect && evolutionData && (
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full mb-4 animate-pulse">
                      <div className="flex items-center justify-center">
                        <span className="text-lg mr-2">{evolutionData.from.icon}</span>
                        <span className="text-sm font-semibold">→</span>
                        <span className="text-lg ml-2">{evolutionData.to.icon}</span>
                        <span className="ml-3 font-bold">EVOLVED to {evolutionData.to.name}!</span>
                      </div>
                    </div>
                  )}
                  
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