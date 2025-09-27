'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Clock, ChevronRight, Star, Award, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';

const grammarCategories = [
  {
    name: 'Verbs',
    slug: 'verbs',
    description: 'Master French verb conjugations, tenses, and moods',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    topics: ['Present Tense', 'Passé Composé', 'Imparfait', 'Future Tense', 'Conditional', 'Subjunctive'],
    difficulty: 'beginner to advanced',
    totalTopics: 12
  },
  {
    name: 'Nouns & Articles',
    slug: 'nouns',
    description: 'Learn gender, articles, and noun agreement rules',
    icon: BookOpen,
    color: 'from-green-500 to-green-600',
    topics: ['Gender Rules', 'Definite Articles', 'Indefinite Articles', 'Partitive Articles'],
    difficulty: 'beginner to intermediate',
    totalTopics: 8
  },
  {
    name: 'Adjectives',
    slug: 'adjectives',
    description: 'Understand adjective agreement and placement',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    topics: ['Agreement Rules', 'Placement', 'Comparative', 'Superlative'],
    difficulty: 'beginner to intermediate',
    totalTopics: 6
  },
  {
    name: 'Pronouns',
    slug: 'pronouns',
    description: 'Master subject, object, and relative pronouns',
    icon: Users,
    color: 'from-orange-500 to-orange-600',
    topics: ['Subject Pronouns', 'Direct Object', 'Indirect Object', 'Relative Pronouns'],
    difficulty: 'intermediate',
    totalTopics: 7
  }
];

export default function FrenchGrammarClient() {
  console.log('🏗️ [FRENCH GRAMMAR] Client component loaded');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
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
                <FlagIcon countryCode="FR" size="xl" />
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">French Grammar</h1>
                  <p className="text-gray-600 text-lg">Complete guide to French grammar rules and structures</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">33 Topics</span>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Master French Grammar</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                Welcome to the most comprehensive French grammar guide available. Our structured approach takes you from basic concepts to advanced grammar rules, with interactive exercises, real-world examples, and immediate feedback to accelerate your learning.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-2">33+</div>
                  <div className="text-sm text-gray-600">Grammar Topics</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-2">100+</div>
                  <div className="text-sm text-gray-600">Practice Exercises</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600 mb-2">All</div>
                  <div className="text-sm text-gray-600">Skill Levels</div>
                </div>
              </div>
            </GemCard>
          </motion.div>

          {/* Grammar Categories */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Grammar Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {grammarCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link href={`/grammar/french/${category.slug}`}>
                      <GemCard className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200">
                        <div className="flex items-start space-x-4 mb-4">
                          <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl shadow-lg`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{category.name}</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">{category.description}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-2">
                            {category.topics.slice(0, 3).map((topic, topicIndex) => (
                              <span key={topicIndex} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                {topic}
                              </span>
                            ))}
                            {category.topics.length > 3 && (
                              <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                                +{category.topics.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>{category.totalTopics} topics</span>
                          <span className="capitalize">{category.difficulty}</span>
                        </div>
                      </GemCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

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
                    <li>• Start with <Link href="/grammar/french/nouns" className="text-blue-600 hover:underline">Nouns & Articles</Link></li>
                    <li>• Learn basic <Link href="/grammar/french/verbs" className="text-blue-600 hover:underline">Present Tense</Link></li>
                    <li>• Master <Link href="/grammar/french/adjectives" className="text-blue-600 hover:underline">Adjective Agreement</Link></li>
                    <li>• Practice with interactive exercises</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Advanced Learners</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Master the <Link href="/grammar/french/verbs" className="text-blue-600 hover:underline">Subjunctive Mood</Link></li>
                    <li>• Perfect your <Link href="/grammar/french/pronouns" className="text-blue-600 hover:underline">Pronoun Usage</Link></li>
                    <li>• Study complex verb tenses</li>
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
