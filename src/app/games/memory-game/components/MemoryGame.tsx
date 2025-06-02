'use client';

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import './styles.css';

interface MemoryGameProps {
  difficulty: string;
  theme: string;
  language: string;
  onBackToMenu: () => void;
  onGameComplete: (time: number, moves: number) => void;
}

interface Card {
  id: number;
  term: string;
  translation: string;
  matched: boolean;
  flipped: boolean;
  pairId: number;
}

// Background themes - update paths to use public folder
const BACKGROUND_THEMES = [
  { name: 'Everything French', path: '/games/memory-game/backgrounds/everything france.jpg' },
  { name: 'Everything Spanish', path: '/games/memory-game/backgrounds/everything spanish.jpg' },
  { name: 'Typical Classroom', path: '/games/memory-game/backgrounds/typical classroom.jpg' },
  { name: 'Forest', path: '/games/memory-game/backgrounds/forest.jpg' },
  { name: 'Temple of Chaos', path: '/games/memory-game/backgrounds/temple_of_chaos.jpg' },
  { name: 'Cave of Memories', path: '/games/memory-game/backgrounds/cave_of_memories.jpg' }
];

// Theme colors with better contrast
const THEME_COLORS = {
  animals: { primary: 'bg-blue-600', secondary: 'bg-blue-100', text: 'text-blue-800' },
  colors: { primary: 'bg-purple-600', secondary: 'bg-purple-100', text: 'text-purple-800' },
  food: { primary: 'bg-green-600', secondary: 'bg-green-100', text: 'text-green-800' },
  countries: { primary: 'bg-indigo-600', secondary: 'bg-indigo-100', text: 'text-indigo-800' },
  numbers: { primary: 'bg-red-600', secondary: 'bg-red-100', text: 'text-red-800' },
  family: { primary: 'bg-pink-600', secondary: 'bg-pink-100', text: 'text-pink-800' },
  weather: { primary: 'bg-cyan-600', secondary: 'bg-cyan-100', text: 'text-cyan-800' },
  clothing: { primary: 'bg-amber-600', secondary: 'bg-amber-100', text: 'text-amber-800' },
  sports: { primary: 'bg-lime-600', secondary: 'bg-lime-100', text: 'text-lime-800' },
  professions: { primary: 'bg-orange-600', secondary: 'bg-orange-100', text: 'text-orange-800' },
  custom: { primary: 'bg-gray-600', secondary: 'bg-gray-100', text: 'text-gray-800' }
};

// Example vocabulary - expand this with more themes and languages
const VOCABULARY = {
  animals: {
    english: [
      { term: 'dog', translation: 'perro' },
      { term: 'cat', translation: 'gato' },
      { term: 'bird', translation: 'pájaro' },
      { term: 'fish', translation: 'pez' },
      { term: 'horse', translation: 'caballo' },
      { term: 'lion', translation: 'león' },
      { term: 'tiger', translation: 'tigre' },
      { term: 'elephant', translation: 'elefante' },
      { term: 'monkey', translation: 'mono' },
      { term: 'giraffe', translation: 'jirafa' },
      { term: 'zebra', translation: 'cebra' },
      { term: 'bear', translation: 'oso' }
    ],
    spanish: [
      { term: 'perro', translation: 'dog' },
      { term: 'gato', translation: 'cat' },
      { term: 'pájaro', translation: 'bird' },
      { term: 'pez', translation: 'fish' },
      { term: 'caballo', translation: 'horse' },
      { term: 'león', translation: 'lion' },
      { term: 'tigre', translation: 'tiger' },
      { term: 'elefante', translation: 'elephant' },
      { term: 'mono', translation: 'monkey' },
      { term: 'jirafa', translation: 'giraffe' },
      { term: 'cebra', translation: 'zebra' },
      { term: 'oso', translation: 'bear' }
    ],
    french: [
      { term: 'chien', translation: 'dog' },
      { term: 'chat', translation: 'cat' },
      { term: 'oiseau', translation: 'bird' },
      { term: 'poisson', translation: 'fish' },
      { term: 'cheval', translation: 'horse' },
      { term: 'lion', translation: 'lion' },
      { term: 'tigre', translation: 'tiger' },
      { term: 'éléphant', translation: 'elephant' },
      { term: 'singe', translation: 'monkey' },
      { term: 'girafe', translation: 'giraffe' },
      { term: 'zèbre', translation: 'zebra' },
      { term: 'ours', translation: 'bear' }
    ],
    japanese: [
      { term: 'イヌ', translation: 'dog' },
      { term: 'ネコ', translation: 'cat' },
      { term: 'トリ', translation: 'bird' },
      { term: 'サカナ', translation: 'fish' },
      { term: 'ウマ', translation: 'horse' },
      { term: 'ライオン', translation: 'lion' },
      { term: 'トラ', translation: 'tiger' },
      { term: 'ゾウ', translation: 'elephant' },
      { term: 'サル', translation: 'monkey' },
      { term: 'キリン', translation: 'giraffe' },
      { term: 'シマウマ', translation: 'zebra' },
      { term: 'クマ', translation: 'bear' }
    ],
    mandarin: [
      { term: '狗', translation: 'dog' },
      { term: '猫', translation: 'cat' },
      { term: '鸟', translation: 'bird' },
      { term: '鱼', translation: 'fish' },
      { term: '马', translation: 'horse' },
      { term: '狮子', translation: 'lion' },
      { term: '老虎', translation: 'tiger' },
      { term: '大象', translation: 'elephant' },
      { term: '猴子', translation: 'monkey' },
      { term: '长颈鹿', translation: 'giraffe' },
      { term: '斑马', translation: 'zebra' },
      { term: '熊', translation: 'bear' }
    ]
  },
  colors: {
    english: [
      { term: 'red', translation: 'rojo' },
      { term: 'blue', translation: 'azul' },
      { term: 'green', translation: 'verde' },
      { term: 'yellow', translation: 'amarillo' },
      { term: 'black', translation: 'negro' },
      { term: 'white', translation: 'blanco' },
      { term: 'orange', translation: 'naranja' },
      { term: 'purple', translation: 'morado' },
      { term: 'pink', translation: 'rosa' },
      { term: 'brown', translation: 'marrón' },
      { term: 'gray', translation: 'gris' },
      { term: 'gold', translation: 'oro' }
    ],
    spanish: [
      { term: 'rojo', translation: 'red' },
      { term: 'azul', translation: 'blue' },
      { term: 'verde', translation: 'green' },
      { term: 'amarillo', translation: 'yellow' },
      { term: 'negro', translation: 'black' },
      { term: 'blanco', translation: 'white' },
      { term: 'naranja', translation: 'orange' },
      { term: 'morado', translation: 'purple' },
      { term: 'rosa', translation: 'pink' },
      { term: 'marrón', translation: 'brown' },
      { term: 'gris', translation: 'gray' },
      { term: 'oro', translation: 'gold' }
    ],
    french: [
      { term: 'rouge', translation: 'red' },
      { term: 'bleu', translation: 'blue' },
      { term: 'vert', translation: 'green' },
      { term: 'jaune', translation: 'yellow' },
      { term: 'noir', translation: 'black' },
      { term: 'blanc', translation: 'white' },
      { term: 'orange', translation: 'orange' },
      { term: 'violet', translation: 'purple' },
      { term: 'rose', translation: 'pink' },
      { term: 'marron', translation: 'brown' },
      { term: 'gris', translation: 'gray' },
      { term: 'or', translation: 'gold' }
    ],
    japanese: [
      { term: 'アカ', translation: 'red' },
      { term: 'アオ', translation: 'blue' },
      { term: 'ミドリ', translation: 'green' },
      { term: 'キイロ', translation: 'yellow' },
      { term: 'クロ', translation: 'black' },
      { term: 'シロ', translation: 'white' },
      { term: 'オレンジ', translation: 'orange' },
      { term: 'ムラサキ', translation: 'purple' },
      { term: 'ピンク', translation: 'pink' },
      { term: 'チャイロ', translation: 'brown' },
      { term: 'ハイイロ', translation: 'gray' },
      { term: 'キン', translation: 'gold' }
    ],
    mandarin: [
      { term: '红', translation: 'red' },
      { term: '蓝', translation: 'blue' },
      { term: '绿', translation: 'green' },
      { term: '黄', translation: 'yellow' },
      { term: '黑', translation: 'black' },
      { term: '白', translation: 'white' },
      { term: '橙', translation: 'orange' },
      { term: '紫', translation: 'purple' },
      { term: '粉', translation: 'pink' },
      { term: '棕', translation: 'brown' },
      { term: '灰', translation: 'gray' },
      { term: '金', translation: 'gold' }
    ]
  },
  food: {
    english: [
      { term: 'apple', translation: 'manzana' },
      { term: 'banana', translation: 'plátano' },
      { term: 'bread', translation: 'pan' },
      { term: 'chicken', translation: 'pollo' },
      { term: 'rice', translation: 'arroz' },
      { term: 'milk', translation: 'leche' },
      { term: 'water', translation: 'agua' },
      { term: 'coffee', translation: 'café' },
      { term: 'pizza', translation: 'pizza' },
      { term: 'chocolate', translation: 'chocolate' },
      { term: 'egg', translation: 'huevo' },
      { term: 'cheese', translation: 'queso' }
    ],
    spanish: [
      { term: 'manzana', translation: 'apple' },
      { term: 'plátano', translation: 'banana' },
      { term: 'pan', translation: 'bread' },
      { term: 'pollo', translation: 'chicken' },
      { term: 'arroz', translation: 'rice' },
      { term: 'leche', translation: 'milk' },
      { term: 'agua', translation: 'water' },
      { term: 'café', translation: 'coffee' },
      { term: 'pizza', translation: 'pizza' },
      { term: 'chocolate', translation: 'chocolate' },
      { term: 'huevo', translation: 'egg' },
      { term: 'queso', translation: 'cheese' }
    ],
    french: [
      { term: 'pomme', translation: 'apple' },
      { term: 'banane', translation: 'banana' },
      { term: 'pain', translation: 'bread' },
      { term: 'poulet', translation: 'chicken' },
      { term: 'riz', translation: 'rice' },
      { term: 'lait', translation: 'milk' },
      { term: 'eau', translation: 'water' },
      { term: 'café', translation: 'coffee' },
      { term: 'pizza', translation: 'pizza' },
      { term: 'chocolat', translation: 'chocolate' },
      { term: 'œuf', translation: 'egg' },
      { term: 'fromage', translation: 'cheese' }
    ],
    japanese: [
      { term: 'リンゴ', translation: 'apple' },
      { term: 'バナナ', translation: 'banana' },
      { term: 'パン', translation: 'bread' },
      { term: 'トリニク', translation: 'chicken' },
      { term: 'ゴハン', translation: 'rice' },
      { term: 'ギュウニュウ', translation: 'milk' },
      { term: 'ミズ', translation: 'water' },
      { term: 'コーヒー', translation: 'coffee' },
      { term: 'ピザ', translation: 'pizza' },
      { term: 'チョコレート', translation: 'chocolate' },
      { term: 'タマゴ', translation: 'egg' },
      { term: 'チーズ', translation: 'cheese' }
    ],
    mandarin: [
      { term: '苹果', translation: 'apple' },
      { term: '香蕉', translation: 'banana' },
      { term: '面包', translation: 'bread' },
      { term: '鸡肉', translation: 'chicken' },
      { term: '米饭', translation: 'rice' },
      { term: '牛奶', translation: 'milk' },
      { term: '水', translation: 'water' },
      { term: '咖啡', translation: 'coffee' },
      { term: '披萨', translation: 'pizza' },
      { term: '巧克力', translation: 'chocolate' },
      { term: '鸡蛋', translation: 'egg' },
      { term: '奶酪', translation: 'cheese' }
    ]
  },
  countries: {
    english: [
      { term: 'spain', translation: 'españa' },
      { term: 'france', translation: 'francia' },
      { term: 'germany', translation: 'alemania' },
      { term: 'italy', translation: 'italia' },
      { term: 'japan', translation: 'japón' },
      { term: 'china', translation: 'china' },
      { term: 'brazil', translation: 'brasil' },
      { term: 'mexico', translation: 'méxico' },
      { term: 'canada', translation: 'canadá' },
      { term: 'egypt', translation: 'egipto' },
      { term: 'russia', translation: 'rusia' },
      { term: 'australia', translation: 'australia' }
    ],
    spanish: [
      { term: 'españa', translation: 'spain' },
      { term: 'francia', translation: 'france' },
      { term: 'alemania', translation: 'germany' },
      { term: 'italia', translation: 'italy' },
      { term: 'japón', translation: 'japan' },
      { term: 'china', translation: 'china' },
      { term: 'brasil', translation: 'brazil' },
      { term: 'méxico', translation: 'mexico' },
      { term: 'canadá', translation: 'canada' },
      { term: 'egipto', translation: 'egypt' },
      { term: 'rusia', translation: 'russia' },
      { term: 'australia', translation: 'australia' }
    ],
    french: [
      { term: 'espagne', translation: 'spain' },
      { term: 'france', translation: 'france' },
      { term: 'allemagne', translation: 'germany' },
      { term: 'italie', translation: 'italy' },
      { term: 'japon', translation: 'japan' },
      { term: 'chine', translation: 'china' },
      { term: 'brésil', translation: 'brazil' },
      { term: 'mexique', translation: 'mexico' },
      { term: 'canada', translation: 'canada' },
      { term: 'égypte', translation: 'egypt' },
      { term: 'russie', translation: 'russia' },
      { term: 'australie', translation: 'australia' }
    ],
    japanese: [
      { term: 'スペイン', translation: 'spain' },
      { term: 'フランス', translation: 'france' },
      { term: 'ドイツ', translation: 'germany' },
      { term: 'イタリア', translation: 'italy' },
      { term: '日本', translation: 'japan' },
      { term: '中国', translation: 'china' },
      { term: 'ブラジル', translation: 'brazil' },
      { term: 'メキシコ', translation: 'mexico' },
      { term: 'カナダ', translation: 'canada' },
      { term: 'エジプト', translation: 'egypt' },
      { term: 'ロシア', translation: 'russia' },
      { term: 'オーストラリア', translation: 'australia' }
    ],
    mandarin: [
      { term: '西班牙', translation: 'spain' },
      { term: '法国', translation: 'france' },
      { term: '德国', translation: 'germany' },
      { term: '意大利', translation: 'italy' },
      { term: '日本', translation: 'japan' },
      { term: '中国', translation: 'china' },
      { term: '巴西', translation: 'brazil' },
      { term: '墨西哥', translation: 'mexico' },
      { term: '加拿大', translation: 'canada' },
      { term: '埃及', translation: 'egypt' },
      { term: '俄罗斯', translation: 'russia' },
      { term: '澳大利亚', translation: 'australia' }
    ]
  },
  numbers: {
    english: [
      { term: 'one', translation: 'uno' },
      { term: 'two', translation: 'dos' },
      { term: 'three', translation: 'tres' },
      { term: 'four', translation: 'cuatro' },
      { term: 'five', translation: 'cinco' },
      { term: 'six', translation: 'seis' },
      { term: 'seven', translation: 'siete' },
      { term: 'eight', translation: 'ocho' },
      { term: 'nine', translation: 'nueve' },
      { term: 'ten', translation: 'diez' },
      { term: 'eleven', translation: 'once' },
      { term: 'twelve', translation: 'doce' }
    ],
    spanish: [
      { term: 'uno', translation: 'one' },
      { term: 'dos', translation: 'two' },
      { term: 'tres', translation: 'three' },
      { term: 'cuatro', translation: 'four' },
      { term: 'cinco', translation: 'five' },
      { term: 'seis', translation: 'six' },
      { term: 'siete', translation: 'seven' },
      { term: 'ocho', translation: 'eight' },
      { term: 'nueve', translation: 'nine' },
      { term: 'diez', translation: 'ten' },
      { term: 'once', translation: 'eleven' },
      { term: 'doce', translation: 'twelve' }
    ],
  },
  family: {
    english: [
      { term: 'mother', translation: 'madre' },
      { term: 'father', translation: 'padre' },
      { term: 'sister', translation: 'hermana' },
      { term: 'brother', translation: 'hermano' },
      { term: 'grandmother', translation: 'abuela' },
      { term: 'grandfather', translation: 'abuelo' },
      { term: 'aunt', translation: 'tía' },
      { term: 'uncle', translation: 'tío' },
      { term: 'cousin', translation: 'primo/prima' },
      { term: 'daughter', translation: 'hija' },
      { term: 'son', translation: 'hijo' },
      { term: 'husband', translation: 'esposo' }
    ],
    spanish: [
      { term: 'madre', translation: 'mother' },
      { term: 'padre', translation: 'father' },
      { term: 'hermana', translation: 'sister' },
      { term: 'hermano', translation: 'brother' },
      { term: 'abuela', translation: 'grandmother' },
      { term: 'abuelo', translation: 'grandfather' },
      { term: 'tía', translation: 'aunt' },
      { term: 'tío', translation: 'uncle' },
      { term: 'primo/prima', translation: 'cousin' },
      { term: 'hija', translation: 'daughter' },
      { term: 'hijo', translation: 'son' },
      { term: 'esposo', translation: 'husband' }
    ],
  },
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Add memoized card component
const MemoryCard = React.memo(({ card, onCardClick, isFlipped, isMatched }: {
  card: Card;
  onCardClick: (id: number) => void;
  isFlipped: boolean;
  isMatched: boolean;
}) => {
  return (
    <motion.div
      className={`memory-card ${isFlipped ? 'flipped' : ''} ${isMatched ? 'matched' : ''}`}
      onClick={() => onCardClick(card.id)}
      whileHover={{ scale: isFlipped || isMatched ? 1 : 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="card-inner">
        <div className="card-front">
          <span className="text-2xl">?</span>
        </div>
        <div className="card-back">
          <span className="text-lg">{card.term}</span>
        </div>
      </div>
    </motion.div>
  );
});

MemoryCard.displayName = 'MemoryCard';

export default function MemoryGame({ difficulty, theme, language, onBackToMenu, onGameComplete }: MemoryGameProps) {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(0);
  const [pairsToMatch, setPairsToMatch] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState(BACKGROUND_THEMES[0]);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showImageUploadModal, setShowImageUploadModal] = useState(false);
  const [imageSearchQuery, setImageSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ url: string }[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [customCards, setCustomCards] = useState<{term: string, imageUrl: string}[]>([]);
  const [useCustomCards, setUseCustomCards] = useState(false);
  
  // Sound effects refs - update paths to use public folder
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Timer ref for cleanup
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Determine grid columns - ensure a proper grid layout
  const gridCols = 6;
  
  // Get theme colors with fallback
  const themeStyle = THEME_COLORS[theme as keyof typeof THEME_COLORS] || THEME_COLORS.animals;
  
  // Initialize audio elements
  useEffect(() => {
    correctSoundRef.current = new Audio('/games/memory-game/sounds/correct.mp3');
    wrongSoundRef.current = new Audio('/games/memory-game/sounds/wrong.mp3');
    winSoundRef.current = new Audio('/games/memory-game/sounds/win.mp3');
    
    // Load saved theme from localStorage if available
    const savedTheme = localStorage.getItem('memoryGameTheme');
    if (savedTheme) {
      try {
        const parsedTheme = JSON.parse(savedTheme);
        if (parsedTheme && parsedTheme.name && parsedTheme.path) {
          setSelectedTheme(parsedTheme);
          // Remove background from body 
          document.body.style.backgroundImage = '';
        }
      } catch (e) {
        console.error('Error loading saved theme:', e);
      }
    }
    
    // Load custom cards if available
    const savedCustomCards = localStorage.getItem('memoryGameCustomCards');
    if (savedCustomCards) {
      try {
        const parsedCards = JSON.parse(savedCustomCards);
        if (Array.isArray(parsedCards) && parsedCards.length > 0) {
          setCustomCards(parsedCards);
          if (theme === 'custom') {
            setUseCustomCards(true);
          }
        }
      } catch (e) {
        console.error('Error loading custom cards:', e);
      }
    }
    
    return () => {
      // Reset background when component unmounts
      document.body.style.backgroundImage = '';
      
      // Clear timer interval
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [theme]);
  
  // Game timer logic
  useEffect(() => {
    if (!gameOver && cards.length > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
      
      return () => {
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
        }
      };
    }
  }, [gameOver, cards.length]);
  
  // Check if game is complete
  useEffect(() => {
    if (pairsToMatch > 0 && matchedCards.length / 2 === pairsToMatch) {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      handleGameCompletion();
    }
  }, [matchedCards.length, pairsToMatch]);
  
  // Memoize card grid columns calculation
  const gridColumns = useMemo(() => getGridColumns(), [cards.length]);

  // Memoize card click handler
  const handleCardClick = useCallback((id: number) => {
    // Skip if game is over or card is already flipped or matched
    if (
      gameOver ||
      flippedCards.length >= 2 ||
      flippedCards.includes(id) ||
      matchedCards.includes(id)
    ) {
      return;
    }
    
    // Track flipped cards
    setFlippedCards(prevIds => [...prevIds, id]);
    
    // Check for match when second card is flipped
    if (flippedCards.length === 1) {
      const firstCardId = flippedCards[0];
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === id);
      
      setMoves(prev => prev + 1);
      
      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        // Match found
        if (correctSoundRef.current) {
          correctSoundRef.current.play();
        }
        setMatchedCards(prev => [...prev, firstCardId, id]);
        setFlippedCards([]);
      } else {
        // No match - add mismatch class for the animation
        if (wrongSoundRef.current) {
          wrongSoundRef.current.play();
        }
        
        // Add mismatch class temporarily
        const cardElements = document.querySelectorAll('.memory-card');
        cardElements.forEach(el => {
          if (el.classList.contains('flipped') && !el.classList.contains('matched')) {
            el.classList.add('mismatch');
            setTimeout(() => {
              el.classList.remove('mismatch');
            }, 500);
          }
        });
        
        // Flip cards back after delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, matchedCards, gameOver, cards]);
  
  const handleGameCompletion = () => {
    setGameOver(true);
    
    // Play win sound
    if (winSoundRef.current) {
      winSoundRef.current.play();
    }
    
    // Celebration confetti
    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };
    
    const duration = 3 * 1000;
    const end = Date.now() + duration;
    
    (function frame() {
      confetti({
        particleCount: 2,
        angle: randomInRange(0, 360),
        spread: randomInRange(50, 100),
        origin: { x: randomInRange(0.1, 0.9), y: randomInRange(0.1, 0.5) },
        colors: ['#8b5cf6', '#6366f1', '#3b82f6', '#10b981'],
        zIndex: 300,
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
    
    // Send stats to parent component
    onGameComplete(timer, moves);
  };
  
  // Theme selection modal
  const toggleThemeModal = () => {
    setShowThemeModal(!showThemeModal);
  };
  
  const selectTheme = (theme: typeof BACKGROUND_THEMES[0]) => {
    setSelectedTheme(theme);
    // Remove background from body and apply to game container instead
    document.body.style.backgroundImage = '';
    localStorage.setItem('memoryGameTheme', JSON.stringify(theme));
    setShowThemeModal(false);
  };
  
  // Image search for custom cards
  const toggleImageUploadModal = () => {
    setShowImageUploadModal(!showImageUploadModal);
  };
  
  const searchImages = async () => {
    if (!imageSearchQuery.trim()) return;
    
    setIsSearching(true);
    
    try {
      const PIXABAY_API_KEY = '48227900-ec6e3d762c2e05db2ab8112f5';
      const encodedQuery = encodeURIComponent(imageSearchQuery);
      const url = `https://pixabay.com/api/?key=${PIXABAY_API_KEY}&q=${encodedQuery}&image_type=photo&per_page=12&safesearch=true`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      
      if (data.hits && data.hits.length > 0) {
        setSearchResults(data.hits.map((image: any) => ({
          url: image.webformatURL
        })));
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching images:', error);
      alert('Error searching for images. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        addCustomCard(imageSearchQuery || 'Custom Image', imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const addCustomCard = (term: string, imageUrl: string) => {
    const newCustomCards = [...customCards, { term, imageUrl }];
    setCustomCards(newCustomCards);
    localStorage.setItem('memoryGameCustomCards', JSON.stringify(newCustomCards));
    setImageSearchQuery('');
    setSearchResults([]);
    setShowImageUploadModal(false);
    
    // If we're in custom theme mode, reinitialize the cards
    if (theme === 'custom' && useCustomCards) {
      initializeCards();
    }
  };
  
  const toggleUseCustomCards = () => {
    const newValue = !useCustomCards;
    setUseCustomCards(newValue);
    
    // Reinitialize cards to reflect the change
    if (theme === 'custom') {
      initializeCards();
    }
  };
  
  // Restart the game
  const restartGame = () => {
    // Reset all game state
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setGameOver(false);
    setTimer(0);
    
    // Clear timer interval
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
    
    // Initialize cards again
    initializeCards();
  };
  
  // Initialize the game cards
  const initializeCards = useCallback(() => {
    // Set pairs based on theme and custom status
    let numPairs = 12; // Default for normal topics
    
    if (theme === 'custom' && useCustomCards) {
      // For custom mode, use all available custom cards (up to 24 pairs max)
      numPairs = Math.min(24, customCards.length);
    } else {
      // Use difficulty level pairs for normal topics
      switch (difficulty) {
        case 'easy':
          numPairs = 12;
          break;
        case 'medium':
          numPairs = 18;
          break;
        case 'hard':
          numPairs = 24;
          break;
        default:
          numPairs = 12;
      }
    }
    
    setPairsToMatch(numPairs);
    
    // Custom card logic or vocabulary based cards
    let vocabPairs: { term: string, translation: string }[] = [];
    
    if (theme === 'custom' && useCustomCards && customCards.length > 0) {
      // Use custom image cards - limit to numPairs
      const pairsToUse = [...customCards];
      while (pairsToUse.length < numPairs) {
        // Duplicate cards if we don't have enough
        pairsToUse.push(...customCards.slice(0, Math.min(numPairs - pairsToUse.length, customCards.length)));
      }
      
      vocabPairs = pairsToUse.slice(0, numPairs).map(card => ({
        term: card.term,
        translation: card.imageUrl
      }));
    } else {
      // Use vocabulary-based cards
      const themeVocab = (VOCABULARY as any)[theme] || VOCABULARY.animals;
      const langVocab = themeVocab[language] || themeVocab.english;
      
      // Make sure we have enough pairs
      const availablePairs = [...langVocab];
      while (availablePairs.length < numPairs) {
        // Duplicate vocabulary if we don't have enough
        availablePairs.push(...langVocab.slice(0, Math.min(numPairs - availablePairs.length, langVocab.length)));
      }
      
      vocabPairs = availablePairs.slice(0, numPairs);
    }
    
    // Create card pairs and shuffle
    let newCards: Card[] = [];
    vocabPairs.forEach((item, idx) => {
      // Term card
      newCards.push({
        id: idx * 2,
        term: item.term,
        translation: item.translation,
        matched: false,
        flipped: false,
        pairId: idx
      });
      
      // Translation card
      newCards.push({
        id: idx * 2 + 1,
        term: item.translation,
        translation: item.term,
        matched: false,
        flipped: false,
        pairId: idx
      });
    });
    
    // Shuffle the cards
    newCards = newCards.sort(() => Math.random() - 0.5);
    
    setCards(newCards);
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
    setTimer(0);
    setGameOver(false);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }
  }, [theme, language, useCustomCards, customCards, difficulty]);
  
  // Initialize game on mount and when settings change
  useEffect(() => {
    initializeCards();
  }, [initializeCards]);
  
  // Calculate appropriate grid columns based on number of cards
  const getGridColumns = () => {
    const totalCards = cards.length;
    
    if (totalCards <= 12) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';
    else if (totalCards <= 18) return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6';
    else return 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8';
  };
  
  return (
    <div 
      className="game-container bg-gray-100 min-h-screen py-6"
      style={{ 
        backgroundImage: gameOver ? '' : `url(${selectedTheme.path})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <h1 className="text-4xl font-bold text-center text-indigo-800 mb-6">Memory Match</h1>
      
      {/* Game controls */}
      <div className="game-controls mb-6 flex flex-wrap justify-between items-center">
        <button 
          onClick={onBackToMenu}
          className="mb-2 md:mb-0 bg-white hover:bg-gray-100 text-indigo-700 px-4 py-2 rounded-full shadow transition-colors"
        >
          Back to Settings
        </button>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={toggleThemeModal} 
            className="bg-white hover:bg-gray-100 text-indigo-700 px-4 py-2 rounded-full shadow transition-colors flex items-center"
          >
            <span className="mr-2">Theme</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zm4 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM5.5 7a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm.5 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/>
              <path d="M16 8c0 3.15-1.866 2.585-3.567 2.07C11.42 9.763 10.465 9.473 10 10c-.603.683-.475 1.819-.351 2.92C9.826 14.495 9.996 16 8 16a8 8 0 1 1 8-8zm-8 7c.611 0 .654-.171.655-.176.078-.146.124-.464.07-1.119-.014-.168-.037-.37-.061-.591-.052-.464-.112-1.005-.118-1.462-.01-.707.083-1.61.704-2.314.369-.417.845-.578 1.272-.618.404-.038.812.026 1.16.104.343.077.702.186 1.025.284l.028.008c.346.105.658.199.953.266.653.148.904.083.991.024C14.717 9.38 15 9.161 15 8a7 7 0 1 0-7 7z"/>
            </svg>
          </button>
          
          {theme === 'custom' && (
            <button 
              onClick={toggleImageUploadModal}
              className="bg-white hover:bg-gray-100 text-indigo-700 px-4 py-2 rounded-full shadow transition-colors flex items-center"
            >
              <span className="mr-2">Custom Images</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
              </svg>
            </button>
          )}
          
          <button 
            onClick={restartGame}
            className="bg-white hover:bg-gray-100 text-indigo-700 px-4 py-2 rounded-full shadow transition-colors"
          >
            Restart
          </button>
        </div>
      </div>
      
      {/* Theme modal */}
      {showThemeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Select Theme</h2>
            <div className="grid grid-cols-2 gap-4">
              {BACKGROUND_THEMES.map((theme, index) => (
                <div 
                  key={index}
                  className={`border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
                    selectedTheme.name === theme.name ? 'border-indigo-600 shadow-lg' : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => selectTheme(theme)}
                >
                  <div className="h-24 bg-cover bg-center" style={{ backgroundImage: `url(${theme.path})` }}></div>
                  <div className="p-2 text-center">{theme.name}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button 
                onClick={() => setShowThemeModal(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Image upload modal */}
      {showImageUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Custom Images</h2>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  id="useCustomCards"
                  checked={useCustomCards}
                  onChange={toggleUseCustomCards}
                  className="mr-2"
                />
                <label htmlFor="useCustomCards">
                  Use custom images for the game
                </label>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={imageSearchQuery}
                  onChange={(e) => setImageSearchQuery(e.target.value)}
                  placeholder="Search for images or enter a label"
                  className="flex-grow p-2 border rounded"
                  onKeyPress={(e) => e.key === 'Enter' && searchImages()}
                />
                <button
                  onClick={searchImages}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                  disabled={isSearching}
                >
                  {isSearching ? 'Searching...' : 'Search'}
                </button>
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Or upload your own image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                />
              </div>
            </div>
            
            {searchResults.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Search Results:</h3>
                <div className="grid grid-cols-3 gap-2">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="border rounded overflow-hidden cursor-pointer hover:border-indigo-500"
                      onClick={() => addCustomCard(imageSearchQuery, result.url)}
                    >
                      <img src={result.url} alt="Search result" className="w-full h-24 object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {customCards.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Your Custom Cards:</h3>
                <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {customCards.map((card, index) => (
                    <div key={index} className="border rounded overflow-hidden">
                      <img src={card.imageUrl} alt={card.term} className="w-full h-16 object-cover" />
                      <div className="p-1 text-xs truncate text-center">{card.term}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => {
                  setCustomCards([]);
                  localStorage.removeItem('memoryGameCustomCards');
                }}
                className="bg-red-100 hover:bg-red-200 text-red-800 px-4 py-2 rounded transition-colors"
                disabled={customCards.length === 0}
              >
                Clear All
              </button>
              <button 
                onClick={() => setShowImageUploadModal(false)}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
  
      {/* Game board */}
      <div className="game-board bg-white shadow-lg rounded-xl p-4 max-w-6xl mx-auto">
        <div className="game-stats flex justify-between items-center mb-6 p-4 bg-indigo-50 rounded-lg">
          <div className="flex gap-6">
            <div className="stat">
              <div className="text-sm text-gray-600">Moves</div>
              <div className="text-xl font-bold text-indigo-700">{moves}</div>
            </div>
            <div className="stat">
              <div className="text-sm text-gray-600">Time</div>
              <div className="text-xl font-bold text-indigo-700">{formatTime(timer)}</div>
            </div>
          </div>
          <div>
            <div className="text-sm text-gray-600">Matches</div>
            <div className="text-xl font-bold text-indigo-700">{matchedCards.length / 2} / {pairsToMatch}</div>
          </div>
        </div>
        
        {gameOver ? (
          <div className="win-screen">
            <div className="win-container">
              <h2 className="text-2xl font-bold mb-4 text-indigo-700">Congratulations! 🎉</h2>
              <p className="mb-4">You completed the game in {moves} moves and {formatTime(timer)} time.</p>
              <div className="flex justify-center gap-4">
                <button 
                  onClick={restartGame}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Play Again
                </button>
                <button 
                  onClick={onBackToMenu}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className={`grid ${gridColumns} gap-4 p-4`}>
            {cards.map(card => (
              <MemoryCard
                key={card.id}
                card={card}
                onCardClick={handleCardClick}
                isFlipped={flippedCards.includes(card.id) || matchedCards.includes(card.id)}
                isMatched={matchedCards.includes(card.id)}
              />
            ))}
          </div>
        )}
      </div>
  
      {/* Audio elements */}
      <audio id="correctSound" src="/games/memory-game/sounds/correct.mp3" preload="auto" />
      <audio id="wrongSound" src="/games/memory-game/sounds/wrong.mp3" preload="auto" />
      <audio id="winSound" src="/games/memory-game/sounds/win.mp3" preload="auto" />
    </div>
  );
}