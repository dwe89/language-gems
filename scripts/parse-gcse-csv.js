const fs = require('fs');

// Read the GCSE vocabulary CSV
const csvContent = fs.readFileSync('./data/vocabulary/gcse-spanish-vocabulary.csv', 'utf8');
const lines = csvContent.trim().split('\n');

console.log('Total lines in CSV:', lines.length);
console.log('Header:', lines[0]);
console.log('Sample line:', lines[1]);

// Parse CSV properly
const vocabularyItems = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  // Parse CSV with proper comma handling
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

console.log('\nThemes and topics:');
Object.keys(themes).forEach(theme => {
  console.log(`\n${theme}:`);
  Object.keys(themes[theme]).forEach(topic => {
    console.log(`  ${topic}: ${themes[theme][topic]} words`);
  });
});

// Save parsed data for batch import
fs.writeFileSync('./gcse-parsed.json', JSON.stringify(vocabularyItems, null, 2));
console.log('\nSaved parsed data to gcse-parsed.json'); 