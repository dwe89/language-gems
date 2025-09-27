#!/usr/bin/env node

/**
 * Generate Comprehensive Sitemap for LanguageGems
 *
 * This script scans the file system to find all pages and generates
 * a comprehensive sitemap.xml with proper priorities and change frequencies.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const DOMAIN = 'https://languagegems.com';
const TODAY = '2025-09-27';

/**
 * Find all page.tsx files recursively
 */
function findPageFiles(dir, basePath = '') {
  const pages = [];

  if (!fs.existsSync(dir)) {
    return pages;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);

    // Skip if not accessible
    try {
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip certain directories
        if (item.startsWith('[') || item === 'api' || item.startsWith('_') || item.startsWith('.')) {
          continue;
        }

        // Recursively search subdirectories
        const subPages = findPageFiles(fullPath, path.join(basePath, item));
        pages.push(...subPages);
      } else if (item === 'page.tsx') {
        // Found a page file
        pages.push(basePath);
      }
    } catch (error) {
      // Skip inaccessible files/directories
      continue;
    }
  }

  return pages;
}

/**
 * Get priority for a URL
 */
function getPriority(url) {
  // Main pages
  if (url === '') return 1.0;
  if (url === 'about' || url === 'schools' || url === 'games' || url === 'vocabmaster') return 0.9;
  if (url === 'blog' || url === 'grammar') return 0.9;

  // Language hubs
  if (url.match(/^grammar\/(spanish|french|german)$/)) return 0.9;

  // High-value content
  if (url.includes('ser-vs-estar') || url.includes('por-vs-para') || url.includes('cases')) return 0.9;
  if (url.startsWith('blog/') && url !== 'blog') return 0.8;
  if (url.startsWith('grammar/')) return 0.8;
  if (url.startsWith('games/')) return 0.8;

  // GCSE and exam content
  if (url.includes('gcse') || url.includes('aqa') || url.includes('edexcel')) return 0.9;

  // Assessments and tests
  if (url.includes('assessment') || url.includes('test')) return 0.7;

  // Legal pages
  if (url.includes('privacy') || url.includes('terms') || url.includes('cookies')) return 0.4;

  // Default
  return 0.6;
}

/**
 * Get change frequency for a URL
 */
function getChangeFreq(url) {
  // Dynamic content
  if (url === '' || url === 'blog' || url.startsWith('games/')) return 'weekly';
  if (url.match(/^grammar\/(spanish|french|german)$/)) return 'weekly';

  // Legal pages
  if (url.includes('privacy') || url.includes('terms') || url.includes('cookies')) return 'yearly';

  // Most content pages
  return 'monthly';
}

/**
 * Generate comprehensive sitemap
 */
function generateSitemap() {
  console.log('🚀 Generating comprehensive sitemap...');

  // Find all pages in the app directory
  const appDir = path.join(process.cwd(), 'src/app');
  const discoveredPages = findPageFiles(appDir);

  // Add important manual pages that might not have page.tsx files
  const manualPages = [
    '',
    'about',
    'blog',
    'schools',
    'games',
    'vocabmaster',
    'grammar',
    'vocabulary',
    'learn',
    'songs',
    'worksheets',
    'exams',
    'explore',
    'pricing',
    'contact',
    'contact-sales',
    'help-center',
    'community',
    'assessments',
    'resources',
    'sitemap',
    'privacy',
    'terms',
    'cookies'
  ];

  // Combine and deduplicate
  const allPages = [...new Set([...manualPages, ...discoveredPages])];

  // Sort by priority (highest first) then alphabetically
  allPages.sort((a, b) => {
    const priorityA = getPriority(a);
    const priorityB = getPriority(b);

    if (priorityA !== priorityB) {
      return priorityB - priorityA;
    }

    return a.localeCompare(b);
  });

  // Generate XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  for (const page of allPages) {
    const url = page ? `${DOMAIN}/${page}` : DOMAIN;
    const priority = getPriority(page);
    const changefreq = getChangeFreq(page);

    xml += `
  <url>
    <loc>${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>
  </url>`;
  }

  xml += `
</urlset>
`;

  // Write sitemap
  const sitemapPath = path.join(process.cwd(), 'public/sitemap.xml');
  fs.writeFileSync(sitemapPath, xml, 'utf8');

  console.log(`✅ Generated sitemap with ${allPages.length} pages`);
  console.log(`📍 Saved to: ${sitemapPath}`);

  // Log statistics
  const grammarPages = allPages.filter(p => p.startsWith('grammar/')).length;
  const blogPages = allPages.filter(p => p.startsWith('blog/') && p !== 'blog').length;
  const gamePages = allPages.filter(p => p.startsWith('games/')).length;

  console.log(`📊 Statistics:`);
  console.log(`   - Grammar pages: ${grammarPages}`);
  console.log(`   - Blog pages: ${blogPages}`);
  console.log(`   - Game pages: ${gamePages}`);
  console.log(`   - Total pages: ${allPages.length}`);

  return allPages.length;
}

// Run the generator
try {
  generateSitemap();
} catch (error) {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
}
