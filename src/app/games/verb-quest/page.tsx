'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { IoChevronBackOutline, IoVolumeHighOutline, IoVolumeMuteOutline } from 'react-icons/io5';
import { useSearchParams } from 'next/navigation';
import VerbQuestGame from './components/VerbQuestGame';
import CharacterCreation from './components/CharacterCreation';
import VerbQuestAssignmentWrapper from './components/VerbQuestAssignmentWrapper';
import { Character } from './components/Character';
import { QuestSystem } from './components/QuestSystem';

export default function VerbQuestPage() {
  // Check for assignment mode
  const searchParams = useSearchParams();
  const assignmentId = searchParams?.get('assignment');
  const mode = searchParams?.get('mode');

  // If assignment mode, render assignment wrapper
  if (assignmentId && mode === 'assignment') {
    return <VerbQuestAssignmentWrapper assignmentId={assignmentId} />;
  }

  const [gameState, setGameState] = useState<'menu' | 'character-creation' | 'playing'>('menu');
  const [character, setCharacter] = useState<Character | null>(null);
  const [questSystem, setQuestSystem] = useState<QuestSystem | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load character from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('verbQuestCharacter');
      if (saved) {
        try {
          const data = JSON.parse(saved);
          console.log('Loading character data:', data);

          // Validate that we have the required data
          if (data.name && data.characterClass) {
            const loadedCharacter = new Character(data.name, data.characterClass);
            // The Character constructor already loads progress via loadProgress()

            console.log('Character loaded with stats:', {
              level: loadedCharacter.stats.level,
              experience: loadedCharacter.stats.experience,
              experienceToNext: loadedCharacter.stats.experienceToNext,
              defeatedEnemies: Array.from(loadedCharacter.stats.defeatedEnemies)
            });

            setCharacter(loadedCharacter);
            setQuestSystem(new QuestSystem());
            setGameState('playing');
          } else {
            console.warn('Invalid character data found, staying on menu');
          }
        } catch (error) {
          console.error('Error loading character:', error);
          // Clear corrupted save data
          localStorage.removeItem('verbQuestCharacter');
        }
      }
    }
  }, []);

  const handleCharacterCreated = (name: string, characterClass: string) => {
    const newCharacter = new Character(name, characterClass);
    // Save the new character immediately
    newCharacter.saveProgress();
    setCharacter(newCharacter);
    setQuestSystem(new QuestSystem());
    setGameState('playing');
  };

  const handleNewGame = () => {
    setGameState('character-creation');
  };

  const handleContinue = () => {
    if (character) {
      setGameState('playing');
    }
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  if (gameState === 'character-creation') {
    return (
      <CharacterCreation
        onCharacterCreated={handleCharacterCreated}
        onBack={handleBackToMenu}
        soundEnabled={soundEnabled}
      />
    );
  }

  if (gameState === 'playing' && character && character.stats && questSystem) {
    return (
      <VerbQuestGame
        character={character}
        questSystem={questSystem}
        onBackToMenu={handleBackToMenu}
        soundEnabled={soundEnabled}
      />
    );
  }

  // Main menu
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/games/verb-quest/backgrounds/title_background.jpg')`
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6">
          <Link
            href="/games"
            className="flex items-center text-white hover:text-yellow-300 transition-colors"
          >
            <IoChevronBackOutline className="w-6 h-6 mr-2" />
            Back to Games
          </Link>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSound}
              className="text-white hover:text-yellow-300 transition-colors"
            >
              {soundEnabled ? (
                <IoVolumeHighOutline className="w-6 h-6" />
              ) : (
                <IoVolumeMuteOutline className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            {/* Title */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-12"
            >
              <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 mb-4 drop-shadow-2xl">
                VERB QUEST
              </h1>
              <p className="text-xl md:text-2xl text-white/90 font-medium">
                Master Verbs Through Epic Adventures
              </p>
            </motion.div>

            {/* Menu buttons */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="space-y-4"
            >
              {character ? (
                <button
                  onClick={handleContinue}
                  className="block w-64 mx-auto bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-2xl"
                >
                  Continue Adventure
                </button>
              ) : null}

              <button
                onClick={handleNewGame}
                className="block w-64 mx-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 px-8 rounded-lg text-xl transition-all transform hover:scale-105 shadow-2xl"
              >
                {character ? 'New Adventure' : 'Start Adventure'}
              </button>

              {character && character.stats && (
                <div className="mt-8 p-4 bg-black/30 rounded-lg backdrop-blur-sm">
                  <h3 className="text-white font-bold mb-2">Current Character</h3>
                  <p className="text-white/80">
                    {character.stats.name} - Level {character.stats.level} {character.stats.characterClass}
                  </p>
                  <p className="text-white/60 text-sm">
                    {character.stats.experience} / {character.stats.experienceToNext} XP
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
