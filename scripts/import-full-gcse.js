const fs = require('fs');

// Read the fixed GCSE vocabulary CSV
const csvContent = fs.readFileSync('./data/vocabulary/gcse-fixed.csv', 'utf8');
const lines = csvContent.trim().split('\n');

console.log('Total lines in CSV:', lines.length);
console.log('Header:', lines[0]);

// Parse CSV properly (skip header at line 0)
const vocabularyItems = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  // Parse CSV with proper comma handling for quoted fields
  const parts = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  parts.push(current.trim());
  
  if (parts.length >= 4) {
    const item = {
      theme: parts[0] || '',
      topic: parts[1] || '',
      partOfSpeech: parts[2] || '',
      spanishTerm: parts[3] || '',
      englishTranslation: parts[4] || ''
    };
    
    if (item.spanishTerm && item.englishTranslation) {
      vocabularyItems.push(item);
    }
  }
}

console.log('Parsed vocabulary items:', vocabularyItems.length);
console.log('Sample items:');
console.log(vocabularyItems.slice(0, 5));

// Group by theme/topic for analysis
const themes = {};
vocabularyItems.forEach(item => {
  if (!themes[item.theme]) themes[item.theme] = {};
  if (!themes[item.theme][item.topic]) themes[item.theme][item.topic] = 0;
  themes[item.theme][item.topic]++;
});

console.log('\nGCSE Vocabulary Breakdown:');
let totalWords = 0;
Object.keys(themes).forEach(theme => {
  console.log(`\n${theme}:`);
  Object.keys(themes[theme]).forEach(topic => {
    console.log(`  ${topic}: ${themes[theme][topic]} words`);
    totalWords += themes[theme][topic];
  });
});
console.log(`\nTotal words: ${totalWords}`);

// Generate SQL import statements
console.log('\nGenerating SQL for import...');
const sqlStatements = [];

vocabularyItems.forEach((item, index) => {
  // Escape single quotes for SQL
  const spanishEscaped = item.spanishTerm.replace(/'/g, "''");
  const englishEscaped = item.englishTranslation.replace(/'/g, "''");
  const themeEscaped = item.theme.replace(/'/g, "''");
  const topicEscaped = item.topic.replace(/'/g, "''");
  const partOfSpeechEscaped = item.partOfSpeech.replace(/'/g, "''");
  
  const sql = `SELECT import_gcse_vocabulary_simple('${themeEscaped}', '${topicEscaped}', '${partOfSpeechEscaped}', '${spanishEscaped}', '${englishEscaped}');`;
  sqlStatements.push(sql);
});

// Write SQL statements to files in batches of 100
const batchSize = 100;
for (let i = 0; i < sqlStatements.length; i += batchSize) {
  const batch = sqlStatements.slice(i, i + batchSize);
  const batchNumber = Math.floor(i / batchSize) + 1;
  const filename = `./scripts/import-batch-${batchNumber}.sql`;
  
  fs.writeFileSync(filename, batch.join('\n'));
  console.log(`Created ${filename} with ${batch.length} statements`);
}

console.log(`\nGenerated ${Math.ceil(sqlStatements.length / batchSize)} SQL batch files for import`);
console.log('Ready to import all GCSE vocabulary to Supabase!'); 