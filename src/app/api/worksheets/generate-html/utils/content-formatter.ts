// Content formatting utilities for worksheet generation

export function formatText(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .replace(/\n\n+/g, '</p><p>')
    .replace(/\n/g, '<br>')
    .replace(/^(.+)$/, '<p>$1</p>');
}

export function formatParagraphs(text: string): string {
  if (!text) return '';
  
  return text
    .split('\n\n')
    .filter(paragraph => paragraph.trim())
    .map(paragraph => `<p>${paragraph.trim()}</p>`)
    .join('');
}

export function formatList(items: string[], ordered: boolean = false): string {
  if (!items || items.length === 0) return '';
  
  const tag = ordered ? 'ol' : 'ul';
  const listItems = items
    .filter(item => item.trim())
    .map(item => `<li>${item.trim()}</li>`)
    .join('');
  
  return `<${tag}>${listItems}</${tag}>`;
}

export function formatDefinition(term: string, definition: string): string {
  return `<dt><strong>${term}</strong></dt><dd>${definition}</dd>`;
}

export function formatDefinitionList(definitions: Array<{term: string, definition: string}>): string {
  if (!definitions || definitions.length === 0) return '';
  
  const items = definitions
    .map(({term, definition}) => formatDefinition(term, definition))
    .join('');
  
  return `<dl>${items}</dl>`;
}

export function formatQuote(text: string, author?: string): string {
  const authorText = author ? `<cite>— ${author}</cite>` : '';
  return `<blockquote>${text}${authorText}</blockquote>`;
}

export function formatCode(code: string, language?: string): string {
  const langClass = language ? ` class="language-${language}"` : '';
  return `<pre><code${langClass}>${code}</code></pre>`;
}

export function formatTable(data: string[][], headers?: string[]): string {
  if (!data || data.length === 0) return '';
  
  const headerRow = headers 
    ? `<thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`
    : '';
  
  const bodyRows = data
    .map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`)
    .join('');
  
  return `<table>${headerRow}<tbody>${bodyRows}</tbody></table>`;
}

export function formatNumber(num: number, decimals: number = 0): string {
  return num.toFixed(decimals);
}

export function formatPercentage(value: number, total: number): string {
  const percentage = (value / total) * 100;
  return `${formatNumber(percentage, 1)}%`;
}

export function formatTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hour${hours !== 1 ? 's' : ''}`;
  }
  
  return `${hours}h ${remainingMinutes}m`;
}

export function formatDifficulty(difficulty: string): string {
  const difficultyMap: Record<string, string> = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate',
    'advanced': 'Advanced',
    'easy': 'Easy',
    'medium': 'Medium',
    'hard': 'Hard'
  };
  
  return difficultyMap[difficulty.toLowerCase()] || difficulty;
}

export function formatLanguage(language: string): string {
  const languageMap: Record<string, string> = {
    'spanish': 'Spanish',
    'french': 'French',
    'german': 'German',
    'italian': 'Italian',
    'portuguese': 'Portuguese',
    'english': 'English'
  };
  
  return languageMap[language.toLowerCase()] || language;
}

export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (!text || text.length <= maxLength) return text;
  
  return text.substring(0, maxLength - suffix.length) + suffix;
}

export function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function capitalizeWords(text: string): string {
  if (!text) return '';
  return text.replace(/\b\w/g, char => char.toUpperCase());
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stripHTML(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}

export function extractTextContent(html: string): string {
  return stripHTML(html)
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .trim();
}

export function wordCount(text: string): number {
  if (!text) return 0;
  return extractTextContent(text)
    .split(/\s+/)
    .filter(word => word.length > 0)
    .length;
}

export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const words = wordCount(text);
  return Math.ceil(words / wordsPerMinute);
}

export function formatAnswerKey(answers: Record<string, any>): string {
  if (!answers || Object.keys(answers).length === 0) return '';
  
  const sections = Object.entries(answers).map(([section, sectionAnswers]) => {
    const sectionTitle = section.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase());
    
    let answerContent = '';
    if (Array.isArray(sectionAnswers)) {
      answerContent = sectionAnswers
        .map((answer, index) => `<div class="answer-item"><span class="answer-number">${index + 1}</span>${answer}</div>`)
        .join('');
    } else {
      answerContent = `<div class="answer-item">${sectionAnswers}</div>`;
    }
    
    return `
      <div class="answer-section">
        <h3 class="answer-section-title">${sectionTitle}</h3>
        ${answerContent}
      </div>
    `;
  }).join('');
  
  return `
    <div class="answer-key">
      <h2 class="answer-key-title">Answer Key</h2>
      ${sections}
    </div>
  `;
}

export function formatInstructions(instructions: string | string[]): string {
  if (!instructions) return '';
  
  if (Array.isArray(instructions)) {
    return formatList(instructions, true);
  }
  
  return formatText(instructions);
}

export function formatVocabularyList(vocabulary: Array<{word: string, definition: string, translation?: string}>): string {
  if (!vocabulary || vocabulary.length === 0) return '';
  
  return vocabulary
    .map(({word, definition, translation}) => {
      const translationText = translation ? ` (${translation})` : '';
      return `<div class="vocab-item"><strong>${word}</strong>${translationText}: ${definition}</div>`;
    })
    .join('');
}

/**
 * Utility: normalize a value that may have been stored as a JSON string in the DB.
 * If the value is a string, attempt to parse it as JSON. Otherwise return as-is.
 */
export function parseMaybeJSON(value: any): any {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (err) {
    console.warn('⚠️ [content-formatter] Failed to JSON.parse value, returning original string', err);
    return value;
  }
}
