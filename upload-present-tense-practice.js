require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadPresentTensePracticeContent() {
  try {
    // Read the content file
    const contentData = JSON.parse(fs.readFileSync('present-tense-practice-content.json', 'utf8'));
    
    // Get the present-tense topic ID
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'present-tense')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding present-tense topic:', topicError);
      return;
    }
    
    console.log('Found present-tense topic:', topic.id);
    
    // Upload practice content (30 questions total)
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Present Tense Practice',
      slug: 'present-tense-practice',
      difficulty_level: 'beginner',
      age_group: '11-14',
      estimated_duration: 20,
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
    console.log('🎉 Spanish Present Tense practice content uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadPresentTensePracticeContent();
