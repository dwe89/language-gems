'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Edit2,
  Save,
  X,
  Volume2,
  Mic,
  User,
  Clock,
  Star,
  MessageSquare,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';
import { SpeakingAssessmentService, type SpeakingResult, type SpeakingResponse, type SpeakingQuestion } from '@/services/speakingAssessmentService';

// =====================================================
// Types
// =====================================================

interface TeacherReviewProps {
  resultId: string;
  onClose?: () => void;
  onSaved?: () => void;
}

interface ResponseWithGrading extends SpeakingResponse {
  question?: SpeakingQuestion;
}

// =====================================================
// Sub-Components
// =====================================================

interface AudioPlayerProps {
  url: string;
  className?: string;
}

function AudioPlayer({ url, className = '' }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />
      <button
        onClick={togglePlay}
        className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        ) : (
          <Play className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        )}
      </button>
      <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
        />
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[60px]">
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}

interface ScoreEditorProps {
  label: string;
  score: number;
  maxScore: number;
  onUpdate: (newScore: number) => void;
  disabled?: boolean;
}

function ScoreEditor({ label, score, maxScore, onUpdate, disabled = false }: ScoreEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(score.toString());

  const handleSave = () => {
    const newScore = Math.min(Math.max(0, parseInt(editValue) || 0), maxScore);
    onUpdate(newScore);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <input
              type="number"
              min="0"
              max={maxScore}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-16 px-2 py-1 text-center text-sm border rounded dark:bg-gray-700 dark:border-gray-600"
              autoFocus
            />
            <span className="text-sm text-gray-500">/ {maxScore}</span>
            <button onClick={handleSave} className="p-1 text-green-600 hover:bg-green-100 rounded">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={() => setIsEditing(false)} className="p-1 text-red-600 hover:bg-red-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{score}</span>
            <span className="text-sm text-gray-500">/ {maxScore}</span>
            {!disabled && (
              <button
                onClick={() => {
                  setEditValue(score.toString());
                  setIsEditing(true);
                }}
                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// =====================================================
// Main Component
// =====================================================

export function TeacherSpeakingReview({ resultId, onClose, onSaved }: TeacherReviewProps) {
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SpeakingResult | null>(null);
  const [responses, setResponses] = useState<ResponseWithGrading[]>([]);
  const [currentResponseIndex, setCurrentResponseIndex] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['grading', 'transcription']));
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [overrideComment, setOverrideComment] = useState('');

  const service = useRef(new SpeakingAssessmentService()).current;
  const currentResponse = responses[currentResponseIndex];

  // Load data
  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        setError(null);

        // Load result details
        const resultData = await service.getResultById(resultId);
        if (!resultData) {
          throw new Error('Result not found');
        }
        setResult(resultData);

        // Load responses with their questions
        const responsesData = await service.getResponsesForResult(resultId);
        setResponses(responsesData as ResponseWithGrading[]);
      } catch (err) {
        console.error('Error loading review data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, [resultId, service]);

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  // Handle score override
  const handleScoreOverride = async () => {
    if (!result || !currentResponse) return;

    try {
      setIsSaving(true);

      // Get user ID (would come from auth in real app)
      const teacherId = 'teacher-review'; // TODO: Get from auth context

      // Save teacher override
      await service.teacherOverride(
        currentResponse.id,
        currentResponse.score, // Use current (possibly modified) score
        overrideComment || 'Teacher review and adjustment',
        teacherId
      );

      setHasChanges(false);
      onSaved?.();
    } catch (err) {
      console.error('Error saving override:', err);
      setError(err instanceof Error ? err.message : 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Handle response score update
  const updateResponseScore = (newScore: number) => {
    if (!currentResponse) return;

    setResponses((prev) =>
      prev.map((r, i) =>
        i === currentResponseIndex ? { ...r, score: newScore } : r
      )
    );
    setHasChanges(true);
  };

  // Navigation
  const goToNext = () => {
    if (currentResponseIndex < responses.length - 1) {
      setCurrentResponseIndex((prev) => prev + 1);
    }
  };

  const goToPrev = () => {
    if (currentResponseIndex > 0) {
      setCurrentResponseIndex((prev) => prev - 1);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg">
        <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
          <XCircle className="w-6 h-6" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // No result
  if (!result) {
    return (
      <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
        <p className="text-gray-600 dark:text-gray-400">No result found</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Speaking Assessment Review
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Reviewing response {currentResponseIndex + 1} of {responses.length}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Summary Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-gray-500">Total Score</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {result.total_score} / {result.max_score}
            </p>
            <p className="text-sm text-gray-500">
              {result.percentage_score}%
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <User className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-500">Student</span>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {result.student_id?.slice(0, 8)}...
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-green-500" />
              <span className="text-sm text-gray-500">Time</span>
            </div>
            <p className="text-lg font-medium text-gray-900 dark:text-white">
              {Math.round((result.total_time_seconds || 0) / 60)} min
            </p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <CheckCircle className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-500">Status</span>
            </div>
            <p className={`text-lg font-medium ${
              result.status === 'completed' ? 'text-green-600' :
              result.status === 'in_progress' ? 'text-yellow-600' : 'text-gray-600'
            }`}>
              {result.status}
            </p>
          </div>
        </div>
      </div>

      {/* Current Response */}
      {currentResponse && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {/* Response Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <Mic className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    Question {currentResponse.question?.question_number || currentResponseIndex + 1}
                  </h3>
                  <p className="text-sm text-white/80">
                    {currentResponse.question?.section_type?.replace(/_/g, ' ') || 'Response'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">
                  {currentResponse.score} / {currentResponse.max_score}
                </div>
                <div className="text-sm text-white/80">
                  {Math.round(((currentResponse.score || 0) / (currentResponse.max_score || 1)) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Question Text */}
          {currentResponse.question && (
            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {currentResponse.question.question_text}
              </p>
            </div>
          )}

          {/* Audio Player */}
          {currentResponse.audio_file_url && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-2">
                <Volume2 className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recording</span>
              </div>
              <AudioPlayer url={currentResponse.audio_file_url} />
            </div>
          )}}

          {/* Transcription Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('transcription')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Transcription</span>
                {currentResponse.student_verified && (
                  <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded">
                    Student Verified
                  </span>
                )}
              </div>
              {expandedSections.has('transcription') ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {expandedSections.has('transcription') && (
              <div className="p-4 pt-0">
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                    {currentResponse.final_transcription || currentResponse.student_edited_transcription || currentResponse.original_transcription || 'No transcription available'}
                  </p>
                </div>
                {currentResponse.transcription_confidence !== undefined && (
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Confidence:</span>
                    <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          currentResponse.transcription_confidence >= 0.8 ? 'bg-green-500' :
                          currentResponse.transcription_confidence >= 0.6 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${currentResponse.transcription_confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {Math.round(currentResponse.transcription_confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Grading Section */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => toggleSection('grading')}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-gray-400" />
                <span className="font-medium text-gray-700 dark:text-gray-300">Grading Details</span>
              </div>
              {expandedSections.has('grading') ? (
                <ChevronUp className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-400" />
              )}
            </button>
            {expandedSections.has('grading') && (
              <div className="p-4 pt-0 space-y-4">
                {/* Score Editor */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <ScoreEditor
                    label="Response Score"
                    score={currentResponse.score || 0}
                    maxScore={currentResponse.max_score || 10}
                    onUpdate={updateResponseScore}
                  />
                </div>

                {/* AI Feedback */}
                {currentResponse.ai_feedback && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      AI Feedback
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      {currentResponse.ai_feedback}
                    </p>
                  </div>
                )}

                {/* Teacher Override */}
                {currentResponse.teacher_override_score !== undefined && currentResponse.teacher_override_score !== null && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                        Teacher Override Applied (Score: {currentResponse.teacher_override_score})
                      </span>
                    </div>
                    {currentResponse.teacher_override_reason && (
                      <p className="text-sm text-yellow-700 dark:text-yellow-400">
                        {currentResponse.teacher_override_reason}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Teacher Comment */}
          <div className="p-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Teacher Comments (optional)
            </label>
            <textarea
              value={overrideComment}
              onChange={(e) => setOverrideComment(e.target.value)}
              placeholder="Add notes about this response..."
              className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 resize-none"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Navigation & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrev}
            disabled={currentResponseIndex === 0}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </button>
          <button
            onClick={goToNext}
            disabled={currentResponseIndex === responses.length - 1}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Response dots */}
        <div className="flex items-center gap-1">
          {responses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentResponseIndex(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentResponseIndex
                  ? 'bg-blue-500'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Save Button */}
        <button
          onClick={handleScoreOverride}
          disabled={!hasChanges || isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default TeacherSpeakingReview;
