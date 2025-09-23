// Advanced crossword generation algorithm

import { 
  WordEntry, 
  CrosswordData, 
  PlacedWord, 
  GridCell, 
  CrosswordClue,
  GenerationOptions,
  WordPlacement,
  IntersectionPoint,
  GenerationState,
  GridBounds
} from '../types/crossword';

const DEFAULT_OPTIONS: GenerationOptions = {
  maxGridSize: 21,
  minGridSize: 15,
  maxAttempts: 1000,
  allowDisconnected: false,
  prioritizeIntersections: true,
};

export async function generateCrosswordLayout(
  words: WordEntry[],
  options: GenerationOptions = {}
): Promise<CrosswordData | null> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  if (words.length < 3) {
    throw new Error('At least 3 words are required to generate a crossword');
  }

  // Clean and validate words
  const cleanWords = words
    .filter(w => w.word.trim() && w.clue.trim())
    .map(w => ({
      ...w,
      word: w.word.toUpperCase().replace(/[^A-Z]/g, '')
    }))
    .filter(w => w.word.length >= 3 && w.word.length <= 15);

  if (cleanWords.length < 3) {
    throw new Error('Not enough valid words (minimum 3 words, 3-15 letters each)');
  }

  // Sort words by length (longer words first) and frequency of common letters
  const sortedWords = cleanWords.sort((a, b) => {
    const aScore = a.word.length + getLetterFrequencyScore(a.word);
    const bScore = b.word.length + getLetterFrequencyScore(b.word);
    return bScore - aScore;
  });

  // Try multiple generation attempts
  for (let attempt = 0; attempt < opts.maxAttempts!; attempt++) {
    try {
      const result = await generateSingleAttempt(sortedWords, opts);
      if (result && result.placedWords.length >= Math.min(3, cleanWords.length)) {
        return result;
      }
    } catch (error) {
      console.warn(`Generation attempt ${attempt + 1} failed:`, error);
    }
  }

  // If all attempts failed, try with relaxed constraints
  console.log('Trying with relaxed constraints...');
  const relaxedOptions = {
    ...opts,
    allowDisconnected: true,
    prioritizeIntersections: false,
  };

  return await generateSingleAttempt(sortedWords.slice(0, 8), relaxedOptions);
}

async function generateSingleAttempt(
  words: WordEntry[],
  options: GenerationOptions
): Promise<CrosswordData | null> {
  const gridSize = options.maxGridSize!;
  const centerRow = Math.floor(gridSize / 2);
  const centerCol = Math.floor(gridSize / 2);

  const state: GenerationState = {
    grid: Array(gridSize).fill(null).map(() => Array(gridSize).fill(null)),
    placedWords: [],
    availableWords: [...words],
    intersections: [],
    bounds: {
      minRow: centerRow,
      maxRow: centerRow,
      minCol: centerCol,
      maxCol: centerCol,
    },
    wordNumber: 1,
  };

  // Place the first word horizontally in the center
  const firstWord = state.availableWords.shift()!;
  const firstStartCol = centerCol - Math.floor(firstWord.word.length / 2);
  
  if (!placeWord(state, firstWord, centerRow, firstStartCol, 'across')) {
    throw new Error('Could not place first word');
  }

  // Place remaining words
  while (state.availableWords.length > 0 && state.placedWords.length < 15) {
    const bestPlacement = findBestWordPlacement(state, options);
    
    if (!bestPlacement) {
      if (options.allowDisconnected && state.placedWords.length >= 3) {
        // Try to place a disconnected word
        const disconnectedPlacement = findDisconnectedPlacement(state);
        if (disconnectedPlacement) {
          const { word, row, col, direction } = disconnectedPlacement;
          const wordEntry = state.availableWords.find(w => w.word === word);
          if (wordEntry && placeWord(state, wordEntry, row, col, direction)) {
            state.availableWords = state.availableWords.filter(w => w.word !== word);
            continue;
          }
        }
      }
      break; // No more valid placements
    }

    const { word, row, col, direction } = bestPlacement;
    const wordEntry = state.availableWords.find(w => w.word === word);
    
    if (wordEntry && placeWord(state, wordEntry, row, col, direction)) {
      state.availableWords = state.availableWords.filter(w => w.word !== word);
    } else {
      break;
    }
  }

  if (state.placedWords.length < 3) {
    return null;
  }

  return createCrosswordData(state, gridSize);
}

function placeWord(
  state: GenerationState,
  wordEntry: WordEntry,
  row: number,
  col: number,
  direction: 'across' | 'down'
): boolean {
  const word = wordEntry.word;
  
  // Check if placement is valid
  if (!isValidPlacement(state.grid, word, row, col, direction)) {
    return false;
  }

  // Place the word
  for (let i = 0; i < word.length; i++) {
    const currentRow = direction === 'across' ? row : row + i;
    const currentCol = direction === 'across' ? col + i : col;
    state.grid[currentRow][currentCol] = word[i];
  }

  // Add to placed words
  const placedWord: PlacedWord = {
    word,
    clue: wordEntry.clue,
    startRow: row,
    startCol: col,
    direction,
    number: state.wordNumber++,
    length: word.length,
  };
  
  state.placedWords.push(placedWord);

  // Update bounds
  updateBounds(state.bounds, row, col, word.length, direction);

  return true;
}

function isValidPlacement(
  grid: (string | null)[][],
  word: string,
  row: number,
  col: number,
  direction: 'across' | 'down'
): boolean {
  const gridSize = grid.length;

  // Check bounds
  if (direction === 'across') {
    if (col + word.length > gridSize || row < 0 || row >= gridSize) return false;
  } else {
    if (row + word.length > gridSize || col < 0 || col >= gridSize) return false;
  }

  // Check each position
  for (let i = 0; i < word.length; i++) {
    const currentRow = direction === 'across' ? row : row + i;
    const currentCol = direction === 'across' ? col + i : col;
    const currentLetter = word[i];
    const existingLetter = grid[currentRow][currentCol];

    if (existingLetter !== null && existingLetter !== currentLetter) {
      return false; // Conflict
    }

    // Check perpendicular neighbors to avoid adjacent parallel words
    if (existingLetter === null) {
      if (direction === 'across') {
        // Check above and below
        if ((grid[currentRow - 1]?.[currentCol] !== null && grid[currentRow - 1]?.[currentCol] !== undefined) ||
            (grid[currentRow + 1]?.[currentCol] !== null && grid[currentRow + 1]?.[currentCol] !== undefined)) {
          // Only allow if this creates a valid intersection
          const hasValidIntersection = 
            (i > 0 && grid[currentRow][currentCol - 1] !== null) ||
            (i < word.length - 1 && grid[currentRow][currentCol + 1] !== null);
          if (!hasValidIntersection) return false;
        }
      } else {
        // Check left and right
        if ((grid[currentRow]?.[currentCol - 1] !== null && grid[currentRow]?.[currentCol - 1] !== undefined) ||
            (grid[currentRow]?.[currentCol + 1] !== null && grid[currentRow]?.[currentCol + 1] !== undefined)) {
          // Only allow if this creates a valid intersection
          const hasValidIntersection = 
            (i > 0 && grid[currentRow - 1]?.[currentCol] !== null) ||
            (i < word.length - 1 && grid[currentRow + 1]?.[currentCol] !== null);
          if (!hasValidIntersection) return false;
        }
      }
    }
  }

  // Check that the word doesn't extend existing words
  if (direction === 'across') {
    if ((col > 0 && grid[row][col - 1] !== null) || 
        (col + word.length < gridSize && grid[row][col + word.length] !== null)) {
      return false;
    }
  } else {
    if ((row > 0 && grid[row - 1][col] !== null) || 
        (row + word.length < gridSize && grid[row + word.length][col] !== null)) {
      return false;
    }
  }

  return true;
}

function findBestWordPlacement(
  state: GenerationState,
  options: GenerationOptions
): WordPlacement | null {
  let bestPlacement: WordPlacement | null = null;
  let bestScore = -1;

  for (const wordEntry of state.availableWords) {
    const word = wordEntry.word;
    
    // Find all possible intersections with placed words
    for (const placedWord of state.placedWords) {
      const intersections = findIntersections(word, placedWord.word);
      
      for (const intersection of intersections) {
        // Try both directions
        for (const direction of ['across', 'down'] as const) {
          if (direction === placedWord.direction) continue; // Must be perpendicular
          
          const placement = calculatePlacement(
            word,
            placedWord,
            intersection,
            direction
          );
          
          if (placement && isValidPlacement(state.grid, word, placement.row, placement.col, direction)) {
            const score = scorePlacement(state, word, placement.row, placement.col, direction);
            if (score > bestScore) {
              bestScore = score;
              bestPlacement = {
                word,
                row: placement.row,
                col: placement.col,
                direction,
                intersections: [intersection],
              };
            }
          }
        }
      }
    }
  }

  return bestPlacement;
}

function findIntersections(word1: string, word2: string) {
  const intersections = [];
  
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i] === word2[j]) {
        intersections.push({
          letter: word1[i],
          word1: word1,
          word1Position: i,
          word2: word2,
          word2Position: j,
          row: 0, // Will be calculated later
          col: 0, // Will be calculated later
        });
      }
    }
  }
  
  return intersections;
}

function calculatePlacement(
  newWord: string,
  placedWord: PlacedWord,
  intersection: any,
  newDirection: 'across' | 'down'
) {
  const { word1Position, word2Position } = intersection;
  
  if (newDirection === 'across') {
    // New word goes across, placed word is vertical
    const row = placedWord.startRow + word2Position;
    const col = placedWord.startCol - word1Position;
    return { row, col };
  } else {
    // New word goes down, placed word is horizontal
    const row = placedWord.startRow - word1Position;
    const col = placedWord.startCol + word2Position;
    return { row, col };
  }
}

function scorePlacement(
  state: GenerationState,
  word: string,
  row: number,
  col: number,
  direction: 'across' | 'down'
): number {
  let score = 0;
  
  // Prefer longer words
  score += word.length * 2;
  
  // Prefer placements that create multiple intersections
  let intersectionCount = 0;
  for (let i = 0; i < word.length; i++) {
    const currentRow = direction === 'across' ? row : row + i;
    const currentCol = direction === 'across' ? col + i : col;
    if (state.grid[currentRow]?.[currentCol] !== null) {
      intersectionCount++;
    }
  }
  score += intersectionCount * 10;
  
  // Prefer placements closer to center
  const centerRow = Math.floor(state.grid.length / 2);
  const centerCol = Math.floor(state.grid[0].length / 2);
  const distanceFromCenter = Math.abs(row - centerRow) + Math.abs(col - centerCol);
  score -= distanceFromCenter;
  
  return score;
}

function findDisconnectedPlacement(state: GenerationState): WordPlacement | null {
  // Simple implementation: try to place a word in an empty area
  const gridSize = state.grid.length;
  const word = state.availableWords[0]?.word;
  
  if (!word) return null;
  
  // Try to place in various positions
  for (let row = 2; row < gridSize - 2; row += 3) {
    for (let col = 2; col < gridSize - word.length - 2; col += 3) {
      if (isValidPlacement(state.grid, word, row, col, 'across')) {
        return { word, row, col, direction: 'across', intersections: [] };
      }
    }
  }
  
  return null;
}

function updateBounds(
  bounds: GridBounds,
  row: number,
  col: number,
  length: number,
  direction: 'across' | 'down'
) {
  bounds.minRow = Math.min(bounds.minRow, row);
  bounds.minCol = Math.min(bounds.minCol, col);
  
  if (direction === 'across') {
    bounds.maxRow = Math.max(bounds.maxRow, row);
    bounds.maxCol = Math.max(bounds.maxCol, col + length - 1);
  } else {
    bounds.maxRow = Math.max(bounds.maxRow, row + length - 1);
    bounds.maxCol = Math.max(bounds.maxCol, col);
  }
}

function createCrosswordData(state: GenerationState, originalGridSize: number): CrosswordData {
  // Trim the grid to actual bounds with padding
  const padding = 1;
  const minRow = Math.max(0, state.bounds.minRow - padding);
  const maxRow = Math.min(originalGridSize - 1, state.bounds.maxRow + padding);
  const minCol = Math.max(0, state.bounds.minCol - padding);
  const maxCol = Math.min(originalGridSize - 1, state.bounds.maxCol + padding);
  
  const rows = maxRow - minRow + 1;
  const cols = maxCol - minCol + 1;
  
  // Create the final grid
  const grid: GridCell[][] = Array(rows).fill(null).map(() =>
    Array(cols).fill(null).map(() => ({
      letter: '',
      isBlack: true,
    }))
  );

  // Fill the grid and adjust word positions
  const adjustedWords: PlacedWord[] = [];

  for (const word of state.placedWords) {
    const adjustedWord: PlacedWord = {
      ...word,
      startRow: word.startRow - minRow,
      startCol: word.startCol - minCol,
    };
    adjustedWords.push(adjustedWord);
  }

  // Assign proper crossword numbers based on grid position
  // First, collect all starting positions
  const startPositions: Array<{
    row: number;
    col: number;
    words: PlacedWord[];
  }> = [];

  // Group words by their starting positions
  const positionMap = new Map<string, PlacedWord[]>();

  for (const word of adjustedWords) {
    const key = `${word.startRow}-${word.startCol}`;
    if (!positionMap.has(key)) {
      positionMap.set(key, []);
    }
    positionMap.get(key)!.push(word);
  }

  // Convert to array and sort by position (top-to-bottom, left-to-right)
  for (const [key, words] of positionMap.entries()) {
    const [row, col] = key.split('-').map(Number);
    startPositions.push({ row, col, words });
  }

  startPositions.sort((a, b) => {
    if (a.row !== b.row) return a.row - b.row;
    return a.col - b.col;
  });

  // Assign numbers sequentially based on sorted positions
  let currentNumber = 1;
  const numberMap = new Map<string, number>();

  for (const position of startPositions) {
    const key = `${position.row}-${position.col}`;
    numberMap.set(key, currentNumber);

    // Update all words at this position with the same number
    for (const word of position.words) {
      word.number = currentNumber;
    }

    currentNumber++;
  }

  // Fill grid cells for all words
  for (const word of adjustedWords) {
    for (let i = 0; i < word.word.length; i++) {
      const row = word.startRow + (word.direction === 'down' ? i : 0);
      const col = word.startCol + (word.direction === 'across' ? i : 0);

      grid[row][col] = {
        letter: word.word[i],
        isBlack: false,
        number: i === 0 ? word.number : undefined,
        isStart: i === 0,
        belongsToWords: grid[row][col].belongsToWords
          ? [...grid[row][col].belongsToWords!, word.number]
          : [word.number],
      };
    }
  }

  // Create clues
  const acrossClues: CrosswordClue[] = [];
  const downClues: CrosswordClue[] = [];

  for (const word of adjustedWords) {
    const clue: CrosswordClue = {
      number: word.number,
      clue: word.clue,
      answer: word.word,
      direction: word.direction,
    };

    if (word.direction === 'across') {
      acrossClues.push(clue);
    } else {
      downClues.push(clue);
    }
  }

  // Sort clues by number
  acrossClues.sort((a, b) => a.number - b.number);
  downClues.sort((a, b) => a.number - b.number);

  // Calculate intersections
  let intersectionCount = 0;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!grid[row][col].isBlack && grid[row][col].belongsToWords && grid[row][col].belongsToWords!.length > 1) {
        intersectionCount++;
      }
    }
  }

  return {
    grid,
    placedWords: adjustedWords,
    acrossClues,
    downClues,
    gridSize: { rows, cols },
    stats: {
      totalWords: state.availableWords.length + adjustedWords.length,
      placedWords: adjustedWords.length,
      intersections: intersectionCount,
    },
  };
}

function getLetterFrequencyScore(word: string): number {
  // Common letters in English get higher scores
  const commonLetters = 'ETAOINSHRDLCUMWFGYPBVKJXQZ';
  let score = 0;
  
  for (const letter of word) {
    const index = commonLetters.indexOf(letter);
    if (index !== -1) {
      score += (commonLetters.length - index) / commonLetters.length;
    }
  }
  
  return score / word.length;
}
