import fs from 'fs';
import path from 'path';
import { gameData } from '../app/activities/detective-listening/data/gameData';

export interface AudioFileInfo {
  filename: string;
  path: string;
  exists: boolean;
  size?: number;
  created?: Date;
  language: string;
  caseType: string;
  word: string;
}

export interface AudioManifest {
  generated: Date;
  totalFiles: number;
  byLanguage: Record<string, number>;
  byCase: Record<string, number>;
  files: AudioFileInfo[];
  missing: AudioFileInfo[];
}

export class AudioFileManager {
  private audioDir: string;
  private manifestPath: string;

  constructor(audioDir: string = 'public/audio/detective-listening') {
    this.audioDir = audioDir;
    this.manifestPath = path.join(audioDir, 'manifest.json');
    this.ensureDirectoryStructure();
  }

  /**
   * Ensure the audio directory structure exists
   */
  private ensureDirectoryStructure(): void {
    // Create main audio directory
    if (!fs.existsSync(this.audioDir)) {
      fs.mkdirSync(this.audioDir, { recursive: true });
    }

    // Create subdirectories for organization (optional)
    const subdirs = ['spanish', 'french', 'german', 'effects'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(this.audioDir, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });

    console.log(`📁 Audio directory structure ready: ${this.audioDir}`);
  }

  /**
   * Scan all expected audio files and check their status
   */
  scanAudioFiles(): AudioManifest {
    const files: AudioFileInfo[] = [];
    const missing: AudioFileInfo[] = [];

    // Scan all vocabulary data
    for (const [caseType, languages] of Object.entries(gameData)) {
      for (const [language, words] of Object.entries(languages)) {
        for (const wordData of words) {
          const filename = wordData.audio;
          const filePath = path.join(this.audioDir, filename);
          const exists = fs.existsSync(filePath);

          const fileInfo: AudioFileInfo = {
            filename,
            path: filePath,
            exists,
            language,
            caseType,
            word: wordData.word || wordData.correct
          };

          if (exists) {
            const stats = fs.statSync(filePath);
            fileInfo.size = stats.size;
            fileInfo.created = stats.birthtime;
            files.push(fileInfo);
          } else {
            missing.push(fileInfo);
          }
        }
      }
    }

    // Generate statistics
    const byLanguage = files.reduce((acc, file) => {
      acc[file.language] = (acc[file.language] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCase = files.reduce((acc, file) => {
      acc[file.caseType] = (acc[file.caseType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const manifest: AudioManifest = {
      generated: new Date(),
      totalFiles: files.length,
      byLanguage,
      byCase,
      files,
      missing
    };

    return manifest;
  }

  /**
   * Save manifest to file
   */
  saveManifest(manifest: AudioManifest): void {
    fs.writeFileSync(this.manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`📄 Manifest saved: ${this.manifestPath}`);
  }

  /**
   * Load manifest from file
   */
  loadManifest(): AudioManifest | null {
    try {
      if (fs.existsSync(this.manifestPath)) {
        const data = fs.readFileSync(this.manifestPath, 'utf-8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Failed to load manifest:', error);
    }
    return null;
  }

  /**
   * Generate and save current manifest
   */
  updateManifest(): AudioManifest {
    const manifest = this.scanAudioFiles();
    this.saveManifest(manifest);
    return manifest;
  }

  /**
   * Get audio file status report
   */
  getStatusReport(): string {
    const manifest = this.scanAudioFiles();
    
    let report = '🎵 AUDIO FILES STATUS REPORT\n';
    report += '='.repeat(40) + '\n\n';
    
    report += `📊 Summary:\n`;
    report += `  Total expected files: ${manifest.totalFiles + manifest.missing.length}\n`;
    report += `  Files present: ${manifest.totalFiles}\n`;
    report += `  Files missing: ${manifest.missing.length}\n`;
    report += `  Completion: ${Math.round((manifest.totalFiles / (manifest.totalFiles + manifest.missing.length)) * 100)}%\n\n`;
    
    report += `📈 By Language:\n`;
    Object.entries(manifest.byLanguage).forEach(([lang, count]) => {
      const total = Object.values(gameData).reduce((sum, cases) => {
        return sum + (cases[lang]?.length || 0);
      }, 0);
      const percentage = Math.round((count / total) * 100);
      report += `  ${lang}: ${count}/${total} (${percentage}%)\n`;
    });
    
    report += `\n📁 By Case Type:\n`;
    Object.entries(manifest.byCase).forEach(([caseType, count]) => {
      const total = Object.values(gameData[caseType] || {}).reduce((sum, words) => sum + words.length, 0);
      const percentage = Math.round((count / total) * 100);
      report += `  ${caseType}: ${count}/${total} (${percentage}%)\n`;
    });
    
    if (manifest.missing.length > 0) {
      report += `\n❌ Missing Files (first 10):\n`;
      manifest.missing.slice(0, 10).forEach(file => {
        report += `  ${file.filename} (${file.language}/${file.caseType})\n`;
      });
      
      if (manifest.missing.length > 10) {
        report += `  ... and ${manifest.missing.length - 10} more\n`;
      }
    }
    
    return report;
  }

  /**
   * Clean up invalid or corrupted audio files
   */
  cleanupInvalidFiles(): number {
    let cleaned = 0;
    const manifest = this.scanAudioFiles();
    
    manifest.files.forEach(file => {
      if (file.size === 0) {
        console.log(`🗑️  Removing empty file: ${file.filename}`);
        fs.unlinkSync(file.path);
        cleaned++;
      }
    });
    
    console.log(`✅ Cleaned up ${cleaned} invalid files`);
    return cleaned;
  }

  /**
   * Backup audio files to a zip archive
   */
  async backupAudioFiles(backupPath?: string): Promise<string> {
    const archiver = require('archiver');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const defaultBackupPath = `audio-backup-${timestamp}.zip`;
    const outputPath = backupPath || defaultBackupPath;
    
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(outputPath);
      const archive = archiver('zip', { zlib: { level: 9 } });
      
      output.on('close', () => {
        console.log(`✅ Backup created: ${outputPath} (${archive.pointer()} bytes)`);
        resolve(outputPath);
      });
      
      archive.on('error', reject);
      archive.pipe(output);
      
      // Add all audio files to archive
      archive.directory(this.audioDir, 'audio');
      archive.finalize();
    });
  }

  /**
   * Validate audio file integrity
   */
  validateAudioFiles(): { valid: AudioFileInfo[], invalid: AudioFileInfo[] } {
    const manifest = this.scanAudioFiles();
    const valid: AudioFileInfo[] = [];
    const invalid: AudioFileInfo[] = [];
    
    manifest.files.forEach(file => {
      // Basic validation: file exists and has content
      if (file.exists && file.size && file.size > 0) {
        // Additional validation could include:
        // - Audio format validation
        // - Duration checks
        // - Audio quality analysis
        valid.push(file);
      } else {
        invalid.push(file);
      }
    });
    
    return { valid, invalid };
  }

  /**
   * Get missing files for a specific language or case
   */
  getMissingFiles(language?: string, caseType?: string): AudioFileInfo[] {
    const manifest = this.scanAudioFiles();
    
    return manifest.missing.filter(file => {
      if (language && file.language !== language) return false;
      if (caseType && file.caseType !== caseType) return false;
      return true;
    });
  }

  /**
   * Calculate total storage used by audio files
   */
  getStorageInfo(): { totalSize: number, fileCount: number, averageSize: number } {
    const manifest = this.scanAudioFiles();
    const totalSize = manifest.files.reduce((sum, file) => sum + (file.size || 0), 0);
    const fileCount = manifest.files.length;
    const averageSize = fileCount > 0 ? totalSize / fileCount : 0;
    
    return {
      totalSize,
      fileCount,
      averageSize
    };
  }

  /**
   * Format bytes to human readable format
   */
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
