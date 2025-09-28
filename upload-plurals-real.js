require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadPluralsContent() {
  try {
    // Read the content file
    const contentData = JSON.parse(fs.readFileSync('plurals-real-content.json', 'utf8'));
    
    // Get the plurals topic ID
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'plurals')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding plurals topic:', topicError);
      return;
    }
    
    console.log('Found plurals topic:', topic.id);
    
    // Delete existing content for this topic
    const { error: deleteError } = await supabase
      .from('grammar_content')
      .delete()
      .eq('topic_id', topic.id);
    
    if (deleteError) {
      console.error('Error deleting existing content:', deleteError);
      return;
    }
    
    console.log('Deleted existing content');
    
    // Upload practice content (30 questions total)
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Plurals Practice',
      slug: 'plurals-practice',
      difficulty_level: 'intermediate',
      age_group: '11-14',
      estimated_duration: 15,
      order_position: 1,
      content_data: contentData.practice_content
    };
    
    const { error: practiceError } = await supabase
      .from('grammar_content')
      .insert(practiceContent);
    
    if (practiceError) {
      console.error('Error uploading practice content:', practiceError);
      return;
    }
    
    console.log('✅ Uploaded practice content (30 questions)');
    
    // Upload quiz content (20 questions)
    const quizContent = {
      topic_id: topic.id,
      content_type: 'quiz',
      title: 'Spanish Plurals Quiz',
      slug: 'plurals-quiz',
      difficulty_level: 'intermediate',
      age_group: '11-14',
      estimated_duration: 15,
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
    console.log('🎉 Spanish Plurals content uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadPluralsContent();
