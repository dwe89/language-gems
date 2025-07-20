import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../../lib/supabase-server';
import { CentralizedVocabularyService } from '../../../../services/centralizedVocabularyService';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const vocabularyService = new CentralizedVocabularyService(supabase);
    
    const stats = await vocabularyService.getVocabularyStats();
    
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
