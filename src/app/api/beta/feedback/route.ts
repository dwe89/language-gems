import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { 
      feedback, 
      source = 'general', 
      userType = 'teacher',
      rating,
      category,
      email 
    } = await request.json();

    if (!feedback || feedback.trim().length === 0) {
      return NextResponse.json(
        { error: 'Feedback is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get user info if authenticated
    const { data: { user } } = await supabase.auth.getUser();

    // Insert feedback record
    const { error: insertError } = await supabase
      .from('beta_feedback')
      .insert({
        feedback: feedback.trim(),
        source,
        user_type: userType,
        rating,
        category,
        email,
        user_id: user?.id || null,
        created_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting feedback:', insertError);
      return NextResponse.json(
        { error: 'Failed to save feedback' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback submitted successfully',
    });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (userProfile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Get feedback stats and recent feedback
    const { data: feedback, error } = await supabase
      .from('beta_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      console.error('Error fetching feedback:', error);
      return NextResponse.json(
        { error: 'Failed to fetch feedback' },
        { status: 500 }
      );
    }

    // Process stats
    const totalFeedback = feedback?.length || 0;
    const recentFeedback = feedback?.filter(f => {
      const feedbackDate = new Date(f.created_at);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return feedbackDate > weekAgo;
    }).length || 0;

    const categoryBreakdown = feedback?.reduce((acc: Record<string, number>, f) => {
      const category = f.category || 'general';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {}) || {};

    const sourceBreakdown = feedback?.reduce((acc: Record<string, number>, f) => {
      acc[f.source] = (acc[f.source] || 0) + 1;
      return acc;
    }, {}) || {};

    const averageRating = feedback?.filter(f => f.rating).reduce((sum, f) => sum + f.rating, 0) / 
                         feedback?.filter(f => f.rating).length || 0;

    return NextResponse.json({
      totalFeedback,
      recentFeedback,
      categoryBreakdown,
      sourceBreakdown,
      averageRating: Math.round(averageRating * 10) / 10,
      recentItems: feedback?.slice(0, 10) || [],
    });

  } catch (error) {
    console.error('Feedback stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
