// Game configuration
const GAME_CONFIG = {
  maxMistakes: 6,
  hintsPerGame: 3,
  pointsPerCorrectGuess: 10,
  pointsPerWin: 50,
  streakBonus: 10,
  // Progressive difficulty settings
  difficulty: {
    beginner: {
      wordLengthRange: [3, 5],
      timeLimit: 120,
      pointMultiplier: 1
    },
    intermediate: {
      wordLengthRange: [6, 8],
      timeLimit: 90,
      pointMultiplier: 1.5
    },
    advanced: {
      wordLengthRange: [9, 12],
      timeLimit: 60,
      pointMultiplier: 2
    },
    expert: {
      wordLengthRange: [13, 20],
      timeLimit: 45,
      pointMultiplier: 3
    }
  },
  // Streak thresholds for difficulty progression
  streakThresholds: {
    intermediate: 3,
    advanced: 5,
    expert: 8
  },
  categories: {
    animals: ['elephant', 'giraffe', 'penguin', 'dolphin', 'kangaroo', 'tiger', 'zebra', 'koala', 'panda', 'rhinoceros'],
    countries: ['australia', 'brazil', 'canada', 'denmark', 'egypt', 'france', 'germany', 'india', 'japan', 'mexico'],
    food: ['pizza', 'sushi', 'hamburger', 'chocolate', 'pancake', 'taco', 'pasta', 'croissant', 'curry', 'cheesecake'],
    // Language-specific categories
    french: ['bonjour', 'merci', 'au revoir', 'château', 'boulangerie', 'café', 'école', 'hôpital', 'plage', 'bibliothèque'],
    spanish: ['hola', 'gracias', 'adiós', 'escuela', 'playa', 'biblioteca', 'restaurante', 'hospital', 'ciudad', 'universidad'],
    german: ['guten tag', 'danke', 'auf wiedersehen', 'schule', 'bibliothek', 'krankenhaus', 'strand', 'stadt', 'universität', 'bahnhof']
  },
  // Special characters for languages
  specialCharacters: {
    french: ['é', 'è', 'ê', 'ë', 'à', 'â', 'î', 'ï', 'ô', 'ù', 'û', 'ç', 'œ'],
    spanish: ['á', 'é', 'í', 'ó', 'ú', 'ü', 'ñ', '¿', '¡'],
    german: ['ä', 'ö', 'ü', 'ß']
  },
  // Default language
  currentLanguage: 'en'
};

console.log('Script loading...');

// Ensure DOM is loaded before accessing elements
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM fully loaded');
  
  // Game elements
  const gameElements = {
    startGameBtn: document.getElementById('startGameBtn'),
    wordInput: document.getElementById('wordInput'),
    displayWord: document.getElementById('displayWord'),
    lettersContainer: document.getElementById('lettersContainer'),
    canvas: document.getElementById('hangmanCanvas'),
    categorySelect: document.getElementById('categorySelect'),
    currentScore: document.getElementById('currentScore'),
    timer: document.getElementById('timer'),
    streak: document.getElementById('streak'),
    wins: document.getElementById('wins'),
    losses: document.getElementById('losses'),
    hintBtn: document.getElementById('hintBtn'),
    hintsLeft: document.getElementById('hintsLeft'),
    customListBtn: document.getElementById('customListBtn'),
    customListModal: document.getElementById('customListModal'),
    customWordDisplay: document.getElementById('customWordDisplay'),
    addToListBtn: document.getElementById('addToListBtn'),
    startCustomListBtn: document.getElementById('startCustomListBtn'),
    instructionsBtn: document.getElementById('instructionsBtn'),
    soundToggleBtn: document.getElementById('soundToggleBtn'),
    musicToggleBtn: document.getElementById('musicToggleBtn'),
    highScoresBtn: document.getElementById('highScoresBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    message: document.getElementById('message'),
    categoryDisplay: document.getElementById('categoryDisplay'),
    currentStreakDisplay: document.getElementById('currentStreakDisplay'),
    totalWinsDisplay: document.getElementById('totalWinsDisplay'),
    totalLossesDisplay: document.getElementById('totalLossesDisplay'),
    languageButtons: document.querySelectorAll('.lang-btn'),
    wordDefinition: document.getElementById('wordDefinition'),
    definitionText: document.getElementById('definitionText'),
    highContrastBtn: document.getElementById('highContrastBtn'),
    fontSizeBtn: document.getElementById('fontSizeBtn'),
    hearts: document.querySelectorAll('.heart-icon')
  };

  // Log which elements were not found
  Object.entries(gameElements).forEach(([key, element]) => {
    if (!element && key !== 'languageButtons') {
      console.error(`Element not found: ${key}`);
    } else if (key === 'languageButtons' && !element.length) {
      console.error('Language buttons not found');
    }
  });

  // Audio elements
  const audioElements = {
    backgroundMusic: document.getElementById('backgroundMusic'),
    correctSound: document.getElementById('correctSound'),
    wrongSound: document.getElementById('wrongSound'),
    winSound: document.getElementById('winSound'),
    loseSound: document.getElementById('loseSound')
  };

  // Log which audio elements were not found
  Object.entries(audioElements).forEach(([key, element]) => {
    if (!element) {
      console.error(`Audio element not found: ${key}`);
    }
  });

  // Game state
  let gameState = {
    currentWord: '',
    displayedWord: '',
    guessedLetters: new Set(),
    mistakes: 0,
    hintsRemaining: GAME_CONFIG.hintsPerGame,
    score: 0,
    streak: 0,
    wins: 0,
    losses: 0,
    isPlaying: false,
    timer: 0,
    timerInterval: null,
    currentCategory: '',
    customWordList: [],
    soundEnabled: true,
    musicEnabled: true,
    currentLanguage: GAME_CONFIG.currentLanguage,
    highContrastMode: false,
    largeFontMode: false
  };

  // Initialize the game
  function initGame() {
    console.log('Initializing game...');
    createLetterButtons();
    setupEventListeners();
    updateHintsDisplay();
    updateScoreDisplay();
    updateStatsDisplay();
    console.log('Game initialized!');
  }

  // Create letter buttons for the keyboard
  function createLetterButtons() {
    console.log('Creating letter buttons...');
    const alphabet = getAlphabet();
    gameElements.lettersContainer.innerHTML = '';
    
    for (const letter of alphabet) {
      const button = document.createElement('button');
      button.textContent = letter;
      button.className = 'letter-button';
      button.dataset.letter = letter;
      button.addEventListener('click', () => handleGuess(letter));
      gameElements.lettersContainer.appendChild(button);
    }
    console.log('Letter buttons created!');
  }

  // Get alphabet based on current language
  function getAlphabet() {
    const baseAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    
    // Add special characters based on the current language
    if (gameState.currentLanguage && gameState.currentLanguage !== 'en') {
      const specialChars = GAME_CONFIG.specialCharacters[gameState.currentLanguage] || [];
      return [...baseAlphabet, ...specialChars.map(char => char.toUpperCase())];
    }
    
    return baseAlphabet;
  }

  // Set up event listeners
  function setupEventListeners() {
    console.log('Setting up event listeners...');
    
    // Start game button
    gameElements.startGameBtn.addEventListener('click', function(e) {
      console.log('Start game button clicked');
      e.preventDefault();
      startGame();
    });
    
    // Hint button
    gameElements.hintBtn.addEventListener('click', function(e) {
      console.log('Hint button clicked');
      e.preventDefault();
      handleHint();
    });
    
    // Custom word list button
    gameElements.customListBtn.addEventListener('click', function(e) {
      console.log('Custom word list button clicked');
      e.preventDefault();
      showModal('customListModal');
    });
    
    // Add to custom word list button
    gameElements.addToListBtn.addEventListener('click', function(e) {
      console.log('Add to list button clicked');
      e.preventDefault();
      addCustomWord();
    });
    
    // Start game with custom words button
    gameElements.startCustomListBtn.addEventListener('click', function(e) {
      console.log('Start with custom list button clicked');
      e.preventDefault();
      startGameWithCustomWords();
    });
    
    // Instructions button
    gameElements.instructionsBtn.addEventListener('click', function(e) {
      console.log('Instructions button clicked');
      e.preventDefault();
      showModal('instructionsModal');
    });
    
    // High scores button
    gameElements.highScoresBtn.addEventListener('click', function(e) {
      console.log('High scores button clicked');
      e.preventDefault();
      showHighScores();
    });
    
    // Sound toggle button
    gameElements.soundToggleBtn.addEventListener('click', function(e) {
      console.log('Sound toggle button clicked');
      e.preventDefault();
      toggleSound();
    });
    
    // Music toggle button
    gameElements.musicToggleBtn.addEventListener('click', function(e) {
      console.log('Music toggle button clicked');
      e.preventDefault();
      toggleMusic();
    });
    
    // Fullscreen button
    gameElements.fullscreenBtn.addEventListener('click', function(e) {
      console.log('Fullscreen button clicked');
      e.preventDefault();
      toggleFullscreen();
    });
    
    // Language buttons
    if (gameElements.languageButtons) {
      gameElements.languageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
          e.preventDefault();
          const lang = this.dataset.lang;
          setLanguage(lang);
        });
      });
    }
    
    // Keyboard input
    document.addEventListener('keydown', (e) => {
      if (gameState.isPlaying) {
        const key = e.key.toUpperCase();
        // Allow alphanumeric and special characters
        if (/^[A-Z0-9]$/.test(key) || isSpecialCharacter(key)) {
          handleGuess(key);
        }
      }
    });
    
    // Close modal buttons
    document.querySelectorAll('.close-modal, .close-btn').forEach(button => {
      button.addEventListener('click', function(e) {
        console.log('Close modal button clicked');
        e.preventDefault();
        document.querySelectorAll('.modal').forEach(modal => {
          modal.classList.remove('show');
        });
      });
    });
    
    // Victory modal next word button
    const nextWordBtn = document.getElementById('nextWordBtn');
    if (nextWordBtn) {
      nextWordBtn.addEventListener('click', function(e) {
        console.log('Next word button clicked');
        e.preventDefault();
        startNextWord();
      });
    } else {
      console.error('Next word button not found');
    }
    
    // Game over modal new game button
    const newGameBtn = document.getElementById('newGameBtn');
    if (newGameBtn) {
      newGameBtn.addEventListener('click', function(e) {
        console.log('New game button clicked');
        e.preventDefault();
        resetGame();
      });
    } else {
      console.error('New game button not found');
    }
    
    // Accessibility controls
    gameElements.highContrastBtn.addEventListener('click', toggleHighContrast);
    gameElements.fontSizeBtn.addEventListener('click', toggleFontSize);
    
    // Load accessibility preferences
    const savedHighContrast = localStorage.getItem('hangman-high-contrast') === 'true';
    const savedLargeFont = localStorage.getItem('hangman-large-font') === 'true';
    
    if (savedHighContrast) {
      gameState.highContrastMode = true;
      document.body.classList.add('high-contrast');
    }
    
    if (savedLargeFont) {
      gameState.largeFontMode = true;
      document.body.classList.add('large-font');
    }
    
    console.log('Event listeners set up!');
  }

  // Check if a character is a special character for the current language
  function isSpecialCharacter(char) {
    if (!gameState.currentLanguage || gameState.currentLanguage === 'en') {
      return false;
    }
    
    const specialChars = GAME_CONFIG.specialCharacters[gameState.currentLanguage] || [];
    return specialChars.map(c => c.toUpperCase()).includes(char);
  }

  // Set the current language
  function setLanguage(lang) {
    if (!lang || !GAME_CONFIG.specialCharacters[lang] && lang !== 'en') {
      console.error(`Invalid language: ${lang}`);
      return;
    }
    
    console.log(`Setting language to: ${lang}`);
    gameState.currentLanguage = lang;
    
    // Update language buttons
    gameElements.languageButtons.forEach(button => {
      if (button.dataset.lang === lang) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    });
    
    // Update title based on language
    const titleElement = document.querySelector('.title');
    if (titleElement) {
      switch (lang) {
        case 'es':
          titleElement.textContent = 'El ahorcado';
          break;
        case 'fr':
          titleElement.textContent = 'Le pendu';
          break;
        case 'de':
          titleElement.textContent = 'Galgenmännchen';
          break;
        default:
          titleElement.textContent = 'Hangman Game';
      }
    }
    
    // Recreate letter buttons
    createLetterButtons();
    
    // If game is in progress, don't change the category
    if (!gameState.isPlaying) {
      // Update category select if the language has a category
      if (GAME_CONFIG.categories[lang]) {
        gameElements.categorySelect.value = lang;
      }
    }
  }

  // Start a new game
  function startGame() {
    console.log('Starting game...');
    const category = gameElements.categorySelect.value;
    const customWord = gameElements.wordInput.value.trim();
    console.log(`Category: ${category}, Custom word: ${customWord ? 'provided' : 'not provided'}`);
    
    if (customWord) {
      startGameWithWord(customWord);
    } else {
      startGameWithCategory(category);
    }
  }

  // Start game with a specific word
  function startGameWithWord(word) {
    console.log(`Starting game with custom word: ${word.length} characters`);
    if (!word) return;
    
    resetGameState();
    gameState.currentWord = word.toUpperCase();
    gameState.currentCategory = 'Custom Word';
    startRound();
  }

  // Start game with a category
  function startGameWithCategory(category) {
    console.log('Starting game with category:', category);
    let words = [];
    
    if (category === 'random') {
      const categories = Object.keys(GAME_CONFIG.categories);
      category = categories[Math.floor(Math.random() * categories.length)];
    }
    
    words = GAME_CONFIG.categories[category];
    
    if (!words || words.length === 0) {
      console.error('No words found for category:', category);
      showNotification('Error loading words. Please try again.', 'error');
      return;
    }
    
    const difficulty = getCurrentDifficultyLevel(gameState.streak);
    const word = getWordForDifficulty(words, difficulty);
    
    gameState.currentCategory = category;
    startGameWithWord(word);
    
    // Update timer based on difficulty
    const timeLimit = GAME_CONFIG.difficulty[difficulty].timeLimit;
    gameState.timer = timeLimit;
    updateTimerDisplay();
  }

  // Start game with custom word list
  function startGameWithCustomWords() {
    console.log('Starting game with custom words...');
    const customWords = getCustomWords();
    console.log(`Custom words count: ${customWords.length}`);
    
    if (customWords.length === 0) {
      showNotification('Please add at least one word to your custom list', 'error');
      return;
    }
    
    gameState.customWordList = [...customWords];
    const randomIndex = Math.floor(Math.random() * customWords.length);
    
    resetGameState();
    gameState.currentWord = customWords[randomIndex].toUpperCase();
    gameState.currentCategory = 'Custom List';
    
    hideModal('customListModal');
    startRound();
  }

  // Start the current round
  function startRound() {
    console.log('Starting round...');
    gameState.isPlaying = true;
    gameState.displayedWord = '_'.repeat(gameState.currentWord.length);
    gameState.guessedLetters = new Set();
    gameState.mistakes = 0;
    gameState.hintsRemaining = GAME_CONFIG.hintsPerGame;
    
    updateWordDisplay();
    updateHintsDisplay();
    enableLetterButtons();
    gameElements.hintBtn.disabled = false;
    gameElements.categoryDisplay.textContent = gameState.currentCategory;
    
    // Clear the canvas and draw the initial state
    const ctx = gameElements.canvas.getContext('2d');
    ctx.clearRect(0, 0, gameElements.canvas.width, gameElements.canvas.height);
    drawHangman(ctx, 0);
    
    // Start the timer
    startTimer();
    
    // Start background music if enabled
    if (gameState.musicEnabled && audioElements.backgroundMusic.paused) {
      audioElements.backgroundMusic.play().catch(e => console.error('Error playing background music:', e));
    }
    
    updateHeartsDisplay();
    updateStreakProgress();
    updateDifficultyDisplay();
    gameElements.wordDefinition.classList.add('hidden');
    
    console.log('Round started!');
  }

  // Handle a letter guess
  function handleGuess(letter) {
    console.log(`Guessing letter: ${letter}`);
    if (!gameState.isPlaying || gameState.guessedLetters.has(letter)) {
      console.log('Letter already guessed or game not in progress');
      return;
    }
    
    gameState.guessedLetters.add(letter);
    
    // Disable the letter button
    const letterButton = document.querySelector(`.letter-button[data-letter="${letter}"]`);
    if (letterButton) {
      letterButton.disabled = true;
    } else {
      console.error(`Letter button not found for: ${letter}`);
    }
    
    // For Spanish words, treat 'A' and 'Á' as the same for guessing purposes
    const normalizedWord = normalizeWordForGuessing(gameState.currentWord);
    const normalizedLetter = normalizeCharacter(letter);
    
    if (normalizedWord.includes(normalizedLetter) || gameState.currentWord.includes(letter)) {
      // Correct guess
      if (letterButton) letterButton.classList.add('correct');
      updateWordDisplay();
      updateScore(GAME_CONFIG.pointsPerCorrectGuess);
      playSound('correct');
      console.log('Correct guess!');
      
      // Check for win
      if (!gameState.displayedWord.includes('_')) {
        console.log('Player won!');
        handleWin();
      }
    } else {
      // Incorrect guess
      if (letterButton) letterButton.classList.add('incorrect');
      gameState.mistakes++;
      drawHangman(gameElements.canvas.getContext('2d'), gameState.mistakes);
      playSound('wrong');
      console.log('Incorrect guess!');
      
      // Check for game over
      if (gameState.mistakes >= GAME_CONFIG.maxMistakes) {
        console.log('Game over!');
        handleLoss();
      }
    }
    
    updateHeartsDisplay();
  }

  // Normalize word for guessing (handles accents)
  function normalizeWordForGuessing(word) {
    // For Spanish, French, German: normalize accented characters for guessing
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Normalize a single character for guessing
  function normalizeCharacter(char) {
    return char.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  // Handle hint button click
  function handleHint() {
    console.log('Hint requested');
    if (!gameState.isPlaying || gameState.hintsRemaining <= 0) {
      console.log('Cannot use hint - game not in progress or no hints remaining');
      return;
    }
    
    // Find unguessed letters in the word
    const unguessedLetters = [...gameState.currentWord].filter(
      letter => !gameState.guessedLetters.has(letter) && letter !== ' '
    );
    
    if (unguessedLetters.length > 0) {
      // Choose a random unguessed letter
      const randomIndex = Math.floor(Math.random() * unguessedLetters.length);
      const hintLetter = unguessedLetters[randomIndex];
      
      // Use up a hint
      gameState.hintsRemaining--;
      updateHintsDisplay();
      
      console.log(`Hint reveals letter: ${hintLetter}`);
      // Make the guess
      handleGuess(hintLetter);
    } else {
      console.log('No unguessed letters to hint');
    }
  }

  // Update the displayed word with guessed letters
  function updateWordDisplay() {
    let display = '';
    
    for (const letter of gameState.currentWord) {
      if (letter === ' ') {
        display += ' ';
      } else {
        // Check if the letter or its normalized version has been guessed
        const normalizedLetter = normalizeCharacter(letter);
        const hasBeenGuessed = [...gameState.guessedLetters].some(guessed => {
          return normalizeCharacter(guessed) === normalizedLetter || guessed === letter;
        });
        
        display += hasBeenGuessed ? letter : '_';
      }
    }
    
    gameState.displayedWord = display;
    gameElements.displayWord.textContent = display.split('').join(' ');
    console.log(`Word display updated: ${gameElements.displayWord.textContent}`);
  }

  // Draw the hangman based on number of mistakes
  function drawHangman(ctx, mistakes) {
    console.log(`Drawing hangman for ${mistakes} mistakes`);
    // Clear the canvas
    ctx.clearRect(0, 0, gameElements.canvas.width, gameElements.canvas.height);
    
    // Set drawing styles for a more attractive theme
    const gradient = ctx.createLinearGradient(0, 0, 0, gameElements.canvas.height);
    gradient.addColorStop(0, '#87CEEB');   // Sky blue
    gradient.addColorStop(1, '#4682B4');   // Steel blue
    
    // Draw scene background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, gameElements.canvas.width, gameElements.canvas.height);
    
    // Draw grass
    ctx.fillStyle = '#7CFC00';
    ctx.beginPath();
    ctx.moveTo(0, 250);
    ctx.quadraticCurveTo(150, 245, 300, 250);
    ctx.lineTo(300, 300);
    ctx.lineTo(0, 300);
    ctx.closePath();
    ctx.fill();
    
    // Draw sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(50, 50, 20, 0, Math.PI * 2);
    ctx.fill();
    
    // Sun rays
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(50 + Math.cos(angle) * 25, 50 + Math.sin(angle) * 25);
      ctx.lineTo(50 + Math.cos(angle) * 35, 50 + Math.sin(angle) * 35);
      ctx.stroke();
    }
    
    // Draw tree
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.moveTo(50, 250);
    ctx.lineTo(50, 180);
    ctx.lineTo(45, 180);
    ctx.lineTo(60, 150);
    ctx.lineTo(75, 180);
    ctx.lineTo(70, 180);
    ctx.lineTo(70, 250);
    ctx.closePath();
    ctx.fill();
    
    // Tree foliage
    ctx.fillStyle = '#228B22';
    ctx.beginPath();
    ctx.arc(60, 150, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(45, 160, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(75, 160, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw wooden gallows with texture
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Add wood texture to gallows
    const drawWoodTexture = (x, y, width, height, vertical = false) => {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(x, y, width, height);
      
      // Add wood grain
      ctx.strokeStyle = '#A0522D';
      ctx.lineWidth = 1;
      
      if (vertical) {
        for (let i = 0; i < width; i += 3) {
          ctx.beginPath();
          ctx.moveTo(x + i, y);
          ctx.lineTo(x + i, y + height);
          ctx.stroke();
        }
      } else {
        for (let i = 0; i < height; i += 3) {
          ctx.beginPath();
          ctx.moveTo(x, y + i);
          ctx.lineTo(x + width, y + i);
          ctx.stroke();
        }
      }
    };
    
    // Base
    drawWoodTexture(120, 245, 130, 10);
    // Pole
    drawWoodTexture(150, 100, 10, 145, true);
    // Top
    drawWoodTexture(150, 100, 80, 10);
    // Rope
    ctx.strokeStyle = '#A0522D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(220, 100);
    ctx.lineTo(220, 130);
    ctx.stroke();
    
    // Draw animated character based on mistakes
    const characterX = 220;
    let characterY = 130;
    
    // Draw the hangman parts based on mistakes
    if (mistakes >= 1) {
      // Head with face
      ctx.beginPath();
      ctx.fillStyle = '#FFD700';
      ctx.arc(characterX, characterY + 15, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Face features (always show them)
      // Eyes
      ctx.fillStyle = '#000';
      ctx.beginPath();
      
      if (mistakes >= 6) {
        // X eyes when game over
        ctx.lineWidth = 2;
        // Left eye X
        ctx.beginPath();
        ctx.moveTo(characterX - 10, characterY + 8);
        ctx.lineTo(characterX - 4, characterY + 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(characterX - 4, characterY + 8);
        ctx.lineTo(characterX - 10, characterY + 14);
        ctx.stroke();
        
        // Right eye X
        ctx.beginPath();
        ctx.moveTo(characterX + 10, characterY + 8);
        ctx.lineTo(characterX + 4, characterY + 14);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(characterX + 4, characterY + 8);
        ctx.lineTo(characterX + 10, characterY + 14);
        ctx.stroke();
        
        // Sad mouth
        ctx.beginPath();
        ctx.arc(characterX, characterY + 25, 8, Math.PI * 0.1, Math.PI * 0.9, false);
        ctx.stroke();
      } else {
        // Normal face
        ctx.beginPath();
        ctx.arc(characterX - 7, characterY + 10, 3, 0, Math.PI * 2);
        ctx.arc(characterX + 7, characterY + 10, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Mouth - changes from smile to worried based on mistakes
        ctx.beginPath();
        const mouthStart = Math.PI * (0.1 + (mistakes * 0.05));
        const mouthEnd = Math.PI * (0.9 - (mistakes * 0.05));
        
        if (mistakes < 4) {
          // Smile to neutral
          ctx.arc(characterX, characterY + 20, 8, mouthStart, mouthEnd, false);
        } else {
          // Worried
          ctx.arc(characterX, characterY + 25, 8, mouthStart, mouthEnd, true);
        }
        ctx.stroke();
      }
    }
    
    if (mistakes >= 2) {
      // Body with shirt
      ctx.beginPath();
      ctx.fillStyle = '#4169E1';  // Royal blue shirt
      ctx.moveTo(characterX - 15, characterY + 35);
      ctx.lineTo(characterX + 15, characterY + 35);
      ctx.lineTo(characterX + 10, characterY + 80);
      ctx.lineTo(characterX - 10, characterY + 80);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
    
    if (mistakes >= 3) {
      // Left arm with animation
      const leftArmAngle = Math.sin(Date.now() / 1000) * 0.1;
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.moveTo(characterX - 15, characterY + 40);
      ctx.lineTo(characterX - 30, characterY + 60 + Math.sin(leftArmAngle) * 5);
      ctx.stroke();
      
      // Hand
      ctx.beginPath();
      ctx.fillStyle = '#FFD700';
      ctx.arc(characterX - 30, characterY + 60 + Math.sin(leftArmAngle) * 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    if (mistakes >= 4) {
      // Right arm with animation
      const rightArmAngle = Math.sin(Date.now() / 1000 + Math.PI) * 0.1;
      ctx.beginPath();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 4;
      ctx.moveTo(characterX + 15, characterY + 40);
      ctx.lineTo(characterX + 30, characterY + 60 + Math.sin(rightArmAngle) * 5);
      ctx.stroke();
      
      // Hand
      ctx.beginPath();
      ctx.fillStyle = '#FFD700';
      ctx.arc(characterX + 30, characterY + 60 + Math.sin(rightArmAngle) * 5, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    if (mistakes >= 5) {
      // Left leg with pants
      ctx.beginPath();
      ctx.fillStyle = '#191970';  // Midnight blue pants
      ctx.moveTo(characterX - 10, characterY + 80);
      ctx.lineTo(characterX, characterY + 80);
      ctx.lineTo(characterX - 15, characterY + 120);
      ctx.lineTo(characterX - 25, characterY + 120);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Shoe
      ctx.beginPath();
      ctx.fillStyle = '#8B4513';
      ctx.ellipse(characterX - 20, characterY + 120, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    if (mistakes >= 6) {
      // Right leg with pants
      ctx.beginPath();
      ctx.fillStyle = '#191970';  // Midnight blue pants
      ctx.moveTo(characterX, characterY + 80);
      ctx.lineTo(characterX + 10, characterY + 80);
      ctx.lineTo(characterX + 25, characterY + 120);
      ctx.lineTo(characterX + 15, characterY + 120);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Shoe
      ctx.beginPath();
      ctx.fillStyle = '#8B4513';
      ctx.ellipse(characterX + 20, characterY + 120, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    
    // Request animation frame to animate the arms if game is active
    if (gameState.isPlaying && mistakes > 2 && mistakes < 6) {
      requestAnimationFrame(() => drawHangman(ctx, mistakes));
    }
  }

  // Handle a win
  async function handleWin() {
    console.log('Handling win');
    gameState.isPlaying = false;
    gameState.wins++;
    gameState.streak++;
    
    // Calculate bonus points
    const streakBonus = gameState.streak * GAME_CONFIG.streakBonus;
    const timeBonus = Math.max(0, 300 - gameState.timer) * 2;
    const totalPoints = GAME_CONFIG.pointsPerWin + streakBonus + timeBonus;
    
    updateScore(totalPoints);
    updateStatsDisplay();
    stopTimer();
    
    // Show success message
    gameElements.message.textContent = 'You won!';
    gameElements.message.className = 'message-display success';
    
    // Play win sound
    playSound('win');
    
    // Show victory modal
    const victoryStats = document.getElementById('victoryStats');
    if (victoryStats) {
      victoryStats.innerHTML = `
        <p>Word: ${gameState.currentWord}</p>
        <p>Score: ${gameState.score}</p>
        <p>Streak: ${gameState.streak}</p>
        <p>Time: ${formatTime(gameState.timer)}</p>
      `;
    } else {
      console.error('Victory stats element not found');
    }
    
    showModal('victoryModal');
    showConfetti();
    
    // Fetch and display word definition
    const definition = await fetchWordDefinition(gameState.currentWord);
    gameElements.definitionText.textContent = definition;
    gameElements.wordDefinition.classList.remove('hidden');
  }

  // Handle a loss
  function handleLoss() {
    console.log('Handling loss');
    gameState.isPlaying = false;
    gameState.losses++;
    gameState.streak = 0;
    
    updateStatsDisplay();
    stopTimer();
    
    // Show error message
    gameElements.message.textContent = `Game over! The word was: ${gameState.currentWord}`;
    gameElements.message.className = 'message-display error';
    
    // Play lose sound
    playSound('lose');
    
    // Show game over modal
    const gameOverText = document.getElementById('gameOverText');
    if (gameOverText) {
      gameOverText.innerHTML = `
        <p>The word was: <strong>${gameState.currentWord}</strong></p>
        <p>Better luck next time!</p>
      `;
    } else {
      console.error('Game over text element not found');
    }
    
    showModal('gameOverModal');
  }

  // Start the next word
  function startNextWord() {
    console.log('Starting next word');
    hideModal('victoryModal');
    
    if (gameState.customWordList.length > 0) {
      // Remove the current word from the list
      gameState.customWordList = gameState.customWordList.filter(
        word => word.toUpperCase() !== gameState.currentWord
      );
      
      if (gameState.customWordList.length > 0) {
        // Choose a new random word from the list
        const randomIndex = Math.floor(Math.random() * gameState.customWordList.length);
        const nextWord = gameState.customWordList[randomIndex].toUpperCase();
        
        resetGameState(false);
        gameState.currentWord = nextWord;
        startRound();
      } else {
        // No more words in the list
        showNotification('No more words in your custom list!', 'info');
        resetGame();
      }
    } else {
      // Start a new game with the same category
      startGameWithCategory(gameState.currentCategory.toLowerCase());
    }
  }

  // Reset the game
  function resetGame() {
    console.log('Resetting game');
    hideModal('gameOverModal');
    resetGameState(true);
    gameElements.wordInput.value = '';
    gameElements.categorySelect.selectedIndex = 0;
    gameElements.message.textContent = '';
    gameElements.categoryDisplay.textContent = '';
    
    const ctx = gameElements.canvas.getContext('2d');
    ctx.clearRect(0, 0, gameElements.canvas.width, gameElements.canvas.height);
    drawHangman(ctx, 0);
  }

  // Reset the game state
  function resetGameState(resetScore = false) {
    console.log(`Resetting game state (resetScore: ${resetScore})`);
    gameState.currentWord = '';
    gameState.displayedWord = '';
    gameState.guessedLetters = new Set();
    gameState.mistakes = 0;
    gameState.hintsRemaining = GAME_CONFIG.hintsPerGame;
    gameState.isPlaying = false;
    gameState.timer = 0;
    
    if (resetScore) {
      gameState.score = 0;
      gameState.streak = 0;
    }
    
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
    
    updateHintsDisplay();
    updateScoreDisplay();
    updateStatsDisplay();
    gameElements.timer.textContent = '00:00';
  }

  // Start the timer
  function startTimer() {
    console.log('Starting timer');
    gameState.timer = 0;
    clearInterval(gameState.timerInterval);
    
    gameState.timerInterval = setInterval(() => {
      gameState.timer++;
      gameElements.timer.textContent = formatTime(gameState.timer);
    }, 1000);
  }

  // Stop the timer
  function stopTimer() {
    console.log('Stopping timer');
    clearInterval(gameState.timerInterval);
    gameState.timerInterval = null;
  }

  // Format time as MM:SS
  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  // Update the score display
  function updateScore(points) {
    const difficulty = getCurrentDifficultyLevel(gameState.streak);
    const multiplier = GAME_CONFIG.difficulty[difficulty].pointMultiplier;
    const adjustedPoints = Math.round(points * multiplier);
    
    gameState.score += adjustedPoints;
    updateScoreDisplay();
    
    // Show point animation
    const scoreElement = document.getElementById('currentScore');
    if (scoreElement) {
      const pointsDisplay = document.createElement('div');
      pointsDisplay.className = 'points-animation';
      pointsDisplay.textContent = `+${adjustedPoints}`;
      scoreElement.appendChild(pointsDisplay);
      
      // Remove animation after it completes
      setTimeout(() => pointsDisplay.remove(), 1000);
    }
    
    updateStreakProgress();
  }

  // Update the stats display
  function updateStatsDisplay() {
    console.log('Updating stats display');
    gameElements.streak.textContent = `Streak: ${gameState.streak}`;
    gameElements.wins.textContent = gameState.wins;
    gameElements.losses.textContent = gameState.losses;
    
    // Update high scores modal
    gameElements.currentStreakDisplay.textContent = gameState.streak;
    gameElements.totalWinsDisplay.textContent = gameState.wins;
    gameElements.totalLossesDisplay.textContent = gameState.losses;
  }

  // Update the hints display
  function updateHintsDisplay() {
    console.log(`Updating hints display: ${gameState.hintsRemaining} remaining`);
    gameElements.hintsLeft.textContent = gameState.hintsRemaining;
    gameElements.hintBtn.disabled = gameState.hintsRemaining <= 0 || !gameState.isPlaying;
  }

  // Update score display (separate function)
  function updateScoreDisplay() {
    console.log(`Updating score display: ${gameState.score}`);
    gameElements.currentScore.textContent = gameState.score;
  }

  // Enable all letter buttons
  function enableLetterButtons() {
    console.log('Enabling letter buttons');
    document.querySelectorAll('.letter-button').forEach(button => {
      button.disabled = false;
      button.classList.remove('correct', 'incorrect');
    });
  }

  // Show a modal
  function showModal(modalId) {
    console.log(`Showing modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('show');
    } else {
      console.error(`Modal not found: ${modalId}`);
    }
  }

  // Hide a modal
  function hideModal(modalId) {
    console.log(`Hiding modal: ${modalId}`);
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('show');
    } else {
      console.error(`Modal not found: ${modalId}`);
    }
  }

  // Show high scores
  function showHighScores() {
    console.log('Showing high scores');
    showModal('highScoresModal');
  }

  // Toggle sound effects
  function toggleSound() {
    gameState.soundEnabled = !gameState.soundEnabled;
    console.log(`Sound ${gameState.soundEnabled ? 'enabled' : 'disabled'}`);
    
    const icon = gameElements.soundToggleBtn.querySelector('i');
    if (icon) {
      icon.className = gameState.soundEnabled ? 'fas fa-volume-up' : 'fas fa-volume-mute';
    } else {
      console.error('Sound icon element not found');
    }
    
    // Mute/unmute all sound effects
    audioElements.correctSound.muted = !gameState.soundEnabled;
    audioElements.wrongSound.muted = !gameState.soundEnabled;
    audioElements.winSound.muted = !gameState.soundEnabled;
    audioElements.loseSound.muted = !gameState.soundEnabled;
  }

  // Toggle background music
  function toggleMusic() {
    gameState.musicEnabled = !gameState.musicEnabled;
    console.log(`Music ${gameState.musicEnabled ? 'enabled' : 'disabled'}`);
    
    const icon = gameElements.musicToggleBtn.querySelector('i');
    if (icon) {
      icon.className = gameState.musicEnabled ? 'fas fa-music' : 'fas fa-volume-mute';
    } else {
      console.error('Music icon element not found');
    }
    
    if (gameState.musicEnabled) {
      audioElements.backgroundMusic.play().catch(e => console.error('Error playing background music:', e));
    } else {
      audioElements.backgroundMusic.pause();
    }
  }

  // Toggle fullscreen mode
  function toggleFullscreen() {
    console.log('Toggling fullscreen');
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable fullscreen: ${e.message}`);
      });
      
      const icon = gameElements.fullscreenBtn.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-compress';
      } else {
        console.error('Fullscreen icon element not found');
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        
        const icon = gameElements.fullscreenBtn.querySelector('i');
        if (icon) {
          icon.className = 'fas fa-expand';
        } else {
          console.error('Fullscreen icon element not found');
        }
      }
    }
  }

  // Play a sound effect
  function playSound(soundName) {
    console.log(`Playing sound: ${soundName}`);
    if (!gameState.soundEnabled) {
      console.log('Sound is disabled, not playing');
      return;
    }
    
    switch (soundName) {
      case 'correct':
        audioElements.correctSound.currentTime = 0;
        audioElements.correctSound.play().catch(e => console.error('Error playing sound:', e));
        break;
      case 'wrong':
        audioElements.wrongSound.currentTime = 0;
        audioElements.wrongSound.play().catch(e => console.error('Error playing sound:', e));
        break;
      case 'win':
        audioElements.winSound.currentTime = 0;
        audioElements.winSound.play().catch(e => console.error('Error playing sound:', e));
        break;
      case 'lose':
        audioElements.loseSound.currentTime = 0;
        audioElements.loseSound.play().catch(e => console.error('Error playing sound:', e));
        break;
      default:
        console.error(`Unknown sound: ${soundName}`);
    }
  }

  // Show confetti animation for victory
  function showConfetti() {
    console.log('Showing confetti');
    const confettiContainer = document.querySelector('.confetti-container');
    if (!confettiContainer) {
      console.error('Confetti container not found');
      return;
    }
    
    confettiContainer.innerHTML = '';
    
    const colors = ['#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590'];
    
    for (let i = 0; i < 100; i++) {
      const confetti = document.createElement('div');
      confetti.className = 'confetti';
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.width = `${Math.random() * 10 + 5}px`;
      confetti.style.height = `${Math.random() * 10 + 5}px`;
      confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
      confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
      confetti.style.animationDelay = `${Math.random() * 2}s`;
      
      confettiContainer.appendChild(confetti);
    }
  }

  // Show a notification
  function showNotification(message, type = 'info') {
    console.log(`Showing notification: ${message} (${type})`);
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Add a word to the custom word list
  function addCustomWord() {
    console.log('Adding custom word');
    const customWordInput = document.getElementById('customWordInput');
    if (!customWordInput) {
      console.error('Custom word input not found');
      return;
    }
    
    const word = customWordInput.value.trim();
    
    if (!word) {
      showNotification('Please enter a word', 'error');
      return;
    }
    
    // Add the word to the display
    const wordChip = document.createElement('div');
    wordChip.className = 'word-chip';
    wordChip.innerHTML = `
      ${word}
      <span class="remove-word" data-word="${word}">&times;</span>
    `;
    
    gameElements.customWordDisplay.appendChild(wordChip);
    
    // Add event listener to remove button
    wordChip.querySelector('.remove-word').addEventListener('click', function() {
      console.log(`Removing word: ${word}`);
      wordChip.remove();
    });
    
    // Clear the input
    customWordInput.value = '';
    console.log(`Custom word added: ${word}`);
  }

  // Get all words from the custom word list
  function getCustomWords() {
    console.log('Getting custom words');
    const wordChips = gameElements.customWordDisplay.querySelectorAll('.word-chip');
    const words = Array.from(wordChips).map(chip => chip.textContent.trim());
    console.log(`Found ${words.length} custom words`);
    return words;
  }

  // Add confetti styles if not already in the document
  if (!document.getElementById('confetti-styles')) {
    console.log('Adding confetti styles');
    const confettiStyles = document.createElement('style');
    confettiStyles.id = 'confetti-styles';
    confettiStyles.textContent = `
      .confetti-container {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        pointer-events: none;
        z-index: 1;
      }
      
      .confetti {
        position: absolute;
        top: -10px;
        border-radius: 0%;
        animation: confetti-fall 3s linear forwards;
      }
      
      @keyframes confetti-fall {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(100vh) rotate(720deg);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(confettiStyles);
  }

  // Add notification styles if not already in the document
  if (!document.getElementById('notification-styles')) {
    console.log('Adding notification styles');
    const notificationStyles = document.createElement('style');
    notificationStyles.id = 'notification-styles';
    notificationStyles.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        background-color: #333;
        color: white;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.3s, transform 0.3s;
        z-index: 1000;
      }
      
      .notification.show {
        opacity: 1;
        transform: translateY(0);
      }
      
      .notification.info {
        background-color: #3498db;
      }
      
      .notification.success {
        background-color: #2ecc71;
      }
      
      .notification.error {
        background-color: #e74c3c;
      }
    `;
    document.head.appendChild(notificationStyles);
  }

  // Add new helper functions for difficulty management
  function getCurrentDifficultyLevel(streak) {
    if (streak >= GAME_CONFIG.streakThresholds.expert) {
      return 'expert';
    } else if (streak >= GAME_CONFIG.streakThresholds.advanced) {
      return 'advanced';
    } else if (streak >= GAME_CONFIG.streakThresholds.intermediate) {
      return 'intermediate';
    }
    return 'beginner';
  }

  function getWordForDifficulty(words, difficulty) {
    const difficultyConfig = GAME_CONFIG.difficulty[difficulty];
    const [minLength, maxLength] = difficultyConfig.wordLengthRange;
    
    const appropriateWords = words.filter(word => {
      const length = word.length;
      return length >= minLength && length <= maxLength;
    });
    
    return appropriateWords.length > 0 
      ? appropriateWords[Math.floor(Math.random() * appropriateWords.length)]
      : words[Math.floor(Math.random() * words.length)];
  }

  // Add new function to update timer display with progress bar
  function updateTimerDisplay() {
    const difficulty = getCurrentDifficultyLevel(gameState.streak);
    const maxTime = GAME_CONFIG.difficulty[difficulty].timeLimit;
    const timeLeft = gameState.timer;
    const percentage = (timeLeft / maxTime) * 100;
    
    // Update timer text
    gameElements.timer.textContent = formatTime(timeLeft);
    
    // Update progress bar
    const progressBar = document.querySelector('.timer-progress');
    if (progressBar) {
      progressBar.style.width = `${percentage}%`;
      
      // Update color based on time remaining
      if (percentage > 60) {
        progressBar.style.backgroundColor = '#4CAF50';
      } else if (percentage > 30) {
        progressBar.style.backgroundColor = '#FFA500';
      } else {
        progressBar.style.backgroundColor = '#FF0000';
      }
    }
  }

  // Add new function for fetching word definitions
  async function fetchWordDefinition(word) {
    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
      const data = await response.json();
      
      if (data && data[0] && data[0].meanings && data[0].meanings[0]) {
        const definition = data[0].meanings[0].definitions[0].definition;
        return definition;
      }
      return 'Definition not found.';
    } catch (error) {
      console.error('Error fetching definition:', error);
      return 'Unable to fetch definition.';
    }
  }

  // Add function to update hearts display
  function updateHeartsDisplay() {
    const remainingLives = GAME_CONFIG.maxMistakes - gameState.mistakes;
    gameElements.hearts.forEach((heart, index) => {
      if (index < remainingLives) {
        heart.classList.remove('lost');
      } else {
        heart.classList.add('lost');
      }
    });
  }

  // Add function to update streak progress
  function updateStreakProgress() {
    const streakProgress = document.querySelector('.streak-progress');
    if (!streakProgress) return;
    
    const currentDifficulty = getCurrentDifficultyLevel(gameState.streak);
    const nextThreshold = GAME_CONFIG.streakThresholds[
      currentDifficulty === 'beginner' ? 'intermediate' :
      currentDifficulty === 'intermediate' ? 'advanced' :
      currentDifficulty === 'advanced' ? 'expert' : 'expert'
    ];
    
    const progress = (gameState.streak % (nextThreshold || GAME_CONFIG.streakThresholds.intermediate)) /
      (nextThreshold || GAME_CONFIG.streakThresholds.intermediate) * 100;
    
    streakProgress.style.width = `${progress}%`;
  }

  // Add accessibility control functions
  function toggleHighContrast() {
    gameState.highContrastMode = !gameState.highContrastMode;
    document.body.classList.toggle('high-contrast', gameState.highContrastMode);
    localStorage.setItem('hangman-high-contrast', gameState.highContrastMode);
  }

  function toggleFontSize() {
    gameState.largeFontMode = !gameState.largeFontMode;
    document.body.classList.toggle('large-font', gameState.largeFontMode);
    localStorage.setItem('hangman-large-font', gameState.largeFontMode);
  }

  // Add function to update difficulty display
  function updateDifficultyDisplay() {
    const difficultyElement = document.getElementById('currentDifficulty');
    if (difficultyElement) {
      const currentDifficulty = getCurrentDifficultyLevel(gameState.streak);
      difficultyElement.textContent = currentDifficulty.charAt(0).toUpperCase() + currentDifficulty.slice(1);
      difficultyElement.className = `difficulty-value ${currentDifficulty}`;
    }
  }

  // Initialize the game
  initGame();

  // Export functions for use in other modules
  window.startNextWord = startNextWord;
  window.resetGame = resetGame;
  window.closeModal = hideModal;
});

// For debugging purposes
window.onload = function() {
  console.log('Window loaded!');
}; 