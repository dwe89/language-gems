#!/usr/bin/env node

/**
 * Generate Static Sitemap for Google Search Console
 * 
 * This script generates a static sitemap.xml file from the dynamic Next.js sitemap
 * for submission to Google Search Console and other search engines.
 * 
 * Usage:
 * 1. Make sure your Next.js dev server is running: npm run dev
 * 2. Run this script: node scripts/generate-sitemap.js
 * 3. The static sitemap will be saved to public/sitemap.xml
 */

const fs = require('fs');
const path = require('path');

async function generateStaticSitemap() {
  try {
    console.log('🚀 Generating static sitemap from Next.js dynamic sitemap...');
    
    // Import the sitemap function
    const sitemapModule = await import('../src/app/sitemap.ts');
    const sitemap = sitemapModule.default;
    
    // Generate the sitemap data
    const routes = sitemap();
    
    // Generate XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    
    routes.forEach(route => {
      xml += '  <url>\n';
      xml += `    <loc>${route.url}</loc>\n`;
      xml += `    <lastmod>${route.lastModified}</lastmod>\n`;
      xml += `    <changefreq>${route.changeFrequency}</changefreq>\n`;
      xml += `    <priority>${route.priority}</priority>\n`;
      xml += '  </url>\n';
    });
    
    xml += '</urlset>\n';
    
    // Write to public/sitemap.xml
    const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
    fs.writeFileSync(outputPath, xml, 'utf8');
    
    console.log(`✅ Static sitemap generated successfully!`);
    console.log(`📍 Location: ${outputPath}`);
    console.log(`📊 Total URLs: ${routes.length}`);
    console.log(`🔗 You can now submit this file to Google Search Console`);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateStaticSitemap();
