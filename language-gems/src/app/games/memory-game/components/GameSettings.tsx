'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface GameSettingsProps {
  onStartGame: (settings: { difficulty: string; theme: string; language: string }) => void;
}

// Available languages
const LANGUAGES = [
  'English',
  'Spanish',
  'French',
  'German',
  'Italian',
  'Japanese',
  'Chinese',
  'Russian',
  'Portuguese',
  'Arabic',
  'Dutch'
];

// Topics
const TOPICS = [
  'Animals',
  'Colors',
  'Food',
  'Countries',
  'Numbers',
  'Family',
  'Weather',
  'Clothing',
  'Sports',
  'Professions',
  'Custom'
];

// Difficulty levels
const DIFFICULTIES = [
  { name: 'Easy', value: 'easy', description: '12 pairs' },
  { name: 'Medium', value: 'medium', description: '18 pairs' },
  { name: 'Hard', value: 'hard', description: '24 pairs' }
];

export default function GameSettings({ onStartGame }: GameSettingsProps) {
  // Track which step we're on - language, topic, or difficulty
  const [currentStep, setCurrentStep] = useState(1);
  
  // Game settings
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  
  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setCurrentStep(2); // Move to topic selection
  };
  
  // Handle topic selection
  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    
    // If Custom is selected, skip difficulty step and start the game
    if (topic.toLowerCase() === 'custom') {
      onStartGame({
        language: selectedLanguage.toLowerCase(),
        theme: 'custom',
        difficulty: 'medium' // Default difficulty for custom
      });
    } else {
      setCurrentStep(3); // Move to difficulty selection
    }
  };
  
  // Handle difficulty selection and start game
  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    
    // Start game with selected settings
    onStartGame({ 
      language: selectedLanguage.toLowerCase(), 
      theme: selectedTopic.toLowerCase(),
      difficulty: difficulty 
    });
  };
  
  // Back button
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  return (
    <div className="settings-container min-h-screen bg-gradient-to-br from-indigo-800 to-indigo-600 p-6 flex justify-center items-center">
      <div className="settings-card w-full max-w-2xl bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-6">Memory Match Game</h1>
        
        {/* Progress indicator - don't show 3rd step for Custom */}
        <div className="progress-bar mb-8 flex justify-between items-center">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep === step 
                  ? 'bg-indigo-600 text-white' 
                  : currentStep > step 
                    ? 'bg-indigo-300 text-white' 
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {step}
              </div>
              <span className="text-xs mt-1">
                {step === 1 ? 'Language' : step === 2 ? 'Topic' : 'Difficulty'}
              </span>
            </div>
          ))}
          <div className={`h-1 flex-grow mx-2 ${currentStep > 1 ? 'bg-indigo-300' : 'bg-gray-200'}`}></div>
          <div className={`h-1 flex-grow mx-2 ${currentStep > 2 ? 'bg-indigo-300' : 'bg-gray-200'}`}></div>
        </div>
        
        {/* Step 1: Language Selection */}
        {currentStep === 1 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold text-indigo-800 mb-4">Select Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {LANGUAGES.map((language) => (
                <button
                  key={language}
                  onClick={() => handleLanguageSelect(language)}
                  className="p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium transition-colors flex flex-col items-center justify-center h-24"
                >
                  <span>{language}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Step 2: Topic Selection */}
        {currentStep === 2 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={handleBack}
                className="text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                <span className="ml-1">Back</span>
              </button>
              <h2 className="text-xl font-bold text-indigo-800">Select Topic</h2>
              <div className="w-16"></div> {/* Spacer for alignment */}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => handleTopicSelect(topic)}
                  className={`p-4 ${topic === 'Custom' ? 'bg-yellow-50 hover:bg-yellow-100' : 'bg-indigo-50 hover:bg-indigo-100'} rounded-lg text-indigo-700 font-medium transition-colors flex flex-col items-center justify-center h-24`}
                >
                  <span>{topic}</span>
                  {topic === 'Custom' && <span className="text-xs mt-1 text-gray-500">Skip difficulty</span>}
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Step 3: Difficulty Selection */}
        {currentStep === 3 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <button 
                onClick={handleBack}
                className="text-indigo-600 hover:text-indigo-800 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
                <span className="ml-1">Back</span>
              </button>
              <h2 className="text-xl font-bold text-indigo-800">Select Difficulty</h2>
              <div className="w-16"></div> {/* Spacer for alignment */}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DIFFICULTIES.map((difficulty) => (
                <button
                  key={difficulty.value}
                  onClick={() => handleDifficultySelect(difficulty.value)}
                  className="p-6 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-indigo-700 font-medium transition-colors flex flex-col items-center justify-center h-32"
                >
                  <span className="text-xl mb-2">{difficulty.name}</span>
                  <span className="text-sm text-indigo-500">{difficulty.description}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Game info */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-600 mb-2">How to Play</h3>
          <p className="text-sm text-gray-500">
            Flip cards to find matching pairs of words in different languages. 
            The game is completed when all pairs are matched. Try to finish with the fewest moves!
          </p>
        </div>
      </div>
    </div>
  );
} 