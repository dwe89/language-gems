import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, Lightbulb, MapPin, Volume2, ArrowRight, Sparkles, Home, ArrowLeft } from 'lucide-react';
import { ModeComponent } from '../types';

interface MemoryPalaceModeProps extends ModeComponent {
  onMemoryComplete: (isCorrect: boolean, memoryTechnique: string) => void;
}

interface MemoryAssociation {
  id: string;
  techniqueName: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export const MemoryPalaceMode: React.FC<MemoryPalaceModeProps> = ({
  gameState,
  onMemoryComplete,
  isAdventureMode,
  playPronunciation,
  onModeSpecificAction,
  onExit
}) => {
  const [currentStep, setCurrentStep] = useState<'visualize' | 'associate' | 'recall' | 'test'>('visualize');
  const [selectedAssociationId, setSelectedAssociationId] = useState<string | null>(null);
  const [userAssociationText, setUserAssociationText] = useState('');
  const [userRecall, setUserRecall] = useState('');

  const currentWord = gameState.currentWord;
  const vocabularyWord = currentWord?.word || currentWord?.spanish || '';
  const vocabularyTranslation = currentWord?.translation || currentWord?.english || '';
  
  const userAssociationInputRef = useRef<HTMLInputElement>(null);
  const userRecallInputRef = useRef<HTMLInputElement>(null);

  // Define simple, universal memory associations
  const memoryAssociations: MemoryAssociation[] = [
    {
      id: 'visual',
      techniqueName: 'Visual Imagery',
      description: `Create a vivid mental image that links "${vocabularyWord}" to its meaning: "${vocabularyTranslation}".`,
      icon: <Eye className="h-6 w-6" />,
      color: 'text-blue-500'
    },
    {
      id: 'location',
      techniqueName: 'Method of Loci',
      description: `Imagine placing "${vocabularyWord}" in a specific spot in a familiar location, like your bedroom.`,
      icon: <Home className="h-6 w-6" />,
      color: 'text-green-500'
    },
    {
      id: 'story',
      techniqueName: 'Narrative Method',
      description: `Make up a short, memorable story that includes both "${vocabularyWord}" and "${vocabularyTranslation}".`,
      icon: <Sparkles className="h-6 w-6" />,
      color: 'text-purple-500'
    },
    {
      id: 'sound',
      techniqueName: 'Phonetic Association',
      description: `Find words that sound similar to "${vocabularyWord}" to create a sound-based link to "${vocabularyTranslation}".`,
      icon: <Volume2 className="h-6 w-6" />,
      color: 'text-orange-500'
    }
  ];

  useEffect(() => {
    // Reset for new word
    setCurrentStep('visualize');
    setSelectedAssociationId(null);
    setUserAssociationText('');
    setUserRecall('');
  }, [gameState.currentWordIndex]);

  useEffect(() => {
    if (currentStep === 'associate' && userAssociationInputRef.current) {
      userAssociationInputRef.current.focus();
    }
    if (currentStep === 'recall' && userRecallInputRef.current) {
      userRecallInputRef.current.focus();
    }
  }, [currentStep]);

  const handleAssociationSelect = (associationId: string) => {
    setSelectedAssociationId(associationId);
    setCurrentStep('associate');
  };

  const handleContinueToRecall = () => {
    setCurrentStep('recall');
  };

  const handleRecallTest = () => {
    const isCorrect = userRecall.toLowerCase().trim() === vocabularyTranslation.toLowerCase().trim();
    const selectedTechnique = memoryAssociations.find(a => a.id === selectedAssociationId)?.techniqueName || 'Visual Memory';
    onMemoryComplete(isCorrect, selectedTechnique);
    setCurrentStep('test');
    
    // Auto-advance after showing result
    setTimeout(() => {
      if (onModeSpecificAction) {
        onModeSpecificAction('memory_complete', { 
          word: vocabularyWord,
          technique: selectedTechnique,
          isCorrect
        });
      }
    }, 2500);
  };

  const handlePlayAudio = () => {
    if (currentWord && !gameState.audioPlaying) {
      playPronunciation(vocabularyWord, 'es', currentWord);
    }
  };

  const progressPercentage = ((gameState.currentWordIndex + 1) / gameState.totalWords) * 100;
  const selectedAssociation = memoryAssociations.find(a => a.id === selectedAssociationId);
  const stepProgress = currentStep === 'visualize' ? 25 : currentStep === 'associate' ? 50 : currentStep === 'recall' ? 75 : 100;

  const getContainerClasses = () => {
    if (isAdventureMode) {
      return 'min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';
    }
    return 'min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50';
  };

  const getCardClasses = () => {
    if (isAdventureMode) {
      return 'bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 shadow-2xl';
    }
    return 'bg-white shadow-xl border border-gray-100';
  };

  return (
    <div className={getContainerClasses()}>
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 w-full max-w-4xl mb-6 ${
          isAdventureMode 
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30' 
            : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {onExit && (
              <button
                onClick={onExit}
                className={`${
                  isAdventureMode
                    ? 'bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 border border-slate-600/30'
                    : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                } px-2 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1`}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            )}
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
            }`}>
              <Brain className={`h-4 w-4 ${
                isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-semibold text-sm ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Memory Palace
              </h3>
              <p className={`text-xs ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Word {gameState.currentWordIndex + 1} of {gameState.totalWords}
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
                Memorized
              </div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${
                isAdventureMode ? 'text-indigo-400' : 'text-indigo-600'
              }`}>
                {stepProgress}%
              </div>
              <div className={`text-xs ${
                isAdventureMode ? 'text-slate-400' : 'text-gray-500'
              }`}>
                Step Progress
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
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Memory Palace Interface */}
      <motion.div
        key={`${gameState.currentWordIndex}-${currentStep}`}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`rounded-3xl p-8 w-full max-w-4xl ${getCardClasses()}`}
      >
        {/* Step 1: Visualize */}
        {currentStep === 'visualize' && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className={`h-6 w-6 ${
                isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
              }`} />
              <h2 className={`text-2xl font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Memory Palace
              </h2>
            </div>

            {/* Explanation Section */}
            <div className={`mb-6 p-4 rounded-lg ${
              isAdventureMode ? 'bg-slate-700/30 border border-slate-600/30' : 'bg-blue-50 border border-blue-200'
            }`}>
              <h3 className={`text-lg font-semibold mb-2 ${
                isAdventureMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                How Memory Palace Works
              </h3>
              <p className={`text-sm ${
                isAdventureMode ? 'text-slate-300' : 'text-gray-600'
              }`}>
                Memory Palace is an ancient technique used by memory champions. You'll create vivid mental images
                and place them in familiar locations to remember new words. This method works because our brains
                are excellent at remembering visual and spatial information.
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className={`text-4xl font-bold ${
                isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
              }`}>
                {vocabularyWord}
              </div>
              <button
                onClick={handlePlayAudio}
                disabled={gameState.audioPlaying}
                className={`p-3 rounded-full transition-all duration-200 ${
                  gameState.audioPlaying
                    ? isAdventureMode
                      ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : isAdventureMode
                      ? 'bg-indigo-500/30 hover:bg-indigo-500/40 text-indigo-200'
                      : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-600'
                }`}
              >
                <Volume2 className="h-6 w-6" />
              </button>
            </div>

            <div className={`text-2xl mb-8 ${
              isAdventureMode ? 'text-slate-300' : 'text-gray-600'
            }`}>
              means: <span className={`font-semibold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>{vocabularyTranslation}</span>
            </div>

            <p className={`text-lg mb-8 ${
              isAdventureMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Choose a memory technique to help you remember this word:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {memoryAssociations.map((association) => (
                <motion.button
                  key={association.id}
                  onClick={() => handleAssociationSelect(association.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl text-left transition-all duration-200 ${
                    isAdventureMode
                      ? 'bg-slate-700/50 hover:bg-slate-600/50 text-white border border-slate-500/30'
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-full ${
                      isAdventureMode ? 'bg-slate-600/50' : 'bg-white'
                    }`}>
                      <div className={association.color}>
                        {association.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">{association.techniqueName}</h3>
                      <p className={`text-sm ${
                        isAdventureMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        {association.description}
                      </p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Associate */}
        {currentStep === 'associate' && selectedAssociation && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className={selectedAssociation.color}>
                {selectedAssociation.icon}
              </div>
              <h2 className={`text-3xl font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                {selectedAssociation.techniqueName}
              </h2>
            </div>
            
            <div className={`text-2xl mb-6 ${
              isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
            }`}>
              {vocabularyWord} = {vocabularyTranslation}
            </div>

            <p className={`text-lg mb-4 ${
              isAdventureMode ? 'text-slate-400' : 'text-gray-600'
            }`}>
              Now, type your association to help you remember:
            </p>

            <input
              ref={userAssociationInputRef}
              type="text"
              value={userAssociationText}
              onChange={(e) => setUserAssociationText(e.target.value)}
              placeholder={`My vivid memory is...`}
              className={`w-full p-4 rounded-2xl text-lg text-center border-2 transition-all duration-200 mb-8 ${
                isAdventureMode
                  ? 'bg-slate-700/50 border-slate-500/50 text-white placeholder-slate-400 focus:border-indigo-400'
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-indigo-500'
              } focus:outline-none focus:ring-0`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && userAssociationText.trim()) {
                  handleContinueToRecall();
                }
              }}
            />

            <motion.button
              onClick={handleContinueToRecall}
              disabled={!userAssociationText.trim()}
              whileHover={{ scale: userAssociationText.trim() ? 1.05 : 1 }}
              whileTap={{ scale: userAssociationText.trim() ? 0.95 : 1 }}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                userAssociationText.trim()
                  ? isAdventureMode
                    ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : isAdventureMode
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              I've Created My Memory
              <ArrowRight className="h-5 w-5 ml-2 inline" />
            </motion.button>
          </div>
        )}

        {/* Step 3: Recall */}
        {currentStep === 'recall' && selectedAssociation && (
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-6 ${
              isAdventureMode ? 'text-white' : 'text-gray-800'
            }`}>
              Test Your Memory
            </h2>

            <p className={`text-lg mb-4 ${
              isAdventureMode ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Use your memory association to recall the meaning:
            </p>

            <div className="flex items-center justify-center space-x-4 mb-8">
              <div className={`text-4xl font-bold ${
                isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
              }`}>
                {vocabularyWord}
              </div>
              <div className={`p-4 rounded-full ${
                isAdventureMode ? 'bg-slate-700/50' : 'bg-gray-100'
              }`}>
                <div className={selectedAssociation.color}>
                  {selectedAssociation.icon}
                </div>
              </div>
            </div>

            <div className="max-w-md mx-auto mb-8">
              <input
                ref={userRecallInputRef}
                type="text"
                value={userRecall}
                onChange={(e) => setUserRecall(e.target.value)}
                placeholder="What does this word mean?"
                className={`w-full p-4 rounded-2xl text-lg text-center border-2 transition-all duration-200 ${
                  isAdventureMode
                    ? 'bg-slate-700/50 border-slate-500/50 text-white placeholder-slate-400 focus:border-indigo-400'
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500 focus:border-indigo-500'
                } focus:outline-none focus:ring-0`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && userRecall.trim()) {
                    handleRecallTest();
                  }
                }}
              />
            </div>

            <motion.button
              onClick={handleRecallTest}
              disabled={!userRecall.trim()}
              whileHover={{ scale: userRecall.trim() ? 1.05 : 1 }}
              whileTap={{ scale: userRecall.trim() ? 0.95 : 1 }}
              className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                userRecall.trim()
                  ? isAdventureMode
                    ? 'bg-green-500 hover:bg-green-400 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                  : isAdventureMode
                    ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Check My Memory
            </motion.button>
          </div>
        )}

        {/* Step 4: Test Result */}
        {currentStep === 'test' && (
          <div className="text-center">
            {(() => {
              const isCorrect = userRecall.toLowerCase().trim() === vocabularyTranslation.toLowerCase().trim();
              return (
                <div>
                  <div className={`text-3xl font-bold mb-6 ${
                    isCorrect
                      ? isAdventureMode ? 'text-green-300' : 'text-green-600'
                      : isAdventureMode ? 'text-red-300' : 'text-red-600'
                  }`}>
                    {isCorrect ? '🧠 Memory Success!' : '🤔 Keep Practicing!'}
                  </div>

                  <div className={`text-2xl mb-4 ${
                    isAdventureMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {vocabularyWord} = {vocabularyTranslation}
                  </div>

                  <div className={`text-lg mb-6 ${
                    isAdventureMode ? 'text-slate-300' : 'text-gray-600'
                  }`}>
                    Your answer: <span className={`font-semibold ${
                      isCorrect
                        ? isAdventureMode ? 'text-green-300' : 'text-green-600'
                        : isAdventureMode ? 'text-red-300' : 'text-red-600'
                    }`}>{userRecall}</span>
                  </div>

                  {!isCorrect && (
                    <div className={`p-4 rounded-xl mb-6 ${
                      isAdventureMode 
                        ? 'bg-yellow-500/20 border border-yellow-400/30 text-yellow-300' 
                        : 'bg-yellow-100 border border-yellow-300 text-yellow-700'
                    }`}>
                      <p className="text-sm">
                        💡 Try strengthening your memory association. The more vivid and personal, the better!
                      </p>
                    </div>
                  )}

                  <div className={`text-sm ${
                    isAdventureMode ? 'text-slate-400' : 'text-gray-500'
                  }`}>
                    Moving to next word...
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </motion.div>
    </div>
  );
};
