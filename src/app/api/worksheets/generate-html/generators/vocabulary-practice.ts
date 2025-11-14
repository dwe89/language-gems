// Vocabulary practice worksheet HTML generator

import { WorksheetData, VocabularyPracticeContent, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import { parseMaybeJSON } from '../utils/content-formatter';
import { generateWordSearch, renderWordSearchHTML, generateWordSearchCSS } from '../../../../../utils/wordSearchGenerator';
import { generateCrosswordLayout } from '../../../../tools/crossword/utils/crosswordGenerator';
import { WordEntry } from '../../../../tools/crossword/types/crossword';
import { PDF_BASE_STYLES, TYPOGRAPHY_STYLES, SPACING_STYLES, PRINT_STYLES } from '../shared/styles';

// Lazy load OpenAI to reduce initial bundle size
let openaiClient: any = null;
async function getOpenAIClient() {
  if (!openaiClient) {
    const OpenAI = (await import('openai')).default;
    openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiClient;
}

// Simple HTML escape helper for inserted clue text
function escapeHtml(input: string) {
  if (!input) return '';
  return input.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function generateVocabularyPracticeHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): Promise<string> {
  let content = (worksheet.rawContent || worksheet.content || {}) as VocabularyPracticeContent;
  content = parseMaybeJSON(content) as VocabularyPracticeContent;
  const vocabularyItems = content.vocabulary_items || [];
  const exercises = content.exercises || [];
  const wordBank = content.word_bank || [];

  const additionalStyles = `
    /* Import word search styles */
    ${generateWordSearchCSS()}

    /* Import shared styles */
    ${SPACING_STYLES}
    ${PDF_BASE_STYLES}
    ${TYPOGRAPHY_STYLES}
    ${PRINT_STYLES}

    /* ===== PDF-SAFE WORKSHEET STYLES ===== */

    :root {
      --puzzle-width: 280px;
    }

    /* Tighter spacing for title and container */
    .worksheet-container {
      /* Reduce top padding so title appears higher on the page */
      padding-top: 0.12in; /* was 0.25in in shared styles */
    }

    h1 {
      margin-top: 0.15rem; /* small positive space to avoid overlap with header */
      margin-bottom: 0.6rem;
    }

    .student-info-header {
      margin-top: 0.25rem;
    }

    /* Ensure PDF/print also uses tightened spacing (overrides PRINT_STYLES !important rules) */
    @media print {
      .worksheet-container {
        padding-top: 0.12in !important;
        padding-bottom: 0.12in !important;
      }

      h1 {
        margin-top: 0.15rem !important;
        margin-bottom: 0.6rem !important;
      }
    }

    /* Student Info Header */
    .student-info-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: var(--spacing-lg);
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 12pt;
    }

    .info-field {
      display: inline-block;
      border-bottom: 1px solid #000;
      width: 300px;
      margin-left: 8px;
    }

    /* Vocabulary & Word Bank Lists */
    .vocab-list,
    .word-bank {
      background: #f8f9fa;
      border: 1px solid #6c757d;
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: var(--spacing-lg);
      page-break-inside: avoid;
      color: #212529;
    }

    .vocab-list ul {
      list-style: none;
      padding: 0;
      margin: 0;
      column-count: 2;
      column-gap: 24px;
    }

    .vocab-list li {
      margin-bottom: 6px;
    }

    .word-bank {
      border-style: dashed;
      border-width: 2px;
    }

    .word-bank-items {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: flex-start;
    }

    .word-bank-item {
      background: #fff;
      border: 1px solid #ced4da;
      border-radius: 6px;
      padding: 6px 12px;
      font-size: 11pt;
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-weight: 500;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    /* Exercise Sections */
    .exercise-section {
      margin-top: var(--spacing-xl);
      padding-top: var(--spacing-lg);
      border-top: 1px solid #ccc;
      page-break-inside: avoid;
      break-inside: avoid;
    }

    .exercise-section:first-child {
      border-top: none;
      margin-top: 0;
    }

    .exercise-instructions {
      font-style: italic;
      color: #495057;
      margin-bottom: var(--spacing-lg);
      font-size: 11pt;
      line-height: 1.4;
    }

    /* Matching Exercise */
    .matching-columns {
      display: grid;
      grid-template-columns: repeat(2, minmax(240px, 1fr));
      gap: 12px;
      align-items: start;
      margin-top: 12px;
    }

    .matching-words-grid,
    .matching-definitions-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(110px, 1fr));
      gap: 8px;
      grid-auto-rows: 1fr; /* Make all rows the same height */
    }

    .matching-card {
      display: flex;
      align-items: center;
      gap: 8px;
      background: #fff;
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 6px 10px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.08);
      height: 100%; /* Fill grid cell */
    }

    .matching-index {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      font-weight: 700;
      font-size: 11pt;
      flex-shrink: 0;
    }

    .matching-card .matching-index {
      background: #007bff;
      color: #fff;
    }

    .matching-text {
      flex: 1 1 auto;
      text-align: left;
      font-size: 10.5pt;
      line-height: 1.3;
      text-transform: none;
    }

    .matching-card input {
      width: 42px;
      height: 32px;
      border: 2px solid #6c757d;
      border-radius: 6px;
      text-align: center;
      font-size: 13pt;
      font-weight: 600;
      padding: 2px;
      background: #f8f9fa;
    }

    .matching-definition-card {
      background: #f3f4f6;
      border: 1px solid #d1d5db;
      border-radius: 8px;
      padding: 6px 10px;
      display: flex;
      gap: 8px;
      align-items: flex-start;
      height: 100%; /* Fill grid cell */
    }

    .matching-definition-card .matching-index {
      background: #fff;
      color: #111827;
      border: 1px solid #cbd5e1;
    }

    /* Fill in the Blank */
    .fill-in-blank-input {
      border: none;
      border-bottom: 2px solid #000;
      width: 180px;
      margin: 0 6px;
      padding: 2px 4px;
      font-size: 1.1em;
      font-family: inherit;
      background: transparent;
      min-height: 1.2em;
    }

    /* Translation */
    .translation-line {
      display: inline-block;
      width: 200px;
      border-bottom: 1px solid #000;
      margin-left: 8px;
    }

    /* Unjumble Exercise */
    .unjumble-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(240px, 1fr));
      gap: 12px;
      margin: 10px 0;
    }

    .unjumble-card {
      background: #fff;
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 10px 12px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      gap: 4px; /* Reduced from 8px to 4px for tighter spacing */
    }

    .unjumble-scrambled {
      font-weight: 600;
      font-size: 11pt;
      line-height: 1.3;
      display: flex;
      gap: 6px;
      align-items: center;
      color: #dc2626;
      font-family: 'Courier New', monospace;
      letter-spacing: 1px;
    }

    .unjumble-scrambled .question-number {
      color: #007bff;
      font-weight: 700;
      font-family: 'Helvetica', 'Arial', sans-serif;
    }

    .unjumble-input-line {
      border-bottom: 2px solid #000;
      width: 100%;
      min-height: 1.4em;
      display: inline-block;
    }

    /* Multiple Choice */
    .multiple-choice-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(220px, 1fr));
      gap: 12px;
      margin: 10px 0;
    }

    .multiple-choice-card {
      background: #fff;
      border: 1px solid #ced4da;
      border-radius: 8px;
      padding: 8px 10px;
      box-shadow: 0 1px 2px rgba(0,0,0,0.08);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .multiple-choice-question {
      font-weight: 600;
      font-size: 10.5pt;
      line-height: 1.3;
      display: flex;
      gap: 6px;
      align-items: flex-start;
    }

    .multiple-choice-question .question-number {
      color: #007bff;
      font-weight: 700;
    }

    .multiple-choice-question .question-text {
      flex: 1 1 auto;
    }

    .multiple-choice-options {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .multiple-choice-option {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10pt;
      line-height: 1.3;
    }

    .choice-box {
      width: 14px;
      height: 14px;
      border: 2px solid #000;
      border-radius: 2px;
      flex-shrink: 0;
    }

    .choice-letter {
      font-weight: 600;
      text-transform: uppercase;
      flex-shrink: 0;
    }

    .choice-text {
      flex: 1 1 auto;
    }

    /* Word search words are now handled in the main layout */

    /* === CROSSWORD STYLES === */
    .crossword-container {
      page-break-inside: avoid;
      text-align: center;
      margin: 12px 0;
    }

    .crossword-grid {
      border-collapse: collapse;
      border: 2px solid #000;
      margin: 0 auto;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: var(--puzzle-width);
      height: var(--puzzle-width);
      table-layout: fixed;
    }

    .crossword-cell {
      border: 1px solid #adb5bd;
      text-align: center;
      vertical-align: middle;
      position: relative;
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-weight: 600;
      font-size: 10pt;
      width: calc(var(--puzzle-width) / var(--crossword-size, 14));
      height: calc(var(--puzzle-width) / var(--crossword-size, 14));
      padding: 0;
    }

    .crossword-cell.black {
      background: #000;
    }

    .crossword-cell.white {
      background: #fff;
    }

    .crossword-cell-number {
      position: absolute;
      top: 1px;
      left: 2px;
      font-size: 8pt;
      font-weight: 600;
    }

    .crossword-clues ol {
      font-size: 10pt;
      line-height: 1.4;
      margin: 0;
    }

    /* Slightly smaller instruction text for crossword to save vertical space */
    .crossword-container .exercise-instructions {
      font-size: 9.5pt;
      line-height: 1.25;
      margin-bottom: 8px;
    }

    /* === IMPROVED LAYOUT: WORD SEARCH AND CROSSWORD SIDE BY SIDE === */
    .wordsearch-crossword-layout {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 10px 0 12px 0;
      page-break-inside: avoid;
      align-items: start;
    }

    .wordsearch-crossword-left,
    .wordsearch-crossword-right {
      display: grid;
      grid-template-rows: auto auto 1fr auto; /* h2, instructions, puzzle, words-title section */
      gap: 0; /* remove gap - we'll control spacing per element */
      align-items: stretch;
    }

    /* Make the two part titles visually identical and aligned */
    .wordsearch-crossword-left h2,
    .wordsearch-crossword-right h2 {
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      margin: 0 0 6px 0;
      padding-bottom: 4px;
      border-bottom: 2px solid #000; /* black underline to match other sections */
      color: #000; /* black title text */
      text-align: center;
      -webkit-font-smoothing: antialiased;
    }

    .wordsearch-crossword-left p.exercise-instructions,
    .wordsearch-crossword-right p.exercise-instructions {
      font-style: italic;
      color: #495057;
      margin-bottom: 6px;
      line-height: 1.4;
      font-size: 11pt;
      background: transparent; /* keep consistent background */
      padding: 0;
    }

    /* Ensure containers don't add extra top spacing inside the side-by-side layout */
    .wordsearch-crossword-left > div,
    .wordsearch-crossword-right > .crossword-container {
      margin-top: 0 !important;
    }

    /* Force heading baseline/margins to be identical */
    .wordsearch-crossword-left h2,
    .wordsearch-crossword-right h2 {
      margin-top: 0;
      margin-bottom: 6px;
      line-height: 1.05;
    }

    /* Words / Clues title used under puzzles */
    .words-title {
      font-size: 13pt;
      font-weight: 700;
      color: #000 !important; /* black title text */
      margin: 0 0 8px 0;
      padding-bottom: 6px;
      border-bottom: 2px solid #000 !important; /* black underline full width */
      text-align: center;
      display: block;
      width: 100%;
    }

    .word-search-words {
      flex: 0 0 auto;
      margin-top: 12px; /* Add consistent top margin to push down from puzzle */
    }

    .word-search-words .words-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(90px, 1fr));
      gap: 8px;
      margin-top: 6px; /* reduce gap between title underline and items */
    }

    .word-search-words .word-item {
      font-size: 9pt;
      padding: 3px 6px;
    }

    .compact-section-title {
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-size: 13pt;
      font-weight: 700;
      margin: 0 0 6px 0;
      padding-bottom: 3px;
      border-bottom: 2px solid #007bff;
      color: #007bff;
    }

    .compact-instructions {
      font-style: italic;
      color: #495057;
      margin-bottom: 4px;
      line-height: 1.3;
      font-size: 9pt;
      background: #e9ecef;
      padding: 4px 8px;
      border-radius: 4px;
      border-left: 3px solid #007bff;
    }

    /* Word Search Layout */
    .word-search-container {
      margin: 0;
      text-align: center;
    }

    .word-search-container h2 {
      display: none; /* Hide main title, use compact one */
    }

    .word-search-container .exercise-instructions {
      display: none; /* Hide main instructions, use compact ones */
    }

    .word-search-grid {
      margin: 0 auto 10px auto !important;
      border: 2px solid #000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      width: var(--puzzle-width);
      height: var(--puzzle-width);
    }

    .word-search-grid table {
      border-collapse: collapse;
      border: 2px solid #000;
      width: 100%;
      height: 100%;
      table-layout: fixed;
    }

    .word-search-grid td {
      border: 1px solid #adb5bd;
      text-align: center;
      vertical-align: middle;
      font-family: 'Helvetica', 'Arial', sans-serif;
      font-weight: 600;
      font-size: 10pt;
      background: #fff;
      width: calc(var(--puzzle-width) / 14);
      height: calc(var(--puzzle-width) / 14);
      padding: 0;
    }

    /* Word search words are now styled inline in the HTML */

    /* Crossword Layout */
    .crossword-container {
      margin: 12px 0;
      page-break-inside: avoid;
      text-align: center;
    }

    .crossword-container h2 {
      display: block; /* Show title for consistent styling */
    }

      .words-title {
        font-size: 13pt;
        font-weight: 700;
        color: #000; /* black title text */
        margin: 0 0 8px 0;
        padding-bottom: 6px;
        border-bottom: 2px solid #000; /* black underline */
        text-align: center;
      }

    .crossword-container .exercise-instructions {
      display: block; /* Show instructions for consistent styling */
    }

    .crossword-grid-wrapper {
      margin: 0 auto 10px auto;
      max-width: fit-content;
    }

    .crossword-grid {
      margin: 0;
      border: 2px solid #000;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }

    .crossword-cell-number {
      font-size: 8pt;
      font-weight: 700;
      color: #495057;
    }

    /* Clues Layout */
    .compact-clues-wrapper {
      text-align: left;
    }

    .compact-clues-wrapper h4 {
      font-size: 11pt;
      font-weight: 600;
      margin: 12px 0 6px 0;
      color: #333;
    }

    .compact-clues-wrapper ol {
      font-size: 9pt;
      line-height: 1.4;
      margin: 0;
      padding-left: 20px;
    }

    .compact-clues-wrapper li {
      margin-bottom: 4px;
    }

    /* Reduce spacing everywhere */
    h1 {
      /* Force single-line titles: responsive size and no-wrap with ellipsis */
      font-size: clamp(16pt, 4.5vw, 20pt);
      margin: 0 0 8px 0;
      padding-bottom: 4px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-font-smoothing: antialiased;
    }

    h2 {
      font-size: 12pt;
      margin: 0 0 6px 0;
      padding-bottom: 3px;
    }

    .student-info-header {
      margin-bottom: 10px;
      font-size: 10pt;
    }

    .vocab-list,
    .word-bank {
      padding: 10px 14px;
      margin-bottom: 12px;
    }

    .vocab-list h3,
    .word-bank h3 {
      font-size: 11pt;
      margin-bottom: 4px;
    }

    .vocab-list ul {
      column-gap: 12px;
    }

    .vocab-list li {
      margin-bottom: 2px;
      font-size: 9pt;
    }

    .exercise-section {
      margin-top: 10px;
      padding-top: 6px;
    }

    .exercise-instructions {
      margin-bottom: 8px;
      font-size: 9pt;
    }

    ol, ul {
      padding-left: 16px;
      margin: 0 0 6px 0;
    }

    li {
      margin-bottom: 3px;
      font-size: 9pt;
    }

    .wordsearch-crossword-layout {
      display: grid;
      grid-template-columns: repeat(2, minmax(300px, 1fr));
      gap: 18px;
      margin: 14px 0 18px 0;
      align-items: start;
    }

    .compact-section-title {
      font-size: 12pt;
      margin: 0 0 6px 0;
      padding-bottom: 3px;
    }

    .compact-instructions {
      margin-bottom: 6px;
      font-size: 9pt;
      padding: 4px 8px;
    }
    
    /* Ensure the puzzle areas are visually the same width */
    .wordsearch-crossword-left .word-search-puzzle,
    .wordsearch-crossword-right .crossword-grid-wrapper {
      max-width: var(--puzzle-width);
      margin: 0 auto;
    }

    /* Clues styled as chips to match 'Words to Find' */
    .clues-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 2px solid #007bff;
    }

    .clues-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(120px, 1fr));
      gap: 8px;
      margin-top: 8px;
    }

    .clue-item {
      padding: 6px 10px;
      background: #f3f4f6;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 500;
      color: #374151;
      display: -webkit-box;
      gap: 8px;
      align-items: center;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.3;
    }

    .clue-number {
      background: white;
      border: 1px solid #d1d5db;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      color: #111827;
      font-size: 11px;
    }

    /* Sentence Unscramble Styles */
    .unscramble-container {
      margin: 12px 0;
    }

    .unscramble-item {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
      align-items: flex-start;
    }

    .unscramble-item .question-number {
      color: #007bff;
      font-weight: 700;
      font-size: 11pt;
      flex-shrink: 0;
    }

    .unscramble-content {
      flex: 1 1 auto;
    }

    .scrambled-words {
      font-weight: 600;
      font-size: 10.5pt;
      color: #dc2626;
      font-family: 'Courier New', monospace;
      margin-bottom: 6px;
    }

    .unscramble-answer-line {
      border-bottom: 2px solid #000;
      width: 100%;
      min-height: 1.6em;
      margin-top: 4px;
    }

    /* Tense Detective Styles */
    .tense-detective-container {
      margin: 12px 0;
    }

    .tense-detective-item {
      display: flex;
      gap: 10px;
      margin-bottom: 14px;
      align-items: flex-start;
    }

    .tense-detective-item .question-number {
      color: #007bff;
      font-weight: 700;
      font-size: 11pt;
      flex-shrink: 0;
    }

    .tense-detective-content {
      flex: 1 1 auto;
    }

    .instruction-text {
      font-weight: 500;
      font-size: 10.5pt;
      margin-bottom: 6px;
    }

    .tense-detective-answer-line {
      border-bottom: 2px solid #000;
      width: 100%;
      min-height: 1.6em;
      margin-top: 4px;
    }

    /* Print styles - repeat header on every page */
    @media print {
      .worksheet-header-repeat {
        display: block;
        position: running(header);
      }

        /* Reduce the printed page header space - keep minimal for PDF */
        @page {
          /* Small top margin to allow header area but not create huge blank space */
          margin-top: 4mm;
          @top-center {
            content: element(header);
          }
        }

        /* Fallback for browsers that don't support running headers - hide by default for worksheets */
        .page-header {
          display: none; /* hide the fallback fixed header in PDFs to avoid large reserved space */
        }

        .worksheet-container {
          margin-top: 6mm; /* small offset to account for any header spacing */
        }
    }
  `;

  // Generate clean, professional HTML content
  let bodyContent = `
    <!-- Repeating header for print -->
    <div class="page-header" style="display: none;">
      <div style="font-size: 10pt; font-weight: 600; text-align: center;">
        ${worksheet.title || 'Vocabulary Practice'} - <span style="font-weight: normal;">Name: ________________</span>
      </div>
    </div>

    <div class="worksheet-container">
      <h1>${worksheet.title || 'Vocabulary Practice'}</h1>

      <div class="student-info-header">
        <div class="student-info-field">
          <strong>Name:</strong>
          <span class="info-field"></span>
        </div>
        <div class="student-info-field">
          <strong>Date:</strong>
          <span class="info-field"></span>
        </div>
      </div>
  `;

  // Word Bank removed - vocabulary list serves the same purpose

  // Vocabulary List (if provided)
  if (vocabularyItems.length > 0) {
    // Use 3 columns if there are many words (30+), 2 columns for medium (15-29), 1 column for few
    const columnCount = vocabularyItems.length >= 30 ? 3 : vocabularyItems.length >= 15 ? 2 : 1;
    
    bodyContent += `
      <div class="vocab-list">
        <h3><i data-lucide="BookOpen" class="icon"></i> Vocabulary List</h3>
        <ul style="column-count: ${columnCount}; column-gap: 24px;">
          ${vocabularyItems.map((item: any) => `
            <li style="break-inside: avoid;">
              <strong>${item.word}</strong> - ${item.translation}
            </li>
          `).join('')}
        </ul>
      </div>
    `;
  }

  // Generate exercises with compact styling
  bodyContent += `<div class="exercises-container">`;

  // First pass: separate word search and crossword from other exercises
  let wordSearchExercise = null;
  let crosswordExercise = null;
  const otherExercises = [];

  console.log('[VOCAB PRACTICE] Processing exercises:', exercises.length);
  for (const exercise of exercises) {
    console.log('[VOCAB PRACTICE] Exercise type:', exercise.type, 'title:', exercise.title);
    console.log('[VOCAB PRACTICE] Exercise instructions:', exercise.instructions);

    if (exercise.type === 'wordsearch') {
      wordSearchExercise = exercise;
    } else if (exercise.type === 'crossword' ||
               (exercise.title && (
                 exercise.title.toLowerCase().includes('crossword') ||
                 exercise.title.toLowerCase().includes('vocabulary words') ||
                 exercise.title.toLowerCase().includes('complete the crossword')
               )) ||
               (exercise.instructions && (
                 exercise.instructions.toLowerCase().includes('crossword')
               ))) {
      crosswordExercise = exercise;
  console.log('[VOCAB PRACTICE] Detected crossword exercise:', exercise.title);
    } else {
      otherExercises.push(exercise);
    }
  }

  console.log('[VOCAB PRACTICE] Word search found:', !!wordSearchExercise);
  console.log('[VOCAB PRACTICE] Crossword found:', !!crosswordExercise);

  // If we have both word search and crossword, render them in the improved layout
  if (wordSearchExercise && crosswordExercise) {
    const wordSearchHTML = generateWordSearchSection(wordSearchExercise, 1);
  const crosswordHTML = await generateCrosswordSection(crosswordExercise, 2, { compact: true }, vocabularyItems);

    bodyContent += `
      <!-- Top section: Word search and crossword side by side -->
      <div class="wordsearch-crossword-layout">
        <div class="wordsearch-crossword-left">
          ${wordSearchHTML}
        </div>
        <div class="wordsearch-crossword-right">
          ${crosswordHTML}
        </div>
      </div>
    `;
  } else {
    // Render individually if only one exists
    if (wordSearchExercise) {
      bodyContent += `<section class="exercise-section">`;
      bodyContent += generateWordSearchSection(wordSearchExercise, 1);
      bodyContent += `</section>`;
    }
    if (crosswordExercise) {
      bodyContent += `<section class="exercise-section">`;
  bodyContent += await generateCrosswordSection(crosswordExercise, 2, {}, vocabularyItems);
      bodyContent += `</section>`;
    }
  }

  // Render other exercises
  let partNumber = 3;
  for (const exercise of otherExercises) {
    bodyContent += `<section class="exercise-section">`;

    switch (exercise.type) {
      case 'matching':
        bodyContent += generateMatchingSection(exercise, partNumber);
        break;
      case 'fill-in-blank':
      case 'fillBlanks': // Handle both naming conventions
        bodyContent += generateFillInBlankSection(exercise, partNumber);
        break;
      case 'translation':
        bodyContent += generateTranslationSection(exercise, partNumber);
        break;
      case 'definition':
        bodyContent += generateMultipleChoiceSection(exercise, partNumber);
        break;
      case 'unjumble':
        bodyContent += generateUnjumbleSection(exercise, partNumber);
        break;
      // sentence-unscramble and tenseDetective removed - these are reading-comprehension specific exercises
      default:
        bodyContent += generateGenericSection(exercise, partNumber);
    }

    bodyContent += `</section>`;
    partNumber++;
  }

  // Close the exercises container and main container
  bodyContent += `</div></div>`;

  return createHTMLDocument(
    {
      title: worksheet.title || 'Vocabulary Practice',
      additionalStyles,
      additionalHead: `
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      `
    },
    bodyContent
  );
}

function shuffleArray<T>(input: T[]): T[] {
  const array = input.slice();
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Scrambles a word by shuffling its letters while ensuring:
 * 1. The scrambled version is different from the original
 * 2. It's actually solvable (not random gibberish)
 * 3. Preserves spaces and special characters in their positions
 */
function scrambleWord(word: string): string {
  if (!word || word.length <= 2) return word; // Too short to scramble meaningfully
  
  // Clean the word - remove articles and trim
  let cleanWord = word.trim();
  const lowerWord = cleanWord.toLowerCase();
  
  // Remove common articles for scrambling
  const articles = ['el ', 'la ', 'los ', 'las ', 'un ', 'una ', 'the '];
  for (const article of articles) {
    if (lowerWord.startsWith(article)) {
      cleanWord = cleanWord.substring(article.length);
      break;
    }
  }
  
  // Extract only letters to scramble (preserve accents, ñ, etc.)
  const letters = cleanWord.split('');
  const letterIndices: number[] = [];
  const letterChars: string[] = [];
  
  letters.forEach((char, index) => {
    // Include letters and accented characters, exclude spaces and hyphens
    if (char.match(/[a-záéíóúñüA-ZÁÉÍÓÚÑÜ]/)) {
      letterIndices.push(index);
      letterChars.push(char);
    }
  });
  
  if (letterChars.length <= 2) return cleanWord; // Not enough letters to scramble
  
  // Shuffle the letters multiple times until we get something different
  let scrambledLetters = [...letterChars];
  let attempts = 0;
  const maxAttempts = 10;
  
  do {
    scrambledLetters = shuffleArray(letterChars);
    attempts++;
  } while (
    scrambledLetters.join('') === letterChars.join('') && 
    attempts < maxAttempts
  );
  
  // Reconstruct the word with scrambled letters in their positions
  const result = letters.slice();
  letterIndices.forEach((originalIndex, i) => {
    result[originalIndex] = scrambledLetters[i];
  });
  
  return result.join('').toUpperCase(); // Return in uppercase for visibility
}

// --- Clean Section Generators ---

function generateMatchingSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';
  const words = items.map((it: any) => ({ word: it.word, definition: it.definition }));
  const definitions = words.map((w: any) => w.definition);

  const shuffledDefs: string[] = shuffleArray(definitions) as string[];

  const wordCards = words.map((it: any, index: number) => `
        <div class="matching-card">
          <div class="matching-index">${index + 1}</div>
          <div class="matching-text">${escapeHtml(it.word)}</div>
          <input type="text" maxlength="1" aria-label="Answer for ${escapeHtml(it.word)}" />
        </div>
      `).join('');

  const definitionCards = shuffledDefs.map((def: string, idx: number) => `
        <div class="matching-definition-card">
          <div class="matching-index">${String.fromCharCode(65 + idx)}</div>
          <div class="matching-text">${escapeHtml(def)}</div>
        </div>
      `).join('');

  return `
    <h2><i data-lucide="Link" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Matching Exercise'}</h2>
    <p class="exercise-instructions">${exercise.instructions || 'Match each word with the correct definition (write the letter).'} </p>
    <div class="matching-columns">
      <div class="matching-words-grid">
        ${wordCards}
      </div>
      <div class="matching-definitions-grid">
        ${definitionCards}
      </div>
    </div>
  `;
}

function generateFillInBlankSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  return `
    <h2><i data-lucide="Edit" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Fill in the Blanks'}</h2>
    <p class="exercise-instructions">${exercise.instructions || 'Complete each sentence with the correct word from the vocabulary list.'}</p>
    <ol>
      ${items.map((item: any) => `
        <li>${item.sentence.replace(/_____/g, '<input type="text" class="fill-in-blank-input">')}</li>
      `).join('')}
    </ol>
  `;
}

function generateTranslationSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  // Use 3 columns if there are many words (20+), 2 columns for medium (10-19), 1 column for few
  const columnCount = items.length >= 20 ? 3 : items.length >= 10 ? 2 : 1;

  return `
    <h2><i data-lucide="Globe" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Translation Practice'}</h2>
    <p class="exercise-instructions">${exercise.instructions || 'Translate the following words.'}</p>
    <ol style="column-count: ${columnCount}; column-gap: 24px;">
      ${items.map((item: any) => `
        <li style="break-inside: avoid; margin-bottom: 12px;">${item.word || item.source || item.text} → <span class="translation-line" style="width: 200px;"></span></li>
      `).join('')}
    </ol>
  `;
}

function generateMultipleChoiceSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  // LIMIT TO MAX 8 ITEMS to fit on one page with other exercises
  const limitedItems = items.slice(0, 8);

  const cards = limitedItems.map((item: any, index: number) => {
    const originalOptions = Array.isArray(item.options) ? item.options.filter(Boolean) : [];
    const explicitCorrect = item.answer || item.correct_answer || item.correctAnswer;
    const correctOption = explicitCorrect || originalOptions[0];

    const remainingPool = correctOption
      ? originalOptions.filter((option: string) => option !== correctOption)
      : originalOptions.slice();

    const selected = correctOption
      ? [correctOption, ...shuffleArray(remainingPool).slice(0, 2)]
      : shuffleArray(remainingPool).slice(0, 3);

    const uniqueSelected = Array.from(new Set(selected.filter(Boolean)));

    let finalOptions = shuffleArray(uniqueSelected).slice(0, 3);

    if (correctOption && !finalOptions.includes(correctOption)) {
      finalOptions.pop();
      finalOptions.push(correctOption);
      finalOptions = shuffleArray(finalOptions);
    }

    const optionsHTML = finalOptions.length === 0
      ? `<div class="multiple-choice-option"><span class="choice-text">No options provided.</span></div>`
      : finalOptions.map((option: string, optIndex: number) => `
          <div class="multiple-choice-option">
            <span class="choice-box"></span>
            <span class="choice-letter">${String.fromCharCode(65 + optIndex)}</span>
            <span class="choice-text">${escapeHtml(option)}</span>
          </div>
        `).join('');

    return `
      <div class="multiple-choice-card">
        <div class="multiple-choice-question">
          <span class="question-number">${index + 1}.</span>
          <span class="question-text">${escapeHtml(item.question || '')}</span>
        </div>
        <div class="multiple-choice-options">
          ${optionsHTML}
        </div>
      </div>
    `;
  }).join('');

  return `
    <h2><i data-lucide="Edit3" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Multiple Choice'}</h2>
    <p class="exercise-instructions">${exercise.instructions || 'Choose the best answer.'}</p>
    <div class="multiple-choice-grid">
      ${cards}
    </div>
  `;
}

function generateUnjumbleSection(exercise: any, partNumber: number): string {
  const items = exercise.items || [];
  if (items.length === 0) return '';

  const cards = items.map((item: any, index: number) => {
    // Get the correct word from various possible properties
    const correctWord = item.correct || item.word || item.answer || '';
    
    // Use AI-provided scrambled version if it exists and looks valid,
    // otherwise generate our own scramble
    let scrambled = item.scrambled || '';
    
    // Validate AI scrambled version - check if it's just random characters
    // or doesn't contain the same letters as the original word
    const isValidScramble = (original: string, scrambledVersion: string): boolean => {
      if (!scrambledVersion || scrambledVersion === original) return false;
      
      // Remove articles and clean both strings for comparison
      const cleanOriginal = original.toLowerCase().replace(/^(el |la |los |las |un |una |the )/i, '').replace(/[^a-záéíóúñü]/g, '').split('').sort().join('');
      const cleanScrambled = scrambledVersion.toLowerCase().replace(/[^a-záéíóúñü]/g, '').split('').sort().join('');
      
      // Check if they contain the same letters (when sorted)
      return cleanOriginal === cleanScrambled && cleanScrambled.length > 0;
    };
    
    // If AI scramble is invalid, generate our own
    if (!isValidScramble(correctWord, scrambled)) {
      scrambled = scrambleWord(correctWord);
    }

    return `
      <div class="unjumble-card">
        <div class="unjumble-scrambled">
          <span class="question-number">${index + 1}.</span>
          <span>${escapeHtml(scrambled)}</span>
        </div>
        <span class="unjumble-input-line"></span>
      </div>
    `;
  }).join('');

  return `
    <h2><i data-lucide="Shuffle" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Word Unjumble'}</h2>
    <p class="exercise-instructions">${exercise.instructions || 'Unscramble the letters to form the correct Spanish word.'}</p>
    <div class="unjumble-grid">
      ${cards}
    </div>
  `;
}

// generateSentenceUnscrambleSection removed - reading-comprehension specific exercise
// generateTenseDetectiveSection removed - reading-comprehension specific exercise

function generateGenericSection(exercise: any, partNumber: number): string {
  return `
    <h2><i data-lucide="List" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Exercise'}</h2>
    <p class="exercise-instructions">${exercise.instructions || 'Complete the exercise below.'}</p>
    <ol>
      ${(exercise.items || []).map((item: any, index: number) => `
        <li>
          ${item.text || item.question || JSON.stringify(item)}
          <br>
          <span class="translation-line" style="width: 100%; margin-left: 0;"></span>
        </li>
      `).join('')}
    </ol>
  `;
}

function generateWordSearchSection(exercise: any, partNumber: number): string {
  const rawWords = Array.isArray(exercise.words) ? exercise.words : [];
  const difficulty = exercise.difficulty || 'medium';

  const normalizedWords: string[] = rawWords
    .map((word: string) => (word || '').trim())
    .filter(Boolean);

  if (normalizedWords.length === 0) {
    return '';
  }

  const uniqueWords: string[] = Array.from(new Set<string>(normalizedWords));
  // Limit word search to a maximum of 12 words to keep puzzles compact and fit on the page
  const limitedWords: string[] = uniqueWords.slice(0, Math.min(uniqueWords.length, 12));

  // Force 14x14 grid - with smaller puzzle-width this will fit on first page
  const gridSize = 14;

  try {
    const wordSearchData = generateWordSearch({
      words: limitedWords,
      gridSize,
      maxWords: limitedWords.length,
      difficulty: difficulty as 'easy' | 'medium' | 'hard'
    });

    // FORCE the grid to be exactly 14x14 by trimming or padding
    const actualGrid = wordSearchData.grid || [];
    const forcedGrid = Array.from({ length: 14 }, (_, rowIndex) => {
      const sourceRow = actualGrid[rowIndex] || [];
      return Array.from({ length: 14 }, (_, colIndex) => sourceRow[colIndex] || '-');
    });

    // Custom render to ensure 12x12
    const wordSearchHTML = `
      <div class="word-search-puzzle">
        <table class="word-search-grid">
          ${forcedGrid.map(row =>
            `<tr>${row.map(cell => `<td>${cell || '&nbsp;'}</td>`).join('')}</tr>`
          ).join('')}
        </table>
      </div>
      <div class="word-search-words">
  <h3 class="words-title">Words to Find:</h3>
        <div class="words-list">
          ${(wordSearchData.words || []).map((wordObj: any) => 
            `<div class="word-item" style="padding: 3px 6px; background: #f3f4f6; border-radius: 6px; font-size: 9pt; font-weight: 500; color: #374151;">${wordObj.word || wordObj}</div>`
          ).join('')}
        </div>
      </div>
    `;

    return `
      <div style="text-align: center;">
        <h2><i data-lucide="Search" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Word Search'}</h2>
        <p class="exercise-instructions">${exercise.instructions || 'Find all the words hidden in the grid below.'}</p>
        ${wordSearchHTML}
      </div>
    `;
  } catch (error) {
    console.error('Error generating word search:', error);
    return '';
  }
}

async function generateCrosswordSection(
  exercise: any,
  partNumber: number,
  options: { compact?: boolean } = {},
  vocabularyItems: any[] = []
): Promise<string> {
  const isCompact = options.compact === true;
  const words = exercise.words || [];
  const clues = exercise.clues || {};
  const items = exercise.items || [];

  console.log('[CROSSWORD] Processing exercise:', exercise.title);
  console.log('[CROSSWORD] Words:', words);
  console.log('[CROSSWORD] Clues:', clues);
  console.log('[CROSSWORD] Items:', items);

  // Handle different clue structures
  let allClues: any[] = [];
  if (Array.isArray(clues)) {
    allClues = clues;
  } else if (clues.across || clues.down) {
    allClues = [...(clues.across || []), ...(clues.down || [])];
  }

  // If we have items (like fill-in-the-blank exercises), treat them as crossword clues
  if (items.length > 0 && (words.length === 0 || allClues.length === 0)) {
  console.log('[CROSSWORD] Converting items to crossword format');
    allClues = items.map((item: any, index: number) => ({
      number: index + 1,
      clue: item.question || item.text || `Item ${index + 1}`,
      answer: item.answer || item.word || '',
      word: item.answer || item.word || ''
    }));
  }

  // If still missing, attempt to populate from provided vocabularyItems
  if (words.length === 0 && allClues.length === 0 && vocabularyItems && vocabularyItems.length > 0) {
    console.log('[CROSSWORD] No words/clues provided - populating from vocabularyItems');
    allClues = vocabularyItems.map((v: any, i: number) => ({
      number: i + 1,
      clue: v.translation || v.definition || `Meaning: ${v.translation || v.word || ''}`,
      answer: v.word || '',
      word: v.word || ''
    }));
  }

  if (words.length === 0 && allClues.length === 0) {
    return `
      <h2><i data-lucide="Puzzle" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Crossword Puzzle'}</h2>
      <p class="exercise-instructions">No words or clues provided for crossword.</p>
    `;
  }

  try {
    // Convert words/clues to WordEntry format
    const wordEntries: WordEntry[] = [];

    if (allClues.length > 0) {
      // Use provided clues
      allClues.forEach((clue: any, index: number) => {
        const rawWord = clue.answer || clue.word || '';
        const normalizedWord = rawWord
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Remove accents
          .toUpperCase()
          .replace(/[^A-Z]/g, ''); // Remove non-letters

        if (normalizedWord.length >= 3 && normalizedWord.length <= 15) {
          // Attempt to improve clue by using the vocabulary list's translation if clue is missing
          let clueText = clue.clue || clue.definition || '';
          if (!clueText) {
            const lookup = vocabularyItems.find((v: any) => (v.word || '').toUpperCase().replace(/[^A-Z]/g,'') === normalizedWord);
            if (lookup && lookup.translation) clueText = `Meaning: ${lookup.translation}`;
          }
          if (!clueText) clueText = `Word: ${rawWord}`;

          wordEntries.push({
            id: `word-${index}`,
            word: normalizedWord,
            clue: clueText
          });
        }
      });
    } else if (words.length > 0) {
      // Generate simple clues from words
      words.forEach((word: string, index: number) => {
        const normalizedWord = word
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toUpperCase()
          .replace(/[^A-Z]/g, '');

        if (normalizedWord.length >= 3 && normalizedWord.length <= 15) {
          // Try to use vocabulary list translation for better clues
          const lookup = vocabularyItems.find((v: any) => (v.word || '').toUpperCase().replace(/[^A-Z]/g,'') === normalizedWord);
          const clueText = lookup && lookup.translation ? `Meaning: ${lookup.translation}` : `Word: ${word}`;

          wordEntries.push({
            id: `word-${index}`,
            word: normalizedWord,
            clue: clueText
          });
        }
      });
    }

    // Limit to 8 words for better crossword generation
    const limitedEntries = wordEntries.slice(0, 8);

    if (limitedEntries.length === 0) {
      throw new Error('No valid words for crossword generation');
    }

    // Generate the crossword layout
    // Attempt to improve clues via the GPT Nano API when available
    try {
      const client = await getOpenAIClient();
      const aiPrompt = `Generate short, one-line descriptive clues in English for the following Spanish vocabulary words. **Clues must be very concise, ideally under 60 characters.** Return JSON array of objects with keys 'word' and 'clue'. Use the exact uppercase word form as provided. Example: [{"word":"BICICLETA","clue":"Two-wheeled vehicle without motor."}]\n\nWords:\n${limitedEntries.map(e => e.word + (e.clue ? ` — current clue: ${e.clue}` : '')).join('\n')}`;

      const aiResponse = await client.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [{ role: 'user', content: aiPrompt }],
        max_completion_tokens: 300
      });

      const aiText = aiResponse.choices?.[0]?.message?.content || '';
      try {
        const parsed = JSON.parse(aiText);
        if (Array.isArray(parsed)) {
          parsed.forEach((p: any) => {
            const match = limitedEntries.find(le => le.word === (p.word || '').toUpperCase());
            if (match && p.clue) match.clue = p.clue;
          });
        }
      } catch (err) {
        // ignore parse errors, we'll fall back to existing clues
      }
    } catch (err: any) {
      // If AI call fails, continue with existing clues silently
      console.warn('[CROSSWORD] GPT clue generation failed:', err && err.message ? err.message : err);
    }

    const crosswordData = await generateCrosswordLayout(limitedEntries, {
      maxAttempts: 12,
      maxGridSize: 14,
      minGridSize: 14
    });

    if (!crosswordData) {
      throw new Error('Crossword generation failed');
    }

    // Render crossword grid - 14x14 with smaller puzzle-width fits on first page
    const targetSize = 14;
    const paddedGrid = Array.from({ length: targetSize }, (_, rowIndex) => {
      const sourceRow = crosswordData.grid[rowIndex] || [];
      return Array.from({ length: targetSize }, (_, colIndex) => sourceRow[colIndex] || { isBlack: true, letter: '' });
    });

    const gridHTML = `
      <table class="crossword-grid" data-rows="${targetSize}" data-cols="${targetSize}" style="--crossword-size: ${targetSize};">
        ${paddedGrid.map(row => `
          <tr>
            ${row.map(cell => `
              <td class="crossword-cell ${cell.isBlack ? 'black' : 'white'}"${(!cell.isBlack && cell.letter) ? ` data-letter="${escapeHtml(cell.letter)}"` : ''}>
                ${cell.number ? `<span class="crossword-cell-number">${cell.number}</span>` : ''}
                ${!cell.isBlack ? '&nbsp;' : ''}
              </td>
            `).join('')}
          </tr>
        `).join('')}
      </table>
    `;

    // ** IMPROVED HTML STRUCTURE WITH CLUES (styled like Word Search 'Words to Find') **
    const cluesHTML = `
      <div class="word-search-words">
  <h3 class="words-title">Clues</h3>
        <div class="words-list">
          ${crosswordData.acrossClues.map((clue: any) => `<div class="word-item">${clue.number}. ${escapeHtml(clue.clue)}</div>`).join('')}
          ${crosswordData.downClues.map((clue: any) => `<div class="word-item">${clue.number}. ${escapeHtml(clue.clue)}</div>`).join('')}
        </div>
      </div>
    `;

    // Shorter default instructions and match compact title style color/bottom border to Word Search
    const heading = isCompact ? `
      <h2><i data-lucide="Puzzle" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Crossword Puzzle'}</h2>
      <p class="exercise-instructions">${exercise.instructions || 'Complete the crossword using the words below'}</p>
    ` : `
      <h2><i data-lucide="Puzzle" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Crossword Puzzle'}</h2>
      <p class="exercise-instructions">${exercise.instructions || 'Complete the crossword using the words below'}</p>
    `;

    return `
      <div class="crossword-container">
        ${heading}
        <div class="crossword-grid-wrapper">
          ${gridHTML}
        </div>
        ${cluesHTML}
      </div>
    `;
  } catch (error) {
    console.log('[CROSSWORD] Generation failed, creating fallback crossword:', error);

    // Fallback: Create a proper crossword grid with clues
    const fallbackWords = words.length > 0 ? words : allClues.map((c: any) => c.answer || c.word).filter(Boolean);

    // Create a proper crossword grid
  const gridSize = 14;
    const gridHTML = `
  <table class="crossword-grid" data-rows="${gridSize}" data-cols="${gridSize}" style="--crossword-size: ${gridSize};">
        ${Array(gridSize).fill(0).map(() => `
          <tr>
            ${Array(gridSize).fill(0).map(() => `
              <td class="crossword-cell white">&nbsp;</td>
            `).join('')}
          </tr>
        `).join('')}
      </table>
    `;

    const cluesHTML = `
      <div class="word-search-words">
  <h3 class="words-title">Clues</h3>
        <div class="words-list">
          ${fallbackWords.slice(0, 4).map((word: string, index: number) => `
            <div class="word-item">${index + 1}. ${escapeHtml(word)}</div>
          `).join('')}
          ${fallbackWords.slice(4, 8).map((word: string, index: number) => `
            <div class="word-item">${index + 5}. ${escapeHtml(word)}</div>
          `).join('')}
        </div>
      </div>
    `;

    const heading = isCompact ? `
      <h2><i data-lucide="Puzzle" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Crossword Puzzle'}</h2>
      <p class="exercise-instructions">${exercise.instructions || 'Complete the crossword.'}</p>
    ` : `
      <h2><i data-lucide="Puzzle" class="icon"></i> Part ${partNumber}: ${exercise.title || 'Crossword Puzzle'}</h2>
      <p class="exercise-instructions">${exercise.instructions || 'Complete the crossword.'}</p>
    `;

    return `
      <div class="crossword-container">
        ${heading}
        <div class="crossword-grid-wrapper">
          ${gridHTML}
        </div>
        ${cluesHTML}
      </div>
    `;
  }
}