// Vocabulary practice worksheet HTML generator

import { WorksheetData, VocabularyPracticeContent, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import {
  generateHeader,
  generateStudentInfo,
  generateFooter,
  generateActivitySection,
  generateVocabularyGrid,
  generateMultipleChoiceQuestion,
  generateFillInBlankQuestion
} from '../shared/components';
import { formatText, formatInstructions } from '../utils/content-formatter';
import { generateWordSearch, renderWordSearchHTML, generateWordSearchCSS } from '../../../../../utils/wordSearchGenerator';
import { generateCrosswordLayout } from '../../../../tools/crossword/utils/crosswordGenerator';
import { WordEntry } from '../../../../tools/crossword/types/crossword';

export async function generateVocabularyPracticeHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): Promise<string> {
  console.log('🎨 [VOCAB GENERATOR] Generating vocabulary practice HTML for worksheet:', worksheet.title);

  const content = (worksheet.rawContent || worksheet.content || {}) as VocabularyPracticeContent;
  const vocabularyItems = content.vocabulary_items || [];
  const exercises = content.exercises || [];
  const wordBank = content.word_bank || [];

  // Get the target language for instructions
  const targetLanguage = options.language === 'spanish' ? 'Spanish' :
                         options.language === 'french' ? 'French' :
                         options.language === 'german' ? 'German' : 'target language';

  const additionalStyles = `
    /* Import word search styles */
    ${generateWordSearchCSS()}

    /* Compact layout styles */
    .vocab-exercise {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 12px;
      page-break-inside: avoid;
    }

    .vocab-exercise-header {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      padding-bottom: 6px;
      border-bottom: 1px solid #e2e8f0;
    }

    /* Two-column layout for exercises */
    .exercises-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
    }

    .exercise-full-width {
      grid-column: 1 / -1;
    }

    .vocab-exercise-icon {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      color: white;
      font-size: 12px;
    }

    .vocab-exercise-title {
      font-size: 14px;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
    }

    .vocab-exercise-instructions {
      font-size: 11px;
      color: #64748b;
      margin-top: 2px;
    }

    .word-bank {
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 12px;
    }

    .word-bank-title {
      font-size: 12px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 6px;
    }

    .word-bank-items {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .word-bank-item {
      background: white;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      padding: 3px 8px;
      font-size: 11px;
      color: #374151;
      font-weight: 500;
    }

    .matching-exercise {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin: 15px 0;
    }

    .matching-column {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
    }

    .matching-column-title {
      font-weight: 600;
      color: #374151;
      margin-bottom: 12px;
      text-align: center;
      font-size: 14px;
    }

    .matching-item {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      margin-bottom: 8px;
      background: white;
      border-radius: 6px;
      border: 1px solid #e2e8f0;
      font-size: 13px;
    }

    .matching-number {
      background: #6366f1;
      color: white;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 11px;
      margin-right: 10px;
      flex-shrink: 0;
    }

    .translation-exercise {
      display: grid;
      gap: 12px;
      margin: 15px 0;
    }

    .translation-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 15px;
    }

    .translation-source {
      font-size: 14px;
      color: #374151;
      font-weight: 500;
    }

    .translation-arrow {
      color: #6366f1;
      font-size: 18px;
    }

    .translation-target {
      border-bottom: 1px solid #cbd5e1;
      min-height: 25px;
      padding: 5px 0;
    }

    /* Exercise specific colors */
    .exercise-1 .vocab-exercise-icon { background: linear-gradient(135deg, #ec4899, #f97316); }
    .exercise-2 .vocab-exercise-icon { background: linear-gradient(135deg, #8b5cf6, #6366f1); }
    .exercise-3 .vocab-exercise-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }
    .exercise-4 .vocab-exercise-icon { background: linear-gradient(135deg, #10b981, #059669); }
    .exercise-5 .vocab-exercise-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }

    @media print {
      .word-bank {
        border: 2px dashed #000 !important;
      }
      .translation-target {
        border-bottom: 1px solid #000 !important;
      }
    }

    @media (max-width: 768px) {
      .matching-exercise {
        grid-template-columns: 1fr;
      }
      .translation-item {
        grid-template-columns: 1fr;
        gap: 10px;
      }
      .translation-arrow {
        text-align: center;
      }
    }
  `;

  // Generate beautiful HTML content similar to the example
  let bodyContent = `
    <div class="worksheet-container max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 md:p-12">
      <h1 class="text-3xl md:text-4xl text-center font-bold text-sky-600 mb-8 border-b-2 pb-4 border-gray-200">
        ${worksheet.title || 'Vocabulary Practice'} 📚✨
      </h1>

      <!-- Header for Name and Date -->
      <div class="flex flex-col sm:flex-row justify-between mb-8 sm:mb-12">
        <p class="mb-4 sm:mb-0">
          <strong class="font-semibold text-gray-700">Name:</strong>
          <span class="info-field-line"></span>
        </p>
        <p>
          <strong class="font-semibold text-gray-700">Date:</strong>
          <span class="info-field-line"></span>
        </p>
      </div>
  `;

  // Vocabulary List (if provided)
  if (vocabularyItems.length > 0) {
    bodyContent += `
      <h2 class="text-2xl font-semibold text-sky-600 mb-4 border-b-2 pb-2 border-gray-200">
        Vocabulary List
      </h2>
      <div class="bg-sky-50 border-l-4 border-sky-500 rounded-lg p-6 mb-8">
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-x-12 list-none p-0">
          ${vocabularyItems.map(item => `
            <li class="py-1">
              <strong>${item.word}</strong> - ${item.translation}
            </li>
          `).join('')}
        </ul>
      </div>
      <hr>
    `;
  }

  // Generate exercises with compact styling
  bodyContent += `<div class="exercises-container">`;

  for (let index = 0; index < exercises.length; index++) {
    const exercise = exercises[index];
    const partNumber = index + 1;
    const isFullWidth = exercise.type === 'wordsearch' || exercise.type === 'crossword';

    bodyContent += `<section class="${isFullWidth ? 'exercise-full-width' : ''}">`;

    switch (exercise.type) {
      case 'matching':
        bodyContent += generateMatchingSection(exercise, partNumber);
        break;
      case 'fill-in-blank':
        bodyContent += generateFillInBlankSection(exercise, partNumber);
        break;
      case 'translation':
        bodyContent += generateTranslationSection(exercise, partNumber);
        break;
      case 'definition':
        bodyContent += generateMultipleChoiceSection(exercise, partNumber);
        break;
      case 'wordsearch':
        bodyContent += generateWordSearchSection(exercise, partNumber);
        break;
      case 'crossword':
        bodyContent += await generateCrosswordSection(exercise, partNumber);
        break;
      default:
        bodyContent += generateGenericSection(exercise, partNumber);
    }

    bodyContent += `</section>`;
  }

  // Close the exercises container and main container
  bodyContent += `</div></div>`;

  return createHTMLDocument(
    {
      title: worksheet.title || 'Vocabulary Practice',
      additionalStyles,
      additionalHead: `
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
      `
    },
    bodyContent
  );
}

// Beautiful section generators
function generateMatchingSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  return `
    <h2 class="text-2xl font-semibold text-sky-600 mb-4 border-b-2 pb-2 border-gray-200">
      Part ${partNumber}: ${exercise.title || 'Matching'}
    </h2>
    <p class="text-gray-600 mb-6">${exercise.instructions || 'Match the Spanish words with their English meanings by drawing a line or writing the letter in the blank.'}</p>

    <div class="grid grid-cols-[1fr_50px_1fr] md:grid-cols-[1fr_50px_1fr] gap-y-4 items-center">
      ${items.map((item, index) => `
        <div class="text-right pr-4">${index + 1}. ${item.word}</div>
        <input type="text" maxlength="1" class="border-b-2 border-gray-400 focus:border-sky-500 w-10 text-center text-lg p-1" placeholder="...">
        <div>${String.fromCharCode(65 + index)}. ${item.definition}</div>
      `).join('')}
    </div>
  `;
}

function generateFillInBlankSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  return `
    <h2 class="text-2xl font-semibold text-sky-600 mb-4 border-b-2 pb-2 border-gray-200">
      Part ${partNumber}: ${exercise.title || 'Fill in the Blanks'}
    </h2>
    <p class="text-gray-600 mb-6">${exercise.instructions || 'Complete each sentence with the correct Spanish word from the vocabulary list.'}</p>
    <ol class="list-decimal list-outside pl-6 space-y-4">
      ${items.map(item => `
        <li>${item.sentence.replace('_____', '<input type="text" class="border-b-2 border-gray-400 focus:border-sky-500 w-32 p-1">')}</li>
      `).join('')}
    </ol>
  `;
}

function generateTranslationSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  return `
    <h2 class="text-2xl font-semibold text-sky-600 mb-4 border-b-2 pb-2 border-gray-200">
      Part ${partNumber}: ${exercise.title || 'Translation Practice'}
    </h2>
    <p class="text-gray-600 mb-6">${exercise.instructions || 'Translate the following words from English to Spanish.'}</p>
    <ol class="list-decimal list-outside pl-6 space-y-4">
      ${items.map(item => `
        <li>${item.source} → <span class="info-field-line"></span></li>
      `).join('')}
    </ol>
  `;
}

function generateMultipleChoiceSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  return `
    <h2 class="text-2xl font-semibold text-sky-600 mb-4 border-b-2 pb-2 border-gray-200">
      Part ${partNumber}: ${exercise.title || 'Multiple Choice'}
    </h2>
    <p class="text-gray-600 mb-6">${exercise.instructions || 'Choose the best answer.'}</p>
    <ol class="list-decimal list-outside pl-6 space-y-6">
      ${items.map((item, index) => `
        <li>${item.question}
          <ul class="list-none pl-4 mt-2 space-y-2">
            ${item.options ? item.options.map((option: string, optIndex: number) => `
              <li><label><input type="radio" name="q${index + 1}" class="mr-2">${String.fromCharCode(97 + optIndex)}) ${option}</label></li>
            `).join('') : ''}
          </ul>
        </li>
      `).join('')}
    </ol>
  `;
}

function generateGenericSection(exercise: any, partNumber: number): string {
  return `
    <h2 class="text-2xl font-semibold text-sky-600 mb-4 border-b-2 pb-2 border-gray-200">
      Part ${partNumber}: ${exercise.title || 'Exercise'}
    </h2>
    <p class="text-gray-600 mb-6">${exercise.instructions || 'Complete the exercise below.'}</p>
    <div class="space-y-4">
      ${(exercise.items || []).map((item: any, index: number) => `
        <div class="p-4 bg-gray-50 rounded-lg">
          ${index + 1}. ${item.text || item.question || JSON.stringify(item)}
        </div>
      `).join('')}
    </div>
  `;
}

function generateMatchingExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No matching items available.</p>';

  const leftColumn = items.slice(0, Math.ceil(items.length / 2));
  const rightColumn = items.slice(Math.ceil(items.length / 2));

  return `
    <div class="matching-exercise">
      <div class="matching-column">
        <div class="matching-column-title">Words</div>
        ${leftColumn.map((item, index) => `
          <div class="matching-item">
            <div class="matching-number">${index + 1}</div>
            <div>${item.word || item.term || item}</div>
          </div>
        `).join('')}
      </div>
      <div class="matching-column">
        <div class="matching-column-title">Definitions</div>
        ${rightColumn.map((item, index) => `
          <div class="matching-item">
            <div class="matching-number">${String.fromCharCode(65 + index)}</div>
            <div>${item.definition || item.meaning || item}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function generateFillInBlankExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No fill-in-blank items available.</p>';

  return items.map((item, index) => {
    const sentence = item.sentence || item.text || item;
    return generateFillInBlankQuestion(index + 1, sentence);
  }).join('');
}

function generateTranslationExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No translation items available.</p>';

  return `
    <div class="translation-exercise">
      ${items.map((item, index) => `
        <div class="translation-item">
          <div class="translation-source">${index + 1}. ${item.source || item.word || item}</div>
          <div class="translation-arrow">→</div>
          <div class="translation-target"></div>
        </div>
      `).join('')}
    </div>
  `;
}

function generateDefinitionExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No definition items available.</p>';

  return items.map((item, index) => {
    const word = item.word || item.term || item;
    return generateFillInBlankQuestion(index + 1, `Define: <strong>${word}</strong>`);
  }).join('');
}

function generateGenericExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No exercise items available.</p>';

  return items.map((item, index) => {
    return generateFillInBlankQuestion(index + 1, item.question || item.text || item);
  }).join('');
}

function generateWordSearchSection(exercise: any, partNumber: number): string {
  const words = exercise.words || [];
  const gridSize = exercise.grid_size || 15;
  const difficulty = exercise.difficulty || 'medium';

  if (words.length === 0) {
    return `
      <div class="vocab-exercise exercise-full-width">
        <div class="vocab-exercise-header">
          <div class="vocab-exercise-icon" style="background: #8b5cf6;">
            <i data-lucide="search"></i>
          </div>
          <div>
            <h2 class="vocab-exercise-title">Part ${partNumber}: ${exercise.title || 'Word Search'}</h2>
            <p class="vocab-exercise-instructions">No words provided for word search.</p>
          </div>
        </div>
      </div>
    `;
  }

  try {
    // Generate actual word search puzzle
    const wordSearchData = generateWordSearch({
      words: words.slice(0, 15), // Limit to 15 words for readability
      gridSize,
      maxWords: Math.min(words.length, 15),
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    });

    const wordSearchHTML = renderWordSearchHTML(wordSearchData);

    return `
      <div class="vocab-exercise exercise-full-width">
        <div class="vocab-exercise-header">
          <div class="vocab-exercise-icon" style="background: #8b5cf6;">
            <i data-lucide="search"></i>
          </div>
          <div>
            <h2 class="vocab-exercise-title">Part ${partNumber}: ${exercise.title || 'Word Search'}</h2>
            <p class="vocab-exercise-instructions">${exercise.instructions || 'Find all the Spanish words hidden in the grid below.'}</p>
          </div>
        </div>
        ${wordSearchHTML}
      </div>
    `;
  } catch (error) {
    console.error('Error generating word search:', error);
    return `
      <div class="vocab-exercise exercise-full-width">
        <div class="vocab-exercise-header">
          <div class="vocab-exercise-icon" style="background: #8b5cf6;">
            <i data-lucide="search"></i>
          </div>
          <div>
            <h2 class="vocab-exercise-title">Part ${partNumber}: ${exercise.title || 'Word Search'}</h2>
            <p class="vocab-exercise-instructions">Word search puzzle could not be generated. Words to find: ${words.join(', ')}</p>
          </div>
        </div>
      </div>
    `;
  }
}

async function generateCrosswordSection(exercise: any, partNumber: number): Promise<string> {
  const words = exercise.words || [];
  const clues = exercise.clues || [];

  if (words.length === 0 && clues.length === 0) {
    return `
      <div class="vocab-exercise exercise-full-width">
        <div class="vocab-exercise-header">
          <div class="vocab-exercise-icon" style="background: #f59e0b;">
            <i data-lucide="grid-3x3"></i>
          </div>
          <div>
            <h2 class="vocab-exercise-title">Part ${partNumber}: ${exercise.title || 'Crossword Puzzle'}</h2>
            <p class="vocab-exercise-instructions">No words or clues provided for crossword.</p>
          </div>
        </div>
      </div>
    `;
  }

  try {
    // Convert words/clues to WordEntry format
    const wordEntries: WordEntry[] = [];

    if (clues.length > 0) {
      // Use provided clues
      clues.forEach((clue: any, index: number) => {
        const word = (clue.answer || clue.word || '').toUpperCase().replace(/[^A-Z]/g, '');
        if (word.length >= 3 && word.length <= 15) {
          wordEntries.push({
            id: `word-${index}`,
            word: word,
            clue: clue.clue || clue.definition || `Spanish word: ${word}`
          });
        }
      });
    } else if (words.length > 0) {
      // Generate simple clues from words, filter for crossword compatibility
      words.forEach((word: string, index: number) => {
        const cleanWord = word.toUpperCase().replace(/[^A-Z]/g, '');
        if (cleanWord.length >= 3 && cleanWord.length <= 15) {
          wordEntries.push({
            id: `word-${index}`,
            word: cleanWord,
            clue: `Spanish word: ${cleanWord}` // Simple fallback clue
          });
        }
      });
    }

    // Limit to 8 words for better crossword generation
    const limitedEntries = wordEntries.slice(0, 8);

    if (limitedEntries.length === 0) {
      throw new Error('No valid words for crossword generation');
    }

    // Generate crossword layout with more lenient settings
    const crosswordData = await generateCrosswordLayout(limitedEntries, {
      maxGridSize: 21,
      minGridSize: 10,
      maxAttempts: 200,
      allowDisconnected: true,
      prioritizeIntersections: true
    });

    if (!crosswordData) {
      throw new Error('Could not generate crossword layout');
    }

    // Render crossword grid
    const gridHTML = `
      <table class="crossword-grid" style="border-collapse: collapse; border: 2px solid #374151; margin: 0 auto;">
        ${crosswordData.grid.map(row => `
          <tr>
            ${row.map(cell => `
              <td class="crossword-cell ${cell.isBlack ? 'black' : 'white'}" style="
                width: 25px;
                height: 25px;
                border: 1px solid #d1d5db;
                text-align: center;
                vertical-align: middle;
                position: relative;
                background: ${cell.isBlack ? '#374151' : 'white'};
                font-family: monospace;
                font-size: 10px;
              ">
                ${cell.number ? `<span style="position: absolute; top: 1px; left: 2px; font-size: 8px;">${cell.number}</span>` : ''}
                ${!cell.isBlack ? '' : ''}
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </table>
    `;

    return `
      <div class="vocab-exercise exercise-full-width">
        <div class="vocab-exercise-header">
          <div class="vocab-exercise-icon" style="background: #f59e0b;">
            <i data-lucide="grid-3x3"></i>
          </div>
          <div>
            <h2 class="vocab-exercise-title">Part ${partNumber}: ${exercise.title || 'Crossword Puzzle'}</h2>
            <p class="vocab-exercise-instructions">${exercise.instructions || 'Complete the crossword using the Spanish vocabulary words.'}</p>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-6">
          <div>
            ${gridHTML}
          </div>
          <div>
            <div class="grid grid-cols-1 gap-4">
              ${crosswordData.acrossClues.length > 0 ? `
                <div>
                  <h3 style="font-weight: 600; margin-bottom: 6px; font-size: 14px;">Across:</h3>
                  <ol style="font-size: 12px; line-height: 1.4;">
                    ${crosswordData.acrossClues.map(clue => `<li>${clue.number}. ${clue.clue}</li>`).join('')}
                  </ol>
                </div>
              ` : ''}
              ${crosswordData.downClues.length > 0 ? `
                <div>
                  <h3 style="font-weight: 600; margin-bottom: 6px; font-size: 14px;">Down:</h3>
                  <ol style="font-size: 12px; line-height: 1.4;">
                    ${crosswordData.downClues.map(clue => `<li>${clue.number}. ${clue.clue}</li>`).join('')}
                  </ol>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error('Error generating crossword:', error);

    // Fallback: Create a simple word list exercise instead
    const fallbackWords = words.length > 0 ? words : clues.map((c: any) => c.answer || c.word).filter(Boolean);

    return `
      <div class="vocab-exercise exercise-full-width">
        <div class="vocab-exercise-header">
          <div class="vocab-exercise-icon" style="background: #f59e0b;">
            <i data-lucide="grid-3x3"></i>
          </div>
          <div>
            <h2 class="vocab-exercise-title">Part ${partNumber}: ${exercise.title || 'Vocabulary Exercise'}</h2>
            <p class="vocab-exercise-instructions">Complete the vocabulary exercise below.</p>
          </div>
        </div>

        <div class="fallback-exercise" style="padding: 20px;">
          <h3 style="font-weight: 600; margin-bottom: 12px;">Vocabulary Words:</h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px;">
            ${fallbackWords.slice(0, 10).map((word: string, index: number) => `
              <div style="padding: 12px; border: 1px solid #e5e7eb; border-radius: 6px; background: #f9fafb;">
                <strong>${index + 1}. ${word}</strong>
                <div style="margin-top: 8px; border-bottom: 1px solid #d1d5db; height: 20px;"></div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }
}
