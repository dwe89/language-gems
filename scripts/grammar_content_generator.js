#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Load discovered topics
const discoveredTopics = JSON.parse(fs.readFileSync('discovered_topics.json', 'utf8'));

// Existing database topics (to avoid conflicts)
const existingTopics = new Set([
  'adjective-agreement', 'adjective-position', 'comparatives', 'superlatives',
  'gender', 'plural-formation', 'definite', 'indefinite', 'gender-plurals', 'articles', 'demonstrative',
  'basic-prepositions', 'por-para', 'subject-pronouns', 'object-pronouns',
  'word-order', 'questions', 'present-regular', 'present-irregular', 'ser-estar',
  'preterite-tense', 'imperfect-tense', 'subjunctive-mood'
]);

// Filter out existing topics
const missingTopics = discoveredTopics.filter(topic => !existingTopics.has(topic.slug));

console.log(`Found ${missingTopics.length} missing topics to create`);

// Generate comprehensive grammar content for each topic
function generateGrammarContent(topic) {
  const { slug, category, name, path } = topic;
  
  // Generate topic metadata
  const topicData = {
    slug,
    category,
    name,
    title: name,
    description: generateDescription(category, name),
    difficulty: determineDifficulty(category, slug),
    learningObjectives: generateLearningObjectives(category, name),
    practiceContent: generatePracticeContent(category, name, slug),
    quizContent: generateQuizContent(category, name, slug)
  };
  
  return topicData;
}

function generateDescription(category, name) {
  const descriptions = {
    'adjectives': `Master ${name.toLowerCase()} in Spanish adjectives with comprehensive examples and practice`,
    'adverbial-prepositional': `Learn ${name.toLowerCase()} usage in Spanish with detailed explanations`,
    'adverbs': `Understand ${name.toLowerCase()} in Spanish adverbs with practical applications`,
    'articles': `Master Spanish ${name.toLowerCase()} with clear rules and examples`,
    'nouns': `Learn Spanish ${name.toLowerCase()} with comprehensive grammar rules`,
    'prepositions': `Master Spanish ${name.toLowerCase()} with usage patterns and examples`,
    'pronouns': `Understand Spanish ${name.toLowerCase()} with detailed explanations and practice`,
    'sounds-spelling': `Master Spanish ${name.toLowerCase()} with pronunciation and spelling rules`,
    'verbs': `Learn Spanish ${name.toLowerCase()} with conjugation patterns and usage`,
    'word-formation': `Understand Spanish ${name.toLowerCase()} with formation rules and examples`
  };
  
  return descriptions[category] || `Learn ${name.toLowerCase()} in Spanish grammar`;
}

function determineDifficulty(category, slug) {
  // Beginner topics
  if (slug.includes('basic') || slug.includes('present-tense') || slug.includes('gender') || 
      slug.includes('plurals') || slug.includes('articles')) {
    return 'beginner';
  }
  
  // Advanced topics
  if (slug.includes('subjunctive') || slug.includes('conditional') || slug.includes('perfect') || 
      slug.includes('pluperfect') || slug.includes('passive') || slug.includes('reported') ||
      slug.includes('nominalisation') || slug.includes('relative')) {
    return 'advanced';
  }
  
  return 'intermediate';
}

function generateLearningObjectives(category, name) {
  const baseObjectives = [
    `Understand the concept and usage of ${name.toLowerCase()}`,
    `Apply ${name.toLowerCase()} rules correctly in context`,
    `Identify ${name.toLowerCase()} in Spanish texts and speech`,
    `Use ${name.toLowerCase()} accurately in written and spoken Spanish`
  ];
  
  return baseObjectives;
}

function generatePracticeContent(category, name, slug) {
  // Generate practice exercises based on category and topic
  const exercises = [];
  
  // Add category-specific exercises
  if (category === 'verbs') {
    exercises.push(...generateVerbExercises(name, slug));
  } else if (category === 'nouns') {
    exercises.push(...generateNounExercises(name, slug));
  } else if (category === 'adjectives') {
    exercises.push(...generateAdjectiveExercises(name, slug));
  } else if (category === 'pronouns') {
    exercises.push(...generatePronounExercises(name, slug));
  } else {
    exercises.push(...generateGenericExercises(name, slug, category));
  }
  
  return {
    title: `${name} Practice`,
    description: `Practice exercises for ${name.toLowerCase()}`,
    exercises: exercises.slice(0, 20), // Limit to 20 exercises per topic
    estimated_duration: 15,
    difficulty_level: determineDifficulty(category, slug)
  };
}

function generateQuizContent(category, name, slug) {
  // Generate quiz questions based on category and topic
  const questions = [];
  
  // Add category-specific questions
  if (category === 'verbs') {
    questions.push(...generateVerbQuestions(name, slug));
  } else if (category === 'nouns') {
    questions.push(...generateNounQuestions(name, slug));
  } else if (category === 'adjectives') {
    questions.push(...generateAdjectiveQuestions(name, slug));
  } else if (category === 'pronouns') {
    questions.push(...generatePronounQuestions(name, slug));
  } else {
    questions.push(...generateGenericQuestions(name, slug, category));
  }
  
  return {
    title: `${name} Quiz`,
    description: `Assessment quiz for ${name.toLowerCase()}`,
    questions: questions.slice(0, 15), // Limit to 15 questions per quiz
    estimated_duration: 10,
    difficulty_level: determineDifficulty(category, slug)
  };
}

// Generate exercises for different categories
function generateVerbExercises(name, slug) {
  const exercises = [
    {
      type: 'conjugation',
      instructions: `Conjugate the verb in ${name.toLowerCase()}`,
      prompts: [
        { sentence: 'Yo _____ (hablar)', answer: 'hablo', explanation: 'First person singular conjugation' },
        { sentence: 'Tú _____ (comer)', answer: 'comes', explanation: 'Second person singular conjugation' },
        { sentence: 'Él _____ (vivir)', answer: 'vive', explanation: 'Third person singular conjugation' }
      ]
    },
    {
      type: 'fill_blank',
      instructions: 'Complete the sentences with the correct verb form',
      prompts: [
        { sentence: 'María _____ en Madrid', answer: 'vive', options: ['vive', 'vives', 'vivimos'], explanation: 'Third person singular form' },
        { sentence: 'Nosotros _____ español', answer: 'hablamos', options: ['habla', 'hablamos', 'hablan'], explanation: 'First person plural form' }
      ]
    }
  ];
  
  return exercises;
}

function generateNounExercises(name, slug) {
  const exercises = [
    {
      type: 'gender_identification',
      instructions: `Identify the gender of nouns related to ${name.toLowerCase()}`,
      prompts: [
        { word: 'mesa', answer: 'feminine', options: ['masculine', 'feminine'], explanation: 'Mesa ends in -a, typically feminine' },
        { word: 'problema', answer: 'masculine', options: ['masculine', 'feminine'], explanation: 'Problema is masculine despite ending in -a' }
      ]
    },
    {
      type: 'plural_formation',
      instructions: 'Form the plural of these nouns',
      prompts: [
        { singular: 'casa', answer: 'casas', explanation: 'Add -s to nouns ending in vowels' },
        { singular: 'ciudad', answer: 'ciudades', explanation: 'Add -es to nouns ending in consonants' }
      ]
    }
  ];

  return exercises;
}

function generateAdjectiveExercises(name, slug) {
  const exercises = [
    {
      type: 'agreement',
      instructions: `Make adjectives agree with nouns in ${name.toLowerCase()}`,
      prompts: [
        { phrase: 'la casa (blanco)', answer: 'la casa blanca', explanation: 'Adjective agrees with feminine singular noun' },
        { phrase: 'los libros (interesante)', answer: 'los libros interesantes', explanation: 'Adjective agrees with masculine plural noun' }
      ]
    },
    {
      type: 'position',
      instructions: 'Place adjectives in the correct position',
      prompts: [
        { elements: ['casa', 'grande'], answer: 'casa grande', explanation: 'Descriptive adjectives usually follow the noun' },
        { elements: ['buen', 'amigo'], answer: 'buen amigo', explanation: 'Bueno shortens to buen before masculine singular nouns' }
      ]
    }
  ];

  return exercises;
}

function generatePronounExercises(name, slug) {
  const exercises = [
    {
      type: 'substitution',
      instructions: `Replace nouns with appropriate pronouns for ${name.toLowerCase()}`,
      prompts: [
        { sentence: 'María come la manzana', answer: 'María la come', explanation: 'La replaces the feminine direct object' },
        { sentence: 'Doy el libro a Juan', answer: 'Le doy el libro', explanation: 'Le replaces the indirect object' }
      ]
    },
    {
      type: 'identification',
      instructions: 'Identify the type of pronoun',
      prompts: [
        { sentence: 'Me gusta el café', pronoun: 'me', answer: 'indirect object', options: ['subject', 'direct object', 'indirect object'], explanation: 'Me is the indirect object pronoun' }
      ]
    }
  ];

  return exercises;
}

function generateGenericExercises(name, slug, category) {
  const exercises = [
    {
      type: 'fill_blank',
      instructions: `Complete sentences using ${name.toLowerCase()}`,
      prompts: [
        { sentence: 'El estudiante _____ muy inteligente', answer: 'es', options: ['es', 'está', 'hay'], explanation: 'Use ser for permanent characteristics' },
        { sentence: 'La comida _____ deliciosa', answer: 'está', options: ['es', 'está', 'hay'], explanation: 'Use estar for temporary states' }
      ]
    },
    {
      type: 'translation',
      instructions: 'Translate these sentences',
      prompts: [
        { english: 'The book is interesting', answer: 'El libro es interesante', explanation: 'Direct translation with proper article and verb' },
        { english: 'I am studying Spanish', answer: 'Estoy estudiando español', explanation: 'Present continuous with estar + gerund' }
      ]
    }
  ];

  return exercises;
}

// Generate quiz questions for different categories
function generateVerbQuestions(name, slug) {
  const questions = [
    {
      type: 'multiple_choice',
      question: `Which is the correct conjugation for ${name.toLowerCase()}?`,
      options: ['habla', 'hablas', 'hablamos', 'hablan'],
      correct_answer: 'habla',
      explanation: 'Third person singular form of hablar'
    },
    {
      type: 'conjugation',
      question: 'Conjugate: Yo _____ (comer)',
      correct_answer: 'como',
      explanation: 'First person singular of comer'
    }
  ];

  return questions;
}

function generateNounQuestions(name, slug) {
  const questions = [
    {
      type: 'multiple_choice',
      question: 'What is the gender of "problema"?',
      options: ['masculine', 'feminine'],
      correct_answer: 'masculine',
      explanation: 'Problema is masculine despite ending in -a'
    },
    {
      type: 'fill_blank',
      question: 'Complete: Las _____ (casa)',
      correct_answer: 'casas',
      explanation: 'Plural form of casa'
    }
  ];

  return questions;
}

function generateAdjectiveQuestions(name, slug) {
  const questions = [
    {
      type: 'multiple_choice',
      question: 'Which adjective agrees correctly?',
      options: ['la casa blanco', 'la casa blanca', 'las casa blanca'],
      correct_answer: 'la casa blanca',
      explanation: 'Adjective must agree in gender and number'
    }
  ];

  return questions;
}

function generatePronounQuestions(name, slug) {
  const questions = [
    {
      type: 'multiple_choice',
      question: 'Replace the direct object: "Veo el libro"',
      options: ['Lo veo', 'La veo', 'Le veo'],
      correct_answer: 'Lo veo',
      explanation: 'Lo replaces masculine direct objects'
    }
  ];

  return questions;
}

function generateGenericQuestions(name, slug, category) {
  const questions = [
    {
      type: 'multiple_choice',
      question: `Which sentence correctly uses ${name.toLowerCase()}?`,
      options: ['Es correcto', 'Está correcto', 'Hay correcto'],
      correct_answer: 'Es correcto',
      explanation: 'Use ser for permanent characteristics'
    }
  ];

  return questions;
}

// Main execution
console.log('Generating comprehensive grammar content...');

const allTopicData = missingTopics.map(topic => generateGrammarContent(topic));

// Generate SQL for topics
const topicInserts = [];
const contentInserts = [];

allTopicData.forEach((topicData, index) => {
  const orderPosition = 100 + index; // Start from 100 to avoid conflicts

  // Topic insert
  const topicSql = `INSERT INTO grammar_topics (
    id, topic_name, slug, language, category, difficulty_level, curriculum_level,
    title, description, learning_objectives, order_position, is_active, prerequisite_topics
  ) VALUES (
    gen_random_uuid(),
    '${topicData.slug.replace(/-/g, '_')}',
    '${topicData.slug}',
    'es',
    '${topicData.category}',
    '${topicData.difficulty}',
    'KS3',
    '${topicData.title}',
    '${topicData.description}',
    ARRAY[${topicData.learningObjectives.map(obj => `'${obj.replace(/'/g, "''")}'`).join(', ')}],
    ${orderPosition},
    true,
    ARRAY[]::uuid[]
  );`;

  topicInserts.push(topicSql);

  // Practice content insert
  const practiceContentSql = `INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = '${topicData.slug}' AND language = 'es'),
    'practice',
    '${topicData.practiceContent.title}',
    '${topicData.slug}',
    '${JSON.stringify(topicData.practiceContent).replace(/'/g, "''")}',
    '${topicData.practiceContent.difficulty_level}',
    'KS3',
    ${topicData.practiceContent.estimated_duration},
    1,
    true,
    false
  );`;

  contentInserts.push(practiceContentSql);

  // Quiz content insert
  const quizContentSql = `INSERT INTO grammar_content (
    id, topic_id, content_type, title, slug, content_data,
    difficulty_level, age_group, estimated_duration, order_position, is_active, is_featured
  ) VALUES (
    gen_random_uuid(),
    (SELECT id FROM grammar_topics WHERE slug = '${topicData.slug}' AND language = 'es'),
    'quiz',
    '${topicData.quizContent.title}',
    '${topicData.slug}',
    '${JSON.stringify(topicData.quizContent).replace(/'/g, "''")}',
    '${topicData.quizContent.difficulty_level}',
    'KS3',
    ${topicData.quizContent.estimated_duration},
    2,
    true,
    false
  );`;

  contentInserts.push(quizContentSql);
});

// Write SQL files
fs.writeFileSync('generated_topics.sql', topicInserts.join('\n\n'));
fs.writeFileSync('generated_content.sql', contentInserts.join('\n\n'));

// Write JSON data for review
fs.writeFileSync('generated_topics_data.json', JSON.stringify(allTopicData, null, 2));

console.log(`Generated ${allTopicData.length} topics with practice and quiz content`);
console.log('Files created:');
console.log('- generated_topics.sql (topic definitions)');
console.log('- generated_content.sql (practice and quiz content)');
console.log('- generated_topics_data.json (structured data for review)');
console.log('');
console.log('Summary by category:');

const categoryCount = {};
allTopicData.forEach(topic => {
  categoryCount[topic.category] = (categoryCount[topic.category] || 0) + 1;
});

Object.keys(categoryCount).sort().forEach(category => {
  console.log(`- ${category}: ${categoryCount[category]} topics`);
});
