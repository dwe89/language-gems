'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  FileText,
  Target
} from 'lucide-react';
import { AQATopicAssessmentService, type AQATopicAssessmentDefinition } from '../../services/aqaTopicAssessmentService';

// Question Types for AQA Topic Reading Assessment
export interface AQATopicReadingQuestion {
  id: string;
  type: 'letter-matching' | 'multiple-choice' | 'student-grid' | 'open-response' | 'time-sequence' | 'headline-matching' | 'sentence-completion' | 'translation';
  title: string;
  instructions: string;
  text?: string; // Reading passage
  timeLimit?: number; // in seconds
  data: any; // Question-specific data structure
  marks: number; // Total marks for this question
}

interface AQATopicReadingAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: 'KS4';
  difficulty: 'foundation' | 'higher';
  theme: string;
  topic: string;
  identifier: string; // Which assessment (assessment-1, assessment-2, etc.)
  studentId?: string; // For authenticated users
  assignmentId?: string; // If this is an assigned assessment
  onComplete: (results: any) => void;
  onQuestionComplete?: (questionId: string, answer: any, timeSpent: number) => void;
}

export default function AQATopicReadingAssessment({
  language,
  difficulty,
  theme,
  topic,
  identifier,
  studentId,
  assignmentId,
  onComplete,
  onQuestionComplete
}: AQATopicReadingAssessmentProps) {
  // Database and service state
  const [assessmentService] = useState(() => new AQATopicAssessmentService());
  const [assessment, setAssessment] = useState<AQATopicAssessmentDefinition | null>(null);
  const [questions, setQuestions] = useState<AQATopicReadingQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Assessment state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [totalStartTime] = useState<number>(Date.now());
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Timer ref
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load assessment and questions
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setLoading(true);
        setError(null);

        const assessmentData = await assessmentService.getAssessmentByIdentifier(
          language,
          difficulty,
          theme,
          topic,
          identifier
        );

        if (!assessmentData) {
          setError('Assessment not found. Please check your selection and try again.');
          return;
        }

        setAssessment(assessmentData);
        setTimeRemaining(assessmentData.time_limit_minutes * 60);

        const questionsData = await assessmentService.getQuestionsByAssessmentId(assessmentData.id);
        
        if (!questionsData || questionsData.length === 0) {
          setError('No questions found for this assessment.');
          return;
        }

        const transformedQuestions: AQATopicReadingQuestion[] = questionsData.map((q) => ({
          id: q.id,
          type: q.question_type as 'letter-matching' | 'multiple-choice' | 'student-grid' | 'open-response' | 'time-sequence' | 'headline-matching' | 'sentence-completion' | 'translation',
          title: q.title,
          instructions: q.instructions,
          text: q.reading_text,
          data: q.question_data,
          marks: q.marks
        }));

        setQuestions(transformedQuestions);
        setQuestionStartTime(Date.now());

      } catch (err) {
        console.error('Error loading topic assessment:', err);
        setError('Failed to load assessment. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadAssessment();
  }, [language, difficulty, theme, topic, identifier, assessmentService]);

  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !isCompleted && !loading) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timeRemaining, isCompleted, loading]);

  const handleTimeUp = () => {
    setIsCompleted(true);
    setShowResults(true);
    const results = calculateResults();
    onComplete(results);
  };

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);
    
    if (onQuestionComplete) {
      onQuestionComplete(currentQuestion.id, answers[currentQuestion.id], timeSpent);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionStartTime(Date.now());
    } else {
      setIsCompleted(true);
      setShowResults(true);
      const results = calculateResults();
      onComplete(results);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const calculateResults = () => {
    const totalTimeSpent = Math.floor((Date.now() - totalStartTime) / 1000);
    const questionsCompleted = Object.keys(answers).filter(key => answers[key] !== undefined && answers[key] !== '').length;
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    
    let score = 0;
    questions.forEach(question => {
      if (question.type === 'translation' || question.type === 'sentence-completion' || question.type === 'open-response' || question.type === 'multiple-choice' || question.type === 'letter-matching' || question.type === 'student-grid' || question.type === 'time-sequence' || question.type === 'headline-matching') {
        let hasAnyAnswer = false;
        // For question types that have multiple input fields or sub-questions in data.sentences / data.questions / data.students / data.events / data.articles
        // We iterate through them to check if any part of the question has been answered.
        // This is a simplified check for demo purposes. A real grading system would be more complex.
        if (question.data.sentences) {
          question.data.sentences.forEach((_s: any, sIdx: number) => {
            if (answers[`${question.id}-${sIdx}`] && answers[`${question.id}-${sIdx}`] !== '') {
              hasAnyAnswer = true;
            }
          });
        } else if (question.data.questions) {
             question.data.questions.forEach((_q: any, qIdx: number) => {
                if (answers[`${question.id}-${qIdx}`] && answers[`${question.id}-${qIdx}`] !== '') {
                    hasAnyAnswer = true;
                }
             });
        } else if (question.data.students) { // For letter-matching, student-grid
             question.data.students.forEach((_s: any, sIdx: number) => {
                // Assuming letter-matching's answers are keyed by `${currentQuestion.id}-${student.name}`
                // and student-grid's by `${currentQuestion.id}-${idx}` for the question part
                if (answers[`${question.id}-${sIdx}`] && answers[`${question.id}-${sIdx}`] !== '') {
                    hasAnyAnswer = true;
                }
             });
        } else if (question.data.events) { // For time-sequence
             question.data.events.forEach((_e: any, eIdx: number) => {
                if (answers[`${question.id}-${eIdx}`] && answers[`${question.id}-${eIdx}`] !== '') {
                    hasAnyAnswer = true;
                }
             });
        } else if (question.data.articles) { // For headline-matching
             question.data.articles.forEach((_a: any, aIdx: number) => {
                if (answers[`${question.id}-${aIdx}`] && answers[`${question.id}-${aIdx}`] !== '') {
                    hasAnyAnswer = true;
                }
             });
        } else {
             // Fallback for types that might just have one answer field tied directly to question.id
             if (answers[question.id]) {
                 hasAnyAnswer = true;
             }
        }

        if (hasAnyAnswer) {
          score += question.marks;
        }
      } else {
        // Fallback for any other types not explicitly handled above
        if (answers[question.id]) {
          score += question.marks; 
        }
      }
    });

    score = Math.min(score, totalMarks);

    return {
      questionsCompleted,
      totalQuestions: questions.length,
      score: Math.round(score),
      totalMarks,
      percentage: totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0,
      totalTimeSpent,
      timeLimit: assessment?.time_limit_minutes ? assessment.time_limit_minutes * 60 : 0
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Conditional Renders for Loading, Error, Results ---
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-purple-600"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700">Loading your assessment...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait a moment while we prepare your questions.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-3">Assessment Not Found</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const results = calculateResults();
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-2xl w-full text-center">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6 animate-bounce" />
          <h2 className="text-3xl font-extrabold text-gray-900 mb-5">Assessment Complete!</h2>
          <p className="text-lg text-gray-700 mb-8">Here's how you did on the <strong>{topic}</strong> topic assessment.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-5 rounded-lg shadow-md border border-blue-200">
              <div className="text-4xl font-extrabold text-blue-700">{results.questionsCompleted}</div>
              <div className="text-sm font-medium text-blue-800 mt-1">Questions Answered</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-5 rounded-lg shadow-md border border-green-200">
              <div className="text-4xl font-extrabold text-green-700">{results.score}<span className="text-xl">/{results.totalMarks}</span></div>
              <div className="text-sm font-medium text-green-800 mt-1">Score</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-5 rounded-lg shadow-md border border-purple-200">
              <div className="text-4xl font-extrabold text-purple-700">{results.percentage}<span className="text-xl">%</span></div>
              <div className="text-sm font-medium text-purple-800 mt-1">Percentage</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-5 rounded-lg shadow-md border border-orange-200">
              <div className="text-4xl font-extrabold text-orange-700">{formatTime(results.totalTimeSpent)}</div>
              <div className="text-sm font-medium text-orange-800 mt-1">Time Taken</div>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-left">
            <h3 className="font-semibold text-gray-900 text-lg mb-2">Assessment Overview</h3>
            <p className="text-gray-700 leading-relaxed">
              This assessment focused on <strong>{topic}</strong> within the <strong>{theme.split(': ')[1]}</strong> theme. 
              You completed the assessment in <strong>{formatTime(results.totalTimeSpent)}</strong>, out of a total time limit of <strong>{assessment?.time_limit_minutes} minutes</strong>.
            </p>
          </div>

          <div className="mt-8 flex justify-center">
             <button
              onClick={() => { /* Implement navigation back to topic selection or dashboard */ }}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Return to Topics
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Handle case where currentQuestion is null/undefined after loading (shouldn't happen with error handling, but good for type safety)
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <p className="text-gray-600">No questions available for this assessment.</p>
        </div>
      </div>
    );
  }

  // --- Main Assessment View ---
  const renderQuestionComponent = () => {
    switch (currentQuestion.type) {
      case 'letter-matching':
        return (
          <div className="space-y-6">
            {currentQuestion.data.students?.map((student: any, idx: number) => (
              <div key={idx} className="bg-blue-50 p-5 rounded-lg border border-blue-200 shadow-sm">
                <h4 className="font-bold text-blue-900 mb-3 text-lg">{student.name}</h4>
                <p className="text-blue-800 mb-4">{student.text}</p>
                <select
                  className="w-full px-4 py-2 border border-blue-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer text-base"
                  onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${student.name}`, e.target.value)}
                  value={answers[`${currentQuestion.id}-${student.name}`] || ''}
                >
                  <option value="">Select an option...</option>
                  {currentQuestion.data.options?.map((option: any) => (
                    <option key={option.letter} value={option.letter}>
                      {option.letter}. {option.subject}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        );
      case 'multiple-choice':
        return (
          <div className="space-y-5">
            {currentQuestion.data.questions?.map((q: any, idx: number) => (
              <div key={idx} className="mb-5 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-3 text-base">{q.question}</p>
                <div className="space-y-3">
                  {q.options?.map((option: string, optIdx: number) => (
                    <label key={optIdx} className="flex items-center p-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors duration-150">
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}-${idx}`}
                        value={option}
                        onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${idx}`, e.target.value)}
                        checked={answers[`${currentQuestion.id}-${idx}`] === option}
                        className="mr-3 h-5 w-5 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-gray-800 text-base">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'student-grid':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {currentQuestion.data.studentTexts?.map((student: any, idx: number) => (
                <div key={idx} className="bg-green-50 p-5 rounded-lg border border-green-200 shadow-sm">
                  <h4 className="font-bold text-green-900 mb-2 text-lg">{student.name}</h4>
                  <p className="text-green-800 leading-relaxed">{student.text}</p>
                </div>
              ))}
            </div>
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-3 text-lg">Match Questions to Students:</h3>
              {currentQuestion.data.questions?.map((q: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 border-b last:border-b-0 border-gray-200">
                  <span className="text-gray-900 font-medium text-base mb-2 sm:mb-0 sm:mr-4 flex-1">{q.question}</span>
                  <select
                    className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer min-w-[120px]"
                    onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${idx}`, e.target.value)}
                    value={answers[`${currentQuestion.id}-${idx}`] || ''}
                  >
                    <option value="">Select...</option>
                    {currentQuestion.data.students?.map((letter: string) => (
                      <option key={letter} value={letter}>{letter}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      case 'open-response':
        return (
          <div className="space-y-5">
            {currentQuestion.data.questions?.map((q: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <label htmlFor={`open-response-${currentQuestion.id}-${idx}`} className="block text-base font-medium text-gray-800 mb-2">
                  {q.question}
                </label>
                <textarea
                  id={`open-response-${currentQuestion.id}-${idx}`}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400 text-gray-800 text-base"
                  placeholder="Type your answer here..."
                  onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${idx}`, e.target.value)}
                  value={answers[`${currentQuestion.id}-${idx}`] || ''}
                />
              </div>
            ))}
          </div>
        );
      case 'time-sequence':
        return (
          <div className="space-y-5">
             <h3 className="font-semibold text-gray-900 text-lg mb-3">Order these events:</h3>
            {currentQuestion.data.events?.map((event: any, idx: number) => (
              <div key={idx} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-yellow-50 p-5 rounded-lg border border-yellow-200 shadow-sm">
                <span className="text-gray-900 font-medium text-base flex-1 mb-3 sm:mb-0 sm:mr-4">{event.event}</span>
                <div className="flex space-x-4 ml-0 sm:ml-4">
                  {['P', 'N', 'F'].map((time) => (
                    <label key={time} className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name={`event-${currentQuestion.id}-${idx}`}
                        value={time}
                        onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${idx}`, e.target.value)}
                        checked={answers[`${currentQuestion.id}-${idx}`] === time}
                        className="mr-2 h-4 w-4 text-purple-600 focus:ring-purple-500"
                      />
                      <span className="text-sm font-medium text-yellow-800">{time}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'headline-matching':
        return (
          <div className="space-y-6">
            <div className="bg-purple-50 p-5 rounded-lg border border-purple-200 shadow-sm">
              <h4 className="font-bold text-purple-900 mb-4 text-lg">Headlines:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.data.headlines?.map((headline: any) => (
                  <div key={headline.letter} className="text-base text-purple-800">
                    <span className="font-extrabold mr-2">{headline.letter}.</span> {headline.text}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-900 text-lg mb-3">Match Articles to Headlines:</h3>
              {currentQuestion.data.articles?.map((article: any, idx: number) => (
                <div key={idx} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <p className="text-gray-900 mb-4 leading-relaxed text-base">{article.text}</p>
                  <select
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 cursor-pointer text-base"
                    onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${idx}`, e.target.value)}
                    value={answers[`${currentQuestion.id}-${idx}`] || ''}
                  >
                    <option value="">Select headline...</option>
                    {currentQuestion.data.headlines?.map((headline: any) => (
                      <option key={headline.letter} value={headline.letter}>
                        {headline.letter}. {headline.text}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>
        );
      case 'sentence-completion':
        return (
          <div className="space-y-5">
            {currentQuestion.data.sentences?.map((sentence: any, idx: number) => (
              <div key={idx} className="bg-orange-50 p-5 rounded-lg border border-orange-200 shadow-sm">
                <p className="text-gray-900 mb-2 leading-relaxed text-base">
                  {sentence.incomplete.split('_____')[0]}
                  <input
                    type="text"
                    className="mx-2 px-3 py-1.5 border-b-2 border-orange-300 bg-transparent focus:border-orange-500 focus:outline-none text-orange-900 font-medium text-base inline-block w-auto min-w-[100px]"
                    placeholder="[Your word]"
                    onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${idx}`, e.target.value)}
                    value={answers[`${currentQuestion.id}-${idx}`] || ''}
                  />
                  {sentence.incomplete.split('_____')[1]}
                </p>
              </div>
            ))}
          </div>
        );
      case 'translation':
        return (
          <div className="space-y-5">
            {currentQuestion.data.sentences?.map((sentence: any, idx: number) => (
              <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="font-semibold text-gray-900 mb-3 text-base">
                  {sentence.questionNumber}.{' '}
                  {sentence[language]}
                </p>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 placeholder-gray-400 text-gray-800 text-base"
                  placeholder="Enter English translation..."
                  onChange={(e) => handleAnswerChange(`${currentQuestion.id}-${idx}`, e.target.value)}
                  value={answers[`${currentQuestion.id}-${idx}`] || ''}
                />
              </div>
            ))}
          </div>
        );
      default:
        return (
          <div className="text-red-500 text-center p-4">
            <p>Unsupported question type: {currentQuestion.type}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        {/* Header with Progress and Timer */}
        <div className="bg-white rounded-xl shadow-lg mb-6 p-5 flex flex-col sm:flex-row items-center justify-between border-b-4 border-purple-500">
          <div className="flex items-center mb-4 sm:mb-0">
            <Target className="h-6 w-6 text-purple-600 mr-3" />
            <span className="text-md font-semibold text-gray-800">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-gray-500 mr-3" />
            <span className={`text-md font-semibold ${timeRemaining < 120 ? 'text-red-600 animate-pulse' : 'text-gray-800'}`}>
              {formatTime(timeRemaining)} <span className="text-sm font-normal text-gray-500">(Time Left)</span>
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-full sm:w-auto sm:flex-1 mt-4 sm:mt-0 sm:ml-6">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Question Content Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border-t-4 border-blue-500">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="text-2xl font-extrabold text-gray-900 mb-3">{currentQuestion.title}</h2>
            <p className="text-gray-700 leading-relaxed text-base">{currentQuestion.instructions}</p>
            {currentQuestion.text && (
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 mt-5">
                <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" /> Reading Passage
                </h3>
                <p className="text-gray-800 leading-relaxed font-serif text-base">{currentQuestion.text}</p>
              </div>
            )}
          </div>

          {/* Question Components */}
          <div className="mb-8 space-y-6">
            {renderQuestionComponent()} {/* Render the question component based on type */}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="inline-flex items-center px-5 py-2.5 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </button>
            <button
              onClick={handleNextQuestion}
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-200 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}