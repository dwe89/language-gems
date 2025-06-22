'use client';

import React, { useState, useEffect } from 'react';
import { GemSpeedBuilder } from './components/GemSpeedBuilder';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gem, Target, BookOpen, Play, Settings } from 'lucide-react';

// Theme and Topic Selection Component
const ThemeTopicSelector: React.FC<{
  onSelectionComplete: (theme: string, topic: string) => void;
}> = ({ onSelectionComplete }) => {
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');

  const themes = [
    { id: 'Animals', name: 'Animals', icon: '🐾', description: 'Learn about pets, farm animals, and wildlife' },
    { id: 'Travel', name: 'Travel', icon: '✈️', description: 'Explore vacation, transportation, and destinations' },
    { id: 'Food', name: 'Food & Dining', icon: '🍽️', description: 'Discover meals, restaurants, and cooking' },
    { id: 'Family', name: 'Family & Friends', icon: '👨‍👩‍👧‍👦', description: 'Talk about relationships and people' },
    { id: 'School', name: 'School & Education', icon: '🎓', description: 'Academic life and learning vocabulary' },
    { id: 'Home', name: 'Home & Daily Life', icon: '🏠', description: 'Household items and daily routines' }
  ];

  const topics = [
    { id: 'Basic Conversation', name: 'Basic Conversation', description: 'Essential everyday phrases' },
    { id: 'Descriptions', name: 'Descriptions', description: 'Describing people, places, and things' },
    { id: 'Actions', name: 'Actions & Activities', description: 'Verbs and movement words' },
    { id: 'Time', name: 'Time & Schedules', description: 'Days, months, and time expressions' },
    { id: 'Shopping', name: 'Shopping', description: 'Buying and selling vocabulary' },
    { id: 'Health', name: 'Health & Body', description: 'Body parts and wellness terms' }
  ];

  const canStart = selectedTheme && selectedTopic;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -20, 0],
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 4 + (i % 3),
              delay: i * 0.3,
            }}
            className="absolute w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded transform rotate-45 opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/games" className="text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-3">
              <Gem className="w-10 h-10 text-yellow-400" />
              Speed Builder Setup
            </h1>
            <p className="text-white/70 mt-2">Choose your vocabulary adventure</p>
          </div>
          <div className="w-6"></div>
        </div>

        {/* Theme Selection */}
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-3 text-purple-400" />
              Select Your Theme
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {themes.map((theme) => (
                <motion.button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme.id)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    selectedTheme === theme.id
                      ? 'border-purple-400 bg-purple-500/20 shadow-lg shadow-purple-500/30'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-4xl">{theme.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{theme.name}</h3>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{theme.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Topic Selection */}
          {selectedTheme && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <BookOpen className="w-6 h-6 mr-3 text-blue-400" />
                Select Your Topic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {topics.map((topic) => (
                  <motion.button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 transition-all text-left ${
                      selectedTopic === topic.id
                        ? 'border-blue-400 bg-blue-500/20 shadow-lg shadow-blue-500/30'
                        : 'border-white/20 bg-white/5 hover:border-white/40'
                    }`}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">{topic.name}</h3>
                    <p className="text-white/70 text-sm">{topic.description}</p>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          {canStart && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-center"
            >
              <motion.button
                onClick={() => onSelectionComplete(selectedTheme, selectedTopic)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-purple-500/50 transition-all duration-300 border border-white/20"
              >
                <Play className="inline w-6 h-6 mr-3" />
                Start Gem Speed Builder
              </motion.button>
              <p className="text-white/60 mt-4">
                Selected: <span className="text-purple-300">{themes.find(t => t.id === selectedTheme)?.name}</span> × <span className="text-blue-300">{topics.find(t => t.id === selectedTopic)?.name}</span>
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Speed Builder Page
export default function SpeedBuilderPage() {
  const searchParams = useSearchParams();
  const [gameState, setGameState] = useState<'selection' | 'playing'>('selection');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  
  // Check if we're in assignment mode or have preset theme/topic
  const assignmentId = searchParams.get('assignmentId');
  const presetTheme = searchParams.get('theme');
  const presetTopic = searchParams.get('topic');
  const mode = assignmentId ? 'assignment' : 'freeplay';

  useEffect(() => {
    // If we have preset theme/topic (from assignment), skip selection
    if (presetTheme && presetTopic) {
      setSelectedTheme(presetTheme);
      setSelectedTopic(presetTopic);
      setGameState('playing');
    }
  }, [presetTheme, presetTopic]);

  const handleSelectionComplete = (theme: string, topic: string) => {
    setSelectedTheme(theme);
    setSelectedTopic(topic);
    setGameState('playing');
  };

  const handleGameComplete = (stats: any) => {
    console.log('Game completed with stats:', stats);
    // Could redirect back to dashboard or show completion screen
  };

  if (gameState === 'selection') {
    return <ThemeTopicSelector onSelectionComplete={handleSelectionComplete} />;
  }

  return (
    <GemSpeedBuilder
      assignmentId={assignmentId || undefined}
      mode={mode}
      theme={selectedTheme}
      topic={selectedTopic}
      onGameComplete={handleGameComplete}
    />
  );
} 