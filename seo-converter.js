#!/usr/bin/env node

/**
 * Auto-convert Client Components to Server Components with SEO Metadata
 * This script identifies client components that don't need client-side features
 * and converts them to server components with proper metadata
 */

const fs = require('fs');
const path = require('path');

// Pages to convert with their optimized metadata
const CONVERSION_TARGETS = [
  {
    file: 'src/app/privacy/page.tsx',
    title: 'Privacy Policy | Student Data Protection | Language Gems',
    description: 'Privacy policy and student data protection information for Language Gems educational platform. GDPR compliant and school-safe.',
    route: '/privacy'
  },
  {
    file: 'src/app/cookies/page.tsx',
    title: 'Cookie Policy | Language Gems Educational Platform',
    description: 'Cookie usage policy for Language Gems educational platform. Learn how we use cookies to improve your learning experience.',
    route: '/cookies'
  },
  {
    file: 'src/app/help-center/page.tsx',
    title: 'Help Center | Support & FAQs | Language Gems',
    description: 'Get help with Language Gems platform. Find answers to common questions about our GCSE language learning games and teaching tools.',
    route: '/help-center'
  },
  {
    file: 'src/app/tutorials/page.tsx',
    title: 'Getting Started Guide | Language Gems Tutorials for Teachers',
    description: 'Learn how to use Language Gems in your classroom. Step-by-step tutorials for teachers to maximize student engagement and learning outcomes.',
    route: '/tutorials'
  },
  {
    file: 'src/app/documentation/page.tsx',
    title: 'Teacher Documentation | Platform Guide | Language Gems',
    description: 'Comprehensive documentation for Language Gems educational platform. Teacher guides, best practices, and platform features for GCSE language learning.',
    route: '/documentation'
  },
  {
    file: 'src/app/community/page.tsx',
    title: 'Language Learning Community | Teacher Network | Language Gems',
    description: 'Join the Language Gems teacher community. Share resources, get teaching tips, and connect with other MFL educators using our platform.',
    route: '/community'
  },
  {
    file: 'src/app/contact-sales/page.tsx',
    title: 'Contact Sales | School Pricing & Demos | Language Gems for Schools',
    description: 'Contact our sales team for school pricing, demos, and bulk licensing. Get Language Gems for your entire language department.',
    route: '/contact-sales'
  },
  {
    file: 'src/app/assessments/page.tsx',
    title: 'GCSE Language Assessments | Reading Comprehension & Vocabulary Tests | Language Gems',
    description: 'Complete GCSE language assessments including reading comprehension, listening tests, and vocabulary practice. Official practice materials for AQA exams.',
    route: '/assessments'
  }
];

// Function to check if a page has client-side interactivity
function hasClientInteractivity(content) {
  const clientFeatures = [
    'useState',
    'useEffect',
    'useCallback',
    'useMemo',
    'useReducer',
    'useContext',
    'onClick',
    'onChange',
    'onSubmit',
    'onFocus',
    'onBlur',
    'addEventListener',
    'setTimeout',
    'setInterval',
    'window.',
    'document.',
    'localStorage',
    'sessionStorage'
  ];
  
  return clientFeatures.some(feature => content.includes(feature));
}

// Function to convert a client component to server component with metadata
function convertToServerComponent(target) {
  const { file, title, description, route } = target;
  
  if (!fs.existsSync(file)) {
    console.log(`⚠️  File not found: ${file}`);
    return false;
  }
  
  try {
    const content = fs.readFileSync(file, 'utf8');
    
    // Check if it already has metadata
    if (content.includes('export const metadata')) {
      console.log(`⚠️  Skipping ${route} - already has metadata`);
      return false;
    }
    
    // Check if it's already a server component
    if (!content.includes("'use client'") && !content.includes('"use client"')) {
      console.log(`⚠️  ${route} is already a server component`);
      return false;
    }
    
    // Check if it has client-side interactivity
    if (hasClientInteractivity(content)) {
      console.log(`⚠️  Skipping ${route} - has client-side interactivity`);
      return false;
    }
    
    // Calculate relative path depth
    const pathDepth = route.split('/').length - 1;
    const relativePath = '../'.repeat(pathDepth);
    
    // Remove 'use client' directive
    let updatedContent = content.replace(/['"]use client['"];\n?/g, '');
    
    // Add metadata imports and export
    const metadataImports = `import { Metadata } from 'next';\nimport { generateMetadata } from '${relativePath}components/seo/SEOWrapper';\n\n`;
    
    const metadataExport = `export const metadata: Metadata = generateMetadata({\n  title: '${title}',\n  description: '${description}',\n  canonical: '${route}'\n});\n\n`;
    
    // Find where to insert metadata (after other imports)
    const lines = updatedContent.split('\n');
    let insertIndex = 0;
    
    // Find the last import line
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].includes('import ') || lines[i].includes('from ')) {
        insertIndex = i + 1;
      } else if (lines[i].trim() === '') {
        continue;
      } else {
        break;
      }
    }
    
    // Insert metadata
    const beforeInsert = lines.slice(0, insertIndex).join('\n');
    const afterInsert = lines.slice(insertIndex).join('\n');
    
    const finalContent = beforeInsert + '\n' + metadataImports + metadataExport + afterInsert;
    
    // Write the updated content
    fs.writeFileSync(file, finalContent);
    console.log(`✅ Converted ${route} to server component with SEO metadata`);
    return true;
    
  } catch (error) {
    console.log(`❌ Failed to convert ${route}: ${error.message}`);
    return false;
  }
}

// Function to show analysis of conversion candidates
function analyzeConversionCandidates() {
  console.log('🔍 Analyzing Client Component Pages for SEO Conversion...\n');
  
  const candidates = [];
  const skipReasons = [];
  
  CONVERSION_TARGETS.forEach(target => {
    const { file, route } = target;
    
    if (!fs.existsSync(file)) {
      skipReasons.push(`${route} - File not found`);
      return;
    }
    
    const content = fs.readFileSync(file, 'utf8');
    const isClient = content.includes("'use client'") || content.includes('"use client"');
    const hasMetadata = content.includes('export const metadata');
    const hasInteractivity = hasClientInteractivity(content);
    
    if (hasMetadata) {
      skipReasons.push(`${route} - Already has metadata`);
    } else if (!isClient) {
      skipReasons.push(`${route} - Already server component`);
    } else if (hasInteractivity) {
      skipReasons.push(`${route} - Has client-side interactivity`);
    } else {
      candidates.push(target);
    }
  });
  
  console.log(`✅ Conversion Candidates (${candidates.length}):`);
  candidates.forEach(target => {
    console.log(`  ${target.route} - "${target.title}"`);
  });
  
  console.log(`\n⚠️  Cannot Convert (${skipReasons.length}):`);
  skipReasons.forEach(reason => {
    console.log(`  ${reason}`);
  });
  
  return candidates;
}

// Function to run the conversion
function runConversion() {
  console.log('🚀 Converting Client Components to Server Components with SEO...\n');
  
  const candidates = analyzeConversionCandidates();
  
  if (candidates.length === 0) {
    console.log('\n❌ No suitable candidates for conversion found.');
    return;
  }
  
  console.log(`\n🔄 Converting ${candidates.length} pages...\n`);
  
  let converted = 0;
  candidates.forEach(target => {
    if (convertToServerComponent(target)) {
      converted++;
    }
  });
  
  console.log(`\n📊 Conversion Summary:`);
  console.log(`  ✅ Successfully converted: ${converted} pages`);
  console.log(`  ⚠️  Skipped/Failed: ${candidates.length - converted} pages`);
  
  if (converted > 0) {
    console.log('\n🎉 Success! Your pages now have optimized SEO titles.');
    console.log('📈 Expected benefits:');
    console.log('  • Better search engine rankings');
    console.log('  • Improved click-through rates');
    console.log('  • More specific page targeting');
    console.log('\n🔄 Next: Deploy your changes to see the new titles live!');
  }
}

// CLI interface
const command = process.argv[2];

switch (command) {
  case 'analyze':
    analyzeConversionCandidates();
    break;
  case 'convert':
    runConversion();
    break;
  default:
    console.log('🎯 SEO Client-to-Server Component Converter\n');
    console.log('This tool converts suitable client components to server components');
    console.log('and adds optimized SEO metadata for better search rankings.\n');
    console.log('Usage:');
    console.log('  node seo-converter.js analyze  - Analyze conversion candidates');
    console.log('  node seo-converter.js convert  - Convert suitable pages');
    console.log('\nThis safely converts pages that don\'t need client-side features.');
}
