'use client';

import { useState, useEffect } from 'react';
import GrammarPractice from '@/components/grammar/GrammarPractice';
import {Award, FlagIcon, ArrowLeft, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import GrammarTestEditModal from '@/components/admin/GrammarTestEditModal';

interface PageProps {
  params: {
    language: string;
    category: string;
    topic: string;
  };
}

// Map full language names to language codes
const languageCodeMap: Record<string, string> = {
  spanish: 'es',
  french: 'fr',
  german: 'de',
};

export default function GrammarTestPage({ params }: PageProps) {
  const [showTest, setShowTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [topicName, setTopicName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTestData() {
      try {
        const supabase = createClient();
        const languageCode = languageCodeMap[params.language] || params.language;

        // Check if user is admin
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setIsAdmin(currentUser?.email === 'danieletienne89@gmail.com');

        // Get the grammar page title
        const { data: page } = await supabase
          .from('grammar_pages')
          .select('title')
          .eq('language', params.language)
          .eq('category', params.category)
          .eq('topic_slug', params.topic)
          .single();

        if (page) {
          setPageTitle(page.title);
          setTopicName(page.title);
        }

        // Set category name
        setCategoryName(params.category.charAt(0).toUpperCase() + params.category.slice(1));

        // Get the test content from grammar_content via grammar_topics
        const { data: topic } = await supabase
          .from('grammar_topics')
          .select('id')
          .eq('language', languageCode)
          .eq('category', params.category)
          .eq('slug', params.topic)
          .single();

        if (!topic) {
          setError('Test not found');
          setLoading(false);
          return;
        }

        const { data: content } = await supabase
          .from('grammar_content')
          .select('*')
          .eq('topic_id', topic.id)
          .eq('content_type', 'quiz')
          .single();

        if (content && content.content_data) {
          setContentId(content.id);
          // Transform to GrammarPractice format
          setTestData({
            difficulty_level: content.difficulty_level || 'intermediate',
            title: content.title || `${pageTitle} Test`,
            questions: content.content_data.questions || [],
          });
        } else if (content) {
          // Content exists but no questions yet
          setContentId(content.id);
          setTestData({
            difficulty_level: 'intermediate',
            title: `${pageTitle} Test`,
            questions: [],
          });
        } else {
          // No content at all - create placeholder for admin
          if (currentUser?.email === 'danieletienne89@gmail.com') {
            setTestData({
              difficulty_level: 'intermediate',
              title: `${pageTitle} Test`,
              questions: [],
            });
          } else {
            setError('Test content not available');
          }
        }
      } catch (err) {
        console.error('Error fetching test data:', err);
        setError('Failed to load test');
      } finally {
        setLoading(false);
      }
    }

    fetchTestData();
  }, [params.language, params.category, params.topic]);

  // Transform test data to practice items format
  const transformTestData = (questions: any[]) => {
    return questions.map((q: any) => {
      let type: 'conjugation' | 'fill_blank' | 'word_order' | 'translation' = 'fill_blank';
      if (q.type === 'fill_blank') type = 'fill_blank';
      else if (q.type === 'word_order') type = 'word_order';
      else if (q.type === 'translation') type = 'translation';
      else if (q.type === 'conjugation') type = 'conjugation';

      return {
        id: q.id,
        type,
        question: q.question,
        answer: q.correct_answer,
        options: q.options || [],
        hint: q.hint || q.explanation || '',
        difficulty: (q.difficulty || 'beginner') as 'beginner' | 'intermediate' | 'advanced',
        category: params.category,
      };
    });
  };

  const handleTestComplete = (score: number, gemsEarned: number, timeSpent: number) => {
    console.log('Test completed!', { score, gemsEarned, timeSpent });
    setShowTest(false);
  };

  const handleTestExit = () => {
    setShowTest(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading test...</p>
        </div>
      </div>
    );
  }

  if (error || !testData) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link
            href={`/grammar/${params.language}/${params.category}/${params.topic}`}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to {pageTitle || 'Lesson'}
          </Link>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-yellow-900 mb-2">
              Test Not Available
            </h2>
            <p className="text-yellow-700 mb-4">
              {error || 'This test is not yet available.'}
            </p>
            <Link
              href={`/grammar/${params.language}/${params.category}/${params.topic}`}
              className="inline-block px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Return to Lesson
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (showTest) {
    return (
      <GrammarPractice
        language={params.language}
        category={params.category}
        difficulty={testData.difficulty_level}
        practiceItems={transformTestData(testData.questions)}
        topicTitle={testData.title}
        isTestMode={true}
        showHints={false}
        trackProgress={true}
        gamified={true}
        onComplete={handleTestComplete}
        onExit={handleTestExit}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Test Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 border-b border-purple-300 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/grammar/${params.language}/${params.category}/${params.topic}`}
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

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to start the test?
            </h2>
            <p className="text-gray-600 mb-8">
              This test contains {testData.questions.length} questions. Good luck!
            </p>
            <button
              onClick={() => setShowTest(true)}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            >
              Start Test
            </button>
          </div>
        </div>
      </div>

      {/* Admin Edit Button */}
      {isAdmin && testData && (
        <>
          <button
            onClick={() => setShowEditModal(true)}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Edit className="w-5 h-5" />
            <span>{contentId ? 'Edit Test' : 'Create Test'}</span>
          </button>

          {showEditModal && (
            <GrammarTestEditModal
              contentId={contentId || 'new'}
              language={params.language}
              category={params.category}
              topic={params.topic}
              initialData={testData}
              onClose={() => setShowEditModal(false)}
              onSave={() => {
                setShowEditModal(false);
                window.location.reload();
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

