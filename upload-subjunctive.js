require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadSubjunctiveContent() {
  try {
    const contentData = JSON.parse(fs.readFileSync('subjunctive-practice.json', 'utf8'));
    
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
    
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Subjunctive Mood Practice',
      slug: 'subjunctive-practice',
      difficulty_level: 'advanced',
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
    
    console.log('✅ Uploaded subjunctive practice content (30 questions)');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadSubjunctiveContent();
