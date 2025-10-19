import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { createServiceRoleClient } from '@/utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== 'danieletienne89@gmail.com') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      language,
      category,
      topic_slug,
      title,
      description,
      difficulty,
      estimated_time,
      sections,
      related_topics,
      youtube_video_id,
    } = body;

    if (!language || !category || !topic_slug || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createServiceRoleClient();

    // Check if page already exists
    const { data: existing } = await (serviceSupabase as any)
      .from('grammar_pages')
      .select('id')
      .eq('language', language)
      .eq('category', category)
      .eq('topic_slug', topic_slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Page already exists' },
        { status: 409 }
      );
    }

    // Create new page
    const { data, error } = await (serviceSupabase as any)
      .from('grammar_pages')
      .insert({
        language,
        category,
        topic_slug,
        title,
        description: description || `Learn about ${title}`,
        difficulty: difficulty || 'beginner',
        estimated_time: estimated_time || 10,
        sections: sections || [],
        related_topics: related_topics || [],
        youtube_video_id: youtube_video_id || null,
        back_url: `/grammar/${language}`,
        practice_url: `/grammar/${language}/${category}/${topic_slug}/practice`,
        quiz_url: `/grammar/${language}/${category}/${topic_slug}/test`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error creating page:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error) {
    console.error('Error in create page API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

