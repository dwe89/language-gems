'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Target, Award, Clock, Users, Gem, Star, Play, Music } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../components/ui/FlagIcon';
import { useAuth } from '../../../../../components/auth/AuthProvider';

const examples = [
  {
    spanish: 'el libro',
    english: 'the book',
    explanation: 'Masculine noun ending in -o'
  },
  {
    spanish: 'la mesa',
    english: 'the table',
    explanation: 'Feminine noun ending in -a'
  },
  {
    spanish: 'el problema',
    english: 'the problem',
    explanation: 'Exception: masculine noun ending in -a'
  },
  {
    spanish: 'la mano',
    english: 'the hand',
    explanation: 'Exception: feminine noun ending in -o'
  }
];

const relatedTopics = [
  { name: 'Articles (el, la, los, las)', href: '/grammar/spanish/nouns/articles' },
  { name: 'Plural Formation', href: '/grammar/spanish/nouns/plurals' },
  { name: 'Adjective Agreement', href: '/grammar/spanish/adjectives/agreement' }
];

export default function SpanishNounGenderPage() {
  const { user } = useAuth();

  console.log('🏗️ [NOUN GENDER] Page loaded');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/grammar/spanish/nouns"
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
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Spanish Noun Gender</h1>
                  <p className="text-gray-600 text-lg">Master the rules for masculine and feminine nouns</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                beginner
              </span>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">10 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <GemCard className="shadow-xl border border-gray-200">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Spanish Noun Gender</h2>
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Spanish nouns are either <strong>masculine</strong> or <strong>feminine</strong>. This grammatical gender affects the articles and adjectives that accompany the noun.
                </p>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Basic Rules</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
                    <h4 className="text-xl font-semibold text-blue-800 mb-3">Masculine Nouns</h4>
                    <p className="text-gray-700 mb-3">Most nouns ending in <strong>-o</strong> are masculine:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>el libro</strong> (the book)</li>
                      <li>• <strong>el gato</strong> (the cat)</li>
                      <li>• <strong>el carro</strong> (the car)</li>
                    </ul>
                  </div>

                  <div className="p-6 bg-pink-50 border border-pink-200 rounded-xl">
                    <h4 className="text-xl font-semibold text-pink-800 mb-3">Feminine Nouns</h4>
                    <p className="text-gray-700 mb-3">Most nouns ending in <strong>-a</strong> are feminine:</p>
                    <ul className="space-y-1 text-gray-700">
                      <li>• <strong>la casa</strong> (the house)</li>
                      <li>• <strong>la mesa</strong> (the table)</li>
                      <li>• <strong>la ventana</strong> (the window)</li>
                    </ul>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Important Exceptions</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-800 mb-3">Masculine words ending in -a</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• <strong>el día</strong> (the day)</li>
                        <li>• <strong>el mapa</strong> (the map)</li>
                        <li>• <strong>el problema</strong> (the problem)</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-yellow-800 mb-3">Feminine words ending in -o</h4>
                      <ul className="space-y-1 text-gray-700">
                        <li>• <strong>la mano</strong> (the hand)</li>
                        <li>• <strong>la foto</strong> (the photo)</li>
                        <li>• <strong>la moto</strong> (the motorcycle)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Examples */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Examples
                </h3>
                <div className="grid gap-4">
                  {examples.map((example, index) => (
                    <div key={index} className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-xl shadow-sm">
                      <div className="space-y-3">
                        <div className="text-lg font-semibold text-gray-800">{example.spanish}</div>
                        <div className="text-gray-600 italic text-base">{example.english}</div>
                        <div className="text-sm text-blue-600 font-medium">{example.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GemCard>
          </motion.div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
            <GemButton
              variant="gem"
              gemType={user ? "rare" : "common"}
              onClick={() => window.location.href = '/grammar/spanish/nouns/gender/practice'}
              className="w-full"
            >
              <Target className="w-5 h-5 mr-2" />
              {user ? 'Practice Exercises' : 'Free Practice'}
            </GemButton>
            <GemButton
              variant="gem"
              gemType={user ? "epic" : "common"}
              onClick={() => window.location.href = '/grammar/spanish/nouns/gender/quiz'}
              className="w-full"
            >
              <Award className="w-5 h-5 mr-2" />
              {user ? 'Take Quiz' : 'Free Quiz'}
            </GemButton>
            <GemButton
              variant="gem"
              gemType="legendary"
              onClick={() => window.location.href = '/songs/es?theme=grammar&topic=noun-gender'}
              className="w-full"
            >
              <Music className="w-5 h-5 mr-2" />
              Learn with Song
            </GemButton>
          </div>

          {/* Related Topics */}
          <GemCard className="shadow-xl">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Related Topics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedTopics.map((topic, index) => (
                <Link key={index} href={topic.href}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        beginner
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </GemCard>
        </div>
      </div>
    </div>
  );
}
