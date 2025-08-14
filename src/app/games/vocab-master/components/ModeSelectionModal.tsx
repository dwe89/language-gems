'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Sparkles, Target, Brain } from 'lucide-react';

interface ModeOption {
  id: 'mastery' | 'adventure';
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  features: string[];
}

interface ModeSelectionModalProps {
  onModeSelect: (mode: 'mastery' | 'adventure') => void;
}

const MODE_OPTIONS: ModeOption[] = [
  {
    id: 'mastery',
    name: 'Mastery Mode',
    description: 'Clean, focused learning experience',
    icon: <BookOpen className="h-8 w-8" />,
    color: 'from-blue-500 to-blue-600',
    features: [
      'Distraction-free interface',
      'Academic progress tracking',
      'Clear feedback system',
      'Structured learning path'
    ]
  },
  {
    id: 'adventure',
    name: 'Adventure Mode', 
    description: 'Gamified learning with rewards',
    icon: <Sparkles className="h-8 w-8" />,
    color: 'from-purple-500 to-pink-500',
    features: [
      'Immersive themed experience',
      'Gems and achievements',
      'Adventure storylines',
      'Dynamic visual effects'
    ]
  }
];

export default function ModeSelectionModal({ onModeSelect }: ModeSelectionModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="text-center p-8 pb-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Target className="h-8 w-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-gray-800">Choose Your Learning Style</h2>
            </div>
            <p className="text-gray-600 text-lg">
              Select the experience that matches your learning preferences
            </p>
          </motion.div>
        </div>

        {/* Mode Options */}
        <div className="px-8 pb-8">
          <div className="grid md:grid-cols-2 gap-6">
            {MODE_OPTIONS.map((mode, index) => (
              <motion.button
                key={mode.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onModeSelect(mode.id)}
                className="text-left p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300 group hover:shadow-lg"
              >
                {/* Mode Header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${mode.color} text-white group-hover:scale-110 transition-transform`}>
                    {mode.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900">
                      {mode.name}
                    </h3>
                    <p className="text-gray-600 group-hover:text-gray-700">
                      {mode.description}
                    </p>
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-2">
                  {mode.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Hover Effect */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className={`text-center py-2 px-4 rounded-lg bg-gradient-to-r ${mode.color} text-white text-sm font-medium`}>
                    Select {mode.name}
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 rounded-b-2xl">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Brain className="h-4 w-4" />
            <span>You can change this anytime in settings</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
