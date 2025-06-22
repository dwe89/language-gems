'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EnhancedGemDisplay } from './EnhancedGemDisplay';
import { VocabularyGem } from '../../types/vocabulary-mining';
import { ArrowRight, Info } from 'lucide-react';

interface GemProgressionVisualizationProps {
  gem: VocabularyGem;
  currentLevel: number;
  showAllStages?: boolean;
  interactive?: boolean;
  onStageClick?: (stage: number) => void;
}

const GEM_STAGES = [
  { 
    stage: 1, 
    name: 'Rock', 
    emoji: '🪨', 
    description: 'Initial encounter - You\'ve just discovered this word!',
    requirements: 'First time seeing this word',
    color: '#6B7280'
  },
  { 
    stage: 2, 
    name: 'Crystal', 
    emoji: '🔹', 
    description: 'Basic recognition - You can recognize this word when you see it.',
    requirements: '3 correct answers in a row',
    color: '#3B82F6'
  },
  { 
    stage: 3, 
    name: 'Gemstone', 
    emoji: '💎', 
    description: 'Good understanding - You understand the meaning and can use it.',
    requirements: '5 correct answers with 80% accuracy',
    color: '#8B5CF6'
  },
  { 
    stage: 4, 
    name: 'Jewel', 
    emoji: '💍', 
    description: 'Strong mastery - You can use this word confidently in context.',
    requirements: '10 correct answers with 90% accuracy',
    color: '#F59E0B'
  },
  { 
    stage: 5, 
    name: 'Crown Jewel', 
    emoji: '👑', 
    description: 'Complete mastery - This word is permanently in your vocabulary!',
    requirements: '15 correct answers with 95% accuracy over time',
    color: '#EF4444'
  }
];

export function GemProgressionVisualization({ 
  gem, 
  currentLevel, 
  showAllStages = true,
  interactive = true,
  onStageClick 
}: GemProgressionVisualizationProps) {
  const [selectedStage, setSelectedStage] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleStageClick = (stage: number) => {
    if (interactive) {
      setSelectedStage(selectedStage === stage ? null : stage);
      if (onStageClick) {
        onStageClick(stage);
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gem Progression</h3>
          <p className="text-sm text-gray-600">Watch your vocabulary transform as you practice!</p>
        </div>
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/50 rounded-lg transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
      </div>

      {/* Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <h4 className="font-medium text-blue-900 mb-2">How Gem Progression Works</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Practice words correctly to advance through stages</li>
              <li>• Each stage requires different levels of mastery</li>
              <li>• Higher stages unlock better rewards and longer retention</li>
              <li>• Crown Jewels are permanently mastered vocabulary</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Word Display */}
      <div className="text-center mb-8">
        <div className="text-2xl font-bold text-gray-900 mb-2">{gem.term}</div>
        <div className="text-lg text-gray-600 mb-4">{gem.translation}</div>
        <div className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
          Currently: {GEM_STAGES[currentLevel - 1]?.name || 'Unknown'}
        </div>
      </div>

      {/* Progression Stages */}
      <div className="space-y-6">
        {showAllStages ? (
          // Show all stages in a horizontal progression
          <div className="flex items-center justify-between">
            {GEM_STAGES.map((stage, index) => (
              <React.Fragment key={stage.stage}>
                <motion.div
                  className={`flex flex-col items-center cursor-pointer ${
                    interactive ? 'hover:scale-105' : ''
                  }`}
                  onClick={() => handleStageClick(stage.stage)}
                  whileHover={interactive ? { scale: 1.05 } : {}}
                  whileTap={interactive ? { scale: 0.95 } : {}}
                >
                  {/* Gem Display */}
                  <div className="mb-2">
                    <EnhancedGemDisplay
                      gem={gem}
                      masteryLevel={stage.stage}
                      size="large"
                      interactive={false}
                      className={`
                        ${currentLevel >= stage.stage ? 'opacity-100' : 'opacity-40'}
                        ${currentLevel === stage.stage ? 'ring-4 ring-purple-400 ring-opacity-50' : ''}
                      `}
                    />
                  </div>
                  
                  {/* Stage Info */}
                  <div className="text-center">
                    <div className={`text-sm font-medium ${
                      currentLevel >= stage.stage ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {stage.name}
                    </div>
                    <div className={`text-xs ${
                      currentLevel >= stage.stage ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      Level {stage.stage}
                    </div>
                  </div>
                  
                  {/* Achievement Badge */}
                  {currentLevel >= stage.stage && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-1"
                    >
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
                
                {/* Arrow between stages */}
                {index < GEM_STAGES.length - 1 && (
                  <motion.div
                    className={`flex-1 flex items-center justify-center ${
                      currentLevel > stage.stage ? 'text-green-500' : 'text-gray-300'
                    }`}
                    animate={{
                      color: currentLevel > stage.stage ? '#10B981' : '#D1D5DB'
                    }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                )}
              </React.Fragment>
            ))}
          </div>
        ) : (
          // Show only current and next stage
          <div className="flex items-center justify-center space-x-8">
            {/* Current Stage */}
            <div className="flex flex-col items-center">
              <div className="mb-2">
                <EnhancedGemDisplay
                  gem={gem}
                  masteryLevel={currentLevel}
                  size="xl"
                  showDetails={false}
                  isReviewing={true}
                />
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">
                  {GEM_STAGES[currentLevel - 1]?.name}
                </div>
                <div className="text-sm text-gray-600">Current Level</div>
              </div>
            </div>
            
            {/* Arrow */}
            {currentLevel < 5 && (
              <motion.div
                animate={{ x: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-purple-500"
              >
                <ArrowRight className="w-8 h-8" />
              </motion.div>
            )}
            
            {/* Next Stage */}
            {currentLevel < 5 && (
              <div className="flex flex-col items-center">
                <div className="mb-2">
                  <EnhancedGemDisplay
                    gem={gem}
                    masteryLevel={currentLevel + 1}
                    size="xl"
                    showDetails={false}
                    className="opacity-60"
                  />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-600">
                    {GEM_STAGES[currentLevel]?.name}
                  </div>
                  <div className="text-sm text-gray-500">Next Level</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Stage Details */}
      <AnimatePresence>
        {selectedStage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
          >
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{GEM_STAGES[selectedStage - 1]?.emoji}</span>
              <div>
                <h4 className="font-semibold text-gray-900">
                  {GEM_STAGES[selectedStage - 1]?.name}
                </h4>
                <p className="text-sm text-gray-600">
                  Level {selectedStage} of 5
                </p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-3">
              {GEM_STAGES[selectedStage - 1]?.description}
            </p>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs font-medium text-gray-700 mb-1">
                Requirements to reach this level:
              </div>
              <div className="text-xs text-gray-600">
                {GEM_STAGES[selectedStage - 1]?.requirements}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress to Next Level */}
      {currentLevel < 5 && (
        <div className="mt-6 p-4 bg-white/50 rounded-lg border border-white/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress to {GEM_STAGES[currentLevel]?.name}
            </span>
            <span className="text-sm text-gray-600">
              {Math.floor(Math.random() * 40 + 30)}% {/* Mock progress */}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${Math.floor(Math.random() * 40 + 30)}%` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Keep practicing to advance to the next stage!
          </div>
        </div>
      )}
    </div>
  );
}
