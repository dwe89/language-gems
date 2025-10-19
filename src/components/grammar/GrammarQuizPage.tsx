'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader } from 'lucide-react';
import Link from 'next/link';
import GrammarPractice from './GrammarPractice';
import { GemCard, GemButton } from '../ui/GemTheme';

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'conjugation' | 'fill_blank' | 'word_order' | 'translation';
  correct_answer: string;
  options?: string[];
  explanation: string;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced';
  hint_text?: string;
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

interface GrammarQuizPageProps {
  language: string;
  category: string;
  topic: string;
  topicTitle: string;
  backUrl: string;
}

export default function GrammarQuizPage({
  language,
  category,
  topic,
  topicTitle,
  backUrl
}: GrammarQuizPageProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<PracticeItem[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    const loadQuizQuestions = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/grammar/quiz-questions?language=${language}&category=${category}&topic=${topic}&count=20`
        );

        if (!response.ok) {
          throw new Error('Failed to load quiz questions');
        }

        const data = await response.json();

        if (!data.success || !data.data) {
          throw new Error(data.error || 'No quiz questions available');
        }

        // Transform to PracticeItem format
        const transformed: PracticeItem[] = data.data.map((q: QuizQuestion) => ({
          id: q.id,
          type: (q.question_type || 'fill_blank') as any,
          question: q.question_text,
          answer: q.correct_answer,
          options: q.options || [],
          hint: q.explanation || q.hint_text || '',
          difficulty: (q.difficulty_level || 'beginner') as any,
          category: category
        }));

        setQuizQuestions(transformed);
        setShowQuiz(true);
      } catch (err) {
        console.error('Error loading quiz questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load quiz questions');
      } finally {
        setLoading(false);
      }
    };

    loadQuizQuestions();
  }, [language, category, topic]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <GemCard className="max-w-md w-full text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="mb-4"
          >
            <Loader className="w-12 h-12 text-purple-600 mx-auto" />
          </motion.div>
          <p className="text-lg font-semibold text-gray-800">Loading Quiz...</p>
          <p className="text-sm text-gray-600 mt-2">Preparing your {topicTitle} quiz</p>
        </GemCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <GemCard className="max-w-md w-full">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Quiz</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Link href={backUrl}>
              <GemButton variant="gem" gemType="rare" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </GemButton>
            </Link>
          </div>
        </GemCard>
      </div>
    );
  }

  if (showQuiz && quizQuestions.length > 0) {
    return (
      <GrammarPractice
        language={language}
        category={category}
        difficulty="mixed"
        practiceItems={quizQuestions}
        topicTitle={`${topicTitle} Quiz`}
        isTestMode={true}
        showHints={true}
        trackProgress={false}
        gamified={true}
        onComplete={(score, gemsEarned, timeSpent) => {
          // Handle quiz completion
          console.log('Quiz completed:', { score, gemsEarned, timeSpent });
        }}
        onExit={() => {
          window.location.href = backUrl;
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <GemCard className="max-w-md w-full text-center">
        <p className="text-lg text-gray-800 mb-6">No quiz questions available for this topic yet.</p>
        <Link href={backUrl}>
          <GemButton variant="gem" gemType="rare" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </GemButton>
        </Link>
      </GemCard>
    </div>
  );
}

