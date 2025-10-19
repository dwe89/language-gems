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
    const { language, category, slug, title, difficulty_level, curriculum_level } = body;

    if (!language || !category || !slug || !title) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createServiceRoleClient();

    // Check if topic already exists
    const { data: existing } = await (serviceSupabase as any)
      .from('grammar_topics')
      .select('id')
      .eq('language', language)
      .eq('category', category)
      .eq('slug', slug)
      .single();

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Topic already exists' },
        { status: 409 }
      );
    }

    // Create new topic
    const { data, error } = await (serviceSupabase as any)
      .from('grammar_topics')
      .insert({
        language,
        category,
        slug,
        title,
        topic_name: title,
        difficulty_level: difficulty_level || 'beginner',
        curriculum_level: curriculum_level || 'KS3',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select();

    if (error) {
      console.error('Error creating topic:', error);
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
    console.error('Error in create topic API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

