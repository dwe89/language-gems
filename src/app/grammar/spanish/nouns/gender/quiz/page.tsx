'use client';

import React, { useState } from 'react';
import { useAuth } from '../../../../../../components/auth/AuthProvider';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';
import { ArrowLeft, Award, Users, Clock, Trophy } from 'lucide-react';
import Link from 'next/link';
import { GemCard, GemButton } from '../../../../../../components/ui/GemTheme';
import FlagIcon from '../../../../../../components/ui/FlagIcon';

// Sample quiz data for Spanish noun gender
const quizData = {
  id: 'spanish-noun-gender-quiz',
  title: 'Spanish Noun Gender Quiz',
  description: 'Test your knowledge of Spanish noun gender',
  difficulty_level: 'beginner',
  estimated_duration: 10,
  questions: [
    {
      id: '1',
      question_text: 'What is the correct article for "mesa" (table)?',
      question_type: 'multiple_choice' as const,
      correct_answer: 'la',
      options: ['el', 'la', 'los', 'las'],
      explanation: 'Mesa is feminine, so it uses "la". Most nouns ending in -a are feminine.',
      difficulty_level: 'beginner',
      hint_text: 'Think about the ending of the noun'
    },
    {
      id: '2',
      question_text: 'What is the correct article for "coche" (car)?',
      question_type: 'multiple_choice' as const,
      correct_answer: 'el',
      options: ['el', 'la', 'los', 'las'],
      explanation: 'Coche is masculine despite ending in -e. Many nouns ending in -e are masculine.',
      difficulty_level: 'beginner',
      hint_text: 'This word is masculine despite its ending'
    },
    {
      id: '3',
      question_text: 'Complete: _____ problema es difícil',
      question_type: 'fill_blank' as const,
      correct_answer: 'El',
      explanation: 'Problema is masculine despite ending in -a. It\'s an exception to the general rule.',
      difficulty_level: 'intermediate',
      hint_text: 'This is an exception to the -a = feminine rule'
    },
    {
      id: '4',
      question_text: 'Complete: _____ mano está fría',
      question_type: 'fill_blank' as const,
      correct_answer: 'La',
      explanation: 'Mano is feminine despite ending in -o. It\'s an exception to the general rule.',
      difficulty_level: 'intermediate',
      hint_text: 'This is an exception to the -o = masculine rule'
    },
    {
      id: '5',
      question_text: 'Which article goes with "estudiante" (student) when referring to a female?',
      question_type: 'multiple_choice' as const,
      correct_answer: 'la',
      options: ['el', 'la', 'los', 'las'],
      explanation: 'When referring to a female student, use "la estudiante". The gender of the article changes with the person\'s gender.',
      difficulty_level: 'intermediate',
      hint_text: 'The gender depends on the person, not just the word'
    },
    {
      id: '6',
      question_text: 'Most nouns ending in -dad are:',
      question_type: 'multiple_choice' as const,
      correct_answer: 'feminine',
      options: ['masculine', 'feminine', 'both', 'neither'],
      explanation: 'Nouns ending in -dad (like ciudad, verdad) are almost always feminine.',
      difficulty_level: 'intermediate',
      hint_text: 'Think of words like ciudad, verdad, libertad'
    },
    {
      id: '7',
      question_text: 'Complete: _____ agua está muy fría',
      question_type: 'fill_blank' as const,
      correct_answer: 'El',
      explanation: 'Agua is feminine but uses "el" to avoid the awkward sound of "la agua". This happens with feminine nouns starting with stressed "a".',
      difficulty_level: 'advanced',
      hint_text: 'This is about pronunciation, not gender'
    },
    {
      id: '8',
      question_text: 'True or False: All nouns ending in -ión are feminine',
      question_type: 'true_false' as const,
      correct_answer: 'true',
      explanation: 'Almost all nouns ending in -ión are feminine (like acción, nación, emoción).',
      difficulty_level: 'intermediate',
      hint_text: 'Think of words like acción, nación, información'
    }
  ]
};

export default function SpanishNounGenderQuizPage() {
  const { user } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);

  console.log('🏆 [NOUN GENDER QUIZ] Page loaded, user:', !!user);

  const handleComplete = async (score: number, answers: any[], timeSpent: number) => {
    console.log('Quiz completed!', { score, answers, timeSpent });
    
    if (user) {
      // Save quiz results to database for logged-in users
      // TODO: Implement database saving
      const percentage = Math.round((score / quizData.questions.length) * 100);
      alert(`Great job! You scored ${score}/${quizData.questions.length} (${percentage}%) in ${Math.round(timeSpent / 1000)} seconds!`);
    } else {
      // Show results without saving for free users
      const percentage = Math.round((score / quizData.questions.length) * 100);
      alert(`Great job! You scored ${score}/${quizData.questions.length} (${percentage}%)! Sign up to track your progress.`);
    }
    
    setShowQuiz(false);
  };

  const handleExit = () => {
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <GrammarQuiz
        quizData={quizData}
        onComplete={handleComplete}
        onExit={handleExit}
        showHints={true}
        timeLimit={user ? 300 : undefined} // 5 minutes for logged-in users
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar/spanish/nouns/gender"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <FlagIcon countryCode="ES" size="lg" />
                <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Award className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">Noun Gender Quiz</h1>
                  <p className="text-gray-600">Test your knowledge of Spanish noun gender</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Mode Info */}
          <div className="mb-8">
            <GemCard className="shadow-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Quiz Mode</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  {user ? (
                    <>
                      <div className="flex items-center">
                        <Trophy className="w-4 h-4 mr-1 text-purple-500" />
                        Progress tracked
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Timed assessment
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        Free for everyone
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        No time limit
                      </div>
                    </>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">
                {user 
                  ? 'Test your knowledge with this comprehensive quiz. Your results will be saved and contribute to your learning progress.'
                  : 'Test your knowledge with this comprehensive quiz. Results won\'t be saved, but you\'ll get immediate feedback on your answers.'
                }
              </p>
              {!user && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-purple-700 text-sm">
                    💎 <strong>Upgrade:</strong> Create a free account to track your quiz results, earn gems, and unlock advanced features!
                  </p>
                </div>
              )}
            </GemCard>
          </div>

          {/* Start Quiz Button */}
          <div className="text-center">
            <GemButton
              onClick={() => setShowQuiz(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
            >
              <Award className="w-5 h-5 mr-2" />
              Start Quiz
            </GemButton>
          </div>
        </div>
      </div>
    </div>
  );
}
