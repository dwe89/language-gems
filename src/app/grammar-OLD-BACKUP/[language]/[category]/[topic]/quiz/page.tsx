'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Gem } from 'lucide-react';
import Link from 'next/link';
import { GemButton } from '../../../../../../components/ui/GemTheme';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';
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

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const language = params?.language as string;
  const category = params?.category as string;
  const topic = params?.topic as string;
  const assignmentId = searchParams?.get('assignment');
  const isPreview = searchParams?.get('preview') === 'true';

  const [quizContent, setQuizContent] = useState<GrammarContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchQuizContent() {
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

        // Then get the quiz content for this topic
        const contentResponse = await fetch(`/api/grammar/content?topicId=${topicData.id}&contentType=quiz`);
        const contentData = await contentResponse.json();

        if (!contentData.success) {
          throw new Error('Failed to load content');
        }

        // Get the first quiz content
        const quizContentItem = contentData.data[0];
        if (!quizContentItem) {
          throw new Error('No quiz content available for this topic');
        }

        setQuizContent(quizContentItem);
      } catch (err) {
        console.error('Error fetching quiz content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz content');
      } finally {
        setLoading(false);
      }
    }

    if (language && category && topic) {
      fetchQuizContent();
    }
  }, [language, category, topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Gem className="w-12 h-12 text-purple-400 animate-spin mx-auto mb-4" />
          <p className="text-white">Loading quiz content...</p>
        </div>
      </div>
    );
  }

  if (error || !quizContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <Award className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Quiz Not Available</h2>
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
            <h1 className="text-3xl font-bold text-white mb-2">{quizContent.title}</h1>
            <div className="flex items-center justify-center space-x-4 text-purple-200">
              <span className="capitalize">{languageInfo?.name}</span>
              <span>•</span>
              <span className="capitalize">{category}</span>
              <span>•</span>
              <span>{quizContent.estimated_duration} min</span>
            </div>
          </div>

          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>

        {/* Quiz Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GrammarQuiz
            quizData={{
              id: quizContent.id,
              title: quizContent.title,
              description: `Test your knowledge of ${topic.replace('-', ' ')}`,
              difficulty_level: quizContent.difficulty_level,
              estimated_duration: quizContent.estimated_duration,
              questions: quizContent.content_data?.questions?.map((q: any, index: number) => ({
                id: `question-${index}`,
                question_text: q.question,
                question_type: q.type || 'multiple_choice',
                correct_answer: q.correct_answer,
                options: q.options,
                explanation: q.explanation,
                difficulty_level: q.difficulty || quizContent.difficulty_level,
                hint_text: q.hint
              })) || []
            }}
            onComplete={async (score, answers, timeSpent) => {
              console.log('Quiz completed!', { score, answers, timeSpent });

              // Calculate gems earned (fixed amount for quizzes)
              const gemsEarned = 15; // Fixed gems for quiz completion

              // If this is an assignment, record assignment progress
              if (assignmentId && user) {
                try {
                  await fetch('/api/assignments/progress', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      assignmentId: assignmentId,
                      gameId: `grammar-quiz-${quizContent.id}`,
                      completed: true,
                      score: score,
                      accuracy: score,
                      timeSpent: timeSpent,
                      wordsCompleted: answers.length,
                      totalWords: answers.length,
                      sessionData: {
                        topic_id: quizContent.topic_id,
                        gems_earned: gemsEarned,
                        completion_type: 'quiz',
                        answers: answers
                      }
                    })
                  });

                  // Navigate back to assignment
                  const previewParam = isPreview ? '?preview=true' : '';
                  router.push(`/student-dashboard/assignments/${assignmentId}${previewParam}`);
                } catch (error) {
                  console.error('Error saving quiz completion:', error);
                }
              } else {
                // Navigate back to topic page
                router.push(`/grammar/${language}/${category}/${topic}?completed=quiz&score=${score}&gems=${gemsEarned}`);
              }
            }}
            onExit={() => {
              window.location.href = `/grammar/${language}/${category}/${topic}`;
            }}
            showHints={true}
            timeLimit={quizContent.content_data?.time_limit}
          />
        </motion.div>
      </div>
    </div>
  );
}
