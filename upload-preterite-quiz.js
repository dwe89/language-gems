require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadPreteriteQuizContent() {
  try {
    // Read the content file
    const contentData = JSON.parse(fs.readFileSync('preterite-quiz-content.json', 'utf8'));
    
    // Get the preterite topic ID
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'preterite')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding preterite topic:', topicError);
      return;
    }
    
    console.log('Found preterite topic:', topic.id);
    
    // Upload quiz content (20 questions)
    const quizContent = {
      topic_id: topic.id,
      content_type: 'quiz',
      title: 'Spanish Preterite Tense Quiz',
      slug: 'preterite-quiz',
      difficulty_level: 'intermediate',
      age_group: '11-14',
      estimated_duration: 20,
      order_position: 2,
      content_data: contentData.quiz_content
    };
    
    const { error: quizError } = await supabase
      .from('grammar_content')
      .insert(quizContent);
    
    if (quizError) {
      console.error('Error uploading quiz content:', quizError);
      return;
    }
    
    console.log('✅ Uploaded quiz content (20 questions)');
    console.log('🎉 Spanish Preterite quiz content uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadPreteriteQuizContent();
