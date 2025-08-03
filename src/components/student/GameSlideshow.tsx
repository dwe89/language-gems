'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Zap } from 'lucide-react';

interface GameSlide {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: React.ComponentType<any>;
  color: string;
}

const gameSlides: GameSlide[] = [
  {
    id: 1,
    title: "VocabMaster",
    description: "Dig for rare words and master them with smart quizzes and listening challenges!",
    image: "/images/games/vocab-master.gif",
    icon: Star,
    color: "from-blue-500 to-purple-600"
  },
  {
    id: 2,
    title: "Sentence Sprint",
    description: "Drag and drop words to build sentences correctly before time runs out.",
    image: "/images/games/sentence-sprint.gif",
    icon: Zap,
    color: "from-green-500 to-teal-600"
  },
  {
    id: 3,
    title: "Detective Listening",
    description: "Solve mysteries while improving your listening comprehension skills!",
    image: "/images/games/detective-listening.gif",
    icon: Play,
    color: "from-orange-500 to-red-600"
  },
  {
    id: 4,
    title: "Word Blast",
    description: "Blast through vocabulary challenges in this action-packed game!",
    image: "/images/games/word-blast.gif",
    icon: Zap,
    color: "from-red-500 to-orange-600"
  },
  {
    id: 5,
    title: "Hangman",
    description: "Guess the word letter by letter to save the day!",
    image: "/images/games/hangman.gif",
    icon: Star,
    color: "from-indigo-500 to-purple-600"
  }
];

export default function GameSlideshow() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % gameSlides.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(timer);
  }, []);

  const currentGame = gameSlides[currentSlide];
  const Icon = currentGame.icon;

  return (
    <div className="relative flex flex-col justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="text-center"
        >
          {/* Game Icon */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className={`w-20 h-20 bg-gradient-to-r ${currentGame.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl`}
          >
            <Icon className="h-10 w-10 text-white" />
          </motion.div>

          {/* Game Title */}
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-white mb-3"
          >
            {currentGame.title}
          </motion.h3>

          {/* Game Description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-white/90 text-lg leading-relaxed max-w-lg mx-auto mb-6"
          >
            {currentGame.description}
          </motion.p>

          {/* Game Preview - Show actual GIF */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 max-w-2xl mx-auto border border-white/20 shadow-2xl"
          >
            <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
              <img
                src={currentGame.image}
                alt={`${currentGame.title} gameplay`}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="flex justify-center space-x-3 mt-8">
        {gameSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? 'bg-white shadow-lg'
              : 'bg-white/30 hover:bg-white/50'
              }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="mt-4 w-full max-w-lg mx-auto">
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-white rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 8, ease: "linear" }}
            key={currentSlide}
          />
        </div>
      </div>
    </div>
  );
}
