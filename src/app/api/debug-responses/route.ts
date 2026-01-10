import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/client';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const resultId = request.nextUrl.searchParams.get('resultId');

    const supabase = createServiceRoleClient();

    // Get all responses for this result
    const { data, error } = await supabase
        .from('aqa_reading_question_responses')
        .select('id, question_id, question_number, points_awarded, marks_possible, is_correct')
        .eq('result_id', resultId)
        .limit(20);

    return NextResponse.json({ data, error });
}
