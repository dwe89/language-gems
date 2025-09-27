'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users, Star, ChevronRight, Clock, Award, Brain, Zap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';

const grammarCategories = [
  {
    id: 'verbs',
    name: 'Verbs',
    description: 'Master German verb conjugations, tenses, and modal verbs',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600',
    topics: [
      { name: 'Present Tense', slug: 'present-tense', difficulty: 'beginner', time: '15 min' },
      { name: 'Past Tense', slug: 'past-tense', difficulty: 'intermediate', time: '20 min' },
      { name: 'Perfect Tense', slug: 'perfect-tense', difficulty: 'intermediate', time: '18 min' },
      { name: 'Future Tense', slug: 'future-tense', difficulty: 'intermediate', time: '15 min' },
      { name: 'Modal Verbs', slug: 'modal-verbs', difficulty: 'intermediate', time: '20 min' },
      { name: 'Separable Verbs', slug: 'separable-verbs', difficulty: 'intermediate', time: '16 min' },
      { name: 'Reflexive Verbs', slug: 'reflexive-verbs', difficulty: 'intermediate', time: '14 min' },
      { name: 'Passive Voice', slug: 'passive-voice', difficulty: 'advanced', time: '22 min' }
    ]
  },
  {
    id: 'cases',
    name: 'Cases',
    description: 'Understand the four German cases and their usage',
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    topics: [
      { name: 'Nominative Case', slug: 'nominative', difficulty: 'beginner', time: '12 min' },
      { name: 'Accusative Case', slug: 'accusative', difficulty: 'beginner', time: '15 min' },
      { name: 'Dative Case', slug: 'dative', difficulty: 'intermediate', time: '18 min' },
      { name: 'Genitive Case', slug: 'genitive', difficulty: 'intermediate', time: '16 min' },
      { name: 'Case Prepositions', slug: 'prepositions', difficulty: 'intermediate', time: '20 min' },
      { name: 'Two-Way Prepositions', slug: 'two-way-prepositions', difficulty: 'advanced', time: '22 min' }
    ]
  },
  {
    id: 'nouns',
    name: 'Nouns',
    description: 'Learn German noun gender, plurals, and declension patterns',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-600',
    topics: [
      { name: 'Gender Rules', slug: 'gender-rules', difficulty: 'beginner', time: '15 min' },
      { name: 'Plural Formation', slug: 'plural-formation', difficulty: 'beginner', time: '12 min' },
      { name: 'Noun Declension', slug: 'declension', difficulty: 'intermediate', time: '20 min' },
      { name: 'Weak Nouns', slug: 'weak-nouns', difficulty: 'intermediate', time: '14 min' },
      { name: 'Compound Nouns', slug: 'compound-nouns', difficulty: 'intermediate', time: '10 min' }
    ]
  },
  {
    id: 'adjectives',
    name: 'Adjectives',
    description: 'Master German adjective endings, comparisons, and declensions',
    icon: Star,
    color: 'from-orange-500 to-red-600',
    topics: [
      { name: 'Adjective Endings', slug: 'endings', difficulty: 'intermediate', time: '20 min' },
      { name: 'Comparative', slug: 'comparative', difficulty: 'intermediate', time: '15 min' },
      { name: 'Superlative', slug: 'superlative', difficulty: 'intermediate', time: '12 min' },
      { name: 'Participle Adjectives', slug: 'participle-adjectives', difficulty: 'advanced', time: '18 min' }
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
    case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export default function GermanGrammarClient() {
  console.log('🏗️ [GERMAN GRAMMAR] Client component loaded');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
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
                <FlagIcon countryCode="DE" size="xl" />
                <div className="p-3 bg-gradient-to-r from-gray-800 to-yellow-500 rounded-xl shadow-lg">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">German Grammar</h1>
                  <p className="text-gray-600 text-lg">Master the structure of the German language</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">23 Topics</span>
              </div>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">All Levels</span>
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
            <GemCard className="shadow-xl border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Master German Grammar</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Comprehensive German grammar resources designed to help you understand and master the complex but logical structure of German. From basic verb conjugations to the intricate case system, our structured approach makes German grammar accessible and engaging.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-2">23</div>
                  <div className="text-sm text-gray-600">Grammar Topics</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-2">69</div>
                  <div className="text-sm text-gray-600">Practice Exercises</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600 mb-2">All</div>
                  <div className="text-sm text-gray-600">Skill Levels</div>
                </div>
              </div>
            </GemCard>
          </motion.div>

          {/* Grammar Topics */}
          {grammarCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <GemCard className="shadow-xl border border-gray-200">
                  {/* Category Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={`p-4 bg-gradient-to-r ${category.color} rounded-xl shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h2>
                      <p className="text-gray-600 text-lg">{category.description}</p>
                    </div>
                  </div>

                  {/* Topics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.topics.map((topic, topicIndex) => (
                      <motion.div
                        key={topic.slug}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (categoryIndex * 0.1) + (topicIndex * 0.05) }}
                      >
                        <Link href={`/grammar/german/${category.id}/${topic.slug}`}>
                          <div className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {topic.name}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(topic.difficulty)}`}>
                                  {topic.difficulty}
                                </span>
                                <div className="flex items-center space-x-1 text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs">{topic.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </GemCard>
              </motion.div>
            );
          })}

          {/* Quick Start */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <GemCard className="shadow-xl border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Start Guide</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Beginners</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Start with <Link href="/grammar/german/nouns/gender-rules" className="text-blue-600 hover:underline">Gender Rules</Link></li>
                    <li>• Learn basic <Link href="/grammar/german/verbs/present-tense" className="text-blue-600 hover:underline">Present Tense</Link></li>
                    <li>• Master <Link href="/grammar/german/cases/nominative" className="text-blue-600 hover:underline">Nominative Case</Link></li>
                    <li>• Practice with interactive exercises</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Advanced Learners</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Master the <Link href="/grammar/german/cases/genitive" className="text-blue-600 hover:underline">Genitive Case</Link></li>
                    <li>• Perfect your <Link href="/grammar/german/adjectives/endings" className="text-blue-600 hover:underline">Adjective Endings</Link></li>
                    <li>• Study complex verb forms</li>
                    <li>• Take comprehensive quizzes</li>
                  </ul>
                </div>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
