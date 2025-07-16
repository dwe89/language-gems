import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Users, Clock, Download, TrendingUp } from 'lucide-react';

const GERMAN_VOCABULARY_TOPICS = [
  {
    id: 'essential-words',
    name: 'Essential German Words',
    description: 'Core vocabulary for everyday German communication',
    difficulty: 'Beginner',
    resources: 15,
    words: 500,
    coverage: '70%'
  },
  {
    id: 'thematic-lists',
    name: 'Thematic Word Lists',
    description: 'Vocabulary organized by topics like Familie, Essen, Reisen',
    difficulty: 'Beginner',
    resources: 20,
    words: 700,
    coverage: '60%'
  },
  {
    id: 'frequency-packs',
    name: 'German Frequency Packs',
    description: 'Most common German words for maximum learning impact',
    difficulty: 'All Levels',
    resources: 13,
    words: 1800,
    coverage: '85%'
  },
  {
    id: 'exam-vocabulary',
    name: 'German Exam Vocabulary',
    description: 'Key vocabulary for GCSE and A-Level German exams',
    difficulty: 'Intermediate',
    resources: 11,
    words: 600,
    coverage: '75%'
  },
  {
    id: 'academic-german',
    name: 'Academic German',
    description: 'Advanced vocabulary for university and professional contexts',
    difficulty: 'Advanced',
    resources: 8,
    words: 400,
    coverage: '65%'
  },
  {
    id: 'compound-words',
    name: 'Compound Words',
    description: 'Understanding and building German compound words',
    difficulty: 'Intermediate',
    resources: 9,
    words: 350,
    coverage: '55%'
  }
];

export default function GermanVocabularyPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-green-600 hover:text-green-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills" className="text-green-600 hover:text-green-700">Skills Hub</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/german" className="text-green-600 hover:text-green-700">German</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Vocabulary</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/german" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-4xl">🇩🇪</span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">German Vocabulary</h1>
                <p className="text-slate-600 mt-2">Build your German vocabulary systematically</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{GERMAN_VOCABULARY_TOPICS.length} Vocabulary Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{GERMAN_VOCABULARY_TOPICS.reduce((acc, topic) => acc + topic.words, 0)} Total Words</span>
            </div>
          </div>
        </div>

        {/* Vocabulary Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GERMAN_VOCABULARY_TOPICS.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{topic.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    topic.difficulty === 'Advanced' ? 'bg-red-100 text-red-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4 text-sm">{topic.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{topic.words} words</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">{topic.coverage} coverage</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: topic.coverage }}
                    ></div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{topic.resources} resources</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                    <Download className="h-4 w-4" />
                    View Resources
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}