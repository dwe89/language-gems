import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { topicId, practiceContentId } = await request.json();

    if (!topicId || !practiceContentId) {
      return NextResponse.json(
        { error: 'Topic ID and Practice Content ID are required' },
        { status: 400 }
      );
    }

    // Get the existing practice content
    const { data: practiceContent, error: practiceError } = await supabase
      .from('grammar_content')
      .select('*')
      .eq('id', practiceContentId)
      .eq('content_type', 'practice')
      .single();

    if (practiceError || !practiceContent) {
      return NextResponse.json(
        { error: 'Practice content not found' },
        { status: 404 }
      );
    }

    // Get topic information
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('*')
      .eq('id', topicId)
      .single();

    if (topicError || !topic) {
      return NextResponse.json(
        { error: 'Topic not found' },
        { status: 404 }
      );
    }

    // Generate test content based on practice content
    const testContent = generateTestContentFromPractice(practiceContent, topic);

    // Check if test content already exists for this topic (using 'quiz' as content_type)
    const { data: existingTest } = await supabase
      .from('grammar_content')
      .select('id')
      .eq('topic_id', topicId)
      .eq('content_type', 'quiz')
      .single();

    let result;
    if (existingTest) {
      // Update existing test content
      const { data, error } = await supabase
        .from('grammar_content')
        .update({
          content_data: testContent.content_data,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingTest.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new test content
      const { data, error } = await supabase
        .from('grammar_content')
        .insert({
          topic_id: topicId,
          content_type: 'quiz',
          title: testContent.title,
          slug: testContent.slug,
          content_data: testContent.content_data,
          difficulty_level: practiceContent.difficulty_level,
          age_group: practiceContent.age_group,
          estimated_duration: Math.ceil(practiceContent.estimated_duration * 0.8), // Slightly shorter for test
          order_position: practiceContent.order_position + 1000, // Offset to avoid unique constraint conflict
          is_active: true,
          is_featured: false
        })
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json({
      success: true,
      testContent: result,
      message: `Test content ${existingTest ? 'updated' : 'created'} successfully`
    });

  } catch (error) {
    console.error('Error generating test content:', error);
    return NextResponse.json(
      { error: 'Failed to generate test content' },
      { status: 500 }
    );
  }
}

function generateTestContentFromPractice(practiceContent: any, topic: any) {
  const practiceData = practiceContent.content_data;
  
  // Generate different test content based on practice type
  if (practiceData.practice_type === 'conjugation_drill') {
    return generateConjugationTest(practiceData, topic);
  } else if (practiceData.practice_type === 'fill_blank') {
    return generateFillBlankTest(practiceData, topic);
  } else if (practiceData.practice_type === 'translation') {
    return generateTranslationTest(practiceData, topic);
  } else {
    // Default: convert practice exercises to test questions
    return generateGenericTest(practiceData, topic);
  }
}

function generateConjugationTest(practiceData: any, topic: any) {
  const exercises = practiceData.exercises || [];
  const questions = [];

  // Generate different verbs and conjugations for test
  for (const exercise of exercises) {
    const verb = exercise.verb;
    const type = exercise.type;
    const translation = exercise.translation;

    // Create multiple choice questions
    questions.push({
      type: 'multiple_choice',
      question: `What is the correct conjugation of "${verb}" for "nosotros"?`,
      options: generateConjugationOptions(verb, type, 'nosotros'),
      correct_answer: getCorrectConjugation(verb, type, 'nosotros'),
      explanation: `"Nosotros" form of ${type.toUpperCase()} verbs follows the pattern.`,
      difficulty: 'intermediate'
    });

    // Create fill-in-the-blank questions
    questions.push({
      type: 'fill_blank',
      question: `Nosotros _____ (${verb}) todos los días.`,
      correct_answer: getCorrectConjugation(verb, type, 'nosotros'),
      explanation: `The correct conjugation of "${verb}" for "nosotros" is needed here.`,
      difficulty: 'intermediate'
    });
  }

  return {
    title: `${topic.title} Test`,
    slug: `${topic.slug}-test`,
    content_data: {
      questions: questions.slice(0, 30), // Limit to 30 questions
      quiz_type: 'conjugation_assessment',
      time_limit: 1200, // 20 minutes
      instructions: 'Test your knowledge of verb conjugations. Choose the best answer for each question.',
      passing_score: 70,
      show_explanations: false, // No explanations in test mode
      randomize_questions: true,
      max_attempts: 3
    }
  };
}

function generateFillBlankTest(practiceData: any, topic: any) {
  // Similar pattern for fill-in-the-blank tests
  return {
    title: `${topic.title} Test`,
    slug: `${topic.slug}-test`,
    content_data: {
      questions: [], // Would generate different fill-blank questions
      quiz_type: 'fill_blank_assessment',
      time_limit: 900,
      instructions: 'Complete the sentences with the correct forms.',
      passing_score: 70,
      show_explanations: false,
      randomize_questions: true,
      max_attempts: 3
    }
  };
}

function generateTranslationTest(practiceData: any, topic: any) {
  // Similar pattern for translation tests
  return {
    title: `${topic.title} Test`,
    slug: `${topic.slug}-test`,
    content_data: {
      questions: [], // Would generate different translation questions
      quiz_type: 'translation_assessment',
      time_limit: 1500,
      instructions: 'Translate the following sentences accurately.',
      passing_score: 70,
      show_explanations: false,
      randomize_questions: true,
      max_attempts: 3
    }
  };
}

function generateGenericTest(practiceData: any, topic: any) {
  // Convert any practice content to test format
  return {
    title: `${topic.title} Test`,
    slug: `${topic.slug}-test`,
    content_data: {
      questions: [], // Would generate questions based on practice content
      quiz_type: 'mixed_assessment',
      time_limit: 1200,
      instructions: `Test your knowledge of ${topic.title.toLowerCase()}.`,
      passing_score: 70,
      show_explanations: false,
      randomize_questions: true,
      max_attempts: 3
    }
  };
}

// Helper functions for conjugation
function generateConjugationOptions(verb: string, type: string, person: string): string[] {
  const correct = getCorrectConjugation(verb, type, person);
  const stem = verb.slice(0, -2);
  
  // Generate plausible wrong answers
  const wrongOptions = [];
  if (type === 'ar') {
    wrongOptions.push(stem + 'an', stem + 'as', stem + 'a');
  } else if (type === 'er') {
    wrongOptions.push(stem + 'en', stem + 'es', stem + 'e');
  } else if (type === 'ir') {
    wrongOptions.push(stem + 'en', stem + 'es', stem + 'e');
  }
  
  const options = [correct, ...wrongOptions.filter(opt => opt !== correct)].slice(0, 4);
  return shuffleArray(options);
}

function getCorrectConjugation(verb: string, type: string, person: string): string {
  const stem = verb.slice(0, -2);
  
  const endings: { [key: string]: { [key: string]: string } } = {
    'ar': {
      'yo': 'o',
      'tú': 'as', 
      'él': 'a',
      'ella': 'a',
      'usted': 'a',
      'nosotros': 'amos',
      'vosotros': 'áis',
      'ellos': 'an',
      'ellas': 'an',
      'ustedes': 'an'
    },
    'er': {
      'yo': 'o',
      'tú': 'es',
      'él': 'e',
      'ella': 'e', 
      'usted': 'e',
      'nosotros': 'emos',
      'vosotros': 'éis',
      'ellos': 'en',
      'ellas': 'en',
      'ustedes': 'en'
    },
    'ir': {
      'yo': 'o',
      'tú': 'es',
      'él': 'e',
      'ella': 'e',
      'usted': 'e', 
      'nosotros': 'imos',
      'vosotros': 'ís',
      'ellos': 'en',
      'ellas': 'en',
      'ustedes': 'en'
    }
  };
  
  return stem + endings[type][person];
}

function shuffleArray(array: string[]): string[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
