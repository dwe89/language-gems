'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Star, ChevronRight, Users, User, Heart, ArrowRight, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../components/ui/GemTheme';
import FlagIcon from '../../../../components/ui/FlagIcon';

const pronounTopics = [
  {
    id: 'personal',
    title: 'Personal Pronouns',
    description: 'Learn yo, tú, él, ella and their uses as subject pronouns.',
    difficulty: 'beginner',
    estimatedTime: 10,
    icon: User,
    color: 'from-blue-500 to-indigo-600',
    examples: ['yo hablo (I speak)', 'tú comes (you eat)', 'ella vive (she lives)']
  },
  {
    id: 'possessive',
    title: 'Possessive Pronouns',
    description: 'Master mi, tu, su, nuestro and their forms to show ownership.',
    difficulty: 'beginner',
    estimatedTime: 12,
    icon: Heart,
    color: 'from-green-500 to-emerald-600',
    examples: ['mi casa (my house)', 'tu libro (your book)', 'nuestro coche (our car)']
  },
  {
    id: 'direct-object',
    title: 'Direct Object Pronouns',
    description: 'Use me, te, lo, la to replace direct objects and avoid repetition.',
    difficulty: 'intermediate',
    estimatedTime: 15,
    icon: ArrowRight,
    color: 'from-purple-500 to-violet-600',
    examples: ['lo veo (I see him/it)', 'la compro (I buy it)', 'nos llaman (they call us)']
  },
  {
    id: 'indirect-object',
    title: 'Indirect Object Pronouns',
    description: 'Learn me, te, le, nos, les to show to whom or for whom.',
    difficulty: 'intermediate',
    estimatedTime: 15,
    icon: Users,
    color: 'from-orange-500 to-red-600',
    examples: ['le doy (I give to him/her)', 'nos escriben (they write to us)', 'te hablo (I speak to you)']
  },
  {
    id: 'reflexive',
    title: 'Reflexive Pronouns',
    description: 'Master me, te, se, nos for actions done to oneself.',
    difficulty: 'intermediate',
    estimatedTime: 18,
    icon: RotateCcw,
    color: 'from-pink-500 to-rose-600',
    examples: ['me lavo (I wash myself)', 'se levanta (he/she gets up)', 'nos vestimos (we get dressed)']
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
    icon: User,
    title: 'Subject Pronouns',
    description: 'Master who is doing the action with personal pronouns.'
  },
  {
    icon: Heart,
    title: 'Possession',
    description: 'Show ownership and relationships with possessive pronouns.'
  },
  {
    icon: ArrowRight,
    title: 'Direct Objects',
    description: 'Replace direct objects to avoid repetition and sound natural.'
  },
  {
    icon: Users,
    title: 'Indirect Objects',
    description: 'Express to whom or for whom actions are done.'
  },
  {
    icon: RotateCcw,
    title: 'Reflexive Actions',
    description: 'Describe actions done to oneself with reflexive pronouns.'
  }
];

export default function SpanishPronounsClient() {
  console.log('🏗️ [SPANISH PRONOUNS] Client component loaded with topics:', pronounTopics.length);

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
                <Users className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-2">Spanish Pronouns</h1>
                <p className="text-gray-600 text-xl">Master personal, possessive, and object pronouns</p>
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
              Comprehensive guides to Spanish pronouns, from basic personal pronouns to advanced 
              object and reflexive pronouns. Learn to replace nouns and express relationships naturally.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Pronoun Topics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Pronoun Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pronounTopics.map((topic, index) => {
                const IconComponent = topic.icon;
                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link href={`/grammar/spanish/pronouns/${topic.id}`}>
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
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Master Spanish Pronouns?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your Spanish Pronoun Journey</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Begin with personal pronouns and work your way up to complex object and reflexive pronouns. 
                Each topic builds on the previous one for systematic learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType="epic"
                  onClick={() => window.location.href = '/grammar/spanish/pronouns/personal'}
                  className="px-8 py-4"
                >
                  <User className="w-5 h-5 mr-2" />
                  Start with Personal
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="rare"
                  onClick={() => window.location.href = '/grammar/spanish/pronouns/direct-object'}
                  className="px-8 py-4"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Learn Object Pronouns
                </GemButton>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
