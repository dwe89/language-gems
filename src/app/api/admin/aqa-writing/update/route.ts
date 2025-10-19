import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/admin/aqa-writing/update
 * Update an existing AQA writing paper and its questions
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    const { paperId, paper, questions } = body;

    if (!paperId) {
      return NextResponse.json(
        { error: 'Missing required field: paperId' },
        { status: 400 }
      );
    }

    // Check if paper exists
    const { data: existingPaper, error: fetchError } = await supabase
      .from('aqa_writing_assessments')
      .select('*')
      .eq('id', paperId)
      .single();

    if (fetchError || !existingPaper) {
      return NextResponse.json(
        { error: 'Paper not found' },
        { status: 404 }
      );
    }

    // Update paper metadata (if provided)
    if (paper) {
      // Hardcoded values based on tier
      const timeLimit = paper.tier ? (paper.tier === 'foundation' ? 70 : 75) : existingPaper.time_limit_minutes;
      
      const updateData: any = {};
      
      if (paper.title) updateData.title = paper.title;
      if (paper.description !== undefined) updateData.description = paper.description;
      if (paper.tier) updateData.level = paper.tier;
      if (paper.language) updateData.language = paper.language;
      if (paper.identifier) updateData.identifier = paper.identifier;
      if (paper.version) updateData.version = paper.version;
      if (paper.is_active !== undefined) updateData.is_active = paper.is_active;
      
      // Always enforce time limit based on tier
      updateData.time_limit_minutes = timeLimit;

      const { error: updateError } = await supabase
        .from('aqa_writing_assessments')
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
        .from('aqa_writing_questions')
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
          question_data: q.question_data,
          marks: q.marks,
          word_count_requirement: q.word_count_requirement || null,
          theme: q.theme,
          topic: q.topic,
          difficulty_rating: q.difficulty_rating || 3,
        }));

        const { error: insertError } = await supabase
          .from('aqa_writing_questions')
          .insert(questionsToInsert);

        if (insertError) {
          console.error('Error inserting new questions:', insertError);
          return NextResponse.json(
            { error: 'Failed to insert new questions', details: insertError.message },
            { status: 500 }
          );
        }
      }

      // Update total_questions count
      await supabase
        .from('aqa_writing_assessments')
        .update({ total_questions: questions.length })
        .eq('id', paperId);
    }

    return NextResponse.json({
      success: true,
      message: 'Paper updated successfully'
    });

  } catch (error: any) {
    console.error('Error in POST /api/admin/aqa-writing/update:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

