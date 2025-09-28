import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');

    if (!language) {
      return NextResponse.json(
        { success: false, error: 'Language parameter is required' },
        { status: 400 }
      );
    }

    // Map URL language to database language code
    const languageMap: { [key: string]: string } = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };

    const dbLanguage = languageMap[language.toLowerCase()];
    if (!dbLanguage) {
      return NextResponse.json(
        { success: false, error: 'Unsupported language' },
        { status: 400 }
      );
    }

    // Get topics that have BOTH practice AND quiz content (for challenge mode)
    const { data: allTopics, error } = await supabase
      .from('grammar_topics')
      .select(`
        id,
        slug,
        grammar_content(content_type)
      `)
      .eq('language', dbLanguage);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch practice status' },
        { status: 500 }
      );
    }

    // Filter topics that have BOTH practice AND quiz content
    const practiceReadySlugs = allTopics?.filter(topic => {
      const contentTypes = topic.grammar_content?.map((content: any) => content.content_type) || [];
      return contentTypes.includes('practice') && contentTypes.includes('quiz');
    }).map(topic => topic.slug) || [];

    return NextResponse.json({
      success: true,
      data: practiceReadySlugs,
      count: practiceReadySlugs.length
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
