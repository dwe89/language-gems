import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const language = searchParams.get('language');
    const topicId = searchParams.get('topicId');

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

    const targetUserId = userId || user.id;

    if (topicId) {
      // Get detailed progress for a specific topic
      const { data: topicProgress, error: topicError } = await supabase
        .from('grammar_lesson_progress')
        .select(`
          *,
          grammar_topics!inner(
            id,
            topic_name,
            language,
            category,
            title,
            description
          )
        `)
        .eq('user_id', targetUserId)
        .eq('topic_id', topicId)
        .single();

      if (topicError && topicError.code !== 'PGRST116') {
        console.error('Error fetching topic progress:', topicError);
        return NextResponse.json(
          { error: 'Failed to fetch topic progress' },
          { status: 500 }
        );
      }

      // Get content-level progress for this topic
      const { data: contentProgress, error: contentError } = await supabase
        .from('user_grammar_progress')
        .select(`
          *,
          grammar_content!inner(
            id,
            title,
            content_type,
            difficulty_level,
            estimated_duration
          )
        `)
        .eq('user_id', targetUserId)
        .eq('grammar_content.topic_id', topicId);

      if (contentError) {
        console.error('Error fetching content progress:', contentError);
        return NextResponse.json(
          { error: 'Failed to fetch content progress' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          topicProgress: topicProgress || null,
          contentProgress: contentProgress || []
        }
      });
    }

    // Get overall grammar progress summary
    const { data: summary, error: summaryError } = await supabase
      .rpc('get_user_grammar_summary', {
        p_user_id: targetUserId,
        p_language: language
      });

    if (summaryError) {
      console.error('Error fetching grammar summary:', summaryError);
      return NextResponse.json(
        { error: 'Failed to fetch grammar summary' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: summary || []
    });

  } catch (error) {
    console.error('Unexpected error in grammar progress API:', error);
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
      content_id,
      status,
      score,
      max_score,
      accuracy,
      time_spent_seconds,
      progress_data
    } = body;

    // Validate required fields
    if (!content_id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upsert progress record
    const { data: progress, error } = await supabase
      .from('user_grammar_progress')
      .upsert({
        user_id: user.id,
        content_id,
        status,
        score: score || 0,
        max_score: max_score || 100,
        accuracy: accuracy || 0,
        time_spent_seconds: time_spent_seconds || 0,
        progress_data: progress_data || {},
        last_accessed: new Date().toISOString(),
        completed_at: status === 'completed' || status === 'mastered' 
          ? new Date().toISOString() 
          : null,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,content_id'
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating grammar progress:', error);
      return NextResponse.json(
        { error: 'Failed to update progress' },
        { status: 500 }
      );
    }

    // Update topic-level progress if content was completed
    if (status === 'completed' || status === 'mastered') {
      // Get topic ID from content
      const { data: content, error: contentError } = await supabase
        .from('grammar_content')
        .select('topic_id')
        .eq('id', content_id)
        .single();

      if (!contentError && content) {
        // Update or create topic progress
        await supabase
          .from('grammar_lesson_progress')
          .upsert({
            user_id: user.id,
            topic_id: content.topic_id,
            last_accessed: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id,topic_id'
          });
      }
    }

    return NextResponse.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Unexpected error in grammar progress POST:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
