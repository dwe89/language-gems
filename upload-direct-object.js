require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadDirectObjectContent() {
  try {
    // Read the content file
    const contentData = JSON.parse(fs.readFileSync('direct-object-content.json', 'utf8'));
    
    // Get the direct-object topic ID
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'direct-object')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding direct-object topic:', topicError);
      return;
    }
    
    console.log('Found direct-object topic:', topic.id);
    
    // Upload practice content (30 questions total)
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Direct Object Pronouns Practice',
      slug: 'direct-object-practice',
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
    console.log('🎉 Spanish Direct Object Pronouns practice content uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadDirectObjectContent();
