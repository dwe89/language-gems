#!/usr/bin/env tsx

/**
 * Audio Quality Testing Script for Detective Listening Game
 * 
 * This script tests and optimizes audio quality for different voices and settings
 * 
 * Usage:
 *   npm run test-audio-quality
 *   npm run test-audio-quality -- --language spanish
 *   npm run test-audio-quality -- --compare-voices
 */

import { AmazonPollyService, VOICE_CONFIGS, ALTERNATIVE_VOICES } from '../src/services/amazonPolly';
import { AudioFileManager } from '../src/services/audioFileManager';
import fs from 'fs';
import path from 'path';

interface QualityTestResult {
  voiceName: string;
  language: string;
  testWord: string;
  audioFile: string;
  fileSize: number;
  duration?: number;
  quality: 'excellent' | 'good' | 'fair' | 'poor';
  notes: string[];
}

class AudioQualityTester {
  private ttsService: AmazonPollyService;
  private fileManager: AudioFileManager;
  private testOutputDir: string;

  constructor() {
    this.testOutputDir = 'public/audio/detective-listening/quality-tests';
    this.ttsService = new AmazonPollyService(this.testOutputDir);
    this.fileManager = new AudioFileManager();

    // Ensure test directory exists
    if (!fs.existsSync(this.testOutputDir)) {
      fs.mkdirSync(this.testOutputDir, { recursive: true });
    }
  }

  /**
   * Test audio quality for all languages with default voices
   */
  async testDefaultVoices(): Promise<QualityTestResult[]> {
    console.log('🎤 Testing default voice quality...\n');
    
    const testWords = {
      spanish: ['perro', 'gato', 'manzana', 'familia'],
      french: ['chien', 'chat', 'pomme', 'famille'],
      german: ['Hund', 'Katze', 'Apfel', 'Familie']
    };

    const results: QualityTestResult[] = [];

    for (const [language, words] of Object.entries(testWords)) {
      console.log(`Testing ${language} voice...`);
      
      for (const word of words) {
        const filename = `test_${language}_${word}_default.mp3`;
        
        try {
          const filePath = await this.ttsService.generateAudio(
            word,
            language,
            filename
          );
          
          const result = await this.analyzeAudioFile(filePath, {
            voiceName: VOICE_CONFIGS[language].voiceName,
            language,
            testWord: word,
            audioFile: filename
          });
          
          results.push(result);
          
        } catch (error) {
          console.error(`Failed to test ${word} in ${language}:`, error);
        }
      }
    }

    return results;
  }

  /**
   * Compare different voices for a specific language
   */
  async compareVoices(language: string): Promise<QualityTestResult[]> {
    console.log(`🔍 Comparing voices for ${language}...\n`);
    
    const testWord = this.getTestWord(language);
    const results: QualityTestResult[] = [];
    
    // Test default voice
    const defaultConfig = VOICE_CONFIGS[language];
    const defaultFilename = `test_${language}_${testWord}_default.mp3`;
    
    try {
      const defaultPath = await this.ttsService.generateAudio(
        testWord,
        language,
        defaultFilename
      );
      
      const defaultResult = await this.analyzeAudioFile(defaultPath, {
        voiceName: defaultConfig.voiceName,
        language,
        testWord,
        audioFile: defaultFilename
      });
      
      results.push(defaultResult);
    } catch (error) {
      console.error(`Failed to test default voice:`, error);
    }
    
    // Test alternative voices
    const alternatives = ALTERNATIVE_VOICES[language] || [];
    
    for (let i = 0; i < alternatives.length; i++) {
      const altConfig = alternatives[i];
      const altFilename = `test_${language}_${testWord}_alt${i + 1}.mp3`;
      
      try {
        const altPath = await this.ttsService.generateAudio(
          testWord,
          language,
          altFilename,
          altConfig
        );
        
        const altResult = await this.analyzeAudioFile(altPath, {
          voiceName: altConfig.voiceName,
          language,
          testWord,
          audioFile: altFilename
        });
        
        results.push(altResult);
        
      } catch (error) {
        console.error(`Failed to test alternative voice ${i + 1}:`, error);
      }
    }

    return results;
  }

  /**
   * Test different speaking rates and pitch settings
   */
  async testVoiceSettings(language: string): Promise<QualityTestResult[]> {
    console.log(`⚙️ Testing voice settings for ${language}...\n`);
    
    const testWord = this.getTestWord(language);
    const baseConfig = VOICE_CONFIGS[language];
    const results: QualityTestResult[] = [];
    
    const testSettings = [
      { speakingRate: 0.7, pitch: 0.0, label: 'slow' },
      { speakingRate: 0.85, pitch: 0.0, label: 'normal' },
      { speakingRate: 1.0, pitch: 0.0, label: 'fast' },
      { speakingRate: 0.85, pitch: -2.0, label: 'lower_pitch' },
      { speakingRate: 0.85, pitch: 2.0, label: 'higher_pitch' }
    ];
    
    for (const setting of testSettings) {
      const filename = `test_${language}_${testWord}_${setting.label}.mp3`;
      const config = {
        ...baseConfig,
        speakingRate: setting.speakingRate,
        pitch: setting.pitch
      };
      
      try {
        const filePath = await this.ttsService.generateAudio(
          testWord,
          language,
          filename,
          config
        );
        
        const result = await this.analyzeAudioFile(filePath, {
          voiceName: `${baseConfig.voiceName} (${setting.label})`,
          language,
          testWord,
          audioFile: filename
        });
        
        results.push(result);
        
      } catch (error) {
        console.error(`Failed to test ${setting.label} settings:`, error);
      }
    }

    return results;
  }

  /**
   * Analyze an audio file and return quality metrics
   */
  private async analyzeAudioFile(
    filePath: string, 
    metadata: Partial<QualityTestResult>
  ): Promise<QualityTestResult> {
    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    
    // Basic quality assessment based on file size and other factors
    let quality: 'excellent' | 'good' | 'fair' | 'poor' = 'good';
    const notes: string[] = [];
    
    // File size analysis
    if (fileSize < 5000) {
      quality = 'poor';
      notes.push('File size too small, may be corrupted');
    } else if (fileSize < 10000) {
      quality = 'fair';
      notes.push('Small file size, may lack quality');
    } else if (fileSize > 50000) {
      notes.push('Large file size, good quality expected');
      quality = 'excellent';
    }
    
    // Additional checks could include:
    // - Audio duration analysis
    // - Frequency analysis
    // - Volume level checks
    // - Silence detection
    
    return {
      voiceName: metadata.voiceName || 'unknown',
      language: metadata.language || 'unknown',
      testWord: metadata.testWord || 'unknown',
      audioFile: metadata.audioFile || 'unknown',
      fileSize,
      quality,
      notes
    };
  }

  /**
   * Generate a quality report
   */
  generateReport(results: QualityTestResult[]): string {
    let report = '🎵 AUDIO QUALITY TEST REPORT\n';
    report += '='.repeat(50) + '\n\n';
    
    // Summary
    const excellent = results.filter(r => r.quality === 'excellent').length;
    const good = results.filter(r => r.quality === 'good').length;
    const fair = results.filter(r => r.quality === 'fair').length;
    const poor = results.filter(r => r.quality === 'poor').length;
    
    report += `📊 Quality Summary:\n`;
    report += `  Excellent: ${excellent}\n`;
    report += `  Good: ${good}\n`;
    report += `  Fair: ${fair}\n`;
    report += `  Poor: ${poor}\n\n`;
    
    // Detailed results
    report += `📋 Detailed Results:\n`;
    results.forEach(result => {
      const qualityEmoji = {
        excellent: '🟢',
        good: '🟡',
        fair: '🟠',
        poor: '🔴'
      }[result.quality];
      
      report += `\n${qualityEmoji} ${result.voiceName}\n`;
      report += `   Language: ${result.language}\n`;
      report += `   Test Word: "${result.testWord}"\n`;
      report += `   File Size: ${this.formatBytes(result.fileSize)}\n`;
      report += `   Quality: ${result.quality}\n`;
      
      if (result.notes.length > 0) {
        report += `   Notes: ${result.notes.join(', ')}\n`;
      }
    });
    
    // Recommendations
    report += `\n💡 Recommendations:\n`;
    
    if (poor > 0) {
      report += `  - Investigate ${poor} poor quality files\n`;
    }
    
    if (excellent > good + fair + poor) {
      report += `  - Current settings produce excellent quality\n`;
    } else {
      report += `  - Consider adjusting voice settings for better quality\n`;
    }
    
    return report;
  }

  /**
   * Clean up test files
   */
  cleanup(): void {
    try {
      const files = fs.readdirSync(this.testOutputDir);
      files.forEach(file => {
        if (file.startsWith('test_')) {
          fs.unlinkSync(path.join(this.testOutputDir, file));
        }
      });
      console.log('🧹 Test files cleaned up');
    } catch (error) {
      console.warn('Failed to cleanup test files:', error);
    }
  }

  private getTestWord(language: string): string {
    const testWords = {
      spanish: 'perro',
      french: 'chien',
      german: 'Hund'
    };
    return testWords[language as keyof typeof testWords] || 'test';
  }

  private formatBytes(bytes: number): string {
    return AudioFileManager.formatBytes(bytes);
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const tester = new AudioQualityTester();
  
  try {
    let results: QualityTestResult[] = [];
    
    if (args.includes('--compare-voices')) {
      const language = args.find(arg => ['spanish', 'french', 'german'].includes(arg)) || 'spanish';
      results = await tester.compareVoices(language);
    } else if (args.includes('--test-settings')) {
      const language = args.find(arg => ['spanish', 'french', 'german'].includes(arg)) || 'spanish';
      results = await tester.testVoiceSettings(language);
    } else {
      results = await tester.testDefaultVoices();
    }
    
    // Generate and display report
    const report = tester.generateReport(results);
    console.log('\n' + report);
    
    // Save report to file
    const reportPath = `quality-test-report-${Date.now()}.txt`;
    fs.writeFileSync(reportPath, report);
    console.log(`\n📄 Report saved to: ${reportPath}`);
    
    // Cleanup unless --keep-files flag is present
    if (!args.includes('--keep-files')) {
      tester.cleanup();
    }
    
  } catch (error) {
    console.error('❌ Quality test failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { AudioQualityTester };
