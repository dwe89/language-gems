import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { dryRun = false } = await request.json();

    // Get all practice content
    const { data: practiceContents, error: practiceError } = await supabase
      .from('grammar_content')
      .select(`
        id,
        topic_id,
        title,
        slug,
        content_data,
        difficulty_level,
        age_group,
        estimated_duration,
        order_position,
        grammar_topics (
          id,
          title,
          slug,
          language
        )
      `)
      .eq('content_type', 'practice')
      .eq('is_active', true);

    if (practiceError) {
      throw practiceError;
    }

    if (!practiceContents || practiceContents.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'No practice content found'
      });
    }

    const results = [];
    let successCount = 0;
    let errorCount = 0;

    for (const practiceContent of practiceContents) {
      try {
        const topic = practiceContent.grammar_topics;
        if (!topic) {
          results.push({
            practiceId: practiceContent.id,
            topicTitle: 'Unknown',
            status: 'error',
            message: 'Topic not found'
          });
          errorCount++;
          continue;
        }

        // Generate test content
        const testContent = generateTestContentFromPractice(practiceContent, topic);

        if (dryRun) {
          results.push({
            practiceId: practiceContent.id,
            topicTitle: topic.title,
            status: 'dry-run',
            message: 'Would generate test content',
            testContent: {
              title: testContent.title,
              questionCount: testContent.content_data.questions?.length || 0
            }
          });
          successCount++;
          continue;
        }

        // Check if test content already exists (using 'quiz' as content_type)
        const { data: existingTest } = await supabase
          .from('grammar_content')
          .select('id')
          .eq('topic_id', practiceContent.topic_id)
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
              topic_id: practiceContent.topic_id,
              content_type: 'quiz',
              title: testContent.title,
              slug: testContent.slug,
              content_data: testContent.content_data,
              difficulty_level: practiceContent.difficulty_level,
              age_group: practiceContent.age_group,
              estimated_duration: Math.ceil(practiceContent.estimated_duration * 0.8),
              order_position: practiceContent.order_position + 1000, // Offset to avoid unique constraint conflict
              is_active: true,
              is_featured: false
            })
            .select()
            .single();

          if (error) throw error;
          result = data;
        }

        results.push({
          practiceId: practiceContent.id,
          topicTitle: topic.title,
          status: existingTest ? 'updated' : 'created',
          testId: result.id,
          questionCount: testContent.content_data.questions?.length || 0
        });
        successCount++;

      } catch (error) {
        console.error(`Error processing practice content ${practiceContent.id}:`, error);
        results.push({
          practiceId: practiceContent.id,
          topicTitle: practiceContent.grammar_topics?.title || 'Unknown',
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        total: practiceContents.length,
        successful: successCount,
        errors: errorCount,
        dryRun
      },
      results
    });

  } catch (error) {
    console.error('Error in batch generation:', error);
    return NextResponse.json(
      { error: 'Failed to batch generate test content' },
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
    return generateGenericTest(practiceData, topic, practiceContent);
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

    // Create multiple choice questions for different persons
    const persons = ['yo', 'tú', 'él', 'ella', 'nosotros', 'ellos'];
    
    for (let i = 0; i < Math.min(3, persons.length); i++) {
      const person = persons[i];
      questions.push({
        type: 'multiple_choice',
        question: `What is the correct conjugation of "${verb}" (${translation}) for "${person}"?`,
        options: generateConjugationOptions(verb, type, person),
        correct_answer: getCorrectConjugation(verb, type, person),
        explanation: `"${person}" form of ${type.toUpperCase()} verbs follows the conjugation pattern.`,
        difficulty: 'intermediate'
      });
    }

    // Create fill-in-the-blank questions
    questions.push({
      type: 'fill_blank',
      question: `Nosotros _____ (${verb}) en el parque.`,
      correct_answer: getCorrectConjugation(verb, type, 'nosotros'),
      explanation: `The correct conjugation of "${verb}" for "nosotros".`,
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
  const questions = [];
  
  // Generate questions based on practice content
  if (practiceData.exercises) {
    for (const exercise of practiceData.exercises.slice(0, 10)) {
      questions.push({
        type: 'fill_blank',
        question: `Complete: ${exercise.prompt || exercise.question || 'Fill in the blank'}`,
        correct_answer: exercise.answer || exercise.correct_answer,
        explanation: exercise.explanation || 'Check the grammar rules.',
        difficulty: 'intermediate'
      });
    }
  }

  return {
    title: `${topic.title} Test`,
    slug: `${topic.slug}-test`,
    content_data: {
      questions: questions.slice(0, 30),
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
  const questions = [];
  
  // Generate translation questions
  if (practiceData.exercises) {
    for (const exercise of practiceData.exercises.slice(0, 15)) {
      questions.push({
        type: 'translation',
        question: `Translate: "${exercise.english || exercise.prompt}"`,
        correct_answer: exercise.spanish || exercise.answer,
        explanation: exercise.explanation || 'Check the translation.',
        difficulty: 'intermediate'
      });
    }
  }

  return {
    title: `${topic.title} Test`,
    slug: `${topic.slug}-test`,
    content_data: {
      questions: questions.slice(0, 30),
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

function generateGenericTest(practiceData: any, topic: any, practiceContent: any) {
  const questions = [];
  
  // Try to extract questions from various practice formats
  if (practiceData.exercises) {
    for (const exercise of practiceData.exercises.slice(0, 30)) {
      if (exercise.prompts) {
        // Conjugation-style exercises
        for (const prompt of exercise.prompts.slice(0, 5)) {
          questions.push({
            type: 'fill_blank',
            question: `${prompt.person} _____ (${exercise.verb})`,
            correct_answer: prompt.answer,
            explanation: `Conjugation of ${exercise.verb} for ${prompt.person}`,
            difficulty: 'intermediate'
          });
        }
      } else if (exercise.question && exercise.answer) {
        // Direct question-answer pairs
        questions.push({
          type: exercise.type || 'fill_blank',
          question: exercise.question,
          correct_answer: exercise.answer,
          explanation: exercise.explanation || 'Check the grammar rules.',
          difficulty: exercise.difficulty || 'intermediate'
        });
      }
    }
  }

  // If no questions generated, create some basic ones
  if (questions.length === 0) {
    questions.push({
      type: 'multiple_choice',
      question: `Which of the following is correct for ${topic.title.toLowerCase()}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correct_answer: 'Option A',
      explanation: `Review the rules for ${topic.title.toLowerCase()}.`,
      difficulty: 'intermediate'
    });
  }

  return {
    title: `${topic.title} Test`,
    slug: `${topic.slug}-test`,
    content_data: {
      questions: questions.slice(0, 30),
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

// Helper functions (same as in the single generation endpoint)
function generateConjugationOptions(verb: string, type: string, person: string): string[] {
  const correct = getCorrectConjugation(verb, type, person);
  const stem = verb.slice(0, -2);
  
  const wrongOptions = [];
  if (type === 'ar') {
    wrongOptions.push(stem + 'an', stem + 'as', stem + 'a', stem + 'amos');
  } else if (type === 'er') {
    wrongOptions.push(stem + 'en', stem + 'es', stem + 'e', stem + 'emos');
  } else if (type === 'ir') {
    wrongOptions.push(stem + 'en', stem + 'es', stem + 'e', stem + 'imos');
  }
  
  const options = [correct, ...wrongOptions.filter(opt => opt !== correct)].slice(0, 4);
  return shuffleArray(options);
}

function getCorrectConjugation(verb: string, type: string, person: string): string {
  const stem = verb.slice(0, -2);
  
  const endings: { [key: string]: { [key: string]: string } } = {
    'ar': {
      'yo': 'o', 'tú': 'as', 'él': 'a', 'ella': 'a', 'usted': 'a',
      'nosotros': 'amos', 'vosotros': 'áis', 'ellos': 'an', 'ellas': 'an', 'ustedes': 'an'
    },
    'er': {
      'yo': 'o', 'tú': 'es', 'él': 'e', 'ella': 'e', 'usted': 'e',
      'nosotros': 'emos', 'vosotros': 'éis', 'ellos': 'en', 'ellas': 'en', 'ustedes': 'en'
    },
    'ir': {
      'yo': 'o', 'tú': 'es', 'él': 'e', 'ella': 'e', 'usted': 'e',
      'nosotros': 'imos', 'vosotros': 'ís', 'ellos': 'en', 'ellas': 'en', 'ustedes': 'en'
    }
  };
  
  return stem + (endings[type]?.[person] || 'o');
}

function shuffleArray(array: string[]): string[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
