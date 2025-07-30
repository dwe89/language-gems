'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';

interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  language: string;
  difficulty: 'foundation' | 'higher';
  theme: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
}

interface ComprehensionQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'matching' | 'gap-fill';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

interface ReadingAssessment {
  id: string;
  passage: ReadingPassage;
  questions: ComprehensionQuestion[];
  timeLimit: number; // in minutes
  passingScore: number; // percentage
}

interface ReadingComprehensionEngineProps {
  assessmentId?: string;
  language: string;
  difficulty: 'foundation' | 'higher';
  theme?: string;
  topic?: string;
  onComplete?: (results: AssessmentResults) => void;
  assignmentMode?: boolean;
}

interface AssessmentResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  passed: boolean;
  detailedResults: QuestionResult[];
}

interface QuestionResult {
  questionId: string;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  timeSpent: number;
}

export default function ReadingComprehensionEngine({
  assessmentId,
  language,
  difficulty,
  theme,
  topic,
  onComplete,
  assignmentMode = false
}: ReadingComprehensionEngineProps) {
  const { user } = useAuth();
  const [assessment, setAssessment] = useState<ReadingAssessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<AssessmentResults | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [questionStartTimes, setQuestionStartTimes] = useState<Record<string, Date>>({});

  // Load assessment data
  useEffect(() => {
    loadAssessment();
  }, [assessmentId, language, difficulty, theme, topic]);

  // Set up timer when assessment is loaded
  useEffect(() => {
    if (assessment && !timeRemaining) {
      setTimeRemaining(assessment.timeLimit * 60); // Convert minutes to seconds
      setStartTime(new Date());
      if (assessment.questions.length > 0) {
        setQuestionStartTimes({ [assessment.questions[0].id]: new Date() });
      }
    }
  }, [assessment]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted && assessment) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isCompleted && assessment && startTime) {
      handleSubmitAssessment();
    }
  }, [timeRemaining, isCompleted, assessment, startTime]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      setIsCompleted(false); // Reset completion state
      setResults(null); // Reset results

      // If specific assessment ID is provided, load that
      if (assessmentId) {
        const response = await fetch(`/api/reading-comprehension/tasks`);
        const data = await response.json();
        const specificTask = data.tasks?.find((task: any) => task.id === assessmentId);
        if (specificTask) {
          // Convert database task to assessment format
          const convertedAssessment: ReadingAssessment = {
            id: specificTask.id,
            passage: {
              id: specificTask.id,
              title: specificTask.title,
              content: specificTask.content,
              language: specificTask.language,
              difficulty: specificTask.difficulty,
              theme: specificTask.theme_topic || specificTask.category || '',
              topic: specificTask.subcategory || '',
              wordCount: specificTask.word_count || 0,
              estimatedReadingTime: specificTask.estimated_reading_time || 5
            },
            questions: specificTask.reading_comprehension_questions?.map((q: any) => ({
              id: q.id,
              type: q.type,
              question: q.question,
              options: q.options,
              correctAnswer: q.correct_answer,
              points: q.points || 1,
              explanation: q.explanation
            })) || [],
            timeLimit: 30, // Default 30 minutes
            passingScore: 60 // Default 60%
          };

          // Only set assessment if it has questions
          if (convertedAssessment.questions.length > 0) {
            setAssessment(convertedAssessment);
          } else {
            console.error('Assessment has no questions');
          }
        }
      } else {
        // Load tasks based on criteria from database
        const params = new URLSearchParams({
          language: language,
          difficulty: difficulty,
          ...(theme && { theme_topic: theme }),
          ...(topic && { category: topic }),
          limit: '1',
          random: 'true'
        });

        const response = await fetch(`/api/reading-comprehension/tasks?${params.toString()}`);
        const data = await response.json();

        if (data.tasks && data.tasks.length > 0) {
          const task = data.tasks[0];
          // Convert database task to assessment format
          const convertedAssessment: ReadingAssessment = {
            id: task.id,
            passage: {
              id: task.id,
              title: task.title,
              content: task.content,
              language: task.language,
              difficulty: task.difficulty,
              theme: task.theme_topic || task.category || '',
              topic: task.subcategory || '',
              wordCount: task.word_count || 0,
              estimatedReadingTime: task.estimated_reading_time || 5
            },
            questions: task.reading_comprehension_questions?.map((q: any) => ({
              id: q.id,
              type: q.type,
              question: q.question,
              options: q.options,
              correctAnswer: q.correct_answer,
              points: q.points || 1,
              explanation: q.explanation
            })) || [],
            timeLimit: 30, // Default 30 minutes
            passingScore: 60 // Default 60%
          };
          setAssessment(convertedAssessment);
        } else {
          console.error('No reading comprehension tasks found for criteria');
        }
      }
    } catch (error) {
      console.error('Error loading assessment:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (assessment?.questions.length || 0) - 1) {
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      const nextQuestionId = assessment?.questions[nextIndex]?.id;
      if (nextQuestionId) {
        setQuestionStartTimes(prev => ({
          ...prev,
          [nextQuestionId]: new Date()
        }));
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Calculate partial credit for multi-part answers
  const calculatePartialCredit = (question: ComprehensionQuestion, userAnswer: string | string[]): number => {
    const isFullyCorrect = checkAnswer(question, userAnswer);
    if (isFullyCorrect) {
      return question.points;
    }

    // For multi-point questions, try to give partial credit
    if (question.points > 1) {
      const normalizeText = (text: string): string => {
        return text.toLowerCase().trim().replace(/[.,;:!?'"()]/g, '').replace(/\s+/g, ' ').trim();
      };

      const splitAnswers = (text: string): string[] => {
        return text.split(/[,;]|\s+and\s+|\s+or\s+/i)
          .map(part => normalizeText(part))
          .filter(part => part.length > 0);
      };

      // Convert user answer to array format
      let userAnswerArray: string[] = [];
      if (Array.isArray(userAnswer)) {
        userAnswerArray = userAnswer.filter(answer => answer && answer.trim().length > 0);
      } else if (typeof userAnswer === 'string' && userAnswer.trim()) {
        const parts = splitAnswers(userAnswer);
        userAnswerArray = parts.length > 1 ? parts : [userAnswer];
      }

      // Convert correct answer to array format
      let correctAnswerArray: string[] = [];
      if (Array.isArray(question.correctAnswer)) {
        correctAnswerArray = question.correctAnswer.map(String);
      } else if (typeof question.correctAnswer === 'string') {
        const parts = splitAnswers(question.correctAnswer);
        correctAnswerArray = parts.length > 1 ? parts : [question.correctAnswer];
      }

      if (correctAnswerArray.length > 1 && userAnswerArray.length > 0) {
        const normalizedCorrect = correctAnswerArray.map(normalizeText);
        const normalizedUser = userAnswerArray.map(normalizeText);

        const matchedParts = normalizedCorrect.filter(correctPart =>
          normalizedUser.some(userPart => {
            // Direct match
            if (correctPart === userPart) return true;

            // Partial match for longer answers
            if (correctPart.length > 3 && userPart.length > 3) {
              const correctWords = correctPart.split(' ').filter(word => word.length > 2);
              const userWords = userPart.split(' ');
              const matchedWords = correctWords.filter(word =>
                userWords.some(userWord => userWord.includes(word) || word.includes(userWord))
              );
              return matchedWords.length >= Math.ceil(correctWords.length * 0.7);
            }

            return false;
          })
        );

        // Give partial credit based on how many parts were correct
        const partialScore = (matchedParts.length / correctAnswerArray.length) * question.points;
        return Math.round(partialScore);
      }
    }

    return 0;
  };

  const calculateResults = (): AssessmentResults => {
    if (!assessment) {
      return {
        score: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        timeSpent: 0,
        passed: false,
        detailedResults: []
      };
    }

    const detailedResults: QuestionResult[] = assessment.questions.map(question => {
      const userAnswer = userAnswers[question.id] || '';
      const isCorrect = checkAnswer(question, userAnswer);
      const pointsEarned = calculatePartialCredit(question, userAnswer);
      const questionStartTime = questionStartTimes[question.id];
      const timeSpent = questionStartTime ? Date.now() - questionStartTime.getTime() : 0;

      return {
        questionId: question.id,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: pointsEarned,
        timeSpent: Math.round(timeSpent / 1000) // Convert to seconds
      };
    });

    const correctAnswers = detailedResults.filter(r => r.isCorrect).length;
    const totalPoints = detailedResults.reduce((sum, r) => sum + r.points, 0);
    const maxPoints = assessment.questions.reduce((sum, q) => sum + q.points, 0);
    const score = Math.round((totalPoints / maxPoints) * 100);
    const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 1000) : 0;
    const passed = score >= assessment.passingScore;

    return {
      score,
      totalQuestions: assessment.questions.length,
      correctAnswers,
      timeSpent,
      passed,
      detailedResults
    };
  };

  const checkAnswer = (question: ComprehensionQuestion, userAnswer: string | string[]): boolean => {
    const correctAnswer = question.correctAnswer;

    // Simple normalize - just lowercase and trim, preserve spaces
    const simpleNormalize = (text: string): string => {
      return text.toLowerCase().trim();
    };

    // More aggressive normalize for fallback matching
    const aggressiveNormalize = (text: string): string => {
      return text
        .toLowerCase()
        .trim()
        .normalize('NFD') // Normalize unicode characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/[.,;:!?'"()]/g, '') // Remove punctuation
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/[\u00A0\u2000-\u200B\u2028\u2029]/g, ' ') // Replace various space characters
        .trim();
    };

    // Ultra-aggressive normalize for really stubborn cases
    const ultraNormalize = (text: string): string => {
      return text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, '') // Remove all non-word, non-space characters
        .replace(/\s+/g, '')     // Remove all spaces
        .trim();
    };

    // Split text into parts for multi-answer questions
    const splitAnswers = (text: string): string[] => {
      return text
        .split(/[,;]|\s+and\s+/i)
        .map(part => part.trim())
        .filter(part => part.length > 0);
    };

    // Convert answers to arrays for consistent handling
    let userAnswerArray: string[] = [];
    if (Array.isArray(userAnswer)) {
      userAnswerArray = userAnswer.filter(answer => answer && answer.trim().length > 0);
    } else if (typeof userAnswer === 'string' && userAnswer.trim()) {
      userAnswerArray = [userAnswer.trim()];
    }

    let correctAnswerArray: string[] = [];
    if (Array.isArray(correctAnswer)) {
      correctAnswerArray = correctAnswer.map(String);
    } else if (typeof correctAnswer === 'string') {
      // Only split if it contains clear separators
      if (correctAnswer.includes(',') || /\s+and\s+/i.test(correctAnswer)) {
        correctAnswerArray = splitAnswers(correctAnswer);
      } else {
        correctAnswerArray = [correctAnswer];
      }
    }

    if (userAnswerArray.length === 0) {
      return false;
    }

    // For single answer questions
    if (correctAnswerArray.length === 1) {
      const correctText = correctAnswerArray[0];

      // Try each user answer against the correct answer
      for (const userText of userAnswerArray) {
        // Multiple comparison strategies
        const comparisons = [
          // Strategy 1: Simple case-insensitive
          () => simpleNormalize(userText) === simpleNormalize(correctText),

          // Strategy 2: Aggressive normalization
          () => aggressiveNormalize(userText) === aggressiveNormalize(correctText),

          // Strategy 3: Ultra normalization (remove all non-letters)
          () => ultraNormalize(userText) === ultraNormalize(correctText),

          // Strategy 4: Word-by-word comparison
          () => {
            const userWords = userText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            const correctWords = correctText.toLowerCase().split(/\s+/).filter(w => w.length > 0);
            return userWords.length === correctWords.length &&
              userWords.every((word, i) => word === correctWords[i]);
          },

          // Strategy 5: Levenshtein distance for very similar strings
          () => {
            const user = aggressiveNormalize(userText);
            const correct = aggressiveNormalize(correctText);
            if (Math.abs(user.length - correct.length) > 2) return false;

            // Simple Levenshtein distance calculation
            const matrix = Array(user.length + 1).fill(null).map(() => Array(correct.length + 1).fill(null));

            for (let i = 0; i <= user.length; i++) matrix[i][0] = i;
            for (let j = 0; j <= correct.length; j++) matrix[0][j] = j;

            for (let i = 1; i <= user.length; i++) {
              for (let j = 1; j <= correct.length; j++) {
                const cost = user[i - 1] === correct[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                  matrix[i - 1][j] + 1,
                  matrix[i][j - 1] + 1,
                  matrix[i - 1][j - 1] + cost
                );
              }
            }

            const distance = matrix[user.length][correct.length];
            const maxLength = Math.max(user.length, correct.length);
            return distance <= Math.max(1, Math.floor(maxLength * 0.1)); // Allow 10% difference
          }
        ];

        // Try each comparison strategy
        for (let i = 0; i < comparisons.length; i++) {
          try {
            if (comparisons[i]()) {
              console.log(`✓ Match found using strategy ${i + 1}`);
              console.log('User:', JSON.stringify(userText));
              console.log('Correct:', JSON.stringify(correctText));
              return true;
            }
          } catch (error) {
            console.log(`Strategy ${i + 1} failed:`, error);
          }
        }

        // For longer answers, try partial word matching
        if (correctText.length > 5) {
          const correctWords = aggressiveNormalize(correctText).split(' ').filter(w => w.length > 2);
          const userWords = aggressiveNormalize(userText).split(' ').filter(w => w.length > 2);

          if (correctWords.length > 0) {
            const matchedWords = correctWords.filter(word =>
              userWords.some(userWord =>
                userWord === word ||
                userWord.includes(word) ||
                word.includes(userWord)
              )
            );

            // Need at least 70% of key words to match
            if (matchedWords.length >= Math.ceil(correctWords.length * 0.7)) {
              return true;
            }
          }
        }
      }

      return false;
    }

    // For multi-part answers
    if (correctAnswerArray.length > 1) {
      // User must provide at least as many answers as required
      if (userAnswerArray.length < correctAnswerArray.length) {
        return false;
      }

      // Enhanced matching for multi-part answers
      const matchPart = (userPart: string, correctPart: string): boolean => {
        // Extract core nouns by removing common adjectives and articles
        const extractCoreWords = (text: string): string[] => {
          const commonAdjectives = ['small', 'big', 'large', 'comfortable', 'beautiful', 'nice', 'good', 'bad', 'old', 'new', 'young', 'great', 'wonderful', 'amazing', 'excellent'];
          const articles = ['a', 'an', 'the'];

          return aggressiveNormalize(text)
            .split(' ')
            .filter(word => word.length > 1) // Allow shorter words like "TV"
            .filter(word => !commonAdjectives.includes(word))
            .filter(word => !articles.includes(word));
        };

        // Handle common synonyms and abbreviations
        const normalizeSynonyms = (word: string): string => {
          const synonymMap: { [key: string]: string } = {
            'tv': 'television',
            'television': 'television',
            'telly': 'television',
            'fridge': 'refrigerator',
            'refrigerator': 'refrigerator',
            'sofa': 'couch',
            'couch': 'couch',
            'settee': 'couch',
            'loo': 'toilet',
            'bathroom': 'bathroom',
            'washroom': 'bathroom',
            'restroom': 'bathroom'
          };

          const normalized = word.toLowerCase();
          return synonymMap[normalized] || normalized;
        };

        // Handle plural/singular forms
        const normalizePlural = (word: string): string => {
          if (word.endsWith('s') && word.length > 3) {
            return word.slice(0, -1); // Remove 's' for basic plural handling
          }
          return word;
        };

        // Strategy 1: Direct match
        if (simpleNormalize(userPart) === simpleNormalize(correctPart)) {
          return true;
        }

        // Strategy 2: Aggressive normalization
        if (aggressiveNormalize(userPart) === aggressiveNormalize(correctPart)) {
          return true;
        }

        // Strategy 3: Core word extraction (ignore adjectives)
        const userCoreWords = extractCoreWords(userPart).map(word => normalizeSynonyms(normalizePlural(word)));
        const correctCoreWords = extractCoreWords(correctPart).map(word => normalizeSynonyms(normalizePlural(word)));

        console.log(`Comparing core words - User: [${userCoreWords.join(', ')}] vs Correct: [${correctCoreWords.join(', ')}]`);

        if (userCoreWords.length > 0 && correctCoreWords.length > 0) {
          // Check if all correct core words are present in user answer
          const matchedCoreWords = correctCoreWords.filter(correctWord =>
            userCoreWords.some(userWord =>
              userWord === correctWord ||
              userWord.includes(correctWord) ||
              correctWord.includes(userWord)
            )
          );

          console.log(`Matched core words: [${matchedCoreWords.join(', ')}] out of [${correctCoreWords.join(', ')}]`);

          if (matchedCoreWords.length === correctCoreWords.length) {
            return true;
          }
        }

        // Strategy 4: Partial word matching for longer phrases
        if (correctPart.length > 3) {
          const correctWords = aggressiveNormalize(correctPart).split(' ').filter(w => w.length > 1);
          const userWords = aggressiveNormalize(userPart).split(' ').filter(w => w.length > 1);

          if (correctWords.length > 0) {
            const matchedWords = correctWords.filter(word =>
              userWords.some(userWord => {
                const normalizedCorrect = normalizeSynonyms(normalizePlural(word));
                const normalizedUser = normalizeSynonyms(normalizePlural(userWord));
                return normalizedUser === normalizedCorrect ||
                  normalizedUser.includes(normalizedCorrect) ||
                  normalizedCorrect.includes(normalizedUser);
              })
            );

            console.log(`Partial word matching: ${matchedWords.length}/${correctWords.length} words matched`);
            return matchedWords.length >= Math.ceil(correctWords.length * 0.6); // Lowered threshold
          }
        }

        return false;
      };

      // Check if each correct answer has a matching user answer
      return correctAnswerArray.every(correctPart => {
        const hasMatch = userAnswerArray.some(userPart => matchPart(userPart, correctPart));
        console.log(`Matching "${correctPart}" against user answers:`, userAnswerArray, 'Result:', hasMatch);
        return hasMatch;
      });
    }

    return false;
  };

  const handleSubmitAssessment = async () => {
    if (!assessment || isCompleted) return;

    const assessmentResults = calculateResults();
    setResults(assessmentResults);
    setIsCompleted(true);

    // Save results to database
    try {
      const response = await fetch('/api/assessments/reading/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          assessmentId: assessment?.id,
          results: assessmentResults,
          assignmentMode
        })
      });

      if (!response.ok) {
        console.error('Failed to save results:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving results:', error);
    }

    // Call completion callback
    if (onComplete) {
      onComplete(assessmentResults);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
        <p className="ml-4 text-lg">Loading reading assessment...</p>
      </div>
    );
  }

  if (!assessment || !assessment.questions || assessment.questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600">
          {!assessment ? 'Assessment not found' : 'No questions available for this assessment'}
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  if (isCompleted && results) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Assessment Complete!</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl font-bold text-blue-600">{results.score}%</div>
              <div className="text-gray-600">Final Score</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
              <div className="text-gray-600">Correct Answers</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {formatTime(results.timeSpent)}
              </div>
              <div className="text-gray-600">Time Spent</div>
            </div>
          </div>

          <div className={`text-center p-4 rounded-lg mb-8 ${results.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
            <div className="text-xl font-semibold">
              {results.passed ? '🎉 Congratulations! You passed!' : '📚 Keep practicing! You can do better!'}
            </div>
            <div className="text-sm mt-1">
              Passing score: {assessment.passingScore}%
            </div>
          </div>

          {/* Detailed Results Table */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">Your Answers</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 rounded-lg">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Question</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Your Answer</th>
                    <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Correct Answer</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Result</th>
                    <th className="border border-gray-300 px-4 py-3 text-center font-semibold">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {results.detailedResults.map((result, index) => {
                    const question = assessment.questions.find(q => q.id === result.questionId);
                    const isCorrect = result.isCorrect;

                    return (
                      <tr key={result.questionId} className={
                        isCorrect
                          ? 'bg-green-50'
                          : result.points > 0
                            ? 'bg-yellow-50'
                            : 'bg-red-50'
                      }>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="font-medium">Q{index + 1}</div>
                          <div className="text-sm text-gray-600 mt-1">
                            {question?.question}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className={`font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            {Array.isArray(result.userAnswer)
                              ? result.userAnswer.join(', ')
                              : result.userAnswer || 'No answer'}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3">
                          <div className="font-medium text-green-700">
                            {Array.isArray(result.correctAnswer)
                              ? result.correctAnswer.join(', ')
                              : result.correctAnswer}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${isCorrect
                            ? 'bg-green-100 text-green-800'
                            : result.points > 0
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                            }`}>
                            {isCorrect
                              ? '✓ Correct'
                              : result.points > 0
                                ? '◐ Partial'
                                : '✗ Incorrect'}
                          </div>
                        </td>
                        <td className="border border-gray-300 px-4 py-3 text-center">
                          <span className={`font-medium ${isCorrect
                            ? 'text-green-700'
                            : result.points > 0
                              ? 'text-yellow-700'
                              : 'text-red-700'
                            }`}>
                            {result.points}/{question?.points || 1}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = '/reading-comprehension'}
              className="px-8 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium"
            >
              Choose Another Topic
            </button>
            {!assignmentMode && (
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
              >
                Back to Menu
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQuestionIndex];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header with timer and progress */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">{assessment.passage.title}</h1>
            <p className="text-gray-600">
              Question {currentQuestionIndex + 1} of {assessment.questions.length}
            </p>
          </div>
          <div className="text-right">
            <div className={`text-lg font-semibold ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}`}>
              Time: {formatTime(timeRemaining)}
            </div>
            <div className="text-sm text-gray-500">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reading passage */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Reading Passage</h2>
          <div className="prose max-w-none">
            <div className="text-sm text-gray-500 mb-4">
              {assessment.passage.wordCount} words • {assessment.passage.estimatedReadingTime} min read
            </div>
            <div className="whitespace-pre-line leading-relaxed">
              {assessment.passage.content}
            </div>
          </div>
        </div>

        {/* Current question */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Question {currentQuestionIndex + 1}</h2>

          <div className="mb-6">
            <p className="text-lg mb-4">{currentQuestion.question}</p>

            {/* Render question based on type */}
            {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <label key={index} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={userAnswers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'true-false' && (
              <div className="space-y-3">
                {['True', 'False'].map((option) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option}
                      checked={userAnswers[currentQuestion.id] === option}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span>{option}</span>
                  </label>
                ))}
              </div>
            )}

            {currentQuestion.type === 'short-answer' && (
              <>
                {/* Check if this is a multi-part question based on points AND question text */}
                {(currentQuestion.points > 1 &&
                  /\b(two|three|four|five|\d+)\b.*\b(traits?|things?|items?|examples?|reasons?|ways?|aspects?|names?|words?)\b/i.test(currentQuestion.question)) ? (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 mb-3">
                      Please provide {currentQuestion.points > 1 ? currentQuestion.points : 'multiple'} separate answers:
                    </p>
                    {Array.from({ length: Math.max(currentQuestion.points, 2) }, (_, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-500 w-8">
                          {index + 1}.
                        </span>
                        <input
                          type="text"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder={`Answer ${index + 1}...`}
                          value={
                            Array.isArray(userAnswers[currentQuestion.id])
                              ? (userAnswers[currentQuestion.id] as string[])[index] || ''
                              : index === 0 ? (userAnswers[currentQuestion.id] as string || '') : ''
                          }
                          onChange={(e) => {
                            const currentAnswers = Array.isArray(userAnswers[currentQuestion.id])
                              ? [...(userAnswers[currentQuestion.id] as string[])]
                              : [userAnswers[currentQuestion.id] as string || ''];

                            // Ensure array is long enough
                            while (currentAnswers.length <= index) {
                              currentAnswers.push('');
                            }

                            currentAnswers[index] = e.target.value;
                            handleAnswerChange(currentQuestion.id, currentAnswers);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Enter your answer here..."
                    value={userAnswers[currentQuestion.id] as string || ''}
                    onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                  />
                )}
              </>
            )}

            {currentQuestion.type === 'gap-fill' && (
              <div className="space-y-3">
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Fill in the blank..."
                  value={userAnswers[currentQuestion.id] as string || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>

            {currentQuestionIndex === assessment.questions.length - 1 ? (
              <button
                onClick={handleSubmitAssessment}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
