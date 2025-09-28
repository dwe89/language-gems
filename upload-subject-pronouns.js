require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function uploadSubjectPronounsContent() {
  try {
    // Read the content file
    const contentData = JSON.parse(fs.readFileSync('subject-pronouns-content.json', 'utf8'));
    
    // Get the subject-pronouns topic ID
    const { data: topic, error: topicError } = await supabase
      .from('grammar_topics')
      .select('id')
      .eq('language', 'es')
      .eq('slug', 'subject-pronouns')
      .single();
    
    if (topicError || !topic) {
      console.error('Error finding subject-pronouns topic:', topicError);
      return;
    }
    
    console.log('Found subject-pronouns topic:', topic.id);
    
    // Upload practice content (30 questions total)
    const practiceContent = {
      topic_id: topic.id,
      content_type: 'practice',
      title: 'Spanish Subject Pronouns Practice',
      slug: 'subject-pronouns-practice',
      difficulty_level: 'beginner',
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
      title: 'Spanish Subject Pronouns Quiz',
      slug: 'subject-pronouns-quiz',
      difficulty_level: 'beginner',
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
    console.log('🎉 Spanish Subject Pronouns content uploaded successfully!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

uploadSubjectPronounsContent();
