// Crossword worksheet HTML generator

import { WorksheetData, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import { 
  generateHeader, 
  generateStudentInfo, 
  generateFooter, 
  generateActivitySection
} from '../shared/components';
import { formatText } from '../utils/content-formatter';

interface CrosswordContent {
  title?: string;
  grid?: Array<Array<{
    letter: string;
    isBlack: boolean;
    number?: number;
  }>>;
  acrossClues?: Array<{
    number: number;
    clue: string;
    answer: string;
  }>;
  downClues?: Array<{
    number: number;
    clue: string;
    answer: string;
  }>;
  gridSize?: {
    rows: number;
    cols: number;
  };
  instructions?: string;
}

export function generateCrosswordHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): string {
  console.log('🎨 [CROSSWORD GENERATOR] Generating crossword HTML for worksheet:', worksheet.title);

  const content = (worksheet.rawContent || worksheet.content || {}) as CrosswordContent;
  const grid = content.grid || [];
  const acrossClues = content.acrossClues || [];
  const downClues = content.downClues || [];
  const gridSize = content.gridSize || { rows: 15, cols: 15 };
  const instructions = content.instructions || 'Complete the crossword using the words below';

  const additionalStyles = `
    .crossword-container {
      display: flex;
      gap: 30px;
      margin: 20px 0;
      align-items: flex-start;
    }

    .crossword-grid {
      border-collapse: collapse;
      border: 2px solid #000;
      background: white;
      margin: 0 auto;
    }

    .crossword-cell {
      width: 30px;
      height: 30px;
      border: 1px solid #666;
      text-align: center;
      vertical-align: middle;
      position: relative;
      font-family: 'Courier New', monospace;
      font-weight: bold;
      font-size: 14px;
    }

    .crossword-cell.black {
      background-color: #000;
      border: 1px solid #000;
    }

    .crossword-cell.white {
      background-color: #fff;
    }

    .cell-number {
      position: absolute;
      top: 1px;
      left: 2px;
      font-size: 8px;
      font-weight: normal;
      color: #333;
      line-height: 1;
    }

    .clues-section {
      flex: 1;
      min-width: 300px;
    }

    .clues-column {
      margin-bottom: 25px;
    }

    .clues-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 2px solid #e2e8f0;
    }

    .clue-item {
      display: flex;
      margin-bottom: 8px;
      font-size: 14px;
      line-height: 1.4;
    }

    .clue-number {
      font-weight: 600;
      color: #374151;
      min-width: 25px;
      margin-right: 8px;
    }

    .clue-text {
      color: #4a5568;
      flex: 1;
    }

    .crossword-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .crossword-title {
      font-size: 24px;
      font-weight: 700;
      color: #2d3748;
      margin-bottom: 8px;
    }

    .crossword-instructions {
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
      font-size: 14px;
      color: #4a5568;
    }

    .grid-container {
      display: flex;
      justify-content: center;
      margin: 20px 0;
    }

    /* Responsive design */
    @media (max-width: 768px) {
      .crossword-container {
        flex-direction: column;
        gap: 20px;
      }
      
      .crossword-cell {
        width: 25px;
        height: 25px;
        font-size: 12px;
      }
      
      .cell-number {
        font-size: 7px;
      }
      
      .clues-section {
        min-width: auto;
      }
    }

    /* Print styles */
    @media print {
      .crossword-container {
        flex-direction: row;
        gap: 20px;
        page-break-inside: avoid;
      }
      
      .crossword-grid {
        border: 2px solid #000 !important;
      }
      
      .crossword-cell {
        border: 1px solid #000 !important;
        -webkit-print-color-adjust: exact;
        color-adjust: exact;
      }
      
      .crossword-cell.black {
        background-color: #000 !important;
      }
      
      .crossword-cell.white {
        background-color: #fff !important;
      }
      
      .clues-section {
        break-inside: avoid;
      }
      
      .clues-column {
        break-inside: avoid;
      }
    }

    /* Large grid adjustments */
    .large-grid .crossword-cell {
      width: 25px;
      height: 25px;
      font-size: 12px;
    }

    .large-grid .cell-number {
      font-size: 7px;
    }

    /* Small grid adjustments */
    .small-grid .crossword-cell {
      width: 35px;
      height: 35px;
      font-size: 16px;
    }

    .small-grid .cell-number {
      font-size: 9px;
    }
  `;

  let bodyContent = '';

  // Header
  bodyContent += generateHeader(worksheet.title || 'Crossword Puzzle', worksheet.subject, worksheet.topic);

  // Student Information
  bodyContent += generateStudentInfo();

  // Instructions
  bodyContent += `
    <div class="crossword-instructions">
      <div class="instructions-title">Instructions</div>
      <div>${formatText(instructions)}</div>
    </div>
  `;

  // Main crossword content
  if (grid.length > 0 && (acrossClues.length > 0 || downClues.length > 0)) {
    const gridSizeClass = gridSize.rows > 18 ? 'large-grid' : gridSize.rows < 12 ? 'small-grid' : '';
    
    bodyContent += `
      <div class="crossword-container">
        <div class="grid-container">
          <table class="crossword-grid ${gridSizeClass}">
            ${generateGridHTML(grid, gridSize)}
          </table>
        </div>
        <div class="clues-section">
          ${generateCluesHTML(acrossClues, downClues)}
        </div>
      </div>
    `;
  } else {
    // Fallback content if no crossword data
    bodyContent += `
      <div class="crossword-container">
        <div class="grid-container">
          <div style="text-align: center; padding: 40px; border: 2px dashed #cbd5e1; border-radius: 8px; color: #64748b;">
            <p style="font-size: 18px; margin-bottom: 10px;">Crossword Grid</p>
            <p style="font-size: 14px;">Grid will be generated based on vocabulary words</p>
          </div>
        </div>
        <div class="clues-section">
          <div class="clues-column">
            <h3 class="clues-title">Across</h3>
            <div style="color: #64748b; font-style: italic;">Clues will appear here</div>
          </div>
          <div class="clues-column">
            <h3 class="clues-title">Down</h3>
            <div style="color: #64748b; font-style: italic;">Clues will appear here</div>
          </div>
        </div>
      </div>
    `;
  }

  // Footer
  bodyContent += generateFooter();

  return createHTMLDocument(
    {
      title: worksheet.title || 'Crossword Puzzle',
      additionalStyles
    },
    bodyContent
  );
}

function generateGridHTML(
  grid: Array<Array<{ letter: string; isBlack: boolean; number?: number }>>,
  gridSize: { rows: number; cols: number }
): string {
  let html = '';
  
  for (let row = 0; row < gridSize.rows; row++) {
    html += '<tr>';
    for (let col = 0; col < gridSize.cols; col++) {
      const cell = grid[row]?.[col] || { letter: '', isBlack: true };
      const cellClass = cell.isBlack ? 'crossword-cell black' : 'crossword-cell white';
      
      html += `<td class="${cellClass}">`;
      
      if (!cell.isBlack) {
        if (cell.number) {
          html += `<span class="cell-number">${cell.number}</span>`;
        }
        // Empty cell for student to fill in
      }
      
      html += '</td>';
    }
    html += '</tr>';
  }
  
  return html;
}

function generateCluesHTML(
  acrossClues: Array<{ number: number; clue: string; answer: string }>,
  downClues: Array<{ number: number; clue: string; answer: string }>
): string {
  let html = '';
  
  // Across clues
  if (acrossClues.length > 0) {
    html += `
      <div class="clues-column">
        <h3 class="clues-title">Across</h3>
        ${acrossClues.map(clue => `
          <div class="clue-item">
            <span class="clue-number">${clue.number}.</span>
            <span class="clue-text">${clue.clue}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  // Down clues
  if (downClues.length > 0) {
    html += `
      <div class="clues-column">
        <h3 class="clues-title">Down</h3>
        ${downClues.map(clue => `
          <div class="clue-item">
            <span class="clue-number">${clue.number}.</span>
            <span class="clue-text">${clue.clue}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
  
  return html;
}
