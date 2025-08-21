'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../../../../../components/auth/AuthProvider';
import GrammarLesson from '../../../../../../../components/grammar/GrammarLesson';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen } from 'lucide-react';

interface GrammarContentData {
  id: string;
  topic_id: string;
  content_type: string;
  title: string;
  content_data: {
    sections: any[];
  };
  difficulty_level: string;
  estimated_duration: number;
}

export default function GrammarLessonPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  
  const [contentData, setContentData] = useState<GrammarContentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const language = params.language as string;
  const category = params.category as string;
  const topic = params.topic as string;
  const slug = params.slug as string;

  useEffect(() => {
    loadLessonContent();
  }, [language, category, topic, slug]);

  const loadLessonContent = async () => {
    try {
      setLoading(true);
      setError(null);

      // First get the topic ID
      const topicsResponse = await fetch(`/api/grammar/topics?language=${language}&category=${category}`);
      const topicsData = await topicsResponse.json();
      
      if (!topicsData.success) {
        throw new Error('Failed to load topics');
      }

      const topicData = topicsData.data.find((t: any) => t.slug === topic);
      if (!topicData) {
        throw new Error('Topic not found');
      }

      // Then get the content for this topic
      const contentResponse = await fetch(`/api/grammar/content?topicId=${topicData.id}&contentType=lesson`);
      const contentData = await contentResponse.json();
      
      if (!contentData.success) {
        throw new Error('Failed to load content');
      }

      const lessonContent = contentData.data.find((c: any) => c.slug === slug);
      if (!lessonContent) {
        throw new Error('Lesson content not found');
      }

      setContentData(lessonContent);
    } catch (error) {
      console.error('Error loading lesson content:', error);
      setError(error instanceof Error ? error.message : 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = async (score: number, timeSpent: number, gemsEarned: number) => {
    try {
      // Save completion to database
      if (contentData && user) {
        await fetch('/api/grammar/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content_id: contentData.id,
            status: 'completed',
            score,
            time_spent_seconds: timeSpent,
            progress_data: {
              gems_earned: gemsEarned,
              completion_date: new Date().toISOString()
            }
          })
        });
      }

      // Navigate back to topic page with success message
      router.push(`/grammar/${language}/${category}/${topic}?completed=lesson&score=${score}&gems=${gemsEarned}`);
    } catch (error) {
      console.error('Error saving lesson completion:', error);
      // Still navigate back even if save fails
      router.push(`/grammar/${language}/${category}/${topic}`);
    }
  };

  const handleExit = () => {
    router.push(`/grammar/${language}/${category}/${topic}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white"
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Lesson</h2>
          <p className="text-purple-200">Preparing your interactive grammar lesson...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !contentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white max-w-md mx-auto p-8"
        >
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Lesson Not Available</h2>
          <p className="text-purple-200 mb-6">
            {error || 'This lesson content is not yet available. Please try another topic.'}
          </p>
          <button
            onClick={handleExit}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Topic</span>
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <GrammarLesson
      contentData={contentData}
      onComplete={handleLessonComplete}
      onExit={handleExit}
      userId={user?.id}
    />
  );
}
