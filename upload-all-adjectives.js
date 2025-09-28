const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Function to load environment variables from .env.local
function loadEnvLocal() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const envVars = {};

    envContent.split('\n').forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          envVars[key] = valueParts.join('=').replace(/^["']|["']$/g, '');
        }
      }
    });

    return envVars;
  } catch (error) {
    console.log('⚠️  Could not read .env.local file');
    return {};
  }
}

// Initialize environment variables
const envVars = loadEnvLocal();

// Initialize Supabase
let supabase;
try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || envVars.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('⚠️  No Supabase credentials found. Please check your .env.local file.');
    process.exit(1);
  }

  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize Supabase client:', error.message);
  process.exit(1);
}

async function clearExistingContent(topicId, topicName) {
  try {
    console.log(`🧹 Clearing existing content for ${topicName}...`);
    
    const { error } = await supabase
      .from('grammar_content')
      .delete()
      .eq('topic_id', topicId)
      .in('content_type', ['practice', 'quiz']);
    
    if (error) {
      console.error(`❌ Error clearing content for ${topicName}:`, error.message);
      return false;
    }
    
    console.log(`✅ Cleared existing content for ${topicName}`);
    return true;
  } catch (error) {
    console.error(`❌ Error clearing ${topicName}:`, error.message);
    return false;
  }
}

async function uploadTopicContent(topic) {
  try {
    console.log(`\n📤 Processing ${topic.title}...`);
    
    // Clear existing content first
    const cleared = await clearExistingContent(topic.topic_id, topic.title);
    if (!cleared) {
      return { practice: false, test: false };
    }
    
    // Upload practice content
    console.log(`  📝 Uploading practice content (${topic.practice_questions.length} questions)...`);
    const practiceRecord = {
      topic_id: topic.topic_id,
      content_type: 'practice',
      title: `${topic.title} - Practice`,
      slug: `${topic.topic_name}-practice-${Date.now()}`,
      content_data: { questions: topic.practice_questions },
      difficulty_level: 'intermediate',
      age_group: '11-14',
      order_position: 1
    };
    
    const { error: practiceError } = await supabase
      .from('grammar_content')
      .insert([practiceRecord]);
    
    const practiceSuccess = !practiceError;
    if (practiceError) {
      console.error(`  ❌ Practice upload failed:`, practiceError.message);
    } else {
      console.log(`  ✅ Practice content uploaded successfully`);
    }
    
    // Upload test content
    console.log(`  🎯 Uploading test content (${topic.test_questions.length} questions)...`);
    const testRecord = {
      topic_id: topic.topic_id,
      content_type: 'quiz',
      title: `${topic.title} - Test`,
      slug: `${topic.topic_name}-test-${Date.now()}`,
      content_data: { questions: topic.test_questions },
      difficulty_level: 'intermediate',
      age_group: '11-14',
      order_position: 1
    };
    
    const { error: testError } = await supabase
      .from('grammar_content')
      .insert([testRecord]);
    
    const testSuccess = !testError;
    if (testError) {
      console.error(`  ❌ Test upload failed:`, testError.message);
    } else {
      console.log(`  ✅ Test content uploaded successfully`);
    }
    
    return { practice: practiceSuccess, test: testSuccess };
    
  } catch (error) {
    console.error(`❌ Error processing ${topic.title}:`, error.message);
    return { practice: false, test: false };
  }
}

async function main() {
  console.log('🚀 Starting upload of all adjective topics...');
  
  // Read the JSON file
  const fileContent = fs.readFileSync('adjectives-all-topics.json', 'utf8');
  const data = JSON.parse(fileContent);
  
  console.log(`📊 Found ${data.topics.length} topics to process`);
  
  const results = [];
  
  for (const topic of data.topics) {
    const result = await uploadTopicContent(topic);
    results.push({
      topic: topic.title,
      topic_name: topic.topic_name,
      practice: result.practice,
      test: result.test,
      practiceCount: topic.practice_questions.length,
      testCount: topic.test_questions.length
    });
    
    // Small delay between topics
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n📊 Upload Summary:');
  console.log('='.repeat(80));
  
  let totalSuccess = 0;
  let totalTopics = results.length * 2; // practice + test for each topic
  
  results.forEach(result => {
    const practiceStatus = result.practice ? '✅' : '❌';
    const testStatus = result.test ? '✅' : '❌';
    
    console.log(`${result.topic}:`);
    console.log(`  Practice: ${practiceStatus} (${result.practiceCount} questions)`);
    console.log(`  Test: ${testStatus} (${result.testCount} questions)`);
    
    if (result.practice) totalSuccess++;
    if (result.test) totalSuccess++;
  });
  
  console.log('='.repeat(80));
  console.log(`📈 Overall Success Rate: ${totalSuccess}/${totalTopics} (${Math.round(totalSuccess/totalTopics*100)}%)`);
  
  if (totalSuccess === totalTopics) {
    console.log('\n🎉 All content uploaded successfully!');
    console.log('\n🔗 Test the content at:');
    results.forEach(result => {
      if (result.practice && result.test) {
        console.log(`   ${result.topic}:`);
        console.log(`     Practice: http://localhost:3001/grammar/spanish/adjectives/${result.topic_name}/practice`);
        console.log(`     Test: http://localhost:3001/grammar/spanish/adjectives/${result.topic_name}/test`);
      }
    });
  } else {
    console.log('\n⚠️  Some uploads failed. Check the logs above for details.');
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
