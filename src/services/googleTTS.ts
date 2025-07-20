import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import fs from 'fs';
import path from 'path';

// Amazon Polly Configuration
export interface TTSConfig {
  languageCode: string;
  voiceId: string;
  engine: 'standard' | 'neural';
  outputFormat: 'mp3' | 'ogg_vorbis' | 'pcm';
  sampleRate: string;
  textType: 'text' | 'ssml';
}

// Voice configurations for each language
// Optimized for language learning with clear pronunciation
export const VOICE_CONFIGS: Record<string, TTSConfig> = {
  spanish: {
    languageCode: 'es-ES',
    voiceId: 'Lucia', // High-quality Spanish neural voice
    engine: 'neural',
    outputFormat: 'mp3',
    sampleRate: '22050',
    textType: 'text'
  },
  french: {
    languageCode: 'fr-FR',
    voiceId: 'Lea', // High-quality French neural voice
    engine: 'neural',
    outputFormat: 'mp3',
    sampleRate: '22050',
    textType: 'text'
  },
  german: {
    languageCode: 'de-DE',
    voiceId: 'Vicki', // High-quality German neural voice
    engine: 'neural',
    outputFormat: 'mp3',
    sampleRate: '22050',
    textType: 'text'
  }
};

// Alternative voice configurations for variety
export const ALTERNATIVE_VOICES: Record<string, TTSConfig[]> = {
  spanish: [
    {
      languageCode: 'es-ES',
      voiceId: 'Enrique', // Male Spanish voice
      engine: 'neural',
      outputFormat: 'mp3',
      sampleRate: '22050',
      textType: 'text'
    },
    {
      languageCode: 'es-US',
      voiceId: 'Lupe', // US Spanish female voice
      engine: 'neural',
      outputFormat: 'mp3',
      sampleRate: '22050',
      textType: 'text'
    }
  ],
  french: [
    {
      languageCode: 'fr-FR',
      voiceId: 'Mathieu', // Male French voice
      engine: 'neural',
      outputFormat: 'mp3',
      sampleRate: '22050',
      textType: 'text'
    },
    {
      languageCode: 'fr-CA',
      voiceId: 'Chantal', // Canadian French voice
      engine: 'standard',
      outputFormat: 'mp3',
      sampleRate: '22050',
      textType: 'text'
    }
  ],
  german: [
    {
      languageCode: 'de-DE',
      voiceId: 'Daniel', // Male German voice
      engine: 'neural',
      outputFormat: 'mp3',
      sampleRate: '22050',
      textType: 'text'
    },
    {
      languageCode: 'de-DE',
      voiceId: 'Marlene', // Alternative female German voice
      engine: 'standard',
      outputFormat: 'mp3',
      sampleRate: '22050',
      textType: 'text'
    }
  ]
};

export class AmazonPollyService {
  private client: PollyClient;
  private outputDir: string;

  constructor(outputDir: string = 'public/audio/detective-listening') {
    // Initialize the Polly client with credentials from environment variables
    this.client = new PollyClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.outputDir = outputDir;

    // Ensure output directory exists
    this.ensureDirectoryExists(this.outputDir);
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * Generate audio for a single word
   */
  async generateAudio(
    text: string,
    language: string,
    filename: string,
    customConfig?: Partial<TTSConfig>
  ): Promise<string> {
    try {
      const config = { ...VOICE_CONFIGS[language], ...customConfig };

      if (!config) {
        throw new Error(`Unsupported language: ${language}`);
      }

      // Construct the Polly request
      const command = new SynthesizeSpeechCommand({
        Text: text,
        VoiceId: config.voiceId,
        OutputFormat: config.outputFormat,
        SampleRate: config.sampleRate,
        Engine: config.engine,
        TextType: config.textType,
        LanguageCode: config.languageCode,
      });

      console.log(`Generating audio for "${text}" in ${language} using voice ${config.voiceId}...`);

      // Perform the text-to-speech request
      const response = await this.client.send(command);

      if (!response.AudioStream) {
        throw new Error('No audio content received from Amazon Polly');
      }

      // Convert the audio stream to buffer
      const audioBuffer = await this.streamToBuffer(response.AudioStream);

      // Save the audio file
      const filePath = path.join(this.outputDir, filename);
      fs.writeFileSync(filePath, audioBuffer);

      console.log(`✅ Audio saved: ${filePath}`);
      return filePath;

    } catch (error) {
      console.error(`❌ Error generating audio for "${text}":`, error);
      throw error;
    }
  }

  /**
   * Convert a readable stream to buffer
   */
  private async streamToBuffer(stream: any): Promise<Buffer> {
    const chunks: Uint8Array[] = [];

    for await (const chunk of stream) {
      chunks.push(chunk);
    }

    return Buffer.concat(chunks);
  }

  /**
   * Generate audio for multiple words with progress tracking
   */
  async generateBulkAudio(
    words: Array<{ text: string; language: string; filename: string }>,
    onProgress?: (current: number, total: number, filename: string) => void
  ): Promise<string[]> {
    const results: string[] = [];
    const total = words.length;

    for (let i = 0; i < words.length; i++) {
      const { text, language, filename } = words[i];
      
      try {
        // Check if file already exists
        const filePath = path.join(this.outputDir, filename);
        if (fs.existsSync(filePath)) {
          console.log(`⏭️  Skipping existing file: ${filename}`);
          results.push(filePath);
          onProgress?.(i + 1, total, filename);
          continue;
        }

        const result = await this.generateAudio(text, language, filename);
        results.push(result);
        
        // Progress callback
        onProgress?.(i + 1, total, filename);
        
        // Rate limiting: wait 100ms between requests to avoid hitting API limits
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`Failed to generate audio for ${filename}:`, error);
        // Continue with other files even if one fails
      }
    }

    return results;
  }

  /**
   * List available voices for a language
   */
  async listVoices(languageCode?: string): Promise<any[]> {
    try {
      // Amazon Polly doesn't have a direct listVoices API like Google
      // Instead, we'll return the configured voices for the language
      if (languageCode) {
        const language = Object.keys(VOICE_CONFIGS).find(
          lang => VOICE_CONFIGS[lang].languageCode === languageCode
        );

        if (language) {
          const mainVoice = VOICE_CONFIGS[language];
          const altVoices = ALTERNATIVE_VOICES[language] || [];
          return [mainVoice, ...altVoices];
        }
      }

      // Return all configured voices
      const allVoices = Object.values(VOICE_CONFIGS);
      const allAltVoices = Object.values(ALTERNATIVE_VOICES).flat();
      return [...allVoices, ...allAltVoices];
    } catch (error) {
      console.error('Error listing voices:', error);
      throw error;
    }
  }

  /**
   * Test the TTS service with a simple phrase
   */
  async testService(): Promise<boolean> {
    try {
      console.log('🧪 Testing Amazon Polly service...');

      const testFile = await this.generateAudio(
        'Hola, esto es una prueba.',
        'spanish', // Using Spanish text for testing
        'test-audio.mp3'
      );

      // Check if file was created and has content
      const stats = fs.statSync(testFile);
      const success = stats.size > 0;

      if (success) {
        console.log('✅ Amazon Polly service is working correctly!');
        // Clean up test file
        fs.unlinkSync(testFile);
      } else {
        console.log('❌ Test file was created but is empty');
      }

      return success;
    } catch (error) {
      console.error('❌ Amazon Polly test failed:', error);
      return false;
    }
  }

  /**
   * Get estimated cost for generating audio
   */
  calculateEstimatedCost(totalCharacters: number): number {
    // Amazon Polly pricing: $4.00 per 1 million characters for Neural voices
    // Standard voices are $4.00 per 1 million characters as well
    const pricePerMillion = 4.00;
    return (totalCharacters / 1000000) * pricePerMillion;
  }

  /**
   * Clean up old or test audio files
   */
  cleanupAudioFiles(pattern?: string): void {
    try {
      const files = fs.readdirSync(this.outputDir);
      const filesToDelete = pattern 
        ? files.filter(file => file.includes(pattern))
        : files.filter(file => file.startsWith('test-'));
      
      filesToDelete.forEach(file => {
        const filePath = path.join(this.outputDir, file);
        fs.unlinkSync(filePath);
        console.log(`🗑️  Deleted: ${file}`);
      });
      
      console.log(`✅ Cleaned up ${filesToDelete.length} files`);
    } catch (error) {
      console.error('Error cleaning up files:', error);
    }
  }
}
