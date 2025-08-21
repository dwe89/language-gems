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
  ArrowLeft,
  Users,
  Flag
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import { GemCard, GemButton } from '../../../../components/ui/GemTheme';
import ReactCountryFlag from 'react-country-flag';

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

const LANGUAGE_INFO = {
  es: { name: 'Spanish', countryCode: 'ES', color: 'from-red-500 to-yellow-500' },
  fr: { name: 'French', countryCode: 'FR', color: 'from-blue-500 to-white' },
  de: { name: 'German', countryCode: 'DE', color: 'from-black to-red-500' }
};

const CATEGORY_INFO = {
  verbs: { name: 'Verbs', icon: Target, description: 'Master verb conjugations, tenses, and forms' },
  nouns: { name: 'Nouns', icon: BookOpen, description: 'Learn about gender, articles, and plurals' },
  adjectives: { name: 'Adjectives', icon: Star, description: 'Understand agreement, comparison, and position' },
  syntax: { name: 'Syntax', icon: ChevronRight, description: 'Master sentence structure and word order' },
  pronouns: { name: 'Pronouns', icon: Users, description: 'Learn personal, possessive, and relative pronouns' },
  prepositions: { name: 'Prepositions', icon: Flag, description: 'Understand spatial and temporal relationships' }
};

const DIFFICULTY_COLORS = {
  beginner: 'from-green-400 to-green-600',
  intermediate: 'from-yellow-400 to-orange-500',
  advanced: 'from-red-400 to-red-600'
};

export default function GrammarCategoryPage() {
  const params = useParams();
  const { user } = useAuth();
  const language = params.language as string;
  const category = params.category as string;
  
  const [topics, setTopics] = useState<GrammarTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const languageInfo = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO];
  const categoryInfo = CATEGORY_INFO[category as keyof typeof CATEGORY_INFO];

  useEffect(() => {
    if (language && category) {
      loadCategoryTopics();
    }
  }, [language, category, selectedDifficulty]);

  const loadCategoryTopics = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        language,
        category
      });
      
      if (selectedDifficulty !== 'all') {
        params.append('difficulty', selectedDifficulty);
      }

      const response = await fetch(`/api/grammar/topics?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setTopics(data.data);
      }
    } catch (error) {
      console.error('Error loading category topics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredTopics = () => {
    if (selectedDifficulty === 'all') {
      return topics;
    }
    return topics.filter(topic => topic.difficulty_level === selectedDifficulty);
  };

  const getDifficultyLevels = () => {
    const levels = [...new Set(topics.map(topic => topic.difficulty_level))];
    return levels.sort((a, b) => {
      const order = ['beginner', 'intermediate', 'advanced'];
      return order.indexOf(a) - order.indexOf(b);
    });
  };

  if (!languageInfo || !categoryInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Page Not Found</h1>
          <Link href="/grammar" className="text-purple-300 hover:text-white">
            ← Back to Grammar Hub
          </Link>
        </div>
      </div>
    );
  }

  const CategoryIcon = categoryInfo.icon;
  const filteredTopics = getFilteredTopics();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/grammar/${language}`}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="flex items-center space-x-3">
                <ReactCountryFlag 
                  countryCode={languageInfo.countryCode} 
                  svg 
                  style={{ width: '2em', height: '2em' }}
                />
                <CategoryIcon className="w-8 h-8 text-white" />
                <div>
                  <h1 className="text-3xl font-bold text-white">
                    {languageInfo.name} {categoryInfo.name}
                  </h1>
                  <p className="text-purple-200">{categoryInfo.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <GemButton
                variant="gem"
                gemType="rare"
                size="sm"
                onClick={() => window.location.href = `/grammar/${language}/${category}/practice`}
              >
                <Target className="w-4 h-4 mr-2" />
                Practice All
              </GemButton>
              <GemButton
                variant="gem"
                gemType="epic"
                size="sm"
                onClick={() => window.location.href = `/grammar/${language}/${category}/quiz`}
              >
                <Award className="w-4 h-4 mr-2" />
                Category Quiz
              </GemButton>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Difficulty Filter */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Difficulty Level</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedDifficulty('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedDifficulty === 'all'
                  ? 'bg-purple-500 text-white'
                  : 'bg-white/10 text-purple-200 hover:bg-white/20'
              }`}
            >
              All Levels
            </button>
            {getDifficultyLevels().map((level) => (
              <button
                key={level}
                onClick={() => setSelectedDifficulty(level)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                  selectedDifficulty === level
                    ? 'bg-purple-500 text-white'
                    : 'bg-white/10 text-purple-200 hover:bg-white/20'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic) => (
            <motion.div
              key={topic.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all duration-300 cursor-pointer"
              onClick={() => window.location.href = `/grammar/${language}/${category}/${topic.slug}`}
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

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-purple-300">
                  <Clock className="w-4 h-4" />
                  <span>~15 min</span>
                </div>
                <div className="text-sm text-purple-200">
                  {topic.curriculum_level}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredTopics.length === 0 && !loading && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No topics found</h3>
            <p className="text-purple-200">
              {selectedDifficulty === 'all' 
                ? `No ${categoryInfo.name.toLowerCase()} topics available yet.` 
                : `No ${selectedDifficulty} level topics found.`
              }
            </p>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 animate-pulse">
                <div className="h-6 bg-white/20 rounded mb-3"></div>
                <div className="h-4 bg-white/20 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/20 rounded"></div>
                  <div className="h-3 bg-white/20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
