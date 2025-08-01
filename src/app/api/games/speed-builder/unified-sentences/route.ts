import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type UnifiedSentenceRequest = {
  language: string;
  curriculumLevel: 'KS2' | 'KS3' | 'KS4' | 'KS5';
  categoryId: string;
  subcategoryId?: string;
  count?: number;
  customMode?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Allow public access for public sentences (demo mode)
    // Only require authentication for private content or user-specific features
    const allowPublicAccess = true; // Since we're only querying public sentences (is_public = true)

    const body: UnifiedSentenceRequest = await request.json();
    const { language, curriculumLevel, categoryId, subcategoryId, count = 15, customMode } = body;

    console.log('Unified sentence request:', body);

    // Handle custom mode
    if (customMode) {
      return NextResponse.json({ 
        sentences: [],
        message: 'Custom mode - sentences should be provided by the game'
      });
    }

    // Build query for sentences table
    let query = supabase
      .from('sentences')
      .select('*')
      .eq('source_language', language)
      .eq('curriculum_level', curriculumLevel)
      .eq('category', categoryId)
      .eq('is_active', true)
      .eq('is_public', true);

    // Add subcategory filter if provided
    if (subcategoryId) {
      query = query.eq('subcategory', subcategoryId);
    }

    // Limit results
    query = query.limit(count);

    const { data: sentences, error } = await query;

    if (error) {
      console.error('Error fetching sentences:', error);
      return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 });
    }

    if (!sentences || sentences.length === 0) {
      console.log('No sentences found for criteria:', { language, curriculumLevel, categoryId, subcategoryId });
      return NextResponse.json({ 
        sentences: [],
        message: 'No sentences found for the selected criteria'
      });
    }

    // Transform sentences to the format expected by Speed Builder
    const transformedSentences = sentences
      .filter(sentence => sentence.source_sentence && sentence.source_sentence.trim()) // Filter out sentences with no source text
      .map((sentence, index) => ({
        id: `unified-${sentence.id}`,
        text: sentence.source_sentence, // Use source_sentence as the text to practice
        originalText: sentence.source_sentence,
        translatedText: sentence.english_translation,
      language: language,
      difficulty: sentence.difficulty_level || 'medium',
      curriculum: {
        tier: curriculumLevel === 'KS4' ? 'Foundation' : 'Higher', // Map KS3/KS5 to Higher, KS4 to Foundation
        theme: sentence.category,
        topic: sentence.subcategory,
        grammarFocus: sentence.grammar_focus || 'general'
      },
      explanation: sentence.explanation || `Practice sentence from ${sentence.subcategory}`,
      vocabularyWords: [],
      isFromDatabase: true
    }));

    console.log(`Returning ${transformedSentences.length} sentences from database`);
    console.log('Sample sentence data:', sentences[0]); // Debug: check what we're getting from DB
    console.log('Sample transformed sentence:', transformedSentences[0]); // Debug: check transformation

    return NextResponse.json({ sentences: transformedSentences });

  } catch (error) {
    console.error('Error in unified sentences API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}