'use client';

import React, { useState, useEffect } from 'react';
import { GemSpeedBuilder } from './components/GemSpeedBuilder';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Gem, Target, BookOpen, Play, Settings, GraduationCap, Globe, Users, Trophy, Layers } from 'lucide-react';

// Language Selection & Curriculum Integration Component
const LanguageSelectionPage: React.FC<{
  onSelectionComplete: (language: string, curriculumType: string, tier: string, theme: string, topic: string) => void;
}> = ({ onSelectionComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedCurriculumType, setSelectedCurriculumType] = useState<string>('');
  const [selectedTier, setSelectedTier] = useState<string>('');
  const [selectedTheme, setSelectedTheme] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [curriculumData, setCurriculumData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  // Available languages
  const languages = [
    { code: 'spanish', name: 'Spanish', flag: '🇪🇸', description: 'Learn Spanish vocabulary and grammar' },
    { code: 'french', name: 'French', flag: '🇫🇷', description: 'Master French language skills' },
    { code: 'german', name: 'German', flag: '🇩🇪', description: 'Build German language proficiency' },
  ];

  // Curriculum types
  const curriculumTypes = [
    { 
      id: 'ks3', 
      name: 'KS3', 
      description: 'Key Stage 3 (Ages 11-14)', 
      icon: '📚',
      details: 'Foundation language skills and basic vocabulary'
    },
    { 
      id: 'gcse', 
      name: 'KS4 (GCSE)', 
      description: 'Key Stage 4 (Ages 14-16)', 
      icon: '🎓',
      details: 'GCSE-level curriculum with Foundation and Higher tiers'
    },
    { 
      id: 'a-level', 
      name: 'A-Level', 
      description: 'Advanced Level (Ages 16-18)', 
      icon: '🏆',
      details: 'Advanced language study and cultural topics'
    },
    { 
      id: 'topics', 
      name: 'Free Topics', 
      description: 'Choose your own topics', 
      icon: '🎯',
      details: 'Custom topic selection without curriculum constraints'
    }
  ];

  // Use fallback curriculum data for now
  useEffect(() => {
    // For now, use the static curriculum structure
    // Later we can implement the API call to fetch dynamic data
    setCurriculumData(getCurriculumStructure());
    setLoading(false);
  }, []);

  const getCurriculumStructure = () => ({
    ks3: {
      foundation: {
        'Basic Communication': [
          'Greetings and Introductions',
          'Family and Friends', 
          'Numbers and Time',
          'Colors and Descriptions'
        ],
        'Everyday Life': [
          'School Life',
          'Hobbies and Sports',
          'Food and Drink',
          'Weather and Seasons'
        ]
      }
    },
    gcse: {
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
    },
    'a-level': {
      'advanced': {
        'Literature and Arts': [
          'Classical Literature',
          'Modern Poetry',
          'Contemporary Cinema',
          'Visual Arts'
        ],
        'Social Issues': [
          'Immigration and Integration',
          'Political Systems',
          'Economic Challenges',
          'Social Movements'
        ]
      }
    },
    topics: {
      'custom': {
        'Animals and Nature': [
          'Pets and Domestic Animals',
          'Wild Animals',
          'Environment and Conservation',
          'Weather and Climate'
        ],
        'Travel and Culture': [
          'Countries and Cities',
          'Transportation',
          'Cultural Traditions',
          'Food and Cuisine'
        ],
        'Technology and Modern Life': [
          'Social Media',
          'Digital Communication',
          'Innovation and Science',
          'Future Technology'
        ]
      }
    }
  });

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setSelectedCurriculumType('');
    setSelectedTier('');
    setSelectedTheme('');
    setSelectedTopic('');
  };

  const handleCurriculumTypeSelect = (type: string) => {
    setSelectedCurriculumType(type);
    setSelectedTier('');
    setSelectedTheme('');
    setSelectedTopic('');
  };

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

  const getThemesForCurriculumType = () => {
    if (!selectedCurriculumType || !curriculumData[selectedCurriculumType]) return {};
    
    if (selectedCurriculumType === 'gcse') {
      // For GCSE, need tier selection first
      if (!selectedTier) return {};
      return curriculumData[selectedCurriculumType][selectedTier] || {};
    } else {
      // For other curriculum types, get the first (and likely only) tier
      const tiers = Object.keys(curriculumData[selectedCurriculumType]);
      if (tiers.length === 0) return {};
      return curriculumData[selectedCurriculumType][tiers[0]] || {};
    }
  };

  const getTopicsForTheme = () => {
    if (!selectedCurriculumType || !selectedTheme || !curriculumData[selectedCurriculumType]) return [];
    
    if (selectedCurriculumType === 'gcse') {
      if (!selectedTier) return [];
      return curriculumData[selectedCurriculumType][selectedTier]?.[selectedTheme] || [];
    } else {
      const tiers = Object.keys(curriculumData[selectedCurriculumType]);
      if (tiers.length === 0) return [];
      return curriculumData[selectedCurriculumType][tiers[0]]?.[selectedTheme] || [];
    }
  };

  const handleStart = () => {
    if (selectedLanguage && selectedCurriculumType && selectedTheme && selectedTopic) {
      // For GCSE, tier is required; for others, use default tier
      const finalTier = selectedCurriculumType === 'gcse' ? selectedTier : Object.keys(curriculumData[selectedCurriculumType])[0];
      if (selectedCurriculumType === 'gcse' && !selectedTier) return;
      
      onSelectionComplete(selectedLanguage, selectedCurriculumType, finalTier, selectedTheme, selectedTopic);
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
          <p className="text-white text-xl">Loading Language Options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Fixed Background Elements */}
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
              Sentence Sprint
            </h1>
            <p className="text-blue-200">Choose your language and curriculum level</p>
          </div>
          <div className="w-6 h-6" />
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Step 1: Language Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-6 h-6" />
              1. Choose Your Language
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {languages.map((language) => (
                <motion.button
                  key={language.code}
                  onClick={() => handleLanguageSelect(language.code)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl border-2 transition-all ${
                    selectedLanguage === language.code
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-400 text-white'
                      : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  <div className="text-4xl mb-2">{language.flag}</div>
                  <div className="text-xl font-bold mb-1">{language.name}</div>
                  <div className="text-sm opacity-80">{language.description}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Step 2: Curriculum Type Selection */}
          {selectedLanguage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6" />
                2. Choose Your Curriculum Level
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {curriculumTypes.map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => handleCurriculumTypeSelect(type.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedCurriculumType === type.id
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-blue-400 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="text-3xl mb-2">{type.icon}</div>
                    <div className="text-lg font-bold mb-1">{type.name}</div>
                    <div className="text-sm opacity-80 mb-2">{type.description}</div>
                    <div className="text-xs opacity-70">{type.details}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 3: Tier Selection (for GCSE) */}
          {selectedCurriculumType === 'gcse' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Layers className="w-6 h-6" />
                3. Choose Your GCSE Tier
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(curriculumData.gcse || {}).map((tier) => (
                  <motion.button
                    key={tier}
                    onClick={() => handleTierSelect(tier)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-6 rounded-2xl border-2 transition-all ${
                      selectedTier === tier
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 border-amber-400 text-white'
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
            </motion.div>
          )}

          {/* Step 3/4: Theme Selection */}
          {((selectedCurriculumType !== 'gcse' && selectedCurriculumType) || (selectedCurriculumType === 'gcse' && selectedTier)) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6" />
                {selectedCurriculumType === 'gcse' ? '4' : '3'}. Choose Your Theme
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(getThemesForCurriculumType() || {}).map((theme) => (
                  <motion.button
                    key={theme}
                    onClick={() => handleThemeSelect(theme)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedTheme === theme
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 border-indigo-400 text-white'
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    <div className="font-bold text-lg mb-1">{theme}</div>
                    <div className="text-sm opacity-80">
                      {getThemesForCurriculumType()[theme]?.length || 0} topics available
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 4/5: Topic Selection */}
          {selectedTheme && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6" />
                {selectedCurriculumType === 'gcse' ? '5' : '4'}. Choose Your Topic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {getTopicsForTheme().map((topic: string) => (
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
          {selectedLanguage && selectedCurriculumType && ((selectedCurriculumType !== 'gcse') || selectedTier) && selectedTheme && selectedTopic && (
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
                Start Speed Builder
                <Gem className="w-6 h-6" />
              </motion.button>
              <p className="text-blue-200 mt-3 max-w-2xl mx-auto">
                Ready to practice: <span className="font-semibold">{languages.find(l => l.code === selectedLanguage)?.name}</span> • <span className="font-semibold">{curriculumTypes.find(c => c.id === selectedCurriculumType)?.name}</span>{selectedTier && ` • ${selectedTier}`} • <span className="font-semibold">{selectedTheme}</span> • <span className="font-semibold">{selectedTopic}</span>
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
    language: string;
    curriculumType: string;
    tier: string;
    theme: string;
    topic: string;
  } | null>(null);

  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode') as 'assignment' | 'freeplay' || 'freeplay';

  const handleSelectionComplete = (language: string, curriculumType: string, tier: string, theme: string, topic: string) => {
    setGameConfig({ language, curriculumType, tier, theme, topic });
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

  return <LanguageSelectionPage onSelectionComplete={handleSelectionComplete} />;
} 