import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'gems/lib/supabase-server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Direct query to test
    const { data, error } = await supabase
      .from('centralized_vocabulary')
      .select('*')
      .eq('language', 'es')
      .eq('category', 'animals')
      .not('audio_url', 'is', null)
      .limit(3);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      sample: data?.slice(0, 2).map(w => ({
        word: w.word,
        translation: w.translation,
        hasAudio: !!w.audio_url,
        audioUrl: w.audio_url?.substring(0, 50) + '...'
      }))
    });

  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
