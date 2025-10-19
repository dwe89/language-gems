'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, AlertTriangle, Trophy, Target, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';

interface TestPageProps {
  params: {
    category: string;
    topic: string;
  };
}

export default function TestPage({ params }: TestPageProps) {
  const { user, session, isLoading: authLoading } = useAuth();
  const [topicData, setTopicData] = useState<any>(null);
  const [testContent, setTestContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthWarning, setShowAuthWarning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!session;

  // Format topic name for display
  const formatTopicName = (slug: string) => {
    return slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const topicName = formatTopicName(params.topic);
  const categoryName = formatTopicName(params.category);

  // Transform test content data into practice items format
  const transformTestData = (contentData: any, topicSlug: string) => {
    const practiceItems: any[] = [];

    if (!contentData) {
      return practiceItems;
    }

    // Handle different content data structures
    if (contentData.exercises) {
      // New format with exercises array
      contentData.exercises.forEach((exercise: any, exerciseIndex: number) => {
        const practiceItem = {
          id: `test-${exerciseIndex}`,
          type: exercise.type || 'fill_blank',
          question: exercise.question_text || exercise.question || '',
          answer: exercise.answer || '',
          options: exercise.options || [],
          hint: exercise.hint || '',
          difficulty: exercise.difficulty || 'beginner',
          category: topicSlug
        };
        practiceItems.push(practiceItem);
      });
    } else if (contentData.questions) {
      // Quiz format with questions array
      contentData.questions.forEach((question: any, questionIndex: number) => {
        const practiceItem = {
          id: `test-${questionIndex}`,
          type: question.type || 'multiple_choice',
          question: question.question_text || question.question || '',
          answer: question.correct_answer || question.answer || '',
          options: question.options || [],
          hint: question.hint || question.explanation || '',
          difficulty: question.difficulty || 'beginner',
          category: topicSlug
        };
        practiceItems.push(practiceItem);
      });
    }

    return practiceItems;
  };

  useEffect(() => {
    // If auth is still loading, wait
    if (authLoading) {
      return;
    }

    // Check authentication first
    if (!isAuthenticated) {
      setShowAuthWarning(true);
      setLoading(false);
      return;
    }

    // Load topic data and test content
    const loadTestData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get the topic ID (use 'es' for Spanish)
        const topicsResponse = await fetch(`/api/grammar/topics?language=es&category=${params.category}`);
        const topicsData = await topicsResponse.json();

        if (!topicsData.success) {
          throw new Error('Failed to load topics');
        }

        const topicData = topicsData.data.find((t: any) => t.slug === params.topic);
        if (!topicData) {
          throw new Error('Topic not found');
        }

        // Get test content for this topic (quiz content type)
        const contentType = 'quiz';
        const contentResponse = await fetch(`/api/grammar/content?topicId=${topicData.id}&contentType=${contentType}`);
        const contentData = await contentResponse.json();

        if (!contentData.success) {
          throw new Error('Failed to load test content');
        }

        // Get the first test content
        const testContentItem = contentData.data[0];

        if (!testContentItem) {
          throw new Error(`No test content available for this topic`);
        }

        setTopicData(topicData);
        setTestContent(testContentItem);
      } catch (err) {
        console.error('Error fetching test content:', err);
        setError(err instanceof Error ? err.message : 'Failed to load test content');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && isAuthenticated) {
      loadTestData();
    }
  }, [params.topic, params.category, authLoading, isAuthenticated, user]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading assessment...</p>
          <div className="mt-4 text-sm text-gray-500 space-y-1">
            <p>Auth: {authLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not authenticated'}</p>
            <p>Test Content: {testContent ? 'Loaded' : 'Not loaded'}</p>
            <p>Topic Data: {topicData ? 'Loaded' : 'Not loaded'}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show authentication warning
  if (showAuthWarning) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Link
            href={`/grammar/spanish/${params.category}/${params.topic}/challenge`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenge Selection
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-red-200">
            <div className="text-center">
              <div className="bg-red-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-red-600 mx-auto" />
              </div>
              
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Authentication Required
              </h1>
              
              <p className="text-gray-600 mb-6">
                You must be signed in with a paid LanguageGems account to take official assessments.
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/auth/login"
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Sign In to Continue
                </Link>
                
                <Link
                  href={`/grammar/spanish/${params.category}/${params.topic}/practice`}
                  className="block w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  Try Practice Mode Instead
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show no content available
  if (!topicData) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-2xl mx-auto pt-20">
          <Link
            href={`/grammar/spanish/${params.category}/${params.topic}/challenge`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Challenge Selection
          </Link>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center">
              <div className="bg-gray-100 p-4 rounded-full w-16 h-16 mx-auto mb-6">
                <AlertTriangle className="h-8 w-8 text-gray-600 mx-auto" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Assessment Not Available
              </h1>

              <p className="text-gray-600 mb-6">
                The official assessment for this topic is not yet available. Please try practice mode instead.
              </p>

              <div className="mt-4 text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
                <p><strong>Debug Info:</strong></p>
                <p>Auth Loading: {authLoading ? 'Yes' : 'No'}</p>
                <p>Is Authenticated: {isAuthenticated ? 'Yes' : 'No'}</p>
                <p>Loading: {loading ? 'Yes' : 'No'}</p>
                <p>Topic Data: {topicData ? 'Loaded' : 'NULL'}</p>
                <p>Test Content: {testContent ? 'Loaded' : 'NULL'}</p>
                <p>Error: {error || 'None'}</p>
              </div>

              <Link
                href={`/grammar/spanish/${params.category}/${params.topic}/practice`}
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-4"
              >
                Try Practice Mode
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the test interface - similar to practice but with test styling
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Test Header - Similar to practice but with test indicators */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-b border-purple-300 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/grammar/spanish/${params.category}/${params.topic}/challenge`}
                className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="font-medium">Exit Test</span>
              </Link>

              <div className="border-l border-white/30 pl-4">
                <h1 className="text-xl font-bold text-white">
                  {topicName} Test
                </h1>
                <p className="text-purple-200 text-sm">
                  {categoryName} • Official Assessment
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-red-500/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-red-400/30">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-red-100 text-sm font-bold">LIVE TEST</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Test Content - No scrolling needed */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {testContent ? (
            <GrammarPractice
              language="spanish"
              category={params.category}
              difficulty={testContent.difficulty_level || "intermediate"}
              practiceItems={transformTestData(testContent.content_data, params.topic)}
              topicTitle={testContent.title || topicName}
              isTestMode={true}
              showHints={false}
              trackProgress={true}
              gamified={true}
              onComplete={(score, gemsEarned, timeSpent) => {
                console.log('Test completed!', { score, gemsEarned, timeSpent });
                // Handle test completion - could redirect to results page
              }}
              onExit={() => {
                window.location.href = `/grammar/spanish/${params.category}/${params.topic}/challenge`;
              }}
            />
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                <Target className="w-12 h-12 mx-auto mb-2" />
                <p className="text-lg">No test content available</p>
                <p className="text-sm">Please try again later or contact support if this persists.</p>
              </div>
              <Link
                href={`/grammar/spanish/${params.category}/${params.topic}/challenge`}
                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Return to Menu
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
