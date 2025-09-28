#!/usr/bin/env node

const fs = require('fs');

console.log('Generating practice and quiz content for all Spanish grammar topics...');

// Get all current topics from database (we'll simulate this with our known topics)
const allTopics = [
  // Existing topics with content
  { slug: 'adjective-agreement', category: 'adjectives', hasContent: true },
  { slug: 'adjective-position', category: 'adjectives', hasContent: true },
  { slug: 'comparatives', category: 'adjectives', hasContent: true },
  { slug: 'superlatives', category: 'adjectives', hasContent: true },
  
  // Newly created topics needing content
  { slug: 'agreement', category: 'adjectives', hasContent: false },
  { slug: 'comparison', category: 'adjectives', hasContent: false },
  { slug: 'position', category: 'adjectives', hasContent: false },
  { slug: 'possessive', category: 'adjectives', hasContent: false },
  { slug: 'personal-a', category: 'adverbial-prepositional', hasContent: false },
  { slug: 'por-vs-para', category: 'adverbial-prepositional', hasContent: false },
  { slug: 'formation', category: 'adverbs', hasContent: false },
  { slug: 'definite-articles', category: 'articles', hasContent: false },
  { slug: 'definite-indefinite', category: 'articles', hasContent: false },
  
  // Add all the topics we've created...
  { slug: 'agreement-position', category: 'nouns', hasContent: false },
  { slug: 'gender-and-plurals', category: 'nouns', hasContent: false },
  { slug: 'gender-rules', category: 'nouns', hasContent: false },
  { slug: 'nominalisation', category: 'nouns', hasContent: false },
  { slug: 'plurals', category: 'nouns', hasContent: false },
  { slug: 'possessive-adj', category: 'nouns', hasContent: false },
  
  { slug: 'direct-object', category: 'pronouns', hasContent: false },
  { slug: 'indirect-object', category: 'pronouns', hasContent: false },
  { slug: 'interrogative', category: 'pronouns', hasContent: false },
  { slug: 'personal', category: 'pronouns', hasContent: false },
  { slug: 'possessive-pronouns', category: 'pronouns', hasContent: false },
  { slug: 'reflexive-pronouns', category: 'pronouns', hasContent: false },
  { slug: 'relative', category: 'pronouns', hasContent: false },
  { slug: 'subject', category: 'pronouns', hasContent: false },
  
  { slug: 'sound-symbol', category: 'sounds-spelling', hasContent: false },
  { slug: 'stress-patterns', category: 'sounds-spelling', hasContent: false },
  { slug: 'written-accents', category: 'sounds-spelling', hasContent: false },
  
  { slug: 'adjective-adverb', category: 'word-formation', hasContent: false },
  { slug: 'adjective-noun', category: 'word-formation', hasContent: false },
  { slug: 'augmentative-suffixes', category: 'word-formation', hasContent: false },
  { slug: 'diminutive-suffixes', category: 'word-formation', hasContent: false }
];

// Filter topics that need content
const topicsNeedingContent = allTopics.filter(topic => !topic.hasContent);

console.log(`Found ${topicsNeedingContent.length} topics needing practice and quiz content`);

// Generate comprehensive practice content
function generatePracticeContent(topic) {
  const { slug, category } = topic;
  const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const exercises = generateExercisesByCategory(category, name, slug);
  
  return {
    title: `${name} Practice`,
    description: `Interactive practice exercises for ${name.toLowerCase()}`,
    exercises: exercises,
    estimated_duration: 15,
    difficulty_level: determineDifficulty(slug),
    content_type: 'practice'
  };
}

// Generate comprehensive quiz content
function generateQuizContent(topic) {
  const { slug, category } = topic;
  const name = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const questions = generateQuestionsByCategory(category, name, slug);
  
  return {
    title: `${name} Quiz`,
    description: `Assessment quiz for ${name.toLowerCase()}`,
    questions: questions,
    estimated_duration: 10,
    difficulty_level: determineDifficulty(slug),
    content_type: 'quiz'
  };
}

function generateExercisesByCategory(category, name, slug) {
  const exercises = [];
  
  switch (category) {
    case 'adjectives':
      exercises.push(...generateAdjectiveExercises(name, slug));
      break;
    case 'adverbial-prepositional':
      exercises.push(...generatePrepositionExercises(name, slug));
      break;
    case 'adverbs':
      exercises.push(...generateAdverbExercises(name, slug));
      break;
    case 'articles':
      exercises.push(...generateArticleExercises(name, slug));
      break;
    case 'nouns':
      exercises.push(...generateNounExercises(name, slug));
      break;
    case 'pronouns':
      exercises.push(...generatePronounExercises(name, slug));
      break;
    case 'sounds-spelling':
      exercises.push(...generateSoundSpellingExercises(name, slug));
      break;
    case 'word-formation':
      exercises.push(...generateWordFormationExercises(name, slug));
      break;
    default:
      exercises.push(...generateGenericExercises(name, slug));
  }
  
  return exercises.slice(0, 20); // Limit to 20 exercises
}

function generateAdjectiveExercises(name, slug) {
  return [
    {
      type: 'agreement',
      instructions: `Make adjectives agree with nouns`,
      prompts: [
        { phrase: 'la mesa (blanco)', answer: 'la mesa blanca', explanation: 'Adjective agrees with feminine singular noun' },
        { phrase: 'los libros (interesante)', answer: 'los libros interesantes', explanation: 'Adjective agrees with masculine plural noun' },
        { phrase: 'las casas (pequeño)', answer: 'las casas pequeñas', explanation: 'Adjective agrees with feminine plural noun' }
      ]
    },
    {
      type: 'position',
      instructions: 'Place adjectives in the correct position',
      prompts: [
        { elements: ['casa', 'grande'], answer: 'casa grande', explanation: 'Descriptive adjectives usually follow the noun' },
        { elements: ['buen', 'amigo'], answer: 'buen amigo', explanation: 'Bueno shortens to buen before masculine singular nouns' }
      ]
    },
    {
      type: 'fill_blank',
      instructions: 'Complete with the correct adjective form',
      prompts: [
        { sentence: 'El coche es _____ (rojo)', answer: 'rojo', explanation: 'Masculine singular form' },
        { sentence: 'Las flores son _____ (bonito)', answer: 'bonitas', explanation: 'Feminine plural form' }
      ]
    }
  ];
}

function generatePrepositionExercises(name, slug) {
  return [
    {
      type: 'usage',
      instructions: 'Choose the correct preposition',
      prompts: [
        { sentence: 'Voy _____ la escuela', options: ['a', 'en', 'de'], answer: 'a', explanation: 'Use "a" for direction/destination' },
        { sentence: 'El libro está _____ la mesa', options: ['en', 'a', 'de'], answer: 'en', explanation: 'Use "en" for location on a surface' }
      ]
    },
    {
      type: 'por_para',
      instructions: 'Choose between por and para',
      prompts: [
        { sentence: 'Estudio _____ ser médico', options: ['por', 'para'], answer: 'para', explanation: 'Use "para" for purpose/goal' },
        { sentence: 'Camino _____ el parque', options: ['por', 'para'], answer: 'por', explanation: 'Use "por" for movement through a place' }
      ]
    }
  ];
}

function generateAdverbExercises(name, slug) {
  return [
    {
      type: 'formation',
      instructions: 'Form adverbs from adjectives',
      prompts: [
        { adjective: 'rápido', answer: 'rápidamente', explanation: 'Add -mente to feminine form of adjective' },
        { adjective: 'fácil', answer: 'fácilmente', explanation: 'Add -mente to adjectives ending in consonant' }
      ]
    },
    {
      type: 'usage',
      instructions: 'Choose the correct adverb',
      prompts: [
        { sentence: 'Habla muy _____', options: ['rápido', 'rápidamente'], answer: 'rápidamente', explanation: 'Use adverb to modify verb' }
      ]
    }
  ];
}

function generateArticleExercises(name, slug) {
  return [
    {
      type: 'definite_indefinite',
      instructions: 'Choose the correct article',
      prompts: [
        { noun: 'casa', context: 'specific', answer: 'la casa', explanation: 'Use definite article for specific reference' },
        { noun: 'libro', context: 'general', answer: 'un libro', explanation: 'Use indefinite article for general reference' }
      ]
    },
    {
      type: 'gender_agreement',
      instructions: 'Match articles with noun gender',
      prompts: [
        { noun: 'problema', answer: 'el problema', explanation: 'Problema is masculine despite ending in -a' },
        { noun: 'mano', answer: 'la mano', explanation: 'Mano is feminine despite ending in -o' }
      ]
    }
  ];
}

function generateNounExercises(name, slug) {
  return [
    {
      type: 'gender',
      instructions: 'Identify the gender of these nouns',
      prompts: [
        { noun: 'mesa', answer: 'feminine', options: ['masculine', 'feminine'], explanation: 'Most nouns ending in -a are feminine' },
        { noun: 'problema', answer: 'masculine', options: ['masculine', 'feminine'], explanation: 'Problema is masculine despite ending in -a' }
      ]
    },
    {
      type: 'plural',
      instructions: 'Form the plural of these nouns',
      prompts: [
        { singular: 'casa', answer: 'casas', explanation: 'Add -s to nouns ending in vowels' },
        { singular: 'ciudad', answer: 'ciudades', explanation: 'Add -es to nouns ending in consonants' }
      ]
    }
  ];
}

function generatePronounExercises(name, slug) {
  return [
    {
      type: 'substitution',
      instructions: 'Replace nouns with appropriate pronouns',
      prompts: [
        { sentence: 'Veo a María', answer: 'La veo', explanation: 'La replaces feminine direct object' },
        { sentence: 'Doy el libro a Juan', answer: 'Le doy el libro', explanation: 'Le replaces indirect object' }
      ]
    },
    {
      type: 'placement',
      instructions: 'Place pronouns correctly',
      prompts: [
        { elements: ['quiero', 'ver', 'lo'], answer: 'Quiero verlo / Lo quiero ver', explanation: 'Pronouns can attach to infinitive or precede conjugated verb' }
      ]
    }
  ];
}

function generateSoundSpellingExercises(name, slug) {
  return [
    {
      type: 'accent_placement',
      instructions: 'Place accents correctly',
      prompts: [
        { word: 'medico', answer: 'médico', explanation: 'Stress on antepenultimate syllable requires accent' },
        { word: 'corazon', answer: 'corazón', explanation: 'Words ending in -n need accent when stressed on last syllable' }
      ]
    },
    {
      type: 'stress_identification',
      instructions: 'Identify the stressed syllable',
      prompts: [
        { word: 'teléfono', answer: 2, explanation: 'Second syllable is stressed' }
      ]
    }
  ];
}

function generateWordFormationExercises(name, slug) {
  return [
    {
      type: 'suffix_formation',
      instructions: 'Form words using suffixes',
      prompts: [
        { base: 'casa', suffix: '-ita', answer: 'casita', explanation: 'Diminutive suffix -ita makes things smaller/cuter' },
        { base: 'perro', suffix: '-ón', answer: 'perrón', explanation: 'Augmentative suffix -ón makes things bigger' }
      ]
    },
    {
      type: 'word_transformation',
      instructions: 'Transform words between categories',
      prompts: [
        { adjective: 'rápido', target: 'adverb', answer: 'rápidamente', explanation: 'Add -mente to form adverb' }
      ]
    }
  ];
}

function generateGenericExercises(name, slug) {
  return [
    {
      type: 'fill_blank',
      instructions: `Complete sentences using ${name.toLowerCase()}`,
      prompts: [
        { sentence: 'El estudiante _____ muy inteligente', answer: 'es', explanation: 'Use ser for permanent characteristics' }
      ]
    },
    {
      type: 'translation',
      instructions: 'Translate these sentences',
      prompts: [
        { english: 'The book is interesting', answer: 'El libro es interesante', explanation: 'Direct translation with proper agreement' }
      ]
    }
  ];
}

// Generate quiz questions by category
function generateQuestionsByCategory(category, name, slug) {
  const questions = [];

  switch (category) {
    case 'adjectives':
      questions.push(...generateAdjectiveQuestions(name, slug));
      break;
    case 'nouns':
      questions.push(...generateNounQuestions(name, slug));
      break;
    case 'pronouns':
      questions.push(...generatePronounQuestions(name, slug));
      break;
    default:
      questions.push(...generateGenericQuestions(name, slug));
  }

  return questions.slice(0, 15); // Limit to 15 questions
}

function generateAdjectiveQuestions(name, slug) {
  return [
    {
      type: 'multiple_choice',
      question: 'Which adjective agrees correctly with "las casas"?',
      options: ['blanco', 'blanca', 'blancos', 'blancas'],
      correct_answer: 'blancas',
      explanation: 'Adjective must agree in gender (feminine) and number (plural)'
    },
    {
      type: 'fill_blank',
      question: 'Complete: El coche _____ (rojo)',
      correct_answer: 'rojo',
      explanation: 'Masculine singular form matches el coche'
    }
  ];
}

function generateNounQuestions(name, slug) {
  return [
    {
      type: 'multiple_choice',
      question: 'What is the gender of "problema"?',
      options: ['masculine', 'feminine'],
      correct_answer: 'masculine',
      explanation: 'Problema is masculine despite ending in -a'
    }
  ];
}

function generatePronounQuestions(name, slug) {
  return [
    {
      type: 'multiple_choice',
      question: 'Replace the direct object: "Veo el libro"',
      options: ['Lo veo', 'La veo', 'Le veo'],
      correct_answer: 'Lo veo',
      explanation: 'Lo replaces masculine direct objects'
    }
  ];
}

function generateGenericQuestions(name, slug) {
  return [
    {
      type: 'multiple_choice',
      question: `Which sentence correctly uses ${name.toLowerCase()}?`,
      options: ['Es correcto', 'Está correcto'],
      correct_answer: 'Es correcto',
      explanation: 'Use ser for permanent characteristics'
    }
  ];
}

function determineDifficulty(slug) {
  if (slug.includes('basic') || slug.includes('gender') || slug.includes('plural')) return 'beginner';
  if (slug.includes('subjunctive') || slug.includes('conditional') || slug.includes('nominalisation')) return 'advanced';
  return 'intermediate';
}

// Main execution
console.log('Generating content for all topics...');

const allContentData = [];

topicsNeedingContent.forEach(topic => {
  const practiceContent = generatePracticeContent(topic);
  const quizContent = generateQuizContent(topic);

  allContentData.push({
    topic: topic,
    practice: practiceContent,
    quiz: quizContent
  });
});

// Generate SQL for content insertion
const contentInserts = [];

allContentData.forEach((data, index) => {
  const { topic, practice, quiz } = data;

  // Practice content insert
  const practiceSQL = `INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = '${topic.slug}' AND language = 'es'),
    'practice',
    '${practice.title}',
    '${topic.slug}',
    '${JSON.stringify(practice).replace(/'/g, "''")}',
    '${practice.difficulty_level}',
    'KS3',
    ${practice.estimated_duration},
    1,
    true,
    false
  );`;

  contentInserts.push(practiceSQL);

  // Quiz content insert
  const quizSQL = `INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = '${topic.slug}' AND language = 'es'),
    'quiz',
    '${quiz.title}',
    '${topic.slug}',
    '${JSON.stringify(quiz).replace(/'/g, "''")}',
    '${quiz.difficulty_level}',
    'KS3',
    ${quiz.estimated_duration},
    2,
    true,
    false
  );`;

  contentInserts.push(quizSQL);
});

// Write SQL files
fs.writeFileSync('generated_practice_content.sql', contentInserts.join('\n\n'));

// Write JSON data for review
fs.writeFileSync('generated_content_data.json', JSON.stringify(allContentData, null, 2));

console.log(`Generated practice and quiz content for ${topicsNeedingContent.length} topics`);
console.log('Files created:');
console.log('- generated_practice_content.sql (SQL inserts)');
console.log('- generated_content_data.json (structured data for review)');
console.log('');
console.log('Summary:');
console.log(`- Topics processed: ${topicsNeedingContent.length}`);
console.log(`- Practice exercises created: ${allContentData.length}`);
console.log(`- Quiz questions created: ${allContentData.length}`);
console.log(`- Total SQL statements: ${contentInserts.length}`);

// Create batch files for easier processing
const batchSize = 10;
const batches = [];

for (let i = 0; i < contentInserts.length; i += batchSize) {
  batches.push(contentInserts.slice(i, i + batchSize));
}

console.log(`\nCreating ${batches.length} batch files for content insertion:`);

batches.forEach((batch, index) => {
  const filename = `content_batch_${index + 1}.sql`;
  fs.writeFileSync(filename, batch.join('\n\n'));
  console.log(`- ${filename} (${batch.length} content items)`);
});

console.log('\nNext steps:');
console.log('1. Review the generated content in generated_content_data.json');
console.log('2. Apply the batch SQL files to create all practice and quiz content');
console.log('3. Test the grammar navigation system');
console.log('4. Verify all topics show practice and quiz options');
