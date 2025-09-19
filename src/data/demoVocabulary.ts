// Static demo vocabulary data for cost-efficient demo mode
// This avoids database calls while providing a good demo experience

export interface DemoVocabularyWord {
  id: string;
  term: string;
  translation: string;
  language: string;
  category: string;
  subcategory: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Demo vocabulary organized by language and category
export const DEMO_VOCABULARY: Record<string, Record<string, DemoVocabularyWord[]>> = {
  es: {
    greetings_introductions: [
      { id: 'demo-es-1', term: 'Hola', translation: 'Hello', language: 'es', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-es-2', term: 'Adiós', translation: 'Goodbye', language: 'es', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-es-3', term: 'Buenos días', translation: 'Good morning', language: 'es', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-es-4', term: 'Buenas tardes', translation: 'Good afternoon', language: 'es', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-es-5', term: 'Buenas noches', translation: 'Good evening', language: 'es', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
    ],
    common_phrases: [
      { id: 'demo-es-6', term: 'Por favor', translation: 'Please', language: 'es', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-es-7', term: 'Gracias', translation: 'Thank you', language: 'es', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-es-8', term: 'De nada', translation: 'You\'re welcome', language: 'es', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-es-9', term: 'Lo siento', translation: 'I\'m sorry', language: 'es', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-es-10', term: 'Disculpe', translation: 'Excuse me', language: 'es', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
    ],
    numbers_1_30: [
      { id: 'demo-es-11', term: 'uno', translation: 'one', language: 'es', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-es-12', term: 'dos', translation: 'two', language: 'es', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-es-13', term: 'tres', translation: 'three', language: 'es', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-es-14', term: 'cuatro', translation: 'four', language: 'es', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-es-15', term: 'cinco', translation: 'five', language: 'es', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
    ],
    colours: [
      { id: 'demo-es-16', term: 'rojo', translation: 'red', language: 'es', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-es-17', term: 'azul', translation: 'blue', language: 'es', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-es-18', term: 'verde', translation: 'green', language: 'es', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-es-19', term: 'amarillo', translation: 'yellow', language: 'es', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-es-20', term: 'negro', translation: 'black', language: 'es', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
    ]
  },
  fr: {
    greetings_introductions: [
      { id: 'demo-fr-1', term: 'Bonjour', translation: 'Hello', language: 'fr', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-fr-2', term: 'Au revoir', translation: 'Goodbye', language: 'fr', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-fr-3', term: 'Bonsoir', translation: 'Good evening', language: 'fr', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-fr-4', term: 'Salut', translation: 'Hi/Bye', language: 'fr', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-fr-5', term: 'Bonne nuit', translation: 'Good night', language: 'fr', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
    ],
    common_phrases: [
      { id: 'demo-fr-6', term: 'S\'il vous plaît', translation: 'Please', language: 'fr', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-fr-7', term: 'Merci', translation: 'Thank you', language: 'fr', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-fr-8', term: 'De rien', translation: 'You\'re welcome', language: 'fr', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-fr-9', term: 'Pardon', translation: 'Sorry/Excuse me', language: 'fr', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-fr-10', term: 'Excusez-moi', translation: 'Excuse me', language: 'fr', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
    ],
    numbers_1_30: [
      { id: 'demo-fr-11', term: 'un', translation: 'one', language: 'fr', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-fr-12', term: 'deux', translation: 'two', language: 'fr', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-fr-13', term: 'trois', translation: 'three', language: 'fr', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-fr-14', term: 'quatre', translation: 'four', language: 'fr', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-fr-15', term: 'cinq', translation: 'five', language: 'fr', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
    ],
    colours: [
      { id: 'demo-fr-16', term: 'rouge', translation: 'red', language: 'fr', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-fr-17', term: 'bleu', translation: 'blue', language: 'fr', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-fr-18', term: 'vert', translation: 'green', language: 'fr', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-fr-19', term: 'jaune', translation: 'yellow', language: 'fr', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-fr-20', term: 'noir', translation: 'black', language: 'fr', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
    ]
  },
  de: {
    greetings_introductions: [
      { id: 'demo-de-1', term: 'Hallo', translation: 'Hello', language: 'de', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-de-2', term: 'Auf Wiedersehen', translation: 'Goodbye', language: 'de', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-de-3', term: 'Guten Morgen', translation: 'Good morning', language: 'de', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-de-4', term: 'Guten Tag', translation: 'Good day', language: 'de', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
      { id: 'demo-de-5', term: 'Gute Nacht', translation: 'Good night', language: 'de', category: 'basics_core_language', subcategory: 'greetings_introductions', difficulty: 'beginner' },
    ],
    common_phrases: [
      { id: 'demo-de-6', term: 'Bitte', translation: 'Please', language: 'de', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-de-7', term: 'Danke', translation: 'Thank you', language: 'de', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-de-8', term: 'Bitte schön', translation: 'You\'re welcome', language: 'de', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-de-9', term: 'Entschuldigung', translation: 'Sorry/Excuse me', language: 'de', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
      { id: 'demo-de-10', term: 'Verzeihung', translation: 'Pardon me', language: 'de', category: 'basics_core_language', subcategory: 'common_phrases', difficulty: 'beginner' },
    ],
    numbers_1_30: [
      { id: 'demo-de-11', term: 'eins', translation: 'one', language: 'de', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-de-12', term: 'zwei', translation: 'two', language: 'de', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-de-13', term: 'drei', translation: 'three', language: 'de', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-de-14', term: 'vier', translation: 'four', language: 'de', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
      { id: 'demo-de-15', term: 'fünf', translation: 'five', language: 'de', category: 'basics_core_language', subcategory: 'numbers_1_30', difficulty: 'beginner' },
    ],
    colours: [
      { id: 'demo-de-16', term: 'rot', translation: 'red', language: 'de', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-de-17', term: 'blau', translation: 'blue', language: 'de', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-de-18', term: 'grün', translation: 'green', language: 'de', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-de-19', term: 'gelb', translation: 'yellow', language: 'de', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
      { id: 'demo-de-20', term: 'schwarz', translation: 'black', language: 'de', category: 'basics_core_language', subcategory: 'colours', difficulty: 'beginner' },
    ]
  }
};

// Helper functions
export const getDemoVocabulary = (language: string, subcategory?: string): DemoVocabularyWord[] => {
  const langData = DEMO_VOCABULARY[language];
  if (!langData) return [];
  
  if (subcategory) {
    return langData[subcategory] || [];
  }
  
  // Return all vocabulary for the language
  return Object.values(langData).flat();
};

export const getDemoAvailableLanguages = (): string[] => {
  return Object.keys(DEMO_VOCABULARY);
};

export const getDemoAvailableSubcategories = (language: string): string[] => {
  const langData = DEMO_VOCABULARY[language];
  return langData ? Object.keys(langData) : [];
};

export const getDemoStats = () => ({
  totalWords: Object.values(DEMO_VOCABULARY).reduce((total, lang) => 
    total + Object.values(lang).reduce((langTotal, words) => langTotal + words.length, 0), 0
  ),
  languages: Object.keys(DEMO_VOCABULARY).length,
  categories: 1, // Only basics_core_language
  subcategories: 4 // greetings, phrases, numbers, colours
});
