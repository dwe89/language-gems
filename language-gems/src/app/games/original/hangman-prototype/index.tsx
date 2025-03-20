import React, { useState, useEffect } from 'react';
import { X, Info, Award, Settings, Play, BookOpen, Users, Zap, Volume2, User, ChevronDown, Home, Sparkles, Gift } from 'lucide-react';

// Default word lists by theme/language
const WORD_LISTS = {
  english: ['ADVENTURE', 'DISCOVERY', 'JOURNEY', 'TREASURE', 'MYSTERY'],
  japanese: ['SAMURAI', 'KIMONO', 'SUSHI', 'SAKURA', 'TOKYO'],
  spanish: ['FIESTA', 'AMIGO', 'SIESTA', 'GUITARRA', 'TANGO'],
  latin: ['AMARE', 'VIDERE', 'AUDIRE', 'FACERE', 'DICERE'],
};

// Theme configurations
const THEMES = {
  pirate: {
    name: 'Pirate Adventure',
    background: 'bg-gradient-to-b from-blue-800 via-blue-900 to-blue-950',
    accent: 'bg-amber-600',
    accentHover: 'hover:bg-amber-700',
    textAccent: 'text-amber-400',
    buttonGradient: 'bg-gradient-to-r from-amber-600 to-amber-500',
    dangerText: 'Ship Integrity',
    winMessage: 'Treasure Found!',
    loseMessage: 'Ship Sunk!',
  },
  space: {
    name: 'Space Explorer',
    background: 'bg-gradient-to-b from-indigo-900 via-purple-900 to-black',
    accent: 'bg-purple-600',
    accentHover: 'hover:bg-purple-700',
    textAccent: 'text-purple-400',
    buttonGradient: 'bg-gradient-to-r from-purple-600 to-indigo-600',
    dangerText: 'Oxygen Remaining',
    winMessage: 'Mission Successful!',
    loseMessage: 'Lost in Space!',
  },
  lavaTemple: {
    name: 'Lava Temple',
    background: 'bg-gradient-to-b from-red-800 via-red-900 to-red-950',
    accent: 'bg-orange-600',
    accentHover: 'hover:bg-orange-700',
    textAccent: 'text-orange-400',
    buttonGradient: 'bg-gradient-to-r from-orange-600 to-red-600',
    dangerText: 'Floor Stability',
    winMessage: 'Temple Conquered!',
    loseMessage: 'Consumed by Lava!',
  },
  tokyo: {
    name: 'Tokyo Nights',
    background: 'bg-gradient-to-b from-slate-900 via-blue-900 to-slate-950',
    accent: 'bg-pink-600',
    accentHover: 'hover:bg-pink-700',
    textAccent: 'text-pink-400',
    buttonGradient: 'bg-gradient-to-r from-pink-600 to-purple-600',
    dangerText: 'Energy Shield',
    winMessage: 'Mission Complete!',
    loseMessage: 'System Failure!',
  },
};

// Main game component
const LanguageGemsHangman = () => {
  // Game states
  const [currentScreen, setCurrentScreen] = useState('mainMenu'); // mainMenu, gameScreen, winScreen, loseScreen
  const [theme, setTheme] = useState(THEMES.pirate);
  const [selectedLanguage, setSelectedLanguage] = useState('english');
  const [word, setWord] = useState('');
  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [maxWrongGuesses] = useState(6);
  const [gems, setGems] = useState(10);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [animation, setAnimation] = useState(null);
  const [showPowerupEffect, setShowPowerupEffect] = useState(false);
  
  // Select a random word based on selected language
  const selectRandomWord = () => {
    const wordList = WORD_LISTS[selectedLanguage];
    const randomIndex = Math.floor(Math.random() * wordList.length);
    return wordList[randomIndex];
  };

  // Start a new game
  const startGame = () => {
    const newWord = selectRandomWord();
    setWord(newWord);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setCurrentScreen('gameScreen');
    
    // Set theme based on language
    if (selectedLanguage === 'japanese') {
      setTheme(THEMES.tokyo);
    } else if (selectedLanguage === 'spanish') {
      setTheme(THEMES.lavaTemple);
    } else if (selectedLanguage === 'latin') {
      setTheme(THEMES.space);
    } else {
      setTheme(THEMES.pirate);
    }
  };

  // Handle letter guesses
  const handleLetterGuess = (letter) => {
    if (guessedLetters.includes(letter)) return;
    
    const newGuessedLetters = [...guessedLetters, letter];
    setGuessedLetters(newGuessedLetters);
    
    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      setAnimation('wrong');
      setTimeout(() => setAnimation(null), 500);
      
      if (newWrongGuesses >= maxWrongGuesses) {
        // Player lost
        setTimeout(() => setCurrentScreen('loseScreen'), 1000);
        setStreak(0);
      }
    } else {
      setAnimation('correct');
      setTimeout(() => setAnimation(null), 500);
      
      // Check if player won
      const isWordGuessed = [...word].every(char => newGuessedLetters.includes(char));
      if (isWordGuessed) {
        const newScore = score + word.length;
        const newStreak = streak + 1;
        const newGems = gems + Math.ceil(word.length / 2);
        
        setScore(newScore);
        setStreak(newStreak);
        setGems(newGems);
        setTimeout(() => setCurrentScreen('winScreen'), 1000);
      }
    }
  };

  // Use hint (reveal a letter)
  const useHint = () => {
    if (gems < 3) return;
    
    // Find unguessed letters in the word
    const unguessedLetters = [...word].filter(char => !guessedLetters.includes(char));
    
    if (unguessedLetters.length > 0) {
      // Show powerup animation
      setShowPowerupEffect(true);
      setTimeout(() => setShowPowerupEffect(false), 1500);
      
      // Reveal a random unguessed letter
      const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
      handleLetterGuess(unguessedLetters[randomIndex]);
      setGems(gems - 3);
    }
  };

  // Render the word with guessed letters visible and unguessed as underscores
  const renderWord = () => {
    return (
      <div className="flex justify-center space-x-2">
        {[...word].map((letter, index) => (
          <div 
            key={index} 
            className={`text-center ${guessedLetters.includes(letter) ? 'animate-bounce-once' : ''}`}
          >
            <div className={`w-10 h-14 md:w-12 md:h-16 flex items-center justify-center rounded-lg ${
              guessedLetters.includes(letter) 
                ? 'bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30' 
                : ''
            }`}>
              <span className="text-white text-3xl font-bold">
                {guessedLetters.includes(letter) ? letter : ''}
              </span>
            </div>
            <div className="w-10 md:w-12 h-1 mt-1 bg-white bg-opacity-50 rounded"></div>
          </div>
        ))}
      </div>
    );
  };

  // Render the keyboard
  const renderKeyboard = () => {
    const keyboard = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];
    
    return (
      <div className="flex flex-col items-center mt-6">
        {keyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex my-1">
            {row.map((letter) => {
              const isGuessed = guessedLetters.includes(letter);
              const isCorrect = word.includes(letter) && isGuessed;
              const isWrong = !word.includes(letter) && isGuessed;
              
              let buttonClass = "mx-1 w-10 h-12 flex items-center justify-center rounded-lg font-bold shadow-lg transform transition-all duration-200 ";
              
              if (isCorrect) {
                buttonClass += "bg-green-600 text-white scale-105";
              } else if (isWrong) {
                buttonClass += "bg-red-600 text-white opacity-70";
              } else {
                buttonClass += `${theme.buttonGradient} text-white hover:scale-105 ${theme.accentHover}`;
              }
              
              return (
                <button
                  key={letter}
                  className={buttonClass}
                  onClick={() => handleLetterGuess(letter)}
                  disabled={isGuessed}
                >
                  {letter}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  // Render thematic animations based on wrong guesses
  const renderThematicAnimation = () => {
    const dangerPercentage = (wrongGuesses / maxWrongGuesses) * 100;
    
    if (theme.name === 'Pirate Adventure') {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl shadow-2xl mb-6">
          {/* Ocean background */}
          <div className="absolute inset-0 bg-blue-600"></div>
          
          {/* Animated waves */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-blue-500 opacity-70" 
               style={{
                 clipPath: 'polygon(0% 100%, 0% 60%, 4% 65%, 8% 60%, 12% 65%, 16% 60%, 20% 65%, 24% 60%, 28% 65%, 32% 60%, 36% 65%, 40% 60%, 44% 65%, 48% 60%, 52% 65%, 56% 60%, 60% 65%, 64% 60%, 68% 65%, 72% 60%, 76% 65%, 80% 60%, 84% 65%, 88% 60%, 92% 65%, 96% 60%, 100% 65%, 100% 100%)',
                 animation: 'wave 3s infinite linear'
               }}>
          </div>
          
          {/* Ship */}
          <div className="absolute left-1/2 transform -translate-x-1/2" 
               style={{
                 bottom: `${Math.min(50 - dangerPercentage/2, 40)}%`,
                 transition: 'bottom 1s ease-in-out'
               }}>
            <div className="relative">
              {/* Ship hull */}
              <div className="w-48 h-24 bg-amber-800 rounded-b-xl rounded-t-lg border-t-2 border-amber-700 relative overflow-hidden">
                {/* Windows */}
                <div className="absolute top-6 left-4 w-6 h-6 bg-amber-300 rounded-full border-2 border-amber-900"></div>
                <div className="absolute top-6 left-16 w-6 h-6 bg-amber-300 rounded-full border-2 border-amber-900"></div>
                <div className="absolute top-6 left-28 w-6 h-6 bg-amber-300 rounded-full border-2 border-amber-900"></div>
                <div className="absolute top-6 left-40 w-6 h-6 bg-amber-300 rounded-full border-2 border-amber-900"></div>
                
                {/* Deck */}
                <div className="absolute top-0 w-full h-4 bg-amber-700"></div>
                
                {/* Water inside ship based on wrong guesses */}
                <div className="absolute bottom-0 left-0 w-full bg-blue-500"
                     style={{
                       height: `${dangerPercentage}%`,
                       transition: 'height 1s ease-in-out'
                     }}>
                </div>
              </div>
              
              {/* Mast */}
              <div className="absolute bottom-24 left-24 w-4 h-40 bg-amber-900"></div>
              
              {/* Sail */}
              <div className="absolute bottom-28 left-12 w-28 h-32 bg-white rounded-t-lg"
                   style={{
                     clipPath: 'polygon(50% 0%, 100% 15%, 100% 100%, 0% 100%, 0% 15%)'
                   }}>
                {/* Sail decoration */}
                <div className="absolute top-8 left-0 w-full h-1 bg-red-600"></div>
                <div className="absolute top-12 left-0 w-full h-1 bg-red-600"></div>
                <div className="absolute top-16 left-0 w-full h-1 bg-red-600"></div>
              </div>
              
              {/* Flag */}
              <div className="absolute bottom-64 left-28 w-16 h-12 bg-black">
                {/* Skull and crossbones */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-lg font-bold">☠</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (theme.name === 'Space Explorer') {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl shadow-2xl mb-6 bg-black">
          {/* Stars background */}
          <div className="absolute inset-0">
            <div className="absolute h-1 w-1 bg-white rounded-full top-10 left-12"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-20 left-60"></div>
            <div className="absolute h-2 w-2 bg-white rounded-full top-5 left-80 animate-pulse"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-30 left-40"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-15 left-100"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-40 left-20"></div>
            <div className="absolute h-2 w-2 bg-white rounded-full top-25 left-120 animate-pulse"></div>
          </div>
          
          {/* Space station */}
          <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
            {/* Central module */}
            <div className="w-24 h-16 rounded-full bg-gradient-to-b from-gray-300 to-gray-600 relative">
              <div className="absolute top-4 left-4 w-16 h-8 bg-blue-400 rounded-full opacity-60"></div>
            </div>
            
            {/* Solar panels */}
            <div className="absolute top-4 -left-32 w-32 h-8 bg-blue-600 border border-gray-300"></div>
            <div className="absolute top-4 right-32 w-32 h-8 bg-blue-600 border border-gray-300 transform rotate-180"></div>
          </div>
          
          {/* Astronaut */}
          <div className="absolute left-1/2 transform -translate-x-1/2" 
               style={{
                 top: `${Math.min(30 + dangerPercentage/1.5, 70)}%`,
                 transition: 'top 1s ease-in-out'
               }}>
            <div className="relative">
              {/* Spacesuit */}
              <div className="w-12 h-16 bg-white rounded-lg relative">
                {/* Helmet */}
                <div className="absolute -top-8 left-0 w-12 h-12 bg-white rounded-full overflow-hidden">
                  <div className="absolute top-2 left-2 w-8 h-8 bg-black rounded-full">
                    {/* Face */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-xs">
                        {wrongGuesses < 3 ? "😀" : wrongGuesses < 5 ? "😟" : "😱"}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Oxygen display */}
                <div className="absolute top-4 left-3 w-6 h-2 bg-gray-800 rounded">
                  <div 
                    className="h-full rounded bg-green-500" 
                    style={{ 
                      width: `${100 - dangerPercentage}%`,
                      backgroundColor: dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'green'
                    }}
                  ></div>
                </div>
                
                {/* Arms */}
                <div className="absolute top-4 -left-4 w-4 h-8 bg-white rounded-lg"></div>
                <div className="absolute top-4 right-0 w-4 h-8 bg-white rounded-lg"></div>
              </div>
              
              {/* Oxygen tube */}
              <div className="absolute -top-4 -left-8 w-24 h-2 bg-white rounded-full"
                   style={{
                     clipPath: 'polygon(0% 50%, 10% 60%, 20% 50%, 30% 60%, 40% 50%, 50% 60%, 60% 50%, 70% 60%, 80% 50%, 90% 60%, 100% 50%)',
                   }}>
              </div>
              
              {/* Jetpack */}
              <div className="absolute -top-2 -left-4 w-20 h-6 bg-gray-700 rounded-lg"></div>
              
              {/* Jet flames */}
              {dangerPercentage < 80 && (
                <div className="absolute top-4 -left-2 w-2 h-4 bg-orange-500 rounded-b-lg animate-pulse"></div>
              )}
              {dangerPercentage < 60 && (
                <div className="absolute top-4 left-12 w-2 h-4 bg-orange-500 rounded-b-lg animate-pulse"></div>
              )}
            </div>
          </div>
          
          {/* Distance to Earth indicator */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="text-white text-xs mb-1">Distance to Rescue Ship:</div>
            <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full" 
                style={{ 
                  width: `${100 - dangerPercentage}%`,
                  backgroundColor: dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'green'
                }}
              ></div>
            </div>
          </div>
        </div>
      );
    } else if (theme.name === 'Lava Temple') {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl shadow-2xl mb-6">
          {/* Temple background */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-950 to-orange-900">
            {/* Ancient columns */}
            <div className="absolute top-0 left-4 w-6 h-48 bg-stone-700 rounded-b-lg"></div>
            <div className="absolute top-0 right-4 w-6 h-48 bg-stone-700 rounded-b-lg"></div>
            <div className="absolute top-0 left-1/4 w-6 h-48 bg-stone-700 rounded-b-lg"></div>
            <div className="absolute top-0 right-1/4 w-6 h-48 bg-stone-700 rounded-b-lg"></div>
            
            {/* Ancient symbols */}
            <div className="absolute top-8 left-8 w-10 h-10 border-2 border-yellow-600 flex items-center justify-center text-yellow-600">
              <span className="text-lg">⎊</span>
            </div>
            <div className="absolute top-8 right-8 w-10 h-10 border-2 border-yellow-600 flex items-center justify-center text-yellow-600">
              <span className="text-lg">⍟</span>
            </div>
          </div>
          
          {/* Lava rising */}
          <div 
            className="absolute left-0 w-full bg-gradient-to-t from-orange-600 to-red-500"
            style={{ 
              bottom: 0,
              height: `${dangerPercentage}%`, 
              transition: 'height 1s ease-in-out',
              boxShadow: '0 -10px 30px rgba(255, 80, 0, 0.7)'
            }}
          >
            {/* Lava bubbles */}
            <div className="absolute -top-2 left-1/4 w-4 h-4 bg-yellow-500 rounded-full animate-pulse"></div>
            <div className="absolute -top-3 left-2/3 w-6 h-6 bg-yellow-500 rounded-full animate-pulse" 
                 style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -top-1 left-1/2 w-3 h-3 bg-yellow-500 rounded-full animate-pulse"
                 style={{ animationDelay: '1s' }}></div>
          </div>
          
          {/* Stone platform/bridge */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-48 h-6 bg-stone-700"
               style={{
                 bottom: `${dangerPercentage}%`,
                 transition: 'bottom 1s ease-in-out'
               }}
          ></div>
          
          {/* Adventurer */}
          <div className="absolute left-1/2 transform -translate-x-1/2"
               style={{
                 bottom: `${dangerPercentage + 6}%`,
                 transition: 'bottom 1s ease-in-out'
               }}>
            <div className="relative w-12 h-20">
              {/* Body */}
              <div className="absolute bottom-0 left-2 w-8 h-12 bg-amber-800 rounded-t-lg"></div>
              
              {/* Head */}
              <div className="absolute bottom-12 left-3 w-6 h-6 bg-tan-500 rounded-full flex items-center justify-center">
                <div className="text-xs">
                  {wrongGuesses < 3 ? "😎" : wrongGuesses < 5 ? "😨" : "🔥"}
                </div>
              </div>
              
              {/* Arms */}
              <div className="absolute bottom-8 left-0 w-3 h-4 bg-amber-800 rounded-l-lg"></div>
              <div className="absolute bottom-8 right-0 w-3 h-4 bg-amber-800 rounded-r-lg"></div>
              
              {/* Adventure hat */}
              <div className="absolute bottom-16 left-2 w-8 h-3 bg-amber-900 rounded-full"></div>
            </div>
          </div>
        </div>
      );
    } else if (theme.name === 'Tokyo Nights') {
      return (
        <div className="relative w-full h-48 overflow-hidden rounded-xl shadow-2xl mb-6">
          {/* Cityscape background */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 to-purple-900">
            {/* Stars */}
            <div className="absolute h-1 w-1 bg-white rounded-full top-5 left-10"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-15 left-50"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-8 left-70"></div>
            <div className="absolute h-1 w-1 bg-white rounded-full top-20 left-30"></div>
            
            {/* Buildings */}
            <div className="absolute bottom-0 left-0 w-full flex justify-between">
              <div className="w-12 h-20 bg-slate-900 relative">
                <div className="absolute inset-0 grid grid-rows-5 grid-cols-3 gap-1 p-1">
                  {[...Array(15)].map((_, i) => (
                    <div key={i} className="bg-yellow-400 opacity-70"></div>
                  ))}
                </div>
              </div>
              <div className="w-16 h-32 bg-slate-800 relative">
                <div className="absolute inset-0 grid grid-rows-8 grid-cols-4 gap-1 p-1">
                  {[...Array(32)].map((_, i) => (
                    <div key={i} className="bg-blue-400 opacity-60"></div>
                  ))}
                </div>
              </div>
              <div className="w-14 h-24 bg-slate-900 relative">
                <div className="absolute inset-0 grid grid-rows-6 grid-cols-3 gap-1 p-1">
                  {[...Array(18)].map((_, i) => (
                    <div key={i} className="bg-pink-400 opacity-50"></div>
                  ))}
                </div>
              </div>
              <div className="w-20 h-36 bg-slate-800 relative">
                <div className="absolute inset-0 grid grid-rows-9 grid-cols-5 gap-1 p-1">
                  {[...Array(45)].map((_, i) => (
                    <div key={i} className="bg-purple-400 opacity-40"></div>
                  ))}
                </div>
              </div>
              <div className="w-10 h-16 bg-slate-900 relative">
                <div className="absolute inset-0 grid grid-rows-4 grid-cols-2 gap-1 p-1">
                  {[...Array(8)].map((_, i) => (
                    <div key={i} className="bg-green-400 opacity-60"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Futuristic platform */}
          <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 w-48 h-4 bg-gray-800 rounded-lg border border-pink-500"></div>
          
          {/* Cyber character */}
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-16">
            <div className="relative w-16 h-24">
              {/* Body */}
              <div className="absolute bottom-0 left-4 w-8 h-12 bg-black rounded-lg border border-cyan-500"></div>
              
              {/* Head */}
              <div className="absolute bottom-12 left-3 w-10 h-10 bg-black rounded-lg border border-pink-500 overflow-hidden">
                {/* Visor */}
                <div className="absolute top-3 left-0 w-full h-3 bg-cyan-500"></div>
                
                {/* Energy shield depleting */}
                <div 
                  className="absolute top-0 left-0 w-full bg-pink-500 opacity-30"
                  style={{ 
                    height: `${100 - dangerPercentage}%`, 
                    transition: 'height 1s ease-in-out'
                  }}
                ></div>
              </div>
              
              {/* Arms */}
              <div className="absolute bottom-8 left-1 w-3 h-6 bg-black rounded-full border border-cyan-500"></div>
              <div className="absolute bottom-8 right-1 w-3 h-6 bg-black rounded-full border border-cyan-500"></div>
              
              {/* Energy core */}
              <div 
                className="absolute bottom-6 left-6 w-4 h-4 rounded-full"
                style={{ 
                  backgroundColor: dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'cyan',
                  boxShadow: `0 0 10px ${dangerPercentage > 66 ? 'red' : dangerPercentage > 33 ? 'orange' : 'cyan'}`
                }}
              ></div>
            </div>
          </div>
          
          {/* Digital barrier */}
          <div 
            className="absolute top-0 inset-x-0 bg-gradient-to-b from-pink-500 to-transparent"