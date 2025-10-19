'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Clock, Star, Play, Music, Award } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../components/ui/FlagIcon';
import { useAuth } from '../../../../../components/auth/AuthProvider';

const examples = [
  {
    spanish: 'Ayer comí pizza',
    english: 'Yesterday I ate pizza',
    explanation: 'Regular -er verb in preterite (completed action)'
  },
  {
    spanish: 'Ella habló con su madre',
    english: 'She spoke with her mother',
    explanation: 'Regular -ar verb in preterite'
  },
  {
    spanish: 'Nosotros fuimos al cine',
    english: 'We went to the cinema',
    explanation: 'Irregular verb "ir" in preterite'
  },
  {
    spanish: 'Tú escribiste una carta',
    english: 'You wrote a letter',
    explanation: 'Regular -ir verb in preterite'
  }
];

const relatedTopics = [
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' }
];

export default function SpanishPreteritePage() {
  const { user } = useAuth();

  console.log('🏗️ [PRETERITE] Page loaded');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/grammar/spanish/verbs"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <FlagIcon countryCode="ES" size="xl" />
                <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Spanish Preterite Tense</h1>
                  <p className="text-gray-600 text-lg">Master the past tense for completed actions</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
                intermediate
              </span>
              <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-700">20 min read</span>
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
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Spanish Preterite Tense</h2>
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The preterite tense (pretérito indefinido) is used to describe <strong>completed actions</strong> in the past. 
                  It tells us what happened at a specific time or during a specific period that has ended.
                </p>
                
                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Regular Verb Endings</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h4 className="text-xl font-semibold text-blue-800 mb-3">-AR Verbs (hablar)</h4>
                    <div className="space-y-2 text-gray-700">
                      <div><strong>yo</strong> → hablé</div>
                      <div><strong>tú</strong> → hablaste</div>
                      <div><strong>él/ella</strong> → habló</div>
                      <div><strong>nosotros</strong> → hablamos</div>
                      <div><strong>vosotros</strong> → hablasteis</div>
                      <div><strong>ellos</strong> → hablaron</div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <h4 className="text-xl font-semibold text-green-800 mb-3">-ER Verbs (comer)</h4>
                    <div className="space-y-2 text-gray-700">
                      <div><strong>yo</strong> → comí</div>
                      <div><strong>tú</strong> → comiste</div>
                      <div><strong>él/ella</strong> → comió</div>
                      <div><strong>nosotros</strong> → comimos</div>
                      <div><strong>vosotros</strong> → comisteis</div>
                      <div><strong>ellos</strong> → comieron</div>
                    </div>
                  </div>
                  
                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
                    <h4 className="text-xl font-semibold text-purple-800 mb-3">-IR Verbs (vivir)</h4>
                    <div className="space-y-2 text-gray-700">
                      <div><strong>yo</strong> → viví</div>
                      <div><strong>tú</strong> → viviste</div>
                      <div><strong>él/ella</strong> → vivió</div>
                      <div><strong>nosotros</strong> → vivimos</div>
                      <div><strong>vosotros</strong> → vivisteis</div>
                      <div><strong>ellos</strong> → vivieron</div>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">Common Irregular Verbs</h3>
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-3">ser/ir (to be/to go)</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <div>fui, fuiste, fue, fuimos, fuisteis, fueron</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-3">tener (to have)</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <div>tuve, tuviste, tuvo, tuvimos, tuvisteis, tuvieron</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-3">hacer (to do/make)</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <div>hice, hiciste, hizo, hicimos, hicisteis, hicieron</div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-800 mb-3">estar (to be)</h4>
                      <div className="space-y-1 text-gray-700 text-sm">
                        <div>estuve, estuviste, estuvo, estuvimos, estuvisteis, estuvieron</div>
                      </div>
                    </div>
                  </div>
                </div>

                <h3 className="text-2xl font-semibold text-gray-800 mb-4">When to Use Preterite</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-8">
                  <ul className="space-y-3 text-gray-700">
                    <li>• <strong>Completed actions:</strong> Ayer comí pizza (Yesterday I ate pizza)</li>
                    <li>• <strong>Specific time:</strong> En 2020 viajé a España (In 2020 I traveled to Spain)</li>
                    <li>• <strong>Series of events:</strong> Me levanté, desayuné y salí (I got up, had breakfast and left)</li>
                    <li>• <strong>Interrupting actions:</strong> Cuando llegaste, yo dormía (When you arrived, I was sleeping)</li>
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
              onClick={() => window.location.href = '/grammar/spanish/verbs/preterite/practice'}
              className="w-full"
            >
              <Target className="w-5 h-5 mr-2" />
              {user ? 'Practice Exercises' : 'Free Practice'}
            </GemButton>
            <GemButton
              variant="gem"
              gemType={user ? "epic" : "common"}
              onClick={() => window.location.href = '/grammar/spanish/verbs/preterite/quiz'}
              className="w-full"
            >
              <Award className="w-5 h-5 mr-2" />
              {user ? 'Take Quiz' : 'Free Quiz'}
            </GemButton>
            <GemButton
              variant="gem"
              gemType="legendary"
              onClick={() => window.location.href = '/songs/es?theme=grammar&topic=preterite'}
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
                <Link key={index} href={topic.url}>
                  <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-800">{topic.name}</h4>
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
                        intermediate
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
