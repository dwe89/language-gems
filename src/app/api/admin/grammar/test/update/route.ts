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
    const { contentId, updates, language, category, topic, contentType } = body;

    if (!contentId || !updates) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createServiceRoleClient();

    // If contentId is 'new', create a new record
    if (contentId === 'new') {
      // First, get the topic_id from grammar_topics
      const languageCodeMap: Record<string, string> = {
        spanish: 'es',
        french: 'fr',
        german: 'de',
      };
      const languageCode = languageCodeMap[language] || language;

      const { data: topicData } = await (serviceSupabase as any)
        .from('grammar_topics')
        .select('id')
        .eq('language', languageCode)
        .eq('category', category)
        .eq('slug', topic)
        .single();

      if (!topicData) {
        return NextResponse.json(
          { success: false, error: 'Topic not found' },
          { status: 404 }
        );
      }

      // Determine content type based on the title or explicit parameter
      const type = contentType || (updates.title?.toLowerCase().includes('practice') ? 'practice' : 'quiz');

      // Create new content
      const { data, error } = await (serviceSupabase as any)
        .from('grammar_content')
        .insert({
          topic_id: topicData.id,
          content_type: type,
          ...updates,
        })
        .select();

      if (error) {
        console.error('Error creating content:', error);
        return NextResponse.json(
          { success: false, error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: data[0],
      });
    }

    // Update existing record
    const { data, error } = await (serviceSupabase as any)
      .from('grammar_content')
      .update(updates)
      .eq('id', contentId)
      .select();

    if (error) {
      console.error('Error updating test:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Test not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data[0],
    });
  } catch (error: any) {
    console.error('Error in test update API:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

