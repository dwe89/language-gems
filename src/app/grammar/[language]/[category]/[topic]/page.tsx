'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Award, 
  Target, 
  Clock, 
  ArrowLeft,
  Play,
  CheckCircle,
  Star,
  Gem,
  Brain
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useAuth } from '../../../../../components/auth/AuthProvider';
import { GemCard, GemButton } from '../../../../../components/ui/GemTheme';
import ReactCountryFlag from 'react-country-flag';

interface GrammarTopic {
  id: string;
  topic_name: string;
  slug: string;
  language: string;
  category: string;
  difficulty_level: string;
  curriculum_level: string;
  title: string;
  description: string;
  learning_objectives: string[];
  order_position: number;
}

interface GrammarContent {
  id: string;
  topic_id: string;
  content_type: 'lesson' | 'quiz' | 'practice';
  title: string;
  slug: string;
  difficulty_level: string;
  estimated_duration: number;
  order_position: number;
}

const LANGUAGE_INFO = {
  es: { name: 'Spanish', countryCode: 'ES', color: 'from-red-500 to-yellow-500' },
  fr: { name: 'French', countryCode: 'FR', color: 'from-blue-500 to-white' },
  de: { name: 'German', countryCode: 'DE', color: 'from-black to-red-500' }
};

const CONTENT_TYPE_INFO = {
  lesson: { name: 'Lesson', icon: BookOpen, color: 'bg-blue-500', description: 'Interactive learning content' },
  quiz: { name: 'Quiz', icon: Award, color: 'bg-purple-500', description: 'Test your knowledge' },
  practice: { name: 'Practice', icon: Target, color: 'bg-green-500', description: 'Hands-on exercises' }
};

export default function GrammarTopicPage() {
  const params = useParams();
  const { user } = useAuth();
  const language = params.language as string;
  const category = params.category as string;
  const topicSlug = params.topic as string;
  
  const [topic, setTopic] = useState<GrammarTopic | null>(null);
  const [content, setContent] = useState<GrammarContent[]>([]);
  const [loading, setLoading] = useState(true);

  const languageInfo = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO];

  useEffect(() => {
    if (language && category && topicSlug) {
      loadTopicData();
    }
  }, [language, category, topicSlug]);

  const loadTopicData = async () => {
    try {
      setLoading(true);

      // Load topic details
      const topicResponse = await fetch(`/api/grammar/topics?language=${language}&category=${category}`);
      const topicData = await topicResponse.json();
      
      if (topicData.success) {
        const foundTopic = topicData.data.find((t: GrammarTopic) => t.slug === topicSlug);
        if (foundTopic) {
          setTopic(foundTopic);
          
          // Load content for this topic
          const contentResponse = await fetch(`/api/grammar/content?topicId=${foundTopic.id}`);
          const contentData = await contentResponse.json();
          
          if (contentData.success) {
            setContent(contentData.data);
          }
        }
      }
    } catch (error) {
      console.error('Error loading topic data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getContentByType = (type: 'lesson' | 'quiz' | 'practice') => {
    return content.filter(item => item.content_type === type);
  };

  const getTotalDuration = () => {
    return content.reduce((total, item) => total + item.estimated_duration, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading topic...</p>
        </div>
      </div>
    );
  }

  if (!topic || !languageInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">Topic Not Found</h1>
          <Link href="/grammar" className="text-purple-300 hover:text-white">
            ← Back to Grammar Hub
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/grammar/${language}/${category}`}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </Link>
              <div className="flex items-center space-x-3">
                <ReactCountryFlag 
                  countryCode={languageInfo.countryCode} 
                  svg 
                  style={{ width: '2em', height: '2em' }}
                />
                <div>
                  <h1 className="text-3xl font-bold text-white">{topic.title}</h1>
                  <p className="text-purple-200">{topic.description}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                topic.difficulty_level === 'beginner' ? 'bg-green-500' :
                topic.difficulty_level === 'intermediate' ? 'bg-yellow-500' :
                'bg-red-500'
              } text-white`}>
                {topic.difficulty_level}
              </span>
              <span className="px-3 py-1 bg-white/20 text-white rounded-full text-sm font-medium">
                {topic.curriculum_level}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Topic Overview */}
        <div className="mb-8">
          <GemCard className="mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Learning Objectives</h2>
                {topic.learning_objectives && topic.learning_objectives.length > 0 ? (
                  <ul className="space-y-2">
                    {topic.learning_objectives.map((objective, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{objective}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-600">Master the fundamentals of {topic.title.toLowerCase()}.</p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-900">{getTotalDuration()}</p>
                  <p className="text-sm text-purple-600">minutes total</p>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-900">{content.length}</p>
                  <p className="text-sm text-blue-600">activities</p>
                </div>
              </div>
            </div>
          </GemCard>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {(['lesson', 'practice', 'quiz'] as const).map((contentType) => {
            const typeContent = getContentByType(contentType);
            const typeInfo = CONTENT_TYPE_INFO[contentType];
            const TypeIcon = typeInfo.icon;
            
            if (typeContent.length === 0) return null;
            
            return (
              <div key={contentType}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-2 ${typeInfo.color} rounded-lg`}>
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">{typeInfo.name}s</h3>
                    <p className="text-purple-200">{typeInfo.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {typeContent.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 hover:bg-white/15 transition-all duration-300 cursor-pointer"
                      onClick={() => {
                        // Navigate to the content type page (not individual content slug)
                        window.location.href = `/grammar/${language}/${category}/${topicSlug}/${contentType}`;
                      }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{item.title}</h4>
                        <Play className="w-5 h-5 text-purple-300" />
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-purple-200">
                          <Clock className="w-4 h-4" />
                          <span>{item.estimated_duration} min</span>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          item.difficulty_level === 'beginner' ? 'bg-green-500/20 text-green-300' :
                          item.difficulty_level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {item.difficulty_level}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {content.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Content Coming Soon</h3>
            <p className="text-purple-200">
              We're working on creating comprehensive content for this topic.
            </p>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <GemButton
            variant="gem"
            gemType="rare"
            className="w-full justify-center"
            onClick={() => window.location.href = `/grammar/${language}/${category}/${topicSlug}/practice`}
          >
            <Target className="w-4 h-4 mr-2" />
            Start Practice
          </GemButton>
          
          <GemButton
            variant="gem"
            gemType="epic"
            className="w-full justify-center"
            onClick={() => window.location.href = `/grammar/${language}/${category}/${topicSlug}/quiz`}
          >
            <Award className="w-4 h-4 mr-2" />
            Take Quiz
          </GemButton>
          
          <GemButton
            variant="gem"
            gemType="legendary"
            className="w-full justify-center"
            onClick={() => window.location.href = `/grammar/${language}/${category}/${topicSlug}/lesson`}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Start Lesson
          </GemButton>
        </div>
      </div>
    </div>
  );
}
