/**
 * Workbook Template Components
 * Modular HTML components based on Canva master templates
 */

export interface CoverPageData {
  branding: string;
  title: string;
  subtitle: string;
  examCode: string;
  pageCount: number;
  price?: string;
  targetAudience?: string;
}

export interface SectionDividerData {
  sectionNumber: number;
  title: string;
  subtitle?: string;
  pageRange?: string;
}

export interface PracticePageData {
  sectionColor: string;
  sectionTitle: string;
  pageNumber: number;
  questionTitle: string;
  bullets: string[];
  wordCount?: string;
  lineCount?: number;
}

export interface ModelAnswerData {
  sectionColor: string;
  sectionTitle: string;
  pageNumber: number;
  modelNumber: number;
  context: string;
  answer: string;
  analysis: string;
}

export interface AnswerKeyData {
  pageNumber: number;
  blocks: Array<{
    title: string;
    answers: Array<{ number: number; text: string }>;
  }>;
}

/**
 * Generate Cover Page HTML
 */
export function generateCoverPage(data: CoverPageData): string {
  return `
    <div class="cover-page">
      <div class="cover-branding">${data.branding}</div>
      <h1 class="cover-title">${data.title}</h1>
      <div class="cover-subtitle">${data.subtitle}</div>
      <div class="cover-details">
        <p><strong>Exam Specification:</strong> ${data.examCode}</p>
        ${data.targetAudience ? `<p><strong>Target Audience:</strong> ${data.targetAudience}</p>` : ''}
        <p><strong>Total Pages:</strong> ${data.pageCount} Pages</p>
      </div>
      ${data.price ? `<div class="cover-badge">£${data.price} - Unlimited Classroom Use</div>` : ''}
    </div>
  `;
}

/**
 * Generate Section Divider Page HTML
 */
export function generateSectionDivider(data: SectionDividerData): string {
  return `
    <div class="section-divider section-${data.sectionNumber}">
      <div class="section-number">SECTION ${data.sectionNumber}</div>
      <h2 class="section-title">${data.title}</h2>
      ${data.subtitle ? `<div class="section-subtitle">${data.subtitle}</div>` : ''}
      ${data.pageRange ? `<div class="section-subtitle">${data.pageRange}</div>` : ''}
    </div>
  `;
}

/**
 * Generate Page Header
 */
export function generatePageHeader(sectionTitle: string, pageNumber: number, sectionColor: string): string {
  return `
    <div class="page-header" style="color: ${sectionColor};">
      <div class="page-header-title">${sectionTitle}</div>
      <div class="page-number">Page ${pageNumber}</div>
    </div>
  `;
}

/**
 * Generate Page Footer
 */
export function generatePageFooter(): string {
  return `
    <div class="page-footer">
      LanguageGems Premium Resource | www.languagegems.com
    </div>
  `;
}

/**
 * Generate Instruction Page
 */
export function generateInstructionPage(
  sectionColor: string,
  sectionTitle: string,
  pageNumber: number,
  heading: string,
  content: string,
  tips?: string[]
): string {
  const tipsHtml = tips
    ? tips.map(tip => `<div class="tip-box">${tip}</div>`).join('\n')
    : '';

  return `
    <div class="content-page">
      ${generatePageHeader(sectionTitle, pageNumber, sectionColor)}
      
      <div class="instruction-section">
        <h2>${heading}</h2>
        ${content}
        ${tipsHtml}
      </div>
      
      ${generatePageFooter()}
    </div>
  `;
}

/**
 * Generate Practice Page with Writing Lines
 */
export function generatePracticePage(data: PracticePageData): string {
  const lineCount = data.lineCount || 10;
  const lines = Array.from({ length: lineCount }, (_, i) => `
    <div class="writing-line">
      <span class="line-number">${i + 1}</span>
    </div>
  `).join('');

  const bulletsHtml = data.bullets.map(bullet => `<li>${bullet}</li>`).join('\n');

  return `
    <div class="content-page">
      ${generatePageHeader(data.sectionTitle, data.pageNumber, data.sectionColor)}
      
      <div class="practice-prompt">
        <h3>${data.questionTitle}</h3>
        <ul class="practice-bullets">
          ${bulletsHtml}
        </ul>
        ${data.wordCount ? `<p><strong>Tu respuesta (${data.wordCount}):</strong></p>` : ''}
      </div>
      
      <div class="writing-lines">
        ${lines}
      </div>
      
      ${generatePageFooter()}
    </div>
  `;
}

/**
 * Generate Model Answer Page
 */
export function generateModelAnswerPage(data: ModelAnswerData): string {
  return `
    <div class="content-page">
      ${generatePageHeader(data.sectionTitle, data.pageNumber, data.sectionColor)}
      
      <div class="model-answer-container">
        <h3>Model Answer ${data.modelNumber}: ${data.context}</h3>
        
        <div class="model-answer-box">
          ${data.answer}
        </div>
        
        <div class="model-analysis">
          ${data.analysis}
        </div>
      </div>
      
      ${generatePageFooter()}
    </div>
  `;
}

/**
 * Generate Answer Key Page
 */
export function generateAnswerKeyPage(data: AnswerKeyData): string {
  const blocksHtml = data.blocks.map(block => {
    const answersHtml = block.answers
      .map(answer => `<li data-number="${answer.number}">${answer.text}</li>`)
      .join('\n');

    return `
      <div class="answer-block">
        <h4>${block.title}</h4>
        <ul class="answer-list">
          ${answersHtml}
        </ul>
      </div>
    `;
  }).join('\n');

  return `
    <div class="content-page">
      ${generatePageHeader('Answer Key & Teacher Resources', data.pageNumber, 'var(--color-section-6)')}
      
      <div class="answer-key-section">
        ${blocksHtml}
      </div>
      
      ${generatePageFooter()}
    </div>
  `;
}

/**
 * Generate Complete HTML Document
 */
export function generateCompleteHTML(content: string, title: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    ${getInlineStyles()}
  </style>
</head>
<body>
  ${content}
</body>
</html>
  `;
}

/**
 * Get inline styles (reads from styles.css)
 */
function getInlineStyles(): string {
  // This will be populated with the actual CSS content
  // For now, we'll import it dynamically or inline it
  const fs = require('fs');
  const path = require('path');
  
  try {
    const stylesPath = path.join(__dirname, 'styles.css');
    return fs.readFileSync(stylesPath, 'utf-8');
  } catch (error) {
    console.error('Error reading styles.css:', error);
    return '';
  }
}

/**
 * Helper: Get section color by number
 */
export function getSectionColor(sectionNumber: number): string {
  const colors: Record<number, string> = {
    1: '#1e40af', // Deep Blue
    2: '#059669', // Emerald Green
    3: '#f97316', // Vibrant Orange
    4: '#9333ea', // Purple
    5: '#dc2626', // Red
    6: '#fbbf24', // Gold
  };
  return colors[sectionNumber] || '#1e40af';
}

/**
 * Helper: Get section title by number
 */
export function getSectionTitle(sectionNumber: number): string {
  const titles: Record<number, string> = {
    1: 'Introduction & Exam Strategy',
    2: 'Question 1 - Photo Card (8 Marks)',
    3: 'Question 2 - The 40-Word Response (16 Marks)',
    4: 'Question 3 - English to Spanish Translation (10 Marks)',
    5: 'Question 4 - The 90-Word Structured Response (16 Marks)',
    6: 'Answer Key & Teacher Resources',
  };
  return titles[sectionNumber] || 'Section';
}

