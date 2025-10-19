'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Users, Star, ChevronRight, Clock, Award, Brain, FileText, Languages, Zap, PenTool } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../components/ui/GemTheme';
import FlagIcon from '../../components/ui/FlagIcon';

const languages = [
  {
    code: 'spanish',
    name: 'Spanish',
    countryCode: 'ES',
    color: 'from-orange-500 to-red-600',
    description: 'Master Spanish grammar with comprehensive guides covering verbs, nouns, adjectives, and more.',
    topics: 25,
    difficulty: 'Beginner to Advanced'
  },
  {
    code: 'french',
    name: 'French',
    countryCode: 'FR',
    color: 'from-blue-500 to-indigo-600',
    description: 'Learn French grammar rules, conjugations, and sentence structures with interactive exercises.',
    topics: 22,
    difficulty: 'Beginner to Advanced'
  },
  {
    code: 'german',
    name: 'German',
    countryCode: 'DE',
    color: 'from-gray-800 to-yellow-500',
    description: 'Navigate German grammar including cases, verb conjugations, and complex sentence structures.',
    topics: 18,
    difficulty: 'Intermediate to Advanced'
  }
];

const features = [
  {
    icon: BookOpen,
    title: 'Comprehensive Guides',
    description: 'Detailed explanations with examples and usage patterns for every grammar topic.'
  },
  {
    icon: Target,
    title: 'Interactive Practice',
    description: 'Hands-on exercises to reinforce learning with immediate feedback and corrections.'
  },
  {
    icon: Award,
    title: 'Progress Tracking',
    description: 'Monitor your improvement with detailed analytics and achievement milestones.'
  },
  {
    icon: Users,
    title: 'All Skill Levels',
    description: 'Content designed for beginners through advanced learners with adaptive difficulty.'
  }
];

export default function GrammarIndexClient() {
  console.log('🏗️ [GRAMMAR INDEX] Client component loaded');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
                <Brain className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-2">Grammar Guides</h1>
                <p className="text-gray-600 text-xl">Master language structure across Spanish, French, and German</p>
              </div>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 text-lg max-w-4xl mx-auto leading-relaxed px-4"
            >
              Master the building blocks of language with our comprehensive grammar guides. 
              From verb conjugations to sentence structure, build confidence in Spanish, French, and German 
              through interactive lessons and practical exercises.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Language Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Choose Your Language</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {languages.map((language, index) => (
                <motion.div
                  key={language.code}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Link href={`/grammar/${language.code}`}>
                    <GemCard className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border border-gray-200 group p-8">
                      <div className="flex items-start space-x-4 mb-6">
                        <FlagIcon countryCode={language.countryCode} size="xl" />
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-800 mb-1">{language.name}</h3>
                          <p className="text-gray-600 text-sm">Interactive Grammar Lessons</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed text-base">{language.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          <span className="font-medium">{language.topics} Topics</span>
                        </div>
                        <div className="flex items-center">
                          <Target className="w-4 h-4 mr-1" />
                          <span className="font-medium">{language.difficulty}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="text-purple-600 font-semibold group-hover:text-purple-700 text-base">
                          Start Learning →
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all duration-300" />
                      </div>
                    </GemCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Choose Our Grammar Guides?</h2>
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
                      <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl shadow-lg mx-auto mb-4 w-fit">
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

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="text-center"
          >
            <GemCard className="shadow-2xl border border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Master Grammar?</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of learners who have improved their language skills with our comprehensive grammar guides. 
                Start with any language and progress at your own pace.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType="epic"
                  onClick={() => window.location.href = '/grammar/spanish'}
                  className="px-8 py-4"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Start with Spanish
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="rare"
                  onClick={() => window.location.href = '/grammar/french'}
                  className="px-8 py-4"
                >
                  <Languages className="w-5 h-5 mr-2" />
                  Explore French
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="uncommon"
                  onClick={() => window.location.href = '/grammar/german'}
                  className="px-8 py-4"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Try German
                </GemButton>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
