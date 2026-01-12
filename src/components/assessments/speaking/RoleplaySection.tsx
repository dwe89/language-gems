'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  Mic,
  MicOff,
  Volume2,
  CheckCircle,
  ArrowRight,
  Loader2,
  MessageSquare,
  User,
  Bot,
} from 'lucide-react';
import { AudioRecorder } from './AudioRecorder';
import type { RoleplayTask } from '@/services/speakingAssessmentService';

// =====================================================
// Types
// =====================================================

interface RoleplayTaskState {
  taskNumber: number;
  status: 'pending' | 'examiner-speaking' | 'student-recording' | 'transcribing' | 'complete';
  examinerAudioPlayed: boolean;
  studentResponse?: {
    audioBlob: Blob;
    audioUrl: string;
    duration: number;
    transcription?: string;
    confidence?: number;
  };
}

interface RoleplaySectionProps {
  tasks: RoleplayTask[];
  language: 'es' | 'fr' | 'de';
  onComplete: (responses: RoleplayTaskResponse[]) => void;
  onCancel?: () => void;
}

export interface RoleplayTaskResponse {
  taskNumber: number;
  examinerQuestion: string;
  studentPrompt: string;
  audioBlob?: Blob;
  audioUrl?: string;
  duration?: number;
  transcription?: string;
  confidence?: number;
}

// =====================================================
// Main Component
// =====================================================

export function RoleplaySection({
  tasks,
  language,
  onComplete,
  onCancel,
}: RoleplaySectionProps) {
  // State
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [taskStates, setTaskStates] = useState<Map<number, RoleplayTaskState>>(new Map());
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCache, setAudioCache] = useState<Map<number, string>>(new Map());
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const allResponses = useRef<RoleplayTaskResponse[]>([]);

  // Current task
  const currentTask = tasks[currentTaskIndex];
  const currentState = taskStates.get(currentTaskIndex) || {
    taskNumber: currentTaskIndex + 1,
    status: 'pending' as const,
    examinerAudioPlayed: false,
  };
  const isLastTask = currentTaskIndex === tasks.length - 1;

  // =====================================================
  // Generate TTS Audio for Examiner
  // =====================================================

  const generateExaminerAudio = useCallback(async (taskIndex: number) => {
    const task = tasks[taskIndex];
    if (!task || audioCache.has(taskIndex)) return;

    setIsGeneratingAudio(true);
    setError(null);

    try {
      const response = await fetch('/api/speaking/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: task.examiner_question,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const data = await response.json();
      
      if (data.success && data.audio) {
        // Convert base64 to audio URL
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio), c => c.charCodeAt(0))],
          { type: data.mimeType || 'audio/mp3' }
        );
        const audioUrl = URL.createObjectURL(audioBlob);
        
        setAudioCache(prev => new Map(prev).set(taskIndex, audioUrl));
      }
    } catch (err) {
      console.error('Error generating TTS:', err);
      setError('Failed to generate examiner audio');
    } finally {
      setIsGeneratingAudio(false);
    }
  }, [tasks, language, audioCache]);

  // Pre-generate audio for first task
  useEffect(() => {
    if (tasks.length > 0 && !audioCache.has(0)) {
      generateExaminerAudio(0);
    }
  }, [tasks, generateExaminerAudio, audioCache]);

  // Pre-generate audio for next task
  useEffect(() => {
    const nextIndex = currentTaskIndex + 1;
    if (nextIndex < tasks.length && !audioCache.has(nextIndex)) {
      generateExaminerAudio(nextIndex);
    }
  }, [currentTaskIndex, tasks.length, generateExaminerAudio, audioCache]);

  // =====================================================
  // Play Examiner Question
  // =====================================================

  const playExaminerQuestion = useCallback(async () => {
    const audioUrl = audioCache.get(currentTaskIndex);
    
    if (!audioUrl) {
      // No TTS - just mark as played and show text
      setTaskStates(prev => {
        const newMap = new Map(prev);
        newMap.set(currentTaskIndex, {
          ...currentState,
          status: 'student-recording',
          examinerAudioPlayed: true,
        });
        return newMap;
      });
      return;
    }

    setIsPlayingAudio(true);
    setTaskStates(prev => {
      const newMap = new Map(prev);
      newMap.set(currentTaskIndex, {
        ...currentState,
        status: 'examiner-speaking',
      });
      return newMap;
    });

    // Create and play audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    audio.onended = () => {
      setIsPlayingAudio(false);
      setTaskStates(prev => {
        const newMap = new Map(prev);
        newMap.set(currentTaskIndex, {
          ...currentState,
          status: 'student-recording',
          examinerAudioPlayed: true,
        });
        return newMap;
      });
    };

    audio.onerror = () => {
      setIsPlayingAudio(false);
      setError('Failed to play audio');
    };

    try {
      await audio.play();
    } catch (err) {
      setIsPlayingAudio(false);
      // Fallback - proceed without audio
      setTaskStates(prev => {
        const newMap = new Map(prev);
        newMap.set(currentTaskIndex, {
          ...currentState,
          status: 'student-recording',
          examinerAudioPlayed: true,
        });
        return newMap;
      });
    }
  }, [audioCache, currentTaskIndex, currentState]);

  // =====================================================
  // Handle Student Recording
  // =====================================================

  const handleRecordingComplete = async (audioBlob: Blob, duration: number) => {
    const audioUrl = URL.createObjectURL(audioBlob);

    // Update state to transcribing
    setTaskStates(prev => {
      const newMap = new Map(prev);
      newMap.set(currentTaskIndex, {
        ...currentState,
        status: 'transcribing',
        studentResponse: {
          audioBlob,
          audioUrl,
          duration,
        },
      });
      return newMap;
    });

    // Transcribe the response
    try {
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');
      formData.append('language', language);

      const response = await fetch('/api/speaking/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      // Save response
      const taskResponse: RoleplayTaskResponse = {
        taskNumber: currentTask.task_number,
        examinerQuestion: currentTask.examiner_question,
        studentPrompt: currentTask.student_prompt_en,
        audioBlob,
        audioUrl,
        duration,
        transcription: data.transcription || '',
        confidence: data.confidence || 0,
      };

      allResponses.current.push(taskResponse);

      // Update state to complete
      setTaskStates(prev => {
        const newMap = new Map(prev);
        newMap.set(currentTaskIndex, {
          ...currentState,
          status: 'complete',
          examinerAudioPlayed: true,
          studentResponse: {
            audioBlob,
            audioUrl,
            duration,
            transcription: data.transcription,
            confidence: data.confidence,
          },
        });
        return newMap;
      });

    } catch (err) {
      console.error('Transcription error:', err);
      // Still save response without transcription
      const taskResponse: RoleplayTaskResponse = {
        taskNumber: currentTask.task_number,
        examinerQuestion: currentTask.examiner_question,
        studentPrompt: currentTask.student_prompt_en,
        audioBlob,
        audioUrl,
        duration,
      };
      allResponses.current.push(taskResponse);

      setTaskStates(prev => {
        const newMap = new Map(prev);
        newMap.set(currentTaskIndex, {
          ...currentState,
          status: 'complete',
          examinerAudioPlayed: true,
          studentResponse: { audioBlob, audioUrl, duration },
        });
        return newMap;
      });
    }
  };

  // =====================================================
  // Navigation
  // =====================================================

  const handleNext = () => {
    if (isLastTask) {
      // Complete the roleplay
      onComplete(allResponses.current);
    } else {
      setCurrentTaskIndex(prev => prev + 1);
    }
  };

  // =====================================================
  // Render
  // =====================================================

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
            <MessageSquare className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Roleplay - Task {currentTaskIndex + 1} of {tasks.length}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Listen to the examiner, then respond
            </p>
          </div>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 mb-6">
        {tasks.map((_, index) => {
          const state = taskStates.get(index);
          const isComplete = state?.status === 'complete';
          const isCurrent = index === currentTaskIndex;
          
          return (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors ${
                isComplete
                  ? 'bg-green-500'
                  : isCurrent
                  ? 'bg-orange-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          );
        })}
      </div>

      {/* Error display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Main content card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        
        {/* Your task (English prompt) */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Your task:
            </span>
          </div>
          <p className="text-blue-900 dark:text-blue-100 font-medium">
            {currentTask.student_prompt_en}
          </p>
        </div>

        {/* Examiner section */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
              Examiner says:
            </span>
          </div>

          {/* Examiner question - shown after audio plays or as text */}
          <div className="flex items-center gap-4">
            <div className="flex-1 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-purple-900 dark:text-purple-100" lang={language}>
                {currentState.examinerAudioPlayed || currentState.status === 'examiner-speaking'
                  ? currentTask.examiner_question
                  : '...'}
              </p>
            </div>

            {/* Play button */}
            {currentState.status === 'pending' && (
              <button
                onClick={playExaminerQuestion}
                disabled={isGeneratingAudio}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 
                         text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {isGeneratingAudio ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Listen</span>
                  </>
                )}
              </button>
            )}

            {currentState.status === 'examiner-speaking' && isPlayingAudio && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Volume2 className="w-5 h-5 text-purple-600 animate-pulse" />
                <span className="text-purple-700 dark:text-purple-300">Playing...</span>
              </div>
            )}
          </div>
        </div>

        {/* Recording section */}
        <div className="p-6">
          {currentState.status === 'pending' && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <Mic className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Click &quot;Listen&quot; to hear the examiner&apos;s question first</p>
            </div>
          )}

          {currentState.status === 'examiner-speaking' && (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              <Volume2 className="w-12 h-12 mx-auto mb-3 text-purple-500 animate-pulse" />
              <p>Listen to the examiner...</p>
            </div>
          )}

          {currentState.status === 'student-recording' && (
            <div className="flex flex-col items-center">
              <AudioRecorder
                maxDuration={30}
                minDuration={2}
                onRecordingComplete={handleRecordingComplete}
                showPlayback={false}
              />
            </div>
          )}

          {currentState.status === 'transcribing' && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 mx-auto mb-3 text-blue-500 animate-spin" />
              <p className="text-gray-600 dark:text-gray-400">Processing your response...</p>
            </div>
          )}

          {currentState.status === 'complete' && (
            <div className="space-y-4">
              {/* Show transcription */}
              {currentState.studentResponse?.transcription && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-300">
                      Your response:
                    </span>
                  </div>
                  <p className="text-green-900 dark:text-green-100">
                    {currentState.studentResponse.transcription}
                  </p>
                </div>
              )}

              {/* Next button */}
              <button
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 bg-green-600 hover:bg-green-700 
                         text-white font-medium rounded-lg transition-colors"
              >
                {isLastTask ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Complete Roleplay
                  </>
                ) : (
                  <>
                    Next Task
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoleplaySection;
