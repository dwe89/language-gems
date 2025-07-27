'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { IoChevronBackOutline, IoVolumeHighOutline, IoVolumeMuteOutline, IoSettingsOutline } from 'react-icons/io5';
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
          
          const loadedCharacter = new Character(data.name, data.characterClass);
          // Restore character state
          loadedCharacter.stats = { ...loadedCharacter.stats, ...data };
          loadedCharacter.stats.defeatedEnemies = new Set(data.defeatedEnemies || []);
          loadedCharacter.stats.unlockedRegions = data.unlockedRegions || ['forest_of_beginnings'];
          
          console.log('Character loaded with stats:', {
            level: loadedCharacter.stats.level,
            experience: loadedCharacter.stats.experience,
            experienceToNext: loadedCharacter.stats.experienceToNext,
            defeatedEnemies: Array.from(loadedCharacter.stats.defeatedEnemies)
          });
          
          setCharacter(loadedCharacter);
          setQuestSystem(new QuestSystem());
        } catch (error) {
          console.error('Failed to load character:', error);
        }
      }
    }
  }, []);

  const handleCharacterCreated = (name: string, characterClass: string) => {
    const newCharacter = new Character(name, characterClass);
    setCharacter(newCharacter);
    setQuestSystem(new QuestSystem());
    setGameState('playing');
  };

  const startGame = () => {
    if (character) {
      setGameState('playing');
    } else {
      setGameState('character-creation');
    }
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const resetProgress = () => {
    if (confirm('Are you sure you want to reset all progress?')) {
      Character.clearSave();
      QuestSystem.clearSave();
      setCharacter(null);
      setQuestSystem(null);
    }
  };

  if (gameState === 'character-creation') {
    return (
      <CharacterCreation onCharacterCreated={handleCharacterCreated} />
    );
  }

  if (gameState === 'playing' && character && questSystem) {
    return (
      <VerbQuestGame
        character={character}
        questSystem={questSystem}
        onBackToMenu={backToMenu}
        soundEnabled={soundEnabled}
      />
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('/games/verb-quest/backgrounds/title_background.jpg')`
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-400 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
        <div className="absolute top-20 right-10 w-32 h-32 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-teal-400 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <Link
          href="/games"
          className="flex items-center gap-2 px-4 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors"
        >
          <IoChevronBackOutline size={20} />
          <span>Back to Games</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleSound}
            className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors"
          >
            {soundEnabled ? <IoVolumeHighOutline size={20} /> : <IoVolumeMuteOutline size={20} />}
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-black/20 hover:bg-black/30 rounded-lg transition-colors">
            <IoSettingsOutline size={20} />
          </button>
        </div>
      </div>

      {/* Main Menu */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Game Title */}
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
            Verb Quest
          </h1>
          
          <p className="text-xl md:text-2xl text-green-100 mb-8 leading-relaxed">
            Embark on an epic RPG adventure to master Spanish verb conjugations!
            <br />
            Battle mystical creatures and unlock new regions as you learn.
          </p>

          {/* Game Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="text-3xl mb-3">⚔️</div>
              <h3 className="text-lg font-semibold mb-2">Epic Battles</h3>
              <p className="text-green-200 text-sm">Fight enemies using correct verb conjugations as your weapons</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="text-3xl mb-3">🗺️</div>
              <h3 className="text-lg font-semibold mb-2">Explore Regions</h3>
              <p className="text-green-200 text-sm">Unlock new areas as you progress and master new verb forms</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-black/20 backdrop-blur-sm rounded-lg p-6"
            >
              <div className="text-3xl mb-3">📚</div>
              <h3 className="text-lg font-semibold mb-2">Learn Spanish</h3>
              <p className="text-green-200 text-sm">Master regular and irregular verb conjugations through gameplay</p>
            </motion.div>
          </div>

          {/* Player Stats Preview */}
          {character && character.stats.level > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="bg-black/30 backdrop-blur-sm rounded-lg p-6 mb-8"
            >
              <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-yellow-400">{character.stats.level}</div>
                  <div className="text-sm text-green-200">Level</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{character.stats.experience}</div>
                  <div className="text-sm text-green-200">Experience</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-400">{character.stats.defeatedEnemies.size}</div>
                  <div className="text-sm text-green-200">Enemies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-orange-400">{character.stats.unlockedRegions.length}</div>
                  <div className="text-sm text-green-200">Regions</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Start Game Button */}
          <motion.button
            onClick={startGame}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold text-xl rounded-full shadow-2xl transition-all duration-300"
          >
            {character ? 'Continue Adventure' : 'Start Quest'}
          </motion.button>

          {/* Reset Progress Button (only show if there's progress) */}
          {character && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={resetProgress}
              className="mt-4 px-6 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-lg transition-colors"
            >
              Reset Progress
            </motion.button>
          )}
        </motion.div>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
