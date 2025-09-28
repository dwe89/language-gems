const fs = require('fs');

// Function to extract unique topics from CSV
function extractTopicsFromCSV(csvPath) {
  console.log('📁 Reading CSV file:', csvPath);
  
  try {
    const csvContent = fs.readFileSync(csvPath, 'utf8');
    console.log('📊 CSV file size:', csvContent.length, 'characters');
    
    const lines = csvContent.split('\n');
    console.log('📊 Total lines:', lines.length);
    
    const topics = new Set();
    
    for (let i = 1; i < Math.min(lines.length, 10); i++) {
      const line = lines[i].trim();
      console.log(`Line ${i}:`, line.substring(0, 100) + '...');
      
      if (line) {
        const [slug, title, category] = line.split(',');
        console.log(`  Parsed: slug="${slug}", title="${title}", category="${category}"`);
        
        if (slug && title && category) {
          topics.add(JSON.stringify({ slug, title, category }));
        }
      }
    }
    
    const uniqueTopics = Array.from(topics).map(t => JSON.parse(t));
    console.log('✅ Unique topics found:', uniqueTopics.length);
    
    uniqueTopics.forEach((topic, index) => {
      console.log(`  ${index + 1}. ${topic.title} (${topic.category})`);
    });
    
    return uniqueTopics;
  } catch (error) {
    console.error('❌ Error reading CSV:', error.message);
    return [];
  }
}

// Test the CSV parsing
console.log('🧪 Testing CSV parsing...');
const topics = extractTopicsFromCSV('./spanish_grammar_content_COMPLETE.csv');
console.log(`\n📊 Final result: ${topics.length} topics extracted`);
