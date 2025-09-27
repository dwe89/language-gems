'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Award, Gem, User, UserCheck, Clock } from 'lucide-react';
import Link from 'next/link';
import { GemButton, GemCard } from '../../../../../../components/ui/GemTheme';
import GrammarQuiz from '../../../../../../components/grammar/GrammarQuiz';
import { useAuth } from '../../../../../../components/auth/AuthProvider';

// Sample quiz data for Spanish present tense
const quizData = {
  id: 'spanish-present-tense-quiz',
  title: 'Spanish Present Tense Quiz',
  description: 'Test your mastery of Spanish present tense conjugations',
  difficulty_level: 'beginner',
  estimated_duration: 10,
  questions: [
    {
      id: 'q1',
      question_text: 'What is the correct conjugation of "hablar" for "yo"?',
      question_type: 'multiple_choice' as const,
      correct_answer: 'hablo',
      options: ['hablo', 'hablas', 'habla', 'hablamos'],
      explanation: 'For -AR verbs, the "yo" form ends in -o. Remove -ar and add -o.',
      difficulty_level: 'beginner',
      hint_text: 'Think about the -AR verb endings for "yo"'
    },
    {
      id: 'q2',
      question_text: 'Choose the correct form: "Tú _____ pizza." (comer)',
      question_type: 'multiple_choice' as const,
      correct_answer: 'comes',
      options: ['como', 'comes', 'come', 'comemos'],
      explanation: 'For -ER verbs, the "tú" form ends in -es. Remove -er and add -es.',
      difficulty_level: 'beginner',
      hint_text: 'This is an -ER verb with "tú"'
    },
    {
      id: 'q3',
      question_text: 'What is the "nosotros" form of "vivir"?',
      question_type: 'multiple_choice' as const,
      correct_answer: 'vivimos',
      options: ['vivo', 'vives', 'vive', 'vivimos'],
      explanation: 'For -IR verbs, the "nosotros" form ends in -imos. Remove -ir and add -imos.',
      difficulty_level: 'beginner',
      hint_text: 'This is an -IR verb with "nosotros"'
    },
    {
      id: 'q4',
      question_text: 'Which verb form is correct: "Yo _____ estudiante."',
      question_type: 'multiple_choice' as const,
      correct_answer: 'soy',
      options: ['soy', 'estoy', 'tengo', 'hago'],
      explanation: 'Use "ser" (soy) for permanent characteristics like profession or identity.',
      difficulty_level: 'intermediate',
      hint_text: 'Think about permanent vs. temporary states'
    },
    {
      id: 'q5',
      question_text: 'Complete: "Ellos _____ hambre." (tener)',
      question_type: 'multiple_choice' as const,
      correct_answer: 'tienen',
      options: ['tengo', 'tienes', 'tiene', 'tienen'],
      explanation: 'Tener is irregular. The "ellos" form is "tienen".',
      difficulty_level: 'intermediate',
      hint_text: 'Tener is an irregular verb'
    }
  ]
};

export default function SpanishPresentTenseQuizPage() {
  const { user } = useAuth();
  const [showQuiz, setShowQuiz] = useState(false);

  const handleComplete = async (score: number, answers: any[], timeSpent: number) => {
    const percentage = Math.round((score / answers.length) * 100);
    console.log('Quiz completed!', { score, percentage, timeSpent });
    
    if (user) {
      // Save results to database for logged-in users
      // TODO: Implement database saving
      alert(`Quiz completed! You scored ${score}/${answers.length} (${percentage}%) in ${Math.round(timeSpent/1000)} seconds!`);
    } else {
      // Show results without saving for free users
      alert(`Quiz completed! You scored ${score}/${answers.length} (${percentage}%)! Sign up to save your results and track progress.`);
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
        timeLimit={user ? undefined : 300} // 5 minutes for free users, unlimited for premium
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-lg">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href="/grammar/spanish/verbs/present-tense"
                className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">Present Tense Quiz</h1>
                  <p className="text-gray-600 text-lg">Test your Spanish present tense mastery</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <GemCard className="shadow-xl border border-gray-200">
            <div className="text-center">
              <div className="mb-8">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full">
                    <Award className="w-12 h-12 text-white" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready for the Quiz?</h2>
                <p className="text-gray-600 text-lg mb-6">
                  Challenge yourself with {quizData.questions.length} carefully crafted questions about Spanish present tense.
                </p>
              </div>

              {/* Quiz Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="text-2xl font-bold text-blue-600 mb-1">{quizData.questions.length}</div>
                  <div className="text-sm text-gray-600">Questions</div>
                </div>
                <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="text-2xl font-bold text-green-600 mb-1">{quizData.estimated_duration}</div>
                  <div className="text-sm text-gray-600">Minutes</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="text-2xl font-bold text-purple-600 mb-1">{quizData.difficulty_level}</div>
                  <div className="text-sm text-gray-600">Difficulty</div>
                </div>
              </div>

              {/* User Status */}
              <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                <div className="flex items-center justify-center mb-4">
                  {user ? (
                    <UserCheck className="w-8 h-8 text-green-600 mr-3" />
                  ) : (
                    <User className="w-8 h-8 text-gray-500 mr-3" />
                  )}
                  <h3 className="text-xl font-semibold text-gray-800">
                    {user ? 'Premium Quiz Mode' : 'Free Quiz Mode'}
                  </h3>
                </div>
                <div className="text-gray-600">
                  {user ? (
                    <div>
                      <p className="mb-2">✅ Unlimited time and attempts</p>
                      <p className="mb-2">✅ Detailed explanations and hints</p>
                      <p>✅ Results saved to your profile</p>
                    </div>
                  ) : (
                    <div>
                      <p className="mb-2">✅ Full access to quiz questions</p>
                      <p className="mb-2">⏱️ 5-minute time limit</p>
                      <p>❌ Results tracking (sign up to unlock)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Start Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <GemButton
                  variant="gem"
                  gemType={user ? "epic" : "common"}
                  onClick={() => setShowQuiz(true)}
                  className="px-8 py-4 text-lg"
                >
                  <Award className="w-6 h-6 mr-2" />
                  Start Quiz
                </GemButton>
                
                {!user && (
                  <GemButton
                    variant="gem"
                    gemType="legendary"
                    onClick={() => window.location.href = '/auth/signup'}
                    className="px-8 py-4 text-lg"
                  >
                    <Gem className="w-6 h-6 mr-2" />
                    Sign Up for Premium
                  </GemButton>
                )}
              </div>
            </div>
          </GemCard>
        </div>
      </div>
    </div>
  );
}
