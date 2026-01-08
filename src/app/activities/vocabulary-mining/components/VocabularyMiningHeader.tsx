'use client';

import React from 'react';
import { Home, Volume2, VolumeX, BookOpen, Star, Zap } from 'lucide-react';
import GemIcon, { GemType } from '../../../../components/ui/GemIcon';

interface VocabularyMiningHeaderProps {
  onExit: () => void;
  isAssignmentMode: boolean;
  assignmentTitle?: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  gameState: {
    currentWordIndex: number;
    totalWords: number;
    gemsCollected: number;
    currentGemType: GemType;
  };
  currentLevel: number;
  sessionXP: number;
}

export const VocabularyMiningHeader: React.FC<VocabularyMiningHeaderProps> = ({
  onExit,
  isAssignmentMode,
  assignmentTitle,
  soundEnabled,
  onToggleSound,
  gameState,
  currentLevel,
  sessionXP
}) => {
  return (
    <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onExit}
            className="flex items-center text-white hover:text-gray-300 transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            {isAssignmentMode ? 'Back to Assignments' : 'Exit Mining'}
          </button>

          {/* Current Session Stats */}
          <div className="flex items-center space-x-6 text-white">
            {isAssignmentMode && assignmentTitle && (
              <div className="flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-green-400" />
                <span className="font-semibold">{assignmentTitle}</span>
              </div>
            )}

            {/* Session Progress */}
            <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
              <span className="text-sm font-medium mr-2">Progress:</span>
              <span className="font-bold">{gameState.currentWordIndex + 1} / {gameState.totalWords}</span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <GemIcon type={gameState.currentGemType} size="small" animated={true} className="mr-1" />
                <span className="font-semibold">{gameState.gemsCollected}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400" />
                <span>Lv.{currentLevel}</span>
              </div>
              <div className="flex items-center">
                <Zap className="h-4 w-4 mr-1 text-blue-400" />
                <span>{sessionXP} XP</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              const newSoundState = !soundEnabled;
              console.log(`🎵 VocabularyMining: Sound toggled to ${newSoundState ? 'ON' : 'OFF'}`);
              onToggleSound();
            }}
            className="flex items-center text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
            title={soundEnabled ? 'Disable Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};
