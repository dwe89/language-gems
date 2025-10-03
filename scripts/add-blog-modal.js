#!/usr/bin/env node

/**
 * Script to add BlogPageWrapper to all static blog pages
 * This adds the subscription modal and reading progress bar
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Find all page.tsx files in blog subdirectories
const blogDir = path.join(__dirname, '../src/app/blog');

function findBlogPages(dir) {
  const pages = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && item !== '[slug]') {
      // Check if this directory has a page.tsx
      const pagePath = path.join(fullPath, 'page.tsx');
      if (fs.existsSync(pagePath)) {
        pages.push(pagePath);
      }
    }
  }
  
  return pages;
}

function addWrapperToPage(filePath) {
  console.log(`\n📄 Processing: ${path.relative(process.cwd(), filePath)}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Check if already has BlogPageWrapper
  if (content.includes('BlogPageWrapper')) {
    console.log('  ✅ Already has BlogPageWrapper, skipping');
    return;
  }
  
  // Check if it's a client component
  if (content.includes("'use client'")) {
    console.log('  ⚠️  Client component detected, skipping (needs manual review)');
    return;
  }
  
  // Add import after the last import statement
  const importRegex = /^import .+;$/gm;
  const imports = content.match(importRegex);
  
  if (!imports || imports.length === 0) {
    console.log('  ⚠️  No imports found, skipping');
    return;
  }
  
  const lastImport = imports[imports.length - 1];
  const lastImportIndex = content.lastIndexOf(lastImport);
  const afterLastImport = lastImportIndex + lastImport.length;
  
  // Insert the new import
  const newImport = "\nimport BlogPageWrapper from '@/components/blog/BlogPageWrapper';";
  content = content.slice(0, afterLastImport) + newImport + content.slice(afterLastImport);
  
  // Find the return statement in the default export function
  const returnMatch = content.match(/export default function \w+\(\) \{\s*return \(/);
  
  if (!returnMatch) {
    console.log('  ⚠️  Could not find return statement, skipping');
    return;
  }
  
  const returnIndex = content.indexOf(returnMatch[0]) + returnMatch[0].length;
  
  // Add opening wrapper
  content = content.slice(0, returnIndex) + '\n    <BlogPageWrapper>' + content.slice(returnIndex);
  
  // Find the closing of the return statement (last ");" before the closing "}")
  // We need to find the matching closing parenthesis
  let depth = 1;
  let i = returnIndex + 20; // Start after the opening
  let closingIndex = -1;
  
  while (i < content.length && depth > 0) {
    if (content[i] === '(' && content[i-1] !== "'" && content[i-1] !== '"') {
      depth++;
    } else if (content[i] === ')' && content[i-1] !== "'" && content[i-1] !== '"') {
      depth--;
      if (depth === 0) {
        closingIndex = i;
        break;
      }
    }
    i++;
  }
  
  if (closingIndex === -1) {
    console.log('  ⚠️  Could not find closing parenthesis, skipping');
    return;
  }
  
  // Add closing wrapper before the closing parenthesis
  content = content.slice(0, closingIndex) + '\n    </BlogPageWrapper>' + content.slice(closingIndex);
  
  // Write the modified content
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('  ✅ Added BlogPageWrapper successfully');
}

// Main execution
console.log('🔧 Adding BlogPageWrapper to all static blog pages...\n');

const pages = findBlogPages(blogDir);

console.log(`Found ${pages.length} static blog pages:\n`);

for (const page of pages) {
  addWrapperToPage(page);
}

console.log('\n✅ Done! All static blog pages now have the subscription modal.');
console.log('\n📝 Note: Some pages may need manual review if they have complex structures.');
console.log('🧪 Test by visiting any static blog page and scrolling to 50% or moving mouse to top.\n');

