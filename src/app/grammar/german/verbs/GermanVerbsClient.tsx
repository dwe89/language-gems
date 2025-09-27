'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Star, ChevronRight, Zap, Target, Users, Award } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../components/ui/GemTheme';
import FlagIcon from '../../../../components/ui/FlagIcon';

const verbTopics = [
  {
    id: 'present-tense',
    title: 'Present Tense',
    description: 'Learn German present tense conjugations for regular and irregular verbs.',
    difficulty: 'beginner',
    estimatedTime: 25,
    examples: ['ich spreche (I speak)', 'du gehst (you go)', 'er ist (he is)']
  },
  {
    id: 'past-tense',
    title: 'Past Tense (Präteritum)',
    description: 'Master German simple past tense for narrative and formal writing.',
    difficulty: 'intermediate',
    estimatedTime: 30,
    examples: ['ich sprach (I spoke)', 'du warst (you were)', 'er hatte (he had)']
  },
  {
    id: 'perfect-tense',
    title: 'Perfect Tense (Perfekt)',
    description: 'Understand German perfect tense with haben and sein auxiliaries.',
    difficulty: 'intermediate',
    estimatedTime: 35,
    examples: ['ich habe gesprochen (I have spoken)', 'du bist gegangen (you have gone)']
  },
  {
    id: 'future-tense',
    title: 'Future Tense',
    description: 'Express future actions with werden and present tense constructions.',
    difficulty: 'intermediate',
    estimatedTime: 20,
    examples: ['ich werde sprechen (I will speak)', 'du wirst gehen (you will go)']
  },
  {
    id: 'modal-verbs',
    title: 'Modal Verbs',
    description: 'Master German modal verbs: können, müssen, wollen, sollen, dürfen, mögen.',
    difficulty: 'intermediate',
    estimatedTime: 40,
    examples: ['ich kann (I can)', 'du musst (you must)', 'er will (he wants)']
  },
  {
    id: 'subjunctive',
    title: 'Subjunctive (Konjunktiv)',
    description: 'Learn German subjunctive mood for hypothetical situations and indirect speech.',
    difficulty: 'advanced',
    estimatedTime: 45,
    examples: ['ich würde gehen (I would go)', 'er sagte, er sei müde (he said he was tired)']
  },
  {
    id: 'separable-verbs',
    title: 'Separable Verbs',
    description: 'Understand German separable prefix verbs and their conjugation patterns.',
    difficulty: 'intermediate',
    estimatedTime: 30,
    examples: ['ich stehe auf (I get up)', 'du kommst mit (you come along)']
  },
  {
    id: 'reflexive-verbs',
    title: 'Reflexive Verbs',
    description: 'Master German reflexive verbs and reflexive pronouns.',
    difficulty: 'intermediate',
    estimatedTime: 25,
    examples: ['ich wasche mich (I wash myself)', 'du freust dich (you are happy)']
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
    icon: Zap,
    title: 'Systematic Learning',
    description: 'Progress from basic present tense to complex subjunctive constructions.'
  },
  {
    icon: Target,
    title: 'Modal Verb Focus',
    description: 'Special emphasis on the six German modal verbs and their usage patterns.'
  },
  {
    icon: Award,
    title: 'Separable Verbs',
    description: 'Master the unique German separable prefix verb system.'
  },
  {
    icon: Users,
    title: 'All Skill Levels',
    description: 'Content designed for beginners through advanced German learners.'
  }
];

export default function GermanVerbsClient() {
  console.log('🏗️ [GERMAN VERBS] Client component loaded with topics:', verbTopics.length);

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
                <Zap className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-5xl font-bold text-gray-800 mb-2">German Verbs</h1>
                <p className="text-gray-600 text-xl">Master German verb conjugations and tenses</p>
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
              Comprehensive guides to German verb conjugations, from basic present tense to complex 
              modal verbs and subjunctive constructions. Master the foundation of German grammar.
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Verb Topics Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Verb Topics</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {verbTopics.map((topic, index) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link href={`/grammar/german/verbs/${topic.id}`}>
                    <GemCard className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-200 group">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors">
                          {topic.title}
                        </h3>
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
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Why Master German Verbs?</h2>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Start Your German Verb Journey</h2>
              <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Begin with the present tense and work your way up to advanced constructions. 
                Each topic builds on the previous one for systematic learning.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType="epic"
                  onClick={() => window.location.href = '/grammar/german/verbs/present-tense'}
                  className="px-8 py-4"
                >
                  <BookOpen className="w-5 h-5 mr-2" />
                  Start with Present Tense
                </GemButton>
                <GemButton
                  variant="gem"
                  gemType="rare"
                  onClick={() => window.location.href = '/grammar/german/verbs/modal-verbs'}
                  className="px-8 py-4"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Learn Modal Verbs
                </GemButton>
              </div>
            </GemCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
