// Test requires compilation first, let's just create a simple test
const WordSearch = require('@blex41/word-search');

console.log('🧪 Testing word search generation...');

const testWords = ['HELLO', 'WORLD', 'SPANISH', 'ENGLISH', 'LEARN', 'STUDY', 'PRACTICE', 'LANGUAGE'];

try {
  const wsOptions = {
    cols: 12,
    rows: 12,
    disabledDirections: [],
    dictionary: testWords,
    maxWords: 8,
    backwardsProbability: 0.3,
    upperCase: true,
    diacritics: false,
    maxRetries: 20
  };

  const ws = new WordSearch(wsOptions);

  console.log('✅ Word search generated successfully!');
  console.log('Grid size:', { rows: 12, cols: 12 });
  console.log('Words placed:', ws.words.length);
  console.log('First few words:', ws.words.slice(0, 3).map(w => w.word));
  console.log('First 3 rows of grid:');
  console.log(ws.grid.slice(0, 3).map(row => row.slice(0, 8).join(' ')));
  console.log('✅ Basic word search functionality works!');

} catch (error) {
  console.error('❌ Error testing word search:', error);
}
