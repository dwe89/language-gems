const fs = require('fs');
const OpenAI = require('openai');
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

// Initialize OpenAI
let openai;
try {
  const apiKey = process.env.OPENAI_API_KEY ||
                 process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
                 envVars.OPENAI_API_KEY ||
                 envVars.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    console.log('⚠️  No OpenAI API key found. Please check your .env.local file.');
    process.exit(1);
  }

  openai = new OpenAI({ apiKey: apiKey });
  console.log('✅ OpenAI client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error.message);
  process.exit(1);
}

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

// Function to generate quiz content for a topic
async function generateQuizContent(topicId, topicName, category, title) {
  const prompt = `Generate 20 Spanish grammar quiz questions for the topic "${title}" in the category "${category}".

REQUIREMENTS:
- Create exactly 20 multiple choice questions
- All questions must test understanding of "${title}" grammar rules
- Mix difficulty levels: 8 beginner, 8 intermediate, 4 advanced
- Each question has 4 options with only 1 correct answer
- Include clear explanations suitable for KS3/GCSE students
- Focus on authentic Spanish grammar usage

Return ONLY a JSON array with this exact structure:
[
  {
    "question_text": "What is the correct form of 'rojo' with 'casas'?",
    "question_correct_answer": "rojas",
    "question_options": "rojo|roja|rojos|rojas",
    "question_explanation": "Casas is feminine plural, so the adjective becomes rojas",
    "question_difficulty": "beginner"
  }
]`;

  try {
    console.log(`  🧠 Generating quiz questions for ${title}...`);
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 12000
    });

    let content = response.choices[0].message.content.trim();
    console.log(`    📝 Raw response length: ${content.length} characters`);

    // Strip markdown code blocks if present
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Try to parse JSON
    try {
      const parsed = JSON.parse(content);
      console.log(`    ✅ Successfully parsed ${parsed.length} questions`);
      return parsed;
    } catch (parseError) {
      console.error(`    ❌ JSON parse error for ${topicName}:`, parseError.message);
      console.log(`    📄 Raw content: ${content.substring(0, 500)}...`);
      return null;
    }
  } catch (error) {
    console.error(`❌ API error for ${topicName}:`, error.message);
    return null;
  }
}

// Function to save quiz content to database
async function saveQuizToDatabase(topicId, topicTitle, quizQuestions) {
  try {
    console.log(`  💾 Saving quiz with ${quizQuestions.length} questions to database...`);

    // Create the quiz content in the format expected by the NEW system
    const quizContent = {
      topic_id: topicId,
      content_type: 'quiz',
      title: `${topicTitle} - Quiz`,
      slug: `quiz-${topicId}-${Date.now()}`,
      content_data: {
        questions: quizQuestions.map((q, index) => ({
          id: `q${index + 1}`,
          question: q.question_text,
          correct_answer: q.question_correct_answer,
          options: q.question_options.split('|'),
          explanation: q.question_explanation,
          difficulty: q.question_difficulty,
          type: 'multiple_choice'
        }))
      },
      difficulty_level: 'intermediate', // Mixed difficulty questions
      age_group: '11-14',
      order_position: 1
    };

    const { data, error } = await supabase
      .from('grammar_content')
      .insert([quizContent]);

    if (error) {
      console.error(`    ❌ Database error:`, error.message);
      return false;
    }

    console.log(`    ✅ Successfully saved quiz with ${quizQuestions.length} questions to database`);
    return true;
  } catch (error) {
    console.error(`    ❌ Save error:`, error.message);
    return false;
  }
}

// Function to get topics that need quiz content
async function getTopicsNeedingQuiz() {
  try {
    console.log('📊 Fetching topics that need quiz content...');
    
    // Get all topics
    const { data: topics, error: topicsError } = await supabase
      .from('grammar_topics')
      .select('id, topic_name, slug, category, title')
      .eq('is_active', true)
      .order('category', { ascending: true })
      .order('topic_name', { ascending: true });

    if (topicsError) {
      console.error('❌ Error fetching topics:', topicsError.message);
      return [];
    }

    // Check which topics already have quiz content
    const topicsWithQuiz = new Set();
    for (const topic of topics) {
      const { data: existingQuiz, error: quizError } = await supabase
        .from('grammar_content')
        .select('id')
        .eq('topic_id', topic.id)
        .eq('content_type', 'quiz')
        .limit(1);

      if (!quizError && existingQuiz && existingQuiz.length > 0) {
        topicsWithQuiz.add(topic.id);
      }
    }

    const topicsNeedingQuiz = topics.filter(topic => !topicsWithQuiz.has(topic.id));
    
    console.log(`✅ Found ${topics.length} total topics`);
    console.log(`✅ ${topicsWithQuiz.size} topics already have quiz content`);
    console.log(`🔄 ${topicsNeedingQuiz.length} topics need quiz content`);
    
    return topicsNeedingQuiz;
  } catch (error) {
    console.error('❌ Error in getTopicsNeedingQuiz:', error.message);
    return [];
  }
}

// Main function
async function main() {
  console.log('🚀 Starting direct quiz generation...');
  
  const topicsNeedingQuiz = await getTopicsNeedingQuiz();
  
  if (topicsNeedingQuiz.length === 0) {
    console.log('🎉 All topics already have quiz content!');
    return;
  }

  console.log(`\n📋 Processing ${topicsNeedingQuiz.length} topics:`);
  topicsNeedingQuiz.forEach((topic, index) => {
    console.log(`  ${index + 1}. ${topic.title} (${topic.category})`);
  });

  let processedCount = 0;
  let successCount = 0;

  for (const topic of topicsNeedingQuiz) {
    console.log(`\n🔄 Processing [${processedCount + 1}/${topicsNeedingQuiz.length}]: ${topic.title} (${topic.category})`);
    
    // Generate quiz content
    const quizQuestions = await generateQuizContent(topic.id, topic.topic_name, topic.category, topic.title);
    
    if (quizQuestions && quizQuestions.length > 0) {
      // Save to database
      const saved = await saveQuizToDatabase(topic.id, topic.title, quizQuestions);
      if (saved) {
        successCount++;
        console.log(`  ✅ Topic completed successfully`);
      } else {
        console.log(`  ❌ Failed to save to database`);
      }
    } else {
      console.log(`  ❌ Failed to generate quiz content`);
    }
    
    processedCount++;
    console.log(`📈 Progress: ${processedCount}/${topicsNeedingQuiz.length} (${successCount} successful)`);

    // Add delay to avoid rate limiting
    if (processedCount < topicsNeedingQuiz.length) {
      console.log('⏳ Waiting 3 seconds...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log('\n🎉 Quiz generation complete!');
  console.log(`📊 Final results: ${successCount}/${processedCount} topics successful`);
}

// Run the script
main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
