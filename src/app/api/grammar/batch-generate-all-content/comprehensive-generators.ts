// Comprehensive Spanish grammar content generators

export function generateVerbExercisesComprehensive(name: string, slug: string) {
  const exercises = [];
  
  if (slug.includes('present-tense') || slug.includes('present')) {
    exercises.push({
      type: 'conjugation',
      instructions: 'Conjugate the verbs in present tense',
      prompts: [
        { sentence: 'Yo _____ (hablar) español', answer: 'hablo', explanation: 'First person singular: -ar verbs end in -o' },
        { sentence: 'Tú _____ (comer) pizza', answer: 'comes', explanation: 'Second person singular: -er verbs end in -es' },
        { sentence: 'Él _____ (vivir) en Madrid', answer: 'vive', explanation: 'Third person singular: -ir verbs end in -e' },
        { sentence: 'Nosotros _____ (estudiar)', answer: 'estudiamos', explanation: 'First person plural: -ar verbs end in -amos' },
        { sentence: 'Ellos _____ (escribir) cartas', answer: 'escriben', explanation: 'Third person plural: -ir verbs end in -en' }
      ]
    });
    
    exercises.push({
      type: 'fill_blank',
      instructions: 'Complete the sentences with the correct present tense form',
      prompts: [
        { sentence: 'María _____ en la biblioteca todos los días.', answer: 'estudia', explanation: 'Third person singular of estudiar' },
        { sentence: 'Los niños _____ en el parque.', answer: 'juegan', explanation: 'Third person plural of jugar (stem-changing verb)' },
        { sentence: 'Yo _____ café por la mañana.', answer: 'bebo', explanation: 'First person singular of beber' },
        { sentence: 'Nosotros _____ la televisión.', answer: 'vemos', explanation: 'First person plural of ver' },
        { sentence: '¿Tú _____ francés?', answer: 'hablas', explanation: 'Second person singular of hablar' }
      ]
    });
  }
  
  if (slug.includes('preterite')) {
    exercises.push({
      type: 'conjugation',
      instructions: 'Conjugate the verbs in preterite tense',
      prompts: [
        { sentence: 'Yo _____ (hablar) con él ayer', answer: 'hablé', explanation: 'First person singular preterite: -ar verbs end in -é' },
        { sentence: 'Tú _____ (comer) en el restaurante', answer: 'comiste', explanation: 'Second person singular preterite: -er verbs end in -iste' },
        { sentence: 'Ella _____ (vivir) en París', answer: 'vivió', explanation: 'Third person singular preterite: -ir verbs end in -ió' },
        { sentence: 'Nosotros _____ (estudiar) mucho', answer: 'estudiamos', explanation: 'First person plural preterite: -ar verbs end in -amos' },
        { sentence: 'Ellos _____ (escribir) una carta', answer: 'escribieron', explanation: 'Third person plural preterite: -ir verbs end in -ieron' }
      ]
    });
  }
  
  if (slug.includes('ser-vs-estar') || slug.includes('ser') || slug.includes('estar')) {
    exercises.push({
      type: 'multiple_choice',
      instructions: 'Choose between ser and estar',
      prompts: [
        { 
          sentence: 'Mi hermana _____ médica.', 
          answer: 'es', 
          options: ['es', 'está', 'son', 'están'],
          explanation: 'Use "ser" for professions and permanent characteristics' 
        },
        { 
          sentence: 'La comida _____ muy rica.', 
          answer: 'está', 
          options: ['es', 'está', 'son', 'están'],
          explanation: 'Use "estar" for temporary states like taste' 
        },
        { 
          sentence: 'Nosotros _____ de España.', 
          answer: 'somos', 
          options: ['somos', 'estamos', 'es', 'está'],
          explanation: 'Use "ser" for origin and nationality' 
        }
      ]
    });
  }
  
  // Add more generic verb exercises
  exercises.push({
    type: 'translation',
    instructions: 'Translate these sentences to Spanish',
    prompts: [
      { sentence: 'I speak Spanish', answer: 'Yo hablo español', explanation: 'Present tense first person singular' },
      { sentence: 'They eat pizza', answer: 'Ellos comen pizza', explanation: 'Present tense third person plural' },
      { sentence: 'We live in Madrid', answer: 'Nosotros vivimos en Madrid', explanation: 'Present tense first person plural' }
    ]
  });
  
  return exercises;
}

export function generateNounExercisesComprehensive(name: string, slug: string) {
  const exercises = [];
  
  if (slug.includes('gender')) {
    exercises.push({
      type: 'multiple_choice',
      instructions: 'Choose the correct article for each noun',
      prompts: [
        { 
          sentence: '_____ mesa', 
          answer: 'la', 
          options: ['la', 'el', 'las', 'los'],
          explanation: 'Mesa is feminine, so it uses "la"' 
        },
        { 
          sentence: '_____ libro', 
          answer: 'el', 
          options: ['la', 'el', 'las', 'los'],
          explanation: 'Libro is masculine, so it uses "el"' 
        },
        { 
          sentence: '_____ problema', 
          answer: 'el', 
          options: ['la', 'el', 'las', 'los'],
          explanation: 'Problema is masculine despite ending in -a' 
        }
      ]
    });
  }
  
  if (slug.includes('plural')) {
    exercises.push({
      type: 'fill_blank',
      instructions: 'Write the plural form of these nouns',
      prompts: [
        { sentence: 'casa → _____', answer: 'casas', explanation: 'Add -s to nouns ending in vowels' },
        { sentence: 'animal → _____', answer: 'animales', explanation: 'Add -es to nouns ending in consonants' },
        { sentence: 'lápiz → _____', answer: 'lápices', explanation: 'Change z to c and add -es' },
        { sentence: 'ciudad → _____', answer: 'ciudades', explanation: 'Add -es to nouns ending in consonants' }
      ]
    });
  }
  
  exercises.push({
    type: 'matching',
    instructions: 'Match the nouns with their correct articles',
    prompts: [
      { sentence: 'agua', answer: 'el', explanation: 'Agua is feminine but uses el for phonetic reasons' },
      { sentence: 'mano', answer: 'la', explanation: 'Mano is feminine despite ending in -o' },
      { sentence: 'día', answer: 'el', explanation: 'Día is masculine despite ending in -a' }
    ]
  });
  
  return exercises;
}

export function generateAdjectiveExercisesComprehensive(name: string, slug: string) {
  const exercises = [];
  
  if (slug.includes('agreement')) {
    exercises.push({
      type: 'fill_blank',
      instructions: 'Make the adjectives agree with the nouns',
      prompts: [
        { sentence: 'La casa _____ (blanco)', answer: 'blanca', explanation: 'Feminine singular: blanco → blanca' },
        { sentence: 'Los coches _____ (rojo)', answer: 'rojos', explanation: 'Masculine plural: rojo → rojos' },
        { sentence: 'Las flores _____ (bonito)', answer: 'bonitas', explanation: 'Feminine plural: bonito → bonitas' },
        { sentence: 'El libro _____ (interesante)', answer: 'interesante', explanation: 'Adjectives ending in -e don\'t change for gender' }
      ]
    });
  }
  
  if (slug.includes('position')) {
    exercises.push({
      type: 'multiple_choice',
      instructions: 'Choose the correct adjective placement',
      prompts: [
        { 
          sentence: 'Es _____ hombre _____', 
          answer: 'un buen hombre', 
          options: ['un bueno hombre', 'un buen hombre', 'un hombre bueno', 'hombre un bueno'],
          explanation: 'Bueno shortens to buen before masculine singular nouns' 
        }
      ]
    });
  }
  
  return exercises;
}

export function generatePronounExercisesComprehensive(name: string, slug: string) {
  const exercises = [];
  
  exercises.push({
    type: 'substitution',
    instructions: 'Replace the nouns with the correct pronouns',
    prompts: [
      { sentence: 'María habla español', answer: 'Ella habla español', explanation: 'María is replaced by ella (she)' },
      { sentence: 'Los estudiantes estudian', answer: 'Ellos estudian', explanation: 'Los estudiantes is replaced by ellos (they)' },
      { sentence: 'El profesor enseña', answer: 'Él enseña', explanation: 'El profesor is replaced by él (he)' }
    ]
  });
  
  if (slug.includes('direct-object')) {
    exercises.push({
      type: 'fill_blank',
      instructions: 'Replace the direct object with a pronoun',
      prompts: [
        { sentence: 'Veo la película → _____ veo', answer: 'La', explanation: 'La película becomes la (it/her)' },
        { sentence: 'Compramos los libros → _____ compramos', answer: 'Los', explanation: 'Los libros becomes los (them)' }
      ]
    });
  }
  
  return exercises;
}

export function generatePrepositionExercisesComprehensive(name: string, slug: string) {
  const exercises = [];
  
  exercises.push({
    type: 'multiple_choice',
    instructions: 'Choose the correct preposition',
    prompts: [
      { 
        sentence: 'Voy _____ la escuela', 
        answer: 'a', 
        options: ['a', 'en', 'de', 'por'],
        explanation: 'Use "a" to indicate direction/destination' 
      },
      { 
        sentence: 'Estoy _____ casa', 
        answer: 'en', 
        options: ['a', 'en', 'de', 'por'],
        explanation: 'Use "en" to indicate location' 
      }
    ]
  });
  
  return exercises;
}

export function generateGenericExercisesComprehensive(name: string, slug: string, category: string) {
  const exercises = [];

  // Generate category-specific content instead of generic placeholders
  if (category === 'articles') {
    return generateArticleExercises(name, slug);
  } else if (category === 'word-formation') {
    return generateWordFormationExercises(name, slug);
  } else if (category === 'sounds-spelling') {
    return generateSoundsSpellingExercises(name, slug);
  } else if (category === 'adverbial-prepositional') {
    return generateAdverbialPrepositionalExercises(name, slug);
  } else if (category === 'adverbs') {
    return generateAdverbExercises(name, slug);
  }

  // Fallback with actual Spanish content
  exercises.push({
    type: 'fill_blank',
    instructions: `Complete the sentences with correct Spanish grammar`,
    prompts: [
      { sentence: 'Yo _____ estudiante.', answer: 'soy', explanation: 'Use "soy" (I am) with ser for identity' },
      { sentence: 'La casa _____ grande.', answer: 'es', explanation: 'Use "es" (is) with ser for characteristics' },
      { sentence: 'Nosotros _____ en Madrid.', answer: 'estamos', explanation: 'Use "estamos" (we are) with estar for location' },
      { sentence: 'Ellos _____ español.', answer: 'hablan', explanation: 'Third person plural present tense of hablar' },
      { sentence: 'Mi hermana _____ médica.', answer: 'es', explanation: 'Use ser for professions' }
    ]
  });

  exercises.push({
    type: 'multiple_choice',
    instructions: 'Choose the correct Spanish word or phrase',
    prompts: [
      {
        sentence: '_____ libro está en la mesa.',
        answer: 'El',
        options: ['El', 'La', 'Los', 'Las'],
        explanation: 'Libro is masculine singular, so use "el"'
      },
      {
        sentence: 'María _____ muy inteligente.',
        answer: 'es',
        options: ['es', 'está', 'son', 'están'],
        explanation: 'Use "es" with ser for permanent characteristics'
      },
      {
        sentence: '¿_____ años tienes?',
        answer: 'Cuántos',
        options: ['Cuántos', 'Cuántas', 'Cuándo', 'Dónde'],
        explanation: 'Use "cuántos" (how many) with masculine plural años'
      }
    ]
  });

  return exercises;
}

function generateArticleExercises(name: string, slug: string) {
  const exercises = [];

  exercises.push({
    type: 'multiple_choice',
    instructions: 'Choose the correct definite article',
    prompts: [
      {
        sentence: '_____ mesa',
        answer: 'la',
        options: ['la', 'el', 'las', 'los'],
        explanation: 'Mesa is feminine singular, so use "la"'
      },
      {
        sentence: '_____ libros',
        answer: 'los',
        options: ['la', 'el', 'las', 'los'],
        explanation: 'Libros is masculine plural, so use "los"'
      },
      {
        sentence: '_____ agua',
        answer: 'el',
        options: ['la', 'el', 'las', 'los'],
        explanation: 'Agua is feminine but uses "el" for phonetic reasons'
      },
      {
        sentence: '_____ casas',
        answer: 'las',
        options: ['la', 'el', 'las', 'los'],
        explanation: 'Casas is feminine plural, so use "las"'
      }
    ]
  });

  exercises.push({
    type: 'fill_blank',
    instructions: 'Complete with the correct indefinite article',
    prompts: [
      { sentence: 'Tengo _____ perro.', answer: 'un', explanation: 'Perro is masculine, so use "un"' },
      { sentence: 'Ella es _____ profesora.', answer: 'una', explanation: 'Profesora is feminine, so use "una"' },
      { sentence: 'Hay _____ estudiantes aquí.', answer: 'unos', explanation: 'Estudiantes is masculine plural, so use "unos"' },
      { sentence: 'Veo _____ flores bonitas.', answer: 'unas', explanation: 'Flores is feminine plural, so use "unas"' }
    ]
  });

  return exercises;
}

function generateWordFormationExercises(name: string, slug: string) {
  const exercises = [];

  if (slug.includes('diminutive')) {
    exercises.push({
      type: 'transformation',
      instructions: 'Form diminutives using -ito/-ita',
      prompts: [
        { sentence: 'casa → _____', answer: 'casita', explanation: 'Add -ita to feminine nouns' },
        { sentence: 'perro → _____', answer: 'perrito', explanation: 'Add -ito to masculine nouns' },
        { sentence: 'gato → _____', answer: 'gatito', explanation: 'Add -ito to masculine nouns' },
        { sentence: 'mesa → _____', answer: 'mesita', explanation: 'Add -ita to feminine nouns' }
      ]
    });
  } else if (slug.includes('augmentative')) {
    exercises.push({
      type: 'transformation',
      instructions: 'Form augmentatives using -ón/-ona',
      prompts: [
        { sentence: 'casa → _____', answer: 'casona', explanation: 'Add -ona to make it bigger' },
        { sentence: 'hombre → _____', answer: 'hombrón', explanation: 'Add -ón to masculine nouns' },
        { sentence: 'mujer → _____', answer: 'mujerona', explanation: 'Add -ona to feminine nouns' }
      ]
    });
  }

  return exercises;
}

function generateSoundsSpellingExercises(name: string, slug: string) {
  const exercises = [];

  exercises.push({
    type: 'multiple_choice',
    instructions: 'Choose the word with correct spelling',
    prompts: [
      {
        sentence: 'Which is correct?',
        answer: 'corazón',
        options: ['corazon', 'corazón', 'coraçon', 'corasón'],
        explanation: 'Corazón needs an accent on the ó'
      },
      {
        sentence: 'Which is correct?',
        answer: 'niño',
        options: ['nino', 'niño', 'ninyo', 'ninio'],
        explanation: 'Niño uses ñ, not n'
      }
    ]
  });

  return exercises;
}

function generateAdverbialPrepositionalExercises(name: string, slug: string) {
  const exercises = [];

  exercises.push({
    type: 'multiple_choice',
    instructions: 'Choose the correct preposition or adverb',
    prompts: [
      {
        sentence: 'Voy _____ casa.',
        answer: 'a',
        options: ['a', 'en', 'de', 'por'],
        explanation: 'Use "a" to indicate direction'
      },
      {
        sentence: 'Estoy _____ la biblioteca.',
        answer: 'en',
        options: ['a', 'en', 'de', 'por'],
        explanation: 'Use "en" to indicate location'
      }
    ]
  });

  return exercises;
}

function generateAdverbExercises(name: string, slug: string) {
  const exercises = [];

  exercises.push({
    type: 'transformation',
    instructions: 'Form adverbs from adjectives using -mente',
    prompts: [
      { sentence: 'rápido → _____', answer: 'rápidamente', explanation: 'Add -mente to form adverbs' },
      { sentence: 'fácil → _____', answer: 'fácilmente', explanation: 'Add -mente to adjectives ending in consonants' },
      { sentence: 'normal → _____', answer: 'normalmente', explanation: 'Add -mente to form adverbs' }
    ]
  });

  return exercises;
}

// Question generators for quizzes
export function generateVerbQuestionsComprehensive(name: string, slug: string) {
  const questions = [];

  if (slug.includes('present-tense') || slug.includes('present')) {
    questions.push(
      {
        question_text: 'What is the correct conjugation of "hablar" for "yo"?',
        correct_answer: 'hablo',
        options: ['hablo', 'hablas', 'habla', 'hablamos'],
        explanation: 'First person singular present tense of hablar is "hablo"',
        difficulty: 'beginner'
      },
      {
        question_text: 'Choose the correct form: "Ellos _____ español"',
        correct_answer: 'hablan',
        options: ['habla', 'hablas', 'hablan', 'hablamos'],
        explanation: 'Third person plural present tense requires "hablan"',
        difficulty: 'beginner'
      },
      {
        question_text: 'Which verb form is correct: "Nosotros _____ en el restaurante"?',
        correct_answer: 'comemos',
        options: ['como', 'comes', 'come', 'comemos'],
        explanation: 'First person plural of comer is "comemos"',
        difficulty: 'intermediate'
      }
    );
  }

  if (slug.includes('ser-vs-estar')) {
    questions.push(
      {
        question_text: 'When do you use "ser" instead of "estar"?',
        correct_answer: 'For permanent characteristics and professions',
        options: ['For temporary states', 'For permanent characteristics and professions', 'For locations only', 'For emotions only'],
        explanation: 'Ser is used for permanent characteristics, professions, and identity',
        difficulty: 'intermediate'
      },
      {
        question_text: 'Complete: "La comida _____ deliciosa"',
        correct_answer: 'está',
        options: ['es', 'está', 'son', 'están'],
        explanation: 'Use "estar" for temporary states like how food tastes',
        difficulty: 'intermediate'
      }
    );
  }

  // Add more generic questions
  questions.push({
    question_text: `Which statement about ${name.toLowerCase()} is most accurate?`,
    correct_answer: 'It follows specific Spanish grammar rules',
    options: ['It follows specific Spanish grammar rules', 'It has no rules', 'It\'s the same as English', 'It\'s optional'],
    explanation: `${name} follows specific patterns in Spanish grammar`,
    difficulty: 'beginner'
  });

  return questions;
}

export function generateNounQuestionsComprehensive(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'What is the gender of "mesa"?',
      correct_answer: 'feminine',
      options: ['masculine', 'feminine', 'neutral', 'both'],
      explanation: 'Mesa is feminine, indicated by the article "la mesa"',
      difficulty: 'beginner'
    },
    {
      question_text: 'What is the plural of "animal"?',
      correct_answer: 'animales',
      options: ['animals', 'animales', 'animalos', 'animalas'],
      explanation: 'Add -es to nouns ending in consonants',
      difficulty: 'beginner'
    },
    {
      question_text: 'Which noun is an exception to the gender rule?',
      correct_answer: 'el problema',
      options: ['la mesa', 'el libro', 'el problema', 'la casa'],
      explanation: 'Problema is masculine despite ending in -a',
      difficulty: 'intermediate'
    }
  );

  return questions;
}

export function generateAdjectiveQuestionsComprehensive(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'How should "rojo" agree with "casas"?',
      correct_answer: 'rojas',
      options: ['rojo', 'roja', 'rojos', 'rojas'],
      explanation: 'Casas is feminine plural, so the adjective becomes "rojas"',
      difficulty: 'beginner'
    },
    {
      question_text: 'What happens to "bueno" before a masculine singular noun?',
      correct_answer: 'It becomes "buen"',
      options: ['It stays "bueno"', 'It becomes "buen"', 'It becomes "buena"', 'It becomes "buenos"'],
      explanation: 'Bueno shortens to "buen" before masculine singular nouns',
      difficulty: 'intermediate'
    }
  );

  return questions;
}

export function generatePronounQuestionsComprehensive(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'What pronoun replaces "María"?',
      correct_answer: 'ella',
      options: ['él', 'ella', 'ellos', 'ellas'],
      explanation: 'María is a feminine singular name, replaced by "ella"',
      difficulty: 'beginner'
    },
    {
      question_text: 'How do you say "I see it" (referring to "la película")?',
      correct_answer: 'La veo',
      options: ['Lo veo', 'La veo', 'Le veo', 'Les veo'],
      explanation: 'La película is feminine, so use "la" as the direct object pronoun',
      difficulty: 'intermediate'
    }
  );

  return questions;
}

export function generatePrepositionQuestionsComprehensive(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'Which preposition indicates direction: "Voy ___ la escuela"?',
      correct_answer: 'a',
      options: ['a', 'en', 'de', 'por'],
      explanation: 'Use "a" to indicate movement toward a destination',
      difficulty: 'beginner'
    },
    {
      question_text: 'Complete: "Estoy ___ casa"',
      correct_answer: 'en',
      options: ['a', 'en', 'de', 'por'],
      explanation: 'Use "en" to indicate location or being inside',
      difficulty: 'beginner'
    }
  );

  return questions;
}

export function generateGenericQuestionsComprehensive(name: string, slug: string, category: string) {
  const questions = [];

  // Generate category-specific questions instead of generic ones
  if (category === 'articles') {
    return generateArticleQuestions(name, slug);
  } else if (category === 'word-formation') {
    return generateWordFormationQuestions(name, slug);
  } else if (category === 'sounds-spelling') {
    return generateSoundsSpellingQuestions(name, slug);
  } else if (category === 'adverbial-prepositional') {
    return generateAdverbialPrepositionalQuestions(name, slug);
  } else if (category === 'adverbs') {
    return generateAdverbQuestions(name, slug);
  }

  // Fallback with actual Spanish grammar questions
  questions.push(
    {
      question_text: 'What is the correct form of "ser" for "yo"?',
      correct_answer: 'soy',
      options: ['soy', 'eres', 'es', 'somos'],
      explanation: 'First person singular of ser is "soy"',
      difficulty: 'beginner'
    },
    {
      question_text: 'Which article goes with "mesa"?',
      correct_answer: 'la',
      options: ['la', 'el', 'las', 'los'],
      explanation: 'Mesa is feminine singular, so it uses "la"',
      difficulty: 'beginner'
    },
    {
      question_text: 'How do you say "They speak" in Spanish?',
      correct_answer: 'Ellos hablan',
      options: ['Ellos hablan', 'Ellos habla', 'Ellos hablamos', 'Ellos hablas'],
      explanation: 'Third person plural present tense of hablar is "hablan"',
      difficulty: 'intermediate'
    },
    {
      question_text: 'When do you use "estar" instead of "ser"?',
      correct_answer: 'For temporary states and locations',
      options: ['For permanent characteristics', 'For temporary states and locations', 'For professions only', 'Never'],
      explanation: 'Estar is used for temporary states, locations, and conditions',
      difficulty: 'intermediate'
    }
  );

  return questions;
}

function generateArticleQuestions(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'What is the definite article for "mesa"?',
      correct_answer: 'la',
      options: ['la', 'el', 'las', 'los'],
      explanation: 'Mesa is feminine singular, so it uses "la"',
      difficulty: 'beginner'
    },
    {
      question_text: 'Which article is used with "agua"?',
      correct_answer: 'el',
      options: ['la', 'el', 'las', 'los'],
      explanation: 'Agua is feminine but uses "el" for phonetic reasons',
      difficulty: 'intermediate'
    },
    {
      question_text: 'What is the indefinite article for feminine nouns?',
      correct_answer: 'una',
      options: ['un', 'una', 'unos', 'unas'],
      explanation: 'Una is the indefinite article for feminine singular nouns',
      difficulty: 'beginner'
    }
  );

  return questions;
}

function generateWordFormationQuestions(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'What is the diminutive of "casa"?',
      correct_answer: 'casita',
      options: ['casita', 'casota', 'casilla', 'casona'],
      explanation: 'Add -ita to feminine nouns to form diminutives',
      difficulty: 'beginner'
    },
    {
      question_text: 'How do you form the augmentative of "hombre"?',
      correct_answer: 'hombrón',
      options: ['hombrito', 'hombrón', 'hombrecito', 'hombrezco'],
      explanation: 'Add -ón to masculine nouns to form augmentatives',
      difficulty: 'intermediate'
    }
  );

  return questions;
}

function generateSoundsSpellingQuestions(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'Which word is spelled correctly?',
      correct_answer: 'corazón',
      options: ['corazon', 'corazón', 'coraçon', 'corasón'],
      explanation: 'Corazón needs an accent on the ó',
      difficulty: 'beginner'
    },
    {
      question_text: 'What letter is used in Spanish for the "ny" sound?',
      correct_answer: 'ñ',
      options: ['n', 'ñ', 'ny', 'ni'],
      explanation: 'The letter ñ represents the "ny" sound in Spanish',
      difficulty: 'beginner'
    }
  );

  return questions;
}

function generateAdverbialPrepositionalQuestions(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'Which preposition indicates direction?',
      correct_answer: 'a',
      options: ['a', 'en', 'de', 'por'],
      explanation: 'Use "a" to indicate movement toward a destination',
      difficulty: 'beginner'
    },
    {
      question_text: 'Complete: "Estoy _____ casa"',
      correct_answer: 'en',
      options: ['a', 'en', 'de', 'por'],
      explanation: 'Use "en" to indicate location',
      difficulty: 'beginner'
    }
  );

  return questions;
}

function generateAdverbQuestions(name: string, slug: string) {
  const questions = [];

  questions.push(
    {
      question_text: 'How do you form adverbs from adjectives in Spanish?',
      correct_answer: 'Add -mente to the adjective',
      options: ['Add -mente to the adjective', 'Add -ly to the adjective', 'No change needed', 'Add -ción to the adjective'],
      explanation: 'Spanish adverbs are formed by adding -mente to adjectives',
      difficulty: 'beginner'
    },
    {
      question_text: 'What is the adverb form of "rápido"?',
      correct_answer: 'rápidamente',
      options: ['rápidamente', 'rápidoly', 'rápidos', 'rápida'],
      explanation: 'Add -mente to form "rápidamente" (quickly)',
      difficulty: 'beginner'
    }
  );

  return questions;
}
