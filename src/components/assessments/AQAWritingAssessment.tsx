'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  PenTool,
  FileText,
  Image as ImageIcon,
  MessageSquare,
  Edit3,
  Languages,
  Loader2
} from 'lucide-react';
import { AQAWritingAssessmentService, type AQAQuestionResponse } from '../../services/aqaWritingAssessmentService';
import { AQAWritingFeedback } from './AQAWritingFeedback';

// Types for marking
interface MarkingCriteria {
  questionType: 'photo-description' | 'short-message' | 'gap-fill' | 'translation' | 'extended-writing';
  language: 'es' | 'fr' | 'de';
  maxMarks: number;
  wordCountRequirement?: number;
  specificCriteria?: string[];
}

interface QuestionResponse {
  questionId: string;
  questionType: string;
  response: any;
  criteria: MarkingCriteria;
}

// Question Types for AQA Writing Assessment
export interface AQAWritingQuestion {
  id: string;
  type: 'photo-description' | 'short-message' | 'gap-fill' | 'translation' | 'extended-writing';
  title: string;
  instructions: string;
  photoUrl?: string; // For Q1 photo description
  timeLimit?: number; // in seconds
  data: any; // Question-specific data structure
  marks: number; // Total marks for this question
  wordCount?: number; // Required word count for writing tasks
}

interface AQAWritingAssessmentProps {
  language: 'es' | 'fr' | 'de';
  level: string;
  difficulty: 'foundation' | 'higher';
  identifier: string;
  assignmentId?: string; // For navigation back to assignment
  onComplete: (results: any) => void;
  onQuestionComplete: (questionId: string, answer: any, timeSpent: number) => void;
}

export function AQAWritingAssessment({
  language,
  level,
  difficulty,
  identifier,
  assignmentId,
  onComplete,
  onQuestionComplete
}: AQAWritingAssessmentProps) {
  const [questions, setQuestions] = useState<AQAWritingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now());
  const [isMarking, setIsMarking] = useState(false);
  const [markingResults, setMarkingResults] = useState<any>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  const assessmentService = useRef(new AQAWritingAssessmentService());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Language names for display
  const languageNames = {
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German'
  };

  useEffect(() => {
    loadAssessment();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [language, difficulty, identifier]);

  useEffect(() => {
    // Start timer
    timerRef.current = setInterval(() => {
      setTotalTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [startTime]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get assessment definition
      const assessment = await assessmentService.current.getAssessment(difficulty, language, identifier);
      if (!assessment) {
        setError('Assessment not found');
        return;
      }

      // Store the assessment ID for later use
      setAssessmentId(assessment.id);

      // Get questions for this assessment
      const questionsData = await assessmentService.current.getQuestions(assessment.id);
      if (!questionsData || questionsData.length === 0) {
        setError('No questions found for this assessment');
        return;
      }

      // Transform questions to component format
      const transformedQuestions: AQAWritingQuestion[] = questionsData.map(q => ({
        id: q.id,
        type: q.question_type as any,
        title: q.title,
        instructions: q.instructions,
        data: q.question_data,
        marks: q.marks,
        wordCount: q.word_count_requirement,
        photoUrl: q.question_data?.photoUrl
      }));

      setQuestions(transformedQuestions);
      setStartTime(Date.now());
      setQuestionStartTime(Date.now());
    } catch (err) {
      console.error('Error loading assessment:', err);
      setError('Failed to load assessment');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponseChange = (questionId: string, response: any) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: response
    }));
  };

  const handleNextQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const questionTime = Math.floor((Date.now() - questionStartTime) / 1000);
    
    // Save time spent on current question
    setTimeSpent(prev => ({
      ...prev,
      [currentQuestion.id]: questionTime
    }));

    // Call onQuestionComplete callback
    onQuestionComplete(currentQuestion.id, responses[currentQuestion.id], questionTime);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setQuestionStartTime(Date.now());
    } else {
      completeAssessment();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setQuestionStartTime(Date.now());
    }
  };

  const completeAssessment = async () => {
    const finalTotalTime = Math.floor((Date.now() - startTime) / 1000);
    const questionsCompleted = Object.keys(responses).length;

    setIsMarking(true);

    try {
      // Prepare questions for AI marking
      const questionResponses: QuestionResponse[] = questions.map((question, index) => {
        // Extract bullet points from question data (may be in different locations)
        const bulletPoints = question.data?.bulletPoints || 
                            question.data?.requirements || 
                            question.data?.option1?.bulletPoints || 
                            [];
        
        console.log(`📝 [MARKING] Q${index + 1} (${question.type}): Bullet points:`, bulletPoints);
        
        return {
          questionId: question.id,
          questionType: question.type,
          response: responses[question.id] || {},
          criteria: {
            questionType: question.type,
            language: language,
            maxMarks: question.marks,
            wordCountRequirement: question.wordCount,
            specificCriteria: bulletPoints,
            // Pass question data for gap-fill and translation marking
            questionData: question.data
          }
        };
      });

      // Call the API to mark the assessment
      const response = await fetch('/api/assessments/mark', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          responses: questionResponses
        })
      });

      if (!response.ok) {
        throw new Error('Failed to mark assessment');
      }

      const aiResults = await response.json();

      // CRITICAL: Merge AI results with question data for database saving
      // The API returns MarkingResult objects but we need to attach questionId, response, etc.
      const enrichedQuestionResults = (aiResults.questionResults || []).map((result: any, index: number) => {
        const question = questions[index];
        const questionResponse = responses[question?.id] || {};
        return {
          questionId: question?.id || `q${index + 1}`,
          questionType: question?.type || 'unknown',
          response: questionResponse,  // Student's actual response
          score: result.score || 0,
          maxScore: result.maxScore || question?.marks || 0,
          percentage: result.percentage || 0,
          feedback: result.feedback || '',
          detailedFeedback: result.detailedFeedback || {},
          timeSpent: timeSpent[question?.id] || 0
        };
      });

      // Prepare the complete results object including assessment ID
      const completeResults = {
        ...aiResults,
        assessmentId,  // Include the assessment ID for database saving
        timeSpent: finalTotalTime,
        language,
        difficulty,
        questionsCompleted,
        responses,
        questionTimeSpent: timeSpent,
        questionResults: enrichedQuestionResults  // Use enriched results with all data
      };

      setMarkingResults(completeResults);
      setShowFeedback(true);

      // CRITICAL: Call onComplete to save results to database
      console.log('✅ [Writing Assessment] Calling onComplete with results:', completeResults);
      onComplete(completeResults);

    } catch (error) {
      console.error('Error marking assessment:', error);
      // Fallback to basic completion
      const results = {
        assessmentId,
        totalTimeSpent: finalTotalTime,
        questionsCompleted,
        responses,
        timeSpent
      };
      onComplete(results);
    } finally {
      setIsMarking(false);
      setIsCompleted(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRetry = () => {
    // Reset all state for a new attempt
    setResponses({});
    setTimeSpent({});
    setCurrentQuestionIndex(0);
    setIsCompleted(false);
    setShowFeedback(false);
    setMarkingResults(null);
    setStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };

  const handleBackToMenu = () => {
    // Navigate back to assignment if in assignment mode, otherwise to assessment selection
    if (assignmentId) {
      window.location.href = `/student-dashboard/assessments/${assignmentId}`;
    } else {
      window.location.href = '/exam-style-assessment';
    }
  };

  // Question rendering functions
  const renderPhotoDescriptionQuestion = (question: AQAWritingQuestion) => {
    const response = responses[question.id] || { sentences: ['', '', '', '', ''] };

    return (
      <div className="space-y-6">
        {/* Photo display */}
        {/* Changed h-64 to a more flexible approach, and object-cover to object-contain */}
        <div className="bg-gray-100 border-2 border-gray-300 rounded-lg overflow-hidden flex justify-center items-center p-4"> {/* Added flex properties and padding for centering */}
          {question.photoUrl ? (
            <div className="relative max-w-full max-h-[400px]"> {/* Added max-h to prevent overly tall images */}
              <img
                src={question.photoUrl}
                alt={question.data?.photoDescription || 'Photo for description'}
                className="w-full h-auto object-contain" // Changed h-64 to h-auto and object-cover to object-contain
                onError={(e) => {
                  // Fallback if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = 'block';
                }}
              />
              <div className="hidden p-8 text-center" style={{ display: 'none' }}>
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Image could not be loaded</p>
                <p className="text-sm text-gray-500 mt-2">
                  {question.data?.photoDescription || 'A photo showing a scene for description'}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Photo will be displayed here</p>
              <p className="text-sm text-gray-500 mt-2">
                {question.data?.photoDescription || 'A photo showing a scene for description'}
              </p>
            </div>
          )}
        </div>

        {/* Five sentence inputs */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Write 5 sentences about the photo:</h4>
          {[1, 2, 3, 4, 5].map((num) => (
            <div key={num} className="flex items-start space-x-3">
              <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                {num}.{num}
              </span>
              <textarea
                value={response.sentences[num - 1] || ''}
                onChange={(e) => {
                  const newSentences = [...response.sentences];
                  newSentences[num - 1] = e.target.value;
                  handleResponseChange(question.id, { sentences: newSentences });
                }}
                placeholder={`Write sentence ${num} here...`}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                rows={2}
              />
              <span className="text-xs text-gray-500 mt-1">[2 marks]</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderShortMessageQuestion = (question: AQAWritingQuestion) => {
    const response = responses[question.id] || { message: '' };
    const wordCount = response.message ? response.message.split(/\s+/).filter((word: string) => word.length > 0).length : 0;

    return (
      <div className="space-y-6">
        {/* Topic and requirements */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-medium text-yellow-900 mb-2">
            Write a short message to your friend about {question.data?.topic || 'holidays'}
          </h4>
          <p className="text-yellow-800 mb-3">Write approximately 50 words.</p>
          <p className="text-yellow-800 font-medium">In your message, you must mention:</p>
          <ul className="list-disc list-inside text-yellow-800 mt-2 space-y-1">
            {(question.data?.requirements || ['city', 'hotel', 'food', 'weather', 'beach']).map((req: string, index: number) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>

        {/* Message input */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Your message:</label>
            <span className={`text-sm ${wordCount < 40 ? 'text-red-600' : wordCount > 60 ? 'text-orange-600' : 'text-green-600'}`}>
              {wordCount} words
            </span>
          </div>
          <textarea
            value={response.message}
            onChange={(e) => handleResponseChange(question.id, { message: e.target.value })}
            placeholder="Write your message here..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={8}
          />
        </div>
      </div>
    );
  };

  const renderGapFillQuestion = (question: AQAWritingQuestion) => {
    const response = responses[question.id] || {};
    // Support both 'questions' (database format) and 'sentences' (legacy format)
    const questions = question.data?.questions || question.data?.sentences || [];

    return (
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Choose the correct word to complete each sentence:</p>

        <div className="space-y-6">
          {questions.map((item: any, index: number) => {
            // Handle both database format (sentence with gaps) and legacy format (completeSentence with gapPosition)
            let sentenceDisplay;
            
            if (item.sentence) {
              // Database format: sentence has gaps marked with dots (……………………)
              // Replace the dots with a gap placeholder
              sentenceDisplay = item.sentence.replace(/…+/g, '<span class="inline-block px-3 py-1 bg-yellow-100 border-2 border-yellow-400 rounded mx-1">_____</span>');
            } else if (item.completeSentence) {
              // Legacy format: build sentence with gap at specific position
              const words = item.completeSentence?.trim().split(/\s+/).filter((w: string) => w) || [];
              const gapPosition = item.gapPosition || 1;
              sentenceDisplay = words.map((word: string, i: number) => 
                i === gapPosition - 1 
                  ? '<span class="inline-block px-3 py-1 bg-yellow-100 border-2 border-yellow-400 rounded mx-1">_____</span>'
                  : word
              ).join(' ');
            }

            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                    3.{index + 1}
                  </span>
                  <div className="flex-1">
                    {/* Display sentence with gap */}
                    <p 
                      className="text-gray-900 mb-3 font-medium"
                      dangerouslySetInnerHTML={{ __html: sentenceDisplay || '' }}
                    />

                    {/* Multiple choice options */}
                    <div className="grid grid-cols-1 gap-2">
                      {(item.options || []).map((option: string, optIndex: number) => (
                        <label key={optIndex} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                          <input
                            type="radio"
                            name={`question-${index}`}
                            value={option}
                            checked={response[`question-${index}`] === option}
                            onChange={(e) => handleResponseChange(question.id, {
                              ...response,
                              [`question-${index}`]: e.target.value
                            })}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <span className="text-gray-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">[1 mark]</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderTranslationQuestion = (question: AQAWritingQuestion) => {
    const response = responses[question.id] || {};

    return (
      <div className="space-y-6">
        <p className="text-gray-700 mb-4">Translate these sentences into {languageNames[language]}:</p>

        <div className="space-y-4">
          {(question.data?.sentences || []).map((sentence: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  4.{index + 1}
                </span>
                <div className="flex-1 space-y-3">
                  <p className="text-gray-900 font-medium">{sentence.englishText || sentence.english}</p>
                  <textarea
                    value={response[`translation-${index}`] || ''}
                    onChange={(e) => handleResponseChange(question.id, {
                      ...response,
                      [`translation-${index}`]: e.target.value
                    })}
                    placeholder={`Write your ${languageNames[language]} translation here...`}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                    rows={2}
                  />
                </div>
                <span className="text-xs text-gray-500">[2 marks]</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderExtendedWritingQuestion = (question: AQAWritingQuestion) => {
    const response = responses[question.id] || { article: '' };
    const wordCount = response.article ? response.article.split(/\s+/).filter((word: string) => word.length > 0).length : 0;

    return (
      <div className="space-y-6">
        {/* Writing prompt */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <h4 className="font-medium text-purple-900 mb-2">
            {question.data?.prompt || 'You are writing an article about your daily life and aspirations.'}
          </h4>
          <p className="text-purple-800 mb-3">Write approximately 90 words in {languageNames[language]}.</p>
          <p className="text-purple-800 font-medium">You must write something about each bullet point.</p>
          <ul className="list-disc list-inside text-purple-800 mt-2 space-y-1">
            {(question.data?.bulletPoints || [
              'What you did yesterday (past tense)',
              'What you think about your current hobbies (present tense/opinion)',
              'What you will do next weekend (future tense)'
            ]).map((point: string, index: number) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>

        {/* Writing area */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Your article:</label>
            <span className={`text-sm ${wordCount < 70 ? 'text-red-600' : wordCount > 110 ? 'text-orange-600' : 'text-green-600'}`}>
              {wordCount} words
            </span>
          </div>
          <textarea
            value={response.article}
            onChange={(e) => handleResponseChange(question.id, { article: e.target.value })}
            placeholder={`Write your article in ${languageNames[language]} here...`}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
            rows={12}
          />
          <p className="text-sm text-gray-500 mt-2">
            Remember to use different tenses as specified in the bullet points above.
          </p>
        </div>
      </div>
    );
  };

  // Main question renderer
  const renderQuestion = (question: AQAWritingQuestion) => {
    switch (question.type) {
      case 'photo-description':
        return renderPhotoDescriptionQuestion(question);
      case 'short-message':
        return renderShortMessageQuestion(question);
      case 'gap-fill':
        return renderGapFillQuestion(question);
      case 'translation':
        return renderTranslationQuestion(question);
      case 'extended-writing':
        return renderExtendedWritingQuestion(question);
      default:
        return (
          <div className="text-center text-gray-500 p-8">
            <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p>Question type "{question.type}" not implemented yet</p>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Assessment...</h2>
          <p className="text-gray-600">Preparing your AQA Writing assessment</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-900 mb-2">Error Loading Assessment</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // Show feedback screen if marking is complete
  if (showFeedback && markingResults) {
    return (
      <AQAWritingFeedback
        totalScore={markingResults.totalScore}
        maxScore={markingResults.maxScore}
        percentage={markingResults.percentage}
        questionResults={markingResults.questionResults}
        overallFeedback={markingResults.overallFeedback}
        timeSpent={markingResults.timeSpent}
        language={language}
        difficulty={difficulty}
        isAssignmentMode={!!assignmentId}
        onRetry={handleRetry}
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // Show marking screen
  if (isMarking) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
            <Loader2 className="h-16 w-16 text-blue-600 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-blue-900 mb-2">Marking Your Assessment...</h2>
            <p className="text-blue-700 mb-4">
              Our AI is carefully reviewing your writing and providing detailed feedback.
            </p>
            <div className="text-sm text-blue-600">
              <p>This may take a few moments. Please wait...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <div className="bg-green-50 border border-green-200 rounded-lg p-8">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-900 mb-2">Assessment Completed!</h2>
            <p className="text-green-700 mb-4">
              You have successfully completed the AQA Writing assessment.
            </p>
            <div className="text-sm text-green-600">
              <p>Time spent: {formatTime(totalTimeSpent)}</p>
              <p>Questions completed: {Object.keys(responses).length} of {questions.length}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-12">
          <PenTool className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Questions Available</h2>
          <p className="text-gray-600">This assessment does not have any questions yet.</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Progress Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <PenTool className="h-6 w-6 text-red-600 mr-3" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                AQA Writing Assessment - {languageNames[language]} {difficulty === 'foundation' ? 'Foundation' : 'Higher'}
              </h2>
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">{formatTime(totalTimeSpent)}</span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-red-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-lg mr-3">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">{currentQuestion.title}</h3>
              <p className="text-sm text-gray-600">{currentQuestion.marks} marks</p>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-medium">{currentQuestion.instructions}</p>
            {currentQuestion.wordCount && (
              <p className="text-blue-700 text-sm mt-2">
                Write approximately {currentQuestion.wordCount} words.
              </p>
            )}
          </div>
        </div>

        {/* Render question based on type */}
        <div className="mb-6">
          {renderQuestion(currentQuestion)}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            currentQuestionIndex === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </button>

        <button
          onClick={handleNextQuestion}
          className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
        >
          {currentQuestionIndex === questions.length - 1 ? 'Complete Assessment' : 'Next Question'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </button>
      </div>
    </div>
  );
}