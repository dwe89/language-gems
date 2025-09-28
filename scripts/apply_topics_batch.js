#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

// Read the generated SQL
const topicsSQL = fs.readFileSync('generated_topics.sql', 'utf8');

// Split into individual INSERT statements
const insertStatements = topicsSQL.split('\n\n').filter(stmt => stmt.trim().length > 0);

console.log(`Found ${insertStatements.length} topic insert statements`);

// Process in batches of 10
const batchSize = 10;
const batches = [];

for (let i = 0; i < insertStatements.length; i += batchSize) {
  batches.push(insertStatements.slice(i, i + batchSize));
}

console.log(`Processing ${batches.length} batches of ${batchSize} topics each`);

// Execute each batch
batches.forEach((batch, index) => {
  console.log(`\nProcessing batch ${index + 1}/${batches.length}...`);
  
  const batchSQL = batch.join('\n\n');
  const filename = `batch_${index + 1}_topics.sql`;
  
  // Write batch to file
  fs.writeFileSync(filename, batchSQL);
  
  try {
    // Execute the batch using supabase CLI (you'll need to implement this)
    console.log(`- Created ${filename} with ${batch.length} topics`);
    console.log(`- Topics in this batch: ${batch.length}`);
    
    // Extract topic names for logging
    const topicNames = batch.map(stmt => {
      const match = stmt.match(/'([^']+)',\s*'([^']+)',\s*'es'/);
      return match ? match[2] : 'unknown';
    });
    
    console.log(`- Topic slugs: ${topicNames.slice(0, 5).join(', ')}${topicNames.length > 5 ? '...' : ''}`);
    
  } catch (error) {
    console.error(`Error processing batch ${index + 1}:`, error.message);
  }
});

console.log('\nBatch files created. You can now apply them manually or use the Supabase migration system.');
console.log('Files created:');
for (let i = 0; i < batches.length; i++) {
  console.log(`- batch_${i + 1}_topics.sql`);
}
