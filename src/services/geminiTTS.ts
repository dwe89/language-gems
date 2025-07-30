import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Lazy initialization of Google AI client
let genAI: GoogleGenerativeAI | null = null;

function getGoogleAI() {
  if (!genAI) {
    if (!process.env.GOOGLE_AI_API_KEY) {
      throw new Error('GOOGLE_AI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  }
  return genAI;
}

// Lazy initialization of Supabase client for storage
let supabaseAdmin: any = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    // Ensure Supabase environment variables are checked before creation
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) are not set');
    }
    supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
  }
  return supabaseAdmin;
}

export interface GeminiTTSConfig {
  voiceName: string;
  language?: string;
  style?: string;
  pace?: 'very_slow' | 'slow' | 'normal' | 'fast';
  tone?: 'neutral' | 'cheerful' | 'serious' | 'excited' | 'calm' | 'formal' | 'friendly';
}

export interface MultiSpeakerConfig {
  speakers: Array<{
    name: string;
    voiceName: string;
    style?: string;
  }>;
}

// Available voice options from Gemini 2.5 Pro Preview TTS
export const GEMINI_VOICES = [
  'Zephyr', 'Puck', 'Charon', 'Kore', 'Fenrir', 'Leda', 'Orus', 'Aoede',
  'Callirrhoe', 'Autonoe', 'Enceladus', 'Iapetus', 'Umbriel', 'Algieba',
  'Despina', 'Erinome', 'Algenib', 'Rasalgethi', 'Laomedeia', 'Achernar',
  'Alnilam', 'Schedar', 'Gacrux', 'Pulcherrima', 'Achird', 'Zubenelgenubi',
  'Vindemiatrix', 'Sadachbia', 'Sadaltager', 'Sulafat'
] as const;

// Gender-specific voice mappings for different languages
export const VOICE_MAPPINGS = {
  spanish: {
    male: 'Charon', // Deep, informative voice good for Spanish male speakers
    female: 'Kore', // Firm, clear voice good for Spanish female speakers
    neutral: 'Kore' // Default to female voice for Spanish
  },
  french: {
    male: 'Puck', // Upbeat, natural voice
    female: 'Aoede', // Breezy, good for French female speakers
    neutral: 'Aoede' // Default to female voice for French
  },
  german: {
    male: 'Charon', // Informative, good for German male speakers
    female: 'Leda', // Clear, professional female voice
    neutral: 'Charon' // Default to male voice for German
  },
  english: {
    male: 'Puck', // Upbeat, natural for English male speakers
    female: 'Aoede', // Breezy, natural British-sounding voice
    neutral: 'Puck' // Default to male voice for English
  }
};

// Language-specific voice recommendations (backwards compatibility)
export const LANGUAGE_VOICE_MAPPING: Record<string, string> = {
  spanish: VOICE_MAPPINGS.spanish.neutral,
  french: VOICE_MAPPINGS.french.neutral,
  german: VOICE_MAPPINGS.german.neutral,
  english: VOICE_MAPPINGS.english.neutral,
  es: VOICE_MAPPINGS.spanish.neutral,
  fr: VOICE_MAPPINGS.french.neutral,
  de: VOICE_MAPPINGS.german.neutral,
  en: VOICE_MAPPINGS.english.neutral,
};

// British female voice for question introductions
export const BRITISH_FEMALE_VOICE = 'Aoede'; // Breezy, natural British-sounding voice

// Helper function to detect gender from speaker names
export function detectGenderFromName(name: string): 'male' | 'female' | 'neutral' {
  const femaleNames = [
    'ana', 'carmen', 'laura', 'maria', 'sofia', 'elena', 'lucia', 'paula', 'sara', 'claudia',
    'anne', 'marie', 'sophie', 'claire', 'julie', 'camille', 'lea', 'emma', 'chloe', 'manon',
    'anna', 'lisa', 'sarah', 'julia', 'lena', 'nina', 'mia', 'lea', 'emma', 'laura',
    'mother', 'madre', 'mère', 'mutter', 'sister', 'hermana', 'sœur', 'schwester',
    'daughter', 'hija', 'fille', 'tochter', 'grandmother', 'abuela', 'grand-mère', 'großmutter'
  ];

  const maleNames = [
    'carlos', 'miguel', 'antonio', 'jose', 'francisco', 'david', 'juan', 'pedro', 'alejandro', 'manuel',
    'pierre', 'jean', 'michel', 'philippe', 'alain', 'patrick', 'nicolas', 'christophe', 'laurent', 'eric',
    'michael', 'thomas', 'christian', 'wolfgang', 'werner', 'günter', 'frank', 'bernd', 'stefan', 'peter',
    'father', 'padre', 'père', 'vater', 'brother', 'hermano', 'frère', 'bruder',
    'son', 'hijo', 'fils', 'sohn', 'grandfather', 'abuelo', 'grand-père', 'großvater'
  ];

  const lowerName = name.toLowerCase().trim();

  if (femaleNames.some(fn => lowerName.includes(fn))) {
    return 'female';
  }

  if (maleNames.some(mn => lowerName.includes(mn))) {
    return 'male';
  }

  return 'neutral';
}

// Helper function to get appropriate voice for language and gender
export function getVoiceForLanguageAndGender(language: string, gender: 'male' | 'female' | 'neutral' = 'neutral'): string {
  const langKey = language.toLowerCase();
  const mapping = (VOICE_MAPPINGS as any)[langKey] || VOICE_MAPPINGS.english;
  return mapping[gender] || mapping.neutral;
}

export class GeminiTTSService {
  private model: any;
  private bucketName: string = 'audio';
  private lastRequestTime: number = 0;
  private requestCount: number = 0;
  private readonly MIN_REQUEST_INTERVAL = 2000; // 2 seconds between requests
  private readonly MAX_REQUESTS_PER_MINUTE = 20; // Conservative limit
  private readonly RATE_LIMIT_RESET_INTERVAL = 60000; // 1 minute

  constructor(useProModel: boolean = false) {
    // **CRITICAL FIX:** Ensure a Text-to-Speech capable model is used.
    // 'gemini-2.5-pro-preview-tts' provides higher quality.
    // 'gemini-2.5-flash-preview-tts' is a faster, potentially more cost-effective alternative.
    // 'gemini-2.0-flash-exp' is a text generation model and does NOT support audio.
    const modelName = useProModel ? 'gemini-2.5-pro-preview-tts' : 'gemini-2.5-flash-preview-tts';
    this.model = getGoogleAI().getGenerativeModel({
      model: modelName
    });
    console.log(`🤖 Initialized Gemini TTS with model: ${modelName}`);

    // Reset request count every minute
    setInterval(() => {
      this.requestCount = 0;
      console.log('🔄 Rate limit counter reset');
    }, this.RATE_LIMIT_RESET_INTERVAL);
  }

  /**
   * Rate limiting helper to prevent API quota exhaustion
   */
  private async enforceRateLimit(): Promise<void> {
    const now = Date.now();

    // Check if we've exceeded requests per minute
    if (this.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      const waitTime = this.RATE_LIMIT_RESET_INTERVAL - (now % this.RATE_LIMIT_RESET_INTERVAL);
      console.log(`⏳ Rate limit reached (${this.requestCount}/${this.MAX_REQUESTS_PER_MINUTE}). Waiting ${Math.ceil(waitTime / 1000)}s...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this.requestCount = 0;
    }

    // Ensure minimum interval between requests
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.MIN_REQUEST_INTERVAL) {
      const waitTime = this.MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      console.log(`⏳ Enforcing rate limit. Waiting ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;
    console.log(`📊 API Request ${this.requestCount}/${this.MAX_REQUESTS_PER_MINUTE} this minute`);
  }

  /**
   * Generate audio for AQA listening assessments (simplified - no intro)
   */
  async generateAQAListeningAudio(
    questionNumber: number,
    mainText: string,
    config: GeminiTTSConfig,
    filename: string,
    isMultiSpeaker: boolean = false,
    speakers?: MultiSpeakerConfig['speakers']
  ): Promise<string> {
    try {
      console.log(`🎵 Generating AQA listening audio for Question ${questionNumber}`);

      // Generate main content audio directly (no introduction)
      let audioBuffer: Buffer;

      if (isMultiSpeaker && speakers) {
        // Check if we have more than 2 speakers (Gemini Flash TTS limitation)
        if (speakers.length > 2) {
          console.log(`⚠️ Multi-speaker content has ${speakers.length} speakers, but Gemini Flash TTS only supports 2. Falling back to single-speaker mode.`);
          // Use single-speaker generation as fallback
          const audioResult = await this.generateSingleSpeakerContentOnly(mainText, config);
          audioBuffer = Buffer.from(audioResult, 'base64');
        } else {
          // Use multi-speaker generation (2 speakers only)
          const audioResult = await this.generateMultiSpeakerContentOnly(mainText, { speakers });
          audioBuffer = Buffer.from(audioResult, 'base64');
        }
      } else {
        // Use single-speaker generation
        const audioResult = await this.generateSingleSpeakerContentOnly(mainText, config);
        audioBuffer = Buffer.from(audioResult, 'base64');
      }

      // Create WAV file with proper headers
      const wavBuffer = this.createWavFile(audioBuffer);

      // Upload to Supabase Storage
      const storagePath = `exam-audio/${filename}`;
      const { data, error } = await getSupabaseAdmin().storage
        .from(this.bucketName)
        .upload(storagePath, wavBuffer, {
          contentType: 'audio/wav',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = getSupabaseAdmin().storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);

      console.log(`✅ AQA listening audio generated and uploaded: ${urlData.publicUrl}`);
      return urlData.publicUrl;

    } catch (error: any) {
      console.error('❌ Error generating AQA listening audio:', error.message);

      // Handle specific rate limit errors
      if (error.status === 429 || error.message?.includes('rate limit') || error.message?.includes('quota')) {
        // Check if it's a daily quota issue
        if (error.message?.includes('generate_requests_per_model_per_day')) {
          console.error('🚫 Daily quota exceeded for Gemini TTS. Please wait until tomorrow or upgrade your plan.');
          throw new Error(`Daily quota exceeded: You have reached the daily limit for TTS requests. Please try again tomorrow or upgrade your Google AI plan.`);
        } else {
          console.error('🚫 Rate limit exceeded. The service will automatically retry with backoff.');
          throw new Error(`Rate limit exceeded: ${error.message}`);
        }
      }

      if (error.response) {
        console.error('Gemini API Error Response Details:', JSON.stringify(error.response, null, 2));
      } else if (error.status) { // For errors that might be plain HTTP errors
        console.error(`HTTP Status Code: ${error.status}`);
      }
      throw error;
    }
  }

  /**
   * Generate single-speaker audio using Gemini TTS
   */
  async generateSingleSpeakerAudio(
    text: string,
    config: GeminiTTSConfig,
    filename: string
  ): Promise<string> {
    try {
      console.log(`🎵 Generating audio with Gemini TTS for: "${text.substring(0, 50)}..."`);

      const audioData = await this.generateSingleSpeakerContentOnly(text, config);
      const audioBuffer = Buffer.from(audioData, 'base64');

      console.log(`📊 Audio buffer size: ${audioBuffer.length} bytes`);

      // Validate audio buffer size
      // Keep minimum buffer size low for very short phrases, adjust if needed
      if (audioBuffer.length < 100) { 
        const errorMessage = `Audio buffer too small (${audioBuffer.length} bytes) - generation may have failed for single speaker audio.`;
        console.error('❌', errorMessage);
        throw new Error(errorMessage);
      }

      // Create WAV file with proper headers
      const wavBuffer = this.createWavFile(audioBuffer);

      // Upload to Supabase Storage
      const storagePath = `exam-audio/${filename}`;
      const { data, error } = await getSupabaseAdmin().storage
        .from(this.bucketName)
        .upload(storagePath, wavBuffer, {
          contentType: 'audio/wav',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = getSupabaseAdmin().storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);

      console.log(`✅ Audio generated and uploaded: ${urlData.publicUrl}`);
      return urlData.publicUrl;

    } catch (error: any) {
      console.error(`❌ Error generating audio with Gemini TTS:`, error.message);

      // Handle specific quota errors
      if (error.message?.includes('rate limit') || error.status === 429) {
        console.error('Gemini API Error: Rate limit exceeded. Please check your Google Cloud Console for quotas.');
        throw new Error(`Rate limit exceeded for Gemini TTS. Please wait before trying again. ${error.message}`);
      }

      // Handle authentication errors
      if (error.status === 401 || error.status === 403) {
        console.error('Gemini API Error: Authentication failed. Please check your Google AI API key.');
        throw new Error(`Authentication failed. Please check your Google AI API key. ${error.message}`);
      }

      // Log additional error details for unknown errors
      if (error.response) {
        console.error('Gemini API Error Response Details:', JSON.stringify(error.response, null, 2));
      } else if (error.message) {
        console.error('Error Message:', error.message);
      } else {
        console.error('Unknown Error Object:', JSON.stringify(error, null, 2));
      }

      throw error;
    }
  }

  /**
   * Generate multi-speaker audio using Gemini TTS
   */
  async generateMultiSpeakerAudio(
    transcript: string,
    config: MultiSpeakerConfig,
    filename: string
  ): Promise<string> {
    try {
      console.log(`🎵 Generating multi-speaker audio with Gemini TTS`);

      // The 'text' for multi-speaker should ideally be raw dialogue,
      // possibly with SSML speaker tags if specific formatting is needed.
      // Removed the wrapper prompt, allowing the 'text' itself to be passed directly.
      const contentText = transcript;

      const requestConfig = {
        contents: [{
          parts: [{ text: contentText }]
        }],
        generationConfig: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: config.speakers.map(speaker => ({
                speaker: speaker.name,
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: speaker.voiceName
                  }
                }
              }))
            }
          }
        }
      };

      const result = await this.model.generateContent(requestConfig);

      // Improved response validation and detailed error logging
      const candidate = result?.response?.candidates?.[0];
      const part = candidate?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;

      if (!audioData) {
        const errorMessage = 'Invalid response structure from Gemini TTS for multi-speaker content helper.';
        console.error('❌', errorMessage);
        console.error('Response structure (multi-speaker):', JSON.stringify({
          hasResponse: !!result?.response,
          hasCandidates: !!result?.response?.candidates,
          candidatesLength: result?.response?.candidates?.length,
          hasContent: !!candidate?.content,
          hasParts: !!candidate?.content?.parts,
          partsLength: candidate?.content?.parts?.length,
          hasInlineData: !!part?.inlineData,
          hasData: !!audioData,
          finishReason: candidate?.finishReason // Log finish reason
        }, null, 2));
        throw new Error(errorMessage);
      }

      const audioBuffer = Buffer.from(audioData, 'base64');

      console.log(`📊 Multi-speaker audio buffer size: ${audioBuffer.length} bytes`);

      // Validate audio buffer size
      if (audioBuffer.length < 100) { // Keep minimum buffer size low for very short phrases
        const errorMessage = `Audio buffer too small (${audioBuffer.length} bytes) - generation may have failed for multi-speaker audio.`;
        console.error('❌', errorMessage);
        throw new Error(errorMessage);
      }

      // Create WAV file with proper headers
      const wavBuffer = this.createWavFile(audioBuffer);

      // Upload to Supabase Storage
      const storagePath = `exam-audio/${filename}`;
      const { data, error } = await getSupabaseAdmin().storage
        .from(this.bucketName)
        .upload(storagePath, wavBuffer, {
          contentType: 'audio/wav',
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        throw new Error(`Failed to upload to Supabase Storage: ${error.message}`);
      }

      // Get public URL
      const { data: urlData } = getSupabaseAdmin().storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);

      console.log(`✅ Multi-speaker audio generated and uploaded: ${urlData.publicUrl}`);
      return urlData.publicUrl;

    } catch (error: any) {
      console.error(`❌ Error generating multi-speaker audio with Gemini TTS:`, error.message);
      if (error.response) {
        console.error('Gemini API Error Response Details:', JSON.stringify(error.response, null, 2));
      } else if (error.message) {
        console.error('Error Message:', error.message);
      } else {
        console.error('Unknown Error Object:', JSON.stringify(error, null, 2));
      }
      throw error;
    }
  }

  /**
   * Generate audio for exam questions
   */
  async generateExamAudio(
    questionText: string,
    language: string,
    questionId: string,
    options?: {
      includeInstructions?: boolean;
      speakingSpeed?: 'slow' | 'normal' | 'fast';
      tone?: 'neutral' | 'formal' | 'friendly';
      questionNumber?: number;
    }
  ): Promise<string> {
    const voiceName = LANGUAGE_VOICE_MAPPING[language] || 'Puck';
    const filename = `exam_${language}_${questionId}_${Date.now()}.wav`;

    // Add exam-specific formatting with question number
    let formattedText = questionText;
    if (options?.includeInstructions && options?.questionNumber) {
      formattedText = `Question ${options.questionNumber}. ${questionText}`;
    }

    return this.generateSingleSpeakerAudio(
      formattedText,
      {
        voiceName,
        language,
        pace: options?.speakingSpeed || 'slow', // Default to slow for exam audio
        tone: options?.tone || 'neutral'
      },
      filename
    );
  }

  /**
   * Generate audio for listening comprehension passages
   */
  async generateListeningPassage(
    passage: string,
    language: string,
    passageId: string,
    options?: {
      multiSpeaker?: boolean;
      speakers?: Array<{ name: string; voiceName: string }>;
      naturalPauses?: boolean;
    }
  ): Promise<string> {
    const filename = `listening_${language}_${passageId}_${Date.now()}.wav`;

    if (options?.multiSpeaker && options?.speakers) {
      return this.generateMultiSpeakerAudio(
        passage,
        { speakers: options.speakers },
        filename
      );
    } else {
      const voiceName = LANGUAGE_VOICE_MAPPING[language] || 'Puck';
      let formattedPassage = passage;

      if (options?.naturalPauses) {
        // Add natural pauses for comprehension
        formattedPassage = passage.replace(/\./g, '... ').replace(/,/g, ', ');
      }

      return this.generateSingleSpeakerAudio(
        formattedPassage,
        {
          voiceName,
          language,
          pace: 'slow', // Use slow pace for listening comprehension
          tone: 'neutral'
        },
        filename
      );
    }
  }

  /**
   * Generate dual-speed audio for dictation exercises
   * Returns an object with both normal and very slow audio URLs
   */
  async generateDictationAudio(
    sentence: string,
    language: string,
    questionId: string,
    questionNumber: number
  ): Promise<{ normalUrl: string; verySlowUrl: string }> {
    const voiceName = LANGUAGE_VOICE_MAPPING[language] || 'Puck';
    const baseFilename = `dictation_${language}_q${questionNumber}_${questionId}`;

    console.log(`🎵 Generating dual-speed dictation audio for: "${sentence}"`);

    // Generate normal slow speed audio (0.6 rate)
    const normalFilename = `${baseFilename}_normal.wav`;
    const normalUrl = await this.generateSingleSpeakerAudio(
      sentence,
      {
        voiceName,
        language,
        pace: 'slow', // 0.6 speed
        tone: 'neutral'
      },
      normalFilename
    );

    // Generate very slow speed audio (0.4 rate - word by word)
    const verySlowFilename = `${baseFilename}_very_slow.wav`;
    const verySlowUrl = await this.generateSingleSpeakerAudio(
      sentence,
      {
        voiceName,
        language,
        pace: 'very_slow', // 0.4 speed
        tone: 'neutral'
      },
      verySlowFilename
    );

    console.log(`✅ Dual-speed dictation audio generated:`);
    console.log(`   Normal: ${normalUrl}`);
    console.log(`   Very Slow: ${verySlowUrl}`);

    return {
      normalUrl,
      verySlowUrl
    };
  }

  /**
   * Create a silence buffer for the given duration in seconds
   */
  private createSilenceBuffer(durationSeconds: number): Buffer {
    const sampleRate = 24000;
    const numChannels = 1;
    const bitsPerSample = 16;
    const samplesPerSecond = sampleRate * numChannels;
    const totalSamples = Math.floor(samplesPerSecond * durationSeconds);
    const bufferSize = totalSamples * (bitsPerSample / 8);
    
    // Create buffer filled with zeros (silence)
    return Buffer.alloc(bufferSize, 0);
  }

  /**
   * Create a proper WAV file from PCM audio data
   * Gemini TTS returns 16-bit PCM at 24kHz sample rate, mono channel
   */
  private createWavFile(pcmBuffer: Buffer): Buffer {
    const sampleRate = 24000; // Gemini TTS sample rate
    const numChannels = 1; // Mono
    const bitsPerSample = 16; // 16-bit PCM
    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const dataSize = pcmBuffer.length;
    const fileSize = 36 + dataSize;

    console.log(`🎵 Creating WAV file: ${sampleRate}Hz, ${bitsPerSample}-bit, ${numChannels} channel(s), ${dataSize} bytes PCM data`);

    const wavHeader = Buffer.alloc(44);
    let offset = 0;

    // RIFF header
    wavHeader.write('RIFF', offset); offset += 4;
    wavHeader.writeUInt32LE(fileSize, offset); offset += 4;
    wavHeader.write('WAVE', offset); offset += 4;

    // fmt chunk
    wavHeader.write('fmt ', offset); offset += 4;
    wavHeader.writeUInt32LE(16, offset); offset += 4; // chunk size
    wavHeader.writeUInt16LE(1, offset); offset += 2; // audio format (PCM)
    wavHeader.writeUInt16LE(numChannels, offset); offset += 2;
    wavHeader.writeUInt32LE(sampleRate, offset); offset += 4;
    wavHeader.writeUInt32LE(byteRate, offset); offset += 4;
    wavHeader.writeUInt16LE(blockAlign, offset); offset += 2;
    wavHeader.writeUInt16LE(bitsPerSample, offset); offset += 2;

    // data chunk
    wavHeader.write('data', offset); offset += 4;
    wavHeader.writeUInt32LE(dataSize, offset);

    const wavFile = Buffer.concat([wavHeader, pcmBuffer]);
    console.log(`✅ WAV file created: ${wavFile.length} bytes total (${wavHeader.length} header + ${pcmBuffer.length} data)`);

    return wavFile;
  }

  /**
   * Test the TTS service
   */
  async testTTS(): Promise<boolean> {
    try {
      const testText = "This is a test of the Gemini TTS service.";
      const audioUrl = await this.generateSingleSpeakerAudio(
        testText,
        { voiceName: 'Puck' },
        `test_${Date.now()}.wav`
      );
      
      console.log(`✅ TTS test successful: ${audioUrl}`);
      return true;
    } catch (error) {
      console.error(`❌ TTS test failed:`, error);
      return false;
    }
  }

  /**
   * Helper method to generate single-speaker audio content only (returns base64 data)
   */
  private async generateSingleSpeakerContentOnly(text: string, config: GeminiTTSConfig): Promise<string> {
    // Enforce rate limiting before making API request
    await this.enforceRateLimit();

    // Create VERY slow speech for language learners by wrapping in SSML
    let processedText = text;

    // Add SSML for very slow speech rate if pace is slow or very_slow
    if (config.pace === 'slow' || config.pace === 'very_slow') {
      const speechRate = config.pace === 'very_slow' ? '0.5' : '0.7'; // Much slower rates
      processedText = `<speak><prosody rate="${speechRate}">${text}</prosody></speak>`;
      console.log(`🐌 Using VERY slow speech rate: ${speechRate} for language learners`);
    }

    const requestConfig = {
      contents: [{
        parts: [{ text: processedText }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: config.voiceName
            }
          }
        }
      }
    };

    const result = await this.model.generateContent(requestConfig);

    // Improved response validation and detailed error logging
    const candidate = result?.response?.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;

    if (!audioData) {
      const errorMessage = 'Invalid response structure from Gemini TTS for single speaker content helper.';
      console.error('❌', errorMessage);
      console.error('Response structure (single speaker helper):', JSON.stringify({
        hasResponse: !!result?.response,
        hasCandidates: !!result?.response?.candidates,
        candidatesLength: result?.response?.candidates?.length,
        hasContent: !!candidate?.content,
        hasParts: !!candidate?.content?.parts,
        partsLength: candidate?.content?.parts?.length,
        hasInlineData: !!part?.inlineData,
        hasData: !!audioData,
        finishReason: candidate?.finishReason // Log finish reason
      }, null, 2));
      throw new Error(errorMessage);
    }

    return audioData;
  }

  /**
   * Helper method to generate multi-speaker audio content only (returns base64 data)
   */
  private async generateMultiSpeakerContentOnly(text: string, config: MultiSpeakerConfig): Promise<string> {
    console.log(`🎭 Generating multi-speaker audio with ${config.speakers.length} speakers`);

    // Enforce rate limiting before making API request
    await this.enforceRateLimit();

    // Limit to 2 speakers maximum (Gemini Flash TTS limitation)
    const limitedSpeakers = config.speakers.slice(0, 2);
    if (config.speakers.length > 2) {
      console.log(`⚠️ Limiting from ${config.speakers.length} to 2 speakers for Gemini Flash TTS compatibility`);
    }

    // Add SSML for very slow speech rate for language learners
    let processedText = text;

    // Wrap the entire content in slow speech SSML
    processedText = `<speak><prosody rate="0.6">${text}</prosody></speak>`;
    console.log(`🐌 Using VERY slow speech rate: 0.6 for multi-speaker language learning content`);

    const requestConfig = {
      contents: [{
        parts: [{ text: processedText }]
      }],
      generationConfig: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: limitedSpeakers.map(speaker => ({
              speaker: speaker.name,
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: speaker.voiceName
                }
              }
            }))
          }
        }
      }
    };

    const result = await this.model.generateContent(requestConfig);

    // Improved response validation and detailed error logging
    const candidate = result?.response?.candidates?.[0];
    const part = candidate?.content?.parts?.[0];
    const audioData = part?.inlineData?.data;

    if (!audioData) {
      const errorMessage = 'Invalid response structure from Gemini TTS for multi-speaker content helper.';
      console.error('❌', errorMessage);
      console.error('Response structure (multi-speaker helper):', JSON.stringify({
        hasResponse: !!result?.response,
        hasCandidates: !!result?.response?.candidates,
        candidatesLength: result?.response?.candidates?.length,
        hasContent: !!candidate?.content,
        hasParts: !!candidate?.content?.parts,
        partsLength: candidate?.content?.parts?.length,
        hasInlineData: !!part?.inlineData,
        hasData: !!audioData,
        finishReason: candidate?.finishReason // Log finish reason
      }, null, 2));
      throw new Error(errorMessage);
    }

    return audioData;
  }
}

export default GeminiTTSService;