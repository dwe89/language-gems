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
          cookieStore.delete(name);
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

    let query = supabase
      .from('vocabulary')
      .select('id, spanish, english, theme, topic, part_of_speech');

    // Apply filters based on selection type
    switch (body.type) {
      case 'theme_based':
        if (body.theme) {
          query = query.eq('theme', body.theme);
        }
        break;
        
      case 'topic_based':
        if (body.topic) {
          query = query.eq('topic', body.topic);
        }
        break;
        
      case 'custom_list':
        if (body.customListId) {
          // For custom lists, we'd need to join with the custom wordlists table
          // For now, return a sample from the main vocabulary
          query = query.limit(body.wordCount || 10);
        }
        break;
        
      default:
        // Default to a general selection
        break;
    }

    // Limit the results
    const limit = Math.min(body.wordCount || 10, 50);
    query = query.limit(limit);

    const { data: vocabulary, error } = await query;

    if (error) {
      console.error('Vocabulary fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch vocabulary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      vocabulary: vocabulary || [],
      count: vocabulary?.length || 0,
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