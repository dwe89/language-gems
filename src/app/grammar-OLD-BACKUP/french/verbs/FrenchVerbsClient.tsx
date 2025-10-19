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
    concepts: ['Regular -er verbs', 'Regular -ir verbs', 'Regular -re verbs', 'Common irregular verbs']
  },
  {
    name: 'Passé Composé',
    slug: 'passe-compose',
    description: 'Master the compound past tense with avoir and être',
    difficulty: 'intermediate',
    time: '25 min',
    featured: true,
    concepts: ['Avoir auxiliaries', 'Être auxiliaries', 'Past participle agreement', 'Irregular past participles']
  },
  {
    name: 'Imparfait',
    slug: 'imparfait',
    description: 'Understand the imperfect tense for ongoing past actions',
    difficulty: 'intermediate',
    time: '20 min',
    featured: true,
    concepts: ['Regular formation', 'Irregular stems', 'Usage vs passé composé', 'Time expressions']
  },
  {
    name: 'Future Tense',
    slug: 'future',
    description: 'Express future actions and intentions',
    difficulty: 'intermediate',
    time: '18 min',
    featured: false,
    concepts: ['Regular future', 'Irregular stems', 'Near future (aller + infinitive)', 'Future expressions']
  },
  {
    name: 'Conditional Tense',
    slug: 'conditional',
    description: 'Learn hypothetical and polite expressions',
    difficulty: 'advanced',
    time: '22 min',
    featured: false,
    concepts: ['Regular conditional', 'Irregular stems', 'Polite requests', 'Hypothetical situations']
  },
  {
    name: 'Subjunctive Mood',
    slug: 'subjunctive',
    description: 'Master the subjunctive for emotions and doubt',
    difficulty: 'advanced',
    time: '30 min',
    featured: true,
    concepts: ['Present subjunctive', 'Triggers and expressions', 'Irregular forms', 'Usage patterns']
  },
  {
    name: 'Imperative Mood',
    slug: 'imperative',
    description: 'Give commands and instructions',
    difficulty: 'intermediate',
    time: '15 min',
    featured: false,
    concepts: ['Affirmative commands', 'Negative commands', 'Pronoun placement', 'Irregular imperatives']
  },
  {
    name: 'Reflexive Verbs',
    slug: 'reflexive-verbs',
    description: 'Understand reflexive pronouns and verbs',
    difficulty: 'intermediate',
    time: '20 min',
    featured: false,
    concepts: ['Reflexive pronouns', 'Daily routine verbs', 'Reciprocal actions', 'Past tense with être']
  }
];

export default function FrenchVerbsClient() {
  const featuredTopics = verbTopics.filter(topic => topic.featured);
  const allTopics = verbTopics;

  console.log('🏗️ [FRENCH VERBS] Client component loaded with topics:', verbTopics.length);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar/french"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <FlagIcon countryCode="FR" size="xl" />
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">French Verbs</h1>
                  <p className="text-gray-600 text-lg">Master French verb conjugations and tenses</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Star className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">{verbTopics.length} Topics</span>
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
          {/* Featured Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-800">Featured Topics</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Star className="w-4 h-4 text-yellow-500" />
                <span>Most popular</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTopics.map((topic, index) => (
                <motion.div
                  key={topic.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link href={`/grammar/french/verbs/${topic.slug}`}>
                    <GemCard className="h-full hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{topic.name}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">{topic.description}</p>
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {topic.concepts.slice(0, 2).map((concept, conceptIndex) => (
                            <span key={conceptIndex} className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-600">
                              {concept}
                            </span>
                          ))}
                          {topic.concepts.length > 2 && (
                            <span className="px-2 py-1 text-xs rounded bg-gray-50 text-gray-600">
                              +{topic.concepts.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {topic.time}
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </GemCard>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Topics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8">All Verb Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allTopics.map((topic, index) => (
                <motion.div
                  key={topic.slug}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/grammar/french/verbs/${topic.slug}`}>
                    <div className="p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-800">{topic.name}</h3>
                            {topic.featured && <Star className="w-4 h-4 text-yellow-500" />}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{topic.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span className={`px-2 py-1 rounded-full ${getDifficultyColor(topic.difficulty)}`}>
                              {topic.difficulty}
                            </span>
                            <div className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {topic.time}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
