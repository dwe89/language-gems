import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient({ cookies: () => cookies() });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId');
    const assignmentId = searchParams.get('assignmentId');
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');
    const format = searchParams.get('format') || 'csv';

    // Verify teacher has access to the requested data
    if (classId) {
      const { data: classAccess } = await supabase
        .from('classes')
        .select('id')
        .eq('id', classId)
        .eq('teacher_id', user.id)
        .single();

      if (!classAccess) {
        return NextResponse.json({ error: 'Access denied to this class' }, { status: 403 });
      }
    }

    if (assignmentId) {
      const { data: assignmentAccess } = await supabase
        .from('assignments')
        .select('id, class_id')
        .eq('id', assignmentId)
        .eq('created_by', user.id)
        .single();

      if (!assignmentAccess) {
        return NextResponse.json({ error: 'Access denied to this assignment' }, { status: 403 });
      }
    }

    // Build the query for gem collector sessions with detailed information
    let sessionsQuery = supabase
      .from('gem_collector_sessions')
      .select(`
        *,
        auth_users:student_id (
          id,
          email,
          user_metadata
        ),
        assignments:assignment_id (
          id,
          title,
          class_id,
          classes (
            name
          )
        )
      `)
      .order('created_at', { ascending: false });

    // Apply filters
    if (assignmentId) {
      sessionsQuery = sessionsQuery.eq('assignment_id', assignmentId);
    }

    if (dateFrom) {
      sessionsQuery = sessionsQuery.gte('created_at', dateFrom);
    }

    if (dateTo) {
      sessionsQuery = sessionsQuery.lte('created_at', dateTo);
    }

    // If classId is specified, filter by assignments in that class
    if (classId) {
      const { data: classAssignments } = await supabase
        .from('assignments')
        .select('id')
        .eq('class_id', classId)
        .eq('type', 'gem-collector');

      if (classAssignments && classAssignments.length > 0) {
        const assignmentIds = classAssignments.map(a => a.id);
        sessionsQuery = sessionsQuery.in('assignment_id', assignmentIds);
      } else {
        // No gem collector assignments in this class
        return generateEmptyExport(format);
      }
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery;

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch session data' }, { status: 500 });
    }

    // Get detailed segment attempts for the sessions
    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map(s => s.id);
      const { data: segmentAttempts } = await supabase
        .from('gem_collector_segment_attempts')
        .select(`
          *,
          sentence_segments (
            english_segment,
            target_segment,
            grammar_note,
            sentence_translations (
              english_sentence,
              target_sentence,
              theme,
              topic,
              difficulty_level
            )
          )
        `)
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false });

      // Add segment attempts to sessions
      sessions.forEach(session => {
        session.segment_attempts = segmentAttempts?.filter(attempt => attempt.session_id === session.id) || [];
      });
    }

    if (format === 'csv') {
      return generateCSVExport(sessions || []);
    } else {
      return NextResponse.json({ sessions: sessions || [] });
    }

  } catch (error) {
    console.error('Error exporting gem collector analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateEmptyExport(format: string) {
  if (format === 'csv') {
    const csvContent = 'No data available for the selected filters\n';
    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="gem-collector-analytics-empty.csv"'
      }
    });
  } else {
    return NextResponse.json({ sessions: [] });
  }
}

function generateCSVExport(sessions: any[]) {
  // CSV headers
  const headers = [
    'Session ID',
    'Student Name',
    'Student Email',
    'Assignment Title',
    'Class Name',
    'Session Type',
    'Language Pair',
    'Difficulty Level',
    'Started At',
    'Ended At',
    'Duration (minutes)',
    'Total Sentences',
    'Completed Sentences',
    'Total Segments',
    'Correct Segments',
    'Incorrect Segments',
    'Final Score',
    'Accuracy (%)',
    'Gems Collected',
    'Speed Boosts Used',
    'Average Response Time (ms)'
  ];

  // Generate CSV rows
  const rows = sessions.map(session => {
    const student = session.auth_users;
    const assignment = session.assignments;
    const className = assignment?.classes?.name || 'N/A';
    
    // Calculate duration
    let duration = 'N/A';
    if (session.started_at && session.ended_at) {
      const start = new Date(session.started_at);
      const end = new Date(session.ended_at);
      duration = Math.round((end.getTime() - start.getTime()) / (1000 * 60)).toString();
    }

    // Calculate accuracy
    const accuracy = session.total_segments > 0 
      ? Math.round((session.correct_segments / session.total_segments) * 100)
      : 0;

    return [
      session.id,
      student?.user_metadata?.full_name || 'Unknown',
      student?.email || 'Unknown',
      assignment?.title || 'N/A',
      className,
      session.session_type,
      session.language_pair,
      session.difficulty_level,
      session.started_at || 'N/A',
      session.ended_at || 'N/A',
      duration,
      session.total_sentences || 0,
      session.completed_sentences || 0,
      session.total_segments || 0,
      session.correct_segments || 0,
      session.incorrect_segments || 0,
      session.final_score || 0,
      accuracy,
      session.gems_collected || 0,
      session.speed_boosts_used || 0,
      session.average_response_time || 0
    ];
  });

  // Combine headers and rows
  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n');

  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="gem-collector-analytics-${new Date().toISOString().split('T')[0]}.csv"`
    }
  });
}

// POST endpoint for detailed segment-level export
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient({ cookies: () => cookies() });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sessionIds, includeSegmentDetails = true } = body;

    if (!sessionIds || !Array.isArray(sessionIds)) {
      return NextResponse.json({ error: 'Session IDs required' }, { status: 400 });
    }

    // Verify teacher has access to these sessions
    const { data: sessions } = await supabase
      .from('gem_collector_sessions')
      .select(`
        id,
        assignments (
          created_by
        )
      `)
      .in('id', sessionIds);

    const unauthorizedSessions = sessions?.filter(s => s.assignments?.created_by !== user.id) || [];
    if (unauthorizedSessions.length > 0) {
      return NextResponse.json({ error: 'Access denied to some sessions' }, { status: 403 });
    }

    if (includeSegmentDetails) {
      // Get detailed segment attempts
      const { data: segmentAttempts } = await supabase
        .from('gem_collector_segment_attempts')
        .select(`
          *,
          gem_collector_sessions (
            student_id,
            assignment_id
          ),
          sentence_segments (
            english_segment,
            target_segment,
            grammar_note,
            sentence_translations (
              english_sentence,
              target_sentence,
              theme,
              topic,
              difficulty_level
            )
          )
        `)
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false });

      return NextResponse.json({ segmentAttempts: segmentAttempts || [] });
    } else {
      return NextResponse.json({ message: 'Basic export completed' });
    }

  } catch (error) {
    console.error('Error in detailed export:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
