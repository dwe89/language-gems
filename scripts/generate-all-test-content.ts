import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Generate test content for a topic
function generateTestContent(topic: any) {
  const { slug, category, title } = topic;
  
  // Generate 10 test questions based on category
  const questions = [];
  
  for (let i = 1; i <= 10; i++) {
    questions.push({
      id: `${slug}-test-${i}`,
      type: 'multiple_choice',
      question: `Test question ${i} for ${title}`,
      options: [
        `Correct answer for ${title}`,
        `Incorrect option 1`,
        `Incorrect option 2`,
        `Incorrect option 3`
      ],
      correct_answer: `Correct answer for ${title}`,
      explanation: `This tests your understanding of ${title}.`,
      difficulty: topic.difficulty_level || 'intermediate',
      points: 10
    });
  }
  
  return {
    title: `${title} Test`,
    content_data: {
      questions,
      test_type: 'assessment',
      instructions: `Complete this test to assess your knowledge of ${title}.`,
      time_limit: 15,
      passing_score: 70
    },
    difficulty_level: topic.difficulty_level || 'intermediate',
    age_group: '11-14',
    estimated_duration: 15
  };
}

// Generate practice content for a topic
function generatePracticeContent(topic: any) {
  const { slug, category, title } = topic;
  
  // Generate 20 practice exercises
  const exercises = [];
  
  for (let i = 1; i <= 20; i++) {
    exercises.push({
      id: `${slug}-practice-${i}`,
      type: 'fill_blank',
      instructions: `Complete the sentence using ${title.toLowerCase()}`,
      sentence: `This is practice exercise ${i} for _____.`,
      answer: title.toLowerCase(),
      explanation: `Example of ${title.toLowerCase()} usage.`,
      difficulty: topic.difficulty_level || 'intermediate'
    });
  }
  
  return {
    title: `${title} Practice`,
    content_data: {
      exercises,
      practice_type: 'mixed_exercises',
      instructions: `Practice ${title.toLowerCase()} with these interactive exercises.`,
      estimated_duration: 15
    },
    difficulty_level: topic.difficulty_level || 'intermediate',
    age_group: '11-14',
    estimated_duration: 15
  };
}

async function main() {
  console.log('🚀 Starting test content generation for ALL topics...\n');
  
  // Get all topics
  const { data: topics, error: topicsError } = await supabase
    .from('grammar_topics')
    .select('*')
    .eq('language', 'es')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('slug', { ascending: true });
  
  if (topicsError) {
    console.error('❌ Error fetching topics:', topicsError);
    return;
  }
  
  console.log(`📚 Found ${topics.length} topics\n`);
  
  // Get existing content
  const { data: existingContent } = await supabase
    .from('grammar_content')
    .select('topic_id, content_type');
  
  const existingMap = new Map<string, Set<string>>();
  existingContent?.forEach((content: any) => {
    if (!existingMap.has(content.topic_id)) {
      existingMap.set(content.topic_id, new Set());
    }
    existingMap.get(content.topic_id)!.add(content.content_type);
  });

  let quizCreated = 0;
  let practiceCreated = 0;
  let errors = 0;

  for (const topic of topics) {
    const existing = existingMap.get(topic.id) || new Set();
    const needsQuiz = !existing.has('quiz');
    const needsPractice = !existing.has('practice');
    
    console.log(`\n📝 ${topic.category}/${topic.slug} (${topic.title})`);

    // Create QUIZ content if missing
    if (needsQuiz) {
      try {
        const testContent = generateTestContent(topic);

        const { error: quizError } = await supabase
          .from('grammar_content')
          .insert({
            topic_id: topic.id,
            content_type: 'quiz',
            title: testContent.title,
            slug: `${topic.slug}-quiz`,
            content_data: testContent.content_data,
            difficulty_level: testContent.difficulty_level,
            age_group: testContent.age_group,
            estimated_duration: testContent.estimated_duration,
            order_position: 2,
            is_active: true
          });

        if (quizError) {
          console.error(`   ❌ Error creating quiz: ${quizError.message}`);
          errors++;
        } else {
          console.log(`   ✅ Created QUIZ content`);
          quizCreated++;
        }
      } catch (err: any) {
        console.error(`   ❌ Error: ${err.message}`);
        errors++;
      }
    } else {
      console.log(`   ⏭️  QUIZ already exists`);
    }
    
    // Create PRACTICE content if missing
    if (needsPractice) {
      try {
        const practiceContent = generatePracticeContent(topic);
        
        const { error: practiceError } = await supabase
          .from('grammar_content')
          .insert({
            topic_id: topic.id,
            content_type: 'practice',
            title: practiceContent.title,
            slug: `${topic.slug}-practice`,
            content_data: practiceContent.content_data,
            difficulty_level: practiceContent.difficulty_level,
            age_group: practiceContent.age_group,
            estimated_duration: practiceContent.estimated_duration,
            order_position: 1,
            is_active: true
          });
        
        if (practiceError) {
          console.error(`   ❌ Error creating practice: ${practiceError.message}`);
          errors++;
        } else {
          console.log(`   ✅ Created PRACTICE content`);
          practiceCreated++;
        }
      } catch (err: any) {
        console.error(`   ❌ Error: ${err.message}`);
        errors++;
      }
    } else {
      console.log(`   ⏭️  PRACTICE already exists`);
    }
  }
  
  console.log(`\n\n✨ SUMMARY:`);
  console.log(`   📊 Total topics: ${topics.length}`);
  console.log(`   ✅ QUIZ content created: ${quizCreated}`);
  console.log(`   ✅ PRACTICE content created: ${practiceCreated}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log(`\n🎉 Done!\n`);
}

main().catch(console.error);

