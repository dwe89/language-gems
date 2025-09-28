require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadRelativeContent() {
  try {
    const contentData = JSON.parse(fs.readFileSync('relative-pronouns-practice.json', 'utf8'));
    
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'relative')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding relative topic:', topicError);
      return;
    }
    
    console.log('Found relative topic:', topic.id);
    
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Relative Pronouns Practice',
      slug: 'relative-practice',
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
    
    console.log('✅ Uploaded relative pronouns practice content (30 questions)');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadRelativeContent();
