#!/usr/bin/env node

const fs = require('fs');

// Load the generated topic data
const topicsData = JSON.parse(fs.readFileSync('generated_topics_data.json', 'utf8'));

console.log(`Loading ${topicsData.length} topics for bulk import...`);

// Filter out topics we've already created
const existingTopics = new Set([
  'adjective-agreement', 'adjective-position', 'comparatives', 'superlatives',
  'gender', 'plural-formation', 'definite', 'indefinite', 'gender-plurals', 'articles', 'demonstrative',
  'basic-prepositions', 'por-para', 'subject-pronouns', 'object-pronouns',
  'word-order', 'questions', 'present-regular', 'present-irregular', 'ser-estar',
  'preterite-tense', 'imperfect-tense', 'subjunctive-mood',
  // Recently added
  'agreement', 'comparison', 'position', 'possessive', 'personal-a'
]);

const remainingTopics = topicsData.filter(topic => !existingTopics.has(topic.slug));

console.log(`${remainingTopics.length} topics remaining to import`);

// Create a comprehensive SQL file for the remaining topics
const sqlStatements = [];
let orderPosition = 200; // Start from 200 to avoid conflicts

remainingTopics.forEach((topicData, index) => {
  const sql = `INSERT INTO grammar_topics (
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
    '${topicData.description.replace(/'/g, "''")}',
    ARRAY[${topicData.learningObjectives.map(obj => `'${obj.replace(/'/g, "''")}'`).join(', ')}],
    ${orderPosition + index},
    true,
    ARRAY[]::uuid[]
  );`;
  
  sqlStatements.push(sql);
});

// Write the comprehensive SQL file
fs.writeFileSync('remaining_topics_bulk.sql', sqlStatements.join('\n\n'));

console.log('Created remaining_topics_bulk.sql');
console.log(`Contains ${sqlStatements.length} INSERT statements`);

// Create smaller batch files for easier processing
const batchSize = 20;
const batches = [];

for (let i = 0; i < sqlStatements.length; i += batchSize) {
  batches.push(sqlStatements.slice(i, i + batchSize));
}

console.log(`\nCreating ${batches.length} batch files of ${batchSize} topics each:`);

batches.forEach((batch, index) => {
  const filename = `remaining_batch_${index + 1}.sql`;
  fs.writeFileSync(filename, batch.join('\n\n'));
  console.log(`- ${filename} (${batch.length} topics)`);
});

// Generate summary
console.log('\nSummary by category:');
const categoryCount = {};
remainingTopics.forEach(topic => {
  categoryCount[topic.category] = (categoryCount[topic.category] || 0) + 1;
});

Object.keys(categoryCount).sort().forEach(category => {
  console.log(`- ${category}: ${categoryCount[category]} topics`);
});

console.log('\nNext steps:');
console.log('1. Review the generated SQL files');
console.log('2. Apply the batch files using Supabase migrations');
console.log('3. Then run the content generation for practice and quiz content');
console.log('4. Test the grammar navigation system');

// Create a verification script
const verificationSQL = `
-- Verify all topics were created
SELECT 
  category,
  COUNT(*) as topic_count,
  STRING_AGG(slug, ', ' ORDER BY slug) as topics
FROM grammar_topics 
WHERE language = 'es' 
GROUP BY category 
ORDER BY category;

-- Check total count
SELECT COUNT(*) as total_spanish_topics FROM grammar_topics WHERE language = 'es';
`;

fs.writeFileSync('verify_topics.sql', verificationSQL);
console.log('5. Run verify_topics.sql to confirm all topics were created');
