const fs = require('fs');
const path = require('path');

// Get all existing Spanish verb pages
const verbsDir = 'src/app/grammar/spanish/verbs';
const existingPages = [];

function findPages(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory() && !item.includes('practice') && !item.includes('quiz')) {
      const pagePath = path.join(fullPath, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        existingPages.push(item);
      }
    }
  }
}

findPages(verbsDir);
console.log(`Found ${existingPages.length} existing Spanish verb pages`);

// Create a safe list of related topics that actually exist
const safeRelatedTopics = [
  { title: 'Present Tense', url: '/grammar/spanish/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Preterite Tense', url: '/grammar/spanish/verbs/preterite', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Present Perfect', url: '/grammar/spanish/verbs/present-perfect', difficulty: 'intermediate' },
  { title: 'Subjunctive Present', url: '/grammar/spanish/verbs/subjunctive-present', difficulty: 'advanced' },
  { title: 'Subjunctive Imperfect', url: '/grammar/spanish/verbs/subjunctive-imperfect', difficulty: 'advanced' },
  { title: 'Imperative', url: '/grammar/spanish/verbs/imperative', difficulty: 'intermediate' },
  { title: 'Reflexive Verbs', url: '/grammar/spanish/verbs/reflexive', difficulty: 'intermediate' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Por vs Para', url: '/grammar/spanish/verbs/por-vs-para', difficulty: 'intermediate' },
  { title: 'Stem-changing Verbs', url: '/grammar/spanish/verbs/stem-changing', difficulty: 'intermediate' },
  { title: 'Irregular Verbs', url: '/grammar/spanish/verbs/irregular-verbs', difficulty: 'intermediate' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' },
  { title: 'Passive Voice', url: '/grammar/spanish/verbs/passive-voice', difficulty: 'advanced' },
  { title: 'Gerunds', url: '/grammar/spanish/verbs/gerunds', difficulty: 'intermediate' },
  { title: 'Past Participles', url: '/grammar/spanish/verbs/past-participles', difficulty: 'intermediate' },
  { title: 'Negation', url: '/grammar/spanish/verbs/negation', difficulty: 'beginner' },
  { title: 'Interrogatives', url: '/grammar/spanish/verbs/interrogatives', difficulty: 'beginner' }
];

// Function to get 4 random safe related topics
function getSafeRelatedTopics() {
  const shuffled = [...safeRelatedTopics].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 4);
}

// Process each page
let fixedCount = 0;
for (const pageName of existingPages) {
  const pagePath = path.join(verbsDir, pageName, 'page.tsx');
  let content = fs.readFileSync(pagePath, 'utf8');
  
  // Check if this page has relatedTopics that might be broken
  if (content.includes('const relatedTopics = [')) {
    console.log(`Fixing ${pageName}...`);
    
    // Generate safe related topics for this page
    const newRelatedTopics = getSafeRelatedTopics();
    const relatedTopicsCode = `const relatedTopics = [
  { title: '${newRelatedTopics[0].title}', url: '${newRelatedTopics[0].url}', difficulty: '${newRelatedTopics[0].difficulty}' },
  { title: '${newRelatedTopics[1].title}', url: '${newRelatedTopics[1].url}', difficulty: '${newRelatedTopics[1].difficulty}' },
  { title: '${newRelatedTopics[2].title}', url: '${newRelatedTopics[2].url}', difficulty: '${newRelatedTopics[2].difficulty}' },
  { title: '${newRelatedTopics[3].title}', url: '${newRelatedTopics[3].url}', difficulty: '${newRelatedTopics[3].difficulty}' }
];`;
    
    // Replace the relatedTopics section
    content = content.replace(
      /const relatedTopics = \[[\s\S]*?\];/,
      relatedTopicsCode
    );
    
    fs.writeFileSync(pagePath, content);
    fixedCount++;
  }
}

console.log(`Fixed ${fixedCount} pages with safe related topics`);
