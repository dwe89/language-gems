import { NextRequest, NextResponse } from 'next/server';
import { GeminiTTSService, type GeminiTTSConfig, type GeminiVoice } from '@/services/geminiTTS';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Language to voice mapping for examiner
const EXAMINER_VOICES: Record<string, GeminiVoice> = {
  es: 'Aoede',    // Spanish - female adult voice
  fr: 'Charon',   // French - male adult voice
  de: 'Kore',     // German - female adult voice
};

// Language codes for Gemini TTS
const LANGUAGE_CODES: Record<string, string> = {
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
};

interface TTSRequest {
  text: string;
  language: 'es' | 'fr' | 'de';
  voice?: GeminiVoice;
}

/**
 * POST /api/speaking/tts
 * Generate TTS audio for examiner questions using Gemini
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body: TTSRequest = await request.json();

    // Validate
    if (!body.text) {
      return NextResponse.json(
        { success: false, error: 'No text provided' },
        { status: 400 }
      );
    }

    if (!body.language || !['es', 'fr', 'de'].includes(body.language)) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing language' },
        { status: 400 }
      );
    }

    console.log(`[TTS] Generating audio for: "${body.text.substring(0, 50)}..." in ${body.language}`);

    // Initialize TTS service (use Flash for speed, Pro for quality)
    const ttsService = new GeminiTTSService(false); // false = use Flash (faster)

    // Configure TTS
    const config: GeminiTTSConfig = {
      voice: body.voice || EXAMINER_VOICES[body.language],
      languageCode: LANGUAGE_CODES[body.language],
      speakingRate: 0.95, // Slightly slower for clarity
      pitch: 0,
    };

    // Generate audio
    const audioBuffer = await ttsService.generateSingleSpeakerAudio(
      body.text,
      config,
      body.language
    );

    if (!audioBuffer || audioBuffer.length === 0) {
      console.error('[TTS] No audio generated');
      return NextResponse.json(
        { success: false, error: 'Failed to generate audio' },
        { status: 500 }
      );
    }

    console.log(`[TTS] Generated ${audioBuffer.length} bytes of audio`);

    // Return audio as base64 for easy client-side playback
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      mimeType: 'audio/mp3',
      text: body.text,
      language: body.language,
    });

  } catch (error: any) {
    console.error('[TTS] Error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'TTS generation failed',
        details: error.message || 'Unknown error',
      },
      { status: 500 }
    );
  }
}
