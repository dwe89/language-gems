#!/usr/bin/env tsx

/**
 * Audio Generation Script for Detective Listening Game
 *
 * This script generates all vocabulary audio files using Amazon Polly
 *
 * Usage:
 *   npm run generate-audio
 *   npm run generate-audio -- --language spanish
 *   npm run generate-audio -- --case animals
 *   npm run generate-audio -- --test
 */

import dotenv from 'dotenv';
import { AmazonPollyService } from '../src/services/amazonPolly';
import { gameData } from '../src/app/games/detective-listening/data/gameData';
import path from 'path';
import fs from 'fs';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

interface GenerationOptions {
  language?: string;
  caseType?: string;
  test?: boolean;
  force?: boolean; // Regenerate existing files
  dryRun?: boolean; // Show what would be generated without actually generating
}

class AudioGenerator {
  private ttsService: AmazonPollyService;
  private generationLog: Array<{
    filename: string;
    text: string;
    language: string;
    status: 'success' | 'error' | 'skipped';
    error?: string;
  }> = [];

  constructor() {
    this.ttsService = new AmazonPollyService();
  }

  /**
   * Generate audio files based on options
   */
  async generate(options: GenerationOptions = {}): Promise<void> {
    console.log('🎵 Detective Listening Game - Audio Generation (Amazon Polly)');
    console.log('=' .repeat(60));

    // Test mode
    if (options.test) {
      return this.runTest();
    }

    // Dry run mode
    if (options.dryRun) {
      return await this.runDryRun(options);
    }

    // Get list of files to generate
    const filesToGenerate = await this.getFilesToGenerate(options);
    
    if (filesToGenerate.length === 0) {
      console.log('📭 No files to generate based on current options.');
      return;
    }

    console.log(`📊 Found ${filesToGenerate.length} files to generate`);
    
    // Calculate estimated cost
    const totalCharacters = filesToGenerate.reduce((sum, file) => sum + file.text.length, 0);
    const estimatedCost = this.ttsService.calculateEstimatedCost(totalCharacters);
    
    console.log(`💰 Estimated cost: $${estimatedCost.toFixed(4)} (${totalCharacters} characters)`);
    console.log('');

    // Generate audio files
    const startTime = Date.now();
    
    await this.ttsService.generateBulkAudio(
      filesToGenerate,
      (current, total, filename) => {
        const percentage = Math.round((current / total) * 100);
        console.log(`📈 Progress: ${current}/${total} (${percentage}%) - ${filename}`);
      }
    );

    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000;

    // Generate report
    this.generateReport(duration);
  }

  /**
   * Get list of files to generate based on options
   */
  private async getFilesToGenerate(options: GenerationOptions): Promise<Array<{
    text: string;
    language: string;
    filename: string;
  }>> {
    const files: Array<{ text: string; language: string; filename: string }> = [];

    // Get existing files from Supabase Storage
    const existingFiles = await this.ttsService.listAudioFiles('detective-listening');
    const existingFilenames = new Set(existingFiles.map(file => file.name));

    for (const [caseType, languages] of Object.entries(gameData)) {
      // Skip if specific case type requested and this isn't it
      if (options.caseType && caseType !== options.caseType) {
        continue;
      }

      for (const [language, words] of Object.entries(languages)) {
        // Skip if specific language requested and this isn't it
        if (options.language && language !== options.language) {
          continue;
        }

        for (const wordData of words) {
          const filename = wordData.audio;
          
          // Skip if file exists and not forcing regeneration
          if (!options.force && existingFilenames.has(filename)) {
            continue;
          }

          files.push({
            text: wordData.word || wordData.correct,
            language: language,
            filename: filename
          });
        }
      }
    }

    return files;
  }

  /**
   * Run a test to verify Amazon Polly is working
   */
  private async runTest(): Promise<void> {
    console.log('🧪 Running Amazon Polly test...');

    try {
      const success = await this.ttsService.testService();

      if (success) {
        console.log('✅ Test completed successfully!');
        console.log('🚀 You can now run the full audio generation.');
      } else {
        console.log('❌ Test failed. Please check your AWS credentials.');
        process.exit(1);
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      process.exit(1);
    }
  }

  /**
   * Show what would be generated without actually generating
   */
  private async runDryRun(options: GenerationOptions): Promise<void> {
    console.log('🔍 Dry run mode - showing what would be generated...');
    
    const filesToGenerate = await this.getFilesToGenerate(options);
    
    console.log(`\n📊 Summary:`);
    console.log(`Total files: ${filesToGenerate.length}`);
    
    // Group by language
    const byLanguage = filesToGenerate.reduce((acc, file) => {
      acc[file.language] = (acc[file.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('\n📈 By language:');
    Object.entries(byLanguage).forEach(([lang, count]) => {
      console.log(`  ${lang}: ${count} files`);
    });
    
    // Show first few files as examples
    console.log('\n📝 Example files:');
    filesToGenerate.slice(0, 10).forEach(file => {
      console.log(`  ${file.filename} - "${file.text}" (${file.language})`);
    });
    
    if (filesToGenerate.length > 10) {
      console.log(`  ... and ${filesToGenerate.length - 10} more`);
    }
    
    const totalCharacters = filesToGenerate.reduce((sum: number, file: any) => sum + file.text.length, 0);
    const estimatedCost = this.ttsService.calculateEstimatedCost(totalCharacters);
    console.log(`\n💰 Estimated cost: $${estimatedCost.toFixed(4)}`);
  }

  /**
   * Generate a report of the generation process
   */
  private generateReport(duration: number): void {
    console.log('\n' + '='.repeat(50));
    console.log('📊 GENERATION REPORT');
    console.log('='.repeat(50));
    
    const successful = this.generationLog.filter(log => log.status === 'success').length;
    const errors = this.generationLog.filter(log => log.status === 'error').length;
    const skipped = this.generationLog.filter(log => log.status === 'skipped').length;
    
    console.log(`✅ Successful: ${successful}`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`⏭️  Skipped: ${skipped}`);
    console.log(`⏱️  Duration: ${duration.toFixed(2)} seconds`);
    
    if (errors > 0) {
      console.log('\n❌ Errors:');
      this.generationLog
        .filter(log => log.status === 'error')
        .forEach(log => {
          console.log(`  ${log.filename}: ${log.error}`);
        });
    }
    
    // Save detailed log
    const logPath = path.join('logs', `audio-generation-${Date.now()}.json`);
    if (!fs.existsSync('logs')) {
      fs.mkdirSync('logs');
    }
    
    fs.writeFileSync(logPath, JSON.stringify({
      timestamp: new Date().toISOString(),
      duration,
      summary: { successful, errors, skipped },
      details: this.generationLog
    }, null, 2));
    
    console.log(`\n📄 Detailed log saved to: ${logPath}`);
  }

  /**
   * List available voices for debugging
   */
  async listVoices(languageCode?: string): Promise<void> {
    console.log('🎤 Available voices:');
    
    try {
      const voices = await this.ttsService.listVoices(languageCode);
      
      voices.forEach(voice => {
        console.log(`  ${voice.name} (${voice.languageCodes?.join(', ')}) - ${voice.ssmlGender}`);
      });
    } catch (error) {
      console.error('Error listing voices:', error);
    }
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const options: GenerationOptions = {};
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--language':
        options.language = args[++i];
        break;
      case '--case':
        options.caseType = args[++i];
        break;
      case '--test':
        options.test = true;
        break;
      case '--force':
        options.force = true;
        break;
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--list-voices':
        const generator = new AudioGenerator();
        await generator.listVoices(args[++i]);
        return;
      case '--help':
        console.log(`
Audio Generation Script for Detective Listening Game

Usage:
  npm run generate-audio [options]

Options:
  --test              Run a test to verify Google Cloud TTS setup
  --dry-run           Show what would be generated without generating
  --language <lang>   Generate only for specific language (spanish, french, german)
  --case <case>       Generate only for specific case type (animals, food, etc.)
  --force             Regenerate existing files
  --list-voices [lang] List available voices for language
  --help              Show this help message

Examples:
  npm run generate-audio --test
  npm run generate-audio --dry-run
  npm run generate-audio --language spanish
  npm run generate-audio --case animals --force
        `);
        return;
    }
  }
  
  const generator = new AudioGenerator();
  await generator.generate(options);
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { AudioGenerator };
