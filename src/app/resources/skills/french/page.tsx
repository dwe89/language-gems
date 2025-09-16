import React from 'react';
import FlagIcon from '@/components/ui/FlagIcon';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Users, FileText } from 'lucide-react';


const FRENCH_SKILLS = [
  {
    id: 'grammar',
    name: 'French Grammar',
    icon: BookOpen,
    description: 'Master French verb conjugations, tenses, and sentence structures',
    color: 'indigo',
    topics: ['Present Tense', 'Past Tenses', 'Future & Conditional', 'Subjunctive', 'Gender & Articles']
  },
  {
    id: 'vocabulary',
    name: 'French Vocabulary',
    icon: Users,
    description: 'Build your French vocabulary with targeted word lists and frequency packs',
    color: 'green',
    topics: ['Essential Words', 'Thematic Lists', 'Frequency Packs', 'Exam Vocabulary']
  },
  {
    id: 'exam-practice',
    name: 'French Exam Practice',
    icon: FileText,
    description: 'Prepare for GCSE, A-Level, and university French exams',
    color: 'yellow',
    topics: ['Reading Comprehension', 'Listening Practice', 'Speaking Tasks', 'Writing Skills']
  }
];

export default function FrenchSkillsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-indigo-600 hover:text-indigo-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <Link href="/resources/skills" className="text-indigo-600 hover:text-indigo-700">Skills Hub</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">French</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/resources/skills" className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
            <div className="flex items-center gap-4">
              <FlagIcon
                countryCode="FR"
                size="xl"
                className="rounded-lg"
              />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">French Skills</h1>
                <p className="text-slate-600 mt-2">Perfect your French with comprehensive learning resources</p>
              </div>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {FRENCH_SKILLS.map((skill) => {
            const Icon = skill.icon;
            return (
              <div key={skill.id} className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border-t-4 border-${skill.color}-500`}>
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className={`h-8 w-8 text-${skill.color}-600`} />
                    <h2 className="text-xl font-bold text-slate-900">{skill.name}</h2>
                  </div>
                  
                  <p className="text-slate-600 mb-6">{skill.description}</p>
                  
                  <div className="space-y-2 mb-6">
                    <h3 className="font-semibold text-slate-800 text-sm">Key Topics:</h3>
                    <div className="flex flex-wrap gap-2">
                      {skill.topics.map((topic) => (
                        <span key={topic} className={`px-2 py-1 bg-${skill.color}-100 text-${skill.color}-700 text-xs rounded-full`}>
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    href={`/resources/skills/french/${skill.id}`}
                    className={`block w-full text-center px-6 py-3 bg-${skill.color}-600 text-white rounded-lg font-medium hover:bg-${skill.color}-700 transition-colors`}
                  >
                    Explore {skill.name}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}