'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import GrammarPractice from '@/components/grammar/GrammarPractice';
import { ArrowLeft, Loader2, Edit } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import GrammarTestEditModal from '@/components/admin/GrammarTestEditModal';
import { GrammarSessionService } from '@/services/grammar/GrammarSessionService';

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

export default function GrammarPracticePage({ params }: PageProps) {
  const searchParams = useSearchParams();
  const assignmentId = searchParams.get('assignment');
  const isAssignmentMode = !!assignmentId;

  const [showPractice, setShowPractice] = useState(false);
  const [loading, setLoading] = useState(true);
  const [practiceData, setPracticeData] = useState<any>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [topicName, setTopicName] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [contentId, setContentId] = useState<string | null>(null);
  const [questionCount, setQuestionCount] = useState(15); // Default to Standard Practice
  const [topicId, setTopicId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [sessionService] = useState(() => new GrammarSessionService());

  useEffect(() => {
    async function fetchPracticeData() {
      try {
        const supabase = createClient();
        const languageCode = languageCodeMap[params.language] || params.language;

        // Check if user is admin and get user ID
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setIsAdmin(currentUser?.email === 'danieletienne89@gmail.com');
        setUserId(currentUser?.id || null);

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

        // Get the practice content from grammar_content via grammar_topics
        const { data: topic } = await supabase
          .from('grammar_topics')
          .select('id')
          .eq('language', languageCode)
          .eq('category', params.category)
          .eq('slug', params.topic)
          .single();

        if (!topic) {
          setError('Practice not found');
          setLoading(false);
          return;
        }

        // Store topic ID for session tracking
        setTopicId(topic.id);

        const { data: content } = await supabase
          .from('grammar_content')
          .select('*')
          .eq('topic_id', topic.id)
          .eq('content_type', 'practice')
          .single();

        if (content && content.content_data) {
          setContentId(content.id);
          // Transform to GrammarPractice format
          setPracticeData({
            difficulty_level: content.difficulty_level || 'beginner',
            title: content.title || `${pageTitle} Practice`,
            questions: content.content_data.questions || [],
          });
        } else if (content) {
          // Content exists but no questions yet
          setContentId(content.id);
          setPracticeData({
            difficulty_level: 'beginner',
            title: `${pageTitle} Practice`,
            questions: [],
          });
        } else {
          // No content at all - create placeholder for admin
          if (currentUser?.email === 'danieletienne89@gmail.com') {
            setPracticeData({
              difficulty_level: 'beginner',
              title: `${pageTitle} Practice`,
              questions: [],
            });
          } else {
            setError('Practice content not available');
          }
        }
      } catch (err) {
        console.error('Error fetching practice data:', err);
        setError('Failed to load practice');
      } finally {
        setLoading(false);
      }
    }

    fetchPracticeData();
  }, [params.language, params.category, params.topic]);

  // Transform practice data to practice items format
  const transformPracticeData = (questions: any[], count: number) => {
    // Shuffle and take the specified number of questions
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, count);

    return selected.map((q: any) => {
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

  const handlePracticeComplete = async (score: number, gemsEarned: number, timeSpent: number) => {
    console.log('Practice completed!', { score, gemsEarned, timeSpent });

    // If in assignment mode, the session is already tracked by GrammarSessionService
    // via the GrammarPractice component

    setShowPractice(false);
  };

  const handlePracticeExit = () => {
    setShowPractice(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading practice...</p>
        </div>
      </div>
    );
  }

  if (error || !practiceData) {
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
              Practice Not Available
            </h2>
            <p className="text-yellow-700 mb-4">
              {error || 'This practice is not yet available.'}
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

  if (showPractice) {
    return (
      <GrammarPractice
        language={params.language}
        category={params.category}
        difficulty={practiceData.difficulty_level}
        practiceItems={transformPracticeData(practiceData.questions, questionCount)}
        topicTitle={practiceData.title}
        isTestMode={false}
        showHints={true}
        trackProgress={isAssignmentMode}
        gamified={true}
        onComplete={handlePracticeComplete}
        onExit={handlePracticeExit}
        assignmentId={assignmentId || undefined}
        topicId={topicId || undefined}
        contentId={contentId || undefined}
        userId={userId || undefined}
        questionCount={questionCount}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Practice Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 border-b border-green-300 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/grammar/${params.language}/${params.category}/${params.topic}`}
                className="inline-flex items-center text-white/80 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="font-medium">Exit Practice</span>
              </Link>

              <div className="border-l border-white/30 pl-4">
                <h1 className="text-xl font-bold text-white">
                  {topicName} Practice
                </h1>
                <p className="text-green-200 text-sm">
                  {categoryName} • Practice Mode
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Choose Your Practice Mode
            </h2>
            <p className="text-xl text-gray-600">
              {topicName} - Practice
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {practiceData.questions.length} questions available
            </p>
          </div>

          {/* Practice Mode Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Quick Practice */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-green-500 transition-all">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Quick Practice</h3>
                <p className="text-sm text-gray-600">Fast Review</p>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <span className="font-semibold">10 questions</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                  <span>3-5 min</span>
                </div>
                <p className="text-sm text-gray-600 text-center mt-3">
                  Perfect for maintaining streaks and quick reviews on-the-go
                </p>
              </div>
              <button
                onClick={() => {
                  setQuestionCount(10);
                  setShowPractice(true);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
              >
                Start Practice
              </button>
            </div>

            {/* Standard Practice */}
            <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-green-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-1 rounded-full text-xs font-bold">
                Recommended
              </div>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Standard Practice</h3>
                <p className="text-sm text-gray-600">Balanced Session</p>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <span className="font-semibold">15 questions</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                  <span>8-12 min</span>
                </div>
                <p className="text-sm text-gray-600 text-center mt-3">
                  Ideal balance of practice and time commitment
                </p>
              </div>
              <button
                onClick={() => {
                  setQuestionCount(15);
                  setShowPractice(true);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-md hover:shadow-lg"
              >
                Start Practice
              </button>
            </div>

            {/* Full Mastery */}
            <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-gray-200 hover:border-green-500 transition-all">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Full Mastery Drill</h3>
                <p className="text-sm text-gray-600">Complete Coverage</p>
              </div>
              <div className="space-y-2 mb-6">
                <div className="flex items-center justify-center gap-2 text-gray-700">
                  <span className="font-semibold">20 questions</span>
                </div>
                <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                  <span>15-20 min</span>
                </div>
                <p className="text-sm text-gray-600 text-center mt-3">
                  Master every concept before taking the quiz
                </p>
              </div>
              <button
                onClick={() => {
                  setQuestionCount(20);
                  setShowPractice(true);
                }}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-700 to-emerald-700 text-white rounded-lg font-semibold hover:from-green-800 hover:to-emerald-800 transition-all shadow-md hover:shadow-lg"
              >
                Start Practice
              </button>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-sm text-gray-500">
            Questions are randomly selected from the complete question pool. Your progress is saved automatically.
          </p>
        </div>
      </div>

      {/* Admin Edit Button */}
      {isAdmin && practiceData && (
        <>
          <button
            onClick={() => setShowEditModal(true)}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Edit className="w-5 h-5" />
            <span>{contentId ? 'Edit Practice' : 'Create Practice'}</span>
          </button>

          {showEditModal && (
            <GrammarTestEditModal
              contentId={contentId || 'new'}
              language={params.language}
              category={params.category}
              topic={params.topic}
              initialData={practiceData}
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

