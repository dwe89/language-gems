import { createClient } from '@supabase/supabase-js';
import { gameData } from '../app/games/detective-listening/data/gameData';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

export interface AudioFileInfo {
  filename: string;
  language: string;
  caseType: string;
  text: string;
  exists: boolean;
  url?: string;
  size?: number;
  lastModified?: string;
}

export class SupabaseAudioManager {
  private supabaseClient;
  private bucketName: string = 'audio';

  constructor() {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error(
        'Supabase configuration not found. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
      );
    }

    this.supabaseClient = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * List all audio files from Supabase Storage
   */
  async listFiles(folder: string = 'detective-listening'): Promise<any[]> {
    try {
      const { data, error } = await this.supabaseClient.storage
        .from(this.bucketName)
        .list(folder);

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error listing files:', error);
      return [];
    }
  }

  /**
   * Get comprehensive status report
   */
  async getStatusReport(): Promise<string> {
    console.log('📊 Scanning audio files from Supabase Storage...');
    
    const existingFiles = await this.listFiles('detective-listening');
    const existingFilenames = new Set(existingFiles.map(file => file.name));
    
    const allFiles = this.getAllExpectedFiles();
    const stats = {
      total: allFiles.length,
      existing: 0,
      missing: 0,
      byLanguage: {} as Record<string, { total: number; existing: number; missing: number }>,
      byCase: {} as Record<string, { total: number; existing: number; missing: number }>
    };

    // Analyze each file
    for (const file of allFiles) {
      const exists = existingFilenames.has(file.filename);
      
      if (exists) {
        stats.existing++;
      } else {
        stats.missing++;
      }

      // Language stats
      if (!stats.byLanguage[file.language]) {
        stats.byLanguage[file.language] = { total: 0, existing: 0, missing: 0 };
      }
      stats.byLanguage[file.language].total++;
      stats.byLanguage[file.language][exists ? 'existing' : 'missing']++;

      // Case stats
      if (!stats.byCase[file.caseType]) {
        stats.byCase[file.caseType] = { total: 0, existing: 0, missing: 0 };
      }
      stats.byCase[file.caseType].total++;
      stats.byCase[file.caseType][exists ? 'existing' : 'missing']++;
    }

    // Generate report
    let report = '📊 Audio Files Status Report\n';
    report += '=' .repeat(50) + '\n\n';
    
    report += `📈 Overall Progress: ${stats.existing}/${stats.total} (${Math.round((stats.existing / stats.total) * 100)}%)\n`;
    report += `✅ Existing: ${stats.existing} files\n`;
    report += `❌ Missing: ${stats.missing} files\n\n`;

    report += '🌍 By Language:\n';
    Object.entries(stats.byLanguage).forEach(([lang, langStats]) => {
      const percentage = Math.round((langStats.existing / langStats.total) * 100);
      report += `  ${lang}: ${langStats.existing}/${langStats.total} (${percentage}%)\n`;
    });

    report += '\n📁 By Case Type:\n';
    Object.entries(stats.byCase).forEach(([caseType, caseStats]) => {
      const percentage = Math.round((caseStats.existing / caseStats.total) * 100);
      report += `  ${caseType}: ${caseStats.existing}/${caseStats.total} (${percentage}%)\n`;
    });

    // Storage info
    const totalSize = existingFiles.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
    const averageSize = existingFiles.length > 0 ? totalSize / existingFiles.length : 0;
    
    report += '\n💾 Storage Information:\n';
    report += `  Files in storage: ${existingFiles.length}\n`;
    report += `  Total size: ${this.formatBytes(totalSize)}\n`;
    report += `  Average size: ${this.formatBytes(averageSize)}\n`;

    return report;
  }

  /**
   * Get all expected audio files from game data
   */
  private getAllExpectedFiles(): AudioFileInfo[] {
    const files: AudioFileInfo[] = [];

    for (const [caseType, languages] of Object.entries(gameData)) {
      for (const [language, words] of Object.entries(languages)) {
        for (const wordData of words) {
          files.push({
            filename: wordData.audio,
            language: language,
            caseType: caseType,
            text: wordData.word || wordData.correct,
            exists: false // Will be updated when checking
          });
        }
      }
    }

    return files;
  }

  /**
   * Get missing files for specific language or case
   */
  async getMissingFiles(language?: string, caseType?: string): Promise<AudioFileInfo[]> {
    const existingFiles = await this.listFiles('detective-listening');
    const existingFilenames = new Set(existingFiles.map(file => file.name));
    
    const allFiles = this.getAllExpectedFiles();
    
    return allFiles.filter(file => {
      // Filter by language if specified
      if (language && file.language !== language) {
        return false;
      }
      
      // Filter by case type if specified  
      if (caseType && file.caseType !== caseType) {
        return false;
      }
      
      // Return only missing files
      return !existingFilenames.has(file.filename);
    });
  }

  /**
   * Delete files from Supabase Storage
   */
  async deleteFiles(filenames: string[]): Promise<number> {
    try {
      const pathsToDelete = filenames.map(filename => `detective-listening/${filename}`);
      
      const { error } = await this.supabaseClient.storage
        .from(this.bucketName)
        .remove(pathsToDelete);

      if (error) {
        throw error;
      }

      console.log(`🗑️  Deleted ${filenames.length} files from Supabase Storage`);
      return filenames.length;
    } catch (error) {
      console.error('Error deleting files:', error);
      return 0;
    }
  }

  /**
   * Clean up test files
   */
  async cleanupTestFiles(): Promise<number> {
    const existingFiles = await this.listFiles('detective-listening');
    const testFiles = existingFiles
      .filter(file => file.name.startsWith('test-'))
      .map(file => file.name);
    
    if (testFiles.length > 0) {
      return await this.deleteFiles(testFiles);
    }
    
    return 0;
  }

  /**
   * Format bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file URL from Supabase Storage
   */
  getFileUrl(filename: string): string {
    const { data } = this.supabaseClient.storage
      .from(this.bucketName)
      .getPublicUrl(`detective-listening/${filename}`);
    
    return data.publicUrl;
  }

  /**
   * Check if file exists in Supabase Storage
   */
  async fileExists(filename: string): Promise<boolean> {
    try {
      const { data, error } = await this.supabaseClient.storage
        .from(this.bucketName)
        .download(`detective-listening/${filename}`);
      
      return !error && !!data;
    } catch (error) {
      return false;
    }
  }
}
