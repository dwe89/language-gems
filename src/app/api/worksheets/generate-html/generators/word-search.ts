// Word search worksheet HTML generator

import { WorksheetData, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import { 
  generateHeader, 
  generateStudentInfo, 
  generateFooter
} from '../shared/components';
import { generateWordSearch, renderWordSearchHTML, generateWordSearchCSS } from '../../../../../utils/wordSearchGenerator';

interface WordSearchContent {
  word_search_words?: string[];
  words?: string[];
  word_search_difficulty?: 'easy' | 'medium' | 'hard';
  difficulty?: 'easy' | 'medium' | 'hard';
  instructions?: string;
}

export function generateWordSearchHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): string {
  console.log('🎨 [WORD SEARCH GENERATOR] Generating word search HTML for worksheet:', worksheet.title);

  const content = (worksheet.rawContent || worksheet.content || {}) as WordSearchContent;
  const words = content.word_search_words || content.words || [];
  const difficulty = content.word_search_difficulty || content.difficulty || 'medium';
  const instructions = content.instructions || 'Find all the hidden words in the puzzle below. Words can be horizontal, vertical, or diagonal.';

  console.log('🎨 [WORD SEARCH GENERATOR] Words:', words);
  console.log('🎨 [WORD SEARCH GENERATOR] Difficulty:', difficulty);

  const additionalStyles = `
    /* Import word search styles */
    ${generateWordSearchCSS()}

    /* Additional page styles */
    .page-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .page-header h1 {
      font-size: 12px;
      font-weight: 600;
      color: #64748b;
      margin: 0 0 8px 0;
      letter-spacing: 0.5px;
    }
    
    .page-header h2 {
      font-size: 24px;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    
    .student-info-inline {
      display: flex;
      gap: 40px;
      margin-bottom: 30px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e2e8f0;
    }
    
    .student-info-field {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
    }
    
    .student-info-field label {
      font-weight: 600;
      color: #475569;
      font-size: 14px;
    }
    
    .student-info-field .field-line {
      flex: 1;
      border-bottom: 1px solid #cbd5e1;
      height: 20px;
    }
    
    .instructions {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 30px;
      font-size: 14px;
      color: #4a5568;
    }
    
    .word-search-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 30px;
      margin: 40px 0;
    }
    
    .word-search-grid-container {
      display: flex;
      justify-content: center;
    }
    
    .word-search-grid {
      font-size: 18px !important;
      border: 3px solid #1e293b;
    }
    
    .word-search-grid td {
      width: 32px !important;
      height: 32px !important;
      font-size: 18px !important;
      font-weight: 600 !important;
    }
    
    .words-to-find {
      width: 100%;
      max-width: 800px;
    }
    
    .words-to-find h3 {
      font-size: 16px;
      font-weight: 700;
      color: #1e293b;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #3b82f6;
    }
    
    .words-grid {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 12px;
    }
    
    .word-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 12px;
      text-align: center;
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      text-transform: uppercase;
    }
  `;

  let bodyContent = '';

  // Centered Header
  bodyContent += `
    <div class="page-header">
      <h1>LanguageGems</h1>
      <h2>Word Search Puzzle</h2>
    </div>
  `;

  // Student Information - Inline
  bodyContent += `
    <div class="student-info-inline">
      <div class="student-info-field">
        <label>Name:</label>
        <div class="field-line"></div>
      </div>
      <div class="student-info-field">
        <label>Class:</label>
        <div class="field-line"></div>
      </div>
    </div>
  `;

  // Instructions
  bodyContent += `
    <div class="instructions">
      <strong>Instructions:</strong> ${instructions}
    </div>
  `;

  // Generate word search puzzle
  if (words.length > 0) {
    try {
      const wordSearch = generateWordSearch({
        words: words.slice(0, 15), // Limit to 15 words
        gridSize: 15,
        maxWords: Math.min(words.length, 15),
        difficulty
      });

      // Custom rendering with larger grid and word list in columns
      bodyContent += `
        <div class="word-search-section">
          <div class="word-search-grid-container">
            <table class="word-search-grid">
              ${wordSearch.grid.map(row => `
                <tr>
                  ${row.map(cell => `<td>${cell}</td>`).join('')}
                </tr>
              `).join('')}
            </table>
          </div>
          
          <div class="words-to-find">
            <h3>Words to Find:</h3>
            <div class="words-grid">
              ${wordSearch.words.map(wordObj => `
                <div class="word-item">${wordObj.word.toUpperCase()}</div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error('Error generating word search:', error);
      bodyContent += `
        <div style="padding: 20px; text-align: center; color: #64748b;">
          <p>Word search puzzle could not be generated. Words to find: ${words.join(', ')}</p>
        </div>
      `;
    }
  } else {
    // No words provided
    bodyContent += `
      <div style="padding: 20px; text-align: center; color: #64748b;">
        <p>No words provided for the word search puzzle.</p>
      </div>
    `;
  }

  // Footer
  bodyContent += generateFooter();

  return createHTMLDocument(
    {
      title: worksheet.title || 'Word Search Puzzle',
      additionalStyles
    },
    bodyContent
  );
}
