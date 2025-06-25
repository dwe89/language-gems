'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, GraduationCap, Users, ChevronRight, Star, Download, Globe } from 'lucide-react';
import FreebiesBreadcrumb from '../../../components/freebies/FreebiesBreadcrumb';

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
  resourceCount: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

interface FeaturedResource {
  id: string;
  title: string;
  description: string;
  level: string;
  topicArea: string;
  downloadCount: number;
  featured: boolean;
}

const LANGUAGE_CONFIGS = {
  spanish: { 
    name: 'Spanish', 
    flag: '🇪🇸', 
    color: 'from-red-500 to-yellow-500',
    totalResources: 62,
    totalDownloads: '3.2k'
  },
  french: { 
    name: 'French', 
    flag: '🇫🇷', 
    color: 'from-blue-500 to-red-500',
    totalResources: 58,
    totalDownloads: '2.8k'
  },
  german: { 
    name: 'German', 
    flag: '🇩🇪', 
    color: 'from-black to-red-500',
    totalResources: 45,
    totalDownloads: '2.1k'
  },
  italian: { 
    name: 'Italian', 
    flag: '🇮🇹', 
    color: 'from-green-500 to-red-500',
    totalResources: 38,
    totalDownloads: '1.9k'
  }
};

const KEY_STAGES: KeyStage[] = [
  {
    id: 'ks3',
    name: 'Key Stage 3',
    description: 'Foundation vocabulary and grammar for beginners',
    yearGroups: 'Years 7-9 (Ages 11-14)',
    topicCount: 6,
    resourceCount: 28,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'ks4',
    name: 'Key Stage 4',
    description: 'GCSE preparation materials and exam practice',
    yearGroups: 'Years 10-11 (Ages 14-16)',
    topicCount: 5,
    resourceCount: 22,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'ks5',
    name: 'Key Stage 5',
    description: 'A-Level content and advanced language skills',
    yearGroups: 'Years 12-13 (Ages 16-18)',
    topicCount: 4,
    resourceCount: 15,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

export default function LanguagePage({ params }: PageProps) {
  const { language } = params;
  const languageConfig = LANGUAGE_CONFIGS[language as keyof typeof LANGUAGE_CONFIGS];
  
  if (!languageConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Language Not Found</h1>
          <p className="text-gray-600 mb-8">The language you're looking for isn't available yet.</p>
          <Link href="/resources" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const capitalizedLanguage = languageConfig.name;
  
  const breadcrumbItems = [
    { label: 'Resources', href: '/resources' },
    { label: capitalizedLanguage, active: true }
  ];

  // Mock featured resources - these would come from a database in production
  const FEATURED_RESOURCES: FeaturedResource[] = [
    {
      id: 'identity',
      title: `All About Me - Identity and Personality`,
      description: `Perfect starter resource for describing yourself, your family, and personality traits in ${capitalizedLanguage}.`,
      level: 'Beginner',
      topicArea: 'KS3 • Identity',
      downloadCount: Math.floor(Math.random() * 500) + 800,
      featured: true
    },
    {
      id: 'environment',
      title: `The Environment and Climate Change`,
      description: `Advanced vocabulary for discussing environmental issues and climate change for GCSE preparation.`,
      level: 'Advanced',
      topicArea: 'KS4 • Environment',
      downloadCount: Math.floor(Math.random() * 400) + 600,
      featured: true
    },
    {
      id: 'house-home',
      title: `House and Home - Vocabulary Builder`,
      description: `Essential vocabulary for describing your house, rooms, and furniture with practical exercises.`,
      level: 'Beginner',
      topicArea: 'KS3 • House & Home',
      downloadCount: Math.floor(Math.random() * 600) + 700,
      featured: true
    }
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${languageConfig.color} bg-opacity-10`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <FreebiesBreadcrumb items={breadcrumbItems} className="mb-4" />
          
          <div className="flex items-center mb-4">
            <Link 
              href="/resources"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Link>
          </div>
          
          <div className="flex items-center mb-6">
            <div className={`w-16 h-16 bg-gradient-to-r ${languageConfig.color} rounded-xl flex items-center justify-center text-2xl mr-6 shadow-lg`}>
              {languageConfig.flag}
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                {capitalizedLanguage} Resources
              </h1>
              <p className="text-xl text-slate-600">
                Comprehensive {capitalizedLanguage} learning materials organized by key stage
              </p>
            </div>
          </div>

          {/* Language Flag Colors Banner */}
          <div className={`w-full h-2 bg-gradient-to-r ${languageConfig.color} rounded-full mb-6`}></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-3">
              <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{languageConfig.totalResources}</h3>
                <p className="text-slate-600">Total Resources</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-3">
              <GraduationCap className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">15</h3>
                <p className="text-slate-600">Topic Areas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-3">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">{languageConfig.totalDownloads}</h3>
                <p className="text-slate-600">Downloads</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Stages */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-6">Browse by Key Stage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {KEY_STAGES.map((keyStage) => (
              <Link
                key={keyStage.id}
                href={`/resources/${language}/${keyStage.id}`}
                className={`block ${keyStage.bgColor} rounded-xl p-6 border ${keyStage.borderColor} hover:shadow-lg transition-all duration-300 group`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-2xl font-bold ${keyStage.color}`}>
                    {keyStage.name}
                  </h3>
                  <ChevronRight className={`h-6 w-6 ${keyStage.color} group-hover:translate-x-1 transition-transform`} />
                </div>
                
                <p className="text-slate-700 mb-3">{keyStage.description}</p>
                <p className="text-sm text-slate-600 mb-4">{keyStage.yearGroups}</p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className={`font-medium ${keyStage.color}`}>{keyStage.topicCount}</span>
                    <span className="text-slate-600"> Topics</span>
                  </div>
                  <div>
                    <span className={`font-medium ${keyStage.color}`}>{keyStage.resourceCount}</span>
                    <span className="text-slate-600"> Resources</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Resources */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-slate-800">Featured {capitalizedLanguage} Resources</h2>
            <Link 
              href="/resources"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
            >
              Search All Resources
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {FEATURED_RESOURCES.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 text-yellow-500 mr-2" />
                    <span className="text-sm font-medium text-yellow-600">Featured</span>
                  </div>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {resource.level}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-2">{resource.title}</h3>
                <p className="text-slate-600 mb-3">{resource.description}</p>
                
                <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                  <span>{resource.topicArea}</span>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {resource.downloadCount.toLocaleString()}
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  Download Resource
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cross Navigation */}
        <div className="bg-white rounded-xl p-8 border border-slate-200 shadow-sm text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Looking for something specific?
          </h3>
          <p className="text-slate-600 mb-6">
            Use our search and filter tools to find exactly what you need across all languages and topics.
          </p>
          <Link
            href="/resources"
            className="inline-flex items-center bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            <Globe className="h-5 w-5 mr-2" />
            Search All Resources
          </Link>
        </div>
      </div>
    </div>
  );
} 