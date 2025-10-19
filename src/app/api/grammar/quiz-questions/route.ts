import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const category = searchParams.get('category');
    const topic = searchParams.get('topic');
    const count = parseInt(searchParams.get('count') || '20', 10);

    if (!language || !category || !topic) {
      return NextResponse.json(
        { success: false, error: 'Language, category, and topic parameters are required' },
        { status: 400 }
      );
    }

    // Map URL language to database language code
    const languageMap: { [key: string]: string } = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };

    const dbLanguage = languageMap[language.toLowerCase()];
    if (!dbLanguage) {
      return NextResponse.json(
        { success: false, error: 'Unsupported language' },
        { status: 400 }
      );
    }

    // Get the topic ID
    const { data: topicData, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', dbLanguage)
      .eq('category', category)
      .eq('slug', topic)
      .single();

    if (topicError || !topicData) {
      return NextResponse.json(
        { success: false, error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Get practice content for this topic
    const { data: practiceContent, error: contentError } = await supabase
      .from('grammar_content')
      .select('content_data')
      .eq('topic_id', topicData.id)
      .eq('content_type', 'practice')
      .eq('is_active', true)
      .single();

    if (contentError || !practiceContent) {
      return NextResponse.json(
        { success: false, error: 'No practice content found for this topic' },
        { status: 404 }
      );
    }

    // Extract questions from content_data
    let questions: any[] = [];
    const contentData = practiceContent.content_data;

    if (contentData.questions && Array.isArray(contentData.questions)) {
      questions = contentData.questions;
    } else if (contentData.exercises && Array.isArray(contentData.exercises)) {
      // Handle exercises format
      contentData.exercises.forEach((exercise: any) => {
        if (exercise.prompts && Array.isArray(exercise.prompts)) {
          questions.push(...exercise.prompts);
        }
      });
    } else if (contentData.items && Array.isArray(contentData.items)) {
      questions = contentData.items;
    }

    if (questions.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No questions found in practice content' },
        { status: 404 }
      );
    }

    // Shuffle and select random questions
    const shuffled = questions.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, Math.min(count, questions.length));

    // Transform to quiz format
    const quizQuestions = selected.map((q: any, index: number) => ({
      id: `quiz-${index}`,
      question_text: q.question || q.question_text || q.prompt || '',
      question_type: q.type || q.question_type || 'fill_blank',
      correct_answer: q.answer || q.correct_answer || '',
      options: q.options || [],
      explanation: q.explanation || q.hint || '',
      difficulty_level: q.difficulty || q.difficulty_level || 'beginner',
      hint_text: q.hint || q.explanation || ''
    }));

    return NextResponse.json({
      success: true,
      data: quizQuestions,
      count: quizQuestions.length
    });

  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch quiz questions' },
      { status: 500 }
    );
  }
}

