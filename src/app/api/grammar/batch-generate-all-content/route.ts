import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  generateVerbExercises,
  generateNounExercises,
  generateAdjectiveExercises,
  generatePronounExercises,
  generatePrepositionExercises,
  generateGenericExercises,
  generateVerbQuestions,
  generateNounQuestions,
  generateAdjectiveQuestions,
  generatePronounQuestions,
  generatePrepositionQuestions,
  generateGenericQuestions
} from './generators';
import {
  generatePracticeContentWithAI,
  generateQuizContentWithAI
} from './ai-generators';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const { dryRun = false, contentType = 'both' } = await request.json();

    // Get all discovered topics from file system
    const topicsResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/grammar/discover-topics?language=spanish`);
    const topicsData = await topicsResponse.json();

    if (!topicsData.success) {
      throw new Error('Failed to discover topics');
    }

    // Filter out invalid topics (challenge, test pages)
    const validTopics = topicsData.data.filter((topic: any) => 
      topic.category !== '[category]' && 
      topic.slug !== 'challenge' && 
      topic.slug !== 'test'
    );

    console.log(`Found ${validTopics.length} valid topics to process`);

    // Get existing topics from database
    const { data: existingTopics, error: topicsError } = await supabase
      .from('grammar_topics')
      .select('id, slug, topic_name')
      .eq('language', 'es')
      .eq('is_active', true);

    if (topicsError) {
      throw topicsError;
    }

    const existingTopicSlugs = new Set(existingTopics?.map(t => t.slug) || []);

    // Get existing content
    const { data: existingContent, error: contentError } = await supabase
      .from('grammar_content')
      .select('topic_id, content_type, grammar_topics!inner(slug)')
      .eq('is_active', true)
      .eq('grammar_topics.language', 'es');

    if (contentError) {
      throw contentError;
    }

    // Create maps of existing content
    const existingPracticeTopics = new Set();
    const existingQuizTopics = new Set();
    
    existingContent?.forEach((content: any) => {
      const slug = content.grammar_topics.slug;
      if (content.content_type === 'practice') {
        existingPracticeTopics.add(slug);
      } else if (content.content_type === 'quiz') {
        existingQuizTopics.add(slug);
      }
    });

    const results = [];
    let successCount = 0;
    let errorCount = 0;
    let createdTopics = 0;

    for (const topic of validTopics) {
      try {
        let topicId;

        // Create topic in database if it doesn't exist
        if (!existingTopicSlugs.has(topic.slug)) {
          if (dryRun) {
            results.push({
              slug: topic.slug,
              status: 'dry-run-topic',
              message: 'Would create topic in database'
            });
            topicId = 'dry-run-id';
          } else {
            try {
              // Get next order position for this category
              const { data: maxOrderData } = await supabase
                .from('grammar_topics')
                .select('order_position')
                .eq('language', 'es')
                .eq('category', topic.category)
                .order('order_position', { ascending: false })
                .limit(1);

              const nextOrderPosition = (maxOrderData?.[0]?.order_position || 0) + 1;

              const { data: newTopic, error: createError } = await supabase
                .from('grammar_topics')
                .insert({
                  topic_name: topic.slug.replace(/-/g, '_'),
                  slug: topic.slug,
                  language: 'es',
                  category: topic.category,
                  difficulty_level: determineDifficulty(topic.category, topic.slug),
                  curriculum_level: 'KS3',
                  title: topic.name,
                  description: generateDescription(topic.category, topic.name),
                  learning_objectives: generateLearningObjectives(topic.category, topic.name),
                  order_position: nextOrderPosition,
                  is_active: true,
                  prerequisite_topics: []
                })
                .select('id')
                .single();

              if (createError) {
                // If topic creation fails, try to find existing topic with similar slug
                console.log(`Topic creation failed for ${topic.slug}, trying to find existing:`, createError.message);
                const { data: existingTopic } = await supabase
                  .from('grammar_topics')
                  .select('id')
                  .eq('slug', topic.slug)
                  .eq('language', 'es')
                  .single();

                if (existingTopic) {
                  topicId = existingTopic.id;
                } else {
                  throw createError;
                }
              } else {
                topicId = newTopic.id;
                createdTopics++;
              }
            } catch (error) {
              console.error(`Failed to create/find topic ${topic.slug}:`, error);
              results.push({
                slug: topic.slug,
                status: 'error',
                message: `Failed to create topic: ${error instanceof Error ? error.message : 'Unknown error'}`
              });
              continue;
            }
          }
        } else {
          // Find existing topic ID
          const existingTopic = existingTopics?.find(t => t.slug === topic.slug);
          topicId = existingTopic?.id;
        }

        // Generate practice content if missing
        if ((contentType === 'both' || contentType === 'practice') && !existingPracticeTopics.has(topic.slug)) {
          const practiceContent = await generatePracticeContentWithAI(topic);

          if (dryRun) {
            results.push({
              slug: topic.slug,
              status: 'dry-run-practice',
              message: 'Would create practice content',
              exerciseCount: practiceContent.content_data.exercises?.length || 0
            });
          } else {
            await createContent(topicId, 'practice', practiceContent, topic.slug);
            results.push({
              slug: topic.slug,
              status: 'created-practice',
              exerciseCount: practiceContent.content_data.exercises?.length || 0
            });
          }
          successCount++;
        }

        // Generate quiz content if missing
        if ((contentType === 'both' || contentType === 'quiz') && !existingQuizTopics.has(topic.slug)) {
          const quizContent = await generateQuizContentWithAI(topic);

          if (dryRun) {
            results.push({
              slug: topic.slug,
              status: 'dry-run-quiz',
              message: 'Would create quiz content',
              questionCount: quizContent.content_data.questions?.length || 0
            });
          } else {
            await createContent(topicId, 'quiz', quizContent, topic.slug);
            results.push({
              slug: topic.slug,
              status: 'created-quiz',
              questionCount: quizContent.content_data.questions?.length || 0
            });
          }
          successCount++;
        }

      } catch (error) {
        console.error(`Error processing topic ${topic.slug}:`, error);
        results.push({
          slug: topic.slug,
          status: 'error',
          message: error instanceof Error ? error.message : 'Unknown error'
        });
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalTopics: validTopics.length,
        createdTopics,
        successful: successCount,
        errors: errorCount,
        dryRun
      },
      results
    });

  } catch (error) {
    console.error('Batch generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function createContent(topicId: string, contentType: string, contentData: any, slug: string) {
  // Create unique slug for content type
  const contentSlug = `${slug}-${contentType}`;

  const { error } = await supabase
    .from('grammar_content')
    .insert({
      topic_id: topicId,
      content_type: contentType,
      title: contentData.title,
      slug: contentSlug,
      content_data: contentData.content_data,
      difficulty_level: contentData.difficulty_level,
      age_group: contentData.age_group,
      estimated_duration: contentData.estimated_duration,
      order_position: contentType === 'practice' ? 1 : 2,
      is_active: true,
      is_featured: false
    });

  if (error) {
    throw error;
  }
}

function determineDifficulty(category: string, slug: string): 'beginner' | 'intermediate' | 'advanced' {
  // Basic topics
  if (slug.includes('present-tense') || slug.includes('articles') || slug.includes('gender') || 
      slug.includes('plurals') || slug.includes('subject')) {
    return 'beginner';
  }
  
  // Advanced topics
  if (slug.includes('subjunctive') || slug.includes('conditional') || slug.includes('pluperfect') ||
      slug.includes('nominalisation') || slug.includes('relative') || slug.includes('reported-speech')) {
    return 'advanced';
  }
  
  // Default to intermediate
  return 'intermediate';
}

function generateDescription(category: string, name: string): string {
  return `Learn ${name.toLowerCase()} in Spanish with comprehensive explanations and examples.`;
}

function generateLearningObjectives(category: string, name: string): string[] {
  return [
    `Understand the rules of ${name.toLowerCase()}`,
    `Apply ${name.toLowerCase()} correctly in context`,
    `Recognize common patterns and exceptions`
  ];
}

async function generatePracticeContent(topic: any) {
  const exercises = generateExercisesByCategory(topic.category, topic.name, topic.slug);

  return {
    title: `${topic.name} Practice`,
    content_data: {
      exercises: exercises,
      practice_type: 'mixed_exercises',
      instructions: `Practice ${topic.name.toLowerCase()} with these interactive exercises.`,
      estimated_duration: 15
    },
    difficulty_level: determineDifficulty(topic.category, topic.slug),
    age_group: '11-14',
    estimated_duration: 15
  };
}

async function generateQuizContent(topic: any) {
  const questions = generateQuestionsByCategory(topic.category, topic.name, topic.slug);

  return {
    title: `${topic.name} Quiz`,
    content_data: {
      questions: questions,
      quiz_type: 'mixed_assessment',
      time_limit: 1200,
      instructions: `Test your knowledge of ${topic.name.toLowerCase()}.`,
      passing_score: 70,
      show_explanations: true,
      randomize_questions: true,
      max_attempts: 3
    },
    difficulty_level: determineDifficulty(topic.category, topic.slug),
    age_group: '11-14',
    estimated_duration: 10
  };
}

function generateExercisesByCategory(category: string, name: string, slug: string) {
  const exercises = [];

  if (category === 'verbs') {
    exercises.push(...generateVerbExercises(name, slug));
  } else if (category === 'nouns') {
    exercises.push(...generateNounExercises(name, slug));
  } else if (category === 'adjectives') {
    exercises.push(...generateAdjectiveExercises(name, slug));
  } else if (category === 'pronouns') {
    exercises.push(...generatePronounExercises(name, slug));
  } else if (category === 'prepositions') {
    exercises.push(...generatePrepositionExercises(name, slug));
  } else {
    exercises.push(...generateGenericExercises(name, slug, category));
  }

  return exercises.slice(0, 30); // Ensure 30 exercises as requested
}

function generateQuestionsByCategory(category: string, name: string, slug: string) {
  const questions = [];

  if (category === 'verbs') {
    questions.push(...generateVerbQuestions(name, slug));
  } else if (category === 'nouns') {
    questions.push(...generateNounQuestions(name, slug));
  } else if (category === 'adjectives') {
    questions.push(...generateAdjectiveQuestions(name, slug));
  } else if (category === 'pronouns') {
    questions.push(...generatePronounQuestions(name, slug));
  } else if (category === 'prepositions') {
    questions.push(...generatePrepositionQuestions(name, slug));
  } else {
    questions.push(...generateGenericQuestions(name, slug, category));
  }

  return questions.slice(0, 20); // 20 questions for quiz
}
