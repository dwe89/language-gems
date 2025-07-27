'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoArrowBackOutline, IoSettingsOutline, IoVolumeHighOutline, IoVolumeMuteOutline } from 'react-icons/io5';
import WorldMap from './WorldMap';
import Battle from './Battle';
import { Character } from './Character';
import { QuestSystem } from './QuestSystem';
import CharacterStatsDisplay from './CharacterStatsDisplay';

interface VerbQuestGameProps {
  character: Character;
  questSystem: QuestSystem;
  onBackToMenu?: () => void;
  soundEnabled?: boolean;
  onGameComplete?: (results: any) => void;
  assignmentMode?: boolean;
  assignmentConfig?: any;
}

type GameState = 'worldmap' | 'battle' | 'intro' | 'menu';

export default function VerbQuestGame({
  character,
  questSystem,
  onBackToMenu,
  soundEnabled = true,
  onGameComplete,
  assignmentMode = false,
  assignmentConfig
}: VerbQuestGameProps) {
  const [gameState, setGameState] = useState<GameState>('worldmap');
  const [currentBattle, setCurrentBattle] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(character.stats.level === 1 && character.stats.experience === 0);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

  // Initialize background music
  useEffect(() => {
    if (typeof window !== 'undefined') {
      backgroundMusicRef.current = new Audio('/games/verb-quest/sounds/background-music.mp3');
      backgroundMusicRef.current.loop = true;
      backgroundMusicRef.current.volume = 0.3;
    }

    return () => {
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current = null;
      }
    };
  }, []);

  // Handle music toggle
  const toggleMusic = () => {
    if (!backgroundMusicRef.current) return;
    
    if (musicEnabled) {
      backgroundMusicRef.current.pause();
    } else {
      backgroundMusicRef.current.play().catch(e => console.error("Error playing music:", e));
    }
    
    setMusicEnabled(!musicEnabled);
  };

  const startBattle = (enemy: any, region: string) => {
    setCurrentBattle({ enemy, region });
    setGameState('battle');
  };

  const endBattle = (victory: boolean, expGained: number = 0) => {
    if (victory) {
      // Pass the region to gainExperience to trigger region unlock checks
      character.gainExperience(expGained, currentBattle?.region);
      if (currentBattle?.enemy.id) {
        character.defeatEnemy(currentBattle.enemy.id);
      }
      
      // Update current region if all enemies in current region are defeated
      if (currentBattle?.region) {
        const region = currentBattle.region;
        // Check if this was the last enemy in the region to update current region
        updateCurrentRegionIfComplete(region);
      }
    }
    
    // Update quests
    questSystem.updateProgress('defeat_enemies', 1);
    // Save quests to localStorage  
    localStorage.setItem('verbQuestQuests', JSON.stringify(questSystem.getActiveQuests()));
    
    setCurrentBattle(null);
    setGameState('worldmap');
  };

  // Helper function to update current region after completing all enemies
  const updateCurrentRegionIfComplete = (completedRegion: string) => {
    const { regions } = require('./VerbData');
    const region = regions[completedRegion];
    
    if (region && region.enemies) {
      // Check if all enemies in this region are defeated
      const allEnemiesDefeated = region.enemies.every((enemy: any) => 
        character.stats.defeatedEnemies.has(enemy.id)
      );
      
      if (allEnemiesDefeated) {
        // Find the next unlocked region to set as current
        const regionOrder = [
          'forest_of_beginnings',
          'temple_of_chaos', 
          'cave_of_memories',
          'lair_of_legends',
          'swamp_of_habits',
          'skyward_spire',
          'palace_of_possibilities',
          'dungeon_of_commands',
          'shrine_of_perfection',
          'castle_of_conjugations'
        ];
        
        const currentIndex = regionOrder.indexOf(completedRegion);
        if (currentIndex < regionOrder.length - 1) {
          const nextRegion = regionOrder[currentIndex + 1];
          // Check if next region is unlocked
          const { isRegionUnlocked } = require('./VerbData');
          if (isRegionUnlocked(nextRegion, character.stats)) {
            character.stats.currentRegion = nextRegion;
            character.saveProgress();
          }
        }
      }
    }
  };

  const completeIntro = () => {
    setShowIntro(false);
    setGameState('worldmap');
  };

  if (showIntro) {
    return (
      <IntroSequence onComplete={completeIntro} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Header UI */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-black/20 backdrop-blur-sm">
        <button
          onClick={onBackToMenu}
          className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 rounded-lg transition-colors"
        >
          <IoArrowBackOutline size={20} />
          <span>Menu</span>
        </button>

        <CharacterStatsDisplay character={character} />

        <div className="flex items-center gap-2">
          <button
            onClick={toggleMusic}
            className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors"
          >
            {musicEnabled ? <IoVolumeHighOutline size={20} /> : <IoVolumeMuteOutline size={20} />}
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors">
            <IoSettingsOutline size={20} />
          </button>
        </div>
      </div>

      {/* Game Content */}
      <div className="pt-20">
        <AnimatePresence mode="wait">
          {gameState === 'worldmap' && (
            <motion.div
              key="worldmap"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <WorldMap
                stats={character.stats}
                onStartBattle={startBattle}
                onUpdateStats={(newStats: any) => {
                  character.stats = { ...character.stats, ...newStats };
                }}
                soundEnabled={soundEnabled}
              />
            </motion.div>
          )}

          {gameState === 'battle' && currentBattle && (
            <motion.div
              key="battle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <Battle
                enemy={currentBattle.enemy}
                region={currentBattle.region}
                character={character}
                onBattleEnd={endBattle}
                soundEnabled={soundEnabled}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Intro Sequence Component
function IntroSequence({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  
  const introSteps = [
    {
      text: "Welcome to the mystical world of Spanish verbs...",
      image: "🌟"
    },
    {
      text: "Evil creatures have stolen the power of proper conjugation!",
      image: "👹"
    },
    {
      text: "Only by mastering verb forms can you defeat them.",
      image: "⚔️"
    },
    {
      text: "Your quest begins in the Forest of Beginnings...",
      image: "🌲"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentStep < introSteps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setTimeout(onComplete, 2000);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center text-white">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        className="text-center max-w-2xl mx-auto px-4"
      >
        <div className="text-8xl mb-8">{introSteps[currentStep].image}</div>
        <h2 className="text-2xl md:text-3xl font-bold mb-8 leading-relaxed">
          {introSteps[currentStep].text}
        </h2>
        <div className="flex justify-center space-x-2">
          {introSteps.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentStep ? 'bg-white' : 'bg-white/30'
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
