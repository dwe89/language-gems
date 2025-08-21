'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Star, 
  ChevronRight, 
  Award,
  Target,
  Brain,
  CheckCircle,
  Circle,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../components/auth/AuthProvider';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';

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

interface TopicProgress {
  topic_id: string;
  lessons_completed: number;
  total_lessons: number;
  quizzes_completed: number;
  total_quizzes: number;
  overall_accuracy: number;
  mastery_level: string;
  completed_at: string | null;
}

const LANGUAGE_INFO = {
  es: { name: 'Spanish', flag: '🇪🇸', color: 'from-red-500 to-yellow-500' },
  fr: { name: 'French', flag: '🇫🇷', color: 'from-blue-500 to-white' },
  de: { name: 'German', flag: '🇩🇪', color: 'from-black to-red-500' }
};

const DIFFICULTY_COLORS = {
  beginner: 'from-green-400 to-green-600',
  intermediate: 'from-yellow-400 to-orange-500',
  advanced: 'from-red-400 to-red-600'
};

const MASTERY_LEVELS = {
  novice: { label: 'Novice', color: 'text-gray-500', icon: Circle },
  beginner: { label: 'Beginner', color: 'text-green-500', icon: CheckCircle },
  intermediate: { label: 'Intermediate', color: 'text-yellow-500', icon: CheckCircle },
  advanced: { label: 'Advanced', color: 'text-orange-500', icon: CheckCircle },
  expert: { label: 'Expert', color: 'text-purple-500', icon: CheckCircle }
};

export default function LanguageGrammarPage() {
  const params = useParams();
  const { user } = useAuth();
  const language = params.language as string;
  
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [progress, setProgress] = useState<TopicProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const languageInfo = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO];

  useEffect(() => {
    if (language) {
      loadLanguageData();
    }
  }, [language, user]);

  const loadLanguageData = async () => {
    try {
      setLoading(true);

      // Load topics for this language
      const topicsResponse = await fetch(`/api/grammar/topics?language=${language}`);
      const topicsData = await topicsResponse.json();
      
      if (topicsData.success) {
        setTopics(topicsData.data);
      }

      // Load user progress if authenticated
      if (user) {
        const progressResponse = await fetch(`/api/grammar/progress?userId=${user.id}&language=${language}`);
        const progressData = await progressResponse.json();
        
        if (progressData.success && progressData.data.length > 0) {
          // Transform the data to match our interface
          const languageStats = progressData.data.find((stat: any) => stat.language === language);
          if (languageStats) {
            // This would need to be enhanced with actual topic-level progress
            setProgress([]);
          }
        }
      }
    } catch (error) {
      console.error('Error loading language data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTopicProgress = (topicId: string) => {
    return progress.find(p => p.topic_id === topicId);
  };

  const getFilteredTopics = () => {
    if (selectedCategory === 'all') {
      return topics;
    }
    return topics.filter(topic => topic.category === selectedCategory);
  };

  const getCategories = () => {
    const categories = [...new Set(topics.map(topic => topic.category))];
    return categories.sort();
  };

  const calculateTopicProgress = (topic: GrammarTopic) => {
    const topicProgress = getTopicProgress(topic.id);
    if (!topicProgress) return 0;
    
    const totalItems = topicProgress.total_lessons + topicProgress.total_quizzes;
    const completedItems = topicProgress.lessons_completed + topicProgress.quizzes_completed;
    
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  };

  if (!languageInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Language Not Found</h1>
          <Link href="/grammar" className="text-purple-300 hover:text-white">
            ← Back to Grammar Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar"
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{languageInfo.flag}</span>
                <div>
                  <h1 className="text-3xl font-bold text-white">{languageInfo.name} Grammar</h1>
                  <p className="text-purple-200">Master {languageInfo.name} grammar concepts</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <GemButton
                variant="gem"
                gemType="rare"
                size="sm"
                onClick={() => window.location.href = `/grammar/${language}/practice`}
              >
                <Target className="w-4 h-4 mr-2" />
                Practice
              </GemButton>
              <GemButton
                variant="gem"
                gemType="epic"
                size="sm"
                onClick={() => window.location.href = `/grammar/${language}/quiz`}
              >
                <Award className="w-4 h-4 mr-2" />
                Quiz
              </GemButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Categories</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              All Topics
            </button>
            {getCategories().map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedCategory === category
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredTopics().map((topic) => {
            const topicProgress = getTopicProgress(topic.id);
            const progressPercentage = calculateTopicProgress(topic);
            const masteryLevel = topicProgress?.mastery_level || 'novice';
            const MasteryIcon = MASTERY_LEVELS[masteryLevel as keyof typeof MASTERY_LEVELS]?.icon || Circle;
            
            return (
              <motion.div
                key={topic.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                onClick={() => window.location.href = `/grammar/${language}/${topic.category}/${topic.slug}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-2">{topic.title}</h3>
                    <p className="text-sm text-purple-200 mb-3">{topic.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                      DIFFICULTY_COLORS[topic.difficulty_level as keyof typeof DIFFICULTY_COLORS]
                    } text-white`}>
                      {topic.difficulty_level}
                    </span>
                  </div>
                </div>

                {/* Learning Objectives */}
                {topic.learning_objectives && topic.learning_objectives.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-purple-200 mb-2">You'll learn:</h4>
                    <ul className="text-xs text-purple-300 space-y-1">
                      {topic.learning_objectives.slice(0, 3).map((objective, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-1 h-1 bg-purple-400 rounded-full" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Progress and Mastery */}
                <div className="space-y-3">
                  {topicProgress && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-purple-200">Progress</span>
                        <span className="text-white font-semibold">{progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MasteryIcon className={`w-4 h-4 ${MASTERY_LEVELS[masteryLevel as keyof typeof MASTERY_LEVELS]?.color}`} />
                      <span className="text-sm text-purple-200">
                        {MASTERY_LEVELS[masteryLevel as keyof typeof MASTERY_LEVELS]?.label || 'Novice'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-purple-300">
                      <Clock className="w-4 h-4" />
                      <span>~15 min</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-purple-200">Curriculum Level</span>
                    <span className="text-white font-semibold">{topic.curriculum_level}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {getFilteredTopics().length === 0 && !loading && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No topics found</h3>
            <p className="text-purple-200">
              {selectedCategory === 'all' 
                ? 'No grammar topics available for this language yet.' 
                : `No topics found in the "${selectedCategory}" category.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
