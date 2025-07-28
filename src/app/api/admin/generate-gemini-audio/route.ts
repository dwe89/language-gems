import { NextRequest, NextResponse } from 'next/server';
import { GeminiTTSService } from '../../../../services/geminiTTS';

export async function POST(request: NextRequest) {
  try {
    const { 
      text, 
      language, 
      questionId, 
      type = 'single', // 'single' or 'multi'
      voiceName,
      speakers,
      options = {}
    } = await request.json();

    if (!text || !language) {
      return NextResponse.json(
        { error: 'Text and language are required' },
        { status: 400 }
      );
    }

    // Check if Google AI API key is configured
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API key not configured' },
        { status: 500 }
      );
    }

    // Use Flash model by default for better rate limits, Pro model can be requested
    const useProModel = options.useProModel === true;
    const ttsService = new GeminiTTSService(useProModel);

    let audioUrl: string;

    if (type === 'multi' && speakers) {
      // Multi-speaker generation
      audioUrl = await ttsService.generateMultiSpeakerAudio(
        text,
        { speakers },
        `multi_${language}_${questionId || Date.now()}.wav`
      );
    } else if (type === 'exam') {
      // Exam-specific generation
      audioUrl = await ttsService.generateExamAudio(
        text,
        language,
        questionId || `exam_${Date.now()}`,
        options
      );
    } else if (type === 'listening') {
      // Listening comprehension generation
      audioUrl = await ttsService.generateListeningPassage(
        text,
        language,
        questionId || `listening_${Date.now()}`,
        options
      );
    } else {
      // Single speaker generation
      audioUrl = await ttsService.generateSingleSpeakerAudio(
        text,
        {
          voiceName: voiceName || 'Puck',
          language,
          ...options
        },
        `single_${language}_${questionId || Date.now()}.wav`
      );
    }

    return NextResponse.json({
      success: true,
      audioUrl,
      message: 'Audio generated successfully with Gemini TTS'
    });

  } catch (error: any) {
    console.error('Gemini TTS generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate audio with Gemini TTS' },
      { status: 500 }
    );
  }
}

// Test endpoint
export async function GET() {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'Google AI API key not configured' },
        { status: 500 }
      );
    }

    const ttsService = new GeminiTTSService(false); // Use Flash model for testing
    const testResult = await ttsService.testTTS();

    return NextResponse.json({
      success: testResult,
      message: testResult ? 'Gemini TTS is working correctly' : 'Gemini TTS test failed',
      service: 'Google Gemini 2.5 Pro Preview TTS'
    });

  } catch (error: any) {
    console.error('Gemini TTS test error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to test Gemini TTS' },
      { status: 500 }
    );
  }
}
