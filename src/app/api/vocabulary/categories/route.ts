import { NextRequest, NextResponse } from 'next/server';
import { createClient } from 'gems/lib/supabase-server';
import { CentralizedVocabularyService } from 'gems/services/centralizedVocabularyService';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'es';
    
    const categories = await vocabularyService.getCategoriesForLanguage(language);
    
    return NextResponse.json({ categories, language });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}
