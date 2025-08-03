import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { StudentDataService } from '../../../services/studentDataService';
import { AIInsightsService } from '../../../services/aiInsightsService';

// Initialize Supabase client with service role for full access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const teacherId = searchParams.get('teacherId');
    const action = searchParams.get('action') || 'get_insights';

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    const studentDataService = new StudentDataService();
    const aiInsightsService = new AIInsightsService(supabase);

    switch (action) {
      case 'get_insights':
        // Get real student data
        const studentData = await studentDataService.getStudentAnalyticsData(teacherId);
        const classAnalytics = await studentDataService.getClassAnalytics(teacherId);
        
        // Generate AI insights based on real data
        const insights = await aiInsightsService.generateInsightsFromData(teacherId, studentData, classAnalytics);
        
        // Get existing insights from database
        const { data: existingInsights } = await supabase
          .from('ai_insights')
          .select('*')
          .eq('teacher_id', teacherId)
          .eq('status', 'active')
          .order('generated_at', { ascending: false });

        return NextResponse.json({
          success: true,
          insights: existingInsights || [],
          newInsights: insights,
          studentData,
          classAnalytics,
          lastUpdated: new Date().toISOString()
        });

      case 'acknowledge_insight':
        const insightId = searchParams.get('insightId');
        if (!insightId) {
          return NextResponse.json({ error: 'Insight ID is required' }, { status: 400 });
        }

        const { error: ackError } = await supabase
          .from('ai_insights')
          .update({ status: 'acknowledged', updated_at: new Date().toISOString() })
          .eq('id', insightId)
          .eq('teacher_id', teacherId);

        if (ackError) throw ackError;

        return NextResponse.json({ success: true, message: 'Insight acknowledged' });

      case 'dismiss_insight':
        const dismissId = searchParams.get('insightId');
        if (!dismissId) {
          return NextResponse.json({ error: 'Insight ID is required' }, { status: 400 });
        }

        const { error: dismissError } = await supabase
          .from('ai_insights')
          .update({ status: 'dismissed', updated_at: new Date().toISOString() })
          .eq('id', dismissId)
          .eq('teacher_id', teacherId);

        if (dismissError) throw dismissError;

        return NextResponse.json({ success: true, message: 'Insight dismissed' });

      case 'generate_fresh_insights':
        // Force regeneration of insights
        const freshStudentData = await studentDataService.getStudentAnalyticsData(teacherId);
        const freshClassAnalytics = await studentDataService.getClassAnalytics(teacherId);
        
        const freshInsights = await aiInsightsService.generateInsightsFromData(teacherId, freshStudentData, freshClassAnalytics);
        
        return NextResponse.json({
          success: true,
          insights: freshInsights,
          generated: freshInsights.length,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('AI Insights API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { teacherId, action, data } = body;

    if (!teacherId) {
      return NextResponse.json({ error: 'Teacher ID is required' }, { status: 400 });
    }

    const aiInsightsService = new AIInsightsService(supabase);

    switch (action) {
      case 'record_action':
        const { insightId, actionTaken, outcome } = data;
        
        const { error: recordError } = await supabase
          .from('ai_insights')
          .update({ 
            action_taken: actionTaken,
            status: outcome === 'resolved' ? 'resolved' : 'acknowledged',
            updated_at: new Date().toISOString()
          })
          .eq('id', insightId)
          .eq('teacher_id', teacherId);

        if (recordError) throw recordError;

        return NextResponse.json({ success: true, message: 'Action recorded' });

      case 'bulk_acknowledge':
        const { insightIds } = data;
        
        const { error: bulkError } = await supabase
          .from('ai_insights')
          .update({ status: 'acknowledged', updated_at: new Date().toISOString() })
          .in('id', insightIds)
          .eq('teacher_id', teacherId);

        if (bulkError) throw bulkError;

        return NextResponse.json({ success: true, message: `${insightIds.length} insights acknowledged` });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('AI Insights POST API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
