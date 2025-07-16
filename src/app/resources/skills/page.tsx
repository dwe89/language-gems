import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, FileText, Globe } from 'lucide-react';

const LANGUAGES = [
  {
    id: 'spanish',
    name: 'Spanish',
    flag: '🇪🇸',
    description: 'Master Spanish grammar, vocabulary, and exam skills',
    color: 'red'
  },
  {
    id: 'french',
    name: 'French',
    flag: '🇫🇷',
    description: 'Perfect your French language skills and fluency',
    color: 'blue'
  },
  {
    id: 'german',
    name: 'German',
    flag: '🇩🇪',
    description: 'Build strong German foundations and advanced skills',
    color: 'yellow'
  }
];

const SKILL_AREAS = [
  {
    id: 'grammar',
    name: 'Grammar',
    icon: BookOpen,
    description: 'Verb conjugations, tenses, sentence structures',
    color: 'indigo'
  },
  {
    id: 'vocabulary',
    name: 'Vocabulary',
    icon: Users,
    description: 'Word lists, vocab booklets, frequency-based packs',
    color: 'green'
  },
  {
    id: 'exam-practice',
    name: 'Exam Practice',
    icon: FileText,
    description: 'Reading, listening, speaking, writing tasks',
    color: 'yellow'
  }
];

export default function SkillsHubPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/resources" className="text-indigo-600 hover:text-indigo-700">Resources</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-600">Skills Hub</span>
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Skills Hub</h1>
          <p className="text-xl text-slate-600 mb-6">Master core language skills with targeted resources</p>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Globe className="h-5 w-5" />
            <span>Choose your language, then select your skill area</span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Choose Your Language</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANGUAGES.map((language) => (
              <div key={language.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="p-8 text-center">
                  <div className="text-6xl mb-4">{language.flag}</div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{language.name}</h3>
                  <p className="text-slate-600 mb-6">{language.description}</p>
                  
                  {/* Skill Areas for this language */}
                  <div className="space-y-3">
                    {SKILL_AREAS.map((skill) => {
                      const Icon = skill.icon;
                      return (
                        <Link
                          key={skill.id}
                          href={`/resources/skills/${language.id}/${skill.id}`}
                          className={`block p-4 rounded-lg border-2 border-transparent hover:border-${skill.color}-200 hover:bg-${skill.color}-50 transition-all duration-200 group/skill`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 text-${skill.color}-600`} />
                            <div className="text-left flex-1">
                              <div className={`font-semibold text-slate-800 group-hover/skill:text-${skill.color}-700`}>
                                {skill.name}
                              </div>
                              <div className="text-sm text-slate-500">
                                {skill.description}
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Section */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">Not sure where to start?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">New to the language?</h3>
              <p className="text-sm text-slate-600">Start with basic grammar and essential vocabulary</p>
            </div>
            <div className="text-center">
              <Users className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">Building vocabulary?</h3>
              <p className="text-sm text-slate-600">Try our frequency-based word packs for maximum impact</p>
            </div>
            <div className="text-center">
              <FileText className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">Preparing for exams?</h3>
              <p className="text-sm text-slate-600">Focus on exam-specific practice materials</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}