import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Language mapping helper
const mapLanguageToCode = (language: string | null): string | null => {
  if (!language) return null;
  const languageMap: Record<string, string> = {
    'spanish': 'es',
    'french': 'fr',
    'german': 'de',
    'es': 'es',
    'fr': 'fr',
    'de': 'de'
  };
  return languageMap[language.toLowerCase()] || null;
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawLanguage = searchParams.get('language');
    const language = mapLanguageToCode(rawLanguage);
    const curriculumLevel = searchParams.get('curriculumLevel');
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');

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

    // Build query
    let query = supabase
      .from('grammar_topics')
      .select(`
        id,
        topic_name,
        slug,
        language,
        category,
        difficulty_level,
        curriculum_level,
        title,
        description,
        learning_objectives,
        order_position,
        prerequisite_topics,
        created_at
      `)
      .eq('is_active', true)
      .order('order_position', { ascending: true });

    // Apply filters
    if (language) {
      query = query.eq('language', language);
    }
    if (curriculumLevel) {
      query = query.eq('curriculum_level', curriculumLevel);
    }
    if (category) {
      query = query.eq('category', category);
    }
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }

    const { data: topics, error } = await query;

    if (error) {
      console.error('Error fetching grammar topics:', error);
      return NextResponse.json(
        { error: 'Failed to fetch grammar topics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: topics || [],
      count: topics?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error in grammar topics API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
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

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      topic_name,
      slug,
      language,
      category,
      difficulty_level,
      curriculum_level,
      title,
      description,
      learning_objectives,
      order_position,
      prerequisite_topics
    } = body;

    // Validate required fields
    if (!topic_name || !slug || !language || !category || !difficulty_level || !curriculum_level || !title) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert new topic
    const { data: topic, error } = await supabase
      .from('grammar_topics')
      .insert({
        topic_name,
        slug,
        language,
        category,
        difficulty_level,
        curriculum_level,
        title,
        description,
        learning_objectives: learning_objectives || [],
        order_position: order_position || 0,
        prerequisite_topics: prerequisite_topics || []
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating grammar topic:', error);
      return NextResponse.json(
        { error: 'Failed to create grammar topic' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: topic
    });

  } catch (error) {
    console.error('Unexpected error in grammar topics POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
