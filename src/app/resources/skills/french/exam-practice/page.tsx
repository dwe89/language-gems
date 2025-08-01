import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Clock, Download, Target } from 'lucide-react';

const FRENCH_EXAM_TOPICS = [
  {
    id: 'reading-comprehension',
    name: 'Reading Comprehension',
    description: 'French reading passages with questions and analysis',
    difficulty: 'All Levels',
    resources: 18,
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    skills: ['Text analysis', 'Inference', 'Vocabulary in context', 'Cultural understanding']
  },
  {
    id: 'listening-practice',
    name: 'Listening Practice',
    description: 'Audio exercises with native French speakers',
    difficulty: 'All Levels',
    resources: 16,
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    skills: ['Audio comprehension', 'Note-taking', 'Accent recognition', 'Speed listening']
  },
  {
    id: 'speaking-tasks',
    name: 'Speaking Tasks',
    description: 'Conversation practice and presentation exercises',
    difficulty: 'Intermediate',
    resources: 14,
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    skills: ['Pronunciation', 'Fluency', 'Role-play', 'Photo description']
  },
  {
    id: 'writing-skills',
    name: 'Writing Skills',
    description: 'Essays, letters, and creative writing in French',
    difficulty: 'Intermediate',
    resources: 17,
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    skills: ['Essay structure', 'Formal writing', 'Creative writing', 'Grammar accuracy']
  },
  {
    id: 'gcse-preparation',
    name: 'GCSE Preparation',
    description: 'Targeted practice for GCSE French exams',
    difficulty: 'Intermediate',
    resources: 23,
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    skills: ['Exam technique', 'Time management', 'Mark schemes', 'Past papers']
  },
  {
    id: 'a-level-preparation',
    name: 'A-Level Preparation',
    description: 'Advanced French exam preparation and practice',
    difficulty: 'Advanced',
    resources: 20,
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    skills: ['Literary analysis', 'Film studies', 'Cultural topics', 'Independent research']
  }
];

export default function FrenchExamPracticePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-yellow-600 hover:text-yellow-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills" className="text-yellow-600 hover:text-yellow-700">Skills Hub</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/french" className="text-yellow-600 hover:text-yellow-700">French</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Exam Practice</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/french" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-4xl">🇫🇷</span>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">French Exam Practice</h1>
                <p className="text-slate-600 mt-2">Prepare for your French exams with targeted practice</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>{FRENCH_EXAM_TOPICS.length} Practice Areas</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>{FRENCH_EXAM_TOPICS.reduce((acc, topic) => acc + topic.resources, 0)} Practice Resources</span>
            </div>
          </div>
        </div>

        {/* Exam Practice Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRENCH_EXAM_TOPICS.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{topic.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    topic.difficulty === 'All Levels' ? 'bg-blue-100 text-blue-700' :
                    topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4 text-sm">{topic.description}</p>
                
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm mb-2">Exam Boards:</h4>
                    <div className="flex flex-wrap gap-1">
                      {topic.examBoards.map((board) => (
                        <span key={board} className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                          {board}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-slate-800 text-sm mb-2">Key Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {topic.skills.slice(0, 2).map((skill) => (
                        <span key={skill} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          {skill}
                        </span>
                      ))}
                      {topic.skills.length > 2 && (
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                          +{topic.skills.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{topic.resources} resources</span>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                    <Download className="h-4 w-4" />
                    Start Practice
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