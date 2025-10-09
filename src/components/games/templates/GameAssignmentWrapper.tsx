'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Users, Target, Volume2, VolumeX, Palette, Grid3x3, type LucideIcon } from 'lucide-react';
import { useAuth } from '../../auth/AuthProvider';
import { useGlobalAudioContext } from '../../../hooks/useGlobalAudioContext';
import { EnhancedGameSessionService } from '../../../services/rewards/EnhancedGameSessionService';
import { assignmentProgressService, type GameProgress } from '../../../services/AssignmentProgressService';
import { 
  useAssignmentVocabulary,
  type StandardVocabularyItem,
  type AssignmentData
} from '../../../hooks/useAssignmentVocabulary';
import { useSessionVocabularySelector } from '../../../hooks/useSessionVocabularySelector';
import UniversalThemeSelector from '../UniversalThemeSelector';

// Dynamic theme provider import based on game
const getThemeProvider = (gameId: string) => {
  switch (gameId) {
    case 'noughts-and-crosses':
      return require('../../../app/games/noughts-and-crosses/components/ThemeProvider').ThemeProvider;
    case 'hangman':
      return require('../../../app/games/hangman/components/ThemeProvider').ThemeProvider;
    default:
      return null;
  }
};

// Re-export types for backward compatibility
export type { StandardVocabularyItem, AssignmentData, GameProgress };

interface MetaBadgeProps {
  icon: LucideIcon;
  label: string;
}

function MetaBadge({ icon: Icon, label }: MetaBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </span>
  );
}

export interface GameAssignmentWrapperProps {
  assignmentId: string;
  gameId: string;
  studentId?: string;
  onAssignmentComplete: (progress: GameProgress) => void;
  onBackToAssignments: () => void;
  onBackToMenu?: () => void;
  assignmentProgress?: {
    current: number;
    required: number;
    label?: string;
  };
  children: (props: {
    assignment: AssignmentData;
    vocabulary: StandardVocabularyItem[];
    sentences?: any[];
    onProgressUpdate: (progress: Partial<GameProgress>) => void;
    onGameComplete: (finalProgress: GameProgress) => void;
    gameSessionId: string | null;
    gameService?: EnhancedGameSessionService | null;
    selectedTheme?: string;
    isAssignmentMode?: boolean;
    // Game control props
    onThemeChange?: (theme: string) => void;
    isMusicEnabled?: boolean;
    toggleMusic?: () => void;
    onBackToMenu?: () => void;
  }) => React.ReactNode;
}

/**
 * GameAssignmentWrapper - Thin Orchestration Layer
 * 
 * This component is responsible for:
 * 1. Loading assignment data and vocabulary (via useAssignmentVocabulary hook)
 * 2. Selecting session vocabulary (via useSessionVocabularySelector hook)
 * 3. Managing game session and progress (via services)
 * 4. Providing UI controls (theme, audio)
 * 5. Rendering the child game component with all necessary props
 */
export default function GameAssignmentWrapper({
  assignmentId,
  gameId,
  studentId,
  onAssignmentComplete,
  onBackToAssignments,
  onBackToMenu,
  assignmentProgress,
  children
}: GameAssignmentWrapperProps) {
  const { user } = useAuth();
  const audioContext = useGlobalAudioContext();
  
  // Game control states
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [selectedTheme, setSelectedTheme] = useState<string>('default');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [gemSessionService, setGemSessionService] = useState<EnhancedGameSessionService | null>(null);
  const [gameSessionId, setGameSessionId] = useState<string | null>(null);
  const gameContainerRef = React.useRef<HTMLDivElement>(null);

  // Load assignment data and vocabulary
  const { assignment, vocabulary, sentences, loading, error } = useAssignmentVocabulary(assignmentId, gameId);

  // Progressive Coverage: Select session vocabulary
  const activeStudentId = studentId || user?.id || '';
  const { sessionVocabulary, loading: sessionLoading } = useSessionVocabularySelector({
    enabled: true,
    assignmentId,
    studentId: activeStudentId,
    fullVocabulary: vocabulary,
    sessionSize: 10
  });

  // Use session vocabulary if available, otherwise use full vocabulary
  const effectiveVocabulary = sessionVocabulary.length > 0 ? sessionVocabulary : vocabulary;

  // Initialize gem session service
  useEffect(() => {
    if (!assignment || !activeStudentId) return;

    const initializeSession = async () => {
      try {
        const service = new EnhancedGameSessionService();

        const sessionId = await service.startGameSession({
          student_id: activeStudentId,
          assignment_id: assignmentId,
          game_type: gameId,
          session_mode: 'assignment',
          final_score: 0,
          accuracy_percentage: 0,
          completion_percentage: 0,
          words_attempted: 0,
          words_correct: 0,
          unique_words_practiced: 0,
          duration_seconds: 0
        });

        setGemSessionService(service);
        setGameSessionId(sessionId);
      } catch (error) {
        console.error('❌ Failed to initialize gem session:', error);
      }
    };

    initializeSession();
  }, [assignment, activeStudentId, assignmentId, gameId, effectiveVocabulary.length]);

  // Game control handlers
  const handleThemeChange = (theme: string) => {
    setSelectedTheme(theme);
  };

  const handleThemeSelect = (theme: string) => {
    setSelectedTheme(theme);
    setShowThemeSelector(false);
  };

  const toggleMusic = () => {
    const newState = !isMusicEnabled;
    setIsMusicEnabled(newState);

    if (newState) {
      audioContext.enableAudio();
    } else {
      audioContext.disableAudio();
    }
  };

  // Progress handlers
  const handleProgressUpdate = (progress: Partial<GameProgress>) => {
    console.log('📊 Progress update:', progress);
  };

  const handleGameComplete = async (finalProgress: GameProgress) => {
    console.log('🎉 Game complete:', finalProgress);
    
    // Save progress via service
    await assignmentProgressService.recordProgress(finalProgress);
    
    // Notify parent
    onAssignmentComplete(finalProgress);
  };

  // Loading state
  if (loading || sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading assignment...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Error: {error}</div>
      </div>
    );
  }

  // No assignment found
  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center">
        <div className="text-white text-xl">Assignment not found</div>
      </div>
    );
  }

  // Show theme selector
  if (showThemeSelector) {
    const gameTitle = gameId === 'noughts-and-crosses' ? 'Noughts and Crosses' :
                     gameId === 'vocab-blast' ? 'Vocab Blast' :
                     gameId === 'word-blast' ? 'Word Blast' :
                     gameId === 'hangman' ? 'Hangman' : 'Game';

    return (
      <UniversalThemeSelector
        onThemeSelect={handleThemeSelect}
        gameTitle={gameTitle}
        availableThemes={['default', 'tokyo', 'pirate', 'space', 'temple']}
      />
    );
  }

  return (
    <div ref={gameContainerRef} className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
      <header className="border-white/15 bg-white/10 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-[1400px] flex-wrap items-center gap-4 px-5 py-3">
          <button
            onClick={onBackToAssignments}
            className="inline-flex items-center gap-2 text-sm font-medium text-white transition-colors hover:text-blue-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assignments
          </button>

          <div className="flex flex-1 flex-wrap items-center justify-between gap-4">
            <div className="flex-1 text-center">
              {assignmentProgress && (
                <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                  <div className="flex items-center gap-2">
                    <div className="text-xs font-medium text-white/80">
                      {assignmentProgress.label || 'Progress'}
                    </div>
                    <div className="text-lg font-bold text-white">
                      {assignmentProgress.current}/{assignmentProgress.required}
                    </div>
                  </div>
                  {assignmentProgress.current < assignmentProgress.required && (
                    <div className="text-xs text-white/70">
                      {assignmentProgress.required - assignmentProgress.current} more needed
                    </div>
                  )}
                  <div className="w-32 bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(assignmentProgress.current / assignmentProgress.required) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              {assignment.class_name && <MetaBadge icon={Users} label={assignment.class_name} />}
              <MetaBadge icon={Target} label={`${effectiveVocabulary.length} words`} />
              {assignment.due_date && (
                <MetaBadge
                  icon={Clock}
                  label={`Due ${new Date(assignment.due_date).toLocaleDateString()}`}
                />
              )}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={toggleMusic}
              className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
              title={isMusicEnabled ? "Mute" : "Unmute"}
            >
              {isMusicEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
            </button>

            {(gameId === 'noughts-and-crosses' || gameId === 'hangman' || gameId === 'vocab-blast' || gameId === 'word-blast') && (
              <button
                onClick={() => setShowThemeSelector(true)}
                className="rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
                title="Change Theme"
              >
                <Palette className="h-5 w-5" />
              </button>
            )}
            
            {gameId === 'memory-game' && (
              <>
                <button
                  onClick={() => {
                    // Call the game's modal opener
                    if ((window as any).__openMemoryThemeModal) {
                      (window as any).__openMemoryThemeModal();
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-white text-sm transition hover:bg-white/25"
                  title="Change Background"
                >
                  <Palette className="h-5 w-5" />
                  <span>Background</span>
                </button>
                <button
                  onClick={() => {
                    // Call the game's modal opener
                    if ((window as any).__openMemoryGridModal) {
                      (window as any).__openMemoryGridModal();
                    }
                  }}
                  className="flex items-center gap-2 rounded-lg bg-white/15 px-3 py-2 text-white text-sm transition hover:bg-white/25"
                  title="Change Grid Size"
                >
                  <Grid3x3 className="h-5 w-5" />
                  <span>Grid size</span>
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="w-full h-full">
        {(() => {
          const ThemeProvider = getThemeProvider(gameId);
          const childContent = children({
            assignment,
            vocabulary: effectiveVocabulary,
            sentences,
            onProgressUpdate: handleProgressUpdate,
            onGameComplete: handleGameComplete,
            gameSessionId,
            gameService: gemSessionService,
            selectedTheme,
            isAssignmentMode: true,
            // Game control props
            onThemeChange: handleThemeChange,
            isMusicEnabled,
            toggleMusic,
            onBackToMenu: onBackToAssignments
          });

          return ThemeProvider ? (
            <ThemeProvider themeId={selectedTheme}>
              {childContent}
            </ThemeProvider>
          ) : childContent;
        })()}
      </main>
    </div>
  );
}

