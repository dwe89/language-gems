require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadIndirectObjectContent() {
  try {
    // Read the content file
    const contentData = JSON.parse(fs.readFileSync('indirect-object-content.json', 'utf8'));
    
    // Get the indirect-object topic ID
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'indirect-object')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding indirect-object topic:', topicError);
      return;
    }
    
    console.log('Found indirect-object topic:', topic.id);
    
    // Upload practice content (30 questions total)
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Indirect Object Pronouns Practice',
      slug: 'indirect-object-practice',
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
    console.log('🎉 Spanish Indirect Object Pronouns practice content uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadIndirectObjectContent();
