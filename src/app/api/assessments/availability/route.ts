import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(request: NextRequest) {
    try {
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // We will check counts for each assessment type
        // Using Promise.all for parallel execution
        const [
            { count: readingTasksCount },
            { count: aqaReadingCount },
            { count: aqaListeningCount },
            { count: aqaWritingCount },
            { count: aqaDictationCount }
        ] = await Promise.all([
            supabase.from('reading_comprehension_tasks').select('*', { count: 'exact', head: true }),
            supabase.from('aqa_reading_assessments').select('*', { count: 'exact', head: true }),
            supabase.from('aqa_listening_assessments').select('*', { count: 'exact', head: true }),
            supabase.from('aqa_writing_assessments').select('*', { count: 'exact', head: true }),
            supabase.from('aqa_dictation_assessments').select('*', { count: 'exact', head: true })
        ]);

        // Check for speaking (might not exist table, so separate try/catch or just checking system views)
        // We already know aqa_speaking_assessments doesn't exist, so we default to 0
        const aqaSpeakingCount = 0;

        return NextResponse.json({
            success: true,
            counts: {
                'reading-comprehension': readingTasksCount || 0,
                'gcse-reading': aqaReadingCount || 0,
                'gcse-listening': aqaListeningCount || 0,
                'gcse-writing': aqaWritingCount || 0,
                'gcse-speaking': aqaSpeakingCount || 0,
                'topic-based': readingTasksCount || 0, // Shares same table as reading comprehension
                'dictation': aqaDictationCount || 0
            }
        });

    } catch (error: any) {
        console.error('Error in GET /api/assessments/availability:', error);
        return NextResponse.json(
            { error: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
