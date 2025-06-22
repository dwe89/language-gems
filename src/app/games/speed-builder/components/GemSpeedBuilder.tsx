'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RefreshCw, 
  Star, 
  CheckCircle2, 
  Zap, 
  Shuffle,
  Award,
  Settings,
  Home,
  Clock,
  Target,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Timer,
  Trophy,
  Brain,
  Sparkles,
  Gem,
  Crown,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { createBrowserClient } from '../../../../lib/supabase-client';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

// Types
interface WordItem {
  id: string;
  text: string;
  index: number;
  correctPosition: number;
  translation?: string;
  correct?: boolean;
  gemType?: 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz';
}

interface SentenceData {
  id: string;
  text: string;
  originalText: string;
  translatedText: string;
  language: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  curriculum?: {
    tier: 'Foundation' | 'Higher';
    theme: string;
    topic: string;
    grammarFocus?: string;
  };
  explanation?: string;
  vocabularyWords?: any[];
  isTeacherCreated?: boolean;
}

interface GameStats {
  score: number;
  accuracy: number;
  timeSpent: number;
  sentencesCompleted: number;
  streak: number;
  highestStreak: number;
  totalWordsPlaced: number;
  grammarErrors: Record<string, number>;
  powerUpsUsed: Record<string, number>;
  gemsCollected: number;
  bonusMultiplier: number;
}

interface PowerUp {
  id: string;
  type: 'shuffle' | 'hint' | 'glow' | 'timeBoost';
  active: boolean;
  cooldown: number;
  description: string;
  icon: string;
  gemCost: number;
}

interface FloatingGem {
  id: string;
  x: number;
  y: number;
  type: 'ruby' | 'sapphire' | 'emerald' | 'diamond' | 'amethyst' | 'topaz';
  value: number;
}

// Gem colors and effects
const gemColors = {
  ruby: 'from-red-400 to-red-600',
  sapphire: 'from-blue-400 to-blue-600',
  emerald: 'from-green-400 to-green-600',
  diamond: 'from-gray-200 to-white',
  amethyst: 'from-purple-400 to-purple-600',
  topaz: 'from-yellow-400 to-yellow-600'
};

const gemGlow = {
  ruby: 'drop-shadow-[0_0_15px_rgba(239,68,68,0.7)]',
  sapphire: 'drop-shadow-[0_0_15px_rgba(59,130,246,0.7)]',
  emerald: 'drop-shadow-[0_0_15px_rgba(34,197,94,0.7)]',
  diamond: 'drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]',
  amethyst: 'drop-shadow-[0_0_15px_rgba(147,51,234,0.7)]',
  topaz: 'drop-shadow-[0_0_15px_rgba(234,179,8,0.7)]'
};

// Pre-defined positions to avoid hydration errors
const backgroundGemPositions = [
  { left: 10, top: 20 }, { left: 85, top: 15 }, { left: 25, top: 70 },
  { left: 75, top: 80 }, { left: 50, top: 30 }, { left: 90, top: 50 },
  { left: 15, top: 85 }, { left: 65, top: 10 }, { left: 40, top: 90 },
  { left: 95, top: 25 }, { left: 5, top: 60 }, { left: 70, top: 45 }
];

// Removed FloatingGems component - using simplified gem collection

// Enhanced Gem Draggable Word Component
const GemDraggableWord: React.FC<{
  word: WordItem;
  isGlowing?: boolean;
  onWordClick?: (word: WordItem) => void;
}> = ({ word, isGlowing, onWordClick }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'word',
    item: word,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const gemType = word.gemType || (['ruby', 'sapphire', 'emerald', 'amethyst', 'topaz'][word.index % 5] as 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz');

  return (
    <motion.div
      ref={drag as any}
      onClick={() => onWordClick?.(word)}
      initial={{ scale: 0, y: 20 }}
      animate={{ 
        scale: 1, 
        y: 0,
        boxShadow: isGlowing ? '0 0 40px #fbbf24, 0 0 80px #fbbf24' : `0 12px 30px rgba(0,0,0,0.2)`,
      }}
      whileHover={{ 
        scale: 1.08, 
        y: -4,
        boxShadow: isGlowing ? '0 0 50px #fbbf24, 0 0 100px #fbbf24' : `0 15px 35px rgba(0,0,0,0.25)`,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 17
      }}
      className={`
        relative cursor-pointer select-none
        px-6 py-4 rounded-2xl border-2 border-white/30
        bg-gradient-to-br ${gemColors[gemType]}
        transform transition-all duration-200
        shadow-lg hover:shadow-xl
        backdrop-blur-sm
        ${isDragging ? 'opacity-50 scale-95' : ''}
        text-white font-bold text-lg
        min-w-[120px] text-center
      `}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {/* Gem facet effect */}
      <div className="absolute inset-2 bg-white/20 rounded-xl border border-white/40"></div>
      
      {/* Shimmer effect */}
      <motion.div
        animate={{ 
          x: ['-100%', '100%'],
          opacity: [0, 0.5, 0]
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 3,
          ease: "easeInOut"
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-2xl"
      />
      
      {/* Word text */}
      <span className="relative z-10 drop-shadow-sm">{word.text}</span>
      
      {/* Glow effect when hinted */}
      {isGlowing && (
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.7, 0.3] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className="absolute inset-0 bg-yellow-400/30 rounded-2xl"
        />
      )}
    </motion.div>
  );
};

// Enhanced Drop Target with better feedback
const GemDropTarget: React.FC<{
  index: number;
  word: WordItem | null;
  onDrop: (word: WordItem, index: number) => void;
  showSentenceResult?: boolean;
  isCorrect?: boolean;
  showGhostWord?: string;
}> = ({ index, word, onDrop, showSentenceResult = false, isCorrect, showGhostWord }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: 'word',
    drop: (item: WordItem) => onDrop(item, index),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const handleRemoveWord = () => {
    if (word) {
      // Add the word back to available words by triggering a "drop" to index -1
      onDrop(word, -1);
    }
  };

  // Only show correctness after sentence completion
  const showFeedback = showSentenceResult && word;

  return (
    <motion.div
      ref={drop as any}
      onClick={handleRemoveWord}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        borderColor: isOver 
          ? 'rgba(255, 255, 255, 0.8)' 
          : word 
            ? (showFeedback && isCorrect ? 'rgba(34, 197, 94, 0.8)' : showFeedback && !isCorrect ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 255, 255, 0.6)')
            : 'rgba(255, 255, 255, 0.3)'
      }}
      whileHover={{ 
        scale: word ? 1.05 : 1.02,
        borderColor: word 
          ? (showFeedback && isCorrect ? 'rgba(34, 197, 94, 1)' : showFeedback && !isCorrect ? 'rgba(239, 68, 68, 1)' : 'rgba(255, 255, 255, 0.8)')
          : 'rgba(255, 255, 255, 0.6)'
      }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className={`
        relative min-h-[80px] min-w-[140px] 
        border-3 border-dashed rounded-2xl
        bg-white/5 backdrop-blur-sm
        flex items-center justify-center
        transition-all duration-300
        ${isOver ? 'bg-white/20 shadow-lg' : ''}
        ${word ? 'cursor-pointer hover:bg-white/10' : 'cursor-default'}
      `}
    >
      {/* Background effect - only show after sentence completion */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden">
        {word && showFeedback && (
          <motion.div
            animate={{ 
              background: isCorrect 
                ? 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
                : 'linear-gradient(45deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))'
            }}
            className="absolute inset-0"
          />
        )}
      </div>

      {/* Position indicator */}
      <div className="absolute -top-3 -left-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white font-bold text-sm border border-white/30">
        {index + 1}
      </div>

      {/* Content */}
      {word ? (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={`
            px-6 py-3 rounded-xl border-2 
            ${showFeedback 
              ? (isCorrect 
                ? 'bg-gradient-to-br from-green-400 to-green-600 border-green-300' 
                : 'bg-gradient-to-br from-red-400 to-red-600 border-red-300')
              : 'bg-gradient-to-br from-blue-400 to-purple-600 border-blue-300'
            }
            text-white font-bold text-lg text-center
            shadow-lg backdrop-blur-sm
            hover:shadow-xl transition-all duration-200
            min-w-[120px]
          `}
        >
          <span className="relative z-10 drop-shadow-sm">{word.text}</span>
          
          {/* Correct/incorrect indicator - only after sentence completion */}
          {showFeedback && (
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center">
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  ❌
                </motion.div>
              )}
            </div>
          )}

          {/* Remove hint - only show if feedback indicates it's wrong */}
          {showFeedback && !isCorrect && (
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-white/70 whitespace-nowrap">
              Click to remove
            </div>
          )}
        </motion.div>
      ) : (
        <div className="text-center">
          {/* Ghost preview */}
          {showGhostWord ? (
            <div className="text-white/40 font-medium text-lg italic">
              "{showGhostWord}"
            </div>
          ) : (
            <div className="text-white/60 font-medium text-base">
              Drop gem here
            </div>
          )}
          
          {/* Drop indicator */}
          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mt-2"
          >
            💎
          </motion.div>
        </div>
      )}

      {/* Drop zone highlight */}
      {isOver && canDrop && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute inset-0 border-4 border-yellow-400 rounded-2xl bg-yellow-400/20"
        />
      )}
    </motion.div>
  );
};

// Enhanced Power-Up Button
const GemPowerUpButton: React.FC<{
  powerUp: PowerUp;
  onActivate: (id: string) => void;
  disabled?: boolean;
  gemsAvailable: number;
}> = ({ powerUp, onActivate, disabled, gemsAvailable }) => {
  const canAfford = gemsAvailable >= powerUp.gemCost;
  const isDisabled = disabled || !canAfford || powerUp.active;

  return (
    <motion.button
      onClick={() => !isDisabled && onActivate(powerUp.id)}
      disabled={isDisabled}
      whileHover={!isDisabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!isDisabled ? { scale: 0.95 } : {}}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`
        relative px-4 py-3 rounded-xl border-2
        flex flex-col items-center gap-2
        font-bold text-sm transition-all duration-300
        min-w-[80px]
        ${isDisabled 
          ? 'bg-gray-500/20 border-gray-500/40 text-gray-400 cursor-not-allowed' 
          : 'bg-gradient-to-br from-purple-500 to-pink-600 border-white/30 text-white hover:border-white/50 shadow-lg hover:shadow-xl'
        }
        ${powerUp.active ? 'animate-pulse bg-yellow-500/30 border-yellow-400' : ''}
      `}
    >
      {/* Power-up icon */}
      <div className="text-xl">
        {powerUp.type === 'shuffle' && '🔀'}
        {powerUp.type === 'hint' && '💡'}
        {powerUp.type === 'glow' && '✨'}
        {powerUp.type === 'timeBoost' && '⚡'}
      </div>
      
      {/* Power-up name */}
      <span className="text-xs">{powerUp.description}</span>
      
      {/* Gem cost */}
      <div className={`flex items-center gap-1 text-xs ${!canAfford ? 'text-red-300' : 'text-yellow-300'}`}>
        <Gem className="w-3 h-3" />
        <span>{powerUp.gemCost}</span>
      </div>
      
      {/* Cooldown indicator */}
      {powerUp.active && (
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: 10 }}
          className="absolute bottom-0 left-0 h-1 bg-yellow-400 rounded-full"
        />
      )}
      
      {/* Shine effect */}
      {canAfford && !powerUp.active && (
        <motion.div
          animate={{ 
            x: ['-100%', '100%'],
            opacity: [0, 0.5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 3,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
        />
      )}
    </motion.button>
  );
};

// Sound system for enhanced audio feedback
class SoundSystem {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: HTMLAudioElement } = {};
  
  constructor() {
    if (typeof window !== 'undefined') {
      // Pre-load better quality game sounds
      this.loadSound('word-place', '/sounds/speed-builder/word-place.mp3');        // Gentle "pop" when word is placed correctly
      this.loadSound('word-wrong', '/sounds/speed-builder/word-wrong.mp3');        // Soft "buzz" for incorrect placement
      this.loadSound('sentence-complete', '/sounds/speed-builder/sentence-complete.mp3'); // Triumphant chime for completed sentence
      this.loadSound('gem-collect', '/sounds/speed-builder/gem-collect.mp3');      // Sparkly gem collection sound
      this.loadSound('power-up', '/sounds/speed-builder/power-up.mp3');           // Magical whoosh for power-ups
      this.loadSound('time-warning', '/sounds/speed-builder/time-warning.mp3');   // Gentle pulse when time is low
      this.loadSound('game-start', '/sounds/speed-builder/game-start.mp3');       // Upbeat game start sound
      this.loadSound('button-hover', '/sounds/speed-builder/button-hover.mp3');   // Subtle hover sound
      this.loadSound('level-complete', '/sounds/speed-builder/level-complete.mp3'); // Celebration for game completion
    }
  }
  
  private loadSound(name: string, path: string) {
    try {
      const audio = new Audio(path);
      audio.preload = 'auto';
      audio.volume = 0.6;
      this.sounds[name] = audio;
    } catch (error) {
      console.warn(`Failed to load sound: ${name}`, error);
    }
  }
  
  play(soundName: string, volume: number = 0.6) {
    try {
      const sound = this.sounds[soundName];
      if (sound) {
        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(e => console.warn('Sound play failed:', e));
      }
    } catch (error) {
      console.warn(`Failed to play sound: ${soundName}`, error);
    }
  }
}

// Initialize sound system
const soundSystem = new SoundSystem();

// Main Enhanced Gem Speed Builder Component
export const GemSpeedBuilder: React.FC<{
  assignmentId?: string;
  mode?: 'assignment' | 'freeplay';
  theme?: string;
  topic?: string;
  tier?: string;
  vocabularyList?: any[];
  onGameComplete?: (stats: GameStats) => void;
}> = ({ assignmentId, mode = 'freeplay', theme, topic, tier, vocabularyList, onGameComplete }) => {
  // State
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'paused' | 'completed'>('ready');
  const [currentSentence, setCurrentSentence] = useState<SentenceData | null>(null);
  const [shuffledWords, setShuffledWords] = useState<WordItem[]>([]);
  const [placedWords, setPlacedWords] = useState<(WordItem | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [stats, setStats] = useState<GameStats>({
    score: 0,
    accuracy: 0,
    timeSpent: 0,
    sentencesCompleted: 0,
    streak: 0,
    highestStreak: 0,
    totalWordsPlaced: 0,
    grammarErrors: {},
    powerUpsUsed: {},
    gemsCollected: 0,
    bonusMultiplier: 1
  });
  const [powerUps, setPowerUps] = useState<PowerUp[]>([
    { id: 'shuffle', type: 'shuffle', active: false, cooldown: 0, description: 'Reshuffle words', icon: '🎲', gemCost: 3 },
    { id: 'hint', type: 'hint', active: false, cooldown: 0, description: 'Highlight correct word', icon: '💡', gemCost: 5 },
    { id: 'glow', type: 'glow', active: false, cooldown: 0, description: 'Show word positions', icon: '✨', gemCost: 4 },
    { id: 'timeBoost', type: 'timeBoost', active: false, cooldown: 0, description: 'Add 30 seconds', icon: '⏰', gemCost: 6 }
  ]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [availableSentences, setAvailableSentences] = useState<SentenceData[]>([]);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const [showGhostMode, setShowGhostMode] = useState(false);
  const [hintWordIndex, setHintWordIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSentenceResult, setShowSentenceResult] = useState(false);

  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const supabase = createBrowserClient();
  const searchParams = useSearchParams();

  // Initialize game
  useEffect(() => {
    fetchSentences();
  }, [assignmentId, mode]);

  // Timer effect
  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      endGame();
    }
    
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameState, timeLeft]);

  // Check for sentence completion when placedWords changes
  useEffect(() => {
    if (gameState === 'playing' && placedWords.every(w => w !== null)) {
      console.log('Sentence complete detected, checking correctness');
      checkSentenceCompleteWithWords(placedWords);
    }
  }, [placedWords, gameState]);

  // Fetch sentences from API with theme/topic support
  const fetchSentences = async () => {
    try {
      setIsLoading(true);
      
      // Map theme selections to API themes  
      const themeMapping: { [key: string]: string } = {
        'Identity and Culture': 'People and lifestyle',
        'Local Area, Holiday and Travel': 'Communication and the world around us',
        'School': 'People and lifestyle',
        'Future Aspirations, Study and Work': 'People and lifestyle',
        'International and Global Dimension': 'Communication and the world around us',
        'Animals and Nature': 'Communication and the world around us',
        'Travel and Culture': 'Communication and the world around us',
        'Technology and Modern Life': 'Popular culture'
      };
      
      const apiTheme = themeMapping[theme || ''] || 'People and lifestyle';
      
      const requestBody = {
        mode,
        assignmentId,
        theme: apiTheme,
        topic: topic || 'Identity and relationships',
        tier: tier || 'Foundation',
        count: 15, // Request more sentences for progression
        difficulty: 'medium',
        vocabularyList: vocabularyList || []
      };
      
      console.log('Sending API request with:', requestBody);
      
      const response = await fetch('/api/games/speed-builder/sentences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      });

      console.log('API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API response data:', data);
        setAvailableSentences(data.sentences || []);
        if (data.sentences?.length > 0) {
          console.log('Loading first sentence:', data.sentences[0]);
          loadSentence(data.sentences[0]);
          return; // Success, exit early
        } else {
          console.log('API returned no sentences, falling back to demo sentences');
        }
      } else {
        console.log('API response not ok, status:', response.status);
      }
      
      // If API fails or returns no sentences, use fallback demo sentences
      console.log('Using fallback demo sentences for theme:', theme, 'topic:', topic);
      const demoSentences = generateDemoSentences(theme, topic);
      setAvailableSentences(demoSentences);
      if (demoSentences.length > 0) {
        loadSentence(demoSentences[0]);
      }
    } catch (error) {
      console.error('Error fetching sentences:', error);
      // Fallback demo sentences
      const demoSentences = generateDemoSentences(theme, topic);
      setAvailableSentences(demoSentences);
      if (demoSentences.length > 0) {
        loadSentence(demoSentences[0]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Generate demo sentences based on theme/topic
  const generateDemoSentences = (selectedTheme?: string, selectedTopic?: string): SentenceData[] => {
    
    const animalSentences = [
      { spanish: "El gato come pescado", english: "The cat eats fish" },
      { spanish: "Los perros corren en el parque", english: "The dogs run in the park" },
      { spanish: "Mi caballo es muy rápido", english: "My horse is very fast" },
      { spanish: "La vaca da leche fresca", english: "The cow gives fresh milk" },
      { spanish: "Los pájaros vuelan alto", english: "The birds fly high" },
    ];

    const travelSentences = [
      { spanish: "Voy a la playa en verano", english: "I go to the beach in summer" },
      { spanish: "El hotel está cerca del aeropuerto", english: "The hotel is near the airport" },
      { spanish: "Necesito un mapa de la ciudad", english: "I need a map of the city" },
      { spanish: "El tren llega a las cinco", english: "The train arrives at five" },
      { spanish: "Mi maleta es muy pesada", english: "My suitcase is very heavy" },
    ];

    const familySentences = [
      { spanish: "Mi madre cocina muy bien", english: "My mother cooks very well" },
      { spanish: "Tengo dos hermanos mayores", english: "I have two older brothers" },
      { spanish: "Mis abuelos viven en España", english: "My grandparents live in Spain" },
      { spanish: "Mi padre trabaja en oficina", english: "My father works in an office" },
      { spanish: "La familia come junta", english: "The family eats together" },
    ];

    const schoolSentences = [
      { spanish: "Estudio matemáticas y ciencias", english: "I study math and science" },
      { spanish: "La profesora es muy simpática", english: "The teacher is very nice" },
      { spanish: "Los estudiantes hacen preguntas", english: "The students ask questions" },
      { spanish: "El examen es mañana", english: "The exam is tomorrow" },
      { spanish: "Me gusta aprender idiomas", english: "I like learning languages" },
    ];

    let selectedSentences;
    switch (selectedTheme) {
      case 'Local Area, Holiday and Travel':
      case 'Travel and Culture':
        selectedSentences = travelSentences;
        break;
      case 'Identity and Culture':
      case 'Family and Friends':
        selectedSentences = familySentences;
        break;
      case 'School':
        selectedSentences = schoolSentences;
        break;
      case 'Animals and Nature':
        selectedSentences = animalSentences;
        break;
      default:
        selectedSentences = animalSentences;
    }

    return selectedSentences.map((sentence, index) => ({
      id: `demo-${index}`,
      text: sentence.spanish,
      originalText: sentence.spanish,
      translatedText: sentence.english,
      language: 'Spanish',
      difficulty: 'medium' as const,
      curriculum: {
        tier: 'Foundation' as const,
        theme: selectedTheme || 'Animals',
        topic: selectedTopic || 'Basic Conversation'
      }
    }));
  };

  // Load a sentence for the game
  const loadSentence = (sentence: SentenceData) => {
    console.log('Loading sentence:', sentence.text);
    setCurrentSentence(sentence);
    setShowSentenceResult(false); // Reset feedback state
    
    // Split sentence into words and assign gem types
    const words = sentence.text.split(' ').map((word, index) => ({
      id: `word-${sentence.id}-${index}`, // More unique IDs
      text: word,
      index,
      correctPosition: index,
      correct: false,
      gemType: (['ruby', 'sapphire', 'emerald', 'amethyst', 'topaz', 'diamond'][index % 6] as 'ruby' | 'sapphire' | 'emerald' | 'amethyst' | 'topaz' | 'diamond')
    }));
    
    console.log('Created words:', words);
    
    // Shuffle words for gameplay - using a deterministic shuffle to avoid hydration issues
    const shuffled = [...words].sort((a, b) => a.text.length - b.text.length).reverse();
    setShuffledWords(shuffled);
    setPlacedWords(new Array(words.length).fill(null));
    setHintWordIndex(null);
    
    console.log('Shuffled words:', shuffled);
    console.log('Initialized placed words array with length:', words.length);
  };

  // Create gem collection effect (simplified - no floating gems)
  const createGemCollectionEffect = (value: number = 1) => {
    // Instead of floating gems, just update the gem counter with animation
    setStats(prev => ({
      ...prev,
      gemsCollected: prev.gemsCollected + value
    }));
  };

  // Track sentence completion
  const trackSentenceCompletion = async (success: boolean) => {
    if (sessionId && sessionId.startsWith('demo-')) return; // Skip for demo mode
    
    try {
      // This would send completion data to the API for tracking
      console.log(`Sentence ${success ? 'completed' : 'failed'}`);
    } catch (error) {
      console.error('Error tracking sentence completion:', error);
    }
  };

  // Load next sentence
  const loadNextSentence = () => {
    const nextIndex = currentSentenceIndex + 1;
    setCurrentSentenceIndex(nextIndex);
    
    if (nextIndex >= availableSentences.length) {
      // No more sentences, end the game
      endGame();
    } else {
      // Reset game state for next sentence
      setPlacedWords([]);
      setShuffledWords([]);
      setHintWordIndex(null);
      setShowGhostMode(false);
      setShowSentenceResult(false);
      
      // Load the next sentence
      loadSentence(availableSentences[nextIndex]);
    }
  };

  // Start game session
  const startGame = async () => {
    try {
      const response = await fetch('/api/games/speed-builder/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          assignmentId,
          gameMode: mode,
          settings: {
            timeLimit: 120,
            difficulty: 'medium',
            tier: tier || 'Foundation'
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSessionId(data.sessionId);
      } else {
        // Demo mode - generate a local session ID
        setSessionId(`demo-${Date.now()}`);
      }
    } catch (error) {
      console.error('Error starting session:', error);
      // Demo mode - generate a local session ID
      setSessionId(`demo-${Date.now()}`);
    }

    soundSystem.play('game-start');
    setGameState('playing');
    setTimeLeft(120);
  };

  // Simplified and reliable word drop handling
  const handleWordDrop = (word: WordItem, targetIndex: number) => {
    if (gameState !== 'playing') return;

    console.log(`Dropping word "${word.text}" (id: ${word.id}) to position ${targetIndex}`);

    // Handle removing word (clicking on placed word) - targetIndex = -1
    if (targetIndex === -1) {
      console.log('Removing word from placed position');
      setPlacedWords(prevPlaced => {
        const currentIndex = prevPlaced.findIndex(w => w?.id === word.id);
        if (currentIndex !== -1) {
          const newPlacedWords = [...prevPlaced];
          newPlacedWords[currentIndex] = null;
          
          // Add back to shuffled words
          setShuffledWords(prevShuffled => {
            const wordExists = prevShuffled.some(w => w.id === word.id);
            return wordExists ? prevShuffled : [...prevShuffled, word];
          });
          
          console.log(`Removed word from position ${currentIndex}, added back to shuffled`);
          return newPlacedWords;
        }
        return prevPlaced;
      });
      soundSystem.play('drop');
      return;
    }

    // Normal drop operation - use functional updates to ensure consistency
    setPlacedWords(prevPlaced => {
      console.log('Current placed words in setter:', prevPlaced.map((w, i) => `[${i}]: ${w ? `${w.text}(${w.id})` : 'null'}`));
      
      const newPlacedWords = [...prevPlaced];
      
      // Find where the word currently is in placed words
      const currentPlacedIndex = prevPlaced.findIndex(w => w?.id === word.id);
      console.log(`Word currently at placed index: ${currentPlacedIndex}`);
      console.log(`Target position ${targetIndex} currently has:`, newPlacedWords[targetIndex] ? `${newPlacedWords[targetIndex]?.text}(${newPlacedWords[targetIndex]?.id})` : 'null');
      
      // Only displace if there's actually a DIFFERENT word at the target position
      if (newPlacedWords[targetIndex] && newPlacedWords[targetIndex]?.id !== word.id) {
        const displacedWord = newPlacedWords[targetIndex];
        console.log(`Displacing DIFFERENT word "${displacedWord?.text}" from position ${targetIndex}`);
        
        // Add displaced word back to shuffled
        setShuffledWords(prevShuffled => {
          const existsInShuffled = prevShuffled.some(w => w.id === displacedWord!.id);
          return existsInShuffled ? prevShuffled : [...prevShuffled, displacedWord!];
        });
      }
      
      // Remove the word from its current placed position (only if it's different from target)
      if (currentPlacedIndex !== -1 && currentPlacedIndex !== targetIndex) {
        newPlacedWords[currentPlacedIndex] = null;
        console.log(`Cleared word from its previous placed position ${currentPlacedIndex}`);
      }
      
      // Place the word in the target position
      newPlacedWords[targetIndex] = word;
      console.log(`Placed word "${word.text}" at position ${targetIndex}`);
      
      console.log('New placed words:', newPlacedWords.map((w, i) => `[${i}]: ${w ? `${w.text}(${w.id})` : 'null'}`));
      
      return newPlacedWords;
    });

    // Remove word from shuffled words
    setShuffledWords(prevShuffled => {
      const currentShuffledIndex = prevShuffled.findIndex(w => w.id === word.id);
      if (currentShuffledIndex !== -1) {
        const newShuffledWords = [...prevShuffled];
        newShuffledWords.splice(currentShuffledIndex, 1);
        console.log(`Removed word from shuffled position ${currentShuffledIndex}`);
        console.log('New shuffled words:', newShuffledWords.map(w => `${w.text}(${w.id})`));
        return newShuffledWords;
      }
      return prevShuffled;
    });

    // Play sound
    soundSystem.play('drop');

    // Check if sentence is complete - we'll do this in a useEffect to ensure state is updated
  };

  // Check if sentence is complete (with words array parameter)
  const checkSentenceCompleteWithWords = (wordsArray: (WordItem | null)[]) => {
    if (wordsArray.length === 0 || wordsArray.some(w => w === null)) return;
    
    const isCorrect = wordsArray.every((word, index) => {
      if (!word || !currentSentence) return false;
      return word.correctPosition === index;
    });

    // Show feedback first
    setShowSentenceResult(true);

    if (isCorrect) {
      // Sentence is correct - celebrate and move to next
      soundSystem.play('sentence-complete');
      createGemCollectionEffect(wordsArray.length);
      
      // Update stats
      const newSentencesCompleted = stats.sentencesCompleted + 1;
      const baseGemsEarned = wordsArray.length;
      const streakBonus = Math.min(stats.streak, 3);
      const totalGemsEarned = baseGemsEarned + streakBonus;
      
      setStats(prev => ({
        ...prev,
        score: prev.score + (wordsArray.length * 10),
        sentencesCompleted: newSentencesCompleted,
        streak: prev.streak + 1,
        highestStreak: Math.max(prev.highestStreak, prev.streak + 1),
        gemsCollected: prev.gemsCollected + totalGemsEarned
      }));
      
      // Track sentence completion
      trackSentenceCompletion(true);
      
      // Show celebration effect
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.confetti) {
          window.confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 }
          });
        }
        
        // Move to next sentence after celebration
        setTimeout(() => {
          setShowSentenceResult(false);
          loadNextSentence();
        }, 1500);
      }, 500);

    } else {
      // Sentence has errors - give option to fix
      soundSystem.play('word-wrong');
      
      // After 3 seconds, give option to correct or move wrong words back
      setTimeout(() => {
        // Auto-return incorrect words to available pool
        const incorrectWords = wordsArray.filter((word, index) => 
          word && word.correctPosition !== index
        );
        
        if (incorrectWords.length > 0) {
          // Remove incorrect words from placed positions
          const newPlacedWords = [...placedWords];
          wordsArray.forEach((word, index) => {
            if (word && word.correctPosition !== index) {
              newPlacedWords[index] = null;
            }
          });
          setPlacedWords(newPlacedWords);
          
          // Add incorrect words back to shuffled words
          setShuffledWords(prev => {
            const currentIds = prev.map(w => w.id);
            const newWords = incorrectWords.filter((w): w is WordItem => w !== null && !currentIds.includes(w.id));
            return [...prev, ...newWords];
          });
        }
        
        setShowSentenceResult(false);
      }, 3000);
    }
  };

  // Check if sentence is complete (legacy function using state)
  const checkSentenceComplete = () => {
    checkSentenceCompleteWithWords(placedWords);
  };

  // Enhanced power-up activation
  const activatePowerUp = (powerUpId: string) => {
    const powerUp = powerUps.find(p => p.id === powerUpId);
    if (!powerUp || stats.gemsCollected < powerUp.gemCost) return;

    // Deduct gem cost
    setStats(prev => ({
      ...prev,
      gemsCollected: prev.gemsCollected - powerUp.gemCost,
      powerUpsUsed: { ...prev.powerUpsUsed, [powerUpId]: (prev.powerUpsUsed[powerUpId] || 0) + 1 }
    }));

    // Apply power-up effects
    switch (powerUpId) {
      case 'shuffle':
        setShuffledWords(prev => [...prev].sort((a, b) => b.text.length - a.text.length));
        break;
      case 'hint':
        const nextCorrectIndex = placedWords.findIndex(w => w === null);
        if (nextCorrectIndex !== -1) {
          setHintWordIndex(nextCorrectIndex);
          setTimeout(() => setHintWordIndex(null), 3000);
        }
        break;
      case 'glow':
        setShowGhostMode(true);
        setTimeout(() => setShowGhostMode(false), 5000);
        break;
      case 'timeBoost':
        setTimeLeft(prev => Math.min(prev + 30, 180));
        break;
    }

    // Set cooldown
    setPowerUps(prev => prev.map(p => 
      p.id === powerUpId ? { ...p, active: true, cooldown: 10 } : p
    ));

    setTimeout(() => {
      setPowerUps(prev => prev.map(p => 
        p.id === powerUpId ? { ...p, active: false, cooldown: 0 } : p
      ));
    }, 10000);
    soundSystem.play('power-up');
  };

  const endGame = async () => {
    setGameState('completed');
    
    if (sessionId && sessionId !== `demo-${Date.now()}`) {
      try {
        await fetch('/api/games/speed-builder/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'end',
            sessionId,
            stats,
            sentences: availableSentences.slice(0, currentSentenceIndex + 1).map(sentence => ({
              id: sentence.id,
              text: sentence.text,
              englishTranslation: sentence.originalText,
              timeToComplete: 10,
              attempts: 1,
              correctOnFirstTry: true,
              grammarFocus: sentence.curriculum?.grammarFocus,
              curriculum: {
                tier: sentence.curriculum?.tier,
                theme: sentence.curriculum?.theme,
                topic: sentence.curriculum?.topic
              }
            }))
          })
        });
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }

    // Celebration confetti
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });
    soundSystem.play('level-complete');
    
    // Call onGameComplete callback if provided
    if (onGameComplete) {
      onGameComplete(stats);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-6xl"
        >
          💎
        </motion.div>
        <span className="ml-4 text-2xl text-white font-bold">Loading Gem Magic...</span>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden flex flex-col">
        {/* Background gem effects only */}
        
        {/* Fixed Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {backgroundGemPositions.map((pos, i) => (
            <motion.div
              key={i}
              animate={{
                y: [0, -10, 0],
                opacity: [0.2, 0.4, 0.2],
                scale: [1, 1.05, 1],
              }}
              transition={{
                repeat: Infinity,
                duration: 3 + (i % 3),
                delay: i * 0.2,
              }}
              className={`absolute w-3 h-3 bg-gradient-to-br ${Object.values(gemColors)[i % 6]} rounded transform rotate-45 opacity-20`}
              style={{
                left: `${pos.left}%`,
                top: `${pos.top}%`,
              }}
            />
          ))}
        </div>

        {/* Compact Header with integrated stats */}
        <div className="relative z-20 p-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-3">
            <Link href="/games" className="text-white/80 hover:text-white transition-colors">
              <Home className="w-6 h-6" />
            </Link>
            
            {/* Integrated Stats & Gem Counter */}
            {gameState === 'playing' && (
              <div className="flex items-center gap-4">
                {/* Quick Stats */}
                <div className="flex gap-3">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-300">{stats.sentencesCompleted}</div>
                    <div className="text-xs text-white/60">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-300">{Math.round(stats.accuracy * 100)}%</div>
                    <div className="text-xs text-white/60">Accuracy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-300">{stats.streak}</div>
                    <div className="text-xs text-white/60">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-300">{stats.score}</div>
                    <div className="text-xs text-white/60">Score</div>
                  </div>
                </div>
                
                {/* Gem Counter */}
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 px-4 py-2 rounded-lg border border-white/30 shadow-lg"
                >
                  <div className="flex items-center gap-2">
                    <Gem className="w-5 h-5 text-white" />
                    <span className="text-lg font-bold text-white">{stats.gemsCollected}</span>
                  </div>
                </motion.div>
              </div>
            )}

            {gameState === 'playing' && (
              <motion.div
                animate={{ scale: timeLeft < 20 ? [1, 1.05, 1] : 1 }}
                transition={{ repeat: Infinity, duration: 0.5 }}
                className={`px-3 py-2 rounded-lg border font-bold ${timeLeft < 20 ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-blue-500/20 border-blue-400 text-blue-200'}`}
              >
                <Clock className="inline w-4 h-4 mr-1" />
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </motion.div>
            )}
          </div>

          {/* Power-ups in header */}
          {gameState === 'playing' && (
            <div className="flex justify-center gap-2">
              {powerUps.map(powerUp => (
                <GemPowerUpButton
                  key={powerUp.id}
                  powerUp={powerUp}
                  onActivate={activatePowerUp}
                  disabled={gameState !== 'playing'}
                  gemsAvailable={stats.gemsCollected}
                />
              ))}
            </div>
          )}
        </div>

        {/* Main Game Content - No Scrolling */}
        <div className="relative z-10 flex-1 flex flex-col px-4 min-h-0">
          {gameState === 'ready' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="text-6xl mb-4"
              >
                💎
              </motion.div>
              <h1 className="text-4xl font-bold text-white mb-3">
                Gem Speed Builder
              </h1>
              <p className="text-lg text-white/80 mb-6 max-w-lg">
                Arrange magical gem-words to form perfect sentences!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 border border-white/20"
              >
                <Play className="inline w-5 h-5 mr-2" />
                Start Gem Quest
              </motion.button>
            </motion.div>
          )}

          {currentSentence && gameState === 'playing' && (
            <div className="flex-1 flex flex-col gap-4 min-h-0">
              {/* Sentence Challenge - Compact */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 text-center flex-shrink-0"
              >
                <h2 className="text-xl font-bold text-white mb-2">
                  🪄 Create: <span className="text-yellow-300">"{currentSentence.originalText}"</span>
                </h2>
                {currentSentence.curriculum && (
                  <div className="flex flex-wrap justify-center gap-2 text-xs">
                    <span className="px-2 py-1 bg-blue-500/30 text-blue-200 rounded-full">
                      {currentSentence.curriculum.tier}
                    </span>
                    <span className="px-2 py-1 bg-green-500/30 text-green-200 rounded-full">
                      {currentSentence.curriculum.theme}
                    </span>
                  </div>
                )}
              </motion.div>

              {/* Drop Targets - Compact */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 flex-shrink-0"
              >
                <h3 className="text-base font-bold text-center mb-3 text-white">
                  ✨ Place gems in order:
                </h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {placedWords.map((word, index) => (
                    <GemDropTarget
                      key={index}
                      index={index}
                      word={word}
                      onDrop={handleWordDrop}
                      showSentenceResult={showSentenceResult}
                      isCorrect={word?.index === index}
                      showGhostWord={showGhostMode ? currentSentence.text.split(' ')[index] : undefined}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Available Gem Words - Flexible */}
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/5 backdrop-blur-lg rounded-xl p-4 flex-1 min-h-0"
              >
                <h3 className="text-base font-bold text-center mb-3 text-white">
                  💎 Available Words:
                </h3>
                <div className="flex flex-wrap justify-center gap-3 h-full items-start content-start overflow-y-auto">
                  {shuffledWords
                    .filter(word => !placedWords.some(placed => placed?.id === word.id))
                    .map(word => (
                      <GemDraggableWord
                        key={word.id}
                        word={word}
                        isGlowing={hintWordIndex !== null && word.index === hintWordIndex}
                        onWordClick={(clickedWord) => {
                          const nextEmptyIndex = placedWords.findIndex(w => w === null);
                          if (nextEmptyIndex !== -1) {
                            handleWordDrop(clickedWord, nextEmptyIndex);
                          }
                        }}
                      />
                    ))}
                </div>
              </motion.div>
            </div>
          )}

          {/* Compact Game Over Screen */}
          {gameState === 'completed' && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/90 to-blue-900/90 backdrop-blur-xl rounded-2xl p-6 text-center border border-white/20 shadow-xl"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-xl"
              >
                <Crown className="w-8 h-8 text-white" />
              </motion.div>
              
              <h2 className="text-2xl font-bold text-white mb-4">
                🎉 Gem Master!
              </h2>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-3 bg-blue-500/20 rounded-xl border border-blue-400/50"
                >
                  <div className="text-2xl font-bold text-blue-300">{stats.score}</div>
                  <div className="text-sm text-blue-200">Score</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="p-3 bg-green-500/20 rounded-xl border border-green-400/50"
                >
                  <div className="text-2xl font-bold text-green-300">{stats.sentencesCompleted}</div>
                  <div className="text-sm text-green-200">Sentences</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="p-3 bg-purple-500/20 rounded-xl border border-purple-400/50"
                >
                  <div className="text-2xl font-bold text-purple-300">{Math.round(stats.accuracy * 100)}%</div>
                  <div className="text-sm text-purple-200">Accuracy</div>
                </motion.div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="p-3 bg-yellow-500/20 rounded-xl border border-yellow-400/50"
                >
                  <div className="text-2xl font-bold text-yellow-300">{stats.gemsCollected}</div>
                  <div className="text-sm text-yellow-200">Gems</div>
                </motion.div>
              </div>

              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                >
                  <Play className="w-4 h-4 inline mr-2" />
                  Play Again
                </motion.button>
                
                <Link
                  href="/games"
                  className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-white/20 transition-all duration-300 inline-flex items-center border border-white/20"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </DndProvider>
  );
}; 