'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
};

type TicTacToeGameProps = {
  settings: GameSettings;
  onBackToMenu: () => void;
  onGameEnd: (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number }) => void;
};

export default function TicTacToeGame({ settings, onBackToMenu, onGameEnd }: TicTacToeGameProps) {
  // Game board and state
  const [board, setBoard] = useState<CellContent[]>(Array(9).fill({ mark: '', learned: false }));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<'playing' | 'playerWin' | 'aiWin' | 'tie'>('playing');
  const [wordsLearned, setWordsLearned] = useState(0);
  
  // Quiz state for language learning feature
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<{
    vocabItem: VocabItem;
    cellIndex: number;
    options: string[];
  } | null>(null);
  
  // Audio references
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const gameOverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Available vocabulary for the game based on settings
  const [availableVocabulary, setAvailableVocabulary] = useState<VocabItem[]>([]);
  
  // Initialize game
  useEffect(() => {
    // Create audio elements
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
    gameOverSoundRef.current = new Audio('/sounds/gameover.mp3');
    clickSoundRef.current = new Audio('/sounds/click.mp3');
    
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
    
    return () => {
      // Cleanup
    };
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
    
    if (clickSoundRef.current) clickSoundRef.current.play().catch(e => console.log("Sound play failed"));
    
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
        if (correctSoundRef.current) correctSoundRef.current.play().catch(e => console.log("Sound play failed"));
      } else if (result === 'tie') {
        setGameStatus('tie');
        if (gameOverSoundRef.current) gameOverSoundRef.current.play().catch(e => console.log("Sound play failed"));
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
      if (clickSoundRef.current) clickSoundRef.current.play().catch(e => console.log("Sound play failed"));
      
      const newBoard = [...board];
      newBoard[aiMoveIndex] = { mark: 'O', vocabItem, learned: false };
      setBoard(newBoard);
      
      // Check if the move resulted in a win or tie
      const result = checkWinner(newBoard);
      if (result) {
        if (result === 'O') {
          setGameStatus('aiWin');
          if (wrongSoundRef.current) wrongSoundRef.current.play().catch(e => console.log("Sound play failed"));
        } else if (result === 'tie') {
          setGameStatus('tie');
          if (gameOverSoundRef.current) gameOverSoundRef.current.play().catch(e => console.log("Sound play failed"));
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
      if (correctSoundRef.current) correctSoundRef.current.play().catch(e => console.log("Sound play failed"));
      
      // Mark the word as learned
      const newBoard = [...board];
      newBoard[currentQuiz.cellIndex] = { 
        ...newBoard[currentQuiz.cellIndex], 
        learned: true 
      };
      setBoard(newBoard);
      
      // Increment words learned counter
      setWordsLearned(prev => prev + 1);
    } else {
      if (wrongSoundRef.current) wrongSoundRef.current.play().catch(e => console.log("Sound play failed"));
    }
    
    // Hide quiz and proceed with AI's turn
    setShowQuiz(false);
    setCurrentQuiz(null);
    setIsPlayerTurn(false);
    
    // AI's turn
    makeAIMove();
  };
  
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      {/* Game header with language and status */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            {settings.language.charAt(0).toUpperCase() + settings.language.slice(1)} - {settings.category.charAt(0).toUpperCase() + settings.category.slice(1)}
          </h2>
          <p className="text-gray-600">Learn vocabulary while playing</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Game Status</p>
          {gameStatus === 'playing' ? (
            <p className={`font-medium ${isPlayerTurn ? 'text-blue-600' : 'text-red-600'}`}>
              {isPlayerTurn ? 'Your Turn' : 'AI Thinking...'}
            </p>
          ) : (
            <p className={`font-medium ${
              gameStatus === 'playerWin' ? 'text-green-600' : 
              gameStatus === 'aiWin' ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {gameStatus === 'playerWin' ? 'You Won!' : 
               gameStatus === 'aiWin' ? 'You Lost' : 'Tie Game'}
            </p>
          )}
        </div>
      </div>
      
      {/* Word learning progress */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <p className="text-sm text-gray-600">Words Learned</p>
          <p className="text-sm font-medium text-blue-600">{wordsLearned}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all" 
            style={{ width: `${Math.min((wordsLearned / 5) * 100, 100)}%` }}
          ></div>
        </div>
      </div>
      
      {/* Game board */}
      <div className="grid grid-cols-3 gap-2 mb-6">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => handleCellClick(index)}
            disabled={cell.mark !== '' || gameStatus !== 'playing' || !isPlayerTurn || showQuiz}
            className={`aspect-square flex flex-col items-center justify-center rounded-lg transition-all p-2
              ${cell.mark === '' ? 
                'bg-gray-100 hover:bg-gray-200 cursor-pointer' : 
                cell.mark === 'X' ? 
                  (cell.learned ? 'bg-green-100' : 'bg-blue-100') : 
                  'bg-red-100'
              }`}
          >
            {cell.mark === 'X' && (
              <>
                <span className="text-3xl text-blue-600 mb-1">X</span>
                {cell.vocabItem && (
                  <>
                    <span className="text-sm font-medium">{cell.vocabItem.word}</span>
                    {cell.learned && (
                      <span className="text-xs text-gray-600">{cell.vocabItem.translation}</span>
                    )}
                  </>
                )}
              </>
            )}
            {cell.mark === 'O' && (
              <>
                <span className="text-3xl text-red-600 mb-1">O</span>
                {cell.vocabItem && (
                  <span className="text-sm font-medium">{cell.vocabItem.word}</span>
                )}
              </>
            )}
          </button>
        ))}
      </div>
      
      {/* Quiz modal */}
      <AnimatePresence>
        {showQuiz && currentQuiz && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">What does "{currentQuiz.vocabItem.word}" mean?</h3>
              
              <div className="grid grid-cols-1 gap-3 mb-4">
                {currentQuiz.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuizAnswer(option)}
                    className="py-3 px-4 rounded-lg border-2 border-gray-200 hover:border-pink-500 transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game controls */}
      <div className="flex justify-between">
        <button
          onClick={resetGame}
          disabled={gameStatus === 'playing' || showQuiz}
          className={`px-6 py-2 rounded-lg transition-colors ${
            gameStatus === 'playing' || showQuiz ? 
              'bg-gray-200 text-gray-500 cursor-not-allowed' : 
              'bg-pink-600 hover:bg-pink-700 text-white'
          }`}
        >
          New Game
        </button>
        
        <button
          onClick={onBackToMenu}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
} 