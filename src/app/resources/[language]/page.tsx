'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, Users, ChevronRight, ExternalLink, Trophy } from 'lucide-react';
import ReactCountryFlag from 'react-country-flag';

interface PageProps {
  params: {
    language: string;
  };
}

interface KeyStage {
  id: string;
  name: string;
  description: string;
  yearGroups: string;
  topicCount: number;
}

const LANGUAGE_CONFIGS = {
  spanish: { name: 'Spanish', countryCode: 'ES' },
  french: { name: 'French', countryCode: 'FR' },
  german: { name: 'German', countryCode: 'DE' }
};

const KEY_STAGES: KeyStage[] = [
  {
    id: 'ks3',
    name: 'Key Stage 3',
    description: 'Foundation vocabulary and grammar for beginners',
    yearGroups: 'Years 7-9 (Ages 11-14)',
    topicCount: 6
  },
  {
    id: 'ks4',
    name: 'Key Stage 4',
    description: 'GCSE preparation materials and exam practice',
    yearGroups: 'Years 10-11 (Ages 14-16)',
    topicCount: 9
  },
  {
    id: 'ks5',
    name: 'Key Stage 5',
    description: 'A-Level content and advanced language skills',
    yearGroups: 'Years 12-13 (Ages 16-18)',
    topicCount: 4
  }
];

export default function LanguagePage({ params }: PageProps) {
  const { language } = params;
  const languageConfig = LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS];

  if (!languageConfig) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Language Not Found</h1>
          <p className="text-slate-600 mb-8">The language you're looking for isn't available yet.</p>
          <Link href="/resources" className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const capitalizedLanguage = languageConfig.name;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center mb-4">
            <Link
              href="/resources"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Link>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-xl flex items-center justify-center mr-6">
                <div className="rounded-full overflow-hidden flex justify-center items-center" style={{ width: '2rem', height: '2rem' }}>
                  <ReactCountryFlag
                    countryCode={languageConfig.countryCode}
                    svg
                    style={{ width: '3rem', height: '3rem' }}
                  />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {capitalizedLanguage} Resources
                </h1>
                <p className="text-slate-600 mt-2">
                  Professional {capitalizedLanguage} learning materials organized by curriculum level
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Stages Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Browse by Key Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {KEY_STAGES.map((keyStage) => (
              <Link
                key={keyStage.id}
                href={`/resources/${language}/${keyStage.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden group border border-slate-200"
              >
                {/* Card Header */}
                <div className="h-32 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-105 transition-transform duration-200 relative overflow-hidden">
                  <div className="flex items-center justify-center">
                    {keyStage.id === 'ks3' && <BookOpen className="h-12 w-12 text-indigo-600" />}
                    {keyStage.id === 'ks4' && <GraduationCap className="h-12 w-12 text-indigo-600" />}
                    {keyStage.id === 'ks5' && <Trophy className="h-12 w-12 text-indigo-600" />}
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <ExternalLink className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                      {keyStage.name}
                    </h3>
                    <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <p className="text-slate-600 text-sm mb-4">{keyStage.description}</p>
                  <p className="text-xs text-slate-500 mb-4">{keyStage.yearGroups}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="text-indigo-600 font-medium">
                      {keyStage.topicCount} Topics Available
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Overview Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Comprehensive {capitalizedLanguage} Curriculum
          </h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Our {capitalizedLanguage} resources are carefully structured to support learning from foundation level through to advanced study,
            aligned with UK curriculum standards and exam specifications.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-indigo-600 mb-1">3</div>
              <div className="text-slate-600 text-sm">Key Stages</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">19</div>
              <div className="text-slate-600 text-sm">Topic Areas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">Professional</div>
              <div className="text-slate-600 text-sm">Quality Materials</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 