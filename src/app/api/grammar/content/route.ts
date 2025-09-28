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
    const topicId = searchParams.get('topicId');
    const contentType = searchParams.get('contentType');
    const difficulty = searchParams.get('difficulty');
    const ageGroup = searchParams.get('ageGroup');
    // New parameters for topic-based filtering
    const rawLanguage = searchParams.get('language');
    const language = mapLanguageToCode(rawLanguage);
    const topic = searchParams.get('topic');
    const type = searchParams.get('type'); // alias for contentType

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
      .from('grammar_content')
      .select(`
        id,
        topic_id,
        content_type,
        title,
        slug,
        content_data,
        difficulty_level,
        age_group,
        estimated_duration,
        order_position,
        is_featured,
        created_at,
        grammar_topics!inner(
          id,
          topic_name,
          language,
          category,
          curriculum_level
        )
      `)
      .eq('is_active', true)
      .order('order_position', { ascending: true });

    // Apply filters
    if (topicId) {
      query = query.eq('topic_id', topicId);
    }
    if (contentType || type) {
      query = query.eq('content_type', contentType || type);
    }
    if (difficulty) {
      query = query.eq('difficulty_level', difficulty);
    }
    if (ageGroup) {
      query = query.eq('age_group', ageGroup);
    }
    // Filter by language and topic slug
    if (language) {
      query = query.eq('grammar_topics.language', language);
    }
    if (topic) {
      query = query.eq('grammar_topics.slug', topic);
    }

    const { data: content, error } = await query;

    if (error) {
      console.error('Error fetching grammar content:', error);
      return NextResponse.json(
        { error: 'Failed to fetch grammar content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content || [],
      count: content?.length || 0
    });

  } catch (error) {
    console.error('Unexpected error in grammar content API:', error);
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
      topic_id,
      content_type,
      title,
      slug,
      content_data,
      difficulty_level,
      age_group,
      estimated_duration,
      order_position
    } = body;

    // Validate required fields
    if (!topic_id || !content_type || !title || !slug || !content_data || !difficulty_level || !age_group) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Insert new content
    const { data: content, error } = await supabase
      .from('grammar_content')
      .insert({
        topic_id,
        content_type,
        title,
        slug,
        content_data,
        difficulty_level,
        age_group,
        estimated_duration: estimated_duration || 10,
        order_position: order_position || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating grammar content:', error);
      return NextResponse.json(
        { error: 'Failed to create grammar content' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: content
    });

  } catch (error) {
    console.error('Unexpected error in grammar content POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
