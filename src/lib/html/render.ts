import fs from 'fs';
import path from 'path';
import { WorksheetContent, Exercise } from '@/types/worksheet';

let CSS_CACHE = '';
function loadCss(): string {
  if (CSS_CACHE) return CSS_CACHE;
  try {
    const cssPath = path.join(process.cwd(), 'src', 'components', 'worksheets', 'components.css');
    CSS_CACHE = fs.readFileSync(cssPath, 'utf8');
  } catch {
    CSS_CACHE = '';
  }
  return CSS_CACHE;
}

function esc(s: string = ''): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function renderHeader(content: WorksheetContent): string {
  const subtitle = [content.language ? `${content.language}` : '', content.level ? `${content.level}` : '']
    .filter(Boolean)
    .join(' • ');
  return `
  <div class="lg-header">
    <div class="lg-brand-logo"></div>
    <div class="lg-title-block">
      <h1>${esc((content.title || '').toUpperCase())}</h1>
      ${subtitle ? `<h2>${esc(subtitle)}</h2>` : ''}
    </div>
    <div class="lg-info-fields">
      ${content.studentInfo?.nameField !== false ? '<div class="lg-info-item">Name <span></span></div>' : ''}
      ${content.studentInfo?.classField !== false ? '<div class="lg-info-item">Class <span></span></div>' : ''}
      ${content.studentInfo?.dateField !== false ? '<div class="lg-info-item">Date <span></span></div>' : ''}
    </div>
  </div>`;
}

function renderFooter(): string {
  return `
  <div class="lg-footer">
    <div class="lg-footer-content">
      <span class="lg-gem-accent">LanguageGems</span> Curriculum-Aware AI Worksheet
    </div>
    <div class="lg-page-number">Page <span class="page-num"></span></div>
  </div>`;
}

function renderIntroAndReference(content: WorksheetContent): string {
  let html = '';
  if (content.introductoryExplanation) {
    html += `
    <div class="lg-intro-section">
      <h3>${esc(content.introductoryExplanation.title)}</h3>
      <p>${esc(content.introductoryExplanation.content)}</p>
    </div>`;
  }
  if (content.referenceSection) {
    const sec = content.referenceSection;
    html += `
    <div class="lg-intro-section">
      <h3>${esc(sec.title)}</h3>
      ${sec.content ? `<p>${esc(sec.content)}</p>` : ''}
      ${sec.endingPatterns ? `<div style="margin-top: 12px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
        ${sec.endingPatterns
          .map(p => `<div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid rgba(30, 64, 175, 0.2);">
            <strong style="color: var(--lg-secondary); display: block; margin-bottom: 6px; font-size: 0.9em;">${esc(p.type.toUpperCase())}</strong>
            <div style="font-family: var(--font-mono); font-size: 12px; color: var(--lg-text);">${p.endings.map(esc).join(', ')}</div>
          </div>`)
          .join('')}
      </div>` : ''}
    </div>`;
  }
  return html;
}

function renderExercise(ex: Exercise, index: number): string {
  const header = `
  <div class="lg-exercise-header">
    <div class="lg-exercise-number">${index + 1}</div>
    <h3>${esc(ex.title)}</h3>
  </div>
  <div class="lg-instructions">${esc(ex.instructions)}</div>`;

  if (ex.type === 'translation_both_ways') {
    const left = ex.questions[0]?.items ?? [];
    const right = ex.questions[1]?.items ?? [];
    return `
    ${header}
    <div class="lg-question-grid">
      <div>
        ${left.slice(0, 10).map((q, i) => `
          <div class="lg-question-item"><span class="lg-question-number">${i + 1}.</span> ${esc(q.spanish || q.sentence || '')} <span class="lg-blank"></span></div>
        `).join('')}
      </div>
      <div>
        ${right.slice(0, 10).map((q, i) => `
          <div class="lg-question-item"><span class="lg-question-number">${i + 1}.</span> ${esc(q.english || q.sentence || '')} <span class="lg-blank"></span></div>
        `).join('')}
      </div>
    </div>`;
  }

  const items = ex.questions.map((q, i) => {
    if (ex.type === 'multiple_choice') {
      const opts = q.options?.join(' / ') ?? '';
      return `<div class="lg-question-item"><span class="lg-question-number">${i + 1}.</span> ${esc(q.sentence || '')} ${opts ? `<em>(${esc(opts)})</em>` : ''}</div>`;
    }
    if (ex.type === 'error_correction') {
      const text = q.incorrect || q.original || q.error || q.sentence || q.text || '';
      return `<div class="lg-question-item"><span class="lg-question-number">${i + 1}.</span> ${esc(text)} <span class="lg-blank"></span></div>`;
    }
    if (ex.type === 'word_order') {
      const text = q.scrambled || q.sentence || '';
      return `<div class="lg-question-item"><span class="lg-question-number">${i + 1}.</span> ${esc(text)} <span class="lg-blank"></span></div>`;
    }
    if (ex.type === 'translation' || ex.type.includes('translation')) {
      const base = q.english || q.sentence || q.spanish || '';
      return `<div class="lg-question-item"><span class="lg-question-number">${i + 1}.</span> ${esc(base)} <span class="lg-blank"></span></div>`;
    }
    // fill_in_blanks and default
    const sentence = (q.sentence || '').replace(/\[.*?\]/g, '<span class="lg-blank"></span>');
    return `<div class="lg-question-item"><span class="lg-question-number">${i + 1}.</span> ${sentence}</div>`;
  }).join('');

  return `${header}
  <div class="lg-question-grid">${items}</div>`;
}

export function renderWorksheetToHtml(content: WorksheetContent): string {
  const css = loadCss();

  const pages: Array<{ content?: string; exercises: Exercise[] }> = [
    { content: renderIntroAndReference(content), exercises: content.exercises.slice(0, 2) },
    ...content.exercises.slice(2).map(ex => ({ exercises: [ex] }))
  ];

  const pagesHtml = pages.map((p, pageIndex) => `
    <div class="lg-page">
      ${renderHeader(content)}
      <div class="lg-content-area">
        ${pageIndex === 0 ? (p.content || '') : ''}
        ${p.exercises.map(ex => `<div class="lg-section-wrapper">${renderExercise(ex, content.exercises.indexOf(ex))}</div>`).join('')}
      </div>
      ${renderFooter()}
    </div>
  `).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(content.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Inter:wght@400;500;700&display=swap" rel="stylesheet">
  <style>${css}</style>
</head>
<body>
${pagesHtml}
</body>
</html>`;
}

