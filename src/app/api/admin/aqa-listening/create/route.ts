import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/admin/aqa-listening/create
 * Create a new AQA listening paper with questions
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    // Validate required fields
    const { paper, questions } = body;

    if (!paper || !paper.language || !paper.level || !paper.identifier || !paper.title) {
      return NextResponse.json(
        { error: 'Missing required paper fields: language, level, identifier, title' },
        { status: 400 }
      );
    }

    // Check if identifier already exists for this language/level
    const { data: existing } = await supabase
      .from('aqa_listening_assessments')
      .select('id')
      .eq('language', paper.language)
      .eq('level', paper.level)
      .eq('identifier', paper.identifier)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Paper with identifier "${paper.identifier}" already exists for ${paper.language} ${paper.level}` },
        { status: 409 }
      );
    }

    // Create the paper
    const { data: createdPaper, error: paperError } = await supabase
      .from('aqa_listening_assessments')
      .insert({
        title: paper.title,
        description: paper.description || '',
        level: paper.level,
        language: paper.language,
        identifier: paper.identifier,
        version: paper.version || '1.0',
        total_questions: questions?.length || 0,
        time_limit_minutes: paper.time_limit_minutes,
        is_active: paper.is_active !== undefined ? paper.is_active : true,
      })
      .select()
      .single();

    if (paperError) {
      console.error('Error creating paper:', paperError);
      return NextResponse.json(
        { error: 'Failed to create paper', details: paperError.message },
        { status: 500 }
      );
    }

    // Create questions if provided
    if (questions && questions.length > 0) {
      const questionsToInsert = questions.map((q: any) => ({
        assessment_id: createdPaper.id,
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

      const { error: questionsError } = await supabase
        .from('aqa_listening_questions')
        .insert(questionsToInsert);

      if (questionsError) {
        console.error('Error creating questions:', questionsError);
        // Rollback: delete the paper
        await supabase
          .from('aqa_listening_assessments')
          .delete()
          .eq('id', createdPaper.id);

        return NextResponse.json(
          { error: 'Failed to create questions', details: questionsError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      paper: createdPaper,
      message: 'Paper created successfully',
    });
  } catch (error: any) {
    console.error('Error in create endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

