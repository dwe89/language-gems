const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ztpkgqcqjqjqjqjqjqjq.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseKey) {
  console.error('❌ Missing Supabase key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadContent() {
  try {
    console.log('🚀 Starting upload of demonstrative and indefinite adjectives content...\n');

    // Read the JSON file
    const jsonData = JSON.parse(fs.readFileSync('demonstrative-indefinite-adjectives.json', 'utf8'));
    
    let totalUploaded = 0;
    let successCount = 0;
    let errorCount = 0;

    for (const topicData of jsonData.topics) {
      const { topic_id, title, content_type, questions } = topicData;
      
      console.log(`📝 Processing ${topic_id} (${content_type})...`);

      try {
        // First, get the topic ID from the database
        const { data: topicRecord, error: topicError } = await supabase
          .from('grammar_topics')
          .select('id')
          .eq('language', 'es')
          .eq('category', 'adjectives')
          .eq('slug', topic_id)
          .single();

        if (topicError || !topicRecord) {
          // Create the topic if it doesn't exist
          console.log(`   Creating new topic: ${topic_id}`);
          const { data: newTopic, error: createError } = await supabase
            .from('grammar_topics')
            .insert({
              language: 'es',
              category: 'adjectives',
              slug: topic_id,
              title: title,
              topic_name: title,
              curriculum_level: 'KS3',
              difficulty_level: 'intermediate'
            })
            .select('id')
            .single();

          if (createError) {
            console.error(`   ❌ Error creating topic ${topic_id}:`, createError);
            errorCount++;
            continue;
          }
          
          topicRecord = newTopic;
        }

        // Clear existing content for this topic and content type
        const { error: deleteError } = await supabase
          .from('grammar_content')
          .delete()
          .eq('topic_id', topicRecord.id)
          .eq('content_type', content_type);

        if (deleteError) {
          console.error(`   ❌ Error clearing existing content:`, deleteError);
          errorCount++;
          continue;
        }

        // Insert new content
        const { error: insertError } = await supabase
          .from('grammar_content')
          .insert({
            topic_id: topicRecord.id,
            content_type: content_type,
            title: title,
            slug: `${topic_id}-${content_type}`,
            content_data: { questions },
            difficulty_level: 'intermediate',
            age_group: '11-14'
          });

        if (insertError) {
          console.error(`   ❌ Error inserting content:`, insertError);
          errorCount++;
          continue;
        }

        console.log(`   ✅ Successfully uploaded ${questions.length} questions`);
        successCount++;
        totalUploaded += questions.length;

      } catch (error) {
        console.error(`   ❌ Error processing ${topic_id}:`, error);
        errorCount++;
      }
    }

    console.log('\n🎉 Upload Summary:');
    console.log(`✅ Successful uploads: ${successCount}`);
    console.log(`❌ Failed uploads: ${errorCount}`);
    console.log(`📊 Total questions uploaded: ${totalUploaded}`);
    
    if (successCount > 0) {
      console.log('\n🔗 Test URLs:');
      console.log('📝 Practice: http://localhost:3001/grammar/spanish/adjectives/demonstrative/practice');
      console.log('🧪 Test: http://localhost:3001/grammar/spanish/adjectives/demonstrative/test');
      console.log('📝 Practice: http://localhost:3001/grammar/spanish/adjectives/indefinite/practice');
      console.log('🧪 Test: http://localhost:3001/grammar/spanish/adjectives/indefinite/test');
    }

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

uploadContent();
