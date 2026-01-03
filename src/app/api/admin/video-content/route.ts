import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Use service role key for admin operations
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Verify admin status
async function isAdmin(request: NextRequest): Promise<boolean> {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) return false;

    const token = authHeader.replace('Bearer ', '');

    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return false;

    // Check if user is admin (adjust this check based on your admin criteria)
    const adminEmails = ['danieletienne89@gmail.com'];
    return adminEmails.includes(user.email || '');
}

// GET - Fetch lyrics for a video
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('video_id');
    const type = searchParams.get('type') || 'lyrics'; // 'lyrics' or 'questions'

    if (!videoId) {
        return NextResponse.json({ error: 'video_id is required' }, { status: 400 });
    }

    try {
        if (type === 'lyrics') {
            const { data, error } = await supabaseAdmin
                .from('video_lyrics')
                .select('*')
                .eq('video_id', videoId)
                .order('timestamp_seconds', { ascending: true });

            if (error) throw error;
            return NextResponse.json(data);
        } else {
            const { data, error } = await supabaseAdmin
                .from('video_karaoke_questions')
                .select('*')
                .eq('video_id', videoId)
                .order('timestamp_seconds', { ascending: true });

            if (error) throw error;
            return NextResponse.json(data);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST - Create/Update lyrics or questions
export async function POST(request: NextRequest) {
    if (!await isAdmin(request)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { type, videoId, items, deletedIds } = body;

        if (!type || !videoId || !items) {
            return NextResponse.json({ error: 'type, videoId, and items are required' }, { status: 400 });
        }

        const table = type === 'lyrics' ? 'video_lyrics' : 'video_karaoke_questions';

        // Delete removed items first
        if (deletedIds && deletedIds.length > 0) {
            const { error: deleteError } = await supabaseAdmin
                .from(table)
                .delete()
                .in('id', deletedIds);

            if (deleteError) throw deleteError;
        }

        // Separate new and existing items
        const newItems = items.filter((item: any) => item.isNew);
        const existingItems = items.filter((item: any) => !item.isNew && item.id);

        // Insert new items
        if (newItems.length > 0) {
            const insertData = newItems.map((item: any) => {
                if (type === 'lyrics') {
                    return {
                        video_id: videoId,
                        timestamp_seconds: item.timestamp_seconds,
                        end_timestamp_seconds: item.end_timestamp_seconds || null,
                        text: item.text,
                        translation: item.translation || null
                    };
                } else {
                    return {
                        video_id: videoId,
                        timestamp_seconds: item.timestamp_seconds,
                        question_text: item.question_text,
                        options: typeof item.options === 'string' ? item.options : JSON.stringify(item.options),
                        correct_answer: item.correct_answer,
                        explanation: item.explanation || null,
                        question_type: item.question_type || 'vocabulary',
                        is_active: item.is_active !== false
                    };
                }
            });

            const { error: insertError } = await supabaseAdmin
                .from(table)
                .insert(insertData);

            if (insertError) throw insertError;
        }

        // Update existing items
        for (const item of existingItems) {
            let updateData: any;

            if (type === 'lyrics') {
                updateData = {
                    timestamp_seconds: item.timestamp_seconds,
                    end_timestamp_seconds: item.end_timestamp_seconds,
                    text: item.text,
                    translation: item.translation
                };
            } else {
                updateData = {
                    timestamp_seconds: item.timestamp_seconds,
                    question_text: item.question_text,
                    options: typeof item.options === 'string' ? item.options : JSON.stringify(item.options),
                    correct_answer: item.correct_answer,
                    explanation: item.explanation,
                    question_type: item.question_type,
                    is_active: item.is_active
                };
            }

            const { error: updateError } = await supabaseAdmin
                .from(table)
                .update(updateData)
                .eq('id', item.id);

            if (updateError) throw updateError;
        }

        return NextResponse.json({
            success: true,
            inserted: newItems.length,
            updated: existingItems.length,
            deleted: deletedIds?.length || 0
        });
    } catch (error: any) {
        console.error('Error saving:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
