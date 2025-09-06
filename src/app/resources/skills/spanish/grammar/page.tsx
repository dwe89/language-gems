import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Clock, Download } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';
import FreebiesBreadcrumb from '../../../../../components/freebies/FreebiesBreadcrumb';

const SPANISH_GRAMMAR_TOPICS = [
  {
    id: 'present-tense',
    name: 'Present Tense',
    description: 'Regular and irregular present tense conjugations',
    difficulty: 'Beginner',
    resources: 15,
    topics: ['Regular -ar verbs', 'Regular -er verbs', 'Regular -ir verbs', 'Irregular verbs', 'Stem-changing verbs']
  },
  {
    id: 'past-tenses',
    name: 'Past Tenses',
    description: 'Preterite and imperfect tenses with usage rules',
    difficulty: 'Intermediate',
    resources: 12,
    topics: ['Preterite tense', 'Imperfect tense', 'Preterite vs Imperfect', 'Irregular past forms']
  },
  {
    id: 'future-conditional',
    name: 'Future & Conditional',
    description: 'Future and conditional tenses for plans and hypotheticals',
    difficulty: 'Intermediate',
    resources: 8,
    topics: ['Simple future', 'Conditional tense', 'Future perfect', 'Conditional perfect']
  },
  {
    id: 'subjunctive',
    name: 'Subjunctive Mood',
    description: 'Present and past subjunctive forms and usage',
    difficulty: 'Advanced',
    resources: 10,
    topics: ['Present subjunctive', 'Past subjunctive', 'Subjunctive triggers', 'Subjunctive vs Indicative']
  },
  {
    id: 'ser-estar',
    name: 'Ser vs Estar',
    description: 'Master the difference between these two "to be" verbs',
    difficulty: 'Beginner',
    resources: 6,
    topics: ['Ser uses', 'Estar uses', 'Adjectives with ser/estar', 'Common mistakes']
  },
  {
    id: 'commands',
    name: 'Commands (Imperativo)',
    description: 'Formal and informal commands in Spanish',
    difficulty: 'Intermediate',
    resources: 7,
    topics: ['Tú commands', 'Usted commands', 'Nosotros commands', 'Negative commands']
  }
];

export default function SpanishGrammarPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <FreebiesBreadcrumb
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Skills Hub', href: '/resources/skills' },
              { label: 'Spanish', href: '/resources/skills/spanish' },
              { label: 'Grammar', active: true }
            ]}
          />
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills/spanish" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-4">
              <ReactCountryFlag
                countryCode="ES"
                svg
                style={{ width: '3rem', height: '3rem' }}
                className="rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Spanish Grammar</h1>
                <p className="text-slate-600 mt-2">Master Spanish grammar with comprehensive resources</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{SPANISH_GRAMMAR_TOPICS.length} Grammar Topics</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>{SPANISH_GRAMMAR_TOPICS.reduce((acc, topic) => acc + topic.resources, 0)} Resources</span>
            </div>
          </div>
        </div>

        {/* Grammar Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SPANISH_GRAMMAR_TOPICS.map((topic) => (
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