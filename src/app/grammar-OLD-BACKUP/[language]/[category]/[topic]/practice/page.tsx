'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Target, Gem, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { GemButton } from '../../../../../../components/ui/GemTheme';
import GrammarPractice from '../../../../../../components/grammar/GrammarPractice';
import PracticeModeSelector from '../../../../../../components/grammar/PracticeModeSelector';
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

interface PracticeItem {
  id: string;
  type: 'conjugation' | 'fill_blank' | 'word_order' | 'translation';
  question: string;
  answer: string;
  options?: string[];
  hint?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
}

const LANGUAGE_INFO = {
  spanish: { name: 'Spanish', countryCode: 'ES', color: 'from-red-500 to-yellow-500' },
  french: { name: 'French', countryCode: 'FR', color: 'from-blue-500 to-white' },
  german: { name: 'German', countryCode: 'DE', color: 'from-red-600 to-yellow-400' }
} as const;

// Enhanced data transformation to handle multiple content formats
const transformPracticeData = (contentData: any, topicSlug: string): PracticeItem[] => {
  if (!contentData) return [];


  const practiceItems: PracticeItem[] = [];

  // Handle different content data structures
  if (contentData.exercises) {
    // New format with exercises array
    contentData.exercises.forEach((exercise: any, exerciseIndex: number) => {
      if (exercise.prompts) {
        exercise.prompts.forEach((prompt: any, promptIndex: number) => {
          // Generate appropriate question based on exercise type
          let question = '';
          if (exercise.type === 'conjugation' && prompt.verb && prompt.subject) {
            question = `Conjugate "${prompt.verb}" for "${prompt.subject}"`;
          } else if (exercise.type === 'translation' && prompt.english) {
            question = `Translate: ${prompt.english}`;
          } else if (exercise.type === 'fill_blank' && prompt.sentence) {
            question = prompt.sentence;
          } else {
            question = prompt.sentence || prompt.question || exercise.instructions || 'Complete this exercise';
          }

          const practiceItem = {
            id: `${exerciseIndex}-${promptIndex}`,
            type: determineQuestionType({ ...prompt, type: exercise.type }),
            question: question,
            answer: prompt.answer || '',
            options: prompt.options || [],
            hint: prompt.explanation || prompt.hint || exercise.instructions || '',
            difficulty: mapDifficulty(prompt.difficulty || exercise.difficulty || 'intermediate'),
            category: exercise.category || topicSlug
          };

          practiceItems.push(practiceItem);
        });
      }
    });
  } else if (contentData.questions) {
    // Alternative format with questions array
    contentData.questions.forEach((question: any, index: number) => {
      practiceItems.push({
        id: `question-${index}`,
        type: determineQuestionType(question),
        question: question.question_text || question.question || '',
        answer: question.correct_answer || question.answer || '',
        options: question.options || [],
        hint: question.explanation || question.hint || '',
        difficulty: mapDifficulty(question.difficulty_level || 'intermediate'),
        category: topicSlug
      });
    });
  } else if (contentData.items) {
    // Legacy format with items array
    contentData.items.forEach((item: any, index: number) => {
      practiceItems.push({
        id: `item-${index}`,
        type: determineQuestionType(item),
        question: item.prompt || item.question || '',
        answer: item.answer || '',
        options: item.choices || item.options || [],
        hint: item.hint || item.explanation || '',
        difficulty: mapDifficulty(item.level || 'intermediate'),
        category: topicSlug
      });
    });
  }


  return practiceItems;
};

// Helper function to determine question type from content
const determineQuestionType = (item: any): PracticeItem['type'] => {
  // First check if type is explicitly provided
  if (item.type === 'conjugation' || item.type === 'translation' || item.type === 'fill_blank' || item.type === 'word_order') {
    return item.type;
  }
  if (item.question_type) return item.question_type;

  // Check content patterns
  if (item.verb && item.subject) return 'conjugation';
  if (item.english && item.answer) return 'translation';
  if (item.sentence && item.sentence.includes('___')) return 'fill_blank';
  if (item.options && item.options.length > 0) return 'fill_blank';
  if (item.question && item.question.toLowerCase().includes('conjugate')) return 'conjugation';
  if (item.question && item.question.toLowerCase().includes('translate')) return 'translation';
  if (item.question && item.question.toLowerCase().includes('order')) return 'word_order';

  return 'fill_blank'; // Default fallback
};

// Helper function to map difficulty levels
const mapDifficulty = (difficulty: string): PracticeItem['difficulty'] => {
  const lower = difficulty.toLowerCase();
  if (lower.includes('beginner') || lower.includes('easy') || lower === 'a1' || lower === 'a2') return 'beginner';
  if (lower.includes('advanced') || lower.includes('hard') || lower === 'c1' || lower === 'c2') return 'advanced';
  return 'intermediate'; // Default for intermediate, b1, b2, etc.
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

  // This page is now purely for practice mode (test mode has its own route)

  const [practiceContent, setPracticeContent] = useState<GrammarContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMode, setSelectedMode] = useState<'quick' | 'standard' | 'mastery' | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);

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

        // Get practice content for this topic
        const contentType = 'practice';
        const contentResponse = await fetch(`/api/grammar/content?topicId=${topicData.id}&contentType=${contentType}`);
        const contentData = await contentResponse.json();

        if (!contentData.success) {
          throw new Error('Failed to load content');
        }

        // Get the first practice content
        const practiceContentItem = contentData.data[0];
        console.log('🔍 Content loaded:', {
          contentType,
          dataCount: contentData.data?.length,
          practiceContentItem: practiceContentItem?.title,
          contentData: practiceContentItem?.content_data
        });

        if (!practiceContentItem) {
          throw new Error(`No ${contentType} content available for this topic`);
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

  // Check if we have practice items
  const practiceItems = transformPracticeData(practiceContent?.content_data, topic);
  if (practiceItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <BookOpen className="w-16 h-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Practice Coming Soon</h2>
          <p className="text-purple-200 mb-6">
            Practice exercises for {topic.replace('-', ' ')} are being prepared.
            Check back soon or try the lesson first!
          </p>
          <div className="space-y-3">
            <Link href={`/grammar/${language}/${category}/${topic}`}>
              <GemButton variant="gem" gemType="rare" className="w-full">
                <BookOpen className="w-4 h-4 mr-2" />
                View Lesson
              </GemButton>
            </Link>
            <GemButton
              onClick={() => window.history.back()}
              variant="secondary"
              className="w-full"
            >
              Go Back
            </GemButton>
          </div>
        </div>
      </div>
    );
  }

  const languageInfo = LANGUAGE_INFO[language as keyof typeof LANGUAGE_INFO];

  const handleModeSelect = (mode: 'quick' | 'standard' | 'mastery', count: number) => {
    setSelectedMode(mode);
    setQuestionCount(count);
  };

  const getRandomizedQuestions = (allQuestions: any[], count: number) => {
    if (count >= allQuestions.length) {
      return allQuestions; // Return all questions if count is greater than available
    }

    // Shuffle array and take first 'count' items
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
  };

  // Show mode selector if no mode is selected yet
  if (!selectedMode && practiceContent) {
    const allPracticeItems = transformPracticeData(practiceContent?.content_data, topic);
    return (
      <PracticeModeSelector
        onModeSelect={handleModeSelect}
        totalQuestions={allPracticeItems.length}
        topicTitle={practiceContent.title}
      />
    );
  }

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
            <h1 className="text-3xl font-bold text-white mb-2">
              {practiceContent.title}
            </h1>
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

        {/* Enhanced Practice Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <GrammarPractice
            language={language}
            category={category}
            difficulty={practiceContent.difficulty_level}
            practiceItems={getRandomizedQuestions(practiceItems, questionCount)}
            topicTitle={practiceContent.title}
            questionCount={questionCount}
            // Practice mode settings
            isTestMode={false}
            showHints={true} // Always show hints in practice mode
            trackProgress={false} // No progress tracking in practice mode
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
              // Return to mode selection
              setSelectedMode(null);
              setQuestionCount(0);
            }}
          />
        </motion.div>
      </div>
    </div>
  );
}
