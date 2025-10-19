import React from 'react';
import Link from 'next/link';
import { BookOpen, GraduationCap, Globe } from 'lucide-react';
import FlagIcon from '../../../components/ui/FlagIcon';
import FreebiesBreadcrumb from '../../../components/freebies/FreebiesBreadcrumb';

const LANGUAGES = [
  {
    id: 'spanish',
    name: 'Spanish',
    countryCode: 'ES',
    description: 'Explore Spanish resources by curriculum topic'
  },
  {
    id: 'french',
    name: 'French',
    countryCode: 'FR',
    description: 'Browse French materials organized by theme'
  },
  {
    id: 'german',
    name: 'German',
    countryCode: 'DE',
    description: 'Discover German resources by topic area'
  }
];

const KEY_STAGES = [
  {
    id: 'ks3',
    name: 'KS3',
    icon: BookOpen,
    description: 'Foundation topics for Years 7-9',
    color: 'indigo'
  },
  {
    id: 'ks4',
    name: 'KS4 (GCSE)',
    icon: GraduationCap,
    description: 'Exam themes for Years 10-11',
    color: 'green'
  }
];

const colorMap = {
  indigo: {
    border: 'hover:border-indigo-200',
    bg: 'hover:bg-indigo-50',
    text: 'group-hover/stage:text-indigo-700',
    icon: 'text-indigo-600'
  },
  green: {
    border: 'hover:border-green-200',
    bg: 'hover:bg-green-50',
    text: 'group-hover/stage:text-green-700',
    icon: 'text-green-600'
  }
};

export default function TopicsPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <FreebiesBreadcrumb
            items={[
              { label: 'Resources', href: '/resources' },
              { label: 'Browse by Topic', active: true }
            ]}
          />
        </div>

        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8 text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Browse by Topic</h1>
          <p className="text-xl text-slate-600 mb-6">Find resources organized by language, key stage, and curriculum topic</p>
          <div className="flex items-center justify-center gap-2 text-slate-500">
            <Globe className="h-5 w-5" />
            <span>Choose your language, then select your key stage</span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Choose Your Language</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {LANGUAGES.map((language) => (
              <div key={language.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group">
                <div className="p-8 text-center">
                  <Link href={`/resources/${language.id}`} className="mb-4 block hover:scale-110 transition-transform duration-200">
                    <FlagIcon
                      countryCode={language.countryCode}
                      size="xl"
                      className="mx-auto"
                    />
                  </Link>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    <Link href={`/resources/${language.id}`}>{language.name}</Link>
                  </h3>
                  <p className="text-slate-600 mb-6">{language.description}</p>
                  {/* Key Stages for this language */}
                  <div className="space-y-3">
                    {KEY_STAGES.map((stage) => {
                      const Icon = stage.icon;
                      const color = colorMap[stage.color as keyof typeof colorMap];
                      return (
                        <Link
                          key={stage.id}
                          href={`/resources/${language.id}/${stage.id}`}
                          className={`block p-4 rounded-lg border-2 border-transparent ${color.border} ${color.bg} transition-all duration-200 group/stage`}
                        >
                          <div className="flex items-center gap-3">
                            <Icon className={`h-5 w-5 ${color.icon}`} />
                            <div className="text-left flex-1">
                              <div className={`font-semibold text-slate-800 ${color.text}`}>
                                {stage.name}
                              </div>
                              <div className="text-sm text-slate-500">
                                {stage.description}
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
          <h2 className="text-2xl font-bold text-slate-900 mb-4 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <Globe className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">Step 1: Choose Language</h3>
              <p className="text-sm text-slate-600">Select Spanish, French, or German</p>
            </div>
            <div className="text-center">
              <GraduationCap className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">Step 2: Select Key Stage</h3>
              <p className="text-sm text-slate-600">Pick KS3 or KS4 based on your curriculum level</p>
            </div>
            <div className="text-center">
              <BookOpen className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-800 mb-2">Step 3: Browse Topics</h3>
              <p className="text-sm text-slate-600">Find resources organized by curriculum topics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

