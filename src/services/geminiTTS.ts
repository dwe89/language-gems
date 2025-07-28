import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Google AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

// Initialize Supabase client for storage
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface GeminiTTSConfig {
  voiceName: string;
  language?: string;
  style?: string;
  pace?: 'slow' | 'normal' | 'fast';
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

// Language-specific voice recommendations
export const LANGUAGE_VOICE_MAPPING: Record<string, string> = {
  spanish: 'Kore', // Firm, clear for Spanish
  french: 'Aoede', // Breezy, good for French
  german: 'Charon', // Informative, good for German
  english: 'Puck', // Upbeat, natural for English
};

export class GeminiTTSService {
  private model: any;
  private bucketName: string = 'audio';

  constructor(useProModel: boolean = false) {
    // Use Gemini 2.5 Flash Preview TTS model (more generous rate limits) or Pro model
    const modelName = useProModel ? 'gemini-2.5-pro-preview-tts' : 'gemini-2.5-flash-preview-tts';
    this.model = genAI.getGenerativeModel({
      model: modelName
    });
    console.log(`🤖 Initialized Gemini TTS with model: ${modelName}`);
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
      // Build the prompt with style instructions
      let prompt = text;
      if (config.style || config.tone || config.pace) {
        const styleInstructions = [];
        if (config.tone) styleInstructions.push(`in a ${config.tone} tone`);
        if (config.pace) styleInstructions.push(`at a ${config.pace} pace`);
        if (config.style) styleInstructions.push(config.style);
        
        prompt = `Say ${styleInstructions.join(', ')}: ${text}`;
      }

      console.log(`🎵 Generating audio with Gemini TTS for: "${text.substring(0, 50)}..."`);

      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: prompt }] }],
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
      });

      // Validate response structure
      if (!result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        console.error('❌ Invalid response structure:', JSON.stringify(result.response, null, 2));
        throw new Error('Invalid response structure from Gemini TTS');
      }

      const audioData = result.response.candidates[0].content.parts[0].inlineData.data;

      if (!audioData) {
        throw new Error('No audio data received from Gemini TTS');
      }

      console.log(`📊 Audio data size: ${audioData.length} characters (base64)`);

      const audioBuffer = Buffer.from(audioData, 'base64');

      console.log(`📊 Audio buffer size: ${audioBuffer.length} bytes`);

      // Validate audio buffer size
      if (audioBuffer.length < 1000) {
        throw new Error('Audio buffer too small - generation may have failed');
      }

      // Create WAV file with proper headers
      const wavBuffer = this.createWavFile(audioBuffer);

      // Upload to Supabase Storage
      const storagePath = `exam-audio/${filename}`;
      const { data, error } = await supabaseAdmin.storage
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
      const { data: urlData } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);

      console.log(`✅ Audio generated and uploaded: ${urlData.publicUrl}`);
      return urlData.publicUrl;

    } catch (error: any) {
      console.error(`❌ Error generating audio with Gemini TTS:`, error);

      // Handle specific quota errors
      if (error.status === 429) {
        throw new Error(`Rate limit exceeded for Gemini TTS. Please wait before trying again. ${error.message}`);
      }

      // Handle authentication errors
      if (error.status === 401 || error.status === 403) {
        throw new Error(`Authentication failed. Please check your Google AI API key. ${error.message}`);
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

      const result = await this.model.generateContent({
        contents: [{ parts: [{ text: transcript }] }],
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
      });

      // Validate response structure
      if (!result.response?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
        console.error('❌ Invalid multi-speaker response structure:', JSON.stringify(result.response, null, 2));
        throw new Error('Invalid response structure from Gemini TTS');
      }

      const audioData = result.response.candidates[0].content.parts[0].inlineData.data;

      if (!audioData) {
        throw new Error('No audio data received from Gemini TTS');
      }

      console.log(`📊 Multi-speaker audio data size: ${audioData.length} characters (base64)`);

      const audioBuffer = Buffer.from(audioData, 'base64');

      console.log(`📊 Multi-speaker audio buffer size: ${audioBuffer.length} bytes`);

      // Validate audio buffer size
      if (audioBuffer.length < 1000) {
        throw new Error('Audio buffer too small - generation may have failed');
      }

      // Create WAV file with proper headers
      const wavBuffer = this.createWavFile(audioBuffer);

      // Upload to Supabase Storage
      const storagePath = `exam-audio/${filename}`;
      const { data, error } = await supabaseAdmin.storage
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
      const { data: urlData } = supabaseAdmin.storage
        .from(this.bucketName)
        .getPublicUrl(storagePath);

      console.log(`✅ Multi-speaker audio generated and uploaded: ${urlData.publicUrl}`);
      return urlData.publicUrl;

    } catch (error) {
      console.error(`❌ Error generating multi-speaker audio with Gemini TTS:`, error);
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
    }
  ): Promise<string> {
    const voiceName = LANGUAGE_VOICE_MAPPING[language] || 'Puck';
    const filename = `exam_${language}_${questionId}_${Date.now()}.wav`;

    // Add exam-specific formatting
    let formattedText = questionText;
    if (options?.includeInstructions) {
      formattedText = `Listen carefully to the following. ${questionText}`;
    }

    return this.generateSingleSpeakerAudio(
      formattedText,
      {
        voiceName,
        language,
        pace: options?.speakingSpeed || 'normal',
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
          pace: 'normal',
          tone: 'neutral'
        },
        filename
      );
    }
  }

  /**
   * Create a proper WAV file from PCM audio data
   * Gemini TTS returns 16-bit PCM at 24kHz sample rate, mono channel
   */
  private createWavFile(pcmBuffer: Buffer): Buffer {
    const sampleRate = 24000; // Gemini TTS sample rate (confirmed from docs)
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
}

export default GeminiTTSService;
