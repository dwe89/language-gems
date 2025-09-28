require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadPreteriteContent() {
  try {
    const contentData = JSON.parse(fs.readFileSync('preterite-practice.json', 'utf8'));
    
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
    
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Preterite Tense Practice',
      slug: 'preterite-practice',
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
    
    console.log('✅ Uploaded preterite practice content (30 questions)');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadPreteriteContent();
