import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type VocabularySelectionType = 'category_based' | 'subcategory_based' | 'theme_based' | 'topic_based' | 'custom_list' | 'difficulty_based';

interface VocabularyPreviewRequest {
  type: VocabularySelectionType;
  language?: string;
  category?: string;
  subcategory?: string;
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
      .from('centralized_vocabulary')
      .select('id, word, translation, category, subcategory, theme_name, part_of_speech');

    // Filter by language if specified
    if (body.language) {
      query = query.eq('language', body.language);
    }

    // Apply filters based on selection type
    switch (body.type) {
      case 'category_based':
        if (body.category) {
          query = query.eq('category', body.category);
        }
        break;

      case 'subcategory_based':
        if (body.category) {
          query = query.eq('category', body.category);
          if (body.subcategory) {
            query = query.eq('subcategory', body.subcategory);
          }
        }
        break;

      case 'theme_based':
        if (body.theme) {
          query = query.eq('theme_name', body.theme);
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

    // Format vocabulary to match expected frontend format
    const formattedVocabulary = vocabulary?.map(item => ({
      id: item.id,
      spanish: item.word,
      english: item.translation,
      theme: item.theme_name || item.category,
      topic: item.subcategory,
      part_of_speech: item.part_of_speech
    })) || [];

    return NextResponse.json({
      vocabulary: formattedVocabulary,
      count: formattedVocabulary.length,
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