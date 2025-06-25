'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import FreebiesBreadcrumb from '../../../../components/freebies/FreebiesBreadcrumb';
import { 
  ArrowLeft, Download, Search, Users, Home, BookOpen, 
  Music, Globe, UtensilsCrossed, Star 
} from 'lucide-react';

interface Topic {
  id: string;
  name: string;
  description: string;
  resourceCount: number;
  icon: React.ReactNode;
  featured?: boolean;
  resources: {
    id: string;
    title: string;
    description: string;
    pages: number;
    level: string;
  }[];
}

const TOPICS: Topic[] = [
  {
    id: 'identity',
    name: 'Identity & Family',
    description: 'Personal information, family members, relationships, and describing people',
    resourceCount: 5,
    icon: <Users className="h-6 w-6" />,
    featured: true,
    resources: [
      {
        id: 'all-about-me',
        title: 'All About Me - Identity and Personality',
        description: 'Describe yourself, your family, and personality traits.',
        pages: 3,
        level: 'Beginner'
      },
      {
        id: 'family-members',
        title: 'Family Members and Relationships',
        description: 'Complete vocabulary for family members and descriptions.',
        pages: 4,
        level: 'Beginner'
      }
    ]
  },
  {
    id: 'school',
    name: 'School Life',
    description: 'Subjects, facilities, school routines, and education vocabulary',
    resourceCount: 4,
    icon: <BookOpen className="h-6 w-6" />,
    resources: [
      {
        id: 'school-subjects',
        title: 'School Subjects and Timetables',
        description: 'Learn all school subjects and how to talk about your timetable.',
        pages: 3,
        level: 'Beginner'
      },
      {
        id: 'school-facilities',
        title: 'School Facilities and Rules',
        description: 'Vocabulary for school buildings, rooms, and school rules.',
        pages: 4,
        level: 'Beginner'
      }
    ]
  },
  {
    id: 'free-time',
    name: 'Free Time & Hobbies',
    description: 'Sports, music, entertainment, leisure activities, and expressing preferences',
    resourceCount: 6,
    icon: <Music className="h-6 w-6" />,
    featured: true,
    resources: [
      {
        id: 'free-time-activities',
        title: 'Free Time Activities and Hobbies',
        description: 'Express your interests and talk about leisure activities.',
        pages: 5,
        level: 'Beginner'
      },
      {
        id: 'sports',
        title: 'Sports and Exercise',
        description: 'Complete sports vocabulary and expressing preferences.',
        pages: 4,
        level: 'Beginner'
      }
    ]
  },
  {
    id: 'local-area',
    name: 'Local Area & Town',
    description: 'Towns, directions, transport, shopping, and local amenities',
    resourceCount: 4,
    icon: <Globe className="h-6 w-6" />,
    resources: [
      {
        id: 'my-town',
        title: 'My Town and Local Area',
        description: 'Describe your town and local amenities.',
        pages: 5,
        level: 'Intermediate'
      },
      {
        id: 'directions',
        title: 'Directions and Transport',
        description: 'Give and follow directions, talk about transport.',
        pages: 4,
        level: 'Intermediate'
      }
    ]
  },
  {
    id: 'house-home',
    name: 'House & Home',
    description: 'Rooms, furniture, household items, and describing your home',
    resourceCount: 3,
    icon: <Home className="h-6 w-6" />,
    featured: true,
    resources: [
      {
        id: 'house-rooms',
        title: 'House and Home - Vocabulary Builder',
        description: 'Essential vocabulary for describing your house and rooms.',
        pages: 4,
        level: 'Beginner'
      },
      {
        id: 'furniture',
        title: 'Furniture and Household Items',
        description: 'Complete furniture vocabulary with descriptions.',
        pages: 3,
        level: 'Beginner'
      }
    ]
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    description: 'Meals, restaurants, shopping for food, and healthy eating',
    resourceCount: 4,
    icon: <UtensilsCrossed className="h-6 w-6" />,
    resources: [
      {
        id: 'food-vocabulary',
        title: 'Food and Drink Vocabulary',
        description: 'Essential food vocabulary and meal times.',
        pages: 5,
        level: 'Beginner'
      },
      {
        id: 'restaurant',
        title: 'At the Restaurant',
        description: 'Ordering food, restaurant etiquette, and preferences.',
        pages: 4,
        level: 'Intermediate'
      }
    ]
  }
];

export default function KS3SpanishPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  const breadcrumbItems = [
    { label: 'Freebies', href: '/freebies' },
    { label: 'Spanish', href: '/freebies/spanish' },
    { label: 'KS3 (Years 7-9)', active: true }
  ];

  const filteredTopics = TOPICS.filter(topic => 
    !searchTerm || 
    topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const featuredTopics = TOPICS.filter(topic => topic.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-green-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="text-6xl">📚</div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              KS3 Spanish Resources
            </h1>
            <p className="text-xl md:text-2xl text-green-100 mb-8 max-w-3xl mx-auto">
              Foundation level Spanish resources for Years 7-9. Build vocabulary 
              and grammar skills with topic-based worksheets and activities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center text-green-200">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>23 Resources Available</span>
              </div>
              <div className="flex items-center text-green-200">
                <Users className="h-5 w-5 mr-2" />
                <span>Years 7-9</span>
              </div>
              <div className="flex items-center text-green-200">
                <Star className="h-5 w-5 mr-2" />
                <span>Beginner Friendly</span>
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
            href="/freebies/spanish"
            className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Spanish Resources
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">
                KS3 Spanish Topics
              </h2>
              <p className="text-slate-600">
                Choose a topic to explore resources or search all KS3 materials
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/freebies?language=Spanish&yearGroup=KS3"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Search className="h-4 w-4 mr-2" />
                Search All KS3 Resources
              </Link>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
        </div>

        {/* Featured Topics */}
        {!searchTerm && featuredTopics.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
              ⭐ Popular KS3 Topics
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredTopics.map((topic) => (
                <div key={topic.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-green-200">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold text-sm">Featured</span>
                      <div className="text-white">
                        {topic.icon}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-3">
                      {topic.name}
                    </h3>
                    <p className="text-slate-600 mb-4">
                      {topic.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-slate-500">
                        {topic.resourceCount} resources
                      </span>
                    </div>
                    
                    <Link
                      href={`/freebies/spanish/ks3/${topic.id}`}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-2 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all inline-block text-center"
                    >
                      Explore Topic
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Topics Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
            {searchTerm ? 'Search Results' : 'All KS3 Topics'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTopics.map((topic) => (
              <div key={topic.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-200">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="p-3 bg-green-100 rounded-lg mr-4 text-green-600">
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {topic.name}
                      </h3>
                      <span className="text-sm text-slate-500">
                        {topic.resourceCount} resources
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 mb-4 text-sm">
                    {topic.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    {topic.resources.slice(0, 2).map((resource) => (
                      <div key={resource.id} className="text-xs text-slate-500 bg-slate-50 p-2 rounded">
                        • {resource.title}
                      </div>
                    ))}
                    {topic.resources.length > 2 && (
                      <div className="text-xs text-slate-400">
                        +{topic.resources.length - 2} more resources
                      </div>
                    )}
                  </div>
                  
                  <Link
                    href={`/freebies/spanish/ks3/${topic.id}`}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors inline-block text-center text-sm"
                  >
                    View Resources
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTopics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-medium text-slate-600 mb-2">
              No topics found
            </h3>
            <p className="text-slate-500">
              Try adjusting your search or browse all topics
            </p>
          </div>
        )}

        {/* Browse All CTA */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Need More Advanced Resources?
          </h2>
          <p className="text-green-100 mb-6 max-w-2xl mx-auto">
            Ready to move to GCSE level? Explore our KS4 Spanish resources 
            designed for Years 10-11 and exam preparation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/freebies/spanish/ks4"
              className="inline-flex items-center bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
            >
              Explore KS4 Spanish
            </Link>
            <Link
              href="/freebies?language=Spanish"
              className="inline-flex items-center border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              <Search className="h-4 w-4 mr-2" />
              Browse All Spanish
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 