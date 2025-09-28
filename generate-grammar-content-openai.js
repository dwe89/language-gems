const fs = require('fs');
const OpenAI = require('openai');
const path = require('path');

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

// Initialize OpenAI
let openai;
try {
  const envVars = loadEnvLocal();
  const apiKey = process.env.OPENAI_API_KEY ||
                 process.env.NEXT_PUBLIC_OPENAI_API_KEY ||
                 envVars.OPENAI_API_KEY ||
                 envVars.NEXT_PUBLIC_OPENAI_API_KEY;

  if (!apiKey) {
    console.log('⚠️  No OpenAI API key found. Please check your .env.local file.');
    process.exit(1);
  }

  openai = new OpenAI({
    apiKey: apiKey
  });
  console.log('✅ OpenAI client initialized successfully');
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error.message);
  process.exit(1);
}

// Exercise types and their descriptions
const exerciseTypes = {
  fill_blank: "Fill in the blank exercises where students complete sentences with the correct Spanish grammar",
  multiple_choice: "Multiple choice questions with 4 options where students select the correct Spanish grammar form",
  translation: "Translation exercises from English to Spanish focusing on the specific grammar topic",
  transformation: "Transform sentences by changing specific grammar elements (e.g., singular to plural)",
  substitution: "Replace parts of sentences with new elements while maintaining correct grammar"
};

// Function to generate practice content for a topic with retry logic
async function generatePracticeContent(slug, title, category, retries = 3) {
  const prompt = `Generate 30 Spanish grammar practice exercises for the topic "${title}" in the category "${category}".

REQUIREMENTS:
- Create exactly 30 exercises total
- Use these exercise types: fill_blank (10), multiple_choice (8), translation (4), transformation (4), substitution (4)
- All content must be authentic Spanish grammar suitable for KS3/GCSE level
- Focus specifically on "${title}" grammar rules
- Include clear explanations for each exercise
- For multiple_choice: provide 4 options separated by |
- Make exercises progressively challenging

Return ONLY a JSON array with this exact structure:
[
  {
    "exercise_type": "fill_blank",
    "exercise_instructions": "Complete the sentence with the correct form",
    "prompt_sentence": "La casa _____ (blanco)",
    "prompt_answer": "blanca",
    "prompt_explanation": "Feminine singular nouns take feminine singular adjectives",
    "prompt_options": ""
  },
  {
    "exercise_type": "multiple_choice", 
    "exercise_instructions": "Choose the correct form",
    "prompt_sentence": "Los gatos son _____",
    "prompt_answer": "negros",
    "prompt_explanation": "Masculine plural nouns take masculine plural adjectives",
    "prompt_options": "negro|negra|negros|negras"
  }
]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 25000
    });

    let content = response.choices[0].message.content.trim();
    console.log(`    📝 Raw response length: ${content.length} characters`);

    // Strip markdown code blocks if present
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Try to parse JSON, with better error handling
    try {
      const parsed = JSON.parse(content);
      console.log(`    ✅ Successfully parsed ${parsed.length} exercises`);
      return parsed;
    } catch (parseError) {
      console.error(`    ❌ JSON parse error for ${slug}:`, parseError.message);
      console.log(`    📄 Raw content: ${content.substring(0, 500)}...`);
      return null;
    }
  } catch (error) {
    console.error(`❌ API error for ${slug}:`, error.message);
    if (error.message.includes('rate limit')) {
      console.log('⏳ Rate limit hit, waiting 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }

    if (retries > 0) {
      console.log(`🔄 Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return generatePracticeContent(slug, title, category, retries - 1);
    }

    return null;
  }
}

// Function to generate quiz content for a topic with retry logic
async function generateQuizContent(slug, title, category, retries = 3) {
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
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 12000
    });

    let content = response.choices[0].message.content.trim();
    console.log(`    🧠 Raw response length: ${content.length} characters`);

    // Strip markdown code blocks if present
    if (content.startsWith('```json')) {
      content = content.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    } else if (content.startsWith('```')) {
      content = content.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    // Try to parse JSON, with better error handling
    try {
      const parsed = JSON.parse(content);
      console.log(`    ✅ Successfully parsed ${parsed.length} questions`);
      return parsed;
    } catch (parseError) {
      console.error(`    ❌ JSON parse error for ${slug}:`, parseError.message);
      console.log(`    📄 Raw content: ${content.substring(0, 500)}...`);
      return null;
    }
  } catch (error) {
    console.error(`❌ API error for ${slug}:`, error.message);
    if (error.message.includes('rate limit')) {
      console.log('⏳ Rate limit hit, waiting 60 seconds...');
      await new Promise(resolve => setTimeout(resolve, 60000));
    }

    if (retries > 0) {
      console.log(`🔄 Retrying... (${retries} attempts left)`);
      await new Promise(resolve => setTimeout(resolve, 5000));
      return generateQuizContent(slug, title, category, retries - 1);
    }

    return null;
  }
}

// Function to read CSV and extract unique topics
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

// Function to read existing CSV and parse it
function readExistingCSV(csvPath) {
  if (!fs.existsSync(csvPath)) {
    return { header: '', rows: [], processedTopics: new Set() };
  }

  const csvContent = fs.readFileSync(csvPath, 'utf8');
  const lines = csvContent.split('\n');
  const header = lines[0];
  const rows = lines.slice(1).filter(line => line.trim());

  // Track which topics need quiz content (have MISSING quiz status)
  const topicsNeedingQuiz = new Set();
  for (const row of rows) {
    const [slug, , , practiceStatus, quizStatus] = row.split(',');
    if (practiceStatus === 'COMPLETED' && quizStatus === 'MISSING') {
      topicsNeedingQuiz.add(slug);
    }
  }

  return { header, rows, topicsNeedingQuiz };
}

// Function to save progress to CSV
function saveProgressToCSV(csvPath, header, rows) {
  const csvContent = header + '\n' + rows.join('\n') + '\n';
  fs.writeFileSync(csvPath, csvContent);
  console.log(`💾 Progress saved to ${csvPath}`);
}

// Main function to generate all content
async function generateAllContent() {
  console.log('🚀 Starting OpenAI content generation...');

  const csvPath = './spanish_grammar_content_COMPLETE.csv';
  const backupPath = './spanish_grammar_content_BACKUP.csv';

  // Create backup of original file
  if (fs.existsSync(csvPath)) {
    fs.copyFileSync(csvPath, backupPath);
    console.log(`📋 Backup created: ${backupPath}`);
  }

  // Extract topics from CSV
  const topics = extractTopicsFromCSV(csvPath);
  console.log(`📊 Found ${topics.length} unique topics to process`);

  // Read existing CSV to understand current state
  const { header, rows, topicsNeedingQuiz } = readExistingCSV(csvPath);
  console.log(`📝 Topics needing quiz content: ${topicsNeedingQuiz.size} topics`);

  // Filter to only topics that need quiz content
  const remainingTopics = topics.filter(topic => topicsNeedingQuiz.has(topic.slug));
  console.log(`🔄 Topics to process: ${remainingTopics.length} topics`);

  if (remainingTopics.length === 0) {
    console.log('🎉 All topics already have quiz content!');
    return;
  }

  let currentRows = [...rows];
  let processedCount = 0;
  const saveInterval = 1; // Save progress after every topic (since we're only doing quiz content)
  const totalToProcess = remainingTopics.length;

  for (const topic of remainingTopics) {
    console.log(`\n🔄 Processing: ${topic.title} (${topic.category}) [${processedCount + 1}/${totalToProcess}]`);
    console.log('  📝 Practice content already exists, generating quiz questions only...');

    let newQuizRows = [];

    // Generate quiz content only (practice already exists)
    console.log('  🧠 Generating quiz questions...');
    const quizContent = await generateQuizContent(topic.slug, topic.title, topic.category);

    if (quizContent && quizContent.length > 0) {
      for (const question of quizContent) {
        const row = `${topic.slug},${topic.title},${topic.category},COMPLETED,COMPLETED,quiz,multiple_choice,,,,,,"${question.question_text}","${question.question_correct_answer}","${question.question_options}","${question.question_explanation}",${question.question_difficulty}`;
        newQuizRows.push(row);
      }
      console.log(`  ✅ Generated ${quizContent.length} quiz questions`);

      // Update existing rows to change quiz_status from MISSING to COMPLETED
      for (let i = 0; i < currentRows.length; i++) {
        const rowParts = currentRows[i].split(',');
        if (rowParts[0] === topic.slug && rowParts[4] === 'MISSING') {
          rowParts[4] = 'COMPLETED'; // Update quiz_status
          currentRows[i] = rowParts.join(',');
        }
      }

      // Add new quiz rows
      currentRows.push(...newQuizRows);
    } else {
      console.log('  ❌ Failed to generate quiz content');
    }

    processedCount++;

    console.log(`📈 Progress: ${processedCount}/${totalToProcess} topics completed`);

    // Save progress at regular intervals
    if (processedCount % saveInterval === 0 || processedCount === totalToProcess) {
      saveProgressToCSV(csvPath, header, currentRows);
      console.log(`💾 Saved progress after ${processedCount} topics`);
    }

    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Show estimated time remaining
    if (processedCount < totalToProcess) {
      const avgTimePerTopic = 10; // seconds (rough estimate)
      const remainingTime = (totalToProcess - processedCount) * avgTimePerTopic;
      const minutes = Math.floor(remainingTime / 60);
      const seconds = remainingTime % 60;
      console.log(`⏱️  Estimated time remaining: ${minutes}m ${seconds}s`);
    }
  }

  console.log('\n🎉 Content generation complete!');
  console.log(`📁 Updated file: ${csvPath}`);
  console.log(`📊 Total topics processed: ${processedCount}`);
  console.log(`📋 Backup available at: ${backupPath}`);
}

// Run the generator
generateAllContent().catch(error => {
  console.error('❌ Generation failed:', error);
  process.exit(1);
});
