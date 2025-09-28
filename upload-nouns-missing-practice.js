const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xetsvpfunazwkontdpdh.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceKey) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function uploadNounsPracticeContent() {
  try {
    console.log('🚀 Starting upload of missing nouns practice content...');
    
    // Read the content data
    const contentData = JSON.parse(fs.readFileSync('nouns-missing-practice.json', 'utf8'));
    
    // First, get the topic IDs for the slugs
    const topicSlugs = ['definite', 'gender-plurals', 'plural-formation'];
    
    const { data: topics, error: topicsError } = await supabase
      .from('grammar_topics')
      .select('id, slug')
      .in('slug', topicSlugs)
      .eq('language', 'es')
      .eq('category', 'nouns');
    
    if (topicsError) {
      console.error('❌ Error fetching topics:', topicsError);
      return;
    }
    
    console.log('📋 Found topics:', topics);
    
    // Create a mapping of slug to topic ID
    const topicIdMap = {};
    topics.forEach(topic => {
      topicIdMap[topic.slug] = topic.id;
    });
    
    // Upload each content item
    for (const content of contentData) {
      const topicId = topicIdMap[content.topic_id];
      
      if (!topicId) {
        console.error(`❌ No topic found for slug: ${content.topic_id}`);
        continue;
      }
      
      const contentToInsert = {
        topic_id: topicId,
        content_type: content.content_type,
        title: content.title,
        slug: content.slug,
        content_data: content.content_data,
        difficulty_level: content.difficulty_level,
        age_group: content.age_group,
        estimated_duration: content.estimated_duration,
        order_position: content.order_position,
        is_active: content.is_active,
        is_featured: content.is_featured
      };
      
      console.log(`📝 Uploading ${content.title}...`);
      
      const { data, error } = await supabase
        .from('grammar_content')
        .insert(contentToInsert);
      
      if (error) {
        console.error(`❌ Error uploading ${content.title}:`, error);
      } else {
        console.log(`✅ Successfully uploaded ${content.title}`);
      }
    }
    
    console.log('🎉 Upload completed!');
    
  } catch (error) {
    console.error('❌ Error in upload process:', error);
  }
}

uploadNounsPracticeContent();
