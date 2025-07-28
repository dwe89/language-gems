// Exam-Style Questions Database
// Based on UK Exam Boards: AQA, Edexcel, Eduqas
// Organized by category/subcategory and skill type

export interface ExamQuestion {
  id: string;
  examBoard: 'AQA' | 'Edexcel' | 'Eduqas' | 'General';
  skill: 'reading' | 'writing' | 'listening' | 'speaking';
  language: 'es' | 'fr' | 'de' | 'it';
  level: 'KS3' | 'KS4';
  category: string;
  subcategory: string;
  questionType: 'multiple-choice' | 'translation' | 'gap-fill' | 'short-answer' | 'essay' | 'listening-comprehension' | 'speaking-prompt' | 'photo-description';
  question: string;
  context?: string; // Additional context or stimulus material
  options?: string[]; // For multiple choice
  correctAnswer?: string | string[];
  markingCriteria?: string[];
  points: number;
  timeAllocation: number; // in minutes
  difficulty: 'foundation' | 'higher';
  vocabulary?: string[]; // Key vocabulary tested
  grammarFocus?: string[]; // Grammar points tested
  audioUrl?: string; // For listening questions
  imageUrl?: string; // For photo description tasks
}

// Spanish Exam Questions
export const spanishExamQuestions: ExamQuestion[] = [
  // READING QUESTIONS
  {
    id: 'es-read-food-1',
    examBoard: 'AQA',
    skill: 'reading',
    language: 'es',
    level: 'KS3',
    category: 'food_drink',
    subcategory: 'ordering_cafes_restaurants',
    questionType: 'multiple-choice',
    question: 'Lee el texto y elige la respuesta correcta.',
    context: `María va al café con sus amigos después del colegio. Pide un bocadillo de jamón y un zumo de naranja. Sus amigos piden pizza y refrescos. La cuenta total es de 18 euros.`,
    options: [
      'María pide pizza y refrescos',
      'María pide un bocadillo de jamón y un zumo de naranja',
      'María pide solo un zumo de naranja',
      'María no pide nada'
    ],
    correctAnswer: 'María pide un bocadillo de jamón y un zumo de naranja',
    points: 1,
    timeAllocation: 2,
    difficulty: 'foundation',
    vocabulary: ['bocadillo', 'jamón', 'zumo', 'cuenta'],
    grammarFocus: ['present tense', 'food vocabulary']
  },
  {
    id: 'es-read-school-1',
    examBoard: 'Edexcel',
    skill: 'reading',
    language: 'es',
    level: 'KS3',
    category: 'school_jobs_future',
    subcategory: 'school_life',
    questionType: 'gap-fill',
    question: 'Completa las frases con las palabras del recuadro.',
    context: `Palabras: matemáticas, recreo, deberes, instituto, profesora

Mi día en el _____ empieza a las ocho y media. La primera clase es _____ con la señora García. A las once hay un _____ de veinte minutos. Después de las clases, voy a casa para hacer los _____.`,
    correctAnswer: ['instituto', 'matemáticas', 'recreo', 'deberes'],
    points: 4,
    timeAllocation: 5,
    difficulty: 'foundation',
    vocabulary: ['instituto', 'matemáticas', 'recreo', 'deberes', 'profesora'],
    grammarFocus: ['school vocabulary', 'time expressions']
  },

  // WRITING QUESTIONS
  {
    id: 'es-write-family-1',
    examBoard: 'AQA',
    skill: 'writing',
    language: 'es',
    level: 'KS3',
    category: 'identity_personal_life',
    subcategory: 'family_friends',
    questionType: 'short-answer',
    question: 'Escribe 5 frases sobre tu familia usando el vocabulario dado.',
    context: 'Vocabulario: padre, madre, hermano, hermana, abuelos, vivir, trabajar, estudiar, años, casa',
    markingCriteria: [
      'Uso correcto del vocabulario (2 puntos)',
      'Gramática correcta (2 puntos)',
      'Creatividad y detalle (1 punto)'
    ],
    points: 5,
    timeAllocation: 10,
    difficulty: 'foundation',
    vocabulary: ['padre', 'madre', 'hermano', 'hermana', 'abuelos'],
    grammarFocus: ['family vocabulary', 'present tense', 'adjectives']
  },
  {
    id: 'es-write-town-1',
    examBoard: 'Eduqas',
    skill: 'writing',
    language: 'es',
    level: 'KS4',
    category: 'home_local_area',
    subcategory: 'places_in_town',
    questionType: 'essay',
    question: 'Describe tu ciudad ideal. Menciona los lugares importantes, las actividades disponibles y por qué te gusta vivir allí.',
    context: 'Escribe aproximadamente 90-100 palabras en español.',
    markingCriteria: [
      'Contenido y comunicación (5 puntos)',
      'Variedad de vocabulario (3 puntos)',
      'Precisión gramatical (3 puntos)',
      'Fluidez y coherencia (4 puntos)'
    ],
    points: 15,
    timeAllocation: 20,
    difficulty: 'higher',
    vocabulary: ['ciudad', 'lugares', 'actividades', 'vivir', 'importante'],
    grammarFocus: ['descriptive language', 'present tense', 'opinions', 'location prepositions']
  },

  // TRANSLATION QUESTIONS
  {
    id: 'es-trans-food-1',
    examBoard: 'AQA',
    skill: 'writing',
    language: 'es',
    level: 'KS3',
    category: 'food_drink',
    subcategory: 'meals',
    questionType: 'translation',
    question: 'Traduce las siguientes frases al español:',
    context: `1. I would like a table for four people, please.
2. The menu is very interesting.
3. We want to order paella and salad.
4. The bill, please.`,
    correctAnswer: [
      'Quisiera una mesa para cuatro personas, por favor.',
      'El menú es muy interesante.',
      'Queremos pedir paella y ensalada.',
      'La cuenta, por favor.'
    ],
    markingCriteria: [
      'Vocabulario correcto (2 puntos por frase)',
      'Gramática correcta (1 punto por frase)',
      'Ortografía correcta (0.5 puntos por frase)'
    ],
    points: 14,
    timeAllocation: 15,
    difficulty: 'foundation',
    vocabulary: ['mesa', 'personas', 'menú', 'pedir', 'cuenta'],
    grammarFocus: ['conditional tense', 'numbers', 'restaurant vocabulary']
  },

  // LISTENING QUESTIONS
  {
    id: 'es-listen-school-1',
    examBoard: 'Edexcel',
    skill: 'listening',
    language: 'es',
    level: 'KS3',
    category: 'school_jobs_future',
    subcategory: 'school_subjects',
    questionType: 'listening-comprehension',
    question: 'Escucha el audio y responde a las preguntas.',
    context: 'Audio transcript: "Hola, me llamo Carlos. Mi asignatura favorita es la educación física porque me gusta el deporte. No me gusta nada las matemáticas porque son muy difíciles. Los lunes tengo inglés, matemáticas y ciencias. Mi profesora de inglés es muy simpática."',
    options: [
      '¿Cuál es la asignatura favorita de Carlos?',
      '¿Por qué no le gustan las matemáticas?',
      '¿Qué asignaturas tiene los lunes?',
      '¿Cómo es su profesora de inglés?'
    ],
    correctAnswer: [
      'Educación física',
      'Porque son muy difíciles',
      'Inglés, matemáticas y ciencias',
      'Muy simpática'
    ],
    points: 8,
    timeAllocation: 10,
    difficulty: 'foundation',
    vocabulary: ['asignatura', 'educación física', 'matemáticas', 'profesora'],
    grammarFocus: ['likes/dislikes', 'school subjects', 'adjectives'],
    audioUrl: '/audio/spanish/school-subjects-carlos.mp3'
  },

  // SPEAKING QUESTIONS
  {
    id: 'es-speak-family-1',
    examBoard: 'AQA',
    skill: 'speaking',
    language: 'es',
    level: 'KS3',
    category: 'identity_personal_life',
    subcategory: 'family_friends',
    questionType: 'speaking-prompt',
    question: 'Habla sobre tu familia durante 1-2 minutos.',
    context: 'Menciona: ¿Cuántas personas hay en tu familia? ¿Cómo se llaman? ¿Cuántos años tienen? ¿Qué hacen? ¿Te llevas bien con ellos?',
    markingCriteria: [
      'Comunicación (5 puntos)',
      'Variedad de vocabulario (3 puntos)',
      'Precisión gramatical (3 puntos)',
      'Pronunciación (4 puntos)'
    ],
    points: 15,
    timeAllocation: 3,
    difficulty: 'foundation',
    vocabulary: ['familia', 'personas', 'años', 'llamarse', 'llevarse bien'],
    grammarFocus: ['family vocabulary', 'numbers', 'present tense', 'reflexive verbs']
  },
  {
    id: 'es-speak-photo-1',
    examBoard: 'Eduqas',
    skill: 'speaking',
    language: 'es',
    level: 'KS4',
    category: 'home_local_area',
    subcategory: 'places_in_town',
    questionType: 'photo-description',
    question: 'Describe la foto y responde a las preguntas.',
    context: 'Describe lo que ves en la foto. ¿Dónde está? ¿Qué hay? ¿Te gusta este tipo de lugar? ¿Por qué?',
    markingCriteria: [
      'Descripción detallada (4 puntos)',
      'Opiniones personales (3 puntos)',
      'Variedad de vocabulario (3 puntos)',
      'Fluidez (5 puntos)'
    ],
    points: 15,
    timeAllocation: 4,
    difficulty: 'higher',
    vocabulary: ['descripción', 'lugar', 'edificio', 'gente', 'actividades'],
    grammarFocus: ['descriptive language', 'present tense', 'opinions', 'there is/are'],
    imageUrl: '/images/spanish/town-square.jpg'
  }
];

// French Exam Questions
export const frenchExamQuestions: ExamQuestion[] = [
  {
    id: 'fr-read-food-1',
    examBoard: 'AQA',
    skill: 'reading',
    language: 'fr',
    level: 'KS3',
    category: 'food_drink',
    subcategory: 'food_drink_vocabulary',
    questionType: 'multiple-choice',
    question: 'Lisez le texte et choisissez la bonne réponse.',
    context: `Au marché, je vais d'abord chez le boulanger pour acheter du pain frais. Ensuite, je vais chez le marchand de légumes pour acheter des tomates et des carottes. Finalement, je vais à la boucherie pour acheter de la viande.`,
    options: [
      'Je vais d\'abord à la boucherie',
      'Je vais d\'abord chez le boulanger',
      'Je vais d\'abord chez le marchand de légumes',
      'Je ne vais pas au marché'
    ],
    correctAnswer: 'Je vais d\'abord chez le boulanger',
    points: 1,
    timeAllocation: 2,
    difficulty: 'foundation',
    vocabulary: ['marché', 'boulanger', 'pain', 'légumes', 'boucherie'],
    grammarFocus: ['shopping vocabulary', 'sequence words']
  },
  {
    id: 'fr-write-school-1',
    examBoard: 'Edexcel',
    skill: 'writing',
    language: 'fr',
    level: 'KS3',
    category: 'school_jobs_future',
    subcategory: 'school_life',
    questionType: 'short-answer',
    question: 'Décrivez votre journée scolaire typique en 6 phrases.',
    context: 'Utilisez le vocabulaire: cours, récréation, cantine, devoirs, professeur, matières',
    markingCriteria: [
      'Utilisation du vocabulaire (3 points)',
      'Grammaire correcte (2 points)',
      'Créativité (1 point)'
    ],
    points: 6,
    timeAllocation: 12,
    difficulty: 'foundation',
    vocabulary: ['cours', 'récréation', 'cantine', 'devoirs', 'professeur'],
    grammarFocus: ['daily routine', 'time expressions', 'present tense']
  },
  {
    id: 'fr-trans-family-1',
    examBoard: 'AQA',
    skill: 'writing',
    language: 'fr',
    level: 'KS3',
    category: 'identity_personal_life',
    subcategory: 'family_friends',
    questionType: 'translation',
    question: 'Traduisez les phrases suivantes en français:',
    context: `1. My family is quite big.
2. I have two sisters and one brother.
3. My father works in an office.
4. My mother is a teacher.`,
    correctAnswer: [
      'Ma famille est assez grande.',
      'J\'ai deux sœurs et un frère.',
      'Mon père travaille dans un bureau.',
      'Ma mère est professeure.'
    ],
    points: 12,
    timeAllocation: 15,
    difficulty: 'foundation',
    vocabulary: ['famille', 'sœurs', 'frère', 'père', 'mère'],
    grammarFocus: ['family vocabulary', 'possessive adjectives', 'numbers', 'professions']
  }
];

// Question Templates by Exam Board
export const examQuestionTemplates = {
  AQA: {
    reading: [
      'Lee el texto y elige la respuesta correcta.',
      'Responde a las preguntas en español.',
      'Encuentra las palabras en el texto que significan...'
    ],
    writing: [
      'Escribe un texto de aproximadamente {wordCount} palabras sobre {topic}.',
      'Traduce las siguientes frases al español.',
      'Responde a las preguntas con frases completas.'
    ],
    listening: [
      'Escucha el audio y responde a las preguntas.',
      'Escucha y completa las frases.',
      'Escucha y elige la respuesta correcta.'
    ],
    speaking: [
      'Habla sobre {topic} durante {duration} minutos.',
      'Describe la foto y responde a las preguntas.',
      'Mantén una conversación sobre {topic}.'
    ]
  },
  Edexcel: {
    reading: [
      'Read the text and answer the questions in English.',
      'Complete the sentences with words from the text.',
      'Match the Spanish phrases with their English meanings.'
    ],
    writing: [
      'Write about {topic}. You should write approximately {wordCount} words.',
      'Translate the following sentences into Spanish.',
      'Answer the questions in Spanish using full sentences.'
    ],
    listening: [
      'Listen to the audio and answer the questions in English.',
      'Listen and complete the grid in English.',
      'Listen and choose the correct answer.'
    ],
    speaking: [
      'Talk about {topic} for about {duration} minutes.',
      'Look at the photo and answer the questions.',
      'Have a conversation about {topic}.'
    ]
  },
  Eduqas: {
    reading: [
      'Darllen y testun ac ateb y cwestiynau yn Gymraeg.',
      'Read the text and answer in the target language.',
      'Complete the gaps with appropriate words.'
    ],
    writing: [
      'Ysgrifennwch am {topic}. Dylech ysgrifennu tua {wordCount} gair.',
      'Write about {topic} in approximately {wordCount} words.',
      'Translate the sentences into the target language.'
    ],
    listening: [
      'Gwrandewch ar y recordiad ac ateb y cwestiynau.',
      'Listen to the recording and answer the questions.',
      'Complete the information in the target language.'
    ],
    speaking: [
      'Siaradwch am {topic} am tua {duration} munud.',
      'Talk about {topic} for approximately {duration} minutes.',
      'Discuss the photo and give your opinions.'
    ]
  }
};

// Marking Criteria Templates
export const markingCriteria = {
  reading: {
    foundation: ['Understanding of main points', 'Understanding of details', 'Inference skills'],
    higher: ['Understanding of main points and details', 'Inference and deduction', 'Understanding of attitudes and emotions']
  },
  writing: {
    foundation: ['Communication and content', 'Vocabulary range', 'Grammatical accuracy', 'Spelling'],
    higher: ['Communication and content', 'Vocabulary range and appropriateness', 'Grammatical accuracy and complexity', 'Spelling and punctuation', 'Style and register']
  },
  listening: {
    foundation: ['Understanding of main points', 'Understanding of details', 'Recognition of attitudes'],
    higher: ['Understanding of main points and details', 'Understanding of attitudes and emotions', 'Inference and deduction']
  },
  speaking: {
    foundation: ['Communication', 'Vocabulary range', 'Grammatical accuracy', 'Pronunciation and intonation'],
    higher: ['Communication and interaction', 'Vocabulary range and appropriateness', 'Grammatical accuracy and complexity', 'Pronunciation and intonation', 'Fluency']
  }
};

// Difficulty levels and time allocations
export const examSettings = {
  timeAllocations: {
    KS3: {
      reading: { foundation: 30, higher: 45 },
      writing: { foundation: 45, higher: 60 },
      listening: { foundation: 25, higher: 35 },
      speaking: { foundation: 10, higher: 15 }
    },
    KS4: {
      reading: { foundation: 45, higher: 60 },
      writing: { foundation: 60, higher: 90 },
      listening: { foundation: 35, higher: 45 },
      speaking: { foundation: 15, higher: 20 }
    }
  },
  passingGrades: {
    foundation: 60,
    higher: 70
  }
};

// Export all content
export const examStyleContent = {
  questions: {
    spanish: spanishExamQuestions,
    french: frenchExamQuestions
  },
  templates: examQuestionTemplates,
  markingCriteria: markingCriteria,
  settings: examSettings
};
