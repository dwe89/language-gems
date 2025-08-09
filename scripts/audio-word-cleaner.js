#!/usr/bin/env node

/**
 * Audio Word Cleaner for LanguageGems
 * 
 * This utility cleans vocabulary words to extract only the speakable part
 * for audio generation, removing grammatical notation and formatting.
 * 
 * Examples:
 * - "amüsieren; sich acc. amüsieren" → "amüsieren"
 * - "llamar; llamarse" → "llamar"
 * - "el pie; a pie" → "el pie"
 * - "(aux)…begonnen" → "begonnen"
 * - "andere (r, s)" → "andere"
 */

/**
 * Clean a word for audio generation by removing grammatical notation
 */
function cleanWordForAudio(word, language = 'es') {
  if (!word || typeof word !== 'string') {
    return word;
  }

  let cleaned = word.trim();

  // Language-specific cleaning rules
  switch (language) {
    case 'de': // German
      cleaned = cleanGermanWord(cleaned);
      break;
    case 'es': // Spanish  
      cleaned = cleanSpanishWord(cleaned);
      break;
    case 'fr': // French
      cleaned = cleanFrenchWord(cleaned);
      break;
    default:
      cleaned = cleanGenericWord(cleaned);
  }

  return cleaned.trim();
}

/**
 * Clean German words
 */
function cleanGermanWord(word) {
  let cleaned = word;

  // Remove auxiliary verb notation: "(aux)…begonnen" → "begonnen"
  cleaned = cleaned.replace(/^\(aux\)…/, '');

  // Remove case/grammar notation: "sich acc. amüsieren" → "amüsieren"
  cleaned = cleaned.replace(/;\s*sich\s+(acc\.|dat\.|nom\.|gen\.)\s+.*$/, '');

  // Remove preposition notation: "ankommen (in dat. + noun)" → "ankommen"
  cleaned = cleaned.replace(/\s*\([^)]*dat\.[^)]*\)/, '');
  cleaned = cleaned.replace(/\s*\([^)]*acc\.[^)]*\)/, '');
  cleaned = cleaned.replace(/\s*\([^)]*\+[^)]*\)/, '');

  // Handle reflexive verbs: "amüsieren; sich acc. amüsieren" → "amüsieren"
  if (cleaned.includes(';')) {
    const parts = cleaned.split(';');
    // Take the first part (base verb)
    cleaned = parts[0].trim();
  }

  // Remove grammatical variants: "andere (r, s)" → "andere"
  cleaned = cleaned.replace(/\s*\([^)]*[rs],?\s*[rs]?\)/, '');

  // Remove parenthetical additions: "alles (Andere)" → "alles"
  cleaned = cleaned.replace(/\s*\([^)]*\)/, '');

  return cleaned;
}

/**
 * Clean Spanish words
 */
function cleanSpanishWord(word) {
  let cleaned = word;

  // Remove auxiliary verb notation: "(aux) … escrito" → "escrito"
  cleaned = cleaned.replace(/^\(aux\)\s*…\s*/, '');

  // Handle reflexive verbs: "llamar; llamarse" → "llamar"
  if (cleaned.includes(';')) {
    const parts = cleaned.split(';');
    // Take the first part (base verb)
    cleaned = parts[0].trim();
  }

  // Remove preposition notation: "consistir (en)" → "consistir"
  cleaned = cleaned.replace(/\s*\([^)]*\)/, '');

  // Handle compound expressions: "el pie; a pie" → "el pie"
  // For Spanish, we want to keep the article with the noun
  if (cleaned.includes(';') && (cleaned.startsWith('el ') || cleaned.startsWith('la ') || cleaned.startsWith('los ') || cleaned.startsWith('las '))) {
    const parts = cleaned.split(';');
    cleaned = parts[0].trim();
  }

  return cleaned;
}

/**
 * Clean French words
 */
function cleanFrenchWord(word) {
  let cleaned = word;

  // Handle reflexive verbs: "se laver; laver" → "se laver" (keep reflexive for French)
  if (cleaned.includes(';')) {
    const parts = cleaned.split(';');
    // For French, prefer the reflexive form if it starts with "se"
    if (parts[0].trim().startsWith('se ')) {
      cleaned = parts[0].trim();
    } else if (parts[1] && parts[1].trim().startsWith('se ')) {
      cleaned = parts[1].trim();
    } else {
      // Take the first part
      cleaned = parts[0].trim();
    }
  }

  // Remove parenthetical additions
  cleaned = cleaned.replace(/\s*\([^)]*\)/, '');

  return cleaned;
}

/**
 * Generic word cleaning for any language
 */
function cleanGenericWord(word) {
  let cleaned = word;

  // Remove auxiliary notation
  cleaned = cleaned.replace(/^\(aux\)[^a-zA-ZÀ-ÿ]*/, '');

  // Handle semicolon-separated alternatives - take the first part
  if (cleaned.includes(';')) {
    cleaned = cleaned.split(';')[0].trim();
  }

  // Remove parenthetical additions
  cleaned = cleaned.replace(/\s*\([^)]*\)/, '');

  // Remove pipe-separated alternatives - take the first part
  if (cleaned.includes('|')) {
    cleaned = cleaned.split('|')[0].trim();
  }

  return cleaned;
}

/**
 * Test the cleaning function with sample words
 */
function testCleaning() {
  const testCases = [
    // German
    { word: 'amüsieren; sich acc. amüsieren', language: 'de', expected: 'amüsieren' },
    { word: 'andere (r, s)', language: 'de', expected: 'andere' },
    { word: 'ankommen (in dat. + noun)', language: 'de', expected: 'ankommen' },
    { word: '(aux)…begonnen', language: 'de', expected: 'begonnen' },
    { word: 'alles (Andere)', language: 'de', expected: 'alles' },
    
    // Spanish
    { word: 'llamar; llamarse', language: 'es', expected: 'llamar' },
    { word: 'el pie; a pie', language: 'es', expected: 'el pie' },
    { word: '(aux) … escrito', language: 'es', expected: 'escrito' },
    { word: 'consistir (en)', language: 'es', expected: 'consistir' },
    { word: '(a) mí', language: 'es', expected: 'mí' },
    
    // French
    { word: 'se laver; laver', language: 'fr', expected: 'se laver' },
    { word: 'parler (de)', language: 'fr', expected: 'parler' }
  ];

  console.log('🧪 Testing Audio Word Cleaner...\n');
  
  let passed = 0;
  let failed = 0;

  testCases.forEach((test, index) => {
    const result = cleanWordForAudio(test.word, test.language);
    const success = result === test.expected;
    
    console.log(`Test ${index + 1}: ${success ? '✅' : '❌'}`);
    console.log(`  Input: "${test.word}" (${test.language})`);
    console.log(`  Expected: "${test.expected}"`);
    console.log(`  Got: "${result}"`);
    console.log('');
    
    if (success) {
      passed++;
    } else {
      failed++;
    }
  });

  console.log(`📊 Results: ${passed} passed, ${failed} failed`);
  return failed === 0;
}

/**
 * Process vocabulary data and add audio-friendly words
 */
function addAudioWordsToVocabulary(vocabularyData) {
  return vocabularyData.map(item => ({
    ...item,
    audio_word: cleanWordForAudio(item.word, item.language)
  }));
}

// Run tests if this file is executed directly
if (require.main === module) {
  const success = testCleaning();
  process.exit(success ? 0 : 1);
}

module.exports = {
  cleanWordForAudio,
  addAudioWordsToVocabulary,
  testCleaning
};
