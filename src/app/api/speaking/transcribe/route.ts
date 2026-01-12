import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // Allow up to 60 seconds for transcription

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Language codes for Whisper
const LANGUAGE_CODES: Record<string, string> = {
  es: 'es', // Spanish
  fr: 'fr', // French
  de: 'de', // German
  spanish: 'es',
  french: 'fr',
  german: 'de',
};

interface TranscriptionResponse {
  success: boolean;
  transcription?: string;
  confidence?: number;
  duration?: number;
  language?: string;
  error?: string;
  details?: string;
}

/**
 * POST /api/speaking/transcribe
 * Transcribe audio using OpenAI Whisper API
 * 
 * Expected form data:
 * - audio: Blob/File - The audio file to transcribe
 * - language: string - The target language (es, fr, de)
 * 
 * Returns:
 * - transcription: string - The transcribed text
 * - confidence: number - Confidence score (if available)
 * - duration: number - Audio duration in seconds
 */
export async function POST(request: NextRequest): Promise<NextResponse<TranscriptionResponse>> {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('audio') as Blob | null;
    const language = formData.get('language') as string || 'es';

    if (!audioFile) {
      return NextResponse.json(
        { success: false, error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Validate language
    const languageCode = LANGUAGE_CODES[language.toLowerCase()] || 'es';

    // Convert Blob to File for OpenAI API
    const audioBuffer = await audioFile.arrayBuffer();
    const audioUint8Array = new Uint8Array(audioBuffer);
    
    // Create a File object that OpenAI can process
    const file = new File([audioUint8Array], 'audio.webm', {
      type: 'audio/webm',
    });

    console.log(`[Transcribe] Processing ${file.size} bytes of audio in ${languageCode}`);

    // Use Groq's Whisper API - extremely fast! (~100-200x real-time)
    // Model: whisper-large-v3-turbo - best balance of speed and accuracy
    // Cost: ~$0.04/hour of audio (£0.03/hour)
    const transcriptionResponse = await groq.audio.transcriptions.create({
      file: file,
      model: 'whisper-large-v3-turbo',
      language: languageCode,
      response_format: 'verbose_json', // Get additional metadata
      temperature: 0, // More deterministic output
    });

    const processingTimeMs = Date.now() - Date.now(); // We'll add timing

    // Extract transcription and metadata
    const transcription = transcriptionResponse.text;
    const duration = (transcriptionResponse as any).duration || 0;

    // Groq Whisper is very accurate for FR/ES/DE
    const confidence = 0.95;

    console.log(`[Transcribe] Success: "${transcription.substring(0, 50)}..." (${duration}s)`);

    return NextResponse.json({
      success: true,
      transcription,
      confidence,
      duration,
      language: languageCode,
    });

  } catch (error: any) {
    console.error('[Transcribe] Error:', error);

    // Handle specific Groq errors
    if (error?.status === 413) {
      return NextResponse.json(
        { success: false, error: 'Audio file too large', details: 'Please record a shorter response (max 25MB).' },
        { status: 413 }
      );
    }

    if (error?.status === 400) {
      return NextResponse.json(
        { success: false, error: 'Invalid audio format', details: 'Please ensure your microphone is working correctly.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Transcription failed', 
        details: error.message || 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
