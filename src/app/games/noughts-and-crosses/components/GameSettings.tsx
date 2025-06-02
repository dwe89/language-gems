'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

type GameSettingsProps = {
  onStartGame: (settings: { 
    difficulty: string; 
    category: string; 
    language: string;
    playerMark: string;
    computerMark: string;
  }) => void;
};

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];
const CATEGORIES = ['animals', 'food', 'colors', 'custom'];
const LANGUAGES = ['english', 'spanish', 'french', 'german', 'italian'];
const EMOJI_OPTIONS = [
  { player: 'X', computer: 'O' },
  { player: '❌', computer: '⭕' },
  { player: '🦊', computer: '🐻' },
  { player: '🌞', computer: '🌙' },
  { player: '🔥', computer: '❄️' },
  { player: '🌴', computer: '🌵' },
  { player: 'custom', computer: 'custom' }
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [language, setLanguage] = useState(LANGUAGES[0]);
  const [emojiOption, setEmojiOption] = useState(0);
  const [customPlayerMark, setCustomPlayerMark] = useState('');
  const [customComputerMark, setCustomComputerMark] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let playerMark = EMOJI_OPTIONS[emojiOption].player;
    let computerMark = EMOJI_OPTIONS[emojiOption].computer;
    
    if (emojiOption === EMOJI_OPTIONS.length - 1) {
      playerMark = customPlayerMark || 'X';
      computerMark = customComputerMark || 'O';
    }
    
    onStartGame({ 
      difficulty, 
      category, 
      language,
      playerMark,
      computerMark
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg text-gray-700"
    >
      <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">Game Settings</h2>
      
      <form onSubmit={handleSubmit} className="text-gray-700">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <div className="grid grid-cols-3 gap-3">
            {DIFFICULTIES.map((level) => (
              <div 
                key={level}
                onClick={() => setDifficulty(level)}
                className={`
                  cursor-pointer text-center p-3 rounded-lg border-2 transition
                  ${difficulty === level 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="font-medium capitalize">{level}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CATEGORIES.map((item) => (
              <div 
                key={item}
                onClick={() => setCategory(item)}
                className={`
                  cursor-pointer text-center p-3 rounded-lg border-2 transition
                  ${category === item 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="font-medium capitalize">{item}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
            {LANGUAGES.map((lang) => (
              <div 
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`
                  cursor-pointer text-center p-2 rounded-lg border-2 transition
                  ${language === lang 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="font-medium capitalize">{lang}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Game Markers</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-3">
            {EMOJI_OPTIONS.map((option, index) => (
              <div 
                key={index}
                onClick={() => setEmojiOption(index)}
                className={`
                  cursor-pointer text-center p-3 rounded-lg border-2 transition
                  ${emojiOption === index 
                    ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                    : 'bg-white border-gray-200 hover:bg-gray-50'}
                `}
              >
                <div className="font-medium">
                  {option.player === 'custom' ? 'Custom' : `${option.player} vs ${option.computer}`}
                </div>
              </div>
            ))}
          </div>
          
          {emojiOption === EMOJI_OPTIONS.length - 1 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Your Mark</label>
                <input
                  type="text"
                  value={customPlayerMark}
                  onChange={(e) => setCustomPlayerMark(e.target.value)}
                  maxLength={2}
                  placeholder="X"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Computer Mark</label>
                <input
                  type="text"
                  value={customComputerMark}
                  onChange={(e) => setCustomComputerMark(e.target.value)}
                  maxLength={2}
                  placeholder="O"
                  className="w-full p-2 border border-gray-300 rounded-md text-gray-700"
                />
              </div>
            </div>
          )}
        </div>
        
        <button 
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-center transition-colors"
        >
          Start Game
        </button>
      </form>
    </motion.div>
  );
} 