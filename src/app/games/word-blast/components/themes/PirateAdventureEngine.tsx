'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WordBlastEngineProps } from '../WordBlastEngine';
import { WordObject, ParticleEffect, BaseThemeEngine } from '../BaseThemeEngine';

// Updated PirateShip interface
interface PirateShip extends WordObject {
  shipType: 'galleon' | 'frigate' | 'sloop';
  sailsUp: boolean;
  sinkingProgress: number;
  size: number;
  direction: 'left' | 'right';
  targetY: number; // The fixed Y position for the lane
  spawnTime: number;
  feedbackStatus?: 'incorrect';
  firing?: boolean;
  laneIndex: number; // Which lane (0-3) this ship is in
  currentX: number; // To track actual X position for rendering
}

// Theme engine class
class PirateAdventureThemeEngine extends BaseThemeEngine {
  // Override generateDecoys to use language-specific decoys and ensure they are truly distinct
  generateDecoys(correctWords: string[], allChallenges: any[], difficulty: string, targetLanguage?: string): string[] {
    // Use the enhanced base class method with language support
    return super.generateDecoys(correctWords, allChallenges, difficulty, targetLanguage);
  }
}

const MAX_ACTIVE_SHIPS = 15;
const WATER_LINE = 300;
const SHIP_WIDTH_ESTIMATE = 180;
const SHIP_SPACING = 250; // Smaller spacing for faster appearance and denser flow
const LANE_COUNT = 3; // Three distinct lanes as shown in the image

// Define explicit Y coordinates for each lane to match the screenshot spacing
const LANE_Y_POSITIONS = [
  330, // Top Lane (Lane 0)
  500, // Middle Lane (Lane 1)
  680  // Bottom Lane (Lane 2)
];

// Threshold for ensuring all needed correct words are on screen
const GUARANTEE_NEEDED_WORDS_THRESHOLD = 9;


export default function PirateAdventureEngine(props: WordBlastEngineProps) {
  const {
    currentChallenge,
    challenges,
    onCorrectAnswer,
    onIncorrectAnswer,
    onChallengeComplete,
    isPaused,
    gameActive,
    difficulty,
    playSFX
  } = props;

  const [pirateShips, setPirateShips] = useState<PirateShip[]>([]);
  const [particles, setParticles] = useState<ParticleEffect[]>([]);
  const [wordsCollected, setWordsCollected] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0); // This will track how many words are collected

  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();
  const themeEngine = useRef(new PirateAdventureThemeEngine());
  const lastSpawnTime = useRef<number[]>(Array(LANE_COUNT).fill(0));
  const lastShipPositions = useRef<number[]>(Array(LANE_COUNT).fill(-SHIP_SPACING)); // Track last ship position in each lane
  const SPAWN_INTERVAL_PER_LANE = 1000; // Adjusted for faster ship flow

  const getScreenDimensions = () => {
    if (typeof window !== 'undefined') {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1200, height: 800 };
  };

  const createSingleShip = (laneIndex: number, forcedWord?: string, forcedIsCorrect?: boolean) => {
    if (!currentChallenge || !currentChallenge.words || currentChallenge.words.length === 0) {
      console.error('[PirateAdventure] createSingleShip called without valid currentChallenge');
      return null;
    }

    const shipsInLane = pirateShips.filter(ship => ship.laneIndex === laneIndex && !ship.clicked);
    
    // Find the leftmost position of any active ship in this lane
    const leftmostShipX = shipsInLane.reduce((minX, ship) => 
        Math.min(minX, ship.currentX), 
        Infinity 
    );

    // Calculate the desired spawn X for the new ship.
    const desiredSpawnX = leftmostShipX - SHIP_SPACING - SHIP_WIDTH_ESTIMATE; 

    // Also consider a hard limit for how far left they can spawn initially if no ships are present
    const minimumSafeSpawnX = -SHIP_WIDTH_ESTIMATE - 100; 

    const startX = Math.min(desiredSpawnX, minimumSafeSpawnX);

    let wordToSpawn: string;
    let isChosenWordCorrect: boolean;

    // If a word is explicitly provided (by the main spawning loop), use it
    if (forcedWord !== undefined && forcedIsCorrect !== undefined) {
        wordToSpawn = forcedWord;
        isChosenWordCorrect = forcedIsCorrect;
    } else {
        // Fallback: This path is primarily for initial spawns, or if the main loop doesn't force a word.
        const correctWords = currentChallenge.words;
        const wordsCurrentlyOnScreen = new Set(pirateShips.filter(s => !s.clicked).map(s => s.word.toLowerCase()));

        // Get words still needed for the sentence that are NOT on screen
        const wordsUncollectedNotOnScreen = correctWords.filter(word =>
          !wordsCollected.includes(word) && !wordsCurrentlyOnScreen.has(word.toLowerCase())
        );

        const allDecoys = themeEngine.current.generateDecoys(correctWords, challenges, difficulty, currentChallenge.targetLanguage);
        const availableDecoys = allDecoys.filter(decoy => !wordsCurrentlyOnScreen.has(decoy.toLowerCase()));

        // Prioritize uncollected correct words if any are available
        if (wordsUncollectedNotOnScreen.length > 0 && Math.random() < 0.7) { // Increased chance for correct words
            wordToSpawn = wordsUncollectedNotOnScreen[Math.floor(Math.random() * wordsUncollectedNotOnScreen.length)];
            isChosenWordCorrect = true;
        } else if (availableDecoys.length > 0) {
            wordToSpawn = availableDecoys[Math.floor(Math.random() * availableDecoys.length)];
            isChosenWordCorrect = false;
        } else if (correctWords.length > 0) { // Fallback if no specific uncollected or decoys, but challenge has words
            wordToSpawn = correctWords[Math.floor(Math.random() * correctWords.length)]; // May respawn collected words
            isChosenWordCorrect = true;
        } else {
            wordToSpawn = allDecoys[Math.floor(Math.random() * allDecoys.length)] || "null"; // Ultimate fallback
            isChosenWordCorrect = false;
        }
    }

    const { height: screenHeight } = getScreenDimensions();
    const direction: 'left' | 'right' = 'left';

    let targetY = LANE_Y_POSITIONS[laneIndex];
    if (typeof targetY === 'undefined') {
        console.warn(`[PirateAdventure] Invalid laneIndex: ${laneIndex}. Defaulting to first lane Y.`);
        targetY = LANE_Y_POSITIONS[0]; 
    }

    return {
      id: `ship-${Date.now()}-${Math.random()}`,
      word: wordToSpawn,
      isCorrect: isChosenWordCorrect,
      x: startX, 
      currentX: startX,
      y: targetY, 
      speed: 0.8 + Math.random() * 0.5, 
      rotation: 0, 
      scale: 1.0,
      spawnTime: Date.now(),
      clicked: false,
      shipType: 'frigate' as 'frigate',
      sailsUp: true,
      sinkingProgress: 0,
      size: 1.0,
      feedbackStatus: undefined,
      direction,
      targetY,
      laneIndex
    };
  };

  const spawnInitialPirateShips = () => {
    if (!currentChallenge) {
      return;
    }

    setPirateShips([]);
    setWordsCollected([]);
    setCurrentWordIndex(0);
    lastSpawnTime.current = Array(LANE_COUNT).fill(0);
    lastShipPositions.current = Array(LANE_COUNT).fill(-SHIP_WIDTH_ESTIMATE * 5); 

    const newShips: PirateShip[] = [];
    const { height: screenHeight } = getScreenDimensions();

    const allSentenceWords = [...currentChallenge.words];
    const initialDecoysPool = [...themeEngine.current.generateDecoys(currentChallenge.words, challenges, difficulty, currentChallenge.targetLanguage)];

    const shipsPerLane = Math.ceil(MAX_ACTIVE_SHIPS / LANE_COUNT);

    for (let laneIndex = 0; laneIndex < LANE_COUNT; laneIndex++) {
        let targetY = LANE_Y_POSITIONS[laneIndex];
        if (typeof targetY === 'undefined') {
            console.warn(`[PirateAdventure] Invalid laneIndex: ${laneIndex}. Defaulting to first lane Y.`);
            targetY = LANE_Y_POSITIONS[0]; 
        }

        const baseStartX = -SHIP_WIDTH_ESTIMATE - 50; 

        for (let shipInLane = 0; shipInLane < shipsPerLane && newShips.length < MAX_ACTIVE_SHIPS; shipInLane++) {
            let wordToSpawn: string | undefined;
            let isCorrect: boolean;

            const randomChance = Math.random();
            // Prioritize initial correct words more strongly for initial spawn
            if (allSentenceWords.length > 0 && (randomChance < 0.8 || initialDecoysPool.length === 0)) { 
                const wordIndex = Math.floor(Math.random() * allSentenceWords.length);
                wordToSpawn = allSentenceWords.splice(wordIndex, 1)[0];
                isCorrect = true;
            } else if (initialDecoysPool.length > 0) {
                const decoyIndex = Math.floor(Math.random() * initialDecoysPool.length);
                wordToSpawn = initialDecoysPool.splice(decoyIndex, 1)[0];
                isCorrect = false;
            } else {
                break;
            }

            if (wordToSpawn) {
                const startX = baseStartX - (shipInLane * (SHIP_WIDTH_ESTIMATE + SHIP_SPACING)) - (Math.random() * 100);

                const ship = {
                    id: `ship-initial-${Date.now()}-${Math.random()}`,
                    word: wordToSpawn,
                    isCorrect: isCorrect,
                    x: startX,
                    currentX: startX,
                    y: targetY, 
                    speed: 0.8 + Math.random() * 0.5, 
                    rotation: 0,
                    scale: 1.0,
                    spawnTime: Date.now(),
                    clicked: false,
                    shipType: 'frigate' as 'frigate',
                    sailsUp: true,
                    sinkingProgress: 0,
                    size: 1.0,
                    feedbackStatus: undefined,
                    direction: 'left' as 'left',
                    laneIndex: laneIndex,
                    targetY: targetY
                };

                newShips.push(ship);
            }
        }
    }
    setPirateShips(newShips);
  };


  const updateShips = () => {
    if (isPaused || !gameActive) return;

    const { width: screenWidth } = getScreenDimensions();
    const shipsToRemove: PirateShip[] = [];

    setPirateShips(prev =>
      prev
        .filter(ship => ship && typeof ship === 'object')
        .map(ship => {
          const newX = ship.currentX + ship.speed;

          const offScreen = newX > screenWidth + SHIP_WIDTH_ESTIMATE / 2;

          if (offScreen) {
            shipsToRemove.push(ship);
            return ship;
          }

          const newY = ship.targetY; 

          return {
            ...ship,
            currentX: newX,
            y: newY,
            rotation: 0 
          };
        }).filter(ship => {
          const shouldRemove = shipsToRemove.some(s => s.id === ship.id);
          if (shouldRemove) {
            const trailParticles = themeEngine.current.createParticleEffect(ship.currentX, ship.y, 'ambient', 10);
            setParticles(currentParticles => [...currentParticles, ...trailParticles]);
          }
          return !shouldRemove;
        })
    );
  };

  const ShipComponent = React.memo(({ ship }: { ship: PirateShip }) => {
    const isFlipped = false;

    const feedbackClasses = ship.feedbackStatus === 'incorrect' ? 'ring-4 ring-red-500 animate-pulse' : '';

    return (
      <div
        className={`relative ${isFlipped ? 'scale-x-[-1]' : ''} ${feedbackClasses}`}
        style={{
          transform: `scale(${ship.size})`,
          width: '140px',
          height: '100px',
          pointerEvents: 'none'
        }}
      >
        <div className="relative" style={{ pointerEvents: 'none' }}>
          <div className="relative bg-gradient-to-b from-black via-gray-900 to-gray-950 rounded-b-full border-2 border-gray-800 shadow-2xl"
            style={{ width: '140px', height: '45px', pointerEvents: 'none' }}>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-3 bg-amber-950 rounded-b-full" style={{ pointerEvents: 'none' }}></div>
            <div className="absolute top-2 left-2 right-2 h-0.5 bg-amber-700 opacity-60" style={{ pointerEvents: 'none' }}></div>
            <div className="absolute top-4 left-2 right-2 h-0.5 bg-amber-700 opacity-60" style={{ pointerEvents: 'none' }}></div>
            <div className="absolute top-6 left-2 right-2 h-0.5 bg-amber-700 opacity-60" style={{ pointerEvents: 'none' }}></div>
          </div>
          <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-28 h-4 bg-gradient-to-b from-gray-800 to-black rounded-t-lg border border-gray-700" style={{ pointerEvents: 'none' }}></div>
          {ship.shipType === 'galleon' && (
            <div className="absolute -top-4 right-4 w-8 h-6 bg-gradient-to-b from-gray-700 to-black rounded-t border border-gray-600" style={{ pointerEvents: 'none' }}></div>
          )}
          <div className="absolute top-0 left-1/3 transform -translate-x-1/2 -translate-y-16 w-1 h-20 bg-black shadow-sm" style={{ pointerEvents: 'none' }}></div>
          {ship.shipType !== 'sloop' && (
            <div className="absolute top-0 right-1/3 transform translate-x-1/2 -translate-y-14 w-1 h-16 bg-black shadow-sm" style={{ pointerEvents: 'none' }}></div>
          )}
          {ship.sailsUp && (
            <>
              <div className="absolute top-0 left-1/3 transform -translate-x-1/2 -translate-y-14 w-12 h-14 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded border border-gray-400 shadow-lg" style={{ pointerEvents: 'none' }}>
                <div className="absolute top-2 left-1 right-1 h-0.5 bg-gray-400 opacity-40" style={{ pointerEvents: 'none' }}></div>
                <div className="absolute top-4 left-1 right-1 h-0.5 bg-gray-400 opacity-40" style={{ pointerEvents: 'none' }}></div>
                <div className="absolute top-6 left-1 right-1 h-0.5 bg-gray-400 opacity-40" style={{ pointerEvents: 'none' }}></div>
              </div>
              {ship.shipType !== 'sloop' && (
                <div className="absolute top-0 right-1/3 transform translate-x-1/2 -translate-y-12 w-10 h-12 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 rounded border border-gray-400 shadow-lg" style={{ pointerEvents: 'none' }}>
                  <div className="absolute top-2 left-1 right-1 h-0.5 bg-gray-400 opacity-40" style={{ pointerEvents: 'none' }}></div>
                  <div className="absolute top-4 left-1 right-1 h-0.5 bg-gray-400 opacity-40" style={{ pointerEvents: 'none' }}></div>
                </div>
              )}
            </>
          )}
          <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-2 w-6 h-2 bg-gray-800 rounded-full shadow-md" style={{ pointerEvents: 'none' }}>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-gray-700 rounded-full" style={{ pointerEvents: 'none' }}></div>
          </div>
          {ship.shipType === 'galleon' && (
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 translate-y-2 -translate-x-2 w-5 h-2 bg-gray-800 rounded-full shadow-md" style={{ pointerEvents: 'none' }}>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-700 rounded-full" style={{ pointerEvents: 'none' }}></div>
            </div>
          )}
          <div className="absolute top-0 right-6 transform -translate-y-12 w-4 h-3 bg-red-600 border-l-2 border-amber-900 shadow-sm" style={{ pointerEvents: 'none' }}>
            <div className="w-full h-full bg-gradient-to-r from-red-600 to-red-700" style={{ pointerEvents: 'none' }}></div>
          </div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-y-1" style={{ pointerEvents: 'none' }}>
            <div className="absolute -left-16 top-2 w-2 h-3 bg-gray-600 rounded-sm opacity-80" style={{ pointerEvents: 'none' }}></div>
            <div className="absolute -right-12 -top-2 w-3 h-3 border-2 border-gray-600 rounded-full bg-gray-800" style={{ pointerEvents: 'none' }}></div>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-white/20 rounded-full blur-sm" style={{ pointerEvents: 'none' }}></div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-2 bg-white/30 rounded-full blur-xs" style={{ pointerEvents: 'none' }}></div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white/40 rounded-full" style={{ pointerEvents: 'none' }}></div>
        </div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-y-1 bg-amber-50 text-amber-900 px-3 py-1.5 rounded-lg border-2 border-amber-600 font-bold text-sm shadow-xl" style={{ pointerEvents: 'none' }}>
          {ship.word}
        </div>
      </div>
    );
  });


  const handleShipClick = (ship: PirateShip) => {
    if (ship.feedbackStatus === 'incorrect' || ship.clicked) {
      return;
    }

    // Check if the clicked word is ANY correct word from the sentence that hasn't been collected yet
    const targetWordLower = ship.word.toLowerCase();
    const isCorrectWordForSentence = currentChallenge.words.map(w => w.toLowerCase()).includes(targetWordLower) && !wordsCollected.map(w => w.toLowerCase()).includes(targetWordLower);

    if (isCorrectWordForSentence) {
      setPirateShips(prev =>
        prev.map(s => s.id === ship.id ? { ...s, clicked: true } : s)
      );

      // Add the word to collected words (maintaining original casing for display)
      const originalWord = currentChallenge.words.find(w => w.toLowerCase() === targetWordLower) || ship.word;
      const newWordsCollected = [...wordsCollected, originalWord];
      setWordsCollected(newWordsCollected);
      // Update currentWordIndex to reflect count of collected words for UI (e.g., scoring)
      setCurrentWordIndex(newWordsCollected.length); 

      const successParticles = themeEngine.current.createParticleEffect(
        ship.currentX, ship.y, 'success', 20
      );
      setParticles(prev => [...prev, ...successParticles]);

      playSFX('gem');

      // Score bonus based on number of words collected
      const score = 10 + (newWordsCollected.length * 2) + (difficulty === 'advanced' ? 5 : 0);
      onCorrectAnswer(score);

      // Challenge complete when all words are collected
      if (newWordsCollected.length === currentChallenge.words.length) {
        setTimeout(() => {
          onChallengeComplete();
          setWordsCollected([]);
          setCurrentWordIndex(0);
          setPirateShips([]); // Clear all ships on challenge complete
        }, 500);
      }

      setTimeout(() => {
        setPirateShips(prev => prev.filter(s => s.id !== ship.id));
      }, 200);

    } else { // Incorrect click (decoy or correct word already collected)
        setPirateShips(prev =>
            prev.map(s => s.id === ship.id ? { ...s, feedbackStatus: 'incorrect' } : s)
        );

        const errorParticles = themeEngine.current.createParticleEffect(
            ship.currentX, ship.y, 'error', 12
        );
        setParticles(prev => [...prev, ...errorParticles]);

        playSFX('wrong-answer');
        onIncorrectAnswer();

        setTimeout(() => {
            setPirateShips(prev =>
                prev.map(s => s.id === ship.id ? { ...s, feedbackStatus: undefined } : s)
            );
        }, 500);
    }
  };

  const updateParticles = () => {
    setParticles(prev =>
      prev.map(p => ({
        ...p,
        x: p.x + p.vx,
        y: p.y + p.vy,
        life: p.life - 0.02
      })).filter(p => p.life > 0)
    );
  };

  useEffect(() => {
    const animate = () => {
      updateShips();
      updateParticles();

      const now = Date.now(); 

      if (currentChallenge && gameActive && !isPaused) {
        // Words in the current sentence not yet collected by the student
        const uncollectedSentenceWords = currentChallenge.words.filter(word => !wordsCollected.includes(word));

        // Words currently on screen that are not yet collected
        const wordsOnScreen = new Set(pirateShips.filter(s => !s.clicked).map(s => s.word.toLowerCase())); 

        // Words that are part of the current sentence, not collected, and NOT currently on screen
        const wordsNeededAndNotOnScreen = uncollectedSentenceWords.filter(word => !wordsOnScreen.has(word.toLowerCase()));

        // Check if we need to prioritize spawning missing correct words
        const needsToEnsureAllNeededWords = pirateShips.length < GUARANTEE_NEEDED_WORDS_THRESHOLD && wordsNeededAndNotOnScreen.length > 0;

        if (pirateShips.length < MAX_ACTIVE_SHIPS) {
            const shuffledLanes = Array.from({ length: LANE_COUNT }, (_, i) => i).sort(() => Math.random() - 0.5);
            for (const laneIndex of shuffledLanes) {
                if (now - lastSpawnTime.current[laneIndex] > SPAWN_INTERVAL_PER_LANE) {
                    let wordToSpawn: string;
                    let isChosenWordCorrect: boolean;

                    const allDecoys = themeEngine.current.generateDecoys(currentChallenge.words, challenges, difficulty, currentChallenge.targetLanguage);
                    const availableDecoys = allDecoys.filter(decoy => !wordsOnScreen.has(decoy.toLowerCase())); 

                    // --- REVISED WORD SELECTION LOGIC ---
                    if (needsToEnsureAllNeededWords) {
                        // Prioritize spawning a random word from the 'needed and not on screen' pool
                        const wordIndex = Math.floor(Math.random() * wordsNeededAndNotOnScreen.length);
                        wordToSpawn = wordsNeededAndNotOnScreen[wordIndex];
                        isChosenWordCorrect = true;
                    } else {
                        // If all needed words are on screen OR we have enough ships,
                        // then spawn a mix of remaining uncollected words (if any) and decoys
                        const generalSpawnPool: { word: string; isCorrect: boolean }[] = [];

                        // Add remaining uncollected words to the pool (only if not already on screen)
                        uncollectedSentenceWords.forEach(word => {
                            if (!wordsOnScreen.has(word.toLowerCase())) { 
                                generalSpawnPool.push({ word: word, isCorrect: true });
                            }
                        });

                        // Add available decoys to the pool
                        availableDecoys.forEach(word => generalSpawnPool.push({ word: word, isCorrect: false }));
                        
                        // Fallback: If the general pool is still empty, add any word from the challenge (even if collected) or more decoys.
                        if (generalSpawnPool.length === 0) {
                            currentChallenge.words.forEach(word => {
                                if (!wordsOnScreen.has(word.toLowerCase())) {
                                    generalSpawnPool.push({ word: word, isCorrect: true });
                                }
                            });
                            // If still no words, then just add any decoy to keep ships coming
                            if (generalSpawnPool.length === 0 && allDecoys.length > 0) {
                                allDecoys.forEach(word => generalSpawnPool.push({ word: word, isCorrect: false }));
                            }
                        }

                        if (generalSpawnPool.length > 0) {
                            const chosenOption = generalSpawnPool[Math.floor(Math.random() * generalSpawnPool.length)];
                            wordToSpawn = chosenOption.word;
                            isChosenWordCorrect = chosenOption.isCorrect;
                        } else {
                            wordToSpawn = allDecoys[Math.floor(Math.random() * allDecoys.length)] || "placeholder";
                            isChosenWordCorrect = false;
                        }
                    }
                    // --- END REVISED WORD SELECTION LOGIC ---

                    const newShip = createSingleShip(laneIndex, wordToSpawn, isChosenWordCorrect);

                    if (newShip) {
                        setPirateShips(prev => {
                            // Prevent adding direct duplicates of the exact word if it's already active and unclicked on screen
                            if (prev.some(s => s.word.toLowerCase() === newShip!.word.toLowerCase() && !s.clicked)) {
                                return prev; 
                            }
                            return [...prev, newShip!];
                        });
                        lastSpawnTime.current[laneIndex] = now;
                        lastShipPositions.current[laneIndex] = newShip.currentX;
                    }
                }
            }
        }
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
  }, [gameActive, isPaused, pirateShips.length, currentChallenge, wordsCollected]); 

  useEffect(() => {
    if (currentChallenge && gameActive) {
      spawnInitialPirateShips();
    } else if (!gameActive) {
        setPirateShips([]);
        setWordsCollected([]);
        setCurrentWordIndex(0);
        lastSpawnTime.current = Array(LANE_COUNT).fill(0);
    }
  }, [currentChallenge, gameActive]);


  if (!currentChallenge) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-slate-900 text-blue-200 text-xl">
        No challenge loaded. Please start a game or check your data source.
      </div>
    );
  }

  // --- NEW LOGIC FOR PROGRESS DISPLAY: Fixed-length lines ---
  const displayedProgress = currentChallenge.words.map(word => {
    // Check if the word (case-insensitively) exists in the collected words
    const isCollected = wordsCollected.map(w => w.toLowerCase()).includes(word.toLowerCase());
    if (isCollected) {
      // Find the original casing from collected words for display if preferred
      return wordsCollected.find(w => w.toLowerCase() === word.toLowerCase()) || word;
    } else {
      // Return a fixed-length placeholder for uncollected words (e.g., two underscores)
      return '__'; // Changed from '_'.repeat(word.length)
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
          <source src="/games/noughts-and-crosses/images/pirate-adventure/pirate-adventure-bg.mp4" type="video/mp4" />
        </video>

        {/* Video overlay gradient for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* English Sentence Display */}
      <div className="absolute top-40 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/70 backdrop-blur-sm rounded-lg px-6 py-4 border border-amber-500/30">
          <div className="text-center">
            <div className="text-sm text-amber-300 mb-1">🏴‍☠️ Decode this treasure map:</div>
            <div className="text-xl font-bold text-white">{currentChallenge.english}</div>
            <div className="text-sm text-blue-300 mt-2">
              Click the {currentChallenge.targetLanguage} pirate ships to collect the treasure!
            </div>
          </div>
        </div>
      </div>

      {/* Progress Display */}
      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-amber-500/20">
          <div className="text-center">
            <div className="text-sm text-amber-300">Treasure Collected:</div>
            <div className="text-lg font-bold text-white">
              {displayedProgress} {/* Uses the new dynamic display */}
            </div>
          </div>
        </div>
      </div>

      {/* Pirate Ships */}
      <AnimatePresence>
        {pirateShips
          .filter(ship => ship && typeof ship === 'object' && ship.id) 
          .map((ship) => (
            <motion.div
              key={ship.id}
              initial={{ opacity: 0, scale: 0.5, x: ship.currentX, y: ship.targetY }} 
              animate={{
                opacity: 1,
                scale: ship.size,
                x: ship.currentX,
                y: ship.targetY, 
                rotate: ship.rotation
              }}
              exit={{ opacity: 0, scale: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                handleShipClick(ship);
              }}
              className="absolute cursor-pointer transition-all duration-300 hover:scale-105 select-none"
              style={{
                transform: `translate(-50%, -50%)`, 
                zIndex: 100,
                pointerEvents: 'auto',
                width: `${SHIP_WIDTH_ESTIMATE}px`,
                height: `120px`,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <ShipComponent ship={ship} />
            </motion.div>
          ))}
      </AnimatePresence>

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 1 }}
            animate={{
              opacity: particle.life,
              scale: 1 - (1 - particle.life) * 0.5,
              x: particle.x,
              y: particle.y
            }}
            exit={{ opacity: 0, scale: 0 }}
            className="absolute pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              borderRadius: '50%',
              zIndex: 5
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}