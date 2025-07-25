import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Download } from 'lucide-react';

const FRENCH_WORD_LIST_RESOURCES = [
  {
    id: 'essential-french-words',
    name: 'Essential French Words',
    description: 'Core French vocabulary for everyday communication',
    difficulty: 'Beginner',
    resources: 20,
    words: 500
  },
  {
    id: 'thematic-french-lists',
    name: 'Thematic French Lists',
    description: 'French vocabulary organized by topics like nourriture, voyages, famille',
    difficulty: 'Beginner',
    resources: 25,
    words: 800
  },
  {
    id: 'academic-french-vocabulary',
    name: 'Academic French Vocabulary',
    description: 'Advanced French words for academic and professional contexts',
    difficulty: 'Advanced',
    resources: 15,
    words: 600
  },
  {
    id: 'french-exam-vocabulary',
    name: 'French Exam Vocabulary',
    description: 'Key French words for GCSE, A-Level, and university exams',
    difficulty: 'Intermediate',
    resources: 18,
    words: 750
  }
];

export default function FrenchWordListsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-green-600 hover:text-green-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills" className="text-green-600 hover:text-green-700">Skills</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/french" className="text-green-600 hover:text-green-700">French</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/french/vocabulary" className="text-green-600 hover:text-green-700">Vocabulary</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Word Lists</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/french/vocabulary" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">French Word Lists</h1>
              <p className="text-slate-600 mt-2">Curated French vocabulary lists for systematic learning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{FRENCH_WORD_LIST_RESOURCES.length} Categories</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{FRENCH_WORD_LIST_RESOURCES.reduce((acc, cat) => acc + cat.words, 0)} French Words</span>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRENCH_WORD_LIST_RESOURCES.map((resource) => (
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
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">{resource.words} words</span>
                  <span className="text-sm text-slate-500">{resource.resources} resources</span>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Download className="h-4 w-4" />
                  View French Word Lists
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}