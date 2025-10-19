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
    const { language, category, slug } = body;

    if (!language || !category || !slug) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use service role client to bypass RLS
    const serviceSupabase = createServiceRoleClient();

    // Delete topic
    const { error } = await (serviceSupabase as any)
      .from('grammar_topics')
      .delete()
      .eq('language', language)
      .eq('category', category)
      .eq('slug', slug);

    if (error) {
      console.error('Error deleting topic:', error);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error('Error in delete topic API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

