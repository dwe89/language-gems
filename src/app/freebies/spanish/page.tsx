'use client';

import React from 'react';
import Link from 'next/link';
import FreebiesBreadcrumb from '../../../components/freebies/FreebiesBreadcrumb';
import { BookOpen, Users, GraduationCap, ArrowLeft, Download } from 'lucide-react';

interface KeyStageData {
  id: string;
  name: string;
  description: string;
  yearGroups: string;
  topicCount: number;
  resourceCount: number;
  color: string;
}

const KEY_STAGES: KeyStageData[] = [
  {
    id: 'ks3',
    name: 'KS3 (Years 7-9)',
    description: 'Foundation Spanish vocabulary and grammar',
    yearGroups: 'Years 7-9',
    topicCount: 8,
    resourceCount: 23,
    color: 'green'
  },
  {
    id: 'ks4',
    name: 'KS4 (Years 10-11)',
    description: 'GCSE Spanish preparation materials',
    yearGroups: 'Years 10-11',
    topicCount: 6,
    resourceCount: 18,
    color: 'blue'
  },
  {
    id: 'ks5',
    name: 'KS5 (Years 12-13)',
    description: 'A-Level Spanish advanced topics',
    yearGroups: 'Years 12-13',
    topicCount: 4,
    resourceCount: 8,
    color: 'purple'
  }
];

const FEATURED_RESOURCES = [
  {
    id: 'house-home',
    title: 'House and Home - Vocabulary Builder',
    description: 'Essential vocabulary for describing your house, rooms, and furniture.',
    level: 'KS3',
    pages: 4,
    featured: true
  },
  {
    id: 'ser-vs-estar',
    title: 'Ser vs Estar - Complete Guide',
    description: 'Master the difference between ser and estar with clear explanations.',
    level: 'KS4',
    pages: 8,
    featured: true
  },
  {
    id: 'environment',
    title: 'Environment and Climate Change',
    description: 'Advanced vocabulary for discussing environmental issues.',
    level: 'KS5',
    pages: 7,
    featured: true
  }
];

export default function SpanishFreebiesPage() {
  const breadcrumbItems = [
    { label: 'Freebies', href: '/freebies' },
    { label: 'Spanish', active: true }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      green: {
        bg: 'from-green-50 to-emerald-50',
        border: 'border-green-200',
        text: 'text-green-700',
        button: 'bg-green-600 hover:bg-green-700'
      },
      blue: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        bg: 'from-purple-50 to-violet-50',
        border: 'border-purple-200',
        text: 'text-purple-700',
        button: 'bg-purple-600 hover:bg-purple-700'
      }
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 via-yellow-600 to-red-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="text-6xl">🇪🇸</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Spanish Learning Resources
            </h1>
            <p className="text-xl md:text-2xl text-red-100 mb-8 max-w-3xl mx-auto">
              Comprehensive collection of Spanish worksheets, grammar guides, and practice materials 
              organized by key stage and curriculum requirements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-red-200">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>49 Resources Available</span>
              </div>
              <div className="flex items-center text-red-200">
                <Users className="h-5 w-5 mr-2" />
                <span>All Levels Covered</span>
              </div>
              <div className="flex items-center text-red-200">
                <GraduationCap className="h-5 w-5 mr-2" />
                <span>Exam Focused</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <FreebiesBreadcrumb items={breadcrumbItems} />
          <Link
            href="/freebies"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Freebies Hub
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                Browse Spanish Resources
              </h2>
              <p className="text-slate-600">
                Choose how you'd like to explore our Spanish materials
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/freebies?language=Spanish"
                className="inline-flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Search All Spanish Resources
              </Link>
              <Link
                href="/freebies"
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Browse All Languages
              </Link>
            </div>
          </div>
        </div>

        {/* Key Stages Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            Choose Your Level
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {KEY_STAGES.map((keyStage) => {
              const colors = getColorClasses(keyStage.color);
              return (
                <Link
                  key={keyStage.id}
                  href={`/freebies/spanish/${keyStage.id}`}
                  className={`block bg-gradient-to-br ${colors.bg} rounded-xl p-8 border ${colors.border} hover:shadow-lg transition-all duration-300 group`}
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600">
                      {keyStage.name}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {keyStage.description}
                    </p>
                    <div className="space-y-2 mb-6">
                      <div className={`text-sm font-medium ${colors.text}`}>
                        {keyStage.yearGroups}
                      </div>
                      <div className="text-slate-500 text-sm">
                        {keyStage.topicCount} topics • {keyStage.resourceCount} resources
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-4 py-2 ${colors.button} text-white rounded-lg font-medium transition-colors`}>
                      Explore Topics
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            ⭐ Featured Spanish Resources
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {FEATURED_RESOURCES.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-slate-200">
                <div className="bg-gradient-to-r from-red-500 to-yellow-500 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-semibold text-sm">Featured</span>
                    <span className="text-white text-xs bg-white/20 px-2 py-1 rounded">
                      {resource.level}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">
                    {resource.title}
                  </h3>
                  <p className="text-slate-600 mb-4">
                    {resource.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">
                      {resource.pages} pages
                    </span>
                    <button className="bg-gradient-to-r from-red-600 to-yellow-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-700 hover:to-yellow-700 transition-all">
                      <Download className="h-4 w-4 mr-2 inline" />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Resources CTA */}
        <div className="bg-gradient-to-r from-red-600 to-yellow-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Ready to Explore All Spanish Resources?
          </h2>
          <p className="text-red-100 mb-6 max-w-2xl mx-auto">
            Access our complete collection of Spanish worksheets, grammar guides, 
            and practice materials with advanced search and filtering options.
          </p>
          <Link
            href="/freebies?language=Spanish"
            className="inline-flex items-center bg-white text-red-600 px-8 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
          >
            <Download className="h-5 w-5 mr-2" />
            Browse All Spanish Resources
          </Link>
        </div>
      </div>
    </div>
  );
} 