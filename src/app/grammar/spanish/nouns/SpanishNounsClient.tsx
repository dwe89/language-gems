'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, ChevronRight, Star, Award } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../components/ui/GemTheme';
import FlagIcon from '../../../../components/ui/FlagIcon';

const nounTopics = [
  {
    name: 'Gender and Plural of Nouns',
    slug: 'gender-and-plurals',
    description: 'Master gender rules and plural formation in Spanish',
    difficulty: 'beginner',
    time: '15 min',
    featured: true,
    concepts: ['Masculine/feminine patterns', 'Plural formation rules', 'Exceptions', 'Article agreement']
  },
  {
    name: 'Articles (Definite and Indefinite)',
    slug: '../articles/definite-indefinite',
    description: 'Master el, la, los, las and un, una, unos, unas',
    difficulty: 'beginner',
    time: '12 min',
    featured: true,
    concepts: ['Definite articles', 'Indefinite articles', 'Contractions', 'Usage rules']
  },
  {
    name: 'Noun Gender Rules',
    slug: 'gender-rules',
    description: 'Detailed patterns for predicting noun gender',
    difficulty: 'beginner',
    time: '10 min',
    featured: false,
    concepts: ['Ending patterns', 'Semantic categories', 'Common exceptions', 'Memory strategies']
  },
  {
    name: 'Plural Formation',
    slug: 'plurals',
    description: 'Rules for making nouns plural in Spanish',
    difficulty: 'beginner',
    time: '8 min',
    featured: false,
    concepts: ['Add -s', 'Add -es', 'Irregular plurals', 'Accent changes']
  },
  {
    name: 'Nominalisation',
    slug: 'nominalisation',
    description: 'Convert adjectives and verbs into nouns',
    difficulty: 'advanced',
    time: '12 min',
    featured: false,
    concepts: ['Infinitive as noun', 'Adjective nominalization', 'Lo + adjective', 'Abstract concepts']
  }
];

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 border-green-200',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  advanced: 'bg-red-100 text-red-700 border-red-200'
};

export function SpanishNounsClient() {
  const featuredTopics = nounTopics.filter(topic => topic.featured);
  const otherTopics = nounTopics.filter(topic => !topic.featured);

  console.log('🏗️ [SPANISH NOUNS] Client component loaded with topics:', nounTopics.length);

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
                <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Spanish Nouns</h1>
                  <p className="text-gray-600 text-lg">Master Spanish noun gender, articles, and plurals</p>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Master Spanish Nouns</h2>
              <p className="text-gray-600 text-lg mb-6 max-w-3xl mx-auto">
                Spanish nouns have gender (masculine or feminine) and number (singular or plural). 
                Our comprehensive guide covers all the rules, exceptions, and patterns you need to know.
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
                <Link key={topic.slug} href={`/grammar/spanish/nouns/${topic.slug}`} className="group">
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
              <h3 className="text-2xl font-bold text-gray-800">All Noun Topics</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nounTopics.map((topic) => (
                <Link key={topic.slug} href={`/grammar/spanish/nouns/${topic.slug}`} className="group">
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
