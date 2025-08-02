'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlastEngineProps } from '../WordBlastEngine';
import { WordObject, ParticleEffect, BaseThemeEngine } from '../BaseThemeEngine';
import { SentenceChallenge } from '../../types';
import { getDecoyWords, normalizeLanguage } from '../../data/decoyWords';

// Updated StoneTablet interface to include feedbackStatus and clicked property for consistent behavior
interface StoneTablet extends WordObject {
  stoneType: 'granite' | 'marble' | 'obsidian';
  crackLevel: number;
  lavaProximity: number;
  runeGlow: number;
  cracking: boolean;
  clicked: boolean; // Added: To control permanent disappearance
  feedbackStatus?: 'incorrect'; // Added: For temporary visual feedback on incorrect clicks
}

interface LavaParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  size: number;
  temperature: number;
}

// Define a maximum number of active tablets to maintain game flow
const MAX_ACTIVE_TABLETS = 12; // Reduced from 15 to prevent performance issues

export default function LavaTempleEngine(props: WordBlastEngineProps) {
  const {
    currentChallenge,
    challenges,
    onCorrectAnswer,
    onIncorrectAnswer,
    onChallengeComplete,
    isPaused,
    gameActive,
    difficulty,
    playSFX,
    onOpenSettings
  } = props;

  const [stoneTablets, setStoneTablets] = useState<StoneTablet[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [lavaParticles, setLavaParticles] = useState<LavaParticle[]>([]);
  const [wordsCollected, setWordsCollected] = useState<string[]>([]);
  const [challengeProgress, setChallengeProgress] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);

  const themeEngine = useRef(new LavaTempleThemeEngine());
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const lastSpawnTime = useRef<number>(0); // Add throttling for spawning

  // This ref will store the larger, persistent pool of decoys for the current challenge's language/difficulty
  const challengeDecoysRef = useRef<string[]>([]);

  // Initialize decoys when challenge changes
  useEffect(() => {
    if (currentChallenge) {
      challengeDecoysRef.current = themeEngine.current.generateManyDecoys(
        currentChallenge.words,
        challenges,
        difficulty,
        currentChallenge.targetLanguage
      );
    }
  }, [currentChallenge, challenges, difficulty]);


  // Helper function to create a single new tablet with specific word
  const createSingleTablet = (word: string, initialYOffset: number = 0, existingTablets?: StoneTablet[]) => {
    if (!currentChallenge) return null;

    const screenWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
    const stoneTypes: ('granite' | 'marble' | 'obsidian')[] = ['granite', 'marble', 'obsidian'];

    const tabletsToCheck = existingTablets || stoneTablets;

    const position = themeEngine.current.findNonOverlappingPosition(
      tabletsToCheck,
      screenWidth,
      800, 
      150
    );

    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9);

    const isCorrect = currentChallenge.words.includes(word);

    return {
      id: `tablet-${timestamp}-${randomSuffix}`,
      word,
      isCorrect, 
      x: position.x,
      y: -150 + initialYOffset,
      speed: (0.5 + Math.random() * 0.3) * 2,
      rotation: 0,
      scale: 0.9 + Math.random() * 0.2,
      spawnTime: Date.now(),
      clicked: false,
      stoneType: stoneTypes[Math.floor(Math.random() * stoneTypes.length)],
      crackLevel: Math.random() * 0.2,
      lavaProximity: 0,
      runeGlow: Math.random() * 0.5 + 0.5,
      cracking: false,
      feedbackStatus: undefined
    };
  };

  // REVISED Helper function to get next word from pool (cycling through all words)
  const getNextWordFromPool = (currentTabletsState: StoneTablet[]): string | null => {
    if (!currentChallenge) return null;

    const wordsOnScreenLower = new Set(currentTabletsState.map(t => t.word.toLowerCase()));

    // Words from the current sentence that haven't been collected AND are not currently on screen
    const uncollectedAndNotOnScreenSentenceWords = currentChallenge.words.filter(word =>
        !wordsCollected.map(w => w.toLowerCase()).includes(word.toLowerCase()) && !wordsOnScreenLower.has(word.toLowerCase())
    );

    // All decoys from the challenge's full set that are NOT currently on screen
    const availableDecoysToSpawn = challengeDecoysRef.current.filter(decoy =>
        !wordsOnScreenLower.has(decoy.toLowerCase())
    );

    // --- BALANCED DECOY SPAWNING FOR PERFORMANCE ---
    const SPAWN_DECOY_CHANCE = 0.75; // 75% chance for a decoy - good balance of challenge and performance
    const DECISION_ROLL = Math.random();

    // Ensure we have at least some correct words on screen for playability
    if (uncollectedAndNotOnScreenSentenceWords.length > 0) {
        const correctWordsOnScreenCount = currentTabletsState.filter(t => t.isCorrect && !wordsCollected.map(w => w.toLowerCase()).includes(t.word.toLowerCase())).length;

        // Spawn correct words if we have less than 3 on screen OR no decoys available
        if (correctWordsOnScreenCount < 3 && (DECISION_ROLL > SPAWN_DECOY_CHANCE || availableDecoysToSpawn.length === 0)) {
            // Pick a random uncollected sentence word that is not on screen
            const randomIndex = Math.floor(Math.random() * uncollectedAndNotOnScreenSentenceWords.length);
            return uncollectedAndNotOnScreenSentenceWords[randomIndex];
        }
    }

    // Prioritize spawning decoys (75% of the time)
    if (availableDecoysToSpawn.length > 0 && DECISION_ROLL < SPAWN_DECOY_CHANCE) {
        const randomIndex = Math.floor(Math.random() * availableDecoysToSpawn.length);
        return availableDecoysToSpawn[randomIndex];
    }

    // Fallback: If decoys are not chosen (due to roll) or are exhausted, and we still need a word for progress
    if (uncollectedAndNotOnScreenSentenceWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * uncollectedAndNotOnScreenSentenceWords.length);
        return uncollectedAndNotOnScreenSentenceWords[randomIndex];
    }

    // Final fallback: If all uncollected words are on screen (or collected) AND we have no fresh decoys,
    // just re-spawn any decoy or any collected correct word to fill the screen density.
    if (availableDecoysToSpawn.length > 0) { // Check available decoys again for final fallback
        const randomIndex = Math.floor(Math.random() * availableDecoysToSpawn.length);
        return availableDecoysToSpawn[randomIndex];
    }
    if (challengeDecoysRef.current.length > 0) { // If even `availableDecoysToSpawn` is empty, use the full list
        return challengeDecoysRef.current[Math.floor(Math.random() * challengeDecoysRef.current.length)];
    }
    if (currentChallenge.words.length > 0) { // Or re-spawn any correct word from the sentence
        return currentChallenge.words[Math.floor(Math.random() * currentChallenge.words.length)];
    }
    
    return null; // Should ideally not be reached if challenges are valid and pools populated
  };

  // Spawn initial set of stone tablets when challenge changes or unpauses
  const spawnInitialTablets = () => {
    if (!currentChallenge) return;

    setStoneTablets([]); // Clear any existing
    const initialTablets: StoneTablet[] = [];
    
    // Get full lists of words and decoys to draw from for initial spawn
    const wordsToDrawFrom = [...currentChallenge.words];
    const decoysToDrawFrom = [...challengeDecoysRef.current];

    for (let i = 0; i < MAX_ACTIVE_TABLETS; i++) {
        let wordToCreate: string | undefined;
        
        // Initial spawn logic: Balanced mix for good gameplay and performance
        const roll = Math.random();

        // Spawn 3-4 correct words initially for playability, rest should be decoys
        const correctWordsAlreadySpawned = initialTablets.filter(t => currentChallenge.words.includes(t.word)).length;
        const shouldSpawnCorrectWord = correctWordsAlreadySpawned < 4 && wordsToDrawFrom.length > 0 && roll < 0.35; // 35% chance for correct word initially

        if (shouldSpawnCorrectWord || decoysToDrawFrom.length === 0) {
            // Spawn correct word if needed or no decoys available
            const idx = Math.floor(Math.random() * wordsToDrawFrom.length);
            wordToCreate = wordsToDrawFrom.splice(idx, 1)[0];
        } else if (decoysToDrawFrom.length > 0) {
            // Favor decoys (65% of spawns)
            const idx = Math.floor(Math.random() * decoysToDrawFrom.length);
            wordToCreate = decoysToDrawFrom.splice(idx, 1)[0];
        } else {
            // Final fallback
            const nextWord = getNextWordFromPool(initialTablets);
            wordToCreate = nextWord || undefined;
        }

        if (wordToCreate) {
            const newTablet = createSingleTablet(wordToCreate, -i * 150, initialTablets);
            if (newTablet) initialTablets.push(newTablet);
        }
    }
    setStoneTablets(initialTablets);
  };

  // Update tablet positions and effects
  const updateTablets = () => {
    if (isPaused || !gameActive) return;

    const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

    setStoneTablets(prev => {
      const tabletsToKeep: StoneTablet[] = [];
      const tabletsToExplode: StoneTablet[] = [];

      prev.forEach(tablet => {
        const newY = tablet.y + tablet.speed;

        if (newY > screenHeight + 50) {
          if (tablet.isCorrect && !wordsCollected.map(w => w.toLowerCase()).includes(tablet.word.toLowerCase())) {
              onIncorrectAnswer();
              playSFX('wrong-answer');
          }
          tabletsToExplode.push(tablet);
          return;
        }

        const lavaProximity = Math.max(0, (newY - screenHeight * 0.6) / (screenHeight * 0.4));

        tabletsToKeep.push({
          ...tablet,
          y: newY,
          lavaProximity,
          runeGlow: tablet.runeGlow + Math.sin(Date.now() * 0.005) * 0.1,
        });
      });

      tabletsToExplode.forEach(tablet => {
        const explosionParticles = themeEngine.current.createParticleEffect(
          tablet.x, tablet.y, 'error', 15
        );
        setParticles(prevParticles => [...prevParticles, ...explosionParticles]);
        createLavaEruption(tablet.x, tablet.y);
        
        setTimeout(() => {
          setStoneTablets(current => {
            // Add throttling to prevent too frequent spawning
            const now = Date.now();
            if (now - lastSpawnTime.current < 300) { // Minimum 300ms between spawns
              return current;
            }
            lastSpawnTime.current = now;

            const wordToRespawn = getNextWordFromPool(current);
            if (wordToRespawn) {
              const newTablet = createSingleTablet(wordToRespawn, 0, current);
              if (newTablet) {
                return [...current, newTablet];
              }
            }
            return current;
          });
        }, Math.random() * 1000 + 500);
      });

      return tabletsToKeep;
    });
  };

  // Handle tablet click
  const handleTabletClick = (tablet: StoneTablet) => {
    if (tablet.feedbackStatus === 'incorrect' || tablet.clicked) return;

    const targetWordLower = tablet.word.toLowerCase();
    const isCorrectWordForSentence = currentChallenge.words.map(w => w.toLowerCase()).includes(targetWordLower) && !wordsCollected.map(w => w.toLowerCase()).includes(targetWordLower);

    if (isCorrectWordForSentence) {
      setStoneTablets(prev =>
        prev.map(t => t.id === tablet.id ? { ...t, clicked: true, cracking: true } : t)
      );

      const originalWord = currentChallenge.words.find(w => w.toLowerCase() === targetWordLower) || tablet.word;
      const newWordsCollected = [...wordsCollected, originalWord];
      setWordsCollected(newWordsCollected);
      setCurrentWordIndex(newWordsCollected.length);

      const successParticles = themeEngine.current.createParticleEffect(
        tablet.x, tablet.y, 'success', 15
      );
      setParticles(prev => [...prev, ...successParticles]);

      createLavaEruption(tablet.x, tablet.y);

      playSFX('gem');

      const score = 10 + (newWordsCollected.length * 2) + (difficulty === 'advanced' ? 5 : 0);
      onCorrectAnswer(score);

      if (newWordsCollected.length === currentChallenge.words.length) {
        setTimeout(() => {
          onChallengeComplete();
          setWordsCollected([]);
          setChallengeProgress(0);
          setCurrentWordIndex(0);
        }, 500);
      } else {
        setChallengeProgress(newWordsCollected.length / currentChallenge.words.length);
      }

      setTimeout(() => {
        setStoneTablets(prev => prev.filter(t => t.id !== tablet.id));
      }, 300);

    } else {
      setStoneTablets(prev =>
        prev.map(t => t.id === tablet.id ? { ...t, feedbackStatus: 'incorrect', cracking: true } : t)
      );

      const errorParticles = themeEngine.current.createParticleEffect(
        tablet.x, tablet.y, 'error', 8
      );
      setParticles(prev => [...prev, ...errorParticles]);

      playSFX('wrong-answer');
      onIncorrectAnswer();

      setTimeout(() => {
        setStoneTablets(prev =>
          prev.map(t => t.id === tablet.id ? { ...t, feedbackStatus: undefined, cracking: false } : t)
        );
      }, 500);
    }
  };

  const createLavaEruption = (x: number, y: number) => {
    const lavaParticleCount = 10; // Reduced from 20 to 10 for better performance
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 9); // Use substring instead of deprecated substr

    const newLavaParticles: LavaParticle[] = Array.from({ length: lavaParticleCount }, (_, i) => ({
      id: `lava-${timestamp}-${randomSuffix}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 15,
      vy: -Math.random() * 10 - 5,
      life: 1,
      size: Math.random() * 8 + 4,
      temperature: Math.random() * 0.5 + 0.5
    }));

    setLavaParticles(prev => [...prev, ...newLavaParticles]);

    setTimeout(() => {
      setLavaParticles(prev =>
        prev.filter(p => !newLavaParticles.some(np => np.id === p.id))
      );
    }, 1500); // Reduced from 2000ms to 1500ms for faster cleanup
  };

  useEffect(() => {
    const animate = () => {
      if (!isPaused && gameActive) {
        updateTablets();
      }
      animationRef.current = requestAnimationFrame(animate);
    };

    if (gameActive) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameActive, isPaused]); 

  useEffect(() => {
    if (currentChallenge && gameActive) {
      setWordsCollected([]);
      setChallengeProgress(0);
      setCurrentWordIndex(0);
      setStoneTablets([]);
      spawnInitialTablets();
    }
  }, [currentChallenge, gameActive, challengeDecoysRef.current]);

  useEffect(() => {
    // Always try to maintain MAX_ACTIVE_TABLETS on screen for challenging gameplay
    const minTablets = MAX_ACTIVE_TABLETS;
    if (
      currentChallenge &&
      gameActive &&
      !isPaused &&
      stoneTablets.length < minTablets
    ) {
      // Add throttling to prevent performance issues
      const now = Date.now();
      if (now - lastSpawnTime.current < 200) { // Minimum 200ms between batch spawns
        return;
      }
      lastSpawnTime.current = now;

      const numToSpawn = Math.min(3, minTablets - stoneTablets.length); // Spawn max 3 at a time
      if (numToSpawn > 0) {
        setStoneTablets(prev => {
          const newTabletsToAdd: StoneTablet[] = [];
          for (let i = 0; i < numToSpawn; i++) {
            const word = getNextWordFromPool([...prev, ...newTabletsToAdd]);
            if (word) {
              const newTablet = createSingleTablet(word, 0, [...prev, ...newTabletsToAdd]);
              if (newTablet) newTabletsToAdd.push(newTablet);
            }
          }
          return [...prev, ...newTabletsToAdd];
        });
      }
    }
  }, [isPaused, gameActive, currentChallenge, stoneTablets.length, wordsCollected, challengeDecoysRef.current]);

  useEffect(() => {
    if (!gameActive) {
      setParticles([]);
      setLavaParticles([]);
    }
  }, [gameActive]);


  if (!currentChallenge) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-900 text-blue-200 text-xl">
        No challenge loaded. Please start a game or check your data source.
      </div>
    );
  }

  const displayedProgress = currentChallenge.words.map(word => {
    const isCollected = wordsCollected.map(w => w.toLowerCase()).includes(word.toLowerCase());
    if (isCollected) {
      return wordsCollected.find(w => w.toLowerCase() === word.toLowerCase()) || word;
    } else {
      return '__';
    }
  }).join(' ');


  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden"
    >
      {/* Video Background */}
      <div className="absolute inset-0">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/games/noughts-and-crosses/images/lava-temple/lava-temple-bg.mp4" type="video/mp4" />
        </video>

        {/* Video overlay gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50"></div>
      </div>

      {/* English Sentence Display */}
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 border border-orange-500/30">
          <div className="text-center">
            <div className="text-sm text-orange-300 mb-1">🔥 Translate this ancient text:</div>
            <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
            <div className="text-sm text-orange-300 mt-2">
              Click the {currentChallenge.targetLanguage} stone tablets to collect the treasure!
            </div>
          </div>
        </div>
      </div>

      {/* Progress Display */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/10">
          <div className="text-center">
            <div className="text-sm text-gray-300">Progress:</div>
            <div className="text-lg font-bold text-white">
              {displayedProgress}
            </div>
          </div>
          </div>
      </div>

      {/* Settings Button */}
      {onOpenSettings && (
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => {
              playSFX('gem');
              onOpenSettings();
            }}
            className="bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-lg p-3 border border-orange-500/30 text-orange-300 hover:text-orange-200 transition-all"
            title="Settings"
          >
            ⚙️
          </button>
        </div>
      )}

      {/* Lava Temple Background Effects */}
      <div className="absolute inset-0">
        {/* Temple pillars */}
        <div className="absolute left-10 top-0 w-16 h-full bg-gradient-to-b from-amber-900 to-orange-800 opacity-30" />
        <div className="absolute right-10 top-0 w-16 h-full bg-gradient-to-b from-amber-900 to-orange-800 opacity-30" />

        {/* Lava glow at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-red-600 via-orange-500 to-transparent opacity-60" />
      </div>

      {/* Stone Tablets */}
      <AnimatePresence>
        {stoneTablets.map((tablet) => (
          <StoneTabletComponent
            key={tablet.id}
            tablet={tablet}
            onClick={() => handleTabletClick(tablet)}
          />
        ))}
      </AnimatePresence>

      {/* Particle Effects (General) */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 1, x: particle.x, y: particle.y }}
            animate={{
              opacity: 0,
              scale: 0,
              x: particle.x + particle.vx * 50,
              y: particle.y + particle.vy * 50
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute w-2 h-2 rounded-full pointer-events-none"
            style={{
              backgroundColor: particle.color,
              width: particle.size,
              height: particle.size
            }}
          />
        ))}
      </AnimatePresence>

      {/* Lava Particles (Specific to Lava Temple) */}
      <AnimatePresence>
        {lavaParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: particle.temperature, scale: particle.size / 10 }}
            animate={{
              x: particle.x + particle.vx,
              y: particle.y + particle.vy,
              opacity: 0,
              scale: 0
            }}
            transition={{ duration: particle.life * 2, ease: "easeOut" }}
            className="absolute rounded-full bg-orange-500 shadow-lg shadow-orange-500/50"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              filter: `blur(${particle.size / 4}px)`
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Stone Tablet Component
const StoneTabletComponent: React.FC<{
  tablet: StoneTablet;
  onClick: () => void;
}> = ({ tablet, onClick }) => {
  const stoneColors = {
    granite: 'from-gray-600 to-gray-800',
    marble: 'from-gray-300 to-gray-500',
    obsidian: 'from-gray-900 to-black'
  };

  // Helper functions for dynamic styling based on feedbackStatus
  const getBorderClass = () => {
    if (tablet.feedbackStatus === 'incorrect') {
      return 'border-red-500 ring-4 ring-red-500';
    }
    return 'border-amber-600';
  };

  const getShadowClass = () => {
    if (tablet.feedbackStatus === 'incorrect') {
      return 'shadow-red-500/80';
    }
    return `shadow-2xl shadow-orange-400/${Math.round(tablet.lavaProximity * 50) + 30}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0, x: tablet.x, y: tablet.y, rotate: 0 }}
      animate={{
        opacity: tablet.clicked ? 0 : 1,
        scale: tablet.clicked ? 0.5 : tablet.scale,
        x: tablet.x,
        y: tablet.y,
      }}
      exit={{ opacity: 0, scale: 0 }}
      onClick={onClick}
      className={`absolute cursor-pointer transition-all duration-200 hover:scale-110 select-none`}
      style={{
        filter: `brightness(${1 + tablet.lavaProximity * 0.5}) drop-shadow(0 0 ${tablet.runeGlow * 10}px rgba(255, 140, 0, 0.8))`
      }}
    >
      <div className={`bg-gradient-to-br ${stoneColors[tablet.stoneType]} border-2 ${getBorderClass()} ${getShadowClass()} rounded-lg px-4 py-3 min-w-[120px] text-center relative overflow-hidden`}>
        {(tablet.cracking || tablet.feedbackStatus === 'incorrect') && (
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-500/30 to-orange-500/50" />
        )}

        <div className="relative z-10">
          <div className="text-amber-100 font-bold text-lg drop-shadow-lg">
            {tablet.word}
          </div>
        </div>

        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent" />

        <div
          className="absolute inset-0 rounded-lg border border-orange-400/50"
          style={{
            boxShadow: `inset 0 0 ${tablet.runeGlow * 20}px rgba(255, 140, 0, 0.3)`
          }}
        />
      </div>
    </motion.div>
  );
};

class LavaTempleThemeEngine extends BaseThemeEngine {
  // Generate many more decoys for the Lava Temple game to create a challenging experience
  public generateManyDecoys(
    correctWords: string[],
    allChallenges: SentenceChallenge[],
    difficulty: string,
    targetLanguage?: string
  ): string[] {
    // Get words from other sentences in the same category
    const otherWords = allChallenges
      .flatMap(challenge => challenge.words)
      .filter(word => !correctWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

    // Generate a reasonable number of decoys for Lava Temple - balanced for performance
    const decoyCount = 20; // Reduced from 50 to prevent performance issues

    // Get language-specific decoys using imported function
    const language = normalizeLanguage(targetLanguage || 'spanish');
    const languageDecoys = getDecoyWords(
      language,
      decoyCount, // Reduced multiplier to prevent too many decoys
      correctWords
    );

    // Combine other challenge words with language-specific decoys
    const allDecoys = [...otherWords, ...languageDecoys]
      .filter(word => !correctWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

    // Shuffle and return a large pool of decoys
    const shuffled = allDecoys.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(decoyCount, allDecoys.length));
  }
}