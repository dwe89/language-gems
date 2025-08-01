import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { DatabaseSentence, SentenceChallenge } from '../../../games/word-blast/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'spanish';
    const category = searchParams.get('category') || 'basics_core_language';
    const subcategory = searchParams.get('subcategory');
    const difficulty = searchParams.get('difficulty') || 'beginner';
    const curriculumLevel = searchParams.get('curriculumLevel') || 'KS3';
    const count = parseInt(searchParams.get('count') || '10');
    const assignmentId = searchParams.get('assignmentId');

    // Create Supabase client
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    let sentenceQuery = supabase
      .from('sentences')
      .select('*')
      .eq('source_language', language)
      .eq('category', category)
      .eq('difficulty_level', difficulty)
      .eq('curriculum_level', curriculumLevel)
      .eq('is_active', true)
      .eq('is_public', true)
      .order('complexity_score', { ascending: true });

    // Add subcategory filter if provided
    if (subcategory) {
      sentenceQuery = sentenceQuery.eq('subcategory', subcategory);
    }

    // Handle assignment mode
    if (assignmentId) {
      // Get assignment details to apply specific filters
      const { data: assignment } = await supabase
        .from('assignments')
        .select('*')
        .eq('id', assignmentId)
        .single();

      if (assignment?.game_config) {
        // Apply assignment-specific filters
        if (assignment.game_config.difficulty) {
          sentenceQuery = sentenceQuery.eq('difficulty_level', assignment.game_config.difficulty);
        }
        if (assignment.game_config.category) {
          sentenceQuery = sentenceQuery.eq('category', assignment.game_config.category);
        }
      }
    }

    const { data: sentences, error } = await sentenceQuery.limit(count);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch sentences' }, { status: 500 });
    }

    // Transform database sentences to game format
    const challenges: SentenceChallenge[] = (sentences || []).map((sentence: DatabaseSentence) => {
      // Split target sentence into words for the game
      const words = sentence.source_sentence
        .toLowerCase()
        .replace(/[¿¡.,!?;:]/g, '') // Remove punctuation
        .split(/\s+/)
        .filter(word => word.length > 0);

      return {
        id: sentence.id,
        english: sentence.english_translation,
        targetLanguage: sentence.source_language,
        targetSentence: sentence.source_sentence,
        words,
        category: sentence.category,
        subcategory: sentence.subcategory,
        difficulty: sentence.difficulty_level,
        curriculumLevel: sentence.curriculum_level
      };
    });

    // If no sentences found, provide fallback
    if (challenges.length === 0) {
      const fallbackChallenges = getFallbackChallenges(language, difficulty);
      return NextResponse.json({ 
        challenges: fallbackChallenges,
        metadata: {
          source: 'fallback',
          language,
          category,
          subcategory,
          difficulty,
          curriculumLevel,
          count: fallbackChallenges.length
        }
      });
    }

    return NextResponse.json({ 
      challenges,
      metadata: {
        source: 'database',
        language,
        category,
        subcategory,
        difficulty,
        curriculumLevel,
        count: challenges.length,
        assignmentId
      }
    });

  } catch (error) {
    console.error('Error fetching sentences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Fallback challenges when database is empty
function getFallbackChallenges(language: string, difficulty: string): SentenceChallenge[] {
  const fallbacks = [
    {
      id: 'fallback-1',
      english: 'I like horror films',
      targetLanguage: language,
      targetSentence: 'Me gustan las películas de terror',
      words: ['me', 'gustan', 'las', 'películas', 'de', 'terror'],
      category: 'basics_core_language',
      difficulty: difficulty as any,
      curriculumLevel: 'KS3' as any
    },
    {
      id: 'fallback-2',
      english: 'The cat is sleeping',
      targetLanguage: language,
      targetSentence: 'El gato está durmiendo',
      words: ['el', 'gato', 'está', 'durmiendo'],
      category: 'basics_core_language',
      difficulty: difficulty as any,
      curriculumLevel: 'KS3' as any
    },
    {
      id: 'fallback-3',
      english: 'We eat breakfast',
      targetLanguage: language,
      targetSentence: 'Comemos el desayuno',
      words: ['comemos', 'el', 'desayuno'],
      category: 'basics_core_language',
      difficulty: difficulty as any,
      curriculumLevel: 'KS3' as any
    }
  ];

  return fallbacks;
}
