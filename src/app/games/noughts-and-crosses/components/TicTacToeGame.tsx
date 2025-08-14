'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import FullscreenToggle from '../../../components/FullscreenToggle';
import { Trophy, Star, Zap, Target, Medal, Crown, Brain, Lightbulb } from 'lucide-react';

// Language data for the game
const VOCABULARY = {
  animals: {
    spanish: [
      { word: 'perro', translation: 'dog', difficulty: 'beginner' },
      { word: 'gato', translation: 'cat', difficulty: 'beginner' },
      { word: 'pájaro', translation: 'bird', difficulty: 'beginner' },
      { word: 'caballo', translation: 'horse', difficulty: 'beginner' },
      { word: 'conejo', translation: 'rabbit', difficulty: 'beginner' },
      { word: 'elefante', translation: 'elephant', difficulty: 'intermediate' },
      { word: 'jirafa', translation: 'giraffe', difficulty: 'intermediate' },
      { word: 'león', translation: 'lion', difficulty: 'intermediate' },
      { word: 'rinoceronte', translation: 'rhinoceros', difficulty: 'advanced' },
      { word: 'murciélago', translation: 'bat', difficulty: 'advanced' },
      { word: 'ornitorrinco', translation: 'platypus', difficulty: 'advanced' }
    ],
    french: [
      { word: 'chien', translation: 'dog', difficulty: 'beginner' },
      { word: 'chat', translation: 'cat', difficulty: 'beginner' },
      { word: 'oiseau', translation: 'bird', difficulty: 'beginner' },
      { word: 'cheval', translation: 'horse', difficulty: 'beginner' },
      { word: 'lapin', translation: 'rabbit', difficulty: 'beginner' },
      { word: 'éléphant', translation: 'elephant', difficulty: 'intermediate' },
      { word: 'girafe', translation: 'giraffe', difficulty: 'intermediate' },
      { word: 'lion', translation: 'lion', difficulty: 'intermediate' },
      { word: 'rhinocéros', translation: 'rhinoceros', difficulty: 'advanced' },
      { word: 'chauve-souris', translation: 'bat', difficulty: 'advanced' },
      { word: 'ornithorynque', translation: 'platypus', difficulty: 'advanced' }
    ],
    german: [
      { word: 'Hund', translation: 'dog', difficulty: 'beginner' },
      { word: 'Katze', translation: 'cat', difficulty: 'beginner' },
      { word: 'Vogel', translation: 'bird', difficulty: 'beginner' },
      { word: 'Pferd', translation: 'horse', difficulty: 'beginner' },
      { word: 'Kaninchen', translation: 'rabbit', difficulty: 'beginner' },
      { word: 'Elefant', translation: 'elephant', difficulty: 'intermediate' },
      { word: 'Giraffe', translation: 'giraffe', difficulty: 'intermediate' },
      { word: 'Löwe', translation: 'lion', difficulty: 'intermediate' },
      { word: 'Nashorn', translation: 'rhinoceros', difficulty: 'advanced' },
      { word: 'Fledermaus', translation: 'bat', difficulty: 'advanced' },
      { word: 'Schnabeltier', translation: 'platypus', difficulty: 'advanced' }
    ],
    italian: [
      { word: 'cane', translation: 'dog', difficulty: 'beginner' },
      { word: 'gatto', translation: 'cat', difficulty: 'beginner' },
      { word: 'uccello', translation: 'bird', difficulty: 'beginner' },
      { word: 'cavallo', translation: 'horse', difficulty: 'beginner' },
      { word: 'coniglio', translation: 'rabbit', difficulty: 'beginner' },
      { word: 'elefante', translation: 'elephant', difficulty: 'intermediate' },
      { word: 'giraffa', translation: 'giraffe', difficulty: 'intermediate' },
      { word: 'leone', translation: 'lion', difficulty: 'intermediate' },
      { word: 'rinoceronte', translation: 'rhinoceros', difficulty: 'advanced' },
      { word: 'pipistrello', translation: 'bat', difficulty: 'advanced' },
      { word: 'ornitorinco', translation: 'platypus', difficulty: 'advanced' }
    ]
  },
  food: {
    spanish: [
      { word: 'manzana', translation: 'apple', difficulty: 'beginner' },
      { word: 'pan', translation: 'bread', difficulty: 'beginner' },
      { word: 'queso', translation: 'cheese', difficulty: 'beginner' },
      { word: 'leche', translation: 'milk', difficulty: 'beginner' },
      { word: 'arroz', translation: 'rice', difficulty: 'beginner' },
      { word: 'espinacas', translation: 'spinach', difficulty: 'intermediate' },
      { word: 'champiñones', translation: 'mushrooms', difficulty: 'intermediate' },
      { word: 'aguacate', translation: 'avocado', difficulty: 'intermediate' },
      { word: 'alcachofa', translation: 'artichoke', difficulty: 'advanced' },
      { word: 'remolacha', translation: 'beetroot', difficulty: 'advanced' },
      { word: 'berenjenas', translation: 'eggplant', difficulty: 'advanced' }
    ],
    french: [
      { word: 'pomme', translation: 'apple', difficulty: 'beginner' },
      { word: 'pain', translation: 'bread', difficulty: 'beginner' },
      { word: 'fromage', translation: 'cheese', difficulty: 'beginner' },
      { word: 'lait', translation: 'milk', difficulty: 'beginner' },
      { word: 'riz', translation: 'rice', difficulty: 'beginner' },
      { word: 'épinards', translation: 'spinach', difficulty: 'intermediate' },
      { word: 'champignons', translation: 'mushrooms', difficulty: 'intermediate' },
      { word: 'avocat', translation: 'avocado', difficulty: 'intermediate' },
      { word: 'artichaut', translation: 'artichoke', difficulty: 'advanced' },
      { word: 'betterave', translation: 'beetroot', difficulty: 'advanced' },
      { word: 'aubergine', translation: 'eggplant', difficulty: 'advanced' }
    ],
    german: [
      { word: 'Apfel', translation: 'apple', difficulty: 'beginner' },
      { word: 'Brot', translation: 'bread', difficulty: 'beginner' },
      { word: 'Käse', translation: 'cheese', difficulty: 'beginner' },
      { word: 'Milch', translation: 'milk', difficulty: 'beginner' },
      { word: 'Reis', translation: 'rice', difficulty: 'beginner' },
      { word: 'Spinat', translation: 'spinach', difficulty: 'intermediate' },
      { word: 'Pilze', translation: 'mushrooms', difficulty: 'intermediate' },
      { word: 'Avocado', translation: 'avocado', difficulty: 'intermediate' },
      { word: 'Artischocke', translation: 'artichoke', difficulty: 'advanced' },
      { word: 'Rote Bete', translation: 'beetroot', difficulty: 'advanced' },
      { word: 'Aubergine', translation: 'eggplant', difficulty: 'advanced' }
    ],
    italian: [
      { word: 'mela', translation: 'apple', difficulty: 'beginner' },
      { word: 'pane', translation: 'bread', difficulty: 'beginner' },
      { word: 'formaggio', translation: 'cheese', difficulty: 'beginner' },
      { word: 'latte', translation: 'milk', difficulty: 'beginner' },
      { word: 'riso', translation: 'rice', difficulty: 'beginner' },
      { word: 'spinaci', translation: 'spinach', difficulty: 'intermediate' },
      { word: 'funghi', translation: 'mushrooms', difficulty: 'intermediate' },
      { word: 'avocado', translation: 'avocado', difficulty: 'intermediate' },
      { word: 'carciofo', translation: 'artichoke', difficulty: 'advanced' },
      { word: 'barbabietola', translation: 'beetroot', difficulty: 'advanced' },
      { word: 'melanzane', translation: 'eggplant', difficulty: 'advanced' }
    ]
  },
  colors: {
    spanish: [
      { word: 'rojo', translation: 'red', difficulty: 'beginner' },
      { word: 'azul', translation: 'blue', difficulty: 'beginner' },
      { word: 'verde', translation: 'green', difficulty: 'beginner' },
      { word: 'amarillo', translation: 'yellow', difficulty: 'beginner' },
      { word: 'negro', translation: 'black', difficulty: 'beginner' },
      { word: 'morado', translation: 'purple', difficulty: 'intermediate' },
      { word: 'anaranjado', translation: 'orange', difficulty: 'intermediate' },
      { word: 'rosado', translation: 'pink', difficulty: 'intermediate' },
      { word: 'turquesa', translation: 'turquoise', difficulty: 'advanced' },
      { word: 'bermellón', translation: 'vermilion', difficulty: 'advanced' },
      { word: 'escarlata', translation: 'scarlet', difficulty: 'advanced' }
    ],
    french: [
      { word: 'rouge', translation: 'red', difficulty: 'beginner' },
      { word: 'bleu', translation: 'blue', difficulty: 'beginner' },
      { word: 'vert', translation: 'green', difficulty: 'beginner' },
      { word: 'jaune', translation: 'yellow', difficulty: 'beginner' },
      { word: 'noir', translation: 'black', difficulty: 'beginner' },
      { word: 'violet', translation: 'purple', difficulty: 'intermediate' },
      { word: 'orange', translation: 'orange', difficulty: 'intermediate' },
      { word: 'rose', translation: 'pink', difficulty: 'intermediate' },
      { word: 'turquoise', translation: 'turquoise', difficulty: 'advanced' },
      { word: 'vermillon', translation: 'vermilion', difficulty: 'advanced' },
      { word: 'écarlate', translation: 'scarlet', difficulty: 'advanced' }
    ],
    german: [
      { word: 'rot', translation: 'red', difficulty: 'beginner' },
      { word: 'blau', translation: 'blue', difficulty: 'beginner' },
      { word: 'grün', translation: 'green', difficulty: 'beginner' },
      { word: 'gelb', translation: 'yellow', difficulty: 'beginner' },
      { word: 'schwarz', translation: 'black', difficulty: 'beginner' },
      { word: 'lila', translation: 'purple', difficulty: 'intermediate' },
      { word: 'orange', translation: 'orange', difficulty: 'intermediate' },
      { word: 'rosa', translation: 'pink', difficulty: 'intermediate' },
      { word: 'türkis', translation: 'turquoise', difficulty: 'advanced' },
      { word: 'zinnoberrot', translation: 'vermilion', difficulty: 'advanced' },
      { word: 'scharlachrot', translation: 'scarlet', difficulty: 'advanced' }
    ],
    italian: [
      { word: 'rosso', translation: 'red', difficulty: 'beginner' },
      { word: 'blu', translation: 'blue', difficulty: 'beginner' },
      { word: 'verde', translation: 'green', difficulty: 'beginner' },
      { word: 'giallo', translation: 'yellow', difficulty: 'beginner' },
      { word: 'nero', translation: 'black', difficulty: 'beginner' },
      { word: 'viola', translation: 'purple', difficulty: 'intermediate' },
      { word: 'arancione', translation: 'orange', difficulty: 'intermediate' },
      { word: 'rosa', translation: 'pink', difficulty: 'intermediate' },
      { word: 'turchese', translation: 'turquoise', difficulty: 'advanced' },
      { word: 'vermiglione', translation: 'vermilion', difficulty: 'advanced' },
      { word: 'scarlatto', translation: 'scarlet', difficulty: 'advanced' }
    ]
  },
  places: {
    spanish: [
      { word: 'casa', translation: 'house', difficulty: 'beginner' },
      { word: 'escuela', translation: 'school', difficulty: 'beginner' },
      { word: 'tienda', translation: 'store', difficulty: 'beginner' },
      { word: 'parque', translation: 'park', difficulty: 'beginner' },
      { word: 'playa', translation: 'beach', difficulty: 'beginner' },
      { word: 'biblioteca', translation: 'library', difficulty: 'intermediate' },
      { word: 'restaurante', translation: 'restaurant', difficulty: 'intermediate' },
      { word: 'estadio', translation: 'stadium', difficulty: 'intermediate' },
      { word: 'acantilado', translation: 'cliff', difficulty: 'advanced' },
      { word: 'faro', translation: 'lighthouse', difficulty: 'advanced' },
      { word: 'cementerio', translation: 'cemetery', difficulty: 'advanced' }
    ],
    french: [
      { word: 'maison', translation: 'house', difficulty: 'beginner' },
      { word: 'école', translation: 'school', difficulty: 'beginner' },
      { word: 'magasin', translation: 'store', difficulty: 'beginner' },
      { word: 'parc', translation: 'park', difficulty: 'beginner' },
      { word: 'plage', translation: 'beach', difficulty: 'beginner' },
      { word: 'bibliothèque', translation: 'library', difficulty: 'intermediate' },
      { word: 'restaurant', translation: 'restaurant', difficulty: 'intermediate' },
      { word: 'stade', translation: 'stadium', difficulty: 'intermediate' },
      { word: 'falaise', translation: 'cliff', difficulty: 'advanced' },
      { word: 'phare', translation: 'lighthouse', difficulty: 'advanced' },
      { word: 'cimetière', translation: 'cemetery', difficulty: 'advanced' }
    ],
    german: [
      { word: 'Haus', translation: 'house', difficulty: 'beginner' },
      { word: 'Schule', translation: 'school', difficulty: 'beginner' },
      { word: 'Laden', translation: 'store', difficulty: 'beginner' },
      { word: 'Park', translation: 'park', difficulty: 'beginner' },
      { word: 'Strand', translation: 'beach', difficulty: 'beginner' },
      { word: 'Bibliothek', translation: 'library', difficulty: 'intermediate' },
      { word: 'Restaurant', translation: 'restaurant', difficulty: 'intermediate' },
      { word: 'Stadion', translation: 'stadium', difficulty: 'intermediate' },
      { word: 'Klippe', translation: 'cliff', difficulty: 'advanced' },
      { word: 'Leuchtturm', translation: 'lighthouse', difficulty: 'advanced' },
      { word: 'Friedhof', translation: 'cemetery', difficulty: 'advanced' }
    ],
    italian: [
      { word: 'casa', translation: 'house', difficulty: 'beginner' },
      { word: 'scuola', translation: 'school', difficulty: 'beginner' },
      { word: 'negozio', translation: 'store', difficulty: 'beginner' },
      { word: 'parco', translation: 'park', difficulty: 'beginner' },
      { word: 'spiaggia', translation: 'beach', difficulty: 'beginner' },
      { word: 'biblioteca', translation: 'library', difficulty: 'intermediate' },
      { word: 'ristorante', translation: 'restaurant', difficulty: 'intermediate' },
      { word: 'stadio', translation: 'stadium', difficulty: 'intermediate' },
      { word: 'scogliera', translation: 'cliff', difficulty: 'advanced' },
      { word: 'faro', translation: 'lighthouse', difficulty: 'advanced' },
      { word: 'cimitero', translation: 'cemetery', difficulty: 'advanced' }
    ]
  }
};

// Dictionary to help with AI difficulty
const AI_INTELLIGENCE = {
  beginner: 0.3, // AI makes mistakes 70% of the time
  intermediate: 0.6, // AI makes mistakes 40% of the time
  advanced: 0.85 // AI makes mistakes 15% of the time
};

// Achievement system
interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress: number;
  target: number;
}

// XP and leveling system
interface PlayerProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalWordsLearned: number;
  gamesWon: number;
  streak: number;
  achievements: Achievement[];
}

// Enhanced game statistics
interface GameStats {
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
  wordsReviewed: string[];
  perfectRounds: number;
}

// Particle effect configurations
const PARTICLE_CONFIGS = {
  correct: {
    particleCount: 50,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#10B981', '#34D399', '#6EE7B7']
  },
  win: {
    particleCount: 200,
    spread: 160,
    origin: { y: 0.3 },
    colors: ['#8B5CF6', '#A78BFA', '#C4B5FD', '#E879F9']
  },
  levelUp: {
    particleCount: 100,
    spread: 100,
    origin: { y: 0.4 },
    colors: ['#F59E0B', '#FBBF24', '#FCD34D']
  }
};

type VocabItem = {
  word: string;
  translation: string;
  difficulty: string;
};

type CellContent = {
  mark: string;
  vocabItem?: VocabItem;
  learned: boolean;
};

type GameSettings = {
  difficulty: string;
  category: string;
  language: string;
  playerMark: string;
  computerMark: string;
};

type TicTacToeGameProps = {
  settings: GameSettings;
  onBackToMenu: () => void;
  onGameEnd: (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number }) => void;
};

export default function TicTacToeGame({ settings, onBackToMenu, onGameEnd }: TicTacToeGameProps) {
  const [board, setBoard] = useState<CellContent[]>(Array(9).fill({ mark: '', learned: false }));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [playerMark] = useState<string>(settings.playerMark || 'X');
  const [computerMark] = useState<string>(settings.computerMark || 'O');
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'playerWin' | 'aiWin' | 'tie'>('playing');
  const [wordsLearned, setWordsLearned] = useState(0);
  
  // Enhanced progression system
  const [playerProgress, setPlayerProgress] = useState<PlayerProgress>({
    level: 1,
    xp: 0,
    xpToNextLevel: 100,
    totalWordsLearned: 0,
    gamesWon: 0,
    streak: 0,
    achievements: []
  });
  
  const [gameStats, setGameStats] = useState<GameStats>({
    correctAnswers: 0,
    wrongAnswers: 0,
    timeSpent: 0,
    wordsReviewed: [],
    perfectRounds: 0
  });
  
  // UI state
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [startTime] = useState(Date.now());
  
  // Quiz state for language learning feature
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{
    vocabItem: VocabItem;
    cellIndex: number;
    options: string[];
  } | null>(null);
  
  // Audio references - Enhanced with Howl
  const [sounds] = useState({
    correct: new Howl({ src: ['/sounds/correct.mp3'], volume: 0.5 }),
    wrong: new Howl({ src: ['/sounds/wrong.mp3', '/sounds/incorrect.mp3'], volume: 0.5 }),
    click: new Howl({ src: ['/sounds/click.mp3', '/sounds/ui-click.mp3'], volume: 0.3 }),
    win: new Howl({ src: ['/sounds/level-complete.mp3', '/sounds/correct.mp3'], volume: 0.7 }),
    levelUp: new Howl({ src: ['/sounds/powerup.mp3', '/sounds/correct.mp3'], volume: 0.6 }),
    achievement: new Howl({ src: ['/sounds/powerup.mp3', '/sounds/level-complete.mp3'], volume: 0.6 })
  });
  
  // Available vocabulary for the game based on settings
  const [availableVocabulary, setAvailableVocabulary] = useState<VocabItem[]>([]);
  
  // Ref for fullscreen functionality
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Initialize game
  useEffect(() => {
    // Load player progress from localStorage
    const savedProgress = localStorage.getItem('tictactoe_progress');
    if (savedProgress) {
      setPlayerProgress(JSON.parse(savedProgress));
    }
    
    // Initialize achievements
    initializeAchievements();
    
    // Get vocabulary based on settings
    const vocabulary = VOCABULARY[settings.category as keyof typeof VOCABULARY]?.[
      settings.language as keyof (typeof VOCABULARY)[keyof typeof VOCABULARY]
    ] || [];
    
    // Filter by difficulty
    const difficultyLevels = {
      beginner: ['beginner'],
      intermediate: ['beginner', 'intermediate'],
      advanced: ['beginner', 'intermediate', 'advanced']
    };
    
    const filteredVocabulary = vocabulary.filter(item => 
      difficultyLevels[settings.difficulty as keyof typeof difficultyLevels].includes(item.difficulty)
    );
    
    setAvailableVocabulary(filteredVocabulary);
    
    // Reset the board
    resetGame();
  }, [settings]);
  
  // Handle end of game
  useEffect(() => {
    if (gameStatus !== 'playing') {
      setTimeout(() => {
        onGameEnd({
          outcome: gameStatus === 'playerWin' ? 'win' : gameStatus === 'aiWin' ? 'loss' : 'tie',
          wordsLearned
        });
      }, 1500);
    }
  }, [gameStatus, wordsLearned, onGameEnd]);
  
  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill({ mark: '', learned: false }));
    setIsPlayerTurn(true);
    setGameStatus('playing');
  };
  
  // Get a random word from available vocabulary
  const getRandomWord = (): VocabItem => {
    if (availableVocabulary.length === 0) {
      return { word: 'default', translation: 'default', difficulty: 'beginner' };
    }
    return availableVocabulary[Math.floor(Math.random() * availableVocabulary.length)];
  };
  
  // Generate options for quiz
  const generateQuizOptions = (correctAnswer: string): string[] => {
    const options = [correctAnswer];
    const allTranslations = availableVocabulary.map(item => item.translation);
    
    // Add 3 random wrong options
    while (options.length < 4 && allTranslations.length > options.length) {
      const randomWord = allTranslations[Math.floor(Math.random() * allTranslations.length)];
      if (!options.includes(randomWord)) {
        options.push(randomWord);
      }
    }
    
    // Shuffle the options
    return options.sort(() => Math.random() - 0.5);
  };
  
  // Check if there's a winner
  const checkWinner = (boardState: CellContent[]): 'X' | 'O' | 'tie' | null => {
    // Winning combinations
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    // Check for winner
    for (const [a, b, c] of lines) {
      if (boardState[a].mark && boardState[a].mark === boardState[b].mark && boardState[a].mark === boardState[c].mark) {
        return boardState[a].mark as 'X' | 'O';
      }
    }
    
    // Check for tie
    if (boardState.every(cell => cell.mark !== '')) {
      return 'tie';
    }
    
    return null;
  };
  
  // Get best move for AI based on difficulty
  const getAIMove = (boardState: CellContent[]): number => {
    const intelligence = AI_INTELLIGENCE[settings.difficulty as keyof typeof AI_INTELLIGENCE];
    
    // Randomly decide if AI should make an intelligent move or a random move
    if (Math.random() > intelligence) {
      // Make a random move
      const emptyCells = boardState
        .map((cell, index) => cell.mark === '' ? index : -1)
        .filter(index => index !== -1);
      
      return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }
    
    // Make an intelligent move
    
    // Check if AI can win
    for (let i = 0; i < 9; i++) {
      if (boardState[i].mark === '') {
        const boardCopy = [...boardState];
        boardCopy[i] = { ...boardState[i], mark: 'O' };
        if (checkWinner(boardCopy) === 'O') {
          return i;
        }
      }
    }
    
    // Check if AI needs to block player
    for (let i = 0; i < 9; i++) {
      if (boardState[i].mark === '') {
        const boardCopy = [...boardState];
        boardCopy[i] = { ...boardState[i], mark: 'X' };
        if (checkWinner(boardCopy) === 'X') {
          return i;
        }
      }
    }
    
    // Try to take center
    if (boardState[4].mark === '') {
      return 4;
    }
    
    // Try to take corners
    const corners = [0, 2, 6, 8];
    const emptyCorners = corners.filter(i => boardState[i].mark === '');
    if (emptyCorners.length > 0) {
      return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
    }
    
    // Take any available edge
    const edges = [1, 3, 5, 7];
    const emptyEdges = edges.filter(i => boardState[i].mark === '');
    if (emptyEdges.length > 0) {
      return emptyEdges[Math.floor(Math.random() * emptyEdges.length)];
    }
    
    // Fallback: take any available cell
    for (let i = 0; i < 9; i++) {
      if (boardState[i].mark === '') {
        return i;
      }
    }
    
    return -1; // Should never happen
  };
  
  // Handle player's move
  const handleCellClick = (index: number) => {
    // Ignore if cell is already taken or game is over
    if (board[index].mark !== '' || gameStatus !== 'playing' || !isPlayerTurn) {
      return;
    }

    sounds.click.play();
    
    // Get a vocabulary item for this cell
    const vocabItem = getRandomWord();
    
    // Update the board
    const newBoard = [...board];
    newBoard[index] = { mark: 'X', vocabItem, learned: false };
    setBoard(newBoard);
    
    // Check if the move resulted in a win or tie
    const result = checkWinner(newBoard);
    if (result) {
      if (result === 'X') {
        setGameStatus('playerWin');
        sounds.win.play();
        triggerParticles('win');
      } else if (result === 'tie') {
        setGameStatus('tie');
        sounds.wrong.play();
      }
      return;
    }
    
    // Show quiz for the word
    setCurrentQuiz({
      vocabItem,
      cellIndex: index,
      options: generateQuizOptions(vocabItem.translation)
    });
    setShowQuiz(true);
  };
  
  // Handle AI's turn
  const makeAIMove = () => {
    // If game is already over, do nothing
    if (gameStatus !== 'playing') {
      return;
    }
    
    // Get AI's move
    const aiMoveIndex = getAIMove(board);
    if (aiMoveIndex === -1) {
      return;
    }
    
    // Get a vocabulary item for this cell
    const vocabItem = getRandomWord();
    
    // Update the board
    setTimeout(() => {
      sounds.click.play();
      
      const newBoard = [...board];
      newBoard[aiMoveIndex] = { mark: 'O', vocabItem, learned: false };
      setBoard(newBoard);
      
      // Check if the move resulted in a win or tie
      const result = checkWinner(newBoard);
      if (result) {
        if (result === 'O') {
          setGameStatus('aiWin');
          sounds.wrong.play();
        } else if (result === 'tie') {
          setGameStatus('tie');
          sounds.wrong.play();
        }
      } else {
        // Player's turn again
        setIsPlayerTurn(true);
      }
    }, 500);
  };
  
  // Handle quiz answer
  const handleQuizAnswer = (answer: string) => {
    if (!currentQuiz) return;
    
    const isCorrect = answer === currentQuiz.vocabItem.translation;
    
    if (isCorrect) {
      sounds.correct.play();
      triggerParticles('correct');
      addXP(10);
      
      // Update game stats
      setGameStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        wordsReviewed: [...prev.wordsReviewed, currentQuiz.vocabItem.word]
      }));
      
      // Mark the word as learned
      const newBoard = [...board];
      newBoard[currentQuiz.cellIndex] = { 
        ...newBoard[currentQuiz.cellIndex], 
        learned: true 
      };
      setBoard(newBoard);
      setWordsLearned(prev => prev + 1);
      
      // Update player progress
      setPlayerProgress(prev => ({
        ...prev,
        totalWordsLearned: prev.totalWordsLearned + 1
      }));
    } else {
      sounds.wrong.play();
      
      // Update game stats
      setGameStats(prev => ({
        ...prev,
        wrongAnswers: prev.wrongAnswers + 1
      }));
    }
    
    // Hide quiz and proceed to AI turn
    setShowQuiz(false);
    setCurrentQuiz(null);
    setIsPlayerTurn(false);
    
    // Make AI move if game is still playing
    if (gameStatus === 'playing') {
      makeAIMove();
    }
  };
  
  // Helper functions for enhanced features
  const initializeAchievements = () => {
    const defaultAchievements: Achievement[] = [
      {
        id: 'first_win',
        title: 'First Victory',
        description: 'Win your first game',
        icon: Trophy,
        unlocked: false,
        progress: 0,
        target: 1
      },
      {
        id: 'word_master',
        title: 'Word Master',
        description: 'Learn 50 words',
        icon: Brain,
        unlocked: false,
        progress: 0,
        target: 50
      },
      {
        id: 'streak_master',
        title: 'Streak Master',
        description: 'Win 5 games in a row',
        icon: Crown,
        unlocked: false,
        progress: 0,
        target: 5
      },
      {
        id: 'perfect_game',
        title: 'Perfect Game',
        description: 'Win without any wrong answers',
        icon: Star,
        unlocked: false,
        progress: 0,
        target: 1
      }
    ];
    
    setPlayerProgress(prev => ({
      ...prev,
      achievements: prev.achievements.length ? prev.achievements : defaultAchievements
    }));
  };

  const addXP = (amount: number) => {
    setPlayerProgress(prev => {
      const newXp = prev.xp + amount;
      const newLevel = Math.floor(newXp / 100) + 1;
      const leveledUp = newLevel > prev.level;
      
      if (leveledUp) {
        setShowLevelUp(true);
        sounds.levelUp.play();
        confetti(PARTICLE_CONFIGS.levelUp);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: (newLevel * 100) - newXp
      };
    });
  };

  const checkAchievements = () => {
    setPlayerProgress(prev => {
      const updated = { ...prev };
      let hasNewAchievement = false;

      updated.achievements.forEach(achievement => {
        if (!achievement.unlocked) {
          let progress = 0;
          
          switch (achievement.id) {
            case 'first_win':
              progress = updated.gamesWon;
              break;
            case 'word_master':
              progress = updated.totalWordsLearned;
              break;
            case 'streak_master':
              progress = updated.streak;
              break;
            case 'perfect_game':
              progress = correctAnswers > 0 && gameStats.wrongAnswers === 0 ? 1 : 0;
              break;
          }
          
          achievement.progress = Math.min(progress, achievement.target);
          
          if (progress >= achievement.target) {
            achievement.unlocked = true;
            hasNewAchievement = true;
            setShowAchievement(achievement);
            sounds.achievement.play();
            confetti(PARTICLE_CONFIGS.win);
            setTimeout(() => setShowAchievement(null), 4000);
          }
        }
      });

      if (hasNewAchievement) {
        addXP(50); // Bonus XP for achievements
      }

      return updated;
    });
  };

  const saveProgress = () => {
    localStorage.setItem('tictactoe_progress', JSON.stringify(playerProgress));
  };

  // Enhanced particle effects
  const triggerParticles = (type: keyof typeof PARTICLE_CONFIGS) => {
    confetti(PARTICLE_CONFIGS[type]);
  };
  
  return (
    <div ref={gameContainerRef} className={`w-full rounded-xl shadow-lg p-6 transition-all duration-300 ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-white text-gray-700'
    }`}>
      {/* Achievement Notification */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-lg shadow-xl"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              <span className="font-bold">{showAchievement.title} Unlocked!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Level Up Notification */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-2xl text-center"
          >
            <Zap className="w-12 h-12 mx-auto mb-2" />
            <h3 className="text-2xl font-bold">LEVEL UP!</h3>
            <p className="text-lg">Level {playerProgress.level}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with enhanced info */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBackToMenu}
          className="text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-2"
        >
          ← Back to Menu
        </button>
        
        <div className="text-center">
          <div className="text-lg font-semibold">
            {gameStatus === 'playing' ? (
              <motion.div
                key={isPlayerTurn ? 'player' : 'ai'}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={isPlayerTurn ? 'text-indigo-600' : 'text-pink-600'}
              >
                {isPlayerTurn ? 'Your Turn' : 'Computer\'s Turn'}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`text-2xl font-bold ${
                  gameStatus === 'playerWin' ? 'text-green-600' : 
                  gameStatus === 'aiWin' ? 'text-red-600' : 'text-yellow-600'
                }`}
              >
                {gameStatus === 'playerWin' ? '🎉 Victory!' : 
                 gameStatus === 'aiWin' ? '💻 AI Wins!' : '🤝 Draw!'}
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <FullscreenToggle 
            containerRef={gameContainerRef} 
            className="text-indigo-600 hover:text-indigo-800"
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Level {playerProgress.level}</span>
          <span>{playerProgress.xp} / {(playerProgress.level * 100)} XP</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <motion.div 
            className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full h-2"
            initial={{ width: 0 }}
            animate={{ width: `${((playerProgress.xp % 100) / 100) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Enhanced Game Board */}
      <div className="mb-6">
        <motion.div 
          className="grid grid-cols-3 gap-4 mb-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {board.map((cell, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: cell.mark === '' && isPlayerTurn && gameStatus === 'playing' ? 1.05 : 1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCellClick(index)}
              className={`
                relative h-24 md:h-32 flex items-center justify-center rounded-xl cursor-pointer border-3 
                transition-all duration-300 transform
                ${cell.mark 
                  ? cell.mark === 'X' 
                    ? 'bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-400 shadow-lg' 
                    : 'bg-gradient-to-br from-pink-100 to-pink-200 border-pink-400 shadow-lg' 
                  : `border-gray-300 hover:border-gray-400 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                ${!cell.mark && isPlayerTurn && gameStatus === 'playing' ? 'hover:shadow-md' : ''}
                ${!isPlayerTurn || gameStatus !== 'playing' ? 'cursor-not-allowed' : ''}
              `}
            >
              {cell.mark && (
                <motion.span 
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className={`text-4xl md:text-5xl font-bold ${
                    cell.mark === 'X' ? 'text-indigo-600' : 'text-pink-600'
                  }`}
                >
                  {cell.mark === 'X' ? playerMark : computerMark}
                </motion.span>
              )}
              
              {/* Word learned indicator */}
              {cell.learned && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Enhanced Quiz Section */}
      <AnimatePresence>
        {showQuiz && currentQuiz && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className={`${theme === 'dark' ? 'bg-indigo-900' : 'bg-gradient-to-r from-indigo-50 to-purple-50'} p-6 rounded-xl mb-6 shadow-lg border-2 border-indigo-200`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-indigo-500 text-white rounded-full">
                <Brain className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-indigo-700">Quick Quiz!</h3>
              <div className="ml-auto bg-white rounded-full px-3 py-1 text-sm font-medium text-indigo-600">
                +10 XP
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                What does <span className="font-bold text-2xl text-indigo-600 px-2 py-1 bg-white rounded">{currentQuiz.vocabItem.word}</span> mean?
              </p>
              <div className="text-sm text-gray-500">
                Language: {settings.language.charAt(0).toUpperCase() + settings.language.slice(1)} • 
                Category: {settings.category.charAt(0).toUpperCase() + settings.category.slice(1)}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {currentQuiz.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleQuizAnswer(option)}
                  className="bg-white text-indigo-700 border-2 border-indigo-200 rounded-xl p-4 hover:bg-indigo-100 hover:border-indigo-300 transition-all font-medium text-left shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Enhanced Player Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <motion.div 
          className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-indigo-100">You</div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4" />
              <span className="text-sm">{correctAnswers} correct</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{playerMark}</div>
          <div className="text-sm text-indigo-200">
            {wordsLearned} words learned this game
          </div>
          <div className="text-sm text-indigo-200">
            Level {playerProgress.level} • {playerProgress.xp} XP
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-pink-500 to-pink-600 text-white p-4 rounded-xl shadow-lg"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold text-pink-100">Computer</div>
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4" />
              <span className="text-sm">{settings.difficulty}</span>
            </div>
          </div>
          <div className="text-2xl font-bold mb-1">{computerMark}</div>
          <div className="text-sm text-pink-200">
            AI Difficulty: {settings.difficulty.charAt(0).toUpperCase() + settings.difficulty.slice(1)}
          </div>
          <div className="text-sm text-pink-200">
            {settings.language.charAt(0).toUpperCase() + settings.language.slice(1)} • {settings.category}
          </div>
        </motion.div>
      </div>

      {gameStatus !== 'playing' && (
        <div className="mt-6 text-center">
          <div className={`text-2xl font-bold mb-4 ${
            gameStatus === 'playerWin' ? 'text-indigo-600' : gameStatus === 'aiWin' ? 'text-pink-600' : 'text-gray-700'
          }`}>
            {gameStatus === 'playerWin' ? 'You Won! 🎉' : 
             gameStatus === 'aiWin' ? 'Computer Won!' : 'It\'s a Tie!'}
          </div>
          <div className="space-x-4">
            <button
              onClick={resetGame}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Play Again
            </button>
            <button
              onClick={() => onGameEnd({ 
                outcome: gameStatus === 'playerWin' ? 'win' : gameStatus === 'aiWin' ? 'loss' : 'tie',
                wordsLearned
              })}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              End Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
}