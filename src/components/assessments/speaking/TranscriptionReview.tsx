'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Edit3, 
  Check, 
  X, 
  RotateCcw, 
  Play, 
  Pause, 
  Loader2,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface TranscriptionReviewProps {
  transcription: string;
  confidence?: number;
  audioUrl?: string;
  isLoading?: boolean;
  onConfirm: (finalTranscription: string, wasEdited: boolean) => void;
  onReRecord: () => void;
  language?: 'es' | 'fr' | 'de';
  className?: string;
}

export function TranscriptionReview({
  transcription,
  confidence = 0.85,
  audioUrl,
  isLoading = false,
  onConfirm,
  onReRecord,
  language = 'es',
  className = '',
}: TranscriptionReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(transcription);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Update edited text when transcription changes
  useEffect(() => {
    setEditedText(transcription);
  }, [transcription]);

  // Focus textarea when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(
        textareaRef.current.value.length,
        textareaRef.current.value.length
      );
    }
  }, [isEditing]);

  // Handle audio ended
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  // Toggle audio playback
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Start editing
  const startEditing = () => {
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditedText(transcription);
    setIsEditing(false);
  };

  // Confirm with current text
  const handleConfirm = () => {
    const wasEdited = editedText.trim() !== transcription.trim();
    onConfirm(editedText.trim(), wasEdited);
  };

  // Get confidence indicator
  const getConfidenceIndicator = () => {
    if (confidence >= 0.9) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        icon: CheckCircle,
        label: 'High confidence',
      };
    } else if (confidence >= 0.7) {
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        icon: AlertTriangle,
        label: 'Medium confidence - please review',
      };
    } else {
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        icon: AlertTriangle,
        label: 'Low confidence - please verify',
      };
    }
  };

  const confidenceInfo = getConfidenceIndicator();
  const ConfidenceIcon = confidenceInfo.icon;

  // Language placeholders
  const languageLabels: Record<string, string> = {
    es: 'Spanish',
    fr: 'French',
    de: 'German',
  };

  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Transcribing your response...
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
          This may take a few seconds
        </p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={handleAudioEnded}
          className="hidden"
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Your Response (Transcribed)
        </h3>
        
        {/* Confidence indicator */}
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${confidenceInfo.bgColor}`}>
          <ConfidenceIcon className={`w-4 h-4 ${confidenceInfo.color}`} />
          <span className={`text-sm font-medium ${confidenceInfo.color}`}>
            {Math.round(confidence * 100)}% confident
          </span>
        </div>
      </div>

      {/* Low confidence warning */}
      {confidence < 0.8 && (
        <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
              {confidenceInfo.label}
            </p>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              The transcription may contain errors. Please listen to your recording and edit if needed.
            </p>
          </div>
        </div>
      )}

      {/* Transcription display/editor */}
      <div className="relative">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="w-full min-h-[120px] p-4 text-lg border-2 border-blue-500 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                     focus:outline-none focus:ring-2 focus:ring-blue-500/50
                     resize-none"
            placeholder={`Your ${languageLabels[language]} response...`}
            dir="ltr"
            lang={language}
          />
        ) : (
          <div className="w-full min-h-[120px] p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-900 dark:text-white leading-relaxed" lang={language}>
              {editedText || (
                <span className="text-gray-400 italic">No transcription available</span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Play audio button */}
        {audioUrl && (
          <button
            onClick={togglePlayback}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                     dark:bg-gray-700 dark:hover:bg-gray-600
                     text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            {isPlaying ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                <span>Play Recording</span>
              </>
            )}
          </button>
        )}

        {/* Edit button */}
        {!isEditing ? (
          <button
            onClick={startEditing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                     dark:bg-gray-700 dark:hover:bg-gray-600
                     text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <Edit3 className="w-5 h-5" />
            <span>Edit Transcription</span>
          </button>
        ) : (
          <button
            onClick={cancelEditing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                     dark:bg-gray-700 dark:hover:bg-gray-600
                     text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
            <span>Cancel Edit</span>
          </button>
        )}

        {/* Re-record button */}
        <button
          onClick={onReRecord}
          className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 
                   dark:bg-orange-900/30 dark:hover:bg-orange-900/50
                   text-orange-700 dark:text-orange-400 rounded-lg transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Re-record</span>
        </button>

        {/* Spacer */}
        <div className="flex-grow" />

        {/* Confirm button */}
        <button
          onClick={handleConfirm}
          disabled={!editedText.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   text-white font-medium rounded-lg transition-colors shadow-md"
        >
          <Check className="w-5 h-5" />
          <span>This is Correct - Submit</span>
        </button>
      </div>

      {/* Edit indicator */}
      {editedText.trim() !== transcription.trim() && (
        <p className="text-sm text-blue-600 dark:text-blue-400">
          ✏️ You have made changes to the transcription
        </p>
      )}

      {/* Instructions */}
      <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Important:</strong> Please verify that the transcription matches what you said. 
          The transcription will be used to grade your response. 
          {confidence < 0.8 && ' We recommend listening to your recording and correcting any errors.'}
        </p>
      </div>
    </div>
  );
}

export default TranscriptionReview;
