import { NextRequest, NextResponse } from 'next/server';
import { GeminiTTSService, type GeminiTTSConfig, GEMINI_VOICES } from '@/services/geminiTTS';
import { TTSCacheService } from '@/services/TTSCacheService';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// Type for Gemini voice names
type GeminiVoiceName = typeof GEMINI_VOICES[number];

// Language to voice mapping for examiner
const EXAMINER_VOICES: Record<string, GeminiVoiceName> = {
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
  voice?: string;
  skipCache?: boolean;
}

/**
 * POST /api/speaking/tts
 * Generate TTS audio for examiner questions using Gemini
 * 
 * COST OPTIMIZATION: Uses check-before-create caching to avoid
 * regenerating audio for text that has already been generated
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

    const voiceName = body.voice || EXAMINER_VOICES[body.language];

    // 🔍 COST OPTIMIZATION: Check cache first before generating
    if (!body.skipCache) {
      try {
        const cacheService = new TTSCacheService();
        const cacheResult = await cacheService.checkCache({
          text: body.text,
          language: body.language,
          voice: voiceName,
          provider: 'gemini',
          speakingRate: 0.95
        });

        if (cacheResult) {
          console.log(`[TTS] ✅ Cache HIT - serving existing audio for: "${body.text.substring(0, 30)}..."`);

          // Fetch the cached audio and return as base64
          const response = await fetch(cacheResult.url);
          if (response.ok) {
            const audioBuffer = await response.arrayBuffer();
            const base64Audio = Buffer.from(audioBuffer).toString('base64');

            return NextResponse.json({
              success: true,
              audio: base64Audio,
              mimeType: 'audio/mp3',
              text: body.text,
              language: body.language,
              cached: true,
              cacheKey: cacheResult.cacheKey
            });
          }
        }
      } catch (cacheError) {
        console.warn('[TTS] Cache check failed, proceeding with generation:', cacheError);
      }
    }

    console.log(`[TTS] Generating audio for: "${body.text.substring(0, 50)}..." in ${body.language}`);

    // Initialize TTS service (use Flash for speed, Pro for quality)
    const ttsService = new GeminiTTSService(false); // false = use Flash (faster)

    // Configure TTS - use correct property names for GeminiTTSConfig
    const config: GeminiTTSConfig = {
      voiceName: voiceName,
      language: body.language,
      pace: 'slow', // Slightly slower for clarity
    };

    // Generate audio
    const audioBuffer = await ttsService.generateSingleSpeakerAudio(
      body.text,
      config,
      `tts_${body.language}_${Date.now()}.wav`
    );

    if (!audioBuffer || audioBuffer.length === 0) {
      console.error('[TTS] No audio generated');
      return NextResponse.json(
        { success: false, error: 'Failed to generate audio' },
        { status: 500 }
      );
    }

    console.log(`[TTS] Generated ${audioBuffer.length} bytes of audio`);

    // 💾 COST OPTIMIZATION: Store in cache for future requests
    let cacheKey: string | undefined;
    try {
      const cacheService = new TTSCacheService();
      const storeResult = await cacheService.storeInCache(
        {
          text: body.text,
          language: body.language,
          voice: voiceName,
          provider: 'gemini',
          speakingRate: 0.95
        },
        Buffer.from(audioBuffer),
        'mp3',
        'audio/mpeg'
      );

      if (storeResult) {
        cacheKey = storeResult.cacheKey;
        console.log(`[TTS] ✅ Cached audio for future requests: ${cacheKey}`);
      }
    } catch (cacheError) {
      console.warn('[TTS] Failed to cache audio:', cacheError);
    }

    // Return audio as base64 for easy client-side playback
    const base64Audio = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({
      success: true,
      audio: base64Audio,
      mimeType: 'audio/mp3',
      text: body.text,
      language: body.language,
      cached: false,
      cacheKey
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
