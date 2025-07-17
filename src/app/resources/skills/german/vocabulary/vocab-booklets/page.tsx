import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock, BookOpen, Download, FileText } from 'lucide-react';

const GERMAN_BOOKLET_RESOURCES = [
  {
    id: 'beginner-german-booklets',
    name: 'Beginner German Booklets',
    description: 'Comprehensive German vocabulary booklets for new learners',
    difficulty: 'Beginner',
    resources: 12,
    pages: 24
  },
  {
    id: 'intermediate-german-booklets',
    name: 'Intermediate German Booklets',
    description: 'Advanced German vocabulary with exercises and examples',
    difficulty: 'Intermediate',
    resources: 10,
    pages: 32
  },
  {
    id: 'german-exam-prep-booklets',
    name: 'German Exam Prep Booklets',
    description: 'Targeted German vocabulary for GCSE and A-Level exams',
    difficulty: 'Intermediate',
    resources: 8,
    pages: 40
  },
  {
    id: 'german-revision-booklets',
    name: 'German Revision Booklets',
    description: 'Quick reference guides for German vocabulary review',
    difficulty: 'All Levels',
    resources: 15,
    pages: 16
  },
  {
    id: 'interactive-german-booklets',
    name: 'Interactive German Booklets',
    description: 'Digital German booklets with clickable elements and audio',
    difficulty: 'All Levels',
    resources: 6,
    pages: 28
  }
];

export default function GermanVocabBookletsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-green-600 hover:text-green-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills" className="text-green-600 hover:text-green-700">Skills</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/german" className="text-green-600 hover:text-green-700">German</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/german/vocabulary" className="text-green-600 hover:text-green-700">Vocabulary</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Vocab Booklets</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/german/vocabulary" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">German Vocab Booklets</h1>
              <p className="text-slate-600 mt-2">Comprehensive German vocabulary booklets for structured learning</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{GERMAN_BOOKLET_RESOURCES.length} Booklet Types</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{GERMAN_BOOKLET_RESOURCES.reduce((acc, cat) => acc + cat.resources, 0)} German Booklets</span>
            </div>
          </div>
        </div> 
       {/* Resources Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GERMAN_BOOKLET_RESOURCES.map((resource) => (
            <div key={resource.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{resource.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    resource.difficulty === 'All Levels' ? 'bg-blue-100 text-blue-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {resource.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4 text-sm">{resource.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-500">{resource.pages} pages avg</span>
                  <span className="text-sm text-slate-500">{resource.resources} booklets</span>
                </div>
                
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                  <Download className="h-4 w-4" />
                  View German Booklets
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}