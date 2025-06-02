'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

type GameSettingsProps = {
  onStartGame: (settings: {
    difficulty: string;
    category: string;
    language: string;
  }) => void;
};

const difficulties = [
  { id: 'beginner', label: 'Beginner', description: 'Simple sentences with basic vocabulary' },
  { id: 'intermediate', label: 'Intermediate', description: 'More complex sentences with varied vocabulary' },
  { id: 'advanced', label: 'Advanced', description: 'Complex sentences with advanced grammar' },
];

const categories = [
  { id: 'general', label: 'General', description: 'Everyday sentences and expressions' },
  { id: 'travel', label: 'Travel', description: 'Phrases useful for travelers' },
  { id: 'business', label: 'Business', description: 'Professional and workplace sentences' },
  { id: 'academic', label: 'Academic', description: 'Sentences for educational settings' },
  { id: 'social', label: 'Social', description: 'Conversational phrases and expressions' },
];

const languages = [
  { id: 'english', label: 'English' },
  { id: 'spanish', label: 'Spanish' },
  { id: 'french', label: 'French' },
  { id: 'german', label: 'German' },
  { id: 'italian', label: 'Italian' },
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  const [difficulty, setDifficulty] = useState('beginner');
  const [category, setCategory] = useState('general');
  const [language, setLanguage] = useState('english');

  const handleStartGame = (e: React.FormEvent) => {
    e.preventDefault();
    onStartGame({ difficulty, category, language });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-lg overflow-hidden p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-2xl font-semibold mb-6 text-indigo-600">Game Settings</h2>
      
      <form onSubmit={handleStartGame}>
        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-lg font-medium mb-3 text-gray-700">Difficulty</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {difficulties.map((option) => (
              <div
                key={option.id}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  difficulty === option.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setDifficulty(option.id)}
              >
                <h3 className="font-medium text-gray-800">{option.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-lg font-medium mb-3 text-gray-700">Category</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {categories.map((option) => (
              <div
                key={option.id}
                className={`border-2 rounded-lg p-3 cursor-pointer transition-all duration-200 ${
                  category === option.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setCategory(option.id)}
              >
                <h3 className="font-medium text-gray-800">{option.label}</h3>
                <p className="text-sm text-gray-500 mt-1">{option.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="mb-6" variants={itemVariants}>
          <label className="block text-lg font-medium mb-3 text-gray-700">Language</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {languages.map((option) => (
              <div
                key={option.id}
                className={`border-2 rounded-lg p-3 cursor-pointer text-center transition-all duration-200 ${
                  language === option.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
                onClick={() => setLanguage(option.id)}
              >
                <h3 className="font-medium text-gray-800">{option.label}</h3>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div className="text-center" variants={itemVariants}>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-medium text-lg transition-colors duration-200 transform hover:scale-105"
          >
            Start Game
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
} 