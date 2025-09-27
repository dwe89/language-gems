#!/usr/bin/env node

const fs = require('fs');

// List of all remaining practice pages that need to be client components
const practicePages = [
  'src/app/grammar/spanish/adjectives/position/practice/page.tsx',
  'src/app/grammar/spanish/adjectives/demonstrative/practice/page.tsx',
  'src/app/grammar/spanish/pronouns/personal/practice/page.tsx',
  'src/app/grammar/spanish/pronouns/possessive/practice/page.tsx',
  'src/app/grammar/spanish/pronouns/indirect-object/practice/page.tsx',
  'src/app/grammar/spanish/pronouns/reflexive/practice/page.tsx',
  'src/app/grammar/spanish/pronouns/direct-object/practice/page.tsx'
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

// Fix all remaining practice pages
practicePages.forEach(fixClientComponent);

console.log('\\nAll remaining practice pages have been converted to client components.');
