'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, Lightbulb, Shuffle, SkipForward } from 'lucide-react';

// Sentence data categorized by category, language, and difficulty
const SENTENCES = {
  general: {
    english: {
      beginner: [
        "I like to read books",
        "She plays tennis every day",
        "We are going to the park",
        "They have two cats at home",
        "He works at the hospital",
        "The sun is shining brightly",
        "My brother is very tall",
        "The children are playing outside"
      ],
      intermediate: [
        "Although it was raining, we decided to go for a walk",
        "Despite her busy schedule, she always finds time to exercise",
        "He couldn't attend the meeting because he was feeling unwell",
        "The company has been expanding rapidly in recent years",
        "I would have called you if I had known you were home",
        "Having finished the project, the team celebrated their success",
        "While traveling abroad, she learned to speak three languages"
      ],
      advanced: [
        "The intricate design of the architecture, which dates back to the 17th century, has been meticulously preserved",
        "Notwithstanding the challenges faced during the economic downturn, the organization managed to increase its market share",
        "The professor, whose research has been widely published in prestigious journals, is delivering a keynote speech at the conference",
        "Among the various theories proposed to explain the phenomenon, the one gaining the most traction is based on quantum mechanics",
        "Had the government implemented the recommended policies sooner, the impact of the crisis might have been substantially mitigated"
      ]
    },
    spanish: {
      beginner: [
        "Me gusta leer libros",
        "Ella juega tenis todos los días",
        "Vamos al parque",
        "Ellos tienen dos gatos en casa",
        "Él trabaja en el hospital",
        "El sol brilla intensamente",
        "Mi hermano es muy alto",
        "Los niños están jugando afuera"
      ],
      intermediate: [
        "Aunque estaba lloviendo, decidimos dar un paseo",
        "A pesar de su agenda ocupada, siempre encuentra tiempo para hacer ejercicio",
        "No pudo asistir a la reunión porque se sentía mal",
        "La empresa se ha estado expandiendo rápidamente en los últimos años",
        "Te habría llamado si hubiera sabido que estabas en casa",
        "Habiendo terminado el proyecto, el equipo celebró su éxito",
        "Mientras viajaba al extranjero, aprendió a hablar tres idiomas"
      ],
      advanced: [
        "El diseño intrincado de la arquitectura, que data del siglo XVII, ha sido meticulosamente preservado",
        "No obstante los desafíos enfrentados durante la recesión económica, la organización logró aumentar su cuota de mercado",
        "El profesor, cuya investigación ha sido ampliamente publicada en revistas prestigiosas, está dando un discurso principal en la conferencia",
        "Entre las diversas teorías propuestas para explicar el fenómeno, la que está ganando más tracción se basa en la mecánica cuántica",
        "Si el gobierno hubiera implementado las políticas recomendadas antes, el impacto de la crisis podría haber sido sustancialmente mitigado"
      ]
    },
    french: {
      beginner: [
        "J'aime lire des livres",
        "Elle joue au tennis tous les jours",
        "Nous allons au parc",
        "Ils ont deux chats à la maison",
        "Il travaille à l'hôpital",
        "Le soleil brille fort",
        "Mon frère est très grand",
        "Les enfants jouent dehors"
      ],
      intermediate: [
        "Bien qu'il pleuvait, nous avons décidé de nous promener",
        "Malgré son emploi du temps chargé, elle trouve toujours du temps pour faire de l'exercice",
        "Il n'a pas pu assister à la réunion car il se sentait mal",
        "L'entreprise s'est développée rapidement ces dernières années",
        "Je t'aurais appelé si j'avais su que tu étais à la maison",
        "Ayant terminé le projet, l'équipe a célébré son succès",
        "Pendant son voyage à l'étranger, elle a appris à parler trois langues"
      ],
      advanced: [
        "La conception complexe de l'architecture, qui remonte au XVIIe siècle, a été méticuleusement préservée",
        "Malgré les défis rencontrés pendant le ralentissement économique, l'organisation a réussi à augmenter sa part de marché",
        "Le professeur, dont la recherche a été largement publiée dans des revues prestigieuses, prononce un discours d'ouverture à la conférence",
        "Parmi les diverses théories proposées pour expliquer le phénomène, celle qui gagne le plus de terrain est basée sur la mécanique quantique",
        "Si le gouvernement avait mis en œuvre les politiques recommandées plus tôt, l'impact de la crise aurait pu être considérablement atténué"
      ]
    }
  },
  travel: {
    english: {
      beginner: [
        "Where is the hotel",
        "I need a map",
        "The beach is beautiful",
        "How much does this cost",
        "Can you take a photo of me",
        "I would like to rent a car",
        "What time does the museum open",
        "Is there a restaurant nearby"
      ],
      intermediate: [
        "We should check the train schedule before planning our day trip",
        "Having visited this city before, I can recommend some excellent local restaurants",
        "The guided tour of the ancient ruins was incredibly informative",
        "Despite the rainy weather, we enjoyed exploring the old town",
        "I wish we had booked our accommodation further in advance",
        "The travel insurance covered all the expenses after our flight was cancelled"
      ],
      advanced: [
        "The off-the-beaten-path villages we discovered while venturing beyond the usual tourist attractions offered an authentic glimpse into the local culture",
        "Navigating the intricate public transportation system of the metropolis proved challenging at first, but became second nature by the end of our stay",
        "The historical significance of the monument, which has withstood numerous conflicts and natural disasters, cannot be overstated",
        "When immersing oneself in a foreign culture, it is essential to approach unfamiliar customs with an open mind and respectful curiosity"
      ]
    }
  }
};

// Settings for difficulty levels
const DIFFICULTY_SETTINGS = {
  beginner: {
    maxHints: 3,
    scoreMultiplier: 1,
    timeBonus: 10,
    timeLimit: 120
  },
  intermediate: {
    maxHints: 2,
    scoreMultiplier: 1.5,
    timeBonus: 15,
    timeLimit: 90
  },
  advanced: {
    maxHints: 1,
    scoreMultiplier: 2,
    timeBonus: 20,
    timeLimit: 60
  }
};

type GameSettings = {
  difficulty: string;
  category: string;
  language: string;
};

type SentenceBuilderGameProps = {
  settings: GameSettings;
  onBackToMenu: () => void;
  onGameComplete: (result: { score: number; time: number; sentencesCompleted: number }) => void;
};

export default function SentenceBuilderGame({ 
  settings, 
  onBackToMenu, 
  onGameComplete 
}: SentenceBuilderGameProps) {
  // Game state
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(
    DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timeLimit
  );
  const [currentSentence, setCurrentSentence] = useState("");
  const [shuffledWords, setShuffledWords] = useState<string[]>([]);
  const [arrangedWords, setArrangedWords] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintsRemaining, setHintsRemaining] = useState(
    DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].maxHints
  );
  const [sentencesCompleted, setSentencesCompleted] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timerActive, setTimerActive] = useState(true);
  const [showCongratulation, setShowCongratulation] = useState(false);
  
  // Audio references
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const wrongSoundRef = useRef<HTMLAudioElement | null>(null);
  const completeSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Get available sentences
  const availableSentences = 
    SENTENCES[settings.category as keyof typeof SENTENCES]?.[settings.language as keyof (typeof SENTENCES)[keyof typeof SENTENCES]]?.[settings.difficulty as keyof (typeof SENTENCES)[keyof typeof SENTENCES][keyof (typeof SENTENCES)[keyof typeof SENTENCES]]] || 
    SENTENCES.general.english[settings.difficulty as keyof typeof SENTENCES.general.english];
  
  // Initialize game
  useEffect(() => {
    // Initialize audio
    correctSoundRef.current = new Audio('/sounds/correct.mp3');
    wrongSoundRef.current = new Audio('/sounds/wrong.mp3');
    completeSoundRef.current = new Audio('/sounds/complete.mp3');
    
    // Get first sentence
    getNewSentence();
    
    // Initialize timer
    const timer = setInterval(() => {
      if (timerActive) {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);
    
    // Cleanup
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  // Get a new sentence
  const getNewSentence = () => {
    if (availableSentences.length === 0) {
      handleGameOver();
      return;
    }
    
    // Select a random sentence
    const randomIndex = Math.floor(Math.random() * availableSentences.length);
    const sentence = availableSentences[randomIndex];
    
    // Split and shuffle words
    const words = sentence.split(" ");
    const shuffled = [...words].sort(() => Math.random() - 0.5);
    
    setCurrentSentence(sentence);
    setShuffledWords(shuffled);
    setArrangedWords([]);
    setIsCorrect(null);
  };
  
  // Handle dragging word from source (shuffled or arranged)
  const handleDragStart = (e: React.DragEvent, word: string, index: number, source: 'shuffled' | 'arranged') => {
    e.dataTransfer.setData('text/plain', JSON.stringify({ word, index, source }));
  };
  
  // Allow dropping
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  // Handle dropping a word
  const handleDrop = (e: React.DragEvent, dropIndex: number, target: 'shuffled' | 'arranged') => {
    e.preventDefault();
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('text/plain'));
      const { word, index, source } = data;
      
      // Handle moving between shuffled and arranged
      if (source === 'shuffled' && target === 'arranged') {
        // Move from shuffled to arranged
        const newShuffled = [...shuffledWords];
        newShuffled.splice(index, 1);
        
        const newArranged = [...arrangedWords];
        if (dropIndex === -1) {
          // Add to end if dropIndex is -1
          newArranged.push(word);
        } else {
          // Insert at specific position
          newArranged.splice(dropIndex, 0, word);
        }
        
        setShuffledWords(newShuffled);
        setArrangedWords(newArranged);
      } else if (source === 'arranged' && target === 'shuffled') {
        // Move from arranged to shuffled
        const newArranged = [...arrangedWords];
        newArranged.splice(index, 1);
        
        const newShuffled = [...shuffledWords];
        if (dropIndex === -1) {
          // Add to end if dropIndex is -1
          newShuffled.push(word);
        } else {
          // Insert at specific position
          newShuffled.splice(dropIndex, 0, word);
        }
        
        setArrangedWords(newArranged);
        setShuffledWords(newShuffled);
      } else if (source === target) {
        // Reorder within the same container
        if (source === 'shuffled') {
          const newShuffled = [...shuffledWords];
          newShuffled.splice(index, 1);
          newShuffled.splice(dropIndex === -1 ? newShuffled.length : dropIndex, 0, word);
          setShuffledWords(newShuffled);
        } else {
          const newArranged = [...arrangedWords];
          newArranged.splice(index, 1);
          newArranged.splice(dropIndex === -1 ? newArranged.length : dropIndex, 0, word);
          setArrangedWords(newArranged);
        }
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };
  
  // Check if the arranged sentence is correct
  const checkSentence = () => {
    if (arrangedWords.length === 0) return;
    
    const userSentence = arrangedWords.join(" ");
    const isUserCorrect = userSentence.toLowerCase() === currentSentence.toLowerCase();
    
    setIsCorrect(isUserCorrect);
    
    if (isUserCorrect) {
      // Play sound
      correctSoundRef.current?.play().catch(e => console.error("Error playing sound:", e));
      
      // Show celebration
      setShowCongratulation(true);
      
      // Launch confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Add score
      const timeBonusPoints = Math.floor(timeLeft * 0.5);
      const difficultyMultiplier = DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].scoreMultiplier;
      const scoreToAdd = Math.floor((100 + timeBonusPoints) * difficultyMultiplier);
      
      setScore(prev => prev + scoreToAdd);
      setSentencesCompleted(prev => prev + 1);
      
      // Add time bonus
      const timeBonus = DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timeBonus;
      setTimeLeft(prev => prev + timeBonus);
      
      // Move to next sentence after delay
      setTimeout(() => {
        setShowCongratulation(false);
        getNewSentence();
      }, 2000);
    } else {
      // Play wrong sound
      wrongSoundRef.current?.play().catch(e => console.error("Error playing sound:", e));
      
      // Reset after delay
      setTimeout(() => {
        setIsCorrect(null);
      }, 1500);
    }
  };
  
  // Use a hint
  const useHint = () => {
    if (hintsRemaining <= 0) return;
    
    // Split current sentence into words
    const correctWords = currentSentence.split(" ");
    
    // Find the next word to place
    const nextWordIndex = arrangedWords.length;
    
    if (nextWordIndex >= correctWords.length) return;
    
    const nextWord = correctWords[nextWordIndex];
    
    // Find the word in shuffled words
    const shuffledIndex = shuffledWords.findIndex(word => word.toLowerCase() === nextWord.toLowerCase());
    
    if (shuffledIndex === -1) return;
    
    // Move the word from shuffled to arranged
    const newShuffled = [...shuffledWords];
    newShuffled.splice(shuffledIndex, 1);
    
    setShuffledWords(newShuffled);
    setArrangedWords([...arrangedWords, nextWord]);
    
    // Update hints
    setHintsUsed(prev => prev + 1);
    setHintsRemaining(prev => prev - 1);
  };
  
  // Skip current sentence
  const skipSentence = () => {
    // Penalty for skipping
    setScore(prev => Math.max(0, prev - 50));
    
    // Get new sentence
    getNewSentence();
  };
  
  // Handle game over
  const handleGameOver = () => {
    setGameOver(true);
    setTimerActive(false);
    
    // Play completion sound
    completeSoundRef.current?.play().catch(e => console.error("Error playing sound:", e));
    
    // Submit results
    onGameComplete({
      score,
      time: DIFFICULTY_SETTINGS[settings.difficulty as keyof typeof DIFFICULTY_SETTINGS].timeLimit - timeLeft,
      sentencesCompleted
    });
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Game header */}
      <div className="p-6 bg-indigo-50 border-b border-indigo-100">
        <div className="flex flex-wrap justify-between items-center">
          <button
            onClick={onBackToMenu}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Back to Menu</span>
          </button>
          
          <div className="flex space-x-6 items-center">
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Score</p>
              <p className="text-2xl font-bold text-indigo-600">{score}</p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Time</p>
              <p className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-500' : 'text-indigo-600'}`}>
                {formatTime(timeLeft)}
              </p>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-600 font-medium">Sentences</p>
              <p className="text-2xl font-bold text-indigo-600">{sentencesCompleted}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={useHint}
              disabled={hintsRemaining <= 0}
              className={`flex items-center px-3 py-2 rounded ${
                hintsRemaining > 0
                  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Lightbulb size={18} className="mr-1" />
              <span>Hint ({hintsRemaining})</span>
            </button>
            
            <button
              onClick={skipSentence}
              className="flex items-center px-3 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              <SkipForward size={18} className="mr-1" />
              <span>Skip</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Game content */}
      <div className="p-6">
        {gameOver ? (
          <div className="text-center py-10">
            <h2 className="text-3xl font-bold text-indigo-600 mb-4">Game Complete!</h2>
            <p className="text-xl mb-6">Your score: <span className="font-bold">{score}</span></p>
            <p className="text-gray-600 mb-4">Sentences completed: {sentencesCompleted}</p>
            <button
              onClick={onBackToMenu}
              className="bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-8 rounded-lg font-medium text-lg transition-colors duration-200"
            >
              Back to Menu
            </button>
          </div>
        ) : (
          <div>
            <AnimatePresence mode="wait">
              {showCongratulation && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center py-4 mb-6 bg-green-50 rounded-lg"
                >
                  <h3 className="text-2xl font-bold text-green-600">Correct!</h3>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Target area for arranged words */}
            <div
              className={`border-2 border-dashed rounded-lg p-4 min-h-[100px] mb-6 flex flex-wrap gap-2 ${
                isCorrect === true
                  ? 'bg-green-50 border-green-300'
                  : isCorrect === false
                  ? 'bg-red-50 border-red-300'
                  : 'bg-gray-50 border-gray-300'
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, -1, 'arranged')}
            >
              {arrangedWords.length === 0 ? (
                <p className="text-gray-400 w-full text-center my-4">Drag words here to form a sentence</p>
              ) : (
                arrangedWords.map((word, index) => (
                  <motion.div
                    key={`arranged-${index}`}
                    className={`px-4 py-2 rounded-md shadow-md cursor-move bg-white border-2 ${
                      isCorrect === true
                        ? 'border-green-400 text-green-700'
                        : isCorrect === false
                        ? 'border-red-400 text-red-700'
                        : 'border-indigo-300 text-indigo-700'
                    }`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, word, index, 'arranged')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'arranged')}
                    animate={{ scale: isCorrect === true ? [1, 1.1, 1] : 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {word}
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Source area for shuffled words */}
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[100px] bg-gray-50 flex flex-wrap gap-2 mb-6"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, -1, 'shuffled')}
            >
              {shuffledWords.length === 0 ? (
                <p className="text-gray-400 w-full text-center my-4">No more words available</p>
              ) : (
                shuffledWords.map((word, index) => (
                  <motion.div
                    key={`shuffled-${index}`}
                    className="px-4 py-2 rounded-md shadow-md cursor-move bg-white border-2 border-gray-300 text-gray-700"
                    draggable
                    onDragStart={(e) => handleDragStart(e, word, index, 'shuffled')}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index, 'shuffled')}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {word}
                  </motion.div>
                ))
              )}
            </div>
            
            {/* Actions */}
            <div className="flex justify-between">
              <button
                onClick={() => {
                  // Reset the current sentence
                  const words = currentSentence.split(" ");
                  const shuffled = [...words].sort(() => Math.random() - 0.5);
                  setShuffledWords(shuffled);
                  setArrangedWords([]);
                  setIsCorrect(null);
                }}
                className="flex items-center px-4 py-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200"
              >
                <Shuffle size={18} className="mr-2" />
                <span>Reset Words</span>
              </button>
              
              <button
                onClick={checkSentence}
                disabled={arrangedWords.length === 0}
                className={`px-6 py-2 rounded-md font-medium ${
                  arrangedWords.length === 0
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                }`}
              >
                Check Sentence
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 