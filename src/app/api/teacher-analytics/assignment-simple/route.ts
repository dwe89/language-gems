import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const assignmentId = searchParams.get('assignmentId');

  if (!assignmentId) {
    return NextResponse.json({ error: 'Assignment ID required' }, { status: 400 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  try {
    // 1. Get assignment info
    const { data: assignment } = await supabase
      .from('assignments')
      .select('id, title, class_id')
      .eq('id', assignmentId)
      .single();

    if (!assignment) {
      return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
    }

    // 2. Get class info
    const { data: classData } = await supabase
      .from('classes')
      .select('name')
      .eq('id', assignment.class_id)
      .single();

    // 3. Get total students in class
    const { data: enrollments } = await supabase
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', assignment.class_id)
      .eq('status', 'active');

    const totalStudents = enrollments?.length || 0;

    // 4. Get sessions for this assignment
    const { data: sessions } = await supabase
      .from('enhanced_game_sessions')
      .select('id, student_id, duration_seconds')
      .eq('assignment_id', assignmentId);

    const sessionIds = sessions?.map(s => s.id) || [];
    const studentsWithActivity = new Set(sessions?.map(s => s.student_id) || []).size;
    const avgDurationSeconds = sessions && sessions.length > 0
      ? Math.round(sessions.reduce((sum, s) => sum + (s.duration_seconds || 0), 0) / sessions.length)
      : 0;

    // 5. Get gem events for these sessions
    let totalGems = 0;
    let strongWeakGems = 0;
    let failures = 0;
    let classSuccessScore = 0;
    let studentsNeedingHelp = 0;

    if (sessionIds.length > 0) {
      const { data: gems } = await supabase
        .from('gem_events')
        .select('gem_rarity, student_id, word_text, translation_text')
        .in('session_id', sessionIds);

      totalGems = gems?.length || 0;
      strongWeakGems = gems?.filter(g => ['uncommon', 'rare', 'epic', 'legendary'].includes(g.gem_rarity)).length || 0;
      failures = gems?.filter(g => g.gem_rarity === 'common').length || 0;
      classSuccessScore = totalGems > 0 ? Math.round((strongWeakGems / totalGems) * 100) : 0;

      // Calculate students needing help
      const studentStats = new Map<string, { total: number; failures: number }>();
      gems?.forEach(gem => {
        const current = studentStats.get(gem.student_id) || { total: 0, failures: 0 };
        current.total++;
        if (gem.gem_rarity === 'common') current.failures++;
        studentStats.set(gem.student_id, current);
      });

      studentsNeedingHelp = Array.from(studentStats.values())
        .filter(stats => stats.total > 0 && (stats.failures / stats.total) > 0.3)
        .length;
    }

    // 5. Get word difficulty
    const { data: wordData } = await supabase.rpc('exec_sql', {
      query: `
        SELECT 
          ge.word_text,
          ge.translation_text,
          COUNT(*) as total_attempts,
          SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) as failures,
          ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate,
          SUM(CASE WHEN ge.gem_rarity IN ('rare', 'epic', 'legendary') THEN 1 ELSE 0 END) as strong_retrieval
        FROM gem_events ge
        WHERE ge.session_id IN (
          SELECT id FROM enhanced_game_sessions WHERE assignment_id = '${assignmentId}'
        )
        AND ge.word_text IS NOT NULL
        GROUP BY ge.word_text, ge.translation_text
        ORDER BY failure_rate DESC
        LIMIT 20
      `
    });

    // 6. Get student progress
    const { data: studentData } = await supabase.rpc('exec_sql', {
      query: `
        SELECT 
          ge.student_id,
          up.display_name,
          COUNT(*) as total_gems,
          ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity IN ('uncommon', 'rare', 'epic', 'legendary') THEN 1 ELSE 0 END) / COUNT(*), 1) as success_score,
          ROUND(100.0 * SUM(CASE WHEN ge.gem_rarity = 'common' THEN 1 ELSE 0 END) / COUNT(*), 1) as failure_rate,
          SUM(egs.duration_seconds) as total_time_seconds
        FROM gem_events ge
        JOIN user_profiles up ON ge.student_id = up.user_id
        JOIN enhanced_game_sessions egs ON ge.session_id = egs.id
        WHERE egs.assignment_id = '${assignmentId}'
        GROUP BY ge.student_id, up.display_name
        ORDER BY failure_rate DESC
      `
    });

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          assignmentId,
          assignmentTitle: assignment.title,
          className: classData?.name || 'Unknown',
          totalStudents,
          studentsWithActivity,
          completionRate: totalStudents > 0 ? Math.round((studentsWithActivity / totalStudents) * 100) : 0,
          averageTimeMinutes: Math.round(avgDurationSeconds / 60),
          classSuccessScore,
          studentsNeedingHelp,
          totalGems,
          strongWeakGems,
          failures
        },
        words: wordData || [],
        students: studentData || []
      }
    });

  } catch (error: any) {
    console.error('Error fetching assignment analytics:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch analytics', 
      details: error.message 
    }, { status: 500 });
  }
}

