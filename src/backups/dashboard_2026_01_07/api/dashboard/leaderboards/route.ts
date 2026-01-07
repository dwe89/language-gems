import { NextResponse } from 'next/server';

import { createServiceRoleClient } from '@/utils/supabase/client';
import { TeacherLeaderboardsService } from '@/services/leaderboards/TeacherLeaderboardsService';

const DEFAULT_LIMIT = 100;

const parseQueryParams = (request: Request) => {
  const { searchParams } = new URL(request.url);

  return {
    teacherId: searchParams.get('teacherId'),
    classId: searchParams.get('classId') ?? undefined,
    limit: searchParams.get('limit'),
    scope: searchParams.get('scope') as 'my-classes' | 'school' | null,
    timePeriod: searchParams.get('timePeriod') as
      | 'daily'
      | 'weekly'
      | 'monthly'
      | 'all_time'
      | null
  };
};

export async function GET(request: Request) {
  const { teacherId, classId, limit, timePeriod, scope } = parseQueryParams(request);

  console.log('[API /dashboard/leaderboards] Request params:', {
    teacherId,
    classId,
    limit,
    timePeriod,
    scope
  });

  if (!teacherId) {
    return NextResponse.json({ error: 'Missing teacherId query parameter' }, { status: 400 });
  }

  try {
    const supabase = createServiceRoleClient();
    const service = new TeacherLeaderboardsService(supabase);

    const limitNumber = limit ? Number.parseInt(limit, 10) : DEFAULT_LIMIT;

    const response = await service.getLeaderboards(teacherId, {
      classId,
      limit: Number.isFinite(limitNumber) && limitNumber > 0 ? limitNumber : DEFAULT_LIMIT,
      timePeriod: timePeriod ?? 'weekly',
      scope: scope ?? 'my-classes'
    });

    return NextResponse.json({ leaderboards: response });
  } catch (error) {
    console.error('[dashboard/leaderboards] Failed to generate leaderboards', error);

    return NextResponse.json(
      {
        error: 'Failed to generate leaderboards',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
