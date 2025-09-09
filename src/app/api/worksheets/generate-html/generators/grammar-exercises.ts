// Grammar exercises worksheet HTML generator

import { WorksheetData, GrammarExerciseContent, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import { 
  generateHeader, 
  generateStudentInfo, 
  generateFooter, 
  generateActivitySection,
  generateFillInBlankQuestion,
  generateMultipleChoiceQuestion
} from '../shared/components';
import { formatText, formatInstructions } from '../utils/content-formatter';

export function generateGrammarExercisesHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): string {
  console.log('🎨 [GRAMMAR GENERATOR] Generating grammar exercises HTML for worksheet:', worksheet.title);

  const content = (worksheet.rawContent || worksheet.content || {}) as GrammarExerciseContent;
  const grammarTopic = content.grammar_topic || 'Grammar Practice';
  const explanation = content.explanation || '';
  const examples = content.examples || [];
  const exercises = content.exercises || [];

  // Get the target language for instructions
  const targetLanguage = options.language === 'spanish' ? 'Spanish' :
                         options.language === 'french' ? 'French' :
                         options.language === 'german' ? 'German' : 'target language';

  const additionalStyles = `
    .grammar-explanation {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #6366f1;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .grammar-explanation-title {
      font-size: 18px;
      font-weight: 600;
      color: #6366f1;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }

    .grammar-explanation-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .grammar-explanation-content {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }

    .grammar-examples {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .grammar-examples-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .grammar-examples-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      color: #10b981;
    }

    .example-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 10px;
    }

    .example-correct {
      color: #10b981;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .example-incorrect {
      color: #ef4444;
      text-decoration: line-through;
      margin-bottom: 5px;
    }

    .example-explanation {
      font-size: 12px;
      color: #64748b;
      font-style: italic;
    }

    .conjugation-table {
      width: 100%;
      border-collapse: collapse;
      margin: 15px 0;
      background: white;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid #e2e8f0;
    }

    .conjugation-table th {
      background: #f8fafc;
      color: #374151;
      font-weight: 600;
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #e2e8f0;
    }

    .conjugation-table td {
      padding: 12px;
      border-bottom: 1px solid #f1f5f9;
    }

    .conjugation-input {
      width: 100%;
      border: none;
      border-bottom: 1px solid #cbd5e1;
      padding: 5px 0;
      font-size: 14px;
      background: transparent;
    }

    .sentence-transformation {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 12px;
    }

    .transformation-original {
      font-size: 14px;
      color: #374151;
      margin-bottom: 10px;
      padding: 8px;
      background: white;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .transformation-prompt {
      font-size: 12px;
      color: #6366f1;
      font-weight: 600;
      margin-bottom: 8px;
    }

    .transformation-answer {
      border-bottom: 1px solid #cbd5e1;
      min-height: 30px;
      padding: 5px 0;
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
      .conjugation-table {
        font-size: 12px;
      }
      .conjugation-table th,
      .conjugation-table td {
        padding: 8px;
      }
    }
  `;

  let bodyContent = '';

  // Header
  bodyContent += generateHeader(worksheet.title || `${grammarTopic} - Grammar Practice`, worksheet.subject, worksheet.topic);

  // Student Information
  bodyContent += generateStudentInfo();

  // Instructions
  const defaultInstructions = `Complete the grammar exercises below. Pay attention to the rules and examples provided.`;
  bodyContent += `
    <div class="instructions">
      <div class="instructions-title">Instructions</div>
      <div>${defaultInstructions}</div>
    </div>
  `;

  // Grammar Explanation
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

  // Grammar Examples
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

  // Generate exercises
  exercises.forEach((exercise, index) => {
    const exerciseNumber = index + 1;
    let exerciseContent = '';
    let exerciseTitle = '';
    let exerciseDescription = '';
    let exerciseIcon = 'edit';

    switch (exercise.type) {
      case 'conjugation':
        exerciseTitle = 'Verb Conjugation';
        exerciseDescription = 'Conjugate the verbs according to the given subject pronouns.';
        exerciseIcon = 'type';
        exerciseContent = generateConjugationExercise(exercise.items || []);
        break;

      case 'sentence-completion':
        exerciseTitle = 'Sentence Completion';
        exerciseDescription = 'Complete the sentences with the correct grammar forms.';
        exerciseIcon = 'edit-3';
        exerciseContent = generateSentenceCompletionExercise(exercise.items || []);
        break;

      case 'transformation':
        exerciseTitle = 'Sentence Transformation';
        exerciseDescription = 'Transform the sentences according to the given instructions.';
        exerciseIcon = 'repeat';
        exerciseContent = generateTransformationExercise(exercise.items || []);
        break;

      case 'error-correction':
        exerciseTitle = 'Error Correction';
        exerciseDescription = 'Find and correct the grammatical errors in the sentences.';
        exerciseIcon = 'check-circle';
        exerciseContent = generateErrorCorrectionExercise(exercise.items || []);
        break;

      default:
        exerciseTitle = 'Grammar Exercise';
        exerciseDescription = exercise.instructions || 'Complete the exercise below.';
        exerciseContent = generateGenericGrammarExercise(exercise.items || []);
    }

    bodyContent += generateActivitySection(
      exerciseNumber,
      exerciseTitle,
      exerciseDescription,
      exerciseIcon,
      exerciseContent
    );
  });

  // Footer
  bodyContent += generateFooter();

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

  return items.map((item, index) => {
    const verb = item.verb || item.infinitive || 'verb';
    const pronouns = item.pronouns || ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
    
    return `
      <div style="margin-bottom: 20px;">
        <h4 style="margin-bottom: 10px; color: #374151;">${index + 1}. ${verb}</h4>
        <table class="conjugation-table">
          <thead>
            <tr>
              <th>Pronoun</th>
              <th>Conjugation</th>
            </tr>
          </thead>
          <tbody>
            ${pronouns.map(pronoun => `
              <tr>
                <td>${pronoun}</td>
                <td><input type="text" class="conjugation-input" /></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }).join('');
}

function generateSentenceCompletionExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No sentence completion items available.</p>';

  return items.map((item, index) => {
    const sentence = item.sentence || item.text || item;
    return generateFillInBlankQuestion(index + 1, sentence);
  }).join('');
}

function generateTransformationExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No transformation items available.</p>';

  return items.map((item, index) => `
    <div class="sentence-transformation">
      <div class="transformation-original">
        <strong>Original:</strong> ${item.original || item.sentence || item}
      </div>
      <div class="transformation-prompt">
        ${item.instruction || 'Transform this sentence:'}
      </div>
      <div class="transformation-answer"></div>
    </div>
  `).join('');
}

function generateErrorCorrectionExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No error correction items available.</p>';

  return items.map((item, index) => `
    <div class="error-correction-item">
      <div class="error-sentence">
        <strong>${index + 1}.</strong> ${item.incorrect || item.sentence || item}
      </div>
      <div class="error-instruction">
        Correct the error(s) in this sentence:
      </div>
      <div class="error-correction"></div>
    </div>
  `).join('');
}

function generateGenericGrammarExercise(items: any[]): string {
  if (!items || items.length === 0) return '<p>No exercise items available.</p>';

  return items.map((item, index) => {
    return generateFillInBlankQuestion(index + 1, item.question || item.text || item);
  }).join('');
}
