#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read discovered topics from API
const discoveredTopics = JSON.parse(fs.readFileSync('discovered_topics.json', 'utf8'));

// Database topics (from our query)
const databaseTopics = [
  { slug: 'adjective-agreement', category: 'adjectives' },
  { slug: 'adjective-position', category: 'adjectives' },
  { slug: 'comparatives', category: 'adjectives' },
  { slug: 'superlatives', category: 'adjectives' },
  { slug: 'articles', category: 'nouns' },
  { slug: 'definite', category: 'nouns' },
  { slug: 'demonstrative', category: 'nouns' },
  { slug: 'gender', category: 'nouns' },
  { slug: 'gender-plurals', category: 'nouns' },
  { slug: 'indefinite', category: 'nouns' },
  { slug: 'plural-formation', category: 'nouns' },
  { slug: 'basic-prepositions', category: 'prepositions' },
  { slug: 'por-para', category: 'prepositions' },
  { slug: 'object-pronouns', category: 'pronouns' },
  { slug: 'subject-pronouns', category: 'pronouns' },
  { slug: 'questions', category: 'syntax' },
  { slug: 'word-order', category: 'syntax' },
  { slug: 'imperfect-tense', category: 'verbs' },
  { slug: 'present-irregular', category: 'verbs' },
  { slug: 'present-regular', category: 'verbs' },
  { slug: 'preterite-tense', category: 'verbs' },
  { slug: 'ser-estar', category: 'verbs' },
  { slug: 'subjunctive-mood', category: 'verbs' }
];

// Create a set of database topic slugs for quick lookup
const databaseSlugs = new Set(databaseTopics.map(t => t.slug));

// Find missing topics
const missingTopics = discoveredTopics.filter(topic => !databaseSlugs.has(topic.slug));

// Categorize missing topics
const categorizedMissing = {};
missingTopics.forEach(topic => {
  if (!categorizedMissing[topic.category]) {
    categorizedMissing[topic.category] = [];
  }
  categorizedMissing[topic.category].push(topic);
});

// Generate analysis report
console.log('='.repeat(80));
console.log('SPANISH GRAMMAR TOPICS ANALYSIS');
console.log('='.repeat(80));
console.log(`Total discovered topics: ${discoveredTopics.length}`);
console.log(`Topics in database: ${databaseTopics.length}`);
console.log(`Missing topics: ${missingTopics.length}`);
console.log('');

console.log('MISSING TOPICS BY CATEGORY:');
console.log('-'.repeat(40));

Object.keys(categorizedMissing).sort().forEach(category => {
  const topics = categorizedMissing[category];
  console.log(`\n${category.toUpperCase()} (${topics.length} missing):`);
  topics.forEach(topic => {
    console.log(`  - ${topic.slug} (${topic.name})`);
  });
});

// Generate SQL for creating missing topics
console.log('\n' + '='.repeat(80));
console.log('SQL TO CREATE MISSING TOPICS');
console.log('='.repeat(80));

const sqlStatements = [];
missingTopics.forEach(topic => {
  const title = topic.name;
  const description = generateDescription(topic.category, topic.name);
  const learningObjectives = generateLearningObjectives(topic.category, topic.name);
  const difficultyLevel = determineDifficultyLevel(topic.category, topic.slug);
  
  const sql = `INSERT INTO grammar_topics (
  id, topic_name, slug, language, category, difficulty_level, curriculum_level,
  title, description, learning_objectives, order_position, is_active, prerequisite_topics
) VALUES (
  gen_random_uuid(),
  '${topic.slug.replace(/-/g, '_')}',
  '${topic.slug}',
  'es',
  '${topic.category}',
  '${difficultyLevel}',
  'KS3',
  '${title}',
  '${description}',
  ARRAY[${learningObjectives.map(obj => `'${obj}'`).join(', ')}],
  1,
  true,
  ARRAY[]::text[]
);`;
  
  sqlStatements.push(sql);
});

// Write SQL to file
fs.writeFileSync('missing_topics.sql', sqlStatements.join('\n\n'));
console.log(`\nSQL statements written to missing_topics.sql`);

// Helper functions
function generateDescription(category, name) {
  const descriptions = {
    'adjectives': `Learn about ${name.toLowerCase()} in Spanish adjectives`,
    'adverbial-prepositional': `Master ${name.toLowerCase()} in Spanish`,
    'adverbs': `Understand ${name.toLowerCase()} in Spanish adverbs`,
    'articles': `Learn Spanish ${name.toLowerCase()}`,
    'nouns': `Master Spanish ${name.toLowerCase()}`,
    'prepositions': `Learn Spanish ${name.toLowerCase()}`,
    'pronouns': `Understand Spanish ${name.toLowerCase()}`,
    'sounds-spelling': `Master Spanish ${name.toLowerCase()}`,
    'verbs': `Learn Spanish ${name.toLowerCase()}`,
    'word-formation': `Understand Spanish ${name.toLowerCase()}`
  };
  
  return descriptions[category] || `Learn about ${name.toLowerCase()} in Spanish grammar`;
}

function generateLearningObjectives(category, name) {
  // Generate 3-4 learning objectives based on category and topic
  const baseObjectives = [
    `Understand the concept of ${name.toLowerCase()}`,
    `Apply ${name.toLowerCase()} rules correctly`,
    `Identify ${name.toLowerCase()} in context`,
    `Use ${name.toLowerCase()} in sentences`
  ];
  
  return baseObjectives.slice(0, 4);
}

function determineDifficultyLevel(category, slug) {
  // Basic topics
  if (slug.includes('basic') || slug.includes('simple') || slug.includes('present-tense')) {
    return 'beginner';
  }
  
  // Advanced topics
  if (slug.includes('subjunctive') || slug.includes('conditional') || slug.includes('perfect') || 
      slug.includes('pluperfect') || slug.includes('passive') || slug.includes('reported')) {
    return 'advanced';
  }
  
  // Most topics are intermediate
  return 'intermediate';
}
