const fs = require('fs');

// Function to call your existing API endpoint for content generation
async function callGrammarAPI(slug, title, category, contentType) {
  const url = 'http://localhost:3000/api/grammar/generate-content';
  
  const payload = {
    slug,
    title,
    category,
    contentType, // 'practice' or 'quiz'
    exerciseCount: contentType === 'practice' ? 30 : 20
  };
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
      throw new Error(`API call failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error calling API for ${slug} (${contentType}):`, error.message);
    return null;
  }
}

// Function to extract unique topics from CSV
function extractTopicsFromCSV(csvPath) {
  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  const topics = new Set();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line) {
      const [slug, title, category] = line.split(',');
      if (slug && title && category) {
        topics.add(JSON.stringify({ slug, title, category }));
      }
    }
  }
  
  return Array.from(topics).map(t => JSON.parse(t));
}

// Main function to generate content using your API
async function generateContentViaAPI() {
  console.log('🚀 Starting content generation via LanguageGems API...');
  
  // Extract topics from CSV
  const topics = extractTopicsFromCSV('./spanish_grammar_content_COMPLETE.csv');
  console.log(`📊 Found ${topics.length} unique topics to process`);
  
  // For testing, start with first 3 topics
  const testTopics = topics.slice(0, 3);
  console.log(`🧪 Testing with: ${testTopics.map(t => t.title).join(', ')}`);
  
  let csvContent = "slug,title,category,practice_status,quiz_status,content_type,exercise_type,exercise_instructions,prompt_sentence,prompt_answer,prompt_explanation,prompt_options,question_text,question_correct_answer,question_options,question_explanation,question_difficulty\n";
  
  for (const topic of testTopics) {
    console.log(`\n🔄 Processing: ${topic.title} (${topic.category})`);
    
    // Generate practice content
    console.log('  📝 Generating practice exercises...');
    const practiceData = await callGrammarAPI(topic.slug, topic.title, topic.category, 'practice');
    
    if (practiceData && practiceData.exercises) {
      for (const exercise of practiceData.exercises) {
        const options = exercise.options ? exercise.options.join('|') : '';
        csvContent += `${topic.slug},${topic.title},${topic.category},COMPLETED,MISSING,practice,${exercise.type},"${exercise.instructions}","${exercise.prompt}","${exercise.answer}","${exercise.explanation}","${options}",,,,\n`;
      }
      console.log(`  ✅ Generated ${practiceData.exercises.length} practice exercises`);
    }
    
    // Generate quiz content
    console.log('  🧠 Generating quiz questions...');
    const quizData = await callGrammarAPI(topic.slug, topic.title, topic.category, 'quiz');
    
    if (quizData && quizData.questions) {
      for (const question of quizData.questions) {
        const options = question.options ? question.options.join('|') : '';
        csvContent += `${topic.slug},${topic.title},${topic.category},COMPLETED,COMPLETED,quiz,multiple_choice,,,,,,"${question.text}","${question.correctAnswer}","${options}","${question.explanation}",${question.difficulty}\n`;
      }
      console.log(`  ✅ Generated ${quizData.questions.length} quiz questions`);
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Write the generated content
  fs.writeFileSync('spanish_grammar_content_API_GENERATED.csv', csvContent);
  console.log('\n🎉 Content generation complete!');
  console.log('📁 Output: spanish_grammar_content_API_GENERATED.csv');
}

// Alternative: Create the API endpoint first
function createAPIEndpoint() {
  const apiCode = `
// API endpoint: /api/grammar/generate-content
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { slug, title, category, contentType, exerciseCount } = req.body;
  
  try {
    if (contentType === 'practice') {
      const exercises = await generatePracticeExercises(slug, title, category, exerciseCount);
      return res.json({ exercises });
    } else if (contentType === 'quiz') {
      const questions = await generateQuizQuestions(slug, title, category, exerciseCount);
      return res.json({ questions });
    }
    
    return res.status(400).json({ error: 'Invalid content type' });
  } catch (error) {
    console.error('Content generation error:', error);
    return res.status(500).json({ error: 'Content generation failed' });
  }
}

async function generatePracticeExercises(slug, title, category, count) {
  const prompt = \`Generate \${count} Spanish grammar practice exercises for "\${title}" in category "\${category}".
  
Return JSON array with structure:
[{
  "type": "fill_blank",
  "instructions": "Complete the sentence",
  "prompt": "La casa _____ (blanco)",
  "answer": "blanca", 
  "explanation": "Feminine singular adjective agreement",
  "options": ["blanco", "blanca", "blancos", "blancas"]
}]\`;

  const response = await openai.chat.completions.create({
    model: "gpt-5-nano-2025-08-07",
    messages: [{ role: "user", content: prompt }],
  });
  
  return JSON.parse(response.choices[0].message.content);
}

async function generateQuizQuestions(slug, title, category, count) {
  const prompt = \`Generate \${count} Spanish grammar quiz questions for "\${title}" in category "\${category}".
  
Return JSON array with structure:
[{
  "text": "What is the correct form of 'rojo' with 'casas'?",
  "correctAnswer": "rojas",
  "options": ["rojo", "roja", "rojos", "rojas"],
  "explanation": "Feminine plural agreement",
  "difficulty": "beginner"
}]\`;

  const response = await openai.chat.completions.create({
    model: "gpt-5-nano-2025-08-07",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7
  });
  
  return JSON.parse(response.choices[0].message.content);
}
`;

  fs.writeFileSync('src/pages/api/grammar/generate-content.js', apiCode);
  console.log('✅ Created API endpoint: src/pages/api/grammar/generate-content.js');
}

// Check if user wants to create API endpoint or run generator
const args = process.argv.slice(2);
if (args.includes('--create-api')) {
  createAPIEndpoint();
} else {
  generateContentViaAPI();
}
