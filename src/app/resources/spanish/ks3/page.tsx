'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ChevronRight, Search, Users, BookOpen, Globe, Home, Music, GraduationCap, Download, Star, Filter } from 'lucide-react';
import FreebiesBreadcrumb from '../../../../components/freebies/FreebiesBreadcrumb';

interface Topic {
  id: string;
  name: string;
  description: string;
  resourceCount: number;
  icon: React.ReactNode;
  featured: boolean;
  sampleResources: SampleResource[];
}

interface SampleResource {
  title: string;
  type: string;
  level: string;
}

const TOPICS: Topic[] = [
  {
    id: 'identity',
    name: 'Identity & Family',
    description: 'Personal information, describing yourself, family members, and relationships',
    resourceCount: 8,
    icon: <Users className="h-6 w-6" />,
    featured: true,
    sampleResources: [
      { title: 'All About Me - Vocabulary Builder', type: 'Worksheet', level: 'Beginner' },
      { title: 'Family Members Practice', type: 'Exercise', level: 'Beginner' },
      { title: 'Describing People', type: 'Grammar Guide', level: 'Beginner' }
    ]
  },
  {
    id: 'school',
    name: 'School Life',
    description: 'School subjects, facilities, routines, and describing your school experience',
    resourceCount: 6,
    icon: <GraduationCap className="h-6 w-6" />,
    featured: false,
    sampleResources: [
      { title: 'School Subjects Vocabulary', type: 'Worksheet', level: 'Beginner' },
      { title: 'My School Day Timetable', type: 'Activity', level: 'Beginner' },
      { title: 'School Facilities Guide', type: 'Reference', level: 'Beginner' }
    ]
  },
  {
    id: 'free-time',
    name: 'Free Time & Hobbies',
    description: 'Sports, music, entertainment, leisure activities, and expressing preferences',
    resourceCount: 7,
    icon: <Music className="h-6 w-6" />,
    featured: true,
    sampleResources: [
      { title: 'Sports and Activities Vocabulary', type: 'Worksheet', level: 'Beginner' },
      { title: 'Expressing Likes and Dislikes', type: 'Grammar', level: 'Beginner' },
      { title: 'Weekend Activities Practice', type: 'Exercise', level: 'Beginner' }
    ]
  },
  {
    id: 'local-area',
    name: 'Local Area',
    description: 'Describing your town, giving directions, transport, and local amenities',
    resourceCount: 5,
    icon: <Globe className="h-6 w-6" />,
    featured: false,
    sampleResources: [
      { title: 'Places in Town Vocabulary', type: 'Worksheet', level: 'Intermediate' },
      { title: 'Giving Directions Practice', type: 'Activity', level: 'Intermediate' },
      { title: 'Transport Methods Guide', type: 'Reference', level: 'Beginner' }
    ]
  },
  {
    id: 'house-home',
    name: 'House & Home',
    description: 'Rooms, furniture, household items, and describing where you live',
    resourceCount: 6,
    icon: <Home className="h-6 w-6" />,
    featured: true,
    sampleResources: [
      { title: 'House and Home Vocabulary Builder', type: 'Worksheet', level: 'Beginner' },
      { title: 'Rooms and Furniture', type: 'Exercise', level: 'Beginner' },
      { title: 'Describing Your House', type: 'Speaking Practice', level: 'Beginner' }
    ]
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    description: 'Meals, restaurants, food preferences, and healthy eating vocabulary',
    resourceCount: 4,
    icon: <BookOpen className="h-6 w-6" />,
    featured: false,
    sampleResources: [
      { title: 'Food and Drink Vocabulary', type: 'Worksheet', level: 'Beginner' },
      { title: 'At the Restaurant Dialogue', type: 'Speaking', level: 'Intermediate' },
      { title: 'Healthy Eating Discussion', type: 'Activity', level: 'Intermediate' }
    ]
  }
];

const breadcrumbItems = [
  { label: 'Resources', href: '/resources' },
  { label: 'Spanish', href: '/resources/spanish' },
  { label: 'KS3', active: true }
];

export default function SpanishKS3Page() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'featured' | 'high-resource'>('all');

  const filteredTopics = TOPICS.filter(topic => {
    if (selectedFilter === 'featured') return topic.featured;
    if (selectedFilter === 'high-resource') return topic.resourceCount >= 6;
    return true;
  });

  const totalResources = TOPICS.reduce((sum, topic) => sum + topic.resourceCount, 0);
  const featuredCount = TOPICS.filter(topic => topic.featured).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <FreebiesBreadcrumb items={breadcrumbItems} className="mb-4" />
          
          <div className="flex items-center mb-4">
            <Link 
              href="/resources/spanish"
              className="inline-flex items-center text-green-600 hover:text-green-700 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Spanish
            </Link>
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium mr-3">
                  KS3
                </span>
                <h1 className="text-4xl font-bold text-slate-800">
                  Foundation Spanish Topics
                </h1>
              </div>
              <p className="text-xl text-slate-600">
                Essential vocabulary and grammar for Years 7-9
              </p>
            </div>
          </div>

          {/* KS3 Color Banner */}
          <div className="w-full h-2 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mb-6"></div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{TOPICS.length}</div>
              <div className="text-sm text-slate-600">Topics</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalResources}</div>
              <div className="text-sm text-slate-600">Resources</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{featuredCount}</div>
              <div className="text-sm text-slate-600">Featured</div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Years 7-9</div>
              <div className="text-sm text-slate-600">Age Group</div>
            </div>
          </div>
        </div>

        {/* Filter Options */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-lg font-bold text-slate-800 mb-1">Browse Topics</h3>
              <p className="text-slate-600">Choose a topic area to explore specific resources</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-slate-500" />
                <span className="text-sm text-slate-600">Filter:</span>
              </div>
              
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectedFilter('all')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === 'all' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  All Topics
                </button>
                <button
                  onClick={() => setSelectedFilter('featured')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === 'featured' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Featured
                </button>
                <button
                  onClick={() => setSelectedFilter('high-resource')}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    selectedFilter === 'high-resource' 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-800'
                  }`}
                >
                  Most Resources
                </button>
              </div>
              
              <Link
                href="/resources?language=Spanish&level=KS3"
                className="inline-flex items-center text-green-600 hover:text-green-700 font-medium text-sm"
              >
                <Search className="h-4 w-4 mr-1" />
                Search All
              </Link>
            </div>
          </div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {filteredTopics.map((topic) => (
            <div key={topic.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* Topic Header */}
              <div className="p-6 border-b border-slate-100">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <div className="bg-green-100 text-green-600 p-3 rounded-lg mr-4">
                      {topic.icon}
                    </div>
                    <div>
                      <div className="flex items-center mb-1">
                        <h3 className="text-xl font-bold text-slate-800 mr-2">{topic.name}</h3>
                        {topic.featured && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <p className="text-slate-600">{topic.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">{topic.resourceCount}</div>
                    <div className="text-xs text-slate-500">resources</div>
                  </div>
                </div>
              </div>

              {/* Sample Resources */}
              <div className="p-6">
                <h4 className="text-sm font-medium text-slate-800 mb-3">Sample Resources:</h4>
                <div className="space-y-2 mb-4">
                  {topic.sampleResources.map((resource, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{resource.title}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                          {resource.type}
                        </span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {resource.level}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <Link
                  href={`/freebies/spanish/ks3/${topic.id}`}
                  className="w-full inline-flex items-center justify-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Explore {topic.name}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Looking for something specific?</h3>
            <p className="text-slate-600 mb-4">
              Use our advanced search to find resources across all Spanish topics and levels.
            </p>
            <Link
              href="/resources?language=Spanish"
              className="inline-flex items-center bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              <Search className="h-4 w-4 mr-2" />
              Search All Spanish Resources
            </Link>
          </div>

          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h3 className="text-xl font-bold text-slate-800 mb-3">Ready for the next level?</h3>
            <p className="text-slate-600 mb-4">
              Explore KS4 topics for more advanced Spanish vocabulary and grammar.
            </p>
            <Link
                              href="/resources/spanish/ks4"
              className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <GraduationCap className="h-4 w-4 mr-2" />
              Explore KS4 Topics
            </Link>
          </div>
        </div>

        {/* Featured Resources Callout */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white text-center">
          <Star className="h-12 w-12 text-yellow-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-3">
            Most Popular KS3 Spanish Resources
          </h3>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Our featured topics contain the most downloaded and highly-rated resources for foundation Spanish learners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
                              href="/resources/spanish/ks3/identity"
              className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              <Users className="h-5 w-5 mr-2" />
              Identity & Family
            </Link>
            <Link
                              href="/resources/spanish/ks3/house-home"
              className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-medium hover:bg-green-50 transition-colors"
            >
              <Home className="h-5 w-5 mr-2" />
              House & Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 