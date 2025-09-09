// Writing practice worksheet HTML generator

import { WorksheetData, WritingPracticeContent, HTMLGeneratorOptions } from '../shared/types';
import { createHTMLDocument } from '../utils/html-builder';
import { 
  generateHeader, 
  generateStudentInfo, 
  generateFooter, 
  generateActivitySection
} from '../shared/components';
import { formatText, formatInstructions, formatList } from '../utils/content-formatter';

export function generateWritingPracticeHTML(
  worksheet: WorksheetData,
  options: HTMLGeneratorOptions = {}
): string {
  console.log('🎨 [WRITING GENERATOR] Generating writing practice HTML for worksheet:', worksheet.title);

  const content = (worksheet.rawContent || worksheet.content || {}) as WritingPracticeContent;
  const writingPrompt = content.writing_prompt || '';
  const wordLimit = content.word_limit || 0;
  const vocabularySupport = content.vocabulary_support || [];
  const structureGuide = content.structure_guide || [];
  const assessmentCriteria = content.assessment_criteria || [];

  // Get the target language for instructions
  const targetLanguage = options.language === 'spanish' ? 'Spanish' :
                         options.language === 'french' ? 'French' :
                         options.language === 'german' ? 'German' : 'target language';

  const additionalStyles = `
    .writing-prompt {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-left: 4px solid #6366f1;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .writing-prompt-title {
      font-size: 18px;
      font-weight: 600;
      color: #6366f1;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }

    .writing-prompt-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
    }

    .writing-prompt-content {
      font-size: 14px;
      color: #374151;
      line-height: 1.6;
    }

    .word-limit {
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 10px;
      margin-top: 10px;
      font-size: 13px;
      color: #1e40af;
      font-weight: 500;
    }

    .writing-support {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 20px;
      margin-bottom: 25px;
    }

    .support-section {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
    }

    .support-section-title {
      font-size: 16px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .support-section-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .vocabulary-support-icon { color: #6366f1; }
    .structure-guide-icon { color: #10b981; }
    .assessment-criteria-icon { color: #f59e0b; }

    .vocabulary-list {
      display: grid;
      gap: 8px;
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

    .structure-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .structure-item {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #166534;
      position: relative;
      padding-left: 35px;
    }

    .structure-item::before {
      content: counter(structure-counter);
      counter-increment: structure-counter;
      position: absolute;
      left: 10px;
      top: 10px;
      background: #10b981;
      color: white;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      font-weight: 600;
    }

    .structure-list {
      counter-reset: structure-counter;
    }

    .criteria-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .criteria-item {
      background: #fffbeb;
      border: 1px solid #fed7aa;
      border-radius: 6px;
      padding: 10px;
      margin-bottom: 8px;
      font-size: 13px;
      color: #92400e;
      display: flex;
      align-items: flex-start;
    }

    .criteria-item::before {
      content: "✓";
      color: #f59e0b;
      font-weight: 600;
      margin-right: 8px;
      margin-top: 1px;
    }

    .writing-area {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .writing-area-title {
      font-size: 18px;
      font-weight: 600;
      color: #1a202c;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .writing-area-icon {
      width: 24px;
      height: 24px;
      margin-right: 8px;
      color: #6366f1;
    }

    .writing-lines {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 20px;
      min-height: 400px;
      background-image: repeating-linear-gradient(
        transparent,
        transparent 24px,
        #e2e8f0 24px,
        #e2e8f0 25px
      );
      line-height: 25px;
    }

    .word-count-tracker {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 10px;
      margin-top: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13px;
      color: #64748b;
    }

    .planning-section {
      background: #fefce8;
      border: 1px solid #fde047;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 25px;
    }

    .planning-title {
      font-size: 16px;
      font-weight: 600;
      color: #a16207;
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }

    .planning-icon {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }

    .planning-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }

    .planning-box {
      background: white;
      border: 1px solid #fbbf24;
      border-radius: 6px;
      padding: 15px;
      min-height: 80px;
    }

    .planning-box-title {
      font-size: 12px;
      font-weight: 600;
      color: #92400e;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    @media print {
      .writing-lines {
        background-image: repeating-linear-gradient(
          transparent,
          transparent 24px,
          #000 24px,
          #000 25px
        ) !important;
      }
    }

    @media (max-width: 768px) {
      .writing-support {
        grid-template-columns: 1fr;
      }
      .planning-grid {
        grid-template-columns: 1fr;
      }
    }
  `;

  let bodyContent = '';

  // Header
  bodyContent += generateHeader(worksheet.title || 'Writing Practice', worksheet.subject, worksheet.topic);

  // Student Information
  bodyContent += generateStudentInfo();

  // Instructions
  const defaultInstructions = `Read the writing prompt carefully and plan your response before you begin writing. Use the support materials provided to help you.`;
  bodyContent += `
    <div class="instructions">
      <div class="instructions-title">Instructions</div>
      <div>${defaultInstructions}</div>
    </div>
  `;

  // Writing Prompt
  if (writingPrompt) {
    bodyContent += `
      <div class="writing-prompt">
        <div class="writing-prompt-title">
          <i data-lucide="edit-3" class="writing-prompt-icon"></i>
          Writing Prompt
        </div>
        <div class="writing-prompt-content">
          ${formatText(writingPrompt)}
        </div>
        ${wordLimit > 0 ? `
          <div class="word-limit">
            <i data-lucide="target" style="width: 16px; height: 16px; margin-right: 6px;"></i>
            Target word count: ${wordLimit} words
          </div>
        ` : ''}
      </div>
    `;
  }

  // Support Materials
  if (vocabularySupport.length > 0 || structureGuide.length > 0 || assessmentCriteria.length > 0) {
    let supportContent = '';

    // Vocabulary Support
    if (vocabularySupport.length > 0) {
      const vocabContent = `
        <div class="vocabulary-list">
          ${vocabularySupport.map(item => `
            <div class="vocabulary-item">
              <div class="vocabulary-word">${item.word || item.term}</div>
              <div class="vocabulary-definition">${item.definition || item.meaning}</div>
            </div>
          `).join('')}
        </div>
      `;

      supportContent += `
        <div class="support-section">
          <div class="support-section-title">
            <i data-lucide="book-open" class="support-section-icon vocabulary-support-icon"></i>
            Useful Vocabulary
          </div>
          ${vocabContent}
        </div>
      `;
    }

    // Structure Guide
    if (structureGuide.length > 0) {
      const structureContent = `
        <ul class="structure-list">
          ${structureGuide.map(item => `
            <li class="structure-item">${item}</li>
          `).join('')}
        </ul>
      `;

      supportContent += `
        <div class="support-section">
          <div class="support-section-title">
            <i data-lucide="list" class="support-section-icon structure-guide-icon"></i>
            Structure Guide
          </div>
          ${structureContent}
        </div>
      `;
    }

    // Assessment Criteria
    if (assessmentCriteria.length > 0) {
      const criteriaContent = `
        <ul class="criteria-list">
          ${assessmentCriteria.map(item => `
            <li class="criteria-item">${item}</li>
          `).join('')}
        </ul>
      `;

      supportContent += `
        <div class="support-section">
          <div class="support-section-title">
            <i data-lucide="check-circle" class="support-section-icon assessment-criteria-icon"></i>
            Assessment Criteria
          </div>
          ${criteriaContent}
        </div>
      `;
    }

    bodyContent += `<div class="writing-support">${supportContent}</div>`;
  }

  // Planning Section
  bodyContent += `
    <div class="planning-section">
      <div class="planning-title">
        <i data-lucide="map" class="planning-icon"></i>
        Planning Space
      </div>
      <div class="planning-grid">
        <div class="planning-box">
          <div class="planning-box-title">Main Ideas</div>
        </div>
        <div class="planning-box">
          <div class="planning-box-title">Key Vocabulary</div>
        </div>
        <div class="planning-box">
          <div class="planning-box-title">Structure</div>
        </div>
        <div class="planning-box">
          <div class="planning-box-title">Notes</div>
        </div>
      </div>
    </div>
  `;

  // Writing Area
  bodyContent += `
    <div class="writing-area">
      <div class="writing-area-title">
        <i data-lucide="pen-tool" class="writing-area-icon"></i>
        Your Writing
      </div>
      <div class="writing-lines"></div>
      ${wordLimit > 0 ? `
        <div class="word-count-tracker">
          <span>Word count: _____ / ${wordLimit}</span>
          <span>Remember to check your work!</span>
        </div>
      ` : ''}
    </div>
  `;

  // Footer
  bodyContent += generateFooter();

  return createHTMLDocument(
    {
      title: worksheet.title || 'Writing Practice',
      additionalStyles
    },
    bodyContent
  );
}
