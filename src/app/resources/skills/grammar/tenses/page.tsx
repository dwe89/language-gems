import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Download } from 'lucide-react';

const TENSE_RESOURCES = [
  {
    id: 'present-tense',
    name: 'Present Tense',
    description: 'Master present tense conjugations across all languages',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Beginner',
    resources: 12
  },
  {
    id: 'past-tense',
    name: 'Past Tense',
    description: 'Perfect and imperfect past tenses with examples',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Intermediate',
    resources: 8
  },
  {
    id: 'future-tense',
    name: 'Future Tense',
    description: 'Simple and conditional future forms',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Intermediate',
    resources: 6
  },
  {
    id: 'subjunctive',
    name: 'Subjunctive Mood',
    description: 'Complex subjunctive forms and usage',
    languages: ['Spanish', 'French'],
    difficulty: 'Advanced',
    resources: 4
  }
];

export default function TensesPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-indigo-600 hover:text-indigo-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/grammar" className="text-indigo-600 hover:text-indigo-700">Grammar</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Tenses</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/grammar" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Tenses</h1>
              <p className="text-slate-600 mt-2">Master verb tenses across all time periods</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{TENSE_RESOURCES.length} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{TENSE_RESOURCES.reduce((acc, cat) => acc + cat.resources, 0)} Resources</span>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TENSE_RESOURCES.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{resource.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {resource.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4 text-sm">{resource.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {resource.languages.map((lang) => (
                    <span key={lang} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{resource.resources} resources</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm">
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