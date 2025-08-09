#!/usr/bin/env node

/**
 * Quick SEO Title Fix Script for Language Gems
 * This script focuses on the highest-impact pages for immediate SEO improvement
 */

const fs = require('fs');
const path = require('path');

// High-priority pages to fix (server components that can be updated easily)
const PRIORITY_FIXES = [
  {
    file: 'src/app/terms/page.tsx',
    title: 'Terms of Service | Language Gems Educational Platform',
    description: 'Terms of service for Language Gems educational platform. Review our policies for using our GCSE language learning games and teaching resources.'
  },
  {
    file: 'src/app/privacy/page.tsx', 
    title: 'Privacy Policy | Student Data Protection | Language Gems',
    description: 'Privacy policy and student data protection information for Language Gems educational platform. GDPR compliant and school-safe.'
  },
  {
    file: 'src/app/cookies/page.tsx',
    title: 'Cookie Policy | Language Gems Educational Platform', 
    description: 'Cookie usage policy for Language Gems educational platform. Learn how we use cookies to improve your learning experience.'
  },
  {
    file: 'src/app/help-center/page.tsx',
    title: 'Help Center | Support & FAQs | Language Gems',
    description: 'Get help with Language Gems platform. Find answers to common questions about our GCSE language learning games and teaching tools.'
  },
  {
    file: 'src/app/tutorials/page.tsx',
    title: 'Getting Started Guide | Language Gems Tutorials for Teachers',
    description: 'Learn how to use Language Gems in your classroom. Step-by-step tutorials for teachers to maximize student engagement and learning outcomes.'
  },
  {
    file: 'src/app/documentation/page.tsx',
    title: 'Teacher Documentation | Platform Guide | Language Gems',
    description: 'Comprehensive documentation for Language Gems educational platform. Teacher guides, best practices, and platform features for GCSE language learning.'
  },
  {
    file: 'src/app/community/page.tsx',
    title: 'Language Learning Community | Teacher Network | Language Gems',
    description: 'Join the Language Gems teacher community. Share resources, get teaching tips, and connect with other MFL educators using our platform.'
  },
  {
    file: 'src/app/contact-sales/page.tsx',
    title: 'Contact Sales | School Pricing & Demos | Language Gems for Schools',
    description: 'Contact our sales team for school pricing, demos, and bulk licensing. Get Language Gems for your entire language department.'
  }
];

// Function to check if a file is a client component
function isClientComponent(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    return content.includes('"use client"') || content.includes("'use client'");
  } catch {
    return false;
  }
}

// Function to add metadata to a page
function addMetadataToPage(fileInfo) {
  const { file, title, description } = fileInfo;
  
  if (!fs.existsSync(file)) {
    console.log(`⚠️  File not found: ${file}`);
    return false;
  }

  // Check if it's a client component
  if (isClientComponent(file)) {
    console.log(`⚠️  Skipping ${file} - client component (needs manual conversion)`);
    return false;
  }

  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if it already has metadata
    if (content.includes('export const metadata')) {
      console.log(`⚠️  Skipping ${file} - already has metadata`);
      return false;
    }

    // Calculate relative path to components
    const route = file.replace('src/app', '').replace('/page.tsx', '') || '/';
    const pathDepth = route.split('/').length - 1;
    const relativePath = '../'.repeat(pathDepth);

    // Generate the metadata
    const metadataImport = `import { Metadata } from 'next';\nimport { generateMetadata } from '${relativePath}components/seo/SEOWrapper';\n`;
    
    const metadataExport = `\nexport const metadata: Metadata = generateMetadata({\n  title: '${title}',\n  description: '${description}',\n  canonical: '${route}'\n});\n`;

    // Find where to insert (after imports, before default export)
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the end of imports
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import ') || lines[i].includes('from ')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '') {
        continue; // Skip empty lines
      } else {
        break;
      }
    }

    // Insert the metadata
    const beforeInsert = lines.slice(0, insertIndex).join('\n');
    const afterInsert = lines.slice(insertIndex).join('\n');
    
    let updatedContent = beforeInsert;
    if (!beforeInsert.endsWith('\n')) updatedContent += '\n';
    updatedContent += metadataImport + metadataExport;
    if (!afterInsert.startsWith('\n')) updatedContent += '\n';
    updatedContent += afterInsert;

    // Write the updated content
    fs.writeFileSync(file, updatedContent);
    console.log(`✅ Updated ${route}`);
    return true;

  } catch (error) {
    console.log(`❌ Failed to update ${file}: ${error.message}`);
    return false;
  }
}

// Function to show current status
function showStatus() {
  console.log('📊 Current Page Title Status\n');
  
  PRIORITY_FIXES.forEach(fix => {
    const route = fix.file.replace('src/app', '').replace('/page.tsx', '') || '/';
    const exists = fs.existsSync(fix.file);
    const isClient = exists ? isClientComponent(fix.file) : false;
    const hasMetadata = exists ? fs.readFileSync(fix.file, 'utf8').includes('export const metadata') : false;
    
    console.log(`${route}:`);
    console.log(`  📁 File: ${exists ? '✅' : '❌'} ${fix.file}`);
    console.log(`  🔧 Type: ${isClient ? '⚡ Client Component' : '🖥️  Server Component'}`);
    console.log(`  📝 Metadata: ${hasMetadata ? '✅ Present' : '❌ Missing'}`);
    console.log(`  🎯 Target: "${fix.title}"`);
    console.log('');
  });
}

// Function to run the quick fix
function runQuickFix() {
  console.log('🚀 Running Quick SEO Title Fix...\n');
  
  let updated = 0;
  let skipped = 0;
  
  PRIORITY_FIXES.forEach(fix => {
    if (addMetadataToPage(fix)) {
      updated++;
    } else {
      skipped++;
    }
  });
  
  console.log('\n📊 Summary:');
  console.log(`  ✅ Updated: ${updated} pages`);
  console.log(`  ⚠️  Skipped: ${skipped} pages`);
  
  if (skipped > 0) {
    console.log('\n🔧 Next Steps for Skipped Pages:');
    console.log('  1. Convert client components to server components where possible');
    console.log('  2. Or manually add <Head> tags for client components');
    console.log('  3. Use the SEO wrapper component for dynamic metadata');
  }
  
  console.log('\n🎉 Quick fix complete! Deploy to see improved page titles.');
}

// Function to update root layout for better default title
function updateRootLayout() {
  const layoutFile = 'src/app/layout.tsx';
  
  if (!fs.existsSync(layoutFile)) {
    console.log('❌ Root layout file not found');
    return false;
  }
  
  try {
    const content = fs.readFileSync(layoutFile, 'utf8');
    
    // Update the default title to be more homepage-specific
    const oldTitleRegex = /default:\s*['"`]Language Gems - Interactive GCSE Language Learning Games & Vocabulary Platform['"`]/;
    const newTitle = "default: 'GCSE Language Learning Games | Interactive Vocabulary Platform | Language Gems'";
    
    if (content.match(oldTitleRegex)) {
      const updatedContent = content.replace(oldTitleRegex, newTitle);
      fs.writeFileSync(layoutFile, updatedContent);
      console.log('✅ Updated root layout default title');
      return true;
    } else {
      console.log('⚠️  Root layout title pattern not found or already updated');
      return false;
    }
    
  } catch (error) {
    console.log(`❌ Failed to update root layout: ${error.message}`);
    return false;
  }
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'status':
    showStatus();
    break;
  case 'fix':
    runQuickFix();
    break;
  case 'layout':
    updateRootLayout();
    break;
  case 'all':
    console.log('🚀 Running Complete SEO Title Fix...\n');
    updateRootLayout();
    console.log('');
    runQuickFix();
    break;
  default:
    console.log('🎯 Language Gems - Quick SEO Title Fix\n');
    console.log('Usage:');
    console.log('  node quick-seo-fix.js status  - Show current status');
    console.log('  node quick-seo-fix.js layout  - Update root layout default title');
    console.log('  node quick-seo-fix.js fix     - Fix priority page titles');
    console.log('  node quick-seo-fix.js all     - Run complete fix (layout + pages)');
    console.log('\nThis will fix the most important page titles for immediate SEO impact.');
}
