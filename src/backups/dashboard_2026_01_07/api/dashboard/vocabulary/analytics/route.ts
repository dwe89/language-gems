import { NextResponse } from 'next/server';

import { createServiceRoleClient } from '@/utils/supabase/client';
import { TeacherVocabularyAnalyticsService } from '@/services/teacherVocabularyAnalytics';

type QueryParams = {
  teacherId: string | null;
  classId: string | null;
  from: string | null;
  to: string | null;
  sections: string | null;
};

const parseQueryParams = (request: Request): QueryParams => {
  const { searchParams } = new URL(request.url);

  return {
    teacherId: searchParams.get('teacherId'),
    classId: searchParams.get('classId'),
    from: searchParams.get('from'),
    to: searchParams.get('to'),
    sections: searchParams.get('sections') // comma-separated list
  };
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const teacherId = searchParams.get('teacherId');
  const classId = searchParams.get('classId');
  const sectionsParam = searchParams.get('sections');

  // Default sections if not specified (fetch everything for backward compatibility)
  // But if the frontend is updated, it should send specific sections
  const sections = sectionsParam
    ? sectionsParam.split(',')
    : ['stats', 'students', 'trends', 'topics', 'words'];

  if (!teacherId) {
    return NextResponse.json({ error: 'Missing teacherId query parameter' }, { status: 400 });
  }

  try {
    const supabaseAdmin = createServiceRoleClient();
    const analyticsService = new TeacherVocabularyAnalyticsService(supabaseAdmin);

    const analytics = await analyticsService.getTeacherVocabularyAnalytics(
      teacherId,
      classId ?? undefined,
      undefined, // dateRange
      sections
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
