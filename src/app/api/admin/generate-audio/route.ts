import { NextRequest, NextResponse } from 'next/server';
import AWS from 'aws-sdk';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with service key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface AudioGenerationRequest {
  word: string;
  language: string;
  vocabularyId: string;
}

// Voice mapping for different languages with fallback options
const VOICE_MAPPING: Record<string, { neural: string; standard: string }> = {
  fr: { neural: 'Lea', standard: 'Celine' },        // French voices
  es: { neural: 'Lucia', standard: 'Conchita' },    // Spanish voices  
  de: { neural: 'Vicki', standard: 'Marlene' },     // German voices (Vicki supports neural, Marlene is standard)
  it: { neural: 'Bianca', standard: 'Carla' },      // Italian voices
  pt: { neural: 'Ines', standard: 'Cristiano' }     // Portuguese voices
};

export async function POST(request: NextRequest) {
  try {
    const { vocabularyId, word, language, category, base_word } = await request.json();
    
    // Use base_word for audio generation if available, otherwise fall back to word
    const textToSpeak = base_word || word;
    
    if (!textToSpeak || !language) {
      return NextResponse.json(
        { error: 'Text and language are required' },
        { status: 400 }
      );
    }

    // Get voice for the language
    const voiceConfig = VOICE_MAPPING[language.toLowerCase()];
    if (!voiceConfig) {
      return NextResponse.json(
        { error: `Unsupported language: ${language}` },
        { status: 400 }
      );
    }

    // Try neural voice first, fallback to standard if neural fails
    let audioBuffer;
    try {
      audioBuffer = await generateAudioWithPolly(textToSpeak, voiceConfig.neural, 'neural');
    } catch (error: any) {
      console.warn(`Neural voice failed for ${language}, falling back to standard:`, error.message);
      audioBuffer = await generateAudioWithPolly(textToSpeak, voiceConfig.standard, 'standard');
    }
    
    // Upload to Supabase Storage
    const fileName = `${language}_${textToSpeak.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${Date.now()}.mp3`;
    const filePath = `audio/vocabulary/${fileName}`;

    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('audio')
      .upload(filePath, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: false
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      throw new Error(`Failed to upload audio file: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = supabaseAdmin.storage
      .from('audio')
      .getPublicUrl(filePath);

    const audioUrl = publicUrlData.publicUrl;

    // Update database with the audio URL if vocabularyId is provided
    if (vocabularyId) {
      const { error: dbError } = await supabaseAdmin
        .from('centralized_vocabulary')
        .update({ audio_url: audioUrl })
        .eq('id', vocabularyId);

      if (dbError) {
        console.error('Database update error:', dbError);
        // Don't fail the whole request if DB update fails, but log it
      } else {
        console.log(`Successfully updated audio URL for vocabulary ID: ${vocabularyId}`);
      }
    }

    return NextResponse.json({
      success: true,
      audioUrl,
      filePath,
      message: 'Audio generated successfully'
    });

  } catch (error: any) {
    console.error('Audio generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate audio' },
      { status: 500 }
    );
  }
}

async function generateAudioWithPolly(text: string, voiceId: string, engine: 'neural' | 'standard' = 'neural'): Promise<Buffer> {
  try {
    // Check if AWS credentials are available
    if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
      console.warn('AWS credentials not found, using fallback audio generation');
      throw new Error('AWS Polly not configured');
    }

    // Configure AWS
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION || 'us-east-1'
    });

    const polly = new AWS.Polly();

    const params = {
      Text: text,
      OutputFormat: 'mp3' as const,
      VoiceId: voiceId,
      Engine: engine
    };

    const result = await polly.synthesizeSpeech(params).promise();
    
    if (!result.AudioStream) {
      throw new Error('No audio stream received from Polly');
    }

    return Buffer.from(result.AudioStream as Uint8Array);

  } catch (error: any) {
    console.error('Polly error:', error);
    
    // If neural engine fails, don't retry here - let the calling function handle fallback
    if (error.code === 'ValidationException' && error.message.includes('neural')) {
      throw new Error(`Voice ${voiceId} does not support neural engine`);
    }
    
    throw error;
  }
}

export { generateAudioWithPolly };