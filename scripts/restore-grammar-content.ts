/**
 * RESTORE SCRIPT: Restore all grammar pages from JSON backup
 * Use this if you need to revert the database migration
 */

import fs from 'fs';
import path from 'path';

interface GrammarPageBackup {
  filePath: string;
  language: string;
  category: string;
  topic: string;
  content: {
    rawFile: string;
    sectionsCode: string | null;
    metadataCode: string | null;
  };
  extractedAt: string;
}

const BACKUP_INPUT_PATH = path.join(process.cwd(), 'backups/grammar-content-backup.json');

async function restoreGrammarContent() {
  console.log('🔄 Starting grammar content restoration...\n');

  // Read backup file
  if (!fs.existsSync(BACKUP_INPUT_PATH)) {
    console.error('❌ Backup file not found:', BACKUP_INPUT_PATH);
    process.exit(1);
  }

  const backupData: GrammarPageBackup[] = JSON.parse(
    fs.readFileSync(BACKUP_INPUT_PATH, 'utf-8')
  );

  console.log(`📦 Found ${backupData.length} pages in backup\n`);

  let restored = 0;
  let skipped = 0;
  let errors = 0;

  for (const backup of backupData) {
    try {
      const filePath = path.join(process.cwd(), backup.filePath);
      const dirPath = path.dirname(filePath);

      // Create directory if it doesn't exist
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      // Check if file already exists
      if (fs.existsSync(filePath)) {
        console.log(`⚠️  Skipped (already exists): ${backup.filePath}`);
        skipped++;
        continue;
      }

      // Write the original file content
      fs.writeFileSync(filePath, backup.content.rawFile, 'utf-8');
      
      console.log(`✅ Restored: ${backup.filePath}`);
      restored++;
    } catch (error) {
      console.error(`❌ Error restoring ${backup.filePath}:`, error);
      errors++;
    }
  }

  console.log(`\n✅ Restoration complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Restored: ${restored} pages`);
  console.log(`   - Skipped: ${skipped} pages (already exist)`);
  console.log(`   - Errors: ${errors} pages`);
}

restoreGrammarContent().catch(console.error);

