import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { CentralizedVocabularyService } from '@/services/centralizedVocabularyService';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const vocabularyService = new CentralizedVocabularyService(supabase);

    // Test the exact query that VocabMaster should be making
    const vocabularyQuery = {
      language: 'es',
      curriculumLevel: 'KS4' as const,
      examBoard: 'AQA',
      tier: 'higher' as const,
      // hasAudio: undefined, // Don't filter by audio
      limit: 10,
      randomize: false,
      themeName: 'Popular culture',
      unitName: 'Free time activities'
    };

    console.log('🔍 Testing vocabulary query:', vocabularyQuery);

    const centralizedVocabulary = await vocabularyService.getVocabulary(vocabularyQuery);

    return NextResponse.json({
      success: true,
      query: vocabularyQuery,
      count: centralizedVocabulary.length,
      vocabulary: centralizedVocabulary.slice(0, 5), // Return first 5 for inspection
    });

  } catch (error) {
    console.error('Debug vocab API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
