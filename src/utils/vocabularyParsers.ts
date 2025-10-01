/**
 * Vocabulary Parsers
 * Utilities for parsing vocabulary input in various formats
 */

export interface ParsedVocabularyItem {
  term: string;
  translation: string;
  context_sentence?: string;
  notes?: string;
}

export type InputFormat = 'auto' | 'equals' | 'comma' | 'tab' | 'semicolon' | 'pipe';

/**
 * Parse vocabulary from text input with specified format
 */
export function parseVocabulary(text: string, format: InputFormat = 'auto'): ParsedVocabularyItem[] {
  if (!text || text.trim() === '') {
    return [];
  }

  const lines = text.trim().split('\n');
  const items: ParsedVocabularyItem[] = [];

  for (const line of lines) {
    const trimmedLine = line.trim();
    
    // Skip empty lines
    if (!trimmedLine) continue;
    
    // Skip comment lines (starting with # or //)
    if (trimmedLine.startsWith('#') || trimmedLine.startsWith('//')) continue;

    const parsed = parseLine(trimmedLine, format);
    if (parsed) {
      items.push(parsed);
    }
  }

  return items;
}

/**
 * Parse a single line of vocabulary
 */
function parseLine(line: string, format: InputFormat): ParsedVocabularyItem | null {
  let term = '';
  let translation = '';
  let context_sentence = '';
  let notes = '';

  if (format === 'auto') {
    // Auto-detect delimiter based on priority
    if (line.includes('=')) {
      return parseWithDelimiter(line, '=');
    } else if (line.includes('\t')) {
      return parseWithDelimiter(line, '\t');
    } else if (line.includes('|')) {
      return parseWithDelimiter(line, '|');
    } else if (line.includes(';')) {
      return parseWithDelimiter(line, ';');
    } else if (line.includes(',')) {
      return parseWithDelimiter(line, ',');
    } else {
      // No delimiter found, skip this line
      return null;
    }
  } else if (format === 'equals') {
    return parseWithDelimiter(line, '=');
  } else if (format === 'comma') {
    return parseWithDelimiter(line, ',');
  } else if (format === 'tab') {
    return parseWithDelimiter(line, '\t');
  } else if (format === 'semicolon') {
    return parseWithDelimiter(line, ';');
  } else if (format === 'pipe') {
    return parseWithDelimiter(line, '|');
  }

  return null;
}

/**
 * Parse line with specific delimiter
 * Supports 2-4 columns: term, translation, [context], [notes]
 */
function parseWithDelimiter(line: string, delimiter: string): ParsedVocabularyItem | null {
  const parts = line.split(delimiter).map(s => s.trim());

  if (parts.length < 2) {
    return null; // Need at least term and translation
  }

  const item: ParsedVocabularyItem = {
    term: parts[0],
    translation: parts[1]
  };

  // Optional third column: context sentence
  if (parts.length >= 3 && parts[2]) {
    item.context_sentence = parts[2];
  }

  // Optional fourth column: notes
  if (parts.length >= 4 && parts[3]) {
    item.notes = parts[3];
  }

  return item;
}

/**
 * Detect the most likely format from sample text
 */
export function detectFormat(text: string): InputFormat {
  if (!text || text.trim() === '') {
    return 'auto';
  }

  const lines = text.trim().split('\n').filter(l => l.trim() !== '');
  if (lines.length === 0) {
    return 'auto';
  }

  // Count delimiter occurrences across all lines
  const delimiters = {
    equals: 0,
    tab: 0,
    pipe: 0,
    semicolon: 0,
    comma: 0
  };

  for (const line of lines) {
    if (line.includes('=')) delimiters.equals++;
    if (line.includes('\t')) delimiters.tab++;
    if (line.includes('|')) delimiters.pipe++;
    if (line.includes(';')) delimiters.semicolon++;
    if (line.includes(',')) delimiters.comma++;
  }

  // Find the most common delimiter
  const maxCount = Math.max(...Object.values(delimiters));
  
  if (maxCount === 0) {
    return 'auto'; // No delimiters found
  }

  // Return the delimiter with highest count
  if (delimiters.equals === maxCount) return 'equals';
  if (delimiters.tab === maxCount) return 'tab';
  if (delimiters.pipe === maxCount) return 'pipe';
  if (delimiters.semicolon === maxCount) return 'semicolon';
  if (delimiters.comma === maxCount) return 'comma';

  return 'auto';
}

/**
 * Get placeholder text for each format
 */
export function getPlaceholderText(format: InputFormat): string {
  switch (format) {
    case 'equals':
      return 'casa = house\nperro = dog\ngato = cat';
    case 'comma':
      return 'casa, house\nperro, dog\ngato, cat';
    case 'tab':
      return 'casa\thouse\nperro\tdog\ngato\tcat\n\n(Paste from Excel or use Tab key)';
    case 'semicolon':
      return 'casa; house\nperro; dog\ngato; cat';
    case 'pipe':
      return 'casa | house\nperro | dog\ngato | cat';
    case 'auto':
    default:
      return 'casa = house\nperro, dog\ngato\tcat\n\n(Auto-detects format: =, comma, tab, semicolon, or pipe)';
  }
}

/**
 * Get format description
 */
export function getFormatDescription(format: InputFormat): string {
  switch (format) {
    case 'equals':
      return 'One word per line: word = translation';
    case 'comma':
      return 'One word per line: word, translation';
    case 'tab':
      return 'Tab-separated (Excel): word[TAB]translation';
    case 'semicolon':
      return 'One word per line: word; translation';
    case 'pipe':
      return 'One word per line: word | translation';
    case 'auto':
    default:
      return 'Automatically detects delimiter (=, comma, tab, semicolon, or pipe)';
  }
}

/**
 * Validate parsed vocabulary items
 */
export function validateVocabulary(items: ParsedVocabularyItem[]): {
  valid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (items.length === 0) {
    errors.push('No vocabulary items found. Please check your input format.');
    return { valid: false, errors, warnings };
  }

  // Check for duplicates
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  
  for (const item of items) {
    const key = item.term.toLowerCase();
    if (seen.has(key)) {
      duplicates.add(item.term);
    }
    seen.add(key);
  }

  if (duplicates.size > 0) {
    warnings.push(`Duplicate terms found: ${Array.from(duplicates).join(', ')}`);
  }

  // Check for empty terms or translations
  const emptyTerms = items.filter(item => !item.term || item.term.trim() === '');
  const emptyTranslations = items.filter(item => !item.translation || item.translation.trim() === '');

  if (emptyTerms.length > 0) {
    errors.push(`${emptyTerms.length} items have empty terms`);
  }

  if (emptyTranslations.length > 0) {
    errors.push(`${emptyTranslations.length} items have empty translations`);
  }

  // Check for very long terms (likely formatting errors)
  const longTerms = items.filter(item => item.term.length > 100);
  if (longTerms.length > 0) {
    warnings.push(`${longTerms.length} items have unusually long terms (>100 characters). Check formatting.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Format vocabulary items back to text
 */
export function formatVocabulary(items: ParsedVocabularyItem[], format: InputFormat = 'equals'): string {
  const delimiter = format === 'equals' ? ' = ' :
                   format === 'comma' ? ', ' :
                   format === 'tab' ? '\t' :
                   format === 'semicolon' ? '; ' :
                   format === 'pipe' ? ' | ' :
                   ' = ';

  return items.map(item => {
    const parts = [item.term, item.translation];
    if (item.context_sentence) parts.push(item.context_sentence);
    if (item.notes) parts.push(item.notes);
    return parts.join(delimiter);
  }).join('\n');
}

/**
 * Parse vocabulary from CSV format (with headers)
 */
export function parseCSV(text: string): ParsedVocabularyItem[] {
  const lines = text.trim().split('\n');
  if (lines.length === 0) return [];

  // Check if first line is a header
  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('term') || firstLine.includes('word') || 
                   firstLine.includes('spanish') || firstLine.includes('translation');

  const dataLines = hasHeader ? lines.slice(1) : lines;
  
  return dataLines
    .filter(line => line.trim() !== '')
    .map(line => parseWithDelimiter(line, ','))
    .filter((item): item is ParsedVocabularyItem => item !== null);
}

