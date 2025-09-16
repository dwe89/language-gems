import React from 'react';
import FlagIcon from '@/components/ui/FlagIcon';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Download } from 'lucide-react';


const FRENCH_GRAMMAR_TOPICS = [
  {
    id: 'present-tense',
    name: 'Present Tense',
    description: 'Regular and irregular present tense conjugations',
    difficulty: 'Beginner',
    resources: 14,
    topics: ['Regular -er verbs', 'Regular -ir verbs', 'Regular -re verbs', 'Irregular verbs', 'Reflexive verbs']
  },
  {
    id: 'past-tenses',
    name: 'Past Tenses',
    description: 'Passé composé and imparfait with usage rules',
    difficulty: 'Intermediate',
    resources: 12,
    topics: ['Passé composé', 'Imparfait', 'Plus-que-parfait', 'Passé simple', 'Agreement rules']
  },
  {
    id: 'future-conditional',
    name: 'Future & Conditional',
    description: 'Future and conditional tenses for plans and hypotheticals',
    difficulty: 'Intermediate',
    resources: 9,
    topics: ['Simple future', 'Conditional tense', 'Future perfect', 'Conditional perfect']
  },
  {
    id: 'subjunctive',
    name: 'Subjunctive Mood',
    description: 'Present and past subjunctive forms and usage',
    difficulty: 'Advanced',
    resources: 11,
    topics: ['Present subjunctive', 'Past subjunctive', 'Subjunctive triggers', 'Subjunctive vs Indicative']
  },
  {
    id: 'articles-gender',
    name: 'Articles & Gender',
    description: 'Definite, indefinite articles and noun gender rules',
    difficulty: 'Beginner',
    resources: 8,
    topics: ['Definite articles', 'Indefinite articles', 'Partitive articles', 'Gender rules']
  },
  {
    id: 'pronouns',
    name: 'Pronouns',
    description: 'Subject, object, and relative pronouns in French',
    difficulty: 'Intermediate',
    resources: 10,
    topics: ['Subject pronouns', 'Direct object pronouns', 'Indirect object pronouns', 'Relative pronouns']
  }
];

export default function FrenchGrammarPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-indigo-600 hover:text-indigo-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills" className="text-indigo-600 hover:text-indigo-700">Skills Hub</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills/french" className="text-indigo-600 hover:text-indigo-700">French</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Grammar</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/french" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-4">
              <FlagIcon
                countryCode="FR"
                size="xl"
                className="rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">French Grammar</h1>
                <p className="text-slate-600 mt-2">Perfect your French grammar with comprehensive resources</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{FRENCH_GRAMMAR_TOPICS.length} Grammar Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{FRENCH_GRAMMAR_TOPICS.reduce((acc, topic) => acc + topic.resources, 0)} Resources</span>
            </div>
          </div>
        </div>

        {/* Grammar Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FRENCH_GRAMMAR_TOPICS.map((topic) => (
            <div key={topic.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-slate-800">{topic.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    topic.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                    topic.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {topic.difficulty}
                  </span>
                </div>
                
                <p className="text-slate-600 mb-4 text-sm">{topic.description}</p>
                
                <div className="space-y-2 mb-4">
                  <h4 className="font-medium text-slate-800 text-sm">Covers:</h4>
                  <div className="flex flex-wrap gap-1">
                    {topic.topics.slice(0, 3).map((subtopic) => (
                      <span key={subtopic} className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full">
                        {subtopic}
                      </span>
                    ))}
                    {topic.topics.length > 3 && (
                      <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                        +{topic.topics.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{topic.resources} resources</span>
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