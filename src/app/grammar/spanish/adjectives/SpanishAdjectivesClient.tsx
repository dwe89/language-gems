'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Star, ChevronRight, Palette, Target, TrendingUp, Eye } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../components/ui/GemTheme';
import FlagIcon from '../../../../components/ui/FlagIcon';

const adjectiveTopics = [
  {
    id: 'agreement',
    title: 'Adjective Agreement',
    description: 'Learn how Spanish adjectives agree with nouns in gender and number.',
    difficulty: 'beginner',
    estimatedTime: 12,
    icon: Target,
    color: 'from-blue-500 to-indigo-600',
    examples: ['la casa blanca (the white house)', 'los libros rojos (the red books)']
  },
  {
    id: 'position',
    title: 'Adjective Position',
    description: 'Understand when adjectives go before or after nouns in Spanish.',
    difficulty: 'intermediate',
    estimatedTime: 10,
    icon: Eye,
    color: 'from-green-500 to-emerald-600',
    examples: ['una buena idea (a good idea)', 'un coche rojo (a red car)']
  },
  {
    id: 'comparison',
    title: 'Comparative & Superlative',
    description: 'Master Spanish comparisons: más que, menos que, tan como, and superlatives.',
    difficulty: 'intermediate',
    estimatedTime: 18,
    icon: TrendingUp,
    color: 'from-purple-500 to-violet-600',
    examples: ['más alto que (taller than)', 'el más inteligente (the most intelligent)']
  },
  {
    id: 'demonstrative',
    title: 'Demonstrative Adjectives',
    description: 'Learn este, ese, aquel and their forms for pointing out specific things.',
    difficulty: 'beginner',
    estimatedTime: 8,
    icon: Palette,
    color: 'from-orange-500 to-red-600',
    examples: ['este libro (this book)', 'aquellas casas (those houses over there)']
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'text-green-600 bg-green-100';
    case 'intermediate': return 'text-yellow-600 bg-yellow-100';
    case 'advanced': return 'text-red-600 bg-red-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

const features = [
  {
    icon: Target,
    title: 'Agreement Rules',
    description: 'Master the fundamental rules of Spanish adjective agreement.'
  },
  {
    icon: Eye,
    title: 'Position Patterns',
    description: 'Learn when adjectives go before or after nouns.'
  },
  {
    icon: TrendingUp,
    title: 'Comparisons',
    description: 'Express comparisons and superlatives naturally.'
  },
  {
    icon: Palette,
    title: 'Demonstratives',
    description: 'Point out specific things with este, ese, and aquel.'
  }
];

export default function SpanishAdjectivesClient() {
  console.log('🏗️ [SPANISH ADJECTIVES] Client component loaded with topics:', adjectiveTopics.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-yellow-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <FlagIcon countryCode="ES" size="lg" />
              <div className="p-4 bg-gradient-to-r from-red-600 to-yellow-500 rounded-2xl shadow-lg">
                <Palette className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-2">Spanish Adjectives</h1>
                <p className="text-gray-600 text-xl">Master agreement, position, and comparison</p>
              </div>
            </motion.div>
            
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Link href="/grammar/spanish">
                <GemButton variant="outline" className="inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Spanish Grammar
                </GemButton>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              Comprehensive guides to Spanish adjectives, from basic agreement rules to advanced 
              comparisons. Master the art of describing people, places, and things in Spanish.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Adjective Topics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Adjective Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {adjectiveTopics.map((topic, index) => {
                const IconComponent = topic.icon;
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link href={`/grammar/spanish/adjectives/${topic.id}`}>
                      <GemCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200 group">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 bg-gradient-to-r ${topic.color} rounded-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                              <IconComponent className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                              {topic.title}
                            </h3>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(topic.difficulty)}`}>
                            {topic.difficulty}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 mb-4 leading-relaxed">{topic.description}</p>
                        
                        <div className="flex items-center text-sm text-gray-500 mb-4">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{topic.estimatedTime} min read</span>
                        </div>
                        
                        <div className="mb-4">
                          <p className="text-sm font-medium text-gray-700 mb-2">Examples:</p>
                          <div className="space-y-1">
                            {topic.examples.map((example, idx) => (
                              <p key={idx} className="text-sm text-gray-600 italic">• {example}</p>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <span className="text-purple-600 font-semibold group-hover:text-purple-700">
                            Learn More
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

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Master Spanish Adjectives?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <GemCard className="text-center h-full border border-gray-200">
                      <div className="p-3 bg-gradient-to-r from-red-600 to-yellow-500 rounded-xl shadow-lg mx-auto mb-4 w-fit">
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
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <GemCard className="shadow-2xl border border-gray-200 bg-gradient-to-r from-red-50 to-yellow-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Spanish Adjective Journey</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Begin with adjective agreement and work your way up to advanced comparisons. 
                Each topic builds on the previous one for systematic learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType="epic"
                  onClick={() => window.location.href = '/grammar/spanish/adjectives/agreement'}
                  className="px-8 py-4"
                >
                  <Target className="w-5 h-5 mr-2" />
                  Start with Agreement
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="rare"
                  onClick={() => window.location.href = '/grammar/spanish/adjectives/comparison'}
                  className="px-8 py-4"
                >
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Learn Comparisons
                </GemButton>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
