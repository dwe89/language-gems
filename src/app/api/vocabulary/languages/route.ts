import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'gems/lib/supabase-server';
import { CentralizedVocabularyService } from 'gems/services/centralizedVocabularyService';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    
    const languages = await vocabularyService.getAvailableLanguages();
    
    return NextResponse.json({ languages });
  } catch (error) {
    console.error('Error fetching languages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch languages' },
      { status: 500 }
    );
  }
}
