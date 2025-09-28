#!/usr/bin/env node

const fs = require('fs');

// Read the existing generated content and fix the age_group values
const contentData = JSON.parse(fs.readFileSync('generated_content_data.json', 'utf8'));

console.log(`Fixing age_group values for ${contentData.length} topics...`);

// Generate corrected SQL for content insertion
const contentInserts = [];

contentData.forEach((data, index) => {
  const { topic, practice, quiz } = data;
  
  // Practice content insert with corrected age_group
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
    '11-14',
    ${practice.estimated_duration},
    1,
    true,
    false
  );`;
  
  contentInserts.push(practiceSQL);
  
  // Quiz content insert with corrected age_group
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
    '11-14',
    ${quiz.estimated_duration},
    2,
    true,
    false
  );`;
  
  contentInserts.push(quizSQL);
});

// Write corrected SQL files
fs.writeFileSync('corrected_practice_content.sql', contentInserts.join('\n\n'));

// Create smaller batch files for easier processing
const batchSize = 6; // Smaller batches to avoid issues
const batches = [];

for (let i = 0; i < contentInserts.length; i += batchSize) {
  batches.push(contentInserts.slice(i, i + batchSize));
}

console.log(`Creating ${batches.length} corrected batch files:`);

batches.forEach((batch, index) => {
  const filename = `corrected_content_batch_${index + 1}.sql`;
  fs.writeFileSync(filename, batch.join('\n\n'));
  console.log(`- ${filename} (${batch.length} content items)`);
});

console.log('\nCorrected files created with proper age_group values (11-14)');
console.log('Ready to apply to database!');

// Create a verification script
const verificationSQL = `
-- Verify content was created for all topics
SELECT 
  gt.category,
  gt.slug,
  COUNT(gc.id) as content_count,
  STRING_AGG(gc.content_type, ', ' ORDER BY gc.content_type) as content_types
FROM grammar_topics gt
LEFT JOIN grammar_content gc ON gt.id = gc.topic_id
WHERE gt.language = 'es'
GROUP BY gt.id, gt.category, gt.slug
ORDER BY gt.category, gt.slug;

-- Check total content count
SELECT 
  content_type,
  COUNT(*) as count
FROM grammar_content gc
JOIN grammar_topics gt ON gc.topic_id = gt.id
WHERE gt.language = 'es'
GROUP BY content_type;
`;

fs.writeFileSync('verify_content.sql', verificationSQL);
console.log('- verify_content.sql (to check results after applying)');
