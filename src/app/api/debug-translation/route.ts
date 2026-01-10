import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use direct env vars if valid, otherwise fallback (we assume env are loaded in Next.js context)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        const { data, error } = await supabase
            .from('aqa_reading_questions')
            .select('question_data')
            .eq('question_type', 'translation')
            .limit(1)
            .single();

        if (error) {
            return NextResponse.json({ error }, { status: 500 });
        }

        return NextResponse.json({ data });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
