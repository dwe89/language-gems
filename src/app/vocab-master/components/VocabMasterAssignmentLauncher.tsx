'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Target, 
  Brain, 
  Headphones, 
  FileText, 
  Zap, 
  Clock, 
  Shuffle, 
  Mic, 
  Keyboard,
  ArrowLeft,
  Play
} from 'lucide-react';
import { VocabularyWord } from '../types';

interface GameMode {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  category: 'core' | 'skills' | 'challenge';
  estimatedTime: string;
  difficulty: string;
  isRecommended?: boolean;
}

// Streamlined Mode Definitions for Assignment Mode
const ASSIGNMENT_GAME_MODES: GameMode[] = [
  // Core Learning & Review
  {
    id: 'learn_new',
    name: 'Learn New Words',
    description: 'Start with unfamiliar vocabulary using spaced repetition',
    icon: <Lightbulb className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-green-400 to-blue-500',
    category: 'core',
    estimatedTime: '10-15 min',
    difficulty: 'Beginner',
    isRecommended: true
  },
  {
    id: 'flashcard_review',
    name: 'Flashcards',
    description: 'Classic flashcard review with digital cards',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-blue-400 to-purple-500',
    category: 'core',
    estimatedTime: '8-12 min',
    difficulty: 'Beginner'
  },
  {
    id: 'multiple_choice_quiz',
    name: 'Multiple Choice',
    description: 'Choose the correct translation from multiple options',
    icon: <Target className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-purple-400 to-pink-500',
    category: 'core',
    estimatedTime: '5-10 min',
    difficulty: 'Beginner'
  },

  // Skill Builders
  {
    id: 'listening_practice',
    name: 'Listening Practice',
    description: 'Improve listening skills with audio exercises',
    icon: <Headphones className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-teal-400 to-cyan-500',
    category: 'skills',
    estimatedTime: '10-15 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'dictation_practice',
    name: 'Dictation',
    description: 'Listen and type what you hear',
    icon: <Keyboard className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    category: 'skills',
    estimatedTime: '8-12 min',
    difficulty: 'Intermediate'
  },
  {
    id: 'context_practice',
    name: 'Context Practice',
    description: 'Fill in missing words in sentences',
    icon: <FileText className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-indigo-400 to-purple-500',
    category: 'skills',
    estimatedTime: '10-15 min',
    difficulty: 'Intermediate'
  },

  // Challenges
  {
    id: 'speed_challenge',
    name: 'Speed Challenge',
    description: 'Test your vocabulary knowledge under time pressure',
    icon: <Zap className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
    category: 'challenge',
    estimatedTime: '5-8 min',
    difficulty: 'Advanced'
  },
  {
    id: 'word_matching',
    name: 'Word Matching',
    description: 'Match words with their translations',
    icon: <Shuffle className="h-6 w-6" />,
    color: 'bg-gradient-to-r from-orange-400 to-red-500',
    category: 'challenge',
    estimatedTime: '6-10 min',
    difficulty: 'Intermediate'
  }
];

interface VocabMasterAssignmentLauncherProps {
  vocabulary: VocabularyWord[];
  assignmentTitle: string;
  onModeSelect: (modeId: string) => void;
  onBack: () => void;
  isAssessmentMode?: boolean;
}

export default function VocabMasterAssignmentLauncher({
  vocabulary,
  assignmentTitle,
  onModeSelect,
  onBack,
  isAssessmentMode = false
}: VocabMasterAssignmentLauncherProps) {
  const [selectedMode, setSelectedMode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleModeSelect = async (modeId: string) => {
    setIsLoading(true);
    setSelectedMode(modeId);
    
    // Small delay for visual feedback
    setTimeout(() => {
      onModeSelect(modeId);
    }, 500);
  };

  const getCategoryModes = (category: string) => {
    return ASSIGNMENT_GAME_MODES.filter(mode => mode.category === category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            {!isAssessmentMode && (
              <button
                onClick={onBack}
                className="flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Assignments
              </button>
            )}
            
            {!isAssessmentMode && (
              <div className="text-white/60 text-sm">
                {vocabulary.length} words loaded
              </div>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-4">
            {assignmentTitle}
          </h1>
          <p className="text-xl text-white/80 mb-2">
            Choose Your Learning Mode
          </p>
          <p className="text-white/60">
            Select how you'd like to practice your vocabulary
          </p>
        </motion.div>

        {/* Mode Sections */}
        <div className="space-y-12">
          {/* Core Learning & Review Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <Brain className="h-6 w-6 text-blue-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Core Learning & Review</h3>
            </div>
            <p className="text-white/70 mb-6">
              Primary activities that help you learn and remember vocabulary
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCategoryModes('core').map((mode, index) => (
                <ModeCard 
                  key={mode.id} 
                  mode={mode} 
                  index={index} 
                  onSelect={handleModeSelect}
                  isLoading={isLoading}
                  selectedMode={selectedMode}
                  vocabularyLength={vocabulary.length}
                />
              ))}
            </div>
          </motion.div>

          {/* Skill Builders Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center mb-6">
              <Target className="h-6 w-6 text-green-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Skill Builders</h3>
            </div>
            <p className="text-white/70 mb-6">
              Focused practice modes to develop specific language skills
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCategoryModes('skills').map((mode, index) => (
                <ModeCard 
                  key={mode.id} 
                  mode={mode} 
                  index={index + 3} 
                  onSelect={handleModeSelect}
                  isLoading={isLoading}
                  selectedMode={selectedMode}
                  vocabularyLength={vocabulary.length}
                />
              ))}
            </div>
          </motion.div>

          {/* Challenges Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex items-center mb-6">
              <Zap className="h-6 w-6 text-yellow-400 mr-3" />
              <h3 className="text-2xl font-bold text-white">Challenges & Speed</h3>
            </div>
            <p className="text-white/70 mb-6">
              Test your skills under time pressure and compete with yourself
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getCategoryModes('challenge').map((mode, index) => (
                <ModeCard 
                  key={mode.id} 
                  mode={mode} 
                  index={index + 6} 
                  onSelect={handleModeSelect}
                  isLoading={isLoading}
                  selectedMode={selectedMode}
                  vocabularyLength={vocabulary.length}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Mode Card Component
interface ModeCardProps {
  mode: GameMode;
  index: number;
  onSelect: (modeId: string) => void;
  isLoading: boolean;
  selectedMode: string;
  vocabularyLength: number;
}

function ModeCard({ mode, index, onSelect, isLoading, selectedMode, vocabularyLength }: ModeCardProps) {
  const isSelected = selectedMode === mode.id;
  const isDisabled = isLoading || vocabularyLength === 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.05 * index }}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      whileTap={!isDisabled ? { scale: 0.98 } : {}}
    >
      <button
        onClick={() => onSelect(mode.id)}
        disabled={isDisabled}
        className={`w-full text-left p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden ${
          isDisabled
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:transform hover:-translate-y-1'
        }`}
      >
        <div className={`absolute inset-0 ${mode.color} opacity-90`} />
        
        {/* Loading overlay */}
        {isSelected && isLoading && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        )}
        
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div className="text-white">
              {mode.icon}
            </div>
            {mode.isRecommended && (
              <span className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
                Recommended
              </span>
            )}
          </div>
          
          <h4 className="text-xl font-bold text-white mb-2">
            {mode.name}
          </h4>
          
          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            {mode.description}
          </p>
          
          <div className="flex items-center justify-between text-white/80 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {mode.estimatedTime}
            </div>
            <div className="flex items-center">
              <Play className="h-4 w-4 mr-1" />
              {mode.difficulty}
            </div>
          </div>
        </div>
      </button>
    </motion.div>
  );
}
