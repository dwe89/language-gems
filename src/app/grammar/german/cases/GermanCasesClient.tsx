'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Star, ChevronRight, Target, Shield, Crown, Gem } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../components/ui/GemTheme';
import FlagIcon from '../../../../components/ui/FlagIcon';

const caseTopics = [
  {
    id: 'nominative',
    title: 'Nominative Case',
    description: 'Learn the subject case - who or what is performing the action.',
    difficulty: 'beginner',
    estimatedTime: 20,
    icon: Crown,
    color: 'from-blue-500 to-indigo-600',
    examples: ['Der Mann ist groß (The man is tall)', 'Die Frau arbeitet (The woman works)']
  },
  {
    id: 'accusative',
    title: 'Accusative Case',
    description: 'Master the direct object case - who or what receives the action.',
    difficulty: 'beginner',
    estimatedTime: 25,
    icon: Target,
    color: 'from-green-500 to-emerald-600',
    examples: ['Ich sehe den Mann (I see the man)', 'Sie kauft das Buch (She buys the book)']
  },
  {
    id: 'dative',
    title: 'Dative Case',
    description: 'Understand the indirect object case - to whom or for whom something is done.',
    difficulty: 'intermediate',
    estimatedTime: 30,
    icon: Shield,
    color: 'from-purple-500 to-violet-600',
    examples: ['Ich gebe dem Mann das Buch (I give the book to the man)', 'Sie hilft der Frau (She helps the woman)']
  },
  {
    id: 'genitive',
    title: 'Genitive Case',
    description: 'Learn the possessive case - showing ownership and relationships.',
    difficulty: 'intermediate',
    estimatedTime: 25,
    icon: Gem,
    color: 'from-orange-500 to-red-600',
    examples: ['Das Haus des Mannes (The man\'s house)', 'Die Farbe der Blume (The color of the flower)']
  },
  {
    id: 'case-overview',
    title: 'Case System Overview',
    description: 'Comprehensive overview of all four cases and when to use them.',
    difficulty: 'intermediate',
    estimatedTime: 35,
    icon: BookOpen,
    color: 'from-gray-600 to-slate-700',
    examples: ['Complete case comparison', 'Usage patterns', 'Common mistakes']
  },
  {
    id: 'prepositions-cases',
    title: 'Prepositions & Cases',
    description: 'Learn which prepositions require which cases.',
    difficulty: 'advanced',
    estimatedTime: 40,
    icon: Star,
    color: 'from-yellow-500 to-amber-600',
    examples: ['mit + Dative', 'für + Accusative', 'wegen + Genitive']
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
    title: 'Systematic Learning',
    description: 'Master each case step-by-step with clear explanations and examples.'
  },
  {
    icon: Shield,
    title: 'Article Changes',
    description: 'Understand how der/die/das change in each case.'
  },
  {
    icon: Crown,
    title: 'Practical Usage',
    description: 'Learn when and why to use each case in real German sentences.'
  },
  {
    icon: Gem,
    title: 'Advanced Patterns',
    description: 'Master complex case usage with prepositions and verbs.'
  }
];

export default function GermanCasesClient() {
  console.log('🏗️ [GERMAN CASES] Client component loaded with topics:', caseTopics.length);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center space-x-4 mb-6"
            >
              <FlagIcon countryCode="DE" size="lg" />
              <div className="p-4 bg-gradient-to-r from-gray-800 to-yellow-500 rounded-2xl shadow-lg">
                <Target className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-2">German Cases</h1>
                <p className="text-gray-600 text-xl">Master the four German cases</p>
              </div>
            </motion.div>
            
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Link href="/grammar/german">
                <GemButton variant="outline" className="inline-flex items-center">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to German Grammar
                </GemButton>
              </Link>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed"
            >
              The German case system is the key to understanding German grammar. Master Nominativ, 
              Akkusativ, Dativ, and Genitiv to unlock fluent German communication.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Case Topics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Case Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {caseTopics.map((topic, index) => {
                const IconComponent = topic.icon;
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link href={`/grammar/german/cases/${topic.id}`}>
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
                            {topic.examples.slice(0, 2).map((example, idx) => (
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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Master German Cases?</h2>
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

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="text-center"
          >
            <GemCard className="shadow-2xl border border-gray-200 bg-gradient-to-r from-yellow-50 to-orange-50">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your German Case Journey</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Begin with the Nominative case and progress through each case systematically. 
                Understanding cases is essential for German fluency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType="epic"
                  onClick={() => window.location.href = '/grammar/german/cases/nominative'}
                  className="px-8 py-4"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Start with Nominative
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="rare"
                  onClick={() => window.location.href = '/grammar/german/cases/case-overview'}
                  className="px-8 py-4"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Case Overview
                </GemButton>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
