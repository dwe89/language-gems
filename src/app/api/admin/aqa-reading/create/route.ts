import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/**
 * POST /api/admin/aqa-reading/create
 * Create a new AQA reading paper with questions
 * Admin only endpoint
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const body = await request.json();

    // Validate required fields
    const { paper, questions } = body;

    if (!paper || !paper.language || !paper.tier || !paper.identifier || !paper.title) {
      return NextResponse.json(
        { error: 'Missing required paper fields: language, tier, identifier, title' },
        { status: 400 }
      );
    }

    // Hardcoded values based on tier
    const timeLimit = paper.tier === 'foundation' ? 45 : 60;
    const totalMarks = 50; // Always 50 marks

    // Auto-generate description if not provided
    const description = paper.description || 
      `AQA GCSE ${paper.language.toUpperCase()} Reading Assessment - ${paper.tier === 'foundation' ? 'Foundation' : 'Higher'} Tier`;

    // Check if identifier already exists for this language/tier
    const { data: existing } = await supabase
      .from('aqa_reading_assessments')
      .select('id')
      .eq('language', paper.language)
      .eq('level', paper.tier)
      .eq('identifier', paper.identifier)
      .single();

    if (existing) {
      return NextResponse.json(
        { error: `Paper with identifier "${paper.identifier}" already exists for ${paper.language} ${paper.tier}` },
        { status: 409 }
      );
    }

    // Create the paper
    const { data: createdPaper, error: paperError } = await supabase
      .from('aqa_reading_assessments')
      .insert({
        title: paper.title,
        description: description,
        level: paper.tier, // tier maps to level in database
        language: paper.language,
        identifier: paper.identifier,
        version: paper.version || '1.0',
        total_questions: questions?.length || 0,
        time_limit_minutes: timeLimit,
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
        reading_text: q.reading_text || null,
        question_data: q.question_data,
        marks: q.marks,
        theme: q.theme,
        topic: q.topic,
        difficulty_rating: q.difficulty_rating || 3,
      }));

      const { error: questionsError } = await supabase
        .from('aqa_reading_questions')
        .insert(questionsToInsert);

      if (questionsError) {
        console.error('Error creating questions:', questionsError);
        // Rollback: delete the paper
        await supabase
          .from('aqa_reading_assessments')
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
      paper: {
        ...createdPaper,
        tier: createdPaper.level,
        paper_number: createdPaper.identifier,
        total_marks: totalMarks
      }
    });

  } catch (error: any) {
    console.error('Error in POST /api/admin/aqa-reading/create:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

