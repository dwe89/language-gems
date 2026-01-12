'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Clock,
  ArrowRight,
  ArrowLeft,
  Mic,
  MessageSquare,
  BookOpen,
  Image as ImageIcon,
  Users,
  Loader2,
  CheckCircle,
  AlertCircle,
  Volume2,
} from 'lucide-react';
import { AudioRecorder } from './AudioRecorder';
import { TranscriptionReview } from './TranscriptionReview';
import { GradingDisplay } from './GradingDisplay';
import { RoleplaySection, type RoleplayTaskResponse } from './RoleplaySection';
import {
  SpeakingAssessmentService,
  type SpeakingQuestion,
  type SpeakingResult,
  type SpeakingResponse,
  type Tier,
  type Language,
  type AssessmentResult,
  type ErrorDetail,
  type RoleplayTask,
} from '@/services/speakingAssessmentService';
import { createClient } from '@/utils/supabase/client';

// =====================================================
// Types
// =====================================================

type QuestionStep = 'prompt' | 'recording' | 'transcribing' | 'reviewing' | 'grading' | 'graded';

interface QuestionState {
  step: QuestionStep;
  audioBlob?: Blob;
  audioUrl?: string;
  audioDuration?: number;
  transcription?: string;
  transcriptionConfidence?: number;
  gradingResult?: AssessmentResult;
  responseId?: string;
}

interface SpeakingAssessmentProps {
  language: Language;
  level: Tier;
  identifier: string;
  assignmentId?: string;
  onComplete: (result: SpeakingResult) => void;
}

// =====================================================
// Section Icons
// =====================================================

const sectionIcons: Record<string, React.ComponentType<any>> = {
  roleplay: MessageSquare,
  reading_aloud: BookOpen,
  short_conversation: Users,
  photocard: ImageIcon,
  general_conversation: Mic,
};

const sectionLabels: Record<string, string> = {
  roleplay: 'Roleplay',
  reading_aloud: 'Reading Aloud',
  short_conversation: 'Short Conversation',
  photocard: 'Photocard Discussion',
  general_conversation: 'General Conversation',
};

// =====================================================
// Main Component
// =====================================================

export function SpeakingAssessment({
  language,
  level,
  identifier,
  assignmentId,
  onComplete,
}: SpeakingAssessmentProps) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [questions, setQuestions] = useState<SpeakingQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionState, setQuestionState] = useState<QuestionState>({ step: 'prompt' });
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [responses, setResponses] = useState<Map<string, SpeakingResponse>>(new Map());
  const [totalTimeSpent, setTotalTimeSpent] = useState(0);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [showPrepTime, setShowPrepTime] = useState(true);
  const [prepTimeRemaining, setPrepTimeRemaining] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [isInRoleplayMode, setIsInRoleplayMode] = useState(false);

  // Refs
  const serviceRef = useRef(new SpeakingAssessmentService());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  // Language names
  const languageNames: Record<Language, string> = {
    es: 'Spanish',
    fr: 'French',
    de: 'German',
  };

  // Current question
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  // =====================================================
  // Load Assessment
  // =====================================================

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        // For demo/testing, we might want to allow "guest" access or redirect
        // But for now, let's show an error if not logged in
        setError('You must be logged in to take this assessment');
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (userId) {
      loadAssessment();
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [language, level, identifier, userId]);

  const loadAssessment = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const service = serviceRef.current;

      // Get assessment definition
      const assessment = await service.getAssessment(level, language, identifier);
      if (!assessment) {
        setError('Assessment not found');
        return;
      }

      setAssessmentId(assessment.id);

      // Get questions
      const questionsData = await service.getQuestions(assessment.id);
      if (!questionsData || questionsData.length === 0) {
        setError('No questions found for this assessment');
        return;
      }

      setQuestions(questionsData);

      // Check for prep time
      if (assessment.prep_time_minutes && assessment.prep_time_minutes > 0) {
        setPrepTimeRemaining(assessment.prep_time_minutes * 60);
      } else {
        setShowPrepTime(false);
      }

      // Start or get existing result
      const existingResult = await service.getOrStartExam(
        assessment.id,
        userId!, // We checked userId exists in useEffect
        assignmentId
      );

      if (existingResult) {
        setResult(existingResult);

        // Load existing responses
        const existingResponses = await service.getResponses(existingResult.id);
        const responseMap = new Map<string, SpeakingResponse>();
        existingResponses.forEach(r => {
          responseMap.set(r.question_id, r);
        });
        setResponses(responseMap);
      }

      // Start timer
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        setTotalTimeSpent(Math.floor((Date.now() - startTimeRef.current) / 1000));
      }, 1000);

    } catch (err: any) {
      console.error('Error loading assessment:', err);
      setError(err.message || 'Failed to load assessment');
    } finally {
      setIsLoading(false);
    }
  };

  // =====================================================
  // Prep Time Handler
  // =====================================================

  useEffect(() => {
    if (showPrepTime && prepTimeRemaining > 0) {
      const timer = setInterval(() => {
        setPrepTimeRemaining(prev => {
          if (prev <= 1) {
            setShowPrepTime(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [showPrepTime, prepTimeRemaining]);

  const skipPrepTime = () => {
    setShowPrepTime(false);
    setPrepTimeRemaining(0);
  };

  // =====================================================
  // Recording Handlers
  // =====================================================

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob);

    setQuestionState({
      step: 'transcribing',
      audioBlob,
      audioUrl,
      audioDuration: duration,
    });

    // Start transcription
    try {
      const transcriptionResult = await serviceRef.current.transcribeAudio(audioBlob, language);

      if (transcriptionResult) {
        setQuestionState(prev => ({
          ...prev,
          step: 'reviewing',
          transcription: transcriptionResult.transcription,
          transcriptionConfidence: transcriptionResult.confidence,
        }));
      } else {
        setQuestionState(prev => ({
          ...prev,
          step: 'reviewing',
          transcription: '',
          transcriptionConfidence: 0,
        }));
        setError('Transcription failed. Please verify manually.');
      }
    } catch (err) {
      console.error('Transcription error:', err);
      setQuestionState(prev => ({
        ...prev,
        step: 'reviewing',
        transcription: '',
        transcriptionConfidence: 0,
      }));
    }
  };

  const handleReRecord = () => {
    if (questionState.audioUrl) {
      URL.revokeObjectURL(questionState.audioUrl);
    }
    setQuestionState({ step: 'recording' });
  };

  // =====================================================
  // Transcription Confirmation
  // =====================================================

  const handleTranscriptionConfirm = async (finalTranscription: string, wasEdited: boolean) => {
    if (!currentQuestion || !result) return;

    setQuestionState(prev => ({ ...prev, step: 'grading' }));

    try {
      const service = serviceRef.current;

      // Upload audio file
      let audioFileUrl: string | null = null;
      if (questionState.audioBlob) {
        audioFileUrl = await service.uploadAudioFile(
          questionState.audioBlob,
          result.student_id,
          assessmentId!,
          currentQuestion.id
        );
      }

      // Save response
      const savedResponse = await service.saveResponse(
        result.id,
        currentQuestion.id,
        result.student_id,
        audioFileUrl || '',
        questionState.audioDuration || 0
      );

      if (savedResponse) {
        // Update transcription
        await service.updateTranscription(
          savedResponse.id,
          questionState.transcription || '',
          questionState.transcriptionConfidence || 0
        );

        // Verify transcription
        await service.verifyTranscription(
          savedResponse.id,
          wasEdited ? finalTranscription : undefined
        );

        // Assess the response
        const gradingResult = await service.assessResponse(
          finalTranscription,
          currentQuestion,
          level,
          language
        );

        if (gradingResult) {
          // Save grading result
          await service.gradeResponse(savedResponse.id, gradingResult);

          setQuestionState(prev => ({
            ...prev,
            step: 'graded',
            gradingResult,
            responseId: savedResponse.id,
          }));

          // Update responses map
          setResponses(prev => {
            const newMap = new Map(prev);
            newMap.set(currentQuestion.id, {
              ...savedResponse,
              score: gradingResult.totalScore,
              is_graded: true,
            } as SpeakingResponse);
            return newMap;
          });
        } else {
          setError('Failed to assess response');
          setQuestionState(prev => ({ ...prev, step: 'reviewing' }));
        }
      }
    } catch (err: any) {
      console.error('Error processing response:', err);
      setError(err.message || 'Failed to process response');
      setQuestionState(prev => ({ ...prev, step: 'reviewing' }));
    }
  };

  // =====================================================
  // Navigation
  // =====================================================

  const handleNextQuestion = async () => {
    if (isLastQuestion) {
      // Complete the exam
      await completeExam();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setQuestionState({ step: 'prompt' });
    }
  };

  const handleStartRecording = () => {
    setQuestionState({ step: 'recording' });
  };

  const completeExam = async () => {
    if (!result) return;

    try {
      const completedResult = await serviceRef.current.completeExam(
        result.id,
        totalTimeSpent
      );

      if (completedResult) {
        onComplete(completedResult);
      }
    } catch (err) {
      console.error('Error completing exam:', err);
      setError('Failed to complete exam');
    }
  };

  // =====================================================
  // Roleplay Completion Handler
  // =====================================================

  const handleRoleplayComplete = async (roleplayResponses: RoleplayTaskResponse[]) => {
    if (!currentQuestion || !result) return;

    setQuestionState({ step: 'grading' });

    try {
      const service = serviceRef.current;

      // Combine all roleplay responses into a single assessment
      const combinedTranscription = roleplayResponses
        .map(r => `Task ${r.taskNumber}: ${r.transcription || '[No response]'}`)
        .join('\n\n');

      // Upload all audio files and save responses
      for (const roleplayResponse of roleplayResponses) {
        if (roleplayResponse.audioBlob) {
          const audioFileUrl = await service.uploadAudioFile(
            roleplayResponse.audioBlob,
            result.student_id,
            assessmentId!,
            `${currentQuestion.id}_task_${roleplayResponse.taskNumber}`
          );
        }
      }

      // Save the main response
      const savedResponse = await service.saveResponse(
        result.id,
        currentQuestion.id,
        result.student_id,
        '', // Audio URL handled per-task above
        roleplayResponses.reduce((sum, r) => sum + (r.duration || 0), 0)
      );

      if (savedResponse) {
        // Update transcription with combined responses
        await service.updateTranscription(
          savedResponse.id,
          combinedTranscription,
          roleplayResponses.reduce((sum, r) => sum + (r.confidence || 0), 0) / roleplayResponses.length
        );

        // Assess the combined roleplay response
        const gradingResult = await service.assessResponse(
          combinedTranscription,
          currentQuestion,
          level,
          language
        );

        if (gradingResult) {
          // Save grading result
          await service.gradeResponse(savedResponse.id, gradingResult);

          setQuestionState({
            step: 'graded',
            gradingResult,
            responseId: savedResponse.id,
            transcription: combinedTranscription,
          });

          // Update responses map
          setResponses(prev => {
            const newMap = new Map(prev);
            newMap.set(currentQuestion.id, {
              ...savedResponse,
              score: gradingResult.totalScore,
              is_graded: true,
            } as SpeakingResponse);
            return newMap;
          });

          setIsInRoleplayMode(false);
        } else {
          setError('Failed to assess roleplay response');
          setIsInRoleplayMode(false);
        }
      }
    } catch (err: any) {
      console.error('Error processing roleplay:', err);
      setError(err.message || 'Failed to process roleplay');
      setIsInRoleplayMode(false);
    }
  };

  const handleStartRoleplay = () => {
    setIsInRoleplayMode(true);
  };

  // =====================================================
  // Format Time
  // =====================================================

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // =====================================================
  // Loading State
  // =====================================================

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Loading speaking assessment...</p>
      </div>
    );
  }

  // =====================================================
  // Error State
  // =====================================================

  if (error && !currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-600 dark:text-red-400 text-lg font-medium">{error}</p>
        <button
          onClick={loadAssessment}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  // =====================================================
  // Prep Time Screen - Shows actual question content
  // =====================================================

  if (showPrepTime && prepTimeRemaining > 0) {
    // Group questions by section for prep display
    const roleplayQuestions = questions.filter(q => q.section_type === 'roleplay');
    const readingAloudQuestions = questions.filter(q => q.section_type === 'reading_aloud');
    const photocardQuestions = questions.filter(q => q.section_type === 'photocard');
    
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="text-center mb-6">
          <Clock className="w-12 h-12 text-blue-500 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Preparation Time
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Study the materials below. You will be asked to respond to these in {languageNames[language]}.
          </p>
        </div>

        <div className="text-5xl font-mono font-bold text-center text-blue-600 mb-6">
          {formatTime(prepTimeRemaining)}
        </div>

        {/* Roleplay Section Preview */}
        {roleplayQuestions.length > 0 && (
          <div className="mb-6 p-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100">
                Roleplay
              </h3>
            </div>
            {roleplayQuestions.map((q, idx) => (
              <div key={q.id} className="mb-4 last:mb-0">
                <p className="text-orange-800 dark:text-orange-200 font-medium mb-2">
                  {q.prompt_text}
                </p>
                {q.context_text && (
                  <div className="pl-4 border-l-2 border-orange-300 dark:border-orange-700 mb-3">
                    <p className="text-sm text-orange-700 dark:text-orange-300 whitespace-pre-line">
                      {q.context_text}
                    </p>
                  </div>
                )}
                {/* Show roleplay tasks if available */}
                {q.roleplay_tasks && q.roleplay_tasks.length > 0 && (
                  <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-orange-800 dark:text-orange-200 mb-2">
                      Your tasks (in order):
                    </p>
                    <ol className="space-y-2">
                      {(q.roleplay_tasks as RoleplayTask[]).map((task) => (
                        <li key={task.task_number} className="text-sm text-orange-700 dark:text-orange-300 flex items-start gap-2">
                          <span className="font-bold text-orange-600">{task.task_number}.</span>
                          <span>{task.student_prompt_en}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            ))}
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-3 italic">
              The examiner will speak in {languageNames[language]}. Listen carefully and respond to each task.
            </p>
          </div>
        )}

        {/* Reading Aloud Section Preview */}
        {readingAloudQuestions.length > 0 && (
          <div className="mb-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">
                Reading Aloud
              </h3>
            </div>
            {readingAloudQuestions.map((q, idx) => (
              <div key={q.id} className="mb-4 last:mb-0 p-4 bg-white dark:bg-gray-800 rounded-lg">
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed" lang={language}>
                  {q.reading_text}
                </p>
              </div>
            ))}
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-3 italic">
              Practice reading this text aloud clearly and naturally.
            </p>
          </div>
        )}

        {/* Photocard Section Preview */}
        {photocardQuestions.length > 0 && (
          <div className="mb-6 p-5 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">
                Photocard Discussion
              </h3>
            </div>
            {photocardQuestions.map((q, idx) => (
              <div key={q.id} className="mb-4 last:mb-0">
                {q.photo_urls && q.photo_urls.length > 0 && (
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    {q.photo_urls.map((url, i) => (
                      <img
                        key={i}
                        src={url}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-40 object-cover rounded-lg border border-purple-200 dark:border-purple-700"
                      />
                    ))}
                  </div>
                )}
                {q.bullet_points && q.bullet_points.length > 0 && (
                  <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <p className="text-sm font-medium text-purple-800 dark:text-purple-200 mb-2">
                      You will be asked about:
                    </p>
                    <ul className="space-y-1">
                      {q.bullet_points.map((point, i) => (
                        <li key={i} className="text-sm text-purple-700 dark:text-purple-300 flex items-start gap-2">
                          <span className="font-bold">{i + 1}.</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={skipPrepTime}
          className="w-full py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600
                   text-gray-700 dark:text-gray-300 rounded-lg transition-colors font-medium"
        >
          I&apos;m Ready - Start the Exam
        </button>
      </div>
    );
  }

  // =====================================================
  // Main Assessment UI
  // =====================================================

  if (!currentQuestion) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Assessment Complete!
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Your responses have been submitted for grading.
        </p>
      </div>
    );
  }

  // Check if this is a roleplay question with tasks
  const isRoleplayWithTasks = currentQuestion.section_type === 'roleplay' && 
    currentQuestion.roleplay_tasks && 
    currentQuestion.roleplay_tasks.length > 0;

  const SectionIcon = sectionIcons[currentQuestion.section_type] || Mic;

  // =====================================================
  // Roleplay Mode - Question-by-Question Flow
  // =====================================================

  if (isInRoleplayMode && isRoleplayWithTasks) {
    return (
      <div className="max-w-3xl mx-auto">
        {/* Header with timer */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {sectionLabels[currentQuestion.section_type]} - {currentQuestion.question_number}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {languageNames[language]} • {level === 'higher' ? 'Higher' : 'Foundation'} Tier
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Clock className="w-5 h-5" />
            <span className="font-mono">{formatTime(totalTimeSpent)}</span>
          </div>
        </div>

        {/* Error display */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <RoleplaySection
          tasks={currentQuestion.roleplay_tasks as RoleplayTask[]}
          language={language}
          onComplete={handleRoleplayComplete}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <SectionIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              {sectionLabels[currentQuestion.section_type]} - Question {currentQuestion.question_number}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {languageNames[language]} • {level === 'higher' ? 'Higher' : 'Foundation'} Tier
            </p>
          </div>
        </div>

        {/* Timer */}
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Clock className="w-5 h-5" />
          <span className="font-mono">{formatTime(totalTimeSpent)}</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
          <span>{Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
        {/* Prompt Step */}
        {questionState.step === 'prompt' && (
          <div className="flex flex-col items-center gap-6">
            {/* Question prompt */}
            <div className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg text-gray-900 dark:text-white leading-relaxed">
                {currentQuestion.prompt_text}
              </p>

              {currentQuestion.context_text && (
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 italic">
                  Context: {currentQuestion.context_text}
                </p>
              )}
            </div>

            {/* Roleplay tasks preview */}
            {isRoleplayWithTasks && currentQuestion.roleplay_tasks && (
              <div className="w-full p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                <h4 className="font-medium text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Your tasks in this roleplay:
                </h4>
                <ol className="space-y-2">
                  {(currentQuestion.roleplay_tasks as RoleplayTask[]).map((task, index) => (
                    <li key={index} className="text-orange-800 dark:text-orange-200 flex items-start gap-2">
                      <span className="font-bold">{task.task_number}.</span>
                      <span>{task.student_prompt_en}</span>
                    </li>
                  ))}
                </ol>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-3 italic">
                  The examiner will ask you each question in {languageNames[language]}. Listen and respond.
                </p>
              </div>
            )}

            {/* Reading text for reading aloud */}
            {currentQuestion.reading_text && (
              <div className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Text to Read Aloud
                </h4>
                <p className="text-blue-800 dark:text-blue-200" lang={language}>
                  {currentQuestion.reading_text}
                </p>
              </div>
            )}

            {/* Photos for photocard */}
            {currentQuestion.photo_urls && currentQuestion.photo_urls.length > 0 && (
              <div className="w-full grid grid-cols-2 gap-4">
                {currentQuestion.photo_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                ))}
              </div>
            )}

            {/* Bullet points for photocard */}
            {currentQuestion.bullet_points && currentQuestion.bullet_points.length > 0 && (
              <div className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                  Points to discuss:
                </h4>
                <ul className="space-y-1">
                  {currentQuestion.bullet_points.map((point, index) => (
                    <li key={index} className="text-purple-800 dark:text-purple-200 flex items-start gap-2">
                      <span>•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Time limit info */}
            {currentQuestion.time_limit_seconds && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ⏱️ Time limit: {formatTime(currentQuestion.time_limit_seconds)}
              </p>
            )}

            {/* Start recording/roleplay button */}
            {isRoleplayWithTasks ? (
              <button
                onClick={handleStartRoleplay}
                className="flex items-center gap-2 px-8 py-4 bg-orange-500 hover:bg-orange-600 
                         text-white font-medium rounded-full shadow-lg transition-all
                         hover:scale-105 active:scale-95"
              >
                <MessageSquare className="w-6 h-6" />
                <span>Start Roleplay</span>
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                className="flex items-center gap-2 px-8 py-4 bg-red-500 hover:bg-red-600 
                         text-white font-medium rounded-full shadow-lg transition-all
                         hover:scale-105 active:scale-95"
              >
                <Mic className="w-6 h-6" />
                <span>Record Answer</span>
              </button>
            )}
          </div>
        )}

        {/* Recording Step */}
        {questionState.step === 'recording' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-full p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-lg text-gray-900 dark:text-white">
                {currentQuestion.prompt_text}
              </p>
            </div>

            <AudioRecorder
              maxDuration={currentQuestion.time_limit_seconds || 120}
              minDuration={3}
              onRecordingComplete={handleRecordingComplete}
              showPlayback={true}
            />
          </div>
        )}

        {/* Transcribing Step */}
        {questionState.step === 'transcribing' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Transcribing your response...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              This may take a few seconds
            </p>
          </div>
        )}

        {/* Reviewing Step */}
        {questionState.step === 'reviewing' && questionState.transcription !== undefined && (
          <TranscriptionReview
            transcription={questionState.transcription}
            confidence={questionState.transcriptionConfidence}
            audioUrl={questionState.audioUrl}
            onConfirm={handleTranscriptionConfirm}
            onReRecord={handleReRecord}
            language={language}
          />
        )}

        {/* Grading Step */}
        {questionState.step === 'grading' && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-12 h-12 text-green-500 animate-spin mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Grading your response...
            </p>
          </div>
        )}

        {/* Graded Step */}
        {questionState.step === 'graded' && questionState.gradingResult && (
          <GradingDisplay
            questionNumber={currentQuestion.question_number}
            totalQuestions={questions.length}
            score={questionState.gradingResult.totalScore}
            maxScore={questionState.gradingResult.maxScore}
            criteriaScores={questionState.gradingResult.criteriaScores}
            criteriaMet={questionState.gradingResult.criteriaMet}
            errors={questionState.gradingResult.errors}
            feedback={questionState.gradingResult.feedback}
            suggestions={questionState.gradingResult.suggestions}
            onNext={handleNextQuestion}
            isLastQuestion={isLastQuestion}
          />
        )}
      </div>

      {/* Question navigation dots */}
      <div className="flex justify-center gap-2 mt-6">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${index === currentQuestionIndex
                ? 'bg-blue-500'
                : index < currentQuestionIndex
                  ? 'bg-green-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
          />
        ))}
      </div>
    </div>
  );
}

export default SpeakingAssessment;
