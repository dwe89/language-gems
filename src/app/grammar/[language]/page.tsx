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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/grammar"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <div className="text-5xl">{languageInfo.flag}</div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{languageInfo.name} Grammar</h1>
                  <p className="text-gray-600 text-lg">Master {languageInfo.name} grammar concepts step by step</p>
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

      <div className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Grammar Topics</h2>
            <p className="text-gray-600 text-lg">Choose a category to filter topics</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === 'all'
                  ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
              }`}
            >
              All Topics
            </button>
            {getCategories().map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-200 capitalize ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm'
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
              <GemCard
                key={topic.id}
                title={topic.title}
                subtitle={topic.description}
                icon={<BookOpen className="w-6 h-6 text-white" />}
                gemType={progressPercentage > 80 ? "legendary" : progressPercentage > 60 ? "epic" : progressPercentage > 40 ? "rare" : progressPercentage > 20 ? "uncommon" : "common"}
                onClick={() => window.location.href = `/grammar/${language}/${topic.category}/${topic.slug}`}
                className="h-full hover:shadow-xl transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${
                      DIFFICULTY_COLORS[topic.difficulty_level as keyof typeof DIFFICULTY_COLORS]
                    } text-white`}>
                      {topic.difficulty_level}
                    </span>
                    <div className="flex items-center space-x-1">
                      <MasteryIcon className="w-4 h-4 text-gray-500" />
                      <span className="text-xs text-gray-500 capitalize">{masteryLevel}</span>
                    </div>
                  </div>

                  {/* Learning Objectives */}
                  {topic.learning_objectives && topic.learning_objectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">You'll learn:</h4>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {topic.learning_objectives.slice(0, 3).map((objective, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-1 h-1 bg-purple-500 rounded-full" />
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
                          <span className="text-gray-600">Progress</span>
                          <span className="text-gray-800 font-semibold">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>~15 min</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {topic.curriculum_level}
                      </div>
                    </div>
                  </div>
                </div>
              </GemCard>
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
