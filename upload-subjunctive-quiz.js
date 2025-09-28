require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadSubjunctiveQuizContent() {
  try {
    // Read the content file
    const contentData = JSON.parse(fs.readFileSync('subjunctive-quiz-content.json', 'utf8'));
    
    // Get the subjunctive topic ID
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'subjunctive')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding subjunctive topic:', topicError);
      return;
    }
    
    console.log('Found subjunctive topic:', topic.id);
    
    // Upload quiz content (20 questions)
    const quizContent = {
      topic_id: topic.id,
      content_type: 'quiz',
      title: 'Spanish Subjunctive Mood Quiz',
      slug: 'subjunctive-quiz',
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
    console.log('🎉 Spanish Subjunctive quiz content uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadSubjunctiveQuizContent();
