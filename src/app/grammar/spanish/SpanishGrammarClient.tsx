'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Target, Award, Clock, Users, Gem, Star, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';

const grammarCategories = [
  {
    id: 'verbs',
    name: 'Verbs',
    description: 'Master Spanish verb conjugations, tenses, and moods',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    topics: [
      { name: 'Present Tense', slug: 'present-tense', difficulty: 'beginner', time: '15 min' },
      { name: 'Past Tense (Preterite)', slug: 'preterite', difficulty: 'intermediate', time: '20 min' },
      { name: 'Imperfect Tense', slug: 'imperfect', difficulty: 'intermediate', time: '18 min' },
      { name: 'Future Tense', slug: 'future', difficulty: 'intermediate', time: '15 min' },
      { name: 'Conditional Tense', slug: 'conditional', difficulty: 'advanced', time: '20 min' },
      { name: 'Subjunctive Mood', slug: 'subjunctive', difficulty: 'advanced', time: '25 min' },
      { name: 'Irregular Verbs', slug: 'irregular-verbs', difficulty: 'intermediate', time: '22 min' },
      { name: 'Ser vs Estar', slug: 'ser-vs-estar', difficulty: 'beginner', time: '12 min' }
    ]
  },
  {
    id: 'nouns',
    name: 'Nouns',
    description: 'Learn about gender, articles, and plural formation',
    icon: BookOpen,
    color: 'from-green-500 to-green-600',
    topics: [
      { name: 'Noun Gender', slug: 'gender', difficulty: 'beginner', time: '10 min' },
      { name: 'Articles (el, la, los, las)', slug: 'articles', difficulty: 'beginner', time: '12 min' },
      { name: 'Plural Formation', slug: 'plurals', difficulty: 'beginner', time: '8 min' },
      { name: 'Definite vs Indefinite Articles', slug: 'definite-indefinite', difficulty: 'intermediate', time: '15 min' }
    ]
  },
  {
    id: 'adjectives',
    name: 'Adjectives',
    description: 'Understand agreement, position, and comparison',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    topics: [
      { name: 'Adjective Agreement', slug: 'agreement', difficulty: 'beginner', time: '12 min' },
      { name: 'Adjective Position', slug: 'position', difficulty: 'intermediate', time: '10 min' },
      { name: 'Comparative & Superlative', slug: 'comparison', difficulty: 'intermediate', time: '18 min' },
      { name: 'Demonstrative Adjectives', slug: 'demonstrative', difficulty: 'beginner', time: '8 min' }
    ]
  },
  {
    id: 'pronouns',
    name: 'Pronouns',
    description: 'Master personal, possessive, and object pronouns',
    icon: Users,
    color: 'from-orange-500 to-orange-600',
    topics: [
      { name: 'Personal Pronouns', slug: 'personal', difficulty: 'beginner', time: '10 min' },
      { name: 'Possessive Pronouns', slug: 'possessive', difficulty: 'beginner', time: '12 min' },
      { name: 'Direct Object Pronouns', slug: 'direct-object', difficulty: 'intermediate', time: '15 min' },
      { name: 'Indirect Object Pronouns', slug: 'indirect-object', difficulty: 'intermediate', time: '15 min' },
      { name: 'Reflexive Pronouns', slug: 'reflexive', difficulty: 'intermediate', time: '18 min' }
    ]
  }
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700'
};

export function SpanishGrammarClient() {
  console.log('🏗️ [SPANISH GRAMMAR] Client component loaded');

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
                <FlagIcon countryCode="ES" size="xl" />
                <div className="p-3 bg-gradient-to-r from-red-500 to-yellow-500 rounded-xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Spanish Grammar</h1>
                  <p className="text-gray-600 text-lg">Complete guide to mastering Spanish grammar</p>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Master Spanish Grammar</h2>
              <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
                Our comprehensive Spanish grammar guide covers everything from basic verb conjugations to advanced subjunctive moods. 
                Each topic includes detailed explanations, examples, interactive practice, and quizzes to test your knowledge.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">25+</div>
                  <div className="text-sm text-gray-600">Grammar Topics</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">100+</div>
                  <div className="text-sm text-gray-600">Practice Exercises</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Interactive Quizzes</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                  <div className="text-2xl font-bold text-orange-600 mb-1">All</div>
                  <div className="text-sm text-gray-600">Skill Levels</div>
                </div>
              </div>
            </GemCard>
          </motion.div>

          {/* Grammar Categories */}
          <div className="space-y-12">
            {grammarCategories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GemCard className="shadow-xl border border-gray-200">
                    <div className="flex items-center mb-6">
                      <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl shadow-lg mr-4`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800">{category.name}</h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.topics.map((topic) => (
                        <Link 
                          key={topic.slug}
                          href={`/grammar/spanish/${category.id}/${topic.slug}`}
                          className="group"
                        >
                          <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 h-full">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-gray-800 group-hover:text-purple-700">
                                {topic.name}
                              </h4>
                              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-purple-500" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColors[topic.difficulty as keyof typeof difficultyColors]}`}>
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
                  </GemCard>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
