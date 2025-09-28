// Content generators for Spanish grammar topics

export function generateVerbExercises(name: string, slug: string) {
  const exercises = [
    {
      type: 'conjugation',
      instructions: `Conjugate the verb in ${name.toLowerCase()}`,
      prompts: [
        { sentence: 'Yo _____ (hablar)', answer: 'hablo', explanation: 'First person singular conjugation' },
        { sentence: 'Tú _____ (comer)', answer: 'comes', explanation: 'Second person singular conjugation' },
        { sentence: 'Él _____ (vivir)', answer: 'vive', explanation: 'Third person singular conjugation' },
        { sentence: 'Nosotros _____ (estudiar)', answer: 'estudiamos', explanation: 'First person plural conjugation' },
        { sentence: 'Ellos _____ (escribir)', answer: 'escriben', explanation: 'Third person plural conjugation' }
      ]
    },
    {
      type: 'fill_blank',
      instructions: 'Complete the sentences with the correct verb form',
      prompts: [
        { sentence: 'María _____ en la biblioteca.', answer: 'estudia', explanation: 'Third person singular present tense' },
        { sentence: 'Los niños _____ en el parque.', answer: 'juegan', explanation: 'Third person plural present tense' },
        { sentence: 'Yo _____ café por la mañana.', answer: 'bebo', explanation: 'First person singular present tense' }
      ]
    },
    {
      type: 'translation',
      instructions: 'Translate these sentences to Spanish',
      prompts: [
        { sentence: 'I speak Spanish', answer: 'Yo hablo español', explanation: 'Present tense first person' },
        { sentence: 'They eat pizza', answer: 'Ellos comen pizza', explanation: 'Present tense third person plural' },
        { sentence: 'We live in Madrid', answer: 'Nosotros vivimos en Madrid', explanation: 'Present tense first person plural' }
      ]
    }
  ];
  
  return exercises;
}

export function generateNounExercises(name: string, slug: string) {
  const exercises = [
    {
      type: 'gender_identification',
      instructions: 'Identify the gender of these nouns',
      prompts: [
        { sentence: 'la mesa', answer: 'feminine', explanation: 'Ends in -a, typically feminine' },
        { sentence: 'el libro', answer: 'masculine', explanation: 'Ends in -o, typically masculine' },
        { sentence: 'la mano', answer: 'feminine', explanation: 'Exception: mano is feminine despite ending in -o' },
        { sentence: 'el problema', answer: 'masculine', explanation: 'Exception: problema is masculine despite ending in -a' }
      ]
    },
    {
      type: 'plural_formation',
      instructions: 'Form the plural of these nouns',
      prompts: [
        { sentence: 'casa', answer: 'casas', explanation: 'Add -s to nouns ending in vowels' },
        { sentence: 'animal', answer: 'animales', explanation: 'Add -es to nouns ending in consonants' },
        { sentence: 'lápiz', answer: 'lápices', explanation: 'Change z to c and add -es' }
      ]
    },
    {
      type: 'article_agreement',
      instructions: 'Choose the correct article',
      prompts: [
        { sentence: '_____ agua (the water)', answer: 'el', explanation: 'Agua is feminine but uses el for phonetic reasons' },
        { sentence: '_____ mesas (the tables)', answer: 'las', explanation: 'Feminine plural article' },
        { sentence: '_____ libros (the books)', answer: 'los', explanation: 'Masculine plural article' }
      ]
    }
  ];
  
  return exercises;
}

export function generateAdjectiveExercises(name: string, slug: string) {
  const exercises = [
    {
      type: 'agreement',
      instructions: 'Make the adjective agree with the noun',
      prompts: [
        { sentence: 'La casa _____ (blanco)', answer: 'blanca', explanation: 'Feminine singular agreement' },
        { sentence: 'Los coches _____ (rojo)', answer: 'rojos', explanation: 'Masculine plural agreement' },
        { sentence: 'Las flores _____ (bonito)', answer: 'bonitas', explanation: 'Feminine plural agreement' }
      ]
    },
    {
      type: 'position',
      instructions: 'Place the adjective in the correct position',
      prompts: [
        { sentence: 'un hombre (bueno)', answer: 'un buen hombre', explanation: 'Bueno shortens to buen before masculine singular nouns' },
        { sentence: 'una mujer (grande)', answer: 'una gran mujer', explanation: 'Grande shortens to gran before singular nouns for emphasis' }
      ]
    }
  ];
  
  return exercises;
}

export function generatePronounExercises(name: string, slug: string) {
  const exercises = [
    {
      type: 'substitution',
      instructions: 'Replace the noun with the correct pronoun',
      prompts: [
        { sentence: 'María habla español', answer: 'Ella habla español', explanation: 'María is replaced by ella (she)' },
        { sentence: 'Los estudiantes estudian', answer: 'Ellos estudian', explanation: 'Los estudiantes is replaced by ellos (they)' }
      ]
    },
    {
      type: 'direct_object',
      instructions: 'Replace the direct object with a pronoun',
      prompts: [
        { sentence: 'Veo la película', answer: 'La veo', explanation: 'La película becomes la (it/her)' },
        { sentence: 'Compramos los libros', answer: 'Los compramos', explanation: 'Los libros becomes los (them)' }
      ]
    }
  ];
  
  return exercises;
}

export function generatePrepositionExercises(name: string, slug: string) {
  const exercises = [
    {
      type: 'selection',
      instructions: 'Choose the correct preposition',
      prompts: [
        { sentence: 'Voy _____ la escuela (a/en)', answer: 'a', explanation: 'Use "a" to indicate direction/destination' },
        { sentence: 'Estoy _____ casa (a/en)', answer: 'en', explanation: 'Use "en" to indicate location' },
        { sentence: 'El libro es _____ María (de/por)', answer: 'de', explanation: 'Use "de" to indicate possession' }
      ]
    }
  ];
  
  return exercises;
}

export function generateGenericExercises(name: string, slug: string, category: string) {
  const exercises = [
    {
      type: 'multiple_choice',
      instructions: `Choose the correct option for ${name.toLowerCase()}`,
      prompts: [
        { 
          sentence: 'Complete the sentence correctly', 
          answer: 'Option A', 
          explanation: `This demonstrates the correct usage of ${name.toLowerCase()}`,
          options: ['Option A', 'Option B', 'Option C', 'Option D']
        }
      ]
    },
    {
      type: 'fill_blank',
      instructions: `Complete the sentences using ${name.toLowerCase()}`,
      prompts: [
        { sentence: 'This is an example _____', answer: 'sentence', explanation: `Example of ${name.toLowerCase()} usage` }
      ]
    }
  ];
  
  return exercises;
}

// Question generators for quizzes
export function generateVerbQuestions(name: string, slug: string) {
  const questions = [
    {
      question_text: 'What is the correct conjugation of "hablar" for "yo"?',
      correct_answer: 'hablo',
      options: ['hablo', 'hablas', 'habla', 'hablamos'],
      explanation: 'First person singular present tense of hablar is "hablo"'
    },
    {
      question_text: 'Choose the correct form: "Ellos _____ español"',
      correct_answer: 'hablan',
      options: ['habla', 'hablas', 'hablan', 'hablamos'],
      explanation: 'Third person plural present tense requires "hablan"'
    }
  ];
  
  return questions;
}

export function generateNounQuestions(name: string, slug: string) {
  const questions = [
    {
      question_text: 'What is the gender of "mesa"?',
      correct_answer: 'feminine',
      options: ['masculine', 'feminine', 'neutral', 'both'],
      explanation: 'Mesa is feminine, indicated by the article "la mesa"'
    },
    {
      question_text: 'What is the plural of "animal"?',
      correct_answer: 'animales',
      options: ['animals', 'animales', 'animalos', 'animalas'],
      explanation: 'Add -es to nouns ending in consonants'
    }
  ];
  
  return questions;
}

export function generateAdjectiveQuestions(name: string, slug: string) {
  const questions = [
    {
      question_text: 'How should "rojo" agree with "casas"?',
      correct_answer: 'rojas',
      options: ['rojo', 'roja', 'rojos', 'rojas'],
      explanation: 'Casas is feminine plural, so the adjective becomes "rojas"'
    }
  ];
  
  return questions;
}

export function generatePronounQuestions(name: string, slug: string) {
  const questions = [
    {
      question_text: 'What pronoun replaces "María"?',
      correct_answer: 'ella',
      options: ['él', 'ella', 'ellos', 'ellas'],
      explanation: 'María is a feminine singular name, replaced by "ella"'
    }
  ];
  
  return questions;
}

export function generatePrepositionQuestions(name: string, slug: string) {
  const questions = [
    {
      question_text: 'Which preposition indicates direction: "Voy ___ la escuela"?',
      correct_answer: 'a',
      options: ['a', 'en', 'de', 'por'],
      explanation: 'Use "a" to indicate movement toward a destination'
    }
  ];
  
  return questions;
}

export function generateGenericQuestions(name: string, slug: string, category: string) {
  const questions = [
    {
      question_text: `Which statement about ${name.toLowerCase()} is correct?`,
      correct_answer: 'Statement A',
      options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'],
      explanation: `This demonstrates the correct understanding of ${name.toLowerCase()}`
    }
  ];
  
  return questions;
}
