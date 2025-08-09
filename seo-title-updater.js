#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Directory to scan
const APP_DIR = 'src/app';

// Function to find all page.tsx files
function findPageFiles(dir, basePath = '') {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Skip special Next.js directories
      if (item.startsWith('(') || item.startsWith('_') || item === 'api') {
        continue;
      }
      files.push(...findPageFiles(fullPath, path.join(basePath, item)));
    } else if (item === 'page.tsx') {
      files.push({
        filePath: fullPath,
        route: basePath || '/',
        relativePath: path.relative(APP_DIR, fullPath)
      });
    }
  }
  
  return files;
}

// Function to extract metadata from a page file
function extractMetadata(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if it has metadata export
    const metadataMatch = content.match(/export const metadata[\s\S]*?(?=export|$)/);
    if (metadataMatch) {
      // Try to extract title
      const titleMatch = metadataMatch[0].match(/title:\s*['"`]([^'"`]+)['"`]/);
      if (titleMatch) {
        return { hasMetadata: true, title: titleMatch[1] };
      }
      
      // Check for generateMetadata function call
      const generateMatch = metadataMatch[0].match(/generateMetadata\(\{[\s\S]*?title:\s*['"`]([^'"`]+)['"`]/);
      if (generateMatch) {
        return { hasMetadata: true, title: generateMatch[1] };
      }
      
      return { hasMetadata: true, title: 'Found metadata but could not extract title' };
    }
    
    return { hasMetadata: false, title: null };
  } catch (error) {
    return { hasMetadata: false, title: null, error: error.message };
  }
}

// Main function
function analyzePages() {
  const pages = findPageFiles(APP_DIR);
  
  console.log('📊 Page Title Analysis Report\n');
  console.log(`Found ${pages.length} pages\n`);
  
  const withMetadata = [];
  const withoutMetadata = [];
  
  for (const page of pages) {
    const metadata = extractMetadata(page.filePath);
    
    if (metadata.hasMetadata) {
      withMetadata.push({ ...page, ...metadata });
    } else {
      withoutMetadata.push({ ...page, ...metadata });
    }
  }
  
  console.log('✅ Pages WITH metadata:');
  withMetadata.forEach(page => {
    console.log(`   ${page.route} - "${page.title}"`);
  });
  
  console.log('\n❌ Pages WITHOUT metadata:');
  withoutMetadata.forEach(page => {
    console.log(`   ${page.route}`);
  });
  
  console.log(`\n📈 Summary:`);
  console.log(`   ${withMetadata.length} pages with metadata`);
  console.log(`   ${withoutMetadata.length} pages without metadata`);
  console.log(`   ${Math.round((withMetadata.length / pages.length) * 100)}% coverage`);
  
  return { withMetadata, withoutMetadata, allPages: pages };
}

// Optimal titles mapping - covering all key pages from your site
const OPTIMAL_TITLES = {
  // Main pages from your original list
  '/': 'GCSE Language Learning Games | Interactive Vocabulary Platform | Language Gems',
  '/games': 'GCSE Language Learning Games | 15+ Interactive Vocabulary Games | Language Gems',
  '/terms': 'Terms of Service | Language Gems Educational Platform',
  '/assessments': 'GCSE Language Assessments | Reading Comprehension & Vocabulary Tests | Language Gems',
  '/contact-sales': 'Contact Sales | School Pricing & Demos | Language Gems for Schools',
  '/auth/signup': 'Sign Up | Join Language Gems | Free Teacher Account',
  '/tutorials': 'Getting Started Guide | Language Gems Tutorials for Teachers',
  '/schools': 'Language Gems for Schools | GCSE Language Learning Platform for UK Schools',
  '/legal/disclaimer': 'Legal Disclaimer | Language Gems Educational Platform',
  '/help-center': 'Help Center | Support & FAQs | Language Gems',
  '/resources': 'MFL Teaching Resources | GCSE Language Learning Materials | Language Gems',
  '/legal/gdpr': 'GDPR Privacy Policy | Data Protection | Language Gems',
  '/cookies': 'Cookie Policy | Language Gems Educational Platform',
  '/legal/accessibility': 'Accessibility Statement | Language Gems Inclusive Learning Platform',
  '/documentation': 'Teacher Documentation | Platform Guide | Language Gems',
  '/community': 'Language Learning Community | Teacher Network | Language Gems',
  '/privacy': 'Privacy Policy | Student Data Protection | Language Gems',
  '/legal/ai-policy': 'AI Usage Policy | Educational Technology Ethics | Language Gems',
  '/dashboard': 'Teacher Dashboard | Student Progress & Analytics | Language Gems',
  '/exam-style-assessment-topic': 'Topic-Based GCSE Assessments | Language Gems',
  '/exam-style-assessment': 'GCSE Style Assessments | Practice Tests | Language Gems',
  '/dictation': 'Language Dictation Tool | Listening Skills Practice | Language Gems',
  '/reading-comprehension': 'GCSE Reading Comprehension | Language Skills Assessment | Language Gems',
  
  // Games pages
  '/games/vocabulary-mining': 'Vocabulary Mining Game | Interactive Word Learning | Language Gems',
  '/games/hangman': 'Language Learning Hangman | GCSE Vocabulary Game | Language Gems',
  '/games/memory-game': 'Memory Match Game | Visual Vocabulary Learning | Language Gems',
  '/games/conjugation-duel': 'Conjugation Duel | Interactive Verb Practice Game | Language Gems',
  '/games/word-scramble': 'Word Scramble Game | GCSE Vocabulary Practice | Language Gems',
  '/games/verb-quest': 'Verb Quest Adventure | Interactive Grammar Game | Language Gems',
  '/games/vocab-blast': 'Vocab Blast | Fast-Paced Vocabulary Game | Language Gems',
  '/games/sentence-towers': 'Sentence Building Game | Grammar Practice | Language Gems',
  '/games/noughts-and-crosses': 'Educational Noughts & Crosses | Language Learning Game | Language Gems',
  '/games/case-file-translator': 'Case File Translator | Detective Language Game | Language Gems',
  '/games/vocab-master': 'Vocab Master | Advanced Vocabulary Challenge | Language Gems',
  '/games/speed-builder': 'Speed Builder | Quick Vocabulary Practice | Language Gems',
  '/games/detective-listening': 'Detective Listening Game | Audio Comprehension | Language Gems',
  '/games/lava-temple-word-restore': 'Lava Temple Adventure | Word Restoration Game | Language Gems',
  '/games/word-blast': 'Word Blast Game | Explosive Vocabulary Learning | Language Gems',
  
  // Assessment pages
  '/assessments/aqa-reading': 'AQA Reading Assessments | GCSE Practice Tests | Language Gems',
  '/assessments/aqa-listening': 'AQA Listening Assessments | GCSE Audio Practice | Language Gems',
  '/assessments/dictation': 'Language Dictation Tests | Listening & Writing Practice | Language Gems',
  '/assessments/reading-comprehension': 'Reading Comprehension Tests | GCSE Language Skills | Language Gems',
  '/assessments/four-skills': 'Four Skills Assessment | Complete GCSE Language Test | Language Gems',
  
  // AQA specific pages
  '/aqa-reading-test': 'AQA Reading Tests | Official GCSE Practice Papers | Language Gems',
  '/aqa-listening-test': 'AQA Listening Tests | Official GCSE Audio Papers | Language Gems',
  '/aqa-writing-test': 'AQA Writing Tests | GCSE Writing Practice | Language Gems',
  '/exam-style-assessment-topic': 'Topic-Based GCSE Assessments | AQA Practice Tests | Language Gems',
  
  // Dashboard pages (with noindex)
  '/dashboard/assignments': 'Assignment Management | Teacher Dashboard | Language Gems',
  '/dashboard/students': 'Student Management | Teacher Dashboard | Language Gems',
  '/dashboard/analytics/cross-game': 'Cross-Game Analytics | Teacher Insights | Language Gems',
  '/dashboard/vocabulary': 'Vocabulary Management | Teacher Dashboard | Language Gems',
  '/dashboard/classes': 'Class Management | Teacher Dashboard | Language Gems',
  '/dashboard/reports': 'Progress Reports | Teacher Dashboard | Language Gems',
  '/dashboard/leaderboards': 'Class Leaderboards | Teacher Dashboard | Language Gems',
  '/dashboard/settings': 'Account Settings | Teacher Dashboard | Language Gems',
  
  // Student dashboard (with noindex)
  '/student-dashboard': 'Student Dashboard | My Learning Progress | Language Gems',
  '/student-dashboard/games': 'My Games | Student Dashboard | Language Gems',
  '/student-dashboard/progress': 'My Progress | Student Dashboard | Language Gems',
  '/student-dashboard/assignments': 'My Assignments | Student Dashboard | Language Gems',
  '/student-dashboard/vocabulary': 'My Vocabulary | Student Dashboard | Language Gems',
  
  // Auth pages (with noindex)
  '/auth/login': 'Teacher Login | Language Gems Educational Platform',
  '/student/auth/login': 'Student Login | Language Gems Learning Platform',
  '/auth/verify-email': 'Verify Email | Language Gems Account Setup',
  '/auth/confirmed': 'Account Confirmed | Welcome to Language Gems',
  
  // Resource pages
  '/resources/teachers': 'MFL Teachers Resource Hub | Language Learning Games & Tools | Language Gems',
  '/resources/lesson-plans': 'GCSE Language Lesson Plans | Ready-to-Use MFL Resources | Language Gems',
  '/resources/professional-development': 'MFL Teacher Training | Professional Development | Language Gems',
  
  // Language-specific resources
  '/resources/skills/spanish': 'Spanish Teaching Resources | GCSE Materials | Language Gems',
  '/resources/skills/french': 'French Teaching Resources | GCSE Materials | Language Gems',
  '/resources/skills/german': 'German Teaching Resources | GCSE Materials | Language Gems',
  '/resources/skills/vocabulary': 'Vocabulary Teaching Resources | Word Lists & Games | Language Gems',
  '/resources/skills/speaking': 'Speaking Practice Resources | GCSE Oral Skills | Language Gems',
  
  // Exam resources
  '/exams': 'GCSE Exam Practice | Past Papers & Mock Tests | Language Gems',
  '/exams/aqa': 'AQA GCSE Language Exams | Official Practice Materials | Language Gems',
  '/exams/specification': 'GCSE Specifications | Curriculum Requirements | Language Gems',
  
  // Four skills assessment
  '/four-skills-assessment': 'Four Skills Assessment | Complete GCSE Language Test | Language Gems',
  
  // Admin pages (with noindex)
  '/admin': 'Admin Dashboard | Language Gems Management',
  '/admin/vocabulary': 'Vocabulary Management | Admin Dashboard | Language Gems',
  '/admin/blog': 'Blog Management | Admin Dashboard | Language Gems',
  
  // Cart and account (with noindex for some)
  '/cart': 'Shopping Cart | Language Gems Educational Resources',
  '/checkout/success': 'Order Complete | Thank You | Language Gems',
  '/account': 'My Account | Language Gems',
  '/account/orders': 'Order History | My Account | Language Gems',
  '/account/settings': 'Account Settings | My Account | Language Gems',
  
  // Product pages
  '/product': 'Educational Products | Language Learning Resources | Language Gems',
  
  // Special tools
  '/vocabmaster': 'VocabMaster | Advanced Vocabulary Learning Tool | Language Gems',
  '/vocabmaster/about': 'About VocabMaster | Intelligent Vocabulary Learning | Language Gems',
  '/sitemap': 'Site Map | Language Gems Platform Navigation'
};

// Pages that should not be indexed by search engines
const NO_INDEX_PAGES = [
  '/dashboard',
  '/auth/login',
  '/auth/signup', 
  '/auth/verify-email',
  '/auth/confirmed',
  '/student/auth/login',
  '/student-dashboard',
  '/admin',
  '/account',
  '/cart',
  '/checkout/success'
];

// Function to check if a page should be noindexed
function shouldNoIndex(route) {
  return NO_INDEX_PAGES.some(page => route.startsWith(page));
}
// Function to update a page with metadata
function updatePageMetadata(page, title) {
  try {
    const content = fs.readFileSync(page.filePath, 'utf8');
    
    // Check if it already has metadata
    if (content.includes('export const metadata')) {
      console.log(`⚠️  Skipping ${page.route} - already has metadata`);
      return false;
    }
    
    // Check if page should be noindexed
    const noIndex = shouldNoIndex(page.route);
    
    // Generate the metadata import and export
    const metadataImport = `import { Metadata } from 'next';\nimport { generateMetadata } from '${'../'.repeat(page.route.split('/').length - 1)}components/seo/SEOWrapper';\n`;
    
    const description = noIndex 
      ? 'Private area of Language Gems educational platform.'
      : 'Interactive GCSE language learning with gamified vocabulary practice, teacher analytics, and curriculum-aligned content for Spanish, French, and German.';
    
    const metadataExport = `\nexport const metadata: Metadata = generateMetadata({\n  title: '${title}',\n  description: '${description}',\n  canonical: '${page.route}',${noIndex ? '\n  noIndex: true' : ''}\n});\n`;
    
    // Find the best place to insert metadata
    let updatedContent;
    
    // If it's a client component, we need to be careful
    if (content.includes('"use client"')) {
      // For client components, we'll add a comment suggesting server component conversion
      console.log(`⚠️  ${page.route} is a client component - needs manual conversion to server component for metadata`);
      return false;
    }
    
    // Find imports section
    const importMatch = content.match(/(^[\s\S]*?)(export default|function|const)/m);
    if (importMatch) {
      const beforeExports = importMatch[1];
      const rest = content.substring(importMatch.index + importMatch[1].length);
      
      updatedContent = beforeExports + metadataImport + metadataExport + rest;
    } else {
      // Fallback: add at the beginning
      updatedContent = metadataImport + metadataExport + content;
    }
    
    // Write the updated content
    fs.writeFileSync(page.filePath, updatedContent);
    console.log(`✅ Updated ${page.route}${noIndex ? ' (noIndex)' : ''}`);
    return true;
  } catch (error) {
    console.log(`❌ Failed to update ${page.route}: ${error.message}`);
    return false;
  }
}

// Function to update all pages
function updateAllPages() {
  const { withoutMetadata } = analyzePages();
  
  console.log('\n🔄 Updating pages without metadata...\n');
  
  let updated = 0;
  let skipped = 0;
  
  for (const page of withoutMetadata) {
    const title = OPTIMAL_TITLES[page.route];
    if (title) {
      if (updatePageMetadata(page, title)) {
        updated++;
      } else {
        skipped++;
      }
    } else {
      console.log(`⚠️  No title defined for ${page.route}`);
      skipped++;
    }
  }
  
  console.log(`\n📊 Update Summary:`);
  console.log(`   ${updated} pages updated`);
  console.log(`   ${skipped} pages skipped`);
}

// CLI interface
const command = process.argv[2];

if (command === 'analyze') {
  analyzePages();
} else if (command === 'update') {
  updateAllPages();
} else {
  console.log('Usage:');
  console.log('  node seo-title-updater.js analyze  - Analyze current state');
  console.log('  node seo-title-updater.js update   - Update pages with missing metadata');
}
