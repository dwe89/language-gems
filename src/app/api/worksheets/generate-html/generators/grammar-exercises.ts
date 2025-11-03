// Grammar exercises worksheet HTML generator

import { WorksheetData, GrammarExerciseContent, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import {
  generateHeader,
  generateStudentInfo,
  generateFooter,
  generateActivitySection,
  generateFillInBlankQuestion,
  generateMultipleChoiceQuestion,
  generateInstructions
} from '../shared/components';
import { PDF_BASE_STYLES, TYPOGRAPHY_STYLES, SPACING_STYLES, PRINT_STYLES } from '../shared/styles';
import { CANVA_FRIENDLY_STYLES } from '../shared/canva-styles';
import { formatText, formatInstructions, formatLanguage, formatAnswerKey } from '../utils/content-formatter';

export function generateGrammarExercisesHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): string {
  console.log('🎨 [GRAMMAR GENERATOR] Generating grammar exercises HTML for worksheet:', worksheet.title);
  console.log('🎨 [GRAMMAR GENERATOR] Canva-friendly mode:', options.canvaFriendly || false);
  console.log('📊 [GRAMMAR GENERATOR] Worksheet data keys:', Object.keys(worksheet));
  console.log('📊 [GRAMMAR GENERATOR] worksheet.content:', typeof worksheet.content, Array.isArray(worksheet.content) ? 'Array' : 'Object');
  console.log('📊 [GRAMMAR GENERATOR] worksheet.rawContent:', typeof worksheet.rawContent, worksheet.rawContent ? Object.keys(worksheet.rawContent) : 'N/A');
  console.log('📊 [GRAMMAR GENERATOR] worksheet.metadata:', worksheet.metadata);

  const content = (worksheet.rawContent || worksheet.content || {}) as GrammarExerciseContent;
  console.log('📊 [GRAMMAR GENERATOR] Extracted content keys:', Object.keys(content));
  console.log('📊 [GRAMMAR GENERATOR] content.exercises:', Array.isArray(content.exercises), content.exercises?.length || 0);
  
  const metadata = worksheet.metadata || {};
  const grammarFocusMeta = metadata.grammarFocus;
  const grammarTopic = (Array.isArray(grammarFocusMeta) ? grammarFocusMeta.join(', ') : grammarFocusMeta) || content.grammar_topic || 'Grammar Practice';
  const explanation = content.explanation || '';
  const examples = content.examples || [];
  const exercises = content.exercises || [];
  
  console.log('📊 [GRAMMAR GENERATOR] Final exercises array length:', exercises.length);
  if (exercises.length > 0) {
    console.log('📊 [GRAMMAR GENERATOR] First exercise:', JSON.stringify(exercises[0], null, 2));
  }
  
  const instructionsText = worksheet.instructions || content.instructions || 'Complete the grammar exercises below.';

  // Get the target language for instructions
  const detectedLanguage = metadata.targetLanguage || worksheet.language || worksheet.subject || options.language || 'target language';
  const targetLanguage = formatLanguage(typeof detectedLanguage === 'string' ? detectedLanguage : 'target language');

  const difficultyLabel = metadata.difficulty || worksheet.difficulty || options.difficulty || 'Intermediate';

  const grammarSummary = `
    <div class="worksheet-meta">
      <div class="meta-chip">
        <span class="meta-label">Focus</span>
        <span class="meta-value">${grammarTopic}</span>
      </div>
      <div class="meta-chip">
        <span class="meta-label">Target Language</span>
        <span class="meta-value">${targetLanguage}</span>
      </div>
    </div>
  `;

  // Use Canva-friendly styles if requested, otherwise use standard styles
  const additionalStyles = options.canvaFriendly 
    ? CANVA_FRIENDLY_STYLES
    : `
    ${SPACING_STYLES}
    ${PDF_BASE_STYLES}
    ${TYPOGRAPHY_STYLES}
    ${PRINT_STYLES}

    .worksheet-title {
      font-family: 'Poppins', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: #1E40AF;
      margin: 0 0 6px 0;
      letter-spacing: -0.3px;
    }

    .worksheet-subtitle {
      font-size: 14px;
      color: #6B7280;
      margin-bottom: 14px;
      font-weight: 500;
    }

    .student-info {
      display: flex;
      gap: 16px;
      margin: 12px 0 16px 0;
      flex-wrap: wrap;
    }

    .info-field {
      flex: 1;
      min-width: 160px;
    }

    .info-label {
      font-size: 11px;
      font-weight: 600;
      color: #64748b;
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .info-line {
      border-bottom: 1.5px solid #cbd5e1;
      height: 24px;
    }

    .instructions {
      background: #eff6ff;
      border: 1px solid #3b82f6;
      border-left: 4px solid #1e40af;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 18px;
    }

    .instructions-title {
      font-size: 13px;
      font-weight: 700;
      color: #1e40af;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
    }

    .worksheet-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin: 14px 0 18px 0;
    }

    .meta-chip {
      display: flex;
      flex-direction: column;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px 14px;
      min-width: 130px;
      box-shadow: 0 1px 2px rgba(15,23,42,0.06);
    }

    .meta-label {
      font-size: 10px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 3px;
    }

    .meta-value {
      font-size: 12px;
      font-weight: 600;
      color: #0f172a;
    }

    .grammar-explanation {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #6366f1;
      border-radius: 8px;
      padding: 16px;
      margin-bottom: 20px;
    }

    .grammar-explanation-title {
      font-size: 16px;
      font-weight: 600;
      color: #6366f1;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
    }

    .grammar-explanation-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .grammar-explanation-content {
      font-size: 13px;
      color: #374151;
      line-height: 1.5;
    }

    .grammar-examples {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 14px;
      margin-bottom: 18px;
    }

    .grammar-examples-title {
      font-size: 15px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }

    .grammar-examples-icon {
      width: 18px;
      height: 18px;
      margin-right: 7px;
      color: #10b981;
    }

    .example-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
    }

    .example-correct {
      color: #10b981;
      font-weight: 600;
      margin-bottom: 4px;
      font-size: 13px;
    }

    .example-incorrect {
      color: #ef4444;
      text-decoration: line-through;
      margin-bottom: 4px;
      font-size: 13px;
    }

    .example-explanation {
      font-size: 11px;
      color: #64748b;
      font-style: italic;
    }

    .conjugation-table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .conjugation-table th {
      background: #f8fafc;
      color: #374151;
      font-weight: 600;
      padding: 8px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
      font-size: 11px;
    }

    .conjugation-table td {
      padding: 7px 8px;
      border-bottom: 1px solid #f1f5f9;
      font-size: 12px;
      vertical-align: middle;
    }

    .conjugation-input {
      width: 100%;
      max-width: 180px;
      border: none;
      border-bottom: 1px solid #cbd5e1;
      padding: 3px 0;
      font-size: 12px;
      background: transparent;
    }

    /* Multi-column layout for conjugation exercises */
    .conjugation-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
      margin-bottom: 16px;
    }

    .conjugation-verb-block {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .conjugation-verb-title {
      font-size: 14px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      padding-bottom: 4px;
      border-bottom: 2px solid #e2e8f0;
    }

    /* Multi-column layouts for other exercise types */
    .sentence-completion-grid,
    .transformation-grid,
    .error-correction-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 14px;
      margin-bottom: 16px;
    }

    .sentence-transformation {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .transformation-original {
      font-size: 13px;
      color: #374151;
      margin-bottom: 8px;
      padding: 7px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .transformation-prompt {
      font-size: 11px;
      color: #6366f1;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .transformation-answer {
      border-bottom: 1px solid #cbd5e1;
      min-height: 26px;
      padding: 4px 0;
    }

    .error-correction-item {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
      break-inside: avoid;
      page-break-inside: avoid;
    }

    .error-sentence {
      font-size: 13px;
      color: #374151;
      margin-bottom: 6px;
    }

    .error-instruction {
      font-size: 11px;
      color: #ef4444;
      font-weight: 600;
      margin-bottom: 6px;
    }

    .error-correction {
      border-bottom: 1px solid #cbd5e1;
      min-height: 26px;
      padding: 4px 0;
    }

    /* Sentence completion styling */
    .sentence-completion-item {
      break-inside: avoid;
      page-break-inside: avoid;
      margin-bottom: 10px;
    }

    .error-correction-item {
      background: #fef2f2;
      border: 1px solid #fecaca;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 12px;
    }

    .error-sentence {
      font-size: 14px;
      color: #dc2626;
      margin-bottom: 10px;
      padding: 8px;
      background: white;
      border-radius: 4px;
    }

    .error-instruction {
      font-size: 12px;
      color: #7f1d1d;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .error-correction {
      border-bottom: 1px solid #cbd5e1;
      min-height: 30px;
      padding: 5px 0;
    }

    /* Exercise specific colors */
    .exercise-1 .activity-icon { background: linear-gradient(135deg, #ec4899, #f97316); }
    .exercise-2 .activity-icon { background: linear-gradient(135deg, #8b5cf6, #6366f1); }
    .exercise-3 .activity-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }
    .exercise-4 .activity-icon { background: linear-gradient(135deg, #10b981, #059669); }
    .exercise-5 .activity-icon { background: linear-gradient(135deg, #f59e0b, #d97706); }

    @media print {
      .conjugation-input,
      .transformation-answer,
      .error-correction {
        border-bottom: 1px solid #000 !important;
      }
    }

    @media (max-width: 768px) {
      .conjugation-grid,
      .sentence-completion-grid,
      .transformation-grid,
      .error-correction-grid {
        grid-template-columns: 1fr !important;
      }
      
      .conjugation-table {
        font-size: 12px;
      }
      .conjugation-table th,
      .conjugation-table td {
        padding: 8px;
      }
    }

    @media print {
      .worksheet-title {
        font-size: 20pt !important;
        color: #000 !important;
        margin-bottom: 5pt !important;
      }

      .worksheet-subtitle {
        font-size: 10pt !important;
        color: #333 !important;
        margin-bottom: 10pt !important;
      }

      .student-info {
        margin: 10pt 0 12pt 0 !important;
        gap: 12px !important;
      }

      .info-label {
        font-size: 9pt !important;
        margin-bottom: 3pt !important;
      }

      .info-line {
        height: 20px !important;
      }

      .instructions {
        border: 1px solid #999 !important;
        border-left: 2.5px solid #000 !important;
        padding: 10pt !important;
        margin-bottom: 12pt !important;
        background: white !important;
      }

      .instructions-title {
        font-size: 10pt !important;
        color: #000 !important;
        margin-bottom: 6pt !important;
      }

      .worksheet-meta {
        margin: 10pt 0 12pt 0 !important;
        gap: 8px !important;
      }

      .meta-chip {
        padding: 7pt 10pt !important;
        border: 1px solid #999 !important;
        background: white !important;
      }

      .meta-label {
        font-size: 8pt !important;
        color: #333 !important;
      }

      .meta-value {
        font-size: 10pt !important;
        color: #000 !important;
      }

      .grammar-explanation,
      .grammar-examples {
        padding: 10pt !important;
        margin-bottom: 12pt !important;
        border: 1px solid #999 !important;
        background: white !important;
      }

      .grammar-explanation-title,
      .grammar-examples-title {
        font-size: 10pt !important;
        color: #000 !important;
        margin-bottom: 8pt !important;
      }

      .example-item {
        padding: 7pt !important;
        margin-bottom: 6pt !important;
        border: 1px solid #ddd !important;
        background: white !important;
      }

      .conjugation-table th,
      .conjugation-table td {
        padding: 5pt 6pt !important;
        font-size: 8.5pt !important;
      }

      .conjugation-input {
        max-width: 140px !important;
        font-size: 8.5pt !important;
      }

      .conjugation-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 10pt !important;
        margin-bottom: 10pt !important;
      }

      .conjugation-verb-block {
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }

      .conjugation-verb-title {
        font-size: 10pt !important;
        margin-bottom: 6pt !important;
        padding-bottom: 3pt !important;
      }

      .sentence-completion-grid,
      .transformation-grid,
      .error-correction-grid {
        grid-template-columns: repeat(2, 1fr) !important;
        gap: 8pt !important;
        margin-bottom: 10pt !important;
      }

      .sentence-transformation,
      .error-correction-item,
      .sentence-completion-item {
        padding: 7pt !important;
        margin-bottom: 6pt !important;
        border: 1px solid #ddd !important;
        background: white !important;
        break-inside: avoid !important;
        page-break-inside: avoid !important;
      }
    }
  `;

  let bodyContent = '';

  // Title as h1 in body (not duplicate header)
  bodyContent += `<h1 class="worksheet-title">${worksheet.title || `${grammarTopic} - Grammar Practice`}</h1>`;
  
  // Subject/language info only if relevant
  if (worksheet.subject || worksheet.topic) {
    const subjectLine = worksheet.subject ? formatLanguage(worksheet.subject) : '';
    const topicLine = worksheet.topic ? ` • ${worksheet.topic}` : '';
    if (subjectLine || topicLine) {
      bodyContent += `<div class="worksheet-subtitle">${subjectLine}${topicLine}</div>`;
    }
  }

  bodyContent += grammarSummary;

  // Student Information
  bodyContent += generateStudentInfo();

  // Grammar Explanation (on page 1)
  if (explanation) {
    bodyContent += `
      <div class="grammar-explanation">
        <div class="grammar-explanation-title">
          <i data-lucide="book-open" class="grammar-explanation-icon"></i>
          ${grammarTopic}
        </div>
        <div class="grammar-explanation-content">
          ${formatText(explanation)}
        </div>
      </div>
    `;
  }

  // Grammar Examples (on page 1)
  if (examples.length > 0) {
    const examplesContent = examples.map(example => `
      <div class="example-item">
        <div class="example-correct">✓ ${example.correct}</div>
        ${example.incorrect ? `<div class="example-incorrect">✗ ${example.incorrect}</div>` : ''}
        ${example.explanation ? `<div class="example-explanation">${example.explanation}</div>` : ''}
      </div>
    `).join('');

    bodyContent += `
      <div class="grammar-examples">
        <div class="grammar-examples-title">
          <i data-lucide="lightbulb" class="grammar-examples-icon"></i>
          Examples
        </div>
        ${examplesContent}
      </div>
    `;
  }

  // Instructions (moved to page 1 so learners see them alongside examples)
  const formattedInstructions = formatInstructions(
    `Complete the activities below to practice conjugating and using Spanish verbs in the present tense. Pay
attention to correct agreement and sentence structure.`
  );
  bodyContent += generateInstructions(formattedInstructions);

  // Add page break before exercises (start practice on next page)
  bodyContent += `<div style="page-break-before: always;"></div>`;

  // Generate exercises
  exercises.forEach((exercise, index) => {
    const exerciseNumber = index + 1;
    let exerciseContent = '';
    let fallbackTitle = '';
    let fallbackDescription = '';
    let exerciseIcon = 'edit';

    switch (exercise.type) {
      case 'conjugation':
        fallbackTitle = 'Verb Conjugation';
        fallbackDescription = 'Conjugate the verbs according to the given subject pronouns.';
        exerciseIcon = 'type';
        exerciseContent = generateConjugationExercise(exercise.items || []);
        break;

      case 'sentence-completion':
        fallbackTitle = 'Sentence Completion';
        fallbackDescription = 'Complete the sentences with the correct grammar forms.';
        exerciseIcon = 'edit-3';
        exerciseContent = generateSentenceCompletionExercise(exercise.items || []);
        break;

      case 'transformation':
        fallbackTitle = 'Sentence Transformation';
        fallbackDescription = 'Transform the sentences according to the given instructions.';
        exerciseIcon = 'repeat';
        exerciseContent = generateTransformationExercise(exercise.items || []);
        break;

      case 'error-correction':
        fallbackTitle = 'Error Correction';
        fallbackDescription = 'Find and correct the grammatical errors in the sentences.';
        exerciseIcon = 'check-circle';
        exerciseContent = generateErrorCorrectionExercise(exercise.items || []);
        break;

      default:
        fallbackTitle = 'Grammar Exercise';
        fallbackDescription = exercise.instructions || 'Complete the exercise below.';
        exerciseContent = generateGenericGrammarExercise(exercise.items || []);
    }

    const exerciseTitle = exercise.title || fallbackTitle;
    const exerciseDescription = exercise.instructions
      ? formatInstructions(exercise.instructions)
      : `<p>${fallbackDescription}</p>`;

    bodyContent += generateActivitySection(
      exerciseNumber,
      exerciseTitle,
      exerciseDescription,
      exerciseIcon,
      exerciseContent
    );
  });

  if (worksheet.answerKey && Object.keys(worksheet.answerKey).length > 0) {
    bodyContent += formatAnswerKey(worksheet.answerKey as Record<string, any>);
  }

  // Don't add footer here - createHTMLDocument already adds it
  // bodyContent += generateFooter();

  return createHTMLDocument(
    {
      title: worksheet.title || `${grammarTopic} - Grammar Practice`,
      additionalStyles
    },
    bodyContent
  );
}

function generateConjugationExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No conjugation items available.</p>';

  const verbBlocks = items.map((item, index) => {
    const verb = item.verb || item.infinitive || 'verb';
    const pronouns: string[] = Array.isArray(item.pronouns) && item.pronouns.length > 0
      ? item.pronouns
      : ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
    
    return `
      <div class="conjugation-verb-block">
        <div class="conjugation-verb-title">${index + 1}. ${verb}</div>
        <table class="conjugation-table">
          <thead>
            <tr>
              <th style="width: 35%;">Pronoun</th>
              <th style="width: 65%;">Conjugation</th>
            </tr>
          </thead>
          <tbody>
            ${pronouns.map((pronoun: string) => `
              <tr>
                <td>${pronoun}</td>
                <td><input type="text" class="conjugation-input" /></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  });

  return `<div class="conjugation-grid">${verbBlocks.join('')}</div>`;
}

function generateSentenceCompletionExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No sentence completion items available.</p>';

  const completionItems = items.map((item, index) => {
    const sentence = item.sentence || item.text || item;
    return `<div class="sentence-completion-item">${generateFillInBlankQuestion(index + 1, sentence)}</div>`;
  });

  return `<div class="sentence-completion-grid">${completionItems.join('')}</div>`;
}

function generateTransformationExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No transformation items available.</p>';

  const transformationItems = items.map((item, index) => `
    <div class="sentence-transformation">
      <div class="transformation-original">
        <strong>Original:</strong> ${item.original || item.sentence || item}
      </div>
      <div class="transformation-prompt">
        ${item.instruction || 'Transform this sentence:'}
      </div>
      <div class="transformation-answer"></div>
    </div>
  `);

  return `<div class="transformation-grid">${transformationItems.join('')}</div>`;
}

function generateErrorCorrectionExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No error correction items available.</p>';

  const errorItems = items.map((item, index) => `
    <div class="error-correction-item">
      <div class="error-sentence">
        <strong>${index + 1}.</strong> ${item.incorrect || item.sentence || item}
      </div>
      <div class="error-instruction">
        Correct the error(s) in this sentence:
      </div>
      <div class="error-correction"></div>
    </div>
  `);

  return `<div class="error-correction-grid">${errorItems.join('')}</div>`;
}

function generateGenericGrammarExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No exercise items available.</p>';

  return items.map((item, index) => {
    return generateFillInBlankQuestion(index + 1, item.question || item.text || item);
  }).join('');
}
