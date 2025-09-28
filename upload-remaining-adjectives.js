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

// Additional topics data for the remaining ones
const additionalTopics = [
  {
    topic_id: "8c000ce9-eff3-44bd-93ef-bb04d80ba031",
    topic_name: "comparatives",
    title: "Spanish Comparatives",
    practice_questions: [
      {
        id: "comp_p1",
        question: "Choose the comparative form: María es _____ alta que Ana (more)",
        correct_answer: "más",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Use 'más' + adjective + 'que' for 'more than' comparisons.",
        difficulty: "beginner",
        type: "multiple_choice"
      },
      {
        id: "comp_p2",
        question: "Select the correct form: Este libro es _____ interesante que ese (less)",
        correct_answer: "menos",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Use 'menos' + adjective + 'que' for 'less than' comparisons.",
        difficulty: "beginner",
        type: "multiple_choice"
      },
      {
        id: "comp_p3",
        question: "Complete: Pedro es _____ alto _____ su hermano (as tall as)",
        correct_answer: "tan como",
        options: ["más que", "menos que", "tan como", "muy de"],
        explanation: "Use 'tan' + adjective + 'como' for equality comparisons.",
        difficulty: "beginner",
        type: "multiple_choice"
      },
      {
        id: "comp_p4",
        question: "Select: Mi hermana es _____ (older) que yo",
        correct_answer: "mayor",
        options: ["más vieja", "mayor", "más grande", "más alta"],
        explanation: "'Mayor' is the irregular comparative form for age (older).",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_p5",
        question: "Complete: Este problema es _____ (worse) que el anterior",
        correct_answer: "peor",
        options: ["más malo", "peor", "menos bueno", "más difícil"],
        explanation: "'Peor' is the irregular comparative form of 'malo' (worse).",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_p6",
        question: "Choose: La comida está _____ (better) hoy",
        correct_answer: "mejor",
        options: ["más buena", "mejor", "más rica", "buenísima"],
        explanation: "'Mejor' is the irregular comparative form of 'bueno' (better).",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_p7",
        question: "Select: Es el _____ (youngest) de la familia",
        correct_answer: "menor",
        options: ["más joven", "menor", "más pequeño", "más chico"],
        explanation: "'Menor' is used for the youngest in a family context.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_p8",
        question: "Complete: Esta película es _____ aburrida _____ la otra",
        correct_answer: "tan como",
        options: ["más que", "tan como", "menos que", "muy de"],
        explanation: "Use 'tan' + adjective + 'como' for equal comparisons.",
        difficulty: "beginner",
        type: "multiple_choice"
      },
      {
        id: "comp_p9",
        question: "Choose: Mi coche es _____ rápido que el tuyo",
        correct_answer: "menos",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Context suggests 'less fast than' - use 'menos'.",
        difficulty: "beginner",
        type: "multiple_choice"
      },
      {
        id: "comp_p10",
        question: "Complete: Es _____ difícil _____ pensaba",
        correct_answer: "más de lo que",
        options: ["más que", "más de lo que", "tan como", "menos que"],
        explanation: "Use 'más de lo que' when comparing with a clause.",
        difficulty: "advanced",
        type: "multiple_choice"
      }
    ],
    test_questions: [
      {
        id: "comp_t1",
        question: "Choose the correct comparative: Juan es _____ inteligente que Pedro",
        correct_answer: "más",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Use 'más' + adjective + 'que' for superiority comparisons.",
        difficulty: "beginner",
        type: "multiple_choice"
      },
      {
        id: "comp_t2",
        question: "Complete: Mi hermano es _____ (older) que mi hermana",
        correct_answer: "mayor",
        options: ["más viejo", "mayor", "más grande", "más alto"],
        explanation: "'Mayor' is the irregular comparative for age.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_t3",
        question: "Choose: Esta comida está _____ (worse) que ayer",
        correct_answer: "peor",
        options: ["más mala", "peor", "menos buena", "malísima"],
        explanation: "'Peor' is the irregular comparative of 'malo'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_t4",
        question: "Select: Ana es _____ alta _____ María",
        correct_answer: "tan como",
        options: ["más que", "tan como", "menos que", "muy de"],
        explanation: "Equal comparison uses 'tan' + adjective + 'como'.",
        difficulty: "beginner",
        type: "multiple_choice"
      },
      {
        id: "comp_t5",
        question: "Complete: Es el _____ (youngest) de los hermanos",
        correct_answer: "menor",
        options: ["más joven", "menor", "más pequeño", "más chico"],
        explanation: "'Menor' is used for youngest in family contexts.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_t6",
        question: "Choose: Este libro es _____ (better) que el otro",
        correct_answer: "mejor",
        options: ["más bueno", "mejor", "buenísimo", "más interesante"],
        explanation: "'Mejor' is the irregular comparative of 'bueno'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "comp_t7",
        question: "Select: Es _____ complicado _____ esperaba",
        correct_answer: "más de lo que",
        options: ["más que", "más de lo que", "tan como", "menos que"],
        explanation: "Use 'más de lo que' when comparing with a clause.",
        difficulty: "advanced",
        type: "multiple_choice"
      },
      {
        id: "comp_t8",
        question: "Choose: Mi trabajo es _____ estresante que el tuyo",
        correct_answer: "menos",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Use 'menos' + adjective + 'que' for inferiority comparisons.",
        difficulty: "beginner",
        type: "multiple_choice"
      }
    ]
  },
  {
    topic_id: "11751d70-f173-47fb-9721-a749766c9271",
    topic_name: "superlatives",
    title: "Spanish Superlatives",
    practice_questions: [
      {
        id: "super_p1",
        question: "Choose the superlative: Es la casa _____ bonita del barrio",
        correct_answer: "más",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Use 'la/el/los/las' + 'más' + adjective + 'de' for superlatives.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "super_p2",
        question: "Select: Son los estudiantes _____ inteligentes de la clase",
        correct_answer: "más",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Superlative form: 'los' + 'más' + adjective + 'de'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "super_p3",
        question: "Complete: Ella es la _____ alta de todas",
        correct_answer: "más",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Superlative: 'la más' + adjective + 'de todas'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "super_p4",
        question: "Choose: Es el _____ (best) restaurante de la ciudad",
        correct_answer: "mejor",
        options: ["más bueno", "mejor", "buenísimo", "más rico"],
        explanation: "'Mejor' is the superlative form of 'bueno'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "super_p5",
        question: "Select: Son las casas _____ caras del barrio",
        correct_answer: "más",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Superlative: 'las más' + adjective + 'del/de la/de los/de las'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      }
    ],
    test_questions: [
      {
        id: "super_t1",
        question: "Choose the superlative: Es la película _____ interesante del año",
        correct_answer: "más",
        options: ["más", "menos", "tan", "muy"],
        explanation: "Superlative structure: article + 'más' + adjective + 'de'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "super_t2",
        question: "Select: Es el _____ (worst) día del año",
        correct_answer: "peor",
        options: ["más malo", "peor", "malísimo", "menos bueno"],
        explanation: "'Peor' is the superlative form of 'malo'.",
        difficulty: "intermediate",
        type: "multiple_choice"
      },
      {
        id: "super_t3",
        question: "Complete: Son los _____ (youngest) de la familia",
        correct_answer: "menores",
        options: ["más jóvenes", "menores", "más pequeños", "más chicos"],
        explanation: "'Menores' is the superlative form for youngest in family contexts.",
        difficulty: "intermediate",
        type: "multiple_choice"
      }
    ]
  }
];

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
  console.log('🚀 Starting upload of remaining adjective topics...');
  
  // Read the JSON file and combine with additional topics
  const fileContent = fs.readFileSync('adjectives-remaining-topics.json', 'utf8');
  const data = JSON.parse(fileContent);
  
  const allTopics = [...data.topics, ...additionalTopics];
  
  console.log(`📊 Found ${allTopics.length} topics to process`);
  
  const results = [];
  
  for (const topic of allTopics) {
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
  } else {
    console.log('\n⚠️  Some uploads failed. Check the logs above for details.');
  }
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
