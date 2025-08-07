import React, { useEffect, useState } from 'react';
import { ModeComponent, GameMode } from '../types';
import { LearnMode } from './LearnMode';
import { RecallMode } from './RecallMode';
import { MultipleChoiceMode } from './MultipleChoiceMode';
import { DictationMode } from './DictationMode';
import { ListeningMode } from './ListeningMode';
import { ClozeMode } from './ClozeMode';
import { SpeedMode } from './SpeedMode';

interface MixedModeProps extends ModeComponent {
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onChoiceSelect?: (choiceIndex: number) => void;
  selectedChoice?: number | null;
  showAnswer: boolean;
  isCorrect: boolean | null;
  canReplayAudio?: boolean;
  onReplayAudio?: () => void;
  audioReplayCount?: number;
  timeLeft?: number;
  onTimeUp?: () => void;
  showHint?: boolean;
  onToggleHint?: () => void;
}

// Array of available modes for mixed practice
const MIXED_MODES: GameMode[] = ['learn', 'recall', 'multiple_choice', 'listening', 'dictation', 'cloze', 'speed'];

export const MixedMode: React.FC<MixedModeProps> = (props) => {
  const [currentMixedMode, setCurrentMixedMode] = useState<GameMode>('learn');

  // Change mode every few words to keep variety
  useEffect(() => {
    // Switch modes every 3-5 words randomly
    const wordsUntilSwitch = 3 + Math.floor(Math.random() * 3); // 3-5 words
    if (props.gameState.currentWordIndex % wordsUntilSwitch === 0) {
      const newMode = MIXED_MODES[Math.floor(Math.random() * MIXED_MODES.length)];
      setCurrentMixedMode(newMode);
    }
  }, [props.gameState.currentWordIndex]);

  // Render the appropriate mode component
  switch (currentMixedMode) {
    case 'multiple_choice':
      return (
        <MultipleChoiceMode
          {...props}
          onChoiceSelect={props.onChoiceSelect || (() => {})}
          selectedChoice={props.selectedChoice || null}
          showAnswer={props.showAnswer}
          isCorrect={props.isCorrect}
        />
      );

    case 'listening':
      return (
        <ListeningMode
          {...props}
          userAnswer={props.userAnswer}
          onAnswerChange={props.onAnswerChange}
          onSubmit={props.onSubmit}
          canReplayAudio={props.canReplayAudio || false}
          onReplayAudio={props.onReplayAudio || (() => {})}
          audioReplayCount={props.audioReplayCount || 0}
        />
      );

    case 'dictation':
      return (
        <DictationMode
          {...props}
          userAnswer={props.userAnswer}
          onAnswerChange={props.onAnswerChange}
          onSubmit={props.onSubmit}
          canReplayAudio={props.canReplayAudio || false}
          onReplayAudio={props.onReplayAudio || (() => {})}
          audioReplayCount={props.audioReplayCount || 0}
        />
      );

    case 'recall':
      return (
        <RecallMode
          {...props}
          userAnswer={props.userAnswer}
          onAnswerChange={props.onAnswerChange}
          onSubmit={props.onSubmit}
          streak={props.gameState.streak}
        />
      );

    case 'cloze':
      return (
        <ClozeMode
          {...props}
          userAnswer={props.userAnswer}
          onAnswerChange={props.onAnswerChange}
          onSubmit={props.onSubmit}
        />
      );

    case 'speed':
      return (
        <SpeedMode
          {...props}
          userAnswer={props.userAnswer}
          onAnswerChange={props.onAnswerChange}
          onSubmit={props.onSubmit}
          timeLeft={props.timeLeft || 10}
          onTimeUp={props.onTimeUp || (() => {})}
        />
      );

    case 'learn':
    default:
      return (
        <LearnMode
          {...props}
          userAnswer={props.userAnswer}
          onAnswerChange={props.onAnswerChange}
          onSubmit={props.onSubmit}
          showHint={props.showHint || false}
          onToggleHint={props.onToggleHint || (() => {})}
        />
      );
  }
};
