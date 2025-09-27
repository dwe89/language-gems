#!/usr/bin/env node

const fs = require('fs');

// List of all remaining quiz pages that need to be client components
const quizPages = [
  'src/app/grammar/spanish/adjectives/position/quiz/page.tsx',
  'src/app/grammar/spanish/adjectives/demonstrative/quiz/page.tsx',
  'src/app/grammar/spanish/pronouns/personal/quiz/page.tsx',
  'src/app/grammar/spanish/pronouns/possessive/quiz/page.tsx',
  'src/app/grammar/spanish/pronouns/indirect-object/quiz/page.tsx',
  'src/app/grammar/spanish/pronouns/reflexive/quiz/page.tsx',
  'src/app/grammar/spanish/pronouns/direct-object/quiz/page.tsx',
  'src/app/grammar/spanish/verbs/modal-verbs/quiz/page.tsx',
  'src/app/grammar/spanish/verbs/irregular-verbs/quiz/page.tsx',
  'src/app/grammar/spanish/verbs/ser-vs-estar/quiz/page.tsx'
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

// Fix all remaining quiz pages
quizPages.forEach(fixClientComponent);

console.log('\\nAll remaining quiz pages have been converted to client components.');
