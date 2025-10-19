import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/admin/aqa-listening/update
 * Update an existing AQA listening paper and its questions
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const paperId = searchParams.get('id');

    if (!paperId) {
      return NextResponse.json(
        { error: 'Missing required field: id' },
        { status: 400 }
      );
    }

    const { paper, questions } = body;

    // Check if paper exists
    const { data: existingPaper, error: fetchError } = await supabase
      .from('aqa_listening_assessments')
      .select('*')
      .eq('id', paperId)
      .single();

    if (fetchError || !existingPaper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Update paper (if provided)
    if (paper) {
      const updateData: any = {};
      if (paper.title) updateData.title = paper.title;
      if (paper.description !== undefined) updateData.description = paper.description;
      if (paper.level) updateData.level = paper.level;
      if (paper.language) updateData.language = paper.language;
      if (paper.identifier) updateData.identifier = paper.identifier;
      if (paper.version) updateData.version = paper.version;
      if (paper.time_limit_minutes) updateData.time_limit_minutes = paper.time_limit_minutes;
      if (paper.is_active !== undefined) updateData.is_active = paper.is_active;
      if (questions) updateData.total_questions = questions.length;

      const { error: updateError } = await supabase
        .from('aqa_listening_assessments')
        .update(updateData)
        .eq('id', paperId);

      if (updateError) {
        console.error('Error updating paper:', updateError);
        return NextResponse.json(
          { error: 'Failed to update paper', details: updateError.message },
          { status: 500 }
        );
      }
    }

    // Update questions (if provided)
    if (questions) {
      // Delete existing questions
      const { error: deleteError } = await supabase
        .from('aqa_listening_questions')
        .delete()
        .eq('assessment_id', paperId);

      if (deleteError) {
        console.error('Error deleting old questions:', deleteError);
        return NextResponse.json(
          { error: 'Failed to delete old questions', details: deleteError.message },
          { status: 500 }
        );
      }

      // Insert new questions
      if (questions.length > 0) {
        const questionsToInsert = questions.map((q: any) => ({
          assessment_id: paperId,
          question_number: q.question_number,
          sub_question_number: q.sub_question_number || null,
          question_type: q.question_type,
          title: q.title,
          instructions: q.instructions,
          audio_text: q.audio_text || null,
          audio_url: q.audio_url || null,
          audio_transcript: q.audio_transcript || null,
          question_data: q.question_data,
          marks: q.marks,
          theme: q.theme,
          topic: q.topic,
          tts_config: q.tts_config || {},
          difficulty_rating: q.difficulty_rating || 3,
        }));

        const { error: insertError } = await supabase
          .from('aqa_listening_questions')
          .insert(questionsToInsert);

        if (insertError) {
          console.error('Error inserting new questions:', insertError);
          return NextResponse.json(
            { error: 'Failed to insert new questions', details: insertError.message },
            { status: 500 }
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Paper updated successfully',
    });
  } catch (error: any) {
    console.error('Error in update endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

