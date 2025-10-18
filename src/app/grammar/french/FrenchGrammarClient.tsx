'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Clock, ChevronRight, Star, Award, BookOpen, Users, ChevronDown, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';

// Interfaces for discovered topics and categories
interface DiscoveredTopic {
  name: string;
  slug: string;
  category: string;
  path: string;
  hasContent: boolean;
}

interface GrammarCategory {
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  topics: DiscoveredTopic[];
  isExpanded: boolean;
}

// Category configuration
const CATEGORY_CONFIG = {
  'adjectives': {
    name: 'Adjectives',
    description: 'Understand adjective agreement and placement',
    icon: Star,
    color: 'from-purple-500 to-purple-600'
  },
  'adverbs': {
    name: 'Adverbs',
    description: 'Master adverb formation, placement, and usage',
    icon: Clock,
    color: 'from-teal-500 to-teal-600'
  },
  'conjunctions': {
    name: 'Conjunctions',
    description: 'Master coordinating and subordinating conjunctions',
    icon: BookOpen,
    color: 'from-pink-500 to-pink-600'
  },
  'expressions': {
    name: 'Expressions',
    description: 'Learn common French expressions and phrases',
    icon: Award,
    color: 'from-rose-500 to-rose-600'
  },
  'nouns': {
    name: 'Nouns & Articles',
    description: 'Learn gender, articles, and noun agreement rules',
    icon: BookOpen,
    color: 'from-green-500 to-green-600'
  },
  'numbers': {
    name: 'Numbers & Time',
    description: 'Learn numbers, dates, and time expressions',
    icon: Star,
    color: 'from-cyan-500 to-cyan-600'
  },
  'prepositions': {
    name: 'Prepositions',
    description: 'Learn French prepositions and their usage',
    icon: Target,
    color: 'from-indigo-500 to-indigo-600'
  },
  'pronouns': {
    name: 'Pronouns',
    description: 'Master subject, object, and relative pronouns',
    icon: Users,
    color: 'from-orange-500 to-orange-600'
  },
  'syntax': {
    name: 'Syntax & Structure',
    description: 'Master French sentence structure and word order',
    icon: Award,
    color: 'from-emerald-500 to-emerald-600'
  },
  'verbs': {
    name: 'Verbs',
    description: 'Master French verb conjugations, tenses, and moods',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    hasSubcategories: true
  }
};

export default function FrenchGrammarClient() {
  const [categories, setCategories] = useState<GrammarCategory[]>([]);
  const [practiceReadyTopics, setPracticeReadyTopics] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load grammar structure and practice status
  useEffect(() => {
    const loadGrammarStructure = async () => {
      try {
        setLoading(true);

        // Fetch content-ready topics from database FIRST
        const contentResponse = await fetch('/api/grammar/practice-status?language=french');
        const contentData = await contentResponse.json();

        let practiceReadySet = new Set<string>();
        if (contentData.success) {
          practiceReadySet = new Set(contentData.data || []);
          setPracticeReadyTopics(practiceReadySet);
        }

        // Fetch topics directly from database
        const topicsResponse = await fetch('/api/grammar/topics?language=fr');
        const topicsData = await topicsResponse.json();

        if (!topicsData.success) {
          throw new Error('Failed to load grammar topics');
        }

        // Organize topics by category
        const categoryMap: { [key: string]: GrammarCategory } = {};

        topicsData.data.forEach((topic: any) => {
          const categoryKey = topic.category;
          const categoryConfig = CATEGORY_CONFIG[categoryKey as keyof typeof CATEGORY_CONFIG];

          if (!categoryConfig) {
            console.warn(`No configuration found for category: ${categoryKey}`);
            return;
          }

          if (!categoryMap[categoryKey]) {
            categoryMap[categoryKey] = {
              ...categoryConfig,
              topics: [],
              isExpanded: false
            };
          }

          // Convert database topic to DiscoveredTopic format
          const hasContent = practiceReadySet.has(topic.slug);
          const discoveredTopic: DiscoveredTopic = {
            name: topic.title || topic.topic_name,
            slug: topic.slug,
            category: topic.category,
            path: `${topic.category}/${topic.slug}`,
            hasContent: hasContent
          };

          categoryMap[categoryKey].topics.push(discoveredTopic);
        });

        // Convert to array and sort
        const categoriesArray = Object.values(categoryMap).sort((a, b) => a.name.localeCompare(b.name));
        setCategories(categoriesArray);

      } catch (err) {
        console.error('Error loading grammar structure:', err);
        setError(err instanceof Error ? err.message : 'Failed to load grammar structure');
      } finally {
        setLoading(false);
      }
    };

    loadGrammarStructure();
  }, []);

  const toggleCategory = (categoryIndex: number) => {
    setCategories(prev => prev.map((cat, index) =>
      index === categoryIndex ? { ...cat, isExpanded: !cat.isExpanded } : cat
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading French grammar topics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error Loading Grammar Topics</h2>
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center mb-6">
          <FlagIcon countryCode="FR" size="lg" className="mr-4" />
          <h1 className="text-4xl font-bold text-gray-900">French Grammar</h1>
        </div>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master French grammar with comprehensive guides covering all essential topics.
          Explore {categories.reduce((total, cat) => total + cat.topics.length, 0)} grammar topics
          organized into {categories.length} categories.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="space-y-6">
        {categories.map((category, categoryIndex) => (
          <GemCard key={category.name} className="overflow-hidden">
            {/* Category Header */}
            <div
              className={`bg-gradient-to-r ${category.color} p-6 cursor-pointer transition-all duration-200 hover:shadow-lg`}
              onClick={() => toggleCategory(categoryIndex)}
            >
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-4">
                  <category.icon className="h-8 w-8" />
                  <div>
                    <h2 className="text-2xl font-bold">{category.name}</h2>
                    <p className="text-white/90 mt-1">{category.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-sm text-white/90">Topics</div>
                    <div className="text-xl font-bold">{category.topics.length}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-white/90">Content Ready</div>
                    <div className="text-xl font-bold">
                      {category.topics.filter(t => t.hasContent).length}
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-6 w-6 transition-transform duration-200 ${
                      category.isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Topics List */}
            {category.isExpanded && (
              <div className="p-6 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.topics.map((topic) => (
                    <div key={topic.slug} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-gray-900 flex-1">{topic.name}</h3>
                        <div className="flex items-center space-x-2 ml-2">
                          {topic.hasContent && (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 mt-3">
                        <Link
                          href={`/grammar/french/${topic.path}`}
                          className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center"
                        >
                          Learn
                        </Link>

                        {topic.hasContent && (
                          <Link
                            href={`/grammar/french/${topic.path}/challenge`}
                            className="flex-1 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-700 px-3 py-2 rounded-md text-sm font-medium transition-colors text-center flex items-center justify-center"
                          >
                            <Award className="h-3 w-3 mr-1" />
                            Challenge
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </GemCard>
        ))}
      </div>
    </div>
  );
}
