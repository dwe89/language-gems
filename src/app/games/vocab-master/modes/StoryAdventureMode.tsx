import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, ChevronRight, Volume2, ArrowLeft, ArrowRight } from 'lucide-react';
import { ModeComponent } from '../types';

interface StoryAdventureModeProps extends ModeComponent {
  onStoryComplete: (isCorrect: boolean, chosenPath: string) => void;
}

interface StoryScene {
  id: string;
  title: string;
  text: string;
  vocabularyWord: string;
  vocabularyTranslation: string;
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
  nextScene?: string;
}

export const StoryAdventureMode: React.FC<StoryAdventureModeProps> = ({
  gameState,
  onStoryComplete,
  isAdventureMode,
  playPronunciation,
  onModeSpecificAction
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [storyProgress, setStoryProgress] = useState(0);

  const currentWord = gameState.currentWord;
  const vocabularyWord = currentWord?.word || currentWord?.spanish || '';
  const vocabularyTranslation = currentWord?.translation || currentWord?.english || '';

  // Generate story scenes based on the current vocabulary word
  const generateStoryScenes = (): StoryScene[] => {
    const stories = [
      {
        theme: 'market',
        scenes: [
          {
            id: 'market_1',
            title: 'At the Market',
            text: `You're walking through a bustling Spanish market. A vendor calls out to you, pointing at some fresh fruit. "¡Mira! ¿Quieres ${vocabularyWord}?" What does the vendor want to sell you?`,
            vocabularyWord,
            vocabularyTranslation,
            choices: [
              { id: 'a', text: vocabularyTranslation, isCorrect: true, feedback: `¡Perfecto! The vendor is selling ${vocabularyTranslation}.` },
              { id: 'b', text: 'bread', isCorrect: false, feedback: `Not quite! "${vocabularyWord}" means ${vocabularyTranslation}.` },
              { id: 'c', text: 'water', isCorrect: false, feedback: `Close, but "${vocabularyWord}" actually means ${vocabularyTranslation}.` }
            ]
          }
        ]
      },
      {
        theme: 'restaurant',
        scenes: [
          {
            id: 'restaurant_1',
            title: 'At the Restaurant',
            text: `You're at a cozy Spanish restaurant. The waiter approaches with a smile and says, "Hoy tenemos ${vocabularyWord} muy fresco." What is the waiter recommending?`,
            vocabularyWord,
            vocabularyTranslation,
            choices: [
              { id: 'a', text: vocabularyTranslation, isCorrect: true, feedback: `¡Excelente! They have fresh ${vocabularyTranslation} today.` },
              { id: 'b', text: 'soup', isCorrect: false, feedback: `Not today! "${vocabularyWord}" means ${vocabularyTranslation}.` },
              { id: 'c', text: 'coffee', isCorrect: false, feedback: `Try again! "${vocabularyWord}" refers to ${vocabularyTranslation}.` }
            ]
          }
        ]
      },
      {
        theme: 'adventure',
        scenes: [
          {
            id: 'adventure_1',
            title: 'The Quest',
            text: `You're on an adventure in Spain! A local guide points ahead and exclaims, "¡Cuidado con el ${vocabularyWord}!" What should you be careful of?`,
            vocabularyWord,
            vocabularyTranslation,
            choices: [
              { id: 'a', text: vocabularyTranslation, isCorrect: true, feedback: `¡Muy bien! You need to watch out for the ${vocabularyTranslation}.` },
              { id: 'b', text: 'weather', isCorrect: false, feedback: `Not quite! "${vocabularyWord}" means ${vocabularyTranslation}.` },
              { id: 'c', text: 'time', isCorrect: false, feedback: `Think again! "${vocabularyWord}" actually means ${vocabularyTranslation}.` }
            ]
          }
        ]
      }
    ];

    // Select a random story theme
    const randomStory = stories[Math.floor(Math.random() * stories.length)];
    return randomStory.scenes;
  };

  const [storyScenes] = useState<StoryScene[]>(generateStoryScenes());
  const currentScene = storyScenes[currentSceneIndex];

  useEffect(() => {
    // Reset for new word
    setCurrentSceneIndex(0);
    setSelectedChoice(null);
    setShowFeedback(false);
    setStoryProgress(0);
  }, [gameState.currentWordIndex]);

  const handleChoiceSelect = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setShowFeedback(true);
    
    const choice = currentScene.choices.find(c => c.id === choiceId);
    if (choice) {
      onStoryComplete(choice.isCorrect, choiceId);
      
      // Auto-advance after showing feedback
      setTimeout(() => {
        if (onModeSpecificAction) {
          onModeSpecificAction('story_complete', { 
            word: vocabularyWord,
            isCorrect: choice.isCorrect,
            scene: currentScene.id
          });
        }
      }, 3000);
    }
  };

  const handlePlayAudio = () => {
    if (currentWord && !gameState.audioPlaying) {
      playPronunciation(vocabularyWord, 'es', currentWord);
    }
  };

  const progressPercentage = ((gameState.currentWordIndex + 1) / gameState.totalWords) * 100;
  const sceneProgress = showFeedback ? 100 : (selectedChoice ? 50 : 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 ${
          isAdventureMode 
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30' 
            : 'bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <BookOpen className={`h-5 w-5 ${
                isAdventureMode ? 'text-purple-300' : 'text-purple-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Story Adventure
              </h3>
              <p className={`text-sm ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Story {gameState.currentWordIndex + 1} of {gameState.totalWords}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-green-400' : 'text-green-600'
              }`}>
                {gameState.correctAnswers}
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Correct
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-blue-400' : 'text-blue-600'
              }`}>
                {Math.round((gameState.correctAnswers / Math.max(gameState.correctAnswers + gameState.incorrectAnswers, 1)) * 100)}%
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Accuracy
              </div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className={`h-2 rounded-full overflow-hidden ${
            isAdventureMode ? 'bg-slate-700' : 'bg-gray-200'
          }`}>
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Story Scene */}
      <motion.div
        key={gameState.currentWordIndex}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-3xl p-8 ${
          isAdventureMode 
            ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-2xl' 
            : 'bg-white shadow-xl border border-gray-100'
        }`}
      >
        {/* Story Title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className={`h-8 w-8 ${
              isAdventureMode ? 'text-purple-300' : 'text-purple-600'
            }`} />
            <h2 className={`text-3xl font-bold ${
              isAdventureMode ? 'text-white' : 'text-gray-800'
            }`}>
              {currentScene.title}
            </h2>
          </div>
          
          {/* Vocabulary Word with Audio */}
          <div className="flex items-center justify-center space-x-4 mb-6">
            <div className={`text-2xl font-bold ${
              isAdventureMode ? 'text-purple-300' : 'text-purple-600'
            }`}>
              {vocabularyWord}
            </div>
            <button
              onClick={handlePlayAudio}
              disabled={gameState.audioPlaying}
              className={`p-2 rounded-full transition-all duration-200 ${
                gameState.audioPlaying
                  ? isAdventureMode
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isAdventureMode
                    ? 'bg-purple-500/30 hover:bg-purple-500/40 text-purple-200'
                    : 'bg-purple-100 hover:bg-purple-200 text-purple-600'
              }`}
            >
              <Volume2 className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Story Text */}
        <div className={`text-lg leading-relaxed mb-8 p-6 rounded-2xl ${
          isAdventureMode 
            ? 'bg-slate-700/30 text-slate-200' 
            : 'bg-gray-50 text-gray-700'
        }`}>
          {currentScene.text}
        </div>

        {/* Choices */}
        {!showFeedback && (
          <div className="space-y-4">
            <h3 className={`text-xl font-semibold mb-4 ${
              isAdventureMode ? 'text-white' : 'text-gray-800'
            }`}>
              Choose your answer:
            </h3>
            
            {currentScene.choices.map((choice, index) => (
              <motion.button
                key={choice.id}
                onClick={() => handleChoiceSelect(choice.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                  selectedChoice === choice.id
                    ? isAdventureMode
                      ? 'bg-purple-500/30 border-2 border-purple-400/50 text-purple-200'
                      : 'bg-purple-100 border-2 border-purple-300 text-purple-700'
                    : isAdventureMode
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-500/30'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    isAdventureMode ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{choice.text}</span>
                </div>
              </motion.button>
            ))}
          </div>
        )}

        {/* Feedback */}
        <AnimatePresence>
          {showFeedback && selectedChoice && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              {(() => {
                const choice = currentScene.choices.find(c => c.id === selectedChoice);
                return choice ? (
                  <div className={`p-6 rounded-2xl ${
                    choice.isCorrect
                      ? isAdventureMode
                        ? 'bg-green-500/20 border border-green-400/30'
                        : 'bg-green-100 border border-green-300'
                      : isAdventureMode
                        ? 'bg-red-500/20 border border-red-400/30'
                        : 'bg-red-100 border border-red-300'
                  }`}>
                    <div className={`text-2xl font-bold mb-2 ${
                      choice.isCorrect
                        ? isAdventureMode ? 'text-green-300' : 'text-green-600'
                        : isAdventureMode ? 'text-red-300' : 'text-red-600'
                    }`}>
                      {choice.isCorrect ? '¡Correcto!' : '¡Inténtalo de nuevo!'}
                    </div>
                    <p className={`text-lg ${
                      isAdventureMode ? 'text-slate-300' : 'text-gray-700'
                    }`}>
                      {choice.feedback}
                    </p>
                  </div>
                ) : null;
              })()}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
