import { NextResponse } from 'next/server';

import { createServiceRoleClient } from '@/utils/supabase/client';
import { TeacherVocabularyAnalyticsService } from '@/services/teacherVocabularyAnalytics';

type VocabularySource = 'all' | 'centralized' | 'custom';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get('teacherId');
  const classId = searchParams.get('classId');
  const sectionsParam = searchParams.get('sections');
  const fromDate = searchParams.get('from');
  const toDate = searchParams.get('to');
  const vocabularySource = searchParams.get('vocabularySource') as VocabularySource | null;

  // Default sections if not specified (fetch everything for backward compatibility)
  const sections = sectionsParam
    ? sectionsParam.split(',')
    : ['stats', 'students', 'trends', 'topics', 'words'];

  if (!teacherId) {
    return NextResponse.json({ error: 'Missing teacherId query parameter' }, { status: 400 });
  }

  try {
    const supabaseAdmin = createServiceRoleClient();
    const analyticsService = new TeacherVocabularyAnalyticsService(supabaseAdmin);

    // Build date range if provided
    const dateRange = fromDate && toDate ? { from: fromDate, to: toDate } : undefined;

    const analytics = await analyticsService.getTeacherVocabularyAnalytics(
      teacherId,
      classId ?? undefined,
      dateRange,
      sections,
      vocabularySource ?? 'all'
    );

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Error fetching vocabulary analytics:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch vocabulary analytics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
