import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

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

    // Get all topics with practice content (for challenge/test mode)
    const { data: practiceContent, error } = await supabase
      .from('grammar_content')
      .select(`
        topic_id,
        grammar_topics!inner(slug, language)
      `)
      .eq('grammar_topics.language', dbLanguage)
      .eq('content_type', 'practice')
      .not('content_data', 'is', null);

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch practice status' },
        { status: 500 }
      );
    }

    // Extract unique slugs from topics that have practice content
    const practiceReadySlugs = practiceContent?.map((content: any) =>
      content.grammar_topics.slug
    ) || [];

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
