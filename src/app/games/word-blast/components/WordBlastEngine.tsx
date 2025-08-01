'use client';

import React from 'react';
import { SentenceChallenge } from '../types';
import { WordObject, ParticleEffect } from './BaseThemeEngine';
import TokyoNightsEngine from './themes/TokyoNightsEngine';
import PirateAdventureEngine from './themes/PirateAdventureEngine';
import SpaceExplorerEngine from './themes/SpaceExplorerEngine';
import LavaTempleEngine from './themes/LavaTempleEngine';
import ClassicEngine from './themes/ClassicEngine';

export interface WordBlastEngineProps {
  theme: string;
  currentChallenge: SentenceChallenge;
  challenges: SentenceChallenge[];
  onCorrectAnswer: (points: number) => void;
  onIncorrectAnswer: () => void;
  onChallengeComplete: () => void;
  isPaused: boolean;
  gameActive: boolean;
  difficulty: string;
  lives: number;
  score: number;
  combo: number;
  playSFX: (sound: string) => void;
}

// Re-export for convenience
export type { WordObject, ParticleEffect };

export default function WordBlastEngine(props: WordBlastEngineProps) {
  const { theme } = props;

  // Route to theme-specific engines
  switch (theme) {
    case 'tokyo':
      return <TokyoNightsEngine {...props} />;
    case 'pirate':
      return <PirateAdventureEngine {...props} />;
    case 'space':
      return <SpaceExplorerEngine {...props} />;
    case 'temple':
      return <LavaTempleEngine {...props} />;
    case 'classic':
    default:
      return <ClassicEngine {...props} />;
  }
}
