'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users, Star, ChevronRight, Clock, Award, Brain, Zap } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';

const grammarCategories = [
  {
    id: 'verbs',
    title: 'German Verbs',
    description: 'Master German verb conjugations, tenses, and modal verbs with comprehensive guides.',
    icon: Zap,
    color: 'from-blue-500 to-indigo-600',
    topics: 8,
    difficulty: 'Beginner to Advanced',
    estimatedTime: '3-4 hours'
  },
  {
    id: 'cases',
    title: 'German Cases',
    description: 'Understand the four German cases: Nominativ, Akkusativ, Dativ, and Genitiv.',
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    topics: 6,
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '4-5 hours'
  },
  {
    id: 'nouns',
    title: 'German Nouns',
    description: 'Learn German noun gender, plurals, and declension patterns.',
    icon: BookOpen,
    color: 'from-purple-500 to-violet-600',
    topics: 5,
    difficulty: 'Beginner to Intermediate',
    estimatedTime: '2-3 hours'
  },
  {
    id: 'adjectives',
    title: 'German Adjectives',
    description: 'Master German adjective endings, comparisons, and declensions.',
    icon: Star,
    color: 'from-orange-500 to-red-600',
    topics: 4,
    difficulty: 'Intermediate to Advanced',
    estimatedTime: '2-3 hours'
  }
];

const features = [
  {
    icon: Brain,
    title: 'Systematic Approach',
    description: 'Learn German grammar step-by-step with logical progression from basic to advanced concepts.'
  },
  {
    icon: Target,
    title: 'Case System Focus',
    description: 'Special emphasis on mastering the German case system, the key to German grammar.'
  },
  {
    icon: Award,
    title: 'Practice Exercises',
    description: 'Reinforce learning with interactive exercises and immediate feedback.'
  },
  {
    icon: Users,
    title: 'All Skill Levels',
    description: 'Content designed for beginners through advanced learners with adaptive difficulty.'
  }
];

export default function GermanGrammarClient() {
  console.log('🏗️ [GERMAN GRAMMAR] Client component loaded');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-100">
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <FlagIcon countryCode="DE" size="xl" />
              <div className="p-4 bg-gradient-to-r from-gray-800 to-yellow-500 rounded-2xl shadow-lg">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-2">German Grammar</h1>
                <p className="text-gray-600 text-xl">Master the structure of the German language</p>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive German grammar resources designed to help you understand and master the complex 
              but logical structure of German. From basic verb conjugations to the intricate case system.
            </motion.p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Grammar Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {grammarCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    <Link href={`/grammar/german/${category.id}`}>
                      <GemCard className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-200 group">
                        <div className="flex items-center space-x-4 mb-6">
                          <div className={`p-3 bg-gradient-to-r ${category.color} rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                            <IconComponent className="w-8 h-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-gray-800">{category.title}</h3>
                            <p className="text-gray-600">{category.difficulty}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-6 leading-relaxed">{category.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-yellow-500" />
                            <span>{category.topics} Topics</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{category.estimatedTime}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-purple-600 font-semibold group-hover:text-purple-700">
                            Explore Topics
                          </span>
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                        </div>
                      </GemCard>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Learn German Grammar?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <GemCard className="text-center h-full border border-gray-200">
                      <div className="p-3 bg-gradient-to-r from-gray-800 to-yellow-500 rounded-xl shadow-lg mx-auto mb-4 w-fit">
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                    </GemCard>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <GemCard className="shadow-2xl border border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Master German Grammar?</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                German grammar may seem complex, but with our systematic approach, you'll master 
                the cases, verb conjugations, and sentence structures step by step.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType="epic"
                  onClick={() => window.location.href = '/grammar/german/verbs'}
                  className="px-8 py-4"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start with Verbs
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="rare"
                  onClick={() => window.location.href = '/grammar/german/cases'}
                  className="px-8 py-4"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Learn Cases
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="uncommon"
                  onClick={() => window.location.href = '/grammar/german/nouns'}
                  className="px-8 py-4"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Explore Nouns
                </GemButton>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
