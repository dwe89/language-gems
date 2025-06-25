'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Star, Download, Users, BookOpen, Globe, GraduationCap } from 'lucide-react';
import FreebiesBreadcrumb from '../../../components/freebies/FreebiesBreadcrumb';

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

const KEY_STAGES: KeyStage[] = [
  {
    id: 'ks3',
    name: 'KS3',
    description: 'Foundation Spanish for beginners',
    yearGroups: 'Years 7-9',
    topicCount: 6,
    resourceCount: 28,
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'ks4',
    name: 'KS4',
    description: 'GCSE Spanish preparation',
    yearGroups: 'Years 10-11',
    topicCount: 5,
    resourceCount: 22,
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  },
  {
    id: 'ks5',
    name: 'KS5',
    description: 'A-Level Spanish advanced topics',
    yearGroups: 'Years 12-13',
    topicCount: 4,
    resourceCount: 12,
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  }
];

const FEATURED_RESOURCES: FeaturedResource[] = [
  {
    id: 'house-home',
    title: 'House and Home - Vocabulary Builder',
    description: 'Essential vocabulary for describing your house, rooms, and furniture with practical exercises.',
    level: 'Beginner',
    topicArea: 'KS3 • House & Home',
    downloadCount: 1247,
    featured: true
  },
  {
    id: 'environment',
    title: 'The Environment and Climate Change',
    description: 'Advanced vocabulary for discussing environmental issues and climate change for GCSE preparation.',
    level: 'Advanced',
    topicArea: 'KS4 • Environment',
    downloadCount: 892,
    featured: true
  },
  {
    id: 'identity',
    title: 'All About Me - Identity and Personality',
    description: 'Perfect starter resource for describing yourself, your family, and personality traits.',
    level: 'Beginner',
    topicArea: 'KS3 • Identity',
    downloadCount: 1156,
    featured: true
  }
];

  const breadcrumbItems = [
    { label: 'Resources', href: '/resources' },
    { label: 'Spanish', active: true }
  ];

export default function SpanishFreebiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-yellow-50 to-orange-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <FreebiesBreadcrumb items={breadcrumbItems} className="mb-4" />
          
          <div className="flex items-center mb-4">
            <Link 
              href="/resources"
              className="inline-flex items-center text-red-600 hover:text-red-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Resources
            </Link>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-slate-800 mb-2">
                Spanish Resources
              </h1>
              <p className="text-xl text-slate-600">
                Comprehensive Spanish learning materials organized by key stage
              </p>
            </div>
          </div>

          {/* Spain Flag Colors Banner */}
          <div className="w-full h-2 bg-gradient-to-r from-red-500 via-yellow-400 to-red-500 rounded-full mb-6"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-3">
              <BookOpen className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">62</h3>
                <p className="text-slate-600">Total Resources</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-3">
              <GraduationCap className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">15</h3>
                <p className="text-slate-600">Topic Areas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center mb-3">
              <Users className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <h3 className="text-2xl font-bold text-slate-800">3.2k</h3>
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
                href={`/resources/spanish/${keyStage.id}`}
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
            <h2 className="text-3xl font-bold text-slate-800">Featured Spanish Resources</h2>
            <Link 
              href="/resources"
              className="inline-flex items-center text-red-600 hover:text-red-700 font-medium"
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
                
                <button className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium">
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