// @ts-ignore
const WordSearch = require('@blex41/word-search');

export interface WordSearchGrid {
  grid: string[][];
  words: Array<{
    word: string;
    clean: string;
    path: Array<{ x: number; y: number }>;
  }>;
  size: { rows: number; cols: number };
}

export interface WordSearchOptions {
  words: string[];
  gridSize?: number;
  maxWords?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function generateWordSearch(options: WordSearchOptions): WordSearchGrid {
  const { words, gridSize = 15, maxWords = 15, difficulty = 'medium' } = options;

  // Clean words: remove spaces and special characters, convert to uppercase
  const cleanedWords = words
    .map(word => word
      .replace(/\s+/g, '') // Remove all spaces
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .toUpperCase()
      .replace(/[^A-Z]/g, '') // Keep only letters
    )
    .filter(word => word.length >= 3 && word.length <= 15); // Valid length

  console.log('🔍 [WORD SEARCH] Original words:', words);
  console.log('🔍 [WORD SEARCH] Cleaned words:', cleanedWords);

  // Configure difficulty settings
  let disabledDirections: string[] = [];
  let backwardsProbability = 0.3;

  switch (difficulty) {
    case 'easy':
      // Only horizontal and vertical, no backwards
      disabledDirections = ['NE', 'NW', 'SE', 'SW'];
      backwardsProbability = 0;
      break;
    case 'medium':
      // Allow diagonals, some backwards
      disabledDirections = [];
      backwardsProbability = 0.3;
      break;
    case 'hard':
      // All directions, more backwards
      disabledDirections = [];
      backwardsProbability = 0.5;
      break;
  }

  const wsOptions = {
    cols: gridSize,
    rows: gridSize,
    disabledDirections,
    dictionary: cleanedWords,
    maxWords,
    backwardsProbability,
    upperCase: true,
    diacritics: false,
    maxRetries: 20
  };

  const ws = new WordSearch(wsOptions);

  return {
    grid: ws.grid,
    words: ws.words,
    size: { rows: gridSize, cols: gridSize }
  };
}

export function renderWordSearchHTML(wordSearchData: WordSearchGrid): string {
  if (!wordSearchData || !wordSearchData.grid) {
    return '<p>Word search could not be generated.</p>';
  }

  return `
    <div class="word-search-container">
      <div class="word-search-puzzle">
        <table class="word-search-grid">
          ${wordSearchData.grid.map(row =>
            `<tr>${row.map(cell => `<td class="word-search-cell">${cell || '&nbsp;'}</td>`).join('')}</tr>`
          ).join('')}
        </table>
      </div>
      <div class="word-search-words">
        <h3 class="words-title">Words to Find:</h3>
        <div class="words-list">
          ${wordSearchData.words.map(wordObj => `<div class="word-item">${wordObj.word}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
}

export function generateWordSearchCSS(): string {
  return `
    .word-search-container {
      display: flex;
      gap: 20px;
      margin: 16px 0;
      align-items: flex-start;
    }

    .word-search-puzzle {
      flex: 1 1 auto;
      max-width: 320px;
    }

    .word-search-grid {
      border-collapse: collapse;
      border: 2px solid #374151;
      margin: 0 auto;
      background: white;
    }

    .word-search-cell {
      width: 22px;
      height: 22px;
      border: 1px solid #d1d5db;
      text-align: center;
      vertical-align: middle;
      font-family: 'Courier New', monospace;
      font-weight: 600;
      font-size: 12px;
      background: white;
    }

    .word-search-words {
      flex: 0 0 200px;
    }

    .words-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 10px;
      padding-bottom: 6px;
      border-bottom: 2px solid #007bff;
    }

    .words-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(120px, 1fr));
      gap: 8px;
    }

    .word-item {
      padding: 5px 10px;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      color: #374151;
      text-align: center;
    }

    @media (max-width: 768px) {
      .word-search-container {
        flex-direction: column;
        gap: 20px;
      }

      .word-search-cell {
        width: 20px;
        height: 20px;
        font-size: 12px;
      }

      .words-list {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media print {
      .word-search-grid {
        border: 2px solid #000 !important;
      }

      .word-search-cell {
        border: 1px solid #000 !important;
        background: white !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }

      .word-item {
        background: #f5f5f5 !important;
        border: 1px solid #ccc !important;
      }
    }
  `;
}




