#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Import our page titles configuration
const { PAGE_TITLES, shouldNoIndex } = require('./src/lib/seo/pageTitles.ts');

// List of server component pages that can be updated directly
const SERVER_COMPONENT_PAGES = [
  'src/app/auth/signup/page.tsx',
  'src/app/auth/verify-email/page.tsx', 
  'src/app/auth/login/page.tsx',
  'src/app/sitemap/page.tsx',
  'src/app/schools/page.tsx'
];

// Function to get route from file path
function getRouteFromPath(filePath) {
  const appPath = filePath.replace('src/app', '').replace('/page.tsx', '');
  return appPath || '/';
}

// Function to add metadata to a server component page
function addMetadataToServerComponent(filePath) {
  const route = getRouteFromPath(filePath);
  const title = PAGE_TITLES[route];
  
  if (!title) {
    console.log(`⚠️  No title defined for ${route}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it already has metadata
    if (content.includes('export const metadata')) {
      console.log(`⚠️  Skipping ${route} - already has metadata`);
      return false;
    }
    
    const noIndex = shouldNoIndex(route);
    const pathDepth = route.split('/').length - 1;
    const relativePath = '../'.repeat(pathDepth);
    
    // Generate imports
    const metadataImport = `import { Metadata } from 'next';\nimport { generateMetadata } from '${relativePath}components/seo/SEOWrapper';\n`;
    
    // Generate metadata export
    const description = noIndex 
      ? 'Private area of Language Gems educational platform.'
      : 'Interactive GCSE language learning with gamified vocabulary practice, teacher analytics, and curriculum-aligned content for Spanish, French, and German.';
    
    const metadataExport = `\nexport const metadata: Metadata = generateMetadata({\n  title: '${title}',\n  description: '${description}',\n  canonical: '${route}',${noIndex ? '\n  noIndex: true' : ''}\n});\n`;
    
    // Find where to insert the metadata
    const lines = content.split('\n');
    let insertIndex = 0;
    
    // Find the last import line
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import ') || lines[i].includes('from ')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '') {
        // Skip empty lines after imports
        continue;
      } else {
        break;
      }
    }
    
    // Insert the metadata
    const beforeInsert = lines.slice(0, insertIndex).join('\n');
    const afterInsert = lines.slice(insertIndex).join('\n');
    
    const updatedContent = beforeInsert + '\n' + metadataImport + metadataExport + '\n' + afterInsert;
    
    // Write the updated content
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ Updated ${route}${noIndex ? ' (noIndex)' : ''}`);
    return true;
    
  } catch (error) {
    console.log(`❌ Failed to update ${route}: ${error.message}`);
    return false;
  }
}

// Main function
function updateServerComponents() {
  console.log('🔄 Updating server component pages with metadata...\n');
  
  let updated = 0;
  
  for (const filePath of SERVER_COMPONENT_PAGES) {
    if (fs.existsSync(filePath)) {
      if (addMetadataToServerComponent(filePath)) {
        updated++;
      }
    } else {
      console.log(`⚠️  File not found: ${filePath}`);
    }
  }
  
  console.log(`\n📊 Updated ${updated} server component pages`);
}

// Function to generate a comprehensive report
function generateSEOReport() {
  console.log('📊 SEO Title Optimization Report\n');
  console.log('='.repeat(60));
  
  // Count different types of pages
  const publicPages = [];
  const privatePages = [];
  
  Object.entries(PAGE_TITLES).forEach(([route, title]) => {
    if (shouldNoIndex(route)) {
      privatePages.push({ route, title });
    } else {
      publicPages.push({ route, title });
    }
  });
  
  console.log(`\n✅ PUBLIC PAGES (SEO Optimized): ${publicPages.length}`);
  publicPages.slice(0, 10).forEach(page => {
    console.log(`   ${page.route}`);
    console.log(`   📝 "${page.title}"`);
    console.log('');
  });
  
  if (publicPages.length > 10) {
    console.log(`   ... and ${publicPages.length - 10} more public pages\n`);
  }
  
  console.log(`\n🔒 PRIVATE PAGES (No Index): ${privatePages.length}`);
  privatePages.slice(0, 5).forEach(page => {
    console.log(`   ${page.route} - "${page.title}"`);
  });
  
  if (privatePages.length > 5) {
    console.log(`   ... and ${privatePages.length - 5} more private pages\n`);
  }
  
  console.log('\n🎯 KEY SEO BENEFITS:');
  console.log('   ✅ Optimized titles for GCSE language learning keywords');
  console.log('   ✅ Proper noindex for private areas (dashboards, auth)');
  console.log('   ✅ Branded titles maintain consistency');
  console.log('   ✅ Under 60 characters for most titles');
  console.log('   ✅ Geographic targeting (UK schools)');
  
  console.log('\n📈 EXPECTED IMPACT:');
  console.log('   • Better search visibility for target keywords');
  console.log('   • Improved click-through rates from search results');  
  console.log('   • Enhanced brand recognition');
  console.log('   • Reduced indexing of private content');
  
  console.log('\n🔧 NEXT STEPS:');
  console.log('   1. Run this script to update server components');
  console.log('   2. Manually update client component pages');
  console.log('   3. Update the root layout template if needed');
  console.log('   4. Test with Google Search Console');
}

// CLI interface
const command = process.argv[2];

if (command === 'update') {
  updateServerComponents();
} else if (command === 'report') {
  generateSEOReport();
} else {
  console.log('SEO Title Optimization Tool\n');
  console.log('Usage:');
  console.log('  node seo-updater.js report  - Generate comprehensive SEO report');
  console.log('  node seo-updater.js update  - Update server component pages');
  console.log('\nFor client components, manual updates are required.');
}
