import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, FileText, Globe } from 'lucide-react';
import FlagIcon from '../../../components/ui/FlagIcon';
import FreebiesBreadcrumb from '../../../components/freebies/FreebiesBreadcrumb';

const LANGUAGES = [
  {
    id: 'spanish',
    name: 'Spanish',
    countryCode: 'ES',
    description: 'Master Spanish grammar, vocabulary, and exam skills',
    color: 'red'
  },
  {
    id: 'french',
    name: 'French',
    countryCode: 'FR',
    description: 'Perfect your French language skills and fluency',
    color: 'blue'
  },
  {
    id: 'german',
    name: 'German',
    countryCode: 'DE',
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

const colorMap = {
  indigo: {
    border: 'hover:border-indigo-200',
    bg: 'hover:bg-indigo-50',
    text: 'group-hover/skill:text-indigo-700',
    icon: 'text-indigo-600'
  },
  green: {
    border: 'hover:border-green-200',
    bg: 'hover:bg-green-50',
    text: 'group-hover/skill:text-green-700',
    icon: 'text-green-600'
  },
  yellow: {
    border: 'hover:border-yellow-200',
    bg: 'hover:bg-yellow-50',
    text: 'group-hover/skill:text-yellow-700',
    icon: 'text-yellow-600'
  }
};

export default function SkillsHubPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <FreebiesBreadcrumb
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Skills Hub', active: true }
            ]}
          />
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
                  <Link href={`/resources/skills/${language.id}`} className="mb-4 block hover:scale-110 transition-transform duration-200">
                    <FlagIcon
                      countryCode={language.countryCode}
                      size="xl"
                      className="mx-auto"
                    />
                  </Link>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    <Link href={`/resources/skills/${language.id}`}>{language.name}</Link>
                  </h3>
                  <p className="text-slate-600 mb-6">{language.description}</p>
                  {/* Skill Areas for this language */}
                  <div className="space-y-3">
                    {SKILL_AREAS.map((skill) => {
                      const Icon = skill.icon;
                      const color = colorMap[skill.color as keyof typeof colorMap];
                      return (
                        <Link
                          key={skill.id}
                          href={`/resources/skills/${language.id}/${skill.id}`}
                          className={`block p-4 rounded-lg border-2 border-transparent ${color.border} ${color.bg} transition-all duration-200 group/skill`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${color.icon}`} />
                            <div className="text-left flex-1">
                              <div className={`font-semibold text-slate-800 ${color.text}`}>
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