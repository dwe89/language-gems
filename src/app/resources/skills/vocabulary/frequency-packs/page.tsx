import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Download, TrendingUp } from 'lucide-react';

const FREQUENCY_RESOURCES = [
  {
    id: 'top-100',
    name: 'Top 100 Words',
    description: 'The most frequently used words in everyday conversation',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Beginner',
    resources: 8,
    coverage: '65%'
  },
  {
    id: 'top-500',
    name: 'Top 500 Words',
    description: 'Essential vocabulary covering most common situations',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Beginner',
    resources: 12,
    coverage: '80%'
  },
  {
    id: 'top-1000',
    name: 'Top 1000 Words',
    description: 'Comprehensive foundation for intermediate learners',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Intermediate',
    resources: 15,
    coverage: '85%'
  },
  {
    id: 'top-2000',
    name: 'Top 2000 Words',
    description: 'Advanced vocabulary for fluent communication',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Intermediate',
    resources: 18,
    coverage: '90%'
  },
  {
    id: 'academic-frequency',
    name: 'Academic Frequency',
    description: 'Most common words in academic and formal texts',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Advanced',
    resources: 10,
    coverage: '75%'
  },
  {
    id: 'media-frequency',
    name: 'Media Frequency',
    description: 'Common words in news, TV, and digital media',
    languages: ['Spanish', 'French', 'German'],
    difficulty: 'Intermediate',
    resources: 8,
    coverage: '70%'
  }
];

export default function FrequencyPacksPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-green-600 hover:text-green-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/vocabulary" className="text-green-600 hover:text-green-700">Vocabulary</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Frequency Packs</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/vocabulary" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Frequency Packs</h1>
              <p className="text-slate-600 mt-2">Learn the most important words first for maximum impact</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>{FREQUENCY_RESOURCES.length} Frequency Levels</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{FREQUENCY_RESOURCES.reduce((acc, cat) => acc + cat.resources, 0)} Resource Packs</span>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <div className="flex items-start gap-3">
            <TrendingUp className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Why Frequency-Based Learning?</h3>
              <p className="text-blue-800 text-sm">Learning the most common words first gives you the biggest return on investment. The top 1000 words typically cover 80-85% of everyday conversation!</p>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FREQUENCY_RESOURCES.map((resource) => (
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
                    <span key={lang} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                      {lang}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium text-green-600">{resource.coverage} coverage</span>
                  </div>
                  <span className="text-sm text-slate-500">{resource.resources} packs</span>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Download className="h-4 w-4" />
                  View Frequency Packs
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}