'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Clock, ChevronRight, Star, Award } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../components/ui/GemTheme';
import FlagIcon from '../../../../components/ui/FlagIcon';

const verbTopics = [
  {
    name: 'Present Tense',
    slug: 'present-tense',
    description: 'Learn regular and irregular present tense conjugations',
    difficulty: 'beginner',
    time: '15 min',
    featured: true,
    concepts: ['Regular -ar verbs', 'Regular -er verbs', 'Regular -ir verbs', 'Common irregular verbs']
  },
  {
    name: 'Past Tense (Preterite)',
    slug: 'preterite',
    description: 'Master the preterite tense for completed past actions',
    difficulty: 'intermediate',
    time: '20 min',
    featured: true,
    concepts: ['Regular preterite', 'Irregular preterite', 'Spelling changes', 'Usage rules']
  },
  {
    name: 'Imperfect Tense',
    slug: 'imperfect',
    description: 'Understand ongoing past actions and descriptions',
    difficulty: 'intermediate',
    time: '18 min',
    featured: false,
    concepts: ['Regular imperfect', 'Irregular imperfect', 'Preterite vs imperfect', 'Time expressions']
  },
  {
    name: 'Future Tense',
    slug: 'future',
    description: 'Express future actions and intentions',
    difficulty: 'intermediate',
    time: '15 min',
    featured: false,
    concepts: ['Regular future', 'Irregular future', 'Future of probability', 'Alternative futures']
  },
  {
    name: 'Conditional Tense',
    slug: 'conditional',
    description: 'Learn hypothetical and polite expressions',
    difficulty: 'advanced',
    time: '20 min',
    featured: false,
    concepts: ['Regular conditional', 'Irregular conditional', 'Polite requests', 'Hypothetical situations']
  },
  {
    name: 'Subjunctive Mood',
    slug: 'subjunctive',
    description: 'Master the subjunctive for emotions and doubt',
    difficulty: 'advanced',
    time: '25 min',
    featured: true,
    concepts: ['Present subjunctive', 'Triggers', 'Irregular forms', 'Usage patterns']
  },
  {
    name: 'Irregular Verbs',
    slug: 'irregular-verbs',
    description: 'Common irregular verbs and their patterns',
    difficulty: 'intermediate',
    time: '22 min',
    featured: false,
    concepts: ['Stem-changing verbs', 'Completely irregular', 'Patterns and groups', 'Memory techniques']
  },
  {
    name: 'Ser vs Estar',
    slug: 'ser-vs-estar',
    description: 'Master the two forms of "to be" in Spanish',
    difficulty: 'beginner',
    time: '12 min',
    featured: true,
    concepts: ['Permanent vs temporary', 'Location vs characteristics', 'Common expressions', 'Practice exercises']
  }
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  advanced: 'bg-red-100 text-red-700 border-red-200'
};

export function SpanishVerbsClient() {
  const featuredTopics = verbTopics.filter(topic => topic.featured);
  const otherTopics = verbTopics.filter(topic => !topic.featured);

  console.log('🏗️ [SPANISH VERBS] Client component loaded with topics:', verbTopics.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar/spanish"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <FlagIcon countryCode="ES" size="xl" />
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Spanish Verbs</h1>
                  <p className="text-gray-600 text-lg">Master Spanish verb conjugations and tenses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Introduction */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <GemCard className="shadow-xl border border-gray-200 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Master Spanish Verbs</h2>
              <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
                Spanish verbs are the backbone of the language. Our comprehensive guide covers all major tenses, 
                irregular verbs, and conjugation patterns with interactive practice and detailed explanations.
              </p>
            </GemCard>
          </motion.div>

          {/* Featured Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <Star className="w-6 h-6 text-yellow-500 mr-2" />
              <h3 className="text-2xl font-bold text-gray-800">Featured Topics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredTopics.map((topic) => (
                <Link key={topic.slug} href={`/grammar/spanish/verbs/${topic.slug}`} className="group">
                  <GemCard className="shadow-lg border border-gray-200 hover:border-purple-300 hover:shadow-xl transition-all duration-200 h-full">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-800 group-hover:text-purple-700">
                        {topic.name}
                      </h4>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-500" />
                    </div>
                    <p className="text-gray-600 mb-4">{topic.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${difficultyColors[topic.difficulty as keyof typeof difficultyColors]}`}>
                        {topic.difficulty}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {topic.time}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-700">Key Concepts:</p>
                      <div className="flex flex-wrap gap-1">
                        {topic.concepts.slice(0, 3).map((concept, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {concept}
                          </span>
                        ))}
                        {topic.concepts.length > 3 && (
                          <span className="text-xs text-gray-500">+{topic.concepts.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </GemCard>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* All Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center mb-6">
              <Award className="w-6 h-6 text-blue-500 mr-2" />
              <h3 className="text-2xl font-bold text-gray-800">All Verb Topics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {verbTopics.map((topic) => (
                <Link key={topic.slug} href={`/grammar/spanish/verbs/${topic.slug}`} className="group">
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-800 group-hover:text-purple-700">
                        {topic.name}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${difficultyColors[topic.difficulty as keyof typeof difficultyColors]}`}>
                        {topic.difficulty}
                      </span>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {topic.time}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
