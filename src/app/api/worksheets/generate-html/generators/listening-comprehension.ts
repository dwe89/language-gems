// Listening comprehension worksheet HTML generator

import { WorksheetData, ListeningComprehensionContent, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import { 
  generateHeader, 
  generateStudentInfo, 
  generateFooter, 
  generateActivitySection,
  generateMultipleChoiceQuestion,
  generateTrueFalseQuestion,
  generateFillInBlankQuestion
} from '../shared/components';
import { formatText, formatInstructions } from '../utils/content-formatter';

export function generateListeningComprehensionHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): string {
  console.log('🎨 [LISTENING GENERATOR] Generating listening comprehension HTML for worksheet:', worksheet.title);

  const content = (worksheet.rawContent || worksheet.content || {}) as ListeningComprehensionContent;
  const audioTitle = content.audio_title || 'Listening Exercise';
  const audioUrl = content.audio_url || '';
  const transcript = content.transcript || '';
  const questions = content.questions || [];
  const vocabularySupport = content.vocabulary_support || [];

  // Get the target language for instructions
  const targetLanguage = options.language === 'spanish' ? 'Spanish' :
                         options.language === 'french' ? 'French' :
                         options.language === 'german' ? 'German' : 'target language';

  const additionalStyles = `
    .listening-section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .listening-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 2px solid #e2e8f0;
    }

    .listening-icon {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 12px;
      color: white;
      font-size: 16px;
    }

    .listening-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
      margin: 0;
    }

    .audio-player {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin-bottom: 15px;
    }

    .audio-placeholder {
      background: #f3f4f6;
      border: 2px dashed #d1d5db;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      color: #6b7280;
    }

    .audio-placeholder-icon {
      width: 48px;
      height: 48px;
      margin: 0 auto 10px;
      color: #9ca3af;
    }

    .audio-instructions {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 12px;
      margin-bottom: 15px;
      font-size: 13px;
      color: #1e40af;
    }

    .listening-instructions {
      background: #fef3c7;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .listening-instructions-title {
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
    }

    .listening-instructions-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }

    .listening-instructions-text {
      font-size: 13px;
      color: #78350f;
      line-height: 1.5;
    }

    .vocabulary-support {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 20px;
    }

    .vocabulary-support-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }

    .vocabulary-support-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
      color: #6366f1;
    }

    .vocabulary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 10px;
    }

    .vocabulary-item {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
    }

    .vocabulary-word {
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }

    .vocabulary-definition {
      font-size: 12px;
      color: #6b7280;
    }

    .transcript-section {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .transcript-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e2e8f0;
    }

    .transcript-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      color: #6b7280;
    }

    .transcript-title {
      font-size: 16px;
      font-weight: 600;
      color: #374151;
      margin: 0;
    }

    .transcript-content {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
      font-style: italic;
    }

    .listening-questions {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
    }

    .question-section {
      margin-bottom: 20px;
    }

    .question-section:last-child {
      margin-bottom: 0;
    }

    /* Exercise specific colors */
    .exercise-1 .activity-icon { background: linear-gradient(135deg, #ec4899, #f97316); }
    .exercise-2 .activity-icon { background: linear-gradient(135deg, #8b5cf6, #6366f1); }
    .exercise-3 .activity-icon { background: linear-gradient(135deg, #06b6d4, #0891b2); }
    .exercise-4 .activity-icon { background: linear-gradient(135deg, #10b981, #059669); }

    @media print {
      .audio-player {
        display: none;
      }
      .transcript-section {
        display: block !important;
      }
    }

    @media (max-width: 768px) {
      .vocabulary-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  let bodyContent = '';

  // Header
  bodyContent += generateHeader(worksheet.title || 'Listening Comprehension', worksheet.subject, worksheet.topic);

  // Student Information
  bodyContent += generateStudentInfo();

  // Instructions
  const defaultInstructions = `Listen to the audio carefully and answer the questions below. You may listen to the audio multiple times.`;
  bodyContent += `
    <div class="instructions">
      <div class="instructions-title">Instructions</div>
      <div>${defaultInstructions}</div>
    </div>
  `;

  // Listening Instructions
  bodyContent += `
    <div class="listening-instructions">
      <div class="listening-instructions-title">
        <i data-lucide="info" class="listening-instructions-icon"></i>
        Listening Tips
      </div>
      <div class="listening-instructions-text">
        • Listen to the entire audio first to get the general idea<br>
        • Take notes while listening<br>
        • Pay attention to key words and phrases<br>
        • Don't worry if you don't understand every word
      </div>
    </div>
  `;

  // Audio Section
  bodyContent += `
    <div class="listening-section">
      <div class="listening-header">
        <div class="listening-icon"><i data-lucide="headphones" class="w-4 h-4"></i></div>
        <h2 class="listening-title">${audioTitle}</h2>
      </div>
      <div class="audio-player">
        ${audioUrl ? `
          <audio controls style="width: 100%; max-width: 400px;">
            <source src="${audioUrl}" type="audio/mpeg">
            <source src="${audioUrl}" type="audio/wav">
            Your browser does not support the audio element.
          </audio>
        ` : `
          <div class="audio-placeholder">
            <i data-lucide="volume-2" class="audio-placeholder-icon"></i>
            <div>Audio will be provided by your teacher</div>
          </div>
        `}
      </div>
      <div class="audio-instructions">
        <strong>Note:</strong> You can play the audio as many times as needed to answer the questions.
      </div>
    </div>
  `;

  // Vocabulary Support
  if (vocabularySupport.length > 0) {
    const vocabContent = `
      <div class="vocabulary-grid">
        ${vocabularySupport.map(item => `
          <div class="vocabulary-item">
            <div class="vocabulary-word">${item.word || item.term}</div>
            <div class="vocabulary-definition">${item.definition || item.meaning}</div>
          </div>
        `).join('')}
      </div>
    `;

    bodyContent += `
      <div class="vocabulary-support">
        <div class="vocabulary-support-title">
          <i data-lucide="book-open" class="vocabulary-support-icon"></i>
          Vocabulary Support
        </div>
        ${vocabContent}
      </div>
    `;
  }

  // Questions
  if (questions.length > 0) {
    let questionsContent = '';
    let currentSection = '';
    let sectionNumber = 1;

    questions.forEach((question, index) => {
      let questionHTML = '';

      switch (question.type) {
        case 'multiple-choice':
          questionHTML = generateMultipleChoiceQuestion(
            index + 1,
            question.text || question.question || '',
            question.options as string[] || []
          );
          break;

        case 'true-false':
          questionHTML = generateTrueFalseQuestion(
            index + 1,
            question.text || question.question || ''
          );
          break;

        case 'fill-in-the-blank':
        default:
          questionHTML = generateFillInBlankQuestion(
            index + 1,
            question.text || question.question || ''
          );
          break;
      }

      questionsContent += questionHTML;
    });

    bodyContent += generateActivitySection(
      1,
      'Listening Questions',
      'Answer the questions based on what you heard in the audio.',
      'help-circle',
      questionsContent
    );
  }

  // Transcript (for teacher reference or print version)
  if (transcript) {
    bodyContent += `
      <div class="transcript-section" style="display: none;">
        <div class="transcript-header">
          <i data-lucide="file-text" class="transcript-icon"></i>
          <h3 class="transcript-title">Transcript (Teacher Reference)</h3>
        </div>
        <div class="transcript-content">
          ${formatText(transcript)}
        </div>
      </div>
    `;
  }

  // Footer
  bodyContent += generateFooter();

  return createHTMLDocument(
    {
      title: worksheet.title || 'Listening Comprehension',
      additionalStyles
    },
    bodyContent
  );
}
