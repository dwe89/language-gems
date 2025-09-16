'use client';

import React, { useState, useEffect } from 'react';
import FlagIcon from '../../components/ui/FlagIcon';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Brain,
  Target,
  Award,
  ChevronRight,
  Clock,
  Users,
  Gem,
  Star,
  TrendingUp,
  Flag
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../components/auth/AuthProvider';
import { GemCard, GemButton } from '../../components/ui/GemTheme';


interface GrammarTopic {
  id: string;
  topic_name: string;
  slug: string;
  language: string;
  category: string;
  difficulty_level: string;
  curriculum_level: string;
  title: string;
  description: string;
  learning_objectives: string[];
  order_position: number;
}

interface LanguageStats {
  language: string;
  topics_started: number;
  topics_completed: number;
  total_topics: number;
  overall_accuracy: number;
  total_time_spent: number;
  mastery_distribution: {
    novice: number;
    beginner: number;
    intermediate: number;
    advanced: number;
    expert: number;
  };
}

const LANGUAGES = [
  { code: 'es', name: 'Spanish', countryCode: 'ES', color: 'from-red-500 to-yellow-500' },
  { code: 'fr', name: 'French', countryCode: 'FR', color: 'from-blue-500 to-white' },
  { code: 'de', name: 'German', countryCode: 'DE', color: 'from-black to-red-500' }
];

const CATEGORIES = [
  { id: 'verbs', name: 'Verbs', icon: Target, description: 'Conjugations, tenses, and verb forms' },
  { id: 'nouns', name: 'Nouns', icon: BookOpen, description: 'Gender, articles, and plurals' },
  { id: 'adjectives', name: 'Adjectives', icon: Star, description: 'Agreement, comparison, and position' },
  { id: 'syntax', name: 'Syntax', icon: ChevronRight, description: 'Sentence structure and word order' },
  { id: 'pronouns', name: 'Pronouns', icon: Users, description: 'Personal, possessive, and relative pronouns' },
  { id: 'prepositions', name: 'Prepositions', icon: Flag, description: 'Spatial and temporal relationships' }
];

export default function GrammarHubPage() {
  const { user, isLoading } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [stats, setStats] = useState<LanguageStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrammarData();
  }, [selectedLanguage, user]);

  const loadGrammarData = async () => {
    try {
      setLoading(true);

      // Load topics for selected language
      const topicsResponse = await fetch(`/api/grammar/topics?language=${selectedLanguage}`);
      const topicsData = await topicsResponse.json();
      
      if (topicsData.success) {
        setTopics(topicsData.data);
      }

      // Load user progress if authenticated
      if (user) {
        const progressResponse = await fetch(`/api/grammar/progress?userId=${user.id}`);
        const progressData = await progressResponse.json();
        
        if (progressData.success) {
          setStats(progressData.data);
        }
      }
    } catch (error) {
      console.error('Error loading grammar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLanguageStats = (languageCode: string) => {
    return stats.find(s => s.language === languageCode);
  };

  const getTopicsByCategory = (category: string) => {
    return topics.filter(topic => topic.category === category);
  };

  const calculateProgress = (languageCode: string) => {
    const langStats = getLanguageStats(languageCode);
    if (!langStats || langStats.total_topics === 0) return 0;
    return Math.round((langStats.topics_completed / langStats.total_topics) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Grammar Hub</h1>
                <p className="text-purple-200">Master grammar concepts with interactive lessons</p>
              </div>
            </div>
            
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-purple-200">Welcome back,</p>
                  <p className="font-semibold text-white">{user.email?.split('@')[0]}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center">
                  <Gem className="w-5 h-5 text-white" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Language Selection */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Choose Your Language</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {LANGUAGES.map((language) => {
              const progress = calculateProgress(language.code);
              const langStats = getLanguageStats(language.code);
              
              return (
                <motion.div
                  key={language.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedLanguage(language.code)}
                  className={`
                    p-6 rounded-xl border-2 cursor-pointer transition-all duration-300
                    ${selectedLanguage === language.code 
                      ? 'border-purple-400 bg-purple-500/20' 
                      : 'border-white/20 bg-white/10 hover:border-white/40'
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <FlagIcon
                        countryCode={language.countryCode}
                        size="md"
                      />
                      <div>
                        <h3 className="text-xl font-bold text-white">{language.name}</h3>
                        <p className="text-sm text-purple-200">
                          {langStats ? `${langStats.total_topics} topics available` : 'Loading...'}
                        </p>
                      </div>
                    </div>
                    {selectedLanguage === language.code && (
                      <div className="w-6 h-6 bg-purple-400 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                  
                  {langStats && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-purple-200">Progress</span>
                        <span className="text-white font-semibold">{progress}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-purple-200">
                        <span>{langStats.topics_completed} completed</span>
                        <span>{Math.round(langStats.overall_accuracy)}% accuracy</span>
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Grammar Categories */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Grammar Categories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((category) => {
              const categoryTopics = getTopicsByCategory(category.id);
              const completedTopics = categoryTopics.filter(topic => {
                // This would need to be enhanced with actual progress data
                return false; // Placeholder
              }).length;
              
              return (
                <GemCard
                  key={category.id}
                  title={category.name}
                  subtitle={category.description}
                  icon={<category.icon className="w-6 h-6" />}
                  gemType="common"
                  onClick={() => {
                    // Navigate to category page
                    window.location.href = `/grammar/${selectedLanguage}/${category.id}`;
                  }}
                  className="h-full"
                >
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Topics</span>
                      <span className="font-semibold">{categoryTopics.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Completed</span>
                      <span className="font-semibold text-green-600">{completedTopics}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-purple-600">
                      <Clock className="w-4 h-4" />
                      <span>~{categoryTopics.length * 15} min</span>
                    </div>
                  </div>
                </GemCard>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GemButton
            variant="gem"
            gemType="rare"
            className="p-6 h-auto flex-col space-y-2"
            onClick={() => window.location.href = `/grammar/${selectedLanguage}/practice`}
          >
            <Target className="w-8 h-8" />
            <span className="font-semibold">Practice Mode</span>
            <span className="text-sm opacity-90">Mixed exercises</span>
          </GemButton>
          
          <GemButton
            variant="gem"
            gemType="epic"
            className="p-6 h-auto flex-col space-y-2"
            onClick={() => window.location.href = `/grammar/${selectedLanguage}/quiz`}
          >
            <Award className="w-8 h-8" />
            <span className="font-semibold">Grammar Quiz</span>
            <span className="text-sm opacity-90">Test your knowledge</span>
          </GemButton>
          
          <GemButton
            variant="gem"
            gemType="uncommon"
            className="p-6 h-auto flex-col space-y-2"
            onClick={() => window.location.href = `/student-dashboard/grammar/analytics`}
          >
            <TrendingUp className="w-8 h-8" />
            <span className="font-semibold">Progress</span>
            <span className="text-sm opacity-90">View analytics</span>
          </GemButton>
          
          <GemButton
            variant="gem"
            gemType="legendary"
            className="p-6 h-auto flex-col space-y-2"
            onClick={() => window.location.href = `/grammar/${selectedLanguage}/lessons`}
          >
            <BookOpen className="w-8 h-8" />
            <span className="font-semibold">All Lessons</span>
            <span className="text-sm opacity-90">Browse content</span>
          </GemButton>
        </div>
      </div>
    </div>
  );
}
