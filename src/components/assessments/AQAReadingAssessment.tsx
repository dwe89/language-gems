'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  FileText
} from 'lucide-react';
import { AQAReadingAssessmentService, type AQAQuestionResponse } from '../../services/aqaReadingAssessmentService';

// Question Types for AQA Reading Assessment
export interface AQAReadingQuestion {
  id: string;
  type: 'letter-matching' | 'multiple-choice' | 'student-grid' | 'open-response' | 'time-sequence' | 'sentence-completion' | 'headline-matching' | 'translation' | 'opinion-rating';
  title: string;
  instructions: string;
  text?: string; // Reading passage
  timeLimit?: number; // in seconds
  data: any; // Question-specific data structure
  marks: number; // Total marks for this question
}

interface AQAReadingAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: 'KS4';
  difficulty: 'foundation' | 'higher';
  identifier?: string; // Which paper (paper-1, paper-2, etc.)
  studentId?: string; // For authenticated users
  assignmentId?: string; // If this is an assigned assessment
  onComplete: (results: any) => void;
  onQuestionComplete?: (questionId: string, answer: any, timeSpent: number) => void;
}

export default function AQAReadingAssessment({
  language,
  difficulty,
  identifier = 'paper-1',
  studentId,
  assignmentId,
  onComplete,
  onQuestionComplete
}: AQAReadingAssessmentProps) {
  // Database and service state
  const [assessmentService] = useState(() => new AQAReadingAssessmentService());
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [resultId, setResultId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<AQAReadingQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // UI state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Timer state - persistent across questions
  const [totalElapsedSeconds, setTotalElapsedSeconds] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState<Date | null>(null);
  const [questionTimeSpent, setQuestionTimeSpent] = useState<Record<string, number>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load assessment data from database
  useEffect(() => {
    const loadAssessment = async () => {
      try {
        setIsLoading(true);

        // Get assessment definition
        const assessment = await assessmentService.getAssessmentByLevel(difficulty, language, identifier);
        if (!assessment) {
          console.error('Assessment not found for level:', difficulty, 'language:', language, 'identifier:', identifier);
          return;
        }

        setAssessmentId(assessment.id);

        // Get questions
        const questionsData = await assessmentService.getAssessmentQuestions(assessment.id);
        const formattedQuestions = questionsData
          .filter(q => !q.title.includes("Standardization question") && !q.instructions.includes("Standardization question"))
          .map(q => ({
            id: q.id,
            type: q.question_type as any,
            title: q.title,
            instructions: q.instructions,
            text: q.reading_text,
            marks: q.marks,
            data: q.question_data
          }));

        setQuestions(formattedQuestions);

        // Start assessment attempt if user is authenticated
        if (studentId && assessment.id) {
          const newResultId = await assessmentService.startAssessment(
            studentId,
            assessment.id,
            assignmentId
          );
          setResultId(newResultId);
        }

      } catch (error) {
        console.error('Error loading assessment:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAssessment();
  }, [difficulty, language, identifier, studentId, assignmentId, assessmentService]);

  // Initialize timer when first question loads
  useEffect(() => {
    if (questions.length > 0 && !timerRef.current) {
      setQuestionStartTime(new Date());

      // Start persistent timer
      timerRef.current = setInterval(() => {
        setTotalElapsedSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [questions.length]);

  const currentQuestion = questions[currentQuestionIndex];

  // Track time spent on current question
  useEffect(() => {
    if (questions.length > 0) {
      setQuestionStartTime(new Date());
    }
  }, [currentQuestionIndex, questions.length]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    // Record time spent on current question
    if (questionStartTime && currentQuestion) {
      const timeSpentOnQuestion = Math.floor((new Date().getTime() - questionStartTime.getTime()) / 1000);
      setQuestionTimeSpent(prev => ({
        ...prev,
        [currentQuestion.id]: timeSpentOnQuestion
      }));

      if (onQuestionComplete) {
        onQuestionComplete(currentQuestion.id, userAnswers[currentQuestion.id], timeSpentOnQuestion);
      }
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateQuestionScore = (question: AQAReadingQuestion, answer: any): number => {
    if (!answer) return 0;
    const data = question.data;
    let score = 0;

    try {
      switch (question.type) {
        case 'multiple-choice':
          // data.questions is array of { question, options, correctAnswer? }
          if (Array.isArray(data.questions)) {
            data.questions.forEach((q: any, index: number) => {
              // Check for correctAnswer property or if it's just stored in the object
              const correct = q.correctAnswer || q.correct;
              if (correct && answer[index] === correct) {
                score += 1;
              }
            });
          }
          break;

        case 'letter-matching':
          // data.students is array of { name, text, correctLetter? }
          if (Array.isArray(data.students)) {
            data.students.forEach((s: any) => {
              const correct = s.correctLetter || s.correct;
              if (correct && answer[s.name] === correct) {
                score += 1;
              }
            });
          }
          break;

        case 'student-grid':
          // data.questions is array of { question, correctStudent? }
          if (Array.isArray(data.questions)) {
            data.questions.forEach((q: any, index: number) => {
              const correct = q.correctStudent || q.correct;
              if (correct && answer[index] === correct) {
                score += 1;
              }
            });
          }
          break;

        case 'time-sequence':
          // data.events is array of { event, correctSequence? }
          if (Array.isArray(data.events)) {
            data.events.forEach((e: any, index: number) => {
              const correct = e.correctSequence || e.correct;
              if (correct && answer[index] === correct) {
                score += 1;
              }
            });
          }
          break;

        case 'sentence-completion':
          // data.sentences is array of { incomplete, correctCompletion? }
          if (Array.isArray(data.sentences)) {
            data.sentences.forEach((s: any, index: number) => {
              const correct = s.correctCompletion || s.correct;
              // Simple string matching, maybe case insensitive
              if (correct && typeof answer[index] === 'string' &&
                answer[index].trim().toLowerCase() === correct.trim().toLowerCase()) {
                score += 1;
              }
            });
          }
          break;

        case 'headline-matching':
          // data.articles is array of { text, correctHeadline? }
          if (Array.isArray(data.articles)) {
            data.articles.forEach((a: any, index: number) => {
              const correct = a.correctHeadline || a.correct;
              if (correct && answer[index] === correct) {
                score += 1;
              }
            });
          }
          break;

        // For open response and translation, we might not be able to auto-grade easily
        // without an AI service or strict matching. 
        // For now, we'll leave them as 0 or implement basic keyword matching if data exists.
        case 'open-response':
        case 'translation':
        default:
          break;
      }
    } catch (e) {
      console.error("Error calculating score for question", question.id, e);
    }
    // Cap score at question marks
    return Math.min(score, question.marks);
  };

  const handleComplete = async () => {
    // Stop the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Calculate total score
    let totalScore = 0;
    let totalPossibleScore = 0;

    const scoredAnswers: Record<string, { score: number, max: number }> = {};

    questions.forEach(question => {
      const answer = userAnswers[question.id];
      const score = calculateQuestionScore(question, answer);
      totalScore += score;
      totalPossibleScore += question.marks;

      scoredAnswers[question.id] = {
        score,
        max: question.marks
      };
    });

    const results = {
      answers: userAnswers,
      questionsCompleted: Object.keys(userAnswers).length,
      totalTimeSpent: totalElapsedSeconds,
      difficulty,
      language,
      totalScore,
      totalPossibleScore,
      percentageScore: totalPossibleScore > 0 ? Math.round((totalScore / totalPossibleScore) * 100) : 0,
      scoredAnswers
    };

    // If authenticated and using database, submit results
    if (studentId && resultId && assessmentId) {
      try {
        // Convert answers to question responses format
        const responses: AQAQuestionResponse[] = questions.map((question, index) => {
          const answer = userAnswers[question.id];
          const timeSpent = questionTimeSpent[question.id] || 0;
          const score = calculateQuestionScore(question, answer);

          return {
            question_id: question.id,
            question_number: index + 1,
            student_answer: JSON.stringify(answer),
            is_correct: score === question.marks, // Simplified is_correct
            points_awarded: score,
            time_spent_seconds: timeSpent,
            question_type: question.type,
            theme: 'Theme 1: People and lifestyle', // TODO: Get from question data
            topic: 'Identity and relationships with others', // TODO: Get from question data
            marks_possible: question.marks
          };
        });

        await assessmentService.submitAssessment(resultId, responses, totalElapsedSeconds);
      } catch (error) {
        console.error('Error submitting assessment:', error);
      }
    }

    setIsCompleted(true);
    onComplete(results);
  };

  // Letter Matching Question Renderer
  const renderLetterMatchingQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        {/* Reading Text */}
        {question.text && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Reading Text</h4>
            <p className="text-gray-700">{question.text}</p>
          </div>
        )}

        {/* Options */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Options</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {data.options?.map((option: any) => (
              <div key={option.letter} className="flex items-center space-x-2">
                <span className="font-bold text-blue-600">{option.letter}.</span>
                <span className="text-gray-700">{option.subject}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Student Texts and Answer Inputs */}
        <div className="space-y-4">
          {data.students?.map((student: any) => (
            <div key={student.name} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <h5 className="font-semibold text-gray-900 mb-2">{student.name}</h5>
                <p className="text-gray-700 italic">"{student.text}"</p>
              </div>
              <div className="flex items-center space-x-3">
                <label className="font-medium text-gray-700">Answer:</label>
                <select
                  value={currentAnswer[student.name] || ''}
                  onChange={(e) => handleAnswerChange(question.id, {
                    ...currentAnswer,
                    [student.name]: e.target.value
                  })}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  {data.options?.map((option: any) => (
                    <option key={option.letter} value={option.letter}>
                      {option.letter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Multiple Choice Question Renderer
  const renderMultipleChoiceQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        {/* Reading Text */}
        {question.text && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Reading Text</h4>
            <p className="text-gray-700">{question.text}</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {data.questions?.map((q: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">{q.question}</h5>
              <div className="space-y-2">
                {q.options?.map((option: string) => (
                  <label key={option} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}-${index}`}
                      value={option.charAt(0)} // A, B, C
                      checked={currentAnswer[index] === option.charAt(0)}
                      onChange={(e) => handleAnswerChange(question.id, {
                        ...currentAnswer,
                        [index]: e.target.value
                      })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Student Grid Question Renderer
  const renderStudentGridQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        {/* Student Texts */}
        <div className="space-y-4">
          {data.studentTexts?.map((student: any) => (
            <div key={student.name} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-900 mb-2">{student.name}</h5>
              <p className="text-gray-700 italic">"{student.text}"</p>
            </div>
          ))}
        </div>

        {/* Questions */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-4">
            Answer with: {data.students?.join(', ')}
          </h4>
          <div className="space-y-4">
            {data.questions?.map((q: any, index: number) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-gray-700 flex-1">{q.question}</span>
                <select
                  value={currentAnswer[index] || ''}
                  onChange={(e) => handleAnswerChange(question.id, {
                    ...currentAnswer,
                    [index]: e.target.value
                  })}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  {data.students?.map((student: string) => (
                    <option key={student} value={student}>
                      {student}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Open Response Question Renderer
  const renderOpenResponseQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        {/* Reading Text */}
        {question.text && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Reading Text</h4>
            <p className="text-gray-700">{question.text}</p>
          </div>
        )}

        {/* Questions */}
        <div className="space-y-6">
          {data.questions?.map((q: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-3">{q.question}</h5>
              {q.expectedWords && (
                <p className="text-sm text-gray-600 mb-2">
                  Expected answer length: approximately {q.expectedWords} words
                </p>
              )}
              <textarea
                value={currentAnswer[index] || ''}
                onChange={(e) => handleAnswerChange(question.id, {
                  ...currentAnswer,
                  [index]: e.target.value
                })}
                placeholder="Type your answer in English..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Translation Question Renderer
  const renderTranslationQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
          <h4 className="font-medium text-amber-900 mb-2">Translation Instructions</h4>
          <p className="text-amber-800">Translate the following sentences into English. Write your answers in the boxes provided.</p>
        </div>

        {/* Translation Sentences */}
        <div className="space-y-6">
          {data.sentences?.map((sentence: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-600">
                  {sentence.questionNumber} ({sentence.marks} marks)
                </span>
              </div>

              {/* Source sentence */}
              <div className="bg-gray-50 p-3 rounded mb-3">
                <p className="text-gray-900 font-medium">
                  {sentence.spanish || sentence.french || sentence.german}
                </p>
              </div>

              {/* Translation input */}
              <textarea
                value={currentAnswer[index] || ''}
                onChange={(e) => handleAnswerChange(question.id, {
                  ...currentAnswer,
                  [index]: e.target.value
                })}
                placeholder="Write your English translation here..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Time Sequence Question Renderer
  const renderTimeSequenceQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        {/* Reading Text */}
        {question.text && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Reading Text</h4>
            <p className="text-gray-700">{question.text}</p>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-2">Instructions</h4>
          <p className="text-blue-800">Write P for Past, N for Now (present), F for Future</p>
        </div>

        {/* Events */}
        <div className="space-y-4">
          {data.events?.map((event: any, index: number) => (
            <div key={index} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
              <span className="text-gray-700 flex-1">{event.event}</span>
              <div className="flex space-x-2">
                {['P', 'N', 'F'].map((option) => (
                  <label key={option} className="flex items-center space-x-1 cursor-pointer">
                    <input
                      type="radio"
                      name={`question-${question.id}-${index}`}
                      value={option}
                      checked={currentAnswer[index] === option}
                      onChange={(e) => handleAnswerChange(question.id, {
                        ...currentAnswer,
                        [index]: e.target.value
                      })}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sentence Completion Question Renderer
  const renderSentenceCompletionQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        {/* Reading Text */}
        {question.text && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Reading Text</h4>
            <p className="text-gray-700">{question.text}</p>
          </div>
        )}

        {/* Incomplete Sentences */}
        <div className="space-y-4">
          {data.sentences?.map((sentence: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-900 mb-3">{sentence.incomplete}</p>
              <input
                type="text"
                value={currentAnswer[index] || ''}
                onChange={(e) => handleAnswerChange(question.id, {
                  ...currentAnswer,
                  [index]: e.target.value
                })}
                placeholder="Complete the sentence..."
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Headline Matching Question Renderer
  const renderHeadlineMatchingQuestion = (question: AQAReadingQuestion) => {
    const data = question.data;
    const currentAnswer = userAnswers[question.id] || {};

    return (
      <div className="space-y-6">
        {/* Headlines */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-3">Headlines</h4>
          <div className="space-y-2">
            {data.headlines?.map((headline: any) => (
              <div key={headline.letter} className="flex items-start space-x-2">
                <span className="font-bold text-blue-600 mt-1">{headline.letter}.</span>
                <span className="text-gray-700">{headline.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="space-y-4">
          {data.articles?.map((article: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 mb-3 italic">"{article.text}"</p>
              <div className="flex items-center space-x-3">
                <label className="font-medium text-gray-700">Headline:</label>
                <select
                  value={currentAnswer[index] || ''}
                  onChange={(e) => handleAnswerChange(question.id, {
                    ...currentAnswer,
                    [index]: e.target.value
                  })}
                  className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select...</option>
                  {data.headlines?.map((headline: any) => (
                    <option key={headline.letter} value={headline.letter}>
                      {headline.letter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render question based on type
  const renderQuestion = (question: AQAReadingQuestion) => {
    switch (question.type) {
      case 'letter-matching':
        return renderLetterMatchingQuestion(question);
      case 'multiple-choice':
        return renderMultipleChoiceQuestion(question);
      case 'student-grid':
        return renderStudentGridQuestion(question);
      case 'open-response':
        return renderOpenResponseQuestion(question);
      case 'translation':
        return renderTranslationQuestion(question);
      case 'time-sequence':
        return renderTimeSequenceQuestion(question);
      case 'sentence-completion':
        return renderSentenceCompletionQuestion(question);
      case 'headline-matching':
        return renderHeadlineMatchingQuestion(question);
      default:
        return (
          <div className="text-center text-gray-500 p-8">
            <p>Question type "{question.type}" not yet implemented</p>
            <p className="text-sm mt-2">Question ID: {question.id}</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Assessment...</h2>
          <p className="text-gray-600">
            Preparing your AQA {difficulty} reading assessment.
          </p>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Complete!</h2>
          <p className="text-gray-600 mb-4">
            You have completed the AQA {difficulty} reading assessment.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600">
              Questions completed: {Object.keys(userAnswers).length} / {questions.length}
            </p>
            <p className="text-sm text-gray-600">
              Time taken: {Math.floor(totalElapsedSeconds / 60)}m {totalElapsedSeconds % 60}s
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center bg-white rounded-xl shadow-lg p-8">
          <div className="text-red-500 mb-4">
            <FileText className="h-16 w-16 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Assessment Not Available</h2>
          <p className="text-gray-600">
            The AQA {difficulty} reading assessment could not be loaded. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BookOpen className="h-6 w-6 text-purple-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-900">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-1" />
            <span>{Math.floor(totalElapsedSeconds / 60)}:{(totalElapsedSeconds % 60).toString().padStart(2, '0')}</span>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{currentQuestion.title}</h3>
          <p className="text-gray-700 mb-4">{currentQuestion.instructions}</p>
          <div className="flex items-center text-sm text-gray-500">
            <FileText className="h-4 w-4 mr-1" />
            <span>[{currentQuestion.marks} mark{currentQuestion.marks !== 1 ? 's' : ''}]</span>
          </div>
        </div>

        {/* Render question based on type */}
        {currentQuestion && renderQuestion(currentQuestion)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${currentQuestionIndex === 0
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Previous
        </button>

        <button
          onClick={handleNext}
          className="flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
          <ArrowRight className="h-5 w-5 ml-2" />
        </button>
      </div>
    </div>
  );
}
