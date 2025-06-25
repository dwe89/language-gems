'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Download, Eye, Star, Users, BookOpen, Globe, Home, Music, GraduationCap } from 'lucide-react';
import FreebiesBreadcrumb from '../../../../../components/freebies/FreebiesBreadcrumb';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: string;
  level: string;
  featured: boolean;
  fileType: string;
  pages?: number;
  duration?: string;
  skills: string[];
  downloadUrl: string;
  previewUrl?: string;
}

interface TopicData {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

// Topic configurations
const TOPIC_CONFIGS: Record<string, Record<string, TopicData>> = {
  ks3: {
    identity: {
      id: 'identity',
      name: 'Identity & Family',
      description: 'Personal information, describing yourself, family members, and relationships',
      icon: <Users className="h-8 w-8" />,
      color: 'emerald'
    },
    school: {
      id: 'school',
      name: 'School Life',
      description: 'School subjects, facilities, routines, and describing your school experience',
      icon: <GraduationCap className="h-8 w-8" />,
      color: 'blue'
    },
    'free-time': {
      id: 'free-time',
      name: 'Free Time & Hobbies',
      description: 'Sports, music, entertainment, leisure activities, and expressing preferences',
      icon: <Music className="h-8 w-8" />,
      color: 'purple'
    },
    'local-area': {
      id: 'local-area',
      name: 'Local Area',
      description: 'Describing your town, giving directions, transport, and local amenities',
      icon: <Globe className="h-8 w-8" />,
      color: 'orange'
    },
    'house-home': {
      id: 'house-home',
      name: 'House & Home',
      description: 'Rooms, furniture, household items, and describing where you live',
      icon: <Home className="h-8 w-8" />,
      color: 'green'
    },
    'food-drink': {
      id: 'food-drink',
      name: 'Food & Drink',
      description: 'Meals, restaurants, food preferences, and healthy eating vocabulary',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'red'
    }
  },
  ks4: {
    technology: {
      id: 'technology',
      name: 'Technology & Social Media',
      description: 'Digital communication, online safety, and modern technology',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'cyan'
    },
    environment: {
      id: 'environment',
      name: 'Environment & Global Issues',
      description: 'Climate change, conservation, environmental problems and solutions',
      icon: <Globe className="h-8 w-8" />,
      color: 'green'
    },
    'travel-tourism': {
      id: 'travel-tourism',
      name: 'Travel & Tourism',
      description: 'Holidays, transport, cultural experiences, and travel planning',
      icon: <Globe className="h-8 w-8" />,
      color: 'blue'
    },
    'work-career': {
      id: 'work-career',
      name: 'Work & Career',
      description: 'Jobs, work experience, future plans, and career choices',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'purple'
    },
    culture: {
      id: 'culture',
      name: 'Culture & Festivals',
      description: 'Traditions, celebrations, cultural differences, and customs',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'orange'
    }
  },
  ks5: {
    literature: {
      id: 'literature',
      name: 'Literature & Arts',
      description: 'Literary analysis, cultural movements, and artistic expression',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'purple'
    },
    'politics-society': {
      id: 'politics-society',
      name: 'Politics & Society',
      description: 'Government, social issues, current affairs, and political systems',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'red'
    },
    'business-economics': {
      id: 'business-economics',
      name: 'Business & Economics',
      description: 'Commercial language, economic concepts, and business practices',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'blue'
    },
    'science-technology': {
      id: 'science-technology',
      name: 'Science & Technology',
      description: 'Advanced technical vocabulary and scientific concepts',
      icon: <BookOpen className="h-8 w-8" />,
      color: 'green'
    }
  }
};

export default function TopicPage() {
  const params = useParams();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const language = params?.language as string;
  const keyStage = params?.keyStage as string;
  const topic = params?.topic as string;

  const topicConfig = TOPIC_CONFIGS[keyStage]?.[topic];
  
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/freebies/resources?language=${language}&keyStage=${keyStage}&topic=${topic}`);
        if (response.ok) {
          const data = await response.json();
          setResources(data.resources || []);
        }
      } catch (error) {
        console.error('Error fetching resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, [language, keyStage, topic]);

  if (!topicConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Topic Not Found</h1>
          <p className="text-gray-600 mb-8">The topic you're looking for doesn't exist.</p>
          <Link href="/freebies" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const capitalizedLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const keyStageUpper = keyStage.toUpperCase();

  const breadcrumbItems = [
    { label: 'Resources', href: '/freebies' },
    { label: capitalizedLanguage, href: `/freebies/${language}` },
    { label: keyStageUpper, href: `/freebies/${language}/${keyStage}` },
    { label: topicConfig.name, active: true }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600">Loading resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <FreebiesBreadcrumb items={breadcrumbItems} className="mb-4" />
        
        <div className="flex items-center mb-6">
          <Link 
            href={`/freebies/${language}/${keyStage}`}
            className="inline-flex items-center text-emerald-600 hover:opacity-80 mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {keyStageUpper} Topics
          </Link>
          <div className="flex-1">
            <div className="flex items-center mb-3">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-lg mr-4">
                {topicConfig.icon}
              </div>
              <div>
                <div className="flex items-center mb-2">
                  <span className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full text-sm font-medium mr-3">
                    {keyStageUpper} • {capitalizedLanguage}
                  </span>
                  <h1 className="text-4xl font-bold text-slate-800">
                    {topicConfig.name}
                  </h1>
                </div>
                <p className="text-xl text-slate-600">
                  {topicConfig.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-8"></div>

        {resources.length === 0 ? (
          <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center mb-8">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">No Resources Found</h3>
            <p className="text-slate-600 mb-6">
              There are no resources available for this topic yet.
            </p>
            <p className="text-sm text-slate-500">
              Resources can be added through the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            {resources.map((resource) => (
              <div key={resource.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 mr-4">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-bold text-slate-800 mr-2">{resource.title}</h3>
                        {resource.featured && <Star className="h-4 w-4 text-yellow-500" />}
                      </div>
                      <p className="text-slate-600 text-sm mb-3">{resource.description}</p>
                      
                      <div className="flex gap-3">
                        <a
                          href={resource.downloadUrl}
                          className="flex-1 inline-flex items-center justify-center bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                        {resource.previewUrl && (
                          <a
                            href={resource.previewUrl}
                            className="inline-flex items-center justify-center bg-slate-100 text-slate-700 py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl p-8 text-white text-center">
          <div className="mb-4">
            {topicConfig.icon}
          </div>
          <h3 className="text-2xl font-bold mb-3">
            Explore More {topicConfig.name} Resources
          </h3>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Looking for more resources? Check out other {capitalizedLanguage} topics or explore different key stages.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={`/freebies/${language}/${keyStage}`}
              className="inline-flex items-center bg-white/20 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to {keyStageUpper} Topics
            </Link>
            <Link
              href={`/freebies/${language}`}
              className="inline-flex items-center bg-white text-slate-800 px-6 py-3 rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              Explore All {capitalizedLanguage}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
