import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type VocabularySelectionType = 'theme_based' | 'topic_based' | 'custom_list' | 'difficulty_based';

interface VocabularyPreviewRequest {
  type: VocabularySelectionType;
  theme?: string;
  topic?: string;
  customListId?: string;
  difficulty?: string;
  wordCount?: number;
}

const createClient = async () => {
  const cookieStore = await cookies();
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          cookieStore.set(name, value, options);
        },
        remove(name, options) {
          cookieStore.set(name, '', { ...options, maxAge: 0 });
        },
      },
    }
  );
};

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: VocabularyPreviewRequest = await request.json();
    
    let vocabularyData = [];

    if (body.type === 'custom_list' && body.customListId) {
      // Fetch from custom vocabulary list
      const { data: customVocab, error: customError } = await supabase
        .from('vocabulary_assignment_items')
        .select(`
          vocabulary_id,
          order_index,
          vocabulary:vocabulary_id (
            id,
            spanish,
            english,
            theme,
            topic,
            difficulty
          )
        `)
        .eq('vocabulary_assignment_list_id', body.customListId)
        .order('order_index');

      if (customError) {
        console.error('Custom vocabulary fetch error:', customError);
        return NextResponse.json({ error: 'Failed to fetch custom vocabulary' }, { status: 500 });
      }

      vocabularyData = customVocab?.map(item => item.vocabulary) || [];
    } else {
      // Fetch from main vocabulary table based on criteria
      let query = supabase
        .from('vocabulary')
        .select('id, spanish, english, difficulty, theme, topic');

      // Apply filters based on selection criteria
      if (body.theme) {
        query = query.eq('theme', body.theme);
      }
      
      if (body.topic) {
        query = query.eq('topic', body.topic);
      }
      
      if (body.difficulty) {
        query = query.eq('difficulty', body.difficulty);
      }

      // Limit the number of words
      const wordCount = body.wordCount || 20;
      query = query.limit(wordCount);

      const { data: vocabWords, error: vocabError } = await query;

      if (vocabError) {
        console.error('Vocabulary fetch error:', vocabError);
        return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 });
      }

      vocabularyData = vocabWords || [];
    }

    return NextResponse.json({
      success: true,
      vocabulary: vocabularyData,
      count: vocabularyData.length,
      criteria: body
    });

  } catch (error) {
    console.error('Vocabulary preview error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 