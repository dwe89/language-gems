#!/usr/bin/env node

const fs = require('fs');

// List of all practice and quiz pages that need to be client components
const practicePages = [
  'src/app/grammar/spanish/verbs/imperfect/practice/page.tsx',
  'src/app/grammar/spanish/verbs/conditional/practice/page.tsx', 
  'src/app/grammar/spanish/verbs/preterite/practice/page.tsx',
  'src/app/grammar/spanish/verbs/subjunctive/practice/page.tsx',
  'src/app/grammar/spanish/verbs/irregular-verbs/practice/page.tsx',
  'src/app/grammar/spanish/verbs/ser-vs-estar/practice/page.tsx',
  'src/app/grammar/spanish/verbs/future/practice/page.tsx'
];

const quizPages = [
  'src/app/grammar/spanish/verbs/imperfect/quiz/page.tsx',
  'src/app/grammar/spanish/verbs/conditional/quiz/page.tsx',
  'src/app/grammar/spanish/verbs/preterite/quiz/page.tsx',
  'src/app/grammar/spanish/verbs/subjunctive/quiz/page.tsx',
  'src/app/grammar/spanish/verbs/future/quiz/page.tsx'
];

function fixClientComponent(filePath) {
  console.log(`Fixing ${filePath}...`);
  
  if (!fs.existsSync(filePath)) {
    console.log(`File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf8');
  
  // Skip if already has 'use client'
  if (content.includes("'use client'")) {
    console.log(`Already fixed: ${filePath}`);
    return;
  }

  // Add 'use client' at the top and remove metadata export
  let newContent = content;
  
  // Remove metadata export since client components can't export metadata
  newContent = newContent.replace(/export const metadata.*?};/s, '');
  
  // Add 'use client' at the top
  newContent = `'use client';\n\n${newContent}`;

  fs.writeFileSync(filePath, newContent);
  console.log(`Fixed ${filePath}`);
}

// Fix all practice and quiz pages
[...practicePages, ...quizPages].forEach(fixClientComponent);

console.log('\\nAll practice and quiz pages have been converted to client components.');
