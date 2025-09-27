'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Clock, ChevronRight, Star, Award, BookOpen, Users } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../components/ui/GemTheme';
import FlagIcon from '../../../components/ui/FlagIcon';

const grammarCategories = [
  {
    id: 'verbs',
    name: 'Verbs',
    description: 'Master French verb conjugations, tenses, and moods',
    icon: Target,
    color: 'from-blue-500 to-blue-600',
    topics: [
      { name: 'Present Tense', slug: 'present-tense', difficulty: 'beginner', time: '15 min' },
      { name: 'Passé Composé', slug: 'passe-compose', difficulty: 'intermediate', time: '20 min' },
      { name: 'Imparfait', slug: 'imparfait', difficulty: 'intermediate', time: '18 min' },
      { name: 'Future Tense', slug: 'future', difficulty: 'intermediate', time: '15 min' },
      { name: 'Conditional Tense', slug: 'conditional', difficulty: 'advanced', time: '20 min' },
      { name: 'Subjunctive Mood', slug: 'subjunctive', difficulty: 'advanced', time: '25 min' },
      { name: 'Imperative Mood', slug: 'imperative', difficulty: 'intermediate', time: '12 min' },
      { name: 'Reflexive Verbs', slug: 'reflexive-verbs', difficulty: 'intermediate', time: '18 min' },
      { name: 'Regular Verb Conjugation', slug: 'regular-conjugation', difficulty: 'beginner', time: '16 min' },
      { name: 'Irregular Verbs', slug: 'irregular-verbs', difficulty: 'intermediate', time: '20 min' },
      { name: 'Negative Forms', slug: 'negative-forms', difficulty: 'beginner', time: '12 min' },
      { name: 'Interrogative Forms', slug: 'interrogative-forms', difficulty: 'intermediate', time: '14 min' },
      { name: 'Modes of Address', slug: 'modes-of-address', difficulty: 'beginner', time: '10 min' },
      { name: 'Impersonal Verbs', slug: 'impersonal-verbs', difficulty: 'intermediate', time: '15 min' },
      { name: 'Verbs + Infinitive', slug: 'verbs-infinitive', difficulty: 'intermediate', time: '18 min' },
      { name: 'Immediate Future', slug: 'immediate-future', difficulty: 'beginner', time: '12 min' },
      { name: 'Perfect Infinitive', slug: 'perfect-infinitive', difficulty: 'advanced', time: '16 min' },
      { name: 'Present Participle with EN', slug: 'present-participle-en', difficulty: 'advanced', time: '18 min' }
    ]
  },
  {
    id: 'nouns',
    name: 'Nouns & Articles',
    description: 'Learn gender, articles, and noun agreement rules',
    icon: BookOpen,
    color: 'from-green-500 to-green-600',
    topics: [
      { name: 'Gender Rules', slug: 'gender-rules', difficulty: 'beginner', time: '12 min' },
      { name: 'Definite Articles', slug: 'definite-articles', difficulty: 'beginner', time: '10 min' },
      { name: 'Indefinite Articles', slug: 'indefinite-articles', difficulty: 'beginner', time: '8 min' },
      { name: 'Partitive Articles', slug: 'partitive-articles', difficulty: 'intermediate', time: '15 min' },
      { name: 'Plural Formation', slug: 'plural-formation', difficulty: 'beginner', time: '10 min' },
      { name: 'Noun Agreement', slug: 'noun-agreement', difficulty: 'intermediate', time: '12 min' },
      { name: 'Contractions', slug: 'contractions', difficulty: 'intermediate', time: '8 min' },
      { name: 'Collective Nouns', slug: 'collective-nouns', difficulty: 'intermediate', time: '10 min' },
      { name: 'Gender and Number', slug: 'gender-number', difficulty: 'beginner', time: '14 min' },
      { name: 'Noun Agreement Patterns', slug: 'noun-agreement-patterns', difficulty: 'intermediate', time: '16 min' }
    ]
  },
  {
    id: 'adjectives',
    name: 'Adjectives',
    description: 'Understand adjective agreement and placement',
    icon: Star,
    color: 'from-purple-500 to-purple-600',
    topics: [
      { name: 'Agreement Rules', slug: 'agreement-rules', difficulty: 'beginner', time: '12 min' },
      { name: 'Placement', slug: 'placement', difficulty: 'intermediate', time: '10 min' },
      { name: 'Comparative', slug: 'comparative', difficulty: 'intermediate', time: '15 min' },
      { name: 'Superlative', slug: 'superlative', difficulty: 'intermediate', time: '12 min' },
      { name: 'Irregular Adjectives', slug: 'irregular-adjectives', difficulty: 'intermediate', time: '14 min' },
      { name: 'Demonstrative', slug: 'demonstrative', difficulty: 'beginner', time: '8 min' },
      { name: 'Indefinite Adjectives', slug: 'indefinite-adjectives', difficulty: 'intermediate', time: '12 min' },
      { name: 'Possessive Adjectives', slug: 'possessive-adjectives', difficulty: 'beginner', time: '10 min' },
      { name: 'Interrogative Adjectives', slug: 'interrogative-adjectives', difficulty: 'intermediate', time: '14 min' }
    ]
  },
  {
    id: 'adverbs',
    name: 'Adverbs',
    description: 'Master adverb formation, placement, and usage',
    icon: Clock,
    color: 'from-teal-500 to-teal-600',
    topics: [
      { name: 'Formation and Usage', slug: 'formation', difficulty: 'beginner', time: '14 min' },
      { name: 'Comparative and Superlative', slug: 'comparative', difficulty: 'intermediate', time: '16 min' },
      { name: 'Interrogative Adverbs', slug: 'interrogative', difficulty: 'intermediate', time: '12 min' },
      { name: 'Adverbs of Time and Place', slug: 'time-place', difficulty: 'beginner', time: '10 min' },
      { name: 'Common Adverbial Phrases', slug: 'adverbial-phrases', difficulty: 'intermediate', time: '14 min' },
      { name: 'Quantifiers/Intensifiers', slug: 'quantifiers', difficulty: 'beginner', time: '12 min' },
      { name: 'Placement Rules', slug: 'placement', difficulty: 'intermediate', time: '16 min' },
      { name: 'Frequency Adverbs', slug: 'frequency', difficulty: 'beginner', time: '10 min' },
      { name: 'Degree Adverbs', slug: 'degree', difficulty: 'intermediate', time: '14 min' }
    ]
  },
  {
    id: 'pronouns',
    name: 'Pronouns',
    description: 'Master subject, object, and relative pronouns',
    icon: Users,
    color: 'from-orange-500 to-orange-600',
    topics: [
      { name: 'Subject Pronouns', slug: 'subject-pronouns', difficulty: 'beginner', time: '10 min' },
      { name: 'Direct Object', slug: 'direct-object', difficulty: 'intermediate', time: '15 min' },
      { name: 'Indirect Object', slug: 'indirect-object', difficulty: 'intermediate', time: '15 min' },
      { name: 'Relative Pronouns', slug: 'relative-pronouns', difficulty: 'advanced', time: '20 min' },
      { name: 'Possessive', slug: 'possessive', difficulty: 'intermediate', time: '12 min' },
      { name: 'Demonstrative', slug: 'demonstrative', difficulty: 'intermediate', time: '10 min' },
      { name: 'Indefinite', slug: 'indefinite', difficulty: 'advanced', time: '18 min' },
      { name: 'Reflexive Pronouns', slug: 'reflexive', difficulty: 'intermediate', time: '14 min' },
      { name: 'Relative Pronoun QUI', slug: 'relative-qui', difficulty: 'intermediate', time: '12 min' },
      { name: 'Relative Pronoun QUE', slug: 'relative-que', difficulty: 'intermediate', time: '14 min' },
      { name: 'Pronoun Order', slug: 'pronoun-order', difficulty: 'advanced', time: '18 min' },
      { name: 'Disjunctive Pronouns', slug: 'disjunctive', difficulty: 'intermediate', time: '16 min' },
      { name: 'Interrogative Pronouns', slug: 'interrogative', difficulty: 'intermediate', time: '14 min' },
      { name: 'Pronouns Y and EN', slug: 'y-en', difficulty: 'advanced', time: '20 min' },
      { name: 'Relative Pronoun DONT', slug: 'relative-dont', difficulty: 'advanced', time: '18 min' }
    ]
  },
  {
    id: 'prepositions',
    name: 'Prepositions',
    description: 'Learn French prepositions and their usage',
    icon: Target,
    color: 'from-indigo-500 to-indigo-600',
    topics: [
      { name: 'Basic Prepositions', slug: 'basic-prepositions', difficulty: 'beginner', time: '14 min' },
      { name: 'Location Prepositions', slug: 'location', difficulty: 'intermediate', time: '16 min' },
      { name: 'Time Prepositions', slug: 'time', difficulty: 'intermediate', time: '14 min' },
      { name: 'Common Prepositions', slug: 'common-prepositions', difficulty: 'beginner', time: '12 min' },
      { name: 'Compound Prepositions', slug: 'compound-prepositions', difficulty: 'intermediate', time: '16 min' }
    ]
  },
  {
    id: 'conjunctions',
    name: 'Conjunctions',
    description: 'Master coordinating and subordinating conjunctions',
    icon: BookOpen,
    color: 'from-pink-500 to-pink-600',
    topics: [
      { name: 'Coordinating Conjunctions', slug: 'coordinating', difficulty: 'beginner', time: '12 min' },
      { name: 'Subordinating Conjunctions', slug: 'subordinating', difficulty: 'intermediate', time: '16 min' }
    ]
  },
  {
    id: 'numbers',
    name: 'Numbers & Time',
    description: 'Learn numbers, dates, and time expressions',
    icon: Star,
    color: 'from-cyan-500 to-cyan-600',
    topics: [
      { name: 'Cardinal Numbers', slug: 'cardinal', difficulty: 'beginner', time: '14 min' },
      { name: 'Ordinal Numbers', slug: 'ordinal', difficulty: 'beginner', time: '12 min' },
      { name: 'Numbers, Dates, Time', slug: 'dates-time', difficulty: 'intermediate', time: '18 min' },
      { name: 'Advanced Time Expressions', slug: 'advanced-time', difficulty: 'advanced', time: '20 min' }
    ]
  },
  {
    id: 'syntax',
    name: 'Syntax & Structure',
    description: 'Master French sentence structure and word order',
    icon: Award,
    color: 'from-emerald-500 to-emerald-600',
    topics: [
      { name: 'Negation', slug: 'negation', difficulty: 'intermediate', time: '16 min' },
      { name: 'Questions', slug: 'questions', difficulty: 'intermediate', time: '18 min' },
      { name: 'Word Order', slug: 'word-order', difficulty: 'advanced', time: '20 min' },
      { name: 'Complex Sentences', slug: 'complex-sentences', difficulty: 'advanced', time: '22 min' }
    ]
  }
];

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'beginner': return 'bg-green-100 text-green-700 border-green-200';
    case 'intermediate': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'advanced': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

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
                <span className="text-sm text-gray-700">93 Topics</span>
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
                  <div className="text-2xl font-bold text-blue-600 mb-2">93</div>
                  <div className="text-sm text-gray-600">Grammar Topics</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-2">279</div>
                  <div className="text-sm text-gray-600">Practice Exercises</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600 mb-2">All</div>
                  <div className="text-sm text-gray-600">Skill Levels</div>
                </div>
              </div>
            </GemCard>
          </motion.div>

          {/* Grammar Topics */}
          {grammarCategories.map((category, categoryIndex) => {
            const IconComponent = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
                className="mb-12"
              >
                <GemCard className="shadow-xl border border-gray-200">
                  {/* Category Header */}
                  <div className="flex items-center space-x-4 mb-8">
                    <div className={`p-4 bg-gradient-to-r ${category.color} rounded-xl shadow-lg`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800 mb-2">{category.name}</h2>
                      <p className="text-gray-600 text-lg">{category.description}</p>
                    </div>
                  </div>

                  {/* Topics Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.topics.map((topic, topicIndex) => (
                      <motion.div
                        key={topic.slug}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: (categoryIndex * 0.1) + (topicIndex * 0.05) }}
                      >
                        <Link href={`/grammar/french/${category.id}/${topic.slug}`}>
                          <div className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                            <div className="flex items-start justify-between mb-4">
                              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                                {topic.name}
                              </h3>
                              <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getDifficultyColor(topic.difficulty)}`}>
                                  {topic.difficulty}
                                </span>
                                <div className="flex items-center space-x-1 text-gray-500">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs">{topic.time}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </GemCard>
              </motion.div>
            );
          })}

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
                    <li>• Start with <Link href="/grammar/french/nouns/gender-rules" className="text-blue-600 hover:underline">Gender Rules</Link></li>
                    <li>• Learn basic <Link href="/grammar/french/verbs/present-tense" className="text-blue-600 hover:underline">Present Tense</Link></li>
                    <li>• Master <Link href="/grammar/french/adjectives/agreement-rules" className="text-blue-600 hover:underline">Adjective Agreement</Link></li>
                    <li>• Practice with interactive exercises</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">For Advanced Learners</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Master the <Link href="/grammar/french/verbs/subjunctive" className="text-blue-600 hover:underline">Subjunctive Mood</Link></li>
                    <li>• Perfect your <Link href="/grammar/french/pronouns/relative-pronouns" className="text-blue-600 hover:underline">Relative Pronouns</Link></li>
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
