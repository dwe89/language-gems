'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Gem } from 'lucide-react';
import Link from 'next/link';
import { GemButton } from '../../../../../../components/ui/GemTheme';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';
import { useAuth } from '../../../../../../components/auth/AuthProvider';

interface GrammarContent {
  id: string;
  topic_id: string;
  content_type: string;
  title: string;
  slug: string;
  content_data: any;
  difficulty_level: string;
  estimated_duration: number;
}

const LANGUAGE_INFO = {
  es: { name: 'Spanish', countryCode: 'ES', color: 'from-red-500 to-yellow-500' },
  fr: { name: 'French', countryCode: 'FR', color: 'from-blue-500 to-white' },
  de: { name: 'German', countryCode: 'DE', color: 'from-red-600 to-yellow-400' }
} as const;

// Transform database content to match GrammarPractice component expectations
const transformPracticeData = (contentData: any) => {
  if (!contentData?.exercises) return [];

  const practiceItems: any[] = [];

  contentData.exercises.forEach((exercise: any, exerciseIndex: number) => {
    if (exercise.prompts) {
      exercise.prompts.forEach((prompt: any, promptIndex: number) => {
        practiceItems.push({
          id: `${exerciseIndex}-${promptIndex}`,
          type: 'fill_blank', // Default type based on the sentence structure
          question: prompt.sentence || prompt.question || '',
          answer: prompt.answer || '',
          options: prompt.options || [],
          hint: prompt.explanation || '',
          difficulty: 'intermediate', // Default difficulty
          category: exercise.category || 'Grammar Practice'
        });
      });
    }
  });

  return practiceItems;
};

export default function PracticePage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const language = params?.language as string;
  const category = params?.category as string;
  const topic = params?.topic as string;
  const assignmentId = searchParams?.get('assignment');
  const isPreview = searchParams?.get('preview') === 'true';

  const [practiceContent, setPracticeContent] = useState<GrammarContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPracticeContent() {
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

        // Then get the practice content for this topic
        const contentResponse = await fetch(`/api/grammar/content?topicId=${topicData.id}&contentType=practice`);
        const contentData = await contentResponse.json();

        if (!contentData.success) {
          throw new Error('Failed to load content');
        }

        // Get the first practice content
        const practiceContentItem = contentData.data[0];
        if (!practiceContentItem) {
          throw new Error('No practice content available for this topic');
        }

        setPracticeContent(practiceContentItem);
      } catch (err) {
        console.error('Error fetching practice content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load practice content');
      } finally {
        setLoading(false);
      }
    }

    if (language && category && topic) {
      fetchPracticeContent();
    }
  }, [language, category, topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Gem className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading practice content...</p>
        </div>
      </div>
    );
  }

  if (error || !practiceContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Practice Not Available</h2>
          <p className="text-purple-200 mb-6">{error}</p>
          <Link href={`/grammar/${language}/${category}/${topic}`}>
            <GemButton variant="gem" gemType="rare">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topic
            </GemButton>
          </Link>
        </div>
      </div>
    );
  }

  const languageInfo = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href={`/grammar/${language}/${category}/${topic}`}>
            <GemButton variant="gem" gemType="rare" className="text-white hover:text-purple-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Topic
            </GemButton>
          </Link>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">{practiceContent.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-purple-200">
              <span className="capitalize">{languageInfo?.name}</span>
              <span>•</span>
              <span className="capitalize">{category}</span>
              <span>•</span>
              <span>{practiceContent.estimated_duration} min</span>
            </div>
          </div>

          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Practice Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GrammarPractice
            language={language}
            category={category}
            difficulty={practiceContent.difficulty_level}
            practiceItems={transformPracticeData(practiceContent.content_data)}
            onComplete={async (score, gemsEarned, timeSpent) => {
              console.log('Practice completed!', { score, gemsEarned, timeSpent });

              // If this is an assignment, record assignment progress
              if (assignmentId && user) {
                try {
                  await fetch('/api/assignments/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      assignmentId: assignmentId,
                      gameId: `grammar-practice-${practiceContent.id}`,
                      completed: true,
                      score: score,
                      accuracy: score,
                      timeSpent: timeSpent,
                      wordsCompleted: 1,
                      totalWords: 1,
                      sessionData: {
                        topic_id: practiceContent.topic_id,
                        gems_earned: gemsEarned,
                        completion_type: 'practice'
                      }
                    })
                  });

                  // Navigate back to assignment
                  const previewParam = isPreview ? '?preview=true' : '';
                  router.push(`/student-dashboard/assignments/${assignmentId}${previewParam}`);
                } catch (error) {
                  console.error('Error saving practice completion:', error);
                }
              } else {
                // Navigate back to topic page
                router.push(`/grammar/${language}/${category}/${topic}?completed=practice&score=${score}&gems=${gemsEarned}`);
              }
            }}
            onExit={() => {
              window.location.href = `/grammar/${language}/${category}/${topic}`;
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
