'use client';

import React, { useState, useEffect } from 'react';
import { GemSpeedBuilder } from './components/GemSpeedBuilder';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gem, Target, BookOpen, Play, Settings, GraduationCap } from 'lucide-react';

// GCSE Curriculum Integration Component
const GCSECurriculumSelector: React.FC<{
  onSelectionComplete: (tier: string, theme: string, topic: string) => void;
}> = ({ onSelectionComplete }) => {
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [curriculumData, setCurriculumData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Fetch real curriculum data from MCP Supabase
  useEffect(() => {
    const fetchCurriculumData = async () => {
      try {
        // Fetch from vocabulary system
        const response = await fetch('/api/curriculum/vocabulary', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurriculumData(data);
        } else {
          // Fallback to structured GCSE curriculum
          setCurriculumData(getGCSECurriculumStructure());
        }
      } catch (error) {
        console.error('Error fetching curriculum:', error);
        setCurriculumData(getGCSECurriculumStructure());
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculumData();
  }, []);

  const getGCSECurriculumStructure = () => ({
    Foundation: {
      'Identity and Culture': [
        'Family and Friends',
        'Personal Relationships', 
        'Marriage and Partnership',
        'Social Media and Technology',
        'Festivals and Traditions'
      ],
      'Local Area, Holiday and Travel': [
        'Tourist Information and Directions',
        'Weather',
        'Transport',
        'Accommodation',
        'Holiday Activities and Experiences'
      ],
      'School': [
        'School Types and School System',
        'School Subjects',
        'School Day and Routine',
        'Rules and Regulations',
        'Problems at School'
      ],
      'Future Aspirations, Study and Work': [
        'Further Education and Training',
        'Career Choices and Ambitions',
        'Jobs and Employment',
        'Volunteering and Work Experience'
      ],
      'International and Global Dimension': [
        'Environmental Issues',
        'Poverty and Homelessness',
        'Healthy Living',
        'Life in Other Countries'
      ]
    },
    Higher: {
      'Identity and Culture': [
        'Regional Identity',
        'National Identity', 
        'International Identity',
        'Cultural Life',
        'Multiculturalism',
        'Equality and Discrimination'
      ],
      'Local Area, Holiday and Travel': [
        'Advantages and Disadvantages of Tourism',
        'Holiday Disasters',
        'Travel and Tourist Information',
        'Town or Region',
        'Natural and Built Environment'
      ],
      'School': [
        'Achievement and Underachievement',
        'Getting the Best from School',
        'Primary vs Secondary Education',
        'Specialist Schools',
        'Extra-curricular Activities'
      ],
      'Future Aspirations, Study and Work': [
        'Communication Technology',
        'Part-time Jobs',
        'Studying and Working Abroad',
        'Skills and Personal Qualities',
        'Unemployment',
        'Enterprise and Entrepreneurship'
      ],
      'International and Global Dimension': [
        'Current Social Issues',
        'Global Problems',
        'Environmental Problems',
        'Solutions to Environmental Problems',
        'Contributing to Society'
      ]
    }
  });

  const handleTierSelect = (tier: string) => {
    setSelectedTier(tier);
    setSelectedTheme('');
    setSelectedTopic('');
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setSelectedTopic('');
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
  };

  const handleStart = () => {
    if (selectedTier && selectedTheme && selectedTopic) {
      onSelectionComplete(selectedTier, selectedTheme, selectedTopic);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-6xl mb-4"
          >
            💎
          </motion.div>
          <p className="text-white text-xl">Loading GCSE Curriculum...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Fixed Background Elements - Deterministic positions */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 10, top: 20 }, { left: 85, top: 15 }, { left: 45, top: 35 },
          { left: 20, top: 70 }, { left: 90, top: 60 }, { left: 60, top: 80 },
          { left: 15, top: 45 }, { left: 75, top: 25 }, { left: 35, top: 90 },
          { left: 95, top: 40 }, { left: 25, top: 10 }, { left: 70, top: 75 }
        ].map((pos, i) => (
          <motion.div
            key={i}
            animate={{
              y: [0, -10, 0],
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.05, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 3 + (i % 3),
              delay: i * 0.2,
            }}
            className="absolute w-4 h-4 bg-gradient-to-br from-purple-400 to-pink-400 rounded transform rotate-45 opacity-20"
            style={{
              left: `${pos.left}%`,
              top: `${pos.top}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/games" className="text-white/80 hover:text-white transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              GCSE Spanish Speed Builder
            </h1>
            <p className="text-blue-200">Select your curriculum level and topic</p>
          </div>
          <div className="w-6 h-6" />
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Step 1: Tier Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              1. Choose Your GCSE Tier
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(curriculumData).map((tier) => (
                <motion.button
                  key={tier}
                  onClick={() => handleTierSelect(tier)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedTier === tier
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="text-xl font-bold mb-2">{tier} Tier</div>
                  <div className="text-sm opacity-80">
                    {tier === 'Foundation' 
                      ? 'Grades 1-5: Core vocabulary and essential topics'
                      : 'Grades 4-9: Advanced vocabulary and complex topics'
                    }
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Step 2: Theme Selection */}
          {selectedTier && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                2. Choose Your Theme
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(curriculumData[selectedTier] || {}).map((theme) => (
                  <motion.button
                    key={theme}
                    onClick={() => handleThemeSelect(theme)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTheme === theme
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">{theme}</div>
                    <div className="text-sm opacity-80">
                      {curriculumData[selectedTier][theme]?.length || 0} topics available
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Topic Selection */}
          {selectedTheme && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                3. Choose Your Topic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(curriculumData[selectedTier]?.[selectedTheme] || []).map((topic: string) => (
                  <motion.button
                    key={topic}
                    onClick={() => handleTopicSelect(topic)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      selectedTopic === topic
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 border-emerald-400 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="font-semibold">{topic}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          {selectedTier && selectedTheme && selectedTopic && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <motion.button
                onClick={handleStart}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-8 py-4 rounded-xl font-bold text-xl flex items-center gap-3 mx-auto shadow-lg"
              >
                <Play className="w-6 h-6" />
                Start Gem Speed Builder
                <Gem className="w-6 h-6" />
              </motion.button>
              <p className="text-blue-200 mt-3">
                Ready to practice: {selectedTier} • {selectedTheme} • {selectedTopic}
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
  const [showGame, setShowGame] = useState(false);
  const [gameConfig, setGameConfig] = useState<{
    tier: string;
    theme: string;
    topic: string;
  } | null>(null);

  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode') as 'assignment' | 'freeplay' || 'freeplay';

  const handleSelectionComplete = (tier: string, theme: string, topic: string) => {
    setGameConfig({ tier, theme, topic });
    setShowGame(true);
  };

  if (assignmentId) {
    // Assignment mode - go straight to game
    return <GemSpeedBuilder assignmentId={assignmentId} mode="assignment" />;
  }

  if (showGame && gameConfig) {
    return (
      <GemSpeedBuilder
        mode="freeplay"
        theme={gameConfig.theme}
        topic={gameConfig.topic}
        tier={gameConfig.tier}
      />
    );
  }

  return <GCSECurriculumSelector onSelectionComplete={handleSelectionComplete} />;
} 