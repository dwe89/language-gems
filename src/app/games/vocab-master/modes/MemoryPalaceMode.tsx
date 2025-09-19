import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Eye, Lightbulb, MapPin, Volume2, ArrowRight, Sparkles, Home } from 'lucide-react';
import { ModeComponent } from '../types';

interface MemoryPalaceModeProps extends ModeComponent {
  onMemoryComplete: (isCorrect: boolean, memoryTechnique: string) => void;
}

interface MemoryAssociation {
  id: string;
  visualCue: string;
  description: string;
  memoryTechnique: string;
  icon: React.ReactNode;
  color: string;
}

export const MemoryPalaceMode: React.FC<MemoryPalaceModeProps> = ({
  gameState,
  onMemoryComplete,
  isAdventureMode,
  playPronunciation,
  onModeSpecificAction
}) => {
  const [currentStep, setCurrentStep] = useState<'visualize' | 'associate' | 'recall' | 'test'>('visualize');
  const [selectedAssociation, setSelectedAssociation] = useState<string | null>(null);
  const [showMemoryTip, setShowMemoryTip] = useState(false);
  const [userRecall, setUserRecall] = useState('');

  const currentWord = gameState.currentWord;
  const vocabularyWord = currentWord?.word || currentWord?.spanish || '';
  const vocabularyTranslation = currentWord?.translation || currentWord?.english || '';

  // Generate memory associations based on the word
  const generateMemoryAssociations = (): MemoryAssociation[] => {
    const associations: MemoryAssociation[] = [
      {
        id: 'visual',
        visualCue: `Picture a vivid scene with ${vocabularyTranslation.toLowerCase()}`,
        description: `Imagine yourself interacting with ${vocabularyTranslation.toLowerCase()} in a memorable way`,
        memoryTechnique: 'Visual Imagery',
        icon: <Eye className="h-6 w-6" />,
        color: 'text-blue-500'
      },
      {
        id: 'location',
        visualCue: `Place ${vocabularyTranslation.toLowerCase()} in a familiar room`,
        description: `Visualize ${vocabularyTranslation.toLowerCase()} in your bedroom, kitchen, or living room`,
        memoryTechnique: 'Method of Loci',
        icon: <Home className="h-6 w-6" />,
        color: 'text-green-500'
      },
      {
        id: 'story',
        visualCue: `Create a story involving ${vocabularyTranslation.toLowerCase()}`,
        description: `Make up a funny or dramatic story where ${vocabularyTranslation.toLowerCase()} plays a key role`,
        memoryTechnique: 'Narrative Method',
        icon: <Sparkles className="h-6 w-6" />,
        color: 'text-purple-500'
      },
      {
        id: 'sound',
        visualCue: `Connect the sound of "${vocabularyWord}" to ${vocabularyTranslation.toLowerCase()}`,
        description: `Find words that sound similar or create a rhyme with "${vocabularyWord}"`,
        memoryTechnique: 'Phonetic Association',
        icon: <Volume2 className="h-6 w-6" />,
        color: 'text-orange-500'
      }
    ];

    return associations;
  };

  const [memoryAssociations] = useState<MemoryAssociation[]>(generateMemoryAssociations());

  useEffect(() => {
    // Reset for new word
    setCurrentStep('visualize');
    setSelectedAssociation(null);
    setShowMemoryTip(false);
    setUserRecall('');
  }, [gameState.currentWordIndex]);

  const handleAssociationSelect = (associationId: string) => {
    setSelectedAssociation(associationId);
    setCurrentStep('associate');
    
    // Show memory tip after selection
    setTimeout(() => {
      setShowMemoryTip(true);
    }, 1000);
  };

  const handleContinueToRecall = () => {
    setCurrentStep('recall');
    setShowMemoryTip(false);
  };

  const handleRecallTest = () => {
    setCurrentStep('test');
  };

  const handleMemoryTest = (isCorrect: boolean) => {
    const selectedTechnique = memoryAssociations.find(a => a.id === selectedAssociation)?.memoryTechnique || 'Visual Memory';
    onMemoryComplete(isCorrect, selectedTechnique);
    
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
  const stepProgress = currentStep === 'visualize' ? 25 : currentStep === 'associate' ? 50 : currentStep === 'recall' ? 75 : 100;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-4 ${
          isAdventureMode 
            ? 'bg-gradient-to-r from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-600/30' 
            : 'bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-2 rounded-full ${
              isAdventureMode ? 'bg-indigo-500/20' : 'bg-indigo-100'
            }`}>
              <Brain className={`h-5 w-5 ${
                isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
              }`} />
            </div>
            <div>
              <h3 className={`font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Memory Palace
              </h3>
              <p className={`text-sm ${
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
        className={`rounded-3xl p-8 ${
          isAdventureMode 
            ? 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border-2 border-slate-600/30 shadow-2xl' 
            : 'bg-white shadow-xl border border-gray-100'
        }`}
      >
        {/* Step 1: Visualize */}
        {currentStep === 'visualize' && (
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <Brain className={`h-8 w-8 ${
                isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
              }`} />
              <h2 className={`text-3xl font-bold ${
                isAdventureMode ? 'text-white' : 'text-gray-800'
              }`}>
                Memory Palace
              </h2>
            </div>
            
            {/* Vocabulary Word with Audio */}
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

            {/* Memory Technique Options */}
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
                      <h3 className="font-semibold text-lg mb-2">{association.memoryTechnique}</h3>
                      <p className={`text-sm ${
                        isAdventureMode ? 'text-slate-400' : 'text-gray-600'
                      }`}>
                        {association.visualCue}
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
            {(() => {
              const association = memoryAssociations.find(a => a.id === selectedAssociation);
              return association ? (
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-6">
                    <div className={association.color}>
                      {association.icon}
                    </div>
                    <h2 className={`text-3xl font-bold ${
                      isAdventureMode ? 'text-white' : 'text-gray-800'
                    }`}>
                      {association.memoryTechnique}
                    </h2>
                  </div>

                  <div className={`text-2xl mb-6 ${
                    isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
                  }`}>
                    {vocabularyWord} = {vocabularyTranslation}
                  </div>

                  <div className={`text-lg mb-8 p-6 rounded-2xl ${
                    isAdventureMode 
                      ? 'bg-slate-700/30 text-slate-200' 
                      : 'bg-indigo-50 text-gray-700'
                  }`}>
                    <Lightbulb className={`h-6 w-6 mx-auto mb-4 ${
                      isAdventureMode ? 'text-yellow-300' : 'text-yellow-500'
                    }`} />
                    {association.description}
                  </div>

                  <AnimatePresence>
                    {showMemoryTip && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl mb-6 ${
                          isAdventureMode 
                            ? 'bg-green-500/20 border border-green-400/30 text-green-300' 
                            : 'bg-green-100 border border-green-300 text-green-700'
                        }`}
                      >
                        <p className="text-sm">
                          💡 Take a moment to really visualize this association. The more vivid and personal you make it, the better you'll remember!
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    onClick={handleContinueToRecall}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 rounded-2xl font-semibold transition-all duration-200 ${
                      isAdventureMode
                        ? 'bg-indigo-500 hover:bg-indigo-400 text-white'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                    }`}
                  >
                    I've Created My Memory
                    <ArrowRight className="h-5 w-5 ml-2 inline" />
                  </motion.button>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Step 3: Recall */}
        {currentStep === 'recall' && (
          <div className="text-center">
            <h2 className={`text-3xl font-bold mb-6 ${
              isAdventureMode ? 'text-white' : 'text-gray-800'
            }`}>
              Test Your Memory
            </h2>

            <p className={`text-lg mb-8 ${
              isAdventureMode ? 'text-slate-300' : 'text-gray-600'
            }`}>
              Now use your memory association to recall the meaning:
            </p>

            <div className={`text-4xl font-bold mb-8 ${
              isAdventureMode ? 'text-indigo-300' : 'text-indigo-600'
            }`}>
              {vocabularyWord}
            </div>

            <div className="max-w-md mx-auto mb-8">
              <input
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

                  {/* Auto-advance happens via useEffect */}
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
