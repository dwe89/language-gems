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

async function uploadContent(filename, contentType) {
  try {
    console.log(`\n📤 Uploading ${filename}...`);
    
    // Read the JSON file
    const fileContent = fs.readFileSync(filename, 'utf8');
    const data = JSON.parse(fileContent);
    
    // Prepare the database record
    const record = {
      topic_id: data.topic_id,
      content_type: contentType,
      title: data.title,
      slug: `${data.topic_id}-${contentType}-${Date.now()}`,
      content_data: { questions: data.questions },
      difficulty_level: data.difficulty_level,
      age_group: data.age_group,
      order_position: 1
    };
    
    // Insert into database
    const { data: result, error } = await supabase
      .from('grammar_content')
      .insert([record]);
    
    if (error) {
      console.error(`❌ Error uploading ${filename}:`, error.message);
      return false;
    }
    
    console.log(`✅ Successfully uploaded ${filename} with ${data.questions.length} questions`);
    return true;
  } catch (error) {
    console.error(`❌ Error processing ${filename}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting upload of Adjective Agreement content...');
  
  // Upload practice content
  const practiceSuccess = await uploadContent('adjectives-agreement-practice.json', 'practice');
  
  // Upload test content  
  const testSuccess = await uploadContent('adjectives-agreement-test.json', 'quiz');
  
  console.log('\n📊 Upload Summary:');
  console.log(`Practice: ${practiceSuccess ? '✅ Success' : '❌ Failed'}`);
  console.log(`Test: ${testSuccess ? '✅ Success' : '❌ Failed'}`);
  
  if (practiceSuccess && testSuccess) {
    console.log('\n🎉 All content uploaded successfully!');
    console.log('🔗 Test the content at:');
    console.log('   Practice: http://localhost:3001/grammar/spanish/adjectives/agreement/practice');
    console.log('   Test: http://localhost:3001/grammar/spanish/adjectives/agreement/test');
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
