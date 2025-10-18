/**
 * BACKUP SCRIPT: Export all grammar page content to JSON
 * This creates a portable backup of all grammar content before database migration
 */

import fs from 'fs';
import path from 'path';

interface GrammarPageBackup {
  filePath: string;
  language: string;
  category: string;
  topic: string;
  content: any;
  extractedAt: string;
}

const GRAMMAR_BASE_PATH = path.join(process.cwd(), 'src/app/grammar');
const BACKUP_OUTPUT_PATH = path.join(process.cwd(), 'backups/grammar-content-backup.json');

async function extractGrammarContent() {
  const backups: GrammarPageBackup[] = [];
  const languages = ['spanish', 'french', 'german'];

  for (const language of languages) {
    const languagePath = path.join(GRAMMAR_BASE_PATH, language);
    
    if (!fs.existsSync(languagePath)) {
      console.log(`⚠️  Language directory not found: ${language}`);
      continue;
    }

    // Get all category directories
    const categories = fs.readdirSync(languagePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    for (const category of categories) {
      const categoryPath = path.join(languagePath, category);
      
      // Get all topic directories
      const topics = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const topic of topics) {
        const pagePath = path.join(categoryPath, topic, 'page.tsx');
        
        if (!fs.existsSync(pagePath)) {
          console.log(`⚠️  No page.tsx found: ${language}/${category}/${topic}`);
          continue;
        }

        try {
          const fileContent = fs.readFileSync(pagePath, 'utf-8');
          
          // Extract the sections array and metadata
          const sectionsMatch = fileContent.match(/const sections\s*=\s*(\[[\s\S]*?\]);/);
          const metadataMatch = fileContent.match(/export const metadata[:\s]*Metadata\s*=\s*({[\s\S]*?});/);
          
          backups.push({
            filePath: `src/app/grammar/${language}/${category}/${topic}/page.tsx`,
            language,
            category,
            topic,
            content: {
              rawFile: fileContent,
              sectionsCode: sectionsMatch ? sectionsMatch[1] : null,
              metadataCode: metadataMatch ? metadataMatch[1] : null
            },
            extractedAt: new Date().toISOString()
          });

          console.log(`✅ Backed up: ${language}/${category}/${topic}`);
        } catch (error) {
          console.error(`❌ Error backing up ${language}/${category}/${topic}:`, error);
        }
      }
    }
  }

  return backups;
}

async function main() {
  console.log('🔄 Starting grammar content backup...\n');

  const backups = await extractGrammarContent();

  // Ensure backup directory exists
  const backupDir = path.dirname(BACKUP_OUTPUT_PATH);
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  // Write backup to JSON file
  fs.writeFileSync(
    BACKUP_OUTPUT_PATH,
    JSON.stringify(backups, null, 2),
    'utf-8'
  );

  console.log(`\n✅ Backup complete!`);
  console.log(`📦 Total pages backed up: ${backups.length}`);
  console.log(`💾 Backup saved to: ${BACKUP_OUTPUT_PATH}`);
  console.log(`📊 File size: ${(fs.statSync(BACKUP_OUTPUT_PATH).size / 1024 / 1024).toFixed(2)} MB`);
}

main().catch(console.error);

