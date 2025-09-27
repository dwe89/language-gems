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
    explanation: 'Definite article with masculine noun'
  },
  {
    spanish: 'la mesa',
    english: 'the table',
    explanation: 'Definite article with feminine noun'
  },
  {
    spanish: 'un problema',
    english: 'a problem',
    explanation: 'Indefinite article with masculine noun'
  },
  {
    spanish: 'una casa',
    english: 'a house',
    explanation: 'Indefinite article with feminine noun'
  }
];

const relatedTopics = [
  { name: 'Noun Gender', href: '/grammar/spanish/nouns/gender' },
  { name: 'Plural Formation', href: '/grammar/spanish/nouns/plurals' },
  { name: 'Definite vs Indefinite Articles', href: '/grammar/spanish/nouns/definite-indefinite' }
];

export default function SpanishArticlesPage() {
  const { user } = useAuth();

  console.log('🏗️ [ARTICLES] Page loaded');

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
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Spanish Articles</h1>
                  <p className="text-gray-600 text-lg">Master definite and indefinite articles (el, la, los, las, un, una)</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                beginner
              </span>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">12 min read</span>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Spanish Articles</h2>
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Spanish articles are words that come before nouns to indicate whether the noun is <strong>definite</strong> (specific) or <strong>indefinite</strong> (general). They must agree with the gender and number of the noun.
                </p>
                
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Definite Articles (The)</h3>
                
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                    <h4 className="text-lg font-semibold">Definite Articles</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Gender</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Singular</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Plural</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">Masculine</td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">el</td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">los</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">Feminine</td>
                          <td className="px-6 py-4 text-sm font-bold text-pink-600">la</td>
                          <td className="px-6 py-4 text-sm font-bold text-pink-600">las</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Indefinite Articles (A/An)</h3>
                
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden mb-8">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4">
                    <h4 className="text-lg font-semibold">Indefinite Articles</h4>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Gender</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Singular</th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Plural</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">Masculine</td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">un</td>
                          <td className="px-6 py-4 text-sm font-bold text-blue-600">unos</td>
                        </tr>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">Feminine</td>
                          <td className="px-6 py-4 text-sm font-bold text-pink-600">una</td>
                          <td className="px-6 py-4 text-sm font-bold text-pink-600">unas</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Key Rules</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                  <ul className="space-y-3 text-gray-700">
                    <li>• Articles must <strong>agree</strong> with the gender and number of the noun</li>
                    <li>• Use <strong>definite articles</strong> for specific, known things</li>
                    <li>• Use <strong>indefinite articles</strong> for general, unknown things</li>
                    <li>• <strong>el</strong> is used before feminine nouns starting with stressed <strong>a-</strong> or <strong>ha-</strong> (el agua, el hacha)</li>
                  </ul>
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
              onClick={() => window.location.href = '/grammar/spanish/nouns/articles/practice'}
              className="w-full"
            >
              <Target className="w-5 h-5 mr-2" />
              {user ? 'Practice Exercises' : 'Free Practice'}
            </GemButton>
            <GemButton
              variant="gem"
              gemType={user ? "epic" : "common"}
              onClick={() => window.location.href = '/grammar/spanish/nouns/articles/quiz'}
              className="w-full"
            >
              <Award className="w-5 h-5 mr-2" />
              {user ? 'Take Quiz' : 'Free Quiz'}
            </GemButton>
            <GemButton
              variant="gem"
              gemType="legendary"
              onClick={() => window.location.href = '/songs/es?theme=grammar&topic=articles'}
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
